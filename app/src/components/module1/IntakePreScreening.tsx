import { useState } from "react";
import {
  FFR_SAP_CHECKLIST,
  SAMPLE_APPLICATION,
  AI_GUIDANCE,
} from "../../data/sapRules";
import type { ApplicationPackage, GuidanceEntry } from "../../data/sapRules";

type Screen = "upload" | "report" | "guidance" | "summary";

function StatusBadge({ status }: { status: "pass" | "fail" | "warning" | "na" }) {
  const styles: Record<string, string> = {
    pass: "badge-pass",
    fail: "badge-fail",
    warning: "badge-warning",
    na: "badge-na",
  };
  const labels: Record<string, string> = {
    pass: "PASS",
    fail: "FAIL",
    warning: "WARNING",
    na: "N/A",
  };
  return <span className={`badge ${styles[status]}`}>{labels[status]}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "badge-fail",
    major: "badge-warning",
    minor: "badge-na",
  };
  return (
    <span className={`badge ${styles[severity] || "badge-na"}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function UploadScreen({ onUpload }: { onUpload: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onUpload, 300);
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  return (
    <div className="card">
      <h2>Upload Application Package</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Upload a respirator approval application package for automated
        pre-screening against the applicable Standard Application Procedure.
      </p>

      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleUpload();
        }}
        onClick={handleUpload}
      >
        {!uploading ? (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>+</div>
            <p>
              <strong>Click or drag files</strong> to upload application package
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Accepted: CD-R/DVD-R image files, or structured data (JSON)
            </p>
          </>
        ) : (
          <>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Processing application package...</strong>
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
              }}
            >
              {progress < 40
                ? "Identifying respirator class..."
                : progress < 70
                ? "Selecting SAP checklist for FFR..."
                : progress < 100
                ? "Parsing documents and cross-referencing..."
                : "Complete — generating report"}
            </p>
          </>
        )}
      </div>

      <div className="info-box" style={{ marginTop: "1.5rem" }}>
        <strong>Demo Note:</strong> This will load a simulated application from
        AirShield Safety Corp for an N95 FFR, pre-populated with realistic
        deficiencies for demonstration purposes.
      </div>
    </div>
  );
}

function getDocStatus(
  doc: ApplicationPackage["documents"][0]
): "pass" | "fail" | "warning" | "na" {
  if (!doc.present && doc.compliant) return "na"; // N/A item
  if (!doc.present) return "fail";
  if (!doc.compliant) return "fail";
  return "pass";
}

function CompletenessReport({
  app,
  onNext,
}: {
  app: ApplicationPackage;
  onNext: () => void;
}) {
  const checklist = FFR_SAP_CHECKLIST;
  const passCount = app.documents.filter(
    (d) => d.present && d.compliant
  ).length;
  const failCount = app.documents.filter(
    (d) => d.present && !d.compliant
  ).length;
  const naCount = app.documents.filter(
    (d) => !d.present && d.compliant
  ).length;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2>Completeness Report</h2>
          <p style={{ color: "var(--text-muted)" }}>
            {app.manufacturerName} — {app.modelDesignation}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="kpi-value" style={{ color: failCount > 0 ? "var(--danger)" : "var(--success)" }}>
            {passCount} / {app.documents.length - naCount}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            requirements met
          </div>
        </div>
      </div>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        <strong>SAP Applied:</strong> {checklist.sapTitle}
        <br />
        <strong>Respirator Class:</strong> {checklist.respiratorClass}
        <br />
        <strong>Application ID:</strong> {app.applicationId} |{" "}
        <strong>Submitted:</strong> {app.submissionDate}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: "50px" }}>#</th>
            <th>Requirement</th>
            <th style={{ width: "100px" }}>Status</th>
            <th style={{ width: "100px" }}>Severity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {checklist.items.map((item) => {
            const doc = app.documents.find(
              (d) => d.checklistItemId === item.id
            );
            if (!doc) return null;
            const status = getDocStatus(doc);
            return (
              <tr key={item.id} className={status === "fail" ? "row-fail" : ""}>
                <td>{item.id}</td>
                <td>
                  <strong>{item.requirement}</strong>
                  <br />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {item.sapSection} | {item.cfrReference}
                  </span>
                </td>
                <td>
                  <StatusBadge status={status} />
                </td>
                <td>
                  {status === "fail" && (
                    <SeverityBadge severity={item.severity} />
                  )}
                </td>
                <td style={{ fontSize: "0.9rem" }}>{doc.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
        <button className="btn btn-primary" onClick={onNext}>
          View AI Remediation Guidance
        </button>
      </div>
    </div>
  );
}

function GuidanceScreen({
  guidance,
  onNext,
}: {
  guidance: GuidanceEntry[];
  onNext: () => void;
}) {
  const checklist = FFR_SAP_CHECKLIST;

  return (
    <div className="card">
      <h2>AI-Generated Remediation Guidance</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        For each deficiency, the system provides specific remediation guidance
        drawn from the applicable SAP, Conformity Assessment Notices, and 42 CFR
        Part 84.
      </p>

      <div className="info-box" style={{ marginBottom: "1.5rem" }}>
        <strong>Human Review Notice:</strong> This guidance is AI-generated to
        assist applicants and reviewers. All recommendations should be verified
        by a qualified NIOSH reviewer before being issued as official
        correspondence.
      </div>

      {guidance.map((g) => {
        const item = checklist.items.find((i) => i.id === g.checklistItemId);
        return (
          <div key={g.checklistItemId} className="guidance-card">
            <div className="guidance-header">
              <SeverityBadge severity={item?.severity || "major"} />
              <strong style={{ marginLeft: "0.5rem" }}>
                Item {g.checklistItemId}: {item?.requirement}
              </strong>
            </div>
            <div className="guidance-body">
              <p>{g.guidance}</p>
              <div className="guidance-refs">
                <strong>References:</strong>
                <ul>
                  {g.references.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
        <button className="btn btn-primary" onClick={onNext}>
          View Summary & Export
        </button>
      </div>
    </div>
  );
}

function SummaryScreen({
  app,
  onRestart,
}: {
  app: ApplicationPackage;
  onRestart: () => void;
}) {
  const passCount = app.documents.filter(
    (d) => d.present && d.compliant
  ).length;
  const failCount = app.documents.filter(
    (d) => d.present && !d.compliant
  ).length;
  const totalApplicable = app.documents.filter(
    (d) => d.present || !d.compliant
  ).length;
  const criticalCount = app.documents.filter((d) => {
    if (d.present && d.compliant) return false;
    if (!d.present && d.compliant) return false;
    const item = FFR_SAP_CHECKLIST.items.find(
      (i) => i.id === d.checklistItemId
    );
    return item?.severity === "critical";
  }).length;
  const majorCount = failCount - criticalCount;

  return (
    <div className="card">
      <h2>Pre-Screening Summary</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        {app.manufacturerName} — {app.modelDesignation} ({app.applicationId})
      </p>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--success)" }}>
            {passCount}
          </div>
          <div className="kpi-label">Requirements Met</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {failCount}
          </div>
          <div className="kpi-label">Deficiencies Found</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {criticalCount}
          </div>
          <div className="kpi-label">Critical</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: "var(--warning)" }}>
            {majorCount}
          </div>
          <div className="kpi-label">Major</div>
        </div>
      </div>

      <div className="readiness-bar" style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.25rem",
          }}
        >
          <span>Submission Readiness</span>
          <span>{Math.round((passCount / totalApplicable) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(passCount / totalApplicable) * 100}%`,
              backgroundColor:
                passCount / totalApplicable > 0.8
                  ? "var(--success)"
                  : passCount / totalApplicable > 0.5
                  ? "var(--warning)"
                  : "var(--danger)",
            }}
          />
        </div>
      </div>

      <div
        className="info-box"
        style={{
          marginTop: "1.5rem",
          borderColor: "var(--danger)",
          backgroundColor: "rgba(220, 38, 38, 0.05)",
        }}
      >
        <strong>Recommendation:</strong> This application package has{" "}
        {criticalCount} critical and {majorCount} major deficiencies that must
        be resolved before it can proceed to formal review. The applicant should
        address all items identified in the remediation guidance and resubmit.
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "0.75rem",
          justifyContent: "flex-end",
        }}
      >
        <button className="btn btn-secondary" onClick={onRestart}>
          Screen Another Application
        </button>
        <button className="btn btn-primary">Export PDF Report</button>
        <button className="btn btn-secondary">
          Forward to Reviewer
        </button>
      </div>
    </div>
  );
}

