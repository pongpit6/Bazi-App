const API_URL = "https://script.google.com/macros/s/AKfycby-Jf7A-TSbwrvvJWxBdn4a8bDjPIw-MLzNN5Bp6NxVfImFstN7yf3kB75lLgO9jX_n/exec";
let currentBaZiData = {};
let currentTimeData = {}; 
let activeDaYunData = {}; 
let activeLiuNianData = {}; 
let dmStrengthData = {}; 
let savedRecordsList = [];
let partnerBaZiData = {};
let currentKongWang = ""; 
let currentVaults = {}; 
let elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }; // 🌟 เก็บเปอร์เซ็นต์ธาตุ

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

const pillarContextMap = { 'year': 'เสาปี (บรรพบุรุษ/ผู้ใหญ่)', 'month': 'เสาเดือน (การงาน/พ่อแม่)', 'day': 'เสาวัน (คู่ครอง/ตัวตน)', 'hour': 'เสายาม (บั้นปลาย/ลูกน้อง)' };
const pillarNamesTh = { 'year': 'ปี', 'month': 'เดือน', 'day': 'วัน', 'hour': 'ยาม' };

const interactions = {
    heavenlyCombos: { '甲':'己', '己':'甲', '乙':'庚', '庚':'乙', '丙':'辛', '辛':'丙', '丁':'壬', '壬':'丁', '戊':'癸', '癸':'戊' },
    heavenlyClashes: { '甲':'庚', '庚':'甲', '乙':'辛', '辛':'乙', '丙':'壬', '壬':'丙', '丁':'癸', '癸':'丁' },
    earthlyCombos: { '子':'丑', '丑':'子', '寅':'亥', '亥':'寅', '卯':'戌', '戌':'卯', '辰':'酉', '酉':'辰', '巳':'申', '申':'巳', '午':'未', '未':'午' },
    earthlyClashes: { '子':'午', '午':'子', '丑':'未', '未':'丑', '寅':'申', '申':'寅', '卯':'酉', '酉':'卯', '辰':'戌', '戌':'辰', '巳':'亥', '亥':'巳' },
    earthlyPunishments: { '寅':['巳','申'], '巳':['寅','申'], '申':['寅','巳'], '丑':['戌','未'], '戌':['丑','未'], '未':['丑','戌'], '子':['卯'], '卯':['子'], '辰':['辰'], '午':['午'], '酉':['酉'], '亥':['亥'] },
    earthlyHarms: { '子':'未', '未':'子', '丑':'午', '午':'丑', '寅':'巳', '巳':'寅', '卯':'辰', '辰':'卯', '申':'亥', '亥':'申', '酉':'戌', '戌':'酉' },
    earthlyDestructions: { '子':'酉', '酉':'子', '丑':'辰', '辰':'丑', '寅':'亥', '亥':'寅', '卯':'午', '午':'卯', '巳':'申', '申':'巳', '未':'戌', '戌':'未' }
};

function calculateVaults(dayGan) {
    if (!dayGan) return {};
    const dmType = elementMap[dayGan].type;
    const vaultElements = { 'water': '辰', 'wood': '未', 'fire': '戌', 'earth': '戌', 'metal': '丑' };
    const generatingMap = { 'wood': 'water', 'fire': 'wood', 'earth': 'fire', 'metal': 'earth', 'water': 'metal' };
    const conqueringMap = { 'wood': 'earth', 'fire': 'metal', 'earth': 'water', 'metal': 'wood', 'water': 'fire' };
    const conqueredByMap = { 'wood': 'metal', 'fire': 'water', 'earth': 'wood', 'metal': 'fire', 'water': 'earth' };

    return { wealthVault: vaultElements[conqueringMap[dmType]], powerVault: vaultElements[conqueredByMap[dmType]], resourceVault: vaultElements[generatingMap[dmType]] };
}

function checkSpecialStars(branch, dayGan, yearZhi, dayZhi) {
    let stars = [];
    if ({ '甲':['丑','未'], '戊':['丑','未'], '庚':['丑','未'], '乙':['子','申'], '己':['子','申'], '丙':['亥','酉'], '丁':['亥','酉'], '壬':['卯','巳'], '癸':['卯','巳'], '辛':['寅','午'] }[dayGan]?.includes(branch)) stars.push({name: '🌟 ดาวอุปถัมภ์', desc: 'คนคอยช่วยเหลือ ปกป้องคุ้มครอง', icon: '🌟'});
    if ({ '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' }[yearZhi] === branch || { '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' }[dayZhi] === branch) stars.push({name: '🌸 ดาวดอกท้อ', desc: 'มีเสน่ห์ดึงดูด เป็นที่รักและเมตตา', icon: '🌸'});
    if ({ '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }[yearZhi] === branch || { '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }[dayZhi] === branch) stars.push({name: '🐎 ดาวม้าเดินทาง', desc: 'มีเกณฑ์โยกย้าย เดินทางบ่อย', icon: '🐎'});
    
    if (currentVaults.wealthVault === branch) stars.push({name: '💰 คลังสมบัติ (ไฉ่โข่ว)', desc: 'สะสมความมั่งคั่ง เก็บเงินอยู่', icon: '💰', isVault: true});
    if (currentVaults.powerVault === branch) stars.push({name: '🏛️ คลังอำนาจ', desc: 'สะสมบารมี ตำแหน่งหน้าที่การงาน', icon: '🏛️', isVault: true});
    if (currentVaults.resourceVault === branch) stars.push({name: '📚 คลังอุปถัมภ์', desc: 'สะสมปัญญา มีผู้ใหญ่คอยหนุนหลัง', icon: '📚', isVault: true});

    return stars;
}

function getBoxInnerHtml(char, contextStars = [], isKongWang = false) {
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
        html += `<div class="kongwang-badge tooltip-container">🕳️<span class="tooltip-text"><b>ติดคงบ้วง (สูญสิ้น)</b><br>พลังงานในเสานี้ถูกลดทอนลง ว่างเปล่า</span></div>`;
    }

    return html;
}

