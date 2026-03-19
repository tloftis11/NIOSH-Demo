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

// ─── SAR Air Quality Audit Trends ───
export interface SarAuditTrend {
  manufacturer: string;
  tcNumber: string;
  product: string;
  testType: string;
  unit: string;
  threshold: number;
  thresholdDirection: "max" | "min";
  dataPoints: { quarter: string; value: number }[];
}

export const SAR_AUDIT_TRENDS: SarAuditTrend[] = [
  {
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    testType: "CO Concentration (Breathing Air)",
    unit: " ppm",
    threshold: 10,
    thresholdDirection: "max",
    dataPoints: [
      { quarter: "Q1 2025", value: 3.2 },
      { quarter: "Q2 2025", value: 4.8 },
      { quarter: "Q3 2025", value: 6.5 },
      { quarter: "Q1 2026", value: 8.7 },
    ],
  },
  {
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    testType: "CO₂ Concentration (Breathing Air)",
    unit: " ppm",
    threshold: 1000,
    thresholdDirection: "max",
    dataPoints: [
      { quarter: "Q1 2025", value: 620 },
      { quarter: "Q2 2025", value: 710 },
      { quarter: "Q3 2025", value: 830 },
      { quarter: "Q1 2026", value: 940 },
    ],
  },
  {
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    testType: "Air Flow Rate (Continuous-Flow)",
    unit: " L/min",
    threshold: 115,
    thresholdDirection: "min",
    dataPoints: [
      { quarter: "Q1 2025", value: 142 },
      { quarter: "Q2 2025", value: 135 },
      { quarter: "Q3 2025", value: 126 },
      { quarter: "Q1 2026", value: 119 },
    ],
  },
];

export const SAR_FIELD_AUDITS: FieldAuditResult[] = [
  {
    auditId: "FA-2026-071",
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    testType: "CO Concentration (Breathing Air)",
    originalBenchmark: 3.2,
    latestResult: 8.7,
    drift: 5.5,
    unit: " ppm",
    threshold: 10,
    thresholdDirection: "max",
    status: "warning",
    auditDate: "2026-03-01",
  },
  {
    auditId: "FA-2026-072",
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    testType: "CO₂ Concentration (Breathing Air)",
    originalBenchmark: 620,
    latestResult: 940,
    drift: 320,
    unit: " ppm",
    threshold: 1000,
    thresholdDirection: "max",
    status: "warning",
    auditDate: "2026-03-01",
  },
  {
    auditId: "FA-2026-073",
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    testType: "Air Flow Rate (Continuous-Flow)",
    originalBenchmark: 142,
    latestResult: 119,
    drift: -23,
    unit: " L/min",
    threshold: 115,
    thresholdDirection: "min",
    status: "warning",
    auditDate: "2026-03-01",
  },
];

export const SAR_COMPLAINTS: Complaint[] = [
  {
    complaintId: "CMP-2026-401",
    date: "2026-02-22",
    source: "Fire Department",
    manufacturer: "PrimeSafe Corp.",
    product: "PS-400 SAR Type C",
    description:
      "Firefighters reported breathing air tasted metallic during confined space entry. Compressor system passed pre-entry check.",
    aiSeverity: "High",
    aiPriority: 1,
    aiRationale:
      "Metallic taste in breathing air may indicate elevated CO or oil mist contamination. Correlates with field audit FA-2026-071 showing CO at 8.7 ppm (approaching 10 ppm Grade D limit). Pattern suggests compressor filtration degradation.",
    aiRecommendation:
      "Initiate NRI — request air quality testing of in-service compressor units and product samples from current manufacturing lots.",
    correlatedAuditIds: ["FA-2026-071"],
    status: "open",
  },
  {
    complaintId: "CMP-2026-402",
    date: "2026-03-05",
    source: "MSHA Referral",
    manufacturer: "PrimeSafe Corp.",
    product: "PS-400 SAR Type C",
    description:
      "Mine operator reports reduced airflow from SAR airline system. Workers reported difficulty breathing during extended use.",
    aiSeverity: "High",
    aiPriority: 1,
    aiRationale:
      "Second complaint on PrimeSafe PS-400 within 11 days from different source. MSHA referral for reduced airflow aligns with FA-2026-073 showing flow rate declining toward 115 L/min minimum. Systemic issue suspected.",
    aiRecommendation:
      "Escalate — correlated complaint cluster with field audit data. Request manufacturer verify no changes to air delivery system components.",
    correlatedAuditIds: ["FA-2026-072", "FA-2026-073"],
    status: "open",
  },
];

