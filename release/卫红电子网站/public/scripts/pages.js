import { company } from '../data/company.js';
import { customerProductGroups } from '../data/customer-products.js';
import { categories, products, productsBySku } from '../data/catalog.js';
import { articles } from '../data/articles.js';
import { training as trainingData } from '../data/training.js';
import { bindPurchaseForms, buyPanel, productFacts, productRow } from './catalog-ui.js';
import { bindFacetPanel, chipsBarHTML, computeShopView, facetPanelHTML, shopUrl, sortBarHTML } from './facets.js';
import { bindDatasheets, datasheetButton } from './datasheet.js';
import { bindTrainingCarousel, trainingCarousel } from './training-carousel.js';
import {
  articleCard, breadcrumbs, categoryName, categoryUrl, emptyState, escapeHtml as html,
  icon, linkArrow, productCard, searchForm, sectionHeading,
} from './ui.js';

const params = () => new URLSearchParams(location.search);
const goShop = '<a class="button button-primary" href="/shop/">浏览商城</a>';
const articleGrid = (entries) => `<div class="article-grid">${entries.map(articleCard).join('')}</div>`;
const productGrid = (entries) => `<div class="product-grid">${entries.map(productCard).join('')}</div>`;
const focusCard = ({ icon: glyph, title, description, details }) => `<div class="focus-card"><span class="category-icon">${icon(glyph)}</span>
  <h3>${html(title)}</h3><p>${html(description)}</p>
  ${details ? `<dl class="focus-card-details">${details.map(([label, text]) => `<div><dt>${html(label)}</dt><dd>${html(text)}</dd></div>`).join('')}</dl>` : ''}
</div>`;
const focusGrid = (entries) => `<div class="focus-grid">${entries.map(focusCard).join('')}</div>`;

function editorialFigure({ src, width, height, alt, caption }, { eager = false } = {}) {
  return `<figure class="editorial-figure">
    <img src="${html(src)}" width="${width}" height="${height}" alt="${html(alt)}"
      ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <figcaption><span>${html(caption)}</span></figcaption>
  </figure>`;
}

