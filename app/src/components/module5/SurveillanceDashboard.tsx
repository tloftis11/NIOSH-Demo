import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  SURVEILLANCE_KPIS,
  MANUFACTURER_RISKS,
  FIELD_AUDIT_RESULTS,
  AUDIT_TRENDS,
  COMPLAINTS,
  COUNTERFEIT_ALERTS,
  SAR_AUDIT_TRENDS,
  SAR_FIELD_AUDITS,
  SAR_COMPLAINTS,
  LTFE_RESULTS,
  LTFE_TRENDS,
  NRI_INVESTIGATIONS,
  MSHA_COORDINATIONS,
} from "../../data/surveillance";
import type { Complaint, CounterfeitAlert } from "../../data/surveillance";

type View = "overview" | "drift" | "sar_drift" | "complaints" | "counterfeit" | "ltfe" | "nri" | "msha";

function CelMatchBadge({ match }: { match: string }) {
  const styles: Record<string, string> = {
    no_match: "badge-fail",
    mismatch: "badge-fail",
    match_suspect: "badge-warning",
    not_applicable: "badge-na",
  };
  const labels: Record<string, string> = {
    no_match: "No Match",
    mismatch: "Mismatch",
    match_suspect: "Suspect",
    not_applicable: "N/A",
  };
  return (
    <span className={`badge ${styles[match] || "badge-na"}`}>
      {labels[match] || match}
    </span>
  );
}

