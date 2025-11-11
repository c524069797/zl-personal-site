import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "yyyy年MM月dd日", { locale: zhCN });
}

export function formatDateISO(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
}

