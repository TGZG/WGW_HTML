/**
 * 处理玩家故事区域
 * 1.箭头切换故事
 * 2.点点切换故事
 * 3.键盘切换故事
 * 4.手机触摸滑动切换故事
 * 5.十秒自动切换故事
 */
document.addEventListener('DOMContentLoaded', function () {
    // 获取元素
    const storySlides = document.querySelectorAll('.story-slide');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const navDots = document.querySelectorAll('.nav-dot');

    // 初始化当前故事索引
    let currentStoryIndex = 0;
    const totalStories = storySlides.length;

    // 显示特定故事
    function showStory(index) {
        // 检查索引是否有效
        if (index < 0 || index >= totalStories) {
            console.error("Invalid story index:", index);
            return; // 防止无效索引导致错误
        }

        // 隐藏所有故事
        storySlides.forEach(slide => {
            slide.classList.remove('active');
        });

        // 移除所有导航点的激活状态
        navDots.forEach(dot => {
            dot.classList.remove('active');
        });

        // 显示当前故事
        storySlides[index].classList.add('active');

        // 激活对应的导航点
        if (navDots[index]) { // 添加检查确保导航点存在
            navDots[index].classList.add('active');
        }

        // 更新当前索引
        currentStoryIndex = index;
    }

    // 显示下一个故事
    function showNextStory() {
        let nextIndex = (currentStoryIndex + 1) % totalStories;
        showStory(nextIndex);
    }

    // 显示上一个故事
    function showPrevStory() {
        let prevIndex = (currentStoryIndex - 1 + totalStories) % totalStories;
        showStory(prevIndex);
    }

    // 为箭头添加点击事件
    if (prevArrow) {
        prevArrow.addEventListener('click', showPrevStory);
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', showNextStory);
    }

    // 为导航点添加点击事件
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showStory(index);
        });
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        // 检查故事部分是否存在
        const storySection = document.querySelector('.stories-container'); // 使用更具体的选择器
        if (!storySection) return; // 如果故事部分不存在，则不执行键盘导航

        const rect = storySection.getBoundingClientRect();
        const isVisible = (
            rect.top < window.innerHeight && rect.bottom >= 0 // 检查是否在视口内
        );

        if (isVisible) {
            if (e.key === 'ArrowRight') {
                showNextStory();
            } else if (e.key === 'ArrowLeft') {
                showPrevStory();
            }
        }
    });

    // 添加触摸滑动支持
    const storyContainer = document.querySelector('.story-container');
    if (storyContainer) { // 添加检查确保容器存在
        let touchStartX = 0;
        let touchEndX = 0;

        storyContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        storyContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const minSwipeDistance = 50;
            if (touchStartX - touchEndX > minSwipeDistance) {
                // 向左滑动，显示下一个故事
                showNextStory();
            } else if (touchEndX - touchStartX > minSwipeDistance) {
                // 向右滑动，显示上一个故事
                showPrevStory();
            }
        }
    }

    // 自动切换故事（可选）
    let autoSlideInterval;

    function startAutoSlide() {
        // 停止任何现有的计时器
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            showNextStory();
        }, 10000); // 每10秒切换一次
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // 当鼠标悬停在故事上时暂停自动切换
    if (storyContainer) { // 再次检查
        storyContainer.addEventListener('mouseenter', stopAutoSlide);
        storyContainer.addEventListener('touchstart', stopAutoSlide);

        // 当鼠标离开故事时恢复自动切换
        storyContainer.addEventListener('mouseleave', startAutoSlide);
        storyContainer.addEventListener('touchend', startAutoSlide);
    }

    // 启动自动切换
    startAutoSlide();
});