function renderBox(elementId, chineseChar, type, isEarth = false) {
    const box = document.getElementById(elementId);
    const data = elementMap[chineseChar] || { type: '' };
    box.classList.remove('wood', 'fire', 'earth', 'metal', 'water', 'fav-element', 'unfav-element');
    
    let stars = [];
    let isKw = false;
    
    if (isEarth) {
        if (currentBaZiData.day && currentBaZiData.day.gan) stars = checkSpecialStars(chineseChar, currentBaZiData.day.gan, currentBaZiData.year.zhi, currentBaZiData.day.zhi);
        if (currentKongWang.includes(chineseChar)) isKw = true;
    }
    
    box.innerHTML = getBoxInnerHtml(chineseChar, stars, isKw);
    
    if(data.type) {
        box.classList.add(data.type);
        if(isKw) box.style.opacity = '0.6';
        else box.style.opacity = '1';

        // 🌟 Visual Yong Shen (ไฮไลต์ธาตุให้คุณ/ให้โทษ) 🌟
        if (dmStrengthData.favTypes && dmStrengthData.favTypes.includes(data.type)) {
            box.classList.add('fav-element');
        } else if (dmStrengthData.unfavTypes && dmStrengthData.unfavTypes.includes(data.type)) {
            box.classList.add('unfav-element');
        }
    }
}

