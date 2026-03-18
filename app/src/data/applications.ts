export type ApprovalStage =
  | "Questionnaire"
  | "Manufacturer Code"
  | "Formal Submission"
  | "Engineering Review"
  | "Lab Testing"
  | "QMS Review"
  | "Final Review";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export type ApplicantType = "New Applicant" | "Existing Holder";

export interface StageTransition {
  stage: ApprovalStage;
  enteredDate: string;
  completedDate?: string;
  reviewer?: string;
}

export interface DeficiencyItem {
  id: string;
  description: string;
  status: "open" | "resolved";
  openedDate: string;
  resolvedDate?: string;
}

export interface Application {
  appId: string;
  manufacturer: string;
  applicantType: ApplicantType;
  respiratorClass: string;
  currentStage: ApprovalStage;
  daysInStage: number;
  country: string;
  riskLevel: RiskLevel;
  riskFactors: string[];
  recommendedActions: string[];
  assignedReviewer: string;
  slaTargetDate: string;
  intakeCompletenessScore: number;
  stageHistory: StageTransition[];
  deficiencies: DeficiencyItem[];
}

export const STAGE_ORDER: ApprovalStage[] = [
  "Questionnaire",
  "Manufacturer Code",
  "Formal Submission",
  "Engineering Review",
  "Lab Testing",
  "QMS Review",
  "Final Review",
];

export const STAGE_MEDIAN_DAYS: Record<ApprovalStage, number> = {
  Questionnaire: 30,
  "Manufacturer Code": 14,
  "Formal Submission": 21,
  "Engineering Review": 20,
  "Lab Testing": 45,
  "QMS Review": 35,
  "Final Review": 14,
};

