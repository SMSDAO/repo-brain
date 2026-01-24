
import { GoogleGenAI } from "@google/genai";
import { Diagnosis, GenomeReport, AutopsyReport, ImmunizerReport, VitalsReport, BlackboxRecording, FirewallReport } from "../types";

const API_KEY = process.env.API_KEY;

export class RepoBrainAI {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY! });
  }

  async analyzeRepo(repo: Diagnosis) {
    const prompt = `
      You are CAST BRAIN, the autonomous repository governance bot by CyberAI Network.
      Analyze this repository status:
      Repo: ${repo.repo}, Status: ${repo.status}, Reason: ${repo.reason}
      Stack: ${repo.languages.join(', ')} / ${repo.framework}
      Alerts: ${repo.aiGuardComments?.join('; ') || 'None'}
      
      Provide a concise 1-sentence strategic repair recommendation based on MERMEDA v1.1.0.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text;
    } catch (e) { return "Unable to sync AI insight."; }
  }

  async analyzeVitals(vitals: VitalsReport) {
    const prompt = `
      Analyze these repository physical vitals as CAST BRAIN:
      Size: ${vitals.repoSize}, Files: ${vitals.fileCount}, Commits: ${vitals.commitCount}
      Build Time: ${vitals.buildDurationSec}s, Test Time: ${vitals.testDurationSec}s
      Largest Dirs: ${vitals.largestDirs}
      
      Provide a concise interpretation of the repo complexity and build efficiency.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text;
    } catch (e) { return "Vitals interpretation failed."; }
  }

  async analyzeFirewall(report: FirewallReport) {
    const prompt = `
      CAST BRAIN Firewall Review:
      Installed: ${report.installed}
      Active Rules: ${report.activeRules.map(r => r.pattern).join(', ')}
      Recently Blocked: ${report.lastInterceptedFiles.join(', ')}
      
      Recommend 2 additional security patterns we should block to improve fleet safety.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text;
    } catch (e) { return "Firewall audit failed."; }
  }

  async analyzeBlackbox(recording: BlackboxRecording) {
    const prompt = `
      Perform forensic review of this Blackbox Execution Recording (Run ID: ${recording.runId}):
      Trace Excerpt: ${recording.trace.substring(0, 1000)}...
      
      Identify logic flow bottlenecks or environment anomalies.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text;
    } catch (e) { return "Blackbox analysis failed."; }
  }

  async getFleetHealthOverview(fleet: Diagnosis[]) {
    const summary = fleet.map(r => `${r.repo} [${r.status}]: ${r.reason}`).join('\n');
    const prompt = `
      You are CAST BRAIN Strategic Controller.
      Fleet Summary:
      ${summary}
      
      Provide a 3-point strategic directive for the fleet over the next 48 hours. Focus on moving RED repos to GREEN.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      });
      return res.text;
    } catch (e) { return "Strategic signal lost."; }
  }

  async analyzeGenome(genome: GenomeReport) {
    const prompt = `Analyze Genomic Evolution v${genome.from} -> v${genome.to}: ${JSON.stringify(genome.changes)}`;
    try {
      const res = await this.ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
      return res.text;
    } catch (e) { return "Genome analysis failed."; }
  }

  async analyzeAutopsy(autopsy: AutopsyReport) {
    const prompt = `Perform forensic analysis on trace data: ${JSON.stringify(autopsy.traces)}`;
    try {
      const res = await this.ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
      return res.text;
    } catch (e) { return "Autopsy analysis failed."; }
  }

  async analyzeIntegrity(report: ImmunizerReport) {
    const prompt = `Analyze integrity state: Verified=${report.integrityOk}, Locked=${report.locked}`;
    try {
      const res = await this.ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
      return res.text;
    } catch (e) { return "Integrity analysis failed."; }
  }
}
