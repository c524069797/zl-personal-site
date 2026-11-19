import type { Bullet, ExperienceEntry, OtherWork, ProjectEntry } from "./types";

export const JIALI_EXPERIENCE: ExperienceEntry = {
  company: "广东嘉利车灯有限公司",
  date: "2026.09 - 至今",
  role: "全栈 AI 工程师",
  desc: "参与车辆功能安全与 BOM 报价系统研发，负责文档处理、报价导出与 AI 分析，减少人工整理和核对工作，为硬件与结构设计提供参考。",
  bullets: [],
};

export const JIALI_PROJECT: ProjectEntry = {
  title: "车辆功能安全与 BOM 报价系统",
  stack: "Python / Flask / FAISS / Ollama / Socket.IO",
  desc: "支持车辆功能安全文档清洗、摘要与导出，以及 BOM 报价和报告导出。",
  bullets: [
    {
      label: "功能安全文档处理",
      text: "清洗车辆功能安全文档，提炼关键内容并导出摘要，减少人工整理工作。",
    },
    {
      label: "BOM 报价与导出",
      text: "使用 Python 规则与价格库计算 LED 电流、选择驱动并核算 BOM 成本，支持导出 BOM 报价内容和报告。",
    },
    {
      label: "AI 分析与框图",
      text: "通过 FAISS 检索客户 SOR 条款，生成可回填的报价条件供工程师核对；由内网模型依据已确定的硬件方案生成系统原理框图，为硬件与结构设计提供参考。",
    },
  ],
};

export const DEDUP_WORKFLOW: Bullet = {
  label: "重删业务链路",
  text: "了解重删通过数据分块、指纹比较和重复数据复用来节省空间的基本过程；参与相关业务流程梳理与接口联调，结合日志协助排查备份写入和恢复读取中的问题。",
};

export const FILE_RESTORE_WORKFLOW: Bullet = {
  label: "文件恢复与后台流程",
  text: "负责文件恢复业务流程与后台接口联调，覆盖恢复点选择、文件筛选、目标路径和覆盖选项配置、恢复任务创建及进度跟踪；协助核对参数、处理失败信息，并配合检查恢复文件与结果。",
};

/** 企业 Agent 独立 Python 版本中的后续实践，与任职经历分开标注。 */
export const WEB_SDK_EXTENSION: Bullet = {
  label: "Web SDK 埋点扩展（2026.10）",
  text: "在企业 Agent 独立 Python 版本中补充 Web SDK，使用异步加载与初始化前队列接入问答埋点；通过单例初始化、事件/业务动作 ID 和服务端唯一约束处理重复上报，结合批量发送、指数退避、ACK 确认与页面离开时的 keepalive 发送处理网络异常。",
};

/** 三个版本共用的个人作品列表 */
export const OTHER_WORKS: OtherWork[] = [
  {
    title: "SportOracle 体育预测平台",
    href: "https://sport-oracle-indol.vercel.app",
    desc: "AI 体育预测与订单簿套利分析：设计盘口价差、YES/NO 互补合约及深度分析，评估滑点、手续费与双腿成交风险；未合规，暂未上线。",
    linkLabel: "项目入口",
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
