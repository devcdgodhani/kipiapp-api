import { QueryInterface, DataTypes } from 'sequelize';
import { POSTGRE_SQL_MODEL, PRODUCT_LOT_TYPE } from '../../../../constants';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'amount', {
      type: DataTypes.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'vendor_id', {
      type: DataTypes.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'type', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(PRODUCT_LOT_TYPE)],
      },
    });

    await queryInterface.addColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'parent_lot_id', {
      type: DataTypes.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'date', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'amount');
    await queryInterface.removeColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'vendor_id');
    await queryInterface.removeColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'type');
    await queryInterface.removeColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'parent_lot_id');
    await queryInterface.removeColumn(POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME, 'date');
  },
};
