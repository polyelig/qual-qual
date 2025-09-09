/* Template metadata for local and international rendering */

window.TEMPLATES = {
  /* Templates shown in the dropdown */
  localList: [
    { slug: "polySingapore", name: "Polytechnic Diploma from Singapore (Local)" },
    { slug: "nusHigh", name: "NUS High School Diploma (Local)" },
    { slug: "aLevel", name: "Singapore-Cambridge GCE A-Level (Local)" },
    { slug: "ibLocal", name: "International Baccalaureate (IB) (Local)" },
    { slug: "transfer", name: "Transfer Applicants (Category)" },
    { slug: "international", name: "International (Pick sub-qualification…)" }
  ],

  /* Shared links each local template shows in its resources list */
  localResources: {
    polySingapore: ["importantDates", "indicativeGradeProfile", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    nusHigh: ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    aLevel: ["importantDates", "indicativeGradeProfile", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    ibLocal: ["standardisedTestPdf", "importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo"],
    transfer: ["importantDates", "applicationGuides", "programmePrerequisites", "updateApplicantInfo", "transferEligibilityChart"]
  },

  /* Section headings */
  headings: {
    polySingapore: "Application Resources for the Polytechnic Diploma from Singapore Qualification",
    nusHigh: "Application Resources for the NUS High School Diploma Qualification",
    aLevel: "Application Resources for the Singapore-Cambridge GCE A-Level Qualification",
    ibLocal: "Application Resources for the International Baccalaureate Qualification",
    transfer: "Application Resources for Transfer Applicants",
    international: "Application Resources"
  }
};

