# DJShop 🎵

Digital Music Track Store Application.

---

## 📂 Project Structure

- **/frontend** → React Vite Application (User Interface).
- **/Server** → Node.js + Express + MySQL API Backend.

---

## 🚀 Technologies Used

- Frontend:
  - React
  - Vite
  - React Router DOM

- Backend:
  - Node.js
  - Express
  - MySQL
  - Multer (for file handling)
  - Other necessary middlewares

---

## ⚙️ Installation and Execution

### 1. Clone the Repository

```bash
git clone https://github.com/JuanCCanals/djshop.git
cd djshop
```

### 2. Setup Backend

```bash
cd Server
npm install
# Create and configure the `.env` file with necessary environment variables
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Environment Variables

In the `/Server` folder create a `.env` file with content like:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=djshop
PORT=5000
```

*(Adjust according to your local settings.)*

---

## 🎯 Main Features

- Registration and management of music tracks.
- Download of audio/video files.
- Functional contact page.
- User management (admin, roles).
- Payment system (to be integrated later).

---

## 📸 Screenshots

(Add screenshots here later if desired.)

---

## 👨‍💻 Author

**Juan C. Canals**  
[GitHub Profile](https://github.com/JuanCCanals)