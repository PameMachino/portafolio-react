import './App.css'
import Tetris from './components/Tetris'

function App() {
  return (
    <>
      <header>
        <nav className="navbar">
          <h1 className="logo">JC</h1>
          <ul className="menu">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#sobre">Sobre mí</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#habilidades">Habilidades</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero">
          <h2>Hola, soy Jose Caniumil</h2>
          <p>Desarrollador web enfocado en crear experiencias modernas y funcionales.</p>
          <a className="btn" href="#proyectos">Ver proyectos</a>
        </section>

        <section id="sobre" className="sobre-mi">
          <h2>Sobre mí</h2>
          <p>
            Soy estudiante y desarrollador web en formación, enfocado en construir
            interfaces modernas, responsivas y funcionales. Me interesa el desarrollo
            frontend y la mejora continua en tecnologías como React y JavaScript.
          </p>
        </section>

        <section id="proyectos" className="proyectos">
          <h2>Proyectos</h2>

          <div className="cards">
            <article className="card">
              <h3>Proyecto A</h3>
              <p>Sitio web moderno con enfoque en diseño limpio y responsive.</p>
              <div className="card-links">
                <a href="#">GitHub</a>
                <a href="#">Demo</a>
              </div>
            </article>

            <article className="card">
              <h3>Proyecto B</h3>
              <p>Landing page profesional orientada a presentación de servicios.</p>
              <div className="card-links">
                <a href="#">GitHub</a>
                <a href="#">Demo</a>
              </div>
            </article>

            <article className="card">
              <h3>Proyecto C</h3>
              <p>Portafolio personal desarrollado para mostrar trabajos y habilidades.</p>
              <div className="card-links">
                <a href="#">GitHub</a>
                <a href="#">Demo</a>
              </div>
            </article>
          </div>
        </section>

        <section id="habilidades" className="habilidades">
          <h2>Habilidades</h2>
          <div className="skills">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>React</span>
            <span>GitHub</span>
          </div>
        </section>

        <section id="contacto" className="contacto">
          <h2>Contacto</h2>
          <p>Puedes escribirme para colaborar en proyectos web.</p>
          <a className="btn" href="mailto:tucorreo@ejemplo.com">Enviar correo</a>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Jose Caniumil | Portafolio personal</p>
      </footer>
    </>
  )
}

export default App