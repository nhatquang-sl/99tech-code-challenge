// import { PaginationDto } from '@application/shared/dto';
import { User } from '@database';
import { ICommand, ICommandHandler, NotFoundError, RegisterHandler } from '@qnn92/mediatorts';
import { UserDetailsDto } from '../shared/dto';

export class GetUserByIdQuery implements ICommand {
  declare id: number;

  constructor(id: number) {
    this.id = id;
  }
}

@RegisterHandler
export class GetUserByIdQueryHandler implements ICommandHandler<GetUserByIdQuery, UserDetailsDto> {
  async handle(query: GetUserByIdQuery): Promise<UserDetailsDto> {
    const { id } = query;

    const user = await User.findByPk(id, {
      attributes: ['id', 'firstName', 'lastName', 'emailAddress'], // Only select specific columns
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return new UserDetailsDto(user);
  }
}
