Here’s an updated **Main UX/UI Design Document** that includes:

* Dark + Light mode
* Charts on Chairman’s Dashboard + Smart Ledger
* Member list drill-down → Member Financial Report screen

You can treat this as **v1.1 of the MVP design spec**.

---

# Assembyl MVP – UX/UI Design Document (v1.1)

> Scope: February MVP (Phase 0.5 – Admin Portal) + Phase 1 Member App
> Rule: If a screen is not on this list, do not code it.

---

## 0. Global UX / UI System

### 0.1 Theming

* **Theme Modes**

  * App supports **Dark Mode (default)** and **Light Mode**.
  * Theme is stored per device (e.g., `localStorage`) and respects OS preference on first load.

* **Theme Toggle**

  * Location: **Topbar, right side**, next to the Admin/Member mode toggle.
  * Label: `🌙 Dark` or `☀️ Light` based on current state.
  * Behavior:

    * Click toggles between `dark` and `light`.
    * All surfaces (backgrounds, cards, typography, charts, pills) must maintain **high contrast** in both modes.

### 0.2 Layout

* **Admin Portal (Platform A)**

  * Desktop layout: Sidebar (left) + Topbar + Content area.
  * Smaller screens: Topbar + stacked content; sidebar may collapse into a drawer (future phase).
  * All Admin screens share:

    * `Screen Title`
    * `Subtitle`
    * Optional right-aligned actions (filters, export, etc.).

* **Member App Preview (Platform B)**

  * Rendered as a **phone frame** (card with rounded corners) inside Admin content.
  * Tabs at the top of the phone: `Wallet`, `History`, `Profile`.

### 0.3 Components

* Common primitives:

  * `Card`, `Pill`, `Badge`, `Chip`, `Table`, `Timeline`, `Modal`, `Toggle`, `Search Input`.
* All tables: horizontal scroll on smaller screens.
* All buttons: clearly primary/secondary/ghost, consistent rounded-pill style.

---

## 1. Platform A: Admin Portal (Web & Electron)

**Target Users:** Financial Secretary, Provost, Secretary, Chairman.

### 1.1 Authentication Module

#### 1.1.1 Screen: Login Gate

**Purpose:** Secure entry. Detects Organization from email domain.

* **Layout**

  * **Left Panel: Branding**

    * Large brand logo card with initials or logo.
    * Brand copy text: “Secure entry into your union’s financial, attendance, and membership engines.”
    * Background gradient (respects dark/light theme).
  * **Right Panel: Login Form**

    * Header: `Sign in to [Org Name]` (fallback: “Assembyl”).
    * Fields:

      * Email Address
      * Password
    * Actions:

      * Primary button: `Login`
      * Text link: `Forgot Password?` → opens mailto to Support in MVP.
  * **Footer**

    * Watermark: `Powered by Assembyl`.

* **Org Detection**

  * On login, derive org name from email (`@abia…` → “Abia Union Netherlands”, etc.).
  * Update:

    * Sidebar logo text (org)
    * Topbar org label

---

## 2. Dashboard Module

### 2.1 Screen: Chairman’s Dashboard (Home)

**Purpose:** High-level health of the union.

#### 2.1.1 KPI Row

* **KPI Cards (4)**

  1. **Cash in Hand (Current Month)**

     * Icon: 💰
     * Label: “Cash in Hand (This Month)”
     * Value: e.g., `€ 4,250`
     * Note: “Includes dues, levies & donations”
  2. **Total Arrears**

     * Icon: 📉
     * Label: “Total Arrears”
     * Value: e.g., `€ 18,430`
     * Note: “Across 72 members”
  3. **Active Membership Count**

     * Icon: 👥
     * Value: e.g., `128`
     * Note: “3 travelled · 2 deceased”
  4. **Last Meeting Attendance %**

     * Icon: 📊
     * Value: e.g., `78%`
     * Note: “Present: 100 · Late: 14 · Absent fined: 14”
