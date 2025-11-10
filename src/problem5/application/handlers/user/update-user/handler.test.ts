import { dbContext, initializeDb, User } from '@database';
import { mediator } from '@qnn92/mediatorts';
import { UpdateUserCommand } from '.';
import { UserDetailsDto } from '../shared/dto';

const editedUser = {
  id: 1,
  firstName: 'firtEdited',
  lastName: 'lastEdited',
};

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

  test('should return result success', async () => {
    let command = new UpdateUserCommand(editedUser);

    const result = await mediator.send<UserDetailsDto>(command);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.emailAddress).toBe('email.valid@yopmail.com');
    expect(result.firstName).toBe(editedUser.firstName);
    expect(result.lastName).toBe(editedUser.lastName);
  });

  test('should update database success', async () => {
    let command = new UpdateUserCommand(editedUser);

    const result = await mediator.send<UserDetailsDto>(command);
    const entity = await User.findByPk(result.id);

    expect(entity).toBeDefined();
    expect(entity?.id).toBe(1);
    expect(entity?.emailAddress).toBe('email.valid@yopmail.com');
    expect(entity?.firstName).toBe(editedUser.firstName);
    expect(entity?.lastName).toBe(editedUser.lastName);
    expect(entity?.password).toBe('123456x@X');
    expect(entity?.salt).toBe('12345678');
  });
});
