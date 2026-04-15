const API_URL = "https://script.google.com/macros/s/AKfycby-Jf7A-TSbwrvvJWxBdn4a8bDjPIw-MLzNN5Bp6NxVfImFstN7yf3kB75lLgO9jX_n/exec";
let currentBaZiData = {};
let currentTimeData = {}; 
let activeDaYunData = {}; 
let activeLiuNianData = {}; 
let dmStrengthData = {}; 
let savedRecordsList = {};
let partnerBaZiData = {};
let currentKongWang = ""; 
let currentVaults = {}; 
let elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }; 

let currentCalYear = new Date().getFullYear();
let currentCalMonth = new Date().getMonth() + 1;
let isTimeUnknown = false; // Flag เช็คว่ารู้เวลาเกิดหรือไม่

const elementMap = {
    '甲': { type: 'wood', icon: '🌳', thName: 'ไม้หยาง' }, '乙': { type: 'wood', icon: '🌿', thName: 'ไม้หยิน' },
    '丙': { type: 'fire', icon: '☀️', thName: 'ไฟหยาง' }, '丁': { type: 'fire', icon: '🕯️', thName: 'ไฟหยิน' },
    '戊': { type: 'earth', icon: '⛰️', thName: 'ดินหยาง' }, '己': { type: 'earth', icon: '🪴', thName: 'ดินหยิน' },
    '庚': { type: 'metal', icon: '⚔️', thName: 'ทองหยาง' }, '辛': { type: 'metal', icon: '💍', thName: 'ทองหยิน' },
    '壬': { type: 'water', icon: '🌊', thName: 'น้ำหยาง' }, '癸': { type: 'water', icon: '🌧️', thName: 'น้ำหยิน' },
    '子': { type: 'water', icon: '🐀', thName: 'ชวด (หนู)' }, '丑': { type: 'earth', icon: '🐂', thName: 'ฉลู (วัว)' },
    '寅': { type: 'wood', icon: '🐅', thName: 'ขาล (เสือ)' }, '卯': { type: 'wood', icon: '🐇', thName: 'เถาะ (ต่าย)' },
    '辰': { type: 'earth', icon: '🐉', thName: 'มะโรง (งูใหญ่)' }, '巳': { type: 'fire', icon: '🐍', thName: 'มะเส็ง (งูเล็ก)' },
    '午': { type: 'fire', icon: '🐎', thName: 'มะเมีย (ม้า)' }, '未': { type: 'earth', icon: '🐐', thName: 'มะแม (แพะ)' },
    '申': { type: 'metal', icon: '🐒', thName: 'วอก (ลิง)' }, '酉': { type: 'metal', icon: '🐓', thName: 'ระกา (ไก่)' },
    '戌': { type: 'earth', icon: '🐕', thName: 'จอ (หมา)' }, '亥': { type: 'water', icon: '🐖', thName: 'กุน (หมู)' }
};

const hiddenGanMap = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'],
    '辰': ['戊', '乙', '癸'], '巳': ['丙', '戊', '庚'], '午': ['丁', '己'], '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

const shiShenMap = { '比肩': 'ผี่เจียง', '劫财': 'เกียบไช้', '食神': 'เจียะซิ้ง', '伤官': 'ซังกัว', '偏财': 'เพียงไช้', '正财': 'เจี้ยไช้', '七杀': 'ชิกสัวะ', '正官': 'เจี้ยกัว', '偏印': 'เพียงอิ่ง', '正印': 'เจี้ยอิ่ง' };

const shiShenDesc = {
    'ผี่เจียง': 'ธาตุเดียวกับตัวคุณ\nหมายถึง: เพื่อนฝูง, หุ้นส่วน, คู่แข่ง',
    'เกียบไช้': 'ธาตุคู่แข่งที่ต่างขั้ว\nหมายถึง: การแย่งชิง, ลงทุนเสี่ยง, เสียเปรียบ',
    'เจียะซิ้ง': 'ธาตุที่คุณก่อเกิด (ราบรื่น)\nหมายถึง: ผลงาน, สติปัญญา, ศิลปะ, ความสุข',
    'ซังกัว': 'ธาตุที่คุณก่อเกิด (ขัดแย้ง)\nหมายถึง: แสดงออก, ท้าทาย, ขบถ, ไอเดียใหม่',
    'เพียงไช้': 'ธาตุที่คุณพิฆาต (ต่างขั้ว)\nหมายถึง: ลาภลอย, เงินฟลุ๊คๆ, ธุรกิจส่วนตัว',
    'เจี้ยไช้': 'ธาตุที่คุณพิฆาต (ขั้วเดียวกัน)\nหมายถึง: เงินเดือน, รายได้ประจำ, ความมั่นคง',
    'ชิกสัวะ': 'ธาตุที่พิฆาตคุณ (รุนแรง)\nหมายถึง: อำนาจเด็ดขาด, อุปสรรค, ศัตรู, เครียด',
    'เจี้ยกัว': 'ธาตุที่พิฆาตคุณ (ควบคุม)\nหมายถึง: ขุนนาง, ระเบียบวินัย, งานมั่นคง',
    'เพียงอิ่ง': 'ธาตุที่ก่อเกิดคุณ (ต่างขั้ว)\nหมายถึง: อุปถัมภ์รอง, สัมผัสที่หก, วิชาเฉพาะ',
    'เจี้ยอิ่ง': 'ธาตุที่ก่อเกิดคุณ (ขั้วเดียวกัน)\nหมายถึง: อุปถัมภ์หลัก, ผู้ใหญ่เมตตา, ความรู้'
};

const diShiDesc = {
    '长生': { th: 'ฉางเซิง', desc: 'เกิดใหม่, เริ่มต้น, เจริญงอกงาม' },
    '沐浴': { th: 'มู่ยวี่', desc: 'อาบน้ำ, เติบโต, มีเสน่ห์, อ่อนไหว' },
    '冠带': { th: 'กวนไต้', desc: 'สวมหมวก, เป็นวัยรุ่น, เตรียมพร้อม' },
    '临官': { th: 'หลินกวน', desc: 'รับราชการ, วัยทำงาน, แข็งแรง' },
    '帝旺': { th: 'ตี้ว่าง', desc: 'รุ่งโรจน์สุดขีด, จุดสูงสุด, มั่นใจ' },
    '衰': { th: 'ซวย', desc: 'ถดถอย, เริ่มอ่อนกำลัง, ปล่อยวาง' },
    '病': { th: 'ปิ้ง', desc: 'เจ็บป่วย, อ่อนแอ, ต้องการดูแล' },
    '死': { th: 'สื่อ', desc: 'ดับสูญ, หยุดนิ่ง, หมดสภาพ' },
    '墓': { th: 'มู่', desc: 'สุสาน, เก็บซ่อน, สะสม, อิ่มตัว' },
    '绝': { th: 'เจวี๋ย', desc: 'ขาดสูญ, ตัดขาด, สิ้นสุดเพื่อเริ่มใหม่' },
    '胎': { th: 'ไท', desc: 'ปฏิสนธิ, ก่อตัว, วางแผนการ' },
    '养': { th: 'หย่าง', desc: 'เลี้ยงดู, ฟูมฟัก, รอเวลา' }
};

const tenGodsMap = {
    '甲': {'甲':'比肩', '乙':'劫财', '丙':'食神', '丁':'伤官', '戊':'偏财', '己':'正财', '庚':'七杀', '辛':'正官', '壬':'偏印', '癸':'正印'},
    '乙': {'甲':'劫财', '乙':'比肩', '丙':'伤官', '丁':'食神', '戊':'正财', '己':'偏财', '庚':'正官', '辛':'七杀', '壬':'正印', '癸':'偏印'},
    '丙': {'甲':'偏印', '乙':'正印', '丙':'比肩', '丁':'劫财', '戊':'食神', '己':'伤官', '庚':'偏财', '辛':'正财', '壬':'七杀', '癸':'正官'},
    '丁': {'甲':'正印', '乙':'偏印', '丙':'劫财', '丁':'比肩', '戊':'伤官', '己':'食神', '庚':'正财', '辛':'偏财', '壬':'正官', '癸':'七杀'},
    '戊': {'甲':'七杀', '乙':'正官', '丙':'偏印', '丁':'正印', '戊':'比肩', '己':'劫财', '庚':'食神', '辛':'伤官', '壬':'偏财', '癸':'正财'},
    '己': {'甲':'正官', '乙':'七杀', '丙':'正印', '丁':'偏印', '戊':'劫财', '己':'比肩', '庚':'伤官', '辛':'食神', '壬':'正财', '癸':'偏财'},
    '庚': {'甲':'偏财', '乙':'正财', '丙':'七杀', '丁':'正官', '戊':'偏印', '己':'正印', '庚':'比肩', '辛':'劫财', '壬':'食神', '癸':'伤官'},
    '辛': {'甲':'正财', '乙':'偏财', '丙':'正官', '丁':'七杀', '戊':'正印', '己':'偏印', '庚':'劫财', '辛':'比肩', '壬':'伤官', '癸':'食神'},
    '壬': {'甲':'食神', '乙':'伤官', '丙':'偏财', '丁':'正财', '戊':'七杀', '己':'正官', '庚':'偏印', '辛':'正印', '壬':'比肩', '癸':'劫财'},
    '癸': {'甲':'伤官', '乙':'食神', '丙':'正财', '丁':'偏财', '戊':'正官', '己':'七杀', '庚':'正印', '辛':'偏印', '壬':'劫财', '癸':'比肩'}
};

const pillarContextMap = { 'year': 'เสาปี (ผู้ใหญ่/สังคม)', 'month': 'เสาเดือน (การงาน/พ่อแม่)', 'day': 'เสาวัน (คู่ครอง/ตัวตน)', 'hour': 'เสายาม (บั้นปลาย/ลูกน้อง)' };
const pillarNamesTh = { 'year': 'ปี', 'month': 'เดือน', 'day': 'วัน', 'hour': 'ยาม' };

const clashMetaphors = {
    'year': 'แผ่นดินไหวหน้าบ้าน (การโยกย้าย, ผู้ใหญ่เจ็บป่วย, เปลี่ยนแปลงสภาพแวดล้อม)',
    'month': 'คลื่นใต้น้ำในออฟฟิศ (เปลี่ยนเจ้านาย, โครงสร้างงานเปลี่ยน, พ่อแม่มีปัญหา)',
    'day': 'พายุเข้าห้องนอน (ขัดแย้งกับคนรัก, สุขภาพช่วงท้อง/หน้าอก, เครียดส่วนตัว)',
    'hour': 'รอยรั่วหลังบ้าน (ลูกน้องทำพลาด, การลงทุนผันผวน, ลูกหลานดื้อรั้น)'
};
const comboMetaphors = {
    'year': 'เปิดประตูรับแขก (ผู้ใหญ่เมตตา, ได้รับโอกาสจากแดนไกล/สังคมวงกว้าง)',
    'month': 'เลื่อนขั้นในออฟฟิศ (งานก้าวหน้า, เจ้านายเอ็นดู, ได้รับการยอมรับ)',
    'day': 'ดอกไม้บานในห้องนอน (ความรักผลิบาน, สุขภาพดี, จิตใจเบิกบาน)',
    'hour': 'คลังเสบียงหลังบ้านเต็ม (โปรเจกต์สำเร็จ, ลูกน้องเกื้อหนุน, ลงทุนงอกเงย)'
};

const actionableAdviceMap = {
    'wood': { color: '🟩 เขียว, อ่อน, ลายไม้', dir: 'ทิศตะวันออก', job: 'การศึกษา, งานเขียน/สิ่งพิมพ์, เฟอร์นิเจอร์, เกษตร, ออกแบบ, พยาบาล' },
    'fire': { color: '🟥 แดง, ส้ม, ชมพู, ม่วง', dir: 'ทิศใต้', job: 'เทคโนโลยี/IT, อาหาร/เครื่องดื่ม, บันเทิง, ความงาม, พลังงาน, การตลาด' },
    'earth': { color: '🟫 เหลือง, น้ำตาล, ครีม', dir: 'ทิศศูนย์กลาง, ตะวันออกเฉียงเหนือ, ตะวันตกเฉียงใต้', job: 'อสังหาริมทรัพย์, ก่อสร้าง, ประกันภัย, ค้าของเก่า, งานบริการลูกค้า' },
    'metal': { color: '⬜ ขาว, เงิน, ทอง', dir: 'ทิศตะวันตก, ตะวันตกเฉียงเหนือ', job: 'การเงินการธนาคาร, วิศวกรรม, ยานยนต์, กฎหมาย, จิวเวลรี่, ราชการ' },
    'water': { color: '⬛ ดำ, น้ำเงิน, ฟ้า', dir: 'ทิศเหนือ', job: 'โลจิสติกส์, ธุรกิจออนไลน์, การต่างประเทศ, ค้าขาย, ขนส่ง, ประมง' }
};

const interactions = {
    heavenlyCombos: { '甲':'己', '己':'甲', '乙':'庚', '庚':'乙', '丙':'辛', '辛':'丙', '丁':'壬', '壬':'丁', '戊':'癸', '癸':'戊' },
    heavenlyClashes: { '甲':'庚', '庚':'甲', '乙':'辛', '辛':'乙', '丙':'壬', '壬':'丙', '丁':'癸', '癸':'丁' },
    earthlyCombos: { '子':'丑', '丑':'子', '寅':'亥', '亥':'寅', '卯':'戌', '戌':'卯', '辰':'酉', '酉':'辰', '巳':'申', '申':'巳', '午':'未', '未':'午' },
    earthlyClashes: { '子':'午', '午':'子', '丑':'未', '未':'丑', '寅':'申', '申':'寅', '卯':'酉', '酉':'卯', '辰':'戌', '戌':'辰', '巳':'亥', '亥':'巳' },
    earthlyPunishments: { '寅':['巳','申'], '巳':['寅','申'], '申':['寅','巳'], '丑':['戌','未'], '戌':['丑','未'], '未':['丑','戌'], '子':['卯'], '卯':['子'], '辰':['辰'], '午':['午'], '酉':['酉'], '亥':['亥'] },
    earthlyHarms: { '子':'未', '未':'子', '丑':'午', '午':'丑', '寅':'巳', '巳':'寅', '卯':'辰', '辰':'卯', '申':'亥', '亥':'申', '酉':'戌', '戌':'酉' },
    earthlyDestructions: { '子':'酉', '酉':'子', '丑':'辰', '辰':'丑', '寅':'亥', '亥':'寅', '卯':'午', '午':'卯', '巳':'申', '申':'巳', '未':'戌', '戌':'未' }
};

