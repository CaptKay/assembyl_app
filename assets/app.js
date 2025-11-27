document.addEventListener('DOMContentLoaded', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('assembyl-theme');
  const storedOrg = localStorage.getItem('assembyl-org');
  const storedRole = localStorage.getItem('assembyl-role');
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const modeLabels = document.querySelectorAll('[data-org]');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const loginTitle = document.getElementById('loginTitle');
  const roleSelect = document.getElementById('roleSelect');
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

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function setRole(role) {
    roleButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.role === role));
    rolePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === role));
  }

  if (roleButtons.length && rolePanels.length) {
    roleButtons.forEach((btn) => btn.addEventListener('click', () => setRole(btn.dataset.role)));
    setRole('chairman');
  }

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

  function updateOrgLabels(org) {
    modeLabels.forEach((el) => {
      el.textContent = org;
    });
    if (loginTitle) {
      loginTitle.textContent = `Sign in to ${org}`;
    }
  }

  if (storedOrg) {
    updateOrgLabels(storedOrg);
  }

  if (roleSelect && storedRole) {
    roleSelect.value = storedRole;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const org = deriveOrgFromEmail(emailInput.value.trim());
      const role = roleSelect ? roleSelect.value : 'chairman';
      localStorage.setItem('assembyl-org', org);
      localStorage.setItem('assembyl-role', role);
      updateOrgLabels(org);
      const query = `role=${encodeURIComponent(role)}&org=${encodeURIComponent(org)}`;
      window.location.href = `role-portal.html?${query}`;
    });
  }

  const collectionsData = [
    { month: 'Nov', collections: 3800, arrears: 4100 },
    { month: 'Dec', collections: 4200, arrears: 3900 },
    { month: 'Jan', collections: 4600, arrears: 3800 },
    { month: 'Feb', collections: 4250, arrears: 3600 }
  ];

  const chartContainer = document.getElementById('collectionsChart');
  if (chartContainer) {
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
  }

  const attendanceData = [
    { label: 'Nov GM', percent: 72 },
    { label: 'Dec GM', percent: 81 },
    { label: 'Jan GM', percent: 78 },
    { label: 'Feb GM', percent: 86 }
  ];

  const attendanceList = document.getElementById('attendanceList');
  if (attendanceList) {
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
  }

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

  if (phoneBody && tabs.length) {
    tabs.forEach((tab) => tab.addEventListener('click', () => renderTab(tab.dataset.tab)));
    renderTab('wallet');
  }

  const adminMode = document.getElementById('adminMode');
  const memberMode = document.getElementById('memberMode');

  function setMode(target) {
    const isAdmin = target === 'admin';
    adminMode.classList.toggle('active', isAdmin);
    memberMode.classList.toggle('active', !isAdmin);
  }

  if (adminMode && memberMode) {
    adminMode.addEventListener('click', () => setMode('admin'));
    memberMode.addEventListener('click', () => setMode('member'));
  }

  const rolePortal = document.getElementById('rolePortal');

  function resolveRoleLabel(role) {
    const labels = {
      chairman: 'Chairman',
      financial: 'Financial Secretary',
      provost: 'Provost',
      secretary: 'Secretary',
      general: 'General Secretary'
    };
    return labels[role] || 'Workspace';
  }

  if (rolePortal) {
    const roleTitle = document.getElementById('roleTitle');
    const roleBadge = document.getElementById('roleBadge');
    const roleSummary = document.getElementById('roleSummary');
    const roleActions = document.getElementById('roleActions');
    const roleLists = document.querySelectorAll('[data-role-list]');
    const params = new URLSearchParams(window.location.search);

    const selectedRole = (params.get('role') || storedRole || 'chairman').toLowerCase();
    const org = params.get('org') || storedOrg || 'Assembyl';

    const roleContent = {
      chairman: {
        summary:
          'Top-line governance view with executive snapshot, arrears trends, and meeting readiness checks for leadership briefings.',
        actions: ['Send pre-read to exco', 'Review arrears spike in Unit B', 'Schedule finance sync'],
        lists: {
          priorities: ['Maintain 4.2 month runway', 'Ensure quorum for March GM', 'Track critical risk mitigations'],
          spotlight: ['3 meetings held last 30 days', 'Arrears reduced by €1,930 in Feb', 'Risk: arrears spike in Unit B']
        }
      },
      financial: {
        summary:
          'Financial Secretary workspace with arrears drilldown, cashbook items, and the next workflow steps to clear debt.',
        actions: ['Post February dues', 'Export ledger snapshot', 'Send arrears notices to high-risk members'],
        lists: {
          priorities: ['Reconcile cash vs bank', 'Review levy waiver request', 'Queue audit export'],
          spotlight: ['€7,540 high-risk arrears', '€3,200 dues batch posted', 'Late fee automation ready']
        }
      },
      provost: {
        summary:
          'Provost-first view on attendance enforcement and discipline events to improve meeting compliance.',
        actions: ['Confirm penalties for absentees', 'Send warning letters', 'Clear validated proxies'],
        lists: {
          priorities: ['Reduce late arrivals streak', 'Improve attendance streaks', 'Track penalty collections'],
          spotlight: ['Penalty €20 issued', 'Warnings queued for late arrivals', 'Proxy misuse cleared']
        }
      },
      secretary: {
        summary:
          'Secretary workspace featuring communications, meeting prep, and document dispatch reminders.',
        actions: ['Publish GM minutes', 'Send reminder for committee updates', 'Upload attendance roll'],
        lists: {
          priorities: ['Prep agenda for March GM', 'Coordinate with provost on attendance', 'Notify exco of dues status'],
          spotlight: ['Minutes draft ready', 'Attendance roll updated', 'Agenda distribution scheduled']
        }
      },
      general: {
        summary:
          'General Secretary workspace focused on dispatches, meeting readiness, and clear communication to exco and members.',
        actions: ['Send GM reminder to full roster', 'Upload updated attendance roll', 'Attach finance annex to agenda packet'],
        lists: {
          priorities: ['Finalize GM agenda and motions', 'Sync with provost on attendance roll', 'Circulate briefing pack with arrears snapshot'],
          spotlight: ['Weekly digest delivered to exco', 'Agenda draft ready for review', '12 member queries awaiting response']
        }
      }
    };

    function hydrateRoleWorkspace(role) {
      const payload = roleContent[role] || roleContent.chairman;
      const label = resolveRoleLabel(role);
      updateOrgLabels(org);
      localStorage.setItem('assembyl-role', role);
      localStorage.setItem('assembyl-org', org);

      if (roleTitle) roleTitle.textContent = `${label} workspace`;
      if (roleBadge) roleBadge.textContent = label;
      if (roleSummary) roleSummary.textContent = payload.summary;

      if (roleActions) {
        roleActions.innerHTML = '';
        payload.actions.forEach((action) => {
          const item = document.createElement('div');
          item.className = 'list-item';
          const meta = document.createElement('div');
          meta.className = 'meta';
          meta.innerHTML = `<strong>${action}</strong><span class="meta-muted">Action item</span>`;
          item.appendChild(meta);
          roleActions.appendChild(item);
        });
      }

      roleLists.forEach((list) => {
        const target = list.dataset.roleList;
        const values = payload.lists[target] || [];
        list.innerHTML = '';
        values.forEach((value) => {
          const item = document.createElement('li');
          item.textContent = value;
          list.appendChild(item);
        });
      });
    }

    hydrateRoleWorkspace(selectedRole);
  }
});
