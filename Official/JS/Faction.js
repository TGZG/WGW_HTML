/**
 * 处理势力介绍区域
 * 1.默认显示宗门与魔盟的详情
 * 2.为所有势力图标添加点击事件
 */
document.addEventListener('DOMContentLoaded', function () {
    // 设置默认显示的势力
    showFaction('宗门');
    showFaction('魔盟');

    // 为所有势力图标添加点击事件
    const factionItems = document.querySelectorAll('.faction-item');
    factionItems.forEach(item => {
        item.addEventListener('click', function () {
            const factionName = this.getAttribute('data-faction');
            const parent = this.closest('.faction-container');
            showFaction(factionName, parent);
        });
    });

    // 显示指定势力的详情
    function showFaction(factionName, container) {
        // 如果没有指定容器，查找所有容器
        if (!container) {
            const containers = document.querySelectorAll('.faction-container');
            containers.forEach(cont => {
                const item = cont.querySelector(`.faction-item[data-faction="${factionName}"]`);
                if (item) {
                    showFaction(factionName, cont);
                }
            });
            return;
        }

        // 隐藏所有详情
        const allDetails = container.querySelectorAll('.detail-content');
        allDetails.forEach(detail => {
            detail.style.display = 'none';
        });

        // 显示选中的详情
        const selectedDetail = container.querySelector(`#${factionName}-detail`);
        if (selectedDetail) {
            selectedDetail.style.display = 'block';
        }

        // 移除所有选中状态
        const allItems = container.querySelectorAll('.faction-item');
        allItems.forEach(item => {
            item.classList.remove('active');
        });

        // 添加选中状态
        const selectedItem = container.querySelector(`.faction-item[data-faction="${factionName}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }
});