// Local Database
let users = JSON.parse(localStorage.getItem("users")) || []

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users))
}

// Register
function register() {
  let user = {
    name: name.value,
    email: email.value,
    password: password.value,
    balance: 1000,
    transactions: []
  }

  if (users.find(u => u.email === user.email)) {
    alert("User already exists")
    return
  }

  users.push(user)
  saveUsers()
  alert("Registered successfully")
}

// Login
function login() {
  let user = users.find(u =>
    u.email === email.value &&
    u.password === password.value
  )

  if (user) {
    localStorage.setItem("currentUser", user.email)
    window.location = "dashboard.html"
  } else {
    alert("Invalid login")
  }
}

// Logout
function logout() {
  localStorage.removeItem("currentUser")
  window.location = "index.html"
}

// Load Dashboard
function loadDashboard() {
  let email = localStorage.getItem("currentUser")
  let user = users.find(u => u.email === email)

  balance.innerText = "₹" + user.balance

  let list = document.getElementById("transactions")
  list.innerHTML = ""
  user.transactions.forEach(t => {
    list.innerHTML += `<li>${t}</li>`
  })
}

// Add Money
function addMoney() {
  let email = localStorage.getItem("currentUser")
  let user = users.find(u => u.email === email)

  let amount = Number(addAmount.value)
  user.balance += amount
  user.transactions.push("Added ₹" + amount)

  saveUsers()
  loadDashboard()
}

// Transfer Money
function transfer() {
  let senderEmail = localStorage.getItem("currentUser")
  let sender = users.find(u => u.email === senderEmail)
  let receiver = users.find(u => u.email === receiver.value)

  if (!receiver) {
    alert("User not found")
    return
  }

  let amount = Number(document.getElementById("amount").value)

  if (sender.balance < amount) {
    alert("Insufficient balance")
    return
  }

  sender.balance -= amount
  receiver.balance += amount

  sender.transactions.push(`Sent ₹${amount} to ${receiver.email}`)
  receiver.transactions.push(`Received ₹${amount} from ${sender.email}`)

  saveUsers()
  loadDashboard()
}

// Auto load
if (window.location.pathname.includes("dashboard")) {
  loadDashboard()
}

function loadChart(user) {
  let spend = 0
  let add = 0

  user.transactions.forEach(t => {
    if (t.includes("Sent")) {
      let amt = Number(t.match(/\d+/)[0])
      spend += amt
    }
    if (t.includes("Added")) {
      let amt = Number(t.match(/\d+/)[0])
      add += amt
    }
  })

  let ctx = document.getElementById("chart").getContext("2d")

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Spent", "Added"],
      datasets: [{
        data: [spend, add],
        backgroundColor: ["#ff4d4d", "#00c896"]
      }]
    }
  })
}
loadChart(user)


function showToast(msg) {
  let toast = document.getElementById("toast")
  toast.innerText = msg
  toast.style.display = "block"

  setTimeout(() => {
    toast.style.display = "none"
  }, 2000)
}

alert("Transfer successful")

showToast("Transfer Successful ✅")


function loadChart(user) {
  let data = {}

  user.transactions.forEach(t => {
    let month = new Date().toLocaleString('default', { month: 'short' })

    if (!data[month]) data[month] = 0

    if (t.includes("Sent")) {
      let amt = Number(t.match(/\d+/)[0])
      data[month] += amt
    }
  })

  let ctx = document.getElementById("chart").getContext("2d")

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "Monthly Spending",
        data: Object.values(data),
      }]
    }
  })
}