/* ============================================================
   真实数据种子 (seed) — 官方来源第一梯队呈现
   说明：所有条目默认 verified = "待确认"，由使用者亲自核实。
   官方/权威 URL 已尽量采用真实地址；部分采用官方机构主域名
   （深链路径待你核实后替换）。来源类型：
     新法动态 → 仅限官方发布
     合规更新/行业动态/地缘政治/处罚案例 → 来源类型多样，官方优先
   ============================================================ */

/* 数据版本：每次更新数据集请 +1，工作台会据此自动合并最新内容 */
window.DATA_VERSION = 3;

window.BOARD_DATA = {

  /* ---------------- 合规更新 (第2块) ---------------- */
  updates: [
    {
      id: "upd-001",
      title: "欧盟 AI Office 上线 AI 法案实操指引与合规问答",
      region: "欧盟",
      category: "监管指引",
      sourceType: "官方发布",
      source: "欧盟委员会 (European Commission)",
      url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      date: "2024-08-01",
      summary: "欧盟委员会发布 AI Act 适用范围、义务时间线与合规路径说明，企业可据此评估机器人/AI 产品是否落入高风险类别及对应义务。",
      verified: "待确认"
    },
    {
      id: "upd-002",
      title: "上海律协发文解读《欧盟人工智能法案》对企业出海影响",
      region: "中国",
      category: "机构解读",
      sourceType: "机构解读",
      source: "上海律师协会 (lawyers.org.cn)",
      url: "https://www.lawyers.org.cn/",
      date: "2024-03-15",
      summary: "从出海合规角度解析 AI Act 对智能硬件/机器人企业的数据、认证与主体责任影响，提出应对建议。",
      verified: "待确认"
    },
    {
      id: "upd-003",
      title: "Kennedys 律所发布 AI Act 合规时间线解读",
      region: "国际",
      category: "律所文章",
      sourceType: "律所文章",
      source: "Kennedys Law",
      url: "https://www.kennedyslaw.com/",
      date: "2024-04-10",
      summary: "梳理 AI Act 各条款生效节点与企业应对时间表，便于合规排期。",
      verified: "待确认"
    },
    {
      id: "upd-004",
      title: "欧盟法院维持对 Google 24.2 亿欧元反垄断罚款",
      region: "欧盟",
      category: "新闻动态",
      sourceType: "新闻媒体",
      source: "新华社 / 媒体报道",
      url: "https://www.chinadailyasia.com/",
      date: "2024-09-10",
      summary: "欧洲法院驳回 Google 上诉，重申滥用市场支配地位认定，对平台型科技企业的反垄断执法具标杆意义。",
      verified: "待确认"
    },
    {
      id: "upd-005",
      title: "舟山海关依据《出口管制法》通报违规出口处罚案例",
      region: "中国",
      category: "监管指引",
      sourceType: "官方发布",
      source: "海关总署 (customs.gov.cn)",
      url: "http://www.customs.gov.cn/",
      date: "2024-06-20",
      summary: "海关通报出口管制合规案例，提示两用物项与敏感技术出口须依法申领许可，违规将受处罚。",
      verified: "待确认"
    },
    {
      id: "upd-006",
      title: "英国 HMRC 达成对俄制裁违规最大金额补缴和解",
      region: "英国",
      category: "监管指引",
      sourceType: "官方发布",
      source: "英国税务海关总署 (GOV.UK)",
      url: "https://www.gov.uk/",
      date: "2025-01-15",
      summary: "企业因违反俄罗斯制裁遭巨额补缴与和解，凸显制裁合规对跨境供应链的重要性。",
      verified: "待确认"
    }
  ],

  /* ---------------- 新法动态 ---------------- */
  regulations: [
    {
      id: "reg-001",
      title: "欧盟《人工智能法案》(Regulation (EU) 2024/1689) 正式生效",
      country: "欧盟",
      type: "数据",
      sourceType: "官方发布",
      source: "欧盟官方公报 EUR-Lex",
      url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
      date: "2024-08-01",
      summary: "全球首部综合性 AI 监管法案，2024-08-01 生效，按风险分级设定义务；高风险系统（含部分 AI 机器人产品）须满足数据治理、透明度与合规评估要求。",
      verified: "待确认"
    },
    {
      id: "reg-002",
      title: "欧盟《机械法规》(Regulation (EU) 2023/1230) 发布，2027-01-14 适用",
      country: "欧盟",
      type: "产品",
      sourceType: "官方发布",
      source: "欧盟官方公报 EUR-Lex",
      url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1230",
      date: "2023-06-29",
      summary: "取代原机械指令，强化安全部件、数字化技术文件与 AI 集成要求，对带智能功能的机器人整机及安全组件影响重大。",
      verified: "待确认"
    },
    {
      id: "reg-003",
      title: "工信部印发《人形机器人创新发展指导意见》",
      country: "中国",
      type: "产品",
      sourceType: "官方发布",
      source: "工业和信息化部 (miit.gov.cn)",
      url: "https://www.miit.gov.cn/",
      date: "2023-11-01",
      summary: "提出到 2025 年初步建立人形机器人创新体系、2027 年产业规模化等目标，明确整机、部组件、软件等攻关方向。",
      verified: "待确认"
    },
    {
      id: "reg-004",
      title: "七部门联合印发《关于推动未来产业创新发展的实施意见》",
      country: "中国",
      type: "产品",
      sourceType: "官方发布",
      source: "工业和信息化部等七部门",
      url: "https://www.miit.gov.cn/",
      date: "2024-01-18",
      summary: "将人形机器人等列为未来产业标志性产品，提出重点推进技术突破与产业化应用。",
      verified: "待确认"
    },
    {
      id: "reg-005",
      title: "《中华人民共和国两用物项出口管制条例》公布实施",
      country: "中国",
      type: "进出口",
      sourceType: "官方发布",
      source: "商务部 / 国务院 (gov.cn)",
      url: "http://www.mofcom.gov.cn/",
      date: "2024-12-01",
      summary: "整合完善两用物项出口管制制度，对含先进制造/传感器/AI 等技术的机器人产品出口提出许可与合规要求。",
      verified: "待确认"
    },
    {
      id: "reg-006",
      title: "美国 NIST 发布《AI 风险管理框架》(AI RMF 1.0)",
      country: "美国",
      type: "数据",
      sourceType: "官方发布",
      source: "美国国家标准与技术研究院 (NIST)",
      url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf",
      date: "2023-01-26",
      summary: "面向机构的可信 AI 风险管理自愿框架（治理/映射/测量/管理），为含 AI 的机器人产品合规提供方法论。",
      verified: "待确认"
    },
    {
      id: "reg-007",
      title: "美国 NIST 发布《生成式 AI 风险管理框架概要》(AI 600-1)",
      country: "美国",
      type: "数据",
      sourceType: "官方发布",
      source: "美国国家标准与技术研究院 (NIST)",
      url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
      date: "2024-07-26",
      summary: "针对生成式 AI 的风险与建议措施，适用于搭载生成式 AI 能力的机器人/智能终端。",
      verified: "待确认"
    },
    {
      id: "reg-008",
      title: "欧盟《AI 法案》通用人工智能（GPAI）行为准则正式适用",
      country: "欧盟",
      type: "数据",
      sourceType: "官方发布",
      source: "欧盟委员会 (European Commission)",
      url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      date: "2026-08-02",
      summary: "GPAI 行为准则进入适用阶段，面向基础模型提供方提出透明度、版权与安全风险缓解义务，对含大模型能力的机器人/智能终端企业提出合规要求。",
      verified: "待确认"
    }
  ],

  /* ---------------- 行业动态 ---------------- */
  industry: [
    {
      id: "ind-001",
      title: "Figure AI 完成 10 亿美元融资，估值约 390 亿美元",
      region: "美国",
      category: "融资并购",
      sourceType: "新闻媒体",
      source: "Reuters",
      url: "https://www.reuters.com/",
      date: "2025-09-01",
      summary: "人形机器人明星企业 Figure 获大额融资，刷新行业估值，资本加速涌入具身智能赛道。",
      verified: "待确认"
    },
    {
      id: "ind-002",
      title: "人民日报关注人形机器人产业融资热潮",
      region: "中国",
      category: "融资并购",
      sourceType: "新闻媒体",
      source: "人民网",
      url: "http://finance.people.com.cn/",
      date: "2025-07-29",
      summary: "报道国内人形机器人企业密集融资与产业化进展，反映政策与资本双轮驱动。",
      verified: "待确认"
    },
    {
      id: "ind-003",
      title: "Tesla 推进 Optimus 人形机器人量产计划",
      region: "美国",
      category: "产品发布",
      sourceType: "新闻媒体",
      source: "Tesla / 媒体报道",
      url: "https://www.tesla.com/",
      date: "2025-06-15",
      summary: "Optimus 在工厂内部署测试，量产时间表与降本路径成为行业关注焦点。",
      verified: "待确认"
    },
    {
      id: "ind-004",
      title: "国内科技巨头加速布局具身智能与机器人",
      region: "中国",
      category: "战略合作",
      sourceType: "新闻媒体",
      source: "媒体报道 (36氪等)",
      url: "https://www.36kr.com/",
      date: "2025-05-20",
      summary: "多家头部科技企业设立机器人/具身智能团队，产业生态快速扩张。",
      verified: "待确认"
    },
    {
      id: "ind-005",
      title: "2026 年人形机器人进入规模化交付，多家厂商宣布量产节点",
      region: "全球",
      category: "产品发布",
      sourceType: "新闻媒体",
      source: "Reuters / 人民网",
      url: "https://www.reuters.com/",
      date: "2026-03-12",
      summary: "行业进入「量产元年」，Figure、Tesla Optimus 及国内厂商陆续公布交付与降本计划，供应链（谐波减速器、丝杠、传感器）受益。",
      verified: "待确认"
    }
  ],

  /* ---------------- 地缘政治 ---------------- */
  geo: [
    {
      id: "geo-001",
      title: "欧盟对中国电动车加征反补贴关税正式实施",
      region: "欧盟/中国",
      topic: "贸易战",
      impact: "严重",
      sourceType: "官方发布",
      source: "欧盟委员会贸易总司",
      url: "https://policy.trade.ec.europa.eu/",
      date: "2024-10-30",
      summary: "对自华进口纯电动车征收最终反补贴税（比亚迪 17%、吉利 18.8%、上汽 35.3%、特斯拉 7.8%），影响相关制造与供应链布局。",
      verified: "待确认"
    },
    {
      id: "geo-002",
      title: "美国持续收紧对华先进技术与半导体出口管制",
      region: "美国/中国",
      topic: "出口管制",
      impact: "严重",
      sourceType: "新闻媒体",
      source: "BIS / 媒体报道",
      url: "https://www.bis.gov/",
      date: "2025-01-10",
      summary: "多轮管制规则更新，涉及 AI 芯片、EDA 与先进制造设备，间接影响智能机器人核心部件供应。",
      verified: "待确认"
    },
    {
      id: "geo-003",
      title: "俄罗斯强化数据本地化与制裁应对立法",
      region: "俄罗斯",
      topic: "数据主权",
      impact: "中等",
      sourceType: "官方发布",
      source: "俄罗斯联邦 (152-ФЗ / Roskomnadzor)",
      url: "https://rkn.gov.ru/",
      date: "2025-07-01",
      summary: "152-ФЗ 要求公民数据境内存储，2024 年底强化处罚、2025 年进一步收紧，出海企业须评估数据合规。",
      verified: "待确认"
    },
    {
      id: "geo-004",
      title: "欧盟拟将反补贴措施延伸至电动车零部件与电池供应链",
      region: "欧盟/中国",
      topic: "贸易战",
      impact: "中等",
      sourceType: "官方发布",
      source: "欧盟委员会贸易总司",
      url: "https://policy.trade.ec.europa.eu/",
      date: "2026-02-18",
      summary: "欧委会就扩大反补贴税覆盖范围征询意见，拟将范围延伸至电池、关键零部件，影响在欧设厂与本地化采购决策。",
      verified: "待确认"
    }
  ],

  /* ---------------- 处罚案例 ---------------- */
  cases: [
    {
      id: "cas-001",
      title: "欧盟法院维持 Google 24.2 亿欧元购物搜索反垄断罚款",
      country: "欧盟",
      penaltyType: "反垄断",
      authority: "欧盟委员会 / 欧洲法院",
      amount: "€2.42 billion",
      sourceType: "官方发布",
      source: "欧洲法院 (CURIA)",
      url: "https://curia.europa.eu/",
      date: "2024-09-10",
      summary: "法院确认 Google 滥用比价购物市场支配地位，驳回上诉，确立大型平台反垄断执法标杆。",
      verified: "待确认"
    },
    {
      id: "cas-002",
      title: "欧盟法院撤销 Google 14.9 亿欧元 AdSense 反垄断罚款",
      country: "欧盟",
      penaltyType: "反垄断",
      authority: "欧盟普通法院",
      amount: "€1.49 billion (撤销)",
      sourceType: "新闻媒体",
      source: "媒体报道 / CURIA",
      url: "https://curia.europa.eu/",
      date: "2024-09-18",
      summary: "普通法院以程序与认定瑕疵撤销原罚款，体现反垄断处罚的事实与证据门槛。",
      verified: "待确认"
    },
    {
      id: "cas-003",
      title: "欧洲法院裁定 Apple 须补缴 130 亿欧元爱尔兰税款",
      country: "欧盟",
      penaltyType: "税务",
      authority: "欧洲法院",
      amount: "€13 billion",
      sourceType: "官方发布",
      source: "欧洲法院 (CURIA)",
      url: "https://curia.europa.eu/",
      date: "2024-09-10",
      summary: "终结长达十年的国家援助争议，确认爱尔兰税收优惠构成不当补贴。",
      verified: "待确认"
    },
    {
      id: "cas-004",
      title: "Haas Automation 就出口管制违规支付 290 万美元和解金",
      country: "美国",
      penaltyType: "出口管制",
      authority: "美国商务部 BIS",
      amount: "$2.9 million",
      sourceType: "官方发布",
      source: "美国商务部工业与安全局 (BIS)",
      url: "https://www.bis.gov/",
      date: "2025-01-15",
      summary: "企业因未经授权出口受控物项与记录违规达成和解协议，提示机电设备出口合规要求。",
      verified: "待确认"
    },
    {
      id: "cas-005",
      title: "舟山海关依《出口管制法》对违规出口作出 40 万元罚款",
      country: "中国",
      penaltyType: "出口管制",
      authority: "海关总署",
      amount: "¥400,000",
      sourceType: "官方发布",
      source: "海关总署 (customs.gov.cn)",
      url: "http://www.customs.gov.cn/",
      date: "2024-06-20",
      summary: "通报未经许可出口管制物项案例，强调两用物项出口许可义务。",
      verified: "待确认"
    },
    {
      id: "cas-006",
      title: "欧盟对华电动车征收最终反补贴税（BYD 17% 等）",
      country: "欧盟",
      penaltyType: "反倾销/反补贴",
      authority: "欧盟委员会",
      amount: "关税 17%–35.3%",
      sourceType: "官方发布",
      source: "欧盟委员会贸易总司",
      url: "https://policy.trade.ec.europa.eu/",
      date: "2024-10-30",
      summary: "实施期 5 年的反补贴措施，直接影响在欧销售与本地化生产决策。",
      verified: "待确认"
    }
  ]
};
