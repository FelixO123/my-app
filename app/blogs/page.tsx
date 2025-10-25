"use client";

import "../../styles/blogs.css";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";

export default function Blogs() {
  return (
    <main>


      <h1 className="encabezado1">BLOGS</h1>

      {/* Sección 1 */}
      <section className="seccion1">
        <div>
          <h1 className="texto1">Nuevo Curso de Machine Learning</h1>
          <p className="texto1">
            El 18 de septiembre se estrenará un nuevo curso para la plataforma,
            en esta oportunidad te entregamos todo el conocimiento sobre el Machine Learning y la IA
          </p>
          <Link href="/detalleBlog1">
            <button className="boton1">Ver</button>
          </Link>
        </div>
        <div className="imagen1">
          <Image
            src="/images/blogs/curso.jpg"
            width={400}
            height={250}
            alt="Curso"
            className="imagenBlog"
          />
        </div>
      </section>

      {/* Sección 2 */}
      <section className="seccion2">
        <div>
          <h1 className="texto2">
            Conferencia exclusiva por nuestro canal de youtube: ¿Como Empezar
            Un Proyecto Informático Desde Cero?
          </h1>
          <p className="texto2">
            El 25 de septiembre se transmitirá una nueva charla por nuestro canal de youtube,
            se aconsejará en cómo abordar un proyecto Informático desde cero
          </p>
          <Link href="/detalleBlog2">
            <button className="boton2">Ver</button>
          </Link>

      </div>
        <div className="imagen2">
          <Image
            src="/images/blogs/conferencia.jpg"
            width={400}
            height={250}
            alt="Conferencia"
            className="imagenBlog"
          />
        </div>
    </section>

      {/* Footer */ }
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-left">
        <h3>Data Factory</h3>
        <p>Todos los derechos reservados &copy; 2024</p>
      </div>
      <div className="footer-right">
        <p>Contacto: info@datafactory.com</p>
      </div>
    </div>
  </footer>
    </main >
  );
}

//probando commit 25 octubre