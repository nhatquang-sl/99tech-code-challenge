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

const CreateUserCommandObj = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required.' }),
  lastName: z.string().trim().optional(),
  emailAddress: z
    .email()
    .trim()
    .max(255, { message: 'Email has reached a maximum of 255 characters.' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .regex(/[a-z]/g, { message: "Password must have at least one lowercase ('a'-'z')." })
    .regex(/[A-Z]/g, { message: "Password must have at least one uppercase ('A'-'Z')." })
    .regex(/[0-9]/g, { message: 'Password must contain at least one number.' })
    .regex(/[!@#$%^&*()_+=\[{\]};:<>|./?,-]/g, {
      message: 'Password must have at least one non alphanumeric character.',
    })
    .max(50, { message: 'Password has reached a maximum of 50 characters.' }),
});

@RegisterValidator
export class CreateUserCommandValidator implements ICommandValidator<CreateUserCommand> {
  async validate(command: CreateUserCommand): Promise<void> {
    try {
      CreateUserCommandObj.parse(command);
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
