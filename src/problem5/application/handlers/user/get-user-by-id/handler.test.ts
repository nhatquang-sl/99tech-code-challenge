import { dbContext, initializeDb, User } from '@database';
import { mediator, NotFoundError } from '@qnn92/mediatorts';
import { GetUserByIdQuery } from '.';
import { UserDetailsDto } from '../shared/dto';

const user = {
  emailAddress: 'email.valid@yopmail.com',
  firstName: 'email',
  lastName: 'valid',
  password: '123456x@X',
  salt: '12345678',
};

describe('get user by id handler', () => {
  beforeEach(async () => {
    await dbContext.connect();
    await initializeDb();

    await User.create({
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      salt: user.salt,
    } as User);
  });

  test('should return success', async () => {
    let query = new GetUserByIdQuery(1);

    const result = await mediator.send<UserDetailsDto>(query);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.emailAddress).toBe(user.emailAddress);
    expect(result.firstName).toBe(user.firstName);
    expect(result.lastName).toBe(user.lastName);
  });

  test('should return not found', async () => {
    let query = new GetUserByIdQuery(2);

    const rejects = expect(mediator.send(query)).rejects;
    await rejects.toThrow(NotFoundError);
    await rejects.toThrow(JSON.stringify({ message: 'User not found' }));
  });
});
