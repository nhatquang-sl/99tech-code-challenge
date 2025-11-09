import { dbContext, initializeDb, User } from '@database';
import { mediator } from '@qnn92/mediatorts';
import { CreateUserCommand } from '.';
import { UserDetailsDto } from '../shared/dto';

const user = {
  emailAddress: 'email.valid@yopmail.com',
  firstName: 'email',
  lastName: 'valid',
  password: '123456x@X',
};

describe('create user handler', () => {
  beforeEach(async () => {
    await dbContext.connect();
    await initializeDb();
  });

  test('should return result success', async () => {
    let command = new CreateUserCommand(user);

    const result = await mediator.send<UserDetailsDto>(command);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.emailAddress).toBe(user.emailAddress);
    expect(result.firstName).toBe(user.firstName);
    expect(result.lastName).toBe(user.lastName);
  });

  test('should insert into database success', async () => {
    let command = new CreateUserCommand(user);

    const result = await mediator.send<UserDetailsDto>(command);
    const entity = await User.findByPk(result.id);

    expect(entity).toBeDefined();
    expect(entity?.emailAddress).toBe(user.emailAddress);
    expect(entity?.firstName).toBe(user.firstName);
    expect(entity?.lastName).toBe(user.lastName);
    expect(entity?.password).not.toBe(user.password);
    expect(entity?.salt.length).toBe(8);
  });
});
