---
title: 自动化测试实战：Robot Framework + Selenium 企业级 UI 测试
date: 2026-04-10
description: 基于真实企业项目，梳理 Robot Framework 测试编排、Selenium 浏览器自动化、元素定位策略和多层关键字封装的最佳实践。
category: devops
tags: [自动化测试, Robot Framework, Selenium, UI测试, Python, 测试工程]
slug: automated-testing-selenium-practice
---

# 自动化测试实战：Robot Framework + Selenium 企业级 UI 测试

在 Web 应用迭代越来越快的背景下，纯手工回归测试的成本越来越高。这篇文章基于一个真实的企业级自动化测试项目，梳理 Robot Framework + Selenium 的完整技术栈：从测试编排到浏览器控制，从元素定位到多层关键字封装。

## 项目定位与技术栈

这个项目同时覆盖三类测试：

- **UI 自动化测试**：通过浏览器模拟用户在 Web 管理界面上操作
- **API 自动化测试**：直接调用后端接口验证逻辑
- **专项测试**：YAML 驱动的定制化测试集

| 技术/框架 | 角色 | 类比 |
|-----------|------|------|
| Robot Framework | 测试流程编排、用例编写、报告生成 | "导演 + 剧本" |
| SeleniumLibrary | RF 的扩展库，提供浏览器操作关键字 | "遥控器" |
| Selenium WebDriver | 底层浏览器控制引擎 | "马达/引擎" |
| Python | 写扩展关键字、处理复杂逻辑 | "特技团队" |
| pytest | API 测试和专项测试的执行框架 | "另一套剧组" |

核心关系：

```text
用户写的 .robot 文件
        ↓
Robot Framework 解析关键字
        ↓
SeleniumLibrary 把关键字转成 Selenium API 调用
        ↓
Selenium WebDriver 驱动 Chrome/Edge 浏览器
        ↓
浏览器真正访问 Web 页面、点击按钮、填写表单
```

## 项目运行逻辑

### 统一调度入口

`run_tests.py` 是整个项目的统一调度入口，负责：

1. 解析命令行参数：`--os`、`--resource`、`--stage`、`--include`、`--headless`
2. 补全默认策略：根据星期几分配合适的 pool_type 和优先级（P0/P1/P2）
3. 按 stage 编排执行：
   - stage 2（UI 测试）：组装 `robot` 命令，调用 `subprocess.run()`
   - stage 4（API 测试）：组装 `pytest` 参数，调用 `pytest.main()`
   - stage 5（dedup 测试）：执行 YAML 驱动测试集
4. 合并报告：多份 Robot XML 通过 `rebot` 合并成 `output.xml`

### UI 测试的执行链路

以执行 DB2 的 UI 测试为例：

```bash
python run_tests.py --os rhel74 --resource db2 --stage 2 --include P0
```

内部流转：

```text
run_tests.py
    ↓
robot_command() 拼接完整 robot 命令
    ↓
subprocess.run(["robot", "--include", "P0", "-v", "os:rhel74", "-v", "resource:db2", ...])
    ↓
Robot Framework 扫描 testsuites/03-DB2/ 目录
    ↓
加载 __init__.robot → 执行 Suite Setup（打开浏览器、登录、设全局变量）
    ↓
依次执行 *.robot 文件中的 Test Cases
    ↓
每个 Test Case 调用 keywords.robot 中封装的关键字
    ↓
关键字内部使用 SeleniumLibrary 操作页面元素
    ↓
生成 output.xml / log.html / report.html
    ↓
run_tests.py 调用 rebot 合并报告
```

### 测试文件层级

```text
DBackup_UI/
├── Locators/           ← 页面元素定位器（"地址簿"）
│   ├── Login.robot
│   ├── Common.robot
│   └── Backup.robot
├── Keywords/           ← 公共关键字封装（"函数库"）
│   └── Header_Files/
│       ├── Common.robot
│       └── Guang_Zhou.robot
├── testsuites/         ← 真正的测试用例
│   └── 03-DB2/
│       ├── __init__.robot
│       ├── keywords.robot
│       └── 01.Backup-Restore-http.robot
```

## Selenium 在项目中的五层使用

### 第一层：.robot 用例文件

用例本身看起来不像在操作浏览器：

```robot
创建db2完全备份作业-非归档模式-默认选项
    ${db_list}    Create List    ${db_content01}
    ${jobname}    创建DB2备份作业并检查作业完成状态
    ...    ${hostinfo}    完全备份    ${db_list}    ${pool_name}
    Set Suite Variable    ${jobname}
```

但实际上，`创建DB2备份作业并检查作业完成状态` 这个关键字内部就是一连串 Selenium 操作。

### 第二层：keywords.robot 组合 Selenium 动作

这里封装了业务关键字：

```robot
logarchmeth1 on
    click element    id=cb_db2_enable_archivelog
    click element    css=.fa-folder-open
    select backup content by path    /tmp/
```

- `click element` 是 SeleniumLibrary 的关键字
- `id=cb_db2_enable_archivelog` 是 Selenium 的 id 定位策略
- `css=.fa-folder-open` 是 Selenium 的 css selector 定位策略

### 第三层：Locators 集中管理元素定位器

```robot
*** Variables ***
${user_login_btn}     css=.login-form button.login-btn
${user_logout_a}      css=.li-nav-logout
${jobs_menu}          css=a.menu-link[href="#jobs"]
${next_btn}           jquery=button.wizard-next.btn-primary:visible
```

集中管理的好处是：页面改版时只需要改这里，所有用例自动生效。

### 第四层：Header_Files 通用浏览器操作

