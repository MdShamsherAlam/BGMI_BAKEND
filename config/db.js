


const Sequelize = require("sequelize");
const { createNamespace } = require("cls-hooked");

const cls = createNamespace("transaction-namespace"); // any string
Sequelize.useCLS(cls);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialectOptions: {
            multipleStatements: true,
            decimalNumbers: true
        },
        dialect: "mysql",
        timezone: "+05:30",
        host: process.env.DB_HOST,
        define: {
            //prevent sequelize from pluralizing table names
            freezeTableName: true,
        },
        logging: false
    },
    {
        pool: {
            max: 1000,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = sequelize;



// const Sequelize = require("sequelize");
// const { createNamespace } = require("cls-hooked");

// const cls = createNamespace("transaction-namespace"); // any string
// Sequelize.useCLS(cls);

// const sequelize = new Sequelize(
//     process.env.DB_NAME,    // Database name (from MYSQL_DATABASE in your compose file)
//     process.env.DB_USER,             // MySQL user (default is root)
//     process.env.DB_PASSWORD,                  // MySQL password (since MYSQL_ALLOW_EMPTY_PASSWORD is set)
//     {
//         dialectOptions: {
//             multipleStatements: true,
//             decimalNumbers: true
//         },
//         dialect: "mysql",
//         timezone: "+05:30",
//         host: 'mysql',   // Host is the name of the MySQL service in Docker Compose
//         define: {
//             freezeTableName: true,  // Prevents sequelize from pluralizing table names
//         },
//         logging: false
//     },
//     {
//         pool: {
//             max: 1000,
//             min: 0,
//             acquire: 30000,
//             idle: 10000,
//         },
//     }
// );

// module.exports = sequelize;