function updateShiShenLabels(dataObj, prefix, dayGan) {
    if(!dayGan) return;
    ['year', 'month', 'day', 'hour'].forEach(p => {
        let el = document.getElementById(prefix ? `${prefix}-${p}-shishen` : `${p}-shishen`);
        if(el) {
            if(p === 'day' && prefix === '') { /* ข้ามดิถี */ } 
            else {
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
        
        if (diShiEl && dataObj[p].diShi) {
            let dsData = diShiDesc[dataObj[p].diShi] || { th: dataObj[p].diShi, desc: '' };
            diShiEl.innerHTML = `${dsData.th}<span class="tooltip-text"><b>${dsData.th} (12 วัฏจักร)</b><br>${dsData.desc}</span>`;
        }
        if (naYinEl && dataObj[p].naYin) {
            let nayinName = dataObj[p].naYin;
            let nyElement = nayinName.includes('金') ? 'ทอง' : nayinName.includes('木') ? 'ไม้' : nayinName.includes('水') ? 'น้ำ' : nayinName.includes('火') ? 'ไฟ' : nayinName.includes('土') ? 'ดิน' : '';
            naYinEl.innerHTML = `อิมเจีย: ${nyElement}<span class="tooltip-text"><b>พลังธาตุเสียง (Na Yin)</b><br>${nayinName}</span>`;
        }
    });
}

function renderElementChart() {
    elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    let total = 0;
    
    const addPts = (char, pts) => {
        if(!char) return;
        const type = elementMap[char]?.type;
        if(type) { elementCounts[type] += pts; total += pts; }
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
    const thNames = { wood: 'ไม้', fire: 'ไฟ', earth: 'ดิน', metal: 'ทอง', water: 'น้ำ' };
    
    let html = `<h3 style="margin-top:0; font-size:15px; color:#1565c0; text-align:center;">📊 สัดส่วนพลังงาน 5 ธาตุ</h3><div style="display:flex; flex-direction:column; gap:8px; margin-top:15px;">`;
    
    for(let t in elementCounts) {
        let pct = total > 0 ? Math.round((elementCounts[t] / total) * 100) : 0;
        html += `<div style="display:flex; align-items:center; font-size:13px;">
            <span style="width:35px; font-weight:bold; color:${colors[t]}">${thNames[t]}</span>
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
    const dmType = elementMap[dm].type;
    const generatingMap = { 'wood': 'water', 'fire': 'wood', 'earth': 'fire', 'metal': 'earth', 'water': 'metal' };
    const exhaustingMap = { 'wood': ['fire', 'earth', 'metal'], 'fire': ['earth', 'metal', 'water'], 'earth': ['metal', 'water', 'wood'], 'metal': ['water', 'wood', 'fire'], 'water': ['wood', 'fire', 'earth'] };
    
    const supportType = generatingMap[dmType];
    const weakeningTypes = exhaustingMap[dmType];

    const weights = { monthZhi: 40, dayZhi: 15, yearZhi: 10, hourZhi: 10, monthGan: 10, yearGan: 8, hourGan: 7 };
    let score = 0; let supportingElements = []; let weakeningElements = [];

    const elementsToCheck = [
        { char: currentBaZiData.month.zhi, weight: weights.monthZhi, name: 'เสาเดือน' },
        { char: currentBaZiData.day.zhi, weight: weights.dayZhi, name: 'ราศีล่างวัน' },
        { char: currentBaZiData.year.zhi, weight: weights.yearZhi, name: 'เสาปี' },
        { char: currentBaZiData.hour.zhi, weight: weights.hourZhi, name: 'เสายาม' },
        { char: currentBaZiData.month.gan, weight: weights.monthGan, name: 'ราศีบนเดือน' },
        { char: currentBaZiData.year.gan, weight: weights.yearGan, name: 'ราศีบนปี' },
        { char: currentBaZiData.hour.gan, weight: weights.hourGan, name: 'ราศีบนยาม' }
    ];

    elementsToCheck.forEach(item => {
        if (!item.char) return;
        const elType = elementMap[item.char].type;
        if (elType === dmType || elType === supportType) {
            score += item.weight;
            supportingElements.push(`${elementMap[item.char].thName} (${item.name})`);
        } else {
            weakeningElements.push(`${elementMap[item.char].thName} (${item.name})`);
        }
    });

    const thTypeMap = {'wood': 'ไม้', 'fire': 'ไฟ', 'earth': 'ดิน', 'metal': 'ทอง', 'water': 'น้ำ'};
    let weakeningTh = weakeningTypes.map(t => thTypeMap[t]).join(', ');
    let supportingTh = `${thTypeMap[supportType]}, ${thTypeMap[dmType]}`;

    // 🌟 อัปเดตการเก็บอาร์เรย์ของธาตุที่ให้คุณ/ให้โทษ เพื่อนำไปไฮไลต์สี 🌟
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
    
    if (score >= 50) {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-strong">💪 ดิถีแข็งแรง (Strong)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0; font-size:13.5px; line-height: 1.6;">`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>เหตุผลที่แข็งแรง:</strong> มีธาตุส่งเสริมอยู่มาก (เช่น <strong>${supportingElements[0]}</strong>)</p>`;
        dmHtml += `<p><strong>✅ ธาตุให้คุณ (ควรเสริม):</strong> ธาตุ${weakeningTh}</p>`;
        dmHtml += `</div>`;
    } else {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-weak">🍃 ดิถีอ่อนแอ (Weak)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0; font-size:13.5px; line-height: 1.6;">`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>เหตุผลที่อ่อนแอ:</strong> มีธาตุบั่นทอนอยู่มาก (เช่น <strong>${weakeningElements[0]}</strong>)</p>`;
        dmHtml += `<p><strong>✅ ธาตุให้คุณ (ควรเสริม):</strong> ธาตุ${supportingTh}</p>`;
        dmHtml += `</div>`;
    }

    dmBox.innerHTML = dmHtml;
    dmBox.style.display = "block";
}

function getAdviceText(type, context) {
    if (type === 'ฮะ') return `<div class="advice-box advice-good"><strong>คำแนะนำ (ฮะ - ภาคี):</strong> ราบรื่น ได้รับความช่วยเหลือ หรือเจอคนถูกใจในเรื่องเกี่ยวกับ ${context}</div>`;
    if (type === 'ชง') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (ชง - ปะทะ):</strong> ระวังการเปลี่ยนแปลง อุบัติเหตุ หรือขัดแย้งในเรื่องเกี่ยวกับ ${context}</div>`;
    if (type === 'เฮ้ง') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (เฮ้ง - เบียดเบียน):</strong> อาจเกิดความอึดอัดใจ วุ่นวาย หรือกดดันในเรื่อง ${context}</div>`;
    if (type === 'ไห่') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (ไห่ - ให้ร้าย):</strong> ระวังถูกแทงข้างหลัง นินทา หรือปัญหาสุขภาพจาก ${context}</div>`;
    if (type === 'ผั่ว') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (ผั่ว - แตกหัก):</strong> สิ่งที่หวังอาจพังทลาย ต้องเริ่มใหม่ในเรื่อง ${context}</div>`;
    if (type === 'vault') return `<div class="advice-box advice-good" style="border-color:#ffb300; color:#e65100; background:#fff8e1;"><strong>คำแนะนำ (เปิดคลัง):</strong> มีเกณฑ์เปิดคลังขุมทรัพย์ ได้รับผลประโยชน์ก้อนโต หรือได้เลื่อนขั้นบารมี!</div>`;
    return "";
}

function showPopup(titleName, elementId, type) {
    const [pillar, level] = elementId.split('-');
    const sourceData = type === 'natal' ? currentBaZiData : currentTimeData;
    const pillarData = sourceData[pillar];
    
    let htmlContent = `<h3>ตำแหน่ง: ${pillarContextMap[pillar]} ${type === 'natal' ? `` : '(เวลาปัจจุบัน)'}</h3><hr style="margin: 10px 0; border: 0.5px solid #eee;">`;
    let relationHtml = ''; let specialStarsHtml = '';
    const pillarsToCheck = ['year', 'month', 'day', 'hour'];

    if (level === 'heaven') {
        const char = pillarData.gan;
        htmlContent += `<p><strong>ราศีบน:</strong> ${char} (${elementMap[char].thName})</p>`;
        
        if(type === 'natal') {
            const tenGodCh = tenGodsMap[currentBaZiData.day.gan][char];
            const shiShen = pillar === 'day' ? 'ดิถี (ตัวคุณ)' : shiShenMap[tenGodCh] || tenGodCh;
            htmlContent += `<p><strong>สิบเทพ:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShen}</span></p>`;
            
            pillarsToCheck.forEach(p => {
                if (p !== pillar) {
                    const otherChar = currentBaZiData[p].gan;
                    if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ฟ้าฮะ:</strong> ผูกพันกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ฟ้าชง:</strong> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                }
            });
            
            if (interactions.heavenlyCombos[char] === activeDaYunData.gan) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ วัยจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', pillarContextMap[pillar]);
            if (interactions.heavenlyClashes[char] === activeDaYunData.gan) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 วัยจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', pillarContextMap[pillar]);
            if (interactions.heavenlyCombos[char] === activeLiuNianData.gan) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ ปีจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', pillarContextMap[pillar]);
            if (interactions.heavenlyClashes[char] === activeLiuNianData.gan) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 ปีจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', pillarContextMap[pillar]);
        } else {
            if (Object.keys(currentBaZiData).length > 0) {
                htmlContent += `<p style="color:#555; font-size: 14px; margin-top: 10px;">⚡ <strong>ผลกระทบกับดวงกำเนิด:</strong></p>`;
                pillarsToCheck.forEach(p => {
                    const otherChar = currentBaZiData[p].gan;
                    if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✨ เวลานี้เข้ามา <strong>ฮะ</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ฮะ', pillarContextMap[p]);
                    if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>ชง</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ชง', pillarContextMap[p]);
                });
            } else {
                htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">กรุณาคำนวณผูกดวงก่อน เพื่อดูว่าเวลานี้ส่งผลกระทบอย่างไรกับดวงชะตาของคุณครับ</p></div>`;
            }
        }
    } else {
        const char = pillarData.zhi;
        htmlContent += `<p><strong>ราศีล่าง:</strong> ${char} (${elementMap[char].thName})</p>`;

        if(type === 'natal') {
            htmlContent += `<p><strong>ราศีแฝง:</strong> <span style="color:#d32f2f; font-weight:bold;">${hiddenGanMap[char].join(', ')}</span></p>`;

            pillarsToCheck.forEach(p => {
                if (p !== pillar) {
                    const otherChar = currentBaZiData[p].zhi;
                    if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ลักฮะ:</strong> ผูกพันกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักชง:</strong> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyHarms[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักไห่:</strong> ถูกเบียดเบียนจาก เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyDestructions[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักผั่ว:</strong> แตกหักกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(otherChar)) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักเฮ้ง:</strong> วุ่นวายกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                }
            });

            let dyZhi = activeDaYunData.zhi;
            if (interactions.earthlyCombos[char] === dyZhi) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ วัยจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', pillarContextMap[pillar]);
            if (interactions.earthlyClashes[char] === dyZhi) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 วัยจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', pillarContextMap[pillar]);
            
            let lnZhi = activeLiuNianData.zhi;
            if (interactions.earthlyCombos[char] === lnZhi) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ ปีจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', pillarContextMap[pillar]);
            if (interactions.earthlyClashes[char] === lnZhi) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 ปีจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', pillarContextMap[pillar]);

            const foundStars = checkSpecialStars(char, currentBaZiData.day.gan, currentBaZiData.year.zhi, currentBaZiData.day.zhi);
            if (foundStars.length > 0) {
                foundStars.forEach(star => { specialStarsHtml += `<li style="margin-bottom: 5px;"><strong>${star.name}</strong><br><span style="font-size: 0.85em; color: #555;">${star.desc}</span></li>`; });
            }
        } else {
            if (Object.keys(currentBaZiData).length > 0) {
                htmlContent += `<p style="color:#555; font-size: 14px; margin-top: 10px;">⚡ <strong>ผลกระทบกับดวงกำเนิด:</strong></p>`;
                pillarsToCheck.forEach(p => {
                    const otherChar = currentBaZiData[p].zhi;
                    if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✨ เวลานี้เข้ามา <strong>ฮะ</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ฮะ', pillarContextMap[p]);
                    if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>ชง</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ชง', pillarContextMap[p]);
                    
                    if (char === currentVaults.wealthVault) relationHtml += `<p style="color:#e65100; font-size: 0.95em; font-weight:bold;">💰 เวลานี้เข้ามาเปิด <b>คลังสมบัติ</b> ให้คุณ!</p>` + getAdviceText('vault', '');
                    if (char === currentVaults.powerVault) relationHtml += `<p style="color:#e65100; font-size: 0.95em; font-weight:bold;">🏛️ เวลานี้เข้ามาเปิด <b>คลังอำนาจ</b> ให้คุณ!</p>` + getAdviceText('vault', '');
                    if (char === currentVaults.resourceVault) relationHtml += `<p style="color:#e65100; font-size: 0.95em; font-weight:bold;">📚 เวลานี้เข้ามาเปิด <b>คลังอุปถัมภ์</b> ให้คุณ!</p>` + getAdviceText('vault', '');
                });
            } else {
                htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">กรุณาคำนวณผูกดวงก่อน เพื่อดูผลกระทบครับ</p></div>`;
            }
        }
    }

    if (relationHtml !== '') {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffb300; border-radius: 4px;"><p style="margin-bottom: 8px; font-weight: bold;">🔍 ปฏิสัมพันธ์ (Interactions):</p>${relationHtml}</div>`;
    } else if (type === 'current' && Object.keys(currentBaZiData).length > 0) {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">เวลาปัจจุบันไม่ได้ปะทะกับเสาใดในดวงกำเนิดครับ</p></div>`;
    }

    if (specialStarsHtml !== '') htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;"><p style="margin-bottom: 8px; font-weight: bold;">🔮 ดาวพิเศษ (Shen Sha):</p><ul style="padding-left: 20px; margin: 0;">${specialStarsHtml}</ul></div>`;

    document.getElementById('popup-detail').innerHTML = htmlContent;
    document.getElementById('popup-title').innerText = `${titleName} : ${document.getElementById(elementId).querySelector('.char').innerText}`;
    document.getElementById('popup-modal').style.display = "flex";
}

function closePopup() { document.getElementById('popup-modal').style.display = "none"; }

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

    if(currentBaZiData.day && currentBaZiData.day.gan) updateShiShenLabels(currentTimeData, 'curr', currentBaZiData.day.gan);
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
    
    if(currentBaZiData.day && currentBaZiData.day.gan) updateShiShenLabels(currentTimeData, 'curr', currentBaZiData.day.gan);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('current-time-title').innerHTML = `⏳ พลังงานกาลเวลา (Time Machine: ปี ค.ศ. ${targetYear})`;
    document.getElementById('reset-time-btn').style.display = 'inline-block';
}

