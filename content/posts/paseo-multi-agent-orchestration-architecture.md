---
title: 'Paseo 架构解析：怎样把 Codex、Claude Code 和手机端组织成一个 Agent 控制面'
date: '2026-08-10'
summary: '从本地 daemon、Provider 适配、WebSocket、加密 relay、工作区与会话持久化出发，解析 Paseo 如何统一管理 Codex、Claude Code 等编码 Agent。'
tags: ['Paseo', 'AI Agent', 'Codex', 'Claude Code', 'Agent 编排']
category: 'tech'
draft: false
---

# Paseo 架构解析：怎样把 Codex、Claude Code 和手机端组织成一个 Agent 控制面

最近我在 Mac 上部署了 [Paseo](https://github.com/getpaseo/paseo)，并把正在运行的 Codex 对话导入进去。它最直观的用途是：电脑负责运行编码 Agent，手机、浏览器、桌面端和命令行都可以查看同一批会话、继续发送任务、处理权限申请。

真正值得分析的是它背后的设计。Codex、Claude Code、OpenCode 等工具各有自己的命令、事件格式和会话文件，Paseo 却能用一套界面统一管理，还能让手机从外网安全连接本机。它在中间增加了哪些层？一次手机消息又是怎样到达本机 Agent 的？

本文基于 Paseo 官方仓库、`v0.3.1` 代码和本机运行日志整理。文中的数据流是对当前实现的归纳，后续版本可能调整模块细节。

## 先看完整结构

```text
手机 App / Web / 桌面端 / CLI
             │
             │ WebSocket：命令、状态、流式事件、权限申请
             ▼
       Paseo 本地 daemon
  ┌──────────┼────────────┐
  │          │            │
Agent 管理  会话与时间线   Workspace / Git
  │          │            │
  └──── Provider 适配层 ──┘
             │
             ▼
 Codex / Claude Code / OpenCode 等本地进程

手机在外网时：

手机客户端 ⇄ 端到端加密通道 ⇄ Paseo Relay ⇄ 端到端加密通道 ⇄ 本地 daemon
```

这里的 **daemon（守护进程）**，可以先理解为一个长期在后台运行的本地服务。界面关掉以后，它仍然能够维护 Agent 进程、保存状态、接收新的客户端连接。

Paseo 的核心设计可以概括为一句话：让 daemon 稳定地拥有 Agent 的生命周期，让手机、Web 和桌面端成为随时可以连接或离开的操作界面。

## 一条手机消息是怎样执行的

假设我在手机上打开已导入的 Codex 会话，发送「解释这个项目的登录流程」。完整链路大致如下：

1. 手机先找到已配对的本机 daemon。处于同一局域网时可以直接连接；跨网络时通过官方 relay 中转。
2. 客户端通过 WebSocket 发送消息。WebSocket 是一条可以双向、持续通信的连接，适合连续传输 Agent 的思考状态、文本片段、工具调用和权限申请。
3. daemon 根据 `agentId` 找到对应的 Agent 会话，再由 Agent Manager 判断它当前是空闲、运行中、等待权限，还是已经关闭。
4. Provider 适配器把 Paseo 的统一请求转换成 Codex 能理解的调用，并把 Codex 返回的原生事件转换成统一的 Paseo 事件。
5. Codex 在指定工作目录中读取文件、调用工具并生成回答。daemon 一边接收事件，一边写入时间线存储，同时把事件推送给已订阅的客户端。
6. 手机收到流式事件后逐段渲染内容。如果 Codex 要执行需要确认的操作，手机会显示权限申请；用户的同意或拒绝再沿原路径返回。

可以把它简化成下面这段伪代码：

```ts
// 客户端只表达「要对哪个 Agent 做什么」
socket.send({
  type: 'agent.prompt',
  agentId: 'agent-123',
  prompt: '解释这个项目的登录流程',
});

// daemon 负责找到会话、调用对应 Provider，并持续发布事件
const agent = agentManager.get('agent-123');
const provider = providers.get(agent.provider); // 例如 Codex Provider

for await (const event of provider.run(agent.session, prompt)) {
  timelineStore.append(agent.id, event); // 保存，以便断线后恢复
  subscribers.publish(agent.id, event); // 推送给手机、Web 或桌面端
}
```

这段伪代码省略了重试、状态机、权限处理和并发控制，但能说明最关键的职责划分：客户端负责交互，daemon 负责执行与持久化，Provider 负责翻译不同 Agent 的协议。

## 设计一：daemon 是本地控制面

「控制面」听起来抽象，可以理解为整个系统的调度中心。它不亲自写代码，主要管理下面这些事情：

- 创建、恢复、停止和归档 Agent；
- 记录每个 Agent 使用哪个 Provider、模型和工作目录；
- 判断 Agent 当前状态，并把事件分发给订阅者；
- 接收和处理权限申请；
- 保存会话元数据与执行时间线；
- 管理 Workspace、Git 状态和终端；
- 向客户端提供 HTTP、WebSocket 和 MCP 接口。

把这些职责放在 daemon 中有一个直接收益：**会话寿命不再依赖某一个界面**。浏览器刷新、手机锁屏或桌面应用退出，只会断开一个客户端连接。Agent 仍由 daemon 管理，重新连接后可以获取最新状态和历史时间线。

本机日志也能看到这个启动顺序：supervisor 启动 daemon worker，随后初始化 Agent 存储、Workspace 注册表、聊天与调度服务，挂载 `/mcp/agents`，最后启动 HTTP、WebSocket 和 relay 连接。

Paseo 还使用了 supervisor/worker 两层进程。supervisor 是上层看护进程，worker 承载主要服务。worker 意外退出时，上层有机会识别并恢复服务；停止 daemon 时则优先走正常关闭流程，超时后才处理进程信号。这属于后台服务常见的生命周期设计。

## 设计二：Provider 适配层统一不同 Agent

Codex、Claude Code 和 OpenCode 都能完成编码任务，但它们的会话标识、启动参数、事件格式、权限模型和能力集合并不完全一致。如果客户端直接适配每一种工具，手机、Web、桌面端和 CLI 都要重复实现一遍，新增 Provider 也会牵动多个应用。

Paseo 在 daemon 内定义统一的 Agent 抽象，再让每个 Provider 完成协议转换。上层看到的共同概念包括：

- `create`：创建会话；
- `resume`：恢复已有会话；
- `run`：发送 Prompt 并执行一轮任务；
- `stream event`：文本、推理、工具调用、完成或错误等事件；
- `permission request`：等待用户授权；
- `capabilities`：是否支持流式输出、动态模式、MCP、回退文件等能力。

因此，界面只需要面对一套协议。某个 Provider 不支持特定能力时，daemon 可以根据 capability flag 隐藏相关功能或采取降级处理。

「导入当前 Codex 对话」也建立在这层抽象上。CLI 把 Provider 名称、原生 session ID 和工作目录交给 daemon，daemon 将原生会话映射成 Paseo Agent，并建立自己的 `agentId`、状态和时间线。原生会话仍由 Codex 识别，Paseo 增加了一层统一管理信息。

## 设计三：WebSocket 同时承载命令和事件

普通 HTTP 请求适合「请求一次，返回一次」。编码 Agent 的执行过程可能持续几分钟，中间会连续产生文本片段、工具调用、状态变化和权限申请。WebSocket 让服务器能够主动把这些事件持续推给客户端。

Paseo 的消息流中存在两类方向：

- 客户端到 daemon：创建 Agent、发送 Prompt、停止任务、回复权限申请；
- daemon 到客户端：Agent 状态、流式输出、工具调用结果、错误和注意力提醒。

客户端还可以按 `agentId` 订阅事件。这样打开某个会话时只接收相关更新，多个界面同时在线时也能看到同一 Agent 的进度。

流式系统还要处理一个容易忽略的问题：断线重连。只依赖内存推送会让客户端错过断线期间的内容。Paseo 给 Agent 保存快照，并维护可查询的 timeline；重连后先获取持久化状态和历史窗口，再继续接收实时事件。它把「当前状态」和「发生过的事件」分开保存，这种设计也常见于任务调度、消息系统和订单状态追踪。

## 设计四：Workspace 管理执行边界

编码 Agent 必须知道自己可以在哪个目录工作。Paseo 把工作目录进一步组织成 Workspace，并维护对应的 Git 信息。一个 Agent 的记录里会保存 `cwd` 和 `workspaceId`，daemon 由此知道任务属于哪个项目。

当多个 Agent 并行修改同一个仓库时，共用同一工作目录很容易产生覆盖和冲突。Paseo 支持结合 Git worktree 创建隔离工作区：每个任务拥有独立目录和分支，又共享底层 Git 仓库对象。这个设计将并行任务的影响范围缩小，也方便分别查看差异、测试和提交。

隔离仍然需要正确配置。Agent 进程运行在用户电脑上，能够访问授权目录、环境变量和本地工具。Workspace 帮助约束项目范围，操作系统权限、Provider 自身的沙箱与用户确认仍然是安全边界的一部分。

## 设计五：relay 只负责跨网络转发

本机 daemon 默认监听 `127.0.0.1:6767` 时，只有本机能直接访问。手机离开家庭或办公室网络后，无法主动连接这个回环地址。直接把 6767 端口暴露到公网会增加路由器配置、证书、鉴权和攻击面。

Paseo 的处理方式是让本机 daemon 主动连接官方 relay，手机也连接 relay，由 relay 帮双方转发数据。因为两边都主动向外建立连接，通常不需要配置公网 IP 和端口映射。

配对链接中包含 daemon 的稳定标识、公钥和 relay 地址。建立连接时，客户端与 daemon 使用密钥协商得到共享密钥，后续业务帧通过加密通道传输。按照当前实现，relay 负责搬运密文，消息内容在客户端和 daemon 两端加解密。

这套设计降低了远程连接门槛，也要明确它的边界：

- relay 仍能观察连接时间、流量大小等网络元数据；
- 配对链接相当于连接凭据的一部分，不应公开发送；
- daemon 最终会把任务交给本机 Agent，本机文件和凭据的安全仍取决于操作系统权限、Agent 权限策略和用户授权；
- 对安全要求更高的团队，需要继续评估自建 relay、设备撤销、审计和密钥轮换方案。

## 设计六：MCP 让 Agent 也能调度 Agent

Paseo daemon 会挂载 MCP 端点。MCP（Model Context Protocol）是一套让模型调用外部工具的协议。在这里，它可以把「创建 Agent、查询 Agent、等待 Agent 完成」等能力暴露成工具。

于是调度关系可以从「人操作多个 Agent」扩展到「主 Agent 创建子 Agent 并分配任务」。例如，一个主 Agent 负责拆分需求，分别启动后端实现、前端实现和代码审查任务，最后汇总结果。

这也解释了 Paseo 为什么要建立统一 Agent 模型。如果每个 Provider 都有完全不同的控制接口，上层 Agent 很难稳定编排；统一的创建、状态、等待和结果接口提供了可组合的基础。

多 Agent 会放大并发冲突、权限扩散和成本失控。工程上仍需给每个子任务明确目录、完成条件、权限和超时，关键变更也需要测试与人工审查。

## 这套架构解决了什么

从工程视角看，Paseo 主要解决了五个问题：

| 问题                       | 对应设计                            |
| -------------------------- | ----------------------------------- |
| Agent 绑定在某个终端窗口上 | daemon 持有生命周期，客户端可以重连 |
| 每种编码 Agent 协议不同    | Provider 适配层提供统一接口         |
| 长任务需要持续显示过程     | WebSocket 传输双向流式事件          |
| 手机难以从外网连接本机     | relay 转发端到端加密数据            |
| 多任务容易改乱同一仓库     | Workspace 与 Git worktree 隔离      |

它的价值集中在「长期运行、多个入口、多个 Provider、多个并行任务」这些场景。只在电脑前偶尔启动一次单 Agent 时，直接使用 Codex 或 Claude Code 已经足够，额外控制层会带来服务维护和安全配置成本。

## 当前成熟度与我的判断

截至 2026 年 8 月 10 日，官方最新版本是 `v0.3.1`。项目已经具备 CLI、Web、移动端、Electron 桌面端、Provider 适配、会话导入、加密 relay、Workspace 和 MCP 等完整模块，代码层面也能看到原子写入、生命周期状态、超时和恢复等工程处理。

它仍处在快速迭代阶段。版本号较早，远程控制本机编码 Agent 又天然涉及较高权限，因此更适合先在个人设备和可控仓库中使用，逐步验证断线恢复、权限提示、并发工作区和设备撤销等行为。企业接入时还要补充统一身份、权限分级、审计、密钥管理和自建网络边界。

我认为 Paseo 最值得借鉴的地方，是它选择复用现有 Agent CLI，再增加一层统一控制能力：daemon 稳定持有状态，Provider 消化差异，WebSocket 承载实时事件，持久化层负责恢复，relay 解决跨网络连接，Workspace 约束并发修改范围。几层职责清楚以后，手机控制、多客户端同步和多 Agent 编排都成为同一套底座上的自然扩展。

## 参考资料

- [Paseo GitHub 仓库](https://github.com/getpaseo/paseo)
- [Paseo v0.3.1 Release](https://github.com/getpaseo/paseo/releases/tag/v0.3.1)
- [Agent Manager 源码](https://github.com/getpaseo/paseo/blob/main/packages/server/src/server/agent/agent-manager.ts)
- [Agent Storage 源码](https://github.com/getpaseo/paseo/blob/main/packages/server/src/server/agent/agent-storage.ts)
- [端到端加密通道源码](https://github.com/getpaseo/paseo/blob/main/packages/relay/src/encrypted-channel.ts)
- [连接配对协议源码](https://github.com/getpaseo/paseo/blob/main/packages/protocol/src/connection-offer.ts)
