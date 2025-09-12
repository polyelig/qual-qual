// -------------------------------
// template.js (updated — split login by nationality + links)
// -------------------------------

const today = new Date();

// Canonical links used in login cards
const APPLICANT_PORTAL_URL = "https://myaces.nus.edu.sg/applicantPortal/app/login";
const SINGPASS_URL = "https://portal.singpass.gov.sg/home/ui/support";

/* -------------------------------
   Resource helpers
--------------------------------*/
function createResourceItem(resource) {
  const li = document.createElement("li");
  li.className = "resource-card";

  const a = document.createElement("a");
  a.href = resource.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = resource.label;
  a.className = "resource-link";
  li.appendChild(a);

  if (resource.description) {
    const desc = document.createElement("div");
    desc.className = "resource-desc";
    desc.textContent = resource.description;
    li.appendChild(desc);
  }

  return li;
}

function renderResources(qualification) {
  const list = document.createElement("ul");
  list.className = "resource-list";

  // Common
  if (Array.isArray(window.commonResources)) {
    window.commonResources.forEach(r => list.appendChild(createResourceItem(r)));
  }

  // Conditional
  if (qualification.standardisedTest === "Yes" && window.conditionalResources?.standardisedTest) {
    list.appendChild(createResourceItem(window.conditionalResources.standardisedTest));
  }
  if (qualification.englishRequirement === "Yes" && window.conditionalResources?.englishRequirement) {
    list.appendChild(createResourceItem(window.conditionalResources.englishRequirement));
  }

  // Unique per-qualification
  const unique = (window.uniqueResources && window.uniqueResources[qualification.id]) || [];
  unique.forEach(r => list.appendChild(createResourceItem(r)));

  return list;
}

function renderResourcesCard(qualification) {
  return `
    <div class="info-card info-card--compact">
      <h3>📚 Application Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

/* -------------------------------
   Notice helpers
--------------------------------*/
function getAcademicYear(fromDate) {
  if (!(fromDate instanceof Date) || isNaN(fromDate)) return null;
  const m = fromDate.getMonth(); // 0-11
  const y = fromDate.getFullYear();
  const ayStart = (m >= 7) ? y + 1 : y; // Aug–Dec -> next AY start year
  return `AY${ayStart}/${ayStart + 1}`;
}

// Multi-line notice across all templates
function renderNoticeCard(qualification) {
  // Transfer: multiple periods, same notice style
  if (qualification.type === "transfer" && Array.isArray(qualification.periods)) {
    const header = `📅 Application Periods for the ${qualification.name} Qualification`;
    const list = qualification.periods.map(p => `<li>${p.label}: ${p.rangeText}</li>`).join("");
    return `
      <div class="notice-card notice-upcoming">
        <h2>${header}</h2>
        <ul>${list}</ul>
      </div>
    `;
  }

  if (!qualification.timeline) return "";

  const start = new Date(qualification.timeline.start);
  const end   = new Date(qualification.timeline.end);
  const ayStr = getAcademicYear(start);

  let statusText, cardClass, line3Prefix;
  if (today < start) {
    statusText = "has not started yet.";
    cardClass = "notice-upcoming";     // light red via CSS
    line3Prefix = "Opens on ";
  } else if (today <= end) {
    statusText = "is open.";
    cardClass = "notice-open";         // green via CSS
    line3Prefix = "Open: ";
  } else {
    statusText = "has closed.";
    cardClass = "notice-closed";       // light red via CSS
    line3Prefix = "Period: ";
  }

  const line1 = `📅 ${ayStr ? ayStr + " " : ""}Application Period for the`;
  const line2 = `${qualification.name} Qualification ${statusText}`;
  const line3 = `${line3Prefix}${qualification.displayPeriod}`;

  return `
    <div class="notice-card ${cardClass}">
      <h2>${line1}</h2>
      <p>${line2}</p>
      <p>${line3}</p>
    </div>
  `;
}

/* -------------------------------
   Login helpers (with links)
--------------------------------*/

/** Resolve the MTL link based on qualification type */
function getMtlLink(qualification) {
  // Local: use per-qualification mtlUrl when available
  if (qualification.type === "local" && qualification.mtlUrl) return qualification.mtlUrl;

  // International: fixed page for SG/PR/FIN holders
  if (qualification.type === "international") {
    return "https://nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications";
  }

  // Otherwise, none
  return null;
}

function sgprLoginCard(qualification) {
  const qName = qualification.name;
  const mtlHref = getMtlLink(qualification);
  const mtlLine = mtlHref
    ? `📌 Please check to see if you meet the Mother Tongue Language requirements. <a href="${mtlHref}" target="_blank" rel="noopener noreferrer" class="resource-link">View requirements</a>.`
    : `📌 Please check to see if you meet the Mother Tongue Language requirements.`;

  return `
    <div class="login-card info-card info-card--compact">
      <h4>🔎 Singapore Citizen / PR / FIN Holders</h4>
      <p>Go to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a>, log in with <a href="${SINGPASS_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Singpass</a>, and apply under the <em>Singapore Citizens / PR</em> category using <strong>${qName}</strong>.</p>
      <p>${mtlLine}</p>
    </div>
  `;
}

function foreignersLoginCard(qualification) {
  const qName = qualification.name;

  // Special placeholder for transfer
  if (qualification.type === "transfer") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🌏 Foreigners (without FIN)</h4>
        <p><em>Information for foreign applicants will be provided soon.</em></p>
      </div>
    `;
  }

  return `
    <div class="login-card info-card info-card--compact">
      <h4>🌏 Foreigners (without FIN)</h4>
      <p>Go to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a>, log in with your <strong>email account</strong>, and apply under the <em>International Student</em> category using <strong>${qName}</strong>.</p>
    </div>
  `;
}

function renderLoginInstructionsSection(qualification) {
  return `
    <div class="info-card info-card--compact">
      <h3>🖥️ Login Instructions</h3>
      <div class="login-grid">
        ${sgprLoginCard(qualification)}
        ${foreignersLoginCard(qualification)}
      </div>
    </div>
  `;
}

/* -------------------------------
   Templates
--------------------------------*/
window.templates = {};

window.templates.internationalQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsSection(qualification)}
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.localQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsSection(qualification)}
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.transferTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsSection(qualification)}
    ${renderResourcesCard(qualification)}
  `;
};
