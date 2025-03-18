/**
 * 修复版公司智慧集编辑器
 * 
 * 主要功能：
 * 1. 简化的卡片内容编辑
 * 2. 创建新卡片和新栏目
 * 3. 栏目内拖动排序卡片
 * 4. 栏目可以添加已有卡片
 * 5. 支持导出修改后的HTML
 */

// 在页面加载完成后初始化编辑功能
document.addEventListener('DOMContentLoaded', function() {
    // 首先加载Sortable.js
    loadSortableJS();
});

// 全局卡片库
let cardLibrary = [];

function initEditor() {
    console.log('初始化编辑器...');
    
    // 初始化全局卡片库
    initCardLibrary();
    
    // 添加编辑模式控制面板
    addEditorControls();
    
    // 为每个卡片添加编辑和删除按钮
    addCardButtons();
    
    // 为每个栏目添加管理功能
    addSectionControls();
    
    // 为页面添加"添加栏目"按钮
    addNewSectionButton();
    
    // 初始化栏目内排序功能
    initSectionSorting();
}

function initCardLibrary() {
    console.log('初始化卡片库...');
    cardLibrary = [];
    // 收集所有卡片到全局库中
    document.querySelectorAll('.card').forEach((card, index) => {
        const header = card.querySelector('.card-header').textContent;
        const content = card.querySelector('.card-content').innerHTML;
        
        // 为每张卡片生成唯一ID
        const cardId = 'card_' + Date.now() + '_' + index;
        card.setAttribute('data-card-id', cardId);
        
        cardLibrary.push({
            id: cardId,
            header: header,
            content: content,
            section: card.closest('.category').querySelector('.category-title').textContent
        });
    });
    console.log('卡片库初始化完成，共收集', cardLibrary.length, '张卡片');
}

function addEditorControls() {
    console.log('添加编辑控制面板...');
    const header = document.querySelector('header');
    
    // 移除已存在的控制面板
    const existingPanel = document.querySelector('.editor-controls');
    if (existingPanel) existingPanel.remove();
    
    const controlPanel = document.createElement('div');
    controlPanel.className = 'editor-controls';
    controlPanel.innerHTML = `
        <style>
            .editor-controls {
                background-color: #f0f0f0;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            .editor-btn {
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 8px 16px;
                margin: 0 5px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
                font-size: 14px;
            }
            .editor-btn:hover {
                background-color: var(--secondary-color);
            }
            .editor-btn.export {
                background-color: #27ae60;
            }
            .editor-btn.export:hover {
                background-color: #219653;
            }
            .editor-btn.create {
                background-color: #3498db;
            }
            .editor-btn.create:hover {
                background-color: #2980b9;
            }
            .editor-mode {
                font-weight: bold;
                margin-right: 10px;
            }
            .card-edit-btn, .card-delete-btn, .section-delete-btn, .section-manage-btn {
                position: absolute;
                background-color: var(--primary-color);
                color: white;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .card-edit-btn {
                right: 40px;
                top: 5px;
            }
            .card-delete-btn {
                right: 5px;
                top: 5px;
            }
            .section-delete-btn {
                right: 5px;
                top: 5px;
            }
            .section-manage-btn {
                right: 40px;
                top: 5px;
            }
            .card:hover .card-edit-btn, .card:hover .card-delete-btn, 
            .category:hover .section-delete-btn, .category:hover .section-manage-btn {
                opacity: 1;
            }
            .add-section-btn {
                display: block;
                background-color: #e0e0e0;
                color: #666;
                text-align: center;
                padding: 15px;
                margin: 15px auto;
                border-radius: 8px;
                cursor: pointer;
                border: 2px dashed #ccc;
                width: 80%;
                max-width: 300px;
                transition: all 0.3s;
            }
            .add-section-btn:hover {
                background-color: #d0d0d0;
                color: #333;
            }
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
            }
            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 20px;
                border-radius: 8px;
                width: 80%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .modal-title {
                font-size: 18px;
                font-weight: bold;
                color: var(--primary-color);
            }
            .modal-close {
                font-size: 24px;
                cursor: pointer;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .form-control {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
            }
            .rich-editor {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
                min-height: 200px;
                margin-bottom: 15px;
                overflow: auto;
            }
            .editor-toolbar {
                margin-bottom: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .editor-toolbar button {
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
            }
            .editor-toolbar button:hover {
                background-color: #e0e0e0;
            }
            .form-actions {
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
                gap: 10px;
            }
            .card-library {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .library-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 10px;
                position: relative;
            }
            .library-card-header {
                font-weight: bold;
                margin-bottom: 5px;
                padding-right: 25px;
            }
            .library-card-content {
                font-size: 12px;
                color: #666;
                max-height: 100px;
                overflow: hidden;
            }
            .library-card-check {
                position: absolute;
                top: 10px;
                right: 10px;
                transform: scale(1.5);
            }
            /* 鼠标样式-排序用 */
            .sortable-drag {
                opacity: 0.8;
                background-color: #f0f8ff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .sortable-ghost {
                background-color: #f0f0f0;
                border: 2px dashed #aaa;
            }
            /* 禁用原有的卡片折叠功能 */
            .card-header {
                cursor: move !important;
            }
            /* 防止标题被拖动文本覆盖 */
            .category-title {
                position: relative;
                z-index: 5;
            }
        </style>
        <div>
            <span class="editor-mode">编辑模式</span>
            <button class="editor-btn create" id="createCardBtn">创建新卡片</button>
            <button class="editor-btn create" id="createSectionBtn">创建新栏目</button>
        </div>
        <div>
            <button class="editor-btn export" id="exportBtn">导出HTML</button>
        </div>
    `;
    header.insertAdjacentElement('afterend', controlPanel);
    
    // 添加导出功能
    document.getElementById('exportBtn').addEventListener('click', exportHTML);
    
    // 添加创建新卡片功能
    document.getElementById('createCardBtn').addEventListener('click', function() {
        openCardEditor();
    });
    
    // 添加创建新栏目功能
    document.getElementById('createSectionBtn').addEventListener('click', function() {
        openSectionEditor();
    });
    
    console.log('编辑控制面板添加完成');
}