// ─── LTFE (Long-Term Field Evaluation) Data for SCSRs ───
export interface LtfeResult {
  evalId: string;
  manufacturer: string;
  tcNumber: string;
  product: string;
  mineSite: string;
  mineState: string;
  deploymentDuration: string;
  sampleSize: number;
  visualPassRate: number;
  qltPassRate: number;
  bmsPassRate: number;
  overallStatus: "pass" | "warning" | "fail";
  evalDate: string;
  notes: string;
}

export const LTFE_RESULTS: LtfeResult[] = [
  {
    evalId: "LTFE-2026-001",
    manufacturer: "Ocenco Inc.",
    tcNumber: "TC 13F-0341",
    product: "M-20.3 SCSR/EEBD",
    mineSite: "Federal Mine No. 2",
    mineState: "WV",
    deploymentDuration: "18 months",
    sampleSize: 30,
    visualPassRate: 93,
    qltPassRate: 96,
    bmsPassRate: 100,
    overallStatus: "pass",
    evalDate: "2026-01-15",
    notes:
      "Minor cosmetic damage (scuffing) on 2 units. All units passed QLT and BMS testing within rated service life.",
  },
  {
    evalId: "LTFE-2026-002",
    manufacturer: "Ocenco Inc.",
    tcNumber: "TC 13F-0341",
    product: "M-20.3 SCSR/EEBD",
    mineSite: "Blackwater Mine",
    mineState: "VA",
    deploymentDuration: "36 months",
    sampleSize: 30,
    visualPassRate: 80,
    qltPassRate: 88,
    bmsPassRate: 96,
    overallStatus: "warning",
    evalDate: "2026-02-10",
    notes:
      "6 units failed visual inspection (corrosion on casing). 3 of those also failed QLT at 300 mmH₂O vacuum. 1 unit failed BMS — did not sustain rated duration. Extended deployment in high-humidity environment suspected.",
  },
  {
    evalId: "LTFE-2026-003",
    manufacturer: "CSE Corp.",
    tcNumber: "TC 13F-0288",
    product: "SR-100 SCSR",
    mineSite: "Pinnacle Mine No. 1",
    mineState: "WV",
    deploymentDuration: "48 months",
    sampleSize: 25,
    visualPassRate: 64,
    qltPassRate: 72,
    bmsPassRate: 84,
    overallStatus: "fail",
    evalDate: "2026-02-28",
    notes:
      "9 units failed visual inspection (seal degradation, moisture damage indicators activated). 7 failed QLT. 4 failed BMS — oxygen starter assembly did not activate reliably. Consistent with historical CSE SR-100 issues. Recommend field replacement advisory.",
  },
  {
    evalId: "LTFE-2026-004",
    manufacturer: "Ocenco Inc.",
    tcNumber: "TC 13F-0341",
    product: "M-20.3 SCSR/EEBD",
    mineSite: "USS Eisenhower (CVN-69)",
    mineState: "Navy",
    deploymentDuration: "24 months",
    sampleSize: 20,
    visualPassRate: 95,
    qltPassRate: 100,
    bmsPassRate: 100,
    overallStatus: "pass",
    evalDate: "2026-03-05",
    notes:
      "Navy EEBD evaluation. 1 unit failed visual (dent on protective case). All units passed QLT and BMS. Controlled storage environment contributes to good condition.",
  },
  {
    evalId: "LTFE-2026-005",
    manufacturer: "Biomarine Inc.",
    tcNumber: "TC 13F-0415",
    product: "BioPak 240R SCSR",
    mineSite: "Marshall County Mine",
    mineState: "WV",
    deploymentDuration: "30 months",
    sampleSize: 25,
    visualPassRate: 88,
    qltPassRate: 92,
    bmsPassRate: 100,
    overallStatus: "pass",
    evalDate: "2026-03-10",
    notes:
      "3 units failed visual (scratches, one with damaged carry strap). 2 of those failed QLT. All units passed BMS for rated capacity. Good overall condition.",
  },
];

