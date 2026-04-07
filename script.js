const API_URL = "https://script.google.com/macros/s/AKfycby-Jf7A-TSbwrvvJWxBdn4a8bDjPIw-MLzNN5Bp6NxVfImFstN7yf3kB75lLgO9jX_n/exec";
let currentBaZiData = {};

// 1. ฐานข้อมูลพื้นฐาน
const elementMap = {
    '甲': { type: 'wood', icon: '🌳' }, '乙': { type: 'wood', icon: '🌿' },
    '丙': { type: 'fire', icon: '☀️' }, '丁': { type: 'fire', icon: '🕯️' },
    '戊': { type: 'earth', icon: '⛰️' }, '己': { type: 'earth', icon: '🪴' },
    '庚': { type: 'metal', icon: '⚔️' }, '辛': { type: 'metal', icon: '💍' },
    '壬': { type: 'water', icon: '🌊' }, '癸': { type: 'water', icon: '🌧️' },
    '子': { type: 'water', icon: '🐀' }, '丑': { type: 'earth', icon: '🐂' },
    '寅': { type: 'wood', icon: '🐅' }, '卯': { type: 'wood', icon: '🐇' },
    '辰': { type: 'earth', icon: '🐉' }, '巳': { type: 'fire', icon: '🐍' },
    '午': { type: 'fire', icon: '🐎' }, '未': { type: 'earth', icon: '🐐' },
    '申': { type: 'metal', icon: '🐒' }, '酉': { type: 'metal', icon: '🐓' },
    '戌': { type: 'earth', icon: '🐕' }, '亥': { type: 'water', icon: '🐖' }
};

const shiShenMap = {
    '比肩': 'ผี่เจียง (เพื่อน/พึ่งพาตนเอง)', '劫财': 'เกียบไช้ (แย่งชิง/คู่แข่ง)',
    '食神': 'เจียะซิ้ง (ผลงาน/ความสุข)', '伤官': 'ซังกัว (แสดงออก/ต่อต้าน)',
    '偏财': 'เพียงไช้ (ลาภลอย/ธุรกิจ)', '正财': 'เจี้ยไช้ (โชคลาภ/ทรัพย์สิน)',
    '七杀': 'ชิกสัวะ (อำนาจ/กล้าเสี่ยง)', '正官': 'เจี้ยกัว (ขุนนาง/ระเบียบ)',
    '偏印': 'เพียงอิ่ง (อุปถัมภ์รอง/สัมผัสที่หก)', '正印': 'เจี้ยอิ่ง (อุปถัมภ์หลัก/การศึกษา)'
};

const pillarContextMap = {
    'year': 'เสาปี (บรรพบุรุษ/อายุ 0-15)', 'month': 'เสาเดือน (พ่อแม่/การงาน/อายุ 16-30)',
    'day': 'เสาวัน (ตนเองและคู่ครอง/อายุ 31-45)', 'hour': 'เสายาม (บุตรหลาน/บั้นปลาย/อายุ 46+)'
};
const pillarNamesTh = { 'year': 'ปี', 'month': 'เดือน', 'day': 'วัน', 'hour': 'ยาม' };

const interactions = {
    heavenlyCombos: { '甲':'己', '己':'甲', '乙':'庚', '庚':'乙', '丙':'辛', '辛':'丙', '丁':'壬', '壬':'丁', '戊':'癸', '癸':'戊' },
    heavenlyClashes: { '甲':'庚', '庚':'甲', '乙':'辛', '辛':'乙', '丙':'壬', '壬':'丙', '丁':'癸', '癸':'丁' },
    earthlyCombos: { '子':'丑', '丑':'子', '寅':'亥', '亥':'寅', '卯':'戌', '戌':'卯', '辰':'酉', '酉':'辰', '巳':'申', '申':'巳', '午':'未', '未':'午' },
    earthlyClashes: { '子':'午', '午':'子', '丑':'未', '未':'丑', '寅':'申', '申':'寅', '卯':'酉', '酉':'卯', '辰':'戌', '戌':'辰', '巳':'亥', '亥':'巳' }
};