const elementMetaphors = {
    'wood': {
        'water': { fav: 'น้ำหล่อเลี้ยงให้ต้นไม้เติบโตงอกงาม ราบรื่น', unfav: 'น้ำหลากรากเน่า ต้นไม้ลอยคอ ภาระเยอะ' },
        'wood': { fav: 'รวมเป็นป่าใหญ่ แข็งแรงต้านพายุ มีพวกพ้อง', unfav: 'ต้นไม้เบียดเสียด แย่งอาหาร อึดอัดวุ่นวาย' },
        'fire': { fav: 'ผลิใบออกดอกสว่างไสว ได้แสดงผลงาน', unfav: 'ไฟเผาไหม้กลายเป็นเถ้าถ่าน เหนื่อยล้าหมดแรง' },
        'earth': { fav: 'ดินอุดมสมบูรณ์ รากหยั่งลึก ได้โชคลาภ', unfav: 'ดินแข็งเกินไป รากชอนไชไม่ไหว หาเงินเหนื่อย' },
        'metal': { fav: 'ตัดแต่งกิ่งให้เป็นทรงสวย ใช้งานได้จริง', unfav: 'ขวานมาฟันโค่น ถูกขัดขวางและกดดันอย่างหนัก' }
    },
    'fire': {
        'wood': { fav: 'ไม้เป็นฟืนให้ไฟลุกโชนอย่างต่อเนื่อง', unfav: 'ฟืนเยอะเกินไปจนไฟลุกท่วม ควันโขมง คิดมาก' },
        'fire': { fav: 'ไฟดวงเล็กรวมกันส่องสว่างเจิดจ้า', unfav: 'ไฟโหมกระหน่ำรุนแรง เผาผลาญจนแห้งแล้ง' },
        'earth': { fav: 'ดินช่วยระบายความร้อน ให้อยู่ในสมดุล', unfav: 'ดินเถ้าถ่านทับถมดับไฟให้มอดสนิท ไร้แสงสว่าง' },
        'metal': { fav: 'ไฟหลอมโลหะเป็นเครื่องประดับ ได้ทรัพย์', unfav: 'โลหะแข็งเกินไป ไฟหลอมไม่ไหว เปลืองพลังงาน' },
        'water': { fav: 'น้ำช่วยควบคุมความร้อน และสะท้อนแสงไฟ', unfav: 'คลื่นน้ำสาดซัดมาดับไฟให้มอด ถูกสกัดกั้น' }
    },
    'earth': {
        'fire': { fav: 'ไฟเผาเถ้าถ่าน บำรุงหน้าดินให้อุดมสมบูรณ์', unfav: 'แดดแผดเผาจนดินแห้งแล้งแตกระแหง ไร้ชีวิตชีวา' },
        'earth': { fav: 'ผงดินรวมเป็นภูเขากว้างใหญ่ หนักแน่นมั่นคง', unfav: 'ภูเขาทับถมซ้อนกันหนักอึ้ง ดื้อรั้น ไม่เกิดประโยชน์' },
        'metal': { fav: 'แร่ธาตุในดินถูกขุดขึ้นมาเจียระไน สร้างผลงาน', unfav: 'ขุดหน้าดินมากไปจนภูเขากลวง พังทลาย หมดสภาพ' },
        'water': { fav: 'สายน้ำหล่อเลี้ยงดินแห้งให้ชุ่มชื้น เพาะปลูกได้', unfav: 'น้ำหลากสาดซัดดินถล่มทลาย เก็บเงินไม่อยู่' },
        'wood': { fav: 'รากไม้ยึดดินไม่ให้พังทลาย คุมดินให้อยู่ทรง', unfav: 'รากไม้ชอนไชดูดซับอาหารจนดินเสื่อมโทรม กดดัน' }
    },
    'metal': {
        'earth': { fav: 'ผืนดินปกป้องอุ้มชูและให้กำเนิดแร่ธาตุทอง', unfav: 'ดินหนาทับถมฝังกลบเครื่องประดับ ทำให้หมอง' },
        'metal': { fav: 'หลอมรวมโลหะเข้าด้วยกันเป็นอาวุธที่แกร่งกล้า', unfav: 'โลหะกระทบโลหะแตกหัก แข็งกร้าว แย่งชิงเด่น' },
        'water': { fav: 'น้ำช่วยชำระล้างขัดเงาให้ทองเปล่งประกายโดดเด่น', unfav: 'น้ำลึกเกินไปทำให้ทองจมบาดาล หรือเป็นสนิม' },
        'wood': { fav: 'ดาบตัดไม้สร้างผลงานและมูลค่า ได้โชคลาภ', unfav: 'ไม้แข็งเกินไป ดาบทื่อฟันไม่เข้า เสียแรงเปล่า' },
        'fire': { fav: 'ไฟหลอมโลหะให้เป็นเครื่องมือสวยงามมีระดับ', unfav: 'ไฟบรรลัยกัลป์รุนแรง หลอมโลหะจนละลายเสียรูป' }
    },
    'water': {
        'metal': { fav: 'แร่ธาตุในหินตาน้ำกลั่นให้แม่น้ำไม่เหือดแห้ง', unfav: 'ตาน้ำแตกทะลักพัดพาสาดซัดคุมไม่อยู่ วุ่นวาย' },
        'water': { fav: 'หยดน้ำรวมตัวกันเป็นแม่น้ำสายใหญ่ที่มีพลัง', unfav: 'คลื่นยักษ์สึนามิ น้ำหลากท่วมท้นไร้ทิศทาง' },
        'wood': { fav: 'ต้นไม้ดูดซับน้ำ ระบายพลังงานล้นให้เกิดประโยชน์', unfav: 'ต้นไม้มากไปดูดซับน้ำจนแห้งขอด เหือดแห้ง' },
        'fire': { fav: 'แสงตะวันสะท้อนผิวน้ำ สร้างสมดุลให้อบอุ่น', unfav: 'ไฟต้มน้ำจนเดือดพล่าน ระเหยเป็นไอ อารมณ์แปรปรวน' },
        'earth': { fav: 'ดินสร้างเขื่อนกั้นน้ำ บังคับทิศทางให้ใช้ประโยชน์', unfav: 'ดินโคลนสาดลงน้ำ ทำให้น้ำขุ่นมัว สกปรก ไร้ทางออก' }
    }
};

const naYinDesc = {
    'ทอง': 'ลึกๆ เด็ดขาด ตัดสินใจเฉียบขาด เย็นชาและมีกฎเกณฑ์ในใจ',
    'ไม้': 'ลึกๆ เป็นคนยึดมั่นในหลักการ มีเมตตา ชอบพัฒนาตัวเอง',
    'น้ำ': 'ลึกๆ อ่อนไหว คิดลึกซึ้ง ลื่นไหลไปตามสถานการณ์ ซ่อนความลับเก่ง',
    'ไฟ': 'ลึกๆ เป็นคนใจร้อน ซ่อนความกระตือรือร้นและทะเยอทะยานไว้สูง',
    'ดิน': 'ลึกๆ เป็นคนหนักแน่น ดื้อเงียบ อนุรักษ์นิยม ไม่ชอบการเปลี่ยนแปลง'
};

const iconMap = { 'wood': '🌳', 'fire': '🔥', 'earth': '⛰️', 'metal': '🪙', 'water': '💧' };
const thTypeMap = {'wood': 'ไม้', 'fire': 'ไฟ', 'earth': 'ดิน', 'metal': 'ทอง', 'water': 'น้ำ'};

// ✨ ฟังก์ชันสแกนหา "ภาคีซ่อน" (Hidden Combos)
function getHiddenComboHtml(char, level, pillar, baziData) {
    let res = '';
    const pillars = ['year', 'month', 'day', 'hour'];
    
    if (level === 'heaven') {
        // ราศีบน แอบฮะกับ ราศีแฝง (ฟ้า-ดิน)
        let targetGanCombo = interactions.heavenlyCombos[char]; 
        pillars.forEach(p => {
            if (p === pillar) return;
            let targetZhi = baziData[p].zhi;
            if (targetZhi === '-') return;
            let hiddenGans = hiddenGanMap[targetZhi] || [];
            if (hiddenGans.includes(targetGanCombo)) {
                res += `<p style="color:#6a1b9a; font-size: 0.95em; margin-bottom: 5px;">🎭 <b>แอบฮะ (บน-ล่าง):</b> ราศีบน <b>${char}</b> แอบจับคู่กับราศีแฝง <b>${targetGanCombo}</b> ในเสา${pillarNamesTh[p]}</p>`;
            }
        });
    } else {
        // ราศีแฝง แอบฮะกับ ราศีบน หรือ ราศีแฝงอื่น (ล่าง-บน / ล่าง-ล่าง)
        let myHiddenGans = hiddenGanMap[char] || [];
        pillars.forEach(p => {
            if (p === pillar) return;
            // 1. เช็คกับราศีบนเสาอื่น
            let otherGan = baziData[p].gan;
            if (otherGan !== '-') {
                myHiddenGans.forEach(mg => {
                    if (interactions.heavenlyCombos[mg] === otherGan) {
                        res += `<p style="color:#6a1b9a; font-size: 0.95em; margin-bottom: 5px;">🎭 <b>แอบฮะ (ล่าง-บน):</b> ราศีแฝง <b>${mg}</b> แอบจับคู่กับราศีบน <b>${otherGan}</b> ในเสา${pillarNamesTh[p]}</p>`;
                    }
                });
            }
            // 2. เช็คกับราศีแฝงเสาอื่น
            let otherZhi = baziData[p].zhi;
            if (otherZhi !== '-') {
                let otherHiddenGans = hiddenGanMap[otherZhi] || [];
                myHiddenGans.forEach(mg => {
                    let targetCombo = interactions.heavenlyCombos[mg];
                    if (otherHiddenGans.includes(targetCombo)) {
                        res += `<p style="color:#6a1b9a; font-size: 0.95em; margin-bottom: 5px;">🕵️ <b>แอบฮะ (ล่าง-ล่าง):</b> ราศีแฝง <b>${mg}</b> แอบจับคู่กับราศีแฝง <b>${targetCombo}</b> ในเสา${pillarNamesTh[p]}</p>`;
                    }
                });
            }
        });
    }
    return res;
}

function checkStemRoot(ganChar, natalZhis) {
    if (!ganChar || ganChar === '-') return null;
    const ganType = elementMap[ganChar]?.type;
    if (!ganType) return null;

    let hasRoot = false;
    let rootZhis = [];

    natalZhis.forEach(zhiItem => {
        const zhiChar = zhiItem.char;
        if (!zhiChar || zhiChar === '-') return;
        const hiddenGans = hiddenGanMap[zhiChar] || [];
        const hasSameElement = hiddenGans.some(hGan => elementMap[hGan]?.type === ganType);
        if (hasSameElement) {
            hasRoot = true;
            rootZhis.push(zhiItem.pillar);
        }
    });

    return {
        hasRoot: hasRoot,
        isFloating: !hasRoot,
        rootLocations: rootZhis
    };
}

function rChar(char) {
    const d = elementMap[char];
    if(!d) return char;
    let th = d.thName.split(' ')[0]; 
    let typeName = d.type.replace('wood','ไม้').replace('fire','ไฟ').replace('earth','ดิน').replace('metal','ทอง').replace('water','น้ำ');
    return `<span class="tooltip-container" style="color:#0277bd; font-weight:bold; cursor:help; border-bottom: 1px dashed #0277bd;">${d.icon} ${th} (${char})<span class="tooltip-text" style="width:150px; text-align:center;"><b>${d.thName}</b><br>ธาตุ: ${typeName}</span></span>`;
}

function calculateVaults(dayGan) {
    if (!dayGan || dayGan === '-') return {};
    const dmType = elementMap[dayGan].type;
    const vaultElements = { 'water': '辰', 'wood': '未', 'fire': '戌', 'earth': '戌', 'metal': '丑' };
    const generatingMap = { 'wood': 'water', 'fire': 'wood', 'earth': 'fire', 'metal': 'earth', 'water': 'metal' };
    const conqueringMap = { 'wood': 'earth', 'fire': 'metal', 'earth': 'water', 'metal': 'wood', 'water': 'fire' };
    const conqueredByMap = { 'wood': 'metal', 'fire': 'water', 'earth': 'wood', 'metal': 'fire', 'water': 'earth' };

    return { 
        wealthVault: vaultElements[conqueringMap[dmType]], 
        powerVault: vaultElements[conqueredByMap[dmType]], 
        resourceVault: vaultElements[generatingMap[dmType]] 
    };
}

function checkSpecialStars(branch, dayGan, yearZhi, dayZhi) {
    let stars = [];
    if (!branch || branch === '-' || !dayGan || dayGan === '-') return stars;
    
    if ({ '甲':['丑','未'], '戊':['丑','未'], '庚':['丑','未'], '乙':['子','申'], '己':['子','申'], '丙':['亥','酉'], '丁':['亥','酉'], '壬':['卯','巳'], '癸':['卯','巳'], '辛':['寅','午'] }[dayGan]?.includes(branch)) 
        stars.push({name: '🌟 อุปถัมภ์ (กุ้ยเหริน)', desc: 'มีคนคอยช่วยเหลือ แคล้วคลาด ปกป้องคุ้มครอง', icon: '🌟'});
    if ({ '甲':'寅', '乙':'卯', '丙':'午', '戊':'午', '丁':'巳', '己':'巳', '庚':'申', '辛':'酉', '壬':'亥', '癸':'子' }[dayGan] === branch) 
        stars.push({name: '💰 ลู่เสิน', desc: 'ความอุดมสมบูรณ์ มั่งคั่ง รากฐานการเงินมั่นคง', icon: '💰'});
    if ({ '甲':'巳', '乙':'午', '丙':'申', '戊':'申', '丁':'酉', '己':'酉', '庚':'亥', '辛':'子', '壬':'寅', '癸':'卯' }[dayGan] === branch) 
        stars.push({name: '📚 เหวินชาง', desc: 'ปัญญาเลิศ หัวไว เรียนรู้เก่ง โดดเด่นด้านวิชาการ', icon: '📚'});
    if ({ '甲':'卯', '丙':'午', '戊':'午', '庚':'酉', '壬':'子' }[dayGan] === branch) 
        stars.push({name: '⚔️ ดาบแกะ (หยางเริ่น)', desc: 'ความเด็ดขาด พลังต่อสู้สูง ใจร้อน ทะเยอทะยาน', icon: '⚔️'});

    const sanHeGroups = {
        '申': { huaGai: '辰', jiangXing: '子' }, '子': { huaGai: '辰', jiangXing: '子' }, '辰': { huaGai: '辰', jiangXing: '子' },
        '亥': { huaGai: '未', jiangXing: '卯' }, '卯': { huaGai: '未', jiangXing: '卯' }, '未': { huaGai: '未', jiangXing: '卯' },
        '寅': { huaGai: '戌', jiangXing: '午' }, '午': { huaGai: '戌', jiangXing: '午' }, '戌': { huaGai: '戌', jiangXing: '午' },
        '巳': { huaGai: '丑', jiangXing: '酉' }, '酉': { huaGai: '丑', jiangXing: '酉' }, '丑': { huaGai: '丑', jiangXing: '酉' }
    };

    if ({ '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' }[yearZhi] === branch || { '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' }[dayZhi] === branch) 
        stars.push({name: '🌸 ดอกท้อ (เถาฮวา)', desc: 'มีเสน่ห์ดึงดูด เป็นที่รักและเมตตา โดดเด่นในสังคม', icon: '🌸'});
    if ({ '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }[yearZhi] === branch || { '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }[dayZhi] === branch) 
        stars.push({name: '🐎 ม้าเดินทาง (อี้หม่า)', desc: 'มีเกณฑ์โยกย้าย เดินทางบ่อย ชีพจรลงเท้า ต่างประเทศ', icon: '🐎'});
    if (sanHeGroups[yearZhi]?.huaGai === branch || sanHeGroups[dayZhi]?.huaGai === branch) 
        stars.push({name: '🎨 ฮั้วก่าย (ศิลปะ)', desc: 'พรสวรรค์ทางศิลปะ ศาสนา ปรัชญา เซนส์ลี้ลับ แต่มักรักสันโดษ', icon: '🎨'});
    if (sanHeGroups[yearZhi]?.jiangXing === branch || sanHeGroups[dayZhi]?.jiangXing === branch) 
        stars.push({name: '🎖️ เจียงซิง (ขุนพล)', desc: 'มีบารมีผู้นำ คุมคนได้ อำนาจเด็ดขาด เหมาะกับงานบริหาร', icon: '🎖️'});
    
    if (currentVaults.wealthVault === branch) stars.push({name: '💰 คลังสมบัติ (ไฉ่โข่ว)', desc: 'สะสมความมั่งคั่ง เก็บเงินอยู่ รอวันเปิดคลัง', icon: '💰', isVault: true});
    if (currentVaults.powerVault === branch) stars.push({name: '🏛️ คลังอำนาจ (กัวโข่ว)', desc: 'สะสมบารมี ตำแหน่งหน้าที่การงาน', icon: '🏛️', isVault: true});
    if (currentVaults.resourceVault === branch) stars.push({name: '📚 คลังอุปถัมภ์ (อิ่งโข่ว)', desc: 'สะสมปัญญา มีผู้ใหญ่คอยหนุนหลัง', icon: '📚', isVault: true});

    return stars;
}

