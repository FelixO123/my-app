import React from "react";
import Link from "next/link";
import Image from "next/image";
import "../../styles/detalleBlog1.css"; // CSS normal, no usar "styles."

export default function Blog1() {
  return (
    <>
      {/* Encabezado */}
      <h1 className="encabezado1">BLOG 1</h1>

      {/* Sección del Blog */}
      <section className="seccion1">
        <h1 className="texto1">Nuevo Curso de Machine Learning</h1>

        <Image
          src="/detalleBlog1/curso.png"
          alt="Curso de Machine Learning"
          width={400}
          height={250}
          className="imagen1"
        />

        <p className="texto2">
          El 18 de septiembre se estrenara un nuevo curso para la plataforma,
          en esta oportunidad te entregamos todo el conocimiento sobre el Machine Learning y la IA.
          <br />
          <br />
          Este curso enseñara un poco de la historia de la IA, sus aplicaciones y como se esta utilizando en la actualidad, ademas de los conceptos basicos y avanzados de Machine Learning, para que puedas entender como funcionan los algoritmos y aplicarlos a traves de ejercicios en un sandbox que ofrecemos en la plataforma del curso.
          <br />
          <br />
          No te pierdas esta oportunidad unica de aprender sobre una de las tecnologias mas importantes de la actualidad y el futuro, inscríbete ya en nuestro nuevo curso de Machine Learning, es totalmente gratuito.
        </p>

        <Link href="/blogs">
          <button className="boton1">Volver</button>
        </Link>
      </section>
    </>
  );
}