```robot
Open Server As User
    [Arguments]    ${server}    ${user}    ${password}
    Open Browser    ${server}    chrome
    Input Text      ${user_login_txt}     ${user}
    Input Text      ${user_password_txt}  ${password}
    Click Element   ${user_login_btn}
```

这里直接出现了 `Open Browser`、`Input Text`、`Click Element` 等 SeleniumLibrary 关键字。

### 第五层：Python 直接操作 WebDriver

当 RF + SeleniumLibrary 不够用时，直接用 Python 写扩展：

```python
def enable_download_in_headless_chrome(download_dir):
    selib = BuiltIn().get_library_instance('SeleniumLibrary')
    selib.driver.command_executor._commands["send_command"] = (
        "POST", '/session/$sessionId/chromium/send_command'
    )
    params = {
        'cmd': 'Page.setDownloadBehavior',
        'params': {'behavior': 'allow', 'downloadPath': download_dir}
    }
    command_result = selib.driver.execute("send_command", params)
    return command_result
```

关键点：`BuiltIn().get_library_instance('SeleniumLibrary')` 拿到 RF 里的 SeleniumLibrary 实例，`.driver` 访问原生的 Selenium WebDriver 对象。

其他常用增强：

| 函数 | 作用 |
|------|------|
| `get_selenium_browser_log()` | 读取浏览器 Console 日志/JS 报错 |
| `screenshot_with_datetime()` | 调用截图并加上时间戳命名 |
| `get_css_selector(locator)` | 把 RF 定位器格式转成纯 CSS 选择器 |

## 元素定位策略

项目中实际使用的 Selenium 定位策略：

| 策略 | 示例 | 适用场景 |
|------|------|---------|
| `id=` | `id=cb_db2_enable_archivelog` | 元素有稳定 id 时首选 |
| `css=` | `css=.login-form button.login-btn` | 复杂选择、类名组合 |
| `name=` | `name=search-by-column` | 表单元素 |
| `class=` | `class=btn-primary` | 简单类名匹配 |
| `jquery=` | `jquery=button.wizard-next:visible` | 需要可见性等复杂条件 |

定位策略的选择优先级：
1. 有稳定唯一 `id` 时优先用 `id=`
2. 没有 id 时用 `css=`，选择器尽量具体
3. 需要可见性、文本内容等复杂条件时考虑 `jquery=`
4. 避免用过于宽泛的类名单独定位

## 执行命令与参数传递

Selenium 相关配置通过命令行变量 (`-v`) 传给 RF：

```python
# 远程 WebDriver（Selenium Grid 或远程 Chrome）
if args.remote_url:
    command.append("-v")
    command.append(f"REMOTE_WEBDRIVER:{args.remote_url}")

# 无头模式
if args.headless:
    command.append("-v")
    command.append("headless:True")

# 是否截图
if args.screenshot:
    command.extend(("-v", "screenshot:True"))
```

这些变量影响 `Open Chrome Browser` 关键字的实现：

```robot
Open Chrome Browser
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Run Keyword If    '${headless}' == 'True'    Call Method    ${options}    add_argument    --headless
    Run Keyword If    '${headless}' == 'True'    Call Method    ${options}    add_argument    --no-sandbox
    Create Webdriver    Chrome    chrome_options=${options}
    Go To    ${server_url}
```

## 关键文件速查

| 文件 | 作用 | 是否直接涉及 Selenium |
|------|------|----------------------|
| `run_tests.py` | 总调度入口 | 间接（拼接参数） |
| `__init__.robot` | 套件级 Setup/Teardown | 直接（打开浏览器） |
| `*.robot` (Test Cases) | 具体测试场景 | 间接（调用关键字） |
| `keywords.robot` | 业务关键字封装 | 直接（click element 等） |
| `Locators/*.robot` | 页面元素定位器定义 | 直接（css=、id= 等） |
| `Keywords/Header_Files/Common.robot` | 通用 UI 操作 | 直接（Open Browser 等） |
| `tool_utils/define_rf_keywords.py` | Python 扩展库 | 直接（操作 WebDriver） |

## 企业级 UI 自动化的常见坑

### 1. 页面加载时机

元素存在不代表元素可点击。需要等页面完全加载后再操作。

### 2. 定位器不稳定

前端框架动态生成类名时，`css=.btn-primary` 可能失效。应优先找稳定属性（id、data-testid）。

### 3. 无头模式差异

无头 Chrome 和普通 Chrome 在某些行为上有差异，比如下载文件、弹窗处理。

### 4. 用例之间的状态污染

上一个用例失败可能导致页面停留在异常状态，影响下一个用例。每个 Suite 的 `__init__.robot` 应做好 Setup 和 Teardown。

### 5. 维护成本

UI 自动化最大的成本不是写，而是维护。页面改版时定位器失效是常态。把定位器集中到 `Locators/` 目录是降低维护成本的标准做法。

## 总结

1. 这个项目不是纯 Selenium 项目，而是 **Robot Framework + SeleniumLibrary + Selenium** 三层架构
2. Selenium 的真正触发点在：`Common.robot`（打开浏览器）、`keywords.robot`（点击输入）、`define_rf_keywords.py`（底层增强）
3. 运行逻辑：`run_tests.py` 拼接命令 -> `robot` 执行 -> RF 解析关键字 -> SeleniumLibrary 翻译 -> Selenium WebDriver 驱动浏览器
4. 页面元素管理：所有定位器集中在 `Locators/` 目录下，这是大型 UI 自动化项目的标准做法

自动化测试的核心价值不是"替代手工测试"，而是把重复、稳定、高频的验证步骤交给机器，让人有更多精力去做探索性测试和复杂场景验证。
