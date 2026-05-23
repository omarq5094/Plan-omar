const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const exportTitleInput = document.getElementById("exportTitle");

const generateBtn = document.getElementById("generateBtn");
const addColumnBtn = document.getElementById("addColumnBtn");
const exportPngBtn = document.getElementById("exportPngBtn");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const saveTableBtn = document.getElementById("saveTableBtn");
const myTablesBtn = document.getElementById("myTablesBtn");
const rangeFillBtn = document.getElementById("rangeFillBtn");
const changeUserBtn = document.getElementById("changeUserBtn");
const resetWidthsBtn = document.getElementById("resetWidthsBtn");
const completionToggleBtn = document.getElementById("completionToggleBtn");
const suggestionsToggleBtn = document.getElementById("suggestionsToggleBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

const showWeekdayToggle = document.getElementById("showWeekdayToggle");
const showGregorianToggle = document.getElementById("showGregorianToggle");
const showHijriToggle = document.getElementById("showHijriToggle");

const tableColGroup = document.getElementById("tableColGroup");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const statusBox = document.getElementById("status");
const captureArea = document.getElementById("captureArea");
const quickMenu = document.getElementById("quickMenu");
const inlineSuggestionsToggle = document.getElementById("inlineSuggestionsToggle");
const closeQuickMenuBtn = document.getElementById("closeQuickMenuBtn");
const suggestionGroups = document.getElementById("suggestionGroups");
const suggestionOptions = document.getElementById("suggestionOptions");
const exportHeaderTitle = document.getElementById("exportHeaderTitle");
const completionPanel = document.getElementById("completionPanel");
const completionPercent = document.getElementById("completionPercent");
const completionDetails = document.getElementById("completionDetails");
const completionBarFill = document.getElementById("completionBarFill");

const tablesModal = document.getElementById("tablesModal");
const closeTablesModalBtn = document.getElementById("closeTablesModalBtn");
const tableNameInput = document.getElementById("tableNameInput");
const saveNamedTableBtn = document.getElementById("saveNamedTableBtn");
const tablesList = document.getElementById("tablesList");

const visitorModal = document.getElementById("visitorModal");
const visitorNameInput = document.getElementById("visitorNameInput");
const visitorSubmitBtn = document.getElementById("visitorSubmitBtn");
const visitorStatus = document.getElementById("visitorStatus");

const rangeFillModal = document.getElementById("rangeFillModal");
const closeRangeFillBtn = document.getElementById("closeRangeFillBtn");
const rangeStartSelect = document.getElementById("rangeStartSelect");
const rangeEndSelect = document.getElementById("rangeEndSelect");
const rangeColumnSelect = document.getElementById("rangeColumnSelect");
const rangeTextInput = document.getElementById("rangeTextInput");
const applyRangeFillBtn = document.getElementById("applyRangeFillBtn");
const clearRangeFillBtn = document.getElementById("clearRangeFillBtn");

const STORAGE_KEY = "jadwalak_v7";
const SAVED_TABLES_KEY = "jadwalak_saved_tables_v1";
const VISITOR_NAME_KEY = "jadwalak_visitor_name_v1";
const VISITOR_ID_KEY = "jadwalak_visitor_id_v1";
const VISITOR_FIRST_LOGGED_KEY = "jadwalak_visitor_first_logged_v1";
const VISITOR_LAST_LOGGED_KEY = "jadwalak_visitor_last_logged_v1";
const COMPLETION_KEY = "jadwalak_completion_enabled_v1";
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzxtPBGvhWhS7yDWdbVNq21HzeBKCX4n0hC2FzpEhV06onol3osnz0_-vZhykLDr4jZ6w/exec";
const RETURN_VISIT_LOG_INTERVAL_MS = 30 * 60 * 1000;
const THEME_KEY = "jadwalak_theme_v1";
const SUGGESTIONS_KEY = "jadwalak_suggestions_v1";

const MIN_COLUMN_WIDTH = 55;
const MAX_COLUMN_WIDTH = 420;

let rows = [];
let customColumns = [];
let columnOrder = ["weekday", "gregorian", "hijri"];
let columnWidths = {
  weekday: 85,
  gregorian: 105,
  hijri: 115
};

let visibleBaseColumns = {
  weekday: true,
  gregorian: true,
  hijri: true
};

let completionEnabled = false;

const baseColumnMap = {
  weekday: { id: "weekday", name: "اليوم", fixed: true },
  gregorian: { id: "gregorian", name: "التاريخ الميلادي", fixed: true },
  hijri: { id: "hijri", name: "التاريخ الهجري", fixed: true }
};

const arabicWeekdays = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];


const suggestionGroupsData = [
  {
    id: "basic",
    name: "أساسية",
    options: ["مذاكرة", "مراجعة", "اختبار", "بريك", "مهمة", "منجز", "مؤجل"]
  },
  {
    id: "study",
    name: "دراسة",
    options: ["مراجعة نهائية", "حل نماذج", "تلخيص", "حفظ", "تدريب", "اختبار تجريبي", "واجب"]
  },
  {
    id: "status",
    name: "حالة",
    options: ["قيد التنفيذ", "لم يبدأ", "يحتاج مراجعة", "مكتمل جزئيًا", "ملغي", "مؤكد"]
  },
  {
    id: "organize",
    name: "تنظيم",
    options: ["راحة", "يوم خفيف", "يوم مكثف", "تعويض", "ترتيب ملاحظات", "تجهيز"]
  },
  {
    id: "general",
    name: "عام",
    options: ["موعد", "اجتماع", "تسليم", "متابعة", "ملاحظة", "قراءة", "بحث"]
  },
  {
    id: "priority",
    name: "أولوية",
    options: ["أولوية عالية", "أولوية متوسطة", "أولوية منخفضة", "عاجل", "غير عاجل"]
  }
];

let activeSuggestionGroupId = "basic";


