# 内部论坛 - Windows 部署指南

## 📁 文件结构

```
forum-server/
├── 启动服务器.bat        ← 双击这个启动！
├── server.js             ← 后端服务
├── package.json          ← 依赖配置
├── public/
│   └── index.html        ← 前端页面
└── data/                 ← 数据目录（自动创建）
    ├── texts/            ← 文本数据文件夹
    │   ├── _system.json  ← 用户、用户组等系统数据
    │   └── {社区ID}/     ← 每个社区一个文件夹
    │       ├── _community.json  ← 社区信息
    │       └── {话题ID}.json    ← 每个话题一个文件
    └── attachments/      ← 附件文件夹
        └── {社区ID}_{话题ID}_{楼层ID}_{原文件名}
```

## 🚀 部署步骤

### 第一步：安装 Node.js

1. 访问 https://nodejs.org/
2. 下载 **LTS 版本**（左边绿色按钮）
3. 双击安装，一路点 Next 即可
4. 安装完成后重启电脑（推荐）

### 第二步：启动服务器

1. 双击 `启动服务器.bat`
2. 首次运行会自动安装依赖（需要几分钟）
3. 看到以下信息表示启动成功：

```
========================================
   内部论坛服务器已启动！
========================================

   本机访问: http://localhost:3000
   局域网访问: http://你的IP:3000

   数据目录: data/
     - texts/       文本数据
     - attachments/ 附件文件
```

### 第三步：访问论坛

- **本机访问**: 打开浏览器，输入 http://localhost:3000
- **其他电脑访问**: 输入 http://服务器IP:3000

## 🔧 配置说明

### 修改端口

编辑 `启动服务器.bat`，在 `node server.js` 前加一行：
```batch
set PORT=8080
```

### 开机自启动

1. 按 `Win + R`，输入 `shell:startup`，回车
2. 把 `启动服务器.bat` 的快捷方式放进去

### 防火墙设置

如果其他电脑无法访问，需要开放端口：

1. 打开 Windows Defender 防火墙
2. 高级设置 → 入站规则 → 新建规则
3. 选择"端口" → TCP → 特定端口：3000
4. 允许连接 → 全部勾选 → 命名保存

## 📊 数据说明

### 数据存储结构

| 位置 | 内容 |
|------|------|
| `data/texts/_system.json` | 用户账号、用户组、阅读记录等 |
| `data/texts/{社区ID}/` | 每个社区一个文件夹 |
| `data/texts/{社区ID}/_community.json` | 社区基本信息 |
| `data/texts/{社区ID}/{话题ID}.json` | 话题信息和所有楼层 |
| `data/attachments/` | 所有附件文件 |

### 附件命名规则

附件文件名格式：`{社区ID}_{话题ID}_{楼层ID}_{原文件名}`

例如：`abc123_xyz789_floor001_报告.pdf`

这样可以避免文件名冲突，同时方便查找附件归属。

### 备份数据

复制整个 `data` 文件夹即可完整备份：
```
data/
├── texts/       ← 所有文本数据
└── attachments/ ← 所有附件
```

### 恢复数据

1. 停止服务器
2. 用备份的 `data` 文件夹替换现有的
3. 重启服务器

## ❓ 常见问题

### Q: 双击 bat 文件闪退？

A: 右键 bat 文件 → 编辑，在最后加一行 `pause`，再运行查看错误信息

### Q: 提示"未检测到 Node.js"？

A: Node.js 未正确安装，重新安装后重启电脑

### Q: 其他电脑访问不了？

A: 检查：
1. 防火墙是否开放端口
2. 是否在同一局域网
3. 服务器 IP 是否正确（cmd 输入 `ipconfig` 查看）

### Q: 如何设置管理员（内部用户）？

A: 登录后点击"设为内部用户"按钮，或编辑 `data/texts/_system.json`

### Q: 如何查看某个话题的数据？

A: 打开 `data/texts/{社区ID}/{话题ID}.json`，里面包含：
- 话题基本信息
- 权限设置
- 公告内容
- 所有楼层（floors 数组）
- 附件列表

### Q: 如何找到某个附件？

A: 在 `data/attachments/` 文件夹中，按社区ID和话题ID搜索即可

## 💡 使用技巧

- 按 **F1** 可以快速切换账号
- 按 **Ctrl + Enter** 可以快速发送消息
- 右键列表项可以进行更多操作
- 附件点击即可下载

## 📋 数据结构示例

### _system.json
```json
{
  "users": {
    "admin": { "username": "admin", "password": "123456", "type": "internal" }
  },
  "userGroups": { ... },
  "userData": { ... },
  "readRecords": { ... }
}
```

### _community.json
```json
{
  "id": "abc123xyz",
  "name": "技术讨论",
  "createdBy": "admin",
  "createdAt": 1704067200000
}
```

### {话题ID}.json
```json
{
  "id": "topic123",
  "communityId": "abc123xyz",
  "name": "欢迎话题",
  "createdBy": "admin",
  "perm_read": "__all_users__",
  "perm_write": "__all_users__",
  "announcement": "",
  "floors": [
    { "id": "f1", "author": "系统", "content": "话题已创建", "isSystem": true }
  ],
  "attachments": []
}
```
