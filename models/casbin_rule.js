const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('casbin_rule', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ptype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v0: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v5: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'casbin_rule',
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
