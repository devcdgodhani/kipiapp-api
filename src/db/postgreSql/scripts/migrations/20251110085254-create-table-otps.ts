import { QueryInterface, DataTypes } from 'sequelize';
import { POSTGRE_SQL_MODEL, OTP_TYPE } from '../../../../constants';

export async function up(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.createTable(
      POSTGRE_SQL_MODEL.OTPS.TABLE_NAME,
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        code: { type: DataTypes.STRING(50), allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true, validate: { isIn: [Object.values(OTP_TYPE)] } },
        generate_tokens: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, defaultValue: [] },
        user_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        expired_at: { type: DataTypes.BIGINT, allowNull: true },
        max_uses: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
        uses_count: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },

        created_by: { type: DataTypes.UUID, allowNull: true, references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
        updated_by: { type: DataTypes.UUID, allowNull: true, references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
        deleted_by: { type: DataTypes.UUID, allowNull: true, references: { model: POSTGRE_SQL_MODEL.USERS.TABLE_NAME, key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },

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
    await queryInterface.dropTable(POSTGRE_SQL_MODEL.OTPS.TABLE_NAME, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
