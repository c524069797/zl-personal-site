# 陈子龙 - 个人简历

## 基本信息

- **求职方向**：前端开发工程师（具备 AI 全栈开发经验）
- **手机**：15874442813
- **邮箱**：chenzhuo995@gmail.com
- **所在地**：广州
- **GitHub**：https://github.com/c524069797
- **作品集**：https://www.clczl.asia
- **工作年限**：近 5 年前端开发经验

## 教育经历 / 语言能力

**吉首大学**｜软件工程（本科）｜2017.09 – 2021.06

- **英语**：CET-6，英文技术文档与社区内容阅读通畅
- **日语**：具备听读能力，可阅读常见资料并理解基础交流内容
- **证书**：软件设计师（中级）

## 专业技能

- **前端开发技术**：Vue 2 / Vue 3 / React / Next.js / TypeScript，能够独立完成企业级中后台页面、复杂表单、向导流程、组件抽象、可视化大屏与双端适配开发；熟悉 Ant Design、ECharts、DataV。
- **工程化与质量**：Vite / Webpack / Monorepo / ESLint / Vitest / GitLab CI/CD，具备性能优化、模块拆分、代码规范建设、虚拟列表、WebSocket 实时链路与线上问题排查经验。
- **AI 应用与全栈协作**：具备 Next.js API / Node.js、Python / Flask / FastAPI 实践，能够结合 **LangGraph**、Mastra、OpenClaw、Agent 工作流完成问答、诊断、结构化输出与工具联动，具备 AI 全栈开发能力；熟悉 **RAG 工程化**（Chunking / Embedding / Metadata 过滤 / Hybrid Search / Reranking / Citation 溯源）与 **Agent Harness Engineering**（Runtime / Tool / Eval / Observability / Guardrail 等工程脚手架设计）；了解 Java / Spring 与常见后台中间件用法，对 PostgreSQL / MySQL / Redis / sqlite-vec 等数据库与向量存储有学习和实践经验。
- **自动化测试**：参与公司自动化测试体系建设，熟练使用 Selenium、Robot Framework 完成前端页面自动化与回归测试，编写可维护的测试用例与测试套件，提升核心模块交付稳定性与回归效率。

## 工作经历

### 广州鼎甲计算机科技有限公司｜前端开发工程师｜2021.07 – 至今

负责产品：企业级备份软件、许可证与内部综合管理系统、数据可视化监控大屏等核心业务模块，长期服务复杂流程型场景，支撑 50+ 资源类型接入与多条产品线业务协同。

- **架构设计**：为解决多资源类型备份 / 恢复流程重复开发问题，设计通用向导框架，基于 **工厂模式 + Context + Proxy** 支撑 **50+ 资源类型**动态注入与跨步骤状态共享，减少同类功能重复实现。
- **业务建模**：主导许可证生成、导入校验、续期升级、套餐 / 功能映射等前端设计与实现，推动审批、出货与归档流程由表格 / 钉钉记录转向系统化闭环，支撑多条产品线与 **50+ 种许可套餐**动态组合，将重复配置时间降低 **80% 以上**。
- **可视化与实时链路**：基于 **grid-layout-plus** 实现拖拽式大屏布局系统，支持 **12 × 12** 网格、碰撞检测、自动放置与布局持久化；结合 **WebSocket** 推送、缓冲队列与重连机制，保障任务状态秒级同步与长时间稳定运行。
- **性能与问题排查**：围绕任务监控与日志展示引入 **增量更新**、**虚拟滚动** 与页面拆分，优化首屏与长列表体验，**TTI 下降约 30%**；同时长期承担线上问题定位、状态链路追踪与复杂交互故障排查工作。
- **AI 业务落地**：主导 **scutech-licenser 客服 Agent** 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入客服团队日常使用；持续推进 **Agent Harness Engineering**（Runtime 持久化、Tool 结构化、RAG 检索质量、Eval 测试集、Observability Trace 等 9 类工程脚手架）与知识库扩展（历史工单 / Wiki / SOP 系统化批量入库至向量库）；同时补充 **AI 投资助手**等个人项目，具备从前端到 AI 后端编排与工程化的完整落地经验。

## 项目经历

### AI 投资助手（Next.js 16、React 19、TypeScript、Mastra、PostgreSQL、OpenClaw）

在线访问：https://aiold.clczl.asia/

