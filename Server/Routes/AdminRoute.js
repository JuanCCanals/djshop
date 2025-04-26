// file: AdminRoute
import express from 'express'
import con from '../config/db.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import multer from "multer"
import path from "path"
import { verifyUser } from '../middlewares/authMiddleware.js'; // Importar verifyUser

const router = express.Router()

router.post('/adminlogin', (req,res) => {
    const sql = "SELECT * FROM usuario WHERE correo = ?"
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "No leyó en BD" });
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if (err) return res.json({ loginStatus: false, Error: "Error, password incorrecto" });
                if (response) {
                    const email = result[0].correo;
                    const rol = result[0].rol_id;
                    const token = jwt.sign({ rol: (rol===1) ? "admin" : "cliente", email: email, id: result[0].id_usuario },
                                            "jwt_secret_key",{ expiresIn: "1d" }
                    );
                    
                    res.cookie('token', token)
                    return res.json({ loginStatus: true, token, user: {
                        id: result[0].id_usuario,
                        nombre: result[0].nombre,
                        email: result[0].email,
                        rol_id: result[0].rol_id}});
                }
            })
        } else {
            return res.json({ loginStatus: false, Error:"Error, email o password incorrecto" });
        }
    })
})

//////////////// Inicio Creación de nuevo usuario

// Clave secreta para JWT
const JWT_SECRET = "tu_secreto_super_seguro"; // Usa variables de entorno en producción

// 🟢 REGISTRAR UN NUEVO USUARIO
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const [userExists] = await con.promise().query(
      "SELECT * FROM usuario WHERE correo = ?",
      [email]
    );

    if (userExists.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario con rol "cliente" (ID 2 en la tabla roles)
    await con.promise().query(
      "INSERT INTO usuario (nombre, correo, password, rol_id) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, 2]
    );

    // Crear JWT Token
    const token = jwt.sign({ email, role: "cliente" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ success: true, token, message: "Usuario registrado con éxito." });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

//////////////// Fin creación de nuevo usuario


router.get('/dashboard', verifyUser, (req, res) => {
    return res.json({ message: "Bienvenido al Dashboard", user: { id: req.id, email: req.email, rol: req.rol } });
});

router.get('/', (req, res) => {
    res.send('Hello World! ');
});

// files upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})
// end image upload

router.post('/add_product', upload.fields([{ name: 'pista' },{ name: 'cancion' }]), (req, res) => {
    const sql = "INSERT INTO productos (`nombre`,`genero_id`,`artista`,`tipo`,`pista`,`cancion`,`duracion`,`precio`,`estado`) VALUES (?)"
    const values = [
        req.body.nombre,
        req.body.genero_id,
        req.body.artista,
        req.body.tipo,
        req.files['pista'][0].filename,
        req.files['cancion'][0].filename,
        req.body.duracion,
        req.body.precio,
        req.body.estado
    ]
    console.log('values: ', values)
    con.query(sql, [values], (err, result) => {
        if(err) return res.json({Status: false, Error: err})
        return res.json({Status: true})
        })
})

router.get('/productos', (req, res) => {
    const sql = "SELECT * from productos"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/generos', (req, res) => {
    const sql = "SELECT * from genero"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})


export {router as adminRouter}