const sanHeGroups = [
    { elements: ['申', '子', '辰'], name: 'ธาตุน้ำ' },
    { elements: ['亥', '卯', '未'], name: 'ธาตุไม้' },
    { elements: ['寅', '午', '戌'], name: 'ธาตุไฟ' },
    { elements: ['巳', '酉', '丑'], name: 'ธาตุทอง' }
];

function checkSpecialStars(branch, dayGan, yearZhi, dayZhi) {
    let stars = [];
    const nobleMap = { '甲':['丑','未'], '戊':['丑','未'], '庚':['丑','未'], '乙':['子','申'], '己':['子','申'], '丙':['亥','酉'], '丁':['亥','酉'], '壬':['卯','巳'], '癸':['卯','巳'], '辛':['寅','午'] };
    if (nobleMap[dayGan] && nobleMap[dayGan].includes(branch)) stars.push({name: '🌟 ดาวอุปถัมภ์', desc: 'มีคนช่วยเหลือสนับสนุน แคล้วคลาดปลอดภัย'});

    const peachMap = { '申':'酉', '子':'酉', '辰':'酉', '亥':'子', '卯':'子', '未':'子', '寅':'卯', '午':'卯', '戌':'卯', '巳':'午', '酉':'午', '丑':'午' };
    if (peachMap[yearZhi] === branch || peachMap[dayZhi] === branch) stars.push({name: '🌸 ดาวดอกท้อ', desc: 'มีเสน่ห์ดึงดูด เป็นที่รักและเมตตา'});

    const horseMap = { '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' };
    if (horseMap[yearZhi] === branch || horseMap[dayZhi] === branch) stars.push({name: '🐎 ดาวม้าเดินทาง', desc: 'ชีพจรลงเท้า โยกย้าย เปลี่ยนแปลง'});

    const luMap = { '甲':'寅', '乙':'卯', '丙':'午', '戊':'午', '丁':'巳', '己':'巳', '庚':'申', '辛':'酉', '壬':'亥', '癸':'子' };
    if (luMap[dayGan] === branch) stars.push({name: '💰 ดาวลู่เสิน', desc: 'ความอุดมสมบูรณ์ ทรัพย์สินมั่นคง'});

    const wenMap = { '甲':'巳', '乙':'午', '丙':'申', '戊':'申', '丁':'酉', '己':'酉', '庚':'亥', '辛':'子', '壬':'寅', '癸':'卯' };
    if (wenMap[dayGan] === branch) stars.push({name: '📚 ดาวเหวินชาง', desc: 'สติปัญญาเลิศ เรียนเก่ง หัวไว'});

    const jiangMap = { '申':'子', '子':'子', '辰':'子', '亥':'卯', '卯':'卯', '未':'卯', '寅':'午', '午':'午', '戌':'午', '巳':'酉', '酉':'酉', '丑':'酉' };
    if (jiangMap[yearZhi] === branch || jiangMap[dayZhi] === branch) stars.push({name: '🎖️ ดาวแม่ทัพ', desc: 'มีความเป็นผู้นำสูง การงานโดดเด่น'});

    const yangRenMap = { '甲':'卯', '丙':'午', '戊':'午', '庚':'酉', '壬':'子' };
    if (yangRenMap[dayGan] === branch) stars.push({name: '⚔️ ดาวดาบแกะ', desc: 'อำนาจเด็ดขาด ใจร้อน (ระวังอุบัติเหตุ)'});

    const hongMap = { '子':'卯', '丑':'寅', '寅':'丑', '卯':'子', '辰':'亥', '巳':'戌', '午':'酉', '未':'申', '申':'未', '酉':'午', '戌':'巳', '亥':'辰' };
    if (hongMap[yearZhi] === branch) stars.push({name: '🦩 ดาวหงส์แดง', desc: 'เกณฑ์ดีเรื่องความรัก งานมงคล'});

    const guMap = { '亥':'寅', '子':'寅', '丑':'寅', '寅':'巳', '卯':'巳', '辰':'巳', '巳':'申', '午':'申', '未':'申', '申':'亥', '酉':'亥', '戌':'亥' };
    if (guMap[yearZhi] === branch) stars.push({name: '🥀 ดาวโดดเดี่ยว', desc: 'โลกส่วนตัวสูง ขี้เหงา อ้างว้าง'});

    return stars;
}