function resetTimeMachine() {
    renderCurrentTimeBaZi();
    document.getElementById('current-time-title').innerHTML = `⏳ พลังงานกาลเวลาปัจจุบัน (Current Time)`;
    document.getElementById('reset-time-btn').style.display = 'none';
}

function calculateBaZi() {
    const dateInput = document.getElementById('birth_date').value;
    const timeInput = document.getElementById('birth_time').value;
    const genderInput = document.getElementById('gender').value;
    
    if (!dateInput || !timeInput) return alert("กรุณากรอกวันที่และเวลาเกิดให้ครบถ้วนครับ");

    const [y, m, d] = dateInput.split('-'); const [h, min] = timeInput.split(':');
    const solar = Solar.fromYmdHms(parseInt(y), parseInt(m), parseInt(d), parseInt(h), parseInt(min), 0);
    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar(); 
    
    currentKongWang = bazi.getDayXunKong();

    currentBaZiData = {
        gender: genderInput,
        year: { gan: bazi.getYearGan(), zhi: bazi.getYearZhi(), naYin: bazi.getYearNaYin(), diShi: bazi.getYearDiShi() },
        month: { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi(), naYin: bazi.getMonthNaYin(), diShi: bazi.getMonthDiShi() },
        day: { gan: bazi.getDayGan(), zhi: bazi.getDayZhi(), naYin: bazi.getDayNaYin(), diShi: bazi.getDayDiShi() },
        hour: { gan: bazi.getTimeGan(), zhi: bazi.getTimeZhi(), naYin: bazi.getTimeNaYin(), diShi: bazi.getTimeDiShi() }
    };

    currentVaults = calculateVaults(currentBaZiData.day.gan);

    // 🌟 ต้องเรียกฟังก์ชันคำนวณกำลังดิถี "ก่อน" เพื่อให้รู้ธาตุดี/ร้าย สำหรับการไฮไลต์กล่อง 🌟
    calculateDMStrength();

    ['year', 'month', 'day', 'hour'].forEach(p => {
        renderBox(`${p}-heaven`, currentBaZiData[p].gan, 'natal', false);
        renderBox(`${p}-earth`, currentBaZiData[p].zhi, 'natal', true);
    });

    updateShiShenLabels(currentBaZiData, '', currentBaZiData.day.gan);
    renderElementChart(); 

    renderCurrentTimeBaZi();
    document.getElementById('current-time-title').innerHTML = `⏳ พลังงานกาลเวลาปัจจุบัน (Current Time)`;
    document.getElementById('reset-time-btn').style.display = 'none';

    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - parseInt(y);
    const yun = bazi.getYun(genderInput === 'ชาย' ? 1 : 0);
    const daYunList = yun.getDaYun();
    
    let activeDY = daYunList[0];
    daYunList.forEach(dy => { if (currentAge >= dy.getStartAge()) activeDY = dy; });
    activeDaYunData = { gan: activeDY.getGanZhi().charAt(0), zhi: activeDY.getGanZhi().charAt(1), startAge: activeDY.getStartAge() };

    const currentLYear = Solar.fromYmd(currentYear, 6, 1).getLunar();
    activeLiuNianData = { gan: currentLYear.getYearGan(), zhi: currentLYear.getYearZhi(), year: currentYear };

    renderLuck(solar, genderInput === 'ชาย' ? 1 : 0);

    document.getElementById('ai-result-box').style.display = "none";
    document.getElementById('custom-question-box').style.display = "block"; 
    document.getElementById('download-btn').style.display = "block"; 
    
    document.getElementById('natal-bazi-section').style.display = "block";
    document.getElementById('luck-sections').style.display = "block";
    document.getElementById('ai-buttons-group').style.display = "flex"; 
    document.getElementById('save-btn').style.display = "block";
}

