export const training = {
  brand: '易元互连',
  title: 'EDA 设计培训',
  summary: '以手机、平板高阶板项目为案例，从 EDA 工具操作学到生产文件输出。面向零基础本专科毕业生和企业在职工程师。',
  homeSummary: '「易元互连」以高阶 PCB 项目为例，提供线下面授、线上视频与辅导，以及企业定制培训。',
  photos: [
    {
      src: '/images/training-practice.jpg', width: 1706, height: 1279,
      alt: '学员在教室内使用电脑练习 PCB 布线', caption: 'PCB 设计上机实训',
    },
    {
      src: '/images/training-classroom.png', width: 825, height: 600,
      alt: '培训教室里的学员面向投影屏幕上课', caption: '培训课堂 · 图片原署名「菁英EDA」',
    },
    {
      src: '/images/training-wide-rear.jpg', width: 1440, height: 960,
      alt: '从后排看向宽敞教室内成排就坐的学员', caption: '教室后排全景 · 培训场景示意图',
    },
    {
      src: '/images/training-wide-side.jpg', width: 1440, height: 960,
      alt: '从教室侧后方看到多排长桌和学员', caption: '教室侧面全景 · 培训场景示意图',
    },
    {
      src: '/images/training-wide-center.jpg', width: 1440, height: 960,
      alt: '大教室的中央通道两侧坐着多排学员', caption: '培训大厅全景 · 培训场景示意图',
    },
    {
      src: '/images/training-wide-classroom.jpg', width: 1440, height: 960,
      alt: '宽敞的培训教室内，两侧长桌坐着学员', caption: '机房课堂全景 · 培训场景示意图',
    },
    {
      src: '/images/training-stackup-demo.jpg', width: 1440, height: 960,
      alt: '讲师面向学员演示 PCB 叠层图', caption: 'PCB 叠层讲解 · 培训场景示意图',
    },
    {
      src: '/images/training-routing-practice.jpg', width: 1440, height: 960,
      alt: '两名学员在相邻电脑上练习 PCB 布线', caption: '上机布线练习 · 培训场景示意图',
    },
    {
      src: '/images/training-design-review.jpg', width: 1440, height: 960,
      alt: '小组围在桌边查看电路板和设计图纸', caption: '小组设计检查 · 培训场景示意图',
    },
    {
      src: '/images/training-lab-demo.jpg', width: 1440, height: 960,
      alt: '学员在实验台旁观看电路板调试演示', caption: '硬件调试演示 · 培训场景示意图',
    },
  ],
  background: {
    intro: '培训由卫红设计团队参与，结合项目中的叠层、走线和交付要求讲解设计方法。',
    platforms: { icon: 'chip', title: '手机芯片平台', description: '结合不同芯片平台的高阶板案例，讲解布局布线与设计约束。', items: ['高通', 'MTK', '展讯'] },
    team: { icon: 'briefcase', title: '培训团队', description: '团队主要成员有手机硬件研发与高阶板设计外包经验。', items: ['手机 ODM', '品牌公司'] },
    industries: { icon: 'layers', title: '项目覆盖行业', description: '课程依托的设计业务覆盖消费电子和行业设备。', items: ['手机', '平板', '电脑', '汽车', '物联网', '打印机', '无人机', '航测', '医疗'] },
  },
  courses: [
    {
      icon: 'circuit',
      title: '手机高阶板 PCB 设计',
      description: '基于 Cadence Allegro 与 PADS 平台，覆盖 HDI 叠构、布局布线与生产文件输出，采用高通、MTK、展讯等平台的手机、平板真实项目案例教学。',
      detail: '围绕高通、MTK、展讯等平台的手机、平板高密度互连（HDI）板案例，按工程顺序学习叠构规划、布局布线和交付前检查。',
      tools: ['Cadence Allegro', 'PADS'],
      learningPath: [
        { title: 'EDA 工具入门', description: '熟悉 PCB 工程、板框、器件封装和常用编辑操作。' },
        { title: 'HDI 叠构与布局', description: '了解层叠与过孔结构，按功能模块规划器件位置。' },
        { title: '高速布线', description: '结合高密度板案例，学习布线约束与关键信号的走线思路。' },
        { title: '设计检查与生产文件输出', description: '检查设计规则（DRC），核对 Gerber 和钻孔等生产文件。' },
      ],
    },
    {
      icon: 'tool',
      title: 'DDR / PDN 仿真',
      description: '基于 ADS 与 Sigrity 的信号完整性、电源完整性仿真方法，结合公司设计业务中的真实项目数据开展实训。',
      detail: '结合实际项目数据，使用 ADS 与 Sigrity 学习 DDR 信号完整性和电源分配网络（PDN）的仿真方法。',
    },
    {
      icon: 'chip',
      title: '集成电路版图设计',
      description: '2019 年起与上海硅知识产权交易中心合作开展，面向半导体企业在职工程师的版图设计培训。',
      detail: '面向半导体企业在职工程师，围绕集成电路版图设计流程展开。2019 年起与上海硅知识产权交易中心合作开展。',
    },
    {
      icon: 'layers',
      title: 'WB / FC 封装设计',
      description: '2025 年起与封测厂、芯片设计企业合作，开展引线键合（WB）与倒装芯片（FC）封装设计培训。',
      detail: '围绕引线键合（WB）与倒装芯片（FC）两类封装的互连方式与设计展开。2025 年起与封测厂、芯片设计企业合作开展。',
      image: {
        src: '/images/training-packaging.jpg', width: 1536, height: 1024,
        alt: '左侧为带金色键合引线的开盖封装，右侧为带凸点阵列的芯片裸片', caption: '引线键合与倒装芯片封装示意图',
      },
    },
  ],
  modes: [
    { icon: 'users', title: '线下集中面授', description: '面向零基础本专科毕业生的集中培训，从软件操作到项目实战，帮助新人系统进入 EDA 行业。' },
    { icon: 'video', title: '线上视频 + 晚课辅导', description: '先通过录播视频自主学习，再参加晚间在线答疑，适合在校和刚毕业的学员。' },
    { icon: 'briefcase', title: '企业委托定制', description: '为客户新员工定制培训内容，2017 年起为手机、平板 ODM 企业提供委托培训。' },
  ],
  milestones: [
    { year: 2014, description: '卫红在上海松江成立，从事 PCB 制板和 SMT 贴片代理服务。' },
    { year: 2017, description: '创建「易元互连」培训品牌，为手机、平板 ODM 企业提供设计与委托培训。' },
    { year: 2019, description: '与上海硅知识产权交易中心合作开展集成电路版图设计培训，学员多来自中芯国际、台积电、华虹、华为等半导体企业。' },
    { year: 2020, description: '与清华大学出版社合作出版《Cadence 高速 PCB 设计——基于手机高阶板的案例分析与实现》，作为线上、线下培训教材。' },
    { year: 2021, description: '与「张飞实战电子」合作开发线上课程。首期主要面向在校和刚毕业的本专科学员，先看课程视频，再于 19:30–21:30 参加在线互动辅导。' },
    { year: 2025, description: '与封测厂、芯片设计企业合作，开展 WB 与 FC 封装设计培训。' },
  ],
  textbook: {
    title: '《Cadence 高速 PCB 设计——基于手机高阶板的案例分析与实现》',
    englishTitle: 'Cadence High-Speed PCB Design: Case Analysis and Implementation Based on Mobile HDI Board',
    intro: '根据多年线下讲课内容整理编写，与清华大学出版社合作出版，作为线上、线下培训的统一教材。',
    specs: [
      ['出版社', '清华大学出版社'],
      ['编著', '李卫国、张彬、林超文'],
      ['内容特点', '系统讲解 Cadence Allegro 核心知识，基于手机高阶板案例展开，配套学习资源帮助快速上手。'],
      ['授课讲师', '教材编著者与拥有 15 年以上研发经验的设计工程师。'],
    ],
  },
  outcomes: {
    intro: '易元互连为准备进入 EDA 行业的学员提供项目实训，也为在职工程师提供集成电路版图设计培训。结业学员带着完整的高阶板项目经验走向岗位，就业前景广阔。',
    industries: {
      title: '结业学员就业行业',
      items: ['手机', '汽车', '半导体', '电源', '物联网'],
      notes: [
        'EDA 设计技能可应用于多类硬件产品，结业学员可关注 PCB 布局布线、硬件测试和研发支持等岗位，相关工作涉及手机主板、汽车电子、电源模块、物联网模组和芯片评估板等产品。',
        '随着消费电子、汽车电子与半导体产业的持续发展，企业对熟练掌握 Cadence Allegro、PADS 的设计人才需求稳定增长。结业学员已完成真实高阶板项目全流程训练，求职时更能展示动手能力；积累经验后还可向高速 PCB 设计、信号完整性仿真等方向进阶，成长为资深设计工程师或设计主管。',
      ],
      image: {
        src: '/images/training-outcomes-fab-building.webp', width: 1200, height: 600,
        alt: '半导体晶圆制造工厂的大楼外观', caption: '半导体工厂大楼示意图',
      },
    },
    companies: {
      title: '在职学员所在企业',
      items: ['中芯国际', '台积电', '华虹', '华为'],
      notes: [
        '集成电路版图设计培训与上海硅知识产权交易中心合作开展，参加培训的在职学员多来自上述企业。',
        '在半导体产业快速发展、产能持续扩充的带动下，版图设计人才长期受到市场欢迎，职业前景稳定向好。在职学员通过系统化培训补齐流程与方法上的短板，在承担核心项目、竞聘关键岗位时更具优势，长远可成长为资深版图工程师、版图主管，或转向芯片设计等上游岗位。',
      ],
      image: {
        src: '/images/training-outcomes-fab.webp', width: 1200, height: 800,
        alt: '半导体晶圆厂洁净车间内的生产设备和自动搬运轨道', caption: '半导体工厂内部示意图',
      },
    },
  },
};
