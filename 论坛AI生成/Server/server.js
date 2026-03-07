//region 【起手式】
const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const http = require('http');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
//endregion

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));
const PORT = process.env.PORT || 3000;//端口
const 数据文件夹 = path.join(__dirname, '..', 'data');
const 文本数据文件夹 = path.join(数据文件夹, 'texts');
const 附件数据文件夹 = path.join(数据文件夹, 'attachments');
const 用户数据文件 = path.join(文本数据文件夹, '_system.json');
确保文件夹存在(文本数据文件夹);
确保文件夹存在(附件数据文件夹);
let 用户数据 = 加载用户数据();

// region 【工具函数：文件读写】
// 系统数据（用户、用户组、用户设置）
function 加载用户数据() {
    try {
        if (fs.existsSync(用户数据文件)) {
            return JSON.parse(fs.readFileSync(用户数据文件, 'utf8'));
        }
    } catch (e) {
        console.error('读取系统数据失败:', e.message);
    }
    return { users: {}, userGroups: {}, userData: {}, readRecords: {} };
}
function 保存用户数据(data) {
    try {
        fs.writeFileSync(用户数据文件, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('保存系统数据失败:', e.message);
    }
}
// 社区数据
function 获取社区目录路径(communityId) { return path.join(文本数据文件夹, communityId); }
function 获取社区配置文件路径(communityId) { return path.join(获取社区目录路径(communityId), '_community.json'); }
function 加载社区配置(communityId) {
    try {
        const file = 获取社区配置文件路径(communityId);
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {
        console.error('读取社区数据失败:', e.message);
    }
    return null;
}
function 保存社区配置(community) {
    try {
        const dir = 获取社区目录路径(community.id);
        确保文件夹存在(dir);
        fs.writeFileSync(获取社区配置文件路径(community.id), JSON.stringify(community, null, 2), 'utf8');
    } catch (e) {
        console.error('保存社区数据失败:', e.message);
    }
}
function 加载所有社区配置() {
    const communities = {};
    try {
        const dirs = fs.readdirSync(文本数据文件夹, { withFileTypes: true });
        for (const dir of dirs) {
            if (dir.isDirectory()) {
                const community = 加载社区配置(dir.name);
                if (community) {
                    communities[community.id] = community;
                }
            }
        }
    } catch (e) {
        console.error('读取社区列表失败:', e.message);
    }
    return communities;
}
// 话题数据
function 获取话题文件路径(communityId, topicId) { return path.join(获取社区目录路径(communityId), `${topicId}.json`); }
function 加载话题数据(communityId, topicId) {
    try {
        const file = 获取话题文件路径(communityId, topicId);
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {
        console.error('读取话题数据失败:', e.message);
    }
    return null;
}
function 保存话题数据(topic) {
    try {
        const file = 获取话题文件路径(topic.communityId, topic.id);
        fs.writeFileSync(file, JSON.stringify(topic, null, 2), 'utf8');
    } catch (e) {
        console.error('保存话题数据失败:', e.message);
    }
}
function 加载话题列表数据(communityId) {
    const topics = [];
    try {
        const dir = 获取社区目录路径(communityId);
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.endsWith('.json') && file !== '_community.json') {
                    const topic = 加载话题数据(communityId, file.replace('.json', ''));
                    if (topic) {
                        topics.push(topic);
                    }
                }
            }
        }
    } catch (e) {
        console.error('读取话题列表失败:', e.message);
    }
    return topics;
}
// 附件处理
function 附件重命名(communityId, topicId, floorId, originalName) {
    const safeName = originalName.replace(/[<>:"/\\|?*]/g, '_');
    return `${communityId}_${topicId}_${floorId}_${safeName}`;
}
function 保存附件(communityId, topicId, floorId, originalName, base64Data) {
    try {
        const filename = 附件重命名(communityId, topicId, floorId, originalName);
        const filepath = path.join(附件数据文件夹, filename);
        const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Content, 'base64');
        fs.writeFileSync(filepath, buffer);
        return filename;
    } catch (e) {
        console.error('保存附件失败:', e.message);
        return null;
    }
}
function 获取附件路径(filename) { return path.join(附件数据文件夹, filename); }
//endregion

// region 【工具函数：广播、ID生成、用户权限租】
function 广播(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(message);
    });
}
// ID生成函数：从0开始递增
function 获取新社区ID() {
    if (!用户数据.nextCommunityId) {
        用户数据.nextCommunityId = 0;
    }
    const id = 用户数据.nextCommunityId;
    用户数据.nextCommunityId++;
    保存用户数据(用户数据);
    return id.toString();
}
function 获取社区的新话题ID(communityId) {
    const community = 加载社区配置(communityId);
    if (!community) {
        throw new Error('社区不存在');
    }
    if (community.nextTopicId === undefined) {
        // 初始化：检查现有话题数量，从0开始
        // const existingTopics = 加载话题列表数据(communityId);
        community.nextTopicId = 0;
    }
    const id = community.nextTopicId;
    community.nextTopicId++;
    保存社区配置(community);
    return id.toString();
}
function 获取话题的新楼层ID(communityId, topicId, topicObject) {
    // 如果提供了话题对象，直接使用；否则从文件加载
    const topic = topicObject || 加载话题数据(communityId, topicId);
    if (!topic) {
        throw new Error('话题不存在');
    }
    if (topic.nextFloorId === undefined) {
        // 初始化：检查现有楼层数量，从0开始
        // const existingFloors = (topic.floors || []).length;
        topic.nextFloorId = 0;
    }
    const id = topic.nextFloorId;
    topic.nextFloorId++;
    // 只有在从文件加载的情况下才需要保存（如果传入的是对象，调用者会负责保存）
    if (!topicObject) {
        保存话题数据(topic);
    }
    return id.toString();
}
// 用户组
function 解析用户组(permStr, currentUser) {
    if (!permStr) return [];
    const perms = permStr.split(',').map(s => s.trim()).filter(s => s);
    const users = new Set();

    function expand(items) {
        for (const item of items) {
            if (item === '__all_users__') {
                Object.keys(用户数据.users).forEach(u => users.add(u));
            } else if (item === '__all_internal__') {
                Object.values(用户数据.users).filter(u => u.type === 'internal').forEach(u => users.add(u.username));
            } else if (item === '__myself__') {
                if (currentUser) users.add(currentUser);
            } else if (item.startsWith('group:')) {
                const groupName = item.slice(6);
                const userGroups = 用户数据.userGroups[currentUser] || [];
                const group = userGroups.find(g => g.name === groupName);
                if (group) expand(group.members);
            } else {
                users.add(item);
            }
        }
    }
    expand(perms);
    return Array.from(users);
}
function 有权(topic, permType, username) {
    const permStr = topic[`perm_${permType}`] || '';
    return 解析用户组(permStr, username).includes(username);
}
function 未读消息数(username, type, id) {
    const records = 用户数据.readRecords[username] || {};
    if (type === 'topic') {
        const lastRead = records[id] || 0;
        const communities = 加载所有社区配置();
        for (const community of Object.values(communities)) {
            const topic = 加载话题数据(community.id, id);
            if (topic) return (topic.floors || []).filter(f => f.createdAt > lastRead).length;
        }
        return 0;
    } else if (type === 'community') {
        const topics = 加载话题列表数据(id);
        return topics.reduce((sum, topic) => {
            const lastRead = records[topic.id] || 0;
            return sum + (topic.floors || []).filter(f => f.createdAt > lastRead).length;
        }, 0);
    }
    return 0;
}
//endregion

