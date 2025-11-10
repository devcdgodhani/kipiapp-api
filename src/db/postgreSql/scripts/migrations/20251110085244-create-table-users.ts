import { QueryInterface, DataTypes } from 'sequelize';
import { POSTGRE_SQL_MODEL, SIGN_UP_TYPE, USER_STATUS } from '../../../../constants';

export async function up(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.createTable(
      POSTGRE_SQL_MODEL.USERS.TABLE_NAME,
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: true,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        mobile: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        country_code: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sign_up_type: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: SIGN_UP_TYPE.APP,
        },
        is_email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_mobile_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: USER_STATUS.ACTIVE,
        },

        created_by: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        updated_by: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        deleted_by: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable(POSTGRE_SQL_MODEL.USERS.TABLE_NAME, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
