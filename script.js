const API_URL = "https://script.google.com/macros/s/AKfycby-Jf7A-TSbwrvvJWxBdn4a8bDjPIw-MLzNN5Bp6NxVfImFstN7yf3kB75lLgO9jX_n/exec";
let currentBaZiData = {};
let savedRecordsList = [];

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

const shiShenMap = {
    '比肩': 'ผี่เจียง (เพื่อน)', '劫财': 'เกียบไช้ (แย่งชิง)', '食神': 'เจียะซิ้ง (ผลงาน)', '伤官': 'ซังกัว (แสดงออก)',
    '偏财': 'เพียงไช้ (ลาภลอย)', '正财': 'เจี้ยไช้ (โชคลาภ)', '七杀': 'ชิกสัวะ (อำนาจ)', '正官': 'เจี้ยกัว (ขุนนาง)',
    '偏印': 'เพียงอิ่ง (อุปถัมภ์รอง)', '正印': 'เจี้ยอิ่ง (อุปถัมภ์หลัก)'
};

const pillarContextMap = { 'year': 'เสาปี', 'month': 'เสาเดือน', 'day': 'เสาวัน', 'hour': 'เสายาม' };
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

const sanHeGroups = [
    { elements: ['申', '子', '辰'], name: 'ธาตุน้ำ' }, { elements: ['亥', '卯', '未'], name: 'ธาตุไม้' },
    { elements: ['寅', '午', '戌'], name: 'ธาตุไฟ' }, { elements: ['巳', '酉', '丑'], name: 'ธาตุทอง' }
];

function checkSpecialStars(branch, dayGan, yearZhi, dayZhi) {
    let stars = [];
    if ({ '甲':['丑','未'], '戊':['丑','未'], '庚':['丑','未'], '乙':['子','申'], '己':['子','申'], '丙':['亥','酉'], '丁':['亥','酉'], '壬':['卯','巳'], '癸':['卯','巳'], '辛':['寅','午'] }[dayGan]?.includes(branch)) stars.push({name: '🌟 ดาวอุปถัมภ์', desc: 'คนคอยช่วยเหลือ'});
    if ({ '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' }[yearZhi] === branch || { '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' }[dayZhi] === branch) stars.push({name: '🌸 ดาวดอกท้อ', desc: 'มีเสน่ห์ดึงดูด เป็นที่รัก'});
    if ({ '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }[yearZhi] === branch || { '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }[dayZhi] === branch) stars.push({name: '🐎 ดาวม้าเดินทาง', desc: 'โยกย้าย เดินทางบ่อย'});
    if ({ '甲':'寅', '乙':'卯', '丙':'午', '戊':'午', '丁':'巳', '己':'巳', '庚':'申', '辛':'酉', '壬':'亥', '癸':'子' }[dayGan] === branch) stars.push({name: '💰 ดาวลู่เสิน', desc: 'อุดมสมบูรณ์ มั่งคั่ง'});
    if ({ '甲':'巳', '乙':'午', '丙':'申', '戊':'申', '丁':'酉', '己':'酉', '庚':'亥', '辛':'子', '壬':'寅', '癸':'卯' }[dayGan] === branch) stars.push({name: '📚 ดาวเหวินชาง', desc: 'ปัญญาเลิศ หัวไว'});
    if ({ '甲':'卯', '丙':'午', '戊':'午', '庚':'酉', '壬':'子' }[dayGan] === branch) stars.push({name: '⚔️ ดาวดาบแกะ', desc: 'เด็ดขาด ใจร้อน'});
    return stars;
}

function getBoxInnerHtml(char) {
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
    return html;
}

function renderBox(elementId, chineseChar) {
    const box = document.getElementById(elementId);
    const data = elementMap[chineseChar] || { type: '' };
    box.classList.remove('wood', 'fire', 'earth', 'metal', 'water');
    box.innerHTML = getBoxInnerHtml(chineseChar);
    if(data.type) box.classList.add(data.type);
}

