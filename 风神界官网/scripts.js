// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
  // 导航栏滚动效果
  window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // 显示/隐藏返回顶部按钮
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

  // 平滑滚动到锚点
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

  // FAQ手风琴效果
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

  // 视频播放按钮效果
  const videoPlayButton = document.querySelector('.video-play-button');
  const videoPlaceholder = document.querySelector('.video-placeholder');

  if (videoPlayButton && videoPlaceholder) {
    videoPlayButton.addEventListener('click', () => {
      // 这里只是一个示例效果，实际应该替换为视频播放器
      videoPlayButton.innerHTML = "正在加载...";
      videoPlayButton.style.backgroundColor = "rgba(255, 255, 255, 0.1)";

      setTimeout(() => {
        videoPlaceholder.innerHTML = `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;">
              <p>视频播放器将在此处加载</p>
            </div>
          `;
      }, 1000);
    });
  }

  // 世界演变时间线动画
  const timelinePoints = document.querySelectorAll('.timeline-point');
  let currentActive = document.querySelector('.timeline-point.active');

  if (timelinePoints.length > 0) {
    setInterval(() => {
      // 移除当前活跃点
      currentActive.classList.remove('active');

      // 找到下一个点
      let nextIndex = Array.from(timelinePoints).indexOf(currentActive) + 1;
      if (nextIndex >= timelinePoints.length) {
        nextIndex = 0;
      }

      // 设置新的活跃点
      currentActive = timelinePoints[nextIndex];
      currentActive.classList.add('active');
    }, 3000);
  }

  // 添加特效方法
  function addElementInViewportAnimation() {
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

  // 如果浏览器支持IntersectionObserver，添加动画
  if ('IntersectionObserver' in window) {
    addElementInViewportAnimation();
  }

  // 为符文编辑器添加代码高亮效果
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
});

// 补充JavaScript功能，增强网站交互效果

