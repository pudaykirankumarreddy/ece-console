import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock, AlertTriangle, CheckCircle2, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Gauge, Settings2, Loader2, X, Check, Minus
} from "lucide-react";

const COURSES = [
  { code: "EC-301", name: "Digital Communication", faculty: "Prof. R. H. Laskar (RHL)" },
  { code: "EC-302", name: "Microprocessors and Microcontrollers", faculty: "Dr. C. Choudhury (CC)" },
  { code: "EC-303", name: "Analog Integrated Circuits & Technology", faculty: "Dr. Rajesh Saha (RS)" },
  { code: "EC-304", name: "Digital Signal Processing", faculty: "Dr. R. K. Karsh (RKK)" },
  { code: "EC-305", name: "Measurements and Instrumentation", faculty: "Prof. F. A. Talukdar (FAT)" },
  { code: "EC-306", name: "Principles of Optoelectronics and Optical Fibers", faculty: "Dr. M. Banerjee (MB)" },
  { code: "EC-311", name: "Microprocessor Lab", faculty: "Dr. A. Nandi (A1) / Dr. R. K. Karsh (A2)" },
  { code: "EC-312", name: "DSP Lab", faculty: "Prof. F. A. Talukdar (A1) / Dr. D. Goswami (A2)" },
  { code: "EC-313", name: "Digital Communication Lab", faculty: "Prof. R. H. Laskar (A1) / Dr. Wasim Arif (A2)" },
];
const COURSE_MAP = Object.fromEntries(COURSES.map((c) => [c.code, c]));

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SCHEDULE = {
  Monday: [
    { s: "08:00", e: "09:00", label: "No Class", type: "off" },
    { s: "09:00", e: "10:00", label: "EC-302", sub: "Microprocessors & Microcontrollers · CC", type: "lecture", course: "EC-302" },
    { s: "10:00", e: "11:00", label: "EC-305", sub: "Measurements & Instrumentation · FAT", type: "lecture", course: "EC-305" },
    { s: "11:00", e: "12:00", label: "EC-301", sub: "Digital Communication · RHL", type: "lecture", course: "EC-301" },
    { s: "12:00", e: "13:00", label: "Break", type: "break" },
    { s: "13:00", e: "14:00", label: "EC-303", sub: "Analog IC & Technology · RS", type: "lecture", course: "EC-303" },
    { s: "14:00", e: "16:00", label: "Lab", sub: "EC-311 (A1) AN / EC-312 (A2) DG", type: "lab", a1: "EC-311", a2: "EC-312" },
    { s: "16:00", e: "18:00", label: "Minor", type: "minor" },
  ],
  Tuesday: [
    { s: "08:00", e: "09:00", label: "No Class", type: "off" },
    { s: "09:00", e: "10:00", label: "EC-304", sub: "Digital Signal Processing · RKK", type: "lecture", course: "EC-304" },
    { s: "10:00", e: "11:00", label: "EC-305", sub: "Measurements & Instrumentation · FAT", type: "lecture", course: "EC-305" },
    { s: "11:00", e: "12:00", label: "EC-301", sub: "Digital Communication · RHL", type: "lecture", course: "EC-301" },
    { s: "12:00", e: "13:00", label: "Break", type: "break" },
    { s: "13:00", e: "14:00", label: "EC-303", sub: "Analog IC & Technology · RS", type: "lecture", course: "EC-303" },
    { s: "14:00", e: "16:00", label: "Lab", sub: "EC-313 (A1) RHL / EC-311 (A2) RKK", type: "lab", a1: "EC-313", a2: "EC-311" },
    { s: "16:00", e: "18:00", label: "Minor", type: "minor" },
  ],
  Wednesday: [
    { s: "08:00", e: "09:00", label: "No Class", type: "off" },
    { s: "09:00", e: "10:00", label: "EC-303", sub: "Analog IC & Technology · RS", type: "lecture", course: "EC-303" },
    { s: "10:00", e: "11:00", label: "EC-306", sub: "Optoelectronics & Optical Fibers · MB", type: "lecture", course: "EC-306" },
    { s: "11:00", e: "12:00", label: "EC-301", sub: "Digital Communication · RHL", type: "lecture", course: "EC-301" },
    { s: "12:00", e: "13:00", label: "Break", type: "break" },
    { s: "13:00", e: "14:00", label: "EC-304", sub: "Digital Signal Processing · RKK", type: "lecture", course: "EC-304" },
    { s: "14:00", e: "16:00", label: "Lab", sub: "EC-312 (A1) FAT / EC-313 (A2) WA", type: "lab", a1: "EC-312", a2: "EC-313" },
    { s: "16:00", e: "18:00", label: "Minor", type: "minor" },
  ],
  Thursday: [
    { s: "08:00", e: "09:00", label: "No Class", type: "off" },
    { s: "09:00", e: "10:00", label: "EC-304", sub: "Digital Signal Processing · RKK", type: "lecture", course: "EC-304" },
    { s: "10:00", e: "11:00", label: "EC-305", sub: "Measurements & Instrumentation · FAT", type: "lecture", course: "EC-305" },
    { s: "11:00", e: "12:00", label: "EC-306", sub: "Optoelectronics & Optical Fibers · MB", type: "lecture", course: "EC-306" },
    { s: "12:00", e: "13:00", label: "Break", type: "break" },
    { s: "13:00", e: "14:00", label: "EC-302", sub: "Microprocessors & Microcontrollers · CC", type: "lecture", course: "EC-302" },
    { s: "14:00", e: "15:00", label: "EC-302 (T)", sub: "Tutorial · CC", type: "tutorial", course: "EC-302" },
    { s: "15:00", e: "18:00", label: "Minor", type: "minor" },
  ],
  Friday: [
    { s: "08:00", e: "09:00", label: "No Class", type: "off" },
    { s: "09:00", e: "10:00", label: "EC-302", sub: "Microprocessors & Microcontrollers · CC", type: "lecture", course: "EC-302" },
    { s: "10:00", e: "11:00", label: "EC-301 (T)", sub: "Tutorial · RHL", type: "tutorial", course: "EC-301" },
    { s: "11:00", e: "12:00", label: "EC-306", sub: "Optoelectronics & Optical Fibers · MB", type: "lecture", course: "EC-306" },
    { s: "12:00", e: "13:00", label: "Break", type: "break" },
    { s: "13:00", e: "14:00", label: "EC-304 (T)", sub: "Tutorial · RKK", type: "tutorial", course: "EC-304" },
    { s: "14:00", e: "15:00", label: "EC-303 (T)", sub: "Tutorial · RS", type: "tutorial", course: "EC-303" },
    { s: "15:00", e: "18:00", label: "Minor", type: "minor" },
  ],
};