// 🌟 อัปเกรดฟังก์ชันคำนวณกำลังดิถี พร้อมคำอธิบายเชิงลึก 🌟
function calculateDMStrength() {
    const dm = currentBaZiData.day.gan;
    const dmType = elementMap[dm].type;
    const generatingMap = { 'wood': 'water', 'fire': 'wood', 'earth': 'fire', 'metal': 'earth', 'water': 'metal' };
    const exhaustingMap = { 'wood': ['fire', 'earth', 'metal'], 'fire': ['earth', 'metal', 'water'], 'earth': ['metal', 'water', 'wood'], 'metal': ['water', 'wood', 'fire'], 'water': ['wood', 'fire', 'earth'] };
    
    const supportType = generatingMap[dmType]; // ธาตุที่มาส่งเสริม (อุปถัมภ์)
    const weakeningTypes = exhaustingMap[dmType]; // ธาตุที่มาบั่นทอน (ถ่ายเท, พิฆาต)

    // น้ำหนักของแต่ละตำแหน่ง (เสาเดือนสำคัญที่สุดในการกำหนดฤดูกาล)
    const weights = { monthZhi: 40, dayZhi: 15, yearZhi: 10, hourZhi: 10, monthGan: 10, yearGan: 8, hourGan: 7 };

    let score = 0;
    let supportingElements = [];
    let weakeningElements = [];

    const elementsToCheck = [
        { char: currentBaZiData.month.zhi, weight: weights.monthZhi, name: 'เสาเดือน (ฤดูกาลเกิด)' },
        { char: currentBaZiData.day.zhi, weight: weights.dayZhi, name: 'ราศีล่างวันเกิด' },
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
            supportingElements.push(`${elementMap[item.char].thName} (จาก ${item.name})`);
        } else {
            weakeningElements.push(`${elementMap[item.char].thName} (จาก ${item.name})`);
        }
    });

    const dmBox = document.getElementById('dm-strength-box');
    let dmHtml = `<div class="dm-strength-title">กำลังของดิถี (Day Master Strength)</div>`;
    dmHtml += `<p style="font-size:15px;">ดิถี (ตัวคุณ) คือ <strong>${elementMap[dm].thName}</strong> (ธาตุ${dmType === 'wood' ? 'ไม้' : dmType === 'fire' ? 'ไฟ' : dmType === 'earth' ? 'ดิน' : dmType === 'metal' ? 'ทอง' : 'น้ำ'})</p>`;
    
    // แปลชื่อธาตุเป็นภาษาไทย
    const thTypeMap = {'wood': 'ไม้', 'fire': 'ไฟ', 'earth': 'ดิน', 'metal': 'ทอง', 'water': 'น้ำ'};
    let weakeningTh = weakeningTypes.map(t => thTypeMap[t]).join(', ');
    let supportingTh = `${thTypeMap[supportType]}, ${thTypeMap[dmType]}`;

    if (score >= 50) {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-strong">💪 ดิถีแข็งแรง (Strong)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0; font-size:13.5px; line-height: 1.6;">`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>เหตุผลที่แข็งแรง:</strong> เพราะในดวงชะตานี้มีธาตุที่ส่งเสริมคุณอยู่มาก (เกินครึ่งหนึ่งของดวง) โดยเฉพาะ <strong>${supportingElements[0]}</strong> ที่ให้กำลังคุณอย่างมาก</p>`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>✅ ธาตุให้คุณ (ปรับสมดุล):</strong> เมื่อดิถีแข็งแรงเกินไปตามหลักปาจื้อจะต้อง "ระบาย" หรือ "ควบคุม" พลังงานออก ดังนั้นธาตุที่ให้คุณคือ <strong>ธาตุ${weakeningTh}</strong> ซึ่งจะช่วยลดความแข็งกร้าวและนำความสำเร็จมาให้</p>`;
        dmHtml += `<p><strong>❌ ธาตุให้โทษ:</strong> ควรหลีกเลี่ยง <strong>ธาตุ${supportingTh}</strong> เพราะจะทำให้ดิถีแข็งแรงจนล้น ส่งผลให้เกิดความดื้อรั้น เอาแต่ใจ หรือมีศัตรู/คู่แข่งเพิ่มขึ้น</p>`;
        dmHtml += `</div>`;
    } else {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-weak">🍃 ดิถีอ่อนแอ (Weak)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0; font-size:13.5px; line-height: 1.6;">`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>เหตุผลที่อ่อนแอ:</strong> เพราะดวงชะตานี้แวดล้อมไปด้วยธาตุที่มารุมบั่นทอนและแย่งชิงพลังงานของคุณ (โดยเฉพาะอิทธิพลจาก <strong>${weakeningElements[0]}</strong>)</p>`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>✅ ธาตุให้คุณ (ปรับสมดุล):</strong> เมื่อดิถีอ่อนแอตามหลักปาจื้อจะต้อง "เสริมกำลัง" หรือ "อุปถัมภ์" ดังนั้นธาตุที่ให้คุณคือ <strong>ธาตุ${supportingTh}</strong> ซึ่งจะช่วยเป็นฐานที่มั่นคงและมีผู้ใหญ่คอยเกื้อหนุน</p>`;
        dmHtml += `<p><strong>❌ ธาตุให้โทษ:</strong> ควรหลีกเลี่ยง <strong>ธาตุ${weakeningTh}</strong> เพราะจะยิ่งมาถ่ายเทหรือพิฆาตพลังงานของคุณให้หมดไป ส่งผลให้เหนื่อยล้า แบกรับภาระหนัก หรือถูกกดดัน</p>`;
        dmHtml += `</div>`;
    }

    dmBox.innerHTML = dmHtml;
    dmBox.style.display = "block";
}

