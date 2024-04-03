const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const incomeBtn = document.querySelector('.btn-income');
const egressBtn = document.querySelector('.btn-egress');

const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];



// Event listener for income button
incomeBtn.addEventListener('click', addIncomeTransaction);

// Event listener for egress button
egressBtn.addEventListener('click', addEgressTransaction);

// Function to add income transaction
function addIncomeTransaction(e) {
    e.preventDefault();

    addTransaction(true);
}

// Function to add egress transaction
function addEgressTransaction(e) {
    e.preventDefault();

    addTransaction(false);
}

// Add transaction
function addTransaction(isIncome) {
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: isIncome ? +parseFloat(amount.value.replace(/\./g, '').replace(',', '.')) : -parseFloat(amount.value.replace(/\./g, '').replace(',', '.'))
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}


// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount
    )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id
        })">x</button>
  `;

    list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `$${parseFloat(total).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    money_plus.innerText = `$${parseFloat(income).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    money_minus.innerText = `$${parseFloat(expense).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

//decimales en input
function formatoNumero(input) {
    // Obtener el valor actual del input
    let valor = input.value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    // Formatear el número
    valor = formatearNumero(valor);

    // Agregar el signo menos si el número es negativo
    if (input.value.includes('-')) {
        valor = '-' + valor;
    }

    // Asignar el valor formateado al input
    input.value = valor;
}


function formatearNumero(amount) {
    // Si el número es mayor o igual a 1000, formatearlo con separadores de miles
    if (parseInt(amount) >= 1000) {
        let numero = parseInt(amount); // Convertir a número
        return numero.toLocaleString('es-CO'); // Utilizar formato de separadores de miles del navegador
    } else {
        return amount;
    }
}

init();

form.addEventListener('submit', addTransaction);