function initSectionSorting() {
    console.log('初始化栏目内排序功能...');
    // 检查Sortable是否已加载
    if (typeof Sortable === 'undefined') {
        console.error('Sortable库未加载，无法初始化排序功能');
        return;
    }

    // 为每个栏目的卡片容器添加排序功能
    document.querySelectorAll('.cards').forEach(container => {
        try {
            new Sortable(container, {
                animation: 150,
                handle: '.card-header', // 只能通过卡片标题拖动
                ghostClass: 'sortable-ghost',
                dragClass: 'sortable-drag',
                onEnd: function(evt) {
                    console.log('卡片重新排序完成');
                }
            });
            console.log('栏目排序功能初始化成功');
        } catch(e) {
            console.error('初始化排序功能失败:', e);
        }
    });
}

function addCardButtons() {
    console.log('添加卡片按钮...');
    document.querySelectorAll('.card').forEach(card => {
        // 移除已存在的按钮
        const existingEditBtn = card.querySelector('.card-edit-btn');
        if (existingEditBtn) existingEditBtn.remove();
        
        const existingDeleteBtn = card.querySelector('.card-delete-btn');
        if (existingDeleteBtn) existingDeleteBtn.remove();
        
        // 添加编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'card-edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = '编辑卡片';
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            openCardEditor(card);
        });
        card.appendChild(editBtn);
        
        // 添加删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'card-delete-btn';
        deleteBtn.innerHTML = '❌';
        deleteBtn.title = '删除卡片';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            if (confirm('确定要删除这张卡片吗？')) {
                // 从库中也删除此卡片
                const cardId = card.getAttribute('data-card-id');
                cardLibrary = cardLibrary.filter(item => item.id !== cardId);
                card.remove();
            }
        });
        card.appendChild(deleteBtn);
    });
}