function renderBox(elementId, chineseChar) {
    const box = document.getElementById(elementId);
    const data = elementMap[chineseChar] || { type: '', icon: '' };
    box.classList.remove('wood', 'fire', 'earth', 'metal', 'water');
    box.innerHTML = `<span class="char">${chineseChar}</span><span class="icon">${data.icon}</span>`;
    if(data.type) box.classList.add(data.type);
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

    renderLuck(solar, genderInput === 'ชาย' ? 1 : 0);

    document.getElementById('bazi-result').style.display = "flex";
    document.getElementById('luck-sections').style.display = "block";
    document.getElementById('save-btn').style.display = "block";
}

function renderLuck(solar, genderNum) {
    const bazi = solar.getLunar().getEightChar();
    
    // วัยจร (Da Yun) แก้ไขคำสั่งให้ถูกต้องตามโครงสร้าง Library
    const yun = bazi.getYun(genderNum);
    const daYunList = yun.getDaYun();
    const daYunContainer = document.getElementById('da-yun-list');
    daYunContainer.innerHTML = '';

    daYunList.forEach(dy => {
        // ดึงค่าราศีบนและล่างจากวัยจร
        const ganZhi = dy.getGanZhi();
        const gan = ganZhi.charAt(0);
        const zhi = ganZhi.charAt(1);
        const startAge = dy.getStartAge();
        const startYear = dy.getStartYear();
        
        const pillarDiv = document.createElement('div');
        pillarDiv.className = 'luck-pillar';
        pillarDiv.innerHTML = `
            <div class="age-label">อายุ ${startAge}</div>
            <div class="box ${elementMap[gan] ? elementMap[gan].type : ''}">${gan}<br><small>${elementMap[gan] ? elementMap[gan].icon : ''}</small></div>
            <div class="box ${elementMap[zhi] ? elementMap[zhi].type : ''}">${zhi}<br><small>${elementMap[zhi] ? elementMap[zhi].icon : ''}</small></div>
            <div class="year-label">${startYear}</div>
        `;
        daYunContainer.appendChild(pillarDiv);
    });

    // ปีจร (10 ปีข้างหน้า)
    const currentYear = new Date().getFullYear();
    const liuNianContainer = document.getElementById('liu-nian-list');
    liuNianContainer.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const targetYear = currentYear + i;
        const lYear = Solar.fromYmd(targetYear, 1, 1).getLunar();
        const yGan = lYear.getYearGan();
        const yZhi = lYear.getYearZhi();

        const pillarDiv = document.createElement('div');
        pillarDiv.className = 'luck-pillar';
        pillarDiv.innerHTML = `
            <div class="age-label">${targetYear}</div>
            <div class="box ${elementMap[yGan] ? elementMap[yGan].type : ''}">${yGan}<br><small>${elementMap[yGan] ? elementMap[yGan].icon : ''}</small></div>
            <div class="box ${elementMap[yZhi] ? elementMap[yZhi].type : ''}">${yZhi}<br><small>${elementMap[yZhi] ? elementMap[yZhi].icon : ''}</small></div>
            <div class="year-label">ปี${lYear.getYearShengXiao()}</div>
        `;
        liuNianContainer.appendChild(pillarDiv);
    }
}