- **前端产品化**：围绕"我的自选股"重构产品首页，拆分桌面端 dashboard 与移动端卡片化布局，抽象 App Shell、BottomNav 与断点适配方案，统一双端体验并降低后续迭代成本。
- **多 Agent 架构**：基于 **Next.js + Mastra** 搭建投资分析多 Agent 系统，拆分为行情查询 Agent、技术指标 Agent、新闻摘要 Agent 与投资组合诊断 Agent，通过 Agent 编排实现复杂问题的分步推理与结构化输出。
- **工具链与数据闭环**：对接实时行情、K 线形态、支撑压力位与近 7 日财经新闻等多源数据；接入 **OpenClaw** 工作流自动抓取公众号 / 大 V 观点并生成摘要，为个股分析补充消息面参考，形成"数据采集 → AI 分析 → 前端呈现"的完整闭环。
- **工程与体验优化**：使用 Server-Sent Events 实现流式回答、支持推理过程可视化与答案高亮，提升交互体验；通过 PostgreSQL 持久化用户对话与自选股数据，支撑长期记忆与个性化推荐。

### scutech-licenser 智能客服 Agent（Vue 3、Python、Flask、FastAPI、LangGraph、LLM API、RAG、sqlite-vec、PostgreSQL）

企业内部产品｜已接入客服团队日常使用

- **业务背景**：licenses 许可证系统业务逻辑复杂，客服团队每日需处理大量重复咨询（审批进度查询、报错诊断、套餐功能解释），人工响应慢、知识传递成本高。
- **RAG 知识库构建**：将产品文档、审批流程说明、历史工单处理方案及常见报错排查指南构建为结构化知识库，结合 RAG 技术实现精准检索与上下文增强，确保回答的准确性与可溯源性。
- **业务数据联动**：打通 approval、request、audit_logs 等核心业务数据，使 Agent 能够基于用户实际订单状态进行 **实时审批解释、报错智能诊断与进度追踪**，从"通用问答"升级为"业务感知型助手"。
- **前端对话界面**：设计并开发对话式交互页面，支持多轮对话、上下文记忆、引用来源高亮与 **一键转人工** 功能，降低客服使用门槛，确保复杂问题可平滑交接。
- **落地效果**：Agent **已正式接入客服团队日常工作流**，覆盖 80% 以上常见咨询场景，平均响应时间从分钟级缩短至秒级，减少重复工单约 **30%**，显著降低人工客服压力并提升客户满意度。
- **RAG 工程化升级**：设计多粒度 Chunk 策略（Issue 摘要 / Issue 讨论 / Wiki 整页 / Wiki 按标题拆分），富化 metadata（项目 / tracker / 状态 / 责任人 / 更新时间），支持元数据过滤、来源溯源与父子检索；将历史工单与内部 Wiki 系统化批量入库至 **sqlite-vec（float[1536]）**，知识库规模从 **8 条 seed** 扩展至 **30+ 结构化 chunks**。
- **Agent Harness Engineering**：围绕 Runtime / Tool / RAG / Prompt / Guardrail / Observability / Eval / Cost / Deployment 共 **9 类工程脚手架**盘点现状与升级路径，推进 **LangGraph Checkpointer**、**StructuredTool + ToolNode**、距离阈值 / Hybrid Search / Reranker、RAGAS 评估测试集与 LangSmith Trace 的落地，把"能跑"升级为"可观测、可评估、可回滚"。

### 个人网站 / 博客系统（Next.js 16、React 19、TypeScript、Ant Design、PostgreSQL、Prisma）

在线访问：https://www.clczl.asia

- **完整产品搭建**：独立实现博客、简历、评论、文章管理等能力，支持 Markdown 内容渲染、暗黑模式、RSS、PDF 导出与响应式页面，作为个人作品集长期对外展示。
- **内容型前端能力**：围绕内容展示与阅读体验完成信息架构、页面设计与组件抽象，并结合 SSR / SEO 优化提升站点可访问性与展示效果。
- **AI 增强**：接入 AI 文章摘要、关键词提取与站内问答能力，将内容产品与 AI 功能结合，形成更完整的个人技术展示载体。

## 其他个人作品

更多项目可见作品集：https://www.clczl.asia

1. **SportOracle 体育预测平台**：AI 驱动的体育预测产品，支持比赛分析与预测信息展示。在线地址：https://nba.clczl.asia/
2. **织趣社区**：面向钩织爱好者的社区产品，包含产品库、教程资源与讨论区。在线地址：https://zhiqu.clczl.asia/
3. **Sports Hub 浏览器插件**：聚合 NBA、足球、电竞赛事信息的 Chrome Extension。GitHub：https://github.com/c524069797/sports-hub-extension

## 个人优势

- **前端主导能力明确**：长期负责企业级中后台、复杂流程与可视化页面建设，覆盖备份、许可证、监控大屏等高复杂度业务场景。
- **具备 AI 全栈开发能力**：能够基于 Next.js / Python / PostgreSQL 结合 Agent 与工作流完成产品原型、功能联调与上线落地。
- **有真实线上作品**：已上线个人作品集、AI 投资助手、体育预测平台、垂直社区等多个可访问项目，具备独立开发与部署意识。
- **学习与专业基础扎实**：持有软件设计师（中级）认证，英语六级，具备日语听读能力，可直接阅读英文技术文档与部分日文资料。
