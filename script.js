// script.js
document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.querySelector("#workHoursTable tbody");
    const calculateTotalHoursBtn = document.getElementById("calculateTotalHoursBtn");
    const totalHoursDisplay = document.getElementById("totalHours");

    // إنشاء الصفوف للجدول
    for (let i = 1; i <= 31; i++) {
        const row = document.createElement("tr");

        const dayCell = document.createElement("td");
        dayCell.textContent = `اليوم ${i}`;
        row.appendChild(dayCell);

        const checkInCell = document.createElement("td");
        const checkInInput = document.createElement("input");
        checkInInput.type = "time";
        checkInCell.appendChild(checkInInput);
        row.appendChild(checkInCell);

        const checkOutCell = document.createElement("td");
        const checkOutInput = document.createElement("input");
        checkOutInput.type = "time";
        checkOutCell.appendChild(checkOutInput);
        row.appendChild(checkOutCell);

        const hoursCell = document.createElement("td");
        hoursCell.textContent = "0";
        row.appendChild(hoursCell);

        tableBody.appendChild(row);

        // حساب ساعات العمل اليومية
        [checkInInput, checkOutInput].forEach(input => {
            input.addEventListener("change", () => {
                const checkInTime = checkInInput.value;
                const checkOutTime = checkOutInput.value;
                if (checkInTime && checkOutTime) {
                    const hoursWorked = calculateHours(checkInTime, checkOutTime);
                    hoursCell.textContent = hoursWorked;
                    saveData();
                }
            });
        });
    }

    // حساب مجموع الساعات
    calculateTotalHoursBtn.addEventListener("click", () => {
        let totalHours = 0;
        document.querySelectorAll("#workHoursTable tbody tr").forEach(row => {
            const dailyHours = parseFloat(row.children[3].textContent);
            totalHours += dailyHours;
        });
        totalHoursDisplay.textContent = `مجموع الساعات لشهر كامل: ${totalHours}`;
        saveData();
    });

    // حساب ساعات العمل بين وقتين
    function calculateHours(checkIn, checkOut) {
        const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
        const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

        const checkInTime = new Date(0, 0, 0, checkInHours, checkInMinutes, 0);
        const checkOutTime = new Date(0, 0, 0, checkOutHours, checkOutMinutes, 0);

        const diff = checkOutTime - checkInTime;
        const hours = diff / (1000 * 60 * 60);

        return hours >= 0 ? hours : 24 + hours; // يعالج الحالات التي يكون فيها الانصراف بعد منتصف الليل
    }

    // حفظ البيانات في Local Storage
    function saveData() {
        const data = [];
        document.querySelectorAll("#workHoursTable tbody tr").forEach(row => {
            const day = row.children[0].textContent;
            const checkIn = row.children[1].children[0].value;
            const checkOut = row.children[2].children[0].value;
            const hours = row.children[3].textContent;
            data.push({ day, checkIn, checkOut, hours });
        });
        localStorage.setItem("workHoursData", JSON.stringify(data));
    }

    // تحميل البيانات من Local Storage
    function loadData() {
        const data = JSON.parse(localStorage.getItem("workHoursData"));
        if (data) {
            data.forEach((row, index) => {
                const tableRow = tableBody.children[index];
                tableRow.children[1].children[0].value = row.checkIn;
                tableRow.children[2].children[0].value = row.checkOut;
                tableRow.children[3].textContent = row.hours;
            });
        }
    }

    loadData();
});