// 展示技术细节的交互效果
function initTechShowcase() {
  const techItems = document.querySelectorAll('.tech-item');
  const techDetail = document.querySelector('.tech-detail');
  const techDetailTitle = techDetail ? techDetail.querySelector('h3') : null;
  const techDetailText = techDetail ? techDetail.querySelector('.tech-detail-text') : null;
  const techDetailImage = techDetail ? techDetail.querySelector('.tech-detail-image') : null;

  if (!techItems.length || !techDetail) return;

  // 技术展示详情内容
  const techDetails = [
    {
      title: "革命性的角色具象化技术",
      text: `<p>在传统游戏中，所有NPC都需要全量计算，这限制了NPC的总数量。风神界的突破在于：</p>
              <ul>
                <li>只有玩家附近的约十万名NPC以具象方式存在，拥有完整的行为模式和数据</li>
                <li>其余百亿名NPC以抽象形式存在，只保留关键属性和社会关系</li>
                <li>当玩家接近时，抽象NPC会迅速具象化，获得完整的性格和行为逻辑</li>
                <li>系统会记忆玩家与NPC的重要互动，确保再次相遇时保持一致性</li>
              </ul>
              <p>这种技术使得普通家用电脑也能流畅运行包含百亿AI角色的庞大世界，同时保持每个角色的独特性。</p>`,
      imageClass: "quantum-detail-image"
    },
    {
      title: "需求链AI行为模型详解",
      text: `<p>风神界的AI系统基于"需求链"模型设计，每个NPC的行为都由多层次需求驱动：</p>
              <ul>
                <li>生存需求：食物、安全、居所等基础需求，是NPC行为的首要动力</li>
                <li>社交需求：归属感、尊重、友谊等社会性需求，影响NPC的人际关系</li>
                <li>自我实现：权力、成就、修为等高级需求，决定NPC的长期目标</li>
                <li>需求优先级：NPC会根据环境和自身状况动态调整需求优先级</li>
              </ul>
              <p>这种设计使NPC表现出真实、复杂且不可预测的行为模式，每个NPC都是独特的个体。</p>`,
      imageClass: "ai-detail-image"
    },
    {
      title: "五维向量系统详解",
      text: `<p>五维向量系统是风神界战斗与修炼的核心机制，打破了传统RPG的技能限制：</p>
              <ul>
                <li>角色状态由五个参数构成的向量表示，而非简单的属性数值</li>
                <li>每个技能都会改变角色的五维状态，并且需要特定的五维状态才能释放</li>
                <li>技能之间形成了复杂的关联网络，某些技能的组合可以形成连锁反应</li>
                <li>玩家可以通过掌握向量变化规律，创造独特的战斗风格和修炼路线</li>
              </ul>
              <p>五维向量系统既保持了深度与复杂性，又通过伪圣之路设计降低了入门门槛。</p>`,
      imageClass: "vector-detail-image"
    },
    {
      title: "程序化世界生成技术",
      text: `<p>风神界采用先进的程序化生成技术，创造真实且丰富的游戏世界：</p>
              <ul>
                <li>基于地质学原理生成地形，包括山脉、河流、平原、海洋等自然地貌</li>
                <li>依据气候模型生成多样化的生态系统，影响资源分布和生物多样性</li>
                <li>根据资源分布和地理条件模拟文明发展，形成合理的城市分布</li>
                <li>使用历史演变算法生成完整的世界历史，包括战争、王朝更替、宗门兴衰等</li>
              </ul>
              <p>每个玩家的世界都是独一无二的，拥有完整且自洽的地理环境、历史背景和文化体系。</p>`,
      imageClass: "procedural-detail-image"
    }
  ];

  // 为每个技术项添加点击事件
  techItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // 更新技术详情区域的内容
      const detail = techDetails[index % techDetails.length]; // 循环使用详情

      // 先添加过渡效果
      techDetail.style.opacity = "0";
      techDetail.style.transform = "translateY(20px)";

      // 短暂延迟后更新内容并恢复显示
      setTimeout(() => {
        techDetailTitle.textContent = detail.title;
        techDetailText.innerHTML = detail.text;
        techDetailImage.className = 'tech-detail-image';
        techDetailImage.classList.add(detail.imageClass);

        // 恢复显示
        techDetail.style.opacity = "1";
        techDetail.style.transform = "translateY(0)";
      }, 300);
    });
  });

  // 初始设置过渡效果
  techDetail.style.transition = "opacity 0.5s ease, transform 0.5s ease";
}

// 境界系统图表交互
function initRealmSystem() {
  const realmLevels = document.querySelectorAll('.realm-level');
  const realmDescription = document.querySelector('.realm-description');

  if (!realmLevels.length || !realmDescription) return;

  const realmDescriptions = {
    "凡境": "普通人的境界，寿命约80年。没有任何修为，不能使用灵力，但可以学习基础武技增强体魄。",
    "炼体": "通过锻炼肉身，强化体魄，寿命延长至100年。可使用少量真气，适合修习外家功法。",
    "通脉": "打通经脉，引导灵气入体，寿命延长至120年。修炼速度明显加快，可学习初级法术。",
    "开窍": "开启体内穴窍，增强灵气容量，寿命延长至140年。属于凡人顶级境界，跨入仙道门槛。",
    "炼气": "引导天地灵气入体，形成灵力池，寿命延长至150年。开始正式步入修真之路，在凡俗界已是强者。",
    "筑基": "构筑灵力根基，形成稳固的灵力循环系统，寿命延长至300年。可御剑飞行，施展中级法术。",
    "金丹": "灵力凝聚为金丹，大幅增强修为，寿命延长至400年。可施展高级法术，轻易毁灭一座城池。",
    "元婴": "元神凝结成婴，寿命延长至500年。在大多数修真世界中属于顶尖战力，一个元婴修士可镇守一方。",
    "化神": "元婴与肉身高度融合，寿命延长至1000年。能够改变局部空间规则，已超越常规修士认知。",
    "炼虚": "接触虚空本源，掌握部分天道法则，寿命延长至3000年。传说中的存在，世间罕见，有'大帝'之称。",
    "合道": "以身合道，成为天道的一部分，不死不灭。掌控一方天地规则，创建一界成为圣人。",
    "大乘": "超脱天道束缚，寿元无限。传说中的境界，历史上尚无人到达。"
  };

  // 为每个境界等级添加鼠标事件
  realmLevels.forEach(level => {
    const levelName = level.querySelector('.level-name').textContent;

    level.addEventListener('mouseenter', () => {
      if (realmDescriptions[levelName]) {
        const originalContent = realmDescription.innerHTML;
        realmDescription.innerHTML = `<strong>${levelName}：</strong> ${realmDescriptions[levelName]}`;
        realmDescription.dataset.original = originalContent;

        // 高亮当前选中的境界
        level.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        level.style.transform = "scale(1.05)";
        level.style.transition = "all 0.3s ease";
      }
    });

    level.addEventListener('mouseleave', () => {
      if (realmDescription.dataset.original) {
        realmDescription.innerHTML = realmDescription.dataset.original;
      }

      // 恢复原状
      level.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      level.style.transform = "scale(1)";
    });
  });
}

