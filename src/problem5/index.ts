import { PerformanceBehavior, RequestLoggingBehavior } from '@application/common/behaviors';
import ENV from '@config';
import userRoute from '@controllers/user';
import { dbContext, initializeDb } from '@database';
import {
  BadRequestError,
  ConflictError,
  mediator,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@qnn92/mediatorts';
import express, { NextFunction, Request, Response } from 'express';

mediator.addPipelineBehavior(new RequestLoggingBehavior());
mediator.addPipelineBehavior(new PerformanceBehavior());
const app = express();

// built-in middleware for json
app.use(express.json());

const router = express.Router();
router.get('/health-check', (req, res) => {
  res.json(ENV);
});

app.use('/', router);
app.use('/user', userRoute);

// https://medium.com/@utkuu/error-handling-in-express-js-and-express-async-errors-package-639c91ba3aa2
const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
  const { message } = error;
  const data = JSON.parse(message);

  const errorStatusMap = new Map<any, number>([
    [BadRequestError, 400],
    [UnauthorizedError, 401],
    [NotFoundError, 404],
    [ConflictError, 409],
    [UnprocessableEntityError, 422],
  ]);

  for (const [ErrorClass, status] of errorStatusMap) {
    if (error instanceof ErrorClass) {
      return response.status(status).json(data);
    }
  }

  return response.sendStatus(500);
};
app.use(errorLogger);

dbContext.connect().then(async () => {
  await initializeDb();
  app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
});

export default app;