* All KPIs must remain **legible in light mode** (strong text colors).

#### 2.1.2 Activity & Debtors Panels

* **Recent Activity Feed**

  * Card title: “Recent Activity”
  * Subtitle: “Last 5 actions”
  * List items:

    * “Chinedu paid €50 (Monthly Dues) – Just now”
    * “February General Meeting created – 5 min ago”
    * etc.
* **Debtors Watchlist**

  * Card title: “Debtors Watchlist”
  * Subtitle: “Top 5 by amount”
  * List items: member + debt (debt values in **red** in both modes).

#### 2.1.3 Dashboard Charts (Required)

Add **visual charts** under the cards:

1. **Collections vs Arrears (Last 3–4 months) – Bar Chart**

   * Card title: “Collections vs Arrears (Last 4 months)”
   * Legend:

     * Collections (primary color)
     * Total Arrears (danger color)
   * Bars:

     * Month groups (e.g., Dec, Jan, Feb)
     * For each month: one bar for collections, one for arrears.
   * Goal: Quick visual of **cash performance vs outstanding debt**.

2. **Attendance (Last 4 meetings) – Horizontal Bar Chart**

   * Card title: “Attendance (Last 4 meetings)”
   * Rows: `Nov GM`, `Dec GM`, `Jan GM`, `Feb GM`
   * For each row:

     * Label
     * Thin horizontal bar showing % (e.g., 72%, 81%, 78%, 86%)
     * Numeric percentage on the right.
   * Goal: Show meeting participation trend at a glance.

> All charts must render in **dark and light modes** with clear contrast.

---

## 3. Finance Module (The Fin Sec Engine)

### 3.1 Screen: The Smart Ledger (Main View)

**Purpose:** Command center for recording payments and viewing member balances.

#### 3.1.1 Layout

* **Two-column layout**

  * Left: **Member List**
  * Right: **Transaction Form**

#### 3.1.2 Left Sidebar – Member List

* Card title/sub-label: “Members (click for full financial report)”.
* **Search**

  * Large search input: “Search member by name or ID…”
* **Member List**

  * Rows (scrollable):

    * Avatar (initials)
    * Name (e.g., “Chinedu N.”)
    * ID (e.g., “ABU-001”)
    * Current Balance (color-coded):

      * Positive → green
      * Negative → red
  * Interactions:

    * Hover state
    * Click state: row becomes “active”.
    * **Click Behavior (New)**

      * Clicking a member performs two things:

        1. Highlights them as the current ledger context.
        2. Navigates to **Member Financial Report** screen (3.4) for drill-down.

#### 3.1.3 Right Panel – Transaction Form

* **Member Context**

  * Avatar + Name + ID
  * “Total Debt: € X” (debt in red).
* **Amount Input**

  * Label: “Amount (€)”
  * Large numeric input, optimized for quick entry.
* **Category Pills**

  * Options:

    * `[Monthly Dues]`
    * `[Levy]`
    * `[Donation]`
    * `[Fine]`
  * Only one active at a time.
* **Method Toggle**

  * Options:

    * `[Cash]`
    * `[Bank Transfer]`
    * `[Tikkie / Payment Link]`
* **Project Dropdown**

  * Visible **only when** `Donation` is selected.
  * Options:

    * “Building Fund 2025”
    * “Welfare & Emergency Support”
    * “Education Support Scheme”
* **Actions**

  * Secondary: `Clear`
  * Primary: `SAVE & GENERATE RECEIPT`

    * On click → triggers **Receipt Success Modal (3.2)**.

### 3.2 Window: Receipt Success Modal

**Purpose:** Immediate confirmation + actions.

* **Contents**

  * Success checkmark animation.
  * Message:

    * “Payment of €[amount] recorded for [Name].”
  * Actions:

    * `Download PDF Receipt` (Statement)
    * `Share via WhatsApp`
    * `Close & Next` (closes modal and resets form for next member).

### 3.3 Screen: Debtors Report