// 图片轮播效果
function initImageCarousel() {
  // 找到所有可能需要轮播的容器
  const carouselContainers = [
    document.querySelector('.definition-image'),
    document.querySelector('.performance-image'),
    document.querySelector('.contention-image'),
    document.querySelector('.vector-chart')
  ].filter(container => container !== null);

  // 为每个容器设置轮播
  carouselContainers.forEach((container, containerIndex) => {
    // 模拟图片数据
    const images = [
      `url('images/carousel-${containerIndex + 1}-1.jpg')`,
      `url('images/carousel-${containerIndex + 1}-2.jpg')`,
      `url('images/carousel-${containerIndex + 1}-3.jpg')`
    ];

    let currentImageIndex = 0;
    const originalBackground = container.style.backgroundImage || container.style.background;

    // 创建轮播指示器
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    indicators.style.position = 'absolute';
    indicators.style.bottom = '10px';
    indicators.style.width = '100%';
    indicators.style.display = 'flex';
    indicators.style.justifyContent = 'center';
    indicators.style.gap = '10px';

    // 由于实际图片文件不存在，我们使用原始背景
    if (originalBackground) {
      images[0] = originalBackground;
    }

    // 创建指示器按钮
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('span');
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = i === 0 ? 'white' : 'rgba(255, 255, 255, 0.5)';
      dot.style.cursor = 'pointer';
      dot.style.transition = 'all 0.3s ease';

      dot.addEventListener('click', () => {
        currentImageIndex = i;
        updateCarousel();
      });

      indicators.appendChild(dot);
    }

    // 设置容器为相对定位以放置指示器
    if (container.style.position !== 'absolute') {
      container.style.position = 'relative';
    }
    container.style.overflow = 'hidden';

    // 在容器中添加指示器
    container.appendChild(indicators);

    // 轮播更新函数
    function updateCarousel() {
      container.style.backgroundImage = images[currentImageIndex];

      // 更新指示器状态
      const dots = indicators.querySelectorAll('span');
      dots.forEach((dot, i) => {
        dot.style.backgroundColor = i === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)';
      });
    }

    // 自动轮播
    setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateCarousel();
    }, 5000 + containerIndex * 1000); // 错开轮播时间
  });
}

