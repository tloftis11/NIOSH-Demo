export interface SAPChecklistItem {
  id: number;
  requirement: string;
  sapSection: string;
  cfrReference: string;
  severity: "critical" | "major" | "minor";
  description: string;
}

export interface SAPChecklist {
  respiratorClass: string;
  sapTitle: string;
  items: SAPChecklistItem[];
}

export const FFR_SAP_CHECKLIST: SAPChecklist = {
  respiratorClass: "Filtering Facepiece Respirator (FFR)",
  sapTitle:
    "Standard Application Procedure for Air-Purifying Filtering Facepiece Respirators",
  items: [
    {
      id: 1,
      requirement: "Completed Standard Application Form",
      sapSection: "SAP Section 3.1",
      cfrReference: "42 CFR 84.11(a)",
      severity: "critical",
      description:
        "Standard Application Form must be fully completed with all required fields including applicant name, address, respirator class, and model designation.",
    },
    {
      id: 2,
      requirement:
        "Application fee ($200 check, dated within 30 days, AAR# on check)",
      sapSection: "SAP Section 3.2",
      cfrReference: "42 CFR Part 84 Subpart C",
      severity: "critical",
      description:
        "A $200 check payable to NIOSH must be included. The check must be dated within 30 days of submission and must have the AAR number written on it.",
    },
    {
      id: 3,
      requirement: "Assembly Matrix (all hardware configurations)",
      sapSection: "SAP Section 4.1",
      cfrReference: "42 CFR 84.11(b)",
      severity: "major",
      description:
        "A complete assembly matrix listing every hardware configuration covered by the application, including all variants and sizes.",
    },
    {
      id: 4,
      requirement: "Exploded-view drawings per Drawing Checklist (Section 6.2)",
      sapSection: "SAP Section 6.2",
      cfrReference: "42 CFR 84.11(b)",
      severity: "major",
      description:
        "Exploded-view engineering drawings showing all components and subassemblies. Must follow the Drawing Checklist in SAP Section 6.2, including nose clip, filter media, headband, and valve components.",
    },
    {
      id: 5,
      requirement: "All Major Subassemblies documentation",
      sapSection: "SAP Section 6.3",
      cfrReference: "42 CFR 84.11(b)",
      severity: "major",
      description:
        "Documentation for all major subassemblies including supplier information, material specifications, and part numbers for each component.",
    },
    {
      id: 6,
      requirement: "Packaging and label copy",
      sapSection: "SAP Section 4.3",
      cfrReference: "42 CFR 84.33",
      severity: "major",
      description:
        "Final packaging design and label copy showing all required NIOSH markings, model number, lot numbering scheme, and regulatory statements.",
    },
    {
      id: 7,
      requirement: "Detailed user instructions",
      sapSection: "SAP Section 4.4",
      cfrReference: "42 CFR 84.11(d)",
      severity: "major",
      description:
        "Complete user instructions covering donning/doffing, fit check procedures, use limitations, maintenance, and storage requirements.",
    },
    {
      id: 8,
      requirement: "Product Quality Plan",
      sapSection: "SAP Section 5.1",
      cfrReference: "42 CFR 84.41-84.43",
      severity: "critical",
      description:
        "Quality plan must include inspection procedures, classification of defects (critical, major, minor), sampling plans with AQL levels, and sampling levels per 42 CFR 84.41.",
    },
    {
      id: 9,
      requirement: "Quality Assurance Manual",
      sapSection: "SAP Section 5.2 / CA 2021-1034R1",
      cfrReference: "42 CFR 84.41(b)",
      severity: "critical",
      description:
        "Complete QA Manual covering the manufacturing facility's quality management system, including supplier/subcontractor agreements per CA 2021-1034R1.",
    },
    {
      id: 10,
      requirement: "Test samples (produced under complete proposed QMS)",
      sapSection: "SAP Section 4.5",
      cfrReference: "42 CFR 84.11(c)",
      severity: "critical",
      description:
        "Physical test samples of the respirator produced under the complete proposed quality management system. Prototypes are not accepted.",
    },
    {
      id: 11,
      requirement: "Media format: CD-R or DVD-R",
      sapSection: "SAP Section 3.3",
      cfrReference: "42 CFR 84.11",
      severity: "major",
      description:
        "All documentation must be submitted on CD-R or DVD-R media. USB thumb drives, rewritable CDs, and other formats are not accepted.",
    },
    {
      id: 12,
      requirement: "Private Label Checklist (Section 6.3 for FFRs)",
      sapSection: "SAP Section 6.3",
      cfrReference: "42 CFR 84.33(b)",
      severity: "major",
      description:
        "Required only for private label applications. Must identify the private label holder and demonstrate authorization from the approval holder.",
    },
  ],
};

