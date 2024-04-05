// Elementos del DOM
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const incomeBtn = document.querySelector('.btn-income');
const egressBtn = document.querySelector('.btn-egress');

// Transacciones almacenadas localmente
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

// Arreglo de transacciones
let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Event listener para el botón de ingreso
incomeBtn.addEventListener('click', addIncomeTransaction);

// Event listener para el botón de egreso
egressBtn.addEventListener('click', addEgressTransaction);

// Función para agregar transacción de ingreso
function addIncomeTransaction(e) {
    e.preventDefault();
    addTransaction(true);
}

// Función para agregar transacción de egreso
function addEgressTransaction(e) {
    e.preventDefault();
    addTransaction(false);
}

// Agregar transacción
function addTransaction(isIncome) {
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Por favor, ingresa un texto y un monto.');
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

// Generar ID aleatorio
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Agregar transacciones a la lista del DOM
function addTransactionDOM(transaction) {
    // Obtener el signo
    const sign = transaction.amount < 0 ? '-' : '+';

    // Formatear el monto
    const formattedAmount = parseFloat(Math.abs(transaction.amount)).toLocaleString('es-CO');

    const item = document.createElement('li');

    // Agregar clase según el valor
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}$${formattedAmount}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Actualizar el balance, ingreso y egreso
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

    balance.innerText = `$${parseFloat(total).toLocaleString('es-CO')}`;
    money_plus.innerText = `$${parseFloat(income).toLocaleString('es-CO')}`;
    money_minus.innerText = `$${parseFloat(expense).toLocaleString('es-CO')}`;
}

// Eliminar transacción por ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Actualizar transacciones almacenadas localmente
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Inicializar la aplicación
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Formatear decimales en el input
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

// Función para formatear el número
function formatearNumero(amount) {
    // Si el número es mayor o igual a 1000, formatearlo con separadores de miles
    if (parseInt(amount) >= 1000) {
        let numero = parseInt(amount); // Convertir a número
        return numero.toLocaleString('es-CO'); // Utilizar formato de separadores de miles del navegador
    } else {
        return amount;
    }
}

// Inicializar la aplicación al cargar la página
init();

// Event listener para agregar transacción al enviar el formulario
form.addEventListener('submit', addTransaction);
