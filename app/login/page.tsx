"use client";

import "../../styles/inicioSesion.css";
import { useState } from "react";
import Image from "next/image";
import { usuarioApi } from "../lib/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const usuario = await usuarioApi.buscarPorEmail(email);

      if (!usuario) {
        alert("El correo no está registrado");
        return;
      }

      if (usuario.password !== password) {
        alert("Contraseña incorrecta");
        return;
      }

      alert("Inicio de sesión exitoso");

      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
      window.location.href = "/";
    } catch (err: any) {
      alert("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <main>
      {/* Logo */}
      <Image
        src="/logo_empresa.jpg"
        width={150}
        height={150}
        alt="Logo"
        className="logo_empresa"
      />
      <h1 className="encabezado1">DATA FACTORY</h1>

      {/* Formulario */}
      <section
        className="section_registro_usuario mt-1"
        style={{
          backgroundColor: "#ffffffea",
          maxWidth: "800px",
          padding: "50px",
          borderRadius: "7px",
          width: "80%",
          margin: "0 auto 40px auto",
          color: "#000",
        }}
      >
        <h2 className="h2_registro_usuario">Inicio Sesión</h2>

        <form className="form_inicio_sesion" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="correo mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="form-text">Ingrese correo correctamente</div>
          </div>

          {/* Contraseña */}
          <div className="contraseña mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type={mostrarContrasena ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={mostrarContrasena}
                onChange={(e) => setMostrarContrasena(e.target.checked)}
              />
              <label className="form-check-label">Mostrar contraseña</label>
            </div>
          </div>

          {/* Botón */}
          <button type="submit" className="btn btn-primary mt-3">
            Iniciar Sesión
          </button>

          <p className="parrafo_registro_usuario mt-3">
            ¿No tienes una cuenta? <a href="/register">Regístrate</a>
          </p>
        </form>
      </section>
    </main>
  );
}