function getInteractionHTML(gan, zhi) {
    let res = [];
    
    if (interactions.heavenlyCombos[gan] === currentBaZiData.day.gan) {
        res.push(`<div class="interact-good">✨ ฟ้าฮะดิถี</div>`);
    }

    ['year', 'month', 'day', 'hour'].forEach(p => {
        let chartZhi = currentBaZiData[p].zhi;
        if (interactions.earthlyClashes[zhi] === chartZhi) res.push(`<div class="interact-bad">💥 ชง${pillarNamesTh[p]}</div>`);
        else if (interactions.earthlyCombos[zhi] === chartZhi) res.push(`<div class="interact-good">🤝 ฮะ${pillarNamesTh[p]}</div>`);
        else if (interactions.earthlyPunishments[zhi] && interactions.earthlyPunishments[zhi].includes(chartZhi)) res.push(`<div class="interact-bad">⚠️ เฮ้ง${pillarNamesTh[p]}</div>`);
        else if (interactions.earthlyHarms[zhi] === chartZhi) res.push(`<div class="interact-bad">⚡ ไห่${pillarNamesTh[p]}</div>`);
        else if (interactions.earthlyDestructions[zhi] === chartZhi) res.push(`<div class="interact-bad">🔨 ผั่ว${pillarNamesTh[p]}</div>`);
    });

    if(res.length > 0) return `<div class="luck-interaction">${res.slice(0, 3).join('')}</div>`; 
    return `<div class="luck-interaction interact-none">(ไม่มีปะทะ)</div>`;
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

    currentBaZiData = {
        gender: genderInput,
        year: { gan: bazi.getYearGan(), zhi: bazi.getYearZhi(), ganShiShen: bazi.getYearShiShenGan(), zhiShiShen: bazi.getYearShiShenZhi() },
        month: { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi(), ganShiShen: bazi.getMonthShiShenGan(), zhiShiShen: bazi.getMonthShiShenZhi() },
        day: { gan: bazi.getDayGan(), zhi: bazi.getDayZhi(), ganShiShen: 'ดิถี', zhiShiShen: bazi.getDayShiShenZhi() },
        hour: { gan: bazi.getTimeGan(), zhi: bazi.getTimeZhi(), ganShiShen: bazi.getTimeShiShenGan(), zhiShiShen: bazi.getTimeShiShenZhi() }
    };

    ['year', 'month', 'day', 'hour'].forEach(p => {
        renderBox(`${p}-heaven`, currentBaZiData[p].gan);
        renderBox(`${p}-earth`, currentBaZiData[p].zhi);
    });

    calculateDMStrength(); 
    renderLuck(solar, genderInput === 'ชาย' ? 1 : 0);

    document.getElementById('bazi-result').style.display = "flex";
    document.getElementById('luck-sections').style.display = "block";
    document.getElementById('ai-btn').style.display = "block";
    document.getElementById('save-btn').style.display = "block";
}

