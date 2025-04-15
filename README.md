# 🚀 ReserV Backend

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

├── config/               # Configuración de la base de datos  
│   └── database.js       # Conexión a MySQL usando Sequelize  
├── models/               # Modelos de la base de datos  
│   ├── User.js           # Modelo de usuario  
│   └── Reservation.js    # Modelo de reservas  
├── routes/               # Rutas de la API  
│   └── reservation.js    # Endpoints relacionados con reservas  
├── middleware/           # Middleware personalizado  
│   └── auth.js           # Validación de tokens JWT  
├── utils/                # Funciones auxiliares  
│   └── email.js          # Configuración de Nodemailer  
├── .env                  # Variables de entorno  
└── server.js             # Archivo principal del servidor  

---

## 🔧 Configuración del Entorno

1. Clona el repositorio:

git clone https://github.com/JomaorX/ReserV-back.git  
cd reserv-backend

2. Instala las dependencias:

npm install

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:

PORT=3000  
JWT_SECRET=tu_clave_secreta  
DB_HOST=localhost  
DB_USER=tu_usuario  
DB_PASSWORD=tu_contraseña  
DB_NAME=reserv_db  
EMAIL_USER=tu_correo@gmail.com  
EMAIL_PASSWORD=tu_contraseña_o_app_password

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
