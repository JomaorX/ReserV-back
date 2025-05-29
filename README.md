# 🚀 ReserV Backend

<p align="center">
<img src="https://raw.githubusercontent.com/JomaorX/ReserV-front/refs/heads/main/public/reserV-LogoM%20-%20mediano.png" alt="ReserV logo">
</p>

---
Backend de la plataforma **ReserV**, una aplicación para gestionar reservas de peluquería online.

---

## 🛠 Tecnologías Usadas

- **Node.js**: Entorno de ejecución.
- **Express**: Framework para crear la API REST.
- **Sequelize**: ORM para interactuar con MySQL.
- **JWT**: Autenticación basada en tokens.
- **Nodemailer**: Envío de correos electrónicos.

---

## 📂 Estructura del Proyecto

El proyecto sigue una estructura modular para facilitar su mantenimiento:

ReserV-back/
├── config/
│   └── database.js          # Configuración de la conexión a la base de datos
├── middleware/
│   └── auth.js              # Middleware para verificar tokens JWT
├── models/
│   ├── Index.js             # Relaciones entre tablas
│   ├── Salon.js             # Modelo de salon
│   ├── User.js              # Modelo de usuario
│   ├── Reservation.js       # Modelo de reservas
│   ├── Employee.js          # Modelo de empleados
│   ├── Service.js           # Modelo de servicios
│   └── UnavailableDay.js    # Modelo de días no disponibles
├── routes/
│   ├── reservation.js       # Rutas relacionadas con reservas
│   └── admin.js             # Rutas para el panel de administración
├── utils/
│   └── email.js             # Funciones para enviar correos electrónicos
├── .env                     # Variables de entorno
├── server.js                # Archivo principal del servidor
└── package.json             # Dependencias y scripts del proyecto

---

## 🔧 Configuración del Entorno

1. Clona el repositorio:

git clone https://github.com/JomaorX/ReserV-back.git  
cd reserv-backend

2. Instala las dependencias:

npm install

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:

PORT=3000                        # Puerto en el que correrá el servidor
JWT_SECRET=tu_clave_secreta     # Clave para firmar y verificar tokens JWT
MYSQL_ADDON_HOST=tu_host_db
MYSQL_ADDON_DB=nombre_base_de_datos
MYSQL_ADDON_USER=usuario_db
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=contraseña_db
MYSQL_ADDON_URI=mysql://usuario:contraseña@host:puerto/base_de_datos
EMAIL_USER=tu_correo_app@gmail.com
EMAIL_PASSWORD=contraseña_app

4. Sincroniza la base de datos:

npx sequelize-cli db:migrate

5. Ejecuta el servidor:

npm run dev

---

## 👨‍💻 Cómo Trabajar en el Proyecto

🗃 Base de Datos:
- Usa MySQL como sistema gestor.
- Los modelos están definidos en /models y se sincronizan automáticamente al iniciar el servidor.

🔐 Autenticación:
- La autenticación se maneja con JWT.
- Al iniciar sesión se genera un token que debe enviarse en las rutas protegidas.

📬 Notificaciones por Correo:
- Se usa Nodemailer para enviar correos de confirmación tras crear una reserva.

🧪 Pruebas Locales:
- Asegúrate de tener MySQL instalado y en ejecución.
- Ejecuta el servidor y prueba funcionalidades como login y creación de reservas.

---

## 🚀 Despliegue

Frontend: Desplegar en Vercel  
Backend: Desplegar en Railway o Render  

---

## 💡 Notas Finales

Este backend está diseñado para ser escalable y minimalista.  
Si tienes dudas sobre algún archivo o carpeta, revisa los comentarios dentro del código.  

¡Listo para usar! 💈✂️
