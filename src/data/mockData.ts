import { ResourceItem, UserProfile, Reservation, SystemNotification } from '../types';
import { getTodayString, addDays } from '../utils/dateUtils';

const today = getTodayString();

// 申請教職員與管理人員資料庫 (依指示建置38位人員名單，並依資安規範設定專屬登入帳號)
export const INITIAL_USERS: UserProfile[] = [
  // 1. 教務處審核主管 (最終主管核定)
  {
    id: 'user-director-huang',
    username: 'slvs200',
    name: '黃寀霓 主任',
    role: 'academic_director',
    title: '教務主任',
    department: '教務處 主任室',
    email: 'cn.huang@school.edu.tw',
    phone: '分機 200',
    avatarBg: 'bg-purple-700'
  },
  // 2. 招設組長 (設備調度、衝突查核、初審審查及實體點交)
  {
    id: 'user-officer-lin',
    username: 'slvs230',
    name: '林彥伊 招設組長',
    role: 'section_officer',
    title: '教學設備組長 (招設組長)',
    department: '教務處 招設組 (設備保管室)',
    email: 'yy.lin@school.edu.tw',
    phone: '分機 230',
    avatarBg: 'bg-sky-700'
  },

  // 3. 校長室秘書
  {
    id: 'user-sec-zheng',
    username: 'slvs101',
    name: '鄭安順 秘書',
    role: 'faculty',
    title: '秘書',
    department: '校長室 秘書室',
    email: 'as.zheng@school.edu.tw',
    phone: '分機 101',
    avatarBg: 'bg-slate-700'
  },

  // 4-9. 教務處各組長與專任/兼課/特色教師
  {
    id: 'user-acad-liu',
    username: 'slvs210',
    name: '劉泄嬉 組長',
    role: 'faculty',
    title: '教學組長',
    department: '教務處 教學組',
    email: 'xh.liu@school.edu.tw',
    phone: '分機 210',
    avatarBg: 'bg-teal-600'
  },
  {
    id: 'user-acad-hong',
    username: 'slvs220',
    name: '洪菁梅 組長',
    role: 'faculty',
    title: '註冊組長',
    department: '教務處 註冊組',
    email: 'jm.hong@school.edu.tw',
    phone: '分機 220',
    avatarBg: 'bg-indigo-600'
  },
  {
    id: 'user-acad-jian',
    username: 'slvs240',
    name: '簡詩涵 組長',
    role: 'faculty',
    title: '課務組長',
    department: '教務處 課務組',
    email: 'sh.jian@school.edu.tw',
    phone: '分機 240',
    avatarBg: 'bg-blue-600'
  },
  {
    id: 'user-teacher-lee',
    username: 'slvs281',
    name: '李玉雯 老師',
    role: 'faculty',
    title: '兼課教師',
    department: '教務處 / 專任教師室',
    email: 'yw.lee@school.edu.tw',
    phone: '分機 281',
    avatarBg: 'bg-emerald-600'
  },
  {
    id: 'user-teacher-lei',
    username: 'slvs281',
    name: '雷藤 老師',
    role: 'faculty',
    title: '外籍教師 (Foreign Teacher)',
    department: '教務處 / 雙語推動組',
    email: 'lei.teng@school.edu.tw',
    phone: '分機 282',
    avatarBg: 'bg-amber-600'
  },
  {
    id: 'user-teacher-cai-lang',
    username: 'slvs281',
    name: '蔡秀珠 老師',
    role: 'faculty',
    title: '族語老師',
    department: '教務處 / 原住民族語文推動',
    email: 'xz.cai@school.edu.tw',
    phone: '分機 282',
    avatarBg: 'bg-orange-600'
  },

  // 10-17. 學務處主任、組長、人力與教練護理師
  {
    id: 'user-sa-hu',
    username: 'slvs300',
    name: '胡方奕 主任',
    role: 'faculty',
    title: '學務主任',
    department: '學生事務處 主任室',
    email: 'fy.hu@school.edu.tw',
    phone: '分機 300',
    avatarBg: 'bg-red-700'
  },
  {
    id: 'user-sa-cai',
    username: 'slva331',
    name: '蔡足英 組長',
    role: 'faculty',
    title: '生輔組長',
    department: '學務處 生活輔導組',
    email: 'zy.cai@school.edu.tw',
    phone: '分機 331',
    avatarBg: 'bg-rose-600'
  },
  {
    id: 'user-sa-yuan',
    username: 'slvs310',
    name: '袁仕忠 組長',
    role: 'faculty',
    title: '訓育組長',
    department: '學務處 訓育組',
    email: 'sz.yuan@school.edu.tw',
    phone: '分機 310',
    avatarBg: 'bg-sky-600'
  },
  {
    id: 'user-sa-huang',
    username: 'slvs320',
    name: '黃建堯 組長',
    role: 'faculty',
    title: '體育組長',
    department: '學務處 體育組',
    email: 'jy.huang@school.edu.tw',
    phone: '分機 320',
    avatarBg: 'bg-cyan-600'
  },
  {
    id: 'user-sa-chen',
    username: 'slvs323',
    name: '陳雪華 組長',
    role: 'faculty',
    title: '衛生組長',
    department: '學務處 衛生組',
    email: 'xh.chen@school.edu.tw',
    phone: '分機 323',
    avatarBg: 'bg-teal-700'
  },
  {
    id: 'user-sa-zhang',
    username: 'slvs332',
    name: '張健新 老師',
    role: 'faculty',
    title: '學創人力',
    department: '學務處 學生創新育成',
    email: 'jx.zhang@school.edu.tw',
    phone: '分機 332',
    avatarBg: 'bg-violet-600'
  },
  {
    id: 'user-sa-coach-chen',
    username: 'slvs322',
    name: '陳誌祥 教練',
    role: 'faculty',
    title: '棒球教練',
    department: '學務處 體育運動訓練組',
    email: 'zx.chen@school.edu.tw',
    phone: '分機 322',
    avatarBg: 'bg-stone-700'
  },
  {
    id: 'user-sa-nurse-xu',
    username: 'slvs321',
    name: '許菊雅 護理師',
    role: 'faculty',
    title: '護理師',
    department: '學務處 健康中心',
    email: 'jy.xu@school.edu.tw',
    phone: '分機 321',
    avatarBg: 'bg-pink-600'
  },

  // 18. 總務處主任
  {
    id: 'user-ga-wang',
    username: 'slva500',
    name: '王恩豪 主任',
    role: 'faculty',
    title: '總務主任',
    department: '總務處 主任室',
    email: 'eh.wang@school.edu.tw',
    phone: '分機 500',
    avatarBg: 'bg-amber-700'
  },

  // 19-20. 輔導室主任與特教老師
  {
    id: 'user-guid-wei',
    username: 'slva170',
    name: '魏頡 主任',
    role: 'faculty',
    title: '輔導室主任',
    department: '輔導室 主任室',
    email: 'j.wei@school.edu.tw',
    phone: '分機 170',
    avatarBg: 'bg-purple-600'
  },
  {
    id: 'user-guid-chen',
    username: 'slvs171',
    name: '陳祐萱 老師',
    role: 'faculty',
    title: '特教老師',
    department: '輔導室 特殊教育組',
    email: 'yx.chen@school.edu.tw',
    phone: '分機 171',
    avatarBg: 'bg-fuchsia-600'
  },

  // 21-26. 實習處主任與五大學程主任
  {
    id: 'user-intern-xie',
    username: 'slvs600',
    name: '謝正餘 主任',
    role: 'faculty',
    title: '實習處主任',
    department: '實習處 主任室',
    email: 'zy.xie@school.edu.tw',
    phone: '分機 600',
    avatarBg: 'bg-blue-800'
  },
  {
    id: 'user-intern-liu-qy',
    username: 'slvs630',
    name: '劉瓊月 主任',
    role: 'faculty',
    title: '商業學程主任',
    department: '實習處 商業學程',
    email: 'qy.liu@school.edu.tw',
    phone: '分機 630',
    avatarBg: 'bg-rose-700'
  },
  {
    id: 'user-intern-yang',
    username: 'slvs660',
    name: '楊賀凱 主任',
    role: 'faculty',
    title: '資訊學程主任',
    department: '實習處 資訊學程',
    email: 'hk.yang@school.edu.tw',
    phone: '分機 660',
    avatarBg: 'bg-cyan-700'
  },
  {
    id: 'user-intern-cai-xl',
    username: 'slvs640',
    name: '蔡昕玲 主任',
    role: 'faculty',
    title: '觀光學程主任',
    department: '實習處 觀光學程',
    email: 'xl.cai@school.edu.tw',
    phone: '分機 640',
    avatarBg: 'bg-emerald-700'
  },
  {
    id: 'user-intern-liu-zc',
    username: 'slvs670',
    name: '劉宗誠 主任',
    role: 'faculty',
    title: '養殖學程主任',
    department: '實習處 養殖學程',
    email: 'zc.liu@school.edu.tw',
    phone: '分機 670',
    avatarBg: 'bg-teal-800'
  },
  {
    id: 'user-intern-liu-hr',
    username: 'slvs650',
    name: '劉懷柔 主任',
    role: 'faculty',
    title: '餐飲學程主任',
    department: '實習處 餐飲學程',
    email: 'hr.liu@school.edu.tw',
    phone: '分機 650',
    avatarBg: 'bg-amber-800'
  },

  // 27-38. 導師部分 (高一4班、高二4班、高三4班)
  {
    id: 'user-home-w-wr',
    username: 'slvs306',
    name: '王偉仁 老師',
    role: 'faculty',
    title: '一年忠班 導師',
    department: '高一導師室 / 一年忠班',
    email: 'wr.wang@school.edu.tw',
    phone: '分機 306',
    avatarBg: 'bg-blue-600'
  },
  {
    id: 'user-home-z-mx',
    username: 'slvs305',
    name: '卓銘欣 老師',
    role: 'faculty',
    title: '一年孝班 導師',
    department: '高一導師室 / 一年孝班',
    email: 'mx.zhuo@school.edu.tw',
    phone: '分機 305',
    avatarBg: 'bg-violet-600'
  },
  {
    id: 'user-home-w-jr',
    username: 'slvs309',
    name: '巫佳容 老師',
    role: 'faculty',
    title: '一年仁班 導師',
    department: '高一導師室 / 一年仁班',
    email: 'jr.wu@school.edu.tw',
    phone: '分機 309',
    avatarBg: 'bg-indigo-600'
  },
  {
    id: 'user-home-d-sy',
    username: 'slvs302',
    name: '杜斯古莎尤慕 老師',
    role: 'faculty',
    title: '一年愛班 導師',
    department: '高一導師室 / 一年愛班',
    email: 'dg.sayumu@school.edu.tw',
    phone: '分機 302',
    avatarBg: 'bg-emerald-600'
  },
  {
    id: 'user-home-l-zm',
    username: 'slvs304',
    name: '林政銘 老師',
    role: 'faculty',
    title: '餐飲二 導師',
    department: '餐飲管理學程 / 餐飲二',
    email: 'zm.lin@school.edu.tw',
    phone: '分機 304',
    avatarBg: 'bg-orange-600'
  },
  {
    id: 'user-home-z-fq',
    username: 'slvs303',
    name: '周芳琪 老師',
    role: 'faculty',
    title: '觀光二 導師',
    department: '觀光事業學程 / 觀光二',
    email: 'fq.zhou@school.edu.tw',
    phone: '分機 303',
    avatarBg: 'bg-pink-600'
  },
  {
    id: 'user-home-h-yy',
    username: 'slvs312',
    name: '黃永耀 老師',
    role: 'faculty',
    title: '商資二 導師',
    department: '商業資訊學程 / 商資二',
    email: 'yy.huang@school.edu.tw',
    phone: '分機 312',
    avatarBg: 'bg-cyan-600'
  },
  {
    id: 'user-home-x-dx',
    username: 'slvs313',
    name: '熊代勛 老師',
    role: 'faculty',
    title: '養殖二 導師',
    department: '水產養殖學程 / 養殖二',
    email: 'dx.xiong@school.edu.tw',
    phone: '分機 313',
    avatarBg: 'bg-teal-600'
  },
  {
    id: 'user-home-x-sq',
    username: 'slvs308',
    name: '許書齊 老師',
    role: 'faculty',
    title: '餐飲三 導師',
    department: '餐飲管理學程 / 餐飲三',
    email: 'sq.xu@school.edu.tw',
    phone: '分機 308',
    avatarBg: 'bg-lime-700'
  },
  {
    id: 'user-home-c-zl',
    username: 'slvs311',
    name: '陳芷琳 老師',
    role: 'faculty',
    title: '觀光三 導師',
    department: '觀光事業學程 / 觀光三',
    email: 'zl.chen@school.edu.tw',
    phone: '分機 311',
    avatarBg: 'bg-purple-600'
  },
  {
    id: 'user-home-c-zm',
    username: 'slvs301',
    name: '陳中明 老師',
    role: 'faculty',
    title: '商資三 導師',
    department: '商業資訊學程 / 商資三',
    email: 'zm.chen@school.edu.tw',
    phone: '分機 301',
    avatarBg: 'bg-slate-600'
  },
  {
    id: 'user-home-z-cj',
    username: 'slvs307',
    name: '趙川俊 老師',
    role: 'faculty',
    title: '養殖三 導師',
    department: '水產養殖學程 / 養殖三',
    email: 'cj.zhao@school.edu.tw',
    phone: '分機 307',
    avatarBg: 'bg-sky-700'
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-av-room',
    name: '視聽教室 (Audiovisual Room)',
    category: 'audiovisual_room',
    code: 'ROOM-AV-01',
    location: '行政教學大樓 4F (401室)',
    capacity: 120,
    quantity: 1,
    availableQuantity: 1,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      '200吋電動高增益銀幕',
      '4K 劇院級高流明雷射投影系統',
      '數位無線環控鵝頸/手握麥克風 (共4支)',
      '階梯式吸音劇院座椅 120席',
      '專業劇院級環繞音響擴大機'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    description: '適用於全校性公開授課、專題講座、教學觀摩、視聽教學與大型影音成果發表會。',
    cautionNotes: '使用完畢請落實關閉音響環控主機與投影機散熱電源，嚴禁在室內攜帶含糖飲料與熱食。'
  },
  {
    id: 'res-multi-room',
    name: '多功能教室 (Multifunctional Classroom)',
    category: 'multifunction_room',
    code: 'ROOM-MF-02',
    location: '科技圖書大樓 2F (205室)',
    capacity: 60,
    quantity: 1,
    availableQuantity: 1,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      '86吋 4K 智慧互動觸控電子白板',
      '活動式六角分組拼接桌椅 (彈性排列)',
      '高畫質雙鏡頭視訊教學追蹤會議系統',
      '全室無線投影 (支援 AirPlay / Miracast)',
      '獨立分組討論小白板 6組'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    description: '專為跨領域素養導向教學、分組合作學習(PBL)、混合式視訊教學及教師專業社群研討設計。',
    cautionNotes: '桌椅移位後務必復原成標準六角分組配置，觸控白板請使用專用觸控筆。'
  },
  {
    id: 'res-resource-room',
    name: '資源班教室 (Special Resource Classroom)',
    category: 'resource_room',
    code: 'ROOM-RC-03',
    location: '育仁樓 1F (102室)',
    capacity: 25,
    quantity: 1,
    availableQuantity: 1,
    status: 'available',
    custodian: '教務處招設組 / 特教組',
    specs: [
      '全室無障礙平整空間與輔助把手',
      '互動式觸控輔助學習大屏',
      '特教認知專注力訓練輔具組',
      '隔音一對一個別化諮商角落',
      '護眼高頻調光護眼照明系統'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    description: '特殊教育個別化教學(IEP)、特教輔具教學應用及補救教學小組專用空間。',
    cautionNotes: '特教輔具使用完畢請歸位至專用防潮櫃，維持環境安靜與整潔。'
  },
  {
    id: 'res-computer-lab',
    name: '電腦多媒體教室 (Computer Lab)',
    category: 'special_classroom',
    code: 'ROOM-CL-04',
    location: '資訊大樓 3F (301室)',
    capacity: 48,
    quantity: 1,
    availableQuantity: 1,
    status: 'available',
    custodian: '教務處招設組 / 資訊組',
    specs: [
      'Intel i7 高效能學生終端電腦 48台',
      '千兆獨立光纖區域網路與教學廣播系統',
      '雙大屏同步教學投影螢幕',
      '正版影音剪輯與程式開發軟體授權'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    description: '提供資訊科技課程、程式設計培訓、數位影音實作及線上認證測驗使用。',
    cautionNotes: '嚴禁隨意拆裝主機線材，課程結束後請廣播提醒學生點選正常關機。'
  },
  {
    id: 'res-ipad-cart',
    name: '行動學習 iPad 平板推車組 (30台組)',
    category: 'it_equipment',
    code: 'EQ-PAD-01',
    location: '教務處 招設組設備室 (櫃A-03)',
    quantity: 3,
    availableQuantity: 2,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      'Apple iPad 10.9吋 30台 (含防摔保護套)',
      '智慧定時紫外線殺菌充電管理推車',
      '預載教育部教育雲、Google Classroom 與學習吧 APP',
      'Apple Pencil 手寫筆 30支'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    description: '班級數位融入教學、生生用平板課堂互動即時回饋專用設備。',
    cautionNotes: '班級數位融入教學、生生用平板課堂互動即時回饋專用設備。'
  },
  {
    id: 'res-laptop-batch',
    name: '筆記型電腦 (10台)',
    category: 'it_equipment',
    code: 'EQ-NB-10',
    location: '教務處 招設組設備室 (筆電專用充電推車NB-01)',
    quantity: 10,
    availableQuantity: 10,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      'Intel Core i7 高效能處理器 / 16GB 記憶體 / 512GB 高速 NVMe SSD',
      '15.6吋 Full HD 護眼霧面防眩光顯示螢幕',
      '預載 Windows 11 專業版、Office 365 辦公套件與常用教學研習軟體',
      '全套配置筆記型電腦 10台、原廠電源供應器 10組與防震手提保護包',
      '配置專用集中管理充電推車與無線光學滑鼠 10組'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    description: '提供全校教師公開授課、專題研討、教學競賽、數位素養研習及分組教學外借使用（全批共10台）。',
    cautionNotes: '借還時請確實清點 10台筆電主機、變壓充電線與滑鼠，歸還前請確保已正常關機。'
  },
  {
    id: 'res-pro-camera',
    name: '專業攝影機 (1台)',
    category: 'it_equipment',
    code: 'EQ-PCAM-01',
    location: '教務處 招設組設備室 (防潮箱C-02)',
    quantity: 1,
    availableQuantity: 1,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      '4K 60fps 廣播級超高畫質專業攝影機主機 1台',
      '大光圈光學防手震變焦鏡頭 (24-70mm 恆定大光圈)',
      '專業指向性熱靴外接收音麥克風 (含戶外防風毛罩)',
      '專用油壓平穩阻尼三腳架 1組',
      '高速 256GB V90 記憶卡 1張、原廠雙長效鋰電池與座充組',
      '防震防撞專用氣密手提防護箱'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: '專供教師公開觀課影音錄製、教學歷程檔案拍攝、校園重大活動紀錄及微電影專題製作專用（全校共1台）。',
    cautionNotes: '光學鏡片嚴禁用手觸摸；雨天禁止於室外無遮蔽處使用，歸還前請先備份記憶卡影像檔案。'
  },
  {
    id: 'res-doc-cam',
    name: '4K Ultra HD 專業實物投影機',
    category: 'it_equipment',
    code: 'EQ-DCAM-05',
    location: '教務處 招設組設備室 (架B-02)',
    quantity: 5,
    availableQuantity: 4,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      '4K 60fps 高清超細緻鏡頭',
      '無段式機械懸臂與自動瞬時對焦',
      'HDMI / USB 雙模輸出 (支援電腦連線拍照/錄影)',
      '內建三段式護眼 LED 補光燈'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    description: '適用於自然實驗細微步驟展示、美術作品賞析、學生作業即時點評分享。',
    cautionNotes: '折疊收納時請依照關節指示方向旋轉，切勿強力扭折鵝頸懸臂。'
  },
  {
    id: 'res-wireless-mic',
    name: '專業可攜式戶外/室內移動音響麥克風組',
    category: 'av_equipment',
    code: 'EQ-PA-02',
    location: '教務處 招設組設備室 (櫃C-01)',
    quantity: 4,
    availableQuantity: 3,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      '150W 強大功率輸出 (清晰涵蓋操場/大禮堂)',
      '雙 UHF 自動對頻抗干擾無線手握麥克風',
      '內建大容量鋰電池 (連續使用可達 8 小時)',
      '支援藍牙 5.0、USB隨身碟與 3.5mm 音源輸入'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    description: '戶外教學、校慶彩排、體育競賽、大型集會及川堂公開宣導專用。',
    cautionNotes: '使用完畢請務必關閉麥克風電池開關，主機插電充電至指示燈轉綠。'
  },
  {
    id: 'res-4k-camera',
    name: '4K 數位攝影機錄影套件 (含專業油壓腳架)',
    category: 'av_equipment',
    code: 'EQ-CAM-08',
    location: '教務處 招設組設備室 (防潮箱D-01)',
    quantity: 2,
    availableQuantity: 2,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      'Sony 4K HDR 專業攝影主機 (含 20x 光學變焦)',
      '專業油壓阻尼三腳架 (平穩運鏡)',
      '指向性熱靴外接防風麥克風',
      '128GB 高速 UHS-II 記憶卡 2張 + 原廠雙電池與充電器'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: '公開觀議課完整錄影存檔、校園教學微電影比賽、教學檔案競賽拍攝。',
    cautionNotes: '鏡頭請勿用手碰觸，雨天請加裝防雨罩，歸還時請確認影像已匯出備份。'
  },
  {
    id: 'res-vr-gear',
    name: 'VR 沉浸式元宇宙教學頭戴套件 (8組入)',
    category: 'it_equipment',
    code: 'EQ-VR-03',
    location: '教務處 招設組設備室 (專用安全箱VR-01)',
    quantity: 2,
    availableQuantity: 2,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      'Meta Quest 3 一體式 VR 頭戴裝置 8組',
      '雙手控制器與專用防落手繩',
      '教師端中控監看 iPad 平板 (可同步觀看學生視角)',
      '專用 UV-C 紫外線光學防菌消毒安全收納箱'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
    description: '地理虛擬實境考察、天文太空探險、人體解剖微觀探索等沉浸式課程。',
    cautionNotes: '使用前請確實清潔學生面部與手部，使用後請啟動收納箱紫外線消毒。'
  },
  {
    id: 'res-presenter',
    name: '多功能雙光束數位簡報筆 (含空中滑鼠)',
    category: 'it_equipment',
    code: 'EQ-PRE-12',
    location: '教務處 招設組設備室 (抽屜A-01)',
    quantity: 10,
    availableQuantity: 9,
    status: 'available',
    custodian: '教務處招設組',
    specs: [
      '雙光束 (高亮度綠光 + 液晶螢幕專用數位光斑)',
      '支援空中飛鼠手勢翻頁與螢幕畫筆標註',
      'Type-C 快速充電，內建倒數震動提示',
      '有效遙控距離達 50 公尺'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: '教師公開課簡報、專題研討、研習會議主持等精準控制。',
    cautionNotes: '雷射光束切勿直射人眼，歸還請一併繳回 USB 無線接收器。'
  }
];

// 預設樣例借用記錄 (展示完整流程：已核定待領取、待招設組審核、待教務主任核定、使用中申請延長借用、已結案)
export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'resv-001',
    trackingNumber: 'EDU-20260830-101',
    resourceId: 'res-av-room',
    resourceName: '視聽教室 (Audiovisual Room)',
    resourceCode: 'ROOM-AV-01',
    resourceCategory: 'audiovisual_room',
    applicantId: 'user-home-x-sq',
    applicantName: '許書齊 老師',
    applicantTitle: '餐飲三 導師',
    applicantDepartment: '餐飲管理學程 / 餐飲三',
    applicantPhone: '分機 308',
    applicantEmail: 'sq.xu@school.edu.tw',
    purpose: '餐飲三專題成果展暨多媒體烹飪技藝觀摩展演',
    courseName: '餐飲專題實作',
    targetClass: '餐飲三全體學生',
    estimatedAttendees: 95,
    startDate: addDays(today, 4),
    startTime: '09:00',
    expectedReturnDate: addDays(today, 5),
    expectedReturnTime: '17:00',
    status: 'approved',
    submittedAt: `${today} 08:30`,
    sectionReviewer: '林彥伊 招設組長',
    sectionNote: '已確認時段無衝堂，視聽器材與無線麥克風均已調校測試完畢。建議排定學生幹部協助引導。',
    sectionReviewedAt: `${today} 09:15`,
    directorReviewer: '黃寀霓 主任',
    directorNote: '同意借用。請注意場地整潔並指派專人管控影音主機。',
    directorReviewedAt: `${today} 10:00`,
    approvalLogs: [
      {
        id: 'log-1',
        step: 'submission',
        actorName: '許書齊 老師',
        actorRole: '申請人 (餐飲三 導師)',
        action: '送出借用預約申請單 (提前4天登記，預計借用2天)',
        timestamp: `${today} 08:30`,
        statusChange: '待招設組審核'
      },
      {
        id: 'log-2',
        step: 'section_review',
        actorName: '林彥伊 招設組長',
        actorRole: '教務處招設組承辦人',
        action: '完成設備與場地衝突查核，初審通過並呈報教務主任核定',
        timestamp: `${today} 09:15`,
        comment: '器材已點檢完竣，時段無衝突。',
        statusChange: '待教務主任核定'
      },
      {
        id: 'log-3',
        step: 'director_approval',
        actorName: '黃寀霓 主任',
        actorRole: '教務主任',
        action: '完成最終主管核定同意借用',
        timestamp: `${today} 10:00`,
        comment: '同意借用。辦理專題發表請落實用電安全與設備維護。',
        statusChange: '核定通過 (待領取/使用)'
      }
    ]
  },
  {
    id: 'resv-002',
    trackingNumber: 'EDU-20260830-202',
    resourceId: 'res-multi-room',
    resourceName: '多功能教室 (Multifunctional Classroom)',
    resourceCode: 'ROOM-MF-02',
    resourceCategory: 'multifunction_room',
    applicantId: 'user-home-z-mx',
    applicantName: '卓銘欣 老師',
    applicantTitle: '一年孝班 導師',
    applicantDepartment: '高一導師室 / 一年孝班',
    applicantPhone: '分機 305',
    applicantEmail: 'mx.zhuo@school.edu.tw',
    purpose: '國語文跨域自主讀書會與班級專題思辨口語發表',
    courseName: '高中國語文 (跨領域選修)',
    targetClass: '一年孝班全體學生',
    estimatedAttendees: 40,
    startDate: addDays(today, 3),
    startTime: '13:30',
    expectedReturnDate: addDays(today, 4),
    expectedReturnTime: '16:30',
    status: 'section_approved',
    submittedAt: `${today} 11:20`,
    sectionReviewer: '林彥伊 招設組長',
    sectionNote: '電子觸控白板已更新系統，分組桌椅已配置為 6 組型態，初審通過呈送教務主任核定。',
    sectionReviewedAt: `${today} 13:40`,
    approvalLogs: [
      {
        id: 'log-21',
        step: 'submission',
        actorName: '卓銘欣 老師',
        actorRole: '申請人 (一年孝班 導師)',
        action: '送出多功能教室借用申請 (提前3天登記)',
        timestamp: `${today} 11:20`,
        statusChange: '待招設組審核'
      },
      {
        id: 'log-22',
        step: 'section_review',
        actorName: '林彥伊 招設組長',
        actorRole: '教務處招設組承辦人',
        action: '初審核可，呈送黃寀霓教務主任最終裁決',
        timestamp: `${today} 13:40`,
        comment: '符合3天前登記與3天內歸還規定。',
        statusChange: '待教務主任核定'
      }
    ]
  },
  {
    id: 'resv-003',
    trackingNumber: 'EDU-20260830-303',
    resourceId: 'res-ipad-cart',
    resourceName: '行動學習 iPad 平板推車組 (30台組)',
    resourceCode: 'EQ-PAD-01',
    resourceCategory: 'it_equipment',
    applicantId: 'user-acad-liu',
    applicantName: '劉泄嬉 組長',
    applicantTitle: '教學組長',
    applicantDepartment: '教務處 教學組',
    applicantPhone: '分機 210',
    applicantEmail: 'xh.liu@school.edu.tw',
    purpose: '全校公開觀議課與數位教學評量示範 — 生生用平板融入教學',
    courseName: '全校示範公開課',
    targetClass: '跨學程示範班級觀摩',
    estimatedAttendees: 30,
    startDate: today,
    startTime: '08:00',
    expectedReturnDate: addDays(today, 2),
    expectedReturnTime: '17:00',
    status: 'extension_pending',
    submittedAt: addDays(today, -4) + ' 10:00',
    sectionReviewer: '林彥伊 招設組長',
    sectionNote: '初審通過，同意出借。',
    sectionReviewedAt: addDays(today, -3) + ' 11:00',
    directorReviewer: '黃寀霓 主任',
    directorNote: '核定准予出借。',
    directorReviewedAt: addDays(today, -3) + ' 14:00',
    checkoutOfficer: '林彥伊 招設組長',
    checkoutAt: today + ' 08:00',
    extension: {
      id: 'ext-001',
      originalReturnDate: addDays(today, 2),
      requestedReturnDate: addDays(today, 6),
      daysExtended: 4,
      reason: '【特殊原因申請】因配合教育部數位前瞻計畫訪視與全校跨科觀課成果展演，需延長使用平板推車進行連續性課堂觀測與評量數據留存，懇請准予延長借用4日。',
      submittedAt: today + ' 14:30',
      sectionStatus: 'approved',
      sectionNote: '經查下週平板推車尚有第2組可供其他班級調度，無時段衝突，建議准予延長。',
      sectionReviewer: '林彥伊 招設組長',
      sectionReviewedAt: today + ' 15:10',
      directorStatus: 'pending'
    },
    approvalLogs: [
      {
        id: 'log-31',
        step: 'submission',
        actorName: '劉泄嬉 組長',
        actorRole: '申請人',
        action: '原借用申請',
        timestamp: addDays(today, -4) + ' 10:00',
        statusChange: '待招設組審核'
      },
      {
        id: 'log-32',
        step: 'section_review',
        actorName: '林彥伊 招設組長',
        actorRole: '教務處招設組承辦人',
        action: '招設組初審同意',
        timestamp: addDays(today, -3) + ' 11:00',
        statusChange: '待主任核定'
      },
      {
        id: 'log-33',
        step: 'director_approval',
        actorName: '黃寀霓 主任',
        actorRole: '教務主任',
        action: '主任核定通過',
        timestamp: addDays(today, -3) + ' 14:00',
        statusChange: '核定通過'
      },
      {
        id: 'log-34',
        step: 'checkout',
        actorName: '林彥伊 招設組長',
        actorRole: '教務處招設組承辦人',
        action: '實體設備點交領取確認 (iPad推車 1 組 30 台)',
        timestamp: today + ' 08:00',
        statusChange: '使用中 (已領取)'
      },
      {
        id: 'log-35',
        step: 'extension_submission',
        actorName: '劉泄嬉 組長',
        actorRole: '申請人',
        action: '送出特殊原因延長借用申請 (申請延長至 ' + addDays(today, 6) + ')',
        timestamp: today + ' 14:30',
        statusChange: '延長借用審核中'
      },
      {
        id: 'log-36',
        step: 'extension_section',
        actorName: '林彥伊 招設組長',
        actorRole: '教務處招設組承辦人',
        action: '招設組初審延長申請：同意 (無後續衝突，建請主任核定)',
        timestamp: today + ' 15:10',
        comment: '已調度庫存，無其他教師衝堂。',
        statusChange: '待主任核定延長'
      }
    ]
  },
  {
    id: 'resv-004',
    trackingNumber: 'EDU-20260826-004',
    resourceId: 'res-resource-room',
    resourceName: '資源班教室 (Special Resource Classroom)',
    resourceCode: 'ROOM-RC-03',
    resourceCategory: 'resource_room',
    applicantId: 'user-sec-zheng',
    applicantName: '鄭安順 秘書',
    applicantTitle: '秘書',
    applicantDepartment: '校長室 秘書室',
    applicantPhone: '分機 101',
    applicantEmail: 'as.zheng@school.edu.tw',
    purpose: '校務專題諮詢會議與跨處室行政研討活動',
    courseName: '校務發展諮詢',
    targetClass: '各處室同仁與諮詢委員',
    estimatedAttendees: 12,
    startDate: addDays(today, 5),
    startTime: '08:30',
    expectedReturnDate: addDays(today, 7),
    expectedReturnTime: '12:00',
    status: 'pending_section',
    submittedAt: `${today} 15:00`,
    approvalLogs: [
      {
        id: 'log-41',
        step: 'submission',
        actorName: '鄭安順 秘書',
        actorRole: '申請人 (秘書)',
        action: '送出資源班教室借用登記單 (提前5天預約登記)',
        timestamp: `${today} 15:00`,
        statusChange: '待招設組業務審核'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-home-x-sq',
    title: '借用核定通過通知',
    message: '您申請的【視聽教室】借用單 (單號: EDU-20260830-101) 已由黃寀霓教務主任核定通過，請於借用日當天至招設組向林彥伊組長領取鑰匙與環控遙控器。',
    type: 'success',
    timestamp: '今天 10:00',
    read: false,
    reservationId: 'resv-001'
  },
  {
    id: 'notif-2',
    userId: 'user-officer-lin',
    title: '新借用申請待審核',
    message: '鄭安順 秘書提出【資源班教室】借用預約申請 (單號: EDU-20260826-004)，請招設組林彥伊組長進行業務初審。',
    type: 'info',
    timestamp: '今天 15:00',
    read: false,
    reservationId: 'resv-004'
  },
  {
    id: 'notif-3',
    userId: 'user-director-huang',
    title: '待核定借用與延長案',
    message: '您有 1 筆待核定一般借用案 (多功能教室 - 卓銘欣老師) 及 1 筆特殊原因延長借用案 (iPad推車組 - 劉泄嬉組長) 待批示。',
    type: 'urgent',
    timestamp: '今天 15:15',
    read: false
  }
];
