---
title: 从 Spring 到 Spring Cloud：Java 后端框架演进之路
date: 2026-02-10
description: 系统梳理 Spring 核心、Spring Boot 自动配置、Spring Cloud 微服务治理，以及常用注解分类与使用场景。
category: backend
tags: [Spring, Spring Boot, Spring Cloud, 微服务, Java]
slug: spring-to-spring-cloud-guide
---

# 从 Spring 到 Spring Cloud：Java 后端框架演进之路

Java 后端开发里，Spring 家族是最核心的技术栈。从单个服务的快速搭建，到多个微服务的协同治理，Spring 提供了完整的解决方案。这篇文章把 IoC、AOP、Spring Boot 自动配置、Spring Cloud 微服务治理串在一起讲，目标是建立框架层面的完整认知。

## Spring 核心：IoC 与 DI

### IoC 是什么

IoC = Inversion of Control，控制反转。对象交给 Spring 容器创建、管理、注入和组装，业务代码不自己 `new`。

自己 `new` 的问题：耦合高、替换实现类麻烦、测试不方便、依赖关系复杂时维护成本高。

### DI 是什么

DI = Dependency Injection，依赖注入。它是 IoC 最常见的实现方式，用来把依赖对象注入到目标对象里。

常见注入方式：
- 构造器注入（推荐，依赖更清晰，方便测试）
- Setter 注入
- 字段注入

### Bean 与容器

Bean 本质上就是被 Spring 容器管理的对象。交给容器后，Spring 才能帮你做生命周期管理、自动注入、事务代理、AOP 增强。

Spring 容器可以理解成一个大对象工厂 + 对象管理中心：
1. 扫描类和配置
2. 生成 BeanDefinition
3. 创建对象
4. 注入依赖
5. 执行初始化
6. 必要时返回代理对象

`BeanFactory` 是更底层的基础容器，`ApplicationContext` 能力更完整，日常开发最常见。

### Bean 生命周期

简化版顺序：
1. 扫描 `@Component`、`@Service`、`@Repository`、`@Bean`
2. 实例化对象
3. 注入依赖
4. 执行 Aware 回调
5. 执行 `BeanPostProcessor#postProcessBeforeInitialization()`
6. 执行初始化方法
7. 执行 `BeanPostProcessor#postProcessAfterInitialization()`
8. Bean 可用
9. 执行销毁逻辑

初始化钩子：`@PostConstruct`、`InitializingBean.afterPropertiesSet()`、自定义 `init-method`。

销毁钩子：`@PreDestroy`、`DisposableBean.destroy()`、自定义 `destroy-method`。

> 业务里拿到的 Bean，很多时候其实是代理对象，不一定是最原始实例。典型场景是命中了 AOP 切面或标了 `@Transactional`。

### Bean 作用域

- `singleton`：默认单例，一个容器里通常只有一份
- `prototype`：每次获取都新建
- `request`：一次请求一个 Bean
- `session`：一个 Session 一个 Bean

### 循环依赖

单例 Bean + Setter/字段注入场景下，Spring 在一部分情况下可以通过提前暴露早期引用解决循环依赖。但构造器循环依赖和 Prototype Bean 的循环依赖通常解决不了。

## AOP：面向切面编程

### AOP 解决什么问题

日志、事务、权限、监控这些横切逻辑，如果散落在每个业务方法里，会造成重复代码和职责混乱。AOP 的做法是把横切逻辑抽成切面，在不改业务代码的情况下织入方法前后。

### 核心术语

- **Join Point**：连接点，可插入增强的位置
- **Pointcut**：切点，定义拦截哪些连接点
- **Advice**：通知，真正执行的增强逻辑
- **Aspect**：切面，切点 + 通知
- **Weaving**：织入，把切面逻辑应用到目标对象

### Spring AOP 的本质

Spring AOP 大多数场景下本质就是动态代理：
- **JDK 动态代理**：基于接口
- **CGLIB**：基于继承生成子类

AOP 是设计思想，Spring AOP 通常通过代理模式实现。

### @Transactional 为什么能生效

事务在 Spring 里本质上也是 AOP。Spring 给目标 Bean 包了一层事务代理，在方法前后织入事务逻辑：调用前开启事务，正常结束则提交，异常则回滚。

常见失效场景：
1. 同类内部自调用
2. 方法不是 `public`
3. 捕获异常后没继续抛
4. 抛的是受检异常但没配置 `rollbackFor`
5. Bean 没交给 Spring 管理

## Spring MVC 执行流程

一个请求进来的大致流程：
1. 请求到 `DispatcherServlet`
2. 找到对应 Controller
3. 做参数绑定
4. 调用业务方法
5. 处理返回结果
6. 视图解析或 JSON 序列化
7. 响应客户端

`DispatcherServlet` 是 Spring MVC 的总调度器。

### Filter、Interceptor、AOP 的区别

| 对比项 | Filter | Interceptor | AOP |
|--------|--------|-------------|-----|
| 所属层级 | Servlet 规范 | Spring MVC | Spring 容器 / 代理层 |
| 拦截对象 | 请求和响应 | Controller 调用链 | 方法执行 |
| 常见场景 | 编码、跨域、统一过滤 | 登录校验、权限、日志 | 事务、日志、埋点、权限 |

简单理解：Filter 是最外层偏 Web 容器，Interceptor 在 Spring MVC 层，AOP 更偏方法级增强。