export default function IntakePreScreening() {
  const [screen, setScreen] = useState<Screen>("upload");

  return (
    <div>
      <div className="module-header">
        <h1>Module 1: Intelligent Intake & Pre-Screening</h1>
        <p>
          Automated review of application packages against Standard Application
          Procedures, with AI-generated remediation guidance.
        </p>
      </div>

      {/* Step indicator */}
      <div className="steps">
        {(
          [
            ["upload", "Upload & Parse"],
            ["report", "Completeness Report"],
            ["guidance", "AI Guidance"],
            ["summary", "Summary"],
          ] as [Screen, string][]
        ).map(([key, label], i) => (
          <div
            key={key}
            className={`step ${screen === key ? "step-active" : ""} ${
              ["upload", "report", "guidance", "summary"].indexOf(screen) > i
                ? "step-complete"
                : ""
            }`}
            onClick={() => {
              if (
                ["upload", "report", "guidance", "summary"].indexOf(screen) >= i
              ) {
                setScreen(key);
              }
            }}
          >
            <div className="step-number">{i + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      {screen === "upload" && (
        <UploadScreen onUpload={() => setScreen("report")} />
      )}
      {screen === "report" && (
        <CompletenessReport
          app={SAMPLE_APPLICATION}
          onNext={() => setScreen("guidance")}
        />
      )}
      {screen === "guidance" && (
        <GuidanceScreen
          guidance={AI_GUIDANCE}
          onNext={() => setScreen("summary")}
        />
      )}
      {screen === "summary" && (
        <SummaryScreen
          app={SAMPLE_APPLICATION}
          onRestart={() => setScreen("upload")}
        />
      )}
    </div>
  );
}