function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("dark", safeTheme === "dark");
  themeToggleBtn.textContent = safeTheme === "dark" ? "☀️ لايت مود" : "🌙 دارك مود";
  localStorage.setItem(THEME_KEY, safeTheme);
}

function getCurrentTheme() {
  return document.body.classList.contains("dark") ? "dark" : "light";
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}


function suggestionsEnabled() {
  return localStorage.getItem(SUGGESTIONS_KEY) !== "off";
}

function applySuggestionsState(enabled) {
  const isEnabled = Boolean(enabled);
  document.body.classList.toggle("suggestions-off", !isEnabled);
  suggestionsToggleBtn.classList.toggle("off", !isEnabled);
  suggestionsToggleBtn.textContent = isEnabled ? "الاقتراحات: مفعلة" : "الاقتراحات: مقفلة";
  if (inlineSuggestionsToggle) {
    inlineSuggestionsToggle.classList.toggle("off", !isEnabled);
    inlineSuggestionsToggle.textContent = isEnabled ? "مفعلة" : "مغلقة";
  }
  localStorage.setItem(SUGGESTIONS_KEY, isEnabled ? "on" : "off");
  renderSuggestionMenu();

  if (!isEnabled) {
    hideQuickMenu();
  }
}

function setStatus(message) {
  statusBox.textContent = message;
  if (message) {
    setTimeout(() => {
      if (statusBox.textContent === message) statusBox.textContent = "";
    }, 2600);
  }
}

function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatGregorian(date) {
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("ar-SA", { month: "long", calendar: "gregory" }).format(date);
  return `${day} ${month}`;
}

function formatHijri(date) {
  try {
    const parts = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long"
    }).formatToParts(date);

    const day = parts.find(part => part.type === "day")?.value || "";
    const month = parts.find(part => part.type === "month")?.value || "";
    return `${day} ${month}`;
  } catch (error) {
    return "غير متاح";
  }
}

function createDateRows(start, end) {
  const generated = [];
  let current = new Date(start);

  while (current <= end) {
    generated.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      weekday: arabicWeekdays[current.getDay()],
      gregorian: formatGregorian(current),
      hijri: formatHijri(current),
      values: {}
    });

    current = addDays(current, 1);
  }

  return generated;
}