function renderLuck(solar, genderNum) {
    const bazi = solar.getLunar().getEightChar();
    
    const yun = bazi.getYun(genderNum);
    const daYunList = yun.getDaYun();
    const daYunContainer = document.getElementById('da-yun-list');
    daYunContainer.innerHTML = '';

    daYunList.forEach(dy => {
        const ganZhi = dy.getGanZhi();
        const gan = ganZhi.charAt(0);
        const zhi = ganZhi.charAt(1);
        const startAge = dy.getStartAge();
        const startYear = dy.getStartYear();
        
        const interactionHtml = getInteractionHTML(gan, zhi); 

        const pillarDiv = document.createElement('div');
        pillarDiv.className = 'luck-pillar';
        pillarDiv.innerHTML = `
            <div class="age-label">อายุ ${startAge}</div>
            <div class="box ${elementMap[gan] ? elementMap[gan].type : ''}">${getBoxInnerHtml(gan)}</div>
            <div class="box ${elementMap[zhi] ? elementMap[zhi].type : ''}">${getBoxInnerHtml(zhi)}</div>
            <div class="year-label">${startYear}</div>
            ${interactionHtml}
        `;
        daYunContainer.appendChild(pillarDiv);
    });

    const currentYear = new Date().getFullYear();
    const liuNianContainer = document.getElementById('liu-nian-list');
    liuNianContainer.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const targetYear = currentYear + i;
        // แก้ไขวันดึงข้อมูลเป็นเดือน 6 เพื่อข้ามวันลี่ชุนให้ชัวร์ๆ ตามที่เราตกลงกันไว้ครับ 🌟
        const lYear = Solar.fromYmd(targetYear, 6, 1).getLunar();
        const yGan = lYear.getYearGan();
        const yZhi = lYear.getYearZhi();

        const interactionHtml = getInteractionHTML(yGan, yZhi); 

        const pillarDiv = document.createElement('div');
        pillarDiv.className = 'luck-pillar';
        pillarDiv.innerHTML = `
            <div class="age-label">${targetYear}</div>
            <div class="box ${elementMap[yGan] ? elementMap[yGan].type : ''}">${getBoxInnerHtml(yGan)}</div>
            <div class="box ${elementMap[yZhi] ? elementMap[yZhi].type : ''}">${getBoxInnerHtml(yZhi)}</div>
            <div class="year-label">ปี${lYear.getYearShengXiao()}</div>
            ${interactionHtml}
        `;
        liuNianContainer.appendChild(pillarDiv);
    }
}

