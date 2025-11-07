import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare emailAddress: string;
  declare password: string;
  declare salt: string;
  declare firstName: string;
  declare lastName: string;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    emailAddress: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING(8), allowNull: false },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, // allowNull defaults to true
    },
    lastName: {
      type: DataTypes.STRING,
    },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
  }
);

// // the defined model is the class itself
// console.log(User === sequelize.models.User); // true
export default User;