// region 【机制：自动保存、连线离线】
setInterval(() => 保存用户数据(用户数据), 30000);
process.on('SIGINT', () => { //手动结束
    保存用户数据(用户数据);
    process.exit();
});
process.on('SIGTERM', () => { //系统杀死
    保存用户数据(用户数据);
    process.exit();
});
wss.on('connection', (ws) => { //连接时记录，登录时记录
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'auth' && data.username) ws.username = data.username;
        } catch (e) { }
    });
});
setInterval(() => { //心跳检测
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);
//endregion

//region 【API】
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '请输入账号和密码' });
    if (用户数据.users[username]) return res.status(400).json({ error: '账号已存在' });

    用户数据.users[username] = { username, password, type: 'external', createdAt: Date.now() };
    用户数据.userData[username] = { followedCommunities: [], blockedCommunities: [], pinnedCommunities: [], blockedTopics: [], pinnedTopics: [], notes: {} };
    用户数据.userGroups[username] = [];
    用户数据.readRecords[username] = {};
    保存用户数据(用户数据);
    res.json({ success: true });
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '请输入账号和密码' });
    const user = 用户数据.users[username];
    if (!user || user.password !== password) return res.status(401).json({ error: '账号或密码错误' });
    res.json({ success: true, user: { username: user.username, type: user.type, createdAt: user.createdAt } });
});
app.post('/api/user/set-internal', (req, res) => {
    const { username } = req.body;
    if (用户数据.users[username]) {
        用户数据.users[username].type = 'internal';
        保存用户数据(用户数据);
    }
    res.json({ success: true });
});
app.get('/api/communities', (req, res) => {
    const { username } = req.query;
    const userData = 用户数据.userData[username] || {};
    const followed = userData.followedCommunities || [];
    if (followed.length === 0) return res.json({ communities: [], total: 0 });

    const pinned = userData.pinnedCommunities || [];
    const blocked = userData.blockedCommunities || [];

    let communities = followed.map(id => 加载社区配置(id)).filter(c => c).map(c => ({
        ...c,
        isPinned: pinned.includes(c.id),
        isBlocked: blocked.includes(c.id),
        unread: 未读消息数(username, 'community', c.id)
    }));

    communities.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt - a.createdAt;
    });

    res.json({ communities, total: communities.length });
});
app.post('/api/communities/enter', (req, res) => {
    const { username, communityName } = req.body;
    const user = 用户数据.users[username];
    if (!user) return res.status(401).json({ error: '用户不存在' });
    let community = Object.values(加载所有社区配置()).find(c => c.name === communityName);
    if (!community) {
        if (user.type !== 'internal') return res.status(403).json({ error: '社区不存在（只有内部用户可创建新社区）' });
        const communityId = 获取新社区ID();
        community = { id: communityId, name: communityName, createdBy: username, createdAt: Date.now(), nextTopicId: 0 };
        保存社区配置(community);
        const topicId = 获取社区的新话题ID(communityId);
        const topic = {
            id: topicId, communityId, name: '欢迎话题', createdBy: username, createdAt: Date.now(),
            perm_read: '__all_users__', perm_write: '__all_users__', perm_announcement: username, perm_meta: username,
            announcement: '',
            floors: [],
            attachments: [],
            nextFloorId: 0
        };
        const floorId = 获取话题的新楼层ID(communityId, topicId, topic);
        topic.floors.push({ id: floorId, author: '系统', content: `话题由 ${username} 创建\n话题名称：${topic.name}`, isSystem: true, createdAt: Date.now() });
        保存话题数据(topic);
        广播({ type: 'new_community', community });
    }
    if (!用户数据.userData[username]) {
        用户数据.userData[username] = { followedCommunities: [], blockedCommunities: [], pinnedCommunities: [], blockedTopics: [], pinnedTopics: [], notes: {} };
    }
    if (!用户数据.userData[username].followedCommunities.includes(community.id)) {
        用户数据.userData[username].followedCommunities.push(community.id);
        保存用户数据(用户数据);
    }
    res.json({ success: true, community });
});
app.post('/api/communities/:id/action', (req, res) => {
    const { id } = req.params;
    const { username, action } = req.body;

    if (!用户数据.userData[username]) {
        用户数据.userData[username] = { followedCommunities: [], blockedCommunities: [], pinnedCommunities: [], blockedTopics: [], pinnedTopics: [], notes: {} };
    }
    const userData = 用户数据.userData[username];

    if (action === 'unfollow') userData.followedCommunities = userData.followedCommunities.filter(cid => cid !== id);
    else if (action === 'toggle_block') {
        const idx = userData.blockedCommunities.indexOf(id);
        if (idx >= 0) userData.blockedCommunities.splice(idx, 1);
        else userData.blockedCommunities.push(id);
    } else if (action === 'toggle_pin') {
        const idx = userData.pinnedCommunities.indexOf(id);
        if (idx >= 0) userData.pinnedCommunities.splice(idx, 1);
        else userData.pinnedCommunities.push(id);
    }
    保存用户数据(用户数据);
    res.json({ success: true });
});
app.get('/api/topics', (req, res) => {
    const { username, communityId } = req.query;
    const userData = 用户数据.userData[username] || {};

    let topics = 加载话题列表数据(communityId).filter(t => 有权(t, 'read', username));

    const pinned = userData.pinnedTopics || [];
    const blockedTopics = userData.blockedTopics || [];
    const communityBlocked = (userData.blockedCommunities || []).includes(communityId);

    topics = topics.map(t => ({
        id: t.id, communityId: t.communityId, name: t.name, createdBy: t.createdBy, createdAt: t.createdAt,
        isPinned: pinned.includes(t.id),
        isBlocked: communityBlocked || blockedTopics.includes(t.id),
        unread: 未读消息数(username, 'topic', t.id)
    }));

    topics.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt - a.createdAt;
    });
    res.json({ topics, total: topics.length });
});
app.post('/api/topics', (req, res) => {
    const { username, communityId, name } = req.body;
    const topicId = 获取社区的新话题ID(communityId);
    const now = Date.now();

    const topic = {
        id: topicId, communityId, name, createdBy: username, createdAt: now,
        perm_read: '__all_users__', perm_write: '__all_users__', perm_announcement: username, perm_meta: username,
        announcement: '',
        floors: [],
        attachments: [],
        nextFloorId: 0
    };
    const floorId = 获取话题的新楼层ID(communityId, topicId, topic);
    topic.floors.push({ id: floorId, author: '系统', content: `话题由 ${username} 创建\n话题名称：${name}`, isSystem: true, createdAt: now });
    保存话题数据(topic);
    广播({ type: 'new_topic', topic: { id: topicId, communityId, name, createdBy: username, createdAt: now } });
    res.json({ success: true, topic: { id: topicId, communityId, name, createdBy: username, createdAt: now } });
});
app.get('/api/topics/:id', (req, res) => {
    const { id } = req.params;
    const { username, communityId } = req.query;

    const topic = 加载话题数据(communityId, id);
    if (!topic) return res.status(404).json({ error: '话题不存在' });
    if (!有权(topic, 'read', username)) return res.status(403).json({ error: '没有阅读权限' });

    const note = (用户数据.userData[username]?.notes || {})[id] || '';

    res.json({
        topic: {
            id: topic.id, communityId: topic.communityId, name: topic.name, createdBy: topic.createdBy, createdAt: topic.createdAt,
            perm_read: topic.perm_read, perm_write: topic.perm_write, perm_announcement: topic.perm_announcement, perm_meta: topic.perm_meta,
            announcement: topic.announcement,
            canWrite: 有权(topic, 'write', username),
            canEditAnnouncement: 有权(topic, 'announcement', username),
            canEditMeta: 有权(topic, 'meta', username)
        },
        note,
        attachments: (topic.attachments || []).map(a => ({ id: a.id, filename: a.filename, originalName: a.originalName, size: a.size, uploadedBy: a.uploadedBy, uploadedAt: a.uploadedAt }))
    });
});
app.post('/api/topics/:id/action', (req, res) => {
    const { id } = req.params;
    const { username, communityId, action, data } = req.body;

    if (!用户数据.userData[username]) {
        用户数据.userData[username] = { followedCommunities: [], blockedCommunities: [], pinnedCommunities: [], blockedTopics: [], pinnedTopics: [], notes: {} };
    }
    const userData = 用户数据.userData[username];
    const topic = 加载话题数据(communityId, id);

    if (action === 'toggle_block') {
        const idx = userData.blockedTopics.indexOf(id);
        if (idx >= 0) userData.blockedTopics.splice(idx, 1);
        else userData.blockedTopics.push(id);
        保存用户数据(用户数据);
    } else if (action === 'toggle_pin') {
        const idx = userData.pinnedTopics.indexOf(id);
        if (idx >= 0) userData.pinnedTopics.splice(idx, 1);
        else userData.pinnedTopics.push(id);
        保存用户数据(用户数据);
    } else if (action === 'rename' && topic) {
        const oldName = topic.name;
        topic.name = data.name;
        const floorId = 获取话题的新楼层ID(communityId, id);
        topic.floors.push({ id: floorId, author: '系统', content: `${username} 重命名了话题\n旧名称：${oldName}\n新名称：${data.name}`, isSystem: true, createdAt: Date.now() });
        保存话题数据(topic);
        广播({ type: 'new_floor', topicId: id });
    } else if (action === 'update_permissions' && topic) {
        if (!有权(topic, 'meta', username)) return res.status(403).json({ error: '没有修改权限的权限' });
        topic.perm_read = data.read;
        topic.perm_write = data.write;
        topic.perm_announcement = data.announcement;
        topic.perm_meta = data.meta;
        const floorId = 获取话题的新楼层ID(communityId, id);
        topic.floors.push({ id: floorId, author: '系统', content: `${username} 修改了权限设置\n阅读权限：${data.read || '未设置'}\n发言权限：${data.write || '未设置'}\n公告权限：${data.announcement || '未设置'}\n元权限：${data.meta || '未设置'}`, isSystem: true, createdAt: Date.now() });
        保存话题数据(topic);
        广播({ type: 'new_floor', topicId: id });
    } else if (action === 'update_announcement' && topic) {
        if (!有权(topic, 'announcement', username)) return res.status(403).json({ error: '没有编辑公告的权限' });
        topic.announcement = data.announcement;
        const floorId = 获取话题的新楼层ID(communityId, id);
        topic.floors.push({ id: floorId, author: '系统', content: `${username} 更新了公告\n\n${data.announcement || '（公告已清空）'}`, isSystem: true, createdAt: Date.now() });
        保存话题数据(topic);
        广播({ type: 'new_floor', topicId: id });
    }
    res.json({ success: true });
});
app.get('/api/floors', (req, res) => {
    const { topicId, communityId } = req.query;
    const topic = 加载话题数据(communityId, topicId);
    if (!topic) return res.status(404).json({ error: '话题不存在' });
    res.json({ floors: topic.floors || [], total: (topic.floors || []).length });
});
app.post('/api/floors', (req, res) => {
    const { username, topicId, communityId, content } = req.body;
    const topic = 加载话题数据(communityId, topicId);
    if (!topic) return res.status(404).json({ error: '话题不存在' });
    if (!有权(topic, 'write', username)) return res.status(403).json({ error: '没有发言权限' });

    const floorId = 获取话题的新楼层ID(communityId, topicId);
    const floor = { id: floorId, author: username, content, isSystem: false, createdAt: Date.now() };
    topic.floors.push(floor);
    保存话题数据(topic);
    广播({ type: 'new_floor', topicId, floor });
    res.json({ success: true, floor });
});
app.post('/api/notes', (req, res) => {
    const { username, topicId, content } = req.body;
    if (!用户数据.userData[username]) {
        用户数据.userData[username] = { followedCommunities: [], blockedCommunities: [], pinnedCommunities: [], blockedTopics: [], pinnedTopics: [], notes: {} };
    }
    if (!用户数据.userData[username].notes) 用户数据.userData[username].notes = {};
    用户数据.userData[username].notes[topicId] = content;
    保存用户数据(用户数据);
    res.json({ success: true });
});
app.post('/api/attachments', (req, res) => {
    const { username, topicId, communityId, name, size, data } = req.body;
    const topic = 加载话题数据(communityId, topicId);
    if (!topic) return res.status(404).json({ error: '话题不存在' });

    const floorId = 获取话题的新楼层ID(communityId, topicId);
    const savedFilename = 保存附件(communityId, topicId, floorId, name, data);
    if (!savedFilename) return res.status(500).json({ error: '附件保存失败' });

    if (!topic.attachments) topic.attachments = [];
    topic.attachments.push({ id: floorId, filename: savedFilename, originalName: name, size, uploadedBy: username, uploadedAt: Date.now() });
    topic.floors.push({ id: floorId, author: '系统', content: `${username} 上传了附件: ${name}`, isSystem: true, createdAt: Date.now() });
    保存话题数据(topic);
    广播({ type: 'new_floor', topicId });
    res.json({ success: true });
});
app.get('/api/attachments/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = 获取附件路径(filename);
    if (!fs.existsSync(filepath)) return res.status(404).json({ error: '附件不存在' });
    const parts = filename.split('_');
    const originalName = parts.slice(3).join('_');
    res.download(filepath, originalName);
});
app.post('/api/read', (req, res) => {
    const { username, topicId } = req.body;
    if (!用户数据.readRecords[username]) 用户数据.readRecords[username] = {};
    用户数据.readRecords[username][topicId] = Date.now();
    保存用户数据(用户数据);
    res.json({ success: true });
});
app.get('/api/groups', (req, res) => {
    const { username } = req.query;
    res.json({ groups: 用户数据.userGroups[username] || [] });
});
app.post('/api/groups', (req, res) => {
    const { username, name } = req.body;
    if (!用户数据.userGroups[username]) 用户数据.userGroups[username] = [];
    if (用户数据.userGroups[username].find(g => g.name === name)) return res.status(400).json({ error: '组名已存在' });
    用户数据.userGroups[username].push({ id: generateId(), name, members: [] });
    保存用户数据(用户数据);
    res.json({ success: true });
});
app.put('/api/groups/:id', (req, res) => {
    const { id } = req.params;
    const { username, name, members } = req.body;
    const groups = 用户数据.userGroups[username] || [];
    const group = groups.find(g => g.id === id);
    if (group) { group.name = name; group.members = members; 保存用户数据(用户数据); }
    res.json({ success: true });
});
app.delete('/api/groups/:id', (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    if (用户数据.userGroups[username]) {
        const group = 用户数据.userGroups[username].find(g => g.id === id);
        if (group) {
            const groupRef = `group:${group.name}`;
            用户数据.userGroups[username].forEach(g => { g.members = g.members.filter(m => m !== groupRef); });
            用户数据.userGroups[username] = 用户数据.userGroups[username].filter(g => g.id !== id);
            保存用户数据(用户数据);
        }
    }
    res.json({ success: true });
});
app.get('/api/search', (req, res) => {
    const { username, query } = req.query;
    const q = query.toLowerCase();
    const allCommunities = 加载所有社区配置();

    const communities = Object.values(allCommunities).filter(c => c.name.toLowerCase().includes(q));
    const topics = [];
    const floors = [];

    for (const community of Object.values(allCommunities)) {
        for (const topic of 加载话题列表数据(community.id)) {
            if (!有权(topic, 'read', username)) continue;
            if (topic.name.toLowerCase().includes(q)) topics.push({ id: topic.id, communityId: topic.communityId, name: topic.name });
            for (const floor of (topic.floors || [])) {
                if (floor.content.toLowerCase().includes(q)) {
                    floors.push({ topicId: topic.id, communityId: topic.communityId, content: floor.content });
                    if (floors.length >= 50) break;
                }
            }
            if (floors.length >= 50) break;
        }
        if (floors.length >= 50) break;
    }
    res.json({ communities, topics, floors });
});
//endregion

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('========================================');
    console.log('   内部论坛服务器已启动！');
    console.log('========================================');
    console.log('');
    console.log(`   本机访问: http://localhost:${PORT}`);
    console.log(`   局域网访问: http://你的IP:${PORT}`);
    console.log('');
    console.log('   数据目录: data/');
    console.log('     - texts/       文本数据');
    console.log('     - attachments/ 附件文件');
    console.log('');
    console.log('   按 Ctrl+C 停止服务器');
    console.log('');
});

//工具函数
function 确保文件夹存在(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}