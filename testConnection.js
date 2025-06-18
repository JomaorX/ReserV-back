require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB,
  process.env.MYSQL_ADDON_USER,
  process.env.MYSQL_ADDON_PASSWORD,
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: "mysql",
    logging: console.log,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente.");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
})();
