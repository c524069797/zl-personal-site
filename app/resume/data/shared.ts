import type { Bullet, OtherWork } from "./types";

/** 备份监控业务场景的后续扩展，按实际完成时间标注。 */
export const TOPOLOGY_EXTENSION: Bullet = {
  label: "Three.js 拓扑扩展（2026.10）",
  text: "围绕备份监控场景实现 Three.js / WebGL 资源拓扑模块，支持节点拾取、关联链路高亮、容量查看及离线/恢复交互；通过 InstancedMesh 复用存储节点几何体，并提供 WebGL 不可用时的列表降级。",
};

/** 企业 Agent 独立 Python 版本中的后续实践，与任职经历分开标注。 */
export const WEB_SDK_EXTENSION: Bullet = {
  label: "Web SDK 埋点扩展（2026.10）",
  text: "在企业 Agent 独立 Python 版本中补充 Web SDK，使用异步加载与初始化前队列接入问答埋点；通过单例初始化、事件/业务动作 ID 和服务端唯一约束处理重复上报，结合批量发送、指数退避、ACK 确认与页面离开时的 keepalive 发送处理网络异常。",
};

/** 三个版本共用的个人作品列表 */
export const OTHER_WORKS: OtherWork[] = [
  {
    title: "备份资源拓扑模块",
    href: "https://www.clczl.asia/projects/backup-topology",
    desc: "备份监控场景扩展，Three.js / WebGL 节点交互与状态联动。",
    linkLabel: "体验模块",
  },
  {
    title: "SportOracle 体育预测平台",
    href: "https://sport-oracle-indol.vercel.app",
    desc: "AI 驱动的体育预测产品，未合规，暂未上线。",
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