**Purpose:** Enforcement / shame list for follow-up and group sharing.

* **Filters**

  * Chips:

    * `All`
    * `Owe > €100`
    * `Owe > €500`
* **Table**

  * Columns:

    * Name | Phone | Last Payment | Total Debt
  * Total Debt highlighted in red in both themes.
* **Export**

  * Button: `Download PDF for Group Chat`.

### 3.4 Screen: Member Financial Report (NEW)

**Purpose:** Detailed per-member financial history, opened from Smart Ledger member list.

#### 3.4.1 Entry Points

* Clicking any member row in **Smart Ledger’s** member list navigates to:

  * Screen: **Member Financial Report**
  * For that specific member (using their ID).

#### 3.4.2 Header

* **Top Bar**

  * Title: “Member Financial Report”
  * Subtitle: “Full financial history and standing for a single member.”
  * Right button: `← Back to Smart Ledger`

    * Navigates back and re-activates Smart Ledger nav item.

#### 3.4.3 Member Summary Card

* **Identity Block**

  * Avatar (initials)
  * Name
  * Meta: `ID: [ID] · [Status] member`
* **Chips**

  * Status chip:

    * Active / Travelled / Inactive (use colors consistent with directory).
  * Balance chip:

    * “Balance: € X” (red if negative, green if positive).

#### 3.4.4 KPIs

Grid (3 cards):

1. **Total Paid (Lifetime)**

   * e.g., `€ 3,200`
   * Note: “All dues, levies, donations.”
2. **Total Arrears**

   * e.g., `€ 230`
   * Note: “Includes active fines.”
3. **Last Payment**

   * e.g., `Feb 4, 2025 · € 50`
   * Note: “From Smart Ledger.”

#### 3.4.5 Toolbar

* **Left**

  * Label: “History:”
  * Filter chips:

    * `All` (default)
    * `Dues`
    * `Levies`
    * `Donations`
    * `Fines`
  * (MVP: filters may be static; later wired to real query.)
* **Right**

  * `⬇️ Download Statement (PDF)`
  * `💬 Share to WhatsApp`

#### 3.4.6 Financial History Table

* **Columns**

  * Date
  * Type (Payment / Fine / Adjustment)
  * Category (Monthly Dues, Building Fund, Absent Fine, etc.)
  * Method (Cash, Bank Transfer, Tikkie, Auto)
  * Amount (with sign)
  * Running Balance
* Populated from per-member history data.

---

## 4. Attendance Module (The Provost Engine)

### 4.1 Screen: Meeting Manager

**Purpose:** Create/choose a meeting.

* Lists:

  * Upcoming Meetings
  * Past Meetings
* Actions:

  * `Create New Meeting` → opens date picker in fiscal calendar context.
* Labels show:

  * Meeting name
  * Date/time window
  * Status (Active / Draft / Closed).

### 4.2 Screen: The Provost Tapper (Active Meeting)

**Purpose:** Fast door check-in.

* **Header**

  * Meeting name: “Feb General Meeting”
  * Live clock (updates periodically).
* **Search**

  * Large search input: “Search member by name or ID…”
* **List**

  * Rows:

    * Name + ID
    * Traffic-light toggle:

      * `Present (Green)`
      * `Late (Yellow)`
      * `Absent (Red)`
* **Footer**

  * `Close Register & Apply Fines` button

    * Marks register as closed
    * Triggers fine calculations (business logic later).

---

## 5. Membership Module (The Secretary Engine)

### 5.1 Screen: Member Directory

**Purpose:** Single source of truth for member data.

* **Table**

  * Columns:

    * Photo (avatar)
    * Name
    * Phone
    * Email
    * Status (Active / Travelled / Deceased)
    * Actions (Edit, Deactivate)
* **Actions**

  * `Upload Excel` button for initial import.
  * Edit icon: opens **Member Details / Edit Profile** (5.2).
  * Deactivate icon: marks member as inactive (behavior defined later).

