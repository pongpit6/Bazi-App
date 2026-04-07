const API_URL = "https://script.google.com/macros/s/AKfycby-Jf7A-TSbwrvvJWxBdn4a8bDjPIw-MLzNN5Bp6NxVfImFstN7yf3kB75lLgO9jX_n/exec";
let currentBaZiData = {};
let currentTimeData = {}; 
let activeDaYunData = {}; 
let activeLiuNianData = {}; 
let dmStrengthData = {}; // 🌟 ตัวแปรใหม่สำหรับเก็บค่าความแข็งแรงดิถีส่งให้ AI 🌟
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

    // 🌟 จัดเก็บข้อมูลความแข็งแรงดิถีลงตัวแปร Global เพื่อเตรียมส่งให้ AI 🌟
    dmStrengthData = {
        score: score,
        status: score >= 50 ? "แข็งแรง (Strong)" : "อ่อนแอ (Weak)",
        favorable: score >= 50 ? weakeningTh : supportingTh,
        unfavorable: score >= 50 ? supportingTh : weakeningTh
    };

    const dmBox = document.getElementById('dm-strength-box');
    let dmHtml = `<div class="dm-strength-title">กำลังของดิถี (Day Master Strength)</div>`;
    dmHtml += `<p style="font-size:15px;">ดิถี (ตัวคุณ) คือ <strong>${elementMap[dm].thName}</strong> (ธาตุ${thTypeMap[dmType]})</p>`;
    
    if (score >= 50) {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-strong">💪 ดิถีแข็งแรง (Strong)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0; font-size:13.5px; line-height: 1.6;">`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>เหตุผลที่แข็งแรง:</strong> เพราะในดวงมีธาตุที่ส่งเสริมคุณอยู่มาก โดยเฉพาะ <strong>${supportingElements[0]}</strong></p>`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>✅ ธาตุให้คุณ (ปรับสมดุล):</strong> ควรระบายหรือควบคุมพลังงานออก ธาตุที่ให้คุณคือ <strong>ธาตุ${weakeningTh}</strong></p>`;
        dmHtml += `<p><strong>❌ ธาตุให้โทษ:</strong> ควรหลีกเลี่ยง <strong>ธาตุ${supportingTh}</strong> เพราะจะทำให้ดิถีแข็งกร้าวเกินไป</p>`;
        dmHtml += `</div>`;
    } else {
        dmHtml += `<p style="margin-top: 10px;">ผลการประเมิน: <span class="dm-weak">🍃 ดิถีอ่อนแอ (Weak)</span> (คะแนน ${score}/100)</p>`;
        dmHtml += `<div style="text-align:left; background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #e0e0e0; font-size:13.5px; line-height: 1.6;">`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>เหตุผลที่อ่อนแอ:</strong> เพราะในดวงมีธาตุที่บั่นทอนพลังงานคุณมาก (โดยเฉพาะ <strong>${weakeningElements[0]}</strong>)</p>`;
        dmHtml += `<p style="margin-bottom: 8px;"><strong>✅ ธาตุให้คุณ (ปรับสมดุล):</strong> ควรเสริมกำลังและอุปถัมภ์ดิถี ธาตุที่ให้คุณคือ <strong>ธาตุ${supportingTh}</strong></p>`;
        dmHtml += `<p><strong>❌ ธาตุให้โทษ:</strong> ควรหลีกเลี่ยง <strong>ธาตุ${weakeningTh}</strong> เพราะจะยิ่งมาบั่นทอนกำลังของคุณให้หมดไป</p>`;
        dmHtml += `</div>`;
    }

    dmBox.innerHTML = dmHtml;
    dmBox.style.display = "block";
}

