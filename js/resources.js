/* resources.js — Centralized links + data for templates.js
   - Keeps your original window.RESOURCES exactly as-is
   - Builds window.RES with the shape required by templates.js
*/

/* ===== YOUR SOURCE DATA (unchanged) =====
   NOTE: Keep strict JSON shape here (no trailing commas).
*/
window.RESOURCES = {
  "shared": {
    "applicantPortal": "https://myaces.nus.edu.sg/applicantPortal/app/login",
    "singpassSupport": "https://portal.singpass.gov.sg/home/ui/support",
    "singpassIndividuals": "https://www.singpass.gov.sg/main/individuals/",
    "finFaq": "https://ask.gov.sg/ica/questions/clqety23p003l3k36w2t96n86",

    "importantDates": "https://nus.edu.sg/oam/admissions/important-dates",
    "indicativeGradeProfile": "https://nus.edu.sg/oam/admissions/indicative-grade-profile",
    "applicationGuides": "https://nus.edu.sg/oam/admissions/application-guides-sample-forms",
    "programmePrerequisites": "https://nus.edu.sg/oam/admissions/programme-prerequisites",
    "updateApplicantInfo": "https://nus.edu.sg/oam/admissions/using-the-applicant-portal",

    "standardisedTestPdf": "https://nus.edu.sg/oam/docs/default-source/default-document-library/standardised_test.pdf",
    "englishRequirementPdf": "https://www.nus.edu.sg/oam/docs/default-source/default-document-library/english-test-scores.pdf",

    "transferEligibilityChart": "https://nus.edu.sg/oam/docs/default-source/transfer-applicants/nus-oam-transfer-eligibility-chart.pdf"
  },

  "localAdmissions": {
    "polySingapore": "https://www.nus.edu.sg/oam/admissions/polytechnic-diploma-from-singapore",
    "nusHigh": "https://www.nus.edu.sg/oam/admissions/nus-high-school-diploma",
    "aLevel": "https://www.nus.edu.sg/oam/admissions/singapore-cambridge-gce-a-level",
    "ibLocal": "https://www.nus.edu.sg/oam/admissions/international-baccalaureate-(ib)-diploma",
    "transfer": "https://nus.edu.sg/oam/admissions/transfer-applicants"
  },

  "international": [
    { "id": "a-level-all-boards", "name": "A-Level (AQA, Cambridge, Edexcel, London, OCR, Oxford International AQA, WJEC)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/international-'a'-level", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "american-high-school-diploma", "name": "American High School Diploma", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/american-high-school-diploma", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "australian-high-school", "name": "Australian High School", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/australian-high-school", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "brunei-a-level", "name": "Brunei A-Level", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/brunei-a-level", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "canadian-high-school-diploma", "name": "Canadian High School Diploma", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/canadian-high-school-diploma", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "cape", "name": "Caribbean Advanced Proficiency Examination (CAPE)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/cape", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "danish-studentereksamen", "name": "Danish Studentereksamen (Upper Secondary Leaving Examination)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/danish-studentereksamen", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "european-baccalaureate", "name": "European Baccalaureate Diploma", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/european-baccalaureate-diploma", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "french-baccalaureate", "name": "French Baccalaureate Diploma", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/french-baccalaureate-diploma", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "gao-kao", "name": "Gao Kao / PRC National College Entrance Exam", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/gao-kao", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "german-abitur", "name": "German Abitur", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/german-abitur", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "hkdse", "name": "Hong Kong Diploma of Secondary Education (HKDSE)/ Hong Kong A-Level", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/hkdse", "includeStandardisedTest": false, "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "independent-examinations-board", "name": "Independent Examinations Board", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/independent-examinations-board", "includeStandardisedTest": false, "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "indian-standard-12-central-isc", "name": "Indian Standard 12 (Central & ISC Boards)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-central-isc", "includeStandardisedTest": false, "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "indian-standard-12-state", "name": "Indian Standard 12 (State and other Boards)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-state", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "indonesian-ujian-nasional", "name": "Indonesian Ujian Nasional (UN) / Raport", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indonesian-ujian-nasional", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "italian-diploma-di-esame-di-stato", "name": "Italian Diploma di Esame di Stato", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/italian-diploma-di-esame-di-stato", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "mauritius-high-school-certificate", "name": "Mauritius High School Certificate", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/mauritius-high-school-certificate", "includeStandardisedTest": false, "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "ncea-level-3", "name": "New Zealand National Certificate of Education Achievement (NCEA) Level 3", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/ncea-level-3", "includeStandardisedTest": false, "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "oman-thanawiya-amma", "name": "Oman Thanawiya Amma (Secondary School Leaving Certificate)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/oman-thanawiya-amma", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "stpm", "name": "Sijil Tinggi Persekolahan Malaysia (STPM)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/stpm", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "sri-lanka-a-level", "name": "Sri Lanka A-Level", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/sri-lanka-a-level", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "swiss-matura", "name": "Swiss Matura/ Swiss Federal Maturity Certificate", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/swiss-matura-swiss-federal-maturity-certificate", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "taiwan-senior-high-school", "name": "Taiwan Senior High School", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/taiwan-senior-high-school", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "thailand-mathayom-6", "name": "Thailand Certificate of Secondary Education (Mathayom 6)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/thailand-mathayom-6", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "turkish-high-school", "name": "Turkish High School", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/turkish-high-school", "includeStandardisedTest": true,  "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "uec", "name": "Unified Examination Certificate (UEC)", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/uec", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "vietnam-national-high-school", "name": "Vietnam National High School Graduation Examination", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/vietnam-national-high-school", "includeStandardisedTest": false, "includeEnglishRequirement": true,  "displayPeriod": "3 December 2025 to 23 February 2026" },
    { "id": "other-high-school", "name": "Other High School Qualifications", "admissionUrl": "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/other-high-school-qualifications", "includeStandardisedTest": true,  "includeEnglishRequirement": false, "displayPeriod": "3 December 2025 to 23 February 2026" }
  ]
};

