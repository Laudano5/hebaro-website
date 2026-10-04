export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="wrap footer-bottom-top">
          <div className="footer-legal">
            <strong>HEBARO LLC</strong>
            <span>© 2026 Todos los derechos reservados</span>
          </div>

          <div className="footer-contact">
            <a href="mailto:info@hebaro.com">info@hebaro.com</a>
            <span>•</span>
            <a href="tel:+19393662981">(939) 366-2981</a>
            <span>•</span>
            <a href="/terminos">Términos y Condiciones</a>
          </div>
        </div>

        <div className="wrap footer-business">
          <p>Hecho en Puerto Rico por HEBARO LLC</p>
          <p>Veteran-Owned &amp; Disabled-Owned Business</p>
        </div>
      </div>
    </footer>
  );
}