// 倒计时效果
function initCountdown() {
  // 查找预购区域
  const preorderSection = document.getElementById('preorder');
  if (!preorderSection) return;

  // 创建倒计时元素
  const countdownContainer = document.createElement('div');
  countdownContainer.className = 'countdown-container';
  countdownContainer.innerHTML = `
      <h3>距离技术Demo发布还剩</h3>
      <div class="countdown-timer">
        <div class="countdown-item">
          <span class="countdown-value days">00</span>
          <span class="countdown-label">天</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value hours">00</span>
          <span class="countdown-label">时</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value minutes">00</span>
          <span class="countdown-label">分</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value seconds">00</span>
          <span class="countdown-label">秒</span>
        </div>
      </div>
    `;

  // 添加样式
  countdownContainer.style.textAlign = 'center';
  countdownContainer.style.marginBottom = '40px';
  countdownContainer.style.padding = '20px';
  countdownContainer.style.backgroundColor = 'rgba(78, 124, 255, 0.1)';
  countdownContainer.style.borderRadius = '8px';

  // 查找插入位置
  const releaseTimeline = preorderSection.querySelector('.release-timeline');
  if (releaseTimeline) {
    releaseTimeline.parentNode.insertBefore(countdownContainer, releaseTimeline);

    // 设置倒计时目标日期（2024年7月1日）
    const targetDate = new Date('2024-07-01T00:00:00');

    // 更新倒计时
    function updateCountdown() {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        countdownContainer.innerHTML = '<h3>技术Demo已发布！</h3><p>立即前往下载体验！</p>';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.querySelector('.countdown-value.days').textContent = days.toString().padStart(2, '0');
      document.querySelector('.countdown-value.hours').textContent = hours.toString().padStart(2, '0');
      document.querySelector('.countdown-value.minutes').textContent = minutes.toString().padStart(2, '0');
      document.querySelector('.countdown-value.seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // 初始更新和设置定时器
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

// 视差滚动效果
function initParallaxEffect() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    // 使背景图片以不同的速度滚动，创造视差效果
    heroSection.style.backgroundPosition = `center ${50 + scrollPosition * 0.05}%`;
  });
}

// 预购表单交互
function initPreorderForm() {
  const preorderLinks = document.querySelectorAll('a.preorder-button');
  if (!preorderLinks.length) return;

  preorderLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Create modal overlay
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;';

      // Create form container
      const formContainer = document.createElement('div');
      formContainer.style.cssText = 'background:white;padding:20px;border-radius:8px;width:90%;max-width:400px;';
      modal.appendChild(formContainer);

      // Determine form type based on link class
      // console.log(Array.from(link.classList));
      // console.log(1);
      const formType = link.classList.contains('online') ? '官网联机版预约' :
        link.classList.contains('dlc') ? '大争之世DLC预约' : '单机模式预约';

      const phpEndpoint = link.classList.contains('online') ? 'index.php' :
        link.classList.contains('dlc') ? 'dlc.php' : 'danji.php';

      // Create form HTML
      formContainer.innerHTML = `
        <form id="preorder-form">
          <h3 style="margin-bottom:20px;color:#4e7cff;">${formType}</h3>
          <div style="margin-bottom:15px;">
            <label for="name">昵称（选填）:</label>
            <input type="text" id="name" name="name" style="width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;">
          </div>
          <div style="margin-bottom:15px;">
            <label for="email">电子邮箱*:</label>
            <input type="email" id="email" name="email" required style="width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;">
            <span class="error-message" style="color:red;font-size:12px;display:none;">请输入有效的邮箱地址</span>
          </div>
          <div style="margin-bottom:15px;">
            <label for="phone">手机号码*:</label>
            <input type="tel" id="phone" name="phone" required style="width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;">
            <span class="error-message" style="color:red;font-size:12px;display:none;">请输入有效的手机号码</span>
          </div>
          <button class="update" type="submit"  style="width:100%;padding:10px;background-color:#4e7cff;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">提交预约</button>
          <button type="button" class="close-modal" style="width:100%;padding:10px;background-color:#ddd;color:#333;border:none;border-radius:4px;cursor:pointer;margin-top:10px;font-weight:bold;">取消</button>
        </form>
      `;

      // 获取所有类名为 'update' 的按钮
      // formContainer.addEventListener('click', function(e) {
      //   if(e.target && e.target.classList.contains('update')) {
      //     e.preventDefault(); // 阻止表单默认提交
      //     // 你的逻辑代码
      //     getUserCount('单机.txt', '.reservation-counter');
      //     getUserCount('DLC.txt', '.DLC');
      //     getUserCount('online.txt', '.Online');
          
      //     // 注意：location.reload()会立即刷新，可能来不及执行上面的函数
      //     setTimeout(() => location.reload(), 100); // 延迟100ms确保函数执行
      //   }
      // });

      // Add modal to page
      document.body.appendChild(modal);

      // Close button handler
      const closeButton = modal.querySelector('.close-modal');
      closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      // Form submission handler
      const form = modal.querySelector('#preorder-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const phone = formData.get('phone');

        // Reset error messages
        form.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

        // Validate email and phone
        let isValid = true;

        if (!validateEmail(email)) {
          const emailError = form.querySelector('#email').nextElementSibling;
          emailError.style.display = 'block';
          isValid = false;
        }

        if (!validatePhone(phone)) {
          const phoneError = form.querySelector('#phone').nextElementSibling;
          phoneError.style.display = 'block';
          isValid = false;
        }

        if (!isValid) return;

        // Submit form if validation passes
        fetch(phpEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
          })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('预约成功！');
              document.body.removeChild(modal);
              getUserCount('单机.txt','.reservation-counter');
              getUserCount('DLC.txt','.DLC');
              getUserCount('online.txt','.Online');

            } else {
              alert(data.message || '该用户已预约过，请勿重复预约');
            }
          }).then(() => {location.reload();})
          .catch(error => {
            console.error('Error:', error);
            alert('提交失败，请稍后再试');
          });
      });
    });
  });
}

