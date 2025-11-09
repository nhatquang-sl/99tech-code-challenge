import { PaginationDto } from '@application/common/dto';
import { dbContext, initializeDb, User } from '@database';
import { mediator } from '@qnn92/mediatorts';
import { GetUsersQuery } from '.';
import { UserDetailsDto } from '../shared/dto';
import USERS_DATA from './data.json';

describe('get users handler', () => {
  beforeAll(async () => {
    await dbContext.connect();
    await initializeDb();
    let count = 0;
    USERS_DATA.map((u) => u.lastName).forEach((email) => {
      if (email.includes('ea')) count++;
    });
    console.log(`Total .com emails: ${count}`);
    const users = USERS_DATA.map(
      (u) =>
        ({
          firstName: u.firstName,
          lastName: u.lastName,
          emailAddress: u.emailAddress,
          password: '123456x@X',
          salt: '12345678',
        } as User)
    );
    await User.bulkCreate(users);
  });

  test('should return correct data without filters', async () => {
    let query = new GetUsersQuery({ page: 1, pageSize: 10 });

    const result = await mediator.send<PaginationDto<UserDetailsDto>>(query);
    expect(result).toBeDefined();
    expect(result.items.length).toBe(10);
    expect(result.totalPages).toBe(11);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  test('should return correct data for first name', async () => {
    let query = new GetUsersQuery({ page: 1, pageSize: 10, firstName: 'an' });

    const result = await mediator.send<PaginationDto<UserDetailsDto>>(query);
    expect(result).toBeDefined();
    expect(result.items.length).toBe(8);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  test('should return correct data for last name', async () => {
    let query = new GetUsersQuery({ page: 1, pageSize: 5, lastName: 'ea' });

    const result = await mediator.send<PaginationDto<UserDetailsDto>>(query);
    expect(result).toBeDefined();
    expect(result.items.length).toBe(5);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(5);
  });

  test('should return correct data for email address', async () => {
    let query = new GetUsersQuery({ page: 1, pageSize: 10, emailAddress: '.com' });

    const result = await mediator.send<PaginationDto<UserDetailsDto>>(query);
    expect(result).toBeDefined();
    expect(result.items.length).toBe(10);
    expect(result.totalPages).toBe(7);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });
});