### 5.2 Window: Member Details / Edit Profile

**Purpose:** Update specific member details.

* **Form Fields**

  * First Name
  * Last Name
  * Phone
  * Address
  * Next of Kin
* **Status Toggle**

  * Active / Inactive
* **Role Dropdown**

  * Member
  * Chairman
  * Financial Secretary
  * Provost
  * Secretary
  * Exco Position (Other)
* **Action**

  * `Save Member` button.

---

## 6. Settings Module

### 6.1 Screen: Fiscal Calendar & Config

**Purpose:** Define rules for each month.

* **Month Grid (12 months)**

  * Per month:

    * Label: Jan … Dec
    * Toggles:

      * “Meeting?” Yes/No
      * “Dues Payable?” Yes/No
    * “Levy Name” input (optional).
  * Special styling for current active month (“Feb” in MVP).

* **Fine Rules**

  * Inputs:

    * “Lateness Fine (€)”
    * “Absenteeism Fine (€)”

### 6.2 Screen: Campaign Manager

**Purpose:** Manage Building Fund / Welfare / other campaigns.

* **List: Active Campaigns**

  * Each row shows:

    * Title
    * Target amount
    * Current amount (%)
    * Status chip (Active).
* **Action**

  * `Create Campaign` button:

    * Required fields: Title, Target Amount (€), Deadline.

---

## 7. Platform B: Member App (React Native – Phase 1 Preview)

> In MVP web prototype, shown as a **mobile frame** inside Admin Portal.

### 7.1 Authentication

#### 7.1.1 Screen: Mobile Login

* Fields:

  * Phone number
  * Password (MVP; later OTP)
* Behavior:

  * On success → load:

    * Member theme (e.g., red/green state)
    * Member data (balance, history, profile).

### 7.2 Wallet Tab (Home)

#### 7.2.1 Screen: Digital ID & Balance

* **Membership Card**

  * Name
  * ID
  * Photo placeholder
  * QR code placeholder.
* **Balance Block**

  * Big number, red if behind, green if in good standing.
* **Pay Button**

  * Opens payment flow (Stripe/Mollie).
* **Recent Transactions**

  * Last 3 payments (amount, date, type).

### 7.3 History Tab

#### 7.3.1 Screen: Activity Log

* **Timeline view**

  * Mixed:

    * Payments: “Paid €50 (Feb 4)”
    * Attendance: “Marked Present (Feb 4)”
    * Fines: “Fine: Absent (Jan 1) -€10”
* **Tap Action**

  * On payment item → “Download PDF Receipt”.

### 7.4 Profile Tab

#### 7.4.1 Screen: My Account

* **Editable Fields**

  * Phone
  * Address
* **Verification**

  * Button: `Generate TrustLink Code`

    * Shows large 6-digit code (e.g., “123 456”), valid for 24h.
* **Settings**

  * Notification toggles:

    * WhatsApp reminders
    * Email statements
  * `Logout` button.

---

## 8. Happy Path Flow (Recap)

1. **Fin Sec** logs into Admin Portal (Login Gate).
2. Goes to **Fiscal Calendar (6.1)**:

   * Sets February meeting as active.
3. **Provost** logs in:

   * Uses **The Provost Tapper (4.2)** to mark members Present/Late/Absent.
4. **Fin Sec** opens **The Smart Ledger (3.1)**:

   * Selects member from list.
   * Enters payment.
   * Clicks `SAVE & GENERATE RECEIPT`.
5. **Receipt Modal (3.2)** appears:

   * Fin Sec downloads/shares receipt via WhatsApp.
6. (Phase 1) Member opens **Mobile App**:

   * Logs in.
   * Sees updated **balance** and **history**.
7. **Fin Sec/Chairman** can drill into a specific member via:

   * Ledger member list → **Member Financial Report (3.4)** for full history.

---


* Add a **section per role** (what Chairman sees vs Fin Sec vs Provost) using this same spec.
