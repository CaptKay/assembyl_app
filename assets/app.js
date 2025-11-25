document.addEventListener('DOMContentLoaded', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('assembyl-theme');
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const modeLabels = document.querySelectorAll('[data-org]');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const loginTitle = document.getElementById('loginTitle');
  const phoneBody = document.getElementById('phoneBody');
  const tabs = document.querySelectorAll('.tab');
  const roleButtons = document.querySelectorAll('.role-btn');
  const rolePanels = document.querySelectorAll('.role-panel');

  function setTheme(mode) {
    if (mode === 'dark') {
      body.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
      themeToggle.querySelector('span strong').textContent = 'Dark';
    } else {
      body.removeAttribute('data-theme');
      themeIcon.textContent = '☀️';
      themeToggle.querySelector('span strong').textContent = 'Light';
    }
    localStorage.setItem('assembyl-theme', mode);
  }

  setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  function setRole(role) {
    roleButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.role === role));
    rolePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === role));
  }

  roleButtons.forEach((btn) => btn.addEventListener('click', () => setRole(btn.dataset.role)));
  setRole('chairman');

  function deriveOrgFromEmail(email) {
    const domain = (email.split('@')[1] || '').split('.')[0];
    if (!domain) return 'Assembyl';
    const mapping = {
      abia: 'Abia Union Netherlands',
      edo: 'Edo Union',
      lagos: 'Lagos Welfare Union',
      imo: 'Imo Union Europe'
    };
    return mapping[domain.toLowerCase()] || `${domain.charAt(0).toUpperCase()}${domain.slice(1)} Union`;
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const org = deriveOrgFromEmail(emailInput.value.trim());
    updateOrgLabels(org);
  });

  function updateOrgLabels(org) {
    modeLabels.forEach((el) => {
      el.textContent = org;
    });
    loginTitle.textContent = `Sign in to ${org}`;
  }

  const collectionsData = [
    { month: 'Nov', collections: 3800, arrears: 4100 },
    { month: 'Dec', collections: 4200, arrears: 3900 },
    { month: 'Jan', collections: 4600, arrears: 3800 },
    { month: 'Feb', collections: 4250, arrears: 3600 }
  ];

  const chartContainer = document.getElementById('collectionsChart');
  const maxValue = Math.max(...collectionsData.flatMap((data) => [data.collections, data.arrears]));

  collectionsData.forEach((item) => {
    const group = document.createElement('div');
    group.className = 'bar-group';

    const collectionsBar = document.createElement('div');
    collectionsBar.className = 'bar collections';
    collectionsBar.style.height = `${(item.collections / maxValue) * 180 + 30}px`;

    const arrearsBar = document.createElement('div');
    arrearsBar.className = 'bar arrears';
    arrearsBar.style.height = `${(item.arrears / maxValue) * 180 + 30}px`;

    const label = document.createElement('div');
    label.style.fontWeight = '700';
    label.textContent = item.month;

    group.append(collectionsBar, arrearsBar, label);
    chartContainer.appendChild(group);
  });

  const attendanceData = [
    { label: 'Nov GM', percent: 72 },
    { label: 'Dec GM', percent: 81 },
    { label: 'Jan GM', percent: 78 },
    { label: 'Feb GM', percent: 86 }
  ];

  const attendanceList = document.getElementById('attendanceList');
  attendanceData.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'attendance-row';

    const label = document.createElement('strong');
    label.textContent = row.label;

    const bar = document.createElement('div');
    bar.className = 'attendance-bar';
    const fill = document.createElement('span');
    fill.style.width = `${row.percent}%`;
    bar.appendChild(fill);

    const value = document.createElement('div');
    value.textContent = `${row.percent}%`;
    value.style.fontWeight = '700';

    item.append(label, bar, value);
    attendanceList.appendChild(item);
  });

  const phoneScreens = {
    wallet: `
        <div class="balance-card">
            <div class="meta-muted" style="color: rgba(255,255,255,0.8);">Wallet</div>
            <div style="font-size:28px; font-weight:800;">€ 780.00</div>
            <div style="display:flex; gap:8px; align-items:center;">Next due: <strong>€ 50</strong> · 2 Mar</div>
        </div>
        <div class="timeline">
            <div class="timeline-item">
                <strong>Membership category</strong>
                <span class="meta-muted">Standard · Penalty rate €10</span>
            </div>
            <div class="timeline-item">
                <strong>Auto-reminder</strong>
                <span class="meta-muted">Push + email 3 days before due date</span>
            </div>
            <div class="timeline-item">
                <strong>Attendance streak</strong>
                <span class="meta-muted">4 meetings in a row</span>
            </div>
        </div>
    `,
    history: `
        <div class="timeline">
            <div class="timeline-item">
                <strong>Feb GM Attendance</strong>
                <span class="meta-muted">Marked present · No penalty</span>
            </div>
            <div class="timeline-item">
                <strong>Monthly Dues</strong>
                <span class="meta-muted">€50 · Posted Feb 10</span>
            </div>
            <div class="timeline-item">
                <strong>Late Fee</strong>
                <span class="meta-muted" style="color: var(--danger);">€10 · Dec GM</span>
            </div>
            <div class="timeline-item">
                <strong>Donation</strong>
                <span class="meta-muted">€100 · Welfare Drive</span>
            </div>
        </div>
    `,
    profile: `
        <div class="timeline">
            <div class="timeline-item">
                <strong>Member</strong>
                <span class="meta-muted">Kelechi Eze · Member ID #2198</span>
            </div>
            <div class="timeline-item">
                <strong>Contact</strong>
                <span class="meta-muted">+31 61 234 5678 · kelechi@union.eu</span>
            </div>
            <div class="timeline-item">
                <strong>Dues Category</strong>
                <span class="meta-muted">Standard (€50/mo) · Joined 2019</span>
            </div>
            <div class="timeline-item">
                <strong>Address</strong>
                <span class="meta-muted">Amsterdam, Netherlands</span>
            </div>
        </div>
    `
  };

  function renderTab(name) {
    phoneBody.innerHTML = phoneScreens[name];
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => renderTab(tab.dataset.tab)));
  renderTab('wallet');

  const adminMode = document.getElementById('adminMode');
  const memberMode = document.getElementById('memberMode');

  function setMode(target) {
    const isAdmin = target === 'admin';
    adminMode.classList.toggle('active', isAdmin);
    memberMode.classList.toggle('active', !isAdmin);
  }

  adminMode.addEventListener('click', () => setMode('admin'));
  memberMode.addEventListener('click', () => setMode('member'));
});
