const { Sequelize } = require("sequelize");

// Configuración de la conexión a la base de datos con control de conexiones
const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB,
  process.env.MYSQL_ADDON_USER,
  process.env.MYSQL_ADDON_PASSWORD,
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: parseInt(process.env.MYSQL_ADDON_PORT),
    dialect: "mysql",
    pool: {
      max: 5, // Máximo de conexiones simultáneas permitidas por Clever Cloud
      min: 0, // Número mínimo de conexiones
      acquire: 30000, // Tiempo máximo en milisegundos para obtener una conexión
      idle: 10000, // Tiempo antes de cerrar una conexión inactiva
    },
  }
);

// Verificar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
})();

module.exports = sequelize;
