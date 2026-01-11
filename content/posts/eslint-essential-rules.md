---
title: "ESLint 常用规则详解（一）：核心逻辑与错误预防"
date: "2026-01-12"
summary: "深入解析 JavaScript 开发中常用的 ESLint 核心规则，作为系列文章的第一篇，本文重点关注如何帮助开发者规避常见错误并提升代码质量。涵盖 no-unused-vars, eqeqeq, no-console 等关键配置。"
tags: ["ESLint", "JavaScript", "前端开发", "代码质量"]
draft: false
---

# ESLint 常用规则详解（一）：核心逻辑与错误预防

在现代前端开发中，ESLint 已经成为保证代码质量不可或缺的工具。本系列文章将带你深入了解常用的 ESLint 规则，分为**基础概念**和**实践**两部分，帮助你知其然更知其所以然。

## 1. no-unused-vars (禁止未使用的变量)

### 基础概念

此规则旨在消除代码中声明了但从未被使用的变量。未使用的变量不仅会增加代码体积，往往也是逻辑错误或重构遗留问题的信号。清理这些死代码可以显著提高代码的可读性和维护性。

### 实践

#### 错误示例

```javascript
// error: 'y' is defined but never used
function calculate(x) {
  const y = 10;

  return x * 2;
}
```

#### 正确示例

```javascript
function calculate(x) {
  const factor = 2;

  return x * factor;
}
```

#### 配置建议

通常建议设置为 `error` 或 `warn`。在开发阶段可以使用 `warn` 避免频繁打断，生产构建时设为 `error`。

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    "no-unused-vars": [
      "error",
      { vars: "all", args: "after-used", ignoreRestSiblings: false },
    ],
  },
};
```

## 2. eqeqeq (强制使用全等)

### 基础概念

JavaScript 中的 `==` 操作符会进行隐式类型转换，这往往会导致意想不到的 bug（例如 `0 == '0'` 为 true）。`eqeqeq` 规则强制要求使用 `===` 和 `!==`，确保比较时不仅数值相同，类型也必须相同。

### 实践

#### 错误示例

```javascript
const userInput = "1";

if (userInput == 1) {
  // 隐式类型转换可能导致意外行为
  console.log("Matched!");
}
```

#### 正确示例

```javascript
const userInput = "1";

if (Number(userInput) === 1) {
  // 显式转换，逻辑更清晰
  console.log("Matched!");
}
```

#### 配置建议

强烈建议在所有项目中开启此规则。

```javascript
module.exports = {
  rules: {
    eqeqeq: ["error", "always"],
  },
};
```

## 3. no-console (禁止使用 console)

### 基础概念

虽然 `console.log` 是调试神器，但在生产环境中遗留大量的 console 语句会污染控制台输出，甚至可能泄露敏感信息或影响性能。此规则用于检测代码中的 console 调用。

### 实践

#### 错误示例

```javascript
function fetchData() {
  const data = api.get();

  console.log(data); // 生产环境中不应存在
  return data;
}
```

#### 正确示例

```javascript
// 使用自定义 logger 或在发布前删除
import logger from "./utils/logger";

function fetchData() {
  const data = api.get();

  logger.info(data);
  return data;
}
```

#### 配置建议

通常配置为 `warn`，并配合 `allow` 选项允许 `console.warn` 和 `console.error`。

```javascript
module.exports = {
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};
```

## 4. no-debugger (禁止使用 debugger)

### 基础概念

`debugger` 语句用于在代码中设置断点。这在开发调试时非常有用，但绝对不应该出现在生产环境的代码中，因为它会暂停浏览器的执行，严重影响用户体验。

### 实践

#### 错误示例

```javascript
function processData(data) {
  debugger; // 这是一个严重的生产环境事故隐患

  return data.map((item) => item.value);
}
```

#### 配置建议

建议在生产构建时设置为 `error`。

```javascript
module.exports = {
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
```

## 5. no-undef (禁止未声明的变量)

### 基础概念

此规则可以帮助你发现引用了未声明变量的错误，比如拼写错误或忘记导入模块。它要求所有使用的变量要么在局部作用域声明，要么在全局作用域（通过 `globals` 配置）中显式定义。

### 实践

#### 错误示例

```javascript
function greet() {
  // 'nam' 拼写错误，或者是忘记定义变量
  console.log(nam);
}
```

#### 正确示例

```javascript
const name = "World";

function greet() {
  console.log(name);
}
```

#### 配置建议

这是 ESLint 推荐配置 (`eslint:recommended`) 的一部分，默认为 `error`。

```javascript
module.exports = {
  rules: {
    "no-undef": "error",
  },
};
```

## 6. curly (强制使用花括号)

### 基础概念

当 `if`、`else`、`for`、`while` 等语句的代码块只有一行时，JavaScript 允许省略花括号。但这会降低代码的可读性，并且在后续添加代码时容易引发错误。`curly` 规则强制要求所有控制语句必须使用花括号包裹。

### 实践

#### 错误示例

```javascript
if (isValid) return true;
```

#### 正确示例

```javascript
if (isValid) {
  return true;
}
```

#### 配置建议

建议设置为 `all`，保证代码风格统一且安全。

```javascript
module.exports = {
  rules: {
    curly: ["error", "all"],
  },
};
```

---

本文介绍了几个关于核心逻辑与错误预防的 ESLint 规则。在下一篇文章中，我们将探讨关于**代码风格与最佳实践**的常用规则，敬请期待。
