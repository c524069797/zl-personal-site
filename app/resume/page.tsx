import ResumeView from "./ResumeView";
import { getResumeLanguage } from "./language";

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const { lang } = await searchParams;
  return <ResumeView language={getResumeLanguage(lang)} />;
}
