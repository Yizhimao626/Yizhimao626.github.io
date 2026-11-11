(() => {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach((el) => io.observe(el));
})();

/* Case dialog: real screenshots gallery */
(() => {
  const CASES = {
    yunsun: {
      kicker: 'CASE / 01 — 企业官网',
      title: '云上新材料官网改版与 GEO 运营',
      link: 'https://www.yunsuncoating.com/',
      note: '线上可访问：yunsuncoating.com',
      points: [
        '10+ 页面与英文站重构，产品 / 应用 / 案例三层导航压为两级',
        '响应式断点覆盖 320–1920px，伪静态与目录权限加固',
        'GEO 体系：robots / sitemap / llms.txt / Open Graph / IndexNow',
        '7 平台内容矩阵，累计发布 100+ 篇技术内容'
      ],
      shots: [
        { src: 'assets/img/yunsun-products.jpg', cap: '产品中心' },
        { src: 'assets/img/yunsun-hero.jpg', cap: '首页首屏' },
        { src: 'assets/img/yunsun-full.jpg', cap: '首页整页长图' }
      ]
    },
    jiekx: {
      kicker: 'CASE / 02 — 品牌官网',
      title: '杰克熊拼豆大王品牌官网',
      link: '',
      note: '交付客户使用，未绑定公开域名；截图为交付版本。',
      points: [
        'PbootCMS 定制主题 jkx，覆盖产品 / 门店案例 / 加盟 / 新闻',
        '产品、案例、礼盒数据初始化脚本，打通图片上传链路',
        'FTP 整站发布脚本：文件比对 + 断点续传 + 备份排除',
        'sitemap 自动更新，运营人员可自行维护内容'
      ],
      shots: [
        { src: 'assets/img/jiekx-hero.jpg', cap: '首页首屏' },
        { src: 'assets/img/jiekx-join.jpg', cap: '加盟页' },
        { src: 'assets/img/jiekx-product.jpg', cap: '产品详情页' }
      ]
    }
  };

  const dlg = document.getElementById('caseDialog');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  const el = {
    kicker: document.getElementById('caseKicker'),
    title: document.getElementById('caseTitle'),
    img: document.getElementById('caseImg'),
    cap: document.getElementById('caseCap'),
    count: document.getElementById('caseCount'),
    points: document.getElementById('casePoints'),
    link: document.getElementById('caseLink'),
    note: document.getElementById('caseNote')
  };
  let cur = null;
  let idx = 0;

  const render = () => {
    const shot = cur.shots[idx];
    el.img.src = shot.src;
    el.img.alt = cur.title + ' — ' + shot.cap;
    el.cap.textContent = shot.cap;
    el.count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(cur.shots.length).padStart(2, '0');
  };

  const open = (key) => {
    const data = CASES[key];
    if (!data) return;
    cur = data;
    idx = 0;
    el.kicker.textContent = data.kicker;
    el.title.textContent = data.title;
    el.points.innerHTML = data.points.map((p) => '<li>' + p + '</li>').join('');
    if (data.link) {
      el.link.href = data.link;
      el.link.hidden = false;
    } else {
      el.link.hidden = true;
    }
    el.note.textContent = data.note || '';
    render();
    dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
  };

  const close = () => { document.documentElement.style.overflow = ''; };
  dlg.addEventListener('close', close);

  document.querySelectorAll('.shot[data-case]').forEach((btn) => {
    btn.addEventListener('click', () => open(btn.dataset.case));
  });

  dlg.querySelector('.prev').addEventListener('click', () => {
    if (!cur) return;
    idx = (idx - 1 + cur.shots.length) % cur.shots.length;
    render();
  });
  dlg.querySelector('.next').addEventListener('click', () => {
    if (!cur) return;
    idx = (idx + 1) % cur.shots.length;
    render();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') dlg.querySelector('.prev').click();
    if (e.key === 'ArrowRight') dlg.querySelector('.next').click();
  });
})();
