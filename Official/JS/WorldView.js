document.addEventListener("DOMContentLoaded", () => {
    仅允许一个展开的卡片();
    // 获取“境界”对应的卡片（根据你的HTML，它的ID是 世界观：境界按钮）[cite: 2]
    const defaultCard = document.getElementById('世界观：境界按钮');
    // 获取“境界”对应的内容区域（根据你的HTML，它的ID是 realm-content-area）[cite: 11]
    const defaultContentArea = document.getElementById('realm-content-area');

    // 检查元素是否存在，然后添加 'active' 类
    if (defaultCard && defaultContentArea) {
        // 先移除所有可能存在的 active 类，确保干净的初始状态
        // （这一步可选，取决于你的HTML和CSS是否可能已经有active类）
        document.querySelectorAll('.note-card').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.worldview-content-area').forEach(area => area.classList.remove('active'));

        // 为默认卡片和内容区域添加 active 类使其显示
        defaultCard.classList.add('active');
        defaultContentArea.classList.add('active'); // [cite: 165] 指示添加 active 类来显示
    }
});

function 仅允许一个展开的卡片() {
    // 获取所有笔记卡片和内容区域
    const noteCards = document.querySelectorAll('.note-card');
    const contentAreas = document.querySelectorAll('.worldview-content-area');

    // 为每个笔记卡片添加点击事件
    noteCards.forEach(card => {
        card.addEventListener('click', function () {
            // 获取目标内容区域的ID
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);

            // 隐藏所有内容区域，移除active类
            contentAreas.forEach(area => {
                area.classList.remove('active');
            });

            // 移除所有卡片的active类
            noteCards.forEach(c => {
                c.classList.remove('active');
            });

            // 显示目标内容区域，添加active类
            if (targetContent) {
                targetContent.classList.add('active');
                this.classList.add('active');

                // 滚动到内容区域，添加平滑滚动效果和上方偏移
                //setTimeout(() => {
                //    const yOffset = -80; // 偏移量，给导航栏留出空间
                //    const y = targetContent.getBoundingClientRect().top + window.pageYOffset + yOffset;
                //    window.scrollTo({ top: y, behavior: 'smooth' });
                //}, 100);
            }
        });
    });
}