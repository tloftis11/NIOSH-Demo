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
} from "recharts";
import {
  SURVEILLANCE_KPIS,
  MANUFACTURER_RISKS,
  FIELD_AUDIT_RESULTS,
  AUDIT_TRENDS,
  COMPLAINTS,
  COUNTERFEIT_ALERTS,
} from "../../data/surveillance";
import type { Complaint, CounterfeitAlert } from "../../data/surveillance";

type View = "overview" | "drift" | "complaints" | "counterfeit";

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

        {/* Trend charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {AUDIT_TRENDS.map((trend) => (
            <div key={trend.testType} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem" }}>
              <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                {trend.testType}
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trend.dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={
                      trend.thresholdDirection === "min"
                        ? [
                            (dataMin: number) =>
                              Math.min(dataMin, trend.threshold) - 1,
                            "auto",
                          ]
                        : [
                            "auto",
                            (dataMax: number) =>
                              Math.max(dataMax, trend.threshold) + 2,
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
                    stroke={
                      trend.dataPoints[trend.dataPoints.length - 1].value >
                        trend.threshold ===
                      (trend.thresholdDirection === "max")
                        ? "var(--danger)"
                        : "var(--primary)"
                    }
                    strokeWidth={2}
                    dot={{ r: 4 }}
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
            </div>
          ))}
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

export default function SurveillanceDashboard() {
  const [view, setView] = useState<View>("overview");

  return (
    <div>
      <div className="module-header">
        <h1>Module 5: Post-Market Surveillance Dashboard</h1>
        <p>
          Unified surveillance dashboard aggregating field audits, complaints,
          and counterfeit intelligence with AI-assisted triage and trend
          detection.
        </p>
      </div>

      {view === "overview" && (
        <OverviewDashboard onNavigate={(v) => setView(v)} />
      )}
      {view === "drift" && (
        <DriftDetail onBack={() => setView("overview")} />
      )}
      {view === "complaints" && (
        <ComplaintQueue onBack={() => setView("overview")} />
      )}
      {view === "counterfeit" && (
        <CounterfeitMonitoring onBack={() => setView("overview")} />
      )}
    </div>
  );
}