function getAdviceText(type, context) {
    if (type === 'ฮะ') return `<div class="advice-box advice-good"><strong>คำแนะนำ (ฮะ - ภาคี):</strong> ช่วงเวลานี้จะมีความราบรื่น ได้รับความช่วยเหลือ เกิดความร่วมมือหรือพบเจอคนถูกใจในเรื่องที่เกี่ยวข้องกับ${context}</div>`;
    if (type === 'ชง') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (ชง - ปะทะ):</strong> ระวังการเปลี่ยนแปลงกะทันหัน อุบัติเหตุ หรือความขัดแย้งรุนแรงในเรื่องที่เกี่ยวกับ${context} ควรมีสติและไม่ประมาท</div>`;
    if (type === 'เฮ้ง') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (เฮ้ง - เบียดเบียน):</strong> อาจเกิดความอึดอัดใจ ความวุ่นวาย กดดัน หรือปัญหาคดีความเอกสารที่เกี่ยวกับ${context}</div>`;
    if (type === 'ไห่') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (ไห่ - ให้ร้าย):</strong> ระวังการถูกแทงข้างหลัง ถูกนินทา หรือปัญหาสุขภาพที่มาจาก${context}</div>`;
    if (type === 'ผั่ว') return `<div class="advice-box advice-bad"><strong>คำแนะนำ (ผั่ว - แตกหัก):</strong> สิ่งที่หวังไว้อาจพังทลาย ต้องเริ่มต้นใหม่ หรือมีความเสียหายเกิดขึ้นกับ${context}</div>`;
    return "";
}

function getInteractionHTML(gan, zhi) {
    let res = [];
    if (interactions.heavenlyCombos[gan] === currentBaZiData.day.gan) res.push(`<div class="interact-good">✨ ฟ้าฮะดิถี</div>`);

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

function renderCurrentTimeBaZi() {
    const now = new Date();
    const currentSolar = Solar.fromDate(now);
    const currentLunar = currentSolar.getLunar();
    const currentBaZiObj = currentLunar.getEightChar();

    currentTimeData = {
        year: { gan: currentBaZiObj.getYearGan(), zhi: currentBaZiObj.getYearZhi() },
        month: { gan: currentBaZiObj.getMonthGan(), zhi: currentBaZiObj.getMonthZhi() },
        day: { gan: currentBaZiObj.getDayGan(), zhi: currentBaZiObj.getDayZhi() },
        hour: { gan: currentBaZiObj.getTimeGan(), zhi: currentBaZiObj.getTimeZhi() }
    };

    ['year', 'month', 'day', 'hour'].forEach(p => {
        renderBox(`curr-${p}-heaven`, currentTimeData[p].gan);
        renderBox(`curr-${p}-earth`, currentTimeData[p].zhi);
    });
}

function calculateBaZi() {
    const dateInput = document.getElementById('birth_date').value;
    const timeInput = document.getElementById('birth_time').value;
    const genderInput = document.getElementById('gender').value;
    
    if (!dateInput || !timeInput) return alert("กรุณากรอกวันที่และเวลาเกิดให้ครบถ้วนครับ");

    renderCurrentTimeBaZi();

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

    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - parseInt(y);
    const yun = bazi.getYun(genderInput === 'ชาย' ? 1 : 0);
    const daYunList = yun.getDaYun();
    
    let activeDY = daYunList[0];
    daYunList.forEach(dy => { if (currentAge >= dy.getStartAge()) activeDY = dy; });
    activeDaYunData = { gan: activeDY.getGanZhi().charAt(0), zhi: activeDY.getGanZhi().charAt(1), startAge: activeDY.getStartAge() };

    const currentLYear = Solar.fromYmd(currentYear, 6, 1).getLunar();
    activeLiuNianData = { gan: currentLYear.getYearGan(), zhi: currentLYear.getYearZhi(), year: currentYear };

    calculateDMStrength(); 
    renderLuck(solar, genderInput === 'ชาย' ? 1 : 0);

    document.getElementById('natal-bazi-section').style.display = "block";
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
        const gan = dy.getGanZhi().charAt(0); const zhi = dy.getGanZhi().charAt(1);
        const interactionHtml = getInteractionHTML(gan, zhi); 
        daYunContainer.innerHTML += `<div class="luck-pillar"><div class="age-label">อายุ ${dy.getStartAge()}</div><div class="box ${elementMap[gan]?.type}">${getBoxInnerHtml(gan)}</div><div class="box ${elementMap[zhi]?.type}">${getBoxInnerHtml(zhi)}</div><div class="year-label">${dy.getStartYear()}</div>${interactionHtml}</div>`;
    });

    const currentYear = new Date().getFullYear();
    const liuNianContainer = document.getElementById('liu-nian-list');
    liuNianContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const tYear = currentYear + i;
        const lYear = Solar.fromYmd(tYear, 6, 1).getLunar();
        const yGan = lYear.getYearGan(); const yZhi = lYear.getYearZhi();
        const interactionHtml = getInteractionHTML(yGan, yZhi); 
        liuNianContainer.innerHTML += `<div class="luck-pillar"><div class="age-label">${tYear}</div><div class="box ${elementMap[yGan]?.type}">${getBoxInnerHtml(yGan)}</div><div class="box ${elementMap[yZhi]?.type}">${getBoxInnerHtml(yZhi)}</div><div class="year-label">ปี${lYear.getYearShengXiao()}</div>${interactionHtml}</div>`;
    }
}

function showPopup(titleName, elementId, type) {
    const [pillar, level] = elementId.split('-');
    const sourceData = type === 'natal' ? currentBaZiData : currentTimeData;
    const pillarData = sourceData[pillar];
    const contextMap = { 'year': 'ผู้ใหญ่/บรรพบุรุษ/ภาพลักษณ์', 'month': 'พ่อแม่/พี่น้อง/การงาน', 'day': 'คู่ครอง/เรื่องส่วนตัว', 'hour': 'บุตรบริวาร/บั้นปลายชีวิต/การลงทุน' };
    const myContext = contextMap[pillar];
    
    let htmlContent = `<h3>ตำแหน่ง: เสา${pillarNamesTh[pillar]} ${type === 'natal' ? `(${myContext})` : '(ปัจจุบัน)'}</h3><hr style="margin: 10px 0; border: 0.5px solid #eee;">`;
    let relationHtml = ''; let specialStarsHtml = '';
    const pillarsToCheck = ['year', 'month', 'day', 'hour'];

    if (level === 'heaven') {
        const char = pillarData.gan;
        htmlContent += `<p><strong>ราศีบน:</strong> ${char} (${elementMap[char].thName})</p>`;
        
        if(type === 'natal') {
            const shiShen = pillar === 'day' ? 'ดิถี (ธาตุประจำตัว)' : shiShenMap[pillarData.ganShiShen] || pillarData.ganShiShen;
            htmlContent += `<p><strong>สิบเทพ:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShen}</span></p>`;
            
            pillarsToCheck.forEach(p => {
                if (p !== pillar) {
                    const otherChar = currentBaZiData[p].gan;
                    if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ฟ้าฮะ:</strong> สนับสนุนกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                    if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ฟ้าชง:</strong> ขัดแย้งกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                }
            });
            
            if (interactions.heavenlyCombos[char] === activeDaYunData.gan) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ วัยจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', myContext);
            if (interactions.heavenlyClashes[char] === activeDaYunData.gan) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 วัยจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', myContext);
            if (interactions.heavenlyCombos[char] === activeLiuNianData.gan) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ ปีจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', myContext);
            if (interactions.heavenlyClashes[char] === activeLiuNianData.gan) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 ปีจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', myContext);
        } else {
            if (Object.keys(currentBaZiData).length > 0) {
                htmlContent += `<p style="color:#555; font-size: 14px; margin-top: 10px;">⚡ <strong>ผลกระทบกับดวงชะตา ณ เวลานี้:</strong></p>`;
                pillarsToCheck.forEach(p => {
                    const otherChar = currentBaZiData[p].gan;
                    if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✨ เวลานี้เข้ามา <strong>ฮะ</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ฮะ', contextMap[p]);
                    if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>ชง</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ชง', contextMap[p]);
                });
            } else {
                htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">กรุณาคำนวณผูกดวงก่อน เพื่อดูว่าเวลานี้ส่งผลกระทบอย่างไรกับดวงชะตาของคุณครับ</p></div>`;
            }
        }
    } else {
        const char = pillarData.zhi;
        htmlContent += `<p><strong>ราศีล่าง:</strong> ${char} (${elementMap[char].thName})</p>`;

        if(type === 'natal') {
            const shiShenArray = pillarData.zhiShiShen.map(ss => shiShenMap[ss] || ss).join(', ');
            htmlContent += `<p><strong>ราศีแฝง:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShenArray}</span></p>`;

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
            if (interactions.earthlyCombos[char] === dyZhi) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ วัยจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', myContext);
            if (interactions.earthlyClashes[char] === dyZhi) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 วัยจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', myContext);
            if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(dyZhi)) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 วัยจรปัจจุบัน เข้ามาเฮ้ง</p>` + getAdviceText('เฮ้ง', myContext);
            if (interactions.earthlyHarms[char] === dyZhi) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 วัยจรปัจจุบัน เข้ามาไห่</p>` + getAdviceText('ไห่', myContext);
            
            let lnZhi = activeLiuNianData.zhi;
            if (interactions.earthlyCombos[char] === lnZhi) relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ ปีจรปัจจุบัน เข้ามาฮะ</p>` + getAdviceText('ฮะ', myContext);
            if (interactions.earthlyClashes[char] === lnZhi) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 ปีจรปัจจุบัน เข้ามาชง</p>` + getAdviceText('ชง', myContext);
            if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(lnZhi)) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 ปีจรปัจจุบัน เข้ามาเฮ้ง</p>` + getAdviceText('เฮ้ง', myContext);
            if (interactions.earthlyHarms[char] === lnZhi) relationHtml += `<p style="color:#b71c1c; font-size: 0.95em; font-weight:bold;">🚨 ปีจรปัจจุบัน เข้ามาไห่</p>` + getAdviceText('ไห่', myContext);

            const foundStars = checkSpecialStars(char, currentBaZiData.day.gan, currentBaZiData.year.zhi, currentBaZiData.day.zhi);
            if (foundStars.length > 0) {
                foundStars.forEach(star => { specialStarsHtml += `<li style="margin-bottom: 5px;"><strong>${star.name}</strong><br><span style="font-size: 0.85em; color: #555;">${star.desc}</span></li>`; });
            }
        } else {
            if (Object.keys(currentBaZiData).length > 0) {
                htmlContent += `<p style="color:#555; font-size: 14px; margin-top: 10px;">⚡ <strong>ผลกระทบกับดวงชะตา ณ เวลานี้:</strong></p>`;
                pillarsToCheck.forEach(p => {
                    const otherChar = currentBaZiData[p].zhi;
                    if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✨ เวลานี้เข้ามา <strong>ฮะ</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ฮะ', contextMap[p]);
                    if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>ชง</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ชง', contextMap[p]);
                    if (interactions.earthlyPunishments[char] && interactions.earthlyPunishments[char].includes(otherChar)) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>เฮ้ง</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('เฮ้ง', contextMap[p]);
                    if (interactions.earthlyHarms[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>ไห่</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ไห่', contextMap[p]);
                    if (interactions.earthlyDestructions[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">🚨 เวลานี้เข้ามา <strong>ผั่ว</strong> กับ เสา${pillarNamesTh[p]} กำเนิด</p>` + getAdviceText('ผั่ว', contextMap[p]);
                });
            } else {
                htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">กรุณาคำนวณผูกดวงก่อน เพื่อดูว่าเวลานี้ส่งผลกระทบอย่างไรกับดวงชะตาของคุณครับ</p></div>`;
            }
        }
    }

    if (relationHtml !== '') {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffb300; border-radius: 4px;"><p style="margin-bottom: 8px; font-weight: bold;">🔍 ปฏิสัมพันธ์ (Interactions):</p>${relationHtml}</div>`;
    } else if (type === 'current' && Object.keys(currentBaZiData).length > 0) {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;"><p style="text-align:center; color:#888;">เวลาปัจจุบันไม่ได้ปะทะหรือส่งผลพิเศษกับเสาใดในดวงชะตากำเนิดครับ</p></div>`;
    }

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

    // 🌟 แนบข้อมูลความแข็งแรงดิถี วัยจร และปีจร ไปใน Payload ด้วย 🌟
    const payload = {
        action: "analyze",
        personal_info: { name: document.getElementById('name').value || "ไม่ระบุ", gender: document.getElementById('gender').value, birth_date: document.getElementById('birth_date').value, birth_time: document.getElementById('birth_time').value },
        bazi_results: currentBaZiData,
        dm_strength: dmStrengthData,
        da_yun: activeDaYunData,
        liu_nian: activeLiuNianData
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

window.onload = function() { 
    fetchSavedData(); 
    renderCurrentTimeBaZi();
};
