---
title: "React 总结"
date: "2024-12-11"
summary: "React 框架的学习总结，包括 Redux 状态管理的使用方法和核心概念。"
tags: ["React", "Redux", "状态管理", "前端"]
draft: false
---

# React 总结

React 是一个用于构建用户界面的 JavaScript 库，它采用组件化开发模式，让前端开发更加高效和可维护。

## Redux 状态管理

Redux 是一个可预测的状态管理库，主要用于管理应用的状态。下面是 Redux 的使用步骤：

### Redux 使用步骤

1. **定义一个 reducer 函数（根据当前想要做的修改返回一个新的状态）**
2. **使用 createStore 方法传入 reducer 函数生成一个 store 实例对象**
3. **使用 store 实例的 subscribe 方法订阅数据的变化（数据一旦变化，可以得到通知）**
4. **使用 store 实例的 dispatch 方法提交 action 对象触发数据变化（告诉 reducer 你想怎么改数据）**
5. **使用 store 实例的 getState 方法获取最新的状态数据更新到视图中**

### Redux 记录

![redux记录](/redux-record.png)

*Redux 状态管理流程图*

### Redux 核心概念

#### 1. Reducer 函数

Reducer 是一个纯函数，它接收当前状态和 action 对象，返回新的状态。

\`\`\`javascript
// 1. 定义 reducer 函数
// 作用: 根据不同的 action 对象, 返回不同的新的 state
// state: 管理的数据初始状态
// action: 对象 type 标记当前想要做什么样的修改
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
\`\`\`

#### 2. Store 实例

Store 是 Redux 的核心，它保存了应用的状态，并提供了访问状态、更新状态和监听状态变化的方法。

\`\`\`javascript
// 2. 使用 createStore 方法传入 reducer 函数生成一个 store 实例对象
import { createStore } from 'redux';
const store = createStore(reducer);
\`\`\`

#### 3. 订阅状态变化

\`\`\`javascript
// 3. 使用 store 实例的 subscribe 方法订阅数据的变化
store.subscribe(() => {
  console.log('状态已更新:', store.getState());
});
\`\`\`

#### 4. 派发 Action

\`\`\`javascript
// 4. 使用 store 实例的 dispatch 方法提交 action 对象触发数据变化
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
\`\`\`

#### 5. 获取状态

\`\`\`javascript
// 5. 使用 store 实例的 getState 方法获取最新的状态数据
const currentState = store.getState();
console.log('当前状态:', currentState);
\`\`\`

## React Hooks

React Hooks 是 React 16.8 引入的新特性，它允许你在函数组件中使用状态和其他 React 特性。

### useState

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
\`\`\`

### useEffect

\`\`\`javascript
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{data ? JSON.stringify(data) : '加载中...'}</div>;
}
\`\`\`

## 总结

React 和 Redux 是现代前端开发中非常重要的技术栈。掌握它们可以帮助我们构建更加复杂和可维护的 Web 应用。