export interface SubmittedDocument {
  checklistItemId: number;
  present: boolean;
  compliant: boolean;
  notes: string;
  deficiencyDetail?: string;
}

export interface ApplicationPackage {
  applicationId: string;
  manufacturerName: string;
  manufacturerCode: string;
  respiratorClass: string;
  modelDesignation: string;
  submissionDate: string;
  isPrivateLabel: boolean;
  documents: SubmittedDocument[];
}

export const SAMPLE_APPLICATION: ApplicationPackage = {
  applicationId: "AAR-2026-001",
  manufacturerName: "AirShield Safety Corp",
  manufacturerCode: "ASC",
  respiratorClass: "N95 Filtering Facepiece Respirator",
  modelDesignation: "AirShield ProGuard N95-200",
  submissionDate: "2026-03-15",
  isPrivateLabel: false,
  documents: [
    {
      checklistItemId: 1,
      present: true,
      compliant: true,
      notes: "Standard Application Form complete. All fields populated.",
    },
    {
      checklistItemId: 2,
      present: true,
      compliant: false,
      notes: "Check present but dated 2026-01-29 (45 days before submission).",
      deficiencyDetail:
        "The application fee check is dated January 29, 2026 — 45 days before the submission date of March 15, 2026. Per SAP Section 3.2, the check must be dated within 30 days of submission. The check has expired and a new check must be submitted.",
    },
    {
      checklistItemId: 3,
      present: true,
      compliant: true,
      notes:
        "Assembly matrix provided. Lists 3 size variants (S, M, L) with consistent hardware.",
    },
    {
      checklistItemId: 4,
      present: true,
      compliant: false,
      notes:
        "Exploded-view drawing present but incomplete. Nose-clip subassembly not shown.",
      deficiencyDetail:
        "The exploded-view drawing is missing the nose-clip subassembly detail required by SAP Section 6.2, Item 4 (Drawing Checklist). The nose clip, nose foam, and attachment method must be shown as separate components with part numbers and material callouts.",
    },
    {
      checklistItemId: 5,
      present: true,
      compliant: false,
      notes:
        "Major subassemblies documented, but headband elastic supplier info is missing.",
      deficiencyDetail:
        "The subassembly documentation does not include supplier information for the headband elastic component. Per SAP Section 6.3 and 42 CFR 84.41(b), all components sourced from external suppliers must include the supplier name, part number, and material specification.",
    },
    {
      checklistItemId: 6,
      present: true,
      compliant: true,
      notes:
        "Packaging and label copy provided. NIOSH markings placeholder included correctly.",
    },
    {
      checklistItemId: 7,
      present: true,
      compliant: true,
      notes:
        "User instructions complete. Covers donning, fit check, limitations, and storage.",
    },
    {
      checklistItemId: 8,
      present: true,
      compliant: false,
      notes:
        "Quality plan present but sampling plan incomplete. References ISO 2859-1 without specifying AQL levels.",
      deficiencyDetail:
        "The Product Quality Plan references ISO 2859-1 for sampling but does not specify Acceptable Quality Level (AQL) values for critical, major, and minor defect classifications. Per 42 CFR 84.41(b), the quality plan must include specific sampling plans and sampling levels that distinguish between defect severity categories. Please define AQL levels (e.g., 0.065 for critical defects, 1.0 for major defects, 4.0 for minor defects) aligned with your classification of defects.",
    },
    {
      checklistItemId: 9,
      present: true,
      compliant: false,
      notes:
        "QA Manual present but missing supplier/subcontractor agreement documentation.",
      deficiencyDetail:
        "Your Quality Assurance Manual does not include documentation of supplier and subcontractor agreements. Per Conformity Assessment Notice CA 2021-1034R1 and 42 CFR 84.41(b), your QA manual must describe how you ensure that components sourced from suppliers and subcontractors meet the specifications established in your quality plan. Please include signed supplier agreements or a supplier qualification procedure.",
    },
    {
      checklistItemId: 10,
      present: true,
      compliant: true,
      notes:
        "Test samples received. 20 units from production run under documented QMS.",
    },
    {
      checklistItemId: 11,
      present: true,
      compliant: false,
      notes: "Documentation submitted on USB thumb drive instead of CD-R/DVD-R.",
      deficiencyDetail:
        "Application materials were submitted on a USB thumb drive. Per SAP Section 3.3, all documentation must be provided on CD-R or DVD-R media. USB thumb drives, rewritable CDs (CD-RW), and other electronic media formats are not accepted. Please resubmit all documentation on a CD-R or DVD-R.",
    },
    {
      checklistItemId: 12,
      present: false,
      compliant: true,
      notes: "Not applicable — this is not a private label application.",
    },
  ],
};