function credentialFigure({ title, image: { src, width, height, alt }, facts }) {
  return `<figure class="credential-figure">
    <img src="${html(src)}" width="${width}" height="${height}" alt="${html(alt)}" loading="lazy" decoding="async">
    <figcaption>
      <h3>${html(title)}</h3>
      ${facts ? `<dl class="credential-facts">${facts.map(([label, value]) =>
        `<div><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join('')}</dl>` : ''}
    </figcaption>
  </figure>`;
}

function contactDetails({ officialAccount, address }) {
  return `<dl class="contact-list">
    <div><dt>微信公众号</dt><dd>${html(officialAccount)}</dd></div>
    <div><dt>公司地址</dt><dd>${html(address)}</dd></div>
  </dl>`;
}

function customerProductCard({ id, title, customer, summary, facts }) {
  return `<article class="customer-product-card">
    <figure class="customer-product-image">
      <img src="/images/customer-products/${html(id)}.jpg" width="960" height="640" alt="${html(title)}产品示意图" loading="lazy" decoding="async">
      <figcaption>产品示意图</figcaption>
    </figure>
    <div class="customer-product-body">
      <h4>${html(title)}</h4>
      ${customer ? `<p class="customer-product-client">${html(customer)}</p>` : ''}
      <p>${html(summary)}</p>
      <details>
        <summary aria-label="${html(title)}规格与功能">规格与功能 ${icon('chevron')}</summary>
        <dl>${facts.map(([label, value]) => `<div><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join('')}</dl>
      </details>
    </div>
  </article>`;
}

function customerProductShowcase() {
  return `<section class="customer-showcase" aria-labelledby="customer-products">
    <div class="section-heading"><h2 id="customer-products" tabindex="-1">客户产品展示</h2></div>
    <p class="customer-showcase-intro">以下为上海卫红参与设计的部分客户产品。规格与功能整理自公司业务介绍，配图为产品示意图。</p>
    <nav class="customer-showcase-nav" aria-label="客户产品分类">
      ${customerProductGroups.map(({ id, title }) => linkArrow(html(title), `#${id}`)).join('')}
    </nav>
    ${customerProductGroups.map(({ id, title, products }) => `
      <section class="customer-product-group" aria-labelledby="${id}">
        <h3 id="${id}" tabindex="-1">${html(title)}</h3>
        <div class="customer-product-grid">${products.map(customerProductCard).join('')}</div>
      </section>`).join('')}
  </section>`;
}

export function home(main) {
  const { engineering } = company;
  main.innerHTML = `
    <section class="hero">
      <img class="hero-image" src="${company.heroImage}" alt="" fetchpriority="high">
      <div class="hero-shade"></div>
      <div class="wrap hero-inner">
        <p class="hero-kicker"><span></span>${html(company.name)}</p>
        <h1>${company.headline.map((line) => `<span>${html(line)}</span>`).join('')}</h1>
        <p class="hero-summary">${html(company.summary)}</p>
        <div class="button-row">
          <a class="button button-primary" href="/services/">了解工程服务 ${icon('arrow')}</a>
          <a class="button button-ghost-light" href="/shop/">浏览商城 ${icon('cart')}</a>
        </div>
      </div>
    </section>
    <section class="home-section home-engineering">
      <div class="wrap">
        ${sectionHeading(html(engineering.title), linkArrow('查看服务与案例', '/services/'))}
        <p class="home-engineering-summary">${html(engineering.homeSummary)}</p>
        ${focusGrid(engineering.capabilities)}
      </div>
    </section>
    <section class="home-section home-training">
      <div class="wrap">
        <div class="home-training-feature">
          ${trainingCarousel(trainingData.photos)}
          <div>
            <h2>EDA 设计培训</h2>
            <p class="page-intro">${html(trainingData.homeSummary)}</p>
            <div class="button-row">
              <a class="button button-secondary" href="/training/#training-courses">查看培训方向 ${icon('arrow')}</a>
            </div>
          </div>
        </div>
        ${focusGrid(trainingData.courses)}
      </div>
    </section>
    <section class="home-section home-articles">
      <div class="wrap">
        ${sectionHeading('技术分享', linkArrow('全部文章', '/learn/'))}
        ${articleGrid(articles)}
      </div>
    </section>
    <section class="home-section home-products">
      <div class="wrap">
        ${sectionHeading('精选商品', linkArrow('进入商城', '/shop/'))}
        ${productGrid(products.slice(0, 4))}
      </div>
    </section>`;
  bindTrainingCarousel(main);
}

export function about(main) {
  const { contact, credentials, founder, reception } = company;
  main.innerHTML = `<div class="wrap inner-page">
    ${breadcrumbs([['关于我们']])}
    <section class="about-intro">
      <div>
        <p class="eyebrow">${html(company.englishName)}</p>
        <h1>${html(company.name)}</h1>
        <p class="page-intro">${html(company.introduction)}</p>
        <div class="button-row">
          <a class="button button-primary" href="/services/">了解工程服务 ${icon('arrow')}</a>
          <a class="button button-secondary" href="/services/#projects">查看代表项目</a>
        </div>
      </div>
      ${editorialFigure(reception, { eager: true })}
    </section>
    <section class="focus-section">
      ${sectionHeading('创始人介绍')}
      <div class="founder-card">
        <div class="founder-identity">
          <span class="founder-avatar">${icon('users')}</span>
          <h3>${html(founder.name)}</h3>
          <p class="founder-role">${html(founder.role)}</p>
          <ul class="founder-credentials" role="list">${founder.credentials.map((item) => `<li>${html(item)}</li>`).join('')}</ul>
        </div>
        <div class="founder-bio">
          ${founder.paragraphs.map((paragraph) => `<p>${html(paragraph)}</p>`).join('')}
          <ul class="founder-highlights" role="list">${founder.highlights.map((item) => `<li>${icon('check')}${html(item)}</li>`).join('')}</ul>
        </div>
      </div>
    </section>
    <section class="focus-section">
      ${sectionHeading('公司业务')}
      <div class="focus-grid">${company.focus.map(({ title, description, icon: glyph, link }) => `
        <div class="focus-card"><span class="category-icon">${icon(glyph)}</span>
          <h3>${html(title)}</h3><p>${html(description)}</p>${link ? linkArrow('了解详情', link) : ''}</div>`).join('')}
      </div>
    </section>
    <section id="credentials" class="focus-section">
      ${sectionHeading('企业资质')}
      <div class="credential-panel">
        ${credentials.map(credentialFigure).join('')}
      </div>
    </section>
    <section class="focus-section">
      ${sectionHeading('发展历程')}
      <ol class="timeline">${company.milestones.map(({ year, description }) => `
        <li><time datetime="${year}">${year}</time><p>${html(description)}</p></li>`).join('')}
      </ol>
    </section>
    <section class="focus-section">
      ${sectionHeading('联系我们')}
      ${contactDetails(contact)}
    </section>
  </div>`;
}

export function services(main) {
  const { contact, engineering, projects, projectExamples } = company;
  const { layoutImage } = engineering;
  main.innerHTML = `
    <section class="hero service-hero" aria-labelledby="services-title">
      <img class="hero-image" src="${html(layoutImage.src)}" width="${layoutImage.width}" height="${layoutImage.height}" alt="${html(layoutImage.alt)}" fetchpriority="high">
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="wrap hero-inner">
        ${breadcrumbs([[engineering.title]])}
        <h1 id="services-title">${html(engineering.title)}</h1>
        <p class="hero-summary">${html(engineering.summary)}</p>
        <div class="button-row">
          <a class="button button-primary" href="#service-contact">工程咨询 ${icon('arrow')}</a>
          <a class="button button-ghost-light" href="#projects">查看代表项目</a>
          <a class="button button-ghost-light" href="#customer-products">客户产品展示</a>
        </div>
        <p class="service-hero-caption">${html(layoutImage.caption)}</p>
      </div>
    </section>
    <div class="wrap service-content">
      <section aria-labelledby="capabilities">
        <div class="section-heading"><h2 id="capabilities" tabindex="-1">工程能力</h2></div>
        ${focusGrid(engineering.capabilities)}
      </section>
      <section aria-labelledby="cooperation">
        <div class="section-heading"><h2 id="cooperation" tabindex="-1">合作方式</h2></div>
        <div class="cooperation-grid">${engineering.cooperation.map(focusCard).join('')}</div>
      </section>
      <section class="service-delivery" aria-labelledby="delivery">
        <div>
          <h2 id="delivery" tabindex="-1">从设计到生产交付</h2>
          <ol>${engineering.delivery.map((step) => `<li>${html(step)}</li>`).join('')}</ol>
        </div>
        ${editorialFigure(engineering.inspectionImage)}
      </section>
      <section aria-labelledby="projects">
        <div class="section-heading"><h2 id="projects" tabindex="-1">代表项目</h2>${linkArrow('查看客户产品展示', '#customer-products')}</div>
        <div class="project-grid">${projects.map(({ title, platform, board, tool, note }) => `
          <article class="project-card service-project">
            <h3>${html(title)}</h3>
            <dl>
              <div><dt>芯片平台</dt><dd>${html(platform)}</dd></div>
              <div><dt>板层与 HDI 规格</dt><dd>${html(board)}</dd></div>
              <div><dt>设计工具</dt><dd>${html(tool)}</dd></div>
            </dl>
            ${note ? `<p class="service-project-note">${html(note)}</p>` : ''}
          </article>`).join('')}</div>
        <section class="project-examples" aria-labelledby="project-examples">
          <h3 id="project-examples">仿真与 3D 建模案例</h3>
          <div class="cooperation-grid">${projectExamples.map(({ title, description }) => `
            <article class="project-card">
              <h4>${html(title)}</h4>
              <p>${html(description)}</p>
            </article>`).join('')}</div>
        </section>
      </section>
      ${customerProductShowcase()}
      <section class="inquiry-panel" aria-labelledby="service-contact">
        <div>
          <h2 id="service-contact" tabindex="-1">工程咨询</h2>
          <p>关注公众号，咨询项目外包、仿真、工程师驻场和生产交付。</p>
        </div>
        ${contactDetails(contact)}
      </section>
    </div>`;
}

export function training(main) {
  const { contact } = company;
  const { background, courses, milestones, modes, outcomes, photos, textbook } = trainingData;
  const [pcbCourse, simulationCourse, layoutCourse, packagingCourse] = courses;

  main.innerHTML = `
    <section class="page-hero" aria-labelledby="training-title">
      <img class="hero-image" src="/images/pcb-detail.jpg" width="1200" height="800" alt="PCB 设计示意图，展示蓝色印制电路板的焊盘与走线" fetchpriority="high">
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="wrap">
        ${breadcrumbs([['培训服务']])}
        <div class="page-hero-content">
          <p class="eyebrow">「${html(trainingData.brand)}」培训品牌</p>
          <h1 id="training-title">${html(trainingData.title)}</h1>
          <p class="training-hero-lead">手机高阶板 PCB 实战</p>
          <p class="page-hero-summary">${html(trainingData.summary)}</p>
          <div class="button-row">
            <a class="button button-primary" href="#training-courses">查看培训方向 ${icon('arrow')}</a>
            <a class="button button-ghost-light" href="#training-contact">培训咨询</a>
          </div>
          <a class="training-hero-outcomes" href="#training-outcomes">查看学员去向 ${icon('arrow')}</a>
        </div>
      </div>
    </section>
    <div class="wrap training-content">
      <section aria-labelledby="training-background">
        <h2 class="training-heading" id="training-background">依托真实设计业务</h2>
        <p class="training-background-intro">${html(background.intro)}</p>
        <div class="training-card-grid">${[background.platforms, background.team, background.industries].map(({ icon: glyph, title, description, items }) => `
          <article class="focus-card"><span class="category-icon">${icon(glyph)}</span>
            <h3>${html(title)}</h3><p>${html(description)}</p>
            <ul class="training-tools" aria-label="${html(title)}" role="list">${items.map((item) => `<li>${html(item)}</li>`).join('')}</ul>
          </article>`).join('')}
        </div>
      </section>
      <section aria-labelledby="training-courses">
        <h2 class="training-heading" id="training-courses" tabindex="-1">培训方向</h2>
        <article class="training-feature">
          <div class="training-feature-intro">
            <span class="category-icon">${icon(pcbCourse.icon)}</span>
            <h3>${html(pcbCourse.title)}</h3>
            <p>${html(pcbCourse.detail)}</p>
            <ul class="training-tools" aria-label="使用的 EDA 工具" role="list">${pcbCourse.tools.map((tool) => `<li>${html(tool)}</li>`).join('')}</ul>
          </div>
          <div>
            <h4 class="training-path-heading">PCB 学习路径</h4>
            <ol class="training-path" role="list">${pcbCourse.learningPath.map(({ title, description }) => `
              <li><div><strong>${html(title)}</strong><p>${html(description)}</p></div></li>`).join('')}
            </ol>
          </div>
        </article>
        <div class="training-card-grid training-specialties">${[simulationCourse, layoutCourse].map(({ icon: glyph, title, detail }) => `
          <article class="focus-card"><span class="category-icon">${icon(glyph)}</span>
            <h3>${html(title)}</h3><p>${html(detail)}</p></article>`).join('')}
        </div>
        <article class="focus-card training-packaging">
          <div>
            <span class="category-icon">${icon(packagingCourse.icon)}</span>
            <h3>${html(packagingCourse.title)}</h3>
            <p>${html(packagingCourse.detail)}</p>
          </div>
          ${editorialFigure(packagingCourse.image)}
        </article>
      </section>
      <section aria-labelledby="training-modes">
        <h2 class="training-heading" id="training-modes" tabindex="-1">授课方式</h2>
        <div class="training-card-grid training-modes">${modes.map(({ icon: glyph, title, description }) => `
          <article class="focus-card"><span class="category-icon">${icon(glyph)}</span>
            <h3>${html(title)}</h3><p>${html(description)}</p></article>`).join('')}
        </div>
      </section>
      <section class="training-photos-section" aria-labelledby="training-photos">
        <h2 class="training-heading" id="training-photos" tabindex="-1">培训现场</h2>
        ${trainingCarousel(photos)}
      </section>
      <section class="training-book" aria-labelledby="training-book-heading">
        <div class="training-book-title">
          <h2 class="training-heading" id="training-book-heading" tabindex="-1">培训教材</h2>
          ${icon('file')}
          <h3>${html(textbook.title)}</h3>
          <p lang="en">${html(textbook.englishTitle)}</p>
        </div>
        <div class="training-book-details">
          <p>${html(textbook.intro)}</p>
          <dl>${textbook.specs.map(([name, value]) => `<div><dt>${html(name)}</dt><dd>${html(value)}</dd></div>`).join('')}</dl>
        </div>
      </section>
      <section class="training-outcomes" aria-labelledby="training-outcomes">
        <h2 id="training-outcomes" tabindex="-1">学员去向</h2>
        <p class="training-outcomes-intro">${html(outcomes.intro)}</p>
        <div class="training-outcomes-grid">${[outcomes.industries, outcomes.companies].map(({ title, items, notes, image }) => `
          <article class="training-outcomes-card">
            <div class="training-outcomes-copy">
              <h3>${html(title)}</h3>
              <ul class="training-tools" aria-label="${html(title)}" role="list">${items.map((item) => `<li>${html(item)}</li>`).join('')}</ul>
              ${notes.map((note) => `<p>${html(note)}</p>`).join('')}
            </div>
            ${editorialFigure(image)}
          </article>`).join('')}
        </div>
      </section>
      <section aria-labelledby="training-history">
        <h2 class="training-heading" id="training-history">培训发展历程</h2>
        <ol class="timeline training-timeline" role="list">${milestones.map(({ year, description }) => `
          <li><time datetime="${year}">${year}</time><p>${html(description)}</p></li>`).join('')}
        </ol>
      </section>
      <section class="inquiry-panel" aria-labelledby="training-contact">
        <div>
          <h2 id="training-contact" tabindex="-1">报名与咨询</h2>
          <p>关注公众号，咨询课程、开班安排和企业定制培训。</p>
        </div>
        ${contactDetails(contact)}
      </section>
    </div>`;
  bindTrainingCarousel(main);
}

export function learn(main) {
  main.innerHTML = `<div class="wrap inner-page">
    ${breadcrumbs([['技术分享']])}
    <div class="page-heading"><h1>技术分享</h1><p class="page-intro">面向硬件研发的设计检查、调试流程和器件选型。</p></div>
    ${articleGrid(articles)}
  </div>`;
}

export function article(main) {
  const entry = articles.find(({ slug }) => slug === params().get('slug'));
  if (!entry) {
    main.innerHTML = `<div class="wrap inner-page">${emptyState('找不到这篇文章', '请从技术分享页面选择文章。', '<a class="button button-primary" href="/learn/">查看全部文章</a>')}</div>`;
    return;
  }
  document.title = `${entry.title} · ${company.name}`;
  main.innerHTML = `<div class="wrap inner-page">
    ${breadcrumbs([['技术分享', '/learn/'], [entry.title]])}
    <article class="reading">
      <div class="article-meta"><span>${entry.category}</span><span>${entry.minutes} 分钟阅读</span></div>
      <h1>${html(entry.title)}</h1>
      <p class="page-intro">${html(entry.summary)}</p>
      <img class="reading-cover${entry.imageType === 'product' ? ' reading-cover-product' : ''}" src="${entry.image}" alt="${html(entry.imageAlt)}">
      <div class="prose">${entry.sections.map(({ heading, paragraphs }) => `
        <section><h2>${html(heading)}</h2>${paragraphs.map((paragraph) => `<p>${html(paragraph)}</p>`).join('')}</section>`).join('')}
        ${entry.references?.length ? `<section class="article-references">
          <h2>参考资料</h2>
          <ul>${entry.references.map(([title, url]) => `<li><a href="${html(url)}">${html(title)}</a></li>`).join('')}</ul>
        </section>` : ''}
      </div>
    </article>
    <section class="related-section">
      ${sectionHeading('文中相关商品', linkArrow('浏览商城', '/shop/'))}
      ${productGrid(entry.related.map((sku) => productsBySku.get(sku)).filter(Boolean))}
    </section>
  </div>`;
}

const listingUrl = (query, category, sub, sort = 'default') => html(shopUrl({ query, category, sub, sort }));

export function shop(main, refreshCount) {
  const query = (params().get('q') ?? '').trim();
  const requestedCategory = params().get('category');
  const category = categories.some(({ id }) => id === requestedCategory) ? requestedCategory : '';
  const subs = category
    ? [...new Set(products.filter((item) => item.category === category && item.subcategory).map((item) => item.subcategory))]
    : [];
  const requestedSub = (params().get('sub') ?? '').trim();
  const sub = subs.includes(requestedSub) ? requestedSub : '';
  const view = computeShopView(products, { query, category, sub, searchParams: params() });
  const orderedCategories = [...categories.filter(({ id }) => id === 'components'), ...categories.filter(({ id }) => id !== 'components')];
  const filters = [{ id: '', name: '全部商品' }, ...orderedCategories];
  const crumbs = [['硬件商城', '/shop/']];
  if (category) crumbs.push([categoryName(category), listingUrl(query, category, '', view.sort)]);
  if (sub) crumbs.push([sub]);
  const context = query ? `“${html(query)}”的搜索结果` : [sub, categoryName(category)].filter(Boolean).join(' · ') || '全部商品';
  main.innerHTML = `
    <section class="page-hero shop-hero" aria-labelledby="shop-title">
      <img class="hero-image" src="/images/shop-hero.webp" width="1860" height="846" alt="硬件产品示意图，展示开发板、降压模块、芯片、电容和数字万用表" fetchpriority="high">
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="wrap">
        ${breadcrumbs(crumbs)}
        <div class="page-hero-content">
          <h1 id="shop-title">硬件商城</h1>
          <p class="page-hero-summary">浏览开发板、功能模块、元器件和研发工具。</p>
          <div class="button-row">
            <a class="button button-primary" href="#shop-catalog">浏览商品 ${icon('arrow')}</a>
            <a class="button button-ghost-light" href="/cart/">查看购物车 ${icon('cart')}</a>
          </div>
        </div>
      </div>
    </section>
    <div class="wrap inner-page">
      <section class="catalog-controls" id="shop-catalog" aria-label="搜索与分类" tabindex="-1">
        ${searchForm({ query, category })}
        <nav class="filter-links" aria-label="商品分类">${filters.map(({ id, name }) => `
          <a href="${listingUrl(query, id, '', view.sort)}"${category === id ? ' aria-current="page"' : ''}>${name}</a>`).join('')}
        </nav>
        ${subs.length ? `<nav class="filter-links filter-sub" aria-label="商品子分类">
          <a href="${listingUrl(query, category, '', view.sort)}"${sub ? '' : ' aria-current="page"'}>全部子分类</a>
          ${subs.map((entry) => `<a href="${listingUrl(query, category, entry, view.sort)}"${sub === entry ? ' aria-current="page"' : ''}>${html(entry)}</a>`).join('')}
        </nav>` : ''}
      </section>
      ${facetPanelHTML(view)}
      ${chipsBarHTML(view)}
      <div class="results-label">
        <span>${context}</span>
        <div class="results-tools"><span>共 ${view.result.length} 件</span>${sortBarHTML(view)}</div>
      </div>
      ${view.result.length ? `<div class="catalog-list">${view.result.map(productRow).join('')}</div>` : emptyState('没有找到匹配商品', '请核对名称、型号或编号，或者清除当前筛选。', '<a class="button button-secondary" href="/shop/">查看全部商品</a>')}
    </div>`;
  bindFacetPanel(main.querySelector('.facet-panel'), view, () => shop(main, refreshCount));
  bindPurchaseForms(main, productsBySku, refreshCount);
  bindDatasheets(main, productsBySku);
}

export function product(main, refreshCount) {
  const item = productsBySku.get(params().get('sku'));
  if (!item) {
    main.innerHTML = `<div class="wrap inner-page">${emptyState('找不到这件商品', '请从硬件商城选择其他商品。', goShop)}</div>`;
    return;
  }
  document.title = `${item.name} · ${company.name}`;
  const related = articles.filter((entry) => entry.related.includes(item.sku));
  main.innerHTML = `<div class="wrap inner-page">
    ${breadcrumbs([['硬件商城', '/shop/'], [categoryName(item.category), categoryUrl(item.category)], [item.name]])}
    <section class="product-detail">
      <div class="detail-image"><img src="${item.image}" alt="${html(item.name)}示意图"></div>
      <div class="detail-copy">
        <div class="eyebrow">${categoryName(item.category)}</div>
        <h1>${html(item.name)}</h1>
        <p class="sku">${html(item.model ?? item.sku)}</p>
        <p>${html(item.description)}</p>
        ${buyPanel(item)}
        <div class="detail-actions">${datasheetButton(item)}${linkArrow('查看购物车', '/cart/')}</div>
      </div>
    </section>
    <section class="related-section" aria-labelledby="spec-title">
      <h2 id="spec-title">商品规格</h2>
      ${productFacts(item, 'specs')}
    </section>
    ${related.length ? `<section class="related-section">${sectionHeading('相关技术文章')}${articleGrid(related)}</section>` : ''}
  </div>`;

  bindPurchaseForms(main, productsBySku, refreshCount);
  bindDatasheets(main, productsBySku);
}