function getInteractionHTML(gan, zhi) {
    let res = [];
    if (!currentBaZiData.day) return `<div class="luck-interaction interact-none">(ไม่มีปะทะ)</div>`;
    
    const interactDesc = { 'ฮะ': 'รวมตัว ส่งเสริม ผูกพัน ราบรื่น', 'ชง': 'ปะทะ ขัดแย้ง เปลี่ยนแปลงกะทันหัน', 'เฮ้ง': 'เบียดเบียน อึดอัดใจ วุ่นวาย', 'ไห่': 'ให้ร้าย แทงข้างหลัง สุขภาพ', 'ผั่ว': 'แตกหัก เสียหาย เริ่มต้นใหม่' };

    if (interactions.heavenlyCombos[gan] === currentBaZiData.day.gan) 
        res.push(`<div class="interact-good tooltip-container">✨ ฟ้าฮะ<span class="tooltip-text">${interactDesc['ฮะ']}</span></div>`);

    ['year', 'month', 'day', 'hour'].forEach(p => {
        let chartZhi = currentBaZiData[p].zhi;
        if (interactions.earthlyClashes[zhi] === chartZhi) res.push(`<div class="interact-bad tooltip-container">💥 ชง${pillarNamesTh[p]}<span class="tooltip-text">${interactDesc['ชง']}กับเสา${pillarNamesTh[p]}</span></div>`);
        else if (interactions.earthlyCombos[zhi] === chartZhi) res.push(`<div class="interact-good tooltip-container">🤝 ฮะ${pillarNamesTh[p]}<span class="tooltip-text">${interactDesc['ฮะ']}กับเสา${pillarNamesTh[p]}</span></div>`);
    });

    if(res.length > 0) return `<div class="luck-interaction">${res.slice(0, 3).join('')}</div>`; 
    return `<div class="luck-interaction interact-none">(ไม่มีปะทะ)</div>`;
}

