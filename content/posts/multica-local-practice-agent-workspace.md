---
title: "Multica 本地实践：把 Codex、Claude Code 和任务执行记录放进一个工作区"
date: "2026-08-23"
summary: "实测 Multica 在 macOS 上的本地部署、运行时接入、项目任务分派和代码验证，并分析它对 AI Agent 学习、求职准备与日常效率的实际帮助。"
tags: ["Multica", "AI Agent", "Codex", "Claude Code", "Agent 编排", "本地部署"]
category: "tech"
draft: false
---

# Multica 本地实践：把 Codex、Claude Code 和任务执行记录放进一个工作区

我最近研究了 [Multica](https://github.com/multica-ai/multica)。它把项目、Issue、Agent、运行时和执行记录组织在同一个工作区里，再通过本地 daemon 连接 Codex、Claude Code、Cursor、Grok、OpenCode、Pi 等工具。

这类工具对学习 AI Agent 很有价值：可以把一个目标拆成小任务，交给指定的编码 Agent，在固定目录中执行，再回看任务状态和修改结果。它也适合用来建立自己的 Agent 工程实践记录。不过，本地部署成功、任务被分派成功和 Agent 稳定完成任务，是三个不同层次的结果，需要分别验证。

## 先给结论

Multica 值得在本地跑一段时间，推荐把它作为个人 Agent 工作台和学习实验环境使用。它能帮助我建立一套更接近真实研发的闭环：项目管理、任务拆分、Agent 执行、代码变更、测试验证和结果复盘。

它对当前几个目标的帮助如下：

| 目标 | 能提供的帮助 | 当前判断 |
| --- | --- | --- |
| AI Agent 学习 | 观察 daemon、运行时适配、任务状态和工作区隔离 | 价值较高 |
| 求职准备 | 把项目学习拆成可交付的小 Issue，保留执行证据和测试结果 | 价值较高 |
| 日常效率 | 将重复的代码检查、文档整理和小改动交给本地 Agent | 有条件可用 |
| 复杂生产项目 | 多 Agent 并行、权限和审计仍需继续验证 | 暂不直接依赖 |

我的建议是先把它接到隔离的学习仓库，连续使用一周，记录任务完成率、人工返工时间和测试通过率，再决定是否接入更重要的个人项目。

## Multica 解决什么问题

直接在终端里使用 Codex 或 Claude Code，任务通常绑定在某个会话和目录中。任务一多，容易出现几个问题：目标散落在聊天记录里，无法快速查看进度；多个 Agent 使用同一目录时容易互相覆盖；任务完成后缺少统一的结果和测试记录。

Multica 增加了一层工作区和任务调度：

- Workspace 保存项目、资源和 Agent 配置；
- Project 把一组相关工作集中管理；
- Issue 描述一个可验收的小任务；
- Agent 指定使用的本地运行时和执行约束；
- Task Run 记录一次实际执行的状态、工作目录和结果；
- Daemon 在本机连接并维护各类 Agent CLI。

一次任务可以理解为：

```text
浏览器 / CLI
    ↓
Multica Backend + PostgreSQL
    ↓
Multica Daemon
    ↓
Codex / Claude Code / 其他本地运行时
    ↓
指定项目目录、测试命令和执行记录
```

它的价值集中在“把 Agent 使用过程变成可追踪的工程流程”。这对学习尤其重要，因为你可以检查 Agent 改了哪些文件、测试是否通过、任务是否真的完成，而不是只看一段看起来合理的回答。

## 本机部署过程

本次环境是 macOS arm64。Multica 官方自托管方案使用 Web、Backend、PostgreSQL 和 pgvector。Docker Desktop 可以正常运行，但 Docker Hub 的 PostgreSQL 镜像在本机网络环境下拉取超时，因此我保留 Web 和 Backend 容器，使用本机 Homebrew PostgreSQL 15 提供数据库。

部署后的实际链路是：

```text
http://localhost:3000
    ↓
Multica Web 容器
    ↓
Multica Backend 容器 :8080
    ↓ host.docker.internal
本机 PostgreSQL 15 :5432
    ↓
本机 Multica Daemon
    ↓
Codex / Claude Code / Cursor / Grok / OpenCode / Pi
```

官方仓库提供了完整的自托管说明，入口是 [SELF_HOSTING.md](https://github.com/multica-ai/multica/blob/main/SELF_HOSTING.md)。本地启动后，我验证了以下接口：

```bash
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/healthz
curl http://127.0.0.1:8080/readyz
curl http://127.0.0.1:8080/api/config
```

四个检查都返回成功，Backend 完成了数据库迁移，服务版本为 `v0.4.32`，浏览器访问 `http://localhost:3000` 返回正常页面。

如果你复现时遇到 Docker Hub 超时，可以先确认 Docker Desktop 的网络配置，再选择本机 PostgreSQL 或可访问的镜像仓库。数据库连接字符串的核心形式如下，实际用户名和密码应放在本地环境变量中：

```text
postgres://<user>@host.docker.internal:5432/multica?sslmode=disable
```

## 第一个可用实践：任务分派与测试验证

我创建了一个隔离练习仓库 `multica-learning-lab`，内容很小，只有一个任务统计函数和 Node.js 内置测试。这样做的目的，是让第一次实验的验收标准足够清楚，也避免 Agent 接触个人网站、简历或 Obsidian 数据。

练习任务是：为任务摘要增加 `blocked` 状态统计，同时保留未知状态的原有行为。

原来的摘要结构包含 `total`、`todo`、`inProgress` 和 `done`。完成后的结构增加了 `blocked`，测试覆盖了两种情况：

```js
{
  total: 5,
  todo: 1,
  inProgress: 1,
  done: 2,
  blocked: 1
}
```

未知的 `cancelled` 状态仍然计入总数，但不会被错误归入已知分类。最终在练习目录执行：

```bash
npm test
```

结果是 2 个测试全部通过。这个小任务已经提交到隔离仓库，提交信息为 `feat: count blocked tasks in summary`。

## 这次运行真实遇到的问题

Multica 的项目、Issue、Agent、资源绑定和 daemon 发现流程都可以使用。我在本机看到了 6 个可用运行时，并成功把本地目录注册为项目资源。

任务执行阶段出现了更重要的结果：第一次使用 Codex 运行时，任务在读取 Issue 和准备工作流后长时间停留在 `running`，没有产生代码改动；切换到 Claude Code 后再次执行，同样长时间没有返回可交付结果。两次运行都被取消，最后由我根据同一验收标准完成代码修改并运行测试。

这说明当前本地环境已经验证了调度和连接链路，尚未验证出 Codex 或 Claude Code 在 Multica 中可以稳定完成任务。原因可能涉及本地 CLI 版本、daemon 任务工作目录、运行时启动协议或当前版本的集成适配，需要单独查日志和缩小实验范围。对日常效率的判断应该以真实完成率为依据，不能只因为界面能打开就默认它能持续节省时间。

## 对学习、求职和生活效率的实际帮助

### AI Agent 学习

Multica 可以提供一个可观察的实验场。你可以围绕一个小项目连续练习：创建 Issue、分配 Agent、查看执行状态、检查 diff、运行测试、记录失败原因。这个过程会逼着自己理解任务边界、工具权限、工作目录、超时和验收条件。

适合练习的任务包括：

- 为一个后端接口补充幂等校验和单元测试；
- 给订单状态机增加一个合法状态迁移；
- 为 RAG 检索结果增加来源字段和空结果测试；
- 给 Agent 工具调用增加超时、重试和审计日志；
- 对一个现有模块做代码阅读，再输出数据流和故障排查路径。

每个 Issue 都应该写清楚修改范围、完成条件和验证命令。任务越小，越容易判断 Agent 的真实能力，也越容易发现自己尚未理解的代码。

### 求职准备

对 AI Agent 岗位，面试官往往会追问任务如何拆分、工具如何授权、失败如何恢复、结果如何评估。使用 Multica 做练习，可以沉淀具体的工程证据：一次任务的输入、执行状态、修改文件、测试输出和失败复盘。

这些记录可以转化为面试中的真实回答。例如，本次实验可以清楚地讲：平台已经完成了项目资源注册和运行时发现，任务运行阶段出现超时，随后通过取消任务、人工完成和测试验证保证仓库状态可控。这个过程比声称“多 Agent 自动完成了开发”更可靠，也更接近真实工程。

### 日常生活与工作效率

当运行时稳定以后，它适合处理边界清楚、可回滚的小任务：整理项目文档、检查测试覆盖、生成变更摘要、扫描待处理 Issue、更新学习记录。任务应该放在独立目录，并设置单次并发上限和明确的测试命令。

当前阶段不建议把个人网站、简历仓库、Obsidian 根目录和含有密钥的工作目录直接交给 daemon。官方安全说明指出，daemon 默认继承运行用户的操作系统权限，不能把 Workspace 当作完整的安全沙箱。更稳妥的做法是使用专门的系统用户、隔离容器或虚拟机，并把敏感凭据从 Agent 进程环境中移除。

## 本地使用建议

本次实践后，我会按下面的顺序使用：

1. 保留 Multica、练习仓库和独立的本地 profile，先完成几个 10 到 30 分钟可以验收的小任务。
2. 让 Agent 只访问学习项目，所有任务都要求先读 README，再改代码，再运行测试。
3. 连续记录任务成功率、卡住次数、人工返工时间和测试通过率。
4. 运行稳定后，再接入一个低风险的个人项目，继续使用独立工作区。
5. 涉及网站发布、简历修改、数据库和外部服务时，保留人工审查与明确的 Git 操作。

常用服务地址：

```text
Web:     http://localhost:3000
Backend: http://localhost:8080
```

Multica 的服务、daemon 和本机数据库都可以独立停止。练习结束后及时停止 daemon，减少后台权限和资源占用；数据库数据和练习仓库可以保留，方便下一次继续验证。

## 最终判断

Multica 值得拿到本地跑，主要价值在于帮助建立 Agent 工程化习惯：任务拆分、运行时管理、工作区隔离、执行记录和测试验收。它能辅助学习和求职准备，也可能在运行时稳定后承担一部分重复性工作。

当前版本仍需要通过自己的任务成功率来评估。我的第一次本地实践完成了部署、认证、项目注册、资源绑定和代码测试，Agent 自动执行环节出现了两次卡住。基于这个结果，我会继续保留本地环境，但暂时把它定位为学习和评估工具，等运行时问题解决后再扩大使用范围。

## 参考资料

- [Multica GitHub 仓库](https://github.com/multica-ai/multica)
- [Multica 自托管说明](https://github.com/multica-ai/multica/blob/main/SELF_HOSTING.md)
- [Multica Tasks 文档](https://multica.ai/docs/tasks)
- [Multica Daemon Runtimes 文档](https://multica.ai/docs/daemon-runtimes)
- [Multica Skills 文档](https://multica.ai/docs/skills)
- [Multica Security Model](https://multica.ai/docs/security-model)
- [Multica License](https://github.com/multica-ai/multica/blob/main/LICENSE)
