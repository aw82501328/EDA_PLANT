# 上海卫红实业有限公司网站

面向硬件研发团队、采购人员和 EDA 学员的中文网站，包含工程服务、培训服务、公司介绍、技术文章、硬件商城、购物车和订单查询。

## 本地启动

在项目目录中使用 Node.js 22 或更新版本运行以下命令。

```sh
npm run dev
```

打开 [本地预览](http://127.0.0.1:4173/)。如当前终端限制运行 npm，可直接运行 `node server.mjs`。站点以原生 HTML、CSS 和 JavaScript 实现，启动前无需安装依赖。

## 更新内容

| 文件 | 内容 |
| --- | --- |
| `public/data/company.js` | 公司简介、工程服务、代表项目、企业资质和咨询信息 |
| `public/data/customer-products.js` | 业务介绍第 05 节的客户产品、规格和功能 |
| `public/data/training.js` | 培训方向、授课方式、首页与培训页共用的轮播图片和教材 |
| `public/data/catalog.js` | 商品分类、规格、手册与价格配置 |
| `public/data/articles.js` | 文章正文、封面及关联商品编号 |
| `public/images/` | 公司前台、企业资质、培训现场、技术示意图和商品配图 |
| `public/datasheets/` | 0603 贴片陶瓷电容规格书 |

公司介绍、代表项目、发展历程与联系方式来自用户提供的《上海卫红实业有限公司业务介绍》。公司前台和培训现场使用用户提供的原图。企业资质使用从素材中裁出的两张展示图，原合图保存在 `source-assets/`。技术示意图使用 ImageGen 生成，商城使用示例商品数据。替换商品或文章时，保留已有 `sku` 和 `slug` 以维持详情页链接。

结算使用固定的预填收货资料。购物车和订单记录保存在当前浏览器（最多保留 50 笔订单），清除该站点的数据会清空记录。「我的订单」页位于 `/orders/`，订单详情页位于 `/order/?id=订单号`。

0603 示例商品编号为 `EP-MLCC0603`。阶梯价 `priceTiers` 按 `minQty` 从小到大配置，首档为 1 件，`unitPriceMicros` 以整数微元为单位。固定价商品的 `price` 仍以分为单位。购物车按同一商品的合并数量选档，每行四舍五入到分后再汇总。配置 `datasheet.file` 可打开和下载本地 PDF，`datasheet.preview` 选择对应的 EDA 预览模板。

## 图片生成

使用 Codex 内置 ImageGen 生成。将主图和文章封面压缩为 JPEG，将商品合成图按格裁成八张单品图，最终文件均位于 `public/images/`。

<details>
<summary>查看培训轮播示意图生成提示词</summary>

**课堂全景**。每张使用对应的主体描述和同一段风格约束。

- **training-wide-rear** — A rear-center wide-angle, eye-level photograph of a spacious adult computer training classroom. About 30 adult East Asian learners at five rows of simple tables, seen naturally from behind, scattered dark laptops on the desks; a broad aisle, white front wall and a muted blue display with abstract non-legible screen image. Daylight from windows along the left, ordinary contemporary Chinese training facility. Frame the whole room, no identifiable foreground individual.
- **training-wide-side** — A rear side-corner documentary wide-angle photograph showing nearly the entire floor plan of a broad technical training room, approximately 32 to 40 adult East Asian attendees seated at long shared tables across spaced rows. View across the room from slightly elevated back-right, mostly backs and small distant silhouettes. Large bright windows, white ceiling with rectangular lights, understated professional venue.
- **training-wide-center** — A full-room photograph from the back of a large seminar-style computer training hall seen down a central aisle, approximately 42 to 50 adult East Asian learners in clearly occupied rows on both sides, camera at natural standing height, tidy rows, plain off-white walls and small displays, broad realistic architecture. Faces and screens too distant to read.
- **training-wide-classroom** — A wide horizontal whole-room documentary view from a rear-left corner of a spacious modern lab classroom arranged in two banks of long desks, about 30 to 36 adult East Asian trainees distributed across the seats, photographed naturally from behind as a class. Muted daylight and overhead ordinary white lighting, restrained architectural lines, a distant simple front wall. Keep all screens indistinct.

Use case photorealistic-natural. Single realistic wide landscape 3:2 editorial scene for a Chinese adult technical training site. Realistic everyday architectural photography, 24–28mm lens feel with corrected verticals, no dramatic wide-angle warping. Spacious but plausible, realistic distribution and anatomy of people, neutral cool whites and grays, slightly muted saturated details. Entire group and room are the subject. Distant views only, no instructional closeups, no posed students, no individually identifiable portraits, no logos, no readable text, no watermark. Generic illustrative scene, do not imitate a real company or exact room.

**课堂细节**

- **training-stackup-demo** — Wide classroom documentary-style image of an EDA instructor viewed from the back and side, pointing to a large display with an abstract layered PCB cross-section diagram, small group of adult learners seen from behind at two rows of simple desks, clean ordinary electronics classroom with daylight, technical topic is HDI board stackup and layers.
- **training-routing-practice** — Over-the-shoulder documentary view of two adult learners using mice at adjacent laptop workstations during a PCB routing practice session, screens showing realistic abstract color-coded PCB traces and pads against unlabelled dark schematic backgrounds, natural technical training room, a small physical PCB and ruled notebook on the desk.
- **training-design-review** — Candid documentary-style top-oblique view of three adult trainees around a worktable in a PCB design class doing a design review. Show hands, shoulders, a small bare green circuit board, paper with abstract copper layers and via patterns, and a partially visible laptop, everyday training room with a soft slate-gray tabletop and window light.
- **training-lab-demo** — Documentary close view at a workshop classroom bench, adult instructor in a neutral long-sleeve shirt demonstrating hardware debug to an observing adult learner, subjects mostly framed at shoulder level, a blue populated PCB on an ESD mat, an oscilloscope and a neatly held probe illustrate electronics practical instruction, natural soft interior light.

Use case photorealistic-natural. Create an illustrative 3:2 horizontal photograph for a Chinese EDA training website. Neutral cool-gray palette with muted navy and PCB-green details, unstaged, credible small-group adult technical education, professional composition with main action near the center. Generic fictional classroom and learners only. Do not reconstruct any supplied photograph or imply this is a real company event. No school or company logos, captions, watermarks, brand marking, readable screen text, or close identifiable face portraits.

</details>

工程服务页的客户产品展示位于 `/services/#customer-products`。该部分的 18 张 ImageGen 示意图位于 `public/images/customer-products/`，图名与产品数据中的 `id` 对应。

<details>
<summary>查看客户产品示意图生成提示词</summary>

每张图使用同一前后文，中间加入对应产品的主体描述。

+Use case product-mockup. Create one wide landscape 3:2 photorealistic editorial product illustration for a Chinese electronics engineering portfolio.

- **cm03** — A compact almost square green Android system-on-module PCB, single charcoal square BGA in the central area, a few black memory components, gold fine castellated perimeter contacts, sparse layout, side profile visible
- **cm05** — A compact green rectangular LTE computer-on-module PCB with a low square silver RF shield, an unmarked black memory chip, two small antenna connectors, and gold perimeter pads, photographed diagonally
- **cm06** — A tiny square teal-green Android system-on-module PCB, one large square brushed silver shield centered, small dark chips at the edge, evenly spaced gold castellated contacts on four sides
- **m100** — A medium rectangular dark blue embedded LTE computer-on-module, two discrete black integrated circuits and one low rectangular RF shield, two rows of gold edge pads, dense components, shallow three-quarter angle
- **cm07** — A blue-green compact Android computer-on-module with a black processor package, two slim separate camera ribbon connectors along one edge and one small RF shield, gold castellated mounting pads
- **cm08** — A forest-green embedded LTE core board with a low rectangular brushed metal shielding can and warm amber fine-pitch FPC connectors, edge pads, compact rectangular shape, clearly distinct from a full-size developer board
- **dm600** — A deep blue embedded computing system-on-module, low square graphite main chip, discrete black memory packages, two narrow gold board-to-board connectors, dense but realistic professional electronics
- **dm8953** — A charcoal embedded LTE core module PCB, a pair of low silver shielding cans of different sizes on an oblong black substrate, neat matte gold edge pads and small surface-mount components
- **vending-machine** — A full-height compact self-service snack vending machine, translucent glass door displaying generic blank snack packages arranged on shelving, dark navy payment column with small blank reader, plain gray casing, slim floor-standing proportions
- **dot-matrix-printer** — A compact gray-black impact dot-matrix receipt printer, top-open paper path containing one sheet with visible tractor-feed perforations, sturdy professional enclosure, no printed words
- **thermal-printer** — A small matte charcoal countertop thermal receipt printer, smooth block shape, a narrow plain white receipt emerging from a clean upper slot, tiny green status indicator, no legible markings
- **yoga-5g-tablet** — A slim 13-inch dark gray tablet with an integrated fold-out kickstand in a three-quarter tabletop view, bright 16:10 display showing an abstract blue gradient wallpaper, optionally a slender detached stylus on the ground, generic device design, no logo
- **face-payment** — Two sizes of generic retail facial payment terminals shown together on a counter as one product family. One 10-inch touchscreen on an adjustable pedestal and one compact square four-inch terminal beside it. Each with visible small front camera, both screens muted blue with no text, no people
- **iris-lock** — A vertical modern zinc-alloy electronic front door lock on a short light gray door panel, dark touchscreen, two tiny camera lenses near the top, slim metal pull handle, polished but plausible unbranded industrial design
- **ar-safety-helmet** — A bright yellow industrial hard hat with a compact transparent fold-down optical display by the brim, small side-mounted thermal camera, a small headlamp and dark gray comms module on mounting rails. No person, centered in frame with generous margins
- **video-safety-helmet** — A white industrial worker hard hat with a single small dark camera module fixed above the front brim and a tiny thermal sensor aperture beside it. Low-key restrained industrial housing, no AR visor, no person, centered
- **digital-signage** — A slim upright freestanding indoor digital advertising display with wide portrait screen, brushed gray frame and floor base, abstract layered blue and lavender color panels on screen only, no type or numbers, physically plausible kiosk
- **queue-kiosk** — A compact floor-standing self-service queue ticket kiosk, tablet-sized angled touchscreen and distinct narrow thermal ticket slot below it with a small blank ticket emerging, subtle NFC reader on counter-height surface, matte gray enclosure, screen blue with abstract shapes

Isolate the complete subject in the center with generous negative space on light cool-gray matte studio background, professional neutral soft lighting and shadow, restrained gray, navy, and small warm metal accents. No logos, writing, numerals, watermarks, rulers, collage, or graphic overlay. Show a credible generic product of the stated type for illustration, without implying an exact branded model or matching a real customer's design.

</details>

<details>
<summary>查看图像生成提示词</summary>

**高密度 PCB 布线** · `service-hdi.jpg`

Use case: photorealistic-natural. Wide landscape 3:2 industrial editorial macro photograph to illustrate high density interconnect PCB layout for a Chinese electronics engineering site. A bare midnight-blue HDI board, photographed low at a diagonal, crisp fine differential-pair traces and dense copper/gold microvia fields fanning from a large unpopulated BGA pad array, main detail toward right, near-black navy shadows left. Cool controlled lab lighting, physically plausible copper and solder-mask texture, subtle warm gold, restrained palette. No text, logo, overlay, fabricated client identity or watermark. Illustrative engineering image only.

**SMT 焊点检测** · `service-smt.jpg`

Use case: photorealistic-natural. Wide 3:2 industrial editorial photograph illustrating SMT solder joint inspection. A close-up black microscope objective over a densely populated deep blue PCB in a neutral gray ESD workshop. Focus on a row of plausible shiny fine-pitch solder fillets around mounted surface-mount components. Cool slate-blue materials with warm metallic accents, soft clean lab lighting, truthful optical detail, professional quality. No people, text, logo, watermark, or claim to be a real facility.

**芯片封装课程** · `training-packaging.jpg`

Use case: photorealistic-natural. Wide 3:2 close-up editorial engineering image for the chip packaging section of a Chinese EDA training website. On a dark matte slate surface, show one open wire-bond package with a small central silicon die and fine gold wires fanning outward to the lead frame, next to a separate flip-chip silicon die tilted to reveal an orderly field of solder microbumps on its underside. Technical concepts shown as separate physical objects, with careful scale and restrained blue-gray and gold lighting. No text, no labels, no logos, no watermark. Illustrative use only.

**首页 PCB 主图** · `pcb-hero.jpg`

Use case: ads-marketing. Create a wide landscape 3:2 premium photorealistic macro photograph for a Chinese hardware engineering website hero. A real deep midnight navy multilayer PCB, densely intricate fine bright silver traces and solder joints plus accents of electric blue, a single large square matte graphite semiconductor mounted on the board at the right of center (center of chip around x=73%, y=51%). A cinematic oblique angle across the plane, sharp chip and finely detailed traces spreading towards right, top and bottom, softer in distance. The left 40% melts into near solid black-blue shadow for site text overlaid later, absolutely no rendered text or headings. Board fills the frame, realistic optical highlights, subtle cool indigo pin-lighting, no sci-fi glow or fantasy, no logos or watermarks. Sophisticated cool and dark industrial editorial photography, strong information-free negative space on the left.

**实验台** · `workbench.jpg`

Use case: photorealistic-natural. A wide 3:2 professional electronics hardware lab workbench photo for a Chinese electronics trade site's editorial and about pages. Close view from above at an oblique angle of a green experimental PCB on a gray ESD mat, small black precision hand tools, test probe and multimeter at far right, and a softly blurred oscilloscope in background, dramatic soft window lighting, cool navy gray shadows, subtle sage greens, realistic modest small engineering workshop. Visually clear main subject near center, clean framing. No humans, no logos or legible text, do not imply a particular real factory. Premium industrial editorial photography.

**PCB 打样文章** · `pcb-detail.jpg`

Use case: photorealistic-natural. Wide 3:2 industrial editorial photo for an article about checking PCB artwork before fabrication. Photorealistic, close overhead view of two overlapping bare matte deep-blue custom printed circuit board prototypes on a cool steel-gray work mat, delicate gold copper pads, numerous small vias, plated mounting holes and solder-mask openings, absolutely no mounted chips or other components. Crisp midtone lighting, disciplined low-contrast palette of blue gray, subtle gold details and rich material textures. Compose as a card thumbnail with readable subject centered, no text or numbers, no logo, no watermark.

**电源选型文章** · `power-detail.jpg`

Use case: photorealistic-natural. 3:2 wide editorial macro photograph for a hardware engineering article on selecting DC-DC buck power modules. Top oblique view of a compact blue switching regulator prototype board, a tactile dark gray square inductor and upright aluminum capacitors, fine copper terminals and a blurred probe at the edge. Muted sage-gray antistatic work surface, soft diffuse daytime lab light with realistic restrained color and low contrast, centered subject, premium technical magazine photography. No text, brand logos, watermarks, or diagrams.

**商品示意图** · `dev32.jpg`、`buck5.jpg`、`qfn32.jpg`、`dmm01.jpg`、`mcu04.jpg`、`uart3.jpg`、`cap10.jpg`、`iron60.jpg`

Use case: product-mockup. One wide 3:2 contact sheet photo of EIGHT different isolated hardware catalog demo products, exactly 4 equal columns by 2 equal rows. Each of the eight equal regions has a separate centered object with generous 20% internal white margin. All background seamless near-white (#f5f7fa), no cards, no grid lines, no text, labels, logos, borders or graphics. Clean ecommerce photography, soft shadows, oblique top-down photography consistent across all 8 objects. Row 1 in exact order from left: (1) rectangular black small microcontroller dev board with silver radio shield and two rows of long black pin headers; (2) blue rectangular step-down power module with a square dark inductor and small brass trimmer; (3) a single small square black 32-pin QFN integrated chip isolated on white; (4) a simple slim yellow handheld digital multimeter with black bezel and no cables. Row 2 in exact order: (5) a small wide blue microcontroller development board with one black chip and border of castellated holes; (6) a blue compact single USB to serial adapter board with a visible shiny USB Type-A connector; (7) a small group of five black cylindrical aluminum electrolytic capacitors with shiny circular silver tops; (8) a dark metallic handheld temperature-controlled soldering iron with its short isolated coil cord. Treat each cell as a separate photo, centered with padding so can crop along exact 4x2 grid boundaries. No extra products.

**0603 贴片陶瓷电容** · `mlcc0603.jpg`

Use case: product-mockup. Clean e-commerce macro product photograph of a single unmarked 0603 multilayer ceramic chip capacitor (MLCC), a tiny simple low rectangular tan ceramic cuboid with two distinct brushed matte silver metal terminations covering the two short ends and part of the top and sides. The central tan region and both terminals clearly visible in a shallow oblique three-quarter view, centered with generous margins on an uninterrupted near-white cool gray matte background (#eef2f6). Wide 4:3 product photograph, controlled soft light and plausible contact shadow. No text, rulers, leads, branding, graphics or additional components.

</details>
