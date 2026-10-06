export default function SiteFooter({ businessIdentity = "Service-Disabled Veteran-Owned Small Business (SDVOSB)" }: { businessIdentity?: string }) {
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
            <a href="tel:+19399388323">(939) 938-8323</a>
            <span>•</span>
            <a href="/terminos">Términos y Condiciones</a>
            <span>•</span>
            <a href="/privacidad">Política de Privacidad</a>
          </div>
        </div>

        <div className="wrap footer-business">
          <p>Hecho en Puerto Rico por HEBARO LLC</p>
          <p>{businessIdentity}</p>
        </div>
      </div>
    </footer>
  );
}
