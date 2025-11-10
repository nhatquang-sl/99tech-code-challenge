import { CreateUserCommand } from '@application/handlers/user/create-user';
import { DeleteUserCommand } from '@application/handlers/user/delete-user';
import { GetUserByIdQuery } from '@application/handlers/user/get-user-by-id';
import { GetUsersQuery } from '@application/handlers/user/get-users';
import { UserDetailsDto } from '@application/handlers/user/shared/dto';
import { UpdateUserCommand } from '@application/handlers/user/update-user';
import { mediator } from '@qnn92/mediatorts';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', async (request: Request, response: Response) => {
  const res = await mediator.send<UserDetailsDto>(new CreateUserCommand(request.body));
  response.json(res);
});

router.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  const res = await mediator.send<UserDetailsDto>(new GetUserByIdQuery(Number(id)));
  response.json(res);
});

router.get('', async (request: Request<{}, {}, {}, GetUsersQuery>, response: Response) => {
  const res = await mediator.send<UserDetailsDto>(new GetUsersQuery(request.query));
  response.json(res);
});

router.put('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  const res = await mediator.send<UserDetailsDto>(
    new UpdateUserCommand({ id: Number(id), ...request.body })
  );
  response.json(res);
});

router.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  await mediator.send(new DeleteUserCommand(Number(id)));
  response.status(204).send();
});

export default router;
