const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inverter_data', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    total_generated: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    total_running_time: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    today_generated: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    today_running_time: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    south_east_plant_voltage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    south_east_plant_current: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    south_west_plant_voltage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    south_west_plant_current: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    grid_connected_power: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    grid_connected_frequency: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    line1_voltage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    line2_voltage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    line3_voltage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    line1_current: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    line2_current: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    line3_current: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    dt: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'inverter_data',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
