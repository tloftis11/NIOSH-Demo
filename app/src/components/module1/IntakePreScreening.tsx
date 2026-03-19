import { useState } from "react";
import {
  FFR_SAP_CHECKLIST,
  SAMPLE_APPLICATION,
  AI_GUIDANCE,
} from "../../data/sapRules";
import type {
  ApplicationPackage,
  GuidanceEntry,
  SubmittedDocument,
} from "../../data/sapRules";

type Screen = "upload" | "report" | "guidance" | "summary";

const MANUAL_REVIEW_IDS = [2, 3, 10, 11];

function StatusBadge({
  status,
}: {
  status: "pass" | "fail" | "warning" | "na" | "manual-review";
}) {
  const styles: Record<string, string> = {
    pass: "badge-pass",
    fail: "badge-fail",
    warning: "badge-warning",
    na: "badge-na",
    "manual-review": "badge-manual-review",
  };
  const labels: Record<string, string> = {
    pass: "PASS",
    fail: "FAIL",
    warning: "WARNING",
    na: "N/A",
    "manual-review": "PENDING REVIEW",
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
  doc: SubmittedDocument
): "pass" | "fail" | "warning" | "na" | "manual-review" {
  // If this is a manual review item and hasn't been reviewed yet, show pending
  if (doc.manualReviewStatus === "pending") return "manual-review";
  if (!doc.present && doc.compliant) return "na"; // N/A item
  if (!doc.present) return "fail";
  if (!doc.compliant) return "fail";
  return "pass";
}

function ManualReviewPanel({
  documents,
  onSubmitReview,
}: {
  documents: SubmittedDocument[];
  onSubmitReview: (reviews: Map<number, { status: "verified" | "flagged"; notes: string }>) => void;
}) {
  const checklist = FFR_SAP_CHECKLIST;
  const manualDocs = documents.filter((d) =>
    MANUAL_REVIEW_IDS.includes(d.checklistItemId)
  );

  const [reviews, setReviews] = useState<
    Map<number, { status: "verified" | "flagged" | null; notes: string }>
  >(() => {
    const m = new Map();
    manualDocs.forEach((d) =>
      m.set(d.checklistItemId, { status: null, notes: "" })
    );
    return m;
  });

  const allReviewed = Array.from(reviews.values()).every(
    (r) => r.status !== null
  );

  const handleStatusChange = (id: number, status: "verified" | "flagged") => {
    setReviews((prev) => {
      const next = new Map(prev);
      const existing = next.get(id) || { status: null, notes: "" };
      next.set(id, { ...existing, status });
      return next;
    });
  };

  const handleNotesChange = (id: number, notes: string) => {
    setReviews((prev) => {
      const next = new Map(prev);
      const existing = next.get(id) || { status: null, notes: "" };
      next.set(id, { ...existing, notes });
      return next;
    });
  };

  const handleSubmit = () => {
    const finalReviews = new Map<number, { status: "verified" | "flagged"; notes: string }>();
    reviews.forEach((val, key) => {
      if (val.status) {
        finalReviews.set(key, { status: val.status, notes: val.notes });
      }
    });
    onSubmitReview(finalReviews);
  };

  return (
    <div className="manual-review-panel">
      <div className="manual-review-panel-header">
        <h3>Manual Review Required</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          The following items require physical verification and could not be
          assessed by document scanning. Please verify each item and record your
          findings.
        </p>
      </div>

      <div className="manual-review-items">
        {manualDocs.map((doc) => {
          const item = checklist.items.find((i) => i.id === doc.checklistItemId);
          if (!item) return null;
          const review = reviews.get(doc.checklistItemId);

          return (
            <div key={doc.checklistItemId} className="manual-review-item">
              <div className="manual-review-item-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="manual-review-item-number">#{item.id}</span>
                  <strong>{item.requirement}</strong>
                </div>
                <SeverityBadge severity={item.severity} />
              </div>
              <p className="manual-review-item-desc">{item.description}</p>
              <div className="manual-review-item-ref">
                {item.sapSection} | {item.cfrReference}
              </div>

              <div className="manual-review-actions">
                <div className="manual-review-toggles">
                  <button
                    className={`btn-toggle ${review?.status === "verified" ? "btn-toggle-pass" : ""}`}
                    onClick={() => handleStatusChange(doc.checklistItemId, "verified")}
                  >
                    Verified (Pass)
                  </button>
                  <button
                    className={`btn-toggle ${review?.status === "flagged" ? "btn-toggle-fail" : ""}`}
                    onClick={() => handleStatusChange(doc.checklistItemId, "flagged")}
                  >
                    Flagged (Fail)
                  </button>
                </div>
                <input
                  type="text"
                  className="manual-review-notes-input"
                  placeholder="Reviewer notes (optional)"
                  value={review?.notes || ""}
                  onChange={(e) =>
                    handleNotesChange(doc.checklistItemId, e.target.value)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          className="btn btn-primary"
          disabled={!allReviewed}
          onClick={handleSubmit}
          style={{ opacity: allReviewed ? 1 : 0.5 }}
        >
          Submit Manual Review
        </button>
      </div>
    </div>
  );
}

function CompletenessReport({
  app,
  onNext,
  onDocumentsUpdate,
}: {
  app: ApplicationPackage;
  onNext: () => void;
  onDocumentsUpdate: (docs: SubmittedDocument[]) => void;
}) {
  const checklist = FFR_SAP_CHECKLIST;
  const [showManualPanel, setShowManualPanel] = useState(false);

  const manualPendingCount = app.documents.filter(
    (d) => d.manualReviewStatus === "pending"
  ).length;
  const manualCompletedCount = app.documents.filter(
    (d) => d.manualReviewStatus === "verified" || d.manualReviewStatus === "flagged"
  ).length;

  // Automated items metrics (exclude manual-review items and N/A)
  const automatedDocs = app.documents.filter(
    (d) => !MANUAL_REVIEW_IDS.includes(d.checklistItemId)
  );
  const autoNaCount = automatedDocs.filter(
    (d) => !d.present && d.compliant
  ).length;
  const autoPassCount = automatedDocs.filter(
    (d) => d.present && d.compliant
  ).length;
  const autoApplicable = automatedDocs.length - autoNaCount;

  const handleManualReviewSubmit = (
    reviews: Map<number, { status: "verified" | "flagged"; notes: string }>
  ) => {
    const updatedDocs = app.documents.map((doc) => {
      const review = reviews.get(doc.checklistItemId);
      if (!review) return doc;

      if (review.status === "verified") {
        return {
          ...doc,
          manualReviewStatus: "verified" as const,
          reviewerNotes: review.notes || undefined,
          // Keep the underlying present/compliant as-is (the true values)
        };
      } else {
        return {
          ...doc,
          manualReviewStatus: "flagged" as const,
          reviewerNotes: review.notes || undefined,
          // For flagged items, mark as non-compliant
          compliant: false,
        };
      }
    });
    onDocumentsUpdate(updatedDocs);
    setShowManualPanel(false);
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
          <div className="completeness-metrics">
            <div className="completeness-metric">
              <div
                className="kpi-value"
                style={{
                  color: autoPassCount < autoApplicable ? "var(--danger)" : "var(--success)",
                  fontSize: "1.2rem",
                }}
              >
                {autoPassCount} / {autoApplicable}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                AI Verified
              </div>
            </div>
            <div className="completeness-metric-divider" />
            <div className="completeness-metric">
              <div
                className="kpi-value"
                style={{
                  color:
                    manualPendingCount > 0
                      ? "var(--manual-review)"
                      : "var(--success)",
                  fontSize: "1.2rem",
                }}
              >
                {manualCompletedCount} / {manualPendingCount + manualCompletedCount}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                Manual Review
              </div>
            </div>
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

      {manualPendingCount > 0 && (
        <div className="manual-review-banner" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="manual-review-icon">&#9998;</span>
            <div>
              <strong>{manualPendingCount} item{manualPendingCount !== 1 ? "s" : ""} require manual review</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: "0.5rem" }}>
                — These items require physical verification by a reviewer and could not be assessed by document scanning.
              </span>
            </div>
          </div>
          <button
            className="btn btn-manual-review"
            onClick={() => setShowManualPanel(!showManualPanel)}
          >
            {showManualPanel ? "Hide Review Panel" : "Open Review Panel"}
          </button>
        </div>
      )}

      {manualPendingCount === 0 && manualCompletedCount > 0 && (
        <div
          className="info-box"
          style={{
            marginBottom: "1rem",
            borderColor: "var(--success)",
            backgroundColor: "rgba(22, 163, 74, 0.05)",
          }}
        >
          <strong>Manual review complete.</strong> All {manualCompletedCount} physical
          verification items have been reviewed.
        </div>
      )}

      {showManualPanel && (
        <ManualReviewPanel
          documents={app.documents}
          onSubmitReview={handleManualReviewSubmit}
        />
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: "50px" }}>#</th>
            <th>Requirement</th>
            <th style={{ width: "80px" }}>Method</th>
            <th style={{ width: "120px" }}>Status</th>
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
            const isManual = item.reviewType === "manual";
            return (
              <tr
                key={item.id}
                className={
                  status === "fail"
                    ? "row-fail"
                    : status === "manual-review"
                    ? "row-manual-review"
                    : ""
                }
              >
                <td>{item.id}</td>
                <td>
                  <strong>{item.requirement}</strong>
                  <br />
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    {item.sapSection} | {item.cfrReference}
                  </span>
                </td>
                <td>
                  <span
                    className={`method-tag ${isManual ? "method-tag-manual" : "method-tag-auto"}`}
                  >
                    {isManual ? "Manual" : "AI Scan"}
                  </span>
                </td>
                <td>
                  <StatusBadge status={status} />
                </td>
                <td>
                  {(status === "fail" || (status === "manual-review" && item.severity === "critical")) && (
                    <SeverityBadge severity={item.severity} />
                  )}
                </td>
                <td style={{ fontSize: "0.9rem" }}>
                  {status === "manual-review" ? (
                    <span style={{ color: "var(--manual-review)", fontStyle: "italic" }}>
                      Awaiting physical verification by reviewer
                    </span>
                  ) : (
                    <>
                      {doc.notes}
                      {doc.reviewerNotes && (
                        <span style={{ display: "block", fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.25rem" }}>
                          Reviewer: {doc.reviewerNotes}
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {manualPendingCount > 0 && (
          <span style={{ fontSize: "0.85rem", color: "var(--manual-review)" }}>
            Complete manual review before proceeding for full results
          </span>
        )}
        <div style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={onNext}>
            View AI Remediation Guidance
          </button>
        </div>
      </div>
    </div>
  );
}

function GuidanceScreen({
  guidance,
  app,
  onNext,
}: {
  guidance: GuidanceEntry[];
  app: ApplicationPackage;
  onNext: () => void;
}) {
  const checklist = FFR_SAP_CHECKLIST;

  // Filter guidance to only show items that are actually failing
  // (manual items that were verified/pass should not show guidance)
  const activeGuidance = guidance.filter((g) => {
    const doc = app.documents.find((d) => d.checklistItemId === g.checklistItemId);
    if (!doc) return false;
    const status = getDocStatus(doc);
    return status === "fail";
  });

  // Manual items still pending
  const pendingManualIds = app.documents
    .filter((d) => d.manualReviewStatus === "pending")
    .map((d) => d.checklistItemId);
  const pendingGuidance = guidance.filter((g) => pendingManualIds.includes(g.checklistItemId));

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

      {activeGuidance.map((g) => {
        const item = checklist.items.find((i) => i.id === g.checklistItemId);
        return (
          <div key={g.checklistItemId} className="guidance-card">
            <div className="guidance-header">
              <SeverityBadge severity={item?.severity || "major"} />
              <strong style={{ marginLeft: "0.5rem" }}>
                Item {g.checklistItemId}: {item?.requirement}
              </strong>
              {item?.reviewType === "manual" && (
                <span className="method-tag method-tag-manual" style={{ marginLeft: "0.5rem" }}>
                  Manual
                </span>
              )}
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

      {pendingGuidance.length > 0 && (
        <div
          className="info-box"
          style={{
            marginTop: "1rem",
            borderColor: "var(--manual-review)",
            backgroundColor: "rgba(180, 130, 20, 0.05)",
          }}
        >
          <strong>Note:</strong> {pendingGuidance.length} item{pendingGuidance.length !== 1 ? "s" : ""}{" "}
          still awaiting manual review. Guidance for these items will appear
          after the reviewer completes their assessment (if deficiencies are found).
        </div>
      )}

      {activeGuidance.length === 0 && pendingGuidance.length === 0 && (
        <div className="info-box" style={{
          borderColor: "var(--success)",
          backgroundColor: "rgba(22, 163, 74, 0.05)",
        }}>
          <strong>No deficiencies found.</strong> All reviewed items meet the requirements.
        </div>
      )}

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
  const passCount = app.documents.filter((d) => {
    if (d.manualReviewStatus === "pending") return false;
    if (d.manualReviewStatus === "flagged") return false;
    return d.present && d.compliant;
  }).length;
  const failCount = app.documents.filter((d) => {
    if (d.manualReviewStatus === "pending") return false;
    const status = getDocStatus(d);
    return status === "fail";
  }).length;
  const pendingCount = app.documents.filter(
    (d) => d.manualReviewStatus === "pending"
  ).length;
  const naCount = app.documents.filter(
    (d) => !d.present && d.compliant
  ).length;
  const totalApplicable = app.documents.length - naCount;

  const criticalCount = app.documents.filter((d) => {
    if (d.manualReviewStatus === "pending") return false;
    const status = getDocStatus(d);
    if (status !== "fail") return false;
    const item = FFR_SAP_CHECKLIST.items.find(
      (i) => i.id === d.checklistItemId
    );
    return item?.severity === "critical";
  }).length;
  const majorCount = failCount - criticalCount;

  const reviewedCount = totalApplicable - pendingCount;
  const readinessPercent =
    reviewedCount > 0 ? Math.round((passCount / reviewedCount) * 100) : 0;

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
        {pendingCount > 0 && (
          <div className="kpi-card">
            <div className="kpi-value" style={{ color: "var(--manual-review)" }}>
              {pendingCount}
            </div>
            <div className="kpi-label">Pending Review</div>
          </div>
        )}
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
          <span>
            {readinessPercent}%
            {pendingCount > 0 && (
              <span style={{ color: "var(--manual-review)", fontSize: "0.8rem", marginLeft: "0.5rem" }}>
                (partial — {pendingCount} items pending review)
              </span>
            )}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${readinessPercent}%`,
              backgroundColor:
                readinessPercent > 80
                  ? "var(--success)"
                  : readinessPercent > 50
                  ? "var(--warning)"
                  : "var(--danger)",
            }}
          />
        </div>
      </div>

      {pendingCount > 0 && (
        <div
          className="info-box"
          style={{
            marginTop: "1rem",
            borderColor: "var(--manual-review)",
            backgroundColor: "rgba(180, 130, 20, 0.05)",
          }}
        >
          <strong>Incomplete Review:</strong> {pendingCount} item{pendingCount !== 1 ? "s" : ""}{" "}
          still require manual verification. Return to the Completeness Report to
          complete the manual review before finalizing this report.
        </div>
      )}

      <div
        className="info-box"
        style={{
          marginTop: "1rem",
          borderColor: failCount > 0 ? "var(--danger)" : "var(--success)",
          backgroundColor:
            failCount > 0
              ? "rgba(220, 38, 38, 0.05)"
              : "rgba(22, 163, 74, 0.05)",
        }}
      >
        <strong>Recommendation:</strong>{" "}
        {failCount > 0 ? (
          <>
            This application package has {criticalCount} critical and{" "}
            {majorCount} major deficiencies that must be resolved before it can
            proceed to formal review. The applicant should address all items
            identified in the remediation guidance and resubmit.
          </>
        ) : pendingCount > 0 ? (
          <>
            AI-scanned items show no deficiencies, but {pendingCount} item{pendingCount !== 1 ? "s" : ""}{" "}
            still await manual review. Complete the physical verification before
            making a final determination.
          </>
        ) : (
          <>
            All requirements have been met. This application package is ready to
            proceed to formal review.
          </>
        )}
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
  const [documents, setDocuments] = useState(SAMPLE_APPLICATION.documents);

  const currentApp: ApplicationPackage = {
    ...SAMPLE_APPLICATION,
    documents,
  };

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
        <UploadScreen
          onUpload={() => {
            setDocuments(SAMPLE_APPLICATION.documents);
            setScreen("report");
          }}
        />
      )}
      {screen === "report" && (
        <CompletenessReport
          app={currentApp}
          onNext={() => setScreen("guidance")}
          onDocumentsUpdate={setDocuments}
        />
      )}
      {screen === "guidance" && (
        <GuidanceScreen
          guidance={AI_GUIDANCE}
          app={currentApp}
          onNext={() => setScreen("summary")}
        />
      )}
      {screen === "summary" && (
        <SummaryScreen
          app={currentApp}
          onRestart={() => {
            setDocuments(SAMPLE_APPLICATION.documents);
            setScreen("upload");
          }}
        />
      )}
    </div>
  );
}
