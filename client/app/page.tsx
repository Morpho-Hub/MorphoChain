export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section section--hero">
        <div className="container hero">
          <div>
            <div className="badge" aria-label="Plataforma de Finanzas Regenerativas">
              <span>Plataforma de Finanzas Regenerativas</span>
            </div>
            <h1 className="hero__title" style={{ marginTop: 12 }}>
              Tokenizando el Futuro Regenerativo de Costa Rica
            </h1>
            <p className="hero__lead">
              Conectamos agricultores con inversionistas conscientes mediante la tokenización
              agrícola. Construye riqueza mientras restauras el planeta, una cosecha a la vez.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#oportunidades">Comenzar a Invertir</a>
              <a className="btn btn--ghost" href="#conoce">Conoce Más</a>
            </div>
            <div className="hero__stats">
              <div className="stat">
                <strong>250+</strong>
                Agricultores
              </div>
              <div className="stat">
                <strong>$2.4M</strong>
                Financiado
              </div>
              <div className="stat">
                <strong>1.2K</strong>
                Hectáreas
              </div>
            </div>
          </div>
          <div className="hero__media">
            <div className="media-card">
              <img
                src="https://images.unsplash.com/photo-1518736114810-3f3bed8f7620?q=80&w=1600&auto=format&fit=crop"
                alt="Operación agrícola"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Para Agricultores */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 8 }}>Para Agricultores</h2>
          <p className="muted" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            Accede a capital, rastrea la sostenibilidad y construye relaciones transparentes con
            inversionistas conscientes.
          </p>

          <div className="section--cards" />
          <div className="card-grid">
            <div className="card">
              <h3>Tokeniza tus Activos</h3>
              <p>
                Convierte tus activos agrícolas en tokens digitales y accede a financiamiento
                global sin las barreras de los préstamos tradicionales.
              </p>
            </div>
            <div className="card">
              <h3>Rastrea Métricas de Impacto</h3>
              <p>
                Monitorea automáticamente la salud del suelo, secuestro de carbono e índices de
                vegetación para comprobar prácticas regenerativas.
              </p>
            </div>
            <div className="card">
              <h3>Confianza y Transparencia</h3>
              <p>
                Credenciales verificadas por blockchain muestran tus prácticas sostenibles y
                construyen credibilidad con compradores e inversionistas premium.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <a className="btn btn--primary" href="#panel-agricultor">
              Explorar Panel de Agricultor
            </a>
          </div>
        </div>
      </section>

      {/* Para Inversores */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 8 }}>Para Inversores</h2>
          <p className="muted" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            Invierte en agricultura regenerativa verificada con total transparencia e impacto
            medible.
          </p>

          <div className="hero" style={{ marginTop: 20 }}>
            <div className="hero__media">
              <div className="media-card">
                <img
                  src="https://images.unsplash.com/photo-1558222217-1f24f3be3f0b?q=80&w=1600&auto=format&fit=crop"
                  alt="Cultivo regenerativo"
                />
              </div>
            </div>
            <div>
              <div className="card" style={{ marginBottom: 12 }}>
                <strong>Diversifica con Activos Reales</strong>
                <p className="muted" style={{ marginTop: 4 }}>
                  Accede a propiedad fraccionada de operaciones agrícolas desde $100.
                </p>
              </div>
              <div className="card" style={{ marginBottom: 12 }}>
                <strong>Métricas de Impacto Verificadas</strong>
                <p className="muted" style={{ marginTop: 4 }}>
                  Rastrea datos de sostenibilidad en tiempo real: salud del suelo, captura de
                  carbono e índices de biodiversidad.
                </p>
              </div>
              <div className="card">
                <strong>Conexión Directa con Agricultores</strong>
                <p className="muted" style={{ marginTop: 4 }}>
                  Conoce a dónde va tu dinero. Visita proyectos y observa el impacto de primera
                  mano.
                </p>
              </div>
              <div className="cta-row" style={{ marginTop: 16 }}>
                <a className="btn btn--primary" href="#oportunidades">
                  Ver Oportunidades de Inversión
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 8 }}>Impacto de Sostenibilidad</h2>
          <p className="muted" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            Cada token representa prácticas regenerativas verificadas e impacto ambiental medible.
          </p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <strong>85%</strong>
              <div className="muted">Mejora en Salud del Suelo</div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <strong>12K</strong>
              <div className="muted">Toneladas CO₂ Secuestradas</div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <strong>+42%</strong>
              <div className="muted">Aumento en Biodiversidad</div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <strong>68%</strong>
              <div className="muted">Conservación de Agua</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Dark */}
      <section className="section section--dark">
        <div className="container cta-dark">
          <h2>¿Listo para Unirte a la Revolución de Finanzas Regenerativas?</h2>
          <p>
            Ya seas agricultor buscando capital o inversor en busca de impacto, MorphoChain te
            conecta con el futuro agrícola sostenible de Costa Rica.
          </p>
          <div className="cta-row">
            <a className="btn btn--primary" href="/comenzar">Comienza Hoy</a>
            <a className="btn btn--ghost" href="#conoce">Conoce Más</a>
          </div>
        </div>
      </section>
    </>
  );
}

