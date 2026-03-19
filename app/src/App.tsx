import { useState } from "react";
import IntakePreScreening from "./components/module1/IntakePreScreening";
import LifecycleTracker from "./components/module2/LifecycleTracker";
import SurveillanceDashboard from "./components/module5/SurveillanceDashboard";
import "./App.css";

type Module = "module1" | "module2" | "module5";

function App() {
  const [activeModule, setActiveModule] = useState<Module>("module1");

  return (
    <div className="app">
      {/* Top navigation bar */}
      <header className="app-header">
        <div className="app-brand">
          <div className="app-logo">NIOSH</div>
          <div className="app-title">
            <span className="title-main">Respirator Approval Program</span>
            <span className="title-sub">
              AI-Assisted Application Management Platform
            </span>
          </div>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${activeModule === "module1" ? "nav-active" : ""}`}
            onClick={() => setActiveModule("module1")}
          >
            <span className="nav-number">1</span>
            Intelligent Intake
          </button>
          <button
            className={`nav-btn ${activeModule === "module2" ? "nav-active" : ""}`}
            onClick={() => setActiveModule("module2")}
          >
            <span className="nav-number">2</span>
            Lifecycle Tracker
          </button>
          <button
            className={`nav-btn ${activeModule === "module5" ? "nav-active" : ""}`}
            onClick={() => setActiveModule("module5")}
          >
            <span className="nav-number">5</span>
            Post-Market Surveillance
          </button>
        </nav>
        <div className="app-user">Demo Mode</div>
      </header>

      {/* AI Disclaimer */}
      <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", padding: "1rem 1.5rem 0" }}>
        <div className="ai-disclaimer">
          <span className="ai-disclaimer-icon">AI</span>
          <span>All AI outputs are recommendations for human review. Final decisions require authorized program staff approval.</span>
        </div>
      </div>

      {/* Main content */}
      <main className="app-main">
        <div className="view-fade-in" key={activeModule}>
          {activeModule === "module1" && <IntakePreScreening />}
          {activeModule === "module2" && <LifecycleTracker />}
          {activeModule === "module5" && <SurveillanceDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>NIOSH RAP AI-Assisted Platform — Demonstration Prototype</span>
        <span>
          All AI outputs are recommendations for human review. Final decisions
          require authorized program staff.
        </span>
      </footer>
    </div>
  );
}

export default App;
