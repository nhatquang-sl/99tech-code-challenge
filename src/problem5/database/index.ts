import User from '@database/entities/user';
import dbContext from './db-context';

const initializeDb = async () => {
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  // await UserRole.drop();
  // await UserForgotPassword.drop();
  await dbContext.sequelize.sync({ force: true });
  // await UserRole.sync({ force: true });
};
export { dbContext, initializeDb, User };