function addSectionControls() {
    console.log('添加栏目控制按钮...');
    document.querySelectorAll('.category').forEach(section => {
        // 移除已存在的按钮
        const existingDeleteBtn = section.querySelector('.section-delete-btn');
        if (existingDeleteBtn) existingDeleteBtn.remove();
        
        const existingManageBtn = section.querySelector('.section-manage-btn');
        if (existingManageBtn) existingManageBtn.remove();
        
        // 添加管理按钮
        const manageBtn = document.createElement('button');
        manageBtn.className = 'section-manage-btn';
        manageBtn.innerHTML = '📋';
        manageBtn.title = '管理栏目卡片';
        manageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openSectionManager(section);
        });
        section.appendChild(manageBtn);
        
        // 添加删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'section-delete-btn';
        deleteBtn.innerHTML = '❌';
        deleteBtn.title = '删除栏目';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('确定要删除这个栏目及其所有卡片吗？')) {
                section.remove();
            }
        });
        section.appendChild(deleteBtn);
    });
}

function addNewSectionButton() {
    console.log('添加新栏目按钮...');
    // 避免重复添加
    const existingBtn = document.querySelector('.add-section-btn');
    if (existingBtn) existingBtn.remove();
    
    const container = document.querySelector('.container');
    const footer = document.querySelector('footer');
    
    const addBtn = document.createElement('div');
    addBtn.className = 'add-section-btn';
    addBtn.textContent = '+ 添加新栏目';
    addBtn.addEventListener('click', openSectionEditor);
    
    container.insertBefore(addBtn, footer);
}

