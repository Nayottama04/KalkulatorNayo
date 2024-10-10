let currentInput = '';
let operator = '';
let firstNumber = null;
let secondNumber = null;

function resetScreen() {
    currentInput = '';
    operator = '';
    firstNumber = null; // Reset firstNumber
    secondNumber = null; // Reset secondNumber
    document.getElementById('result').innerText = '0';
}

function clearEntry() {
    currentInput = ''; // Kosongkan input
    operator = ''; // Kosongkan operator
    firstNumber = null; // Reset firstNumber
    secondNumber = null; // Reset secondNumber
    updateDisplay(); // Memperbarui tampilan
}

function updateDisplay() {
    document.getElementById('result').innerText = currentInput || '0'; // Menampilkan 0 jika tidak ada input
}

function appendNumber(number) {
    if (currentInput === '0') {
        currentInput = number.toString(); // Mengganti '0' dengan angka yang dimasukkan
    } else {
        currentInput += number.toString(); // Menambahkan angka ke input
    }
    updateDisplay();
}

function appendDot() {
    if (!currentInput.includes('.')) {
        currentInput += '.'; // Menambahkan titik jika belum ada
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentInput === '') return; // Menghindari operasi jika input kosong

    if (firstNumber === null) {
        firstNumber = parseFloat(currentInput); // Menyimpan angka pertama
    } else {
        secondNumber = parseFloat(currentInput);
        compute(); // Menghitung hasil jika operator dipilih lagi
    }

    operator = op; // Menyimpan operator yang dipilih
    currentInput = ''; // Mengosongkan input untuk angka kedua
}

function compute() {
    if (firstNumber === null || currentInput === '') return; // Menghindari kalkulasi jika tidak lengkap

    secondNumber = parseFloat(currentInput); // Mengambil angka kedua
    let result;

    switch (operator) {
        case '+':
            result = firstNumber + secondNumber;
            break;
        case '-':
            result = firstNumber - secondNumber;
            break;
        case '*':
            result = firstNumber * secondNumber;
            break;
        case '/':
            result = firstNumber / secondNumber;
            break;
        case '%':
            result = (firstNumber * secondNumber) / 100;
            break;
        default:
            return;
    }

    // Menyimpan riwayat perhitungan
    addHistoryEntry(firstNumber, operator, secondNumber, result);

    currentInput = result.toString(); // Mengubah hasil menjadi string untuk tampilan
    firstNumber = result; // Menetapkan hasil sebagai angka pertama untuk operasi berikutnya
    operator = ''; // Mengosongkan operator
    updateDisplay(); // Memperbarui tampilan
}

function addHistoryEntry(first, operator, second, result) {
    const tableBody = document.querySelector('#historyTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${first}</td>
        <td>${operator}</td>
        <td>${second}</td>
        <td>${result}</td>
        <td><button class="delete-btn" onclick="deleteHistory(this)">Delete</button></td>
    `;

    tableBody.appendChild(newRow);
    saveHistory(first, operator, second, result);
}

function saveHistory(first, operator, second, result) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ first, operator, second, result });
    localStorage.setItem('history', JSON.stringify(history));
}

function deleteHistory(button) {
    const row = button.closest('tr');
    const first = row.cells[0].innerText;
    const operator = row.cells[1].innerText;
    const second = row.cells[2].innerText;
    const result = row.cells[3].innerText;

    // Hapus baris dari tampilan
    row.remove();

    // Hapus dari local storage
    let history = JSON.parse(localStorage.getItem('history')) || [];
    
    // Debug log sebelum penghapusan
    console.log('Sebelum penghapusan:', history);
    
    history = history.filter(entry => {
        return !(entry.first == first && entry.operator == operator && entry.second == second && entry.result == result);
    });
    
    // Debug log setelah penghapusan
    console.log('Setelah penghapusan:', history);
    
    localStorage.setItem('history', JSON.stringify(history)); // Simpan riwayat yang tersisa
}

function changeSign() {
    if (currentInput) {
        currentInput = (parseFloat(currentInput) * -1).toString(); // Mengubah tanda angka
        updateDisplay();
    }
}

// Memuat riwayat dari local storage saat halaman dimuat
window.onload = function() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(entry => {
        addHistoryEntry(entry.first, entry.operator, entry.second, entry.result);
    });
}

// Fungsi untuk mengganti mode gelap/terang
const modeToggle = document.getElementById('modeToggle');

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode'); // Mengganti class body
    if (document.body.classList.contains('light-mode')) {
        modeToggle.innerHTML = '🌙'; // Ikon bulan untuk mode gelap
        localStorage.setItem('mode', 'light'); // Simpan mode ke localStorage
    } else {
        modeToggle.innerHTML = '☀️'; // Ikon matahari untuk mode terang
        localStorage.setItem('mode', 'dark'); // Simpan mode ke localStorage
    }
});

// Memeriksa mode yang disimpan saat halaman dimuat
window.onload = () => {
    const mode = localStorage.getItem('mode');
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        modeToggle.innerHTML = '🌙'; // Ikon bulan untuk mode gelap
    } else {
        modeToggle.innerHTML = '☀️'; // Ikon matahari untuk mode terang
    }
};

