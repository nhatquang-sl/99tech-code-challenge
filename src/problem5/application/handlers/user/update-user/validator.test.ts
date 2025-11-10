import { mediator, UnprocessableEntityError } from '@qnn92/mediatorts';
import { UpdateUserCommand } from '.';

const user = {
  firstName: 'firtName',
  lastName: 'lastName',
};

describe('update user validator', () => {
  test('should throw unprocessable entity error when id missing', async () => {
    let command = new UpdateUserCommand(user);

    const rejects = expect(mediator.send(command)).rejects;
    await rejects.toThrow(UnprocessableEntityError);
    await rejects.toThrow(JSON.stringify({ id: ['Invalid user ID.'] }));
  });

  test('should throw unprocessable entity error when id negative', async () => {
    let command = new UpdateUserCommand(user);
    command.id = -1;

    const rejects = expect(mediator.send(command)).rejects;
    await rejects.toThrow(UnprocessableEntityError);
    await rejects.toThrow(JSON.stringify({ id: ['Invalid user ID.'] }));
  });

  test('should throw unprocessable entity error when first name missing', async () => {
    let command = new UpdateUserCommand({ ...user, id: 1 });
    command.firstName = '';

    const rejects = expect(mediator.send(command)).rejects;
    await rejects.toThrow(UnprocessableEntityError);
    await rejects.toThrow(JSON.stringify({ firstName: ['First name is required.'] }));
  });
});