function showPopup(titleName, elementId) {
    const [pillar, level] = elementId.split('-');
    const pillarData = currentBaZiData[pillar];
    
    let htmlContent = `<h3>ตำแหน่ง: ${pillarContextMap[pillar]}</h3><hr style="margin: 10px 0; border: 0.5px solid #eee;">`;
    let relationHtml = ''; 
    let specialStarsHtml = '';
    
    const pillarsToCheck = ['year', 'month', 'day', 'hour'];
    const allBranchesInChart = pillarsToCheck.map(p => currentBaZiData[p].zhi);

    if (level === 'heaven') {
        const char = pillarData.gan;
        const shiShen = pillar === 'day' ? 'ดิถี (ธาตุประจำตัว)' : shiShenMap[pillarData.ganShiShen] || pillarData.ganShiShen;
        
        htmlContent += `<p><strong>ราศีบน:</strong> ${char} (${elementMap[char].icon})</p>`;
        htmlContent += `<p><strong>สิบเทพ:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShen}</span></p>`;

        pillarsToCheck.forEach(p => {
            if (p !== pillar) {
                const otherChar = currentBaZiData[p].gan;
                if (interactions.heavenlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ฟ้าฮะ:</strong> ดึงดูด/สนับสนุนกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.heavenlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ฟ้าชง:</strong> ขัดแย้งทางความคิดกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
            }
        });

    } else {
        const char = pillarData.zhi;
        const shiShenArray = pillarData.zhiShiShen.map(ss => shiShenMap[ss] || ss).join(', ');
        
        htmlContent += `<p><strong>ราศีล่าง (นักษัตร):</strong> ${char} (${elementMap[char].icon})</p>`;
        htmlContent += `<p><strong>ราศีแฝง:</strong> <span style="color:#d32f2f; font-weight:bold;">${shiShenArray}</span></p>`;

        pillarsToCheck.forEach(p => {
            if (p !== pillar) {
                const otherChar = currentBaZiData[p].zhi;
                if (interactions.earthlyCombos[char] === otherChar) relationHtml += `<p style="color:#2e7d32; font-size: 0.95em;">✅ <strong>ลักฮะ:</strong> ผูกพัน/ลับๆ กับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
                if (interactions.earthlyClashes[char] === otherChar) relationHtml += `<p style="color:#d32f2f; font-size: 0.95em;">⚠️ <strong>ลักชง:</strong> เปลี่ยนแปลง/แตกหักกับ เสา${pillarNamesTh[p]} (${otherChar})</p>`;
            }
        });

        sanHeGroups.forEach(group => {
            if (group.elements.includes(char)) {
                if (group.elements.every(el => allBranchesInChart.includes(el))) {
                    relationHtml += `<p style="color:#1565c0; font-size: 0.95em; font-weight:bold;">✨ <strong>ซาฮะ (ไตรภาคี):</strong> รวมพลังกลายเป็น [${group.name}] อย่างสมบูรณ์ในดวง!</p>`;
                }
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

    if (relationHtml !== '') {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffb300; border-radius: 4px;">`;
        htmlContent += `<p style="margin-bottom: 8px; font-weight: bold;">🔍 ปฏิสัมพันธ์ (Interactions):</p>${relationHtml}</div>`;
    }

    if (specialStarsHtml !== '') {
        htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;">`;
        htmlContent += `<p style="margin-bottom: 8px; font-weight: bold;">🔮 ดาวพิเศษ (Shen Sha):</p><ul style="padding-left: 20px; margin: 0;">${specialStarsHtml}</ul></div>`;
    }

    document.getElementById('popup-detail').innerHTML = htmlContent;
    document.getElementById('popup-title').innerText = `${titleName} : ${document.getElementById(elementId).querySelector('.char').innerText}`;
    document.getElementById('popup-modal').style.display = "flex";
}

function closePopup() { document.getElementById('popup-modal').style.display = "none"; }

function saveToGoogleSheets() {
    const payload = {
        name: document.getElementById('name').value || "ไม่ระบุชื่อ",
        gender: document.getElementById('gender').value,
        birth_date: document.getElementById('birth_date').value,
        birth_time: document.getElementById('birth_time').value,
        bazi_results: currentBaZiData,
        note: "ข้อมูลสมบูรณ์พร้อมวัยจรและปีจร"
    };
    const btn = document.getElementById('save-btn');
    btn.innerText = "กำลังบันทึก..."; btn.disabled = true;
    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(() => { alert("บันทึกสำเร็จ!"); btn.innerText = "บันทึกดวงนี้ลงฐานข้อมูล"; btn.disabled = false; })
    .catch(() => { alert("เกิดข้อผิดพลาด"); btn.innerText = "บันทึกดวงนี้ลงฐานข้อมูล"; btn.disabled = false; });
}