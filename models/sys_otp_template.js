const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_otp_template', {
    template_type: {
      type: DataTypes.STRING(150),
      allowNull: false,
      primaryKey: true
    },
    template_message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    template_message_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    template_email_subject: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dlt: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sys_otp_template',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "template_type" },
        ]
      },
    ]
  });
};