function renderLuck(solar, genderNum) {
    const bazi = solar.getLunar().getEightChar();
    const yun = bazi.getYun(genderNum);
    const daYunList = yun.getDaYun();
    const dayGan = currentBaZiData.day.gan; 
    
    const daYunContainer = document.getElementById('da-yun-list');
    daYunContainer.innerHTML = '';
    daYunList.forEach(dy => {
        const gan = dy.getGanZhi().charAt(0); const zhi = dy.getGanZhi().charAt(1);
        const interactionHtml = getInteractionHTML(gan, zhi); 
        
        let tenGodCh = tenGodsMap[dayGan][gan];
        let tenGodTh = shiShenMap[tenGodCh] || tenGodCh;
        let desc = shiShenDesc[tenGodTh] || '';
        let isKw = currentKongWang.includes(zhi);

        daYunContainer.innerHTML += `
            <div class="luck-pillar">
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
    for (let i = 0; i < 10; i++) {
        const tYear = currentYear + i;
        const lYear = Solar.fromYmd(tYear, 6, 1).getLunar();
        const yGan = lYear.getYearGan(); const yZhi = lYear.getYearZhi();
        const interactionHtml = getInteractionHTML(yGan, yZhi); 
        
        let tenGodCh = tenGodsMap[dayGan][yGan];
        let tenGodTh = shiShenMap[tenGodCh] || tenGodCh;
        let desc = shiShenDesc[tenGodTh] || '';
        let isKw = currentKongWang.includes(yZhi);

        liuNianContainer.innerHTML += `
            <div class="luck-pillar">
                <div class="age-label">${tYear}</div>
                <div class="luck-shishen tooltip-container">${tenGodTh}<span class="tooltip-text">${desc}</span></div>
                <div class="box ${elementMap[yGan]?.type}">${getBoxInnerHtml(yGan)}</div>
                <div class="box ${elementMap[yZhi]?.type}" style="opacity: ${isKw ? '0.6' : '1'}">${getBoxInnerHtml(yZhi, [], isKw)}</div>
                <div class="year-label">ปี${lYear.getYearShengXiao()}</div>
                ${interactionHtml}
                <button class="time-warp-btn" onclick="travelToYear(${tYear})">⏳ วาร์ป</button>
            </div>`;
    }
}

// 🌟 ระบบจัดการ TABS ในคัมภีร์ดวงชะตา 🌟
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
    if (!currentBaZiData.day) return alert("กรุณาคำนวณผูกดวงก่อนเปิดคัมภีร์ครับ");
    
    const dmGan = currentBaZiData.day.gan;
    const dmType = elementMap[dmGan].thName;

    let html = '';

    // --- TAB 1: พื้นฐาน / ธาตุที่ขาดหาย ---
    html += `<div id="tab-basic" class="tab-content active">`;
    html += `<div class="encyc-section">
                <h3 class="encyc-title">👤 ดิถีตัวตน (Day Master)</h3>
                <p>ดิถีของคุณคือ <b>${dmType} (${dmGan})</b> ซึ่งเป็นตัวแทนแก่นแท้ของจิตวิญญาณคุณ</p>
                <p>${dmStrengthData.status} ทำให้คุณต้องการ <b>ธาตุ${dmStrengthData.favorable}</b> เพื่อสร้างสมดุลในชีวิต (เป็นธาตุให้คุณ)</p>
             </div>`;

    // เช็คธาตุที่ขาดหาย
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

    html += `<div class="encyc-section">
                <h3 class="encyc-title">⚠️ ธาตุที่ขาดหาย (Missing Elements)</h3>`;
    if(missingElements.length > 0) {
        html += `<p style="font-size:13px; color:#666;">ในดวงกำเนิดของคุณไม่มีธาตุเหล่านี้ (แม้แต่ในราศีแฝง) ซึ่งส่งผลต่อจุดอ่อนในนิสัย:</p>
                 <ul style="margin:0; padding-left:20px;">${missingElements.join('')}</ul>`;
    } else {
        html += `<p>ยินดีด้วยครับ! ดวงของคุณมีธาตุทั้ง 5 ครบถ้วน (เบญจธาตุสมดุล) ทำให้คุณเป็นคนที่มีความสมบูรณ์ในแง่ของจิตวิญญาณและการใช้ชีวิต</p>`;
    }
    html += `</div></div>`;

    // --- TAB 2: 10 เทพ ---
    html += `<div id="tab-gods" class="tab-content" style="display:none;">`;
    let godsInChart = new Set();
    ['year', 'month', 'hour'].forEach(p => {
        let gan = currentBaZiData[p].gan;
        let tenGodCh = tenGodsMap[dmGan][gan];
        if(tenGodCh) godsInChart.add(shiShenMap[tenGodCh] || tenGodCh);
    });

    html += `<div class="encyc-section">
                <h3 class="encyc-title">☯️ สิบเทพในราศีบน (10 Gods)</h3>
                <p style="font-size:13px; color:#666;">โครงสร้างพลังงานที่หล่อหลอมรูปแบบชีวิตและการงานของคุณ (สิ่งที่คนอื่นมองเห็น):</p>`;
    if (godsInChart.size > 0) {
        godsInChart.forEach(god => {
            let desc = shiShenDesc[god] || '';
            html += `<div class="encyc-item"><b>[${god}]</b><br>${desc.replace(/\n/g, '<br>')}</div>`;
        });
    } else {
        html += `<p>ไม่พบสิบเทพที่เด่นชัดในราศีบน</p>`;
    }
    html += `</div></div>`;

    // --- TAB 3: ดาวพิเศษ / คลัง / คงบ้วง ---
    html += `<div id="tab-stars" class="tab-content" style="display:none;">`;
    
    // คลัง
    let foundVaults = [];
    ['year', 'month', 'day', 'hour'].forEach(p => {
        let zhi = currentBaZiData[p].zhi;
        if(zhi === currentVaults.wealthVault) foundVaults.push(`💰 <b>ไฉ่โข่ว (คลังสมบัติ)</b> อยู่ที่ เสา${pillarNamesTh[p]}: ดวงมีคลังเก็บเงิน หากเจอปีจรมาชนเปิดคลัง จะรวยพลิกชีวิต!`);
        if(zhi === currentVaults.powerVault) foundVaults.push(`🏛️ <b>กัวโข่ว (คลังอำนาจ)</b> อยู่ที่ เสา${pillarNamesTh[p]}: มีวาสนาบารมีซ่อนอยู่ เป็นผู้นำลับๆ`);
        if(zhi === currentVaults.resourceVault) foundVaults.push(`📚 <b>อิ่งโข่ว (คลังอุปถัมภ์)</b> อยู่ที่ เสา${pillarNamesTh[p]}: มีปัญญาและผู้ใหญ่หนุนหลังแบบคาดไม่ถึง`);
    });

    html += `<div class="encyc-section">
                <h3 class="encyc-title">🔐 คลังขุมทรัพย์ (The Vaults)</h3>`;
    if (foundVaults.length > 0) {
        foundVaults.forEach(v => { html += `<div class="encyc-item">${v}</div>`; });
    } else {
        html += `<p>ในดวงกำเนิดไม่มีตำแหน่งคลัง (เงินหรือโอกาสเข้ามารวดเร็วและผ่านไปเร็ว ต้องอาศัยการออมด้วยตัวเอง)</p>
                 <p style="font-size:13px; color:#e65100;">*หมายเหตุ: คลังสมบัติของคุณคือธาตุ <b>${elementMap[currentVaults.wealthVault].thName} (${currentVaults.wealthVault})</b> รอจังหวะปีจรวิ่งเข้ามาเปิดคลังนะครับ!</p>`;
    }
    html += `</div>`;

    // คงบ้วง
    html += `<div class="encyc-section">
                <h3 class="encyc-title">🕳️ ดาวคงบ้วง (ตำแหน่งสูญสิ้น)</h3>
                <p>นักษัตรคงบ้วงของคุณคือ: <b>${currentKongWang}</b></p>
                <p style="font-size:13.5px;">หากนักษัตรเหล่านี้ปรากฏในดวง หรือวิ่งเข้ามาในปีจร จะทำให้พลังงานเรื่องนั้นว่างเปล่า หรือต้องเหนื่อยกว่าปกติถึงจะได้มา</p>
             </div>`;
    html += `</div>`;

    // --- TAB 4: ปฏิสัมพันธ์ (ชง ฮะ) ---
    html += `<div id="tab-interact" class="tab-content" style="display:none;">`;
    let internalClashes = [];
    const pillars = ['year', 'month', 'day', 'hour'];
    for(let i=0; i<pillars.length; i++) {
        for(let j=i+1; j<pillars.length; j++) {
            let p1 = pillars[i]; let p2 = pillars[j];
            let zhi1 = currentBaZiData[p1].zhi; let zhi2 = currentBaZiData[p2].zhi;
            
            if(interactions.earthlyClashes[zhi1] === zhi2) internalClashes.push(`💥 <b>ชง (ปะทะ):</b> เสา${pillarNamesTh[p1]} ชง เสา${pillarNamesTh[p2]} (มักมีการเปลี่ยนแปลง แตกหัก หรือชีพจรลงเท้า)`);
            if(interactions.earthlyCombos[zhi1] === zhi2) internalClashes.push(`🤝 <b>ฮะ (ผูกพัน):</b> เสา${pillarNamesTh[p1]} ฮะ เสา${pillarNamesTh[p2]} (มีความรักใคร่ ผูกพัน และช่วยเหลือกันเหนียวแน่น)`);
            if(interactions.earthlyPunishments[zhi1] && interactions.earthlyPunishments[zhi1].includes(zhi2)) internalClashes.push(`⚠️ <b>เฮ้ง (เบียดเบียน):</b> เสา${pillarNamesTh[p1]} เฮ้ง เสา${pillarNamesTh[p2]} (มักเกิดความอึดอัดใจ วุ่นวาย หรือกดดัน)`);
            if(interactions.earthlyHarms[zhi1] === zhi2) internalClashes.push(`⚡ <b>ไห่ (ให้ร้าย):</b> เสา${pillarNamesTh[p1]} ไห่ เสา${pillarNamesTh[p2]} (ระวังการถูกเอาเปรียบ หรือปัญหาสุขภาพ)`);
            if(interactions.earthlyDestructions[zhi1] === zhi2) internalClashes.push(`🔨 <b>ผั่ว (แตกหัก):</b> เสา${pillarNamesTh[p1]} ผั่ว เสา${pillarNamesTh[p2]} (สิ่งที่สร้างไว้มักมีเหตุให้ต้องสร้างใหม่)`);
        }
    }

    html += `<div class="encyc-section">
                <h3 class="encyc-title">⚡ ปฏิสัมพันธ์ในพื้นดวงกำเนิด (ชง ฮะ เฮ้ง)</h3>
                <p style="font-size:13px; color:#666;">โชคชะตาที่ถูกสลักไว้ตั้งแต่เกิด (ความขัดแย้ง/ผูกพันในตัวเอง):</p>`;
    if (internalClashes.length > 0) {
        internalClashes.forEach(clash => { html += `<div class="encyc-item">${clash}</div>`; });
    } else {
        html += `<p>พื้นดวงสงบนิ่ง ไม่มีปฏิกิริยาปะทะหรือผูกพันที่รุนแรง</p>`;
    }
    html += `</div></div>`;

    document.getElementById('encyclopedia-detail').innerHTML = html;
    document.getElementById('encyclopedia-modal').style.display = "flex";
    
    // ตั้งค่าหน้าแรกให้เป็น Tab 1 เสมอ
    openEncycTab(null, 'tab-basic');
    document.querySelector('.tab-link').classList.add('active');
}
function closeEncyclopedia() { document.getElementById('encyclopedia-modal').style.display = "none"; }

// 🌟 ฟังก์ชันใหม่: เปิดพจนานุกรมปาจื้อ 🌟
function openGlossary() {
    let html = `<div class="encyc-section"><h3 class="encyc-title">☯️ สิบเทพ (10 Gods)</h3>`;
    for(let key in shiShenDesc) { html += `<div class="encyc-item"><b>${key}:</b><br>${shiShenDesc[key].replace(/\n/g, '<br>')}</div>`; }
    html += `</div>`;

    html += `<div class="encyc-section"><h3 class="encyc-title">⏳ 12 วัฏจักร (12 Growth Phases)</h3>`;
    for(let key in diShiDesc) { html += `<div class="encyc-item"><b>${diShiDesc[key].th} (${key}):</b> ${diShiDesc[key].desc}</div>`; }
    html += `</div>`;

    html += `<div class="encyc-section"><h3 class="encyc-title">⚡ ปฏิสัมพันธ์ (Interactions)</h3>
                <div class="encyc-item"><b>ฮะ (ภาคี):</b> รวมตัว, ผูกพัน, ราบรื่น, ได้รับความช่วยเหลือ</div>
                <div class="encyc-item"><b>ชง (ปะทะ):</b> ขัดแย้ง, เปลี่ยนแปลงกะทันหัน, อุบัติเหตุ, เคลื่อนที่</div>
                <div class="encyc-item"><b>เฮ้ง (เบียดเบียน):</b> อึดอัดใจ, วุ่นวาย, กดดัน, คดีความ</div>
                <div class="encyc-item"><b>ไห่ (ให้ร้าย):</b> ถูกแทงข้างหลัง, นินทา, ปัญหาสุขภาพซ่อนเร้น</div>
                <div class="encyc-item"><b>ผั่ว (แตกหัก):</b> เสียหาย, พังทลาย, ต้องเริ่มต้นใหม่</div>
             </div>`;

    document.getElementById('glossary-detail').innerHTML = html;
    document.getElementById('glossary-modal').style.display = "flex";
}
function closeGlossary() { document.getElementById('glossary-modal').style.display = "none"; }

// AI Functions (คงเดิม)
function getDailyHoroscope() {
    const btn = document.getElementById('ai-daily-btn');
    const resultBox = document.getElementById('ai-result-box');
    const aiContent = document.getElementById('ai-content');
    renderCurrentTimeBaZi();
    const name = document.getElementById('name').value || "ไม่ระบุ";
    const cacheKey = `daily_cache_${name}_${new Date().toISOString().split('T')[0]}`;
    if (localStorage.getItem(cacheKey)) { resultBox.style.display = "block"; aiContent.innerHTML = localStorage.getItem(cacheKey); return; }
    btn.innerText = "⏳ สับติ้วเซียมซี..."; btn.disabled = true;
    resultBox.style.display = "block"; aiContent.innerHTML = `<div style="text-align:center;">กำลังวิเคราะห์พลังงานในวันนี้เทียบกับดวงเกิดของคุณ... ⏳</div>`;
    const payload = { action: "daily", personal_info: { name: name }, bazi_results: currentBaZiData, current_time: currentTimeData };
    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json()).then(data => {
        if (data.result === "success") { localStorage.setItem(cacheKey, data.analysis); aiContent.innerHTML = data.analysis; }
        else aiContent.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.message}</p>`;
        btn.innerText = "🥠 เซียมซีทำนายรายวัน"; btn.disabled = false;
    }).catch(e => { aiContent.innerHTML = `<p style="color:red;">ไม่สามารถเชื่อมต่อได้ในขณะนี้</p>`; btn.innerText = "🥠 เซียมซีทำนายรายวัน"; btn.disabled = false; });
}

