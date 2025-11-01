const API_BASE = "https://msd-backend-1-qp75.onrender.com";

const tableBody = document.querySelector("tbody");
const transactionForm = document.getElementById("transaction-form");
const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");

const incomeDisplay = document.getElementById("incomeDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");

const messageBox = document.createElement("p");
messageBox.id = "messageBox";
messageBox.style.textAlign = "center";
messageBox.style.fontWeight = "bold";
messageBox.style.fontSize = "1.2rem";
messageBox.style.marginTop = "1rem";
document.querySelector(".container").appendChild(messageBox);

const resetBtn = document.createElement("button");
resetBtn.textContent = "Reset All Data";
resetBtn.id = "resetBtn";
resetBtn.style.backgroundColor = "#ff6b6b";
resetBtn.style.color = "white";
resetBtn.style.border = "none";
resetBtn.style.padding = "10px 15px";
resetBtn.style.borderRadius = "5px";
resetBtn.style.cursor = "pointer";
resetBtn.style.marginTop = "15px";
resetBtn.style.display = "block";
resetBtn.style.marginInline = "auto";
document.querySelector(".container").appendChild(resetBtn);

async function loadTransactions() {
  try {
    const res = await fetch(`${API_BASE}/transactions`);
    const transactions = await res.json();

    tableBody.innerHTML = "";
    let totalIncome = 0,
      totalExpense = 0;

    transactions.forEach((tx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.title}</td>
        <td>${tx.type}</td>
        <td>₹ ${tx.amount}</td>
        <td>${new Date(tx.date).toLocaleDateString()}</td>
      `;
      tableBody.appendChild(row);

      if (tx.type === "income") totalIncome += tx.amount;
      else totalExpense += tx.amount;
    });

    incomeDisplay.textContent = `₹ ${totalIncome}`;
    expenseDisplay.textContent = `₹ ${totalExpense}`;
    const balance = totalIncome - totalExpense;
    balanceDisplay.textContent = `₹ ${balance}`;
    balanceDisplay.className = "amount " + (balance >= 0 ? "positive" : "negative");

    if (balance < 0) {
      messageBox.textContent =
        " Your balance is negative! Try saving money for upcoming needs.";
      messageBox.style.color = "#dc2626";
    } else if (balance > 0 && balance < 1000) {
      messageBox.textContent = " You’re doing okay, but keep an eye on your spending!";
      messageBox.style.color = "#000000ff";
    } else {
      messageBox.textContent = " Great job! You’re managing your budget perfectly!";
      messageBox.style.color = "#16a34a";
    }
  } catch (err) {
    console.error("Error loading transactions:", err);
  }
}

transactionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const transaction = {
    title: titleInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
  };

  await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });

  
  titleInput.value = "";
  amountInput.value = "";
  typeInput.value = "";

  loadTransactions();
});

resetBtn.addEventListener("click", async () => {
  const confirmReset = confirm("Are you sure you want to reset all data?");
  if (!confirmReset) return;

  try {
    await fetch(`${API_BASE}/transactions`, { method: "DELETE" }); 
    tableBody.innerHTML = "";
    incomeDisplay.textContent = "₹ 0";
    expenseDisplay.textContent = "₹ 0";
    balanceDisplay.textContent = "₹ 0";
    messageBox.textContent = "🧹 All data cleared successfully!";
    messageBox.style.color = "#2563eb";
  } catch (error) {
    console.error("Error resetting data:", error);
    messageBox.textContent = " Failed to reset data.";
    messageBox.style.color = "#dc2626";
  }
});

loadTransactions();