function getBoxInnerHtml(char, contextStars = [], isKongWang = false, rootStatus = null) {
    if (char === '-') return `<span class="char" style="color:#ccc;">-</span><span style="font-size:10px; color:#ccc; margin-top:5px;">(ไม่ระบุ)</span>`;
    
    const data = elementMap[char] || { type: '', icon: '', thName: '' };
    let html = `<span class="char">${char}</span>`;
    html += `<span class="icon">${data.icon}</span>`;
    html += `<span style="font-size:11px; margin-top:2px;">${data.thName}</span>`; 

    if (hiddenGanMap[char]) {
        html += `<div style="display:flex; gap:4px; margin-top:4px;">`;
        hiddenGanMap[char].forEach(gan => {
            const ganType = elementMap[gan].type;
            let dotColor = '#ccc';
            if(ganType === 'wood') dotColor = '#4caf50';
            if(ganType === 'fire') dotColor = '#f44336';
            if(ganType === 'earth') dotColor = '#ffb300';
            if(ganType === 'metal') dotColor = '#9e9e9e';
            if(ganType === 'water') dotColor = '#2196f3';
            html += `<div title="มีธาตุแฝง: ${elementMap[gan].thName}" style="width:8px; height:8px; border-radius:50%; background-color:${dotColor}; box-shadow: 0 0 2px rgba(0,0,0,0.2);"></div>`;
        });
        html += `</div>`;
    }
    
    if (contextStars && contextStars.length > 0) {
        html += `<div class="star-badges-container">`;
        contextStars.forEach(star => {
            let extraClass = star.isVault ? 'vault-badge' : '';
            html += `<span class="star-badge ${extraClass} tooltip-container">${star.icon}<span class="tooltip-text"><b>${star.name}</b><br>${star.desc}</span></span>`;
        });
        html += `</div>`;
    }
    if (isKongWang) {
        html += `<div class="kongwang-badge tooltip-container">🕳️<span class="tooltip-text"><b>ติดคงบ้วง (สูญสิ้น)</b><br>พลังงานเสานี้ถูกลดทอนลง ว่างเปล่า</span></div>`;
    }

    if (rootStatus) {
        if (rootStatus.hasRoot) {
            let locText = rootStatus.rootLocations.map(p => pillarNamesTh[p]).join(', ');
            html += `<div class="tooltip-container root-badge-container" style="margin-top:4px; z-index:10;"><span style="font-size:10px; background:#e8f5e9; color:#2e7d32; padding:2px 4px; border-radius:4px; border:1px solid #4caf50;">🌱 มีราก</span><span class="tooltip-text" style="bottom:150%;"><b>มีรากฐานมั่นคง</b><br>พบรากในเสา: ${locText}</span></div>`;
        } else {
            html += `<div class="tooltip-container root-badge-container" style="margin-top:4px; z-index:10;"><span style="font-size:10px; background:#f5f5f5; color:#757575; padding:2px 4px; border-radius:4px; border:1px dashed #9e9e9e;">🍃 ลอยลม</span><span class="tooltip-text" style="bottom:150%;"><b>ลอยปลิวลม (ไร้ราก)</b><br>เป็นเพียงภาพลวงตา หรือพลังงานฉาบฉวย ไม่มั่นคง</span></div>`;
        }
    }

    return html;
}

function renderBox(elementId, chineseChar, type, isEarth = false) {
    const box = document.getElementById(elementId);
    if (!box) return;

    box.classList.remove('wood', 'fire', 'earth', 'metal', 'water', 'fav-element', 'unfav-element');
    
    if (chineseChar === '-') {
        box.innerHTML = getBoxInnerHtml('-');
        box.style.background = '#f9f9f9';
        box.style.borderColor = '#eee';
        box.style.cursor = 'default';
        return;
    }

    const data = elementMap[chineseChar] || { type: '' };
    let stars = []; let isKw = false;
    let rootStatus = null; 

    if (isEarth) {
        if (currentBaZiData.day && currentBaZiData.day.gan !== '-') {
            stars = checkSpecialStars(chineseChar, currentBaZiData.day.gan, currentBaZiData.year.zhi, currentBaZiData.day.zhi);
        }
        if (currentKongWang && currentKongWang.includes(chineseChar)) {
            isKw = true;
        }
    } else {
        if (type === 'natal' && currentBaZiData.day && currentBaZiData.day.gan !== '-') {
            const natalZhis = [
                { pillar: 'year', char: currentBaZiData.year.zhi },
                { pillar: 'month', char: currentBaZiData.month.zhi },
                { pillar: 'day', char: currentBaZiData.day.zhi },
                { pillar: 'hour', char: currentBaZiData.hour.zhi }
            ];
            rootStatus = checkStemRoot(chineseChar, natalZhis);
        }
    }
    
    box.innerHTML = getBoxInnerHtml(chineseChar, stars, isKw, rootStatus);
    box.style.cursor = 'pointer';

    if(data.type) {
        box.classList.add(data.type);
        if(isKw) {
            box.style.opacity = '0.6'; 
        } else {
            box.style.opacity = '1';
        }

        if (dmStrengthData.favTypes && dmStrengthData.favTypes.includes(data.type)) {
            box.classList.add('fav-element');
        } else if (dmStrengthData.unfavTypes && dmStrengthData.unfavTypes.includes(data.type)) {
            box.classList.add('unfav-element');
        }
    }
}

function updateShiShenLabels(dataObj, prefix, dayGan) {
    if(!dayGan || dayGan === '-') {
        ['year', 'month', 'hour'].forEach(p => {
            let el = document.getElementById(prefix ? `${prefix}-${p}-shishen` : `${p}-shishen`);
            if(el) el.style.visibility = 'hidden';
        });
        return;
    }

    ['year', 'month', 'day', 'hour'].forEach(p => {
        let el = document.getElementById(prefix ? `${prefix}-${p}-shishen` : `${p}-shishen`);
        if(el) {
            if(p === 'day' && prefix === '') {
                // ข้ามดิถี
            } else if (dataObj[p].gan === '-') {
                el.style.visibility = 'hidden';
            } else {
                const gan = dataObj[p].gan;
                let tenGodCh = tenGodsMap[dayGan][gan];
                let tenGodShort = shiShenMap[tenGodCh] || tenGodCh;
                let desc = shiShenDesc[tenGodShort] || 'พลังงานที่ส่งผลต่อดวงชะตา';
                el.innerHTML = `${tenGodShort} <span class="tooltip-text">${desc}</span>`;
                el.style.visibility = 'visible';
            }
        }
        
        let diShiEl = document.getElementById(prefix ? `${prefix}-${p}-dishi` : `${p}-dishi`);
        let naYinEl = document.getElementById(prefix ? `${prefix}-${p}-nayin` : `${p}-nayin`);
        
        if (diShiEl) {
            if (dataObj[p].diShi && dataObj[p].diShi !== '-') {
                let dsData = diShiDesc[dataObj[p].diShi] || { th: dataObj[p].diShi, desc: '' };
                diShiEl.innerHTML = `${dsData.th}<span class="tooltip-text"><b>${dsData.th} (12 วัฏจักร)</b><br>${dsData.desc}</span>`;
            } else {
                diShiEl.innerHTML = '';
            }
        }
        if (naYinEl) {
            if (dataObj[p].naYin && dataObj[p].naYin !== '-') {
                let nayinName = dataObj[p].naYin;
                let nyElement = nayinName.includes('金') ? 'ทอง' : nayinName.includes('木') ? 'ไม้' : nayinName.includes('水') ? 'ไฟ' : nayinName.includes('土') ? 'ดิน' : '';
                let nyDesc = naYinDesc[nyElement] || 'พลังธาตุแฝง (เสียง) บ่งบอกบรรยากาศที่แท้จริง';
                naYinEl.innerHTML = `อิมเจีย: ${nyElement}<span class="tooltip-text" style="width:250px;"><b>🎶 อิมเจีย: ${nayinName} (ธาตุ${nyElement})</b><br>${nyDesc}</span>`;
            } else {
                naYinEl.innerHTML = '';
            }
        }
    });
}

function renderElementChart() {
    elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    let total = 0;
    const addPts = (char, pts) => {
        if(!char || char === '-') return;
        const type = elementMap[char]?.type;
        if(type) { 
            elementCounts[type] += pts; 
            total += pts; 
        }
    };

    ['year', 'month', 'day', 'hour'].forEach(p => {
        addPts(currentBaZiData[p].gan, 10);
        const zhi = currentBaZiData[p].zhi;
        const hidden = hiddenGanMap[zhi];
        if(hidden) {
            if(hidden.length === 1) addPts(hidden[0], 10);
            else if(hidden.length === 2) { addPts(hidden[0], 7); addPts(hidden[1], 3); }
            else if(hidden.length === 3) { addPts(hidden[0], 6); addPts(hidden[1], 3); addPts(hidden[2], 1); }
        }
    });

    const colors = { wood: '#4caf50', fire: '#f44336', earth: '#ffb300', metal: '#9e9e9e', water: '#2196f3' };
    let html = `<h3 style="margin-top:0; font-size:15px; color:#1565c0; text-align:center;">📊 สัดส่วนพลังงาน 5 ธาตุ</h3><div style="display:flex; flex-direction:column; gap:8px; margin-top:15px;">`;
    for(let t in elementCounts) {
        let pct = total > 0 ? Math.round((elementCounts[t] / total) * 100) : 0;
        html += `<div style="display:flex; align-items:center; font-size:13px;">
            <span style="width:35px; font-weight:bold; color:${colors[t]}">${thTypeMap[t]}</span>
            <div style="flex:1; background:#e0e0e0; height:12px; border-radius:6px; overflow:hidden; margin:0 10px;">
                <div style="width:${pct}%; background:${colors[t]}; height:100%; transition: width 1s;"></div>
            </div>
            <span style="width:35px; text-align:right; color:#555;">${pct}%</span>
        </div>`;
    }
    html += `</div>`;
    document.getElementById('element-chart').innerHTML = html;
    document.getElementById('element-chart').style.display = 'block';
}

function calculateDMStrength() {
    const dm = currentBaZiData.day.gan;
    if (!dm || dm === '-') return;

    const dmType = elementMap[dm].type;
    const generatingMap = { 'wood': 'water', 'fire': 'wood', 'earth': 'fire', 'metal': 'earth', 'water': 'metal' };
    const exhaustingMap = { 'wood': ['fire', 'earth', 'metal'], 'fire': ['earth', 'metal', 'water'], 'earth': ['metal', 'water', 'wood'], 'metal': ['water', 'wood', 'fire'], 'water': ['wood', 'fire', 'earth'] };
    
    const supportType = generatingMap[dmType];
    const weakeningTypes = exhaustingMap[dmType];
    
    let weights = { monthZhi: 40, dayZhi: 15, yearZhi: 10, hourZhi: 10, monthGan: 10, yearGan: 8, hourGan: 7 };
    let totalWeightPossibility = isTimeUnknown ? 83 : 100;
    
    let rawScore = 0; 
    let supportingElements = []; 
    let weakeningElements = [];

    const elementsToCheck = [
        { char: currentBaZiData.month.zhi, weight: weights.monthZhi, name: 'เสาเดือน' },
        { char: currentBaZiData.day.zhi, weight: weights.dayZhi, name: 'ราศีล่างวัน' },
        { char: currentBaZiData.year.zhi, weight: weights.yearZhi, name: 'เสาปี' },
        { char: currentBaZiData.month.gan, weight: weights.monthGan, name: 'ราศีบนเดือน' },
        { char: currentBaZiData.year.gan, weight: weights.yearGan, name: 'ราศีบนปี' }
    ];
    
    if (!isTimeUnknown) {
        elementsToCheck.push({ char: currentBaZiData.hour.zhi, weight: weights.hourZhi, name: 'เสายาม' });
        elementsToCheck.push({ char: currentBaZiData.hour.gan, weight: weights.hourGan, name: 'ราศีบนยาม' });
    }

    elementsToCheck.forEach(item => {
        if (!item.char || item.char === '-') return;
        const elType = elementMap[item.char].type;
        if (elType === dmType || elType === supportType) { 
            rawScore += item.weight; 
            supportingElements.push(`${elementMap[item.char].thName} (${item.name})`); 
        } else { 
            weakeningElements.push(`${elementMap[item.char].thName} (${item.name})`); 
        }
    });

    let score = Math.round((rawScore / totalWeightPossibility) * 100);

    let weakeningTh = weakeningTypes.map(t => thTypeMap[t]).join(', ');
    let supportingTh = `${thTypeMap[supportType]}, ${thTypeMap[dmType]}`;
    let favArr = score >= 50 ? weakeningTypes : [supportType, dmType];
    let unfavArr = score >= 50 ? [supportType, dmType] : weakeningTypes;

    dmStrengthData = { 
        score: score, 
        status: score >= 50 ? "แข็งแรง (Strong)" : "อ่อนแอ (Weak)", 
        favorable: score >= 50 ? weakeningTh : supportingTh, 
        unfavorable: score >= 50 ? supportingTh : weakeningTh,
        favTypes: favArr, 
        unfavTypes: unfavArr
    };

    const dmBox = document.getElementById('dm-strength-box');
    let dmHtml = `<div class="dm-strength-title">กำลังของดิถี (Day Master Strength)</div>`;
    dmHtml += `<p style="font-size:15px;">ดิถี (ตัวคุณ) คือ <strong>${elementMap[dm].thName}</strong> (ธาตุ${thTypeMap[dmType]})</p>`;
    
    let favHtml = `<ul style="margin-top:8px; margin-bottom:15px; padding-left:20px; font-size:13px; line-height:1.6;">`;
    favArr.forEach(t => { 
        favHtml += `<li style="margin-bottom:5px;"><b>${iconMap[t]} ธาตุ${thTypeMap[t]}:</b> ${elementMetaphors[dmType][t].fav}</li>`; 
    });
    favHtml += `</ul>`;

    let unfavHtml = `<ul style="margin-top:8px; padding-left:20px; font-size:13px; line-height:1.6;">`;
    unfavArr.forEach(t => { 
        unfavHtml += `<li style="margin-bottom:5px;"><b>${iconMap[t]} ธาตุ${thTypeMap[t]}:</b> ${elementMetaphors[dmType][t].unfav}</li>`; 
    });
    unfavHtml += `</ul>`;

    let missingTimeNote = isTimeUnknown ? `<div style="font-size:11px; color:#f57f17; margin-bottom:10px; background:#fff8e1; padding:5px; border-radius:4px; text-align:center;">*คำนวณแบบ 3 เสา (ไม่ทราบเวลาเกิด) ความแม่นยำประมาณ 75-80%</div>` : '';

    if (score >= 50) {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-strong">💪 ดิถีแข็งแรง (Strong)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0;">`;
        dmHtml += missingTimeNote;
        dmHtml += `<p style="margin-bottom: 8px; font-size:13.5px;"><b>เหตุผล:</b> มีธาตุส่งเสริมอยู่มากเกินไป (เช่น <strong>${supportingElements[0] || 'ตัวเอง'}</strong>)</p>`;
        dmHtml += `<hr style="border:0.5px dashed #ccc; margin:12px 0;">`;
        dmHtml += `<p style="color:#2e7d32;"><strong>✅ ธาตุให้คุณ (ควรเข้าหาเพื่อระบายพลัง):</strong></p>` + favHtml;
        dmHtml += `<p style="color:#d32f2f;"><strong>❌ ธาตุให้โทษ (ควรหลีกเลี่ยงเพราะทำให้ล้น):</strong></p>` + unfavHtml;
        dmHtml += `</div>`;
    } else {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-weak">🍃 ดิถีอ่อนแอ (Weak)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0;">`;
        dmHtml += missingTimeNote;
        dmHtml += `<p style="margin-bottom: 8px; font-size:13.5px;"><b>เหตุผล:</b> มีธาตุบั่นทอนอยู่มากเกินไป (เช่น <strong>${weakeningElements[0] || 'สภาพแวดล้อม'}</strong>)</p>`;
        dmHtml += `<hr style="border:0.5px dashed #ccc; margin:12px 0;">`;
        dmHtml += `<p style="color:#2e7d32;"><strong>✅ ธาตุให้คุณ (ควรเข้าหาเพื่อหนุนนำ):</strong></p>` + favHtml;
        dmHtml += `<p style="color:#d32f2f;"><strong>❌ ธาตุให้โทษ (ควรหลีกเลี่ยงเพราะทำให้เหนื่อย):</strong></p>` + unfavHtml;
        dmHtml += `</div>`;
    }
    dmBox.innerHTML = dmHtml; 
    dmBox.style.display = "block";

    renderActionableAdvice(favArr);
}

function renderActionableAdvice(favArr) {
    const adviceBox = document.getElementById('actionable-advice-box');
    let html = `<h3 style="margin-top:0; color:#1b5e20; font-size:16px; margin-bottom:10px;">🎯 คำแนะนำมงคล (เสริมดวงประจำตัว)</h3>`;
    html += `<p style="font-size:13px; margin-bottom:10px; color:#555;">จากธาตุให้คุณของคุณ (${favArr.map(t => thTypeMap[t]).join(', ')}) ขอแนะนำเคล็ดลับดังนี้:</p>`;
    
    html += `<ul style="margin:0; padding-left:20px; font-size:13.5px; line-height:1.6;">`;
    
    let colors = favArr.map(t => actionableAdviceMap[t].color).join(', ');
    html += `<li style="margin-bottom:5px;"><b>👕 สีมงคล:</b> ${colors} (ใส่เสื้อผ้า, รถ, ของใช้ประจำตัว)</li>`;
    
    let dirs = favArr.map(t => actionableAdviceMap[t].dir).join(', ');
    html += `<li style="margin-bottom:5px;"><b>🧭 ทิศส่งเสริม:</b> ${dirs} (หันหัวนอน หรือนั่งทำงานหันหน้าไปทิศนี้)</li>`;

    let jobs = favArr.map(t => actionableAdviceMap[t].job).join(', ');
    html += `<li style="margin-bottom:5px;"><b>💼 สายอาชีพ/ธุรกิจ:</b> ${jobs}</li>`;
    
    html += `</ul>`;
    adviceBox.innerHTML = html;
    adviceBox.style.display = 'block';
}