## Spring Boot：让服务快速跑起来

### Spring vs Spring Boot

- **Spring Framework**：基础框架，核心是 IoC、AOP、MVC、事务
- **Spring Boot**：基于 Spring Framework 的快速开发框架

类比：Spring 像发动机和底盘，Spring Boot 像把整车提前装好了。

### 两个关键词

- **Starter**：场景化依赖封装，比如 `spring-boot-starter-web`
- **自动配置**：按条件自动装配基础设施

### 为什么 Spring Boot 方便

- 场景化依赖封装
- 自动配置大量基础设施
- 默认内嵌 Tomcat
- 可以直接 `java -jar` 运行

### 自动配置怎么理解

自动配置的顺序：先看类路径里有没有依赖，再看条件是否满足，满足时才自动注册 Bean。

常见条件注解：
- `@ConditionalOnClass`：类路径存在某个类才生效
- `@ConditionalOnMissingBean`：容器里没有某个 Bean 才生效
- `@ConditionalOnProperty`：某个配置项满足条件才生效

自动配置的本质就是一堆条件注解 + 默认 Bean 注册。

### 外部化配置

`application.yml` / `application.properties` 常放端口、数据库连接、日志级别、自定义业务配置。

读取方式：
- `@Value`：读取单个配置值
- `@ConfigurationProperties`：批量绑定配置前缀到对象

## Spring Cloud：多服务协同治理

Spring Cloud 不是单个框架，而是一套微服务治理工具集合。

### 解决什么问题

- 服务注册与发现
- 配置中心
- 远程调用
- 网关
- 熔断、限流、降级
- 分布式系统治理

一句话理解：Spring Boot 解决"单个服务快速开发"，Spring Cloud 解决"多个服务协同治理"。

### 常见组件

| 组件 | 作用 |
|------|------|
| Nacos / Eureka | 注册中心 |
| Nacos Config / Spring Cloud Config | 配置中心 |
| OpenFeign | 声明式远程调用 |
| Spring Cloud LoadBalancer | 客户端负载均衡 |
| Gateway | 网关 |
| Sentinel / Resilience4j | 限流、熔断、降级 |

### Spring Boot vs Spring Cloud

| 对比项 | Spring Boot | Spring Cloud |
|--------|-------------|--------------|
| 关注点 | 单个应用快速开发 | 多个服务协同治理 |
| 典型能力 | 自动配置、Starter、内嵌服务器 | 注册中心、配置中心、网关、远程调用 |
| 使用场景 | 单体应用 / 单个微服务 | 微服务体系 |

通常每个微服务本身都是一个 Spring Boot 应用，Spring Cloud 再给这些服务加分布式治理能力。

## 常用注解分类速查

### 组件标记

| 注解 | 作用 | 常见位置 |
|------|------|----------|
| `@Component` | 通用组件注解 | 工具类、基础组件 |
| `@Service` | 业务服务组件 | Service / Application Service |
| `@Repository` | 持久层组件 | DAO / Repository |
| `@RestController` | REST 控制器 | JSON 接口层 |

### 依赖注入

| 注解 | 作用 |
|------|------|
| `@Autowired` | 按类型注入 |
| `@Qualifier` | 指定注入哪一个 Bean |
| `@Primary` | 标记某个 Bean 为默认优先注入 |

日常更推荐构造器注入，字段注入虽然短，但不利于测试和依赖显式化。

### 配置类

| 注解 | 作用 |
|------|------|
| `@Configuration` | 声明当前类是配置类 |
| `@Bean` | 把方法返回值注册成 Bean |
| `@Value` | 读取单个配置值 |
| `@ConfigurationProperties` | 批量绑定配置前缀到对象 |

### Web / MVC

| 注解 | 作用 |
|------|------|
| `@GetMapping` / `@PostMapping` | GET / POST 请求映射 |
| `@PathVariable` | 取路径变量 |
| `@RequestParam` | 取 query 参数 |
| `@RequestBody` | 绑定 JSON 请求体 |

### 事务与 AOP

| 注解 | 作用 |
|------|------|
| `@Transactional` | 声明事务边界 |
| `@Aspect` | 声明切面 |
| `@Around` | 环绕通知，最常用也最强 |

### Spring Boot / Cloud

| 注解 | 作用 |
|------|------|
| `@SpringBootApplication` | Boot 启动类核心注解 |
| `@LoadBalanced` | 给 RestTemplate 增加按服务名调用能力 |
| `@RefreshScope` | 配置刷新后重新获取 Bean |

## 面试速记版

**Spring 核心**
- IoC：对象交给容器管理
- DI：依赖由容器注入
- Bean：被 Spring 管理的对象
- 容器：负责创建、装配、初始化、增强 Bean

**AOP / 事务**
- AOP 本质：代理
- `@Transactional` 本质：事务切面
- 同类内部自调用会导致事务失效

**Boot**
- Starter：场景依赖
- 自动配置：按条件装配 Bean
- 内嵌服务器：可直接 `java -jar`

**Cloud**
- 服务注册发现、配置中心、远程调用、网关、限流熔断

Spring 面试的核心不是背注解名字，而是把"容器怎么管理对象、代理怎么增强方法、请求怎么进入 Controller、Boot 怎么自动配置、Cloud 怎么做微服务治理"这五条主线讲清楚。
