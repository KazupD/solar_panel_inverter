var DataTypes = require("sequelize").DataTypes;
var _inverter_data = require("./inverter_data");

function initModels(sequelize) {
  var inverter_data = _inverter_data(sequelize, DataTypes);


  return {
    inverter_data,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
