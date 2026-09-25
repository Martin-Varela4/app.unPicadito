import React from "react";

const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="home-footer-content">

        <div className="home-footer-brand">
          <strong>UnPicadito</strong>
          <span>
            Conectate, armá tu equipo y disfrutá del fútbol.
          </span>
        </div>

        <div className="home-footer-links">
          <a href="/nosotros">Nosotros</a>
          <a href="/ayuda">Ayuda</a>
          <a href="/terminos">Términos</a>
          <a href="/privacidad">Privacidad</a>
        </div>

        <div className="home-footer-copy">
          © {new Date().getFullYear()} UnPicadito
        </div>

      </div>
    </footer>
  );
};

export default Footer;