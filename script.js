let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const list = document.getElementById("list");
const incomeBar = document.getElementById("income-bar");
const expenseBar = document.getElementById("expense-bar");
const pieChart = document.getElementById("pie-chart");

if (darkMode) document.body.classList.add("dark");

document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  event.target.classList.add("active");
}

document.getElementById("transaction-form").onsubmit = function (e) {
  e.preventDefault();

  transactions.push({
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    type: type.value,
    date: date.value
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  this.reset();
  updateUI();
};

document.getElementById("reset").onclick = () => {
  if (confirm("Clear all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    updateUI();
  }
};

document.getElementById("export").onclick = exportByDate;

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}

function updateUI() {
  list.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.text} (${t.date})</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
    `;
    list.appendChild(li);

    t.type === "income" ? income += t.amount : expense += t.amount;
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;

  const max = Math.max(income, expense, 1);
  incomeBar.style.height = (income / max) * 180 + "px";
  expenseBar.style.height = (expense / max) * 180 + "px";

  const total = income + expense || 1;
  const deg = (income / total) * 360;
  pieChart.style.background =
    `conic-gradient(green 0deg ${deg}deg, red ${deg}deg 360deg)`;
}

function exportByDate() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  let csv = "Description,Amount,Type,Date\n";

  transactions
    .filter(t => (!from || t.date >= from) && (!to || t.date <= to))
    .forEach(t => {
      csv += `${t.text},${t.amount},${t.type},${t.date}\n`;
    });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expense_report.csv";
  a.click();
}

updateUI();
