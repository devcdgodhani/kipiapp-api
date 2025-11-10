import { QueryInterface, DataTypes } from 'sequelize';
import { POSTGRE_SQL_MODEL, COMMON_STATUS } from '../../../../constants';

export async function up(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.createTable(
      POSTGRE_SQL_MODEL.SUB_CATEGORIES.TABLE_NAME,
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        en_title: { type: DataTypes.STRING(255), allowNull: true },
        category_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: POSTGRE_SQL_MODEL.CATEGORIES.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        store_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.STORES.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: COMMON_STATUS.ACTIVE,
          validate: { isIn: [Object.values(COMMON_STATUS)] },
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
    await queryInterface.dropTable(POSTGRE_SQL_MODEL.SUB_CATEGORIES.TABLE_NAME, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
