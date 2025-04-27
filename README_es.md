# DJShop 🎵

Aplicación de Tienda Digital de Pistas Musicales.

---

## 📂 Estructura del Proyecto

- **/frontend** → Aplicación React Vite (Interfaz de Usuario).
- **/Server** → API Backend con Node.js + Express + MySQL.

---

## 🚀 Tecnologías Utilizadas

- Frontend:
  - React
  - Vite
  - React Router DOM

- Backend:
  - Node.js
  - Express
  - MySQL
  - Multer (para manejo de archivos)
  - Otros middlewares necesarios

---

## ⚙️ Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanCCanals/djshop.git
cd djshop
```

### 2. Configurar el Backend

```bash
cd Server
npm install
# Crear y configurar el archivo `.env` con las variables de entorno necesarias
npm start
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Variables de Entorno

En la carpeta `/Server` crear un archivo `.env` con contenido como:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=djshop
PORT=5000
```

*(Ajustar según tu configuración local.)*

---

## 🎯 Funcionalidades Principales

- Registro y gestión de pistas musicales.
- Descarga de audios/videos.
- Página de contacto funcional.
- Gestión de usuarios (admin, roles).
- Sistema de pagos (a integrar más adelante).

---

## 📸 Screenshots

(Agregar capturas de pantalla aquí más adelante si deseas.)

---

## 👨‍💻 Autor

**Juan C. Canals**  
[GitHub Profile](https://github.com/JuanCCanals)