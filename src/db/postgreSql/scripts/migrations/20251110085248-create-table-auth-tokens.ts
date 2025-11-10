import { QueryInterface, DataTypes } from 'sequelize';
import { POSTGRE_SQL_MODEL, TOKEN_TYPE } from '../../../../constants';

export async function up(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.createTable(
      POSTGRE_SQL_MODEL.AUTH_TOKENS.TABLE_NAME,
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        token: { type: DataTypes.STRING(500), allowNull: true },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: { isIn: [Object.values(TOKEN_TYPE)] },
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        expired_at: { type: DataTypes.BIGINT, allowNull: true },
        reference_token_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.AUTH_TOKENS.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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

        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
      },
      { transaction }
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function down(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable(POSTGRE_SQL_MODEL.AUTH_TOKENS.TABLE_NAME, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
