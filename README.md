# Gestor de Proyectos y Tareas

Una aplicación web fullstack para la **gestión de proyectos y tareas**, construida con el stack **MERN** (MongoDB, Express, React, Node.js).

## ✨ Características

- 🔐 **Autenticación completa de usuarios** (registro, login, JWT).
- 📁 **Gestión de proyectos**: crear, editar y eliminar proyectos propios.
- 🤝 **Colaboración**: invitar a otros usuarios a participar en tus proyectos.
- 🌍 **Proyectos públicos**: acceder a proyectos visibles para toda la comunidad.
- ✅ **Gestión de tareas**: crear tareas asociadas a proyectos, con título, descripción, prioridad (alta, media, baja), fecha de vencimiento, editar/eliminar y marcar como completadas.
- 🖼️ **Gestión de perfil de usuario**: actualizar foto, nombre y descripción personal.
- 📊 **Dashboard** con introducción al sistema y listado de los últimos proyectos creados.
- 📱 **Diseño responsive** adaptado a distintos dispositivos.

## 🛠️ Tecnologías Utilizadas

### Frontend
- React con Vite
- Context API (gestión de estado global)
- React Toastify (notificaciones)
- Axios (consumo de API)
- HTML5, CSS3

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (autenticación y seguridad)
- Joi (validaciones de datos)

## 🚀 Instalación y ejecución

### Requisitos previos
- **Node.js** (versión 14 o superior)
- **MongoDB** instalado y ejecutándose en local
- **npm** o **yarn**

## Instalación

1. Clonar el repositorio
```bash
git clone [https://github.com/JoaquinGuerreiro/gestor-proyectos]
```

2. Instalar dependencias del backend
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend
```bash
cd frontend
npm install
```

4. Configurar variables de entorno
   - Crear archivo `.env` en la carpeta backend:
```env
PORT=3333
MONGODB_URI=mongodb://localhost:27017/AH2023
```

## Ejecución

1. Iniciar el backend
```bash
cd backend
npm start
```

2. Iniciar el frontend
```bash
cd frontend
npm run dev
```

3. Iniciar la conexión en MongoDB con los datos apropiados
```env
MONGODB_URI=mongodb://localhost:27017/AH2023
```

## Contacto
- LinkedIn: www.linkedin.com/in/joaquin-guerreiro-apolonia
- Email: joaquinguerreiro12@gmail.com
- Portfolio: https://joaquin-guerreiro.vercel.app

## Licencia
Este proyecto está bajo la Licencia MIT 
