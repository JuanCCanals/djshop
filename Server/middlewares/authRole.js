// /Server/middlewares/authRole.js
export default function authRole(role){
    return (req, res, next)=>{
      if (req.user?.rol !== role) return res.sendStatus(403);
      next();
    };
  }
  