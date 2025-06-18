# 📦 Gestión de Base de Datos en Sequelize

Este archivo describe cómo administrar migraciones en Sequelize para mantener la estructura de la base de datos sincronizada y sin errores.

---

## 🔧 Configuración Básica
- Archivo de configuración: `database.js`
- Incluye pool de conexiones para mejor rendimiento

## 🛠 Comandos Principales

### Migraciones
```bash
# Crear nueva migración
```bash
npx sequelize-cli migration:generate --name nombre_migracion

# Ejecutar migraciones
```bash
npx sequelize-cli db:migrate

# Revertir última migración
```bash
npx sequelize-cli db:migrate:undo

# Revertir todas las migraciones
```bash
npx sequelize-cli db:migrate:undo:all

# Ver estado de migraciones
```bash
npx sequelize-cli db:migrate:status