function openSynastryModal() { document.getElementById('synastry-modal').style.display = "flex"; }
function closeSynastryModal() { document.getElementById('synastry-modal').style.display = "none"; }
function calculateSynastry() {
    const pDate = document.getElementById('partner_birth_date').value; const pTime = document.getElementById('partner_birth_time').value;
    if(!pDate || !pTime) return alert("กรุณากรอกวันและเวลาเกิดของคู่ให้ครบถ้วนครับ");
    const [y, m, d] = pDate.split('-'); const [h, min] = pTime.split(':');
    const bazi = Solar.fromYmdHms(parseInt(y), parseInt(m), parseInt(d), parseInt(h), parseInt(min), 0).getLunar().getEightChar(); 
    partnerBaZiData = { name: document.getElementById('partner_name').value || "พาร์ทเนอร์", gender: document.getElementById('partner_gender').value, year: { gan: bazi.getYearGan(), zhi: bazi.getYearZhi() }, month: { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi() }, day: { gan: bazi.getDayGan(), zhi: bazi.getDayZhi() }, hour: { gan: bazi.getTimeGan(), zhi: bazi.getTimeZhi() } };
    closeSynastryModal();
    const btn = document.getElementById('ai-synastry-btn'); document.getElementById('ai-result-box').style.display = "block";
    document.getElementById('ai-content').innerHTML = `<div style="text-align:center;">กำลังทาบดวงชะตาเพื่อหาจุดสมพงษ์... ⏳</div>`; btn.disabled = true;
    fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "synastry", my_bazi: currentBaZiData, my_name: document.getElementById('name').value, partner_bazi: partnerBaZiData }) }).then(r => r.json()).then(data => {
        document.getElementById('ai-content').innerHTML = data.result === "success" ? data.analysis : `<p style="color:red;">เกิดข้อผิดพลาด: ${data.message}</p>`; btn.disabled = false; btn.innerText = "💞 เทียบดวงสมพงษ์";
    });
}