function normalizeRowsForCompletion() {
  rows = rows.map((row, index) => ({
    ...row,
    id: row.id || `row_${index}_${row.gregorian || ""}_${row.weekday || ""}`,
    values: row.values || {},
    completed: row.completed || {}
  }));
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getColumnById(columnId) {
  if (baseColumnMap[columnId]) return baseColumnMap[columnId];
  return customColumns.find(col => col.id === columnId);
}

function ensureColumnOrder() {
  const allIds = ["weekday", "gregorian", "hijri", ...customColumns.map(col => col.id)];
  const filtered = columnOrder.filter(id => allIds.includes(id));
  const missing = allIds.filter(id => !filtered.includes(id));
  columnOrder = [...filtered, ...missing];
}

function getVisibleColumns() {
  ensureColumnOrder();

  return columnOrder
    .map(getColumnById)
    .filter(Boolean)
    .filter(col => {
      if (col.fixed) return visibleBaseColumns[col.id] !== false;
      return true;
    });
}

function getColumnWidth(columnId) {
  return Math.min(
    MAX_COLUMN_WIDTH,
    Math.max(MIN_COLUMN_WIDTH, Number(columnWidths[columnId]) || 130)
  );
}

function renderColGroup() {
  tableColGroup.innerHTML = "";

  getVisibleColumns().forEach((col) => {
    const colElement = document.createElement("col");
    colElement.style.width = `${getColumnWidth(col.id)}px`;
    tableColGroup.appendChild(colElement);
  });
}

function createHeaderCell(col, visibleIndex) {
  const th = document.createElement("th");
  th.className = "resizable draggable-column";
  th.dataset.colId = col.id;
  th.dataset.visibleIndex = String(visibleIndex);
  th.draggable = true;

  const deleteButton = col.fixed
    ? ""
    : `<button class="delete-col" title="حذف العمود" data-delete-column-id="${col.id}">×</button>`;

  th.innerHTML = `
    <span class="column-title">
      <span class="drag-grip" title="اسحب لترتيب العمود">⋮⋮</span>
      ${deleteButton}
      ${escapeHTML(col.name)}
      <span class="width-hint">↔</span>
    </span>
    <span class="resize-handle" data-col-id="${col.id}"></span>
  `;

  return th;
}

function getCellValue(row, colId) {
  if (colId === "weekday") return row.weekday;
  if (colId === "gregorian") return row.gregorian;
  if (colId === "hijri") return row.hijri;
  return row.values?.[colId] || "";
}



function getOrCreateVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID ? crypto.randomUUID() : `visitor_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function getDeviceInfo() {
  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const browser = (() => {
    if (/Edg/i.test(ua)) return "Edge";
    if (/Chrome/i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
    if (/Firefox/i.test(ua)) return "Firefox";
    return "Browser";
  })();

  return `${browser} / ${isMobile ? "Mobile" : "Desktop"} / ${ua}`;
}

async function logVisitorEvent(name, eventType) {
  if (!GOOGLE_SHEET_WEB_APP_URL) return false;

  const payload = {
    name,
    eventType,
    userAgent: getDeviceInfo()
  };

  // نستخدم no-cors لأن Google Apps Script أحيانًا لا يرجع CORS مناسب.
  // حتى لو لم نقرأ الرد، الطلب يصل إلى الشيت.
  await fetch(GOOGLE_SHEET_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  return true;
}

function openVisitorModal() {
  visitorModal.classList.add("open");
  visitorModal.setAttribute("aria-hidden", "false");
  setTimeout(() => visitorNameInput.focus(), 80);
}

function closeVisitorModal() {
  visitorModal.classList.remove("open");
  visitorModal.setAttribute("aria-hidden", "true");
}

async function submitVisitorName() {
  const name = visitorNameInput.value.trim();

  if (!name) {
    visitorStatus.textContent = "اكتب اسمك أولًا.";
    return;
  }

  visitorSubmitBtn.disabled = true;
  visitorStatus.textContent = "جاري الدخول...";

  getOrCreateVisitorId();

  localStorage.setItem(VISITOR_NAME_KEY, name);
  localStorage.setItem(VISITOR_FIRST_LOGGED_KEY, "1");

  try {
    await logVisitorEvent(name, "new_user");
    localStorage.setItem(VISITOR_LAST_LOGGED_KEY, new Date().toISOString());
    closeVisitorModal();
    setStatus(`مرحبًا ${name}`);
  } catch (error) {
    console.error(error);
    // لا نعطل الموقع لو فشل Google Sheets.
    closeVisitorModal();
    setStatus(`مرحبًا ${name} — لم يتم تسجيل الدخول في Google Sheets.`);
  } finally {
    visitorSubmitBtn.disabled = false;
  }
}

async function initializeVisitorTracking() {
  getOrCreateVisitorId();

  const name = localStorage.getItem(VISITOR_NAME_KEY);
  const firstLogged = localStorage.getItem(VISITOR_FIRST_LOGGED_KEY);

  if (!name || !firstLogged) {
    openVisitorModal();
    return;
  }

  const lastLoggedAt = localStorage.getItem(VISITOR_LAST_LOGGED_KEY);
  const lastTime = lastLoggedAt ? new Date(lastLoggedAt).getTime() : 0;
  const now = Date.now();

  // حماية بسيطة من السبام:
  // لا نسجل return_visit أكثر من مرة خلال 30 دقيقة لنفس الجهاز.
  if (lastTime && now - lastTime < RETURN_VISIT_LOG_INTERVAL_MS) {
    return;
  }

  try {
    await logVisitorEvent(name, "return_visit");
    localStorage.setItem(VISITOR_LAST_LOGGED_KEY, new Date().toISOString());
  } catch (error) {
    console.warn("Visitor return log failed", error);
  }
}



function isTrackableTask(value) {
  const text = String(value || "").trim();
  if (!text) return false;

  const ignoredWords = ["بريك", "راحة", "اختبار"];
  return !ignoredWords.some(word => text.includes(word));
}

function getCompletionKey(rowId, colId) {
  return `${rowId}__${colId}`;
}

function applyCompletionState(enabled) {
  completionEnabled = Boolean(enabled);
  document.body.classList.toggle("completion-on", completionEnabled);
  completionToggleBtn.classList.toggle("on", completionEnabled);
  completionToggleBtn.textContent = completionEnabled ? "نظام الإنجاز: مفعّل" : "نظام الإنجاز: مغلق";
  localStorage.setItem(COMPLETION_KEY, completionEnabled ? "on" : "off");
  renderTable();
}

function getCompletionStats() {
  normalizeRowsForCompletion();

  let total = 0;
  let done = 0;

  rows.forEach(row => {
    customColumns.forEach(col => {
      const value = String(row.values?.[col.id] || "").trim();
      if (!isTrackableTask(value)) return;

      total += 1;
      const key = getCompletionKey(row.id, col.id);
      if (row.completed?.[key]) done += 1;
    });
  });

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
}

function updateCompletionPanel() {
  if (!completionPanel) return;

  const stats = getCompletionStats();
  completionPercent.textContent = `${stats.percent}%`;
  completionDetails.textContent = `${stats.done} من ${stats.total} مهمة منجزة`;
  completionBarFill.style.width = `${stats.percent}%`;
}

function toggleTaskCompletion(rowIndex, colId) {
  normalizeRowsForCompletion();

  const row = rows[rowIndex];
  if (!row) return;

  const value = String(row.values?.[colId] || "").trim();

  if (!isTrackableTask(value)) {
    setStatus("هذه الخلية لا تُحسب كمهمة.");
    return;
  }

  const key = getCompletionKey(row.id, colId);
  row.completed = row.completed || {};
  row.completed[key] = !row.completed[key];

  saveState();
  renderTable();
  updateCompletionPanel();
}


function getCurrentTableState() {
  return {
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    exportTitle: exportTitleInput.value,
    rows,
    customColumns,
    columnOrder,
    columnWidths,
    visibleBaseColumns,
    completionEnabled
  };
}

function applyTableState(state) {
  if (!state) return;

  startDateInput.value = state.startDate || "";
  endDateInput.value = state.endDate || "";
  exportTitleInput.value = state.exportTitle || "جدول الاختبارات";

  rows = Array.isArray(state.rows) ? state.rows : [];
  customColumns = Array.isArray(state.customColumns) ? state.customColumns : [];
  columnOrder = Array.isArray(state.columnOrder)
    ? state.columnOrder
    : ["weekday", "gregorian", "hijri", ...customColumns.map(col => col.id)];

  columnWidths = state.columnWidths || { weekday: 85, gregorian: 105, hijri: 115 };
  visibleBaseColumns = state.visibleBaseColumns || { weekday: true, gregorian: true, hijri: true };
  completionEnabled = Boolean(state.completionEnabled || localStorage.getItem(COMPLETION_KEY) === "on");
  document.body.classList.toggle("completion-on", completionEnabled);
  completionToggleBtn.classList.toggle("on", completionEnabled);
  completionToggleBtn.textContent = completionEnabled ? "نظام الإنجاز: مفعّل" : "نظام الإنجاز: مغلق";

  syncToggleInputs();
  renderTable();
  saveState();
}

function getSavedTables() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_TABLES_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function setSavedTables(tables) {
  localStorage.setItem(SAVED_TABLES_KEY, JSON.stringify(tables));
}

function openTablesModal() {
  tableNameInput.value = exportTitleInput.value.trim() || "جدول بدون اسم";
  renderSavedTables();
  tablesModal.classList.add("open");
  tablesModal.setAttribute("aria-hidden", "false");
  setTimeout(() => tableNameInput.focus(), 50);
}

function closeTablesModal() {
  tablesModal.classList.remove("open");
  tablesModal.setAttribute("aria-hidden", "true");
}

function formatSavedDate(isoDate) {
  if (!isoDate) return "";
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      calendar: "gregory",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function saveCurrentTableWithName(nameFromUser) {
  const name = (nameFromUser || tableNameInput.value || exportTitleInput.value || "").trim();

  if (!name) {
    setStatus("اكتب اسم الجدول أولًا.");
    return;
  }

  if (rows.length === 0) {
    setStatus("لا يوجد جدول لحفظه.");
    return;
  }

  const tables = getSavedTables();
  const now = new Date().toISOString();
  const existingIndex = tables.findIndex(table => table.name === name);

  const payload = {
    id: existingIndex >= 0 ? tables[existingIndex].id : (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    name,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? tables[existingIndex].createdAt : now,
    state: getCurrentTableState()
  };

  if (existingIndex >= 0) {
    const replace = confirm(`يوجد جدول باسم "${name}". هل تريد استبداله؟`);
    if (!replace) return;
    tables[existingIndex] = payload;
  } else {
    tables.unshift(payload);
  }

  setSavedTables(tables);
  exportTitleInput.value = name;
  renderSavedTables();
  saveState();
  setStatus("تم حفظ الجدول.");
}

function renderSavedTables() {
  const tables = getSavedTables();
  tablesList.innerHTML = "";

  if (tables.length === 0) {
    tablesList.innerHTML = `<div class="empty-tables">لا توجد جداول محفوظة حتى الآن.<br>اكتب اسم الجدول ثم اضغط حفظ.</div>`;
    return;
  }

  tables.forEach((table) => {
    const item = document.createElement("div");
    item.className = "table-item";
    item.innerHTML = `
      <div>
        <div class="table-item-title">${escapeHTML(table.name)}</div>
        <div class="table-item-meta">
          آخر تحديث: ${escapeHTML(formatSavedDate(table.updatedAt))}<br>
          عدد الأيام: ${escapeHTML(table.state?.rows?.length || 0)} — عدد الأعمدة المخصصة: ${escapeHTML(table.state?.customColumns?.length || 0)}
        </div>
      </div>
      <div class="table-actions">
        <button type="button" data-table-action="open" data-table-id="${escapeHTML(table.id)}">فتح</button>
        <button type="button" data-table-action="duplicate" data-table-id="${escapeHTML(table.id)}">نسخ</button>
        <button type="button" class="danger-action" data-table-action="delete" data-table-id="${escapeHTML(table.id)}">حذف</button>
      </div>
    `;
    tablesList.appendChild(item);
  });
}

function handleSavedTableAction(action, tableId) {
  const tables = getSavedTables();
  const table = tables.find(item => item.id === tableId);

  if (!table) {
    setStatus("لم يتم العثور على الجدول.");
    renderSavedTables();
    return;
  }

  if (action === "open") {
    const proceed = rows.length === 0 || confirm("فتح هذا الجدول سيستبدل الجدول الحالي على الشاشة. هل تريد المتابعة؟");
    if (!proceed) return;

    applyTableState(table.state);
    closeTablesModal();
    setStatus(`تم فتح جدول: ${table.name}`);
    return;
  }

  if (action === "duplicate") {
    const now = new Date().toISOString();
    const copy = {
      ...table,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: `${table.name} - نسخة`,
      createdAt: now,
      updatedAt: now,
      state: JSON.parse(JSON.stringify(table.state))
    };

    tables.unshift(copy);
    setSavedTables(tables);
    renderSavedTables();
    setStatus("تم نسخ الجدول.");
    return;
  }

  if (action === "delete") {
    const proceed = confirm(`حذف جدول "${table.name}"؟`);
    if (!proceed) return;

    setSavedTables(tables.filter(item => item.id !== tableId));
    renderSavedTables();
    setStatus("تم حذف الجدول.");
  }
}


function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      exportTitle: exportTitleInput.value,
      rows,
      customColumns,
      columnOrder,
      columnWidths,
      visibleBaseColumns,
      completionEnabled
    })
  );
}

function loadState() {
  // Migrate from older versions if possible.
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("jadwalak_v1");
  if (!saved) return false;

  try {
    const state = JSON.parse(saved);
    startDateInput.value = state.startDate || "";
    endDateInput.value = state.endDate || "";
    exportTitleInput.value = state.exportTitle || "جدول الاختبارات";

    rows = Array.isArray(state.rows) ? state.rows : [];
    normalizeRowsForCompletion();
    customColumns = Array.isArray(state.customColumns) ? state.customColumns : [];
    columnOrder = Array.isArray(state.columnOrder)
      ? state.columnOrder
      : ["weekday", "gregorian", "hijri", ...customColumns.map(col => col.id)];

    columnWidths = state.columnWidths || columnWidths;
    visibleBaseColumns = state.visibleBaseColumns || visibleBaseColumns;
    completionEnabled = Boolean(state.completionEnabled || localStorage.getItem(COMPLETION_KEY) === "on");
    document.body.classList.toggle("completion-on", completionEnabled);
    completionToggleBtn.classList.toggle("on", completionEnabled);
    completionToggleBtn.textContent = completionEnabled ? "نظام الإنجاز: مفعّل" : "نظام الإنجاز: مغلق";

    // v7 normalization.
    if (columnWidths.weekday > 120) columnWidths.weekday = 85;
    if (columnWidths.gregorian > 140) columnWidths.gregorian = 105;
    if (columnWidths.hijri > 140) columnWidths.hijri = 115;

    syncToggleInputs();
    renderTable();
    return rows.length > 0;
  } catch {
    return false;
  }
}

function syncToggleInputs() {
  showWeekdayToggle.checked = visibleBaseColumns.weekday !== false;
  showGregorianToggle.checked = visibleBaseColumns.gregorian !== false;
  showHijriToggle.checked = visibleBaseColumns.hijri !== false;
}

function renderTable() {
  normalizeRowsForCompletion();
  exportHeaderTitle.textContent = exportTitleInput.value.trim() || "جدول الاختبارات";
  renderColGroup();

  const visibleColumns = getVisibleColumns();

  tableHead.innerHTML = "";
  visibleColumns.forEach((col, index) => {
    tableHead.appendChild(createHeaderCell(col, index));
  });

  tableBody.innerHTML = "";

  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = Math.max(1, visibleColumns.length);
    td.className = "empty";
    td.textContent = "اختر المدة من الأعلى ثم اضغط إنشاء الجدول.";
    tr.appendChild(td);
    tableBody.appendChild(tr);
    return;
  }

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    visibleColumns.forEach((col) => {
      const td = document.createElement("td");
      const cellValue = getCellValue(row, col.id);

      if (!col.fixed && completionEnabled) {
        const key = getCompletionKey(row.id, col.id);
        const isDone = Boolean(row.completed?.[key]);
        const isTask = isTrackableTask(cellValue);

        if (isDone) td.classList.add("task-done");

        td.innerHTML = `
          <div class="completion-cell">
            <button class="complete-check ${isDone ? "done" : ""}" type="button" data-row-index="${rowIndex}" data-col-id="${col.id}" title="تحديد الإنجاز">${isDone ? "✓" : "○"}</button>
            <span class="completion-text" contenteditable="true" data-row-index="${rowIndex}" data-col-id="${col.id}">${escapeHTML(cellValue)}</span>
          </div>
        `;

        if (!isTask) {
          td.querySelector(".complete-check").style.opacity = "0.35";
        }
      } else {
        td.textContent = cellValue;

        if (!col.fixed) {
          td.contentEditable = "true";
          td.dataset.rowIndex = rowIndex;
          td.dataset.colId = col.id;
        }
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });

}

function resetDefaultWidths() {
  columnWidths = {
    weekday: 85,
    gregorian: 105,
    hijri: 115
  };

  customColumns.forEach(col => {
    columnWidths[col.id] = 130;
  });

  renderTable();
  saveState();
  setStatus("تم ضبط عرض الأعمدة.");
}

generateBtn.addEventListener("click", () => {
  if (!startDateInput.value || !endDateInput.value) {
    setStatus("حدد تاريخ البداية والنهاية أولًا.");
    return;
  }

  const start = parseLocalDate(startDateInput.value);
  const end = parseLocalDate(endDateInput.value);

  if (end < start) {
    setStatus("تاريخ النهاية يجب أن يكون بعد تاريخ البداية.");
    return;
  }

  const daysCount = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (daysCount > 370) {
    setStatus("الحد الأعلى سنة واحدة حتى يبقى الجدول خفيفًا.");
    return;
  }

  rows = createDateRows(start, end);
  normalizeRowsForCompletion();
  renderTable();
  saveState();
  setStatus("تم إنشاء الجدول بنجاح.");
});

addColumnBtn.addEventListener("click", () => {
  const name = prompt("اكتب اسم العمود الجديد، مثل: الخطة، الملاحظات، الحالة");
  if (!name || !name.trim()) return;

  const column = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    name: name.trim(),
    fixed: false
  };

  customColumns.push(column);
  columnOrder.push(column.id);
  columnWidths[column.id] = 130;

  rows = rows.map(row => ({
    ...row,
    values: {
      ...(row.values || {}),
      [column.id]: ""
    }
  }));

  renderTable();
  saveState();
  setStatus(`تمت إضافة عمود: ${column.name}`);
});

tableHead.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-column-id]");
  if (!button) return;

  const colId = button.dataset.deleteColumnId;
  const column = customColumns.find(col => col.id === colId);
  if (!column) return;

  const confirmed = confirm(`حذف عمود "${column.name}"؟`);
  if (!confirmed) return;

  customColumns = customColumns.filter(col => col.id !== colId);
  columnOrder = columnOrder.filter(id => id !== colId);
  delete columnWidths[colId];

  rows = rows.map(row => {
    const values = { ...(row.values || {}) };
    delete values[colId];
    return { ...row, values };
  });

  renderTable();
  saveState();
  setStatus("تم حذف العمود.");
});

tableBody.addEventListener("input", (event) => {
  const cell = getEditableSuggestionTarget(event.target);
  if (!cell) return;

  const meta = getEditableMeta(cell);
  if (!meta || !rows[meta.rowIndex]) return;

  const nextValue = cell.textContent.trim();
  setEditableValue(cell, nextValue);

  updateCompletionPanel();
  saveState();
});

copyBtn.addEventListener("click", async () => {
  if (rows.length === 0) {
    setStatus("لا يوجد جدول لنسخه.");
    return;
  }

  const visibleColumns = getVisibleColumns();
  const headers = visibleColumns.map(col => col.name);
  const lines = [headers.join("\t")];

  rows.forEach(row => {
    lines.push(visibleColumns.map(col => getCellValue(row, col.id)).join("\t"));
  });

  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    setStatus("تم نسخ الجدول.");
  } catch {
    setStatus("تعذر النسخ تلقائيًا. جرّب تحديد الجدول يدويًا.");
  }
});




function openRangeFillModal() {
  if (rows.length === 0) {
    setStatus("أنشئ الجدول أولًا قبل تعبئة النطاق.");
    return;
  }

  const editableColumns = customColumns.slice();

  if (editableColumns.length === 0) {
    setStatus("أضف عمودًا مثل الخطة أولًا.");
    return;
  }

  rangeStartSelect.innerHTML = "";
  rangeEndSelect.innerHTML = "";
  rangeColumnSelect.innerHTML = "";

  rows.forEach((row, index) => {
    const label = `${row.gregorian} — ${row.weekday}`;
    const startOption = new Option(label, String(index));
    const endOption = new Option(label, String(index));
    rangeStartSelect.add(startOption);
    rangeEndSelect.add(endOption);
  });

  rangeEndSelect.value = String(rows.length - 1);

  editableColumns.forEach((col) => {
    rangeColumnSelect.add(new Option(col.name, col.id));
  });

  rangeTextInput.value = "";
  rangeFillModal.classList.add("open");
  rangeFillModal.setAttribute("aria-hidden", "false");
  setTimeout(() => rangeTextInput.focus(), 80);
}

function closeRangeFillModal() {
  rangeFillModal.classList.remove("open");
  rangeFillModal.setAttribute("aria-hidden", "true");
}

function applyRangeFill({ clear = false } = {}) {
  if (rows.length === 0) return;

  const startIndex = Number(rangeStartSelect.value);
  const endIndex = Number(rangeEndSelect.value);
  const colId = rangeColumnSelect.value;
  const text = clear ? "" : rangeTextInput.value.trim();

  if (!colId) {
    setStatus("اختر العمود أولًا.");
    return;
  }

  if (!clear && !text) {
    setStatus("اكتب النص الذي تريد تعبئته.");
    return;
  }

  const from = Math.min(startIndex, endIndex);
  const to = Math.max(startIndex, endIndex);

  for (let i = from; i <= to; i++) {
    rows[i].values = rows[i].values || {};
    rows[i].values[colId] = text;
  }

  renderTable();
  saveState();
  closeRangeFillModal();

  const actionText = clear ? "تم مسح النطاق." : "تمت تعبئة النطاق.";
  setStatus(actionText);
}

async function changeVisitorName() {
  const currentName = localStorage.getItem(VISITOR_NAME_KEY) || "";
  const newName = prompt("اكتب الاسم الجديد:", currentName);

  if (newName === null) return;

  const cleanName = newName.trim();
  if (!cleanName) {
    setStatus("لم يتم تغيير الاسم؛ الاسم فارغ.");
    return;
  }

  const oldName = currentName;
  localStorage.setItem(VISITOR_NAME_KEY, cleanName);
  localStorage.setItem(VISITOR_FIRST_LOGGED_KEY, "1");

  try {
    await logVisitorEvent(cleanName, oldName && oldName !== cleanName ? "name_change" : "new_user");
    localStorage.setItem(VISITOR_LAST_LOGGED_KEY, new Date().toISOString());
    setStatus(`تم تغيير الاسم إلى ${cleanName}.`);
  } catch (error) {
    console.warn("Name change log failed", error);
    setStatus(`تم تغيير الاسم إلى ${cleanName}، لكن لم يتم تسجيله في Google Sheets.`);
  }
}



rangeFillBtn.addEventListener("click", openRangeFillModal);
closeRangeFillBtn.addEventListener("click", closeRangeFillModal);

rangeFillModal.addEventListener("click", (event) => {
  if (event.target === rangeFillModal) closeRangeFillModal();
});

applyRangeFillBtn.addEventListener("click", () => applyRangeFill({ clear: false }));
clearRangeFillBtn.addEventListener("click", () => applyRangeFill({ clear: true }));

rangeTextInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applyRangeFill({ clear: false });
  }
});

changeUserBtn.addEventListener("click", changeVisitorName);


visitorSubmitBtn.addEventListener("click", submitVisitorName);

visitorNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitVisitorName();
  }
});


saveTableBtn.addEventListener("click", () => {
  openTablesModal();
});

myTablesBtn.addEventListener("click", () => {
  openTablesModal();
});

saveNamedTableBtn.addEventListener("click", () => {
  saveCurrentTableWithName();
});

tableNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveCurrentTableWithName();
  }
});

closeTablesModalBtn.addEventListener("click", closeTablesModal);

tablesModal.addEventListener("click", (event) => {
  if (event.target === tablesModal) closeTablesModal();
});

tablesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-table-action]");
  if (!button) return;

  handleSavedTableAction(button.dataset.tableAction, button.dataset.tableId);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (tablesModal.classList.contains("open")) {
    closeTablesModal();
  }

  if (rangeFillModal.classList.contains("open")) {
    closeRangeFillModal();
  }
});


resetBtn.addEventListener("click", () => {
  const confirmed = confirm("هل تريد مسح الجدول وكل الأعمدة؟");
  if (!confirmed) return;

  rows = [];
  customColumns = [];
  columnOrder = ["weekday", "gregorian", "hijri"];
  columnWidths = { weekday: 85, gregorian: 105, hijri: 115 };
  visibleBaseColumns = { weekday: true, gregorian: true, hijri: true };
  syncToggleInputs();

  startDateInput.value = "";
  endDateInput.value = "";
  exportTitleInput.value = "جدول الاختبارات";

  localStorage.removeItem(STORAGE_KEY);
  renderTable();
  setStatus("تم مسح الجدول.");
});

resetWidthsBtn.addEventListener("click", resetDefaultWidths);

themeToggleBtn.addEventListener("click", () => {
  applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
});

suggestionsToggleBtn.addEventListener("click", () => {
  applySuggestionsState(!suggestionsEnabled());
});

completionToggleBtn.addEventListener("click", () => {
  applyCompletionState(!completionEnabled);
});

[showWeekdayToggle, showGregorianToggle, showHijriToggle].forEach(toggle => {
  toggle.addEventListener("change", () => {
    visibleBaseColumns,
    completionEnabled = {
      weekday: showWeekdayToggle.checked,
      gregorian: showGregorianToggle.checked,
      hijri: showHijriToggle.checked
    };

    if (!visibleBaseColumns.weekday && !visibleBaseColumns.gregorian && !visibleBaseColumns.hijri && customColumns.length === 0) {
      visibleBaseColumns,
    completionEnabled.weekday = true;
      showWeekdayToggle.checked = true;
      setStatus("لا يمكن إخفاء كل الأعمدة بدون إضافة عمود مخصص.");
    }

    renderTable();
    saveState();
  });
});

exportTitleInput.addEventListener("input", () => {
  exportHeaderTitle.textContent = exportTitleInput.value.trim() || "جدول الاختبارات";
  saveState();
});

let resizeState = null;

tableHead.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".resize-handle");
  if (!handle) return;

  event.preventDefault();

  const colId = handle.dataset.colId;
  if (!colId) return;

  resizeState = {
    colId,
    startX: event.clientX,
    startWidth: getColumnWidth(colId)
  };

  document.body.classList.add("resizing-columns");
  handle.setPointerCapture(event.pointerId);
});

tableHead.addEventListener("pointermove", (event) => {
  if (!resizeState) return;

  const delta = resizeState.startX - event.clientX;
  const nextWidth = Math.min(
    MAX_COLUMN_WIDTH,
    Math.max(MIN_COLUMN_WIDTH, resizeState.startWidth + delta)
  );

  columnWidths[resizeState.colId] = nextWidth;
  renderColGroup();
});

tableHead.addEventListener("pointerup", () => {
  if (!resizeState) return;
  resizeState = null;
  document.body.classList.remove("resizing-columns");
  saveState();
});

tableHead.addEventListener("pointercancel", () => {
  resizeState = null;
  document.body.classList.remove("resizing-columns");
});

let draggedColumnId = null;

tableHead.addEventListener("dragstart", (event) => {
  const th = event.target.closest("th[data-col-id]");
  if (!th || event.target.closest(".resize-handle") || event.target.closest(".delete-col")) {
    event.preventDefault();
    return;
  }

  draggedColumnId = th.dataset.colId;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedColumnId);
});

tableHead.addEventListener("dragover", (event) => {
  const th = event.target.closest("th[data-col-id]");
  if (!th || !draggedColumnId) return;

  event.preventDefault();
  th.classList.add("drag-over");
});

tableHead.addEventListener("dragleave", (event) => {
  const th = event.target.closest("th[data-col-id]");
  if (th) th.classList.remove("drag-over");
});

tableHead.addEventListener("drop", (event) => {
  const th = event.target.closest("th[data-col-id]");
  if (!th || !draggedColumnId) return;

  event.preventDefault();
  th.classList.remove("drag-over");

  const targetColumnId = th.dataset.colId;
  if (targetColumnId === draggedColumnId) return;

  ensureColumnOrder();
  const fromIndex = columnOrder.indexOf(draggedColumnId);
  const toIndex = columnOrder.indexOf(targetColumnId);

  if (fromIndex === -1 || toIndex === -1) return;

  const [moved] = columnOrder.splice(fromIndex, 1);
  columnOrder.splice(toIndex, 0, moved);

  draggedColumnId = null;
  renderTable();
  saveState();
  setStatus("تم تغيير ترتيب الأعمدة.");
});

tableHead.addEventListener("dragend", () => {
  draggedColumnId = null;
  tableHead.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
});




function getEditableSuggestionTarget(target) {
  return target.closest(".completion-text[contenteditable='true'], td[contenteditable='true']");
}

function getEditableMeta(editable) {
  if (!editable) return null;

  const rowIndex = Number(editable.dataset.rowIndex);
  const colId = editable.dataset.colId;

  if (!Number.isFinite(rowIndex) || !colId) return null;

  return { rowIndex, colId };
}

function setEditableValue(editable, value) {
  const meta = getEditableMeta(editable);
  if (!meta || !rows[meta.rowIndex]) return false;

  normalizeRowsForCompletion();

  rows[meta.rowIndex].values = rows[meta.rowIndex].values || {};
  rows[meta.rowIndex].values[meta.colId] = value;

  if (!isTrackableTask(value)) {
    const key = getCompletionKey(rows[meta.rowIndex].id, meta.colId);
    if (rows[meta.rowIndex].completed) delete rows[meta.rowIndex].completed[key];
  }

  return true;
}

function renderSuggestionMenu() {
  if (!suggestionGroups || !suggestionOptions) return;

  const isEnabled = suggestionsEnabled();

  suggestionGroups.innerHTML = "";
  suggestionOptions.innerHTML = "";

  if (!isEnabled) {
    suggestionOptions.innerHTML = `<div class="quick-menu-disabled">الاقتراحات مغلقة.<br>فعّلها من الزر بالأعلى عند الحاجة.</div>`;
    return;
  }

  suggestionGroupsData.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `group-btn ${group.id === activeSuggestionGroupId ? "active" : ""}`;
    button.dataset.groupId = group.id;
    button.textContent = group.name;
    suggestionGroups.appendChild(button);
  });

  const activeGroup = suggestionGroupsData.find(group => group.id === activeSuggestionGroupId) || suggestionGroupsData[0];

  activeGroup.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.dataset.preset = option;
    button.textContent = option;
    suggestionOptions.appendChild(button);
  });
}


let activeEditableCell = null;

function hideQuickMenu() {
  quickMenu.classList.remove("open");
  quickMenu.setAttribute("aria-hidden", "true");
}

function showQuickMenuForCell(cell) {
  if (!suggestionsEnabled()) return;

  activeEditableCell = cell;
  renderSuggestionMenu();

  if (isMobileViewport()) {
    quickMenu.style.top = "";
    quickMenu.style.left = "";
    quickMenu.style.right = "";
    quickMenu.style.bottom = "";
    quickMenu.classList.add("open");
    quickMenu.setAttribute("aria-hidden", "false");
    return;
  }

  const rect = cell.getBoundingClientRect();
  const menuWidth = 390;
  const menuHeight = 430;

  const top = Math.max(8, Math.min(window.innerHeight - menuHeight - 8, rect.bottom + 6));
  const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, rect.left));

  quickMenu.style.top = `${top}px`;
  quickMenu.style.left = `${left}px`;
  quickMenu.style.right = "auto";
  quickMenu.style.bottom = "auto";
  quickMenu.classList.add("open");
  quickMenu.setAttribute("aria-hidden", "false");
}

tableBody.addEventListener("focusin", (event) => {
  const cell = getEditableSuggestionTarget(event.target);
  if (!cell || !suggestionsEnabled()) return;
  showQuickMenuForCell(cell);
});

tableBody.addEventListener("click", (event) => {
  if (event.target.closest(".complete-check")) return;

  const cell = getEditableSuggestionTarget(event.target);
  if (!cell || !suggestionsEnabled()) return;
  showQuickMenuForCell(cell);
});


tableBody.addEventListener("click", (event) => {
  const check = event.target.closest(".complete-check");
  if (!check) return;

  event.preventDefault();
  event.stopPropagation();

  toggleTaskCompletion(Number(check.dataset.rowIndex), check.dataset.colId);
});


quickMenu.addEventListener("mousedown", (event) => {
  event.preventDefault();
});

quickMenu.addEventListener("click", (event) => {
  const closeButton = event.target.closest("#closeQuickMenuBtn");
  if (closeButton) {
    hideQuickMenu();
    return;
  }

  const toggle = event.target.closest("#inlineSuggestionsToggle");
  if (toggle) {
    applySuggestionsState(!suggestionsEnabled());
    return;
  }

  const groupButton = event.target.closest("[data-group-id]");
  if (groupButton) {
    activeSuggestionGroupId = groupButton.dataset.groupId;
    renderSuggestionMenu();
    return;
  }

  const button = event.target.closest("[data-preset]");
  if (!button || !activeEditableCell || !suggestionsEnabled()) return;

  const preset = button.dataset.preset;
  const applied = setEditableValue(activeEditableCell, preset);

  if (applied) {
    saveState();
    renderTable();
    updateCompletionPanel();
  }

  hideQuickMenu();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#quickMenu")) return;
  if (event.target.closest(".completion-text[contenteditable='true'], td[contenteditable='true']")) return;
  hideQuickMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideQuickMenu();
});

window.addEventListener("scroll", () => {
  if (!isMobileViewport()) hideQuickMenu();
}, true);
window.addEventListener("resize", hideQuickMenu);


function isMobileViewport() {
  return window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
}

function buildExportClone() {
  const visibleColumns = getVisibleColumns();
  const theme = getCurrentTheme();
  const columnCount = Math.max(visibleColumns.length, 1);

  // عرض ثابت مخصص للتصدير حتى لا يقص الجدول في الجوال.
  // كلما زادت الأعمدة زاد العرض، لكن لا يقل عن 900px.
  const exportWidth = Math.max(900, columnCount * 170);

  const wrapper = document.createElement("div");
  wrapper.className = `export-sheet ${theme === "dark" ? "dark-export" : "light-export"}`;
  wrapper.style.width = `${exportWidth}px`;
  wrapper.style.direction = "rtl";
  wrapper.style.fontFamily = "Tahoma, Arial, sans-serif";

  const header = document.createElement("div");
  header.className = "export-header";
  const stats = getCompletionStats();
  const completionLine = completionEnabled ? `<div style="font-weight:800;margin-top:6px;">إنجازك: ${stats.percent}% — ${stats.done} من ${stats.total} مهمة منجزة</div>` : "";
  header.innerHTML = `<h3>${escapeHTML(exportTitleInput.value.trim() || "جدول الاختبارات")}</h3>${completionLine}`;
  wrapper.appendChild(header);

  const table = document.createElement("table");

  const colgroup = document.createElement("colgroup");
  visibleColumns.forEach((col) => {
    const colEl = document.createElement("col");
    const baseWidth = col.fixed ? 150 : 190;
    colEl.style.width = `${Math.max(baseWidth, getColumnWidth(col.id))}px`;
    colgroup.appendChild(colEl);
  });
  table.appendChild(colgroup);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  visibleColumns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col.name;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    visibleColumns.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = getCellValue(row, col.id);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);

  const footer = document.createElement("div");
  footer.className = "export-footer";
  footer.textContent = "Made with omar al ghrman";
  wrapper.appendChild(footer);

  const holder = document.createElement("div");
  holder.className = "export-only-area";
  holder.appendChild(wrapper);
  document.body.appendChild(holder);

  return { holder, wrapper, exportWidth };
}

async function exportTableAsPng() {
  const { holder, wrapper, exportWidth } = buildExportClone();
  const theme = getCurrentTheme();

  try {
    // ننتظر فريم واحد حتى يأخذ المتصفح القياسات الصحيحة للنسخة المخفية.
    await new Promise(resolve => requestAnimationFrame(resolve));

    const canvas = await html2canvas(wrapper, {
      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
      scale: isMobileViewport() ? 2 : 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: exportWidth,
      windowWidth: exportWidth,
      windowHeight: wrapper.scrollHeight
    });

    const link = document.createElement("a");
    link.download = "jadwalak-table.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    setStatus("تم تصدير الصورة بنجاح.");
  } finally {
    holder.remove();
  }
}


exportPngBtn.addEventListener("click", async () => {
  if (rows.length === 0) {
    setStatus("لا يوجد جدول لتصديره.");
    return;
  }

  if (typeof html2canvas === "undefined") {
    setStatus("تصدير الصورة يحتاج اتصالًا بالإنترنت لتحميل مكتبة html2canvas.");
    return;
  }

  try {
    setStatus("جاري تجهيز الصورة...");
    await exportTableAsPng();
  } catch (error) {
    console.error(error);
    setStatus("تعذر تصدير الصورة. جرّب تشغيل الموقع عبر GitHub Pages بدل فتح الملف مباشرة.");
  }
});

(function initDefaults() {
  loadTheme();
  applySuggestionsState(suggestionsEnabled());
  completionEnabled = localStorage.getItem(COMPLETION_KEY) === "on";
  document.body.classList.toggle("completion-on", completionEnabled);
  completionToggleBtn.classList.toggle("on", completionEnabled);
  completionToggleBtn.textContent = completionEnabled ? "نظام الإنجاز: مفعّل" : "نظام الإنجاز: مغلق";
  initializeVisitorTracking();
  const loaded = loadState();
  if (!loaded) {
    const today = new Date();
    startDateInput.value = toInputDate(today);
    endDateInput.value = toInputDate(addDays(today, 14));
    exportTitleInput.value = "جدول الاختبارات";
    syncToggleInputs();
    renderTable();
  }
})();
