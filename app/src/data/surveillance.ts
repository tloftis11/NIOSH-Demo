export interface FieldAuditResult {
  auditId: string;
  manufacturer: string;
  tcNumber: string;
  product: string;
  testType: string;
  originalBenchmark: number;
  latestResult: number;
  drift: number;
  unit: string;
  threshold: number;
  thresholdDirection: "max" | "min";
  status: "pass" | "warning" | "fail";
  auditDate: string;
}

export interface AuditTrend {
  manufacturer: string;
  tcNumber: string;
  product: string;
  testType: string;
  unit: string;
  threshold: number;
  thresholdDirection: "max" | "min";
  dataPoints: { quarter: string; value: number }[];
}

export interface Complaint {
  complaintId: string;
  date: string;
  source: string;
  manufacturer: string;
  product: string;
  description: string;
  aiSeverity: "High" | "Medium" | "Low";
  aiPriority: number;
  aiRationale: string;
  aiRecommendation: string;
  correlatedAuditIds: string[];
  status: "open" | "under_review" | "resolved";
}

export interface CounterfeitAlert {
  alertId: string;
  date: string;
  source: string;
  product: string;
  claimedTcNumber: string;
  celMatch: "no_match" | "mismatch" | "match_suspect" | "not_applicable";
  celMatchLabel: string;
  issue: string;
  status: string;
}

export const FIELD_AUDIT_RESULTS: FieldAuditResult[] = [
  {
    auditId: "FA-2026-041",
    manufacturer: "BreathGuard Inc.",
    tcNumber: "TC 84A-1234",
    product: "N95 FFR Model BG-200",
    testType: "NaCl Filtration Efficiency",
    originalBenchmark: 98.2,
    latestResult: 97.8,
    drift: -0.4,
    unit: "%",
    threshold: 95,
    thresholdDirection: "min",
    status: "pass",
    auditDate: "2026-02-15",
  },
  {
    auditId: "FA-2026-042",
    manufacturer: "BreathGuard Inc.",
    tcNumber: "TC 84A-1234",
    product: "N95 FFR Model BG-200",
    testType: "Inhalation Resistance",
    originalBenchmark: 33,
    latestResult: 34,
    drift: 1.0,
    unit: "mmH₂O",
    threshold: 35,
    thresholdDirection: "max",
    status: "pass",
    auditDate: "2026-02-15",
  },
  {
    auditId: "FA-2026-043",
    manufacturer: "BreathGuard Inc.",
    tcNumber: "TC 84A-1234",
    product: "N95 FFR Model BG-200",
    testType: "Exhalation Resistance",
    originalBenchmark: 22,
    latestResult: 23,
    drift: 1.0,
    unit: "mmH₂O",
    threshold: 25,
    thresholdDirection: "max",
    status: "pass",
    auditDate: "2026-02-15",
  },
  {
    auditId: "FA-2026-044",
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    testType: "NaCl Filtration Efficiency",
    originalBenchmark: 99.1,
    latestResult: 96.2,
    drift: -2.9,
    unit: "%",
    threshold: 95,
    thresholdDirection: "min",
    status: "warning",
    auditDate: "2026-03-01",
  },
  {
    auditId: "FA-2026-045",
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    testType: "Inhalation Resistance",
    originalBenchmark: 30,
    latestResult: 38,
    drift: 8.0,
    unit: "mmH₂O",
    threshold: 35,
    thresholdDirection: "max",
    status: "warning",
    auditDate: "2026-03-01",
  },
  {
    auditId: "FA-2026-046",
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    testType: "Exhalation Resistance",
    originalBenchmark: 21,
    latestResult: 26,
    drift: 5.0,
    unit: "mmH₂O",
    threshold: 25,
    thresholdDirection: "max",
    status: "warning",
    auditDate: "2026-03-01",
  },
  {
    auditId: "FA-2026-047",
    manufacturer: "TrueFilter Co.",
    tcNumber: "TC 84A-9012",
    product: "P95 FFR Model TF-100",
    testType: "DOP Filtration Efficiency",
    originalBenchmark: 97.5,
    latestResult: 97.3,
    drift: -0.2,
    unit: "%",
    threshold: 95,
    thresholdDirection: "min",
    status: "pass",
    auditDate: "2026-01-20",
  },
];

export const AUDIT_TRENDS: AuditTrend[] = [
  {
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    testType: "NaCl Filtration Efficiency",
    unit: "%",
    threshold: 95,
    thresholdDirection: "min",
    dataPoints: [
      { quarter: "Q1 2025", value: 99.1 },
      { quarter: "Q2 2025", value: 98.4 },
      { quarter: "Q3 2025", value: 97.1 },
      { quarter: "Q1 2026", value: 96.2 },
    ],
  },
  {
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    testType: "Inhalation Resistance",
    unit: "mmH₂O",
    threshold: 35,
    thresholdDirection: "max",
    dataPoints: [
      { quarter: "Q1 2025", value: 30 },
      { quarter: "Q2 2025", value: 32 },
      { quarter: "Q3 2025", value: 34 },
      { quarter: "Q1 2026", value: 38 },
    ],
  },
  {
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    testType: "Exhalation Resistance",
    unit: "mmH₂O",
    threshold: 25,
    thresholdDirection: "max",
    dataPoints: [
      { quarter: "Q1 2025", value: 21 },
      { quarter: "Q2 2025", value: 22 },
      { quarter: "Q3 2025", value: 24 },
      { quarter: "Q1 2026", value: 26 },
    ],
  },
];

