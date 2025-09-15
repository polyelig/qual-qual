/* templates.js — builds EOS snippets + includes PDF download section
   Expects:
     - window.RES.links and window.RES.internationalQualifications (from resources.js)
*/

/* ---------- Template metadata ---------- */
window.TEMPLATES = {
  localList: [
    { slug: "aLevel",        name: "Singapore-Cambridge GCE A-Level (Local)" },
    { slug: "polySingapore", name: "Polytechnic Diploma from Singapore (Local)" },
    { slug: "nusHigh",       name: "NUS High School Diploma (Local)" },
    { slug: "ibLocal",       name: "International Baccalaureate (IB) (Local)" },
    { slug: "transfer",      name: "Transfer Applicants (Category)" },
    { slug: "international", name: "International (Pick sub-qualification…)" }
  ],

  localResources: {
    polySingapore: ["importantDates", "indicativeGradeProfile", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    nusHigh:       ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    aLevel:        ["importantDates", "indicativeGradeProfile", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    ibLocal:       ["standardisedTestPdf", "importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    transfer:      ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo", "transferEligibilityChart"]
  },

  headings: {
    polySingapore: "Application Resources for the Polytechnic Diploma from Singapore Qualification",
    nusHigh:       "Application Resources for the NUS High School Diploma Qualification",
    aLevel:        "Application Resources for the Singapore-Cambridge GCE A-Level Qualification",
    ibLocal:       "Application Resources for the International Baccalaureate (IB) Qualification",
    transfer:      "Application Resources for Transfer Applicants",
    // dynamic builder for international heading
    international(name){ return `Application Resources for the ${name} Qualification`; }
  }
};

/* ---------- Utilities ---------- */
function esc(s){
  s = String(s == null ? "" : s);
  return s
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function li(label, url){
  if(!url) return "";
  return `<li style="margin-bottom: 6px;"><a href="${url}" rel="noopener noreferrer" target="_blank">${label}</a></li>`;
}

function sharedLinksFromKeys(keys, links){
  const map = {
    importantDates:        { label: "Important Dates" },
    indicativeGradeProfile:{ label: "Indicative Grade Profile (IGP)" },
    applicationGuides:     { label: "Application Guides &amp; Sample Forms" },
    programmePrerequisites:{ label: "Programme Prerequisites" },
    updateApplicantInfo:   { label: "Update of Applicant Information" },
    standardisedTestPdf:   { label: "Standardised Test" },
    englishRequirementPdf: { label: "English Language Requirement" },
    transferEligibilityChart: { label: "NUS Transfer Eligibility Chart" }
  };
  return keys.map(k => li(map[k]?.label, links[k])).join("");
}

/* MTL note that accepts a specific Admission Requirements href */
function mtlNoteWithHref(href){
  if (!href) return "";
  return `<p style="font-size:15px; margin-bottom:24px;">📌 Please check if you fulfil the
  <a href="${href}" rel="noopener noreferrer" target="_blank">Mother Tongue Language (MTL) requirements</a>.</p>`;
}

/* PDF addendum: warning + date inside the pdfContent, button+CSS+scripts appended */
function withPdfAddendum(innerHtml, pdfFilename){
  const filename = pdfFilename || "NUS_Application_Guide.pdf";
  const warningAndDate = `
<hr class="section-divider" />
<p style="font-size: 14px; color: #b00020; margin: 0 0 12px;">⚠️ PDF download only works on desktop browsers and may not function on mobile devices.</p>
<span style="font-size:13px;">Date: \${date://CurrentDate/PT}</span>`;
  const cssAndScripts = `
<!-- Download button OUTSIDE pdfContent so it is not captured in PDF -->
<button id="downloadPdfBtn" aria-label="Download this page as PDF" style="
  background-color: #00437a;
  color: white;
  padding: 10px 20px;
  border: none;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
">📄 Download This Page as PDF</button>
<!-- Shared styles -->
<style type="text/css">
  .page-break { page-break-before: always; margin:0; padding:0; height:0; }
  .section-divider { margin:24px auto; border:none; border-top:1px solid #ccc; max-width:100%; }
</style>
<!-- html2pdf -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script>
  (function(){
    var btn = document.getElementById('downloadPdfBtn');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var el = document.getElementById('pdfContent');
      if(!el) return;
      var opt = {
        margin: 0.5,
        filename: '${filename}',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      html2pdf().set(opt).from(el).save();
    });
  })();
</script>`;
  return innerHtml.replace('</div><!--pdf-end-->', `${warningAndDate}</div><!--pdf-end-->`) + cssAndScripts;
}

/* ---------- Builders for each template ---------- */
const CYCLE_TITLE = (window.RES && RES.meta && RES.meta.cycleTitle) || "AY2026/2027";

function buildCard(periodText, headingText){
  return `
<div style="max-width:100%; margin:16px 0; padding:16px; border-radius:12px; background-color:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center;">
  <h2 style="margin:0; font-size:18px;">📅 ${esc(CYCLE_TITLE)} Application Period for</h2>
  <p style="font-size:15px; margin:8px 0 0;">${headingText}<br />
  <strong>${esc(periodText)}</strong></p>
  <p style="font-size:13px; margin:8px 0 0;">Please refer to the <a href="${RES.links.importantDates}" rel="noopener noreferrer" target="_blank">OAM website</a> for the latest dates and any updates.</p>
</div>`;
}

function wrapperOpen(){
  return `<!-- Full content wrapper -->
<div id="pdfContent" style="
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 32px;
  background-color: #f9f9f9;
  color: #333;
  text-align: left;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
  line-height: 1.6;
">
<p style="font-size: 15px; margin-bottom: 20px;">Hello!</p>
<p style="font-size: 15px; margin-bottom: 24px;">Thank you for your interest in applying to the National University of Singapore (NUS).</p>
`;
}

function wrapperClose(){ return `</div><!--pdf-end-->`; }

function loginBlockLocal(showProspective){
  if (showProspective) {
    return `
<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🖥️ <strong>Prospective Applicants</strong></h2>
<p style="font-size:15px; margin-bottom:12px;">
  Please log in to the <a href="${RES.links.applicantPortal}" rel="noopener noreferrer" target="_blank">Applicant Portal</a>
  with your <a href="${RES.links.singpassSupport || RES.links.singpassIndividuals}" rel="noopener noreferrer" target="_blank">Singpass</a> to proceed with your application.
</p>`;
  }
  // Default local block: SG/PR/FIN + Foreigners
  return `
<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🖥️ <strong>Singapore Citizens/ Singapore Permanent Residents / FIN holders</strong></h2>
<p style="font-size:15px; margin-bottom:24px;">
  Please log in to the <a href="${RES.links.applicantPortal}" rel="noopener noreferrer" target="_blank">Applicant Portal</a>
  with your <a href="${RES.links.singpassSupport || RES.links.singpassIndividuals}" rel="noopener noreferrer" target="_blank">Singpass</a> to proceed with your application.
</p>
<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🌏 <strong>Foreigners (without <a href="${RES.links.finExplainer || RES.links.finFaq}" rel="noopener noreferrer" target="_blank">FIN</a>)</strong></h2>
<p style="font-size:15px; margin-bottom:24px;">
  Please log in to the <a href="${RES.links.applicantPortal}" rel="noopener noreferrer" target="_blank">Applicant Portal</a>
  with your email address to proceed with your application.
</p>`;
}

function resourcesSection(titleHtml, itemsHtml){
  return `
<div class="page-break"></div>
<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🎓 <strong>${titleHtml}</strong></h2>
<ul style="padding-left:20px; font-size:15px; margin-bottom:0; margin-left:40px;">
  ${itemsHtml}
</ul>`;
}

/* ----- Local templates ----- */
function buildPoly(periodText){
  const head = wrapperOpen();
  const card = buildCard(periodText, "for the Polytechnic Diploma from Singapore Qualification is");
  const login = loginBlockLocal(false);
  const resItems =
      li("Polytechnic Diploma from Singapore Admission Requirements", RES.links.polyAdmission) +
      sharedLinksFromKeys(window.TEMPLATES.localResources.polySingapore, RES.links);
  const res = resourcesSection(window.TEMPLATES.headings.polySingapore, resItems);
  return withPdfAddendum(head + card + login + res + wrapperClose());
}

function buildNusHigh(periodText){
  const head = wrapperOpen();
  const card = buildCard(periodText, "the NUS High School Diploma Qualification is");
  const mtlHref = RES.links.nusHighAdmission; // link MTL note to NUS High admissions
  const login = loginBlockLocal(true) + mtlNoteWithHref(mtlHref);
  const resItems =
      li("NUS High School Diploma Admission Requirements", RES.links.nusHighAdmission) +
      sharedLinksFromKeys(window.TEMPLATES.localResources.nusHigh, RES.links);
  const res = resourcesSection(window.TEMPLATES.headings.nusHigh, resItems);
  return withPdfAddendum(head + card + login + res + wrapperClose());
}

function buildALevelLocal(periodText){
  const head = wrapperOpen();
  const card = buildCard(periodText, "the Singapore-Cambridge GCE A-Level Qualification is");
  const mtlHref = RES.links.aLevelAdmission; // link MTL note to A-Level admissions
  const login = loginBlockLocal(true) + mtlNoteWithHref(mtlHref);
  const resItems =
      li("Singapore-Cambridge GCE A-Level Admission Requirements", RES.links.aLevelAdmission) +
      sharedLinksFromKeys(window.TEMPLATES.localResources.aLevel, RES.links);
  const res = resourcesSection(window.TEMPLATES.headings.aLevel, resItems);
  return withPdfAddendum(head + card + login + res + wrapperClose());
}

function buildIbLocal(periodText){
  const head = wrapperOpen();
  const card = buildCard(periodText, "the International Baccalaureate (IB) Qualification is");
  const mtlHref = RES.links.ibAdmission; // link MTL note to IB admissions
  const login = loginBlockLocal(true) + mtlNoteWithHref(mtlHref);
  const resItems =
      li("International Baccalaureate (IB) Diploma Admission Requirements", RES.links.ibAdmission) +
      sharedLinksFromKeys(window.TEMPLATES.localResources.ibLocal, RES.links);
  const res = resourcesSection(window.TEMPLATES.headings.ibLocal, resItems);
  return withPdfAddendum(head + card + login + res + wrapperClose());
}

function buildTransfer(periodText){
  const head = wrapperOpen();
  const card = `
<div style="max-width:100%; margin:16px 0; padding:16px; border-radius:12px; background-color:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center;">
  <h2 style="margin:0; font-size:18px;">📅 ${esc(CYCLE_TITLE)} Semester 1 Application Period for</h2>
  <p style="font-size:15px;">Transfer Candidates is<br />
  <strong>${esc(periodText)}</strong></p>
  <p style="font-size:13px; margin:8px 0 0;">Please refer to the <a href="${RES.links.importantDates}" rel="noopener noreferrer" target="_blank">OAM website</a> for the latest dates and any updates.</p>
</div>`;
  // No MTL note for Transfer
  const login = `
<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🔎 <strong>Singapore Citizens/ Singapore Permanent Residents / FIN holders</strong></h2>
<p style="font-size:15px; margin-bottom:24px;">
As you have indicated that you are currently studying / have enrolled in / have graduated from a tertiary institution,
please log in to the <a href="${RES.links.applicantPortal}" target="_blank">Applicant Portal</a> with your
<a href="${RES.links.singpassIndividuals || RES.links.singpassSupport}" rel="noopener noreferrer" target="_blank">Singpass</a>
to proceed with your application as a Transfer candidate.</p>

<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🌏 <strong>Foreigners (without <a href="${RES.links.finExplainer || RES.links.finFaq}" rel="noopener noreferrer" target="_blank">FIN</a>)</strong></h2>
<p style="font-size:15px; margin-bottom:10px;">
Please log in to the <a href="${RES.links.applicantPortal}" rel="noopener noreferrer" target="_blank">Applicant Portal</a>
with your email address to proceed with your application as a Transfer candidate.</p>`;
  const resItems =
      li("Important Dates", RES.links.importantDates) +
      li("Application Guides &amp; Sample Forms", RES.links.applicationGuides) +
      li("Programme Prerequisites", RES.links.programmePrerequisites) +
      li("Update of Applicant Information", RES.links.updateApplicantInfo) +
      li("NUS Transfer Eligibility Chart", RES.links.transferEligibilityChart);
  const res = resourcesSection(window.TEMPLATES.headings.transfer, resItems);
  return withPdfAddendum(head + card + login + res + wrapperClose());
}

/* ----- International template ----- */
function buildInternational(subId, periodText){
  const item = (RES.internationalQualifications || []).find(x => x.id === subId);
  const period = esc(periodText || (item ? item.displayPeriod : ""));
  const head = wrapperOpen();
  const qualName = item ? item.name : "International";
  const card = buildCard(period, `the ${qualName} Qualification is`);

  // Fixed MTL link for all international quals
  const mtlHrefFixed = "https://nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications";

  const login = `
<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🖥️ <strong>Singapore Citizens/ Singapore Permanent Residents / FIN holders</strong></h2>
<p style="font-size:15px; margin-bottom:12px;">
Please log in to the <a href="${RES.links.applicantPortal}" rel="noopener noreferrer" target="_blank">Applicant Portal</a>
with your <a href="${RES.links.singpassSupport || RES.links.singpassIndividuals}" rel="noopener noreferrer" target="_blank">Singpass</a>
to proceed with your application using the ${qualName} qualification.</p>
${mtlNoteWithHref(mtlHrefFixed)}

<hr class="section-divider" />
<h2 style="font-size:18px; font-weight:normal; margin:0 0 10px;">🌏 <strong>Foreigners (without <a href="${RES.links.finExplainer || RES.links.finFaq}" rel="noopener noreferrer" target="_blank">FIN</a>)</strong></h2>
<p style="font-size:15px; margin-bottom:24px;">
Please log in to the <a href="${RES.links.applicantPortal}" rel="noopener noreferrer" target="_blank">Applicant Portal</a>
with your email address to proceed with your application using the ${qualName} qualification.</p>`;

  // Resources: admission for sub-qual + conditional standardised/english + shared
  let items = "";
  if (item && Array.isArray(item.resources) && item.resources.length){
    const first = item.resources[0];
    items += li(`${qualName} Admission Requirements`, first.url);
  } else if (item && item.admissionUrl){
    items += li(`${qualName} Admission Requirements`, item.admissionUrl);
  }
  if (item && item.standardisedTest === "Yes") {
    items += li("Standardised Test", RES.links.standardisedTestPdf);
  }
  if (item && item.englishRequirement === "Yes") {
    items += li("English Language Requirement", RES.links.englishRequirementPdf);
  }
  items += sharedLinksFromKeys(["importantDates","applicationGuides","programmePrerequisites","updateApplicantInfo"], RES.links);

  const title =
    (typeof window.TEMPLATES.headings.international === "function")
      ? window.TEMPLATES.headings.international(qualName)
      : `Application Resources for the ${qualName} Qualification`;

  const res = resourcesSection(title, items);
  return withPdfAddendum(head + card + login + res + wrapperClose());
}

/* ---------- Public builder ---------- */
window.buildTemplate = function({ slug, subId, periodText }){
  if (!window.RES || !RES.links) {
    throw new Error("resources not loaded");
  }
  if (slug === "international" && !Array.isArray(RES.internationalQualifications)) {
    throw new Error("International list not loaded. Check resources.js (RES.internationalQualifications).");
  }
  switch (slug) {
    case "polySingapore": return buildPoly(periodText || "from 17 December 2025 to 4 February 2026");
    case "nusHigh":       return buildNusHigh(periodText || "from 17 December 2025 to 2 January 2026");
    case "aLevel":        return buildALevelLocal(periodText || "from Day of Results Release to 19 March 2026");
    case "ibLocal":       return buildIbLocal(periodText || "from 17 December 2025 to 23 February 2026");
    case "transfer":      return buildTransfer(periodText || "from 3 February 2026 to 23 February 2026");
    case "international":
      if (!subId) throw new Error("Select an international sub-qualification");
      return buildInternational(subId, periodText || "from 3 December 2025 to 23 February 2026");
    default:
      throw new Error("Unknown template slug: " + esc(slug));
  }
};