export interface LtfeTrend {
  manufacturer: string;
  product: string;
  metric: string;
  dataPoints: { phase: string; value: number }[];
}

export const LTFE_TRENDS: LtfeTrend[] = [
  {
    manufacturer: "CSE Corp.",
    product: "SR-100 SCSR",
    metric: "Visual Inspection Pass Rate",
    dataPoints: [
      { phase: "Phase 8 (2024)", value: 82 },
      { phase: "Phase 9 (2025)", value: 74 },
      { phase: "Phase 10 (2026)", value: 64 },
    ],
  },
  {
    manufacturer: "CSE Corp.",
    product: "SR-100 SCSR",
    metric: "QLT Pass Rate (300 mmH₂O)",
    dataPoints: [
      { phase: "Phase 8 (2024)", value: 90 },
      { phase: "Phase 9 (2025)", value: 82 },
      { phase: "Phase 10 (2026)", value: 72 },
    ],
  },
  {
    manufacturer: "CSE Corp.",
    product: "SR-100 SCSR",
    metric: "BMS Pass Rate (Rated Duration)",
    dataPoints: [
      { phase: "Phase 8 (2024)", value: 96 },
      { phase: "Phase 9 (2025)", value: 92 },
      { phase: "Phase 10 (2026)", value: 84 },
    ],
  },
];

// ─── NRI (Nonconformance Response Investigation) Lifecycle ───
export interface NriInvestigation {
  nriId: string;
  manufacturer: string;
  tcNumber: string;
  product: string;
  productType: string;
  triggerType: string;
  triggerIds: string[];
  openDate: string;
  status: "open" | "manufacturer_response" | "niosh_review" | "corrective_action" | "closed";
  statusLabel: string;
  timeline: { date: string; event: string; detail: string; status: "completed" | "current" | "pending" }[];
  severity: "critical" | "major" | "minor";
}

