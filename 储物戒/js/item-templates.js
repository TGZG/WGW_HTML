/**
 * 物品详情模板系统
 * 用于根据数据生成不同类型物品的详情面板HTML
 */

/**
 * 为太清阁长剑生成一级界面HTML
 * @param {Object} data - 长剑数据对象
 * @returns {string} HTML字符串
 */
function generateLongSwordPanel(data) {
    const basicInfo = data.basicInfo;
    
    return `
    <div class="item-panel" id="longsword-panel">
        <div class="panel-close" id="panel-close"></div>
        
        <!-- 面板头部 -->
        <div class="panel-header">
            <div class="panel-img" style="background-image: url('${data.image}')"></div>
            <div class="panel-title">
                <div class="panel-name quality-${data.quality}">${data.name}</div>
                <div class="panel-type">${data.type}</div>
            </div>
            <div class="equipped-status">${data.equippedTaihu}已装备</div>
        </div>
        
        <!-- 伤害部分 -->
        <div class="damage-section">
            <div class="damage-main">${basicInfo.damageMain}</div>
            <div class="damage-detail">
                ${basicInfo.damageDetails.map(detail => `<div class="damage-detail-item">${detail}</div>`).join('')}
            </div>
        </div>
        
        <!-- 特性部分（独特背景1） -->
        <div class="section section-bg-1">
            <div class="section-title">长剑特性</div>
            <ul class="feature-list">
                ${basicInfo.swordFeatures.map(feature => 
                    `<li><span class="feature-name">${feature.name}：</span>${feature.value}</li>`
                ).join('')}
            </ul>
            
            <div class="section-title" style="margin-top: 15px;">太清阁制式特性</div>
            <ul class="feature-list">
                ${basicInfo.taiqingFeatures.map(feature => 
                    `<li><span class="feature-name">${feature.name}：</span>${feature.value}</li>`
                ).join('')}
            </ul>
        </div>
        
        <!-- 工业与社会属性（独特背景2） -->
        <div class="section section-bg-2">
            <div class="section-title">工业属性</div>
            <ul class="feature-list">
                ${basicInfo.industryFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            
            <div class="section-title" style="margin-top: 15px;">社会属性</div>
            <div class="social-section-container">
                <ul class="feature-list">
                    ${basicInfo.socialFeatures.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="social-mood" title="太清阁正统之物，为正道所认可"></div>
            </div>
        </div>
        
        <!-- 词条标签 -->
        <div class="tags-container">
            ${basicInfo.tags.map(tag => `<div class="tag">${tag}</div>`).join('')}
        </div>
        
        <!-- 道具介绍（独特背景3） -->
        <div class="section section-bg-3">
            <div class="section-title">道具介绍</div>
            <div class="description">
                ${basicInfo.description.replace(/\n/g, '<br>')}
            </div>
        </div>
        
        <!-- 展开按钮 -->
        <button class="expand-button" id="expand-button">查看详细信息</button>
    </div>
    `;
}

/**
 * 为太清阁长剑生成二级界面HTML
 * @param {Object} data - 长剑数据对象
 * @returns {string} HTML字符串
 */
function generateLongSwordDetailedPanel(data) {
    const detailedInfo = data.detailedInfo;
    
    // 渲染属性列表的辅助函数
    function renderProperties(properties) {
        return properties.map(prop => 
            `<li>
                <div class="param-name">${prop.name}：</div>
                <div class="param-value">${prop.value}</div>
            </li>`
        ).join('');
    }
    
    return `
    <div class="detailed-panel" id="longsword-detailed-panel">
        <div class="detailed-close" id="detailed-close"></div>
        
        <div class="detailed-panel-header">
            <div class="detailed-img" style="background-image: url('${data.image}')"></div>
            <div class="detailed-title">
                <div class="detailed-name quality-${data.quality}">${data.name}</div>
                <div class="detailed-type">标准一阶仙器 · ${data.type}</div>
                <div class="detailed-stats">
                    ${detailedInfo.stats.map(stat => 
                        `<div class="detailed-stat">${stat.label}：${stat.value}</div>`
                    ).join('')}
                </div>
            </div>
        </div>
        
        <!-- 战斗方面 -->
        <div class="detailed-section combat-section">
            <div class="detailed-section-title">基本参数</div>
            <div class="detailed-params">
                <div class="param-group">
                    <div class="param-group-title">伤害与攻击</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.combat.damageAttack)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">使用需求</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.combat.requirements)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">特性</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.combat.features)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">所处环境</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.combat.environment)}
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- 工业方面 -->
        <div class="detailed-section industry-section">
            <div class="detailed-section-title">工业属性</div>
            <div class="detailed-params">
                <div class="param-group">
                    <div class="param-group-title">基本信息</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.industry.basicInfo)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">热属性</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.industry.heatProperties)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">灵气属性</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.industry.spiritualProperties)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">材质耐性</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.industry.durability)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">跨位面稳定性</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.industry.crossDimension)}
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- 社会学 -->
        <div class="detailed-section social-section">
            <div class="detailed-section-title">社会学</div>
            <div class="detailed-params">
                <div class="param-group">
                    <div class="param-group-title">制式追踪</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.social.standardTracking)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">社会影响</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.social.socialInfluence)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">关联势力态度</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.social.associatedFactions)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">世俗与装饰</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.social.mundaneDecoration)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">经济属性</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.social.marketStatus)}
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- 极端情况 -->
        <div class="detailed-section">
            <div class="detailed-section-title">极端情况</div>
            <div class="detailed-params">
                <div class="param-group">
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.extremeConditions)}
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- 安全设计 -->
        <div class="detailed-section">
            <div class="detailed-section-title">安全设计</div>
            <div class="detailed-params">
                <div class="param-group">
                    <div class="param-group-title">自动清理</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.safetyDesign.autoCleaning)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">温度预警</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.safetyDesign.temperatureWarning)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">灵气预警</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.safetyDesign.spiritualWarning)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">灵气疏散</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.safetyDesign.spiritualDispersion)}
                    </ul>
                </div>
                
                <div class="param-group">
                    <div class="param-group-title">导灵关闭</div>
                    <ul class="param-list">
                        ${renderProperties(detailedInfo.safetyDesign.conductionShutdown)}
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- 道具介绍 -->
        <div class="detailed-section">
            <div class="detailed-section-title">道具介绍</div>
            <div class="description" style="line-height: 1.6; margin-top: 10px;">
                ${detailedInfo.fullDescription.replace(/\n/g, '<br><br>')}
            </div>
        </div>
    </div>
    `;
}

/**
 * 根据物品类型生成对应详情面板
 * @param {string} itemType - 物品类型
 * @param {Object} data - 物品数据
 * @returns {string} HTML字符串
 */
function generateItemPanel(itemType, data) {
    switch(itemType) {
        case 'longsword':
            return generateLongSwordPanel(data);
        // 可以扩展其他物品类型的模板
        default:
            return '';
    }
}

/**
 * 根据物品类型生成对应详细信息面板
 * @param {string} itemType - 物品类型
 * @param {Object} data - 物品数据
 * @returns {string} HTML字符串
 */
function generateDetailedPanel(itemType, data) {
    switch(itemType) {
        case 'longsword':
            return generateLongSwordDetailedPanel(data);
        // 可以扩展其他物品类型的模板
        default:
            return '';
    }
}

// 导出模板函数
window.ItemTemplates = {
    generateItemPanel,
    generateDetailedPanel
};