import { User } from '@database';
import {
  ICommand,
  ICommandHandler,
  ICommandValidator,
  NotFoundError,
  RegisterHandler,
  RegisterValidator,
  UnprocessableEntityError,
} from '@qnn92/mediatorts';
import z from 'zod';
import { UserDetailsDto } from '../shared/dto';
import { UpdateUserCommandSchema } from './validator';

export class UpdateUserCommand implements ICommand {
  declare id: number;
  declare firstName: string;
  declare lastName: string;

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }
}

@RegisterHandler
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, UserDetailsDto>
{
  async handle(command: UpdateUserCommand): Promise<UserDetailsDto> {
    let entity = await User.findByPk(command.id);
    if (!entity) {
      throw new NotFoundError('User not found');
    }
    entity.firstName = command.firstName;
    entity.lastName = command.lastName;
    await entity.save();

    return new UserDetailsDto(entity);
  }
}

@RegisterValidator
export class UpdateUserCommandValidator implements ICommandValidator<UpdateUserCommand> {
  async validate(command: UpdateUserCommand): Promise<void> {
    try {
      UpdateUserCommandSchema.parse(command);
    } catch (e) {
      const eData: Record<string, string[]> = {};
      if (e instanceof z.ZodError) {
        for (const issue of e.issues) {
          var key = issue.path[0] as string;
          if (!eData[key]) eData[key] = [];
          eData[key].push(issue.message);
        }
      }
      throw new UnprocessableEntityError(eData);
    }
  }
}
