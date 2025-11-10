// import { PaginationDto } from '@application/shared/dto';
import { PaginationDto } from '@application/common/dto';
import { User } from '@database';
import { ICommand, ICommandHandler, RegisterHandler } from '@qnn92/mediatorts';
import { Op } from 'sequelize';
import { UserDetailsDto } from '../shared/dto';

export class GetUsersQuery implements ICommand {
  declare firstName: string;
  declare lastName: string;
  declare emailAddress: string;
  declare page: number;
  declare pageSize: number;

  constructor(data: any) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.emailAddress = data.emailAddress;
    this.page = data.page ?? 1;
    this.pageSize = data.pageSize ?? 10;
  }
}

@RegisterHandler
export class GetUsersQueryHandler
  implements ICommandHandler<GetUsersQuery, PaginationDto<UserDetailsDto>>
{
  async handle(command: GetUsersQuery): Promise<PaginationDto<UserDetailsDto>> {
    const where: any = this.buildWhereClause(command);
    const { page, pageSize } = command;

    const { rows, count } = await User.findAndCountAll({
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      attributes: ['id', 'firstName', 'lastName', 'emailAddress'], // Only select specific columns
      order: [['id', 'ASC']],
    });

    return new PaginationDto<UserDetailsDto>(
      rows.map((user) => new UserDetailsDto(user)),
      Math.ceil(count / pageSize),
      page,
      pageSize
    );
  }

  private buildWhereClause(command: GetUsersQuery): any {
    const where: any = {};
    const { firstName, lastName, emailAddress } = command;
    if (emailAddress) {
      where.emailAddress = { [Op.like]: `%${emailAddress}%` };
    }
    if (firstName) {
      where.firstName = { [Op.like]: `%${firstName}%` };
    }
    if (lastName) {
      where.lastName = { [Op.like]: `%${lastName}%` };
    }
    return where;
  }
}
