/* templates.js — renderers + buildTemplate glue
   Requires:
   - window.RES.links (shared links map) and RES.internationalQualifications (list)
   Exposes:
   - window.TEMPLATES (metadata)
   - window.buildTemplate({ slug, subId, periodText })
*/

(function () {
  // --- metadata (kept + aligned with your UI) ---
  window.TEMPLATES = {
    localList: [
      { slug: "polySingapore", name: "Polytechnic Diploma from Singapore (Local)" },
      { slug: "nusHigh",       name: "NUS High School Diploma (Local)" },
      { slug: "aLevelLocal",   name: "Singapore-Cambridge GCE A-Level (Local)" }, // renamed from aLevel
      { slug: "ibLocal",       name: "International Baccalaureate (IB) (Local)" },
      { slug: "transfer",      name: "Transfer Applicants (Category)" },
      { slug: "international", name: "International (Pick sub-qualification…)" }
    ],

    // Which shared resource keys (in RES.links) each local template shows
    localResources: {
      polySingapore: ["importantDates", "indicativeGradeProfile", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
      nusHigh:       ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
      aLevelLocal:   ["importantDates", "indicativeGradeProfile", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
      ibLocal:       ["standardisedTestPdf", "importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
      transfer:      ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo", "transferEligibilityChart"]
    },

    // Section headings
    headings: {
      polySingapore: "Application Resources for the Polytechnic Diploma from Singapore Qualification",
      nusHigh:       "Application Resources for the NUS High School Diploma Qualification",
      aLevelLocal:   "Application Resources for the Singapore-Cambridge GCE A-Level Qualification",
      ibLocal:       "Application Resources for the International Baccalaureate Qualification",
      transfer:      "Application Resources for Transfer Applicants",
      international: "Application Resources"
    }
  };

  // -------- helpers --------
  const L = () => (window.RES && RES.links) || {};

  function a(href, label) {
    const safeHref = href || "#";
    const safeLabel = label || href || "";
    return `<a href="${safeHref}" rel="noopener noreferrer" target="_blank">${safeLabel}</a>`;
  }

  function liLink(href, label) {
    return `<li style="margin-bottom: 6px;">${a(href, label)}</li>`;
  }

  function resourceList(keys, extras = []) {
    const links = L();
    const items = [];
    (keys || []).forEach(k => {
      if (links[k]) {
        // friendly labels by key (fallback to key if not mapped)
        const label = friendlyLabelForKey(k);
        items.push(liLink(links[k], label));
      }
    });
    (extras || []).forEach(({ href, label }) => {
      if (href) items.push(liLink(href, label));
    });
    if (!items.length) return "";
    return `<ul style="padding-left: 20px; font-size: 15px; margin-bottom: 0; margin-left: 40px;">
      ${items.join("\n")}
    </ul>`;
  }

  function friendlyLabelForKey(k) {
    const map = {
      polyAdmission: "Polytechnic Diploma from Singapore — Admission Requirements",
      nusHighAdmission: "NUS High School Diploma — Admission Requirements",
      aLevelAdmission: "Singapore-Cambridge GCE A-Level — Admission Requirements",
      ibAdmission: "International Baccalaureate (IB) — Admission Requirements",
      transferAdmission: "Transfer Applicants — Admission Requirements",
      importantDates: "Important Dates",
      indicativeGradeProfile: "Indicative Grade Profile (IGP)",
      applicationGuides: "Application Guides & Sample Forms",
      programmePrerequisites: "Programme Prerequisites",
      updateApplicantInfo: "Update of Applicant Information",
      standardisedTestPdf: "Standardised Test",
      englishRequirementPdf: "English Language Requirement",
      applicantPortal: "Applicant Portal",
      singpassSupport: "Singpass",
      transferEligibilityChart: "NUS Transfer Eligibility Chart"
    };
    return map[k] || k;
  }

  function qualName(slug) {
    // Friendly name for use inside the “Application Period” line
    switch (slug) {
      case "polySingapore": return "the Polytechnic Diploma from Singapore qualification";
      case "nusHigh":       return "the NUS High School Diploma Qualification";
      case "aLevelLocal":   return "the Singapore-Cambridge GCE A-Level Qualification";
      case "ibLocal":       return "the International Baccalaureate (IB) Qualification";
      case "transfer":      return "Transfer Candidates";
      default:              return "the selected qualification";
    }
  }

  function card(periodText, slug) {
    const links = L();
    const line = periodText ? `from ${periodText}.` : "";
    return `
<div style="max-width: 100%; margin: 16px 0; padding: 16px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
  <h2 style="margin-top: 0; font-size: 18px;">📅 AY2026/2027 Application Period for</h2>
  <p style="font-size: 15px;">${qualName(slug)} is<br /><strong>${line}</strong></p>
  <p style="font-size: 13px; margin: 8px 0 0;">Please refer to the ${a(links.importantDates, "OAM website")} for the latest dates and any updates.</p>
</div>`;
  }

  function wrapperStart() {
    return `<div id="pdfContent" style="
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
<p style="font-size: 15px; margin-bottom: 24px;">Thank you for your interest in applying to the National University of Singapore (NUS).</p>`;
  }
  function wrapperEnd(withDate = true) {
    const dateLine = withDate ? `<span style="font-size:13px;">Date: \${date://CurrentDate/PT}</span>` : "";
    return `
<hr class="section-divider" />
${dateLine}</div>
<style type="text/css">.section-divider{margin:24px auto;border:none;border-top:1px solid #ccc;max-width:100%;}</style>`;
  }

  function sectionTitle(html) {
    return `\n<hr class="section-divider" />\n${html}\n`;
  }

  // ----- local templates -----
  function renderPoly(periodText) {
    const links = L();
    const resources = resourceList(
      TEMPLATES.localResources.polySingapore,
      [{ href: links.polyAdmission, label: "Admission Requirements" }]
    );
    return [
      wrapperStart(),
      card(periodText, "polySingapore"),
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <strong>Singapore Citizens / Singapore Permanent Residents / FIN holders</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 24px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your ${a(links.singpassSupport, "Singpass")} to proceed with your application using the Polytechnic Diploma from Singapore qualification.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🌏 <strong>Foreigners (without ${a(links.finExplainer, "FIN")})</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 24px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your email address to proceed with your application using the Polytechnic Diploma from Singapore qualification.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>${TEMPLATES.headings.polySingapore}</strong></h2>`),
      resources,
      wrapperEnd(true)
    ].join("\n");
  }

  function renderNusHigh(periodText) {
    const links = L();
    const resources = resourceList(
      TEMPLATES.localResources.nusHigh,
      [{ href: links.nusHighAdmission, label: "NUS High School Diploma Admission Requirements" }]
    );
    return [
      wrapperStart(),
      card(periodText, "nusHigh"),
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <strong>Prospective Applicants</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 12px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your ${a(links.singpassSupport, "Singpass")} to proceed with your application using the NUS High School Diploma Qualification.</p>`,
      `<p style="font-size: 15px; margin-bottom: 24px;">📌 Please check if you fulfil the ${a(links.nusHighMtlRequirements || links.mtlRequirements, "Mother Tongue Language (MTL) requirements")}.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>${TEMPLATES.headings.nusHigh}</strong></h2>`),
      resources,
      wrapperEnd(true)
    ].join("\n");
  }

  function renderALevelLocal(periodText) {
    const links = L();
    const resources = resourceList(
      TEMPLATES.localResources.aLevelLocal,
      [{ href: links.aLevelAdmission, label: "Singapore-Cambridge GCE A-Level Admission Requirements" }]
    );
    return [
      wrapperStart(),
      card(periodText, "aLevelLocal"),
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <strong>Prospective Applicants</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 12px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your ${a(links.singpassSupport, "Singpass")} to proceed with your application using the Singapore-Cambridge GCE A-Level Qualification.</p>`,
      `<p style="font-size: 15px; margin-bottom: 24px;">📌 Please check if you fulfil the ${a(links.aLevelMtlRequirements || links.mtlRequirements, "Mother Tongue Language (MTL) requirements")}.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>${TEMPLATES.headings.aLevelLocal}</strong></h2>`),
      resources,
      wrapperEnd(true)
    ].join("\n");
  }

  function renderIbLocal(periodText) {
    const links = L();
    const resources = resourceList(
      TEMPLATES.localResources.ibLocal,
      [{ href: links.ibAdmission, label: "International Baccalaureate (IB) Diploma Admission Requirements" }]
    );
    return [
      wrapperStart(),
      card(periodText, "ibLocal"),
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <strong>Singapore Citizens / Singapore Permanent Residents / FIN holders</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 12px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your ${a(links.singpassSupport, "Singpass")} to proceed with your application using the International Baccalaureate Qualification.</p>`,
      `<p style="font-size: 15px; margin-bottom: 24px;">📌 Please check if you fulfil the ${a(links.ibMtlRequirements || links.mtlRequirements, "Mother Tongue Language (MTL) requirements")}.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🌏 <strong>Foreigners (without ${a(links.finExplainer, "FIN")})</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 24px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your email address to proceed with your application using the International Baccalaureate Qualification.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>${TEMPLATES.headings.ibLocal}</strong></h2>`),
      resources,
      wrapperEnd(true)
    ].join("\n");
  }

  function renderTransfer(periodText) {
    const links = L();
    const resources = resourceList(
      TEMPLATES.localResources.transfer,
      [{ href: links.transferAdmission, label: "Transfer Applicants — Admission Requirements" }]
    );
    return [
      wrapperStart(),
      // For transfer, the line uses “Semester 1 Application Period for” in your example
      `<div style="max-width: 100%; margin: 16px 0; padding: 16px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <h2 style="margin-top: 0; font-size: 18px;">📅 AY2026/2027 Semester 1 Application Period for</h2>
        <p style="font-size: 15px;">Transfer Candidates is<br /><strong>${periodText ? "from " + periodText + "." : ""}</strong></p>
        <p style="font-size: 13px; margin: 8px 0 0;">Please refer to the ${a(links.importantDates, "OAM website")} for the latest dates and any updates.</p>
      </div>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🔎 <strong>Singapore Citizens / Singapore Permanent Residents / FIN holders</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 24px;">As you have indicated that you are currently studying / have enrolled in / have graduated from a tertiary institution, please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your ${a(links.singpassSupport, "Singpass")} to proceed with your application as a Transfer candidate.</p>
      <p style="font-size: 15px; margin-bottom: 24px;">📌 Please check if you fulfil the ${a(links.mtlRequirements, "Mother Tongue Language (MTL) requirements")}.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🌏 <strong>Foreigners (without ${a(links.finExplainer, "FIN")})</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 10px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your email address to proceed with your application as a Transfer candidate.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 0;">🎓 <strong>${TEMPLATES.headings.transfer}</strong></h2>`),
      resources,
      wrapperEnd(true)
    ].join("\n");
  }

  // ----- international template -----
  function renderInternational(subId, periodText) {
    const links = L();
    const list = (window.RES && RES.internationalQualifications) || [];
    const item = list.find(q => q.id === subId);

    if (!item) {
      return [
        wrapperStart(),
        `<p style="padding:16px;color:#475569;">Select an International sub-qualification to build.</p>`,
        wrapperEnd(false)
      ].join("\n");
    }

    // Admission Requirements (from the item itself)
    const extras = [];
    const adm = (item.resources || []).find(r => r.url);
    if (adm) extras.push({ href: adm.url, label: "Admission Requirements" });

    // Conditionally add Standardised Test / English Requirement from RES.links
    if (String(item.standardisedTest).toLowerCase() === "yes" && links.standardisedTestPdf) {
      extras.push({ href: links.standardisedTestPdf, label: "Standardised Test" });
    }
    if (String(item.englishRequirement).toLowerCase() === "yes" && links.englishRequirementPdf) {
      extras.push({ href: links.englishRequirementPdf, label: "English Language Requirement" });
    }

    // Shared resources always included
    const sharedKeys = ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"];

    return [
      wrapperStart(),
      // Application card uses item.displayPeriod if provided, else user input
      `<div style="max-width: 100%; margin: 16px 0; padding: 16px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <h2 style="margin-top: 0; font-size: 18px;">📅 AY2026/2027 Application Period for</h2>
        <p style="font-size: 15px;">the ${item.name} Qualification is<br /><strong>${(item.displayPeriod || periodText) || ""}</strong></p>
        <p style="font-size: 13px; margin: 8px 0 0;">Please refer to the ${a(links.importantDates, "OAM website")} for the latest dates and any updates.</p>
      </div>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <strong>Singapore Citizens / Singapore Permanent Residents / FIN holders</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 12px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your ${a(links.singpassSupport, "Singpass")} to proceed with your application using the ${item.name} Qualification.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🌏 <strong>Foreigners (without ${a(links.finExplainer, "FIN")})</strong></h2>`),
      `<p style="font-size: 15px; margin-bottom: 24px;">Please log in to the ${a(links.applicantPortal, "Applicant Portal")} with your email address to proceed with your application using the ${item.name} Qualification.</p>`,
      sectionTitle(`<h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>${TEMPLATES.headings.international}</strong></h2>`),
      resourceList(sharedKeys, extras),
      wrapperEnd(true)
    ].join("\n");
  }

  // -------- main dispatcher --------
  window.buildTemplate = function ({ slug, subId, periodText }) {
    switch (slug) {
      case "polySingapore": return renderPoly(periodText);
      case "nusHigh":       return renderNusHigh(periodText);
      case "aLevelLocal":   return renderALevelLocal(periodText);
      case "ibLocal":       return renderIbLocal(periodText);
      case "transfer":      return renderTransfer(periodText);
      case "international": return renderInternational(subId, periodText);
      // Backward compatibility if the page still sends aLevel:
      case "aLevel":        return renderALevelLocal(periodText);
      default:
        return `<div style="padding:16px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
          <!-- Unknown template slug: ${String(slug)} -->
          <p style="color:#b00020;">Unknown template. Please choose another option.</p>
        </div>`;
    }
  };
})();