function checkMissingPuzzles() {
    if (!currentBaZiData.day || currentBaZiData.day.gan === '-') return;

    const zhis = [];
    ['year', 'month', 'day', 'hour'].forEach(p => {
        if(currentBaZiData[p] && currentBaZiData[p].zhi !== '-') zhis.push(currentBaZiData[p].zhi);
    });
    const uniqueZhis = [...new Set(zhis)];

    const sanHe = [
        { name: 'ไตรภาคีน้ำ 💧', req: ['申', '子', '辰'], trigger: 'ไหวพริบ, การพลิกแพลง, โอกาสเดินทางหรือเชื่อมต่อผู้คนจำนวนมาก' },
        { name: 'ไตรภาคีไม้ 🌳', req: ['亥', '卯', '未'], trigger: 'การเติบโตก้าวกระโดด, เครือข่ายคอนเนคชั่น, ความคิดสร้างสรรค์สำเร็จ' },
        { name: 'ไตรภาคีไฟ 🔥', req: ['寅', '午', '戌'], trigger: 'ชื่อเสียงโด่งดัง, ความปรารถนาแรงกล้าสำเร็จ, เป็นที่จับตามอง' },
        { name: 'ไตรภาคีทอง 🪙', req: ['巳', '酉', '丑'], trigger: 'ความเด็ดขาด, อำนาจการตัดสินใจ, ความสำเร็จทางการเงินเป็นรูปธรรม' }
    ];

    let html = '<h3 style="margin-top:0; color:#e65100; font-size:16px; border-bottom:1px solid #ffcc80; padding-bottom:5px; margin-bottom:10px;">🧩 จิ๊กซอว์ที่รอคอย (Missing Puzzles)</h3>';
    let found = false;

    sanHe.forEach(group => {
        let matchCount = 0;
        let missing = [];
        group.req.forEach(z => {
            if (uniqueZhis.includes(z)) matchCount++;
            else missing.push(z);
        });

        if (matchCount === 2) {
            found = true;
            let mChar = missing[0];
            html += `<div style="margin-bottom:12px; font-size:13.5px;">`;
            html += `คุณมี <b>${group.req.filter(z => uniqueZhis.includes(z)).join(' และ ')}</b> แล้ว หากปีจร(วัยจร) หรือเดือนจร เป็น <b style="color:#d32f2f;">${mChar} (${elementMap[mChar].thName})</b> จะครบสมบูรณ์ ก่อเกิด <b>${group.name}</b><br>`;
            html += `<span style="color:#555;">✨ ส่งผลให้เกิด: ${group.trigger}</span>`;
            html += `</div>`;
        }
    });

    const box = document.getElementById('missing-puzzle-box');
    if (found) {
        box.innerHTML = html;
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }
}

function analyzeDailyVibe() {
    if (!currentBaZiData.day || currentBaZiData.day.gan === '-') return;
    
    const tGan = currentTimeData.day.gan;
    const tZhi = currentTimeData.day.zhi;
    const tTypeGan = elementMap[tGan].type;
    const tTypeZhi = elementMap[tZhi].type;
    const dm = currentBaZiData.day.gan;
    const dmType = elementMap[dm].type;

    let score = 0;
    let messages = [];
    let isVaultOpen = false;

    if (dmStrengthData.favTypes.includes(tTypeGan) || dmStrengthData.favTypes.includes(tTypeZhi)) {
        score += 2; 
        let favType = dmStrengthData.favTypes.includes(tTypeGan) ? tTypeGan : tTypeZhi;
        messages.push(`✨ <b>พลังงานเกื้อหนุน:</b> ${elementMetaphors[dmType][favType].fav}`);
    } else if (dmStrengthData.unfavTypes.includes(tTypeGan) || dmStrengthData.unfavTypes.includes(tTypeZhi)) {
        score -= 1;
        let unfavType = dmStrengthData.unfavTypes.includes(tTypeGan) ? tTypeGan : tTypeZhi;
        messages.push(`⚠️ <b>พลังงานกดดัน:</b> ${elementMetaphors[dmType][unfavType].unfav}`);
    }

    let hasClash = false; 
    let hasCombo = false;
    ['year', 'month', 'day', 'hour'].forEach(p => {
        let nZhi = currentBaZiData[p].zhi;
        if (nZhi === '-') return; // ข้ามเสาที่ไม่มี

        if (interactions.earthlyClashes[tZhi] === nZhi) {
            score -= 2; 
            hasClash = true;
            messages.push(`🚨 <b>ระวังชง:</b> วันนี้ปะทะเสา${pillarNamesTh[p]} -> <i>${clashMetaphors[p]}</i>`);
        }
        if (interactions.earthlyCombos[tZhi] === nZhi) {
            score += 2; 
            hasCombo = true;
            messages.push(`🤝 <b>ภาคีฮะ:</b> วันนี้ผูกพันกับเสา${pillarNamesTh[p]} -> <i>${comboMetaphors[p]}</i>`);
        }
        if (tZhi === currentVaults.wealthVault) {
            isVaultOpen = true;
        }
    });

    if (isVaultOpen) {
        score += 3;
        messages.push(`💰 <b>เปิดคลังสมบัติ:</b> วันนี้มีเกณฑ์รับทรัพย์ก้อนโต หรือได้โอกาสทางการเงินสำคัญ!`);
    }

    let theme = "theme-neutral"; 
    let title = "สแกนพลังงานวันนี้"; 
    let boxClass = "briefing-neutral";
    
    if (score >= 2) { 
        theme = "theme-good"; 
        title = "✨ วันนี้ดวงเปิดทาง ราบรื่น!"; 
        boxClass = "briefing-good"; 
    } else if (score < 0) { 
        theme = "theme-bad"; 
        title = "⚠️ วันนี้พลังงานผันผวน ระมัดระวัง"; 
        boxClass = "briefing-bad"; 
    }
    
    if (isVaultOpen) { 
        theme = "theme-vault"; 
        title = "💰 วันนี้เปิดคลัง รับทรัพย์!"; 
        boxClass = "briefing-vault"; 
    }

    document.getElementById('main-app-container').className = `container ${theme}`;
    
    let html = `<h3 class="briefing-title">${title}</h3>`;
    html += `<p style="margin:5px 0 10px 0; font-size:13px;">(วันนี้คือวัน <b>${tGan}${tZhi}</b> ธาตุ${thTypeMap[tTypeGan]}/${thTypeMap[tTypeZhi]})</p>`;
    html += `<ul style="margin:0; padding-left:20px; font-size:13.5px; line-height:1.6;">`;
    messages.forEach(m => html += `<li>${m}</li>`);
    html += `</ul>`;

    let briefBox = document.getElementById('daily-briefing-box');
    briefBox.className = `briefing-container ${boxClass}`;
    briefBox.innerHTML = html;
    briefBox.style.display = "block";
}

function openMeetingPlanner() {
    if (!currentBaZiData.day || currentBaZiData.day.gan === '-') return alert("กรุณาคำนวณผูกดวงก่อนครับ");
    
    let html = '';
    const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const times = ['23:00 - 00:59','01:00 - 02:59','03:00 - 04:59','05:00 - 06:59','07:00 - 08:59','09:00 - 10:59','11:00 - 12:59','13:00 - 14:59','15:00 - 16:59','17:00 - 18:59','19:00 - 20:59','21:00 - 22:59'];
    const dmType = elementMap[currentBaZiData.day.gan].type;

    branches.forEach((b, i) => {
        let bType = elementMap[b].type;
        let score = 0; 
        let desc = ''; 
        let cls = '';
        
        if (dmStrengthData.favTypes.includes(bType)) { 
            score++; 
            desc += elementMetaphors[dmType][bType].fav + ' '; 
        } else if (dmStrengthData.unfavTypes.includes(bType)) { 
            score--; 
            desc += elementMetaphors[dmType][bType].unfav + ' '; 
        }

        let isVault = false;
        
        ['year', 'month', 'day', 'hour'].forEach(p => {
            let nZhi = currentBaZiData[p].zhi;
            if (nZhi === '-') return;

            if (interactions.earthlyClashes[b] === nZhi) { 
                score -= 2; 
                desc += `<br><span style="color:#d32f2f">⚠️ ชง${pillarNamesTh[p]} (${clashMetaphors[p].split(' ')[0]})</span>`; 
            }
            if (interactions.earthlyCombos[b] === nZhi) { 
                score += 2; 
                desc += `<br><span style="color:#2e7d32">✅ ฮะ${pillarNamesTh[p]} (${comboMetaphors[p].split(' ')[0]})</span>`; 
            }
        });
        
        if (b === currentVaults.wealthVault) { 
            score += 3; 
            isVault = true; 
            desc = `<b>💰 เปิดคลังสมบัติ!</b><br>` + desc; 
        }

        let rating = "➖";
        if (score >= 2) { 
            rating = "⭐⭐⭐"; 
            cls = "good"; 
        } else if (score === 1) { 
            rating = "⭐"; 
            cls = "good"; 
        } else if (score < 0) { 
            rating = "⚠️"; 
            cls = "bad"; 
        }
        
        if (isVault) { 
            cls = "vault"; 
            rating = "💎"; 
        }

        html += `<div class="planner-item ${cls}">
                    <div class="planner-time">${times[i]}</div>
                    <div class="planner-zhi"><b>${b}</b><br><span style="font-size:10px;">ธาตุ${thTypeMap[bType]}</span></div>
                    <div class="planner-score">${rating}</div>
                    <div class="planner-desc">${desc || 'ราบเรียบ ปกติ'}</div>
                 </div>`;
    });

    document.getElementById('planner-detail').innerHTML = html;
    document.getElementById('planner-modal').style.display = "flex";
}
function closeMeetingPlanner() { 
    document.getElementById('planner-modal').style.display = "none"; 
}

function openPersonalCalendar() {
    if (!currentBaZiData.day || currentBaZiData.day.gan === '-') return alert("กรุณาคำนวณผูกดวงก่อนครับ");
    renderCalendarGrid(currentCalYear, currentCalMonth);
    document.getElementById('calendar-modal').style.display = "flex";
}
function closePersonalCalendar() { 
    document.getElementById('calendar-modal').style.display = "none"; 
}
function changeCalendarMonth(offset) {
    currentCalMonth += offset;
    if (currentCalMonth > 12) { 
        currentCalMonth = 1; 
        currentCalYear++; 
    } else if (currentCalMonth < 1) { 
        currentCalMonth = 12; 
        currentCalYear--; 
    }
    renderCalendarGrid(currentCalYear, currentCalMonth);
}

