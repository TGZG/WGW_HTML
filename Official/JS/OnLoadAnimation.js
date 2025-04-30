/********************
 * 处理动画效果
 * 1.滚动条非顶部时的物体样式变化
 * 2.滚动时平滑移动
 * 3.符文文本高亮
 ********************/
document.addEventListener("DOMContentLoaded", () => {
    非顶部时导航栏样式变化();
    非顶部时显示回顶按钮();
    按钮跳转时平滑移动();
    卡片展开时平滑展开();
    新模块出场时渐入();
    符文高亮();

    // 汉堡菜单切换
    document.querySelector('.hamburger').addEventListener('click', function () {
        this.classList.toggle('active');
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // 点击菜单外区域关闭
    document.addEventListener('click', function (e) {
        if (!e.target.closest('nav')) {
            document.querySelector('.hamburger').classList.remove('active');
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

function 非顶部时导航栏样式变化() {
    window.addEventListener("scroll", () => {
        const nav = document.querySelector("nav");
        if (window.scrollY > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });
}
function 非顶部时显示回顶按钮() {
    window.addEventListener("scroll", () => {
        const backToTop = document.getElementById("back-to-top");
        if (window.scrollY > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });
    // 返回顶部按钮功能
    const backToTop = document.getElementById("back-to-top");
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
function 按钮跳转时平滑移动() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 减去导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
}
function 卡片展开时平滑展开() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('h3');
        const content = item.querySelector('.faq-content');

        // 默认隐藏内容
        content.style.maxHeight = 0;
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease';

        header.addEventListener('click', () => {
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }
        });
    });
}
function 新模块出场时渐入() {
    if ('IntersectionObserver' in window) {
        const elements = document.querySelectorAll('.feature-card, .power-type, .realm-level, .version, .study-detail, .event-content, .preorder-option');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = entry.target.classList.contains('preorder-option') && entry.target.classList.contains('featured')
                        ? 'scale(1.05)'
                        : 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        elements.forEach(element => {
            element.style.opacity = 0;
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}
function 符文高亮() {
    const codeExample = document.querySelector('.code-example');
    if (codeExample) {
        const text = codeExample.textContent;
        const highlighted = text
            .replace(/(首先|然后|如果|否则|循环|结束|计算)\b/g, '<span style="color:#ff7e5f">$1</span>')
            .replace(/([0-9]+)/g, '<span style="color:#4e7cff">$1</span>')
            .replace(/(五维状态|第一参数|施法)/g, '<span style="color:#7e57c2">$1</span>')
            .replace(/(五行弱意|镜心术|金之锋)/g, '<span style="color:#4ecca3">$1</span>');

        codeExample.innerHTML = highlighted;
    }
}