function analyzeWithAI(forceRefresh = false) {
    const name = document.getElementById('name').value || "ไม่ระบุ";
    const cacheKey = `ai_cache_${name}_${document.getElementById('birth_date').value}_${document.getElementById('ai-custom-question').value.trim()}`;
    const btn = document.getElementById('ai-btn'); const aiContent = document.getElementById('ai-content');
    if (!forceRefresh && localStorage.getItem(cacheKey)) { document.getElementById('ai-result-box').style.display = "block"; aiContent.innerHTML = localStorage.getItem(cacheKey) + `<br><br><div style="text-align:center;"><button onclick="analyzeWithAI(true)" style="background:#f44336; color:white; border:none; cursor:pointer; border-radius:5px; font-size:15px; padding:10px 20px; font-weight:bold;">🔄 ขอคำทำนายใหม่</button></div>`; return; }
    btn.innerText = "⏳ ซินแสกำลังประมวลผล..."; btn.disabled = true; document.getElementById('ai-result-box').style.display = "block";
    aiContent.innerHTML = `<div style="text-align:center;">กำลังวิเคราะห์เส้นทางชะตาชีวิตของคุณ... ⏳</div>`;
    fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "analyze", personal_info: { name: name, gender: document.getElementById('gender').value, birth_date: document.getElementById('birth_date').value, birth_time: document.getElementById('birth_time').value }, bazi_results: currentBaZiData, dm_strength: dmStrengthData, da_yun: activeDaYunData, liu_nian: activeLiuNianData, custom_question: document.getElementById('ai-custom-question').value.trim() }) }).then(r => r.json()).then(data => {
        if (data.result === "success") { localStorage.setItem(cacheKey, data.analysis); aiContent.innerHTML = data.analysis + `<br><br><div style="text-align:center;"><button onclick="analyzeWithAI(true)" style="background:#f44336; color:white; border:none; cursor:pointer; border-radius:5px; font-size:15px; padding:10px 20px; font-weight:bold;">🔄 ขอคำทำนายใหม่</button></div>`; } 
        else aiContent.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด</p>`; btn.innerText = "✨ ซินแสวิเคราะห์ดวงชะตา"; btn.disabled = false;
    });
}

function downloadBaziImage() {
    const captureArea = document.getElementById('capture-area'); const btn = document.getElementById('download-btn');
    btn.innerText = "⏳ กำลังประมวลผลรูปภาพ..."; btn.disabled = true;
    const originalBg = captureArea.style.background; captureArea.style.background = '#ffffff'; 
    html2canvas(captureArea, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
        captureArea.style.background = originalBg; const link = document.createElement('a');
        link.download = `ดวงชะตา_${document.getElementById('name').value || "MyBaZi"}.png`; link.href = canvas.toDataURL('image/png'); link.click();
        btn.innerText = "📸 บันทึกรูปดวงชะตานี้ลงเครื่อง"; btn.disabled = false;
    });
}

function saveToGoogleSheets() {
    const btn = document.getElementById('save-btn'); btn.innerText = "กำลังบันทึก..."; btn.disabled = true;
    fetch(API_URL, { method: 'POST', body: JSON.stringify({ name: document.getElementById('name').value, gender: document.getElementById('gender').value, birth_date: document.getElementById('birth_date').value, birth_time: document.getElementById('birth_time').value, bazi_results: currentBaZiData, note: "" }) }).then(() => { alert("บันทึกสำเร็จ!"); fetchSavedData(); btn.innerText = "💾 บันทึกดวงนี้ลงฐานข้อมูล"; btn.disabled = false; });
}

function fetchSavedData() {
    fetch(API_URL).then(r => r.json()).then(data => {
        savedRecordsList = data; let select = document.getElementById('saved-profiles');
        select.innerHTML = '<option value="">-- เลือกดวงที่บันทึกไว้ --</option>';
        data.forEach((r, i) => select.innerHTML += `<option value="${i}">${r.name} (${r.birth_date})</option>`);
    });
}

function loadSavedData() {
    const v = document.getElementById('saved-profiles').value; if(v === "") return;
    document.getElementById('name').value = savedRecordsList[v].name; document.getElementById('gender').value = savedRecordsList[v].gender;
    document.getElementById('birth_date').value = savedRecordsList[v].birth_date; document.getElementById('birth_time').value = savedRecordsList[v].birth_time; calculateBaZi();
}

window.onload = function() { fetchSavedData(); renderCurrentTimeBaZi(); };
