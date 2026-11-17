import { escapeHtml as html, icon } from './ui.js';

const previews = {
  'mlcc-0603': [
    {
      key: 'symbol', title: '引脚',
      drawing: `<svg class="preview-art" viewBox="0 0 240 180" role="img" aria-label="两端无极性电容符号，引脚 1 和 2">
        <g fill="none" stroke="#873e3a" stroke-width="3" stroke-linecap="round">
          <path d="M36 90h69m30 0h69M105 58v64m30-64v64"/>
          <circle cx="30" cy="90" r="6"/><circle cx="210" cy="90" r="6"/>
        </g>
        <g fill="#873e3a" font-family="monospace" font-size="18" text-anchor="middle">
          <text x="56" y="74">1</text><text x="184" y="74">2</text>
        </g>
      </svg>`,
    },
    {
      key: 'footprint', title: '焊盘',
      drawing: `<svg class="preview-art" viewBox="0 0 240 180" role="img" aria-label="两端 0603 焊盘示意，从左到右为 1 和 2">
        <path d="M0 90h240M120 0v180" stroke="#56677b" stroke-width=".7"/>
        <rect x="48" y="52" width="144" height="76" rx="5" fill="none" stroke="#ecb66f" stroke-width="2" stroke-dasharray="6 4"/>
        <g fill="#d68451" stroke="#ffd39c" stroke-width="1.5">
          <rect x="48" y="63" width="53" height="54" rx="3"/><rect x="139" y="63" width="53" height="54" rx="3"/>
        </g>
        <g fill="#211e25" font-family="monospace" font-size="16" text-anchor="middle">
          <text x="74.5" y="96">1</text><text x="165.5" y="96">2</text>
        </g>
      </svg>`,
    },
    {
      key: 'model', title: '3D 模型',
      drawing: `<div class="capacitor-model" aria-hidden="true">
        <b class="model-front">卫红EDA</b><b class="model-back"></b>
        <b class="model-top"></b><b class="model-bottom"></b>
        <b class="model-left"></b><b class="model-right"></b>
        <span class="model-axis model-axis-x"><span>X</span></span>
        <span class="model-axis model-axis-y"><span>Y</span></span>
        <span class="model-axis model-axis-z"><span>Z</span></span>
      </div>`,
    },
  ],
};

export function datasheetButton(product) {
  return product.datasheet?.file
    ? `<button type="button" class="button button-secondary datasheet-button" data-datasheet="${html(product.sku)}" aria-haspopup="dialog">${icon('file')} 数据手册</button>`
    : '<span class="datasheet-empty">暂无数据手册</span>';
}

function previewCard({ key, title, drawing }) {
  const model = key === 'model';
  return `<section class="manual-preview">
    <h3>${title}</h3>
    <div class="preview-stage preview-${key}" ${model ? 'tabindex="0" role="group" aria-label="3D 模型，正面标有卫红EDA，用方向键旋转"' : ''}>${drawing}</div>
    <div class="preview-controls" role="group" aria-label="${title}预览操作">
      ${model ? '<span class="preview-hint">拖动或用方向键旋转</span>' : ''}
      <button type="button" data-view="reset" aria-label="${title}复位">复位</button>
      <button type="button" data-view="out" aria-label="${title}缩小">${icon('minus')}</button>
      <button type="button" data-view="in" aria-label="${title}放大">${icon('plus')}</button>
    </div>
  </section>`;
}

function bindPreview(card) {
  const stage = card.querySelector('.preview-stage');
  const isModel = stage.classList.contains('preview-model');
  let scale = 1;
  let pitch = -28;
  let yaw = -34;
  let pointer;

  function updateView() {
    stage.style.setProperty('--preview-scale', scale);
    if (isModel) {
      stage.style.setProperty('--model-pitch', `${pitch}deg`);
      stage.style.setProperty('--model-yaw', `${yaw}deg`);
    }
  }

  card.querySelector('.preview-controls').addEventListener('click', (event) => {
    const control = event.target.closest('[data-view]');
    if (!control) return;
    if (control.dataset.view === 'reset') {
      scale = 1;
      pitch = -28;
      yaw = -34;
    } else {
      const step = control.dataset.view === 'in' ? .25 : -.25;
      scale = Math.max(.5, Math.min(2, scale + step));
    }
    updateView();
  });

  if (!isModel) return;
  stage.addEventListener('keydown', (event) => {
    const rotation = {
      ArrowLeft: [0, -10], ArrowRight: [0, 10], ArrowUp: [-10, 0], ArrowDown: [10, 0],
    }[event.key];
    if (!rotation) return;
    event.preventDefault();
    pitch += rotation[0];
    yaw += rotation[1];
    updateView();
  });
  stage.addEventListener('pointerdown', (event) => {
    if (pointer || !event.isPrimary || event.button !== 0) return;
    stage.setPointerCapture(event.pointerId);
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointermove', (event) => {
    if (pointer?.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!dx && !dy) return;
    stage.classList.add('is-dragging');
    pitch -= dy * .7;
    yaw += dx * .7;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    updateView();
  });
  stage.addEventListener('lostpointercapture', () => {
    pointer = undefined;
    stage.classList.remove('is-dragging');
  });
}

function openDatasheet(product, trigger) {
  const { file, preview } = product.datasheet;
  const sections = previews[preview] ?? [];
  const dialog = document.createElement('dialog');
  dialog.className = 'manual-dialog';
  dialog.setAttribute('aria-labelledby', 'manual-title');
  dialog.innerHTML = `
    <div class="manual-head">
      <div><h2 id="manual-title">数据手册</h2><p>${html(product.model ?? product.sku)} · 规格资料</p></div>
      <button class="manual-close" type="button" aria-label="关闭数据手册" autofocus>${icon('close')}</button>
    </div>
    <div class="manual-body">
      <div class="manual-file">
        <div class="manual-file-name">${icon('file')}<span><strong>规格书 PDF</strong><small>${html(file.split('/').at(-1))}</small></span></div>
        <div class="button-row">
          <a class="button button-secondary" href="${html(file)}" download>${icon('download')} 下载</a>
          <a class="button button-primary" href="${html(file)}" target="_blank" rel="noopener">打开 PDF ${icon('arrow')}</a>
        </div>
      </div>
      ${sections.length ? `<div class="manual-previews">${sections.map(previewCard).join('')}</div>` : ''}
    </div>`;

  dialog.querySelector('.manual-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    dialog.remove();
    trigger.focus({ preventScroll: true });
  });
  for (const card of dialog.querySelectorAll('.manual-preview')) bindPreview(card);
  document.body.append(dialog);
  dialog.showModal();
}

export function bindDatasheets(main, products) {
  for (const trigger of main.querySelectorAll('[data-datasheet]')) {
    trigger.addEventListener('click', () => openDatasheet(products.get(trigger.dataset.datasheet), trigger));
  }
}