export const APPLICATIONS: Application[] = [
  {
    appId: "AAR-2026-001",
    manufacturer: "AirShield Safety Corp",
    applicantType: "New Applicant",
    respiratorClass: "N95 FFR",
    currentStage: "Formal Submission",
    daysInStage: 12,
    country: "USA",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "J. Martinez",
    slaTargetDate: "2026-04-15",
    intakeCompletenessScore: 58,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2025-11-01",
        completedDate: "2025-11-20",
      },
      {
        stage: "Manufacturer Code",
        enteredDate: "2025-11-20",
        completedDate: "2025-12-05",
      },
      { stage: "Formal Submission", enteredDate: "2026-03-03" },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-002",
    manufacturer: "BreathGuard Inc.",
    applicantType: "New Applicant",
    respiratorClass: "P100 Elastomeric Half-Mask",
    currentStage: "Engineering Review",
    daysInStage: 45,
    country: "China",
    riskLevel: "HIGH",
    riskFactors: [
      "New applicant with no prior NIOSH approvals",
      "Engineering review duration 2.25x median (45 days vs. 20-day median)",
      "2 open deficiency items unresolved",
      "Manufacturing site in Shenzhen, China — site qualification visit not yet scheduled",
    ],
    recommendedActions: [
      "Escalate to senior reviewer for deficiency resolution",
      "Initiate site qualification scheduling with international travel office",
      "Request updated drawings from manufacturer within 10 business days",
    ],
    assignedReviewer: "R. Thompson",
    slaTargetDate: "2026-02-28",
    intakeCompletenessScore: 72,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2025-06-15",
        completedDate: "2025-07-20",
      },
      {
        stage: "Manufacturer Code",
        enteredDate: "2025-07-20",
        completedDate: "2025-08-01",
      },
      {
        stage: "Formal Submission",
        enteredDate: "2025-10-01",
        completedDate: "2025-10-28",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2026-01-30",
        reviewer: "R. Thompson",
      },
    ],
    deficiencies: [
      {
        id: "DEF-002-A",
        description:
          "Drawing discrepancy on valve subassembly — exhalation valve dimensions do not match specification sheet",
        status: "open",
        openedDate: "2026-02-10",
      },
      {
        id: "DEF-002-B",
        description:
          "Label copy pending revision — NIOSH approval number placeholder format incorrect",
        status: "open",
        openedDate: "2026-02-15",
      },
    ],
  },
  {
    appId: "AAR-2026-003",
    manufacturer: "ProMask Global Ltd.",
    applicantType: "Existing Holder",
    respiratorClass: "PAPR (CBRN)",
    currentStage: "Lab Testing",
    daysInStage: 30,
    country: "Germany",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "K. Chen",
    slaTargetDate: "2026-05-01",
    intakeCompletenessScore: 95,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-09-01",
        completedDate: "2025-09-20",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-09-20",
        completedDate: "2025-11-15",
      },
      { stage: "Lab Testing", enteredDate: "2026-02-15", reviewer: "K. Chen" },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-004",
    manufacturer: "SafeAir Technologies",
    applicantType: "New Applicant",
    respiratorClass: "N95 FFR",
    currentStage: "QMS Review",
    daysInStage: 60,
    country: "India",
    riskLevel: "HIGH",
    riskFactors: [
      "New applicant — first NIOSH application",
      "QMS review duration 1.7x median (60 days vs. 35-day median)",
      "3 open corrective actions from site qualification visit",
      "Manufacturing site in Mumbai, India — follow-up visit required",
      "Initial intake completeness score was low (65%)",
    ],
    recommendedActions: [
      "Schedule follow-up site qualification visit to verify corrective actions",
      "Request updated QA Manual addressing site visit findings within 15 business days",
      "Assign QMS specialist for accelerated review upon resubmission",
    ],
    assignedReviewer: "L. Patel",
    slaTargetDate: "2026-03-01",
    intakeCompletenessScore: 65,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2025-03-01",
        completedDate: "2025-04-10",
      },
      {
        stage: "Manufacturer Code",
        enteredDate: "2025-04-10",
        completedDate: "2025-04-25",
      },
      {
        stage: "Formal Submission",
        enteredDate: "2025-06-01",
        completedDate: "2025-07-15",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-07-15",
        completedDate: "2025-09-10",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2025-09-10",
        completedDate: "2025-11-20",
      },
      {
        stage: "QMS Review",
        enteredDate: "2026-01-15",
        reviewer: "L. Patel",
      },
    ],
    deficiencies: [
      {
        id: "DEF-004-A",
        description:
          "Site qualification finding: incoming inspection procedure does not include sampling plan for filter media raw material",
        status: "open",
        openedDate: "2026-02-01",
      },
      {
        id: "DEF-004-B",
        description:
          "Site qualification finding: calibration records for flow meter used in production testing were expired",
        status: "open",
        openedDate: "2026-02-01",
      },
      {
        id: "DEF-004-C",
        description:
          "Site qualification finding: classification of defects does not match approved quality plan",
        status: "open",
        openedDate: "2026-02-01",
      },
    ],
  },
  {
    appId: "AAR-2026-005",
    manufacturer: "TrueFilter Co.",
    applicantType: "Existing Holder",
    respiratorClass: "P95 FFR",
    currentStage: "Final Review",
    daysInStage: 5,
    country: "USA",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "M. Williams",
    slaTargetDate: "2026-04-01",
    intakeCompletenessScore: 100,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-08-01",
        completedDate: "2025-08-15",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-08-15",
        completedDate: "2025-09-10",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2025-09-10",
        completedDate: "2025-12-01",
      },
      {
        stage: "QMS Review",
        enteredDate: "2025-12-01",
        completedDate: "2026-02-15",
      },
      {
        stage: "Final Review",
        enteredDate: "2026-03-12",
        reviewer: "M. Williams",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-006",
    manufacturer: "Apex Respiratory",
    applicantType: "Existing Holder",
    respiratorClass: "SCBA",
    currentStage: "Lab Testing",
    daysInStage: 20,
    country: "USA",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "D. Brooks",
    slaTargetDate: "2026-06-01",
    intakeCompletenessScore: 92,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-11-01",
        completedDate: "2025-11-20",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-11-20",
        completedDate: "2026-01-15",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2026-02-25",
        reviewer: "D. Brooks",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-007",
    manufacturer: "GlobalShield PPE",
    applicantType: "New Applicant",
    respiratorClass: "N95 FFR",
    currentStage: "Questionnaire",
    daysInStage: 90,
    country: "Vietnam",
    riskLevel: "MEDIUM",
    riskFactors: [
      "Questionnaire stage duration 3x median (90 days vs. 30-day median)",
      "New applicant from country with limited NIOSH approval history",
      "Incomplete questionnaire responses — follow-up requested but no reply in 30 days",
    ],
    recommendedActions: [
      "Send final follow-up notice with 15-day response deadline",
      "If no response, close application and notify manufacturer of reapplication process",
    ],
    assignedReviewer: "S. Kim",
    slaTargetDate: "2026-01-15",
    intakeCompletenessScore: 0,
    stageHistory: [
      { stage: "Questionnaire", enteredDate: "2025-12-17", reviewer: "S. Kim" },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-008",
    manufacturer: "ClearBreath Mfg.",
    applicantType: "Existing Holder",
    respiratorClass: "Elastomeric Full-Face",
    currentStage: "Engineering Review",
    daysInStage: 15,
    country: "South Korea",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "R. Thompson",
    slaTargetDate: "2026-05-01",
    intakeCompletenessScore: 98,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-12-01",
        completedDate: "2025-12-18",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2026-03-02",
        reviewer: "R. Thompson",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-009",
    manufacturer: "SecureAir Ltd.",
    applicantType: "New Applicant",
    respiratorClass: "Gas Mask (CBRN)",
    currentStage: "Formal Submission",
    daysInStage: 8,
    country: "UK",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "J. Martinez",
    slaTargetDate: "2026-05-15",
    intakeCompletenessScore: 88,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2025-08-01",
        completedDate: "2025-09-01",
      },
      {
        stage: "Manufacturer Code",
        enteredDate: "2025-09-01",
        completedDate: "2025-09-15",
      },
      { stage: "Formal Submission", enteredDate: "2026-03-09" },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-010",
    manufacturer: "PrimeSafe Corp.",
    applicantType: "Existing Holder",
    respiratorClass: "SAR Type C",
    currentStage: "Final Review",
    daysInStage: 3,
    country: "USA",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "M. Williams",
    slaTargetDate: "2026-04-01",
    intakeCompletenessScore: 100,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-05-01",
        completedDate: "2025-05-20",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-05-20",
        completedDate: "2025-07-01",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2025-07-01",
        completedDate: "2025-10-15",
      },
      {
        stage: "QMS Review",
        enteredDate: "2025-10-15",
        completedDate: "2026-01-20",
      },
      {
        stage: "Final Review",
        enteredDate: "2026-03-14",
        reviewer: "M. Williams",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-011",
    manufacturer: "NovaBreathe Inc.",
    applicantType: "New Applicant",
    respiratorClass: "N95 FFR",
    currentStage: "QMS Review",
    daysInStage: 40,
    country: "Mexico",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "L. Patel",
    slaTargetDate: "2026-04-30",
    intakeCompletenessScore: 82,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2025-04-01",
        completedDate: "2025-05-01",
      },
      {
        stage: "Manufacturer Code",
        enteredDate: "2025-05-01",
        completedDate: "2025-05-15",
      },
      {
        stage: "Formal Submission",
        enteredDate: "2025-07-01",
        completedDate: "2025-07-25",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-07-25",
        completedDate: "2025-09-15",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2025-09-15",
        completedDate: "2025-12-10",
      },
      {
        stage: "QMS Review",
        enteredDate: "2026-02-05",
        reviewer: "L. Patel",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-012",
    manufacturer: "OmniFilter Tech",
    applicantType: "Existing Holder",
    respiratorClass: "CCER",
    currentStage: "Lab Testing",
    daysInStage: 55,
    country: "Japan",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "K. Chen",
    slaTargetDate: "2026-05-15",
    intakeCompletenessScore: 96,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-08-15",
        completedDate: "2025-09-01",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-09-01",
        completedDate: "2025-10-20",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2026-01-22",
        reviewer: "K. Chen",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-013",
    manufacturer: "ReliaMask Co.",
    applicantType: "New Applicant",
    respiratorClass: "P100 FFR",
    currentStage: "Engineering Review",
    daysInStage: 35,
    country: "China",
    riskLevel: "MEDIUM",
    riskFactors: [
      "New applicant with no prior NIOSH approvals",
      "Engineering review duration 1.75x median (35 days vs. 20-day median)",
      "1 open deficiency item pending manufacturer response",
      "Manufacturing site in Guangzhou, China",
    ],
    recommendedActions: [
      "Follow up with manufacturer on open deficiency item",
      "Begin site qualification planning for Guangzhou facility",
    ],
    assignedReviewer: "R. Thompson",
    slaTargetDate: "2026-04-15",
    intakeCompletenessScore: 78,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2025-07-01",
        completedDate: "2025-08-05",
      },
      {
        stage: "Manufacturer Code",
        enteredDate: "2025-08-05",
        completedDate: "2025-08-20",
      },
      {
        stage: "Formal Submission",
        enteredDate: "2025-10-15",
        completedDate: "2025-11-10",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2026-02-10",
        reviewer: "R. Thompson",
      },
    ],
    deficiencies: [
      {
        id: "DEF-013-A",
        description:
          "Filter media specification sheet lists different material grade than what appears in the assembly drawing",
        status: "open",
        openedDate: "2026-02-25",
      },
    ],
  },
  {
    appId: "AAR-2026-014",
    manufacturer: "Vanguard Safety",
    applicantType: "Existing Holder",
    respiratorClass: "PAPR",
    currentStage: "Final Review",
    daysInStage: 7,
    country: "Canada",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "M. Williams",
    slaTargetDate: "2026-04-01",
    intakeCompletenessScore: 100,
    stageHistory: [
      {
        stage: "Formal Submission",
        enteredDate: "2025-06-01",
        completedDate: "2025-06-20",
      },
      {
        stage: "Engineering Review",
        enteredDate: "2025-06-20",
        completedDate: "2025-08-10",
      },
      {
        stage: "Lab Testing",
        enteredDate: "2025-08-10",
        completedDate: "2025-11-30",
      },
      {
        stage: "QMS Review",
        enteredDate: "2025-11-30",
        completedDate: "2026-02-20",
      },
      {
        stage: "Final Review",
        enteredDate: "2026-03-10",
        reviewer: "M. Williams",
      },
    ],
    deficiencies: [],
  },
  {
    appId: "AAR-2026-015",
    manufacturer: "PureAir Dynamics",
    applicantType: "New Applicant",
    respiratorClass: "Elastomeric Half-Mask",
    currentStage: "Questionnaire",
    daysInStage: 10,
    country: "USA",
    riskLevel: "NONE",
    riskFactors: [],
    recommendedActions: [],
    assignedReviewer: "S. Kim",
    slaTargetDate: "2026-05-01",
    intakeCompletenessScore: 0,
    stageHistory: [
      {
        stage: "Questionnaire",
        enteredDate: "2026-03-07",
        reviewer: "S. Kim",
      },
    ],
    deficiencies: [],
  },
];

// Analytics data
export const THROUGHPUT_DATA = [
  { quarter: "Q1 2025", approvals: 8, denials: 2, pending: 12 },
  { quarter: "Q2 2025", approvals: 11, denials: 3, pending: 15 },
  { quarter: "Q3 2025", approvals: 9, denials: 1, pending: 18 },
  { quarter: "Q4 2025", approvals: 12, denials: 2, pending: 14 },
  { quarter: "Q1 2026", approvals: 5, denials: 1, pending: 15 },
];

export const AVG_DAYS_BY_CLASS = [
  { className: "N95 FFR", avgDays: 185 },
  { className: "P95/P100 FFR", avgDays: 210 },
  { className: "Elastomeric", avgDays: 240 },
  { className: "PAPR", avgDays: 280 },
  { className: "SCBA", avgDays: 310 },
  { className: "CBRN", avgDays: 350 },
  { className: "Gas Mask", avgDays: 260 },
  { className: "SAR", avgDays: 230 },
  { className: "CCER", avgDays: 270 },
];
