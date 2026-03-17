# NIOSH RAP AI-Assisted Platform — Demo Plans

## Modules Covered: 1 (Intelligent Intake & Pre-Screening), 2 (Application Lifecycle Tracker), 5 (Post-Market Surveillance Dashboard)

---

## Module 1: Intelligent Intake & Pre-Screening

### Problem Being Demonstrated

NIOSH frequently receives incomplete or non-compliant application packages from respirator manufacturers. Reviewers spend significant time identifying missing documents, mismatched drawings, and fee issues — work that could be caught automatically before a human reviewer is ever assigned. High rejection rates among new applicants are often due to administrative gaps rather than genuine product failures.

### Demo Scenario

A fictional manufacturer, **"AirShield Safety Corp"** (manufacturer code: `ASC`), submits an application package for a new **N95 Filtering Facepiece Respirator** under the SAP for Air-Purifying Filtering Facepiece Respirators. The package has been intentionally prepared with several realistic deficiencies that the AI pre-screening system must detect.

### Demo Data

The demo will use a **simulated application package** (JSON/structured data) representing the contents of AirShield's submission, checked against the real SAP checklist requirements for FFRs.

**SAP Checklist Items for FFRs (from Section 6 of the SAP):**

| # | Required Item | Status in Demo Submission |
|---|---------------|--------------------------|
| 1 | Completed Standard Application Form | Present |
| 2 | $200 application fee (check dated within 30 days, AAR# written on check) | **DEFICIENT** — check dated 45 days ago |
| 3 | Assembly Matrix (all hardware configurations) | Present |
| 4 | Exploded-view drawings per Drawing Checklist (Section 6.2) | **DEFICIENT** — missing nose-clip subassembly detail |
| 5 | All Major Subassemblies documentation | **DEFICIENT** — headband elastic supplier info missing |
| 6 | Packaging and label copy | Present |
| 7 | Detailed user instructions | Present |
| 8 | Product Quality Plan | Present but **DEFICIENT** — sampling plan references ISO 2859-1 but does not specify AQL levels for critical vs. major defects per 42 CFR 84.41 |
| 9 | Quality Assurance Manual | **DEFICIENT** — does not include supplier/subcontractor agreement documentation (per CA 2021-1034R1) |
| 10 | Test samples (produced under complete proposed QMS) | Present |
| 11 | Media format: CD-R or DVD-R | **DEFICIENT** — submitted on USB thumb drive |
| 12 | Private Label Checklist (Section 6.3 for FFRs) | N/A (not a private label application) |

**42 CFR Part 84 Cross-Reference Checks:**
- Subpart B (Application): Verify application form completeness
- Subpart E (Quality Control), Sec. 84.41-84.43: Verify quality plan includes inspection procedures, classification of defects, sampling plans, and sampling levels
- Subpart K (Particulate Respirators): Confirm N95 classification is correctly stated and test data references NaCl aerosol testing

### Demo Walkthrough

**Screen 1 — Upload & Parse**
- User uploads the application package (simulated as structured data)
- System identifies the respirator class as FFR and selects the correct SAP checklist
- Progress indicator shows document parsing and classification

**Screen 2 — Completeness Report**
- A structured checklist view shows each SAP requirement with a status: PASS, FAIL, or WARNING
- 5 items flagged as DEFICIENT (see table above)
- Each deficiency includes:
  - What is missing or non-compliant
  - The specific SAP section or CFR citation that requires it
  - A severity level (Critical / Major / Minor)
    - Critical: Fee check expired, QA Manual missing supplier agreements
    - Major: Missing drawing detail, missing subassembly info, wrong media format
    - Minor: Quality plan AQL levels not explicit

**Screen 3 — AI-Generated Guidance**
- For each deficiency, the system generates plain-language remediation guidance drawn from:
  - The applicable SAP text
  - Conformity Assessment Notices (e.g., CA 2021-1034R1 on supplier agreements)
  - 42 CFR Part 84 regulatory text
- Example output for the QA Manual deficiency:
  > "Your Quality Assurance Manual does not include documentation of supplier and subcontractor agreements. Per Conformity Assessment Notice CA 2021-1034R1 and 42 CFR 84.41(b), your QA manual must describe how you ensure that components sourced from suppliers and subcontractors meet the specifications established in your quality plan. Please include signed supplier agreements or a supplier qualification procedure."

**Screen 4 — Summary & Export**
- Overall submission readiness score (e.g., "3 of 12 requirements fully met without issues")
- Exportable PDF report the applicant can use to fix deficiencies before resubmission
- Option for NIOSH reviewer to see the pre-screening results if the applicant proceeds anyway

### Technical Approach

| Component | Implementation |
|-----------|---------------|
| **Frontend** | React web app with a file upload interface, checklist view, and guidance panel |
| **SAP Rules Engine** | A structured JSON/YAML rule set encoding each SAP's checklist requirements — one rule file per respirator class |
| **Document Parser** | Simulated for demo — in production this would use document AI (OCR + extraction); for the demo, the input will be pre-structured JSON representing an already-parsed package |
| **AI Guidance Generator** | LLM call (Claude API) with a system prompt containing relevant SAP excerpts, CA notices, and 42 CFR Part 84 text; generates remediation guidance per deficiency |
| **Completeness Scorer** | Simple rule-based scoring: count of pass/fail/warning items, weighted by severity |

### Key Data Sources for Demo Content

- SAP for Air-Purifying Filtering Facepiece Respirators (Section 6 checklists)
- 42 CFR Part 84, Subparts B, E, K
- CA 2021-1034R1 (application procedures and QA requirements)
- NIOSH Publication 2023-132 ("Know Before You Apply")

---

## Module 2: Application Lifecycle Tracker

### Problem Being Demonstrated

Each NIOSH respirator approval application moves through 7 defined stages with different reviewers, labs, and timelines. Program managers currently lack a unified view of where applications stand, which are at risk of stalling, and where resources should be allocated. The demo shows a workflow dashboard with AI-powered stall prediction.

### Demo Scenario

The demo presents a **portfolio view of 15 simulated applications** at various stages of the approval process. The applications span multiple respirator classes, manufacturer types (new vs. existing approval holders), and manufacturing countries. Three applications have been flagged by the AI as "at risk" of stalling.

### Demo Data

**15 Simulated Applications:**

| App ID | Manufacturer | Type | Respirator Class | Stage | Days in Stage | Country | Risk Flag |
|--------|-------------|------|-----------------|-------|---------------|---------|-----------|
| AAR-2026-001 | AirShield Safety Corp | New Applicant | N95 FFR | Formal Submission | 12 | USA | None |
| AAR-2026-002 | BreathGuard Inc. | New Applicant | P100 Elastomeric Half-Mask | Engineering Review | 45 | China | **HIGH** |
| AAR-2026-003 | ProMask Global Ltd. | Existing Holder | PAPR (CBRN) | Lab Testing | 30 | Germany | None |
| AAR-2026-004 | SafeAir Technologies | New Applicant | N95 FFR | QMS Review | 60 | India | **HIGH** |
| AAR-2026-005 | TrueFilter Co. | Existing Holder | P95 FFR | Final Review | 5 | USA | None |
| AAR-2026-006 | Apex Respiratory | Existing Holder | SCBA | Lab Testing | 20 | USA | None |
| AAR-2026-007 | GlobalShield PPE | New Applicant | N95 FFR | Questionnaire | 90 | Vietnam | **MEDIUM** |
| AAR-2026-008 | ClearBreath Mfg. | Existing Holder | Elastomeric Full-Face | Engineering Review | 15 | South Korea | None |
| AAR-2026-009 | SecureAir Ltd. | New Applicant | Gas Mask (CBRN) | Formal Submission | 8 | UK | None |
| AAR-2026-010 | PrimeSafe Corp. | Existing Holder | SAR Type C | Final Review | 3 | USA | None |
| AAR-2026-011 | NovaBreathe Inc. | New Applicant | N95 FFR | QMS Review | 40 | Mexico | None |
| AAR-2026-012 | OmniFilter Tech | Existing Holder | CCER | Lab Testing | 55 | Japan | None |
| AAR-2026-013 | ReliaMask Co. | New Applicant | P100 FFR | Engineering Review | 35 | China | **MEDIUM** |
| AAR-2026-014 | Vanguard Safety | Existing Holder | PAPR | Final Review | 7 | Canada | None |
| AAR-2026-015 | PureAir Dynamics | New Applicant | Elastomeric Half-Mask | Questionnaire | 10 | USA | None |

**AI Risk Prediction Factors (features used by the model):**

| Factor | Weight | Rationale |
|--------|--------|-----------|
| Applicant type (new vs. existing) | High | New applicants historically have much higher rejection/stall rates |
| Days in current stage vs. median for that stage | High | Exceeding typical duration signals a problem |
| Respirator class complexity | Medium | CBRN and SCBA classes have longer, more complex reviews |
| Manufacturing country | Medium | International sites add coordination complexity and site-visit scheduling difficulty |
| Completeness score at intake (Module 1) | Medium | Low intake scores correlate with downstream delays |
| Number of open deficiency items | High | Unresolved deficiencies are the #1 cause of stalls |
| Historical pass rate for this manufacturer | Low | Track record provides baseline expectation |

### Demo Walkthrough

**Screen 1 — Portfolio Dashboard**
- Kanban-style board with 7 columns representing the approval stages:
  1. Questionnaire
  2. Manufacturer Code Assignment
  3. Formal Submission
  4. Engineering Review
  5. Lab Testing
  6. QMS Review
  7. Final Review / Approval-Denial
- Each application is a card showing: App ID, manufacturer name, respirator class, days in stage, and risk badge (color-coded)
- Summary bar at top: total active applications, count per stage, count flagged at-risk

**Screen 2 — Risk Analysis Detail (click on AAR-2026-002)**
- Application detail panel showing:
  - Full timeline of stage transitions with dates
  - Current stage: Engineering Review (45 days — median for this stage is 20 days)
  - Risk factors identified by AI:
    - "New applicant with no prior NIOSH approvals"
    - "Engineering review duration 2.25x median"
    - "2 open deficiency items: drawing discrepancy on valve subassembly, label copy pending revision"
    - "Manufacturing site in Shenzhen, China — site qualification visit not yet scheduled"
  - Recommended actions:
    - "Escalate to senior reviewer for deficiency resolution"
    - "Initiate site qualification scheduling with international travel office"
  - Assigned reviewer, SLA target date, and escalation status

**Screen 3 — Analytics View**
- Charts showing:
  - Average time-in-stage by respirator class (bar chart)
  - Application throughput over time — approvals per quarter (line chart)
  - Stall rate by applicant type: new vs. existing (comparison metric)
  - Geographic heatmap of active applications by manufacturing country
- Filterable by date range, respirator class, applicant type, risk level

**Screen 4 — SLA & Escalation Configuration**
- Table showing configurable SLA targets per stage (editable by program managers)
- Escalation rules: e.g., "If an application exceeds 1.5x the SLA target, auto-notify the branch chief"
- Notification preferences (email, in-app)

### Technical Approach

| Component | Implementation |
|-----------|---------------|
| **Frontend** | React dashboard with a Kanban board (e.g., react-beautiful-dnd or similar), chart library (Recharts or Chart.js), and detail panels |
| **Application Data** | Static JSON dataset of 15 applications with full stage history, deficiency items, and metadata |
| **Risk Prediction Model** | For the demo: a rule-based scoring engine using the weighted factors above (no ML training needed). Each factor produces a 0-1 score; weighted sum yields a risk level (Low/Medium/High). In production, this would be a trained classifier on historical application data. |
| **Workflow Engine** | Simulated — stage transitions are pre-scripted in the data. The demo shows the UI for what a real workflow engine (e.g., Camunda, Temporal) would drive. |
| **SLA & Escalation** | Configurable rules stored in JSON; demo shows the configuration UI and how notifications would trigger |

### Key Data Sources for Demo Content

- 42 CFR Part 84 approval process stages (Subparts B, D, E)
- SAP structure (7-stage process from the PDF)
- NIOSH program scale data: ~98 approval holders, 119 sites, 20+ countries
- Realistic stage durations estimated from the multi-stage process described in the PDF

---

## Module 5: Post-Market Surveillance Dashboard

### Problem Being Demonstrated

After a respirator is approved, NIOSH must monitor it through field audits, complaint investigations, and counterfeit detection. These data streams are currently siloed. The demo shows a unified surveillance dashboard that aggregates complaints, field audit results, and counterfeit intelligence — with AI-assisted triage and trend detection.

### Demo Scenario

The dashboard displays post-market surveillance data for **NIOSH's portfolio of ~98 approval holders**. It highlights:
1. A manufacturer whose field audit results show **performance drift** (filtration efficiency declining over successive audits)
2. A cluster of **consumer complaints** about a specific respirator model
3. A **counterfeit/fraudulent product** detected through marketplace monitoring (modeled on real NIOSH PPE CASE Note patterns)

### Demo Data

**Dataset 1 — Field Audit Results (12 months of simulated data):**

| Audit ID | Manufacturer | TC Number | Product | Test Type | Original Benchmark | Latest Result | Drift | Status |
|----------|-------------|-----------|---------|-----------|-------------------|---------------|-------|--------|
| FA-2026-041 | BreathGuard Inc. | TC 84A-1234 | N95 FFR Model BG-200 | NaCl Filtration Efficiency | 98.2% | 97.8% | -0.4% | Pass |
| FA-2026-042 | BreathGuard Inc. | TC 84A-1234 | N95 FFR Model BG-200 | Inhalation Resistance | 33 mmH2O | 34 mmH2O | +1.0 | Pass |
| FA-2026-043 | BreathGuard Inc. | TC 84A-1234 | N95 FFR Model BG-200 | Exhalation Resistance | 22 mmH2O | 23 mmH2O | +1.0 | Pass |
| FA-2026-044 | SafeAir Technologies | TC 84A-5678 | N95 FFR Model SA-Pro | NaCl Filtration Efficiency | 99.1% | 96.2% | **-2.9%** | **WARNING** |
| FA-2026-045 | SafeAir Technologies | TC 84A-5678 | N95 FFR Model SA-Pro | Inhalation Resistance | 30 mmH2O | 38 mmH2O | **+8.0** | **WARNING** |
| FA-2026-046 | SafeAir Technologies | TC 84A-5678 | N95 FFR Model SA-Pro | Exhalation Resistance | 21 mmH2O | 26 mmH2O | **+5.0** | **WARNING** |
| FA-2026-047 | TrueFilter Co. | TC 84A-9012 | P95 FFR Model TF-100 | DOP Filtration Efficiency | 97.5% | 97.3% | -0.2% | Pass |

**N95 Pass/Fail Thresholds (42 CFR 84, Subpart K):**
- Filtration efficiency: >= 95% (NaCl aerosol)
- Inhalation resistance: <= 35 mmH2O at 85 L/min
- Exhalation resistance: <= 25 mmH2O

SafeAir Technologies' SA-Pro model shows: filtration dropping from 99.1% toward the 95% threshold, inhalation resistance exceeding the 35 mmH2O limit, and exhalation resistance exceeding the 25 mmH2O limit. This would trigger a Nonconformance Response Investigation (NRI) per CA 2023-1062.

**Dataset 2 — Complaint Triage Queue (AI-assisted):**

| Complaint ID | Date | Source | Manufacturer | Product | Description | AI Severity | AI Priority |
|-------------|------|--------|-------------|---------|-------------|------------|------------|
| CMP-2026-301 | 2026-02-15 | End User | SafeAir Technologies | SA-Pro N95 | "Difficulty breathing through mask, feels more restricted than previous batches" | High | 1 — Correlates with field audit FA-2026-045 |
| CMP-2026-302 | 2026-02-18 | Employer (Hospital) | SafeAir Technologies | SA-Pro N95 | "Fit test failure rates increased from 5% to 22% in latest shipment" | High | 1 — Pattern match with CMP-301 |
| CMP-2026-303 | 2026-02-20 | End User | SafeAir Technologies | SA-Pro N95 | "Nose clip feels different, less adjustable" | Medium | 2 — Possible design/material change |
| CMP-2026-304 | 2026-03-01 | Distributor | GlobalShield PPE | GS-100 N95 | "Customer returned batch, packaging looks different than usual" | Medium | 3 — Possible counterfeit indicator |
| CMP-2026-305 | 2026-03-05 | End User | ReliaMask Co. | RM-50 P100 | "Cartridge smells unusual when breathing through it" | Low | 4 — Isolated report, monitor |
| CMP-2026-306 | 2026-03-10 | OSHA Referral | Unknown | Unlabeled N95 | "Workers using respirators with no visible TC number or NIOSH markings" | High | 1 — Counterfeit/misrepresented |

**AI triage logic:**
- Cross-references complaints against open field audit data (CMP-301 + FA-2026-045 = correlated)
- Clusters complaints by manufacturer/product/timeframe to detect patterns
- Scores severity based on: safety impact, complaint volume, correlation with audit data, potential counterfeit indicators
- Recommends action: "Initiate CPIP" / "Request product samples for testing" / "Flag for counterfeit investigation"

**Dataset 3 — Counterfeit/Fraud Monitoring:**

| Alert ID | Date | Source | Product | Claimed TC# | CEL Match | Issue | Status |
|----------|------|--------|---------|-------------|-----------|-------|--------|
| CTF-2026-101 | 2026-01-20 | Marketplace Scan | "ZelGuard N95" | TC 84A-0000 | **No match** | TC number does not exist in CEL; "ZelGuard" is not a registered approval holder or private label | Open — CPIP initiated |
| CTF-2026-102 | 2026-02-05 | Marketplace Scan | "BreathBuddy P100 Filter" | TC 84A-3456 | **Mismatch** | TC number belongs to a different manufacturer; BreathBuddy is not a NIOSH approval holder | Open — Referral to enforcement |
| CTF-2026-103 | 2026-02-28 | Tip from distributor | N95 FFR (unmarked) | None visible | **N/A** | No NIOSH markings; product sold as "NIOSH Approved" online | Open — Samples requested for testing |
| CTF-2026-104 | 2026-03-12 | Automated label scan | "SafeAir SA-Pro" (suspected counterfeit) | TC 84A-5678 | **Match but suspect** | TC number matches SafeAir but packaging inconsistencies detected; font and print quality differ from known-good samples | Under review |

This data mirrors real patterns from NIOSH PPE CASE Notes (e.g., Zelbuck and Breath Buddy cases documented by NIOSH).

### Demo Walkthrough

**Screen 1 — Surveillance Overview Dashboard**
- Top-level KPIs:
  - Active approval holders: 98
  - Field audits completed (trailing 12 months): 377
  - Open complaints: 24 (6 high-priority)
  - Active counterfeit investigations: 4
  - Manufacturers overdue for biennial site visit: 3
- Risk heatmap: grid of approval holders colored by composite risk score (combines field audit trends, complaint volume, site visit recency, counterfeit associations)
- "Attention Required" panel highlighting the top 3 issues:
  1. SafeAir Technologies — performance drift + correlated complaints
  2. Unknown counterfeit N95s — no NIOSH markings
  3. GlobalShield PPE — packaging anomaly report

**Screen 2 — Performance Drift Detail (click on SafeAir Technologies)**
- Time-series chart showing filtration efficiency across 4 quarterly audits: 99.1% -> 98.4% -> 97.1% -> 96.2%
- Horizontal threshold lines at 95% (fail) with projected trajectory
- Inhalation and exhalation resistance trend charts showing same degradation pattern
- Correlated complaints panel: 3 complaints in 30 days, all about the same model
- AI recommendation: **"Initiate Nonconformance Response Investigation (NRI) per CA 2023-1062. Performance metrics trending toward failure thresholds. Correlated complaint cluster suggests systemic manufacturing issue. Recommend requesting product samples from current production lots for independent lab testing."**
- Action buttons: "Initiate NRI", "Request Samples", "Schedule Site Visit", "Contact Manufacturer"

**Screen 3 — Complaint Triage Queue**
- Table view of all open complaints, sorted by AI priority score
- Each row expandable to show:
  - Full complaint text
  - AI-generated analysis (correlation with other data streams, similar past complaints)
  - Recommended disposition
- Batch actions: assign to reviewer, link to existing investigation, escalate

**Screen 4 — Counterfeit Monitoring**
- Map view showing geographic distribution of counterfeit reports
- Alert feed with marketplace scanning results
- Detail view for each alert showing:
  - Product images (simulated)
  - CEL cross-reference results
  - Side-by-side comparison with known-good product markings
  - Investigation status and action log
- Statistics: "4,163 potentially fraudulent listings investigated YTD" (mirrors real NIOSH 2025 data)

**Screen 5 — CPIP Trigger Rules**
- Configuration panel showing automated CPIP initiation thresholds:
  - Filtration efficiency drift > 2% from benchmark
  - Inhalation/exhalation resistance exceeding regulatory limits
  - 3+ correlated complaints on same product within 60 days
  - Any counterfeit alert with confirmed CEL mismatch
- Toggle for auto-initiate vs. recommend-and-confirm

### Technical Approach

| Component | Implementation |
|-----------|---------------|
| **Frontend** | React dashboard with data visualization (Recharts/D3 for time-series, heatmaps, geographic maps); complaint queue with expandable rows |
| **Field Audit Data** | Static JSON dataset with historical audit results per manufacturer/product, including test values across multiple audit periods |
| **Complaint Engine** | AI triage via Claude API — system prompt includes complaint text, manufacturer history, and recent field audit data; returns severity score, correlation analysis, and recommended action |
| **Counterfeit Detection** | Rule-based CEL cross-reference (lookup TC number and manufacturer in CEL dataset from HealthData.gov); visual comparison placeholder |
| **CPIP Trigger Engine** | Configurable threshold rules evaluated against audit and complaint data; fires alerts when conditions met |
| **CEL Integration** | For the demo, a local copy of CEL data (available as open data from HealthData.gov, dataset ID: `5ewm-6t2t`); used for TC number validation and manufacturer verification |

### Key Data Sources for Demo Content

- NIOSH Certified Equipment List (CEL) — open data from HealthData.gov
- 42 CFR Part 84, Subpart K (N95 testing thresholds)
- CA 2023-1062 (NRI process)
- NIOSH PPE CASE Notes (counterfeit patterns: Zelbuck, Breath Buddy examples)
- NIOSH Publication 2025-105 ("Understanding Counterfeit Respirators")
- NIOSH post-market evaluation program data (~377 QA audits in 2023)
- Real NIOSH statistic: 4,163 fraudulent listings investigated in 2025

---

## Cross-Module Integration Points

The three demo modules connect naturally:

| From | To | Integration |
|------|-----|-------------|
| **Module 1** (Intake) | **Module 2** (Tracker) | When an application passes pre-screening, it enters the lifecycle tracker as a new card at the "Formal Submission" stage. The intake completeness score becomes a risk factor for the stall prediction model. |
| **Module 2** (Tracker) | **Module 5** (Surveillance) | When an application reaches "Approval," the approved product enters the post-market surveillance portfolio. The manufacturer's application history informs their baseline risk profile. |
| **Module 5** (Surveillance) | **Module 1** (Intake) | If a manufacturer with open NRIs or counterfeit flags submits a new application, Module 1 surfaces this context to reviewers during intake. |

### Demo Flow Suggestion

For a live demonstration, present the modules in this order:
1. **Module 1** — Show an application being submitted and pre-screened (the "front door")
2. **Module 2** — Show the portfolio of in-flight applications, drill into a stalled one (the "middle")
3. **Module 5** — Show post-market monitoring catching a quality drift and counterfeit (the "ongoing oversight")

This mirrors the real lifecycle: intake -> processing -> post-market, and tells a coherent story about how AI supports the entire approval lifecycle without replacing human judgment.

---

## Technology Stack Summary (All Modules)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React + TypeScript | Modern, component-based UI; large ecosystem for dashboards |
| Charting | Recharts or Chart.js | Lightweight, React-friendly visualization |
| State Management | React Context or Zustand | Sufficient for demo complexity |
| AI Integration | Claude API (Anthropic) | Natural language guidance (Module 1), complaint triage analysis (Module 5) |
| Data | Static JSON files | No backend needed for demo; realistic data structures that mirror production schemas |
| Styling | Tailwind CSS | Rapid prototyping, consistent design system |
| Accessibility | WCAG 2.1 AA compliance | Required for federal systems per Section 508 |

### What This Demo Is NOT

Per the PDF's design philosophy, the demo explicitly does **not** automate:
- Final pass/fail determinations
- Approval or denial decisions
- Enforcement actions (recalls, stop-sales, revocations)
- Substantive engineering or safety judgments

All AI outputs are presented as **recommendations for human review**, with clear "human decides" affordances throughout the UI.
