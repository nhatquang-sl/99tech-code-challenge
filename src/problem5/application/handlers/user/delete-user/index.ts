import { User } from '@database';
import { ICommand, ICommandHandler, RegisterHandler } from '@qnn92/mediatorts';

export class DeleteUserCommand implements ICommand {
  declare id: number;

  constructor(id: number) {
    this.id = id;
  }
}

@RegisterHandler
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand, number> {
  async handle(command: DeleteUserCommand): Promise<number> {
    return await User.destroy({ where: { id: command.id } });
  }
}
