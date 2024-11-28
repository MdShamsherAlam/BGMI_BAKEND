var DataTypes = require("sequelize").DataTypes;
var _casbin_rule = require("./casbin_rule");
var _sys_dropdown_list = require("./sys_dropdown_list");
var _sys_otp_template = require("./sys_otp_template");
var _sys_tables = require("./sys_tables");

function initModels(sequelize) {
  var casbin_rule = _casbin_rule(sequelize, DataTypes);
  var sys_dropdown_list = _sys_dropdown_list(sequelize, DataTypes);
  var sys_otp_template = _sys_otp_template(sequelize, DataTypes);
  var sys_tables = _sys_tables(sequelize, DataTypes);


  return {
    casbin_rule,
    sys_dropdown_list,
    sys_otp_template,
    sys_tables,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
