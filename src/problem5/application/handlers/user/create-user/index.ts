import { User } from '@database';
import {
  ConflictError,
  ICommand,
  ICommandHandler,
  ICommandValidator,
  RegisterHandler,
  RegisterValidator,
  UnprocessableEntityError,
} from '@qnn92/mediatorts';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';
import { CreateUserCommandSchema } from './validator';

export class CreateUserCommand implements ICommand {
  declare firstName: string;
  declare lastName: string;
  declare emailAddress: string;
  declare password: string;

  constructor(data: any) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.emailAddress = data.emailAddress;
    this.password = data.password;
  }
}

export class CreateUserResult {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare emailAddress: string;

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.emailAddress = data.emailAddress;
  }
}

@RegisterHandler
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, CreateUserResult>
{
  async handle(command: CreateUserCommand): Promise<CreateUserResult> {
    // encrypt the password
    const salt = uuidv4().split('-')[0];
    const password = await bcrypt.hash(command.password + salt, 10);

    // Create and store the new user
    const result = await User.create({
      emailAddress: command.emailAddress,
      firstName: command.firstName,
      lastName: command.lastName,
      password,
      salt,
    } as User);

    return new CreateUserResult(result);
  }
}

@RegisterValidator
export class CreateUserCommandValidator implements ICommandValidator<CreateUserCommand> {
  async validate(command: CreateUserCommand): Promise<void> {
    try {
      CreateUserCommandSchema.parse(command);
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

    // Check for duplicate usernames in the db
    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    const duplicate = await User.findOne({
      where: { emailAddress: command.emailAddress },
      attributes: ['id'],
    });

    if (duplicate) throw new ConflictError('Duplicated email address');
  }
}