function renderCalendarGrid(year, month) {
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    document.getElementById('calendar-month-title').innerText = `📅 ${monthNames[month-1]} ${year}`;

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); 

    let html = `<div class="cal-header">อา</div><div class="cal-header">จ</div><div class="cal-header">อ</div><div class="cal-header">พ</div><div class="cal-header">พฤ</div><div class="cal-header">ศ</div><div class="cal-header">ส</div>`;
    
    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div class="cal-day empty"></div>`;
    }

    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
        const solar = Solar.fromYmd(year, month, d);
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();
        const dGan = bazi.getDayGan(); 
        const dZhi = bazi.getDayZhi();
        
        let score = 0; 
        let cls = ""; 
        let interacts = []; 
        let isVault = false;
        
        ['year', 'month', 'day', 'hour'].forEach(p => {
            let nZhi = currentBaZiData[p].zhi;
            if (nZhi === '-') return;

            if (interactions.earthlyClashes[dZhi] === nZhi) { 
                score -= 2; 
                interacts.push(`ชงเสา${pillarNamesTh[p]}`); 
            }
            if (interactions.earthlyCombos[dZhi] === nZhi) { 
                score += 2; 
                interacts.push(`ฮะเสา${pillarNamesTh[p]}`); 
            }
        });
        if (dZhi === currentVaults.wealthVault) { 
            score += 3; 
            isVault = true; 
        }

        if (score >= 2) {
            cls = "cal-good"; 
        } else if (score < 0) {
            cls = "cal-bad";
        }
        
        if (isVault) {
            cls = "cal-vault";
        }
        
        if (year === today.getFullYear() && month === today.getMonth()+1 && d === today.getDate()) {
            cls += " cal-today";
        }

        let popupData = `${dGan}${dZhi}|${elementMap[dZhi].thName.split(' ')[0]}|${score}|${interacts.join(',')}|${isVault}`;
        
        html += `<div class="cal-day ${cls}" onclick="showCalPopup('${d}', '${monthNames[month-1]}', '${popupData}')">
                    <span class="cal-date-num">${d}</span>
                    <span class="cal-zhi">${dZhi}</span>
                 </div>`;
    }
    document.getElementById('calendar-grid').innerHTML = html;
}

function showCalPopup(d, mText, dataStr) {
    const [ganZhi, thZhi, scoreStr, interStr, isVaultStr] = dataStr.split('|');
    const score = parseInt(scoreStr);
    const isVault = isVaultStr === 'true';
    let text = `วันที่ ${d} ${mText}<br><b>วัน ${ganZhi} (${thZhi})</b><hr style="margin:5px 0;">`;
    
    if (isVault) {
        text += `<div class="advice-box advice-good" style="background:#fff8e1; border-color:#ffb300; color:#f57f17;">💰 <b>วันเปิดคลังสมบัติ:</b> เหมาะกับการลงทุน เซ็นสัญญา รับทรัพย์!</div>`;
    } else if (score >= 2) {
        text += `<div class="advice-box advice-good">✨ <b>วันฤกษ์ดี:</b> ราบรื่น (${interStr.replace(/,/g, ', ')}) เหมาะกับการเริ่มต้น เจรจาค้าขาย</div>`;
    } else if (score < 0) {
        text += `<div class="advice-box advice-bad">⚠️ <b>วันควรระวัง:</b> ผันผวน (${interStr.replace(/,/g, ', ')}) เลี่ยงการตัดสินใจเรื่องสำคัญ เดินทางระวัง</div>`;
    } else {
        text += `<div class="advice-box" style="background:#f5f5f5; border-left:3px solid #ccc;">➖ <b>วันราบเรียบ:</b> ดำเนินชีวิตตามปกติ ไม่มีชงฮะรุนแรง</div>`;
    }
    
    document.getElementById('popup-title').innerText = "ฤกษ์ยามประจำวัน";
    document.getElementById('popup-detail').innerHTML = text;
    document.getElementById('popup-modal').style.display = "flex";
}

function getAdviceText(type, contextPillarId) {
    const context = pillarContextMap[contextPillarId];
    if (type === 'ฮะ') return `<div class="advice-box advice-good"><strong>✨ ฮะ (ภาคี):</strong> ${comboMetaphors[contextPillarId]}</div>`;
    if (type === 'ชง') return `<div class="advice-box advice-bad"><strong>🚨 ชง (ปะทะ):</strong> ${clashMetaphors[contextPillarId]}</div>`;
    if (type === 'เฮ้ง') return `<div class="advice-box advice-bad"><strong>⚠️ เฮ้ง (เบียดเบียน):</strong> อาจเกิดความอึดอัดใจ วุ่นวาย หรือกดดันในเรื่อง ${context}</div>`;
    if (type === 'ไห่') return `<div class="advice-box advice-bad"><strong>🗡️ ไห่ (ให้ร้าย):</strong> ระวังถูกแทงข้างหลัง นินทา หรือปัญหาสุขภาพจาก ${context}</div>`;
    if (type === 'ผั่ว') return `<div class="advice-box advice-bad"><strong>🔨 ผั่ว (แตกหัก):</strong> สิ่งที่หวังอาจพังทลาย ต้องเริ่มใหม่ในเรื่อง ${context}</div>`;
    return "";
}

function showPopup(titleName, elementId, type) {
    const [pillar, level] = elementId.split('-');
    const sourceData = type === 'natal' ? currentBaZiData : currentTimeData;
    const pillarData = sourceData[pillar];
    
    const char = level === 'heaven' ? pillarData.gan : pillarData.zhi;
    if (!char || char === '-') return; 

    let htmlContent = `<h3>📌 ตำแหน่ง: ${pillarContextMap[pillar]} ${type === 'natal' ? `` : '(เวลาปัจจุบัน)'}</h3><hr style="margin: 10px 0; border: 0.5px solid #eee;">`;
    let relationHtml = ''; 
    let specialStarsHtml = '';
    const pillarsToCheck = ['year', 'month', 'day', 'hour'];
    const charType = elementMap[char].thName;

    htmlContent += `<p style="font-size: 16px; margin-bottom:15px;"><b>อักษร:</b> <span style="font-size:22px; color:#d32f2f; font-weight:bold;">${char}</span> (${charType})</p>`;

    htmlContent += `<div style="background-color: #f1f8e9; padding: 12px; border-radius: 8px; border-left: 4px solid #4caf50; margin-bottom: 15px; font-size: 14px; line-height: 1.6;">`;
    const tenGodCh = tenGodsMap[currentBaZiData.day.gan][pillarData.gan];
    const shiShen = (pillar === 'day' && level === 'heaven') ? 'ดิถี (ตัวคุณ)' : (shiShenMap[tenGodCh] || tenGodCh);
    htmlContent += `<p style="margin-bottom:5px;">☯️ <b>สิบเทพ (บทบาท):</b> <span style="color:#d32f2f; font-weight:bold;">${shiShen}</span><br><span style="color:#555; font-size:12.5px;">(${shiShenDesc[shiShen]?.replace(/\n/g, ' ') || 'ศูนย์กลางของดวงชะตา'})</span></p>`;

    if (pillarData.diShi && pillarData.diShi !== '-') {
        const dsData = diShiDesc[pillarData.diShi];
        htmlContent += `<p style="margin-bottom:5px;">⏳ <b>12 วัฏจักร (พลังงาน):</b> ${dsData.th} (${pillarData.diShi})<br><span style="color:#555; font-size:12.5px;">-> ${dsData.desc}</span></p>`;
    }
    
    if (pillarData.naYin && pillarData.naYin !== '-') {
        let nayinName = pillarData.naYin;
        let nyElement = nayinName.includes('金') ? 'ทอง' : nayinName.includes('木') ? 'ไม้' : nayinName.includes('水') ? 'น้ำ' : nayinName.includes('火') ? 'ไฟ' : nayinName.includes('土') ? 'ดิน' : '';
        let nyDesc = naYinDesc[nyElement] || 'พลังธาตุแฝงที่ผสมจากราศีบน-ล่าง';
        htmlContent += `<p style="margin-bottom:5px;">🎶 <b>อิมเจีย (ธาตุเสียง):</b> ${nayinName} (ธาตุ${nyElement})<br><span style="color:#555; font-size:12.5px;">-> ${nyDesc}</span></p>`;
    }
    
    if (level === 'earth' && currentKongWang.includes(char)) {
        htmlContent += `<p style="color:#d32f2f; margin-top:8px;"><b>🕳️ ตำแหน่งคงบ้วง:</b> เสานี้ติดคงบ้วง (มักว่างเปล่า ต้องเหนื่อยกว่าปกติถึงจะได้มา)</p>`;
    }
    htmlContent += `</div>`;

    if (level === 'earth') {
        const foundStars = checkSpecialStars(char, currentBaZiData.day.gan, currentBaZiData.year.zhi, currentBaZiData.day.zhi);
        if (foundStars.length > 0) {
            htmlContent += `<div style="background-color: #fff3e0; padding: 12px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 15px;">`;
            htmlContent += `<p style="margin-bottom: 8px; font-weight: bold; color:#e65100;">🔮 ดาวพิเศษที่สถิตในเสานี้:</p><ul style="padding-left: 20px; margin: 0; font-size: 13.5px; line-height: 1.6;">`;
            foundStars.forEach(star => { 
                htmlContent += `<li style="margin-bottom: 5px;"><b>${star.icon} ${star.name}:</b> ${star.desc}</li>`; 
            });
            htmlContent += `</ul></div>`;
        }
    }

    if (level === 'heaven') {
        if (type === 'natal') {
            pillarsToCheck.forEach(p => {
                if (p !== pillar && currentBaZiData[p].gan !== '-') {
                    const otherChar = currentBaZiData[p].gan;
                    if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <b>ฟ้าฮะ:</b> ผูกพันกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <b>ฟ้าชง:</b> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                }
            });
        } else { 
            if (Object.keys(currentBaZiData).length > 0) {
                pillarsToCheck.forEach(p => {
                    const otherChar = currentBaZiData[p].gan;
                    if (otherChar === '-' || !otherChar) return;
                    if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✨ เวลานี้เข้ามา <b>ฮะ</b> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ฮะ', p);
                    if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <b>ชง</b> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ชง', p);
                });
            }
        }
    } else { 
        if (type === 'natal') {
            htmlContent += `<p style="font-size:14px; margin-bottom:10px;"><b>ราศีแฝง:</b> <span style="color:#d32f2f; font-weight:bold;">${hiddenGanMap[char].join(', ')}</span></p>`;
            pillarsToCheck.forEach(p => {
                if (p !== pillar && currentBaZiData[p].zhi !== '-') {
                    const otherChar = currentBaZiData[p].zhi;
                    if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <b>ลักฮะ:</b> ผูกพันกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <b>ลักชง:</b> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyHarms[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <b>ลักไห่:</b> ถูกเบียดเบียนจาก เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyDestructions[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <b>ลักผั่ว:</b> แตกหักกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(otherChar)) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <b>ลักเฮ้ง:</b> วุ่นวายกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                }
            });
        } else { 
            if (Object.keys(currentBaZiData).length > 0) {
                pillarsToCheck.forEach(p => {
                    const otherChar = currentBaZiData[p].zhi;
                    if (otherChar === '-' || !otherChar) return;
                    if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✨ เวลานี้เข้ามา <b>ฮะ</b> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ฮะ', p);
                    if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <b>ชง</b> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ชง', p);
                    if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(otherChar)) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <b>เฮ้ง</b> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('เฮ้ง', p);
                });
            }
        }
    }

    if (relationHtml !== '') {
        htmlContent += `<div style="padding: 12px; background-color: #f9f9f9; border-left: 4px solid #ffb300; border-radius: 8px; font-size: 14px; line-height: 1.6;">`;
        htmlContent += `<p style="margin-bottom: 8px; font-weight: bold; color: #f57f17;">🔍 ปฏิสัมพันธ์ (Interactions):</p>${relationHtml}</div>`;
    } else if (type === 'current' && Object.keys(currentBaZiData).length > 0) {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">เวลาปัจจุบันไม่ได้ปะทะหรือส่งผลพิเศษกับเสานี้ครับ</p></div>`;
    }

    // ✨ สแกนแอบฮะ (เฉพาะดวงกำเนิด)
    if (type === 'natal') {
        let hiddenHtml = getHiddenComboHtml(char, level, pillar, currentBaZiData);
        if (hiddenHtml !== '') {
            htmlContent += `<div style="padding: 12px; background-color: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 8px; margin-top: 10px; font-size: 14px; line-height: 1.6;">`;
            htmlContent += `<p style="margin-bottom: 8px; font-weight: bold; color: #7b1fa2;">🕵️‍♂️ ภาคีซ่อนเร้น (Hidden Combos):</p>${hiddenHtml}</div>`;
        }
    }

    document.getElementById('popup-detail').innerHTML = htmlContent;
    document.getElementById('popup-title').innerText = `รายละเอียดอักษรจีน`;
    document.getElementById('popup-modal').style.display = "flex";
}
function closePopup() { 
    document.getElementById('popup-modal').style.display = "none"; 
}

function getInteractionHTML(gan, zhi) {
    let res = [];
    if (!currentBaZiData.day || currentBaZiData.day.gan === '-') return `<div class="luck-interaction interact-none">(ไม่มีปะทะ)</div>`;
    
    const interactDesc = { 'ฮะ': 'รวมตัว ส่งเสริม ผูกพัน ราบรื่น', 'ชง': 'ปะทะ ขัดแย้ง เปลี่ยนแปลงกะทันหัน', 'เฮ้ง': 'เบียดเบียน อึดอัดใจ วุ่นวาย', 'ไห่': 'ให้ร้าย แทงข้างหลัง สุขภาพ', 'ผั่ว': 'แตกหัก เสียหาย เริ่มต้นใหม่' };

    if (interactions.heavenlyCombos[gan] === currentBaZiData.day.gan) {
        res.push(`<div class="interact-good tooltip-container">✨ ฟ้าฮะ<span class="tooltip-text">${interactDesc['ฮะ']}</span></div>`);
    }

    ['year', 'month', 'day', 'hour'].forEach(p => {
        let chartZhi = currentBaZiData[p].zhi;
        if (chartZhi === '-') return;

        if (interactions.earthlyClashes[zhi] === chartZhi) {
            res.push(`<div class="interact-bad tooltip-container" style="color:#d32f2f;">💥 ชง${pillarNamesTh[p]}<span class="tooltip-text"><b>${clashMetaphors[p]}</b><br>${interactDesc['ชง']}กับเสา${pillarNamesTh[p]}</span></div>`);
        } else if (interactions.earthlyCombos[zhi] === chartZhi) {
            res.push(`<div class="interact-good tooltip-container" style="color:#2e7d32;">🤝 ฮะ${pillarNamesTh[p]}<span class="tooltip-text"><b>${comboMetaphors[p]}</b><br>${interactDesc['ฮะ']}กับเสา${pillarNamesTh[p]}</span></div>`);
        }
    });

    if(res.length > 0) return `<div class="luck-interaction">${res.slice(0, 3).join('')}</div>`; 
    return `<div class="luck-interaction interact-none">(ไม่มีปะทะ)</div>`;
}

function renderCurrentTimeBaZi() {
    const now = new Date();
    const currentSolar = Solar.fromDate(now);
    const currentLunar = currentSolar.getLunar();
    const baziObj = currentLunar.getEightChar();

    currentTimeData = {
        year: { gan: baziObj.getYearGan(), zhi: baziObj.getYearZhi(), naYin: baziObj.getYearNaYin(), diShi: baziObj.getYearDiShi() },
        month: { gan: baziObj.getMonthGan(), zhi: baziObj.getMonthZhi(), naYin: baziObj.getMonthNaYin(), diShi: baziObj.getMonthDiShi() },
        day: { gan: baziObj.getDayGan(), zhi: baziObj.getDayZhi(), naYin: baziObj.getDayNaYin(), diShi: baziObj.getDayDiShi() },
        hour: { gan: baziObj.getTimeGan(), zhi: baziObj.getTimeZhi(), naYin: baziObj.getTimeNaYin(), diShi: baziObj.getTimeDiShi() }
    };

    ['year', 'month', 'day', 'hour'].forEach(p => {
        renderBox(`curr-${p}-heaven`, currentTimeData[p].gan, 'current', false);
        renderBox(`curr-${p}-earth`, currentTimeData[p].zhi, 'current', true);
    });

    if (currentBaZiData.day && currentBaZiData.day.gan && currentBaZiData.day.gan !== '-') {
        updateShiShenLabels(currentTimeData, 'curr', currentBaZiData.day.gan);
        analyzeDailyVibe();
    }
}