/* ===== DERIVED STRUCTURE FOR TEMPLATES.JS =====
   - window.RES.links
   - window.RES.internationalQualifications
*/
(function () {
  var src = window.RESOURCES || { shared: {}, localAdmissions: {}, international: [] };
  var shared = src.shared || {};
  var local = src.localAdmissions || {};
  var intlList = Array.isArray(src.international) ? src.international : [];

  // Build the flat links map expected by templates.js
  var links = {
    // core
    applicantPortal: shared.applicantPortal || "",
    singpassSupport: shared.singpassSupport || "",
    singpassIndividuals: shared.singpassIndividuals || "",   // <-- now exposed too
    finExplainer: shared.finFaq || "",
    finFaq: shared.finFaq || "",                              // <-- alias for safety

    // shared resources
    importantDates: shared.importantDates || "",
    indicativeGradeProfile: shared.indicativeGradeProfile || "",
    applicationGuides: shared.applicationGuides || "",
    programmePrerequisites: shared.programmePrerequisites || "",
    updateApplicantInfo: shared.updateApplicantInfo || "",

    standardisedTestPdf: shared.standardisedTestPdf || "",
    englishRequirementPdf: shared.englishRequirementPdf || "",

    transferEligibilityChart: shared.transferEligibilityChart || "",

    // MTL page (fixed for international; locals pass their own admissions link to the MTL note builder)
    mtlRequirements: "https://www.nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications",

    // local admission pages
    polyAdmission: local.polySingapore || "",
    nusHighAdmission: local.nusHigh || "",
    aLevelAdmission: local.aLevel || "",
    ibAdmission: local.ibLocal || "",
    transferAdmission: local.transfer || ""
  };

  // Build internationalQualifications with the exact fields used by renderers
  var internationalQualifications = intlList.map(function (x) {
    return {
      id: x.id,
      name: x.name,
      displayPeriod: x.displayPeriod || "",
      standardisedTest: x.includeStandardisedTest ? "Yes" : "No",
      englishRequirement: x.includeEnglishRequirement ? "Yes" : "No",
      resources: x.admissionUrl ? [{ label: "Admission Requirements", url: x.admissionUrl }] : []
    };
  });

  // Optional meta used by templates (cycle title, etc.)
  var meta = {
    cycleTitle: "AY2026/2027"
  };

  // Expose as window.RES
  window.RES = {
    links: links,
    internationalQualifications: internationalQualifications,
    meta: meta
  };
})();
