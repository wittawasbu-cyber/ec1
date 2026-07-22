// 1. ดึง Element ทั้งหมด
const nameListInput = document.getElementById('nameList');
const modeLuckyRadio = document.getElementById('modeLucky');
const modeGroupRadio = document.getElementById('modeGroup');
const groupCountWrapper = document.getElementById('groupCountWrapper');
const groupCountInput = document.getElementById('groupCount');
const actionBtn = document.getElementById('actionBtn');
const resultWrapper = document.getElementById('resultWrapper');

// 2. ดักจับ Event
modeLuckyRadio.addEventListener('change', toggleModeInputs);
modeGroupRadio.addEventListener('change', toggleModeInputs);
actionBtn.addEventListener('click', processRandomize);

// ป้องกันการพิมพ์จุด (.) สัญลักษณ์ e, +, - ในช่องจำนวนกลุ่ม
groupCountInput.addEventListener('keydown', (e) => {
    if (e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
        e.preventDefault();
    }
});

// 3. ฟังก์ชันสลับการแสดงผลช่องกรอกจำนวนกลุ่ม
function toggleModeInputs() {
    if (modeGroupRadio.checked) {
        groupCountWrapper.classList.remove('hidden');
    } else {
        groupCountWrapper.classList.add('hidden');
    }
}

// 4. ฟังก์ชันประมวลผลหลัก
function processRandomize() {
    // ดึงข้อมูลและตัดช่องว่าง
    const names = nameListInput.value
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');

    if (names.length === 0) {
        alert('กรุณากรอกรายชื่ออย่างน้อย 1 ชื่อ');
        return;
    }

    // ล้างผลลัพธ์เก่า
    resultWrapper.innerHTML = '';
    resultWrapper.classList.remove('hidden');

    if (modeLuckyRadio.checked) {
        // โหมดสุ่มผู้โชคดี 1 คน
        runLuckyDraw(names);
    } else {
        // โหมดแบ่งกลุ่ม (แปลงเป็นจำนวนเต็มเสมอด้วย parseInt)
        let numGroups = parseInt(groupCountInput.value, 10);

        if (isNaN(numGroups) || numGroups < 2) {
            alert('กรุณากรอกจำนวนกลุ่มเป็นจำนวนเต็มตั้งแต่ 2 ขึ้นไป');
            resultWrapper.classList.add('hidden');
            return;
        }

        if (numGroups > names.length) {
            alert(`จำนวนกลุ่ม (${numGroups}) มากกว่าจำนวนรายชื่อ (${names.length}) กรุณาปรับลดจำนวนกลุ่ม`);
            resultWrapper.classList.add('hidden');
            return;
        }

        runGroupDraw(names, numGroups);
    }
}

// 5. โหมดสุ่มคนเดียว
function runLuckyDraw(names) {
    const randomIndex = Math.floor(Math.random() * names.length);
    const luckyPerson = names[randomIndex];

    resultWrapper.innerHTML = `
        <h2>🎉 ผู้โชคดี ได้แก่:</h2>
        <p style="font-size: 1.3rem; font-weight: bold; color: #2c3e50; text-align: center;">${luckyPerson}</p>
    `;
}

// 6. โหมดแบ่งกลุ่ม (Fisher-Yates Shuffle)
function runGroupDraw(names, numGroups) {
    const shuffledNames = [...names];

    // สลับลำดับรายชื่อแบบสุ่ม
    for (let i = shuffledNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    // สร้างอาร์เรย์สำหรับแต่ละกลุ่ม
    const groups = Array.from({ length: numGroups }, () => []);

    // แจกจ่ายรายชื่อลงกลุ่มตามลำดับวนซ้ำ
    shuffledNames.forEach((name, index) => {
        const groupIndex = index % numGroups;
        groups[groupIndex].push(name);
    });

    // แสดงผลบนหน้าเว็บ
    let htmlContent = '<h2>👥 ผลการแบ่งกลุ่ม:</h2>';
    groups.forEach((group, index) => {
        htmlContent += `
            <div class="group-item">
                <strong>กลุ่มที่ ${index + 1}:</strong> ${group.join(', ')}
            </div>
        `;
    });

    resultWrapper.innerHTML = htmlContent;
}