import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (isRegistering) {
      // Validaciones de registro
      if (email !== confirmEmail) {
        setError("Los correos no coinciden.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (!username.trim()) {
        setError("El nombre de usuario es obligatorio.");
        return;
      }

      // Enviar datos de registro
      try {
        const response = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();
        if (data.success) {
          setMensaje("Registro exitoso. Ahora inicia sesión.");
          setIsRegistering(false); // Volver al modo login
        } else {
          setError(data.error || "Error al registrarse.");
        }
      } catch (err) {
        setError("Error en el servidor.");
      }
    } else {
      // Enviar datos de login
      try {
        const response = await fetch("http://localhost:5000/auth/adminlogin", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data); // Verifica qué está enviando el backend
        if (data.loginStatus && data.token) {
          setMensaje("Login exitoso. Redirigiendo...");
          localStorage.setItem("token", data.token);  // Guarda el token
          localStorage.setItem("user", JSON.stringify(data.user)); // Guardar usuario en localStorage

          // Redirigir según el rol del usuario
          if (data.user.rol_id === 1) {  // 1 = Admin
            setTimeout(() => navigate("/dashboard"), 1500);
          } else { // Cliente u otro rol
            setTimeout(() => {
              navigate("/");
              window.location.reload();  // Recargar la página para que desaparezca el login
            }, 1500);
          }
          
        
        } else {
          setError(data.error || "Error al iniciar sesión.");
        }
      } catch (err) {
        setError("Error en el servidor.");
      }
    }
  };

  return (
    <div className="login-container">
        <div className="login-box">
            <form onSubmit={handleSubmit}>
              <h2>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>

              {/* Email */}
              <input 
                type="email" 
                placeholder="Correo" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />

              {/* Repetir correo (solo en registro) */}
              {isRegistering && (
                <input 
                  type="email" 
                  placeholder="Repetir Correo" 
                  value={confirmEmail} 
                  onChange={(e) => setConfirmEmail(e.target.value)} 
                  required 
                />
              )}

              {/* Usuario (solo en registro) */}
              {isRegistering && (
                <input 
                  type="text" 
                  placeholder="Nombre de usuario" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              )}

              {/* Contraseña */}
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />

              {/* Repetir contraseña (solo en registro) */}
              {isRegistering && (
                <input 
                  type="password" 
                  placeholder="Repetir Contraseña" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              )}

              {/* Botón de envío */}
              <button type="submit">{isRegistering ? "Registrarse" : "Iniciar sesión"}</button>

              {/* Mensajes de error y éxito */}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

              {/* Enlace para cambiar entre login y registro */}
              <p>
                {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}  
                <span 
                  className="toggle-link" 
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? " Iniciar sesión" : " Regístrate"}
                </span>
              </p>
            </form>
        </div>
    </div>
  );
};

export default Login;
