// 一次性脚本：将本次新增条目累积追加到 digest.json（按 item.id 去重，禁止覆盖历史）
// 运行日：2026-10-11
const fs = require('fs');
const P = 'C:/Users/MOVA/WorkBuddy/2026-07-30-16-24-33/regulation-workbench/assets/digest.json';
const TODAY = '2026-10-11';

let db = { updated: TODAY, items: [] };
try {
  const raw = fs.readFileSync(P, 'utf8');
  const parsed = JSON.parse(raw);
  if (parsed && Array.isArray(parsed.items)) db = parsed;
} catch (e) {
  console.log('WARN: 读取失败或非法 JSON，视为空数组 ->', e.message);
}
const before = db.items.length;
const existingIds = new Set(db.items.map(e => e && e.item && e.item.id));

const NEW = [
  // ================= regulations =================
  {
    key: 'regulations',
    item: {
      id: 'auto-20261011-01',
      title: '上海市市场监管局发布《人形机器人数据集管理规范》等 10 项上海市地方标准（沪市监标准〔2026〕203号）',
      country: '中国',
      region: '上海',
      type: '地方标准 / 数据合规',
      sourceType: '官方发布',
      source: '上海市市场监督管理局',
      url: 'https://scjgj.sh.gov.cn/912/20261009/2c984ad6a0c9d61b01a11e32d65e09a0.html',
      date: TODAY,
      summary: '上海市市场监督管理局批准发布《人形机器人数据集管理规范》等 10 项上海市地方标准（文号沪市监标准〔2026〕203号，批准日期 2026-09-30，官网于 2026-10-09 公开）。其中《人形机器人数据集管理规范》是国内首个聚焦人形机器人训练数据集质量与治理的地方标准，覆盖数据采集、标注、脱敏、版本管理与合规留痕，与人形机器人全生命周期"身份证"赋码（工信部平台已覆盖 100+ 企业、2.8 万余台）形成衔接。涉外视角：地方标准虽非强制性国标，但在政府采购、示范应用与场景开放中常作为准入与补贴前置条件；外资企业及中外合资主体在上海布局具身智能业务时，应同步满足该数据集规范与跨法域数据合规（PIPL/GDPR）要求，训练数据跨境流动需单独评估。原文发布日期 2026-10-09，按检索日收录。',
      verified: '待确认'
    }
  },

  // ================= updates =================
  {
    key: 'updates',
    item: {
      id: 'auto-20261011-02',
      title: 'RoboticsReports 发布《2026 年 10 月机器人伦理与政策 FAQ》：可溯源问答，厘清欧盟 AI Act 当前义务与高风险判定',
      country: '欧盟 / 美国',
      region: '全球',
      category: '监管指引 / 合规实务',
      sourceType: '权威解读（行业媒体，附官方来源引用）',
      source: 'RoboticsReports (AI & Robotics Policy)',
      url: 'https://roboticsreports.com/ethics-and-policy-robotics-faq-for-october-2026-source-checked-answers-to-common-questions',
      date: TODAY,
      summary: 'RoboticsReports 于 2026 年 10 月发布"机器人伦理与政策 FAQ"，逐条引述欧委会、NIST、ISO、UNESCO 等官方来源，回答机器人从业者当月最关切的合规问题：①欧盟 AI Office 与成员国主管机关自 2026-08-02 起执法，覆盖禁止性实践、AI 交互与合成内容透明度、GPAI 义务；②当 AI 作为产品安全法下的安全组件时，系统即属高风险，须完成风险管理、技术文件、日志、人工监督、合格评定与上市后监测方可投放欧盟；仓库机械臂遇人停机、带 AI 避障的清洁机器人均可能落入；③ISO 13482:2014 仅覆盖移动侍从/体力辅助/载人三类个人护理机器人，不涵盖语言控制与开放世界导航，FDIS 修订版仍在推进；④无人机 Part 108 BVLOS 提案仍处提案阶段，需个案豁免；⑤欧盟高风险机器人 AI 须依第 73 条报告严重事件。涉外视角：这是出口欧盟团队的"当月合规自查清单"，建议将其与 9-11 起适用的 CRA 漏洞 24 小时通报、2026-07-27 生效的 Digital Omnibus 时间表合并跟踪，避免"透明度义务已适用、高风险义务被延期"的认知错位。原文发布日期 2026-10，按检索日收录。',
      verified: '待确认'
    }
  },
  {
    key: 'updates',
    item: {
      id: 'auto-20261011-03',
      title: 'Cervicorn Consulting 发布 2026 年 10 月 Physical AI 展望：15 项全球进展与 Q4 合规日历',
      country: '全球',
      region: '全球',
      category: '合规更新 / 战略研判',
      sourceType: '行业咨询（综合政府/监管/公司披露）',
      source: 'Cervicorn Consulting',
      url: 'https://www.cervicornconsulting.com/blog/physical-ai-intelligence-update',
      date: TODAY,
      summary: 'Cervicorn Consulting 发布 10 月 Physical AI 月度展望，归纳 15 项全球进展与 Q4 关键监管节点，要点：①制造地已成为销往美国的机器人市场准入变量；②欧盟借 (EU) 2026/1744 重排合规时钟——机械法规 2027-01-20 适用、内嵌高风险 AI 义务延至 2028-08-02，AI Act 执法 2026-08-02 已启动、CRA 通报义务 2026-09-11 起适用、产品责任指令须于 2026-12-09 前转化；③中国工信部 2025 年设人形与具身智能标委会、2026 年发布覆盖接口/安全/测试的标准体系，美国仍无国家机器人战略（两党法案拟设 18 人国家机器人委员会）；④Robotaxi 9 月已达约 50 万单/周；⑤日本 2025 年装 36,219 台工业机器人（同比 -19%），印度 +15%、巴西 +38%，需求向劳动力缺口市场转移；⑥中国企业 H1 人形出货满意度仅 23%，物理训练数据稀缺为最大瓶颈。涉外视角：该文将"机械法规 + AI Act + CRA + 产品责任指令"四重义务并置，对出口欧盟企业是最直观的合规排期视图；建议据此建立"义务—生效日—负责部门"对照表。原文发布日期 2026-10，按检索日收录。',
      verified: '待确认'
    }
  },

  // ================= industry =================
  {
    key: 'industry',
    item: {
      id: 'auto-20261011-04',
      title: 'Minerva Humanoids 完成 1000 万美元 pre-seed（General Catalyst 领投），推出排爆/离岸油气半自主人形 Roger',
      country: '美国 / 德国',
      region: '北美 / 欧洲',
      category: '融资 / 具身智能（高危作业）',
      sourceType: '官方新闻稿（GlobeNewswire）',
      source: 'Minerva Humanoids / GlobeNewswire',
      url: 'https://www.globenewswire.com/news-release/2026/10/06/3375277/0/en/minerva-humanoids-emerges-from-stealth-with-10m-pre-seed-round-led-by-general-catalyst-to-build-humanoid-robots-for-the-world-s-most-dangerous-jobs.html',
      date: TODAY,
      summary: '2026-10-06，Minerva Humanoids 结束 stealth，宣布完成约 1000 万美元 pre-seed（General Catalyst 领投，Long Journey Ventures、Credo Ventures 跟投，参投方含 Hugging Face、Codecademy 等），同步启动 2026 年秋季首批付费试点。公司由前 MIT CSAIL、Boston Dynamics（Stretch 技术负责人）成员创立，首款机器人 Roger 为半自主人形，面向爆炸物处置（EOD）与离岸油气高危作业，由专家通过 VR 头显远程操作、机器人执行精细动作，软件与 AI 主要在美国开发、首批原型在德国制造组装，明确"不依赖单一中国来源部件"。涉外视角：①其"Western sovereign"供应链定位正契合美 FCC Covered List 对境外产先进机器人的封堵逻辑，是"友岸外包"叙事下的典型资本标的；②半自主（人在回路）架构绕开"全自主认证不可得"的合规障碍，对中国出海高危作业机器人产品定义具借鉴意义；③远程操作涉及跨境数据回传与 operator 责任界定，需并行评估出口管制与数据合规。原文发布日期 2026-10-06，按检索日收录。',
      verified: '待确认'
    }
  },
  {
    key: 'industry',
    item: {
      id: 'auto-20261011-05',
      title: '德国工业机器人公司 RobCo 估值突破 10 亿美元（九个月翻倍），CEO 迁美推进扩张',
      country: '德国 / 美国',
      region: '欧洲 / 北美',
      category: '融资 / 工业自动化',
      sourceType: '官方新闻稿 + 路透报道',
      source: 'RobCo / Reuters（经 Channel NewsAsia 转引）',
      url: 'https://www.rob.co/en-us/resources/news/press/robco-becomes-a-unicorn?utm_source=openai',
      date: TODAY,
      summary: '2026-10-05，慕尼黑工业机器人公司 RobCo 宣布估值突破 10 亿美元（九个月内翻倍），交易含员工二级市场售股，Sequoia、Lightspeed、Greenfield、Kindred、Lingotto、Promus Ventures 等老股东参投，新投资方含 Cherry Ventures、European Tech Collective；据路透，本轮含约 4000 万美元售股，公司累计融资近 2 亿美元。其双手机器人 Alfie 面向高混合、非结构化、安全关键工业任务，采用 Robotics-as-a-Service 模式；CEO Roman Hölzl 已迁往美国，奥斯汀设制造/组装、旧金山设实验室，美国为最快增长市场（超 12 个州有客户，约 70% 业务在欧洲）。涉外视角：欧洲具身智能独角兽加速"欧洲研发+美国量产"双轴心布局，反映美市场准入与资本纵深对机器人企业的拉力；对中国企业而言，友岸资本与制造产能的地理重排将改变竞争格局与并购标的分布。原文发布日期 2026-10-05，按检索日收录。',
      verified: '待确认'
    }
  },
  {
    key: 'industry',
    item: {
      id: 'auto-20261011-06',
      title: 'Astribot 在 IROS 2026 首次将 T1 人形机器人带至北美（深圳 Physical AI 公司，美国起价 1.8 万美元）',
      country: '中国 / 美国',
      region: '北美',
      category: '产品发布 / 出海',
      sourceType: '行业媒体',
      source: 'Humanoids Daily',
      url: 'https://www.humanoidsdaily.com/news/astribot-t1-north-america-iros-18000',
      date: TODAY,
      summary: '深圳 Physical AI 公司 Astribot 在 2026-09-27 至 10-01 于匹兹堡举办的 IROS 2026 上首次将 T1 人形机器人推向北美，美国起价 1.8 万美元、开放预订并可即时交付。T1 身高约 1.55 米、重约 66 公斤，采用缆驱架构（23 自由度，不含末端），单臂负载 5 公斤，提供关节控制/笛卡尔运动/全身协同与传感器数据的 SDK/API；自研 Lumo-2 基座模型已演示自主收纳杂物入背包（含柔性物体操作）。公司强调"为 AI 而设计"（Design for AI），软硬一体；但 T1 部署时不会实时自主学习，需靠遥操作与运行数据回流再训练。涉外视角：①1.8 万美元定价显著低于 Agility Digit 5（约 20 万美元），对北美科研/开发者市场形成价格冲击；②缆驱+柔性操作契合家庭/服务场景，但赴美销售须直面 FCC Covered List（7-28 起境外产先进机器人受限）的认证审查与数据合规（用户操作数据跨境）；③"中国硬件+美国开发者生态"模式是出海典型路径，合同条款应预设准入受阻的退出与免责。原文发布日期 2026-10-01，按检索日收录。',
      verified: '待确认'
    }
  },
  {
    key: 'industry',
    item: {
      id: 'auto-20261011-07',
      title: 'Agility Robotics 与 FORT Robotics 达成战略合作，强化 Digit 5 协作安全架构（Offboard Safety Bridge）',
      country: '美国',
      region: '北美',
      category: '合作 / 机器人安全',
      sourceType: '官方新闻稿',
      source: 'Agility Robotics',
      url: 'https://www.agilityrobotics.com/content/agility-and-fort-robotics-announce-strategic-partnership-to-advance-humanoid-robot-safety',
      date: TODAY,
      summary: '2026-10-01，Agility Robotics 与 FORT Robotics 签署 MOU，将多年安全合作升级为战略合作，共建 Digit 5（下一代"为协作安全而设计"的人形机器人）的三层安全架构：安全手控器（safety pendant，含急停与使能装置）、机载通信、以及连接厂区安全系统的 Offboard Safety Bridge（机外安全桥）。Digit 5 机载已含安全人体检测、听觉/视觉安全提示与安全运动控制，由独立安全控制器监督；Offboard Safety Bridge 将停止信号来源从"机器人本体"扩展至"其所处环境"，使人机近距离协作可在无传统围栏下开展。Digit 前代已积累超 65,000 小时运行、部署于 GXO、Schaeffler、Toyota 加拿大等。Digit 5 预计 2027 上半年早期接入、年底通用可用。涉外视角：人形机器人正从"围栏内协作机器人"走向"开放空间近人作业"，安全架构外置是企业满足 ISO 10218 / ANSI R15.06 与欧盟机械法规的关键路径；中国出海企业可将此作为安全合规设计的对标样板，在产品中预留机外安全接口与日志能力。原文发布日期 2026-10-01，按检索日收录。',
      verified: '待确认'
    }
  },
  {
    key: 'industry',
    item: {
      id: 'auto-20261011-08',
      title: '日本养老院运营商 Charm Care 向 Donut Robotics 投资 3 亿日元，共研养老护理人形机器人 cinnamon',
      country: '日本',
      region: '日本',
      category: '融资 / 银发护理',
      sourceType: '行业媒体',
      source: 'Robotics & Automation News',
      url: 'https://roboticsandautomationnews.com/2026/10/05/japanese-nursing-home-operator-charm-care-invests-in-humanoid-company-donut-robotics/105545/',
      date: TODAY,
      summary: '2026-10-05，日本养老院运营商 Charm Care（东京证交所 Prime 市场上市，关西与东京圈运营超 100 家私立养老院）宣布通过认购新股向 Donut Robotics 投资 3 亿日元（约 200 万美元），建立资本与业务联盟，共研养老护理人形机器人。双方自 2026-07 起已在一家养老院试用 cinnamon 人形（约 170cm、双足、VLA 视觉-语言-动作 AI、支持视频/动捕学习、已申请手势控制专利）；下一阶段目标为响应护理呼叫——居民按呼叫钮后机器人前往并协助。背景是日本少子老龄化导致护理人力长期短缺。Donut 正将供应链转向"日本制造"（基于海外硬件起点做芯片改造与本土组装）。涉外视角：①护理场景数据含大量个人健康信息，须受日本 APPI（个人信息保护法）与潜在跨境规则约束；②"真实场景试点+本土制造"是日本具身智能落地范式，对中国企业出海日本护理市场是渠道与合规双重参照；③涉及弱势群体的自主系统，产品责任与人工监督边界需提前在合同中界定。原文发布日期 2026-10-05，按检索日收录。',
      verified: '待确认'
    }
  },

  // ================= geo =================
  {
    key: 'geo',
    item: {
      id: 'auto-20261011-09',
      title: '美国 FCC 将于 10 月 29 日投票禁止所有中国实验室检测输美电子设备（2028-12 生效，覆盖智能手机/摄像头/电脑）',
      country: '美国 / 中国',
      region: '全球',
      topic: '出口管制 / 市场准入 / 供应链',
      impact: '严重',
      sourceType: '权威媒体（Reuters 报道）',
      source: 'Reuters（经 AOL News / Yahoo News 转引）',
      url: 'https://www.aol.com/articles/us-fcc-vote-ban-chinese-190209000.html',
      date: TODAY,
      summary: '据路透 2026-10-07 报道，美国联邦通信委员会（FCC）宣布将于 10 月 29 日投票，禁止所有中国（及不给予美方实验室对等待遇国家）的测试实验室与认证机构，为输美电子设备（智能手机、摄像头、电脑等）出具 FCC 强制认证。FCC 主席 Brendan Carr 称 2025 年 82% 的电子产品在中国检测、美国本土实验室占比不足 4%；新规拟于 2028-12 生效，此前 2025 年"不良实验室"规则仅禁政府关联方实验室（约 23 家失资），而此次扩展至中国境内全部实验室。同时 FCC 为美国及"对等"国家实验室开设快速审批通道。涉外视角：①这是继 7-28 将境外产先进机器人列入 Covered List 后，美方在"认证端"对中国电子与机器人产业链的又一切口，机器人整机及带无线功能的零部件（遥控器、通信模组）出口美国均依赖 FCC 认证，认证产能外移将导致成本上升（中美认证价差约 4–10 倍）与交期拉长；②生效窗口至 2028-12 给企业约两年迁证期，但"对等待遇"判定具不确定性，建议中国机器人/电子企业立即评估认证路径、布局第三方国家实验室或美国本地认证能力，并在出口合同中加入认证受阻的免责与延期条款。原文发布日期 2026-10-07，按检索日收录。',
      verified: '待确认'
    }
  },
  {
    key: 'geo',
    item: {
      id: 'auto-20261011-10',
      title: '美国科技行业协会联名警告白宫：对半导体/机器人/工业机械加征 Section 232 关税将重创 AI 与制造业',
      country: '美国',
      region: '美国',
      topic: '关税 / 贸易战 / 供应链',
      impact: '中等',
      sourceType: '行业媒体（协会信函报道）',
      source: 'Computer & Communications Industry Association (CCIA) / Business Daily',
      url: 'http://businessdailynetwork.com/tech-groups-warn-white-house-of-tariff-impact-on-semiconductor-and-machinery-sectors',
      date: TODAY,
      summary: '据 Business Daily 报道，美国计算机与通信行业协会（CCIA）联合四家科技贸易协会于 10-02 致信特朗普总统，警告拟议的 Section 232 半导体、机器人及工业机械关税可能破坏 AI 领导地位、制造业增长与国家安全目标。信中指出，对数据中心用半导体加征 25% Section 232 关税，将使建设成本上升 15.6%、未来四年每年给美国造成约 900 亿美元成本；在境内产能满足需求前数年，关税只会削弱投资、损害出口竞争力并抬高生产者与消费者成本。CCIA 研究副总裁 Jonathan McHale 称，鉴于 AI 与工厂自动化空前的内需，此时加税"适得其反"。涉外视角：①机器人被明确列为 232 关税潜在对象，意味着除现有关税/出口管制外，又一道"成本型"壁垒可能落地，中国对美出口机器人整机与核心零部件（伺服、减速器、传感器）需重估到岸成本与转口策略；②行业协会的集体反对显示美方内部对"关税自伤"已有共识，落地节奏与范围仍不确定，合同应保留 change-in-law 与关税转嫁条款。原文发布日期 2026-10-02，按检索日收录。',
      verified: '待确认'
    }
  }
];

