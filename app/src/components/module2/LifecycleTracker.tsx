import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  APPLICATIONS,
  STAGE_ORDER,
  STAGE_MEDIAN_DAYS,
  THROUGHPUT_DATA,
  AVG_DAYS_BY_CLASS,
} from "../../data/applications";
import type { Application } from "../../data/applications";

type View = "kanban" | "detail" | "analytics";

function RiskBadge({ level }: { level: string }) {
  if (level === "NONE") return null;
  const cls =
    level === "HIGH"
      ? "badge-fail"
      : level === "MEDIUM"
      ? "badge-warning"
      : "badge-pass";
  return <span className={`badge ${cls}`}>{level} RISK</span>;
}

function KanbanBoard({
  onSelectApp,
}: {
  onSelectApp: (app: Application) => void;
}) {
  const atRiskCount = APPLICATIONS.filter(
    (a) => a.riskLevel !== "NONE"
  ).length;

  return (
    <div>
      {/* Summary bar */}
      <div className="kpi-row" style={{ marginBottom: "1.5rem" }}>
        <div className="kpi-card">
          <div className="kpi-value">{APPLICATIONS.length}</div>
          <div className="kpi-label">Active Applications</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {atRiskCount}
          </div>
          <div className="kpi-label">Flagged At-Risk</div>
        </div>
        {STAGE_ORDER.map((stage) => {
          const count = APPLICATIONS.filter(
            (a) => a.currentStage === stage
          ).length;
          if (count === 0) return null;
          return (
            <div className="kpi-card" key={stage}>
              <div className="kpi-value">{count}</div>
              <div className="kpi-label">{stage}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban columns */}
      <div className="kanban-board">
        {STAGE_ORDER.map((stage) => {
          const apps = APPLICATIONS.filter((a) => a.currentStage === stage);
          return (
            <div className="kanban-column" key={stage}>
              <div className="kanban-column-header">
                <span>{stage}</span>
                <span className="kanban-count">{apps.length}</span>
              </div>
              {apps.map((app) => (
                <div
                  className={`kanban-card ${
                    app.riskLevel !== "NONE" ? "kanban-card-risk" : ""
                  }`}
                  key={app.appId}
                  onClick={() => onSelectApp(app)}
                >
                  <div className="kanban-card-header">
                    <span className="kanban-app-id">{app.appId}</span>
                    <RiskBadge level={app.riskLevel} />
                  </div>
                  <div className="kanban-card-manufacturer">
                    {app.manufacturer}
                  </div>
                  <div className="kanban-card-meta">
                    <span>{app.respiratorClass}</span>
                    <span>
                      {app.daysInStage}d in stage
                      {app.daysInStage >
                        STAGE_MEDIAN_DAYS[app.currentStage] * 1.5 && (
                        <span style={{ color: "var(--danger)" }}> !</span>
                      )}
                    </span>
                  </div>
                  <div className="kanban-card-footer">
                    <span>{app.country}</span>
                    <span>{app.applicantType}</span>
                  </div>
                </div>
              ))}
              {apps.length === 0 && (
                <div className="kanban-empty">No applications</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationDetail({
  app,
  onBack,
}: {
  app: Application;
  onBack: () => void;
}) {
  const medianDays = STAGE_MEDIAN_DAYS[app.currentStage];
  const ratio = (app.daysInStage / medianDays).toFixed(2);

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: "1rem" }}
      >
        &larr; Back to Board
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h2>
              {app.appId} — {app.manufacturer}
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              {app.respiratorClass} | {app.applicantType} | {app.country}
            </p>
          </div>
          <RiskBadge level={app.riskLevel} />
        </div>

        <div className="kpi-row" style={{ marginTop: "1rem" }}>
          <div className="kpi-card">
            <div className="kpi-value">{app.currentStage}</div>
            <div className="kpi-label">Current Stage</div>
          </div>
          <div className="kpi-card">
            <div
              className="kpi-value"
              style={{
                color:
                  app.daysInStage > medianDays * 1.5
                    ? "var(--danger)"
                    : "var(--text)",
              }}
            >
              {app.daysInStage}
            </div>
            <div className="kpi-label">
              Days in Stage (median: {medianDays})
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">{ratio}x</div>
            <div className="kpi-label">vs. Median Duration</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">{app.intakeCompletenessScore}%</div>
            <div className="kpi-label">Intake Score</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Stage Timeline</h3>
        <div className="timeline">
          {app.stageHistory.map((s, i) => (
            <div
              className={`timeline-item ${
                !s.completedDate ? "timeline-current" : ""
              }`}
              key={i}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <strong>{s.stage}</strong>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Entered: {s.enteredDate}
                  {s.completedDate && ` — Completed: ${s.completedDate}`}
                  {s.reviewer && ` | Reviewer: ${s.reviewer}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk factors */}
      {app.riskFactors.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>AI Risk Analysis</h3>
          <div className="info-box" style={{ marginBottom: "1rem" }}>
            <strong>Human Review Notice:</strong> Risk assessments are
            AI-generated indicators. All escalation decisions must be made by
            authorized program staff.
          </div>
          <h4>Risk Factors Identified</h4>
          <ul className="risk-list">
            {app.riskFactors.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <h4 style={{ marginTop: "1rem" }}>Recommended Actions</h4>
          <ul className="action-list">
            {app.recommendedActions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Deficiencies */}
      {app.deficiencies.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Open Deficiency Items ({app.deficiencies.length})</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Status</th>
                <th>Opened</th>
              </tr>
            </thead>
            <tbody>
              {app.deficiencies.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.id}</strong>
                  </td>
                  <td>{d.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        d.status === "open" ? "badge-warning" : "badge-pass"
                      }`}
                    >
                      {d.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{d.openedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment info */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Assignment</h3>
        <div className="detail-grid">
          <div>
            <strong>Assigned Reviewer:</strong> {app.assignedReviewer}
          </div>
          <div>
            <strong>SLA Target Date:</strong>{" "}
            <span
              style={{
                color:
                  new Date(app.slaTargetDate) < new Date()
                    ? "var(--danger)"
                    : "var(--text)",
              }}
            >
              {app.slaTargetDate}
              {new Date(app.slaTargetDate) < new Date() && " (OVERDUE)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Throughput chart */}
        <div className="card">
          <h3>Application Throughput by Quarter</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={THROUGHPUT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="approvals"
                stroke="var(--success)"
                strokeWidth={2}
                name="Approvals"
              />
              <Line
                type="monotone"
                dataKey="denials"
                stroke="var(--danger)"
                strokeWidth={2}
                name="Denials"
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="var(--primary)"
                strokeWidth={2}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average days by class */}
        <div className="card">
          <h3>Average Total Days by Respirator Class</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={AVG_DAYS_BY_CLASS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="className"
                type="category"
                tick={{ fontSize: 11 }}
                width={100}
              />
              <Tooltip />
              <Bar dataKey="avgDays" fill="var(--primary)" name="Avg. Days" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stall rate comparison */}
        <div className="card">
          <h3>Stall Rate by Applicant Type</h3>
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-value" style={{ color: "var(--danger)" }}>
                38%
              </div>
              <div className="kpi-label">New Applicants</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value" style={{ color: "var(--success)" }}>
                12%
              </div>
              <div className="kpi-label">Existing Holders</div>
            </div>
          </div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginTop: "0.75rem",
            }}
          >
            New applicants are 3.2x more likely to stall during the approval
            process. Most stalls occur at the Engineering Review and QMS Review
            stages due to documentation deficiencies and site qualification
            challenges.
          </p>
        </div>

        {/* Geographic distribution */}
        <div className="card">
          <h3>Active Applications by Country</h3>
          <div className="country-grid">
            {Object.entries(
              APPLICATIONS.reduce(
                (acc, a) => {
                  acc[a.country] = (acc[a.country] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              )
            )
              .sort((a, b) => b[1] - a[1])
              .map(([country, count]) => (
                <div className="country-item" key={country}>
                  <span className="country-name">{country}</span>
                  <div className="country-bar-container">
                    <div
                      className="country-bar"
                      style={{
                        width: `${(count / APPLICATIONS.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="country-count">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LifecycleTracker() {
  const [view, setView] = useState<View>("kanban");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleSelectApp = (app: Application) => {
    setSelectedApp(app);
    setView("detail");
  };

  return (
    <div>
      <div className="module-header">
        <h1>Module 2: Application Lifecycle Tracker</h1>
        <p>
          Workflow dashboard tracking every application through the 7-stage
          approval process, with AI-powered stall prediction and risk
          assessment.
        </p>
      </div>

      {/* View tabs */}
      <div className="tabs" style={{ marginBottom: "1.5rem" }}>
        <button
          className={`tab ${view === "kanban" || view === "detail" ? "tab-active" : ""}`}
          onClick={() => {
            setView("kanban");
            setSelectedApp(null);
          }}
        >
          Portfolio Board
        </button>
        <button
          className={`tab ${view === "analytics" ? "tab-active" : ""}`}
          onClick={() => setView("analytics")}
        >
          Analytics
        </button>
      </div>

      {view === "kanban" && <KanbanBoard onSelectApp={handleSelectApp} />}
      {view === "detail" && selectedApp && (
        <ApplicationDetail
          app={selectedApp}
          onBack={() => {
            setView("kanban");
            setSelectedApp(null);
          }}
        />
      )}
      {view === "analytics" && <AnalyticsView />}
    </div>
  );
}