function showPopup(titleName, elementId) {
    const [pillar, level] = elementId.split('-');
    const pillarData = currentBaZiData[pillar];
    
    let htmlContent = `<h3>ตำแหน่ง: ${pillarContextMap[pillar]}</h3><hr style="margin: 10px 0; border: 0.5px solid #eee;">`;
    let relationHtml = ''; let specialStarsHtml = '';
    const pillarsToCheck = ['year', 'month', 'day', 'hour'];
    const allBranchesInChart = pillarsToCheck.map(p => currentBaZiData[p].zhi);

    if (level === 'heaven') {
        const char = pillarData.gan;
        const shiShen = pillar === 'day' ? 'ดิถี (ธาตุประจำตัว)' : shiShenMap[pillarData.ganShiShen] || pillarData.ganShiShen;
        
        htmlContent += `<p><strong>ราศีบน:</strong> ${char} (${elementMap[char].thName})</p>`;
        htmlContent += `<p><strong>สิบเทพ:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShen}</span></p>`;

        pillarsToCheck.forEach(p => {
            if (p !== pillar) {
                const otherChar = currentBaZiData[p].gan;
                if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ฟ้าฮะ:</strong> สนับสนุนกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ฟ้าชง:</strong> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
            }
        });
    } else {
        const char = pillarData.zhi;
        const shiShenArray = pillarData.zhiShiShen.map(ss => shiShenMap[ss] || ss).join(', ');
        
        htmlContent += `<p><strong>ราศีล่าง (นักษัตร):</strong> ${char} (${elementMap[char].thName})</p>`;
        htmlContent += `<p><strong>ราศีแฝง:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShenArray}</span></p>`;

        pillarsToCheck.forEach(p => {
            if (p !== pillar) {
                const otherChar = currentBaZiData[p].zhi;
                if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ลักฮะ (ภาคี):</strong> ผูกพันกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักชง (ปะทะ):</strong> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.earthlyHarms[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักไห่ (ให้ร้าย):</strong> ถูกเบียดเบียนจาก เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.earthlyDestructions[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักผั่ว (แตกหัก):</strong> แตกหัก/เสียหายกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(otherChar)) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักเฮ้ง (เบียดเบียน):</strong> วุ่นวาย/อึดอัดกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
            }
        });

        sanHeGroups.forEach(group => {
            if (group.elements.includes(char) && group.elements.every(el => allBranchesInChart.includes(el))) {
                relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ <strong>ซาฮะ (ไตรภาคี):</strong> รวมพลังกลายเป็น [${group.name}] อย่างสมบูรณ์ในดวง!</p>`;
            }
        });

        const dayGan = currentBaZiData['day'].gan;
        const yearZhi = currentBaZiData['year'].zhi;
        const dayZhi = currentBaZiData['day'].zhi;
        
        const foundStars = checkSpecialStars(char, dayGan, yearZhi, dayZhi);
        if (foundStars.length > 0) {
            foundStars.forEach(star => {
                specialStarsHtml += `<li style="margin-bottom: 5px;"><strong>${star.name}</strong><br><span style="font-size: 0.85em; color: #555;">${star.desc}</span></li>`;
            });
        }
    }

    if (relationHtml !== '') htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffb300; border-radius: 4px;"><p style="margin-bottom: 8px; font-weight: bold;">🔍 ปฏิสัมพันธ์ (Interactions):</p>${relationHtml}</div>`;
    if (specialStarsHtml !== '') htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;"><p style="margin-bottom: 8px; font-weight: bold;">🔮 ดาวพิเศษ (Shen Sha):</p><ul style="padding-left: 20px; margin: 0;">${specialStarsHtml}</ul></div>`;

    document.getElementById('popup-detail').innerHTML = htmlContent;
    document.getElementById('popup-title').innerText = `${titleName} : ${document.getElementById(elementId).querySelector('.char').innerText}`;
    document.getElementById('popup-modal').style.display = "flex";
}

function closePopup() { document.getElementById('popup-modal').style.display = "none"; }

function analyzeWithAI() {
    const btn = document.getElementById('ai-btn');
    const resultBox = document.getElementById('ai-result-box');
    const aiContent = document.getElementById('ai-content');

    btn.innerText = "✨ ซินแส Gemini กำลังผูกดวงและประมวลผล... (อาจใช้เวลา 10-20 วินาที)";
    btn.disabled = true;
    resultBox.style.display = "block";
    aiContent.innerHTML = `<div style="text-align:center;">กำลังวิเคราะห์เส้นทางชะตาชีวิตของคุณ... ⏳</div>`;

    const payload = {
        action: "analyze",
        personal_info: { name: document.getElementById('name').value || "ไม่ระบุ", gender: document.getElementById('gender').value, birth_date: document.getElementById('birth_date').value, birth_time: document.getElementById('birth_time').value },
        bazi_results: currentBaZiData
    };

    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            aiContent.innerHTML = data.analysis;
            btn.innerText = "✨ วิเคราะห์เสร็จสิ้น (คลิกเพื่อวิเคราะห์ใหม่)";
        } else {
            aiContent.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.message}</p>`;
            btn.innerText = "ลองใหม่อีกครั้ง";
        }
        btn.disabled = false;
    }).catch(error => {
        aiContent.innerHTML = `<p style="color:red;">ไม่สามารถเชื่อมต่อได้ในขณะนี้</p>`;
        btn.innerText = "✨ ให้ AI ซินแส (Gemini) วิเคราะห์ดวงชะตานี้แบบเจาะลึก";
        btn.disabled = false;
    });
}

function saveToGoogleSheets() {
    const payload = {
        name: document.getElementById('name').value || "ไม่ระบุชื่อ", gender: document.getElementById('gender').value,
        birth_date: document.getElementById('birth_date').value, birth_time: document.getElementById('birth_time').value,
        bazi_results: currentBaZiData, note: "ทดสอบบันทึกข้อมูล"
    };
    const btn = document.getElementById('save-btn');
    btn.innerText = "กำลังบันทึก..."; btn.disabled = true;
    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(() => { 
        alert("บันทึกสำเร็จ!"); 
        btn.innerText = "บันทึกดวงนี้ลงฐานข้อมูล"; 
        btn.disabled = false; 
        fetchSavedData(); 
    })
    .catch(() => { alert("เกิดข้อผิดพลาด"); btn.innerText = "บันทึกดวงนี้ลงฐานข้อมูล"; btn.disabled = false; });
}

function fetchSavedData() {
    const select = document.getElementById('saved-profiles');
    fetch(API_URL).then(response => response.json()).then(data => {
        savedRecordsList = data;
        if (data.length === 0) { select.innerHTML = '<option value="">-- ยังไม่มีข้อมูลที่บันทึกไว้ --</option>'; return; }
        select.innerHTML = '<option value="">-- เลือกดวงที่บันทึกไว้ --</option>';
        data.forEach((record, index) => {
            const option = document.createElement('option');
            option.value = index; option.text = `${record.name || 'ไม่ระบุชื่อ'} (เกิด: ${record.birth_date})`;
            select.appendChild(option);
        });
    }).catch(error => { select.innerHTML = '<option value="">-- โหลดข้อมูลล้มเหลว --</option>'; });
}

function loadSavedData() {
    const select = document.getElementById('saved-profiles');
    if (select.value === "") return alert("กรุณาเลือกรายชื่อจากเมนูก่อนครับ");
    const record = savedRecordsList[select.value];
    document.getElementById('name').value = record.name; document.getElementById('gender').value = record.gender;
    document.getElementById('birth_date').value = record.birth_date; document.getElementById('birth_time').value = record.birth_time;
    calculateBaZi();
}

window.onload = function() { fetchSavedData(); };