function openCardEditor(card = null) {
    console.log('打开卡片编辑器...', card ? '编辑已有卡片' : '创建新卡片');
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // 卡片标题和内容
    let cardTitle = '';
    let cardContent = '';
    let cardId = '';
    let currentSection = '';
    
    if (card) {
        cardTitle = card.querySelector('.card-header').textContent;
        cardContent = card.querySelector('.card-content').innerHTML;
        cardId = card.getAttribute('data-card-id');
        // 获取卡片当前所在栏目
        currentSection = card.closest('.category').querySelector('.category-title').textContent;
    } else {
        cardId = 'card_' + Date.now() + '_new';
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">${card ? '编辑卡片' : '创建新卡片'}</div>
                <span class="modal-close">&times;</span>
            </div>
            <div class="form-group">
                <label for="cardTitle">卡片标题</label>
                <input type="text" id="cardTitle" class="form-control" value="${cardTitle}" placeholder="输入卡片标题">
            </div>
            <div class="form-group">
                <label for="cardContentEditor">卡片内容</label>
                <div class="editor-toolbar">
                    <button type="button" data-format="p">段落</button>
                    <button type="button" data-format="bold">粗体</button>
                    <button type="button" data-format="italic">斜体</button>
                    <button type="button" data-format="insertUnorderedList">项目符号</button>
                    <button type="button" data-format="insertOrderedList">编号列表</button>
                    <button type="button" data-format="indent">增加缩进</button>
                    <button type="button" data-format="outdent">减少缩进</button>
                </div>
                <div id="cardContentEditor" class="rich-editor" contenteditable="true">${cardContent}</div>
            </div>
            <div class="form-group">
                <label for="sectionSelect">选择栏目</label>
                <select id="sectionSelect" class="form-control">
                    ${generateSectionOptions(currentSection)}
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="editor-btn" id="cancelEdit">取消</button>
                <button type="button" class="editor-btn" id="saveCard">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // 初始化简易富文本编辑器功能
    initRichEditor();
    
    // 关闭模态框
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    document.getElementById('cancelEdit').addEventListener('click', () => modal.remove());
    
    // 保存卡片
    document.getElementById('saveCard').addEventListener('click', function() {
        const title = document.getElementById('cardTitle').value;
        const content = document.getElementById('cardContentEditor').innerHTML;
        const selectedSection = document.getElementById('sectionSelect').value;
        
        if (!title.trim()) {
            alert('卡片标题不能为空');
            return;
        }
        
        // 获取目标栏目
        const targetSection = findSectionByTitle(selectedSection);
        if (!targetSection) {
            alert('找不到选择的栏目');
            return;
        }
        
        if (card) {
            // 更新现有卡片
            card.querySelector('.card-header').textContent = title;
            card.querySelector('.card-content').innerHTML = content;
            
            // 更新卡片库
            const existingCard = cardLibrary.find(item => item.id === cardId);
            if (existingCard) {
                existingCard.header = title;
                existingCard.content = content;
            }
            
            // 如果栏目变更，则移动卡片
            const currentSection = card.closest('.category');
            if (currentSection !== targetSection) {
                const targetCards = targetSection.querySelector('.cards');
                currentSection.querySelector('.cards').removeChild(card);
                targetCards.appendChild(card);
            }
        } else {
            // 创建新卡片
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.setAttribute('data-card-id', cardId);
            newCard.innerHTML = `
                <div class="card-header">${title}</div>
                <div class="card-content">${content}</div>
            `;
            
            // 添加到选定的栏目
            const targetCards = targetSection.querySelector('.cards');
            targetCards.appendChild(newCard);
            
            // 添加到卡片库
            cardLibrary.push({
                id: cardId,
                header: title,
                content: content,
                section: selectedSection
            });
        }
        
        // 重新应用编辑按钮
        addCardButtons();
        
        modal.remove();
        console.log('卡片保存成功');
    });
}

function openSectionEditor() {
    console.log('打开栏目编辑器...');
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">添加新栏目</div>
                <span class="modal-close">&times;</span>
            </div>
            <div class="form-group">
                <label for="sectionTitle">栏目标题</label>
                <input type="text" id="sectionTitle" class="form-control" placeholder="输入栏目标题">
            </div>
            <div class="form-actions">
                <button type="button" class="editor-btn" id="cancelSection">取消</button>
                <button type="button" class="editor-btn" id="saveSection">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 关闭模态框
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    document.getElementById('cancelSection').addEventListener('click', () => modal.remove());
    
    // 保存栏目
    document.getElementById('saveSection').addEventListener('click', function() {
        const title = document.getElementById('sectionTitle').value;
        
        if (!title.trim()) {
            alert('栏目标题不能为空');
            return;
        }
        
        // 创建新栏目
        const newSection = document.createElement('section');
        newSection.className = 'category';
        newSection.innerHTML = `
            <h2 class="category-title">${title}</h2>
            <div class="cards">
                <!-- 卡片将在这里 -->
            </div>
        `;
        
        // 添加到文档中
        const container = document.querySelector('.container');
        const footer = document.querySelector('footer');
        const addSectionBtn = document.querySelector('.add-section-btn');
        
        container.insertBefore(newSection, addSectionBtn || footer);
        
        // 更新栏目排序和控制按钮
        addSectionControls();
        initSectionSorting();
        
        modal.remove();
        console.log('栏目创建成功');
    });
}

function openSectionManager(section) {
    console.log('打开栏目管理器...');
    const sectionTitle = section.querySelector('.category-title').textContent;
    const sectionCards = Array.from(section.querySelectorAll('.card')).map(card => 
        card.getAttribute('data-card-id')
    );
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">管理"${sectionTitle}"栏目卡片</div>
                <span class="modal-close">&times;</span>
            </div>
            <p>选择要添加到此栏目的卡片：</p>
            <div class="card-library">
                ${generateCardLibrary(sectionCards)}
            </div>
            <div class="form-actions">
                <button type="button" class="editor-btn" id="cancelManager">取消</button>
                <button type="button" class="editor-btn" id="saveManager">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 关闭模态框
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    document.getElementById('cancelManager').addEventListener('click', () => modal.remove());
    
    // 保存卡片选择
    document.getElementById('saveManager').addEventListener('click', function() {
        const selectedCards = Array.from(document.querySelectorAll('.library-card-check:checked'))
            .map(checkbox => checkbox.value);
        
        // 清空当前栏目中的所有卡片
        const cardsContainer = section.querySelector('.cards');
        cardsContainer.innerHTML = '';
        
        // 添加所有选中的卡片
        selectedCards.forEach(cardId => {
            const cardData = cardLibrary.find(item => item.id === cardId);
            if (cardData) {
                const newCard = document.createElement('div');
                newCard.className = 'card';
                newCard.setAttribute('data-card-id', cardId);
                newCard.innerHTML = `
                    <div class="card-header">${cardData.header}</div>
                    <div class="card-content">${cardData.content}</div>
                `;
                cardsContainer.appendChild(newCard);
            }
        });
        
        // 重新应用编辑按钮和排序功能
        addCardButtons();
        initSectionSorting();
        
        modal.remove();
        console.log('栏目卡片管理保存成功');
    });
}

function initRichEditor() {
    console.log('初始化富文本编辑器...');
    // 简易富文本编辑器功能
    document.querySelectorAll('.editor-toolbar button').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-format');
            
            if (command === 'p') {
                // 添加一个段落
                document.execCommand('formatBlock', false, 'p');
            } else {
                // 执行其他命令
                document.execCommand(command, false, null);
            }
            
            // 聚焦回编辑器
            document.getElementById('cardContentEditor').focus();
        });
    });
}