const TYPE_STYLE = {
  off:      { bg: "#1B2432", border: "#2A3547", text: "#5C6B82" },
  lecture:  { bg: "#132A3F", border: "#1F5D8C", text: "#7FC4F5" },
  lab:      { bg: "#152A22", border: "#2F7A55", text: "#7FE0AC" },
  tutorial: { bg: "#2B2313", border: "#8C6A1F", text: "#F0C868" },
  minor:    { bg: "#231623", border: "#6A2F8C", text: "#D79AF0" },
  break:    { bg: "#1B2432", border: "#2A3547", text: "#5C6B82" },
};

const ATT_LOG_KEY = "attendance-log";
const MANUAL_KEY = "attendance-manual";
const CRIT_KEY = "attendance-criteria";
const BATCH_KEY = "lab-batch";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function startOfWeek(d) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function isoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isSameDate(a, b) { return isoDate(a) === isoDate(b); }
function toMinutes(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }
function nowMinutes() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }

function Gauge90({ pct, criteria, size = 84 }) {
  const clamped = clamp(pct, 0, 1);
  const angle = clamped * 180;
  const r = size / 2 - 8, cx = size / 2, cy = size / 2;
  const toXY = (deg) => {
    const rad = (Math.PI * (180 - deg)) / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
  };
  const [nx, ny] = toXY(angle);
  const arcPath = (deg) => {
    const [x2, y2] = toXY(deg);
    const l = deg > 180 ? 1 : 0;
    return `M ${cx - r} ${cy} A ${r} ${r} 0 ${l} 1 ${x2} ${y2}`;
  };
  const below = clamped < criteria;
  const color = below ? "#E3543F" : "#4CD07D";
  const critAngle = criteria * 180;
  const [cxx, cyy] = toXY(critAngle);

  return (
    <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`}>
      <path d={arcPath(180)} fill="none" stroke="#233042" strokeWidth="8" strokeLinecap="round" />
      <path d={arcPath(angle)} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <line x1={cxx} y1={cyy} x2={cx + (cxx - cx) * 1.18} y2={cy + (cyy - cy) * 1.18}
            stroke="#F2A93B" strokeWidth="2" strokeDasharray="2,2" />
      <circle cx={nx} cy={ny} r="4.5" fill={color} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
            fontSize="15" fontWeight="700" fill="#E8ECF1">
        {Math.round(clamped * 100)}%
      </text>
    </svg>
  );
}

function Stepper({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] uppercase tracking-wide text-[#5C6B82] w-16 font-mono">{label}</span>
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-6 h-6 flex items-center justify-center rounded bg-[#1B2432] border border-[#2A3547] text-[#7FC4F5] hover:border-[#4C9EEB] transition-colors"
        aria-label={`decrease ${label}`}>
        <ChevronDown size={13} />
      </button>
      <input type="number" min={0} value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-12 text-center bg-[#0F1B2B] border border-[#2A3547] rounded py-0.5 text-[#E8ECF1] font-mono text-sm focus:outline-none focus:border-[#4C9EEB]" />
      <button onClick={() => onChange(value + 1)}
        className="w-6 h-6 flex items-center justify-center rounded bg-[#1B2432] border border-[#2A3547] text-[#7FC4F5] hover:border-[#4C9EEB] transition-colors"
        aria-label={`increase ${label}`}>
        <ChevronUp size={13} />
      </button>
    </div>
  );
}

function MarkRow({ mark, onMark }) {
  const status = mark?.status || null;
  const opts = [
    { key: "present", icon: Check, label: "Present", color: "#4CD07D", bg: "#152A22", border: "#2F7A55" },
    { key: "absent", icon: X, label: "Absent", color: "#E3543F", bg: "#2B1512", border: "#6A2F26" },
    { key: "cancelled", icon: Minus, label: "Cancelled", color: "#8492A6", bg: "#1B2432", border: "#2A3547" },
  ];
  return (
    <div className="flex gap-1.5 mt-2">
      {opts.map((o) => {
        const active = status === o.key;
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            onClick={() => onMark(active ? null : o.key)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors"
            style={{
              background: active ? o.bg : "#0F1B2B",
              border: `1px solid ${active ? o.border : "#233042"}`,
              color: active ? o.color : "#5C6B82",
            }}
          >
            <Icon size={11} /> {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ECEConsole() {
  const [tab, setTab] = useState("timetable");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [dayIdx, setDayIdx] = useState(() => {
    const d = new Date().getDay();
    return d >= 1 && d <= 5 ? d - 1 : 0;
  });
  const [log, setLog] = useState({});
  const [manual, setManual] = useState({});
  const [criteria, setCriteria] = useState(0.8);
  const [batch, setBatch] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState("idle");

  useEffect(() => {
    try {
      const l = localStorage.getItem(ATT_LOG_KEY);
      if (l) setLog(JSON.parse(l));
    } catch (e) {}
    try {
      const m = localStorage.getItem(MANUAL_KEY);
      if (m) setManual(JSON.parse(m));
    } catch (e) {}
    try {
      const c = localStorage.getItem(CRIT_KEY);
      if (c) setCriteria(Number(c));
    } catch (e) {}
    try {
      const b = localStorage.getItem(BATCH_KEY);
      if (b) setBatch(b);
    } catch (e) {}
    setLoaded(true);
  }, []);

  const persistLog = useCallback((next) => {
    setSaveState("saving");
    try {
      localStorage.setItem(ATT_LOG_KEY, JSON.stringify(next));
      setSaveState("saved");
    } catch (e) { setSaveState("error"); }
  }, []);
  const persistManual = useCallback((next) => {
    try { localStorage.setItem(MANUAL_KEY, JSON.stringify(next)); } catch (e) {}
  }, []);
  const persistCriteria = useCallback((next) => {
    try { localStorage.setItem(CRIT_KEY, String(next)); } catch (e) {}
  }, []);
  const persistBatch = useCallback((next) => {
    try { localStorage.setItem(BATCH_KEY, next); } catch (e) {}
  }, []);

  const weekDates = useMemo(() => DAYS.map((_, i) => addDays(weekStart, i)), [weekStart]);
  const activeDate = weekDates[dayIdx];
  const activeDateISO = isoDate(activeDate);
  const activeDayName = DAYS[dayIdx];
  const today = new Date();

  const setMark = (periodIdx, code, status) => {
    setLog((prev) => {
      const dayLog = { ...(prev[activeDateISO] || {}) };
      if (status === null) {
        delete dayLog[periodIdx];
      } else {
        dayLog[periodIdx] = { code, status };
      }
      const next = { ...prev };
      if (Object.keys(dayLog).length === 0) delete next[activeDateISO];
      else next[activeDateISO] = dayLog;
      persistLog(next);
      return next;
    });
  };

  const updateManual = (code, field, value) => {
    setManual((prev) => {
      const cur = prev[code] || { held: 0, attended: 0 };
      const next = { ...prev, [code]: { ...cur, [field]: value } };
      persistManual(next);
      return next;
    });
  };

  const logCounts = useMemo(() => {
    const counts = {};
    Object.values(log).forEach((dayMarks) => {
      Object.values(dayMarks).forEach(({ code, status }) => {
        if (!code) return;
        if (!counts[code]) counts[code] = { held: 0, attended: 0 };
        if (status === "present") { counts[code].held += 1; counts[code].attended += 1; }
        else if (status === "absent") { counts[code].held += 1; }
      });
    });
    return counts;
  }, [log]);

  const totals = useMemo(() => {
    const t = {};
    COURSES.forEach((c) => {
      const m = manual[c.code] || { held: 0, attended: 0 };
      const l = logCounts[c.code] || { held: 0, attended: 0 };
      t[c.code] = { held: m.held + l.held, attended: m.attended + l.attended };
    });
    return t;
  }, [manual, logCounts]);

  const currentBlockIdx = useMemo(() => {
    if (!isSameDate(activeDate, today)) return null;
    const mins = nowMinutes();
    const idx = SCHEDULE[activeDayName].findIndex((b) => mins >= toMinutes(b.s) && mins < toMinutes(b.e));
    return idx === -1 ? null : idx;
  }, [activeDate, activeDayName]);

  const tripped = COURSES.filter((c) => {
    const t = totals[c.code];
    return t.held > 0 && t.attended / t.held < criteria;
  });

  const dayLog = log[activeDateISO] || {};

  return (
    <div className="min-h-screen w-full font-sans" style={{ background: "#0F1B2B", color: "#E8ECF1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#4C9EEB] mb-1">NIT SILCHAR · ECE SEC A</div>
            <h1 className="text-2xl font-bold tracking-tight">Semester Console</h1>
            <p className="text-sm text-[#5C6B82] mt-0.5">Room 2102 · 5th Semester · July–Dec 2026</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[10px] text-[#5C6B82] font-mono">LAB BATCH</span>
            {["A1", "A2"].map((b) => (
              <button key={b} onClick={() => { setBatch(b); persistBatch(b); }}
                className="px-2 py-1 rounded text-xs font-mono transition-colors"
                style={batch === b
                  ? { background: "#1F5D8C", color: "#fff" }
                  : { background: "#152134", color: "#5C6B82" }}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {loaded && tripped.length > 0 && (
          <div className="mb-5 rounded-lg border px-4 py-3 flex items-start gap-3" style={{ background: "#2B1512", borderColor: "#6A2F26" }}>
            <AlertTriangle size={18} className="text-[#E3543F] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-[#E3543F]">
                {tripped.length} course{tripped.length > 1 ? "s" : ""} below {Math.round(criteria * 100)}%:
              </span>{" "}
              <span className="text-[#F0B8AE]">{tripped.map((c) => c.code).join(", ")}</span>
            </div>
          </div>
        )}

        <div className="flex gap-1 mb-5 p-1 rounded-lg" style={{ background: "#152134" }}>
          {[["timetable", "Timetable & Mark", Clock], ["attendance", "Attendance", Gauge]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors"
              style={tab === key ? { background: "#0F1B2B", color: "#7FC4F5", border: "1px solid #1F5D8C" } : { color: "#5C6B82", border: "1px solid transparent" }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {tab === "timetable" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setWeekStart(addDays(weekStart, -7))}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-[#152134] text-[#5C6B82] hover:text-[#7FC4F5]">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setWeekStart(startOfWeek(new Date()))}
                className="text-xs font-mono text-[#5C6B82] hover:text-[#7FC4F5]">
                {weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – {weekDates[4].toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </button>
              <button onClick={() => setWeekStart(addDays(weekStart, 7))}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-[#152134] text-[#5C6B82] hover:text-[#7FC4F5]">
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
              {DAYS.map((d, i) => {
                const date = weekDates[i];
                const marked = Object.keys(log[isoDate(date)] || {}).length > 0;
                const isToday = isSameDate(date, today);
                return (
                  <button key={d} onClick={() => setDayIdx(i)}
                    className="px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors relative"
                    style={dayIdx === i ? { background: "#1F5D8C", color: "#fff" } : { background: "#152134", color: "#5C6B82" }}>
                    {d.slice(0, 3).toUpperCase()} {date.getDate()}
                    {isToday && <span className="ml-1">•</span>}
                    {marked && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "#4CD07D" }} />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              {SCHEDULE[activeDayName].map((b, i) => {
                const style = TYPE_STYLE[b.type];
                const isNow = currentBlockIdx === i;
                const isLab = b.type === "lab";
                const resolvedCode = isLab ? (batch === "A1" ? b.a1 : batch === "A2" ? b.a2 : null) : b.course;
                const trackable = b.type === "lecture" || b.type === "tutorial" || b.type === "lab";
                const mark = dayLog[i];

                return (
                  <div key={i} className="rounded-lg border px-4 py-3 relative" style={{ background: style.bg, borderColor: isNow ? "#4C9EEB" : style.border }}>
                    {isNow && (
                      <span className="absolute -left-1.5 top-4 w-3 h-3 rounded-full" style={{ background: "#4C9EEB", boxShadow: "0 0 0 4px rgba(76,158,235,0.25)" }} />
                    )}
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-xs text-[#5C6B82] w-24 flex-shrink-0">{b.s}–{b.e}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: style.text }}>{b.label}</div>
                        {b.sub && <div className="text-xs text-[#8492A6] mt-0.5 truncate">{b.sub}</div>}
                      </div>
                    </div>
                    {trackable && (
                      isLab && !resolvedCode ? (
                        <div className="text-xs text-[#F0C868] mt-2">Pick your lab batch (top right) to mark this session.</div>
                      ) : (
                        <MarkRow mark={mark} onMark={(status) => setMark(i, resolvedCode, status)} />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "attendance" && (
          <div>
            <div className="rounded-lg border px-4 py-3 mb-4 flex items-center justify-between" style={{ background: "#152134", borderColor: "#2A3547" }}>
              <div className="flex items-center gap-2">
                <Settings2 size={15} className="text-[#5C6B82]" />
                <span className="text-sm text-[#8492A6]">Minimum attendance</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={100} step={1} value={Math.round(criteria * 100)}
                  onChange={(e) => { const v = Number(e.target.value) / 100; setCriteria(v); persistCriteria(v); }}
                  className="w-28 accent-[#4C9EEB]" />
                <span className="font-mono text-sm w-10 text-right">{Math.round(criteria * 100)}%</span>
              </div>
            </div>

            {!loaded ? (
              <div className="flex items-center justify-center py-16 text-[#5C6B82] gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading your data…
              </div>
            ) : (
              <div className="space-y-3">
                {COURSES.map((c) => {
                  const t = totals[c.code];
                  const pct = t.held > 0 ? t.attended / t.held : 0;
                  const below = t.held > 0 && pct < criteria;
                  const needed = below ? Math.ceil(Math.max(0, (criteria * t.held - t.attended) / (1 - criteria))) : 0;
                  const m = manual[c.code] || { held: 0, attended: 0 };
                  return (
                    <div key={c.code} className="rounded-lg border px-4 py-3" style={{ background: "#152134", borderColor: below ? "#6A2F26" : "#2A3547" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-[#4C9EEB]">{c.code}</span>
                            {t.held > 0 && (
                              below ? (
                                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-[#E3543F] border border-[#6A2F26] rounded px-1.5 py-0.5">
                                  <AlertTriangle size={10} /> Tripped
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-[#4CD07D] border border-[#2F7A55] rounded px-1.5 py-0.5">
                                  <CheckCircle2 size={10} /> Online
                                </span>
                              )
                            )}
                          </div>
                          <div className="text-sm font-medium mt-0.5 truncate">{c.name}</div>
                          <div className="text-xs text-[#5C6B82] mt-1 font-mono">
                            {t.attended}/{t.held} classes {logCounts[c.code] ? "· from daily marks" : ""}
                          </div>
                          <details className="mt-2">
                            <summary className="text-[11px] text-[#5C6B82] cursor-pointer select-none">Carry-over from before this tracker</summary>
                            <div className="mt-2 flex flex-col gap-1.5">
                              <Stepper label="Held" value={m.held} onChange={(v) => updateManual(c.code, "held", v)} />
                              <Stepper label="Attended" value={m.attended} onChange={(v) => updateManual(c.code, "attended", v)} />
                            </div>
                          </details>
                          {below && (
                            <div className="text-xs text-[#F0B8AE] mt-2">
                              Attend the next <span className="font-mono font-semibold">{needed}</span> in a row to clear {Math.round(criteria * 100)}%.
                            </div>
                          )}
                        </div>
                        <Gauge90 pct={pct} criteria={criteria} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="text-center text-[10px] text-[#3D4A5C] font-mono mt-4">
              {saveState === "saving" ? "saving…" : saveState === "error" ? "save failed — changes kept locally this session" : "saved on this device"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