export const COMPLAINTS: Complaint[] = [
  {
    complaintId: "CMP-2026-301",
    date: "2026-02-15",
    source: "End User",
    manufacturer: "SafeAir Technologies",
    product: "SA-Pro N95",
    description:
      "Difficulty breathing through mask, feels more restricted than previous batches",
    aiSeverity: "High",
    aiPriority: 1,
    aiRationale:
      "Complaint correlates with field audit FA-2026-045 showing inhalation resistance at 38 mmH₂O (exceeds 35 mmH₂O limit). Pattern suggests manufacturing change affecting breathability.",
    aiRecommendation:
      "Initiate CPIP — correlated with field audit failure on inhalation resistance",
    correlatedAuditIds: ["FA-2026-045"],
    status: "open",
  },
  {
    complaintId: "CMP-2026-302",
    date: "2026-02-18",
    source: "Employer (Hospital)",
    manufacturer: "SafeAir Technologies",
    product: "SA-Pro N95",
    description:
      "Fit test failure rates increased from 5% to 22% in latest shipment",
    aiSeverity: "High",
    aiPriority: 1,
    aiRationale:
      "Second complaint about SafeAir SA-Pro N95 within 3 days. Fit test failure rate increase of 340% suggests significant change in product characteristics. Pattern match with CMP-2026-301.",
    aiRecommendation:
      "Escalate — pattern cluster detected. Request product samples from affected lot for independent testing.",
    correlatedAuditIds: ["FA-2026-044", "FA-2026-045"],
    status: "open",
  },
  {
    complaintId: "CMP-2026-303",
    date: "2026-02-20",
    source: "End User",
    manufacturer: "SafeAir Technologies",
    product: "SA-Pro N95",
    description: "Nose clip feels different, less adjustable",
    aiSeverity: "Medium",
    aiPriority: 2,
    aiRationale:
      "Third SafeAir SA-Pro complaint in 5 days. Nose clip change could indicate unauthorized design or material modification. May relate to overall product quality decline observed in field audits.",
    aiRecommendation:
      "Link to existing SafeAir investigation. Request manufacturer confirm no design changes to nose clip component.",
    correlatedAuditIds: [],
    status: "open",
  },
  {
    complaintId: "CMP-2026-304",
    date: "2026-03-01",
    source: "Distributor",
    manufacturer: "GlobalShield PPE",
    product: "GS-100 N95",
    description:
      "Customer returned batch, packaging looks different than usual",
    aiSeverity: "Medium",
    aiPriority: 3,
    aiRationale:
      "Packaging anomaly from distributor channel. Could indicate counterfeit product or unauthorized packaging change. GlobalShield PPE has active application (AAR-2026-007) but no current approvals.",
    aiRecommendation:
      "Flag for counterfeit investigation — verify if GlobalShield PPE holds any active NIOSH approvals via CEL lookup.",
    correlatedAuditIds: [],
    status: "open",
  },
  {
    complaintId: "CMP-2026-305",
    date: "2026-03-05",
    source: "End User",
    manufacturer: "ReliaMask Co.",
    product: "RM-50 P100",
    description: "Cartridge smells unusual when breathing through it",
    aiSeverity: "Low",
    aiPriority: 4,
    aiRationale:
      "Single isolated report. No correlated field audit data or prior complaints for this product. May be a storage or handling issue rather than manufacturing defect.",
    aiRecommendation:
      "Monitor — log complaint and request follow-up details from user. No immediate action required.",
    correlatedAuditIds: [],
    status: "open",
  },
  {
    complaintId: "CMP-2026-306",
    date: "2026-03-10",
    source: "OSHA Referral",
    manufacturer: "Unknown",
    product: "Unlabeled N95",
    description:
      "Workers using respirators with no visible TC number or NIOSH markings",
    aiSeverity: "High",
    aiPriority: 1,
    aiRationale:
      "OSHA referral indicates workers exposed to potential counterfeit/misrepresented respirators. No NIOSH markings strongly suggests non-approved product being used in workplace setting.",
    aiRecommendation:
      "Initiate counterfeit investigation immediately. Request product samples from OSHA. Cross-reference employer purchase records.",
    correlatedAuditIds: [],
    status: "open",
  },
];