export const NRI_INVESTIGATIONS: NriInvestigation[] = [
  {
    nriId: "NRI-2026-004",
    manufacturer: "SafeAir Technologies",
    tcNumber: "TC 84A-5678",
    product: "N95 FFR Model SA-Pro",
    productType: "N95 FFR",
    triggerType: "Field audit failure + complaint cluster",
    triggerIds: ["FA-2026-044", "FA-2026-045", "FA-2026-046", "CMP-2026-301", "CMP-2026-302", "CMP-2026-303"],
    openDate: "2026-03-12",
    status: "manufacturer_response",
    statusLabel: "Awaiting Manufacturer FMEA",
    severity: "critical",
    timeline: [
      { date: "2026-03-01", event: "Performance drift detected", detail: "Field audits FA-2026-044/045/046 show filtration and resistance drift across all three parameters.", status: "completed" },
      { date: "2026-03-05", event: "Complaint cluster identified", detail: "3 complaints (CMP-2026-301/302/303) in 5 days correlated with audit findings. AI auto-trigger threshold met.", status: "completed" },
      { date: "2026-03-12", event: "NRI opened — Opening letter sent", detail: "Manufacturer notified per CA 2023-1062. 30-day response deadline for root cause analysis (FMEA).", status: "completed" },
      { date: "2026-04-11", event: "Manufacturer FMEA due", detail: "SafeAir Technologies must submit failure modes and effects analysis with corrective action plan.", status: "current" },
      { date: "", event: "NIOSH review of corrective actions", detail: "NPPTL engineering team reviews proposed corrective actions for adequacy.", status: "pending" },
      { date: "", event: "Corrective action implementation", detail: "Manufacturer implements approved actions on field units, inventory, and production.", status: "pending" },
      { date: "", event: "Verification & closing", detail: "NIOSH verifies implementation via follow-up audit. NRI closed upon satisfactory completion.", status: "pending" },
    ],
  },
  {
    nriId: "NRI-2026-005",
    manufacturer: "PrimeSafe Corp.",
    tcNumber: "TC 84A-7821",
    product: "SAR Type C Model PS-400",
    productType: "SAR Type C",
    triggerType: "Field audit warning + MSHA referral",
    triggerIds: ["FA-2026-071", "FA-2026-072", "FA-2026-073", "CMP-2026-401", "CMP-2026-402"],
    openDate: "2026-03-15",
    status: "open",
    statusLabel: "Opening Letter Sent",
    severity: "critical",
    timeline: [
      { date: "2026-03-01", event: "Air quality drift detected", detail: "CO trending toward 10 ppm Grade D limit. CO₂ and airflow rate also declining.", status: "completed" },
      { date: "2026-03-05", event: "MSHA referral received", detail: "Mine operator reports reduced airflow. Fire department reports metallic taste in breathing air.", status: "completed" },
      { date: "2026-03-15", event: "NRI opened — Opening letter sent", detail: "Manufacturer notified per CA 2023-1062. 30-day response deadline.", status: "current" },
      { date: "2026-04-14", event: "Manufacturer FMEA due", detail: "PrimeSafe Corp. must submit root cause analysis with corrective action plan.", status: "pending" },
      { date: "", event: "NIOSH review of corrective actions", detail: "Review of proposed corrective actions.", status: "pending" },
      { date: "", event: "Corrective action implementation", detail: "Implementation on field units and production.", status: "pending" },
      { date: "", event: "Verification & closing", detail: "Follow-up audit and NRI closure.", status: "pending" },
    ],
  },
  {
    nriId: "NRI-2025-018",
    manufacturer: "Meridian Respirators",
    tcNumber: "TC 84A-6543",
    product: "P100 Elastomeric MR-Elite",
    productType: "P100 Elastomeric",
    triggerType: "Site audit nonconformance",
    triggerIds: ["SA-2025-089"],
    openDate: "2025-09-20",
    status: "corrective_action",
    statusLabel: "Corrective Action In Progress",
    severity: "major",
    timeline: [
      { date: "2025-09-15", event: "Site audit nonconformance", detail: "Biennial site visit found unauthorized change to exhalation valve material supplier.", status: "completed" },
      { date: "2025-09-20", event: "NRI opened", detail: "Opening letter sent. 30-day deadline for FMEA.", status: "completed" },
      { date: "2025-10-18", event: "Manufacturer FMEA received", detail: "Root cause: procurement team changed supplier without engineering review or NIOSH notification.", status: "completed" },
      { date: "2025-11-05", event: "NIOSH approved corrective actions", detail: "Actions approved: revert to original supplier, update change control procedures, retrain procurement staff.", status: "completed" },
      { date: "2025-12-01", event: "Corrective action implementation", detail: "Manufacturer reverted supplier. Procedure updates submitted. Staff training in progress.", status: "current" },
      { date: "", event: "Verification audit", detail: "Follow-up site visit to verify implementation.", status: "pending" },
    ],
  },
  {
    nriId: "NRI-2025-012",
    manufacturer: "AirShield Safety Corp",
    tcNumber: "TC 84A-4411",
    product: "N95 FFR AS-Lite",
    productType: "N95 FFR",
    triggerType: "Field audit failure",
    triggerIds: ["FA-2025-198"],
    openDate: "2025-05-10",
    status: "closed",
    statusLabel: "Closed — Resolved",
    severity: "minor",
    timeline: [
      { date: "2025-05-01", event: "Field audit flagged labeling issue", detail: "Lot numbers missing from individual packaging on sampled units.", status: "completed" },
      { date: "2025-05-10", event: "NRI opened", detail: "Opening letter sent.", status: "completed" },
      { date: "2025-06-05", event: "Manufacturer response received", detail: "Root cause: label printer malfunction on one production line. Affected lot identified and quarantined.", status: "completed" },
      { date: "2025-06-15", event: "NIOSH approved corrective actions", detail: "Actions: relabel affected inventory, add printer verification step to QC checklist.", status: "completed" },
      { date: "2025-07-01", event: "Implementation verified", detail: "Follow-up audit confirmed corrective actions in place.", status: "completed" },
      { date: "2025-07-10", event: "NRI closed", detail: "Closing letter sent. No further action required.", status: "completed" },
    ],
  },
];

