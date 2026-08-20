import { backendResume } from "./backend";
import { frontendResume } from "./frontend";
import { fullstackResume } from "./fullstack";
import type { ResumeData, ResumeVersion } from "./types";

export const resumeDataMap: Record<ResumeVersion, ResumeData> = {
  fullstack: fullstackResume,
  frontend: frontendResume,
  backend: backendResume,
};

/** 版本 Tab 的展示顺序 */
export const RESUME_VERSIONS: ResumeVersion[] = ["fullstack", "frontend", "backend"];

export type { ResumeData, ResumeVersion } from "./types";
export type { Bullet, ExperienceEntry, OtherWork, ProjectEntry, SkillGroup, SkillIconKey } from "./types";