//辅助函数
function validateEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

function submitForm(formData, phpEndpoint, formType, modal) {
  const data = {
    nickname: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    formType: formType
  };
  console.log(data);
  fetch(phpEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      showResult(data, formType, modal);
    })
    .catch(error => {
      console.error('提交出错:', error);
      alert('提交出错，请稍后再试');
    });
}

function showResult(data, formType, modal) {
  // conseole.log(data);
  const formContainer = modal.querySelector('div');
  if (data.success) {
    formContainer.innerHTML = `
      <h3 style="text-align:center;margin-bottom:20px;color:#4e7cff;">提交成功！</h3>
      <p style="text-align:center;">感谢您预约${formType}，我们将通过邮件向您发送后续信息111。</p>
      <button class="close-success" style="display:block;width:100%;padding:10px;background-color:#4e7cff;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;margin-top:20px;">关闭</button>
    `;

    const closeButton = formContainer.querySelector('.close-success');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  } else {
    alert('提交失败: ' + data.message);
  }
}
//页面加载完成后初始化所有功能
document.addEventListener("DOMContentLoaded", () => {
  // 先执行基础脚本的功能

  // 初始化新增的互动功能
  initTechShowcase();
  initRealmSystem();
  initImageCarousel();
  initCountdown();
  initParallaxEffect();
  initPreorderForm();
});

document.addEventListener('DOMContentLoaded', function () {
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
        setTimeout(() => {
          const yOffset = -80; // 偏移量，给导航栏留出空间
          const y = targetContent.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      }
    });
  });

  // 为所有返回按钮添加点击事件
  const backButtons = document.querySelectorAll('.back-to-notes');
  backButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault(); // 防止默认链接行为

      // 找到游戏目标区域并滚动到那里，添加上方偏移
      const objectiveSection = document.querySelector('.main-objective');
      if (objectiveSection) {
        const yOffset = -80; // 偏移量，给导航栏留出空间
        const y = objectiveSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      // 可选：关闭当前打开的内容区域
      const parentContentArea = this.closest('.worldview-content-area');
      if (parentContentArea) {
        // 延迟一下关闭，这样用户可以看到滚动效果
        setTimeout(() => {
          parentContentArea.classList.remove('active');

          // 移除对应笔记卡片的active类
          const noteCards = document.querySelectorAll('.note-card');
          noteCards.forEach(card => {
            if (card.getAttribute('data-target') === parentContentArea.id) {
              card.classList.remove('active');
            }
          });
        }, 800);
      }
    });
  });
});