import Jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        Jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
            if (err) return res.json({ Status: false, Error: 'Token Inválido' });

            req.id = decoded.id;
            req.rol = decoded.rol;
            req.email = decoded.email;
            next();
        });
    } else {
        return res.json({ Status: false, Error: 'Usuario no autenticado' });
    }
};

export { verifyUser };
