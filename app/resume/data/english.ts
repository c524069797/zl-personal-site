import type { ResumeData } from "./types";

export const englishResume: ResumeData = {
  tabLabel: "AI Full Stack",
  role: "Full-Stack AI Engineer",
  meta: "Enterprise software, AI applications, and workflow tools",
  summary: "I build web applications and backend services for engineering and operations teams. My recent work covers automotive safety documents, BOM quotes, and AI-assisted review. Before that, I worked on enterprise backup and recovery.",
  advantage: "I work across requirements, implementation, integration, and testing. I use rules for calculations and language models for tasks such as finding requirements and drafting diagrams.",
  skillGroups: [
    {
      title: "AI",
      iconKey: "agent",
      skills: ["Python", "LangGraph", "RAG", "FAISS", "Ollama", "Tool Calling", "MCP"],
    },
    {
      title: "Backend",
      iconKey: "backend",
      skills: ["Flask", "FastAPI", "Java", "Spring Boot", "MySQL", "PostgreSQL", "Redis", "Docker"],
    },
    {
      title: "Web",
      iconKey: "frontend",
      skills: ["Vue 3", "React", "Next.js", "TypeScript", "WebSocket", "Socket.IO", "Three.js"],
    },
  ],
  experience: [
    {
      company: "Guangdong Jiali Automotive Lighting Co., Ltd.",
      date: "Sep 2026 - Present",
      role: "Full-Stack AI Engineer",
      desc: "Work on software that helps engineers process safety documents, prepare quotes, and review design inputs.",
      bullets: [],
    },
    {
      company: "Guangzhou Scutech Computer Technology Co., Ltd.",
      date: "Jul 2021 - Jun 2026",
      role: "Web Software Engineer",
      desc: "Developed workflows for enterprise backup, licensing, and internal tools.",
      bullets: [
        { label: "Product development", text: "Worked with backend and backup engine teams to configure jobs, track their status, and investigate failures." },
        { label: "Internal AI support", text: "Helped build a support assistant that retrieves answers from product documents, past tickets, and internal guides." },
      ],
    },
  ],
  projects: [
    {
      title: "Vehicle Functional Safety and BOM Quoting",
      stack: "Python / Flask / FAISS / Ollama / Socket.IO",
      desc: "Tools for processing safety documents and preparing bills of materials (BOMs) and quotes.",
      bullets: [
        { label: "Safety documents", text: "Cleaned up safety documents and exported summaries so engineers could review the key points without sorting through the full files." },
        { label: "Quotes and exports", text: "Used Python rules and a price database to calculate LED current, select drivers, and estimate BOM costs. Added exports for quotes and reports." },
        { label: "AI analysis", text: "Used FAISS to find relevant clauses in customer requirements (SORs) and suggest quote inputs for engineers to review. An internal model turns the selected hardware design into a block diagram for the hardware and mechanical design teams." },
      ],
    },
    {
      title: "DBackup Enterprise Backup and Recovery",
      stack: "Vue 3 / TypeScript / WebSocket",
      desc: "A Linux-based platform for backing up and restoring files, databases, and virtual machines.",
      bullets: [
        { label: "Backup and restore workflows", text: "Built a shared setup wizard for different resource types. Added file selection, restore points, destination paths, and job progress tracking." },
        { label: "Monitoring", text: "Displayed job status and errors from the backup engine. Loaded long logs in smaller batches and used logs and API responses to help investigate failures." },
      ],
    },
    {
      title: "BackupPilot",
      stack: "React / TypeScript / Python / LangGraph / MCP",
      desc: "A project that lets operators start and check backup jobs using plain language.",
      bullets: [
        { label: "Task flow", text: "Used LangGraph to plan actions, call backup tools, and check results. Restore requests pause for approval before they run." },
        { label: "Integration", text: "Connected the workflow to a local engine and an enterprise backup API. The web interface shows progress, results, and errors." },
      ],
    },
    {
      title: "LLM Gateway",
      href: "https://github.com/c524069797/llm-gateway-java",
      stack: "Java 21 / Spring Boot / Resilience4j / Redis",
      desc: "An OpenAI-compatible API for sending requests to different model providers.",
      bullets: [
        { label: "Request handling", text: "Routes requests, falls back to another provider on failure, and caches suitable responses. Includes API key checks, rate limits, and a record of usage." },
      ],
    },
  ],
  otherWorks: [
    {
      title: "Backup Resource Map",
      href: "https://www.clczl.asia/projects/backup-topology",
      desc: "An interactive view of backup resources and their current status, built with Three.js.",
      linkLabel: "Open project",
    },
    {
      title: "SportOracle",
      href: "https://sport-oracle-indol.vercel.app",
      desc: "A sports prediction and order book analysis project. Public launch is pending compliance review.",
      linkLabel: "Project page",
    },
    {
      title: "Sports Hub",
      href: "https://github.com/c524069797/sports-hub-extension",
      desc: "A Chrome extension for NBA, football, and esports schedules.",
      linkLabel: "GitHub",
    },
  ],
};
