
const demoUsers = [
  {
    username: "admin",
    password: "demo123",
    name: "Administrator",
    role: "admin"
  },
  {
    username: "staff1",
    password: "demo123",
    name: "Staff Member",
    role: "staff"
  }
];

const tasks = [
  {
    title: "Enter September purchase bills",
    priority: "High",
    status: "Pending",
    deadline: "—"
  },
  {
    title: "Verify supplier GST details",
    priority: "Medium",
    status: "Completed",
    deadline: "02 Nov"
  },
  {
    title: "Prepare client document checklist",
    priority: "Low",
    status: "Awaiting review",
    deadline: "05 Nov"
  }
];

let currentUser = null;

const $ = id => document.getElementById(id);

const loginView = $("loginView");
const appView = $("appView");

$("todayLabel").textContent =
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());

// LOGIN
$("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const username = $("username").value.trim();
  const password = $("password").value;

  const found = demoUsers.find(user =>
    user.username === username &&
    user.password === password
  );

  if (!found) {
    $("loginError").textContent =
      "Username or password is incorrect.";
    return;
  }

  currentUser = found;

  $("loginError").textContent = "";

  loginView.classList.add("hidden");
  appView.classList.remove("hidden");

  $("sideName").textContent = found.name;
  $("sideRole").textContent =
    found.role === "admin" ? "Administrator" : "Staff";

  $("avatar").textContent = found.name[0].toUpperCase();
  $("topAvatar").textContent = found.name[0].toUpperCase();

  document.querySelectorAll(".admin-only").forEach(element => {
    element.classList.toggle(
      "hidden",
      found.role !== "admin"
    );
  });

  $("welcomeTitle").textContent =
    `Welcome back, ${found.name.split(" ")[0]}`;

  $("welcomeSubtitle").textContent =
    found.role === "admin"
      ? "Here is an overview of your workspace."
      : "Here is your personal work summary.";

  renderOverview();
});

// LOGOUT
$("logoutBtn").addEventListener("click", () => {
  currentUser = null;

  appView.classList.add("hidden");
  loginView.classList.remove("hidden");

  $("password").value = "";
});

// MOBILE MENU
$("menuBtn").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
});

// CREATE TASK BUTTON
$("newTaskBtn").addEventListener("click", () => {
  showPage("tasks");
});

// NAVIGATION
document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    showPage(button.dataset.page);

    $("sidebar").classList.remove("open");
  });
});

// VIEW ALL BUTTON
document.querySelectorAll("[data-goto]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.goto);
  });
});

// DASHBOARD
function renderOverview() {
  const isAdmin = currentUser.role === "admin";

  const stats = isAdmin
    ? [
        ["Total tasks today", "18", "▤", "#eaf0ff", "#315be8"],
        ["Completed today", "12", "✓", "#e6f6ef", "#159b68"],
        ["Still pending", "4", "◷", "#fff3df", "#d78a18"],
        ["Awaiting review", "2", "◎", "#f1eaff", "#8458d8"]
      ]
    : [
        ["My total tasks", "8", "▤", "#eaf0ff", "#315be8"],
        ["Completed", "5", "✓", "#e6f6ef", "#159b68"],
        ["Still pending", "2", "◷", "#fff3df", "#d78a18"],
        ["Awaiting review", "1", "◎", "#f1eaff", "#8458d8"]
      ];

  $("statGrid").innerHTML = stats.map(stat => `
    <div class="stat-card">
      <div class="stat-top">
        <span>${stat[0]}</span>
        <span class="stat-icon"
          style="background:${stat[3]};color:${stat[4]}">
          ${stat[2]}
        </span>
      </div>
      <div class="stat-value">${stat[1]}</div>
    </div>
  `).join("");

  $("recentTasks").innerHTML = tasks.map(task => `
    <tr>
      <td class="task-name">${task.title}</td>
      <td>
        <span class="tag ${task.priority.toLowerCase()}">
          ${task.priority}
        </span>
      </td>
      <td>
        <span class="tag ${
          task.status === "Completed"
            ? "completed"
            : task.status === "Pending"
              ? "pending"
              : "review"
        }">
          ${task.status}
        </span>
      </td>
      <td>${task.deadline}</td>
    </tr>
  `).join("");
}

// PAGE NAVIGATION
function showPage(page) {
  const titles = {
    overview: "Overview",
    tasks: "My Tasks",
    staff: "Staff Management",
    alltasks: "All Staff Tasks",
    reports: "Monthly Reports",
    notifications: "Notifications",
    data: "Data Manager"
  };

  $("pageTitle").textContent = titles[page] || "Overview";

  const panel = $("pageContent");

  if (page === "overview") {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");

  const currentMonth = new Date().toISOString().slice(0, 7);

  const content = {
    tasks: `
      <h3>My Tasks</h3>
      <p class="muted">
        Task creation, pending reasons, completion and
        self-rating will be implemented in the next stage.
      </p>
    `,

    staff: `
      <h3>Staff Management</h3>
      <p class="muted">
        Add staff, edit details, manage credentials
        and activate or deactivate accounts.
      </p>
    `,

    alltasks: `
      <h3>All Staff Tasks</h3>
      <p class="muted">
        Review staff submissions, add remarks
        and request corrections.
      </p>
    `,

    reports: `
      <h3>Monthly Summary Export</h3>
      <p class="muted">
        Select a month and export a colourful PDF
        or an Excel workbook.
      </p>

      <div class="report-controls">
        <label>
          Select month:
          <input type="month" value="${currentMonth}">
        </label>

        <p class="muted">
          PDF and Excel export functionality is
          scheduled for the reporting implementation stage.
        </p>
      </div>
    `,

    notifications: `
      <h3>Notifications</h3>
      <p class="muted">
        Staff messages, admin replies and notification
        history will appear here.
      </p>
    `,

    data: `
      <h3>Admin Data Manager</h3>
      <p class="muted">
        The master Excel workbook will be selected,
        validated and updated through controlled
        admin-only operations.
      </p>
    `
  };

  panel.innerHTML = content[page] || "";
}
