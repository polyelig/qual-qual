// Assumes resources.js exposes window.RES with shared links
// and templates.js exposes window.buildTemplate({ slug, subId, periodText })

(function(){
  const qSelect = document.getElementById('qualification');
  const intlWrap = document.getElementById('intlWrap');
  const subSelect = document.getElementById('subQualification');
  const periodInput = document.getElementById('periodText');
  const resetBtn = document.getElementById('resetBtn');
  const buildBtn = document.getElementById('buildBtn');
  const copyBtn  = document.getElementById('copyBtn');
  const htmlOut  = document.getElementById('htmlOutput');
  const iframe   = document.getElementById('previewFrame');

  // --- populate international sub-qualifications ---
  function loadInternationalOptions(){
    // Expecting RES.internationalQualifications: [{id, name}, ...]
    if (!window.RES || !Array.isArray(RES.internationalQualifications)) return;
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

  // --- enable/disable the intl section based on main selection ---
  function syncInternationalState(){
    const isIntl = qSelect.value === 'international';
    subSelect.disabled = !isIntl;
    intlWrap.setAttribute('aria-disabled', String(!isIntl));
    // If leaving international, clear selection to avoid stale state
    if (!isIntl) subSelect.value = '';
  }

  // --- build outputs (HTML + preview) ---
  function build(){
    const slug = qSelect.value;               // 'polySingapore' | 'nusHigh' | 'aLevelLocal' | 'transfer' | 'international'
    const subId = subSelect.value || null;    // international sub-qual id
    const periodText = (periodInput.value || '').trim();

    try {
      const html = window.buildTemplate({ slug, subId, periodText });
      htmlOut.value = html;
      writePreview(html);
    } catch (e) {
      console.error(e);
      htmlOut.value = `<!-- Error building template: ${e?.message || e} -->`;
      writePreview('<p style="padding:16px;color:#b00020;">Error building template. See console.</p>');
    }
  }

  // Render into iframe for an isolated preview
  function writePreview(html){
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    // minimal wrapper to show the 800px content centered
    doc.write(`
      <!doctype html>
      <html><head>
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
      </body></html>
    `);
    doc.close();
  }

  // --- copy to clipboard ---
  async function copyHtml(){
    try{
      await navigator.clipboard.writeText(htmlOut.value);
      copyBtn.textContent = 'Copied!';
      setTimeout(()=> copyBtn.textContent = 'Copy', 1200);
    }catch(e){
      // Fallback: select text
      htmlOut.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      setTimeout(()=> copyBtn.textContent = 'Copy', 1200);
    }
  }

  // --- reset ---
  function resetAll(){
    qSelect.value = 'polySingapore'; // default
    periodInput.value = '';
    subSelect.value = '';
    syncInternationalState();
    // Build initial output
    build();
  }

  // --- events ---
  qSelect.addEventListener('change', ()=>{
    syncInternationalState();
    build();
  });
  subSelect.addEventListener('change', build);
  periodInput.addEventListener('input', build);
  resetBtn.addEventListener('click', resetAll);
  buildBtn.addEventListener('click', build);
  copyBtn.addEventListener('click', copyHtml);

  // init
  loadInternationalOptions();
  resetAll();
})();
