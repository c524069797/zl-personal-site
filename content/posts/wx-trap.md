---
title: "小程序开发踩坑记录"
date: "2025-01-20"
summary: "本文记录了在开发微信小程序过程中遇到的各种问题和解决方案，希望能帮助其他开发者避免类似的问题。"
tags: ["微信小程序", "开发", "踩坑", "问题解决", "uni-app"]
category: "tech"
draft: false
---

# 小程序开发踩坑记录

> 本文记录了在开发微信小程序过程中遇到的各种问题和解决方案，希望能帮助其他开发者避免类似的问题。

## 目录

- [UI和功能问题](#ui和功能问题)
- [配置文件问题](#配置文件问题)
- [登录和授权问题](#登录和授权问题)
- [云开发部署问题](#云开发部署问题)
- [云函数问题](#云函数问题)
- [数据库设计问题](#数据库设计问题)
- [数据同步策略](#数据同步策略)
- [总结](#总结)

---

## UI和功能问题

### 1. "我的"界面元素重叠问题

**问题描述**：
- "我的"界面存在元素重叠
- 未登录时应该显示默认ID（如"攀爬者_xxx"）
- 未登录时点击用户区域应该可以登录
- 未登录用户只允许创建一个计划

**解决方案**：

1. **修复重叠问题**：
   - 在 `pages/profile/profile.vue` 中添加 `.not-logged-in` 类
   - 调整布局和指针事件

2. **显示默认ID**：
   ```javascript
   // 生成游客用户ID
   generateGuestUserId() {
     const prefix = '攀爬者'
     const random = Math.floor(Math.random() * 10000)
     return `${prefix}_${random}`
   }
   ```

3. **点击登录**：
   ```vue
   <view class="profile-card" 
         :class="{ 'not-logged-in': !isLoggedIn }"
         @tap="!isLoggedIn ? onProfileCardTap : null">
   ```

4. **限制计划数量**：
   ```javascript
   // 在 pages/index/index.vue 中
   if (!isLoggedIn() && getAllPlans().length >= 1) {
     uni.showToast({
       title: '游客模式只能创建一个计划，请登录',
       icon: 'none'
     })
     uni.navigateTo({ url: '/pages/login/login' })
     return
   }
   ```

---

## 配置文件问题

### 2. app.json 文件找不到错误

**错误信息**：
```
[ app.json 文件内容错误] app.json: 在项目根目录未找到 app.json
```

**问题原因**：
- uni-app 项目使用 `pages.json` 作为页面配置
- 但微信开发者工具需要 `app.json` 文件

**解决方案**：
在项目根目录创建 `app.json` 文件，内容与 `pages.json` 保持一致：

```json
{
  "pages": [
    "pages/index/index",
    "pages/login/login",
    "pages/profile/profile"
  ],
  "window": {
    "navigationBarTitleText": "向上计划局"
  },
  "tabBar": {
    "list": [...]
  }
}
```

---

### 3. logout 函数导入错误

**错误信息**：
```
"logout" is not exported by "../../utils/userStorage.js"
```

**问题原因**：
- `logout` 函数在 `auth.js` 中，但 `profile.vue` 从 `userStorage.js` 导入

**解决方案**：
将 `logout` 函数移动到 `userStorage.js`：

```javascript
// utils/userStorage.js
const logout = () => {
  try {
    uni.removeStorageSync(USER_STORAGE_KEY)
    uni.removeStorageSync(USER_STATS_KEY)
    return true
  } catch (e) {
    console.error('退出登录失败:', e)
    return false
  }
}

export { logout }
```

---

## 登录和授权问题

### 4. getUserProfile 只能由用户点击触发

**错误信息**：
```
getUserProfile:fail can only be invoked by user TAP gesture.
```

**问题原因**：
- 微信小程序要求 `getUserProfile` 必须在用户点击事件中调用
- 不能在异步回调或定时器中调用

**解决方案**：
使用微信新的头像昵称填写能力：

```vue
<!-- 使用原生组件 -->
<button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
  <image v-if="tempUserInfo.avatarUrl" :src="tempUserInfo.avatarUrl"></image>
</button>

<input type="nickname" v-model="tempUserInfo.nickname" placeholder="请输入昵称" />
```

**参考文档**：
- [微信小程序头像昵称填写能力](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html)

---

### 5. 手机号授权使用原生UI

**问题描述**：
- 需要使用微信原生的手机号授权界面，而不是自定义界面

**解决方案**：
使用 `button` 组件的 `open-type="getPhoneNumber"`：

```vue
<button
  open-type="getPhoneNumber"
  @getphonenumber="onGetPhoneNumber"
>
  手机号注册/登录
</button>
```

```javascript
async onGetPhoneNumber(e) {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    // 调用云函数解密手机号
    const decryptResult = await wx.cloud.callFunction({
      name: 'decryptPhone',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        cloudID: e.detail.cloudID
      }
    })
  }
}
```

---

## 云开发部署问题

### 6. 云函数本地调试错误：文件不存在

**错误信息**：
```
Error: ENOENT: no such file or directory, 
scandir '/path/to/unpackage/dist/dev/mp-weixin/cloudfunctions/'
```

**问题原因**：
- HBuilderX 编译时不会自动复制 `cloudfunctions` 目录到输出目录
- 微信开发者工具需要云函数文件在编译输出目录中

**解决方案**：

创建复制脚本 `scripts/copy-cloudfunctions.js`：

```javascript
const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const CLOUDFUNCTIONS_SRC = path.join(PROJECT_ROOT, 'cloudfunctions')
const CLOUDFUNCTIONS_DST = path.join(PROJECT_ROOT, 'unpackage', 'dist', 'dev', 'mp-weixin', 'cloudfunctions')

// 复制云函数目录
function copyDir(src, dst) {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true })
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue
    
    const srcPath = path.join(src, entry.name)
    const dstPath = path.join(dst, entry.name)
    
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath)
    } else {
      fs.copyFileSync(srcPath, dstPath)
    }
  }
}

copyDir(CLOUDFUNCTIONS_SRC, CLOUDFUNCTIONS_DST)
console.log('✅ 云函数复制完成')
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "copy-cloudfunctions": "node scripts/copy-cloudfunctions.js"
  }
}
```

**使用方法**：
每次编译后运行：
```bash
npm run copy-cloudfunctions
```

---

## 云函数问题

### 7. 云函数错误 -604100：API not found

**错误信息**：
```
errCode: -604100 API not found | errMsg: system error: error code: -604100
```

**问题原因**：
- 云函数中使用了 `cloud.openapi.auth.code2Session`，但可能没有权限
- 或者云函数未正确部署

**解决方案**：

**方案一：使用 HTTP 请求直接调用微信API**

```javascript
// cloudfunctions/login/index.js
const axios = require('axios')

exports.main = async (event, context) => {
  const { code } = event
  const appSecret = process.env.APP_SECRET || config.APP_SECRET
  
  try {
    // 直接调用微信API
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: wxContext.APPID,
        secret: appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })
    
    if (response.data.errcode) {
      return {
        success: false,
        message: response.data.errmsg
      }
    }
    
    return {
      success: true,
      data: {
        openid: response.data.openid,
        session_key: response.data.session_key
      }
    }
  } catch (error) {
    // 降级方案：使用 cloud.openapi
    return await cloud.openapi.auth.code2Session({...})
  }
}
```

**方案二：检查云函数部署**
1. 在微信开发者工具中右键云函数文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

---

### 8. 云函数错误 -504002：functions execute fail

**错误信息**：
```
errCode: -504002 functions execute fail | errMsg: 145 code exit unexpected
```

**问题原因**：
- 云函数执行时出现未捕获的异常
- 常见原因：使用了 `new Date()` 而不是 `db.serverDate()`

**解决方案**：

```javascript
// ❌ 错误写法
const userData = {
  updateTime: new Date(),
  createTime: new Date()
}

// ✅ 正确写法
const userData = {
  updateTime: db.serverDate(),  // 使用云数据库服务器时间
  createTime: db.serverDate()
}
```

**完整示例**：

```javascript
// cloudfunctions/updateUser/index.js
const cloud = require('wx-server-sdk')
const db = cloud.database()

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  try {
    const userData = {
      nickname: event.nickname || '',
      avatarUrl: event.avatarUrl || '',
      updateTime: db.serverDate()  // ✅ 使用服务器时间
    }
    
    // 更新用户信息
    await db.collection('users').doc(userId).update({
      data: userData
    })
    
    return { success: true }
  } catch (error) {
    console.error('更新失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}
```

---

### 9. 云函数错误 -501000：FunctionName parameter could not be found

**错误信息**：
```
errCode: -501000 | errMsg: FunctionName parameter could not be found
```

**问题原因**：
- 云函数未部署到云端
- 云函数名称拼写错误
- 云开发环境配置错误

**解决方案**：

1. **检查云函数是否部署**：
   - 打开云开发控制台
   - 查看"云函数"列表
   - 确认所有需要的云函数都已部署

2. **部署云函数**：
   ```
   1. 在微信开发者工具中找到 cloudfunctions/ 目录
   2. 右键点击云函数文件夹（如 savePlan）
   3. 选择"上传并部署：云端安装依赖"
   4. 等待部署完成
   ```

3. **改进错误处理**：

```javascript
// utils/cloudStorage.js
export const savePlanToCloud = async (plan) => {
  try {
    const result = await wx.cloud.callFunction({
      name: 'savePlan',
      data: { ... }
    })
    return result.result
  } catch (error) {
    // 检测云函数未找到的错误
    if (error.errCode === -501000 || 
        error.errMsg?.includes('FunctionName parameter could not be found')) {
      console.error('❌ 云函数 savePlan 未找到，请先部署云函数')
      console.error('部署步骤：右键 cloudfunctions/savePlan -> "上传并部署：云端安装依赖"')
      return { 
        success: false, 
        message: '云函数未部署，请先部署 savePlan 云函数',
        needDeploy: true
      }
    }
    return { success: false, message: error.message }
  }
}
```

---

## 数据库设计问题

### 10. 数据库表结构设计

**需求**：
- 用户信息表（users）
- 计划表（plans）
- 冥想信息表（meditations）
- 需要建立关联关系

**解决方案**：

#### 10.1 用户信息表 (users)

```javascript
{
  _id: "云数据库自动生成的ID",
  _openid: "微信用户唯一标识（唯一索引）",
  nickname: "用户昵称",
  avatarUrl: "用户头像URL",
  phone: "手机号（可选）",
  loginType: "登录类型（wechat/phone）",
  createTime: "创建时间",
  updateTime: "更新时间"
}
```

**索引**：
- `_openid`: **唯一索引**（每个用户只有一条记录）

#### 10.2 计划表 (plans)

```javascript
{
  _id: "云数据库自动生成的ID",
  _openid: "用户openid（普通索引，一个用户可以有多个计划）",
  planId: "计划唯一ID（唯一索引）",
  question: "用户问题描述",
  days: "计划天数",
  calendarData: "日历数据数组",
  status: "计划状态（active/completed/archived）",
  createTime: "创建时间",
  updateTime: "更新时间"
}
```

**索引**：
- `_openid`: **非唯一索引**（普通索引）
- `planId`: **唯一索引**
- `status`: **非唯一索引**（普通索引）

#### 10.3 冥想信息表 (meditations)

```javascript
{
  _id: "云数据库自动生成的ID",
  _openid: "用户openid（普通索引）",
  planId: "计划ID（普通索引）",
  dayIndex: "计划中的第几天",
  date: "日期（YYYY-MM-DD）",
  duration: "冥想时长（秒）",
  feeling: "感受和想法",
  createTime: "创建时间"
}
```

**索引**：
- `_openid`: **非唯一索引**（普通索引）
- `planId`: **非唯一索引**（普通索引）
- `date`: **非唯一索引**（普通索引）

**重要提示**：
- `users` 表的 `_openid` 必须是**唯一索引**
- `plans` 和 `meditations` 表的 `_openid` 应该是**非唯一索引**（普通索引）

---

### 11. 数据库索引配置

**问题**：
- 不清楚 `_openid` 索引应该设置为唯一还是非唯一

**解决方案**：

| 表名 | `_openid` 索引类型 | 原因 |
|------|-------------------|------|
| `users` | **唯一索引** | 每个用户只有一条记录 |
| `plans` | **非唯一索引** | 一个用户可以有多个计划 |
| `meditations` | **非唯一索引** | 一个用户可以有多个冥想记录 |

**在微信开发者工具中设置**：
1. 打开云开发控制台
2. 进入"数据库" -> "集合管理"
3. 选择集合（如 `plans`）
4. 点击"索引管理"
5. 添加索引：
   - 字段名：`_openid`
   - 排序：升序
   - 索引属性：**非唯一**（对于 plans 和 meditations）或**唯一**（对于 users）

---

## 数据同步策略

### 12. 本地和云端数据同步

**策略**：
- 本地存储作为缓存
- 云端作为主数据源
- 云端失败不影响本地使用

**实现**：

```javascript
// utils/planStorage.js
import { savePlanToCloud } from './cloudStorage.js'

const savePlan = async (plan) => {
  // 1. 先保存到本地
  uni.setStorageSync(PLAN_STORAGE_KEY, plans)
  
  // 2. 异步保存到云端（不阻塞主流程）
  // #ifdef MP-WEIXIN
  if (user && user.openid) {
    savePlanToCloud(plan).catch(error => {
      console.warn('云端保存失败，但不影响本地使用:', error)
    })
  }
  // #endif
  
  return plan
}
```

**优势**：
- 离线可用
- 云端失败不影响用户体验
- 自动同步到云端

---

## 总结

### 常见错误代码速查表

| 错误代码 | 错误含义 | 解决方案 |
|---------|---------|---------|
| `-501000` | 云函数未找到 | 部署云函数到云端 |
| `-504002` | 云函数执行失败 | 检查代码，使用 `db.serverDate()` |
| `-604100` | API未找到 | 使用HTTP请求或检查权限 |
| `-404011` | 云开发环境未配置 | 检查环境ID配置 |

### 最佳实践

1. **云函数开发**：
   - 使用 `db.serverDate()` 而不是 `new Date()`
   - 添加完善的错误处理
   - 使用 `cloud.DYNAMIC_CURRENT_ENV` 自动选择环境

2. **数据同步**：
   - 本地优先，云端同步
   - 云端失败不影响本地使用
   - 异步保存到云端

3. **错误处理**：
   - 检测特定错误代码
   - 提供清晰的错误提示
   - 记录详细的日志

4. **部署流程**：
   - 先复制云函数到编译目录
   - 再部署到云端
   - 验证部署成功

### 推荐工具和资源

- **微信开发者工具**：云开发控制台
- **云函数复制脚本**：`npm run copy-cloudfunctions`
- **参考文档**：
  - [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
  - [微信小程序头像昵称填写能力](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html)

---

## 附录

### 相关文件

- `docs/数据库部署说明.md` - 数据库部署详细步骤
- `docs/云函数部署检查清单.md` - 云函数部署检查清单
- `docs/数据库表结构设计.md` - 数据库表结构设计文档
- `README-云函数复制脚本.md` - 云函数复制脚本使用说明

### 项目结构

```
wx-schedule-uniapp/
├── cloudfunctions/          # 云函数目录
│   ├── login/
│   ├── savePlan/
│   ├── getPlans/
│   └── ...
├── pages/                   # 页面目录
├── utils/                   # 工具函数
│   ├── cloudStorage.js      # 云存储工具
│   ├── planStorage.js       # 计划存储工具
│   └── userStorage.js       # 用户存储工具
├── scripts/                 # 脚本目录
│   └── copy-cloudfunctions.js
└── docs/                    # 文档目录
```

---

**最后更新**：2025年12月10日

**作者**：开发团队

**版本**：v1.0

---

希望这份踩坑记录能帮助到其他开发者！如果遇到新的问题，欢迎补充。