function travelToYear(targetYear) {
    const travelSolar = Solar.fromYmd(targetYear, 6, 1);
    const travelLunar = travelSolar.getLunar();
    const baziObj = travelLunar.getEightChar();

    currentTimeData = {
        year: { gan: baziObj.getYearGan(), zhi: baziObj.getYearZhi(), naYin: baziObj.getYearNaYin(), diShi: baziObj.getYearDiShi() },
        month: { gan: baziObj.getMonthGan(), zhi: baziObj.getMonthZhi(), naYin: baziObj.getMonthNaYin(), diShi: baziObj.getMonthDiShi() },
        day: { gan: baziObj.getDayGan(), zhi: baziObj.getDayZhi(), naYin: baziObj.getDayNaYin(), diShi: baziObj.getDayDiShi() },
        hour: { gan: baziObj.getTimeGan(), zhi: baziObj.getTimeZhi(), naYin: baziObj.getTimeNaYin(), diShi: baziObj.getTimeDiShi() }
    };

    ['year', 'month', 'day', 'hour'].forEach(p => {
        renderBox(`curr-${p}-heaven`, currentTimeData[p].gan, 'current', false);
        renderBox(`curr-${p}-earth`, currentTimeData[p].zhi, 'current', true);
    });
    
    if (currentBaZiData.day && currentBaZiData.day.gan && currentBaZiData.day.gan !== '-') {
        updateShiShenLabels(currentTimeData, 'curr', currentBaZiData.day.gan);
        analyzeDailyVibe(); 
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('current-time-title').innerHTML = `⏳ พลังงาน (Time Machine: ปี ค.ศ. ${targetYear})`;
    document.getElementById('reset-time-btn').style.display = 'inline-block';
}

function resetTimeMachine() {
    renderCurrentTimeBaZi();
    document.getElementById('current-time-title').innerHTML = `⏳ พลังงานกาลเวลาปัจจุบัน`;
    document.getElementById('reset-time-btn').style.display = 'none';
}

function calculateBaZi() {
    const dateInput = document.getElementById('birth_date').value;
    const timeInput = document.getElementById('birth_time').value;
    const genderInput = document.getElementById('gender').value;
    
    if (!dateInput) return alert("กรุณากรอกวันที่เกิดให้ครบถ้วนครับ (เวลาเกิดสามารถเว้นว่างได้)");

    isTimeUnknown = (!timeInput); 
    const [y, m, d] = dateInput.split('-'); 
    let h = 12, min = 0; 
    if (!isTimeUnknown) {
        [h, min] = timeInput.split(':');
    }

    const solar = Solar.fromYmdHms(parseInt(y), parseInt(m), parseInt(d), parseInt(h), parseInt(min), 0);
    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar(); 
    
    currentKongWang = bazi.getDayXunKong();

    currentBaZiData = {
        gender: genderInput,
        year: { gan: bazi.getYearGan(), zhi: bazi.getYearZhi(), naYin: bazi.getYearNaYin(), diShi: bazi.getYearDiShi() },
        month: { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi(), naYin: bazi.getMonthNaYin(), diShi: bazi.getMonthDiShi() },
        day: { gan: bazi.getDayGan(), zhi: bazi.getDayZhi(), naYin: bazi.getDayNaYin(), diShi: bazi.getDayDiShi() },
        hour: isTimeUnknown ? { gan: '-', zhi: '-', naYin: '-', diShi: '-' } : { gan: bazi.getTimeGan(), zhi: bazi.getTimeZhi(), naYin: bazi.getTimeNaYin(), diShi: bazi.getTimeDiShi() }
    };

    currentVaults = calculateVaults(currentBaZiData.day.gan);
    calculateDMStrength(); 

    ['year', 'month', 'day', 'hour'].forEach(p => {
        renderBox(`${p}-heaven`, currentBaZiData[p].gan, 'natal', false);
        renderBox(`${p}-earth`, currentBaZiData[p].zhi, 'natal', true);
    });

    updateShiShenLabels(currentBaZiData, '', currentBaZiData.day.gan);
    renderElementChart(); 
    checkMissingPuzzles(); 
    renderCurrentTimeBaZi();

    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - parseInt(y);
    const yun = bazi.getYun(genderInput === 'ชาย' ? 1 : 0);
    const daYunList = yun.getDaYun();
    
    let activeDY = daYunList[0];
    daYunList.forEach(dy => { 
        if (currentAge >= dy.getStartAge()) activeDY = dy; 
    });
    activeDaYunData = { gan: activeDY.getGanZhi().charAt(0), zhi: activeDY.getGanZhi().charAt(1), startAge: activeDY.getStartAge() };

    const currentLYear = Solar.fromYmd(currentYear, 6, 1).getLunar();
    activeLiuNianData = { gan: currentLYear.getYearGan(), zhi: currentLYear.getYearZhi(), year: currentYear };

    renderLuck(solar, genderInput === 'ชาย' ? 1 : 0, currentAge);

    document.getElementById('ai-result-box').style.display = "none";
    document.getElementById('custom-question-box').style.display = "block"; 
    document.getElementById('download-btn').style.display = "block"; 
    document.getElementById('natal-bazi-section').style.display = "block";
    document.getElementById('luck-sections').style.display = "block";
    document.getElementById('ai-buttons-group').style.display = "grid"; 
    document.getElementById('planner-buttons-group').style.display = "grid"; 
    document.getElementById('save-btn').style.display = "block";
}

function renderLuck(solar, genderNum, currentAge) {
    const bazi = solar.getLunar().getEightChar();
    const yun = bazi.getYun(genderNum);
    const daYunList = yun.getDaYun();
    const dayGan = currentBaZiData.day.gan; 
    
    const daYunContainer = document.getElementById('da-yun-list');
    daYunContainer.innerHTML = '';
    
    daYunList.forEach(dy => {
        const gan = dy.getGanZhi().charAt(0); 
        const zhi = dy.getGanZhi().charAt(1);
        const interactionHtml = getInteractionHTML(gan, zhi); 
        
        let tenGodCh = tenGodsMap[dayGan][gan];
        let tenGodTh = shiShenMap[tenGodCh] || tenGodCh;
        let desc = shiShenDesc[tenGodTh] || '';
        let isKw = currentKongWang.includes(zhi);

        let isCurrentDaYun = (currentAge >= dy.getStartAge() && currentAge < dy.getStartAge() + 10);
        let extraStyle = isCurrentDaYun ? 'box-shadow: 0 0 10px #4caf50; border: 2px solid #4caf50;' : '';
        let currentLabel = isCurrentDaYun ? `<div style="background:#4caf50; color:white; font-size:10px; padding:2px 5px; border-radius:10px; margin-bottom:5px; animation: pulse 2s infinite;">📍 วัยจรปัจจุบัน</div>` : '';

        daYunContainer.innerHTML += `
            <div class="luck-pillar" style="${extraStyle}">
                ${currentLabel}
                <div class="age-label">อายุ ${dy.getStartAge()}</div>
                <div class="luck-shishen tooltip-container">${tenGodTh}<span class="tooltip-text">${desc}</span></div>
                <div class="box ${elementMap[gan]?.type}">${getBoxInnerHtml(gan)}</div>
                <div class="box ${elementMap[zhi]?.type}" style="opacity: ${isKw ? '0.6' : '1'}">${getBoxInnerHtml(zhi, [], isKw)}</div>
                <div class="year-label">${dy.getStartYear()}</div>
                ${interactionHtml}
            </div>`;
    });

    const currentYear = new Date().getFullYear();
    const liuNianContainer = document.getElementById('liu-nian-list');
    liuNianContainer.innerHTML = '';
    
    let radarHtml = `<ul style="list-style-type:none; padding:0; margin:0; font-size:14px; line-height:1.7;">`;

    for (let i = 0; i < 10; i++) {
        const tYear = currentYear + i;
        const lYear = Solar.fromYmd(tYear, 6, 1).getLunar();
        const yGan = lYear.getYearGan(); 
        const yZhi = lYear.getYearZhi();
        const interactionHtml = getInteractionHTML(yGan, yZhi); 
        
        let tenGodCh = tenGodsMap[dayGan][yGan];
        let tenGodTh = shiShenMap[tenGodCh] || tenGodCh;
        let desc = shiShenDesc[tenGodTh] || '';
        let isKw = currentKongWang.includes(yZhi);

        let extraStyle = (i === 0) ? 'box-shadow: 0 0 10px #2196f3; border: 2px solid #2196f3;' : '';
        let currentLabel = (i === 0) ? `<div style="background:#2196f3; color:white; font-size:10px; padding:2px 5px; border-radius:10px; margin-bottom:5px; animation: pulse 2s infinite;">📍 ปีปัจจุบัน</div>` : '';

        liuNianContainer.innerHTML += `
            <div class="luck-pillar" style="${extraStyle}">
                ${currentLabel}
                <div class="age-label">${tYear}</div>
                <div class="luck-shishen tooltip-container">${tenGodTh}<span class="tooltip-text">${desc}</span></div>
                <div class="box ${elementMap[yGan]?.type}">${getBoxInnerHtml(yGan)}</div>
                <div class="box ${elementMap[yZhi]?.type}" style="opacity: ${isKw ? '0.6' : '1'}">${getBoxInnerHtml(yZhi, [], isKw)}</div>
                <div class="year-label">ปี${lYear.getYearShengXiao()}</div>
                ${interactionHtml}
                <button class="time-warp-btn" onclick="travelToYear(${tYear})">⏳ วาร์ป</button>
            </div>`;

        if (i < 5) {
            let radarEvents = [];
            if (yZhi === currentVaults.wealthVault) radarEvents.push(`<span style="color:#f57f17; font-weight:bold;">💰 รับทรัพย์ (เปิดคลังสมบัติ)</span>`);
            ['year', 'month', 'day', 'hour'].forEach(p => {
                let chartZhi = currentBaZiData[p].zhi;
                if (chartZhi === '-') return;
                if (interactions.earthlyClashes[yZhi] === chartZhi) radarEvents.push(`<span style="color:#d32f2f;">ระวังชง! ${clashMetaphors[p].split(' ')[0]}</span>`);
                if (interactions.earthlyCombos[yZhi] === chartZhi) radarEvents.push(`<span style="color:#2e7d32;">ฮะสมหวัง ${comboMetaphors[p].split(' ')[0]}</span>`);
            });

            let eventStr = radarEvents.length > 0 ? radarEvents.join(' / ') : `<span style="color:#757575;">ราบเรียบ เก็บเกี่ยวประสบการณ์</span>`;
            radarHtml += `<li style="margin-bottom:8px; border-bottom:1px dashed #eee; padding-bottom:5px;"><b>ปี ${tYear} (ปี${elementMap[yZhi].thName.split(' ')[0]}):</b> ${eventStr}</li>`;
        }
    }
    
    radarHtml += `</ul>`;
    document.getElementById('five-year-radar-box').innerHTML = radarHtml;
}

function openTutorial() {
    document.getElementById('tutorial-modal').style.display = "flex";
}
function closeTutorial() {
    document.getElementById('tutorial-modal').style.display = "none";
}

function openEncycTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { 
        tabcontent[i].style.display = "none"; 
        tabcontent[i].classList.remove("active"); 
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) { 
        tablinks[i].className = tablinks[i].className.replace(" active", ""); 
    }
    document.getElementById(tabName).style.display = "block"; 
    document.getElementById(tabName).classList.add("active");
    if(evt) evt.currentTarget.className += " active";
}

function openEncyclopedia() {
    if (!currentBaZiData.day || currentBaZiData.day.gan === '-') return alert("กรุณาคำนวณผูกดวงก่อนเปิดคัมภีร์ครับ");
    const dmGan = currentBaZiData.day.gan; 
    const dmType = elementMap[dmGan].thName;
    let html = '';

    html += `<div id="tab-basic" class="tab-content active">`;
    html += `<div class="encyc-section">
                <h3 class="encyc-title">👤 ดิถีตัวตน (Day Master)</h3>
                <p>ดิถีของคุณคือ <b>${dmType} (${dmGan})</b> ซึ่งเป็นตัวแทนแก่นแท้ของจิตวิญญาณคุณ</p>
                <p>${dmStrengthData.status} ทำให้คุณต้องการ <b>ธาตุ${dmStrengthData.favorable}</b> เพื่อสร้างสมดุลในชีวิต (เป็นธาตุให้คุณ)</p>
             </div>`;

    let missingElements = []; 
    const thNames = { wood: 'ไม้', fire: 'ไฟ', earth: 'ดิน', metal: 'ทอง', water: 'น้ำ' };
    const missingAdvice = {
        wood: 'ขาดความยืดหยุ่น การเติบโต และความเมตตา -> ควรปลูกต้นไม้ อ่านหนังสือ พัฒนาตัวเองเสมอ',
        fire: 'ขาดความกระตือรือร้น ความสุข การแสดงออก -> ควรหาแพสชั่น รอยยิ้ม และการเข้าสังคม',
        earth: 'ขาดความมั่นคง หนักแน่น ความน่าเชื่อถือ -> ควรสร้างวินัย รักษาคำพูด ทำสมาธิ',
        metal: 'ขาดความเด็ดขาด ยุติธรรม การตัดสินใจ -> ควรกล้าตัดสินใจ จัดระเบียบชีวิตให้ชัดเจน',
        water: 'ขาดปัญญา ไหวพริบ การปรับตัว -> ควรเรียนรู้สิ่งใหม่ๆ พลิกแพลงให้ลื่นไหลเหมือนน้ำ'
    };
    for(let t in elementCounts) { 
        if(elementCounts[t] === 0) missingElements.push(`<li><b>ธาตุ${thNames[t]}:</b> ${missingAdvice[t]}</li>`); 
    }

    html += `<div class="encyc-section"><h3 class="encyc-title">⚠️ ธาตุที่ขาดหาย (Missing Elements)</h3>`;
    if(missingElements.length > 0) { 
        html += `<ul style="margin:0; padding-left:20px;">${missingElements.join('')}</ul>`; 
    } else { 
        html += `<p>ยินดีด้วยครับ! ดวงของคุณมีธาตุทั้ง 5 ครบถ้วน (เบญจธาตุสมดุล)</p>`; 
    }
    html += `</div></div>`;

    html += `<div id="tab-gods" class="tab-content" style="display:none;">`;
    let godsInChart = new Set();
    ['year', 'month', 'hour'].forEach(p => { 
        let gan = currentBaZiData[p].gan; 
        if (gan === '-') return;
        let tenGodCh = tenGodsMap[dmGan][gan]; 
        if(tenGodCh) godsInChart.add(shiShenMap[tenGodCh] || tenGodCh); 
    });
    html += `<div class="encyc-section"><h3 class="encyc-title">☯️ สิบเทพในราศีบน (10 Gods)</h3>`;
    if (godsInChart.size > 0) { 
        godsInChart.forEach(god => { 
            let desc = shiShenDesc[god] || ''; 
            html += `<div class="encyc-item"><b>[${god}]</b><br>${desc.replace(/\n/g, '<br>')}</div>`; 
        }); 
    } else { 
        html += `<p>ไม่พบสิบเทพที่เด่นชัดในราศีบน</p>`; 
    }
    html += `</div></div>`;

    html += `<div id="tab-stars" class="tab-content" style="display:none;">`;
    let foundVaults = [];
    ['year', 'month', 'day', 'hour'].forEach(p => {
        let zhi = currentBaZiData[p].zhi;
        if (zhi === '-') return;
        if(zhi === currentVaults.wealthVault) foundVaults.push(`💰 <b>ไฉ่โข่ว (คลังสมบัติ)</b> อยู่ที่ เสา${pillarNamesTh[p]}: ดวงมีคลังเก็บเงิน หากเจอปีจรมาชนเปิดคลัง จะรวยพลิกชีวิต!`);
        if(zhi === currentVaults.powerVault) foundVaults.push(`🏛️ <b>กัวโข่ว (คลังอำนาจ)</b> อยู่ที่ เสา${pillarNamesTh[p]}: มีวาสนาบารมีซ่อนอยู่ เป็นผู้นำลับๆ`);
        if(zhi === currentVaults.resourceVault) foundVaults.push(`📚 <b>อิ่งโข่ว (คลังอุปถัมภ์)</b> อยู่ที่ เสา${pillarNamesTh[p]}: มีปัญญาและผู้ใหญ่หนุนหลังแบบคาดไม่ถึง`);
    });
    html += `<div class="encyc-section"><h3 class="encyc-title">🔐 คลังขุมทรัพย์ (The Vaults)</h3>`;
    if (foundVaults.length > 0) { 
        foundVaults.forEach(v => { html += `<div class="encyc-item">${v}</div>`; }); 
    } else { 
        html += `<p>ในดวงกำเนิดไม่มีตำแหน่งคลัง (ต้องอาศัยการออมด้วยตัวเอง)</p>
                 <p style="font-size:13px; color:#e65100;">*คลังสมบัติของคุณคือธาตุ <b>${elementMap[currentVaults.wealthVault].thName} (${currentVaults.wealthVault})</b> รอจังหวะปีจรวิ่งเข้ามาชนเพื่อเปิดคลังนะครับ!</p>`; 
    }
    html += `</div>`;

    html += `<div class="encyc-section"><h3 class="encyc-title">🕳️ ดาวคงบ้วง (ตำแหน่งสูญสิ้น)</h3><p>นักษัตรคงบ้วงของคุณคือ: <b>${currentKongWang || 'ไม่ทราบแน่ชัด'}</b></p></div></div>`;

    html += `<div id="tab-interact" class="tab-content" style="display:none;">`;
    let internalClashes = []; 
    const pillars = ['year', 'month', 'day', 'hour'];
    for(let i=0; i<pillars.length; i++) {
        for(let j=i+1; j<pillars.length; j++) {
            let p1 = pillars[i]; let p2 = pillars[j]; 
            let zhi1 = currentBaZiData[p1].zhi; let zhi2 = currentBaZiData[p2].zhi;
            if (zhi1 === '-' || zhi2 === '-') continue;

            if(interactions.earthlyClashes[zhi1] === zhi2) internalClashes.push(`💥 <b>ชง (ปะทะ):</b> เสา${pillarNamesTh[p1]} ชง เสา${pillarNamesTh[p2]} (มีการเปลี่ยนแปลง แตกหัก หรือชีพจรลงเท้า)`);
            if(interactions.earthlyCombos[zhi1] === zhi2) internalClashes.push(`🤝 <b>ฮะ (ผูกพัน):</b> เสา${pillarNamesTh[p1]} ฮะ เสา${pillarNamesTh[p2]} (มีความรักใคร่ ผูกพัน และช่วยเหลือกัน)`);
            if(interactions.earthlyPunishments[zhi1] && interactions.earthlyPunishments[zhi1].includes(zhi2)) internalClashes.push(`⚠️ <b>เฮ้ง (เบียดเบียน):</b> เสา${pillarNamesTh[p1]} เฮ้ง เสา${pillarNamesTh[p2]} (มักเกิดความอึดอัดใจ วุ่นวาย หรือกดดัน)`);
            if(interactions.earthlyHarms[zhi1] === zhi2) internalClashes.push(`⚡ <b>ไห่ (ให้ร้าย):</b> เสา${pillarNamesTh[p1]} ไห่ เสา${pillarNamesTh[p2]} (ระวังการถูกเอาเปรียบ หรือปัญหาสุขภาพ)`);
            if(interactions.earthlyDestructions[zhi1] === zhi2) internalClashes.push(`🔨 <b>ผั่ว (แตกหัก):</b> เสา${pillarNamesTh[p1]} ผั่ว เสา${pillarNamesTh[p2]} (สิ่งที่สร้างไว้มักมีเหตุให้ต้องสร้างใหม่)`);
        }
    }
    html += `<div class="encyc-section"><h3 class="encyc-title">⚡ ปฏิสัมพันธ์ในพื้นดวงกำเนิด (ชง ฮะ เฮ้ง)</h3>`;
    if (internalClashes.length > 0) { 
        internalClashes.forEach(clash => { html += `<div class="encyc-item">${clash}</div>`; }); 
    } else { 
        html += `<p>พื้นดวงสงบนิ่ง ไม่มีปฏิกิริยาปะทะหรือผูกพันที่รุนแรง</p>`; 
    }
    html += `</div></div>`;

    html += `<div id="tab-roots" class="tab-content" style="display:none;">`;
    html += `<div class="encyc-section"><h3 class="encyc-title">🌱 กำลังรากฐาน (Rooting Analysis)</h3>`;
    html += `<p style="font-size:13.5px; color:#555;">วิเคราะห์ความมั่นคงของสิบเทพที่ปรากฏบนราศีบน ว่าเป็น "ของจริงที่จับต้องได้" หรือ "ภาพลวงตาที่ฉาบฉวย"</p>`;

    let rootDetails = '';
    const natalZhis = [
        { pillar: 'year', char: currentBaZiData.year.zhi },
        { pillar: 'month', char: currentBaZiData.month.zhi },
        { pillar: 'day', char: currentBaZiData.day.zhi },
        { pillar: 'hour', char: currentBaZiData.hour.zhi }
    ];

    ['year', 'month', 'day', 'hour'].forEach(p => {
        const gan = currentBaZiData[p].gan;
        if (gan === '-') return;
        
        const rootInfo = checkStemRoot(gan, natalZhis);
        const tenGodCh = tenGodsMap[dmGan][gan];
        const shiShen = (p === 'day') ? 'ดิถี (ตัวคุณ)' : (shiShenMap[tenGodCh] || tenGodCh);
        
        rootDetails += `<div class="encyc-item" style="margin-bottom:12px;">`;
        rootDetails += `<b>เสา${pillarNamesTh[p]} - ${shiShen} (${gan}):</b><br>`;
        if (rootInfo.hasRoot) {
            rootDetails += `<span style="color:#2e7d32;">🌱 <b>มีรากมั่นคง</b> (พบรากในเสา${rootInfo.rootLocations.map(l => pillarNamesTh[l]).join(', ')})</span><br>`;
            rootDetails += `<span style="font-size:13px;">อิทธิพลของ <b>${shiShen}</b> จะเกิดขึ้นจริง จับต้องได้ และยั่งยืน ไม่ล้มหายตายจากไปง่ายๆ</span>`;
        } else {
            rootDetails += `<span style="color:#757575;">🍃 <b>ลอยปลิวลม (ไร้ราก)</b></span><br>`;
            rootDetails += `<span style="font-size:13px;">อิทธิพลของ <b>${shiShen}</b> เป็นเพียงภาพภายนอก ดูเหมือนมีแต่จริงๆ อาจจะรักษาไว้ไม่ได้นาน (เช่น รวยแต่เก็บไม่อยู่ หรือดูมีอำนาจแต่ไม่มีบารมีจริง)</span>`;
        }
        rootDetails += `</div>`;
    });

    html += rootDetails;
    html += `</div></div>`;

    // ✨ แท็บใหม่: ภาคีซ่อน (Hidden Combos) ✨
    html += `<div id="tab-hidden-combos" class="tab-content" style="display:none;">`;
    html += `<div class="encyc-section"><h3 class="encyc-title" style="color:#9c27b0;">🕵️‍♂️ ภาคีซ่อนเร้น (Hidden Combos)</h3>`;
    html += `<p style="font-size:13.5px; color:#555;">ภาคีซ่อน หรือ "แอบฮะ" คือการเชื่อมโยงอย่างลับๆ ระหว่างธาตุแฝง บ่งบอกถึงความช่วยเหลือลับๆ, รายได้ซ่อนเร้น, หรือความสัมพันธ์ที่ไม่ได้เปิดเผย</p>`;
    
    let hiddenComboDetails = [];
    const pKeys = ['year', 'month', 'day', 'hour'];
    
    // สแกน บน-ล่าง (Stem to Branch)
    pKeys.forEach(pTop => {
        let gan = currentBaZiData[pTop].gan;
        if(gan === '-') return;
        let targetCombo = interactions.heavenlyCombos[gan];
        pKeys.forEach(pBot => {
            let zhi = currentBaZiData[pBot].zhi;
            if(zhi === '-') return;
            let hGans = hiddenGanMap[zhi] || [];
            if(hGans.includes(targetCombo)) {
                let relation = (pTop === pBot) ? 'ฮะในเสาเดียวกัน' : `ข้ามเสา`;
                hiddenComboDetails.push(`<div class="encyc-item" style="border-left: 3px solid #ce93d8; padding-left: 8px;">
                    🎭 <b>ฟ้าดินแอบฮะ (${relation}):</b><br>ราศีบน <b>${gan}</b> (เสา${pillarNamesTh[pTop]}) แอบฮะกับ ราศีแฝง <b>${targetCombo}</b> ในฐาน <b>${zhi}</b> (เสา${pillarNamesTh[pBot]})<br>
                    <span style="font-size:12.5px; color:#777;">💡 นัยยะ: ${pTop === pBot ? 'ความคิดและการกระทำสอดคล้องกัน หรือมีคนช่วยเหลือแบบลับๆ ในเรื่องนั้น' : 'มีความสัมพันธ์เกื้อหนุนข้ามสายงาน/สังคม อย่างลับๆ และมักสำเร็จเงียบๆ'}</span>
                </div>`);
            }
        });
    });

    // สแกน ล่าง-ล่าง (Branch to Branch hidden combos)
    for(let i=0; i<pKeys.length; i++) {
        for(let j=i+1; j<pKeys.length; j++) {
            let p1 = pKeys[i]; let p2 = pKeys[j];
            let zhi1 = currentBaZiData[p1].zhi; let zhi2 = currentBaZiData[p2].zhi;
            if(zhi1 === '-' || zhi2 === '-') continue;
            
            let hGans1 = hiddenGanMap[zhi1] || [];
            let hGans2 = hiddenGanMap[zhi2] || [];
            
            hGans1.forEach(g1 => {
                let targetCombo = interactions.heavenlyCombos[g1];
                if(hGans2.includes(targetCombo)) {
                     hiddenComboDetails.push(`<div class="encyc-item" style="border-left: 3px solid #8e24aa; padding-left: 8px;">
                        🕵️ <b>ราศีแฝงแอบฮะ (ล่าง-ล่าง):</b><br>ธาตุแฝง <b>${g1}</b> (เสา${pillarNamesTh[p1]}) แอบฮะกับ ธาตุแฝง <b>${targetCombo}</b> (เสา${pillarNamesTh[p2]})<br>
                        <span style="font-size:12.5px; color:#777;">💡 นัยยะ: สายสัมพันธ์เบื้องหลัง คอนเนคชั่นลับๆ หรืออาจมีความสัมพันธ์เชิงชู้สาว/ธุรกิจลับ ข้ามระหว่างสองเรื่องนี้</span>
                     </div>`);
                }
            });
        }
    }

    if (hiddenComboDetails.length > 0) {
        html += hiddenComboDetails.join('');
    } else {
        html += `<p>ดวงชะตานี้ไม่มีภาคีซ่อนเร้นที่ชัดเจน (มักเป็นคนเปิดเผย ตรงไปตรงมา ไม่มีลับลมคมใน)</p>`;
    }
    
    html += `</div></div>`;

    document.getElementById('encyclopedia-detail').innerHTML = html;
    document.getElementById('encyclopedia-modal').style.display = "flex";
    openEncycTab(null, 'tab-basic'); 
    document.querySelector('.tab-link').classList.add('active');
}
function closeEncyclopedia() { 
    document.getElementById('encyclopedia-modal').style.display = "none"; 
}

function openGlosTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content-glos");
    for (i = 0; i < tabcontent.length; i++) { 
        tabcontent[i].style.display = "none"; 
        tabcontent[i].classList.remove("active"); 
    }
    tablinks = document.getElementsByClassName("tab-link-glos");
    for (i = 0; i < tablinks.length; i++) { 
        tablinks[i].className = tablinks[i].className.replace(" active", ""); 
    }
    document.getElementById(tabName).style.display = "block"; 
    document.getElementById(tabName).classList.add("active");
    if(evt) evt.currentTarget.className += " active";
}

function openGlossary() {
    let html = '';

    html += `<div id="glos-gods" class="tab-content-glos active">`;
    html += `<div class="glos-section"><h3 class="glos-title">☯️ สิบเทพ (10 Gods)</h3>`;
    html += `<p style="font-size:13.5px; color:#666;">ความสัมพันธ์ระหว่างธาตุของคุณ(ดิถี) กับธาตุอื่นๆ</p>`;
    for(let key in shiShenDesc) { 
        html += `<div class="encyc-item"><b>${key}:</b><br>${shiShenDesc[key].replace(/\n/g, '<br>')}</div>`; 
    }
    html += `</div></div>`;

    html += `<div id="glos-stems" class="tab-content-glos" style="display:none;">`;
    html += `<div class="glos-section"><h3 class="glos-title">☁️ ภาคีฟ้า (Heavenly Combos)</h3>
             <table class="glos-table">
                <tr><th>คู่ภาคี</th><th>ผลลัพธ์ธาตุใหม่</th></tr>
                <tr><td>${rChar('甲')} + ${rChar('己')}</td><td>= <b>ธาตุดิน ⛰️</b></td></tr>
                <tr><td>${rChar('乙')} + ${rChar('庚')}</td><td>= <b>ธาตุทอง 🪙</b></td></tr>
                <tr><td>${rChar('丙')} + ${rChar('辛')}</td><td>= <b>ธาตุน้ำ 💧</b></td></tr>
                <tr><td>${rChar('丁')} + ${rChar('壬')}</td><td>= <b>ธาตุไม้ 🌳</b></td></tr>
                <tr><td>${rChar('戊')} + ${rChar('癸')}</td><td>= <b>ธาตุไฟ 🔥</b></td></tr>
             </table></div>`;

    html += `<div class="glos-section"><h3 class="glos-title">⛈️ ฟ้าชง (Heavenly Clashes)</h3>
             <ul style="font-size:14px; line-height:1.8;">
                <li>${rChar('甲')} <b>ชง</b> ${rChar('庚')}: ขัดแย้งเรื่องอุดมการณ์ ความคิดแตกหัก</li>
                <li>${rChar('乙')} <b>ชง</b> ${rChar('辛')}: ถูกทำร้ายจิตใจ ทรยศหักหลัง</li>
                <li>${rChar('丙')} <b>ชง</b> ${rChar('壬')}: ขัดแย้งรุนแรง ปะทะอารมณ์ซึ่งหน้า</li>
                <li>${rChar('丁')} <b>ชง</b> ${rChar('癸')}: ปัญหาลับหลัง ชิงดีชิงเด่น</li>
             </ul></div>`;
    html += `</div>`;

    html += `<div id="glos-branches" class="tab-content-glos" style="display:none;">`;
    html += `<div class="glos-section"><h3 class="glos-title">🤝 ลักฮะ (ภาคี 6 กิ่งดิน)</h3>
             <table class="glos-table">
                <tr><th>คู่ฮะ</th><th>ผลลัพธ์ธาตุ</th></tr>
                <tr><td>${rChar('子')} + ${rChar('丑')}</td><td>= ธาตุดิน ⛰️</td></tr>
                <tr><td>${rChar('寅')} + ${rChar('亥')}</td><td>= ธาตุไม้ 🌳</td></tr>
                <tr><td>${rChar('卯')} + ${rChar('戌')}</td><td>= ธาตุไฟ 🔥</td></tr>
                <tr><td>${rChar('辰')} + ${rChar('酉')}</td><td>= ธาตุทอง 🪙</td></tr>
                <tr><td>${rChar('巳')} + ${rChar('申')}</td><td>= ธาตุน้ำ 💧</td></tr>
                <tr><td>${rChar('午')} + ${rChar('未')}</td><td>= ธาตุไฟ/ดิน 🔥⛰️</td></tr>
             </table></div>`;

    html += `<div class="glos-section"><h3 class="glos-title">🤝 ซาฮะ (ไตรภาคี)</h3>
             <ul style="font-size:14px; line-height:1.8;">
                <li>${rChar('申')} + ${rChar('子')} + ${rChar('辰')}: รวมเป็น <b>ธาตุน้ำ 💧</b></li>
                <li>${rChar('亥')} + ${rChar('卯')} + ${rChar('未')}: รวมเป็น <b>ธาตุไม้ 🌳</b></li>
                <li>${rChar('寅')} + ${rChar('午')} + ${rChar('戌')}: รวมเป็น <b>ธาตุไฟ 🔥</b></li>
                <li>${rChar('巳')} + ${rChar('酉')} + ${rChar('丑')}: รวมเป็น <b>ธาตุทอง 🪙</b></li>
             </ul></div>`;

    html += `<div class="glos-section"><h3 class="glos-title">⚡ การปะทะ (ชง เฮ้ง ไห่ ผั่ว)</h3>
             <p style="font-size:14px; margin-bottom:5px;"><b>💥 ชง:</b> ${rChar('子')}-${rChar('午')}, ${rChar('丑')}-${rChar('未')}, ${rChar('寅')}-${rChar('申')}, ${rChar('卯')}-${rChar('酉')}, ${rChar('辰')}-${rChar('戌')}, ${rChar('巳')}-${rChar('亥')}</p>
             <p style="font-size:14px; margin-bottom:5px; margin-top:15px;"><b>⚠️ เฮ้ง:</b><br> 
             - เนรคุณ: ${rChar('寅')}, ${rChar('巳')}, ${rChar('申')}<br> 
             - ข่มขู่: ${rChar('丑')}, ${rChar('戌')}, ${rChar('未')}<br> 
             - ไร้มารยาท: ${rChar('子')}, ${rChar('卯')}<br> 
             - ทำร้ายตัวเอง: ${rChar('辰')}, ${rChar('午')}, ${rChar('酉')}, ${rChar('亥')}</p>
             <p style="font-size:14px; margin-bottom:5px; margin-top:15px;"><b>🗡️ ไห่:</b> ${rChar('子')}-${rChar('未')}, ${rChar('丑')}-${rChar('午')}, ${rChar('寅')}-${rChar('巳')}, ${rChar('卯')}-${rChar('辰')}, ${rChar('申')}-${rChar('亥')}, ${rChar('酉')}-${rChar('戌')}</p>
             <p style="font-size:14px; margin-top:15px;"><b>🔨 ผั่ว:</b> ${rChar('子')}-${rChar('酉')}, ${rChar('丑')}-${rChar('辰')}, ${rChar('寅')}-${rChar('亥')}, ${rChar('卯')}-${rChar('午')}, ${rChar('巳')}-${rChar('申')}, ${rChar('未')}-${rChar('戌')}</p>
             </div>`;
    html += `</div>`;

    html += `<div id="glos-stars" class="tab-content-glos" style="display:none;">`;
    html += `<div class="glos-section"><h3 class="glos-title">⏳ 12 วัฏจักร (12 Growth Phases)</h3>`;
    for(let key in diShiDesc) { 
        html += `<div class="encyc-item"><b>${diShiDesc[key].th} (${key}):</b> ${diShiDesc[key].desc}</div>`; 
    }
    html += `</div>`;

    html += `<div class="glos-section"><h3 class="glos-title">🔮 ดาวพิเศษหลัก (Shen Sha)</h3>
             <ul style="font-size:13.5px; line-height:1.8;">
                <li><b>🌟 อุปถัมภ์:</b> มีคนช่วย แคล้วคลาด</li>
                <li><b>🌸 ดอกท้อ:</b> ดาวเสน่ห์ ดึงดูด</li>
                <li><b>🐎 ม้าเดินทาง:</b> โยกย้าย ต่างประเทศ</li>
                <li><b>💰 ลู่เสิน:</b> มั่งคั่ง มีกินมีใช้</li>
                <li><b>📚 เหวินชาง:</b> เรียนเก่ง วิชาการ</li>
                <li><b>⚔️ ดาบแกะ:</b> พลังเด็ดขาด ใจร้อน</li>
                <li><b>🎨 ฮั้วก่าย:</b> ดาวศิลปิน รักสันโดษ</li>
                <li><b>🎖️ เจียงซิง:</b> ดาวขุนพล บารมีผู้นำ</li>
             </ul></div>`;
    
    html += `<div class="glos-section"><h3 class="glos-title">🕳️ ดาวคงบ้วง (Void)</h3>
             <p style="font-size:13.5px;">เมื่อใดที่เสาหรือปีจรตกตำแหน่งคงบ้วง พลังงานในจุดนั้นจะ "ว่างเปล่า" หรือลดทอนลงครึ่งหนึ่ง ทำสิ่งใดต้องออกแรงมากกว่าปกติถึงจะสำเร็จ</p>
             </div>`;
    html += `</div>`;

    html += `<div id="glos-vaults" class="tab-content-glos" style="display:none;">`;
    html += `<div class="glos-section"><h3 class="glos-title">🔐 4 คลังสุสาน (The 4 Vaults)</h3>
             <ul style="font-size:14px; line-height:1.8;">
                <li>${rChar('辰')} = คลังของ <b>น้ำ 💧</b></li>
                <li>${rChar('未')} = คลังของ <b>ไม้ 🌳</b></li>
                <li>${rChar('戌')} = คลังของ <b>ไฟ/ดิน 🔥⛰️</b></li>
                <li>${rChar('丑')} = คลังของ <b>ทอง 🪙</b></li>
             </ul>
             <table class="glos-table" style="margin-top:10px;">
                <tr><th>ดิถี (คุณ)</th><th>💰 คลังสมบัติ</th><th>🏛️ คลังอำนาจ</th><th>📚 คลังอุปถัมภ์</th></tr>
                <tr><td>🌳 ธาตุไม้</td><td>${rChar('戌')}</td><td>${rChar('丑')}</td><td>${rChar('辰')}</td></tr>
                <tr><td>🔥 ธาตุไฟ</td><td>${rChar('丑')}</td><td>${rChar('辰')}</td><td>${rChar('未')}</td></tr>
                <tr><td>⛰️ ธาตุดิน</td><td>${rChar('辰')}</td><td>${rChar('未')}</td><td>${rChar('戌')}</td></tr>
                <tr><td>🪙 ธาตุทอง</td><td>${rChar('未')}</td><td>${rChar('戌')}</td><td>${rChar('丑')}</td></tr>
                <tr><td>💧 ธาตุน้ำ</td><td>${rChar('戌')}</td><td>${rChar('辰')}</td><td>${rChar('丑')}</td></tr>
             </table>
             </div>`;
    html += `</div>`;

    html += `<div id="glos-roots" class="tab-content-glos" style="display:none;">`;
    html += `<div class="glos-section"><h3 class="glos-title">🌱 พลังรากแฝง (Rooting & Floating)</h3>
             <p style="font-size:14px; line-height:1.6;">ในวิชาปาจื้อ <b>"ราศีบน" (สวรรค์)</b> คือสิ่งที่แสดงออกให้คนภายนอกเห็น ส่วน <b>"ราศีล่าง" (พื้นดิน)</b> คือความจริงที่ซ่อนอยู่</p>
             <ul style="font-size:14px; line-height:1.8;">
                <li><b style="color:#2e7d32;">🌱 มีราก (Rooted):</b> การที่ราศีบน มีธาตุเดียวกันซ่อนอยู่ใน "ราศีแฝง" ของเสาใดเสาหนึ่งด้านล่าง แปลว่าสิ่งนั้นมีรากฐาน แข็งแรง เป็นของจริง</li>
                <li><b style="color:#757575;">🍃 ลอยลม (Floating):</b> การที่ราศีบน ไม่มีธาตุเดียวกันซัพพอร์ตอยู่ด้านล่างเลย แปลว่าสิ่งนั้นอ่อนแอ ฉาบฉวย หรือเป็นเพียงภาพลวงตา (เช่น ลาภลอยลม = ได้เงินมาก็ต้องจ่ายออกไป เก็บไม่อยู่)</li>
             </ul>
             <p style="font-size:14px; line-height:1.6; margin-top:10px;"><b>วิธีการดูราก (ธาตุตรงกัน):</b><br>
             - <b>ธาตุไม้</b> (甲, 乙) มีรากเมื่อฐานล่างมี ขาล(寅), เถาะ(卯), มะโรง(辰), มะแม(未), กุน(亥)<br>
             - <b>ธาตุไฟ</b> (丙, 丁) มีรากเมื่อฐานล่างมี มะเมีย(午), มะเส็ง(巳), ขาล(寅), จอ(戌), มะแม(未)<br>
             - <b>ธาตุดิน</b> (戊, 己) มีรากเมื่อฐานล่างมี ฉลู(丑), มะโรง(辰), มะแม(未), จอ(戌), มะเมีย(午), มะเส็ง(巳), ขาล(寅), วอก(申)<br>
             - <b>ธาตุทอง</b> (庚, 辛) มีรากเมื่อฐานล่างมี วอก(申), ระกา(酉), ฉลู(丑), จอ(戌), มะเส็ง(巳)<br>
             - <b>ธาตุน้ำ</b> (壬, 癸) มีรากเมื่อฐานล่างมี ชวด(子), กุน(亥), ฉลู(丑), มะโรง(辰), วอก(申)
             </p>
             </div>`;
    html += `</div>`;

    // ✨ แท็บใหม่: ภาคีซ่อน ในพจนานุกรม
    html += `<div id="glos-hidden-combos" class="tab-content-glos" style="display:none;">`;
    html += `<div class="glos-section"><h3 class="glos-title" style="color:#9c27b0;">🎭 ภาคีซ่อนเร้น (แอบฮะ)</h3>
             <p style="font-size:14px; line-height:1.6;"><b>แอบฮะ (Hidden Combos)</b> คือการที่ "ราศีบน ไปจับคู่กับ ราศีแฝงด้านล่าง" หรือ "ราศีแฝงด้านล่าง จับคู่กันเอง" โดยใช้กฎของ <b>ภาคีฟ้า 5 คู่</b> (甲-己, 乙-庚, 丙-辛, 丁-壬, 戊-癸) ในการจับคู่</p>
             <p style="font-size:14px; line-height:1.6; margin-top:10px;"><b>นัยยะของการแอบฮะ:</b></p>
             <ul style="font-size:14px; line-height:1.8;">
                <li><b>ความช่วยเหลือลับๆ:</b> มีคนหนุนหลังแต่ไม่เปิดเผยตัว หรือได้ผลประโยชน์โดยไม่มีใครรู้</li>
                <li><b>รายได้ซ่อนเร้น:</b> เงินใต้โต๊ะ, รายได้พิเศษที่ไม่ได้บอกใคร, หรือทรัพย์สินที่ซ่อนไว้</li>
                <li><b>ความสัมพันธ์ลับ:</b> การคบหาดูใจกันอย่างเงียบๆ, รักซ้อน, หรือมีสายสัมพันธ์พิเศษข้ามสายงานข้ามแผนก</li>
             </ul>
             <p style="font-size:14px; line-height:1.6; margin-top:10px; padding:10px; background:#f3e5f5; border-radius:6px; border-left:3px solid #ce93d8;">
             <b>ตัวอย่าง:</b> หากราศีบนของเสาเดือน (การงาน) คือ <b>丙 (ไฟ)</b> และราศีแฝงในเสาวัน (คู่ครอง) มีธาตุ <b>辛 (ทอง)</b> ซ่อนอยู่ -> เกิดการแอบฮะกันระหว่าง 丙-辛 💧<br>
             <i>ตีความได้ว่า:</i> คู่ครองอาจแอบช่วยเรื่องงานของคุณ หรือคุณอาจพบรักกับคนในที่ทำงานอย่างลับๆ เป็นต้น
             </p>
             </div>`;
    html += `</div>`;

    document.getElementById('glossary-detail').innerHTML = html; 
    document.getElementById('glossary-modal').style.display = "flex";
    
    openGlosTab(null, 'glos-gods');
    document.querySelector('.tab-link-glos').classList.add('active');
}
function closeGlossary() { 
    document.getElementById('glossary-modal').style.display = "none"; 
}

