// 1. อ้างอิง DOM Elements
const nameListInput = document.getElementById('nameList');
const modeLuckyRadio = document.getElementById('modeLucky');
const modeGroupRadio = document.getElementById('modeGroup');
const groupCountWrapper = document.getElementById('groupCountWrapper');
const groupCountInput = document.getElementById('groupCount');
const actionBtn = document.getElementById('actionBtn');
const resultWrapper = document.getElementById('resultWrapper');

// 2. ผูก Event Listeners ดักจับการเปลี่ยนโหมดเปิด/ปิดกล่องกรอกจำนวนกลุ่ม
modeLuckyRadio.addEventListener('change', toggleModeInputs);
modeGroupRadio.addEventListener('change', toggleModeInputs);
actionBtn.addEventListener('click', processRandomize);

function toggleModeInputs() {
    if (modeGroupRadio.checked) {
        groupCountWrapper.classList.remove('hidden');
    } else {
        groupCountWrapper.classList.add('hidden');
    }
}

// 3. ฟังก์ชันหลักเมื่อกดปุ่มสุ่ม
function processRandomize() {
    // ดึงค่ารายชื่อ ตัดเว้นวรรค และแยกด้วยบรรทัดใหม่ (.split)
    // .filter(name => name.trim() !== '') ใช้กรองเอาบรรทัดว่างๆ ออกไป
    const names = nameListInput.value.split('\n').map(name => name.trim()).filter(name => name !== '');

    // Validation ตรวจสอบความพร้อมของข้อมูล
    if (names.length === 0) {
        showError('⚠️ กรุณากรอกรายชื่ออย่างน้อย 1 ชื่อ');
        return;
    }

    if (modeLuckyRadio.checked) {
        // --- โหมดสุ่มผู้โชคดี 1 คน ---
        const randomIndex = Math.floor(Math.random() * names.length);
        const luckyPerson = names[randomIndex];
        
        resultWrapper.innerHTML = `
            <h3 class="lucky-title">🎯 ผู้โชคดีคือ </h3>
            <p style="text-align: center; font-size: 24px; font-weight: bold; margin-top: 10px; color: #2c3e50;">
                🎉 ${luckyPerson} 🎉
            </p>
        `;
    } else {
        // --- โหมดแบ่งกลุ่ม ---
        const numGroups = Number(groupCountInput.value);
        
        if (numGroups <= 0 || numGroups > names.length) {
            showError('⚠️ จำนวนกลุ่มต้องมากกว่า 0 และไม่เกินจำนวนรายชื่อที่มี');
            return;
        }

        // ใช้อัลกอริทึม Fisher-Yates Shuffle ในการสลับรายชื่อให้สุ่มแบบทั่วถึง
        const shuffledNames = [...names];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }

        // สร้าง Array เปล่าสำหรับเตรียมใส่ชื่อในแต่ละกลุ่ม เช่น [[], [], []]
        const groups = Array.from({ length: numGroups }, () => []);
        
        // แจกจ่ายรายชื่อที่สลับแล้วลงกลุ่มวนไปเรื่อยๆ
        shuffledNames.forEach((name, index) => {
            const groupIndex = index % numGroups;
            groups[groupIndex].push(name);
        });

        // แสดงผลลัพธ์ด้วย Template Literal
        let htmlResult = `<h3>👥 ผลการแบ่งกลุ่ม (${numGroups} กลุ่ม):</h3><br>`;
        groups.forEach((group, index) => {
            htmlResult += `
                <div class="group-card">
                    <strong>กลุ่มที่ ${index + 1}:</strong> ${group.join(', ')}
                </div>
            `;
        });
        resultWrapper.innerHTML = htmlResult;
    }

    resultWrapper.classList.remove('hidden');
}

function showError(message) {
    resultWrapper.innerHTML = `<span style="color: #e74c3c; font-weight: bold;">${message}</span>`;
    resultWrapper.classList.remove('hidden');
}