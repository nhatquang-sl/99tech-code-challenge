import ENV from '@config';
import { Sequelize } from 'sequelize';
import tedious from 'tedious';

class DbContext {
  sequelize: Sequelize;

  constructor() {
    // Option 3: Passing parameters separately (other dialects)
    if (process.env.NODE_ENV === 'test')
      // Use options form with dialect and storage instead of a sqlite URL string.
      // Passing the URL 'sqlite::memory:' triggers Node URL parsing deprecation
      // (DEP0170). Using { dialect: 'sqlite', storage: ':memory:' } avoids that.
      this.sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
    else
      this.sequelize = new Sequelize(ENV.DB_NAME, ENV.DB_USERNAME, ENV.DB_PASSWORD, {
        host: ENV.DB_HOST,
        dialect: 'mssql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
        dialectModule: tedious,
        // query: { raw: true },
        logging: false,
      });
  }

  /**
   * Connects to database
   */
  async connect() {
    try {
      await this.sequelize.authenticate();
    } catch (e: any) {
      console.log('Occured error when connecting to database. Error:', e.message);
    }
  }
}

const dbContext = new DbContext();

export default dbContext;