/**
 * 生成栏目选项，并将当前栏目设为选中状态
 * @param {string} currentSection - 当前卡片所在栏目名称
 * @returns {string} - 栏目选项HTML
 */
function generateSectionOptions(currentSection = '') {
    // 生成所有栏目的下拉选项
    const sections = Array.from(document.querySelectorAll('.category-title'))
        .map(title => title.textContent);
    
    return sections.map(section => 
        `<option value="${section}" ${section === currentSection ? 'selected' : ''}>${section}</option>`
    ).join('');
}

function generateCardLibrary(sectionCards = []) {
    console.log('生成卡片库...');
    // 检查卡片库是否为空
    if (cardLibrary.length === 0) {
        return '<p>卡片库为空，请先创建卡片</p>';
    }
    
    // 生成卡片库HTML
    return cardLibrary.map(card => `
        <div class="library-card">
            <input type="checkbox" class="library-card-check" value="${card.id}" ${sectionCards.includes(card.id) ? 'checked' : ''}>
            <div class="library-card-header">${card.header}</div>
            <div class="library-card-content">${stripHtml(card.content).substring(0, 100)}${stripHtml(card.content).length > 100 ? '...' : ''}</div>
        </div>
    `).join('');
}

function stripHtml(html) {
    // 去除HTML标签，只保留文本
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

function findSectionByTitle(title) {
    // 查找标题匹配的栏目元素
    const sectionTitles = document.querySelectorAll('.category-title');
    for (let i = 0; i < sectionTitles.length; i++) {
        if (sectionTitles[i].textContent === title) {
            return sectionTitles[i].closest('.category');
        }
    }
    return null;
}

function exportHTML() {
    console.log('导出HTML...');
    // 移除所有编辑按钮和控件
    const elementsToRemove = [
        '.card-edit-btn', 
        '.card-delete-btn', 
        '.section-delete-btn', 
        '.section-manage-btn', 
        '.add-section-btn', 
        '.editor-controls'
    ];
    
    // 创建一个克隆，以便不影响当前页面
    const cloneDoc = document.documentElement.cloneNode(true);
    
    // 在克隆中删除所有编辑控件
    elementsToRemove.forEach(selector => {
        cloneDoc.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // 移除卡片的拖拽属性
    cloneDoc.querySelectorAll('.card').forEach(card => {
        card.removeAttribute('draggable');
        card.removeAttribute('data-card-id');
    });
    
// 获取修改后的HTML
const exportedHTML = '<!DOCTYPE html>\n' + cloneDoc.outerHTML;
    
// 创建下载链接
const blob = new Blob([exportedHTML], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = '新人必读_更新版.html';
a.click();

// 清理
URL.revokeObjectURL(url);

alert('导出成功！HTML文件已保存。');
console.log('HTML导出完成');
}

// 添加Sortable.js库到页面
function loadSortableJS() {
console.log('正在加载Sortable.js...');

// 检查是否已经加载
if (typeof Sortable !== 'undefined') {
    console.log('Sortable.js已加载，直接初始化编辑器');
    initEditor();
    return;
}

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js';
script.onload = function() {
    console.log('Sortable.js加载完成，初始化编辑器');
    initEditor();
};
script.onerror = function() {
    console.error('Sortable.js加载失败，尝试使用备用CDN');
    const fallbackScript = document.createElement('script');
    fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js';
    fallbackScript.onload = function() {
        console.log('备用CDN Sortable.js加载完成，初始化编辑器');
        initEditor();
    };
    fallbackScript.onerror = function() {
        console.error('所有CDN加载Sortable.js失败，初始化不含排序功能的编辑器');
        alert('无法加载拖拽排序功能，但其他编辑功能仍可使用。');
        initEditor();
    };
    document.head.appendChild(fallbackScript);
};
document.head.appendChild(script);
}

// jQuery-like 选择器扩展
if (!Element.prototype.matches) {
Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// 直接初始化加载
loadSortableJS();