let added = 0, skipped = 0;
for (const e of NEW) {
  if (!e || !e.item || !e.item.id) { console.log('SKIP 非法条目'); continue; }
  if (existingIds.has(e.item.id)) { skipped++; console.log('SKIP 重复 id:', e.item.id); continue; }
  const it = e.item;
  const need = ['title', 'sourceType', 'source', 'url', 'date', 'summary'];
  const missing = need.filter(k => !it[k]);
  if (missing.length) { console.log('WARN 缺字段', it.id, missing.join(',')); }
  if (!it.country && !it.region) console.log('WARN 缺 country/region', it.id);
  if (e.key === 'geo' && !it.impact) console.log('WARN geo 缺 impact', it.id);
  if (e.key === 'cases' && !it.penaltyType) console.log('WARN cases 缺 penaltyType', it.id);
  if (it.verified !== '待确认') console.log('WARN verified 异常', it.id);
  db.items.push(e);
  existingIds.add(it.id);
  added++;
}

db.updated = TODAY;
fs.writeFileSync(P, JSON.stringify(db, null, 1), 'utf8');
console.log('=== 完成 ===');
console.log('原条数:', before, ' 新增:', added, ' 跳过(重复):', skipped, ' 现条数:', db.items.length);
const cnt = {};
db.items.forEach(e => { cnt[e.key] = (cnt[e.key] || 0) + 1; });
console.log('分类计数:', JSON.stringify(cnt));
console.log('今日条目:', db.items.filter(e => e.item.date === TODAY).length);
