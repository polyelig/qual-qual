// main.js
// Expects window.RES (with RES.internationalQualifications)
// Expects window.TEMPLATES (with localList, etc.)
// Expects window.buildTemplate({ slug, subId, periodText })

(function () {
  const qSelect      = document.getElementById('qualification');
  const intlWrap     = document.getElementById('intlWrap');
  const subSelect    = document.getElementById('subQualification');
  const periodInput  = document.getElementById('periodText');
  const resetBtn     = document.getElementById('resetBtn');
  const buildBtn     = document.getElementById('buildBtn');
  const copyBtn      = document.getElementById('copyBtn');
  const toggleEdit   = document.getElementById('toggleEditBtn');
  const htmlOut      = document.getElementById('htmlOutput');
  const iframe       = document.getElementById('previewFrame');

  // Ensure button text
  if (buildBtn) buildBtn.textContent = 'Generate code';

  let isEditing = false;   // preview edit mode
  let isDirty   = false;   // user changed preview
  let inputHandlerAttached = false;
  let previewInputHandler = null;

  // ---------- Build the main qualification selector from TEMPLATES ----------
  function populateMainQualificationSelector() {
    if (!window.TEMPLATES || !Array.isArray(window.TEMPLATES.localList)) return;
    qSelect.innerHTML = '';

    const locals = window.TEMPLATES.localList.filter(i => i.slug !== 'international');
    locals.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.slug;
      opt.textContent = item.name;
      qSelect.appendChild(opt);
    });

    const intl = window.TEMPLATES.localList.find(i => i.slug === 'international');
    if (intl) {
      const group = document.createElement('optgroup');
      group.label = '—';
      const opt = document.createElement('option');
      opt.value = intl.slug;
      opt.textContent = intl.name;
      group.appendChild(opt);
      qSelect.appendChild(group);
    }
  }

  // ---------- Populate international sub-qualifications ----------
  function loadInternationalOptions() {
    if (!window.RES || !Array.isArray(RES.internationalQualifications)) {
      console.warn('International list not found: check resources.js -> window.RES.internationalQualifications');
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

  // ---------- Enable/disable the intl section ----------
  function syncInternationalState() {
    const isIntl = qSelect.value === 'international';
    subSelect.disabled = !isIntl;
    intlWrap.setAttribute('aria-disabled', String(!isIntl));
    if (!isIntl) subSelect.value = '';
  }

  // ---------- Write preview (with editable host wrapper) ----------
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
            /* Editable highlighting inside iframe */
            #editableHost[contenteditable="true"] { outline: 2px dashed #94a3b8; outline-offset: 6px; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="note">Live preview (scaled to page styles)</div>
            <div id="editableHost" contenteditable="${isEditing ? 'true' : 'false'}">${html}</div>
          </div>
          <script>
            // Prevent navigation while editing (but allow Ctrl/Cmd click to open)
            (function(){
              var host = document.getElementById('editableHost');
              document.addEventListener('click', function(e){
                var a = e.target.closest && e.target.closest('a');
                if (!a) return;
                if (host.getAttribute('contenteditable') === 'true') {
                  if (!(e.metaKey || e.ctrlKey)) { e.preventDefault(); }
                }
              }, true);
            })();
          </script>
        </body>
      </html>
    `);
    doc.close();
    updatePdfButtonState();


    // If we’re editing, attach input listener now
    if (isEditing && !inputHandlerAttached) {
      attachPreviewInputListener();
    }
  }

  // ---------- Extract current editable HTML from preview ----------
  function getEditableHtml() {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const host = doc && doc.getElementById('editableHost');
    return host ? host.innerHTML : '';
  }

  // ---------- Sync preview edits back to the textarea (debounced) ----------
  let debounceTimer = null;
  function attachPreviewInputListener() {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const host = doc && doc.getElementById('editableHost');
    if (!host) return;

    previewInputHandler = function onHostInput() {
      isDirty = true;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        htmlOut.value = getEditableHtml();
      }, 200);
    };
    host.addEventListener('input', previewInputHandler);
    inputHandlerAttached = true;
  }

  function detachPreviewInputListener() {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const host = doc && doc.getElementById('editableHost');
    if (!host) return;
    if (previewInputHandler) {
       host.removeEventListener('input', previewInputHandler);
       previewInputHandler = null;
     }
      inputHandlerAttached = false;
    }

  // ---------- Toggle edit mode ----------
  function setEditMode(flag) {
    isEditing = !!flag;
    document.body.classList.toggle('preview-editing', isEditing);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const host = doc && doc.getElementById('editableHost');
    if (host) host.setAttribute('contenteditable', isEditing ? 'true' : 'false');

    if (isEditing) {
      if (!inputHandlerAttached) attachPreviewInputListener();
      toggleEdit.textContent = 'Stop editing';
    } else {
      detachPreviewInputListener();
      toggleEdit.textContent = 'Edit preview';

    }
 updatePdfButtonState();
  }

// Disable/enable the PDF download button in the iframe while editing
function updatePdfButtonState() {
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  if (!doc) return;

  // Capture-phase blocker to stop html2pdf handlers when editing
  if (!doc.__pdfClickBlocker) {
    doc.__pdfClickBlocker = function (e) {
      if (!isEditing) return;
      const t = e.target && e.target.closest ? e.target.closest('#downloadPdfBtn') : null;
      if (t) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    doc.addEventListener('click', doc.__pdfClickBlocker, true);
  }

  // Style/disable any download buttons present
  const btns = doc.querySelectorAll('#downloadPdfBtn');
  btns.forEach(btn => {
    if (isEditing) {
      btn.setAttribute('disabled', 'true');
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.title = 'Disabled while editing the preview';
    } else {
      btn.removeAttribute('disabled');
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.removeAttribute('title');
    }
  });
}


  // ---------- Build (Generate) ----------
  function build() {
    const slug = qSelect.value;
    const subId = subSelect.value || null;
    const periodText = (periodInput.value || '').trim();

    // If there are unsaved direct edits and the user changes template, warn once
    if (isDirty && !isEditing) {
      // (We only warn when switching templates while not actively editing.)
      // You can add a confirm() if you want a blocking prompt.
      console.warn('You have unsaved preview edits that differ from the last generated output.');
    }

    try {
      if (typeof window.buildTemplate !== 'function') {
        throw new Error('templates.js not loaded or window.buildTemplate missing');
      }
      const html = window.buildTemplate({ slug, subId, periodText });
      htmlOut.value = html;
      // Re-render preview but preserve current edit mode
      writePreview(html);
      isDirty = false; // fresh build, not yet edited
    } catch (e) {
      console.error(e);
      htmlOut.value = `<!-- Error building template: ${e && e.message ? e.message : e} -->`;
      writePreview('<p style="padding:16px;color:#b00020;">Error building template. See console.</p>');
    }
  }

  // ---------- Copy to clipboard ----------
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

  // ---------- Reset ----------
  function resetAll() {
    const firstLocal = (window.TEMPLATES && Array.isArray(window.TEMPLATES.localList))
      ? window.TEMPLATES.localList.find(i => i.slug !== 'international')
      : null;
    qSelect.value = firstLocal ? firstLocal.slug : 'polySingapore';
    periodInput.value = '';
    subSelect.value = '';
    syncInternationalState();
    setEditMode(false);
    build();
  }

  // ---------- Events ----------
  qSelect.addEventListener('change', () => {
    if (isEditing && isDirty) {
      // optional: confirm before losing edits
      if (!confirm('Switching template will overwrite your edits in the preview. Continue?')) {
        // revert selection change by rebuilding current preview
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc) writePreview(htmlOut.value);
        return;
      }
    }
    isDirty = false;
    syncInternationalState();
    build();
  });
  subSelect.addEventListener('change', build);
  periodInput.addEventListener('input', build);
  resetBtn.addEventListener('click', resetAll);
  buildBtn.addEventListener('click', build);
  copyBtn.addEventListener('click', copyHtml);
  toggleEdit.addEventListener('click', () => setEditMode(!isEditing));

  // ---------- Init ----------
  populateMainQualificationSelector();
  loadInternationalOptions();
  resetAll();
})();
