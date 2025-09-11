// main.js
// Expects:
//   - window.RES (with RES.internationalQualifications, RES.links)
//   - window.TEMPLATES (with TEMPLATES.localList and headings/resources mappings)
//   - window.buildTemplate({ slug, subId, periodText }) from templates.js

(function () {
  const qSelect      = document.getElementById('qualification');
  const intlWrap     = document.getElementById('intlWrap');
  const subSelect    = document.getElementById('subQualification');
  const periodInput  = document.getElementById('periodText');
  const resetBtn     = document.getElementById('resetBtn');
  const buildBtn     = document.getElementById('buildBtn');
  const copyBtn      = document.getElementById('copyBtn');
  const htmlOut      = document.getElementById('htmlOutput');
  const iframe       = document.getElementById('previewFrame');

  // Ensure the button reads "Generate code"
  if (buildBtn) buildBtn.textContent = 'Generate code';

  // ----- Build the main qualification selector from TEMPLATES so slugs never drift -----
  function populateMainQualificationSelector() {
    if (!window.TEMPLATES || !Array.isArray(window.TEMPLATES.localList)) return;

    // Clear existing options
    qSelect.innerHTML = '';

    // Add all non-international options first
    const locals = window.TEMPLATES.localList.filter(i => i.slug !== 'international');
    locals.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.slug;
      opt.textContent = item.name;
      qSelect.appendChild(opt);
    });

    // Separator + "International"
    const intl = window.TEMPLATES.localList.find(i => i.slug === 'international');
    if (intl) {
      const group = document.createElement('optgroup');
      group.label = '—';
      const opt = document.createElement('option');
      opt.value = intl.slug;       // "international"
      opt.textContent = intl.name; // "International (Pick sub-qualification…)"
      group.appendChild(opt);
      qSelect.appendChild(group);
    }
  }

  // ----- Populate international sub-qualifications from RES -----
  function loadInternationalOptions() {
    // Expecting RES.internationalQualifications: [{id, name}, ...]
    if (!window.RES || !Array.isArray(RES.internationalQualifications)) {
      console.warn('International list not found: ensure resources.js defines window.RES.internationalQualifications');
      subSelect.innerHTML = '';
      const def = document.createElement('option');
      def.value = '';
      def.textContent = 'International list not loaded';
      subSelect.appendChild(def);
      subSelect.disabled = true;
      return;
    }

    subSelect.innerHTML = '';
    const def = document.createElement('option');
    def.value = '';
    def.textContent = 'Select a sub-qualification…';
    subSelect.appendChild(def);

    RES.internationalQualifications.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      subSelect.appendChild(opt);
    });
  }

  // ----- Enable/disable the intl section based on main selection -----
  function syncInternationalState() {
    const isIntl = qSelect.value === 'international';
    subSelect.disabled = !isIntl;
    intlWrap.setAttribute('aria-disabled', String(!isIntl));
    if (!isIntl) subSelect.value = '';
  }

  // ----- Render into iframe for an isolated preview -----
  function writePreview(html) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body{margin:0;background:#f1f5f9;font-family:Arial, sans-serif}
            .wrap{max-width:880px; margin:20px auto; padding:10px}
            .note{font:12px/1.4 Arial, sans-serif;color:#64748b;margin:8px 0 12px}
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="note">Live preview (scaled to page styles)</div>
            ${html}
          </div>
        </body>
      </html>
    `);
    doc.close();
  }

  // ----- Build outputs (HTML + preview) -----
  function build() {
    const slug = qSelect.value;            // e.g. "polySingapore" | "nusHigh" | "aLevel" | "ibLocal" | "transfer" | "international"
    const subId = subSelect.value || null; // international sub-qual id
    const periodText = (periodInput.value || '').trim();

    try {
      if (typeof window.buildTemplate !== 'function') {
        throw new Error('templates.js not loaded or window.buildTemplate missing');
      }
      const html = window.buildTemplate({ slug, subId, periodText });
      htmlOut.value = html;
      writePreview(html);
    } catch (e) {
      console.error(e);
      htmlOut.value = `<!-- Error building template: ${e && e.message ? e.message : e} -->`;
      writePreview('<p style="padding:16px;color:#b00020;">Error building template. Select International qualification.</p>');
    }
  }

  // ----- Copy to clipboard -----
  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(htmlOut.value);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    } catch (e) {
      htmlOut.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    }
  }

  // ----- Reset -----
  function resetAll() {
    // Default to the first non-international in TEMPLATES, or fallback to polySingapore
    const firstLocal = (window.TEMPLATES && Array.isArray(window.TEMPLATES.localList))
      ? window.TEMPLATES.localList.find(i => i.slug !== 'international')
      : null;

    qSelect.value = firstLocal ? firstLocal.slug : 'polySingapore';
    periodInput.value = '';
    subSelect.value = '';
    syncInternationalState();
    build();
  }

  // ----- Events -----
  qSelect.addEventListener('change', () => {
    syncInternationalState();
    build();
  });
  subSelect.addEventListener('change', build);
  periodInput.addEventListener('input', build);
  resetBtn.addEventListener('click', resetAll);
  buildBtn.addEventListener('click', build);
  copyBtn.addEventListener('click', copyHtml);

  // ----- Init -----
  populateMainQualificationSelector(); // ensures IB Local shows and slugs match
  loadInternationalOptions();          // fills international sub-quals
  resetAll();                          // initial render
})();