export const COUNTERFEIT_ALERTS: CounterfeitAlert[] = [
  {
    alertId: "CTF-2026-101",
    date: "2026-01-20",
    source: "Marketplace Scan",
    product: '"ZelGuard N95"',
    claimedTcNumber: "TC 84A-0000",
    celMatch: "no_match",
    celMatchLabel: "No Match",
    issue:
      'TC number does not exist in CEL. "ZelGuard" is not a registered approval holder or private label holder. Product markings mimic NIOSH-approved formatting.',
    status: "Open — CPIP initiated",
  },
  {
    alertId: "CTF-2026-102",
    date: "2026-02-05",
    source: "Marketplace Scan",
    product: '"BreathBuddy P100 Filter"',
    claimedTcNumber: "TC 84A-3456",
    celMatch: "mismatch",
    celMatchLabel: "Mismatch",
    issue:
      "TC number belongs to a different manufacturer (not BreathBuddy). BreathBuddy is not a NIOSH approval holder. Product falsely claims compatibility with NIOSH-approved facepieces.",
    status: "Open — Referral to enforcement",
  },
  {
    alertId: "CTF-2026-103",
    date: "2026-02-28",
    source: "Tip from distributor",
    product: "N95 FFR (unmarked)",
    claimedTcNumber: "None visible",
    celMatch: "not_applicable",
    celMatchLabel: "N/A",
    issue:
      'No NIOSH markings present. Product sold online as "NIOSH Approved" without any TC number, manufacturer code, or lot information.',
    status: "Open — Samples requested for testing",
  },
  {
    alertId: "CTF-2026-104",
    date: "2026-03-12",
    source: "Automated label scan",
    product: '"SafeAir SA-Pro" (suspected counterfeit)',
    claimedTcNumber: "TC 84A-5678",
    celMatch: "match_suspect",
    celMatchLabel: "Match but Suspect",
    issue:
      "TC number matches SafeAir Technologies, but packaging shows inconsistencies: font differs from known-good samples, print quality is lower, and box dimensions are slightly different.",
    status: "Under review",
  },
];

// Dashboard KPIs
export const SURVEILLANCE_KPIS = {
  activeApprovalHolders: 98,
  fieldAuditsCompleted: 377,
  openComplaints: 24,
  highPriorityComplaints: 6,
  activeCounterfeitInvestigations: 4,
  overdueForSiteVisit: 3,
  fraudulentListingsInvestigatedYTD: 4163,
};

// Manufacturer risk scores for heatmap
export interface ManufacturerRisk {
  name: string;
  riskScore: number; // 0-100
  auditTrend: "stable" | "declining" | "improving";
  openComplaints: number;
  lastSiteVisit: string;
  overdue: boolean;
}

export const MANUFACTURER_RISKS: ManufacturerRisk[] = [
  {
    name: "SafeAir Technologies",
    riskScore: 85,
    auditTrend: "declining",
    openComplaints: 3,
    lastSiteVisit: "2025-06-15",
    overdue: false,
  },
  {
    name: "BreathGuard Inc.",
    riskScore: 25,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2025-09-01",
    overdue: false,
  },
  {
    name: "TrueFilter Co.",
    riskScore: 10,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2025-11-15",
    overdue: false,
  },
  {
    name: "GlobalShield PPE",
    riskScore: 55,
    auditTrend: "stable",
    openComplaints: 1,
    lastSiteVisit: "N/A",
    overdue: false,
  },
  {
    name: "ReliaMask Co.",
    riskScore: 20,
    auditTrend: "stable",
    openComplaints: 1,
    lastSiteVisit: "N/A",
    overdue: false,
  },
  {
    name: "Apex Respiratory",
    riskScore: 12,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2025-03-10",
    overdue: false,
  },
  {
    name: "ProMask Global Ltd.",
    riskScore: 8,
    auditTrend: "improving",
    openComplaints: 0,
    lastSiteVisit: "2025-08-22",
    overdue: false,
  },
  {
    name: "Vanguard Safety",
    riskScore: 5,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2025-12-01",
    overdue: false,
  },
  {
    name: "OmniFilter Tech",
    riskScore: 15,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2024-01-15",
    overdue: true,
  },
  {
    name: "ClearBreath Mfg.",
    riskScore: 10,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2025-10-05",
    overdue: false,
  },
  {
    name: "PrimeSafe Corp.",
    riskScore: 7,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "2023-11-20",
    overdue: true,
  },
  {
    name: "NovaBreathe Inc.",
    riskScore: 18,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "N/A",
    overdue: false,
  },
  {
    name: "SecureAir Ltd.",
    riskScore: 14,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "N/A",
    overdue: false,
  },
  {
    name: "AirShield Safety Corp",
    riskScore: 22,
    auditTrend: "stable",
    openComplaints: 0,
    lastSiteVisit: "N/A",
    overdue: false,
  },
  {
    name: "Meridian Respirators",
    riskScore: 30,
    auditTrend: "declining",
    openComplaints: 1,
    lastSiteVisit: "2024-02-10",
    overdue: true,
  },
];
