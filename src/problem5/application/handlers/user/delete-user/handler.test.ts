import { dbContext, initializeDb, User } from '@database';
import { mediator } from '@qnn92/mediatorts';
import { DeleteUserCommand } from '.';

describe('create user handler', () => {
  beforeEach(async () => {
    await dbContext.connect();
    await initializeDb();

    await User.create({
      emailAddress: 'email.valid@yopmail.com',
      firstName: 'firstName',
      lastName: 'lastName',
      password: '123456x@X',
      salt: '12345678',
    } as User);
  });

  test('should return 1 when delete success', async () => {
    let command = new DeleteUserCommand(1);

    const result = await mediator.send<number>(command);
    expect(result).toBe(1);
  });

  test('should return 0 without delete', async () => {
    let command = new DeleteUserCommand(2);

    const result = await mediator.send<number>(command);
    expect(result).toBe(0);
  });
});
