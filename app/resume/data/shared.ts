import type { OtherWork } from "./types";

/** 三个版本共用的个人作品列表 */
export const OTHER_WORKS: OtherWork[] = [
  {
    title: "个人网站 / 博客系统",
    href: "https://www.clczl.asia",
    desc: "Next.js 16 全栈站点，含博客、AI 问答与 React Three Fiber 3D 交互首屏。",
    linkLabel: "clczl.asia",
  },
  {
    title: "SportOracle 体育预测平台",
    href: "https://nba.clczl.asia/",
    desc: "AI 驱动的体育预测产品。",
    linkLabel: "nba.clczl.asia",
  },
  {
    title: "Sports Hub 浏览器插件",
    href: "https://github.com/c524069797/sports-hub-extension",
    desc: "聚合 NBA、足球、电竞赛事信息的 Chrome Extension。",
    linkLabel: "GitHub",
  },
];

/** 三个版本共用的任职起止时间 */
export const EMPLOYMENT_DATE = "2021.07 - 2026.06";
