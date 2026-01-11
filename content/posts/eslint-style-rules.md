---
title: "ESLint 常用规则详解（二）：代码风格与最佳实践"
date: "2026-01-12"
summary: "紧接上篇，本文继续探讨 ESLint 中关于代码风格和最佳实践的常用规则。通过规范 indent, quotes, semi 等细节，助你打造统一、优雅的代码库。"
tags: ["ESLint", "代码风格", "最佳实践", "前端规范"]
draft: false
---

# ESLint 常用规则详解（二）：代码风格与最佳实践

上一篇文章我们介绍了 ESLint 中关于错误预防的核心规则，今天我们将目光转向**代码风格**。虽然代码风格（Style）往往带有主观色彩，但一个团队内部保持高度一致的风格对于可读性和协作通过至关重要。

## 1. indent (缩进)

### 基础概念

缩进是代码结构最直观的体现。此规则强制使用一致的缩进风格（通常是 2 个空格或 4 个空格）。虽然现代开发中我们常通过 Prettier 来自动格式化，但 ESLint 的此规则依然是基础标准。

### 实践

#### 错误示例 (混用缩进)

```javascript
function hello() {
  const a = 1;
  const b = 2; // 缩进不一致

  return a + b;
}
```

#### 正确示例 (2 空格缩进)

```javascript
function hello() {
  const a = 1;
  const b = 2;

  return a + b;
}
```

#### 配置建议

注意：如果你使用了 Prettier，通常建议关闭 ESLint 的格式化规则以避免冲突（使用 `eslint-config-prettier`）。

```javascript
module.exports = {
  rules: {
    indent: ["error", 2], // 强制 2 空格缩进
  },
};
```

## 2. quotes (引号风格)

### 基础概念

在 JavaScript 中，字符串可以使用单引号 `'`、双引号 `"` 或反引号 `` ` ``。此规则用于强制统一使用一种引号风格，通常单引号在 JS 社区更为流行。

### 实践

#### 错误示例

```javascript
const name = "Alice"; // 如果配置了单引号，这里会报错
const msg = "Hello";
```

#### 正确示例

```javascript
const name = "Alice";
const msg = "Hello";
```

#### 配置建议

```javascript
module.exports = {
  rules: {
    quotes: ["error", "single", { avoidEscape: true }],
  },
};
```

## 3. semi (分号使用)

### 基础概念

JavaScript 的自动分号插入机制（ASI）允许在某些情况下省略分号。关于“加不加分号”的争论从未停止。此规则可以强制要求每一句末尾必须加分号，或者禁止加分号。

### 实践

#### 错误示例 (要求分号但未加)

```javascript
const a = 1;

const b = 2;
```

#### 正确示例

```javascript
const a = 1;
const b = 2;
```

#### 配置建议

大多数大型项目倾向于强制使用分号以避免 ASI 带来的边缘情况 bug。

```javascript
module.exports = {
  rules: {
    semi: ["error", "always"],
  },
};
```

## 4. prefer-const (首选 const)

### 基础概念

如果一个变量声明后从未被重新赋值，那么它应该被声明为 `const` 而不是 `let`。这不仅能告诉读者这个变量不会改变，还能让 JavaScript 引擎进行一定的优化。

### 实践

#### 错误示例

```javascript
let pi = 3.14; // 虽然没报错，但建议用 const

console.log(pi);
```

#### 正确示例

```javascript
const pi = 3.14;

console.log(pi);
```

#### 配置建议

```javascript
module.exports = {
  rules: {
    "prefer-const": "error",
  },
};
```

## 5. arrow-body-style (箭头函数体风格)

### 基础概念

箭头函数提供了简洁的语法。当函数体只有一个表达式且需要返回值时，可以省略大括号和 `return` 关键字（隐式返回）。此规则可以强制或禁止这种简写形式。

### 实践

#### 错误示例 (配置了 as-needed)

```javascript
const add = (a, b) => {
  return a + b; // 可以简化
};
```

#### 正确示例

```javascript
const add = (a, b) => a + b;

// 或者如果有多行逻辑，保留大括号
const calculate = (a, b) => {
  const sum = a + b;

  return sum * 2;
};
```

#### 配置建议

```javascript
module.exports = {
  rules: {
    "arrow-body-style": ["error", "as-needed"],
  },
};
```

## 6. max-len (最大行长)

### 基础概念

限制单行代码的最大长度。过长的代码行在小屏幕上难以阅读，也增加了理解的认知负荷。

### 实践

#### 错误示例

```javascript
// 假设限制为 80 字符，下面这行超长了
const veryLongObject = {
  name: "This is a very long name that exceeds the maximum length limit configured",
  age: 100,
};
```

#### 正确示例

```javascript
const veryLongObject = {
  name: "This is a very long name...",
  age: 100,
};
```

#### 配置建议

```javascript
module.exports = {
  rules: {
    "max-len": ["warn", { code: 80, ignoreComments: true }],
  },
};
```

---

通过这两篇文章，我们了解了 ESLint 在**逻辑错误预防**和**代码风格统一**两方面的强大能力。合理配置并遵守这些规则，将极大地提升项目的代码质量和团队协作效率。 happy coding!