// ─── MSHA Coordination Data ───
export interface MshaCoordination {
  referralId: string;
  mineId: string;
  mineName: string;
  mineState: string;
  operator: string;
  date: string;
  type: string;
  relatedProduct: string;
  relatedManufacturer: string;
  description: string;
  status: string;
  nioshAction: string;
  linkedNri: string;
}

export const MSHA_COORDINATIONS: MshaCoordination[] = [
  {
    referralId: "MSHA-REF-2026-041",
    mineId: "46-01234",
    mineName: "Federal Mine No. 2",
    mineState: "WV",
    operator: "Alpha Natural Resources",
    date: "2026-02-28",
    type: "SCSR Field Failure Report",
    relatedProduct: "SR-100 SCSR",
    relatedManufacturer: "CSE Corp.",
    description:
      "During quarterly SCSR inspection, mine operator found 4 out of 20 units with activated moisture damage indicators. Units were within rated shelf life but stored in high-humidity crosscut.",
    status: "Under investigation",
    nioshAction: "LTFE evaluation LTFE-2026-003 initiated at this site. Preliminary results confirm elevated failure rates.",
    linkedNri: "",
  },
  {
    referralId: "MSHA-REF-2026-042",
    mineId: "46-05678",
    mineName: "Blackwater Mine",
    mineState: "VA",
    operator: "Arch Resources",
    date: "2026-03-05",
    type: "SAR Airflow Complaint",
    relatedProduct: "PS-400 SAR Type C",
    relatedManufacturer: "PrimeSafe Corp.",
    description:
      "Workers reported difficulty breathing through SAR airline system during extended use in low-seam section. Compressor system certified and within service date.",
    status: "Linked to active NRI",
    nioshAction: "Complaint correlated with NRI-2026-005. Air quality samples requested from mine site.",
    linkedNri: "NRI-2026-005",
  },
  {
    referralId: "MSHA-REF-2026-043",
    mineId: "15-09012",
    mineName: "Pinnacle Mine No. 1",
    mineState: "WV",
    operator: "CONSOL Energy",
    date: "2026-01-15",
    type: "SCSR Deployment Compliance",
    relatedProduct: "M-20.3 SCSR/EEBD",
    relatedManufacturer: "Ocenco Inc.",
    description:
      "Routine 30 CFR 75.1714 compliance check. All miners have access to SCSRs. 2 cache locations had units past recommended inspection date.",
    status: "Resolved",
    nioshAction: "Mine operator replaced overdue units. LTFE evaluation confirmed remaining units in good condition (LTFE-2026-001).",
    linkedNri: "",
  },
  {
    referralId: "MSHA-REF-2026-044",
    mineId: "46-01234",
    mineName: "Federal Mine No. 2",
    mineState: "WV",
    operator: "Alpha Natural Resources",
    date: "2026-03-12",
    type: "Joint NIOSH/MSHA Investigation",
    relatedProduct: "SR-100 SCSR",
    relatedManufacturer: "CSE Corp.",
    description:
      "Based on LTFE-2026-003 results (64% visual pass, 72% QLT pass, 84% BMS pass), MSHA requesting joint determination on field replacement advisory for all SR-100 units deployed more than 36 months.",
    status: "Pending joint determination",
    nioshAction: "Drafting field replacement advisory. Coordinating with MSHA on scope (all mines vs. high-humidity sites only).",
    linkedNri: "",
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
