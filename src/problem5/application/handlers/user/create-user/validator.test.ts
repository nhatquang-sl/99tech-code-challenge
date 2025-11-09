import { dbContext, initializeDb, User } from '@database';
import { ConflictError, mediator, UnprocessableEntityError } from '@qnn92/mediatorts';
import { CreateUserCommand } from '.';

const user = {
  emailAddress: 'email.valid@yopmail.com',
  firstName: 'email',
  lastName: 'valid',
  password: '123456x@X',
};

describe('create user validator', () => {
  beforeAll(async () => {
    await dbContext.connect();
    await initializeDb();

    const salt = 'salt';
    const { emailAddress, firstName, lastName, password } = user;

    await User.create({
      emailAddress,
      firstName,
      lastName,
      password,
      salt,
    } as User);
  });

  test('should throw unprocessable entity error when email address missing', async () => {
    let command = new CreateUserCommand(user);
    command.emailAddress = '';

    const rejects = expect(mediator.send(command)).rejects;
    await rejects.toThrow(UnprocessableEntityError);
    await rejects.toThrow(JSON.stringify({ emailAddress: ['Invalid email address'] }));
  });

  test('should throw unprocessable entity error when password missing', async () => {
    let command = new CreateUserCommand(user);
    command.password = '';

    const rejects = expect(mediator.send(command)).rejects;
    await rejects.toThrow(UnprocessableEntityError);
    await rejects.toThrow(
      JSON.stringify({
        password: [
          'Password must be at least 6 characters.',
          "Password must have at least one lowercase ('a'-'z').",
          "Password must have at least one uppercase ('A'-'Z').",
          'Password must contain at least one number.',
          'Password must have at least one non alphanumeric character.',
        ],
      })
    );
  });

  test('should throw conflict error when duplicated email address', async () => {
    let command = new CreateUserCommand(user);

    const rejects = expect(mediator.send(command)).rejects;
    await rejects.toThrow(ConflictError);
    await rejects.toThrow(JSON.stringify({ message: 'Duplicated email addres' }));
  });
});
