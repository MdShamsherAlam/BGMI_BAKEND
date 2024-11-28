const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_tables', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    service_type: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    section_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    sub_section_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    table_name: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    multi_table: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Active','Inactive'),
      allowNull: false,
      defaultValue: "Active"
    },
    created_by: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    view_query: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sys_tables',
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
