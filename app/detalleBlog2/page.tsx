import React from "react";
import Link from "next/link";
import Image from "next/image";
import "../../styles/detalleBlog2.css"; // CSS normal, no usar "styles."

export default function Blog2() {
  return (
    <>
      {/* Encabezado */}
      <h1 className="encabezado1">BLOG 2</h1>

      {/* Sección del Blog */}
      <section className="seccion1">
        <h1 className="texto1">Conferencia exclusiva por nuestro canal de youtube: ¿Como Empezar Un Proyecto Informático Desde Cero?</h1>

        <Image
          src="/detalleBlog2/conferencia.png"
          alt="Conferencia exclusiva por nuestro canal de youtube: ¿Como Empezar Un Proyecto Informático Desde Cero?"
          width={400}
          height={250}
          className="imagen1"
        />

        <p className="texto2">
          El 25 de septiembre se transmitira una nueva charla por nuestro canal de youtube , se aconsejara en como abordar un proyecto Informático desde cero. 
          Esta conferencia puede ser tu oportunidad para despejar todas tus dudas y comenzar a crear tu propio proyecto. Si eres una pyme o un emprendedor esta charla es para ti. Asistir es totalmente gratis, no te la pierdas.
        </p>

        <Link href="/blogs">
          <button className="boton1">Volver</button>
        </Link>
      </section>
    </>
  );
}
