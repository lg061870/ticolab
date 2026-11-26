/**
 * TicoAddressWidget - Embeddable Web Component for Costa Rican Landmark Addressing
 * Usage (api-url: the API's base URL; the API's CORS_ORIGINS must include the embedding site):
 *   <script src="https://ticolab.systematicalabs.com/widget.js" async></script>
 *   <tico-address-widget api-url="https://<api-host>"></tico-address-widget>
 */
class TicoAddressWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const apiUrl = this.getAttribute('api-url') || window.location.origin;
    const lang = this.getAttribute('lang') || 'es';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          max-width: 440px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          color: #0f172a;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #047857;
        }
        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        input {
          flex: 1;
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
        }
        button {
          background: #047857;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: #065f46;
        }
        .result-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          line-height: 1.4;
          margin-top: 8px;
        }
        .badge {
          display: inline-block;
          font-size: 11px;
          background: #d1fae5;
          color: #065f46;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          margin-bottom: 6px;
        }
      </style>
      <div>
        <div class="header">
          <span>🇨🇷</span> <span>Tico Address Converter</span>
        </div>
        <div class="input-row">
          <input type="text" id="coordsInput" placeholder="Latitude, Longitude (e.g. 9.92885, -84.10919)" value="9.92885, -84.10919" />
          <button id="convertBtn">Convert</button>
        </div>
        <div id="output" class="result-box">
          <span class="badge">Dirección a la Tica</span>
          <div id="addressText">Click Convert to calculate address...</div>
        </div>
      </div>
    `;

    const convertBtn = this.shadowRoot.getElementById('convertBtn');
    const coordsInput = this.shadowRoot.getElementById('coordsInput');
    const addressText = this.shadowRoot.getElementById('addressText');

    convertBtn.addEventListener('click', async () => {
      const parts = coordsInput.value.split(',').map(s => parseFloat(s.trim()));
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
        alert('Invalid coordinates. Format: lat, lon');
        return;
      }

      addressText.innerText = 'Calculating...';
      try {
        const res = await fetch(`${apiUrl}/api/v1/reverse-geocode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // debug 'full' asks for the full response shape (status + address); the default 'compact' shape has
          // neither. include_driving false: the driving comparison calls a public demo server.
          body: JSON.stringify({ latitude: parts[0], longitude: parts[1], debug: 'full', include_driving: false })
        });
        const data = await res.json();
        const text = data.address?.standard_tico_es || data.standard_tico_es;
        if (res.ok && text) {
          addressText.innerText = text;
        } else {
          addressText.innerText = data.message || 'Error converting address.';
        }
      } catch (err) {
        addressText.innerText = 'Network error: ' + err.message;
      }
    });
  }
}

customElements.define('tico-address-widget', TicoAddressWidget);