function OverviewDashboard({ onNavigate }: { onNavigate: (v: View) => void }) {
  const kpis = SURVEILLANCE_KPIS;
  const activeNris = NRI_INVESTIGATIONS.filter((n) => n.status !== "closed").length;
  const activeMsha = MSHA_COORDINATIONS.filter((m) => m.status !== "Resolved").length;

  return (
    <div>
      {/* KPI row */}
      <div className="kpi-row" style={{ marginBottom: "1.5rem" }}>
        <div className="kpi-card">
          <div className="kpi-value">{kpis.activeApprovalHolders}</div>
          <div className="kpi-label">Active Approval Holders</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{kpis.fieldAuditsCompleted}</div>
          <div className="kpi-label">Field Audits (12 mo.)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {kpis.openComplaints}
          </div>
          <div className="kpi-label">
            Open Complaints ({kpis.highPriorityComplaints} high)
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {kpis.activeCounterfeitInvestigations}
          </div>
          <div className="kpi-label">Counterfeit Investigations</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--warning)" }}>
            {kpis.overdueForSiteVisit}
          </div>
          <div className="kpi-label">Overdue for Site Visit</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("nri")}>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {activeNris}
          </div>
          <div className="kpi-label">Active NRIs</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("ltfe")}>
          <div className="kpi-value">{LTFE_RESULTS.length}</div>
          <div className="kpi-label">LTFE Evaluations</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("msha")}>
          <div className="kpi-value" style={{ color: "var(--warning)" }}>
            {activeMsha}
          </div>
          <div className="kpi-label">MSHA Referrals</div>
        </div>
      </div>

      {/* Quick nav buttons for new views */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-secondary" onClick={() => onNavigate("drift")}>N95 Performance Drift</button>
        <button className="btn btn-secondary" onClick={() => onNavigate("sar_drift")}>SAR Air Quality Drift</button>
        <button className="btn btn-secondary" onClick={() => onNavigate("ltfe")}>SCSR Field Evaluation (LTFE)</button>
        <button className="btn btn-secondary" onClick={() => onNavigate("nri")}>NRI Tracker</button>
        <button className="btn btn-secondary" onClick={() => onNavigate("msha")}>MSHA Coordination</button>
        <button className="btn btn-secondary" onClick={() => onNavigate("complaints")}>Complaint Queue</button>
        <button className="btn btn-secondary" onClick={() => onNavigate("counterfeit")}>Counterfeit Monitoring</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
        {/* Risk Heatmap */}
        <div className="card">
          <h3>Manufacturer Risk Heatmap</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Composite risk score based on field audit trends, complaint volume,
            site visit recency, and counterfeit associations.
          </p>
          <div className="risk-heatmap">
            {MANUFACTURER_RISKS.sort((a, b) => b.riskScore - a.riskScore).map(
              (m) => (
                <div
                  className="heatmap-cell"
                  key={m.name}
                  style={{
                    backgroundColor:
                      m.riskScore >= 70
                        ? "rgba(220, 38, 38, 0.2)"
                        : m.riskScore >= 40
                        ? "rgba(245, 158, 11, 0.2)"
                        : m.riskScore >= 20
                        ? "rgba(59, 130, 246, 0.1)"
                        : "rgba(34, 197, 94, 0.1)",
                    borderColor:
                      m.riskScore >= 70
                        ? "var(--danger)"
                        : m.riskScore >= 40
                        ? "var(--warning)"
                        : "var(--border)",
                    cursor: m.name === "SafeAir Technologies" ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (m.name === "SafeAir Technologies") onNavigate("drift");
                  }}
                >
                  <div className="heatmap-name">{m.name}</div>
                  <div className="heatmap-score">
                    <span
                      style={{
                        color:
                          m.riskScore >= 70
                            ? "var(--danger)"
                            : m.riskScore >= 40
                            ? "var(--warning)"
                            : "var(--text-muted)",
                        fontWeight: 700,
                      }}
                    >
                      {m.riskScore}
                    </span>
                  </div>
                  <div className="heatmap-meta">
                    {m.auditTrend === "declining" && (
                      <span style={{ color: "var(--danger)", fontSize: "0.75rem" }}>
                        Declining
                      </span>
                    )}
                    {m.overdue && (
                      <span style={{ color: "var(--warning)", fontSize: "0.75rem" }}>
                        Overdue
                      </span>
                    )}
                    {m.openComplaints > 0 && (
                      <span style={{ fontSize: "0.75rem" }}>
                        {m.openComplaints} complaint{m.openComplaints > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Attention Required */}
        <div className="card">
          <h3>Attention Required</h3>
          <div className="attention-list">
            <div
              className="attention-item attention-critical"
              onClick={() => onNavigate("drift")}
              style={{ cursor: "pointer" }}
            >
              <div className="attention-badge">
                <span className="badge badge-fail">CRITICAL</span>
              </div>
              <div>
                <strong>SafeAir Technologies</strong>
                <p>
                  Performance drift detected + 3 correlated complaints.
                  Filtration efficiency declining toward failure threshold.
                </p>
              </div>
            </div>
            <div
              className="attention-item attention-high"
              onClick={() => onNavigate("counterfeit")}
              style={{ cursor: "pointer" }}
            >
              <div className="attention-badge">
                <span className="badge badge-fail">HIGH</span>
              </div>
              <div>
                <strong>Counterfeit N95s Detected</strong>
                <p>
                  OSHA referral: workers using respirators with no NIOSH
                  markings. Samples requested for testing.
                </p>
              </div>
            </div>
            <div
              className="attention-item attention-medium"
              onClick={() => onNavigate("complaints")}
              style={{ cursor: "pointer" }}
            >
              <div className="attention-badge">
                <span className="badge badge-warning">MEDIUM</span>
              </div>
              <div>
                <strong>GlobalShield PPE</strong>
                <p>
                  Distributor reports packaging anomaly. Possible counterfeit
                  or unauthorized packaging change.
                </p>
              </div>
            </div>
            <div
              className="attention-item attention-critical"
              onClick={() => onNavigate("sar_drift")}
              style={{ cursor: "pointer" }}
            >
              <div className="attention-badge">
                <span className="badge badge-fail">CRITICAL</span>
              </div>
              <div>
                <strong>PrimeSafe Corp. — SAR Air Quality</strong>
                <p>
                  CO trending toward Grade D limit (8.7/10 ppm). MSHA referral
                  for reduced airflow. NRI initiated.
                </p>
              </div>
            </div>
            <div
              className="attention-item attention-high"
              onClick={() => onNavigate("ltfe")}
              style={{ cursor: "pointer" }}
            >
              <div className="attention-badge">
                <span className="badge badge-fail">HIGH</span>
              </div>
              <div>
                <strong>CSE SR-100 SCSR — LTFE Failure</strong>
                <p>
                  64% visual pass rate at Pinnacle Mine. Oxygen starter assembly
                  reliability declining. Joint MSHA determination pending.
                </p>
              </div>
            </div>
          </div>

          <div
            className="info-box"
            style={{ marginTop: "1rem", fontSize: "0.85rem" }}
          >
            <strong>YTD Stat:</strong>{" "}
            {kpis.fraudulentListingsInvestigatedYTD.toLocaleString()} potentially
            fraudulent respirator listings investigated
          </div>
        </div>
      </div>
    </div>
  );
}

// Compute predictive trajectory: extrapolate 2 quarters ahead using linear regression
interface PredictiveDataPoint { quarter: string; value: number | undefined; projected: number | undefined }
function computePredictiveData(dataPoints: { quarter: string; value: number }[], threshold: number, thresholdDirection: "max" | "min") {
  const n = dataPoints.length;
  if (n < 2) return { chartData: dataPoints.map(d => ({ ...d, projected: undefined as number | undefined })) as PredictiveDataPoint[], projectedFailureQuarter: null as string | null };
  const slope = (dataPoints[n - 1].value - dataPoints[0].value) / (n - 1);
  const lastVal = dataPoints[n - 1].value;
  const proj1: PredictiveDataPoint = { quarter: "Q2 2026", value: undefined, projected: Math.round((lastVal + slope) * 10) / 10 };
  const proj2: PredictiveDataPoint = { quarter: "Q3 2026", value: undefined, projected: Math.round((lastVal + slope * 2) * 10) / 10 };
  const chartData: PredictiveDataPoint[] = [
    ...dataPoints.map((d) => ({ ...d, projected: undefined as number | undefined })),
    // bridge point: last actual value duplicated as projected start
    { quarter: dataPoints[n - 1].quarter, value: undefined, projected: lastVal },
    proj1,
    proj2,
  ];
  // Estimate when threshold is crossed
  let projectedFailureQuarter: string | null = null;
  if (thresholdDirection === "max" && slope > 0) {
    const quartersToFail = (threshold - lastVal) / slope;
    if (quartersToFail > 0 && quartersToFail <= 4) {
      projectedFailureQuarter = `~${Math.ceil(quartersToFail)} quarter${Math.ceil(quartersToFail) > 1 ? "s" : ""}`;
    } else if (lastVal > threshold) {
      projectedFailureQuarter = "Already exceeded";
    }
  } else if (thresholdDirection === "min" && slope < 0) {
    const quartersToFail = (threshold - lastVal) / slope;
    if (quartersToFail > 0 && quartersToFail <= 4) {
      projectedFailureQuarter = `~${Math.ceil(quartersToFail)} quarter${Math.ceil(quartersToFail) > 1 ? "s" : ""}`;
    } else if (lastVal < threshold) {
      projectedFailureQuarter = "Already exceeded";
    }
  }
  return { chartData, projectedFailureQuarter };
}

function DriftDetail({ onBack }: { onBack: () => void }) {
  const safeAirAudits = FIELD_AUDIT_RESULTS.filter(
    (a) => a.manufacturer === "SafeAir Technologies"
  );
  const safeAirComplaints = COMPLAINTS.filter(
    (c) => c.manufacturer === "SafeAir Technologies"
  );

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: "1rem" }}
      >
        &larr; Back to Overview
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>SafeAir Technologies — Performance Drift Analysis</h2>
            <p style={{ color: "var(--text-muted)" }}>
              TC 84A-5678 | N95 FFR Model SA-Pro
            </p>
          </div>
          <span className="badge badge-fail">CRITICAL</span>
        </div>

        {/* Trend charts with predictive trajectory */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {AUDIT_TRENDS.map((trend) => {
            const { chartData, projectedFailureQuarter } = computePredictiveData(trend.dataPoints, trend.threshold, trend.thresholdDirection);
            const isExceeded = trend.thresholdDirection === "max"
              ? trend.dataPoints[trend.dataPoints.length - 1].value > trend.threshold
              : trend.dataPoints[trend.dataPoints.length - 1].value < trend.threshold;
            return (
            <div key={trend.testType} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem" }}>
              <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                {trend.testType}
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={
                      trend.thresholdDirection === "min"
                        ? [
                            (dataMin: number) =>
                              Math.min(dataMin, trend.threshold) - 2,
                            "auto",
                          ]
                        : [
                            "auto",
                            (dataMax: number) =>
                              Math.max(dataMax, trend.threshold) + 4,
                          ]
                    }
                  />
                  <Tooltip />
                  <ReferenceLine
                    y={trend.threshold}
                    stroke="var(--danger)"
                    strokeDasharray="5 5"
                    label={{
                      value: `${trend.thresholdDirection === "min" ? "Min" : "Max"}: ${trend.threshold}${trend.unit}`,
                      position: "right",
                      fontSize: 10,
                      fill: "var(--danger)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isExceeded ? "var(--danger)" : "var(--primary)"}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="var(--warning)"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 3, strokeDasharray: "" }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                Threshold: {trend.thresholdDirection === "min" ? ">=" : "<="}{" "}
                {trend.threshold}
                {trend.unit}
              </div>
              {projectedFailureQuarter && (
                <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--danger)", marginTop: "0.25rem", fontWeight: 600 }}>
                  Projected failure: {projectedFailureQuarter}
                </div>
              )}
            </div>
          );
          })}
        </div>

        <div className="info-box" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          <strong>Predictive Trajectory:</strong> Dashed orange lines show projected values based on linear extrapolation of audit trends. These projections estimate when metrics will cross regulatory thresholds at the current rate of drift.
        </div>
      </div>

      {/* Current audit results */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Latest Field Audit Results</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Audit ID</th>
              <th>Test</th>
              <th>Benchmark</th>
              <th>Latest</th>
              <th>Drift</th>
              <th>Threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {safeAirAudits.map((a) => (
              <tr key={a.auditId} className={a.status === "warning" ? "row-fail" : ""}>
                <td>{a.auditId}</td>
                <td>{a.testType}</td>
                <td>
                  {a.originalBenchmark}
                  {a.unit}
                </td>
                <td>
                  {a.latestResult}
                  {a.unit}
                </td>
                <td
                  style={{
                    color: a.status === "warning" ? "var(--danger)" : "inherit",
                    fontWeight: a.status === "warning" ? 700 : 400,
                  }}
                >
                  {a.drift > 0 ? "+" : ""}
                  {a.drift}
                  {a.unit}
                </td>
                <td>
                  {a.thresholdDirection === "min" ? ">=" : "<="} {a.threshold}
                  {a.unit}
                </td>
                <td>
                  <span
                    className={`badge ${
                      a.status === "warning" ? "badge-warning" : "badge-pass"
                    }`}
                  >
                    {a.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Correlated complaints */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Correlated Complaints ({safeAirComplaints.length})</h3>
        {safeAirComplaints.map((c) => (
          <div className="complaint-card" key={c.complaintId}>
            <div className="complaint-header">
              <span>
                <strong>{c.complaintId}</strong> — {c.date}
              </span>
              <span className={`badge ${c.aiSeverity === "High" ? "badge-fail" : "badge-warning"}`}>
                {c.aiSeverity} (P{c.aiPriority})
              </span>
            </div>
            <p className="complaint-desc">"{c.description}"</p>
            <p className="complaint-source">
              Source: {c.source} | Product: {c.product}
            </p>
            {c.correlatedAuditIds.length > 0 && (
              <p className="complaint-correlation">
                Correlated with: {c.correlatedAuditIds.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>AI Recommendation</h3>
        <div className="info-box" style={{ marginBottom: "1rem" }}>
          <strong>Human Review Notice:</strong> This recommendation is
          AI-generated. Initiation of NRI and enforcement actions requires
          authorization by program management.
        </div>
        <div
          className="guidance-card"
          style={{ borderColor: "var(--danger)" }}
        >
          <div className="guidance-body">
            <p>
              <strong>
                Initiate Nonconformance Response Investigation (NRI) per CA
                2023-1062.
              </strong>{" "}
              Performance metrics for SafeAir Technologies SA-Pro N95 (TC
              84A-5678) are trending toward failure thresholds across all three
              test parameters:
            </p>
            <ul style={{ margin: "0.75rem 0" }}>
              <li>
                NaCl Filtration Efficiency: 96.2% (down from 99.1%, threshold
                &ge; 95%)
              </li>
              <li>
                Inhalation Resistance: 38 mmH₂O (up from 30, threshold &le;
                35 — <strong>EXCEEDS LIMIT</strong>)
              </li>
              <li>
                Exhalation Resistance: 26 mmH₂O (up from 21, threshold &le;
                25 — <strong>EXCEEDS LIMIT</strong>)
              </li>
            </ul>
            <p>
              A correlated complaint cluster (3 complaints in 5 days) suggests a
              systemic manufacturing issue. Recommend requesting product samples
              from current production lots for independent lab testing and
              notifying the manufacturer of the pending NRI.
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button className="btn btn-primary">Initiate NRI</button>
          <button className="btn btn-secondary">Request Samples</button>
          <button className="btn btn-secondary">Schedule Site Visit</button>
          <button className="btn btn-secondary">Contact Manufacturer</button>
        </div>
      </div>
    </div>
  );
}

function ComplaintQueue({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: "1rem" }}
      >
        &larr; Back to Overview
      </button>

      <div className="card">
        <h2>Complaint Triage Queue</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
          AI-prioritized complaints sorted by severity, correlation with field
          audit data, and pattern detection.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Source</th>
              <th>Manufacturer</th>
              <th>Product</th>
              <th>Severity</th>
              <th>Priority</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {COMPLAINTS.sort((a, b) => a.aiPriority - b.aiPriority).map(
              (c: Complaint) => (
                <>
                  <tr
                    key={c.complaintId}
                    className={c.aiSeverity === "High" ? "row-fail" : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setExpanded(
                        expanded === c.complaintId ? null : c.complaintId
                      )
                    }
                  >
                    <td>
                      <strong>{c.complaintId}</strong>
                    </td>
                    <td>{c.date}</td>
                    <td>{c.source}</td>
                    <td>{c.manufacturer}</td>
                    <td>{c.product}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.aiSeverity === "High"
                            ? "badge-fail"
                            : c.aiSeverity === "Medium"
                            ? "badge-warning"
                            : "badge-pass"
                        }`}
                      >
                        {c.aiSeverity}
                      </span>
                    </td>
                    <td>P{c.aiPriority}</td>
                    <td>{expanded === c.complaintId ? "▲" : "▼"}</td>
                  </tr>
                  {expanded === c.complaintId && (
                    <tr key={`${c.complaintId}-detail`}>
                      <td colSpan={8} style={{ padding: "1rem", backgroundColor: "var(--surface)" }}>
                        <div style={{ marginBottom: "0.75rem" }}>
                          <strong>Complaint:</strong> "{c.description}"
                        </div>
                        <div style={{ marginBottom: "0.75rem" }}>
                          <strong>AI Analysis:</strong> {c.aiRationale}
                        </div>
                        <div style={{ marginBottom: "0.75rem" }}>
                          <strong>Recommendation:</strong> {c.aiRecommendation}
                        </div>
                        {c.correlatedAuditIds.length > 0 && (
                          <div>
                            <strong>Correlated Audits:</strong>{" "}
                            {c.correlatedAuditIds.join(", ")}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CounterfeitMonitoring({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: "1rem" }}
      >
        &larr; Back to Overview
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>Counterfeit & Fraud Monitoring</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Marketplace scanning, CEL cross-reference, and investigation
              tracking
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="kpi-value">
              {SURVEILLANCE_KPIS.fraudulentListingsInvestigatedYTD.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Fraudulent listings investigated YTD
            </div>
          </div>
        </div>

        <table className="data-table" style={{ marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Date</th>
              <th>Source</th>
              <th>Product</th>
              <th>Claimed TC#</th>
              <th>CEL Match</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COUNTERFEIT_ALERTS.map((a: CounterfeitAlert) => (
              <tr key={a.alertId}>
                <td>
                  <strong>{a.alertId}</strong>
                </td>
                <td>{a.date}</td>
                <td>{a.source}</td>
                <td>{a.product}</td>
                <td style={{ fontFamily: "monospace" }}>{a.claimedTcNumber}</td>
                <td>
                  <CelMatchBadge match={a.celMatch} />
                </td>
                <td>
                  <span
                    className={`badge ${
                      a.status.includes("CPIP")
                        ? "badge-fail"
                        : a.status.includes("Referral")
                        ? "badge-fail"
                        : "badge-warning"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail cards for each alert */}
      {COUNTERFEIT_ALERTS.map((a) => (
        <div className="card" key={a.alertId} style={{ marginTop: "1rem" }}>
          <h3>
            {a.alertId} — {a.product}
          </h3>
          <div className="detail-grid" style={{ marginBottom: "0.75rem" }}>
            <div>
              <strong>Source:</strong> {a.source}
            </div>
            <div>
              <strong>Date:</strong> {a.date}
            </div>
            <div>
              <strong>Claimed TC#:</strong>{" "}
              <code>{a.claimedTcNumber}</code>
            </div>
            <div>
              <strong>CEL Result:</strong> <CelMatchBadge match={a.celMatch} />
            </div>
          </div>
          <div
            className="info-box"
            style={{
              borderColor:
                a.celMatch === "no_match" || a.celMatch === "mismatch"
                  ? "var(--danger)"
                  : "var(--warning)",
              backgroundColor:
                a.celMatch === "no_match" || a.celMatch === "mismatch"
                  ? "rgba(220, 38, 38, 0.05)"
                  : "rgba(245, 158, 11, 0.05)",
            }}
          >
            <strong>Issue:</strong> {a.issue}
          </div>
        </div>
      ))}

      {/* CPIP Trigger Rules */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>CPIP Auto-Trigger Thresholds</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Configurable rules for automated Certified Product Investigation
          Process (CPIP) initiation.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Threshold</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Filtration efficiency drift</td>
              <td>&gt; 2% decline from benchmark</td>
              <td>
                <span className="badge badge-warning">
                  Recommend & Confirm
                </span>
              </td>
            </tr>
            <tr>
              <td>Resistance exceeds regulatory limit</td>
              <td>
                Inhalation &gt; 35 mmH₂O or Exhalation &gt; 25 mmH₂O
              </td>
              <td>
                <span className="badge badge-fail">Auto-Initiate</span>
              </td>
            </tr>
            <tr>
              <td>Correlated complaint cluster</td>
              <td>3+ complaints on same product within 60 days</td>
              <td>
                <span className="badge badge-warning">
                  Recommend & Confirm
                </span>
              </td>
            </tr>
            <tr>
              <td>CEL mismatch on counterfeit alert</td>
              <td>Any confirmed No Match or Mismatch</td>
              <td>
                <span className="badge badge-fail">Auto-Initiate</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SarDriftDetail({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: "1rem" }}>
        &larr; Back to Overview
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>PrimeSafe Corp. — SAR Air Quality Drift Analysis</h2>
            <p style={{ color: "var(--text-muted)" }}>
              TC 84A-7821 | SAR Type C Model PS-400 | 42 CFR 84 Subpart J
            </p>
          </div>
          <span className="badge badge-fail">CRITICAL</span>
        </div>

        <div className="info-box" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          <strong>Grade D Breathing Air Requirements (CGA G-7.1):</strong> CO &le; 10 ppm, CO₂ &le; 1,000 ppm, O₂ 19.5–23.5%, Oil Mist &le; 5 mg/m³. Minimum airflow: 115 L/min (tight-fitting).
        </div>

        {/* Trend charts with predictive trajectory */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
          {SAR_AUDIT_TRENDS.map((trend) => {
            const { chartData, projectedFailureQuarter } = computePredictiveData(trend.dataPoints, trend.threshold, trend.thresholdDirection);
            const isExceeded = trend.thresholdDirection === "max"
              ? trend.dataPoints[trend.dataPoints.length - 1].value > trend.threshold
              : trend.dataPoints[trend.dataPoints.length - 1].value < trend.threshold;
            return (
              <div key={trend.testType} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>{trend.testType}</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={
                      trend.thresholdDirection === "min"
                        ? [(dataMin: number) => Math.min(dataMin, trend.threshold) - 5, "auto"]
                        : ["auto", (dataMax: number) => Math.max(dataMax, trend.threshold) + 2]
                    } />
                    <Tooltip />
                    <ReferenceLine y={trend.threshold} stroke="var(--danger)" strokeDasharray="5 5"
                      label={{ value: `${trend.thresholdDirection === "min" ? "Min" : "Max"}: ${trend.threshold}${trend.unit}`, position: "right", fontSize: 10, fill: "var(--danger)" }} />
                    <Line type="monotone" dataKey="value" stroke={isExceeded ? "var(--danger)" : "var(--primary)"} strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
                    <Line type="monotone" dataKey="projected" stroke="var(--warning)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, strokeDasharray: "" }} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Threshold: {trend.thresholdDirection === "min" ? ">=" : "<="} {trend.threshold}{trend.unit}
                </div>
                {projectedFailureQuarter && (
                  <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--danger)", marginTop: "0.25rem", fontWeight: 600 }}>
                    Projected failure: {projectedFailureQuarter}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="info-box" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          <strong>Predictive Trajectory:</strong> Dashed orange lines show projected values. CO is trending toward the 10 ppm Grade D limit. CO₂ is approaching the 1,000 ppm limit. Airflow rate is declining toward the 115 L/min minimum.
        </div>
      </div>

      {/* Field audit results */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Latest Field Audit Results</h3>
        <table className="data-table">
          <thead>
            <tr><th>Audit ID</th><th>Test</th><th>Benchmark</th><th>Latest</th><th>Drift</th><th>Threshold</th><th>Status</th></tr>
          </thead>
          <tbody>
            {SAR_FIELD_AUDITS.map((a) => (
              <tr key={a.auditId} className={a.status === "warning" ? "row-fail" : ""}>
                <td>{a.auditId}</td>
                <td>{a.testType}</td>
                <td>{a.originalBenchmark}{a.unit}</td>
                <td>{a.latestResult}{a.unit}</td>
                <td style={{ color: a.status === "warning" ? "var(--danger)" : "inherit", fontWeight: a.status === "warning" ? 700 : 400 }}>
                  {a.drift > 0 ? "+" : ""}{a.drift}{a.unit}
                </td>
                <td>{a.thresholdDirection === "min" ? ">=" : "<="} {a.threshold}{a.unit}</td>
                <td><span className={`badge ${a.status === "warning" ? "badge-warning" : "badge-pass"}`}>{a.status.toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Correlated complaints */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Correlated Complaints ({SAR_COMPLAINTS.length})</h3>
        {SAR_COMPLAINTS.map((c) => (
          <div className="complaint-card" key={c.complaintId}>
            <div className="complaint-header">
              <span><strong>{c.complaintId}</strong> — {c.date}</span>
              <span className={`badge ${c.aiSeverity === "High" ? "badge-fail" : "badge-warning"}`}>{c.aiSeverity} (P{c.aiPriority})</span>
            </div>
            <p className="complaint-desc">"{c.description}"</p>
            <p className="complaint-source">Source: {c.source} | Product: {c.product}</p>
            {c.correlatedAuditIds.length > 0 && (
              <p className="complaint-correlation">Correlated with: {c.correlatedAuditIds.join(", ")}</p>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>AI Recommendation</h3>
        <div className="info-box" style={{ marginBottom: "1rem" }}>
          <strong>Human Review Notice:</strong> This recommendation is AI-generated. Initiation of NRI and enforcement actions requires authorization by program management.
        </div>
        <div className="guidance-card" style={{ borderColor: "var(--danger)" }}>
          <div className="guidance-body">
            <p><strong>Initiate Nonconformance Response Investigation (NRI) per CA 2023-1062.</strong> Breathing air quality for PrimeSafe Corp. PS-400 SAR Type C (TC 84A-7821) is trending toward Grade D limits:</p>
            <ul style={{ margin: "0.75rem 0" }}>
              <li>CO: 8.7 ppm (up from 3.2 ppm, threshold &le; 10 ppm — <strong>approaching limit</strong>)</li>
              <li>CO₂: 940 ppm (up from 620 ppm, threshold &le; 1,000 ppm — <strong>approaching limit</strong>)</li>
              <li>Airflow: 119 L/min (down from 142, threshold &ge; 115 — <strong>approaching limit</strong>)</li>
            </ul>
            <p>MSHA referral and fire department complaint corroborate air quality concerns. Recommend requesting air quality samples from in-service compressor systems and current production units.</p>
          </div>
        </div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button className="btn btn-primary">Initiate NRI</button>
          <button className="btn btn-secondary">Request Air Samples</button>
          <button className="btn btn-secondary">Schedule Site Visit</button>
          <button className="btn btn-secondary">Notify MSHA</button>
        </div>
      </div>
    </div>
  );
}

function LtfeResults({ onBack }: { onBack: () => void }) {
  const [selectedEval, setSelectedEval] = useState<string | null>(null);

  const passColor = (rate: number) =>
    rate >= 90 ? "var(--success)" : rate >= 75 ? "var(--warning)" : "var(--danger)";

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: "1rem" }}>
        &larr; Back to Overview
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>SCSR Long-Term Field Evaluation (LTFE)</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Point-of-use sampling and testing of deployed SCSRs from mines and Navy vessels per 42 CFR 84 Subpart H/O
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="kpi-value">{LTFE_RESULTS.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Active Evaluations</div>
          </div>
        </div>

        <div className="info-box" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          <strong>LTFE Protocol:</strong> Random sampling with 98% detection probability at 1.5% error rate. Tests include: (1) Visual inspection per manufacturer procedure, (2) Quantitative Leak Testing (QLT) at 300 mmH₂O vacuum, (3) Breathing Machine Simulator (BMS) testing for rated service life.
        </div>

        <table className="data-table" style={{ marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>Eval ID</th>
              <th>Manufacturer</th>
              <th>Product</th>
              <th>Site</th>
              <th>Deployed</th>
              <th>Visual</th>
              <th>QLT</th>
              <th>BMS</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {LTFE_RESULTS.map((r) => (
              <tr key={r.evalId}
                className={r.overallStatus === "fail" ? "row-fail" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedEval(selectedEval === r.evalId ? null : r.evalId)}
              >
                <td><strong>{r.evalId}</strong></td>
                <td>{r.manufacturer}</td>
                <td style={{ fontSize: "0.85rem" }}>{r.product}</td>
                <td>{r.mineSite} ({r.mineState})</td>
                <td>{r.deploymentDuration}</td>
                <td style={{ color: passColor(r.visualPassRate), fontWeight: 700 }}>{r.visualPassRate}%</td>
                <td style={{ color: passColor(r.qltPassRate), fontWeight: 700 }}>{r.qltPassRate}%</td>
                <td style={{ color: passColor(r.bmsPassRate), fontWeight: 700 }}>{r.bmsPassRate}%</td>
                <td>
                  <span className={`badge ${r.overallStatus === "pass" ? "badge-pass" : r.overallStatus === "warning" ? "badge-warning" : "badge-fail"}`}>
                    {r.overallStatus.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded detail for selected eval */}
      {selectedEval && (() => {
        const r = LTFE_RESULTS.find((e) => e.evalId === selectedEval);
        if (!r) return null;
        return (
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>{r.evalId} — {r.product}</h3>
            <div className="detail-grid" style={{ marginBottom: "0.75rem" }}>
              <div><strong>Manufacturer:</strong> {r.manufacturer}</div>
              <div><strong>TC#:</strong> <code>{r.tcNumber}</code></div>
              <div><strong>Site:</strong> {r.mineSite}, {r.mineState}</div>
              <div><strong>Deployment:</strong> {r.deploymentDuration}</div>
              <div><strong>Sample Size:</strong> {r.sampleSize} units</div>
              <div><strong>Eval Date:</strong> {r.evalDate}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ textAlign: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: passColor(r.visualPassRate) }}>{r.visualPassRate}%</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Visual Inspection</div>
                <div style={{ fontSize: "0.75rem" }}>{Math.round(r.sampleSize * (1 - r.visualPassRate / 100))} of {r.sampleSize} failed</div>
              </div>
              <div style={{ textAlign: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: passColor(r.qltPassRate) }}>{r.qltPassRate}%</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>QLT (300 mmH₂O)</div>
                <div style={{ fontSize: "0.75rem" }}>{Math.round(r.sampleSize * (1 - r.qltPassRate / 100))} of {r.sampleSize} failed</div>
              </div>
              <div style={{ textAlign: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: passColor(r.bmsPassRate) }}>{r.bmsPassRate}%</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>BMS (Rated Duration)</div>
                <div style={{ fontSize: "0.75rem" }}>{Math.round(r.sampleSize * (1 - r.bmsPassRate / 100))} of {r.sampleSize} failed</div>
              </div>
            </div>
            <div className="info-box" style={{
              borderColor: r.overallStatus === "fail" ? "var(--danger)" : r.overallStatus === "warning" ? "var(--warning)" : "var(--success)",
              backgroundColor: r.overallStatus === "fail" ? "rgba(220,38,38,0.05)" : r.overallStatus === "warning" ? "rgba(245,158,11,0.05)" : "rgba(34,197,94,0.05)",
            }}>
              <strong>Notes:</strong> {r.notes}
            </div>
          </div>
        );
      })()}

      {/* CSE SR-100 Trend Analysis */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Trend Analysis: CSE Corp. SR-100 SCSR (Declining)</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Phase-over-phase pass rates showing consistent decline. Historical precedent: CSE SR-100 oxygen starter assembly failures led to NIOSH/MSHA approval rescission (2009-2013).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          {LTFE_TRENDS.map((trend) => (
            <div key={trend.metric} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem" }}>
              <h4 style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>{trend.metric}</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={trend.dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="phase" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {trend.dataPoints.map((entry, idx) => (
                      <Cell key={idx} fill={entry.value >= 90 ? "var(--success)" : entry.value >= 75 ? "var(--warning)" : "var(--danger)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <div className="guidance-card" style={{ borderColor: "var(--danger)", marginTop: "1rem" }}>
          <div className="guidance-body">
            <p><strong>AI Recommendation:</strong> CSE SR-100 SCSR pass rates are declining across all three LTFE test phases. Current BMS pass rate (84%) indicates 16% of units may not sustain rated duration. Recommend:</p>
            <ul style={{ margin: "0.75rem 0" }}>
              <li>Issue field replacement advisory for all SR-100 units deployed &gt; 36 months</li>
              <li>Prioritize high-humidity mine sites for immediate replacement</li>
              <li>Coordinate with MSHA on 30 CFR 75.1714 compliance impact</li>
              <li>Request manufacturer root cause analysis on oxygen starter assembly reliability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function NriTracker({ onBack }: { onBack: () => void }) {
  const [selectedNri, setSelectedNri] = useState<string | null>(null);

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: "1rem" }}>
        &larr; Back to Overview
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>NRI Lifecycle Tracker</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Nonconformance Response Investigations per CA 2023-1062
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", textAlign: "center" }}>
            <div>
              <div className="kpi-value" style={{ color: "var(--danger)" }}>{NRI_INVESTIGATIONS.filter((n) => n.status !== "closed").length}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Active NRIs</div>
            </div>
            <div>
              <div className="kpi-value" style={{ color: "var(--success)" }}>{NRI_INVESTIGATIONS.filter((n) => n.status === "closed").length}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Closed</div>
            </div>
          </div>
        </div>

        <table className="data-table" style={{ marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>NRI ID</th>
              <th>Manufacturer</th>
              <th>Product</th>
              <th>Trigger</th>
              <th>Opened</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {NRI_INVESTIGATIONS.map((n) => (
              <tr key={n.nriId}
                className={n.severity === "critical" ? "row-fail" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedNri(selectedNri === n.nriId ? null : n.nriId)}
              >
                <td><strong>{n.nriId}</strong></td>
                <td>{n.manufacturer}</td>
                <td style={{ fontSize: "0.85rem" }}>{n.product}</td>
                <td style={{ fontSize: "0.85rem" }}>{n.triggerType}</td>
                <td>{n.openDate}</td>
                <td>
                  <span className={`badge ${n.severity === "critical" ? "badge-fail" : n.severity === "major" ? "badge-warning" : "badge-pass"}`}>
                    {n.severity.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`badge ${n.status === "closed" ? "badge-pass" : n.status === "open" ? "badge-fail" : "badge-warning"}`}>
                    {n.statusLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline detail for selected NRI */}
      {selectedNri && (() => {
        const n = NRI_INVESTIGATIONS.find((i) => i.nriId === selectedNri);
        if (!n) return null;
        return (
          <div className="card" style={{ marginTop: "1rem" }}>
            <div className="detail-header">
              <div>
                <h3>{n.nriId} — {n.manufacturer}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {n.tcNumber} | {n.product} | {n.productType}
                </p>
              </div>
              <span className={`badge ${n.severity === "critical" ? "badge-fail" : n.severity === "major" ? "badge-warning" : "badge-pass"}`}>
                {n.severity.toUpperCase()}
              </span>
            </div>

            <div style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
              <strong>Trigger:</strong> {n.triggerType}<br />
              <strong>Related IDs:</strong> {n.triggerIds.join(", ")}
            </div>

            {/* Timeline */}
            <div style={{ marginTop: "1.5rem" }}>
              <h4 style={{ marginBottom: "1rem" }}>Investigation Timeline</h4>
              <div style={{ position: "relative", paddingLeft: "2rem" }}>
                {n.timeline.map((step, idx) => (
                  <div key={idx} style={{ position: "relative", paddingBottom: idx < n.timeline.length - 1 ? "1.5rem" : 0, marginBottom: idx < n.timeline.length - 1 ? "0.5rem" : 0 }}>
                    {/* Connector line */}
                    {idx < n.timeline.length - 1 && (
                      <div style={{ position: "absolute", left: "-1.25rem", top: "1.25rem", bottom: 0, width: "2px", backgroundColor: step.status === "completed" ? "var(--success)" : "var(--border)" }} />
                    )}
                    {/* Dot */}
                    <div style={{
                      position: "absolute", left: "-1.65rem", top: "0.2rem", width: "12px", height: "12px", borderRadius: "50%",
                      backgroundColor: step.status === "completed" ? "var(--success)" : step.status === "current" ? "var(--warning)" : "var(--border)",
                      border: step.status === "current" ? "2px solid var(--warning)" : "none",
                      boxShadow: step.status === "current" ? "0 0 6px var(--warning)" : "none",
                    }} />
                    <div style={{ opacity: step.status === "pending" ? 0.5 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: "0.9rem" }}>{step.event}</strong>
                        {step.date && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{step.date}</span>}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {n.status !== "closed" && (
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                {n.status === "manufacturer_response" && <button className="btn btn-primary">Send Reminder</button>}
                {n.status === "open" && <button className="btn btn-primary">Track Response</button>}
                {n.status === "corrective_action" && <button className="btn btn-primary">Schedule Verification Audit</button>}
                <button className="btn btn-secondary">View Documents</button>
                <button className="btn btn-secondary">Contact Manufacturer</button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function MshaCoordinationPanel({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: "1rem" }}>
        &larr; Back to Overview
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>MSHA Coordination Panel</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Joint NIOSH/MSHA investigations, referrals, and 30 CFR 75.1714 compliance tracking
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", textAlign: "center" }}>
            <div>
              <div className="kpi-value">{MSHA_COORDINATIONS.length}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Active Referrals</div>
            </div>
            <div>
              <div className="kpi-value" style={{ color: "var(--danger)" }}>
                {MSHA_COORDINATIONS.filter((m) => m.type === "Joint NIOSH/MSHA Investigation").length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Joint Investigations</div>
            </div>
          </div>
        </div>

        <table className="data-table" style={{ marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>Referral ID</th>
              <th>Date</th>
              <th>Mine</th>
              <th>Type</th>
              <th>Product</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MSHA_COORDINATIONS.map((m) => (
              <tr key={m.referralId} className={m.type.includes("Joint") ? "row-fail" : ""}>
                <td><strong>{m.referralId}</strong></td>
                <td>{m.date}</td>
                <td>{m.mineName} ({m.mineState})</td>
                <td style={{ fontSize: "0.85rem" }}>{m.type}</td>
                <td style={{ fontSize: "0.85rem" }}>{m.relatedProduct}</td>
                <td>
                  <span className={`badge ${m.status === "Resolved" ? "badge-pass" : m.status.includes("Pending") ? "badge-fail" : "badge-warning"}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail cards */}
      {MSHA_COORDINATIONS.map((m) => (
        <div className="card" key={m.referralId} style={{ marginTop: "1rem" }}>
          <h3>{m.referralId} — {m.type}</h3>
          <div className="detail-grid" style={{ marginBottom: "0.75rem" }}>
            <div><strong>Mine:</strong> {m.mineName} (ID: {m.mineId})</div>
            <div><strong>State:</strong> {m.mineState}</div>
            <div><strong>Operator:</strong> {m.operator}</div>
            <div><strong>Date:</strong> {m.date}</div>
            <div><strong>Product:</strong> {m.relatedProduct}</div>
            <div><strong>Manufacturer:</strong> {m.relatedManufacturer}</div>
          </div>
          <div className="info-box" style={{ marginBottom: "0.75rem" }}>
            <strong>Description:</strong> {m.description}
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            <strong>NIOSH Action:</strong> {m.nioshAction}
          </div>
          {m.linkedNri && (
            <div style={{ marginTop: "0.5rem" }}>
              <span className="badge badge-warning">Linked to {m.linkedNri}</span>
            </div>
          )}
        </div>
      ))}

      {/* 30 CFR 75.1714 Overview */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>30 CFR 75.1714 Compliance Overview</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Every underground coal miner must have access to a NIOSH/MSHA-approved SCSR. Mine operators must maintain caches at designated locations.
        </p>
        <table className="data-table">
          <thead>
            <tr><th>Requirement</th><th>Status</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>All miners have SCSR access</td>
              <td><span className="badge badge-pass">COMPLIANT</span></td>
              <td>Verified across all reported mine sites</td>
            </tr>
            <tr>
              <td>Cache locations maintained per plan</td>
              <td><span className="badge badge-warning">2 SITES WITH ISSUES</span></td>
              <td>Pinnacle Mine No. 1 and Federal Mine No. 2 had overdue inspection units</td>
            </tr>
            <tr>
              <td>Units within rated shelf life</td>
              <td><span className="badge badge-warning">REVIEW NEEDED</span></td>
              <td>CSE SR-100 units at 48+ months showing elevated failure rates in LTFE</td>
            </tr>
            <tr>
              <td>Field replacement advisories current</td>
              <td><span className="badge badge-fail">PENDING</span></td>
              <td>Joint determination pending for SR-100 units &gt; 36 months in high-humidity sites</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SurveillanceDashboard() {
  const [view, setView] = useState<View>("overview");

  return (
    <div>
      <div className="module-header">
        <h1>Module 5: Post-Market Surveillance Dashboard</h1>
        <p>
          Unified surveillance dashboard aggregating field audits, complaints,
          counterfeit intelligence, SCSR field evaluations, and MSHA coordination
          with AI-assisted triage and trend detection.
        </p>
      </div>

      {view === "overview" && (
        <OverviewDashboard onNavigate={(v) => setView(v)} />
      )}
      {view === "drift" && (
        <DriftDetail onBack={() => setView("overview")} />
      )}
      {view === "sar_drift" && (
        <SarDriftDetail onBack={() => setView("overview")} />
      )}
      {view === "complaints" && (
        <ComplaintQueue onBack={() => setView("overview")} />
      )}
      {view === "counterfeit" && (
        <CounterfeitMonitoring onBack={() => setView("overview")} />
      )}
      {view === "ltfe" && (
        <LtfeResults onBack={() => setView("overview")} />
      )}
      {view === "nri" && (
        <NriTracker onBack={() => setView("overview")} />
      )}
      {view === "msha" && (
        <MshaCoordinationPanel onBack={() => setView("overview")} />
      )}
    </div>
  );
}
