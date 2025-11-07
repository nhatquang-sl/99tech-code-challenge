import ENV from '@config';
import { dbContext, initializeDb } from '@database';
import express, { NextFunction, Request, Response } from 'express';

const app = express();

// built-in middleware for json
app.use(express.json());

const router = express.Router();
router.get('/health-check', (req, res) => {
  res.json(ENV);
});

// Middleware function for logging the request method and request URL
const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  console.log(`${request.method} url:: ${request.url}`);
  try {
    next();
  } catch (err) {
    console.log('------------------------------------');
  }
};

app.use(requestLogger);

app.use('/', router);

dbContext.connect().then(async () => {
  await initializeDb();
  app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
});

export default app;