export interface GuidanceEntry {
  checklistItemId: number;
  guidance: string;
  references: string[];
}

export const AI_GUIDANCE: GuidanceEntry[] = [
  {
    checklistItemId: 2,
    guidance:
      'Your application fee check is dated January 29, 2026, which is 45 days before your submission date. The Standard Application Procedure requires that the check be dated within 30 days of submission. Please issue a new $200 check payable to "NIOSH" dated no earlier than 30 days before your intended resubmission date. Write your AAR number (AAR-2026-001) on the check.',
    references: [
      "SAP for FFRs, Section 3.2 — Application Fee Requirements",
      "42 CFR Part 84, Subpart C — Fees",
    ],
  },
  {
    checklistItemId: 4,
    guidance:
      "Your exploded-view drawing does not include the nose-clip subassembly. The SAP Drawing Checklist (Section 6.2) requires that all components be individually identified with part numbers and material specifications. For the nose clip, you must show: (1) the metal nose-clip strip with material and gauge, (2) the nose foam cushion with material type, (3) the attachment method to the facepiece body. Please update your drawing to include these details and resubmit.",
    references: [
      "SAP for FFRs, Section 6.2 — Exploded-View Drawing Checklist",
      "42 CFR 84.11(b) — Application Requirements",
    ],
  },
  {
    checklistItemId: 5,
    guidance:
      "Your subassembly documentation is missing supplier information for the headband elastic. For every externally sourced component, you must provide: the supplier name and location, the supplier's part number, the material specification, and evidence of a supplier qualification or agreement. This is required to demonstrate that your quality management system covers the full supply chain.",
    references: [
      "SAP for FFRs, Section 6.3 — All Major Subassemblies Checklist",
      "CA 2021-1034R1 — Supplier/Subcontractor Agreements",
      "42 CFR 84.41(b) — Quality Control Requirements",
    ],
  },
  {
    checklistItemId: 8,
    guidance:
      "Your Product Quality Plan references ISO 2859-1 for acceptance sampling but does not define specific AQL (Acceptable Quality Level) values for each defect classification. Under 42 CFR 84.41, your quality plan must include: (1) a classification of defects into critical, major, and minor categories; (2) specific AQL levels for each category; and (3) the corresponding sampling level. Typical AQL values used in the industry are 0.065 for critical defects, 1.0 for major defects, and 4.0 for minor defects. Your sampling plan should clearly link each defect type to its AQL and inspection level.",
    references: [
      "42 CFR 84.41 — Quality Control Plans",
      "42 CFR 84.42 — Classification of Defects",
      "42 CFR 84.43 — Sampling Plans",
      "NIOSH Publication 2023-132 — Know Before You Apply",
    ],
  },
  {
    checklistItemId: 9,
    guidance:
      "Your Quality Assurance Manual does not include documentation of supplier and subcontractor agreements. Per Conformity Assessment Notice CA 2021-1034R1 and 42 CFR 84.41(b), your QA manual must describe how you ensure that components sourced from suppliers and subcontractors meet the specifications established in your quality plan. This includes: (1) signed supplier quality agreements or equivalent documentation; (2) a supplier qualification/audit procedure; (3) incoming inspection requirements for supplied components. Please update your QA Manual and resubmit.",
    references: [
      "CA 2021-1034R1 — Summary of Application Procedures and QA Requirements",
      "42 CFR 84.41(b) — Quality Control Plans",
      "SAP for FFRs, Section 5.2 — Quality Assurance Manual Requirements",
    ],
  },
  {
    checklistItemId: 11,
    guidance:
      "Your application materials were submitted on a USB thumb drive, which is not an accepted media format. NIOSH requires all documentation to be provided on CD-R (recordable compact disc) or DVD-R (recordable DVD) media only. Rewritable discs (CD-RW, DVD-RW), USB drives, and cloud-based submissions are not accepted. Please copy all files to a CD-R or DVD-R and resubmit.",
    references: [
      "SAP for FFRs, Section 3.3 — Submission Media Requirements",
    ],
  },
];
