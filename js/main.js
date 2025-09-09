/* App logic */
(function () {
  const OWNER = "polyelig";
  const REPO = "qual-qual";

  // UI refs
  const modeRadios = Array.from(document.querySelectorAll('input[name="mode"]'));
  const generatorCard = document.getElementById('generatorCard');
  const updateCard = document.getElementById('updateCard');

  const qualSel = document.getElementById('qualification');
  const intlRow = document.getElementById('intlRow');
  const intlSel = document.getElementById('intlSelect');
  const timelineInput = document.getElementById('timeline');

  const generateBtn = document.getElementById('generateBtn');
  const resetBtn = document.getElementById('resetBtn');

  const updateQualSel = document.getElementById('updateQualification');
  const updateIntlRow = document.getElementById('updateIntlRow');
  const updateIntlSel = document.getElementById('updateIntlSelect');
  const linksEditor = document.getElementById('linksEditor');
  const applyLocalBtn = document.getElementById('applyLocalBtn');
  const openIssueBtn = document.getElementById('openIssueBtn');
  const resetEditorBtn = document.getElementById('resetEditorBtn');

  const preview = document.getElementById('preview');
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const RES = window.RESOURCES;
  const TPL = window.TEMPLATES;

  /* ---------- Helpers ---------- */

  function setMode(mode) {
    const isGenerate = mode === 'generate';
    generatorCard.hidden = !isGenerate;
    updateCard.hidden = isGenerate;
  }

  function populateLocalDropdowns() {
    // Generator
    qualSel.innerHTML = "";
    TPL.localList.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.slug;
      opt.textContent = item.name;
      qualSel.appendChild(opt);
    });
    // Updater
    updateQualSel.innerHTML = "";
    TPL.localList.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.slug;
      opt.textContent = item.name;
      updateQualSel.appendChild(opt);
    });
    populateInternationalSelects();
    showIntlIfNeeded(qualSel.value, 'generate');
    showIntlIfNeeded(updateQualSel.value, 'update');
  }

  function populateInternationalSelects() {
    intlSel.innerHTML = "";
    RES.international.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q.id;
      opt.textContent = q.name;
      intlSel.appendChild(opt);
    });
    updateIntlSel.innerHTML = "";
    RES.international.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q.id;
      opt.textContent = q.name;
      updateIntlSel.appendChild(opt);
    });
  }

  function isInternational(slug) {
    return slug === 'international';
  }

  function showIntlIfNeeded(slug, where) {
    const row = where === 'update' ? updateIntlRow : intlRow;
    row.hidden = !isInternational(slug);
  }

  function getInternationalById(id) {
    return RES.international.find(x => x.id === id);
  }

  function getLocalAdmissionUrl(slug) {
    return RES.localAdmissions[slug] || "";
  }

  function getLocalResourcesKeys(slug) {
    return TPL.localResources[slug] || [];
  }

  function htmlesc(str) {
    return String(str || "").replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }

  function nowDateMacro() {
    return '${date://CurrentDate/PT}';
  }

  /* ---------- Generator ---------- */

  function buildResourceListHTML(listItems) {
    return listItems.map(li => `\t<li style="margin-bottom: 6px;"><a href="${htmlesc(li.href)}" target="_blank" rel="noopener noreferrer">${htmlesc(li.text)}</a>${li.trailing || ""}</li>`).join("\n");
  }

  function sharedLinkToText(key) {
    switch (key) {
      case 'importantDates': return 'Important Dates';
      case 'indicativeGradeProfile': return 'Indicative Grade Profile (IGP)';
      case 'applicationGuides': return 'Application Guides &amp; Sample Forms';
      case 'programmePrerequisites': return 'Programme Prerequisites';
      case 'updateApplicantInfo': return 'Update of Applicant Information';
      case 'standardisedTestPdf': return 'Standardised Test';
      case 'englishRequirementPdf': return 'English Language Requirement';
      case 'transferEligibilityChart': return 'NUS Transfer Eligibility Chart';
      case 'applicantPortal': return 'Applicant Portal';
      case 'singpassSupport': return 'Singpass';
      case 'singpassIndividuals': return 'Singpass (Individuals)';
      case 'finFaq': return 'FIN';
      default: return key;
    }
  }

  function resourcesForLocal(slug) {
    const sharedKeys = getLocalResourcesKeys(slug);
    const items = [];

    // Admission Requirements if available
    if (RES.localAdmissions[slug]) {
      const label =
        slug === 'ibLocal' ? 'International Baccalaureate (IB) Diploma Admission Requirements' :
        slug === 'aLevel' ? 'Singapore-Cambridge GCE A-Level Admission Requirements' :
        slug === 'nusHigh' ? 'NUS High School Diploma Admission Requirements' :
        slug === 'polySingapore' ? 'Admission Requirements' :
        slug === 'transfer' ? 'Admission Requirements' : 'Admission Requirements';
      items.push({ href: RES.localAdmissions[slug], text: label });
    }

    // Shared links per template
    sharedKeys.forEach(k => items.push({
      href: RES.shared[k],
      text: sharedLinkToText(k),
      trailing: (k === 'importantDates' ? ' (application opening and closing dates)' : '')
    }));

    return items;
  }

  function resourcesForInternational(intlObj) {
    const items = [];
    items.push({ href: intlObj.admissionUrl, text: 'Admission Requirements' });
    if (intlObj.includeStandardisedTest) items.push({ href: RES.shared.standardisedTestPdf, text: 'Standardised Test' });
    if (intlObj.includeEnglishRequirement) items.push({ href: RES.shared.englishRequirementPdf, text: 'English Language Requirement' });
    ['importantDates','applicationGuides','programmePrerequisites','updateApplicantInfo'].forEach(k => {
      items.push({ href: RES.shared[k], text: sharedLinkToText(k) });
    });
    return items;
  }

  function loginBlocksHTML(qualificationLabel) {
    return `
<hr class="section-divider" />
<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <strong>Singapore Citizens / Singapore Permanent Residents / FIN holders</strong></h2>
<p style="font-size: 15px; margin-bottom: 24px;">
  Please log in to the <a href="${RES.shared.applicantPortal}" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
  with your <a href="${RES.shared.singpassSupport}" target="_blank" rel="noopener noreferrer">Singpass</a>
  to proceed with your application using the ${htmlesc(qualificationLabel)}.
</p>

<hr class="section-divider" />
<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🌏 <strong>Foreigners (without <a href="${RES.shared.finFaq}" target="_blank" rel="noopener noreferrer">FIN</a>)</strong></h2>
<p style="font-size: 15px; margin-bottom: 24px;">
  Please log in to the <a href="${RES.shared.applicantPortal}" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
  with your email address to proceed with your application using the ${htmlesc(qualificationLabel)}.
</p>
`.trim();
  }

  function _sharedStyleAndLib() {
    return `
<!-- Shared styles -->
<style>
  .page-break { page-break-before: always; margin: 0; padding: 0; height: 0; }
  .section-divider { margin: 24px auto; border: none; border-top: 1px solid #ccc; max-width: 100%; }
</style>
<!-- html2pdf lib -->
<script id="html2pdf-lib" src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>`.trim();
  }

  function _pdfScript(filename) {
    return `
<script>
  (function () {
    var btn = document.getElementById('downloadPdfBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var element = document.getElementById('pdfContent');
      if (!element) return;
      var opt = {
        margin: 0.5,
        filename: '${filename}',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      if (typeof html2pdf === 'undefined') return;
      html2pdf().set(opt).from(element).save();
    });
  })();
</script>`.trim();
  }

  function wrapEOSHTML({ titleLine, bodyLine1, bodyLine2, timelineText, resourcesHeading, resourcesListHTML }) {
    const filename = 'NUS_Application_Guide.pdf';
    return `
<div id="pdfContent" style="
  font-family: Arial, sans-serif;
  text-align: left;
  padding: 32px;
  background-color: #f9f9f9;
  color: #333;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
  line-height: 1.6;
">
  <p style="font-size: 15px; margin-bottom: 20px;">Hello!</p>

  <p style="font-size: 15px; margin-bottom: 24px;">Thank you for your interest in applying to the National University of Singapore (NUS).</p>

  <!-- Application Period Section -->
  <div style="
    margin: 16px 0;
    padding: 16px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    text-align: center;
  ">
    <h2 style="margin: 0; font-size: 18px;">${htmlesc(titleLine)}</h2>
    <p style="font-size: 15px; margin: 8px 0 0;">${bodyLine1}<br /><strong>${htmlesc(timelineText)}</strong></p>
    <p style="font-size: 13px; margin: 8px 0 0;">Please refer to the <a href="${RES.shared.importantDates}" target="_blank" rel="noopener noreferrer">OAM website</a> for the latest dates and any updates.</p>
  </div>

  ${bodyLine2}

  <div class="page-break"></div>

  <hr class="section-divider" />
  <h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>${htmlesc(resourcesHeading)}</strong></h2>

  <ul style="padding-left: 20px; font-size: 15px; margin: 0 0 0 40px;">
${resourcesListHTML}
  </ul>

  <hr class="section-divider" />
  <p style="font-size: 14px; color: #b00020; margin: 0 0 12px;">⚠️ PDF download only works on desktop browsers and may not function on mobile devices.</p>
  <span style="font-size:13px;">Date: ${nowDateMacro()}</span>
</div>

<!-- Download button OUTSIDE pdfContent -->
<button id="downloadPdfBtn" style="
  background-color: #00437a; color: white; padding: 10px 20px; border: none;
  font-size: 14px; text-align: center; border-radius: 5px; cursor: pointer;
">📄 Download This Page as PDF</button>

${_sharedStyleAndLib()}
${_pdfScript(filename)}
`.trim();
  }

  function buildSnippetForLocal(slug, timeline) {
    // Label used in login blocks for local (except Transfer)
    const label =
      slug === 'polySingapore' ? 'Polytechnic Diploma from Singapore Qualification' :
      slug === 'nusHigh' ? 'NUS High School Diploma Qualification' :
      slug === 'aLevel' ? 'Singapore-Cambridge GCE A-Level Qualification' :
      slug === 'ibLocal' ? 'International Baccalaureate (IB) Qualification' :
      slug === 'transfer' ? '' : 'Qualification';

    // Title line
    const titleLine =
      slug === 'transfer' ? '📅 AY2026/2027 Semester 1 Application Period for' :
      slug === 'polySingapore' ? '📅 AY2026/2027 Application Period' :
      '📅 AY2026/2027 Application Period for';

    // Body line 1 (under title)
    const bodyLine1 =
      slug === 'transfer'
        ? 'Transfer Candidates is'
        : slug === 'polySingapore'
          ? 'for the Polytechnic Diploma from Singapore Qualification is'
          : `the ${htmlesc(label)} is`;

    // Login blocks
    let bodyLine2 = "";
    if (slug === 'transfer') {
      // Use your original Transfer copy (with Singpass Individuals + MTL line)
      bodyLine2 = `
<hr class="section-divider" />
<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🔎 <strong>Singapore Citizens / Singapore Permanent Residents / FIN holders</strong></h2>
<p style="font-size: 15px; margin-bottom: 24px;">
  As you have indicated that you are currently studying / have enrolled in / have graduated from a tertiary institution,
  please log in to the <a href="${RES.shared.applicantPortal}" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
  with your <a href="${RES.shared.singpassIndividuals}" target="_blank" rel="noopener noreferrer">Singpass</a>
  to proceed with your application as a Transfer candidate.
</p>
<p style="font-size: 15px; margin-bottom: 24px;">
  📌 Please check if you fulfil the <a href="https://www.nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications" target="_blank" rel="noopener noreferrer">Mother Tongue Language (MTL) requirements</a>.
</p>

<hr class="section-divider" />
<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🌏 <strong>Foreigners (without <a href="${RES.shared.finFaq}" target="_blank" rel="noopener noreferrer">FIN</a>)</strong></h2>
<p style="font-size: 15px; margin-bottom: 24px;">
  Please log in to the <a href="${RES.shared.applicantPortal}" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
  with your email address to proceed with your application as a Transfer candidate.
</p>
`.trim();
    } else {
      bodyLine2 = loginBlocksHTML(label);
    }

    const resourcesHeading = TPL.headings[slug] || "Application Resources";
    const resourcesListHTML = buildResourceListHTML(resourcesForLocal(slug));

    return wrapEOSHTML({ titleLine, bodyLine1, bodyLine2, timelineText: timeline, resourcesHeading, resourcesListHTML });
  }

  function buildSnippetForInternational(intlObj, timeline) {
    const titleLine = '📅 AY2026/2027 Application Period for';
    const bodyLine1 = `the ${htmlesc(intlObj.name)} Qualification is`;
    const bodyLine2 = loginBlocksHTML(`${intlObj.name} Qualification`);
    const resourcesHeading = `Application Resources for the ${intlObj.name} Qualification`;
    const resourcesListHTML = buildResourceListHTML(resourcesForInternational(intlObj));

    return wrapEOSHTML({ titleLine, bodyLine1, bodyLine2, timelineText: timeline, resourcesHeading, resourcesListHTML });
  }

  function renderPreview(html) {
    preview.innerHTML = html || '<div class="muted">Nothing to show.</div>';
  }

  function generate() {
    const slug = qualSel.value;
    const isIntl = isInternational(slug);
    let timeline = (timelineInput.value || "").trim();

    if (isIntl) {
      const intlId = intlSel.value;
      const intlObj = getInternationalById(intlId);
      if (!intlObj) { alert("Please select an international sub-qualification."); return; }
      if (!timeline) timeline = intlObj.displayPeriod || "3 December 2025 to 23 February 2026";
      const html = buildSnippetForInternational(intlObj, timeline);
      renderPreview(html);
      output.value = html;
      return;
    }

    // Local or Transfer
    if (!timeline) {
      timeline = slug === 'transfer'
        ? "3 February 2026 to 23 February 2026"
        : "17 December 2025 to 23 February 2026";
    }
    const html = buildSnippetForLocal(slug, timeline);
    renderPreview(html);
    output.value = html;
  }

  function resetAll() {
    qualSel.selectedIndex = 0;
    showIntlIfNeeded(qualSel.value, 'generate');
    intlSel.selectedIndex = 0;
    timelineInput.value = "";
    renderPreview('');
    output.value = '';
  }

  /* ---------- Update links (editor) ---------- */

  function editorRow(label, name, value, placeholder = "") {
    return `
      <div class="form-row">
        <label for="${name}">${label}</label>
        <input id="${name}" type="text" value="${htmlesc(value)}" placeholder="${htmlesc(placeholder)}" />
      </div>
    `;
  }

  function toggleRow(label, name, checked) {
    return `
      <div class="form-row">
        <label for="${name}">${label}</label>
        <input id="${name}" type="checkbox" ${checked ? 'checked' : ''} />
      </div>
    `;
  }

  function buildLinksEditor() {
    const slug = updateQualSel.value;
    const intl = isInternational(slug);
    let html = '';

    // Shared keys
    const sharedKeys = intl
      ? ['importantDates', 'applicationGuides', 'programmePrerequisites', 'updateApplicantInfo', 'standardisedTestPdf', 'englishRequirementPdf', 'applicantPortal', 'singpassSupport', 'singpassIndividuals', 'finFaq']
      : [...new Set([...getLocalResourcesKeys(slug), 'applicantPortal', 'singpassSupport', 'singpassIndividuals', 'finFaq'])];

    // Admission Requirements
    if (intl) {
      const intlId = updateIntlSel.value;
      const obj = getInternationalById(intlId);
      if (!obj) { linksEditor.innerHTML = '<div class="muted">Select a sub-qualification.</div>'; return; }
      html += editorRow('Admission Requirements URL', 'admissionUrl', obj.admissionUrl);
      html += toggleRow('Include Standardised Test', 'includeStandardisedTest', !!obj.includeStandardisedTest);
      html += toggleRow('Include English Language Requirement', 'includeEnglishRequirement', !!obj.includeEnglishRequirement);
    } else {
      const admission = getLocalAdmissionUrl(slug);
      if (admission) {
        html += editorRow('Admission Requirements URL', 'admissionUrl', admission);
      }
    }

    // Shared rows
    sharedKeys.forEach(k => {
      html += editorRow(`${sharedLinkToText(k)} URL`, `shared_${k}`, RES.shared[k] || '', `Enter URL for ${sharedLinkToText(k)}`);
    });

    linksEditor.innerHTML = html || '<div class="muted">No editable links for this template.</div>';
  }

  function collectEditorPatch() {
    const slug = updateQualSel.value;
    const intl = isInternational(slug);

    const patch = { shared: {}, local: {}, international: {} };

    // Text inputs
    const inputs = linksEditor.querySelectorAll('input[type="text"]');
    inputs.forEach(inp => {
      const id = inp.id;
      const val = inp.value.trim();
      if (id.startsWith('shared_')) {
        const key = id.replace('shared_', '');
        if (RES.shared[key] !== val) patch.shared[key] = val;
      } else if (id === 'admissionUrl') {
        if (intl) {
          const intlId = updateIntlSel.value;
          const obj = getInternationalById(intlId);
          if (obj && obj.admissionUrl !== val) {
            patch.international[intlId] = patch.international[intlId] || {};
            patch.international[intlId].admissionUrl = val;
          }
        } else {
          const old = getLocalAdmissionUrl(slug);
          if (old !== val) {
            patch.local[slug] = patch.local[slug] || {};
            patch.local[slug].admissionUrl = val;
          }
        }
      }
    });

    // Toggles (international only)
    if (intl) {
      const intlId = updateIntlSel.value;
      const st = linksEditor.querySelector('#includeStandardisedTest');
      const en = linksEditor.querySelector('#includeEnglishRequirement');
      if (st) {
        const current = !!getInternationalById(intlId).includeStandardisedTest;
        if (current !== st.checked) {
          patch.international[intlId] = patch.international[intlId] || {};
          patch.international[intlId].includeStandardisedTest = st.checked;
        }
      }
      if (en) {
        const current = !!getInternationalById(intlId).includeEnglishRequirement;
        if (current !== en.checked) {
          patch.international[intlId] = patch.international[intlId] || {};
          patch.international[intlId].includeEnglishRequirement = en.checked;
        }
      }
    }

    // Clean empties
    if (Object.keys(patch.shared).length === 0) delete patch.shared;
    if (Object.keys(patch.local).length === 0) delete patch.local;
    if (Object.keys(patch.international).length === 0) delete patch.international;

    return patch;
  }

  function applyLocalPatch(patch) {
    if (patch.shared) {
      Object.entries(patch.shared).forEach(([k,v]) => { RES.shared[k] = v; });
    }
    if (patch.local) {
      Object.entries(patch.local).forEach(([slug, obj]) => {
        if (obj.admissionUrl) RES.localAdmissions[slug] = obj.admissionUrl;
      });
    }
    if (patch.international) {
      Object.entries(patch.international).forEach(([id, obj]) => {
        const ref = getInternationalById(id);
        if (!ref) return;
        if (typeof obj.admissionUrl === 'string') ref.admissionUrl = obj.admissionUrl;
        if (typeof obj.includeStandardisedTest === 'boolean') ref.includeStandardisedTest = obj.includeStandardisedTest;
        if (typeof obj.includeEnglishRequirement === 'boolean') ref.includeEnglishRequirement = obj.includeEnglishRequirement;
      });
    }
  }

  function openIssueWithPatch(patch) {
    const title = `chore(resources): update links (${updateQualSel.value}${isInternational(updateQualSel.value) ? ' / ' + updateIntlSel.value : ''})`;
    const payload = `<!-- RESOURCE_UPDATE_PAYLOAD\n${JSON.stringify(patch, null, 2)}\n-->`;
    const body = [
      "This issue was created from the EOS Generator site to request a links update.",
      "",
      "**Scope**:",
      `- template: \`${updateQualSel.value}\`${isInternational(updateQualSel.value) ? `\n- internationalId: \`${updateIntlSel.value}\`` : ""}`,
      "",
      "**Changes**:",
      "```json",
      JSON.stringify(patch, null, 2),
      "```",
      "",
      payload
    ].join("\n");

    const params = new URLSearchParams({
      title,
      body,
      labels: "link-update"
    });
    const url = `https://github.com/${OWNER}/${REPO}/issues/new?${params.toString()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* ---------- Events ---------- */

  modeRadios.forEach(r => r.addEventListener('change', e => setMode(e.target.value)));

  qualSel.addEventListener('change', () => {
    showIntlIfNeeded(qualSel.value, 'generate');
  });

  updateQualSel.addEventListener('change', () => {
    showIntlIfNeeded(updateQualSel.value, 'update');
    buildLinksEditor();
  });

  updateIntlSel.addEventListener('change', buildLinksEditor);

  generateBtn.addEventListener('click', generate);
  resetBtn.addEventListener('click', resetAll);

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value || "");
      alert("Copied to clipboard.");
    } catch { alert("Copy failed. Select and copy manually."); }
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([output.value || ""], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qualtrics_eos_snippet.html';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  applyLocalBtn.addEventListener('click', () => {
    const patch = collectEditorPatch();
    if (!patch || (Object.keys(patch).length === 0)) { alert('No changes detected.'); return; }
    applyLocalPatch(patch);
    alert('Applied locally. Generate again to preview with updated links.');
  });

  openIssueBtn.addEventListener('click', () => {
    const patch = collectEditorPatch();
    if (!patch || (Object.keys(patch).length === 0)) { alert('No changes detected.'); return; }
    openIssueWithPatch(patch);
  });

  resetEditorBtn.addEventListener('click', buildLinksEditor);

  // Init
  populateLocalDropdowns();
  buildLinksEditor();
  setMode('generate');
})();