function getDailyHoroscope() {
    if (!currentBaZiData || !currentBaZiData.day) {
        return alert("กรุณากด 'คำนวณผูกดวง' เพื่อให้ระบบทราบดวงชะตาก่อนเสี่ยงเซียมซีครับ!");
    }

    const btn = document.getElementById('ai-daily-btn'); 
    const resultBox = document.getElementById('ai-result-box'); 
    const aiContent = document.getElementById('ai-content');
    
    renderCurrentTimeBaZi(); 
    
    const name = document.getElementById('name').value || "ไม่ระบุ"; 
    const cacheKey = `daily_cache_${name}_${new Date().toISOString().split('T')[0]}`;
    
    btn.innerText = "⏳ กำลังสับติ้วเซียมซี..."; 
    btn.disabled = true; 
    resultBox.style.display = "block"; 
    
    aiContent.innerHTML = `
        <div class="siamsee-wrapper">
            <div class="siamsee-container">
                <div class="siamsee-stick">🥢</div>
                <div class="siamsee-tube">🎋</div>
            </div>
            <div style="font-size: 18px; color: #ff9800; font-weight: bold; margin-top: 15px; animation: pulse 1s infinite;">เขย่าเซียมซีเชื่อมพลังฟ้าดิน...</div>
            <p style="font-size: 13px; color: #777; margin-top: 5px;">(กำลังนำดวงของคุณทาบกับเวลาปัจจุบัน)</p>
        </div>
    `;
    
    const fetchPromise = new Promise((resolve) => {
        if (localStorage.getItem(cacheKey)) {
            resolve({ result: "success", analysis: localStorage.getItem(cacheKey) });
        } else {
            const payload = { action: "daily", personal_info: { name: name }, bazi_results: currentBaZiData, current_time: currentTimeData };
            fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
            .then(r => r.json())
            .then(data => {
                if (data.result === "success") localStorage.setItem(cacheKey, data.analysis);
                resolve(data);
            })
            .catch(e => resolve({ result: "error", message: "ไม่สามารถเชื่อมต่อซินแสได้ในขณะนี้" }));
        }
    });

    const timerPromise = new Promise(r => setTimeout(r, 2000));

    Promise.all([fetchPromise, timerPromise]).then(values => {
        const data = values[0];
        
        aiContent.innerHTML = `
            <div class="siamsee-wrapper">
                <div class="siamsee-pop">📜</div>
                <div style="font-size: 18px; color: #4caf50; font-weight: bold; margin-top: 10px;">ได้ไม้ติ้วแล้ว! กำลังคลี่อ่านคำทำนาย...</div>
            </div>
        `;
        
        setTimeout(() => {
            if (data.result === "success") {
                aiContent.innerHTML = `<h3 style="color:#ff9800; border-bottom:2px solid #ffb300; padding-bottom:10px; margin-top:0;">🥠 คำทำนายเซียมซีประจำวัน</h3>` + data.analysis;
            } else {
                aiContent.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.message}</p>`;
            }
            btn.innerText = "🥠 เซียมซีทำนายรายวัน"; 
            btn.disabled = false;
        }, 1200);
    });
}

function openSynastryModal() { 
    document.getElementById('synastry-modal').style.display = "flex"; 
}

function closeSynastryModal() { 
    document.getElementById('synastry-modal').style.display = "none"; 
}

function calculateSynastry() {
    const pDate = document.getElementById('partner_birth_date').value; 
    const pTime = document.getElementById('partner_birth_time').value;
    
    if (!pDate) {
        return alert("กรุณากรอกวันที่เกิดของคู่ให้ครบถ้วนครับ");
    }
    
    const [y, m, d] = pDate.split('-'); 
    let h = 12, min = 0;
    if (pTime) {
        [h, min] = pTime.split(':');
    }

    const solar = Solar.fromYmdHms(parseInt(y), parseInt(m), parseInt(d), parseInt(h), parseInt(min), 0);
    const bazi = solar.getLunar().getEightChar(); 
    
    partnerBaZiData = { 
        name: document.getElementById('partner_name').value || "พาร์ทเนอร์", 
        gender: document.getElementById('partner_gender').value, 
        year: { gan: bazi.getYearGan(), zhi: bazi.getYearZhi() }, 
        month: { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi() }, 
        day: { gan: bazi.getDayGan(), zhi: bazi.getDayZhi() }, 
        hour: pTime ? { gan: bazi.getTimeGan(), zhi: bazi.getTimeZhi() } : { gan: '-', zhi: '-' } 
    };
    
    closeSynastryModal();
    
    const btn = document.getElementById('ai-synastry-btn'); 
    document.getElementById('ai-result-box').style.display = "block";
    document.getElementById('ai-content').innerHTML = `<div style="text-align:center;">กำลังทาบดวงชะตาเพื่อหาจุดสมพงษ์... ⏳</div>`; 
    btn.disabled = true;
    
    const payload = { 
        action: "synastry", 
        my_bazi: currentBaZiData, 
        my_name: document.getElementById('name').value, 
        partner_bazi: partnerBaZiData 
    };

    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify(payload) 
    })
    .then(r => r.json())
    .then(data => {
        if (data.result === "success") {
            document.getElementById('ai-content').innerHTML = data.analysis;
        } else {
            document.getElementById('ai-content').innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.message}</p>`; 
        }
        btn.disabled = false; 
        btn.innerText = "💞 เทียบดวงสมพงษ์";
    })
    .catch(e => {
        document.getElementById('ai-content').innerHTML = `<p style="color:red;">ไม่สามารถเชื่อมต่อได้ในขณะนี้</p>`;
        btn.disabled = false;
        btn.innerText = "💞 เทียบดวงสมพงษ์";
    });
}

function analyzeWithAI(forceRefresh = false) {
    const name = document.getElementById('name').value || "ไม่ระบุ";
    const dateStr = document.getElementById('birth_date').value;
    const qStr = document.getElementById('ai-custom-question').value.trim();
    const cacheKey = `ai_cache_${name}_${dateStr}_${qStr}`;
    
    const btn = document.getElementById('ai-btn'); 
    const aiContent = document.getElementById('ai-content');
    
    if (!forceRefresh && localStorage.getItem(cacheKey)) { 
        document.getElementById('ai-result-box').style.display = "block"; 
        const refreshBtn = `<br><br><div style="text-align:center;"><button onclick="analyzeWithAI(true)" style="background:#f44336; color:white; border:none; cursor:pointer; border-radius:5px; font-size:15px; padding:10px 20px; font-weight:bold;">🔄 ขอคำทำนายใหม่</button></div>`;
        aiContent.innerHTML = localStorage.getItem(cacheKey) + refreshBtn; 
        return; 
    }
    
    btn.innerText = "⏳ ซินแสกำลังประมวลผล..."; 
    btn.disabled = true; 
    document.getElementById('ai-result-box').style.display = "block";
    aiContent.innerHTML = `<div style="text-align:center;">กำลังวิเคราะห์เส้นทางชะตาชีวิตของคุณ... ⏳</div>`;
    
    const payload = { 
        action: "analyze", 
        personal_info: { 
            name: name, 
            gender: document.getElementById('gender').value, 
            birth_date: dateStr, 
            birth_time: document.getElementById('birth_time').value 
        }, 
        bazi_results: currentBaZiData, 
        dm_strength: dmStrengthData, 
        da_yun: activeDaYunData, 
        liu_nian: activeLiuNianData, 
        custom_question: qStr, 
        kong_wang: currentKongWang, 
        vaults: currentVaults, 
        element_counts: elementCounts 
    };

    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify(payload) 
    })
    .then(r => r.json())
    .then(data => {
        const refreshBtn = `<br><br><div style="text-align:center;"><button onclick="analyzeWithAI(true)" style="background:#f44336; color:white; border:none; cursor:pointer; border-radius:5px; font-size:15px; padding:10px 20px; font-weight:bold;">🔄 ขอคำทำนายใหม่</button></div>`;
        
        if (data.result === "success") { 
            localStorage.setItem(cacheKey, data.analysis); 
            aiContent.innerHTML = data.analysis + refreshBtn; 
        } else {
            aiContent.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.message}</p>`; 
        }
        btn.innerText = "✨ ซินแสวิเคราะห์ดวง"; 
        btn.disabled = false;
    })
    .catch(e => {
        aiContent.innerHTML = `<p style="color:red;">ไม่สามารถเชื่อมต่อได้ในขณะนี้</p>`; 
        btn.innerText = "✨ ซินแสวิเคราะห์ดวง"; 
        btn.disabled = false;
    });
}

function downloadBaziImage() {
    const captureArea = document.getElementById('capture-area'); 
    const btn = document.getElementById('download-btn');
    const branding = document.getElementById('card-branding');
    
    btn.innerText = "⏳ กำลังประมวลผลรูปภาพ..."; 
    btn.disabled = true;
    
    if (branding) branding.style.display = 'block';

    const originalBg = captureArea.style.background; 
    captureArea.style.background = '#ffffff'; 
    
    html2canvas(captureArea, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
        captureArea.style.background = originalBg; 
        if (branding) branding.style.display = 'none';

        const link = document.createElement('a');
        link.download = `ดวงชะตา_${document.getElementById('name').value || "MyBaZi"}.png`; 
        link.href = canvas.toDataURL('image/png'); 
        link.click();
        
        btn.innerText = "📸 บันทึกรูปดวงชะตา"; 
        btn.disabled = false;
    });
}

function saveToGoogleSheets() {
    const btn = document.getElementById('save-btn'); 
    btn.innerText = "กำลังบันทึก..."; 
    btn.disabled = true;
    
    const payload = { 
        name: document.getElementById('name').value, 
        gender: document.getElementById('gender').value, 
        birth_date: document.getElementById('birth_date').value, 
        birth_time: document.getElementById('birth_time').value, 
        bazi_results: currentBaZiData, 
        note: "" 
    };

    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify(payload) 
    })
    .then(() => { 
        alert("บันทึกสำเร็จ!"); 
        fetchSavedData(); 
        btn.innerText = "💾 บันทึกดวงนี้ลงฐานข้อมูล"; 
        btn.disabled = false; 
    })
    .catch(e => {
        alert("เกิดข้อผิดพลาดในการบันทึก");
        btn.innerText = "💾 บันทึกดวงนี้ลงฐานข้อมูล"; 
        btn.disabled = false;
    });
}

function fetchSavedData() {
    fetch(API_URL)
    .then(r => r.json())
    .then(data => {
        savedRecordsList = data; 
        let select = document.getElementById('saved-profiles');
        select.innerHTML = '<option value="">-- เลือกดวงที่บันทึกไว้ --</option>';
        data.forEach((r, i) => {
            select.innerHTML += `<option value="${i}">${r.name} (${r.birth_date})</option>`;
        });
    })
    .catch(e => console.log("Fetch saved data error:", e));
}

function loadSavedData() {
    const v = document.getElementById('saved-profiles').value; 
    if (v === "") return;
    
    document.getElementById('name').value = savedRecordsList[v].name; 
    document.getElementById('gender').value = savedRecordsList[v].gender;
    document.getElementById('birth_date').value = savedRecordsList[v].birth_date; 
    document.getElementById('birth_time').value = savedRecordsList[v].birth_time; 
    
    calculateBaZi();
}

window.onload = function() { 
    fetchSavedData(); 
    renderCurrentTimeBaZi(); 
};
