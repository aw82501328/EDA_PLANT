export const company = {
  name: '上海卫红实业有限公司',
  brandName: '上海卫红',
  englishName: 'Shanghai Weihong Industrial Co., Ltd',
  headline: ['高阶 PCB 设计', 'EDA 工程服务'],
  summary: '承接高密度 PCB 设计与 DDR、PDN 仿真，提供工程师驻场，并协助完成制板与 SMT 贴片交付。',
  heroImage: '/images/pcb-hero.jpg',
  reception: {
    src: '/images/weihong-reception.png', width: 846, height: 909,
    alt: '上海卫红实业有限公司前台，背景墙上有公司名称和标识', caption: '上海卫红公司前台',
  },
  introduction: '上海卫红实业有限公司于 2014 年在上海松江成立，从 PCB 制板和 SMT 贴片代理服务起步，逐步拓展到高阶 PCB 设计、仿真、工程师驻场及 EDA 培训。团队服务过手机、平板、车载设备和物联网等项目。',
  credentials: [
    {
      title: '高新技术企业证书',
      image: {
        src: '/images/weihong-high-tech-certificate.png', width: 695, height: 507,
        alt: '上海卫红实业有限公司高新技术企业证书',
      },
      facts: [
        ['证书编号', 'GR202531006006'],
        ['发证时间', '2025 年 12 月 25 日'],
        ['有效期', '自发证日起三年'],
      ],
    },
    {
      title: '软件著作权登记证书',
      image: {
        src: '/images/weihong-software-copyright-certificates.png', width: 719, height: 584,
        alt: '上海卫红实业有限公司软件著作权登记证书展示',
      },
    },
  ],
  founder: {
    name: '李卫国',
    role: '创始人',
    credentials: ['上海交通大学研究生', '集成电路专业高级工程师'],
    highlights: ['二十余年 EDA 从业经验', '精通高通 / MTK 平台', '清华大学出版社合作著作'],
    paragraphs: [
      '上海交通大学研究生，集成电路专业高级工程师。2004 年进入手机硬件研发行业，深耕 EDA 设计二十余年，精通高通、MTK 平台的硬件架构与设计规则。',
      '熟练操作 Cadence、PADS 等各类 EDA 软件，以及 CAD、CAM 等设计与制造工具，具备扎实的工程实践功底。',
      '与清华大学出版社合作出版《Cadence 高速 PCB 设计》一书，系统分享高速 PCB 设计方法与多年积累的实战经验。',
    ],
  },
  focus: [
    { icon: 'circuit', title: 'PCB 设计与仿真', description: '承接高密度互连（HDI）PCB 设计，按项目需要开展 DDR 与 PDN 仿真。', link: '/services/#capabilities' },
    { icon: 'chip', title: 'EDA 设计培训', description: '通过「易元互连」开展企业新员工和零基础学员培训，结合线下面授、视频课程与辅导。', link: '/training/' },
    { icon: 'tool', title: '工程师驻场', description: '设计资料需要留在客户现场时，可按项目或服务周期安排工程师驻场。', link: '/services/#cooperation' },
    { icon: 'layers', title: '制板与 SMT 交付', description: '制作制板与贴片生产文件，配合板厂完成工程确认，并协调贴片技术沟通。', link: '/services/#delivery' },
  ],
  milestones: [
    { year: 2014, description: '公司成立，开展 PCB 制板与 SMT 贴片代理服务。' },
    { year: 2017, description: '为手机、平板 ODM 企业提供设计、仿真和委托培训，创建「易元互连」培训品牌。' },
    { year: 2019, description: '进入汽车行业，提供项目外包设计与工程师驻场服务。' },
    { year: 2020, description: '拓展集成电路版图设计培训。' },
    { year: 2025, description: '与封测厂和芯片设计企业合作开展引线键合（WB）及倒装芯片（FC）封装设计与培训，取得高新技术企业证书。' },
  ],
  engineering: {
    title: 'EDA 工程服务',
    summary: '面向手机、平板、车载设备和物联网等硬件项目，承接高阶 HDI 板设计、信号与电源完整性仿真，并配合制板和 SMT 贴片交付。',
    homeSummary: '面向手机、平板、车载设备和物联网项目，可按项目外包或工程师驻场合作，从 PCB 设计推进到生产交付。',
    layoutImage: {
      src: '/images/service-hdi.jpg', width: 1536, height: 1024,
      alt: '高密度电路板上的阵列焊盘、过孔与细密走线', caption: '高密度 PCB 布线示意图',
    },
    inspectionImage: {
      src: '/images/service-smt.jpg', width: 1536, height: 1024,
      alt: '显微镜物镜下的贴装芯片引脚和焊点', caption: 'SMT 焊点检测示意图',
    },
    capabilities: [
      { icon: 'circuit', title: '高阶 PCB 设计', description: '使用 Cadence 和 PADS 开展高密度互连（HDI）板设计，熟悉高通、MTK 和展讯平台的叠层与布局布线要求。' },
      { icon: 'chip', title: 'DDR 与 PDN 仿真', description: '按项目需求使用 ADS、Sigrity 等工具，评估 DDR 信号完整性和电源分配网络（PDN）。' },
      { icon: 'users', title: '工程师驻场', description: '按项目或服务周期派驻工程师，在客户现场与研发团队配合完成设计。' },
      { icon: 'layers', title: '制板与 SMT 交付', description: '整理制板与贴片文件，配合板厂完成工程问题确认（EQ），并与贴片厂沟通生产要求。' },
    ],
    cooperation: [
      { icon: 'file', title: '项目外包', description: '可外发设计资料时，由卫红团队按确认的项目范围承接设计，并按需求配合仿真与生产文件交付。' },
      {
        icon: 'briefcase',
        title: '驻场服务',
        description: '设计资料因保密要求或内部加密系统需要留在客户现场时，可按项目或约定周期派驻工程师，在现场完成设计。',
        details: [
          ['阶段性支持', '业务介绍列有企业招聘审批期间采用 1–2 年驻场支持的情况。'],
          ['合作示例', '上海哈曼、上海李尔、上海联想。'],
        ],
      },
    ],
    delivery: [
      '归档设计资料，整理制板文件和 SMT 贴片生产文件。',
      '向板厂提交制板文件，配合确认生产前的工程问题（EQ）。',
      '向贴片厂提交生产文件，配合完成贴片环节的技术沟通。',
    ],
  },
  projects: [
    { title: '4G 智能手表', platform: '高通 MSM8909', board: '10 层 2 阶 HDI', tool: 'PADS' },
    { title: '三防 GPS 测试仪', platform: '高通 MSM8940', board: '8 层 2 阶 HDI', tool: 'PADS' },
    { title: 'MT6797 物联网模块', platform: 'MTK6797', board: '10 层 2 阶 HDI', tool: 'PADS' },
    { title: 'SDM660 物联网模块', platform: '高通 SDM660', board: '12 层 2 阶 HDI', tool: 'PADS' },
    { title: 'UDS710 智能眼镜', platform: '展讯 UDS710', board: '10 层 2 阶 HDI', tool: 'PADS' },
    { title: '三星 Exynos 8895 VR 眼镜', platform: '三星 Exynos 8895', board: '10 层 3 阶 HDI', tool: 'PADS' },
    { title: '高通 Flight 无人机', platform: '高通 Flight', board: '10 层任意阶 HDI', tool: 'PADS' },
    { title: 'MT6762 POS 机', platform: 'MTK6762', board: '10 层 2 阶 HDI', tool: 'Cadence' },
    { title: '高通 SDM439 手机', platform: '高通 SDM439', board: '10 层 2 阶 HDI', tool: 'Cadence' },
    { title: 'MT6739 手机', platform: 'MTK6739', board: '10 层 2 阶 HDI', tool: 'PADS' },
    { title: '高通 710 5G 手机', platform: '高通 710', board: '10 层任意阶 HDI', tool: 'Cadence' },
    { title: '天玑 820 5G 手机', platform: 'MTK 天玑 820', board: '10 层 3 阶 HDI', tool: 'Cadence' },
    { title: '骁龙 865 5G 平板', platform: '高通骁龙 865', board: '12 层任意阶 HDI', tool: 'Cadence' },
    {
      title: '骁龙 895 5G 平板',
      platform: '天玑 820',
      board: '14 层任意阶 HDI',
      tool: 'Cadence',
      note: '项目名称和芯片平台均按业务介绍原文列示，平台待核对。',
    },
  ],
  projectExamples: [
    {
      title: '大陆汽车 PCB 设计与 SI 仿真',
      description: '为大陆集团提供汽车项目的 PCB 设计与信号完整性（SI）仿真服务。业务介绍记录了 2021 年 12 月 23 日编制的《LPDDR4 SI 仿真报告》。',
    },
    {
      title: '元器件 3D 库与整板建模',
      description: '为客户建立元器件 3D 模型库，并生成贴装元器件后的整块电路板 3D 效果图。',
    },
  ],
  contact: {
    address: '上海市松江区高技路 205 号凯富科技园 9 号楼 A 座 201 室',
    officialAccount: '上海卫红EDA',
  },
};
