/**
 * 九天玄灵戒 - 主要功能JS
 * 控制物品展示、交互和面板显示
 */

/**
 * 创建简单的提示框
 * @param {string} content - 提示框内容HTML
 * @param {number} x - 鼠标X坐标
 * @param {number} y - 鼠标Y坐标
 */
function createTooltip(content, x, y) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
    
    // 调整位置，确保不超出视口
    const viewportWidth = window.innerWidth;
    const tooltipWidth = tooltip.offsetWidth;
    
    if (x + tooltipWidth > viewportWidth - 20) {
        x = viewportWidth - tooltipWidth - 20;
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

/**
 * 隐藏提示框
 */
function hideTooltip() {
    document.getElementById('tooltip').style.display = 'none';
}

/**
 * 切换空间分区
 * @param {string} spaceId - 空间ID
 */
function switchSpace(spaceId) {
    // 移除所有活跃状态
    document.querySelectorAll('.space-list li').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加活跃状态
    document.querySelector(`[data-space="${spaceId}"]`).classList.add('active');
    
    // 更新空间信息
    const space = document.querySelector('.space-title');
    const capacity = document.querySelector('.space-capacity');
    space.textContent = document.querySelector(`[data-space="${spaceId}"]`).textContent;
    capacity.textContent = `已用: ${spaceCapacity[spaceId].used}/${spaceCapacity[spaceId].total}`;
    
    // 更新物品
    renderItems(spaceId);
}

/**
 * 渲染物品到网格
 * @param {string} spaceId - 空间ID
 */
function renderItems(spaceId) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    itemData[spaceId].forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        
        const qualityClass = item.quality ? `quality-${item.quality}` : '';
        
        itemElement.innerHTML = `
            <div class="item-img" style="background-image: url('${item.image}')"></div>
            <div class="item-name ${qualityClass}">${item.name}</div>
            <div class="item-count">×${item.count}</div>
        `;
        
        // 鼠标悬停显示提示
        itemElement.addEventListener('mouseenter', function(e) {
            const tooltipContent = `
                <div style="color: ${qualityClass ? getComputedStyle(document.documentElement).getPropertyValue(`--${qualityClass}`) : '#ffffff'}; font-weight: bold;">${item.name}</div>
                <div style="color: #a89874; font-size: 11px; margin-bottom: 5px;">${item.type}</div>
                <div style="font-size: 12px;">${item.description}</div>
            `;
            createTooltip(tooltipContent, e.clientX + 15, e.clientY + 15);
        });
        
        itemElement.addEventListener('mousemove', function(e) {
            createTooltip(document.getElementById('tooltip').innerHTML, e.clientX + 15, e.clientY + 15);
        });
        
        itemElement.addEventListener('mouseleave', hideTooltip);
        
        // 点击显示详情面板
        itemElement.addEventListener('click', function() {
            if (item.isLongSword) {
                showLongSwordPanel();
            }
        });
        
        container.appendChild(itemElement);
    });
}

/**
 * 显示长剑面板
 */
function showLongSwordPanel() {
    // 使用模板系统生成长剑面板HTML
    const panelsContainer = document.getElementById('item-panels');
    panelsContainer.innerHTML = window.ItemTemplates.generateItemPanel('longsword', longSwordData);
    
    // 生成详细信息面板但默认不显示
    panelsContainer.insertAdjacentHTML('beforeend', window.ItemTemplates.generateDetailedPanel('longsword', longSwordData));
    
    // 显示面板和遮罩
    document.getElementById('longsword-panel').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    
    // 绑定事件
    document.getElementById('panel-close').addEventListener('click', function(e) {
        e.stopPropagation();
        closeLongSwordPanel();
    });
    
    document.getElementById('expand-button').addEventListener('click', showDetailedPanel);
    document.getElementById('detailed-close').addEventListener('click', closeDetailedPanel);
}

/**
 * 关闭长剑面板
 */
function closeLongSwordPanel() {
    document.getElementById('longsword-panel').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

/**
 * 显示详细信息面板
 */
function showDetailedPanel() {
    document.getElementById('longsword-detailed-panel').style.display = 'block';
    document.getElementById('longsword-panel').style.display = 'none';
}

/**
 * 关闭详细信息面板
 */
function closeDetailedPanel() {
    document.getElementById('longsword-detailed-panel').style.display = 'none';
    document.getElementById('longsword-panel').style.display = 'block';
}

/**
 * 初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 默认选中战斗区域
    switchSpace('battle');
    
    // 绑定空间切换事件
    document.querySelectorAll('.space-list li').forEach(item => {
        item.addEventListener('click', function() {
            const spaceId = this.getAttribute('data-space');
            switchSpace(spaceId);
        });
    });
    
    // 绑定遮罩层点击事件
    document.getElementById('overlay').addEventListener('click', function() {
        if (document.getElementById('longsword-detailed-panel') && 
            document.getElementById('longsword-detailed-panel').style.display === 'block') {
            closeDetailedPanel();
        } else {
            closeLongSwordPanel();
        }
    });
});