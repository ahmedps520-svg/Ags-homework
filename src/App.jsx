/* ============================================================================
 * AGS Homework Hub — clickable front-end demo
 * Advanced Generations International Schools (AGS), Jeddah
 *
 * Single-file React app. Tailwind for layout utilities, lucide-react for icons.
 * Everything below is FICTIONAL SAMPLE DATA held in memory for this session only.
 * Nothing is persisted, no accounts exist and no notifications are sent.
 *
 * File map
 *   1. Brand tokens & global styles
 *   2. Translations (single object, EN + AR side by side)
 *   3. Formatting, time & small helpers
 *   4. Static entities (subjects, teachers, classes, students)
 *   5. Sample page images (inline SVG "photographs")
 *   6. Seed data (deterministic)
 *   7. Domain logic (statuses, scoring, statistics)
 *   8. App context & UI primitives
 *   9. Shell (top bar, sidebar, bottom nav, demo guide, settings)
 *  10. Student views
 *  11. Teacher views
 *  12. Admin view
 *  13. App root
 * ========================================================================== */

import React, {
  useState, useEffect, useMemo, useRef, useCallback, createContext, useContext,
} from 'react';
import {
  AlarmClock, AlertCircle, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Atom,
  BadgeCheck, BarChart3, Bell, BookMarked, BookOpen, Building2, Calculator, CalendarClock,
  CalendarDays, Camera, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronRight, ChevronUp,
  Circle, CircleDot, ClipboardList, Clock, Copy, Crop, Dna, Eye, FileText, FlaskConical,
  Globe2, GraduationCap, Image as ImageIcon, Images, Info, Inbox, LayoutDashboard, Leaf, Link2,
  ListChecks, Loader2, Lock, MessageSquareText, Monitor, Palette, Paperclip, PenLine, PencilLine,
  Plus, PlusCircle, RotateCcw, RotateCw, Send, Settings, Shuffle, Sigma, Sparkles, Star, Table2,
  ToggleLeft, Trash2, TrendingUp, Type, Undo2, Upload, Users, X, AlignLeft, CheckSquare, Megaphone,
  Presentation, School,
} from 'lucide-react';

/* ============================================================================
 * 1. BRAND TOKENS & GLOBAL STYLES
 * Brand colours are written as plain CSS classes so this file stays portable
 * (no Tailwind config or arbitrary values needed).
 * ========================================================================== */

const BRAND = {
  indigo: '#2C2A73',
  navy: '#201F3C',
  gold: '#F3C52D',
  goldHover: '#DCAB0B',
  slate: '#4A4966',
  bg: '#F7F7FB',
};

const GLOBAL_CSS = `
.ags-root{font-family:'Noto Kufi Arabic','Noto Sans Arabic','Noto Sans',system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif;background:${BRAND.bg};color:${BRAND.navy};line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh}
.ags-root *:focus{outline:none}
.ags-root *:focus-visible{outline:3px solid ${BRAND.indigo};outline-offset:2px}
.ags-root .on-dark *:focus-visible,.ags-root .on-dark:focus-visible{outline-color:${BRAND.gold}}
.bg-ags-indigo{background-color:${BRAND.indigo}}.bg-ags-navy{background-color:${BRAND.navy}}.bg-ags-gold{background-color:${BRAND.gold}}
.bg-ags-indigo-50{background-color:#EEEDF8}.bg-ags-indigo-100{background-color:#DFDDF2}.bg-ags-gold-50{background-color:#FEF8E1}.bg-ags-gold-100{background-color:#FCEFB8}
.text-ags-indigo{color:${BRAND.indigo}}.text-ags-navy{color:${BRAND.navy}}.text-ags-gold{color:${BRAND.gold}}.text-ags-slate{color:${BRAND.slate}}
.border-ags-gold{border-color:${BRAND.gold}}.border-ags-indigo{border-color:${BRAND.indigo}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-weight:500;border-radius:.75rem;padding:.55rem 1rem;font-size:.9375rem;line-height:1.35rem;transition:background-color .15s,color .15s,box-shadow .15s,transform .1s;min-height:2.75rem;text-align:center}
.btn:active:not(:disabled){transform:translateY(1px)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:${BRAND.indigo};color:#fff}.btn-primary:hover:not(:disabled){background:#23215E}
.btn-gold{background:${BRAND.gold};color:${BRAND.navy}}.btn-gold:hover:not(:disabled){background:${BRAND.goldHover}}
.btn-secondary{background:#fff;color:${BRAND.indigo};box-shadow:inset 0 0 0 1px #CFCDE6}.btn-secondary:hover:not(:disabled){background:#F3F2FA}
.btn-ghost{background:transparent;color:${BRAND.indigo}}.btn-ghost:hover:not(:disabled){background:#EEEDF8}
.btn-danger{background:#fff;color:#9F1239;box-shadow:inset 0 0 0 1px #FBCFD8}.btn-danger:hover:not(:disabled){background:#FFF1F3}
.btn-sm{min-height:2.25rem;padding:.35rem .75rem;font-size:.875rem;border-radius:.625rem}
.btn-lg{min-height:3.25rem;padding:.8rem 1.5rem;font-size:1.0625rem}
.btn-icon{min-height:2.5rem;min-width:2.5rem;padding:.4rem;border-radius:.625rem}
.card{background:#fff;border-radius:1rem;box-shadow:0 1px 2px rgba(32,31,60,.05),0 6px 20px -8px rgba(32,31,60,.10);border:1px solid rgba(32,31,60,.07)}
.input{width:100%;background:#fff;border:1px solid #C9C8DA;border-radius:.75rem;padding:.55rem .85rem;color:${BRAND.navy};min-height:2.75rem;font:inherit;line-height:1.5}
.input:hover{border-color:#A9A7C6}
.ags-root .input:focus-visible{outline:3px solid rgba(44,42,115,.28);outline-offset:0;border-color:${BRAND.indigo}}
.input::placeholder{color:#6B6A85}
.input-error{border-color:#BE123C!important;background:#FFF8F9}
.label{display:block;font-size:.875rem;font-weight:500;color:${BRAND.navy};margin-bottom:.35rem}
.hint{font-size:.8125rem;color:${BRAND.slate}}
.scroll-x{overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.scroll-x::-webkit-scrollbar{display:none}
.shimmer{background:linear-gradient(90deg,#E9E9F1 25%,#F4F4F9 37%,#E9E9F1 63%);background-size:400% 100%;animation:ags-shimmer 1.2s ease infinite}
@keyframes ags-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}
@keyframes ags-draw{to{stroke-dashoffset:0}}
.ags-draw-circle{stroke-dasharray:166;stroke-dashoffset:166;animation:ags-draw .7s cubic-bezier(.65,0,.45,1) forwards}
.ags-draw-check{stroke-dasharray:48;stroke-dashoffset:48;animation:ags-draw .4s .55s cubic-bezier(.65,0,.45,1) forwards}
@keyframes ags-pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.06);opacity:1}100%{transform:scale(1);opacity:1}}
.ags-pop{animation:ags-pop .5s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ags-fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.ags-fade-up{animation:ags-fade-up .35s ease-out both}
@keyframes ags-star{0%{transform:scale(0) rotate(-30deg);opacity:0}60%{transform:scale(1.15) rotate(8deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
.ags-star{animation:ags-star .6s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ags-toast{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ags-toast{animation:ags-toast .25s ease-out both}
@keyframes ags-flash{0%{box-shadow:0 0 0 0 rgba(243,197,45,.0)}30%{box-shadow:0 0 0 4px rgba(243,197,45,.65)}100%{box-shadow:0 0 0 0 rgba(243,197,45,0)}}
.ags-flash{animation:ags-flash 1.6s ease-out 2}
.ags-root[dir=rtl] .flip-rtl{transform:scaleX(-1)}
.tabular{font-variant-numeric:tabular-nums}
.hatch{background-image:repeating-linear-gradient(135deg,#CBD5E1 0 3px,#EEF1F6 3px 7px)}
.reduce-motion *,.reduce-motion *::before,.reduce-motion *::after{animation-duration:.001ms!important;animation-delay:0ms!important;transition-duration:.001ms!important}
@media (prefers-reduced-motion:reduce){.ags-root *,.ags-root *::before,.ags-root *::after{animation-duration:.001ms!important;animation-delay:0ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}
.ags-root input[type=range]{accent-color:${BRAND.indigo}}
.ags-root input[type=checkbox],.ags-root input[type=radio]{accent-color:${BRAND.indigo};width:1.15rem;height:1.15rem}
.stage-early .stage-scale{font-size:1.08em}
.touch-none{touch-action:none}
`;

/* ============================================================================
 * 2. TRANSLATIONS — one object, [English, Arabic] per key.
 * A value may be a plural object keyed by Intl.PluralRules categories
 * (Arabic uses zero/one/two/few/many/other). Keys ending in .early/.senior
 * are age-stage variants picked automatically by t.s().
 * ========================================================================== */

const T = {
  /* --- app & shell --- */
  'app.name': ['Homework Hub', 'منصة الواجبات'],
  'app.school': ['Advanced Generations International Schools', 'مدارس الأجيال المتقدمة العالمية'],
  'app.city': ['Jeddah', 'جدة'],
  'role.label': ['View as', 'العرض بصفة'],
  'role.student': ['Student', 'طالب'],
  'role.teacher': ['Teacher', 'معلّم'],
  'role.admin': ['Admin', 'الإدارة'],
  'lang.label': ['Language', 'اللغة'],
  'lang.en': ['English', 'الإنجليزية'],
  'lang.ar': ['Arabic', 'العربية'],
  'stage.label': ['Design preview by age', 'معاينة التصميم حسب العمر'],
  'stage.hint': ['Preview only — not an account setting', 'للمعاينة فقط — ليس إعدادًا للحساب'],
  'stage.early': ['KG – Grade 3', 'رياض الأطفال – الصف الثالث'],
  'stage.middle': ['Grades 4 – 8', 'الصفوف الرابع – الثامن'],
  'stage.senior': ['Grades 9 – 12', 'الصفوف التاسع – الثاني عشر'],
  'stage.switched': ['Now previewing as {name} · {cls}', 'المعاينة الآن بصفة {name} · {cls}'],
  'demo.reset': ['Reset demo', 'إعادة ضبط العرض'],
  'demo.reset.title': ['Reset the demo?', 'إعادة ضبط العرض؟'],
  'demo.reset.body': ['This restores all the sample data. Anything created during this session will be cleared.', 'سيؤدي ذلك إلى استعادة جميع البيانات التجريبية، وحذف كل ما أُنشئ خلال هذه الجلسة.'],
  'demo.reset.done': ['Demo restored to its sample data', 'أُعيد العرض إلى بياناته التجريبية'],
  'demo.footer': ['Demo — sample data', 'نسخة تجريبية — بيانات افتراضية'],
  'demo.about': ['About this demo', 'عن هذا العرض'],
  'demo.about.body': ['This is a front-end demonstration of AGS Homework Hub. All people, classes, assignments, submissions, grades and statistics are fictional and kept in memory for this session only. Autosave works within the session; refreshing the page restores the sample data. No real school accounts exist and no messages or notifications are sent.', 'هذا عرض تجريبي لواجهة منصة الواجبات في مدارس الأجيال المتقدمة العالمية. جميع الأشخاص والشعب والواجبات والتسليمات والدرجات والإحصاءات افتراضية، وتُحفظ في الذاكرة خلال هذه الجلسة فقط. يعمل الحفظ التلقائي داخل الجلسة، وتحديث الصفحة يعيد البيانات التجريبية. لا توجد حسابات مدرسية حقيقية، ولا تُرسَل أي رسائل أو إشعارات.'],
  'skip': ['Skip to main content', 'الانتقال إلى المحتوى الرئيسي'],
  'close': ['Close', 'إغلاق'],
  'cancel': ['Cancel', 'إلغاء'],
  'confirm': ['Confirm', 'تأكيد'],
  'back': ['Back', 'رجوع'],
  'open': ['Open', 'فتح'],
  'show': ['Show', 'إظهار'],
  'hide': ['Hide', 'إخفاء'],
  'or': ['or', 'أو'],
  'loading': ['Loading…', 'جارٍ التحميل…'],
  'dismiss': ['Dismiss', 'إغلاق'],
  'undo': ['Undo', 'تراجع'],
  'menu': ['Menu', 'القائمة'],
  'settings': ['Settings', 'الإعدادات'],
  'settings.textSize': ['Text size', 'حجم الخط'],
  'settings.size.s': ['Small', 'صغير'],
  'settings.size.m': ['Default', 'افتراضي'],
  'settings.size.l': ['Large', 'كبير'],
  'settings.size.xl': ['Extra large', 'كبير جدًا'],
  'settings.motion': ['Reduce motion', 'تقليل الحركة'],
  'settings.motion.hint': ['Turns off animations and transitions', 'يوقف الرسوم المتحركة والانتقالات'],
  'settings.guide': ['Show demo guide', 'إظهار دليل العرض'],
  'settings.preview': ['Aa — The quick preview of your text size', 'أ ب — معاينة سريعة لحجم الخط'],

  /* --- navigation --- */
  'nav.home': ['Home', 'الرئيسية'],
  'nav.assignments': ['Assignments', 'الواجبات'],
  'nav.dashboard': ['Dashboard', 'لوحة المعلّم'],
  'nav.create': ['Create', 'إنشاء واجب'],
  'nav.grading': ['Grading', 'التصحيح'],
  'nav.insights': ['Class insights', 'مؤشرات الصفوف'],
  'nav.overview': ['School overview', 'نظرة عامة'],
  'nav.main': ['Main navigation', 'التنقل الرئيسي'],

  /* --- people & classes --- */
  'cls.long': ['Grade {g}{s}', 'الصف {g} – الشعبة {s}'],
  'who.teacherOf': ['{subject} teacher', 'معلّم {subject}'],

  /* --- student dashboard --- */
  'greet.morning': ['Good morning, {name}', 'صباح الخير، {name}'],
  'greet.afternoon': ['Good afternoon, {name}', 'مساء الخير، {name}'],
  'greet.evening': ['Good evening, {name}', 'مساء الخير، {name}'],
  'greet.early': ['Hello, {name}!', 'أهلًا يا {name}!'],
  'dash.dueWeek': ['Due this week', 'مطلوبة هذا الأسبوع'],
  'dash.overdue': ['Overdue', 'فات موعد التسليم'],
  'dash.submitted': ['Submitted', 'تم التسليم'],
  'dash.returned': ['Returned with feedback', 'أُعيدت مع ملاحظات'],
  'dash.dueWeek.early': ['To do', 'واجباتي'],
  'dash.overdue.early': ['Still to hand in', 'لم أسلّمها بعد'],
  'dash.submitted.early': ['Handed in', 'سلّمتها'],
  'dash.returned.early': ['Teacher looked', 'راجعها المعلّم'],
  'sec.dueSoon': ['Due soon', 'مواعيد تسليم قريبة'],
  'sec.dueSoon.early': ['My homework', 'واجباتي'],
  'sec.overdue': ['Late / Overdue', 'متأخرة / فات موعد تسليمها'],
  'sec.overdue.early': ['Still to hand in', 'لم أسلّمها بعد'],
  'sec.overdue.hint': ['You can still hand these in where your teacher accepts late work.', 'ما زال بإمكانك تسليم هذه الواجبات حيث يقبل المعلّم التسليم المتأخر.'],
  'sec.returned': ['Returned with feedback', 'أُعيدت مع ملاحظات'],
  'sec.returned.early': ['From my teacher', 'من معلّمي'],
  'sec.completed': ['Completed', 'الواجبات المكتملة'],
  'sec.completed.early': ['All done', 'أنجزتها'],
  'sec.count': [{ one: '{n} item', other: '{n} items' }, { zero: 'لا عناصر', one: 'عنصر واحد', two: 'عنصران', few: '{n} عناصر', many: '{n} عنصرًا', other: '{n} عنصر' }],
  'empty.dueSoon': ['Nothing due soon — you’re all caught up.', 'لا توجد واجبات قريبة — أنجزت كل شيء.'],
  'empty.dueSoon.early': ['No homework right now.', 'لا توجد واجبات الآن.'],
  'empty.returned': ['No new feedback yet.', 'لا توجد ملاحظات جديدة بعد.'],
  'empty.completed': ['Completed work will appear here.', 'ستظهر الواجبات المكتملة هنا.'],
  'empty.filter': ['Nothing for this filter.', 'لا شيء ضمن هذا التصفية.'],
  'filter.subjects': ['Filter by subject', 'التصفية حسب المادة'],
  'filter.all': ['All subjects', 'كل المواد'],
  'week.title': ['This week', 'هذا الأسبوع'],
  'week.next': ['Coming up', 'الأيام القادمة'],
  'week.today': ['Today', 'اليوم'],
  'week.weekend': ['Weekend', 'عطلة'],
  'week.none': ['No homework due', 'لا واجبات مطلوبة'],
  'week.count': [{ one: '1 due', other: '{n} due' }, { zero: 'لا واجبات', one: 'واجب واحد', two: 'واجبان', few: '{n} واجبات', many: '{n} واجبًا', other: '{n} واجب' }],
  'week.filtered': ['Showing work due on {day}', 'عرض الواجبات المطلوبة يوم {day}'],
  'week.clear': ['Show all days', 'عرض كل الأيام'],
  'enc.allOnTime': ['You’ve submitted everything on time this week.', 'سلّمت جميع واجباتك في موعدها هذا الأسبوع.'],
  'enc.allOnTime.early': ['All done for this week. Well done!', 'أنهيت واجبات هذا الأسبوع. أحسنت!'],
  'enc.allOnTime.senior': ['All work for this week submitted on time.', 'سُلِّمت جميع أعمال هذا الأسبوع في موعدها.'],
  'enc.left': [{ one: 'Nice progress — 1 assignment left this week.', other: 'Nice progress — {n} assignments left this week.' }, { one: 'تقدّم جميل — بقي واجب واحد هذا الأسبوع.', two: 'تقدّم جميل — بقي واجبان هذا الأسبوع.', few: 'تقدّم جميل — بقيت {n} واجبات هذا الأسبوع.', many: 'تقدّم جميل — بقي {n} واجبًا هذا الأسبوع.', other: 'تقدّم جميل — بقي {n} واجب هذا الأسبوع.' }],
  'enc.left.early': [{ one: 'Just 1 more to do this week.', other: '{n} more to do this week.' }, { one: 'بقي واجب واحد هذا الأسبوع.', two: 'بقي واجبان هذا الأسبوع.', few: 'بقيت {n} واجبات هذا الأسبوع.', many: 'بقي {n} واجبًا هذا الأسبوع.', other: 'بقي {n} واجب هذا الأسبوع.' }],
  'enc.left.senior': [{ one: '1 assignment outstanding this week. Next: {next}.', other: '{n} assignments outstanding this week. Next: {next}.' }, { one: 'واجب واحد متبقٍ هذا الأسبوع. التالي: {next}.', two: 'واجبان متبقيان هذا الأسبوع. التالي: {next}.', few: '{n} واجبات متبقية هذا الأسبوع. التالي: {next}.', many: '{n} واجبًا متبقيًا هذا الأسبوع. التالي: {next}.', other: '{n} واجب متبقٍ هذا الأسبوع. التالي: {next}.' }],
  'enc.none': ['No homework set for this week yet.', 'لا توجد واجبات لهذا الأسبوع بعد.'],
  'enc.progress': ['{done} of {total} done this week', 'أنجزت {done} من {total} هذا الأسبوع'],
  'enc.overdueNote': ['One piece is overdue — you can still hand it in.', 'هناك واجب فات موعده — وما زال بإمكانك تسليمه.'],
  'reminder.text': ['{teacher} sent a reminder: “{title}” is waiting for you.', 'تذكير من {teacher}: واجب «{title}» بانتظارك.'],
  'reminder.open': ['Open assignment', 'فتح الواجب'],

  /* --- due dates & lateness --- */
  'due.today': ['Due today, {time}', 'التسليم اليوم، {time}'],
  'due.tomorrow': ['Due tomorrow, {time}', 'التسليم غدًا، {time}'],
  'due.weekday': ['Due {day}, {time}', 'التسليم يوم {day}، {time}'],
  'due.date': ['Due {date}, {time}', 'التسليم {date}، {time}'],
  'due.lessHour': ['Due in less than an hour', 'التسليم خلال أقل من ساعة'],
  'due.inHours': [{ one: 'Due in 1 hour', other: 'Due in {n} hours' }, { one: 'التسليم خلال ساعة', two: 'التسليم خلال ساعتين', few: 'التسليم خلال {n} ساعات', many: 'التسليم خلال {n} ساعة', other: 'التسليم خلال {n} ساعة' }],
  'due.was': ['Was due {when}', 'كان موعد التسليم {when}'],
  'due.early.today': ['Today', 'اليوم'],
  'due.early.tomorrow': ['Tomorrow', 'غدًا'],
  'due.early.day': ['{day}', '{day}'],
  'late.days': [{ one: '1 day late', other: '{n} days late' }, { one: 'متأخر يومًا واحدًا', two: 'متأخر يومين', few: 'متأخر {n} أيام', many: 'متأخر {n} يومًا', other: 'متأخر {n} يوم' }],
  'late.accept': ['Late submission accepted', 'يُسمح بالتسليم المتأخر'],
  'late.acceptUntil': ['Late submissions accepted until {date}', 'يُسمح بالتسليم المتأخر حتى {date}'],
  'late.closed': ['Late work isn’t accepted — please talk to your teacher', 'لا يُقبل التسليم المتأخر — يُرجى التحدث مع المعلّم'],
  'late.deduct': ['{pct} deducted per day late', 'يُخصم {pct} عن كل يوم تأخير'],
  'late.policy.accept': ['Late work is accepted and marked as late.', 'يُقبل التسليم المتأخر ويُسجَّل متأخرًا.'],
  'late.policy.until': ['Late work is accepted until {date}.', 'يُقبل التسليم المتأخر حتى {date}.'],
  'late.policy.none': ['Late work is not accepted after the due date.', 'لا يُقبل التسليم بعد الموعد المحدد.'],
  'overdue.until': ['This is overdue. You can still submit until {date}.', 'فات موعد تسليم هذا الواجب، ويمكنك تسليمه حتى {date}.'],
  'overdue.any': ['This is overdue. You can still submit it — it will be marked as late.', 'فات موعد تسليم هذا الواجب، ويمكنك تسليمه وسيُسجَّل متأخرًا.'],
  'overdue.closed': ['This is overdue and submissions have closed. Please speak to your teacher — they can help you catch up.', 'فات موعد تسليم هذا الواجب وأُغلق التسليم. يُرجى التحدث مع المعلّم، فهو قادر على مساعدتك.'],
  'pts': [{ one: '{n} point', other: '{n} points' }, { zero: '{n} درجة', one: 'درجة واحدة', two: 'درجتان', few: '{n} درجات', many: '{n} درجة', other: '{n} درجة' }],
  'ago.now': ['just now', 'الآن'],
  'ago.min': [{ one: '1 min ago', other: '{n} min ago' }, { one: 'قبل دقيقة', two: 'قبل دقيقتين', few: 'قبل {n} دقائق', many: 'قبل {n} دقيقة', other: 'قبل {n} دقيقة' }],
  'ago.hour': [{ one: '1 hour ago', other: '{n} hours ago' }, { one: 'قبل ساعة', two: 'قبل ساعتين', few: 'قبل {n} ساعات', many: 'قبل {n} ساعة', other: 'قبل {n} ساعة' }],
  'ago.day': [{ one: 'yesterday', other: '{n} days ago' }, { one: 'أمس', two: 'قبل يومين', few: 'قبل {n} أيام', many: 'قبل {n} يومًا', other: 'قبل {n} يوم' }],
  'days': [{ one: '{n} day', other: '{n} days' }, { zero: '{n} يوم', one: 'يوم واحد', two: 'يومان', few: '{n} أيام', many: '{n} يومًا', other: '{n} يوم' }],

  /* --- statuses (every status has icon + text) --- */
  'st.notStarted': ['Not started', 'لم يبدأ'],
  'st.draft': ['Draft', 'مسودة'],
  'st.submitted': ['Submitted', 'تم التسليم'],
  'st.submittedLate': ['Submitted late', 'سُلِّم متأخرًا'],
  'st.overdue': ['Overdue', 'فات موعد التسليم'],
  'st.closed': ['Not handed in', 'لم يُسلَّم'],
  'st.returned': ['Returned', 'أُعيد مع ملاحظات'],
  'st.revision': ['Returned for revision', 'أُعيد للتعديل'],
  'st.completed': ['Completed', 'مكتمل'],
  'st.late': ['Late', 'متأخر'],
  'st.missing': ['Missing', 'غير مُسلَّم'],
  'st.graded': ['Graded', 'تم التقييم'],
  'st.notYet': ['Not submitted yet', 'لم يُسلَّم بعد'],
  'st.scheduled': ['Scheduled', 'مجدول'],
  'st.open': ['Open', 'مفتوح'],
  'st.past': ['Past due', 'انتهى موعده'],

  /* --- submission types --- */
  'type.paper': ['Paper homework', 'الواجب الورقي'],
  'type.quiz': ['Quiz · auto-marked', 'اختبار قصير · تصحيح تلقائي'],
  'type.file': ['File upload', 'رفع ملف'],
  'type.online': ['Online answers', 'إجابات إلكترونية'],

  /* --- question types --- */
  'q.mcq': ['Multiple choice', 'اختيار من متعدد'],
  'q.checkbox': ['Checkboxes', 'إجابات متعددة'],
  'q.short': ['Short answer', 'إجابة قصيرة'],
  'q.long': ['Long answer', 'إجابة مطوّلة'],
  'q.tf': ['True / False', 'صح أو خطأ'],
  'q.match': ['Matching', 'مطابقة'],
  'q.file': ['File upload', 'رفع ملف'],
  'q.paper': ['Paper homework (photo)', 'الواجب الورقي (صورة)'],
  'q.true': ['True', 'صح'],
  'q.false': ['False', 'خطأ'],
  'q.number': ['Question {n}', 'السؤال {n}'],
  'q.required': ['Required', 'مطلوب'],
  'q.chooseOne': ['Choose one answer', 'اختر إجابة واحدة'],
  'q.chooseMany': ['Choose all that apply', 'اختر كل الإجابات الصحيحة'],
  'q.typeHere': ['Type your answer', 'اكتب إجابتك'],
  'q.matchHint': ['Choose the matching item for each row', 'اختر ما يطابق كل عنصر'],
  'q.matchSelect': ['Choose…', 'اختر…'],
  'q.words': [{ one: '1 word', other: '{n} words' }, { zero: 'لا كلمات', one: 'كلمة واحدة', two: 'كلمتان', few: '{n} كلمات', many: '{n} كلمة', other: '{n} كلمة' }],
  'q.file.add': ['Add file', 'إضافة ملف'],
  'q.file.hint': ['PDF, image or document', 'ملف PDF أو صورة أو مستند'],
  'q.file.remove': ['Remove file', 'إزالة الملف'],
  'q.paper.cta': ['Submit paper homework', 'تسليم واجب ورقي'],
  'q.paper.ctaEdit': ['Edit pages', 'تعديل الصفحات'],
  'q.paper.hint': ['Take a photo of your written work, or upload one from your gallery.', 'التقط صورة لعملك المكتوب، أو ارفعها من معرض الصور.'],
  'q.paper.pages': [{ one: '1 page added', other: '{n} pages added' }, { one: 'أُضيفت صفحة واحدة', two: 'أُضيفت صفحتان', few: 'أُضيفت {n} صفحات', many: 'أُضيفت {n} صفحة', other: 'أُضيفت {n} صفحة' }],
  'q.preview.paper': ['Students open the photo flow from here.', 'من هنا يفتح الطلاب خطوات تصوير الواجب.'],
};
Object.assign(T, {
  /* --- assignment page --- */
  'back.home': ['Back to my homework', 'العودة إلى واجباتي'],
  'a.due': ['Due', 'موعد التسليم'],
  'a.points': ['Points', 'الدرجة'],
  'a.latePolicy': ['Late work', 'التسليم المتأخر'],
  'a.type': ['Submission type', 'طريقة التسليم'],
  'a.instructions': ['Instructions', 'التعليمات'],
  'a.attachments': ['Attachments', 'المرفقات'],
  'a.progress': ['{done} of {total} answered', 'أُجيب عن {done} من {total}'],
  'a.saved': ['Draft saved · {when}', 'حُفظت المسودة · {when}'],
  'a.saving': ['Saving…', 'جارٍ الحفظ…'],
  'a.autosave': ['Your answers save automatically', 'تُحفظ إجاباتك تلقائيًا'],
  'a.draftToast': ['Draft saved', 'حُفظت المسودة'],
  'a.notFound': ['This assignment isn’t available.', 'هذا الواجب غير متاح.'],
  'att.worksheet': ['Worksheet', 'ورقة عمل'],
  'att.image': ['Image', 'صورة'],
  'att.link': ['Link', 'رابط'],
  'att.preview': ['Preview', 'معاينة'],
  'att.openLink': ['Opens in a new tab', 'يُفتح في تبويب جديد'],
  'att.mockNote': ['Demo preview — sample files are illustrations only.', 'معاينة تجريبية — الملفات النموذجية للتوضيح فقط.'],
  'q.file.demo': ['files stay in this browser tab only', 'تبقى الملفات في هذه الصفحة فقط'],
  'saveDraft': ['Save draft', 'حفظ كمسودة'],
  'submit': ['Submit assignment', 'تسليم الواجب'],
  'resubmit': ['Resubmit', 'إعادة التسليم'],
  'resubmit.started': ['You can now edit your work and resubmit it.', 'يمكنك الآن تعديل عملك وإعادة تسليمه.'],
  'review.title': ['Check your answers before you submit', 'راجع إجاباتك قبل التسليم'],
  'review.noAnswer': ['No answer yet', 'لا توجد إجابة بعد'],
  'review.edit': ['Edit answers', 'تعديل الإجابات'],
  'review.confirm': ['Confirm and submit', 'تأكيد التسليم'],
  'review.goto': ['Go to question', 'الانتقال إلى السؤال'],
  'review.lateNote': ['This is after the due date, so it will be marked as late.', 'التسليم بعد الموعد المحدد، لذا سيُسجَّل متأخرًا.'],
  'review.missing': [{ one: 'Answer the required question first (1 left).', other: 'Answer the required questions first ({n} left).' }, { one: 'أجب عن السؤال المطلوب أولًا (بقي سؤال واحد).', two: 'أجب عن الأسئلة المطلوبة أولًا (بقي سؤالان).', few: 'أجب عن الأسئلة المطلوبة أولًا (بقيت {n} أسئلة).', many: 'أجب عن الأسئلة المطلوبة أولًا (بقي {n} سؤالًا).', other: 'أجب عن الأسئلة المطلوبة أولًا (بقي {n} سؤال).' }],
  'done.onTime': ['Submitted on time. Your teacher will review it soon.', 'تم التسليم في الموعد. سيراجعه معلّمك قريبًا.'],
  'done.lateDays': [{ one: 'Submitted late — 1 day after the due date.', other: 'Submitted late — {n} days after the due date.' }, { one: 'تم التسليم متأخرًا — بعد الموعد المحدد بيوم واحد.', two: 'تم التسليم متأخرًا — بعد الموعد المحدد بيومين.', few: 'تم التسليم متأخرًا — بعد الموعد المحدد بـ{n} أيام.', many: 'تم التسليم متأخرًا — بعد الموعد المحدد بـ{n} يومًا.', other: 'تم التسليم متأخرًا — بعد الموعد المحدد بـ{n} يوم.' }],
  'done.lateHelp': ['Thank you for handing it in. Your teacher will review it soon.', 'شكرًا لتسليمك. سيراجعه معلّمك قريبًا.'],
  'done.early': ['All done! Your teacher will see your work.', 'أحسنت! سيرى معلّمك عملك.'],
  'done.senior': ['Submitted {date} at {time}, before the deadline.', 'سُلِّم {date} الساعة {time} قبل الموعد النهائي.'],
  'done.sub': ['“{title}” is with your teacher now.', 'واجب «{title}» لدى معلّمك الآن.'],
  'done.pages': [{ one: '1 page was handed in.', other: '{n} pages were handed in.' }, { one: 'سُلِّمت صفحة واحدة.', two: 'سُلِّمت صفحتان.', few: 'سُلِّمت {n} صفحات.', many: 'سُلِّمت {n} صفحة.', other: 'سُلِّمت {n} صفحة.' }],
  'done.view': ['View my submission', 'عرض ما سلّمته'],
  'all.title': ['All assignments', 'جميع الواجبات'],
  'all.subtitle': ['Everything set for you this term, in one place.', 'كل ما كُلِّفت به هذا الفصل في مكان واحد.'],
  'all.tab.todo': ['To do', 'المطلوبة'],
  'all.tab.submitted': ['Submitted', 'المُسلَّمة'],
  'all.tab.returned': ['Returned', 'المُعادة'],
  'all.tab.all': ['All', 'الكل'],

  /* --- feedback --- */
  'fb.title': ['Feedback from {teacher}', 'ملاحظات {teacher}'],
  'fb.mark': ['Mark', 'الدرجة'],
  'fb.rubric': ['Rubric', 'معايير التقييم'],
  'fb.auto': ['Auto-marked questions', 'الأسئلة المصححة تلقائيًا'],
  'fb.annotated': ['Your pages with your teacher’s notes', 'صفحاتك مع ملاحظات المعلّم'],
  'fb.revision': ['Your teacher has asked you to revise this work and resubmit it.', 'طلب منك المعلّم تعديل هذا العمل وإعادة تسليمه.'],
  'fb.correct': ['Correct', 'صحيحة'],
  'fb.incorrect': ['Not quite', 'غير صحيحة'],
  'fb.returnedOn': ['Returned {when}', 'أُعيد {when}'],
  'fb.previous': ['Previous feedback', 'الملاحظات السابقة'],
  'fb.yourAnswer': ['Your answer', 'إجابتك'],
  'fb.correctAnswer': ['Correct answer', 'الإجابة الصحيحة'],
  'fb.awaiting': ['Submitted {when}. Your teacher will review it soon.', 'سُلِّم {when}. سيراجعه معلّمك قريبًا.'],

  /* --- paper homework flow --- */
  'p.title': ['Submit paper homework', 'تسليم واجب ورقي'],
  'p.backTo': ['Back to assignment', 'العودة إلى الواجب'],
  'p.step1': ['Add pages', 'إضافة الصفحات'],
  'p.step2': ['Check pages', 'مراجعة الصفحات'],
  'p.step3': ['Submit', 'التسليم'],
  'p.take': ['Take photo', 'التقاط صورة'],
  'p.take.hint': ['Opens the camera on phones and tablets', 'يفتح الكاميرا على الجوال والجهاز اللوحي'],
  'p.upload': ['Upload photo', 'رفع صورة'],
  'p.upload.hint': ['Choose from your gallery or files', 'اختر من معرض الصور أو الملفات'],
  'p.sample': ['Use a sample page', 'استخدام صفحة نموذجية'],
  'p.sample.hint': ['Built-in pages for presenting without a camera', 'صفحات جاهزة للعرض دون كاميرا'],
  'p.sample.pick': ['Choose a sample page', 'اختر صفحة نموذجية'],
  'p.processing': ['Preparing image…', 'جارٍ تجهيز الصورة…'],
  'p.tips': ['Tips for a clear photo', 'نصائح لصورة واضحة'],
  'p.tip1': ['Lay the page flat in good light', 'ضع الورقة على سطح مستوٍ في إضاءة جيدة'],
  'p.tip2': ['Fit all four corners in the frame', 'اجعل زوايا الورقة الأربع داخل الإطار'],
  'p.tip3': ['One photo per page — you can add more', 'صورة لكل صفحة، ويمكنك إضافة المزيد'],
  'p.page': ['Page {n}', 'الصفحة {n}'],
  'p.pageOf': ['Page {n} of {total}', 'الصفحة {n} من {total}'],
  'p.pages': ['Pages', 'الصفحات'],
  'p.add': ['Add another page', 'إضافة صفحة أخرى'],
  'p.rotate': ['Rotate 90°', 'تدوير ٩٠°'],
  'p.crop': ['Crop', 'قصّ'],
  'p.delete': ['Delete', 'حذف'],
  'p.cropTrim': ['Trim edges', 'قصّ الحواف'],
  'p.cropTop': ['Top half', 'النصف العلوي'],
  'p.cropBottom': ['Bottom half', 'النصف السفلي'],
  'p.cropReset': ['Whole page', 'الصفحة كاملة'],
  'p.cropApply': ['Apply crop', 'تطبيق القصّ'],
  'p.cropHint': ['Drag the corners or the box to choose the area to keep.', 'اسحب الزوايا أو الإطار لتحديد الجزء الذي تريد إبقاءه.'],
  'p.cropHandle': ['Crop corner — use arrow keys to adjust', 'زاوية القصّ — استخدم مفاتيح الأسهم للتعديل'],
  'p.cropped': ['Page cropped', 'قُصّت الصفحة'],
  'p.moveUp': ['Move page earlier', 'تقديم الصفحة'],
  'p.moveDown': ['Move page later', 'تأخير الصفحة'],
  'p.deleted': ['Page deleted', 'حُذفت الصفحة'],
  'p.note': ['Note to teacher (optional)', 'ملاحظة للمعلّم (اختياري)'],
  'p.notePh': ['e.g. I wasn’t sure about question 4.', 'مثال: لم أكن متأكدًا من السؤال الرابع.'],
  'p.previewSubmit': ['Preview & submit', 'معاينة وتسليم'],
  'p.attach': ['Attach pages to assignment', 'إرفاق الصفحات بالواجب'],
  'p.reviewTitle': ['Check your pages', 'راجع صفحاتك'],
  'p.backEdit': ['Back to pages', 'العودة إلى الصفحات'],
  'p.locked': ['This work has already been handed in.', 'سُلِّم هذا العمل بالفعل.'],
  'p.err.type': ['That file isn’t an image. Please choose a photo.', 'هذا الملف ليس صورة. يُرجى اختيار صورة.'],
  'p.err.load': ['We couldn’t open that image. Try another photo or use a sample page.', 'تعذّر فتح هذه الصورة. جرّب صورة أخرى أو استخدم صفحة نموذجية.'],
  'sample.fractions': ['Handwritten fractions', 'كسور بخط اليد'],
  'sample.equations': ['Handwritten equations', 'معادلات بخط اليد'],
  'sample.textbook': ['Textbook exercise', 'تمرين من الكتاب'],
  'sample.apples': ['Colouring worksheet', 'ورقة تلوين'],
  'sample.letters': ['Letter practice', 'تدريب على الحروف'],
  'sample.calculus': ['Differentiation working', 'حلول التفاضل'],
  'sample.pattern': ['Geometric pattern', 'زخرفة هندسية'],

  /* --- teacher dashboard & lists --- */
  'td.greeting': ['Welcome back, {name}', 'مرحبًا بعودتك، {name}'],
  'td.new': ['New assignment', 'واجب جديد'],
  'td.active': ['Assignments active', 'الواجبات النشطة'],
  'td.toGrade': ['Submissions to grade', 'تسليمات بانتظار التصحيح'],
  'td.missing': ['Missing work', 'أعمال غير مُسلَّمة'],
  'td.completion': ['Class completion rate', 'نسبة الإنجاز في الشعب'],
  'td.window': ['Last 6 weeks, including open work', 'آخر ٦ أسابيع، بما فيها الواجبات المفتوحة'],
  'td.attention': ['Needs your attention', 'بحاجة إلى متابعتك'],
  'td.att.waiting': [{ one: '1 submission waiting in {cls} — {title}', other: '{n} submissions waiting in {cls} — {title}' }, { one: 'تسليم واحد بانتظار التصحيح في {cls} — {title}', two: 'تسليمان بانتظار التصحيح في {cls} — {title}', few: '{n} تسليمات بانتظار التصحيح في {cls} — {title}', many: '{n} تسليمًا بانتظار التصحيح في {cls} — {title}', other: '{n} تسليم بانتظار التصحيح في {cls} — {title}' }],
  'td.att.graded': [{ one: '1 graded but not yet returned in {cls} — {title}', other: '{n} graded but not yet returned in {cls} — {title}' }, { one: 'عمل واحد قُيِّم ولم يُعَد بعد في {cls} — {title}', two: 'عملان قُيِّما ولم يُعادا بعد في {cls} — {title}', few: '{n} أعمال قُيِّمت ولم تُعَد بعد في {cls} — {title}', many: '{n} عملًا قُيِّم ولم يُعَد بعد في {cls} — {title}', other: '{n} عمل قُيِّم ولم يُعَد بعد في {cls} — {title}' }],
  'td.att.missing': [{ one: '1 student hasn’t handed in {title} ({cls})', other: '{n} students haven’t handed in {title} ({cls})' }, { one: 'طالب واحد لم يسلّم {title} ({cls})', two: 'طالبان لم يسلّما {title} ({cls})', few: '{n} طلاب لم يسلّموا {title} ({cls})', many: '{n} طالبًا لم يسلّموا {title} ({cls})', other: '{n} طالب لم يسلّموا {title} ({cls})' }],
  'td.att.none': ['All caught up — nothing needs your attention right now.', 'لا توجد مهام عاجلة الآن.'],
  'td.upcoming': ['Upcoming deadlines', 'مواعيد التسليم القادمة'],
  'td.noUpcoming': ['No upcoming deadlines.', 'لا توجد مواعيد تسليم قادمة.'],
  'td.handedIn': ['{n}/{total} handed in', 'سُلِّم {n} من {total}'],
  'ta.title': ['Assignments', 'الواجبات'],
  'ta.subtitle': ['Your Mathematics assignments for 8A, 8B and 8C', 'واجبات الرياضيات للشعب أ وب وج في الصف الثامن'],
  'ta.open': ['Open', 'مفتوحة'],
  'ta.scheduled': ['Scheduled', 'مجدولة'],
  'ta.past': ['Past', 'سابقة'],
  'ta.preview': ['Student preview', 'معاينة الطالب'],
  'ta.duplicate': ['Duplicate', 'نسخ'],
  'ta.publishes': ['Publishes {when}', 'يُنشر {when}'],
  'ta.toGrade': ['{n} to grade', 'للتصحيح: {n}'],
  'ta.actions': ['Actions', 'الإجراءات'],
  'dup.title': ['Duplicate to another class', 'نسخ إلى شعبة أخرى'],
  'dup.classes': ['Assign to', 'إسناد إلى'],
  'dup.due': ['New due date', 'موعد التسليم الجديد'],
  'dup.do': ['Duplicate assignment', 'نسخ الواجب'],
  'dup.done': ['Copied to {cls} — due {date}', 'نُسخ إلى {cls} — موعد التسليم {date}'],

  /* --- builder --- */
  'b.title': ['Create assignment', 'إنشاء واجب'],
  'b.subtitle': ['Pick a template or build from scratch — students see it as soon as you publish.', 'اختر قالبًا أو ابدأ من الصفر، ويراه الطلاب فور النشر.'],
  'b.templates': ['Start from a template', 'ابدأ من قالب'],
  'tpl.worksheet': ['Worksheet photo', 'صورة ورقة عمل'],
  'tpl.worksheet.d': ['Students photograph their written work', 'يصوّر الطلاب أعمالهم المكتوبة'],
  'tpl.quiz': ['Quiz (auto-marked)', 'اختبار قصير (تصحيح تلقائي)'],
  'tpl.quiz.d': ['Multiple choice and true/false, marked instantly', 'اختيار من متعدد وصح أو خطأ، يُصحَّح فورًا'],
  'tpl.reading': ['Reading response', 'استجابة قرائية'],
  'tpl.reading.d': ['Short and long answers about a text', 'إجابات قصيرة ومطوّلة عن نص'],
  'tpl.project': ['Project', 'مشروع'],
  'tpl.project.d': ['File upload with a reflection', 'رفع ملف مع تأمّل ذاتي'],
  'tpl.applied': ['Template applied — add a title and check the settings.', 'طُبِّق القالب — أضف عنوانًا وراجع الإعدادات.'],
  'b.details': ['Details', 'التفاصيل'],
  'b.fTitle': ['Title', 'العنوان'],
  'b.fTitlePh': ['e.g. Fractions Review', 'مثال: مراجعة الكسور'],
  'b.fInstr': ['Instructions', 'التعليمات'],
  'b.fInstrPh': ['What should students do?', 'ما المطلوب من الطلاب؟'],
  'b.subject': ['Subject', 'المادة'],
  'b.classes': ['Classes', 'الشعب'],
  'b.questions': ['Questions', 'الأسئلة'],
  'b.total': ['Total', 'المجموع'],
  'b.addQ': ['Add question', 'إضافة سؤال'],
  'b.empty': ['No questions yet. Use “Add question” to build the assignment.', 'لا توجد أسئلة بعد. استخدم «إضافة سؤال» لبناء الواجب.'],
  'b.prompt': ['Question', 'السؤال'],
  'b.promptPh': ['Type the question or task', 'اكتب السؤال أو المهمة'],
  'b.option': ['Option {n}', 'الخيار {n}'],
  'b.addOption': ['Add option', 'إضافة خيار'],
  'b.removeOption': ['Remove option', 'حذف الخيار'],
  'b.correct': ['Correct answer', 'الإجابة الصحيحة'],
  'b.correctOne': ['Select the correct answer', 'حدّد الإجابة الصحيحة'],
  'b.correctMany': ['Tick every correct answer', 'حدّد كل الإجابات الصحيحة'],
  'b.markCorrect': ['Mark as correct', 'تحديد كإجابة صحيحة'],
  'b.pairLeft': ['Item', 'العنصر'],
  'b.pairRight': ['Its match', 'ما يطابقه'],
  'b.addPair': ['Add pair', 'إضافة زوج'],
  'b.removePair': ['Remove pair', 'حذف الزوج'],
  'b.studentAnswers': ['Students type their answer here', 'يكتب الطلاب إجاباتهم هنا'],
  'b.fileInfo': ['Students attach a file — a document, image or PDF.', 'يرفق الطلاب ملفًا: مستندًا أو صورة أو PDF.'],
  'b.paperInfo': ['Students take or upload photos of their written pages. You can annotate them when grading.', 'يلتقط الطلاب صورًا لصفحاتهم المكتوبة أو يرفعونها، ويمكنك التعليق عليها أثناء التصحيح.'],
  'b.autoMarked': ['Auto-marked', 'تصحيح تلقائي'],
  'b.teacherMarked': ['Marked by you', 'تصحيح المعلّم'],
  'b.pts': ['Points', 'الدرجة'],
  'b.required': ['Required', 'مطلوب'],
  'b.duplicate': ['Duplicate', 'تكرار'],
  'b.delete': ['Delete', 'حذف'],
  'b.moveUp': ['Move up', 'نقل لأعلى'],
  'b.moveDown': ['Move down', 'نقل لأسفل'],
  'b.att.worksheet': ['Worksheet (PDF)', 'ورقة عمل (PDF)'],
  'b.att.worksheetName': ['Worksheet', 'ورقة العمل'],
  'b.att.image': ['Image', 'صورة'],
  'b.att.link': ['Add link', 'إضافة رابط'],
  'b.att.linkPh': ['Paste a link, e.g. a video or website', 'الصق رابطًا، مثل مقطع فيديو أو موقع'],
  'b.att.mock': ['Demo: a sample worksheet is attached — no real file is uploaded.', 'للعرض: أُرفقت ورقة عمل نموذجية ولا يُرفع أي ملف فعلي.'],
  'b.rubric': ['Rubric', 'معايير التقييم'],
  'b.rubric.hint': ['Choose criteria — the {n} points you mark yourself are split between them.', 'اختر المعايير، وتتوزع عليها الدرجات التي تصححها بنفسك ({n}).'],
  'b.rubric.add': ['Add', 'إضافة'],
  'b.rubric.none': ['Every question is auto-marked, so no rubric is needed.', 'جميع الأسئلة تُصحَّح تلقائيًا، فلا حاجة إلى معايير تقييم.'],
  'b.rubric.empty': ['Add questions first — the rubric covers the parts you mark yourself.', 'أضف الأسئلة أولًا، فمعايير التقييم تشمل الأجزاء التي تصححها بنفسك.'],
  'rub.method': ['Method', 'طريقة الحل'],
  'rub.accuracy': ['Accuracy', 'الدقة'],
  'rub.presentation': ['Presentation', 'العرض والتنظيم'],
  'rub.understanding': ['Understanding', 'الفهم'],
  'rub.evidence': ['Use of evidence', 'توظيف الشواهد'],
  'rub.language': ['Language', 'اللغة'],
  'rub.content': ['Content', 'المحتوى'],
  'rub.research': ['Research', 'البحث'],
  'rub.creativity': ['Creativity', 'الإبداع'],
  'rub.customPh': ['Add your own criterion', 'أضف معيارًا خاصًا بك'],
  'b.settings': ['Settings', 'الإعدادات'],
  'b.publish': ['Publishing', 'النشر'],
  'b.pubNow': ['Publish now', 'النشر الآن'],
  'b.pubSchedule': ['Schedule', 'جدولة'],
  'b.pubAt': ['Publish on', 'موعد النشر'],
  'b.due': ['Due date & time', 'تاريخ التسليم ووقته'],
  'b.dueDate': ['Due date', 'تاريخ التسليم'],
  'b.dueTime': ['Time', 'الوقت'],
  'b.late': ['Late work', 'التسليم المتأخر'],
  'b.late.accept': ['Accept and mark as late', 'قبوله مع تسجيله متأخرًا'],
  'b.late.until': ['Accept until a set date', 'قبوله حتى تاريخ محدد'],
  'b.late.none': ['Don’t accept', 'عدم القبول'],
  'b.late.default': ['Default', 'افتراضي'],
  'b.late.untilDate': ['Accept late work until', 'قبول التسليم المتأخر حتى'],
  'b.deduct': ['Deduct a percentage per day late', 'خصم نسبة عن كل يوم تأخير'],
  'b.deduct.hint': ['Off by default — follow the school’s assessment policy.', 'غير مفعّل افتراضيًا — اتبع سياسة التقييم في المدرسة.'],
  'b.deduct.pct': ['% per day', '٪ عن كل يوم'],
  'b.resubmit': ['Allow resubmission', 'السماح بإعادة التسليم'],
  'b.resubmit.hint': ['Students can hand in again after feedback', 'يمكن للطلاب التسليم مجددًا بعد الملاحظات'],
  'b.studentsSee': ['Students will see', 'سيرى الطلاب'],
  'b.preview': ['Student preview', 'معاينة الطالب'],
  'b.editMode': ['Edit', 'تحرير'],
  'b.previewBanner': ['This is exactly what students will see. Answers typed here are not saved.', 'هذا ما سيراه الطلاب تمامًا، ولا تُحفظ الإجابات المكتوبة هنا.'],
  'b.publishBtn': ['Publish', 'نشر'],
  'b.scheduleBtn': ['Schedule', 'جدولة'],
  'b.published': ['Published to {cls}. Students can see it now.', 'نُشر الواجب لـ{cls}، ويمكن للطلاب رؤيته الآن.'],
  'b.scheduled': ['Scheduled — it will appear for students {when}.', 'جُدول النشر، وسيظهر للطلاب {when}.'],
  'b.viewAsStudent': ['View as student', 'العرض بصفة طالب'],
  'b.discard': ['Clear form', 'مسح النموذج'],
  'b.draftKept': ['Your draft is kept while you switch views.', 'تُحفظ مسودتك أثناء التنقل بين الصفحات.'],
  'b.err.title': ['Add a title.', 'أضف عنوانًا.'],
  'b.err.classes': ['Choose at least one class.', 'اختر شعبة واحدة على الأقل.'],
  'b.err.blocks': ['Add at least one question.', 'أضف سؤالًا واحدًا على الأقل.'],
  'b.err.due': ['Choose a due date in the future, after publishing.', 'اختر موعد تسليم في المستقبل وبعد موعد النشر.'],
  'b.err.publish': ['Choose a publishing time in the future.', 'اختر موعد نشر في المستقبل.'],
  'b.err.prompt': ['Some questions are missing text, options or a correct answer.', 'بعض الأسئلة ينقصها نص أو خيارات أو إجابة صحيحة.'],
  'b.err.fix': ['Please fix the highlighted items before publishing.', 'يُرجى تصحيح العناصر المحددة قبل النشر.'],

  /* --- submissions & grading --- */
  'sub.title': ['Submissions', 'التسليمات'],
  'sub.queue': ['Grading', 'التصحيح'],
  'sub.queue.hint': ['Work waiting for you, most urgent first', 'الأعمال التي بانتظارك، الأكثر إلحاحًا أولًا'],
  'sub.allAssignments': ['All assignments', 'جميع الواجبات'],
  'sub.filter': ['Filter by status', 'التصفية حسب الحالة'],
  'sub.all': ['All', 'الكل'],
  'sub.toGrade': ['To grade', 'بانتظار التصحيح'],
  'sub.student': ['Student', 'الطالب'],
  'sub.status': ['Status', 'الحالة'],
  'sub.time': ['Submitted', 'وقت التسليم'],
  'sub.mark': ['Mark', 'الدرجة'],
  'sub.handedIn': ['Handed in', 'المُسلَّم'],
  'sub.grade': ['Grade', 'تصحيح'],
  'sub.view': ['View', 'عرض'],
  'sub.remind': ['Remind missing students', 'تذكير من لم يسلّم'],
  'sub.remindOne': ['Remind', 'تذكير'],
  'sub.returnAll': ['Return all graded', 'إعادة جميع المُقيَّمة'],
  'sub.reminded': [{ one: 'Reminder added to 1 student’s dashboard (demo — no message is sent).', other: 'Reminder added to {n} students’ dashboards (demo — no messages are sent).' }, { one: 'أُضيف تذكير إلى لوحة طالب واحد (للعرض فقط — لا تُرسَل رسائل).', two: 'أُضيف تذكير إلى لوحتي طالبين (للعرض فقط — لا تُرسَل رسائل).', few: 'أُضيف تذكير إلى لوحات {n} طلاب (للعرض فقط — لا تُرسَل رسائل).', many: 'أُضيف تذكير إلى لوحات {n} طالبًا (للعرض فقط — لا تُرسَل رسائل).', other: 'أُضيف تذكير إلى لوحات {n} طالب (للعرض فقط — لا تُرسَل رسائل).' }],
  'sub.returnedAll': [{ one: '1 graded submission returned.', other: '{n} graded submissions returned.' }, { one: 'أُعيد تسليم واحد مُقيَّم.', two: 'أُعيد تسليمان مُقيَّمان.', few: 'أُعيدت {n} تسليمات مُقيَّمة.', many: 'أُعيد {n} تسليمًا مُقيَّمًا.', other: 'أُعيد {n} تسليم مُقيَّم.' }],
  'sub.noneGraded': ['No graded work is waiting to be returned.', 'لا توجد أعمال مُقيَّمة بانتظار الإعادة.'],
  'sub.noneToRemind': ['Everyone has handed this in.', 'سلّم الجميع هذا الواجب.'],
  'sub.empty': ['No students match this filter.', 'لا يوجد طلاب ضمن هذه التصفية.'],
  'g.tools': ['Annotation tools', 'أدوات التعليق'],
  'g.pen': ['Pen', 'قلم'],
  'g.tick': ['Tick', 'علامة صح'],
  'g.cross': ['Cross', 'علامة خطأ'],
  'g.text': ['Text note', 'ملاحظة نصية'],
  'g.undo': ['Undo', 'تراجع'],
  'g.textPh': ['Type a note, then press Enter', 'اكتب ملاحظة ثم اضغط Enter'],
  'g.annotHint': ['Choose a tool, then mark the page', 'اختر أداة ثم علّق على الصفحة'],
  'g.pages': ['Photographed pages', 'الصفحات المصوّرة'],
  'g.answers': ['Student’s answers', 'إجابات الطالب'],
  'g.noteFromStudent': ['Note from the student', 'ملاحظة الطالب'],
  'g.panel': ['Marking', 'التقييم'],
  'g.auto': ['Auto-marked score', 'الدرجة التلقائية'],
  'g.rubric': ['Rubric', 'معايير التقييم'],
  'g.final': ['Final mark', 'الدرجة النهائية'],
  'g.useSuggested': ['Use calculated', 'استخدام المحسوبة'],
  'g.breakdown': ['Auto-marked {auto} + rubric {rub}', 'التلقائية {auto} + المعايير {rub}'],
  'g.deductSuggest': ['Late-work policy: −{pct} → suggested mark {mark}', 'سياسة التأخير: خصم {pct} ← الدرجة المقترحة {mark}'],
  'g.comment': ['Comment to the student (private)', 'تعليق للطالب (خاص)'],
  'g.commentPh': ['Write feedback for the student…', 'اكتب ملاحظاتك للطالب…'],
  'g.quick': ['Quick comments', 'تعليقات سريعة'],
  'qc.working': ['Clear working shown', 'خطوات الحل واضحة'],
  'qc.signs': ['Check your signs', 'راجع الإشارات'],
  'qc.improve': ['Great improvement', 'تحسّن رائع'],
  'qc.simplify': ['Simplify your final answer', 'بسّط إجابتك النهائية'],
  'qc.units': ['Remember the units', 'تذكّر الوحدات'],
  'g.return': ['Return', 'إعادة إلى الطالب'],
  'g.revise': ['Return for revision', 'إرجاع للتعديل'],
  'g.save': ['Save grade', 'حفظ التقييم'],
  'g.next': ['Next student', 'الطالب التالي'],
  'g.prev': ['Previous', 'السابق'],
  'g.returned': ['Returned to {name}', 'أُعيد إلى {name}'],
  'g.revised': ['Returned to {name} for revision', 'أُعيد إلى {name} للتعديل'],
  'g.saved': ['Grade saved — return it whenever you’re ready.', 'حُفظ التقييم — أعده متى شئت.'],
  'g.noSubmission': ['{name} hasn’t submitted this yet.', 'لم يسلّم {name} هذا الواجب بعد.'],
  'g.remindOne': ['Remind {name}', 'تذكير {name}'],
  'g.queueLeft': ['{n} left to grade in {cls}', 'المتبقي للتصحيح في {cls}: {n}'],
  'g.allDone': ['Everything in this class is graded', 'صُحِّحت جميع أعمال هذه الشعبة'],

  /* --- insights --- */
  'in.title': ['Class insights', 'مؤشرات الصفوف'],
  'in.subtitle': ['Mathematics · last 6 weeks · sample data', 'الرياضيات · آخر ٦ أسابيع · بيانات تجريبية'],
  'in.privacy': ['Visible to teachers only. No student rankings are shown.', 'تظهر للمعلّمين فقط، ولا تُعرض أي ترتيبات للطلاب.'],
  'in.completion': ['Completion rate per assignment', 'نسبة الإنجاز لكل واجب'],
  'in.timeliness': ['On time, late and missing', 'في الموعد، ومتأخر، وغير مُسلَّم'],
  'in.trend': ['Average mark trend', 'اتجاه متوسط الدرجات'],
  'in.trend.sub': ['Class average for each marked assignment', 'متوسط الشعبة في كل واجب مُقيَّم'],
  'in.noMarks': ['No marked work yet.', 'لا توجد أعمال مُقيَّمة بعد.'],
  'in.support': ['Students who may need support', 'طلاب قد يحتاجون إلى دعم'],
  'in.support.hint': ['3 or more missing pieces, or an average below 50%', '٣ واجبات غير مُسلَّمة أو أكثر، أو متوسط أقل من ٥٠٪'],
  'in.noSupport': ['No students flagged in this class right now.', 'لا يوجد طلاب بحاجة إلى متابعة في هذه الشعبة حاليًا.'],
  'in.onTime': ['On time', 'في الموعد'],
  'in.late': ['Late', 'متأخر'],
  'in.missing': ['Missing', 'غير مُسلَّم'],
  'in.pending': ['Not due yet', 'لم يحن موعده'],
  'in.open': ['open', 'مفتوح'],
  'in.table': ['Show table', 'عرض كجدول'],
  'in.chart': ['Show chart', 'عرض كمخطط'],
  'in.assignment': ['Assignment', 'الواجب'],
  'in.rate': ['Rate', 'النسبة'],
  'in.avgMark': ['Average mark', 'متوسط الدرجات'],
  'in.missingCount': ['{n} missing', 'غير مُسلَّم: {n}'],
  'in.avg': ['average {pct}', 'المتوسط {pct}'],
  'in.viewWork': ['View work', 'عرض الأعمال'],

  /* --- admin --- */
  'ad.title': ['School overview', 'نظرة عامة على المدرسة'],
  'ad.user': ['Head of Middle School', 'رئيس المرحلة المتوسطة'],
  'ad.scope': ['Middle School · Grades 6–8', 'المرحلة المتوسطة · الصفوف ٦–٨'],
  'ad.subtitle': ['Middle School · Grades 6–8 · sample data', 'المرحلة المتوسطة · الصفوف ٦–٨ · بيانات تجريبية'],
  'ad.liveNote': ['Grade 8 Mathematics and Grade 8B update live from this demo session. All other figures are fixed sample data.', 'تتحدّث بيانات رياضيات الصف الثامن والشعبة ب مباشرة من هذه الجلسة التجريبية، وبقية الأرقام بيانات تجريبية ثابتة.'],
  'ad.grade': ['Grade', 'الصف'],
  'ad.gradeN': ['Grade {g}', 'الصف {g}'],
  'ad.allGrades': ['All grades', 'كل الصفوف'],
  'ad.subject': ['Subject', 'المادة'],
  'ad.week': ['Week', 'الأسبوع'],
  'ad.wk.prev': ['Last week', 'الأسبوع الماضي'],
  'ad.wk.this': ['This week', 'هذا الأسبوع'],
  'ad.wk.next': ['Next week', 'الأسبوع القادم'],
  'ad.soFar': ['Work handed in so far, for assignments due in the selected week', 'الأعمال المُسلَّمة حتى الآن للواجبات المطلوبة في الأسبوع المحدد'],
  'ad.tipHanded': ['{n} of {total} handed in', 'سُلِّم {n} من {total}'],
  'ad.kpi.completion': ['Homework completion', 'إنجاز الواجبات'],
  'ad.kpi.outstanding': ['Outstanding submissions', 'تسليمات متبقية'],
  'ad.kpi.late': ['Late submissions', 'تسليمات متأخرة'],
  'ad.kpi.backlog': ['Grading backlog', 'أعمال بانتظار التصحيح'],
  'ad.kpi.turnaround': ['Avg. marking turnaround', 'متوسط مدة التصحيح'],
  'ad.byGrade': ['Completion by grade', 'الإنجاز حسب الصف'],
  'ad.bySubject': ['Completion by subject', 'الإنجاز حسب المادة'],
  'ad.load': ['Assignment load per class per day', 'عدد الواجبات المطلوبة لكل شعبة يوميًا'],
  'ad.load.hint': ['All subjects. Days with 3 or more assignments due are highlighted.', 'جميع المواد. تُبرز الأيام التي يُطلب فيها ٣ واجبات أو أكثر.'],
  'ad.load.flag': [{ one: '{cls} has {n} assignment due on {day}', other: '{cls} has {n} assignments due on {day}' }, { one: 'لدى {cls} واجب واحد مطلوب يوم {day}', two: 'لدى {cls} واجبان مطلوبان يوم {day}', few: 'لدى {cls} {n} واجبات مطلوبة يوم {day}', many: 'لدى {cls} {n} واجبًا مطلوبًا يوم {day}', other: 'لدى {cls} {n} واجب مطلوب يوم {day}' }],
  'ad.load.none': ['No overloaded days in this selection.', 'لا توجد أيام مزدحمة ضمن هذا الاختيار.'],
  'ad.heavy': ['heavy day', 'يوم مزدحم'],
  'ad.class': ['Class', 'الشعبة'],
  'ad.backlog': ['Teacher grading backlog', 'الأعمال بانتظار التصحيح لدى المعلّمين'],
  'ad.teacher': ['Teacher', 'المعلّم'],
  'ad.toGrade': ['To grade', 'للتصحيح'],
  'ad.turn': ['Turnaround', 'مدة التصحيح'],
  'ad.live': ['LIVE', 'مباشر'],
  'ad.followUp': ['Students needing follow-up', 'طلاب بحاجة إلى متابعة'],
  'ad.followUp.hint': ['3 or more missing pieces of work', '٣ واجبات غير مُسلَّمة أو أكثر'],
  'ad.followUp.none': ['No students need follow-up for this selection.', 'لا يوجد طلاب بحاجة إلى متابعة ضمن هذا الاختيار.'],
  'ad.notify': ['Notify homeroom teacher', 'إبلاغ رائد الفصل'],
  'ad.notified': ['Noted for follow-up', 'سُجّلت للمتابعة'],
  'ad.notifyToast': ['Demo: the homeroom teacher of {cls} would be notified here. Nothing was sent.', 'للعرض: سيُبلَّغ رائد فصل {cls} هنا، ولم يُرسَل أي إشعار.'],
  'ad.activity': ['Recent activity', 'آخر النشاطات'],
  'ad.act.submitted': ['{name} submitted “{title}”', 'سلّم {name} واجب «{title}»'],
  'ad.act.returned': ['“{title}” returned to {name}', 'أُعيد واجب «{title}» إلى {name}'],
  'ad.act.published': ['“{title}” published for {cls}', 'نُشر واجب «{title}» لـ{cls}'],

  /* --- demo guide --- */
  'guide.title': ['Demo guide', 'دليل العرض'],
  'guide.hide': ['Hide demo guide', 'إخفاء دليل العرض'],
  'guide.go': ['Go', 'انتقال'],
  'guide.done': ['Done', 'تم'],
  'guide.progress': ['{n}/6', '{n} من ٦'],
  'guide.s1': ['Teacher: create “Fractions Review” for 8B from the Worksheet photo template, set a due date and publish', 'المعلّم: أنشئ واجب «Fractions Review» للشعبة ب من قالب «صورة ورقة عمل»، وحدّد موعد التسليم ثم انشره'],
  'guide.s2': ['Student: it appears at the top of “Due soon” — open it and submit paper homework with a sample photo', 'الطالب: يظهر في أعلى «مواعيد تسليم قريبة» — افتحه وسلّم الواجب الورقي بصورة نموذجية'],
  'guide.s3': ['Teacher: the submission is in the queue — annotate the photo, score the rubric, comment and Return', 'المعلّم: التسليم في قائمة التصحيح — علّق على الصورة وقيّم المعايير وأضف تعليقًا ثم أعده'],
  'guide.s4': ['Student: see the mark, the comment and the annotations', 'الطالب: اطّلع على الدرجة والتعليق والملاحظات على الصورة'],
  'guide.s5': ['Teacher: Class insights — completion goes up', 'المعلّم: مؤشرات الصفوف — ترتفع نسبة الإنجاز'],
  'guide.s6': ['Admin: the school overview reflects the new submission', 'الإدارة: تظهر التسليمة الجديدة في النظرة العامة'],
});

/* ============================================================================
 * 3. FORMATTING, TIME & SMALL HELPERS
 * ========================================================================== */

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const cx = (...xs) => xs.filter(Boolean).join(' ');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const uid = (() => { let i = 0; return (p = 'id') => `${p}_${Date.now().toString(36)}_${(i++).toString(36)}`; })();
const subKey = (aid, sid) => `${aid}:${sid}`;
const sum = (xs) => xs.reduce((s, x) => s + (Number(x) || 0), 0);
const round1 = (x) => Math.round(x * 10) / 10;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rnd() {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startOfDay(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function isWeekend(ts) { const wd = new Date(ts).getDay(); return wd === 5 || wd === 6; } // Fri & Sat in KSA

/** A timestamp `offset` days from today at hh:mm, nudged off the Fri/Sat weekend. */
function atDay(offset, h = 19, m = 0, base = Date.now()) {
  const d = new Date(base); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset);
  const wd = d.getDay();
  if (wd === 5) d.setDate(d.getDate() + (offset >= 0 ? 2 : -1));
  else if (wd === 6) d.setDate(d.getDate() + (offset >= 0 ? 1 : -2));
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

/** Sunday that starts the current school week (on Fri/Sat, the coming week). */
function schoolWeekStart(now, offsetWeeks = 0) {
  const d = new Date(startOfDay(now)); const wd = d.getDay();
  if (wd === 5) d.setDate(d.getDate() + 2);
  else if (wd === 6) d.setDate(d.getDate() + 1);
  else d.setDate(d.getDate() - wd);
  d.setDate(d.getDate() + offsetWeeks * 7);
  return d.getTime();
}

const toYMD = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const toHM = (ts) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const fromYMDHM = (ymd, hm) => { const [y, mo, da] = ymd.split('-').map(Number); const [h, mi] = (hm || '00:00').split(':').map(Number); return new Date(y, mo - 1, da, h, mi, 0, 0).getTime(); };

function makeI18n(lang) {
  const ar = lang === 'ar';
  const idx = ar ? 1 : 0;
  const numLoc = ar ? 'ar-SA-u-nu-arab' : 'en-GB';
  const nf = new Intl.NumberFormat(numLoc, { maximumFractionDigits: 1 });
  const pf = new Intl.NumberFormat(numLoc, { style: 'percent', maximumFractionDigits: 0 });
  const pr = new Intl.PluralRules(ar ? 'ar' : 'en');
  const dloc = ar ? 'ar-SA-u-ca-gregory-nu-arab' : 'en-GB';
  const tloc = ar ? 'ar-SA-u-ca-gregory-nu-arab' : 'en-US';
  const mk = (loc, o) => new Intl.DateTimeFormat(loc, o);
  const F = {
    date: mk(dloc, { weekday: 'short', day: 'numeric', month: 'short' }),
    dateNoWd: mk(dloc, { day: 'numeric', month: 'short' }),
    dateLong: mk(dloc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    time: mk(tloc, { hour: 'numeric', minute: '2-digit', hour12: true }),
    weekday: mk(dloc, { weekday: 'long' }),
    weekdayShort: mk(dloc, { weekday: 'short' }),
    dayNum: mk(dloc, { day: 'numeric' }),
    // Hijri (Umm al-Qura) is always generated, never hard-coded.
    hijri: mk(ar ? 'ar-SA-u-ca-islamic-umalqura-nu-arab' : 'en-GB-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
  const fmtVar = (v) => (typeof v === 'number' ? nf.format(v) : v);
  const interp = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? fmtVar(vars[k]) : ''));
  const t = (key, vars) => {
    const e = T[key];
    if (!e) { if (typeof console !== 'undefined') console.warn('[i18n] missing key', key); return key; }
    let s = e[idx];
    if (s && typeof s === 'object') { const n = vars && typeof vars.n === 'number' ? vars.n : 0; s = s[pr.select(n)] ?? s.other; }
    return interp(s, vars);
  };
  t.s = (key, stage, vars) => (T[`${key}.${stage}`] ? t(`${key}.${stage}`, vars) : t(key, vars));
  t.has = (key) => !!T[key];
  const fmt = {
    n: (x) => nf.format(x),
    pct: (x) => pf.format(Number.isFinite(x) ? x : 0),
    date: (ts) => F.date.format(ts),
    dateNoWd: (ts) => F.dateNoWd.format(ts),
    dateLong: (ts) => F.dateLong.format(ts),
    time: (ts) => F.time.format(ts),
    weekday: (ts) => F.weekday.format(ts),
    weekdayShort: (ts) => F.weekdayShort.format(ts),
    dayNum: (ts) => F.dayNum.format(ts),
    hijri: (ts) => F.hijri.format(ts),
    dateTime: (ts) => (ar ? `${F.date.format(ts)}، ${F.time.format(ts)}` : `${F.date.format(ts)}, ${F.time.format(ts)}`),
    score: (s, max) => `${nf.format(s)} / ${nf.format(max)}`,
  };
  return { t, fmt, dir: ar ? 'rtl' : 'ltr', ar };
}

/** "Due tomorrow, 7:00 PM" style countdown. */
function dueLabel(t, fmt, due, now) {
  const diff = due - now;
  if (diff > 0 && diff < HOUR) return t('due.lessHour');
  if (diff > 0 && diff < 6 * HOUR) return t('due.inHours', { n: Math.round(diff / HOUR) });
  const dd = Math.round((startOfDay(due) - startOfDay(now)) / DAY);
  const time = fmt.time(due);
  if (dd === 0) return t('due.today', { time });
  if (dd === 1) return t('due.tomorrow', { time });
  if (dd > 1 && dd < 7) return t('due.weekday', { day: fmt.weekday(due), time });
  return t('due.date', { date: fmt.date(due), time });
}

function agoLabel(t, ts, now) {
  const d = now - ts;
  if (d < 1.5 * MIN) return t('ago.now');
  if (d < HOUR) return t('ago.min', { n: Math.round(d / MIN) });
  if (d < DAY) return t('ago.hour', { n: Math.round(d / HOUR) });
  return t('ago.day', { n: Math.max(1, Math.round((startOfDay(now) - startOfDay(ts)) / DAY)) });
}

const lateDays = (due, at) => Math.max(1, Math.ceil((at - due) / DAY));

/* ============================================================================
 * 4. STATIC ENTITIES — all fictional
 * ========================================================================== */

const SUBJECTS = {
  math: { en: 'Mathematics', ar: 'الرياضيات', color: '#3B5BDB', icon: Sigma },
  english: { en: 'English', ar: 'اللغة الإنجليزية', color: '#C2410C', icon: BookOpen },
  science: { en: 'Science', ar: 'العلوم', color: '#0E7490', icon: FlaskConical },
  arabic: { en: 'Arabic', ar: 'اللغة العربية', color: '#7E22CE', icon: PenLine },
  islamic: { en: 'Islamic Studies', ar: 'الدراسات الإسلامية', color: '#15803D', icon: BookMarked },
  social: { en: 'Social Studies', ar: 'الدراسات الاجتماعية', color: '#A16207', icon: Globe2 },
  ict: { en: 'ICT', ar: 'الحاسب وتقنية المعلومات', color: '#475569', icon: Monitor },
  art: { en: 'Art', ar: 'التربية الفنية', color: '#DB2777', icon: Palette },
  biology: { en: 'Biology', ar: 'الأحياء', color: '#0F766E', icon: Dna },
  chemistry: { en: 'Chemistry', ar: 'الكيمياء', color: '#0369A1', icon: FlaskConical },
  physics: { en: 'Physics', ar: 'الفيزياء', color: '#4338CA', icon: Atom },
  englit: { en: 'English Literature', ar: 'الأدب الإنجليزي', color: '#C2410C', icon: BookOpen },
};
const CORE_SUBJECTS = ['math', 'english', 'science', 'arabic', 'islamic', 'social', 'ict', 'art'];

const TEACHERS = {
  sarah: { en: 'Ms. Sarah Hassan', ar: 'المعلّمة سارة حسن', shortEn: 'Ms. Sarah', shortAr: 'المعلّمة سارة', subject: 'math' },
  emily: { en: 'Ms. Emily Clarke', ar: 'المعلّمة إميلي كلارك', subject: 'english' },
  yusuf: { en: 'Mr. Yusuf Rahman', ar: 'المعلّم يوسف رحمن', subject: 'science' },
  mona: { en: 'Ms. Mona Al-Otaibi', ar: 'المعلّمة منى العتيبي', subject: 'arabic' },
  abdullah: { en: 'Mr. Abdullah Al-Shehri', ar: 'المعلّم عبدالله الشهري', subject: 'islamic' },
  hassan: { en: 'Mr. Hassan Qureshi', ar: 'المعلّم حسن قريشي', subject: 'social' },
  adel: { en: 'Mr. Adel Mansour', ar: 'المعلّم عادل منصور', subject: 'ict' },
  lina: { en: 'Ms. Lina Haddad', ar: 'المعلّمة لينا حداد', subject: 'art' },
  noura: { en: 'Ms. Noura Al-Zahrani', ar: 'المعلّمة نورة الزهراني', subject: 'math' },
  hind: { en: 'Ms. Hind Al-Malki', ar: 'المعلّمة هند المالكي', subject: 'arabic' },
  khalid: { en: 'Dr. Khalid Bakr', ar: 'الدكتور خالد بكر', subject: 'biology' },
  ahmed: { en: 'Mr. Ahmed Fathy', ar: 'المعلّم أحمد فتحي', subject: 'math' },
  rania: { en: 'Ms. Rania Aziz', ar: 'المعلّمة رانيا عزيز', subject: 'englit' },
  tariq: { en: 'Mr. Tariq Saleh', ar: 'المعلّم طارق صالح', subject: 'chemistry' },
  huda: { en: 'Ms. Huda Kamal', ar: 'المعلّمة هدى كمال', subject: 'physics' },
  farouk: { en: 'Mr. Omar Farouk', ar: 'المعلّم عمر فاروق', subject: 'math' },
  maha: { en: 'Ms. Maha Al-Sayed', ar: 'المعلّمة مها السيد', subject: 'english' },
};
const DEMO_TEACHER = 'sarah';
const SARAH_CLASSES = ['8A', '8B', '8C'];

const GRADE_AR = { 1: 'الأول', 6: 'السادس', 7: 'السابع', 8: 'الثامن', 11: 'الحادي عشر' };
const SEC_AR = { A: 'أ', B: 'ب', C: 'ج' };
const parseCls = (c) => ({ g: Number(c.slice(0, -1)), s: c.slice(-1) });
const ADMIN_CLASSES = ['6A', '6B', '6C', '7A', '7B', '7C', '8A', '8B', '8C'];

const FIRST_BOYS = [['Abdullah', 'عبدالله'], ['Abdulaziz', 'عبدالعزيز'], ['Ahmed', 'أحمد'], ['Ali', 'علي'], ['Anas', 'أنس'], ['Bader', 'بدر'], ['Hamad', 'حمد'], ['Hussain', 'حسين'], ['Ibrahim', 'إبراهيم'], ['Kareem', 'كريم'], ['Khalid', 'خالد'], ['Mazen', 'مازن'], ['Mohammed', 'محمد'], ['Muath', 'معاذ'], ['Nasser', 'ناصر'], ['Osama', 'أسامة'], ['Rakan', 'راكان'], ['Saud', 'سعود'], ['Sami', 'سامي'], ['Talal', 'طلال'], ['Waleed', 'وليد'], ['Yazeed', 'يزيد'], ['Yousef', 'يوسف'], ['Ziyad', 'زياد'], ['Hamza', 'حمزة'], ['Majed', 'ماجد'], ['Turki', 'تركي'], ['Saleh', 'صالح'], ['Fahad', 'فهد'], ['Sultan', 'سلطان'], ['Nawaf', 'نواف'], ['Rayan', 'ريان'], ['Adam', 'آدم'], ['Zaid', 'زيد'], ['Tariq', 'طارق'], ['Mustafa', 'مصطفى'], ['Hassan', 'حسن'], ['Saad', 'سعد'], ['Faris', 'فارس'], ['Hatem', 'حاتم'], ['Ammar', 'عمّار'], ['Bilal', 'بلال'], ['Jamal', 'جمال'], ['Luay', 'لؤي'], ['Mansour', 'منصور']];
const FAMILY = [['Al-Qahtani', 'القحطاني'], ['Al-Ghamdi', 'الغامدي'], ['Al-Zahrani', 'الزهراني'], ['Al-Otaibi', 'العتيبي'], ['Al-Shehri', 'الشهري'], ['Al-Dosari', 'الدوسري'], ['Al-Mutairi', 'المطيري'], ['Al-Shammari', 'الشمري'], ['Al-Malki', 'المالكي'], ['Al-Juhani', 'الجهني'], ['Al-Subaie', 'السبيعي'], ['Al-Anazi', 'العنزي'], ['Al-Sharif', 'الشريف'], ['Al-Amoudi', 'العمودي'], ['Al-Harthi', 'الحارثي'], ['Al-Bishi', 'البيشي'], ['Al-Yami', 'اليامي'], ['Al-Rashidi', 'الرشيدي'], ['Al-Hazmi', 'الحازمي'], ['Al-Saadi', 'السعدي'], ['Bakr', 'بكر'], ['Khan', 'خان'], ['Siddiqui', 'صدّيقي'], ['Al-Attas', 'العطاس'], ['Hashem', 'هاشم'], ['Al-Kaabi', 'الكعبي'], ['Al-Faraj', 'الفرج'], ['Al-Saleh', 'الصالح'], ['Al-Harbi', 'الحربي'], ['Bawazir', 'باوزير']];

function makeStudent(id, cls, first, family) {
  return { id, cls, en: `${first[0]} ${family[0]}`, ar: `${first[1]} ${family[1]}`, firstEn: first[0], firstAr: first[1] };
}

const STUDENT_OMAR = makeStudent('s_omar', '8B', ['Omar', 'عمر'], ['Al-Harbi', 'الحربي']);
const STUDENT_LAYAN = makeStudent('s_layan', '1A', ['Layan', 'ليان'], ['Al-Qahtani', 'القحطاني']);
const STUDENT_FAISAL = makeStudent('s_faisal', '11A', ['Faisal', 'فيصل'], ['Al-Ghamdi', 'الغامدي']);
const STAGE_STUDENT = { early: STUDENT_LAYAN, middle: STUDENT_OMAR, senior: STUDENT_FAISAL };

/** Deterministic class rosters (24 in 8B including Omar; 22 in 8A and 8C). */
const ROSTERS = (() => {
  const rnd = mulberry32(8008);
  const used = new Set(['Omar Al-Harbi']);
  const make = (cls, n, startFirst) => {
    const out = []; const firsts = new Set();
    let fi = startFirst;
    while (out.length < n) {
      const first = FIRST_BOYS[fi % FIRST_BOYS.length]; fi += 1;
      if (firsts.has(first[0])) continue;
      let fam; let tries = 0;
      do { fam = FAMILY[Math.floor(rnd() * FAMILY.length)]; tries += 1; } while (used.has(`${first[0]} ${fam[0]}`) && tries < 50);
      used.add(`${first[0]} ${fam[0]}`); firsts.add(first[0]);
      out.push(makeStudent(`s_${cls.toLowerCase()}_${String(out.length + 1).padStart(2, '0')}`, cls, first, fam));
    }
    return out;
  };
  const r8b = make('8B', 23, 3);
  const all = {
    '8A': make('8A', 22, 17),
    '8B': [STUDENT_OMAR, ...r8b].sort((a, b) => a.en.localeCompare(b.en)),
    '8C': make('8C', 22, 30),
    '1A': [STUDENT_LAYAN],
    '11A': [STUDENT_FAISAL],
  };
  all['8A'].sort((a, b) => a.en.localeCompare(b.en));
  all['8C'].sort((a, b) => a.en.localeCompare(b.en));
  return all;
})();
const STUDENTS = Object.fromEntries(Object.values(ROSTERS).flat().map((s) => [s.id, s]));

/** Students whose seeded record shows a pattern worth following up (fictional). */
const SUPPORT_PATTERNS = (() => {
  const pick = (cls, i) => ROSTERS[cls].filter((s) => s.id !== 's_omar')[i].id;
  return {
    [pick('8B', 15)]: { missing: ['m2', 'm3', 'm4'], ability: 0.55 },
    [pick('8B', 9)]: { missing: ['m1', 'm4', 'm5'], ability: 0.6 },
    [pick('8A', 8)]: { missing: ['m2', 'm3', 'm5'], ability: 0.58 },
    [pick('8C', 4)]: { missing: ['m3'], ability: 0.36 },
  };
})();

/* ============================================================================
 * 5. SAMPLE PAGE IMAGES — inline SVG drawn to look like photographed pages.
 * Used by "Use a sample page" (for laptops without a camera) and by the seed.
 * ========================================================================== */

const INK = '#1f3f94';
const PENCIL = '#4f4d5c';
const HANDF = "'Segoe Print','Bradley Hand','Comic Sans MS','Chalkboard SE','Noteworthy',cursive";
const SERIFF = "Georgia,'Times New Roman',serif";
const SANSF = "'Helvetica Neue',Arial,Tahoma,sans-serif";
const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svgText(x, y, s, o = {}) {
  const { size = 30, fill = INK, font = HANDF, weight = 400, rot = 0, anchor = 'start', extra = '' } = o;
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''} ${extra}>${xmlEsc(s)}</text>`;
}
function svgFrac(x, y, n, d, size = 28, fill = INK) {
  const w = Math.max(String(n).length, String(d).length) * size * 0.55 + 12;
  const mid = x + w / 2;
  return { w, s: svgText(mid, y - 7, n, { size, fill, anchor: 'middle' }) + `<path d="M${x + 2} ${y} q ${w / 2} 2 ${w - 4} -1" stroke="${fill}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + svgText(mid, y + size + 1, d, { size, fill, anchor: 'middle' }) };
}
function svgMathLine(tokens, x, y, size = 28) {
  let s = ''; let cur = x;
  for (const tk of tokens) {
    if (Array.isArray(tk)) { const f = svgFrac(cur, y, tk[0], tk[1], size); s += f.s; cur += f.w + 8; }
    else { s += svgText(cur, y + size * 0.36, tk, { size }); cur += String(tk).length * size * 0.5 + 12; }
  }
  return s;
}

function photoSvg(inner, { tilt = -1.4, paper = '#fbfaf4', desk = ['#8b7863', '#4a3d31'], lined = true, margin = true } = {}) {
  const W = 900; const H = 1200; const pw = 760; const ph = 1040;
  let rules = '';
  if (lined) for (let y = 150; y < ph - 20; y += 44) rules += `<line x1="0" y1="${y}" x2="${pw}" y2="${y}" stroke="#b9cde9" stroke-width="1.6"/>`;
  if (margin) rules += `<line x1="100" y1="0" x2="100" y2="${ph}" stroke="#e6a3a3" stroke-width="2"/>`;
  let grain = '';
  for (let i = 0; i < 9; i += 1) { const y = 40 + i * 140; grain += `<path d="M0 ${y} C 250 ${y + 30}, 600 ${y - 25}, 900 ${y + 18}" stroke="#000" stroke-opacity=".07" stroke-width="3" fill="none"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<linearGradient id="dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${desk[0]}"/><stop offset="1" stop-color="${desk[1]}"/></linearGradient>
<radialGradient id="lt" cx=".4" cy=".32" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".30"/></radialGradient>
<linearGradient id="pp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#d8d2c2" stop-opacity=".35"/></linearGradient>
<filter id="sh" x="-10%" y="-10%" width="125%" height="125%"><feDropShadow dx="7" dy="12" stdDeviation="13" flood-color="#000" flood-opacity=".38"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#dk)"/>${grain}
<g transform="rotate(${tilt} ${W / 2} ${H / 2}) translate(70 80)">
<rect width="${pw}" height="${ph}" fill="${paper}" filter="url(#sh)" rx="3"/>
<rect width="${pw}" height="${ph}" fill="url(#pp)" rx="3"/>
${rules}${inner}
</g>
<rect width="${W}" height="${H}" fill="url(#lt)"/>
</svg>`;
}

function headerLine(title, name, { size = 34 } = {}) {
  return svgText(120, 110, title, { size, rot: -0.6 }) + svgText(520, 62, `Name: ${name}`, { size: 24, fill: '#33427a' });
}

const SAMPLE_BUILDERS = {
  fractions: (name) => photoSvg(
    headerLine('Fractions Review', name)
    + svgMathLine(['1)', [1, 2], '+', [1, 4], '=', [2, 4], '+', [1, 4], '=', [3, 4]], 120, 222)
    + svgMathLine(['2)', [2, 3], '−', [1, 6], '=', [4, 6], '−', [1, 6], '=', [3, 6], '=', [1, 2]], 120, 336)
    + `<path d="M520 318 l60 28" stroke="${INK}" stroke-width="2"/>`
    + svgMathLine(['3)', [3, 5], '×', [10, 9], '=', [30, 45], '=', [2, 3]], 120, 450)
    + svgMathLine(['4)', [7, 8], '÷', [7, 4], '=', [7, 8], '×', [4, 7], '=', [1, 2]], 120, 564)
    + svgMathLine(['5)', [3, 4], 'of 36 = 36 ÷ 4 × 3 = 27'], 120, 678)
    + svgMathLine(['6)', '1', [1, 3], '+ 2', [1, 2], '=', [4, 3], '+', [5, 2], '=', [23, 6], '= 3', [5, 6]], 120, 792)
    + `<ellipse cx="640" cy="800" rx="62" ry="44" stroke="${INK}" stroke-width="2" fill="none" transform="rotate(-6 640 800)"/>`
    + svgText(140, 930, 'Check: 23/6 ≈ 3.83 ✓', { size: 24, fill: '#33427a', rot: -1 }),
    { tilt: -1.8 },
  ),
  equations: (name) => photoSvg(
    headerLine('Linear Equations — Ex 6C', name)
    + [
      ['1)  3x + 5 = 20', 0], ['3x = 15', 1], ['x = 5', 1, true],
      ['2)  2(x − 4) = 10', 0], ['2x − 8 = 10', 1], ['2x = 18   →   x = 9', 1, true],
      ['3)  5x − 7 = 3x + 9', 0], ['2x − 7 = 9', 1], ['2x = 16   →   x = 8', 1, true],
      ['4)  x/4 + 3 = 7   →   x/4 = 4   →   x = 16', 0, true],
      ['5)  4 − 2x = 10', 0], ['−2x = 6   →   x = −3', 1, true],
    ].map(([s, ind, box], i) => {
      const y = 190 + i * 66;
      const x = 120 + ind * 60;
      const boxSvg = box ? `<rect x="${x + s.length * 15.2 - 118}" y="${y - 30}" width="${s.indexOf('→') > -1 ? 104 : 96}" height="42" rx="6" fill="none" stroke="${INK}" stroke-width="1.8" transform="rotate(-1 ${x} ${y})"/>` : '';
      return svgText(x, y, s, { size: 29, rot: (i % 3) * 0.3 - 0.3 }) + boxSvg;
    }).join('')
    + `<path d="M300 520 l120 -4" stroke="${INK}" stroke-width="2.4"/>`,
    { tilt: 1.3, desk: ['#9a8a78', '#544637'] },
  ),
  textbook: (name) => photoSvg(
    `<rect x="0" y="0" width="760" height="70" fill="#2C2A73" opacity=".92"/>`
    + svgText(40, 46, 'Unit 4 · Fractions, decimals and percentages', { font: SANSF, size: 22, fill: '#fff', weight: 600 })
    + svgText(40, 130, 'Exercise 4B', { font: SANSF, size: 34, fill: '#201F3C', weight: 700 })
    + svgText(560, 128, name, { size: 24, fill: PENCIL })
    + [
      ['1', 'Work out. Give each answer in its simplest form.', '', 190],
      ['', 'a   2/5 + 1/10 =', '1/2', 240],
      ['', 'b   5/6 − 1/4 =', '7/12', 290],
      ['2', 'Find 35% of 240.', '84', 360],
      ['3', 'Write 0.375 as a fraction.', '3/8', 430],
      ['4', 'A shirt costs 120 SAR. It is reduced by 15%.', '', 500],
      ['', 'Find the new price.', '102 SAR', 540],
      ['5', 'Shade 3/8 of the circle.', '', 610],
    ].map(([n, q, a, y]) => (n ? svgText(40, y, n, { font: SANSF, size: 24, fill: '#2C2A73', weight: 700 }) : '')
      + svgText(n ? 80 : 100, y, q, { font: SERIFF, size: 24, fill: '#222' })
      + (a ? svgText(530, y + 2, a, { size: 28, fill: PENCIL, rot: -2 }) : '')).join('')
    + (() => {
      const c = [380, 790]; const r = 140; let s = `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="#222" stroke-width="2"/>`;
      for (let i = 0; i < 8; i += 1) { const a = (i * Math.PI) / 4; s += `<line x1="${c[0]}" y1="${c[1]}" x2="${c[0] + r * Math.cos(a)}" y2="${c[1] + r * Math.sin(a)}" stroke="#222" stroke-width="1.6"/>`; }
      for (let i = 0; i < 3; i += 1) {
        const a1 = (i * Math.PI) / 4; const a2 = ((i + 1) * Math.PI) / 4;
        s += `<path d="M${c[0]} ${c[1]} L${c[0] + r * Math.cos(a1)} ${c[1] + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${c[0] + r * Math.cos(a2)} ${c[1] + r * Math.sin(a2)} Z" fill="${PENCIL}" fill-opacity=".38"/>`;
      }
      return s;
    })()
    + svgText(380, 1010, '47', { font: SANSF, size: 20, fill: '#555', anchor: 'middle' }),
    { tilt: 0.9, lined: false, margin: false, paper: '#fdfdfb', desk: ['#7d8590', '#3e444c'] },
  ),
  apples: (name) => photoSvg(
    svgText(380, 110, 'Count and colour', { font: SANSF, size: 44, fill: '#201F3C', weight: 700, anchor: 'middle' })
    + svgText(120, 170, `Name: ${name}`, { size: 28 })
    + (() => {
      let s = '';
      for (let i = 0; i < 10; i += 1) {
        const x = 130 + (i % 5) * 125; const y = 300 + Math.floor(i / 5) * 190;
        s += `<path d="M${x} ${y + 10} c -45 -40 -80 20 -50 70 c 20 35 40 40 50 30 c 10 10 30 5 50 -30 c 30 -50 -5 -110 -50 -70 z" fill="#d7263d" fill-opacity=".86" stroke="#222" stroke-width="2.4"/>`;
        s += `<path d="M${x - 25} ${y + 30} l 40 30 M${x - 30} ${y + 55} l 55 20" stroke="#a51627" stroke-width="5" stroke-opacity=".5"/>`;
        s += `<path d="M${x} ${y + 8} q 4 -24 14 -30" stroke="#5b3a1a" stroke-width="4" fill="none"/><path d="M${x + 8} ${y - 12} q 22 -14 34 2 q -18 10 -34 -2" fill="#3fa34d" stroke="#222" stroke-width="1.5"/>`;
      }
      return s;
    })()
    + svgText(380, 760, 'How many apples?', { font: SANSF, size: 32, fill: '#201F3C', anchor: 'middle' })
    + `<rect x="300" y="790" width="160" height="130" rx="14" fill="none" stroke="#222" stroke-width="3"/>`
    + svgText(380, 890, '10', { size: 92, anchor: 'middle', fill: '#1f3f94', rot: -4 }),
    { tilt: -1.2, lined: false, margin: false, paper: '#fffef8' },
  ),
  letters: (name) => photoSvg(
    svgText(380, 110, 'حروفي: ب ت ث', { font: SANSF, size: 48, fill: '#201F3C', weight: 700, anchor: 'middle' })
    + svgText(640, 175, name, { font: SANSF, size: 30, fill: INK, anchor: 'end' })
    + ['ب', 'ت', 'ث'].map((L, r) => {
      const y = 330 + r * 250; let s = svgText(680, y, L, { font: SANSF, size: 120, fill: '#201F3C', anchor: 'end', weight: 700 });
      for (let k = 0; k < 3; k += 1) s += svgText(500 - k * 150, y, L, { font: SANSF, size: 110, fill: 'none', anchor: 'end', extra: 'stroke="#9aa3b5" stroke-width="2" stroke-dasharray="6 6"' });
      for (let k = 0; k < 3; k += 1) s += svgText(500 - k * 150, y + 6, L, { font: SANSF, size: 104, fill: INK, anchor: 'end', rot: (k - 1) * 4 });
      return s;
    }).join(''),
    { tilt: 1.1, lined: false, margin: false, paper: '#fffef8' },
  ),
  calculus: (name) => photoSvg(
    headerLine('Differentiation — Ex 7B', name)
    + [
      '1)  y = 3x⁴ − 2x² + 7', '      dy/dx = 12x³ − 4x',
      '2)  f(x) = 5/x² = 5x⁻²', '      f′(x) = −10x⁻³ = −10/x³',
      '3)  y = (2x + 1)² = 4x² + 4x + 1', '      dy/dx = 8x + 4',
      '4)  y = x³ − 6x,  gradient at x = 2', '      dy/dx = 3x² − 6 = 3(4) − 6 = 6',
      '5)  f(x) = x²  (first principles)', '      f′(x) = lim h→0 [(x+h)² − x²] / h', '               = lim h→0 (2x + h) = 2x',
    ].map((s, i) => svgText(120, 196 + i * 66, s, { size: 27, rot: (i % 2) * -0.4 })).join(''),
    { tilt: -1.0 },
  ),
  pattern: (name) => photoSvg(
    svgText(90, 100, 'Geometric pattern — 8-point star', { size: 30, fill: PENCIL })
    + svgText(560, 160, name, { size: 26, fill: PENCIL })
    + (() => {
      const cxp = 380; const cyp = 560; let s = '';
      [250, 180, 110].forEach((r) => { s += `<circle cx="${cxp}" cy="${cyp}" r="${r}" fill="none" stroke="#9a98a6" stroke-width="1.2"/>`; });
      for (let i = 0; i < 8; i += 1) { const a = (i * Math.PI) / 8 * 2; s += `<line x1="${cxp}" y1="${cyp}" x2="${cxp + 250 * Math.cos(a)}" y2="${cyp + 250 * Math.sin(a)}" stroke="#b3b1bd" stroke-width="1"/>`; }
      const sq = (rot) => { const pts = []; for (let i = 0; i < 4; i += 1) { const a = rot + (i * Math.PI) / 2; pts.push(`${cxp + 230 * Math.cos(a)},${cyp + 230 * Math.sin(a)}`); } return pts.join(' '); };
      s += `<polygon points="${sq(Math.PI / 4)}" fill="#E8B923" fill-opacity=".35" stroke="${PENCIL}" stroke-width="2.6"/>`;
      s += `<polygon points="${sq(0)}" fill="#2C5AA0" fill-opacity=".28" stroke="${PENCIL}" stroke-width="2.6"/>`;
      const oct = []; for (let i = 0; i < 8; i += 1) { const a = (i * Math.PI) / 4 + Math.PI / 8; oct.push(`${cxp + 120 * Math.cos(a)},${cyp + 120 * Math.sin(a)}`); }
      s += `<polygon points="${oct.join(' ')}" fill="#fff" fill-opacity=".6" stroke="${PENCIL}" stroke-width="2.2"/>`;
      const st = []; for (let i = 0; i < 16; i += 1) { const r = i % 2 ? 50 : 100; const a = (i * Math.PI) / 8; st.push(`${cxp + r * Math.cos(a)},${cyp + r * Math.sin(a)}`); }
      s += `<polygon points="${st.join(' ')}" fill="#1E7F5C" fill-opacity=".35" stroke="${PENCIL}" stroke-width="2"/>`;
      return s;
    })(),
    { tilt: 0.8, lined: false, margin: false, paper: '#fffefa' },
  ),
};

const SAMPLE_LABEL = { fractions: 'sample.fractions', equations: 'sample.equations', textbook: 'sample.textbook', apples: 'sample.apples', letters: 'sample.letters', calculus: 'sample.calculus', pattern: 'sample.pattern' };
const SAMPLE_SETS = { early: ['apples', 'letters', 'fractions'], middle: ['fractions', 'equations', 'textbook'], senior: ['calculus', 'equations', 'textbook'] };
const _sampleCache = new Map();
function sampleUri(kind, name = '') {
  const k = `${kind}|${name}`;
  if (!_sampleCache.has(k)) _sampleCache.set(k, `data:image/svg+xml;charset=utf-8,${encodeURIComponent((SAMPLE_BUILDERS[kind] || SAMPLE_BUILDERS.equations)(name))}`);
  return _sampleCache.get(k);
}
const pageSrc = (p) => p.src || sampleUri(p.sample, p.name);

/* ============================================================================
 * 6. SEED DATA — deterministic, dates relative to "now"
 * ========================================================================== */

const AUTO_TYPES = ['mcq', 'checkbox', 'tf', 'match'];
const isAuto = (b) => AUTO_TYPES.includes(b.type);
const RUBRIC_PRESETS = ['method', 'accuracy', 'presentation', 'understanding', 'evidence', 'language', 'content', 'research', 'creativity'];

/** Split `total` points across criteria (e.g. 10 → 4 / 3 / 3). */
function distributeRubric(criteria, total) {
  const list = criteria.map((c) => (typeof c === 'string' ? { id: c, key: c } : { id: c.id || uid('rc'), ...c }));
  if (!list.length || total <= 0) return [];
  const base = Math.floor(total / list.length); let rem = total - base * list.length;
  return list.map((c) => { const extra = rem > 0 ? 1 : 0; rem -= extra; return { ...c, max: base + extra }; });
}

function finalizeAssignment(o) {
  const blocks = o.blocks.map((b, i) => ({ required: true, ...b, id: b.id || `${o.id}_b${i + 1}` }));
  const teacherPts = sum(blocks.filter((b) => !isAuto(b)).map((b) => b.points));
  return {
    status: 'published', lang: 'en', attachments: [], allowResubmit: false, instructions: '',
    latePolicy: { mode: 'accept', until: null, deduct: false, pct: 10 },
    publishAt: o.dueAt - 6 * DAY,
    ...o,
    blocks,
    points: sum(blocks.map((b) => b.points)),
    rubric: teacherPts > 0 ? distributeRubric(o.rubric || ['method', 'accuracy', 'presentation'], teacherPts) : [],
  };
}

const PAPER_BLOCK = (points = 10, prompt = 'Upload clear photos of every page of your completed work.') => ({ type: 'paper', prompt, points });

function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

const COMMENTS = {
  high: ['Excellent work — clear, accurate working throughout.', 'Very well set out. Great to see every step shown.', 'Accurate and neat. Keep it up.'],
  mid: ['Good effort. Check your signs carefully in the later questions.', 'Mostly correct — remember to simplify your final answers.', 'Good method. A couple of small slips with negative numbers.'],
  low: ['Let’s go over this together in class — focus on showing each step.', 'You have the right idea in places. Come to the help session on Tuesday.'],
};

function buildSeed(now = Date.now()) {
  const A = {}; const S = {};
  const add = (o) => { const a = finalizeAssignment(o); A[a.id] = a; return a; };

  /* --- Ms. Sarah's Mathematics (8A / 8B / 8C) --- */
  const ws = (name) => [{ id: uid('att'), kind: 'worksheet', name }];
  add({ id: 'm1', title: 'Number Sense Warm-up', subject: 'math', teacherId: 'sarah', classes: ['8A', '8B', '8C'], dueAt: atDay(-33, 19, 0, now), instructions: 'A quick check on rounding, powers and comparing numbers. Choose the best answer for each question.', blocks: [
    { type: 'mcq', prompt: 'Which number is irrational?', options: ['0.75', '√2', '3/8', '−4'], correct: 1, points: 2 },
    { type: 'mcq', prompt: 'Round 3.4762 to 2 decimal places.', options: ['3.47', '3.48', '3.5', '3.476'], correct: 1, points: 2 },
    { type: 'mcq', prompt: 'What is 2⁻³?', options: ['−8', '−6', '1/8', '1/6'], correct: 2, points: 2 },
    { type: 'mcq', prompt: 'Which is the largest?', options: ['0.6', '5/8', '62%', '0.059'], correct: 1, points: 2 },
    { type: 'tf', prompt: 'The square root of 81 is 9.', correct: true, points: 2 },
  ] });
  add({ id: 'm2', title: 'Algebraic Expressions Review', subject: 'math', teacherId: 'sarah', classes: ['8A', '8B', '8C'], dueAt: atDay(-26, 19, 0, now), sample: 'equations', instructions: 'Expand, factorise and simplify — Exercise 5A questions 1–15. Show every step.', attachments: ws('Exercise 5A — Expressions.pdf'), blocks: [PAPER_BLOCK(10)] });
  add({ id: 'm3', title: 'Ratio & Proportion Quiz', subject: 'math', teacherId: 'sarah', classes: ['8A', '8B', '8C'], dueAt: atDay(-19, 19, 0, now), instructions: 'Five questions on ratio and direct proportion. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'Simplify the ratio 18 : 24.', options: ['3 : 4', '2 : 3', '9 : 12', '6 : 8'], correct: 0, points: 2 },
    { type: 'mcq', prompt: 'Share 45 sweets in the ratio 2 : 3. How many are in the larger share?', options: ['18', '27', '30', '15'], correct: 1, points: 2 },
    { type: 'mcq', prompt: '5 pens cost 12 SAR. How much do 8 pens cost?', options: ['19.20 SAR', '18.00 SAR', '20.40 SAR', '16.80 SAR'], correct: 0, points: 2 },
    { type: 'tf', prompt: 'If y is directly proportional to x, doubling x doubles y.', correct: true, points: 2 },
    { type: 'mcq', prompt: 'A map has a scale of 1 : 50 000. What does 4 cm on the map represent?', options: ['2 km', '20 km', '200 m', '0.2 km'], correct: 0, points: 2 },
  ] });
  add({ id: 'm4', title: 'Percentages in Real Life', subject: 'math', teacherId: 'sarah', classes: ['8A', '8B', '8C'], dueAt: atDay(-12, 19, 0, now), sample: 'textbook', instructions: 'Complete Exercise 4B on percentage increase and decrease. Photograph your answers.', attachments: ws('Exercise 4B — Percentages.pdf'), blocks: [PAPER_BLOCK(10)] });
  add({ id: 'm5', title: 'Angles in Polygons', subject: 'math', teacherId: 'sarah', classes: ['8A', '8B', '8C'], dueAt: atDay(-5, 19, 0, now), sample: 'textbook', instructions: 'Find interior and exterior angles of regular polygons — Exercise 8A, questions 1–10.', attachments: ws('Exercise 8A — Polygons.pdf'), blocks: [PAPER_BLOCK(10)] });
  add({ id: 'm6', title: 'Linear Equations Practice', subject: 'math', teacherId: 'sarah', classes: ['8B'], dueAt: atDay(1, 19, 0, now), publishAt: atDay(-3, 7, 30, now), sample: 'equations', instructions: 'Complete Exercise 6C questions 1–12 in your exercise book. Show each step of your working, then check each answer by substituting it back into the equation.', attachments: ws('Exercise 6C — Linear Equations.pdf'), blocks: [PAPER_BLOCK(10, 'Take a clear photo of each page of your working (questions 1–12).')] });
  add({ id: 'm7', title: 'Linear Equations Practice', subject: 'math', teacherId: 'sarah', classes: ['8A'], dueAt: atDay(2, 19, 0, now), publishAt: atDay(-2, 7, 30, now), sample: 'equations', instructions: 'Complete Exercise 6C questions 1–12 in your exercise book. Show each step of your working, then check each answer by substituting it back into the equation.', attachments: ws('Exercise 6C — Linear Equations.pdf'), blocks: [PAPER_BLOCK(10, 'Take a clear photo of each page of your working (questions 1–12).')] });
  add({ id: 'm8', title: 'Angles & Parallel Lines Quiz', subject: 'math', teacherId: 'sarah', classes: ['8C'], dueAt: atDay(5, 19, 0, now), publishAt: atDay(1, 7, 0, now), status: 'scheduled', instructions: 'Corresponding, alternate and co-interior angles. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'Alternate angles are…', options: ['equal', 'supplementary', 'complementary', 'always 90°'], correct: 0, points: 2 },
    { type: 'tf', prompt: 'Co-interior angles add up to 180°.', correct: true, points: 2 },
    { type: 'mcq', prompt: 'Two parallel lines are cut by a transversal. One angle is 65°. Its corresponding angle is…', options: ['25°', '65°', '115°', '130°'], correct: 1, points: 2 },
  ] });

  /* --- Omar's other subjects (Grade 8B, other teachers) --- */
  add({ id: 'en1', title: 'Persuasive Paragraph: School Uniforms', subject: 'english', teacherId: 'emily', classes: ['8B'], dueAt: atDay(3, 19, 0, now), instructions: 'Write one persuasive paragraph (150–200 words) arguing for or against school uniforms. Use the PEEL structure: Point, Evidence, Explain, Link.', rubric: ['content', 'evidence', 'language'], blocks: [
    { type: 'short', prompt: 'Write your topic sentence (your main point).', points: 2 },
    { type: 'long', prompt: 'Write your full persuasive paragraph.', points: 8 },
  ] });
  add({ id: 'sc1', title: 'States of Matter Quiz', subject: 'science', teacherId: 'yusuf', classes: ['8B'], dueAt: atDay(-6, 19, 0, now), instructions: 'Six questions on particles and changes of state. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'In which state do particles vibrate in fixed positions?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correct: 0, points: 2 },
    { type: 'mcq', prompt: 'What is the change from gas to liquid called?', options: ['Evaporation', 'Condensation', 'Melting', 'Sublimation'], correct: 1, points: 2 },
    { type: 'mcq', prompt: 'Which has the weakest forces between its particles?', options: ['Ice', 'Water', 'Steam', 'Iron'], correct: 2, points: 2 },
    { type: 'mcq', prompt: 'Dry ice turning directly into a gas is called…', options: ['Melting', 'Freezing', 'Sublimation', 'Condensation'], correct: 2, points: 2 },
    { type: 'tf', prompt: 'Diffusion happens faster in gases than in liquids.', correct: true, points: 1 },
    { type: 'tf', prompt: 'Gases have a fixed volume.', correct: false, points: 1 },
  ] });
  add({ id: 'ar1', title: 'قراءة وفهم: نص عن الأمانة', subject: 'arabic', teacherId: 'mona', classes: ['8B'], lang: 'ar', dueAt: atDay(3, 19, 0, now), instructions: 'اقرأ النص المرفق «الأمانة خُلُق الكرام» قراءة متأنية، ثم أجب عن الأسئلة الآتية.', attachments: [{ id: 'att_ar1', kind: 'worksheet', name: 'نص: الأمانة خُلُق الكرام.pdf' }], rubric: ['understanding', 'language'], blocks: [
    { type: 'mcq', prompt: 'ما الفكرة الرئيسة في النص؟', options: ['فضل الأمانة وأثرها في المجتمع', 'أهمية الرياضة للجسم', 'وصف رحلة إلى الصحراء', 'قصة عن الصداقة'], correct: 0, points: 2 },
    { type: 'short', prompt: 'ما معنى كلمة «الوفاء» كما وردت في النص؟', points: 2 },
    { type: 'tf', prompt: 'يرى الكاتب أن الأمانة تقتصر على حفظ المال.', correct: false, points: 1 },
    { type: 'long', prompt: 'اكتب فقرة من خمسة أسطر تصف فيها موقفًا ظهرت فيه الأمانة.', points: 5 },
  ] });
  add({ id: 'is1', title: 'سورة الملك: الآيات ١–٥ — المعاني', subject: 'islamic', teacherId: 'abdullah', classes: ['8B'], lang: 'ar', dueAt: atDay(3, 19, 0, now), instructions: 'اقرأ الآيات من ١ إلى ٥ من سورة الملك مع التفسير الميسّر، ثم أجب باختصار.', rubric: ['understanding'], blocks: [
    { type: 'short', prompt: 'ما معنى «تبارك» في الآية الأولى؟', points: 2 },
    { type: 'short', prompt: 'ما الحكمة من خلق الموت والحياة كما ورد في الآية الثانية؟', points: 2 },
    { type: 'match', prompt: 'صِل كل كلمة بمعناها.', pairs: [{ left: 'تفاوت', right: 'اختلاف وعدم تناسب' }, { left: 'فطور', right: 'شقوق وصدوع' }, { left: 'خاسئًا', right: 'ذليلًا صاغرًا' }, { left: 'حسير', right: 'كليل منقطع' }], points: 4 },
  ] });
  add({ id: 'ss1', title: 'Map of Saudi Regions', subject: 'social', teacherId: 'hassan', classes: ['8B'], dueAt: atDay(-1, 19, 0, now), latePolicy: { mode: 'until', until: atDay(2, 19, 0, now), deduct: false, pct: 10 }, instructions: 'Label all 13 administrative regions of Saudi Arabia on the blank map and colour-code them. Include a key and a compass rose.', attachments: [{ id: 'att_ss1', kind: 'worksheet', name: 'Blank map — Saudi regions.pdf' }], rubric: ['accuracy', 'presentation'], blocks: [
    { type: 'file', prompt: 'Upload your labelled map (photo, scan or PDF).', points: 8 },
    { type: 'short', prompt: 'Which region is Jeddah in, and what is that region’s capital city?', points: 2 },
  ] });
  add({ id: 'ict1', title: 'Spreadsheet Basics', subject: 'ict', teacherId: 'adel', classes: ['8B'], dueAt: atDay(-9, 19, 0, now), allowResubmit: true, instructions: 'Build a weekly budget in a spreadsheet. Use SUM for the total and AVERAGE for the daily average. Format money cells as currency.', rubric: ['accuracy', 'presentation'], blocks: [
    { type: 'file', prompt: 'Upload your spreadsheet file.', points: 8 },
    { type: 'short', prompt: 'Which formula did you use to find the weekly total?', points: 2 },
  ] });
  add({ id: 'art1', title: 'Islamic Geometric Pattern Sketch', subject: 'art', teacherId: 'lina', classes: ['8B'], dueAt: atDay(-16, 19, 0, now), sample: 'pattern', instructions: 'Using a compass and ruler, construct an eight-point star pattern. Shade it using two colours.', rubric: ['method', 'creativity', 'presentation'], blocks: [PAPER_BLOCK(10, 'Photograph your finished sketch.')] });

  /* --- Layan (Grade 1A) --- */
  add({ id: 'e1', title: 'Count and colour 10 apples', subject: 'math', teacherId: 'noura', classes: ['1A'], dueAt: atDay(1, 18, 0, now), instructions: 'Count 10 apples and colour them red. Then write the number 10 in the box.', attachments: [{ id: 'att_e1', kind: 'worksheet', name: 'Apples worksheet.pdf' }], rubric: ['understanding', 'presentation'], blocks: [PAPER_BLOCK(4, 'Take a photo of your coloured worksheet.')] });
  add({ id: 'e2', title: 'حروفي: ب ت ث', subject: 'arabic', teacherId: 'hind', classes: ['1A'], lang: 'ar', dueAt: atDay(2, 18, 0, now), instructions: 'تتبّع الحروف ب ت ث، ثم اكتب كل حرف ثلاث مرات.', rubric: ['presentation'], blocks: [PAPER_BLOCK(3, 'صوّر ورقة الحروف بعد إكمالها.')] });
  add({ id: 'e3', title: 'Living or not living?', subject: 'science', teacherId: 'noura', classes: ['1A'], dueAt: atDay(-4, 18, 0, now), instructions: 'Choose the right answer.', blocks: [
    { type: 'mcq', prompt: 'Which one is living?', options: ['A cat', 'A rock', 'A chair'], correct: 0, points: 1 },
    { type: 'tf', prompt: 'A tree is living.', correct: true, points: 1 },
    { type: 'mcq', prompt: 'What do plants need to grow?', options: ['Water and sunlight', 'Toys', 'Only sand'], correct: 0, points: 1 },
    { type: 'tf', prompt: 'A car is living.', correct: false, points: 1 },
  ] });
  add({ id: 'e4', title: 'My family: draw and label', subject: 'english', teacherId: 'noura', classes: ['1A'], dueAt: atDay(3, 18, 0, now), instructions: 'Draw your family. Write a name under each person.', rubric: ['presentation'], blocks: [PAPER_BLOCK(3, 'Take a photo of your drawing.')] });
  add({ id: 'e5', title: 'Shapes around me', subject: 'math', teacherId: 'noura', classes: ['1A'], dueAt: atDay(-11, 18, 0, now), instructions: 'Which shape is it?', blocks: [
    { type: 'mcq', prompt: 'A clock face is a…', options: ['Circle', 'Square', 'Triangle'], correct: 0, points: 1 },
    { type: 'mcq', prompt: 'A door is a…', options: ['Circle', 'Rectangle', 'Triangle'], correct: 1, points: 1 },
  ] });

  /* --- Faisal (Grade 11A) --- */
  add({ id: 'f1', title: 'Biology — Enzyme Practical Report', subject: 'biology', teacherId: 'khalid', classes: ['11A'], dueAt: atDay(1, 23, 59, now), instructions: 'Write up the catalase practical: aim, method, results table, a graph of rate against temperature, and an evaluation. Upload your report as PDF or DOCX.', rubric: ['method', 'evidence', 'presentation'], blocks: [
    { type: 'file', prompt: 'Upload your full practical report.', points: 14 },
    { type: 'short', prompt: 'State the optimum temperature you found, with units.', points: 2 },
    { type: 'long', prompt: 'Evaluate one significant source of error and suggest an improvement.', points: 4 },
  ] });
  add({ id: 'f2', title: 'A-Level Maths: Differentiation', subject: 'math', teacherId: 'ahmed', classes: ['11A'], dueAt: atDay(2, 23, 59, now), instructions: 'Exercise 7B: differentiate from first principles and using the power rule. Questions 1–15. Show full working.', attachments: [{ id: 'att_f2', kind: 'worksheet', name: 'Exercise 7B — Differentiation.pdf' }], blocks: [PAPER_BLOCK(15)] });
  add({ id: 'f3', title: 'Macbeth Act 1: Ambition', subject: 'englit', teacherId: 'rania', classes: ['11A'], dueAt: atDay(5, 23, 59, now), instructions: 'How does Shakespeare present ambition in Act 1? Refer closely to language and structure. 600–800 words.', rubric: ['understanding', 'evidence', 'language'], blocks: [{ type: 'long', prompt: 'Your essay', points: 20 }] });
  add({ id: 'f4', title: 'Moles & Stoichiometry Quiz', subject: 'chemistry', teacherId: 'tariq', classes: ['11A'], dueAt: atDay(-5, 23, 59, now), instructions: 'Five questions. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'How many moles are in 36 g of water (Mr = 18)?', options: ['2 mol', '0.5 mol', '18 mol', '36 mol'], correct: 0, points: 4 },
    { type: 'mcq', prompt: 'Avogadro’s constant is approximately…', options: ['6.02 × 10²³ mol⁻¹', '3.00 × 10⁸ mol⁻¹', '1.60 × 10⁻¹⁹ mol⁻¹', '9.81 mol⁻¹'], correct: 0, points: 4 },
    { type: 'mcq', prompt: 'What is the Mr of CO₂ (C = 12, O = 16)?', options: ['28', '44', '32', '40'], correct: 1, points: 4 },
    { type: 'mcq', prompt: '2H₂ + O₂ → 2H₂O. How many moles of water form from 3 mol of H₂?', options: ['1.5', '3', '6', '2'], correct: 1, points: 4 },
    { type: 'tf', prompt: 'One mole of any gas occupies about 24 dm³ at room temperature and pressure.', correct: true, points: 4 },
  ] });
  add({ id: 'f5', title: 'Kinematics Problem Set', subject: 'physics', teacherId: 'huda', classes: ['11A'], dueAt: atDay(-1, 23, 59, now), latePolicy: { mode: 'accept', until: null, deduct: true, pct: 10 }, instructions: 'SUVAT problems 1–8. Show the equation you choose and your substitution.', blocks: [PAPER_BLOCK(16)] });
  add({ id: 'f6', title: 'مقال: أثر التقنية في حياتنا', subject: 'arabic', teacherId: 'mona', classes: ['11A'], lang: 'ar', dueAt: atDay(-14, 23, 59, now), instructions: 'اكتب مقالًا من ثلاث فقرات عن أثر التقنية في حياة الشباب، مع مقدمة وخاتمة.', rubric: ['content', 'language'], blocks: [{ type: 'long', prompt: 'المقال', points: 15 }] });

  /* --- submissions --- */
  const put = (aid, sid, o) => { S[subKey(aid, sid)] = { id: uid('sub'), assignmentId: aid, studentId: sid, answers: {}, annotations: {}, rubricScores: {}, comment: '', note: '', history: [], ...o }; };

  // Sarah's classes — generated.
  const sarahIds = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
  sarahIds.forEach((aid) => {
    const a = A[aid];
    a.classes.forEach((cls) => {
      const roster = ROSTERS[cls];
      const order = [...roster].sort((x, y) => hashStr(aid + x.id) - hashStr(aid + y.id));
      roster.forEach((stu) => {
        const r = mulberry32(hashStr(`${aid}|${stu.id}`));
        const pattern = SUPPORT_PATTERNS[stu.id];
        const isOmar = stu.id === 's_omar';
        const ability = pattern ? pattern.ability : isOmar ? 0.9 : 0.55 + (hashStr(stu.id) % 40) / 100;
        const rank = order.indexOf(stu);
        const open = a.dueAt > now;
        let outcome;
        if (open) {
          if (isOmar) return; // Omar hasn't done it yet — it's on his "Due soon" list.
          const quota = aid === 'm6' ? 12 : 8;
          const eligible = order.filter((s) => s.id !== 's_omar' && !SUPPORT_PATTERNS[s.id]);
          if (eligible.indexOf(stu) < 0 || eligible.indexOf(stu) >= quota) return;
          outcome = 'ontime';
        } else if (pattern && pattern.missing.includes(aid)) outcome = 'missing';
        else if (isOmar) outcome = 'ontime';
        else { const x = r(); outcome = x < 0.04 ? 'missing' : x < 0.13 ? 'late' : 'ontime'; }
        if (pattern && !pattern.missing.includes(aid) && r() < 0.35) outcome = 'late';
        if (outcome === 'missing') return;

        const submittedAt = outcome === 'late'
          ? Math.min(a.dueAt + (3 + r() * 30) * HOUR, now - 2 * HOUR)
          : open ? Math.max(a.publishAt + 2 * HOUR, now - (2 + r() * 40) * HOUR) : a.dueAt - (2 + r() * 40) * HOUR;
        const sub = { status: 'submitted', submittedAt, late: submittedAt > a.dueAt, draftSavedAt: submittedAt };
        // answers
        a.blocks.forEach((b) => {
          if (b.type === 'paper') {
            const pages = [{ id: `pg_${aid}_${stu.id}_1`, sample: a.sample || 'equations', name: stu.firstEn }];
            if (r() < 0.3) pages.push({ id: `pg_${aid}_${stu.id}_2`, sample: 'textbook', name: stu.firstEn });
            sub.answers[b.id] = pages;
          } else if (b.type === 'mcq') {
            const ok = r() < ability + 0.08;
            sub.answers[b.id] = ok ? b.correct : (b.correct + 1 + Math.floor(r() * (b.options.length - 1))) % b.options.length;
          } else if (b.type === 'tf') sub.answers[b.id] = r() < ability + 0.1 ? b.correct : !b.correct;
        });
        if (open) { put(aid, stu.id, sub); return; }
        // grading state
        let status = 'returned';
        if (aid === 'm5') {
          if (cls === '8B' && (isOmar || (rank >= 0 && rank < 5))) status = 'graded';
          if (cls === '8A' && rank < 7) status = 'submitted';
        }
        if (status !== 'submitted') {
          const auto = autoScore(a, sub.answers);
          const rub = {};
          a.rubric.forEach((c) => { rub[c.id] = clamp(Math.round(c.max * clamp(ability + (r() - 0.5) * 0.3, 0.15, 1)), 0, c.max); });
          if (isOmar) a.rubric.forEach((c, i) => { rub[c.id] = i === 1 ? Math.max(0, c.max - 1) : c.max; });
          const mark = auto.score + sum(Object.values(rub));
          const pct = mark / a.points;
          const pool = pct >= 0.8 ? COMMENTS.high : pct >= 0.55 ? COMMENTS.mid : COMMENTS.low;
          Object.assign(sub, {
            status, autoScore: auto.score, rubricScores: rub, mark, comment: pool[Math.floor(r() * pool.length)],
            gradedAt: Math.min(submittedAt + (0.6 + r() * 2.6) * DAY, now - HOUR),
          });
          if (status === 'returned') sub.returnedAt = sub.gradedAt;
        }
        put(aid, stu.id, sub);
      });
    });
  });
  // Omar's annotated Algebra page (shows annotations in "Completed").
  const om2 = S[subKey('m2', 's_omar')];
  if (om2) {
    const pid = om2.answers.m2_b1[0].id;
    om2.annotations = { [pid]: [{ type: 'tick', x: 0.62, y: 0.25 }, { type: 'tick', x: 0.62, y: 0.47 }, { type: 'cross', x: 0.55, y: 0.69 }, { type: 'text', x: 0.6, y: 0.74, text: 'Check the sign here' }] };
    om2.comment = 'Very well set out, Omar. One sign slip in question 4 — otherwise excellent.';
  }

  // Omar — other subjects.
  put('en1', 's_omar', { status: 'draft', draftSavedAt: now - 26 * HOUR, answers: { en1_b1: 'School uniforms should stay, because they help every student focus on learning rather than on clothes.', en1_b2: 'School uniforms should stay, because they help every student focus on learning rather than on clothes. For example, ' } });
  put('sc1', 's_omar', { status: 'returned', submittedAt: atDay(-7, 18, 12, now), late: false, answers: { sc1_b1: 0, sc1_b2: 1, sc1_b3: 2, sc1_b4: 2, sc1_b5: true, sc1_b6: true }, autoScore: 9, mark: 9, gradedAt: atDay(-6, 20, 0, now), returnedAt: now - 2 * DAY - 3 * HOUR, comment: 'Excellent understanding of particle behaviour, Omar. Remember: a gas spreads out to fill its container, so its volume is not fixed.' });
  put('ict1', 's_omar', { status: 'revision', submittedAt: atDay(-10, 17, 40, now), late: false, answers: { ict1_b1: [{ id: 'f_ict', name: 'weekly-budget.xlsx', size: 18432, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }], ict1_b2: '=SUM(B2:B8)' }, rubricScores: {}, mark: 6, gradedAt: now - 3 * DAY, returnedAt: now - 3 * DAY, comment: 'Good start, Omar. Your SUM formula is correct, but the AVERAGE cell includes the total row, so the average is too high. Please fix the AVERAGE range and resubmit.' });
  const ictA = A.ict1; S[subKey('ict1', 's_omar')].rubricScores = { [ictA.rubric[0].id]: 3, [ictA.rubric[1].id]: 3 };
  S[subKey('ict1', 's_omar')].mark = 3 + 3 + 0; // short answer marked within rubric
  put('art1', 's_omar', { status: 'returned', submittedAt: atDay(-17, 16, 5, now), late: false, answers: { art1_b1: [{ id: 'pg_art_omar', sample: 'pattern', name: 'Omar' }] }, rubricScores: Object.fromEntries(A.art1.rubric.map((c, i) => [c.id, i === 0 ? c.max : c.max - (i === 2 ? 1 : 0)])), gradedAt: atDay(-12, 15, 0, now), returnedAt: atDay(-12, 15, 0, now), comment: 'Beautiful, precise construction of the eight-point star. Next time, try extending the pattern to the edges of the page.', annotations: { pg_art_omar: [{ type: 'tick', x: 0.7, y: 0.32 }, { type: 'text', x: 0.6, y: 0.86, text: 'Lovely symmetry' }] } });
  S[subKey('art1', 's_omar')].mark = sum(Object.values(S[subKey('art1', 's_omar')].rubricScores));

  // Layan.
  put('e3', 's_layan', { status: 'returned', submittedAt: atDay(-5, 17, 0, now), late: false, answers: { e3_b1: 0, e3_b2: true, e3_b3: 0, e3_b4: false }, autoScore: 4, mark: 4, gradedAt: now - 2 * DAY, returnedAt: now - 2 * DAY, comment: 'Well done, Layan! You know what living things need.' });
  put('e5', 's_layan', { status: 'returned', submittedAt: atDay(-12, 17, 0, now), late: false, answers: { e5_b1: 0, e5_b2: 1 }, autoScore: 2, mark: 2, gradedAt: atDay(-10, 9, 0, now), returnedAt: atDay(-10, 9, 0, now), comment: 'Great shape spotting!' });

  // Faisal.
  put('f3', 's_faisal', { status: 'draft', draftSavedAt: now - 5 * HOUR, answers: { f3_b1: 'In Act 1, Shakespeare presents ambition as a force that is both seductive and corrupting. Macbeth’s aside, “Stars, hide your fires; / Let not light see my black and deep desires”, reveals…' } });
  put('f4', 's_faisal', { status: 'returned', submittedAt: atDay(-6, 21, 30, now), late: false, answers: { f4_b1: 0, f4_b2: 0, f4_b3: 1, f4_b4: 1, f4_b5: false }, autoScore: 16, mark: 16, gradedAt: now - 3 * DAY, returnedAt: now - 3 * DAY, comment: 'Strong calculations. Review molar gas volume (24 dm³ at RTP).' });
  put('f6', 's_faisal', { status: 'returned', submittedAt: atDay(-15, 22, 0, now), late: false, answers: { f6_b1: 'لا يخفى على أحد أن التقنية أصبحت جزءًا لا يتجزأ من حياة الشباب…' }, rubricScores: Object.fromEntries(A.f6.rubric.map((c) => [c.id, c.max - 1])), gradedAt: atDay(-11, 10, 0, now), returnedAt: atDay(-11, 10, 0, now), comment: 'مقال متماسك وأفكار واضحة، أحسنت. انتبه إلى علامات الترقيم في الفقرة الثانية.' });
  S[subKey('f6', 's_faisal')].mark = sum(Object.values(S[subKey('f6', 's_faisal')].rubricScores));

  return { assignments: A, submissions: S, reminders: [], notified: {} };
}

/* ============================================================================
 * 7. DOMAIN LOGIC
 * ========================================================================== */

function scoreBlock(b, ans) {
  if (!isAuto(b) || ans == null) return 0;
  if (b.type === 'mcq') return ans === b.correct ? b.points : 0;
  if (b.type === 'tf') return ans === b.correct ? b.points : 0;
  if (b.type === 'checkbox') {
    const want = [...(b.correct || [])].sort().join(','); const got = [...(ans || [])].sort().join(',');
    return want === got ? b.points : 0;
  }
  if (b.type === 'match') {
    const n = b.pairs.length; if (!n) return 0;
    const ok = b.pairs.filter((_, i) => ans[i] === i).length;
    return round1((ok / n) * b.points);
  }
  return 0;
}
function autoScore(a, answers = {}) {
  const auto = a.blocks.filter(isAuto);
  return { score: round1(sum(auto.map((b) => scoreBlock(b, answers[b.id])))), max: sum(auto.map((b) => b.points)), count: auto.length };
}
const teacherPoints = (a) => sum(a.blocks.filter((b) => !isAuto(b)).map((b) => b.points));

function isAnswered(b, v) {
  if (v == null) return false;
  if (b.type === 'short' || b.type === 'long') return String(v).trim().length > 0;
  if (b.type === 'checkbox' || b.type === 'file' || b.type === 'paper') return Array.isArray(v) && v.length > 0;
  if (b.type === 'match') return b.pairs.every((_, i) => v[i] != null && v[i] !== '');
  return true;
}

function submissionType(a) {
  const types = new Set(a.blocks.map((b) => b.type));
  if (types.size === 1 && types.has('paper')) return 'paper';
  if ([...types].every((x) => AUTO_TYPES.includes(x))) return 'quiz';
  if (types.has('paper')) return 'paper';
  if (types.has('file')) return 'file';
  return 'online';
}
const TYPE_ICON = { paper: Camera, quiz: ListChecks, file: Paperclip, online: AlignLeft };

function canSubmit(a, now, sub) {
  if (sub && sub.resubmitting) return true;
  if (now <= a.dueAt) return true;
  const p = a.latePolicy || {};
  if (p.mode === 'accept') return true;
  if (p.mode === 'until') return p.until ? now <= p.until : true;
  return false;
}

/** Status from the student's point of view. */
function studentState(a, sub, now) {
  const s = sub && sub.status;
  if (s === 'returned') return 'returned';
  if (s === 'revision') return 'revision';
  if (s === 'submitted' || s === 'graded') return sub.late ? 'submittedLate' : 'submitted';
  if (s === 'draft' && sub.resubmitting) return 'draft';
  if (now > a.dueAt) return canSubmit(a, now, sub) ? 'overdue' : 'closed';
  return s === 'draft' ? 'draft' : 'notStarted';
}

/** Status from the teacher's point of view. */
function teacherStatus(a, sub, now) {
  const s = sub && sub.status;
  if (s === 'returned') return 'returned';
  if (s === 'revision') return 'revision';
  if (s === 'graded') return 'graded';
  if (s === 'submitted') return sub.late ? 'late' : 'submitted';
  return now > a.dueAt ? 'missing' : 'notYet';
}
const HANDED_IN = ['submitted', 'late', 'graded', 'returned', 'revision'];

function isVisibleToStudent(a, student, now) {
  return a.classes.includes(student.cls) && a.status !== 'draft' && a.publishAt <= now;
}

function classStats(db, a, cls, now) {
  const roster = ROSTERS[cls] || [];
  const c = { total: roster.length, submitted: 0, late: 0, graded: 0, returned: 0, revision: 0, missing: 0, notYet: 0, lateHanded: 0, marks: [] };
  roster.forEach((stu) => {
    const sub = db.submissions[subKey(a.id, stu.id)];
    const st = teacherStatus(a, sub, now);
    c[st] += 1;
    if (sub && HANDED_IN.includes(st) && sub.late) c.lateHanded += 1;
    if (sub && ['graded', 'returned', 'revision'].includes(st) && typeof sub.mark === 'number') c.marks.push(sub.mark / a.points);
  });
  c.handedIn = c.submitted + c.late + c.graded + c.returned + c.revision;
  c.onTime = c.handedIn - c.lateHanded;
  c.toGrade = c.submitted + c.late;
  c.rate = c.total ? c.handedIn / c.total : 0;
  c.avg = c.marks.length ? sum(c.marks) / c.marks.length : null;
  return c;
}

const teacherAssignments = (db, teacherId = DEMO_TEACHER) => Object.values(db.assignments).filter((a) => a.teacherId === teacherId).sort((x, y) => y.dueAt - x.dueAt);
const isPublished = (a, now) => a.status !== 'draft' && a.publishAt <= now;

/* ============================================================================
 * 8. APP CONTEXT & UI PRIMITIVES
 * ========================================================================== */

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

const subjName = (code, lang) => (SUBJECTS[code] ? SUBJECTS[code][lang === 'ar' ? 'ar' : 'en'] : code);
const teacherName = (id, lang) => (TEACHERS[id] ? TEACHERS[id][lang === 'ar' ? 'ar' : 'en'] : id);
const teacherShort = (id, lang) => { const x = TEACHERS[id]; if (!x) return id; return lang === 'ar' ? (x.shortAr || x.ar) : (x.shortEn || x.en); };
const studentName = (s, lang) => (s ? (lang === 'ar' ? s.ar : s.en) : '');
const studentFirst = (s, lang) => (s ? (lang === 'ar' ? s.firstAr : s.firstEn) : '');
function clsLabel(code, lang, long = false) {
  const { g, s } = parseCls(code);
  if (lang === 'ar') return long ? `الصف ${GRADE_AR[g] || g} – الشعبة ${SEC_AR[s] || s}` : `${GRADE_AR[g] || g} ${SEC_AR[s] || s}`;
  return long ? `Grade ${code}` : code;
}
const clsList = (codes, lang) => codes.map((c) => clsLabel(c, lang)).join(lang === 'ar' ? '، ' : ', ');
const tint = (hex, a = '1A') => `${hex}${a}`;

const STATUS = {
  notStarted: { tone: 'grey', icon: Circle },
  notYet: { tone: 'grey', icon: Circle },
  draft: { tone: 'blue', icon: PencilLine },
  submitted: { tone: 'indigo', icon: Send },
  submittedLate: { tone: 'amber', icon: Clock },
  late: { tone: 'amber', icon: Clock },
  overdue: { tone: 'amber', icon: AlarmClock },
  closed: { tone: 'red', icon: AlertCircle },
  missing: { tone: 'red', icon: AlertCircle },
  graded: { tone: 'green', icon: BadgeCheck },
  returned: { tone: 'green', icon: CheckCircle2 },
  revision: { tone: 'green', icon: RotateCcw },
  completed: { tone: 'green', icon: CheckCheck },
  scheduled: { tone: 'blue', icon: CalendarClock },
  open: { tone: 'indigo', icon: CircleDot },
  past: { tone: 'grey', icon: Lock },
};
const TONE = {
  grey: 'bg-slate-100 text-slate-700 ring-slate-300',
  blue: 'bg-sky-50 text-sky-800 ring-sky-200',
  indigo: 'bg-ags-indigo-50 text-ags-indigo ring-indigo-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-800 ring-rose-200',
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
};

function StatusChip({ status, label, size = 'md', className }) {
  const { t } = useApp();
  const s = STATUS[status] || STATUS.notStarted;
  const I = s.icon;
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset font-medium whitespace-nowrap', TONE[s.tone], size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1', className)}>
      <I aria-hidden="true" className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {label || t(`st.${status}`)}
    </span>
  );
}

function SubjectTag({ code, className }) {
  const { lang } = useApp();
  const s = SUBJECTS[code];
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-xs font-medium text-ags-slate', className)}>
      <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ background: s?.color }} />
      {subjName(code, lang)}
    </span>
  );
}

function SubjectBadge({ code, size = 'md' }) {
  const s = SUBJECTS[code] || SUBJECTS.math; const I = s.icon;
  const dims = size === 'xl' ? 'w-20 h-20 rounded-3xl' : size === 'lg' ? 'w-14 h-14 rounded-2xl' : size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-11 h-11 rounded-xl';
  const ic = size === 'xl' ? 'w-10 h-10' : size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <span aria-hidden="true" className={cx('inline-flex items-center justify-center shrink-0', dims)} style={{ background: tint(s.color, '16'), color: s.color }}>
      <I className={ic} />
    </span>
  );
}

/** Friendly illustration for the early-years cards (simple shapes only). */
function SubjectArt({ code }) {
  const s = SUBJECTS[code] || SUBJECTS.math; const c = s.color;
  const shapes = {
    math: <><circle cx="30" cy="40" r="14" fill="#D7263D" /><circle cx="62" cy="40" r="14" fill="#D7263D" /><circle cx="46" cy="66" r="14" fill="#D7263D" /><rect x="44" y="18" width="4" height="10" rx="2" fill="#5B3A1A" /></>,
    arabic: <><rect x="16" y="20" width="64" height="56" rx="10" fill="#fff" stroke={c} strokeWidth="3" /><text x="48" y="60" textAnchor="middle" fontSize="30" fill={c} fontWeight="700">ب</text></>,
    science: <><circle cx="48" cy="40" r="20" fill="#F3C52D" /><path d="M20 80 Q48 50 76 80" fill="#3FA34D" /></>,
    english: <><rect x="18" y="22" width="28" height="52" rx="4" fill={c} /><rect x="50" y="22" width="28" height="52" rx="4" fill="#F3C52D" /></>,
    islamic: <><polygon points="48,14 56,38 82,38 61,53 69,78 48,63 27,78 35,53 14,38 40,38" fill="#15803D" opacity=".85" /></>,
  };
  return (
    <svg viewBox="0 0 96 96" className="w-20 h-20" aria-hidden="true">
      <rect width="96" height="96" rx="24" fill={tint(c, '18')} />
      {shapes[code] || <circle cx="48" cy="48" r="22" fill={c} opacity=".8" />}
    </svg>
  );
}

function Avatar({ name, size = 'md', tone = 'indigo' }) {
  const initials = (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.replace(/^(Al-|ال)/, '')[0]).join('');
  const dims = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  const tones = { indigo: 'bg-ags-indigo-100 text-ags-indigo', gold: 'bg-ags-gold text-ags-navy', navy: 'bg-ags-navy text-ags-gold' };
  return <span aria-hidden="true" className={cx('inline-flex items-center justify-center rounded-full font-bold shrink-0', dims, tones[tone])}>{initials}</span>;
}

function ProgressBar({ value, max = 1, tone = 'indigo', label, className, height = 'h-2' }) {
  const pct = max ? clamp(value / max, 0, 1) : 0;
  const fills = { indigo: 'bg-ags-indigo', gold: 'bg-ags-gold', green: 'bg-emerald-600', amber: 'bg-amber-500' };
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label} className={cx('w-full rounded-full bg-slate-200/80 overflow-hidden', height, className)}>
      <div className={cx('h-full rounded-full transition-all duration-500', fills[tone])} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}

function Segmented({ options, value, onChange, ariaLabel, dark = false, size = 'md', full = false, className }) {
  const { dir } = useApp();
  const refs = useRef([]);
  const onKey = (e) => {
    const i = options.findIndex((o) => o.value === value);
    let d = 0;
    if (e.key === 'ArrowRight') d = dir === 'rtl' ? -1 : 1;
    if (e.key === 'ArrowLeft') d = dir === 'rtl' ? 1 : -1;
    if (e.key === 'ArrowDown') d = 1;
    if (e.key === 'ArrowUp') d = -1;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + options.length) % options.length;
    onChange(options[n].value); refs.current[n]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={ariaLabel} onKeyDown={onKey}
      className={cx('inline-flex items-stretch rounded-xl p-1 gap-1', dark ? 'bg-ags-navy/70 ring-1 ring-white/10' : 'bg-white ring-1 ring-slate-200', full && 'w-full', className)}>
      {options.map((o, i) => {
        const active = o.value === value; const I = o.icon;
        return (
          <button key={o.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={active} tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cx('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors whitespace-nowrap', full && 'flex-1',
              size === 'lg' ? 'px-4 py-2 text-[0.95rem] min-h-[2.6rem]' : size === 'sm' ? 'px-2.5 py-1 text-sm min-h-[2.1rem]' : 'px-3 py-1.5 text-sm min-h-[2.4rem]',
              dark ? (active ? 'bg-ags-gold text-ags-navy shadow' : 'text-white/85 hover:bg-white/10 hover:text-white')
                : (active ? 'bg-ags-indigo text-white shadow-sm' : 'text-ags-slate hover:bg-ags-indigo-50 hover:text-ags-indigo'))}>
            {I && <I aria-hidden="true" className="w-4 h-4 shrink-0" />}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Switch({ checked, onChange, label, hint, id }) {
  const sid = useMemo(() => id || uid('sw'), [id]);
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={sid} className="font-medium text-ags-navy text-sm cursor-pointer">{label}</label>
        {hint && <p className="hint mt-0.5">{hint}</p>}
      </div>
      <button id={sid} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cx('relative shrink-0 w-12 h-7 rounded-full transition-colors', checked ? 'bg-ags-indigo' : 'bg-slate-300')}>
        <span className={cx('absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all', checked ? 'start-6' : 'start-1')} />
      </button>
    </div>
  );
}

function Modal({ open, onClose, title, children, footer, size = 'md', icon: I }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  const titleId = useMemo(() => uid('mt'), []);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const el = ref.current;
    const list = () => [...el.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled);
    el.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); }
      if (e.key === 'Tab') {
        const f = list(); if (!f.length) return;
        if (e.shiftKey && (document.activeElement === f[0] || document.activeElement === el)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    const ov = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ov; if (prev && prev.focus) prev.focus(); };
  }, [open]);
  const { t } = useApp();
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-ags-navy/50 backdrop-blur-[2px]" onClick={() => closeRef.current()} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        className={cx('relative w-full bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl ags-fade-up flex flex-col max-h-[92vh]', widths[size])}>
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
          {I && <span className="w-9 h-9 rounded-xl bg-ags-indigo-50 text-ags-indigo inline-flex items-center justify-center"><I className="w-5 h-5" aria-hidden="true" /></span>}
          <h2 id={titleId} className="text-lg font-bold text-ags-navy flex-1">{title}</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => closeRef.current()} aria-label={t('close')}><X className="w-5 h-5" aria-hidden="true" /></button>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, actions, onBack, backLabel, eyebrow }) {
  const { t } = useApp();
  return (
    <div className="mb-6">
      {onBack && (
        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm -ms-2 mb-2">
          <ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{backLabel || t('back')}
        </button>
      )}
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div className="min-w-0">
          {eyebrow && <div className="mb-1">{eyebrow}</div>}
          <h1 className="text-2xl sm:text-[1.7rem] font-bold text-ags-navy leading-tight" dir="auto">{title}</h1>
          {subtitle && <p className="text-ags-slate mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

function StatCard({ icon: I, label, value, tone = 'indigo', hint, onClick, size = 'md' }) {
  const tones = { indigo: 'bg-ags-indigo-50 text-ags-indigo', gold: 'bg-ags-gold-100 text-ags-navy', amber: 'bg-amber-50 text-amber-700', green: 'bg-emerald-50 text-emerald-700', red: 'bg-rose-50 text-rose-700', grey: 'bg-slate-100 text-slate-600' };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={cx('card text-start w-full flex items-center gap-4 transition-shadow', size === 'lg' ? 'p-5 sm:p-6' : size === 'sm' ? 'p-3' : 'p-4', onClick && 'hover:shadow-md')}>
      <span aria-hidden="true" className={cx('inline-flex items-center justify-center shrink-0', tones[tone], size === 'lg' ? 'w-14 h-14 rounded-2xl' : size === 'sm' ? 'w-9 h-9 rounded-lg' : 'w-11 h-11 rounded-xl')}>
        <I className={size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cx('block font-bold text-ags-navy tabular leading-none', size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-xl' : 'text-2xl')}>{value}</span>
        <span className={cx('block text-ags-slate mt-1.5 leading-snug', size === 'lg' ? 'text-base' : 'text-sm')}>{label}</span>
        {hint && <span className="block text-xs text-ags-slate/90 mt-0.5">{hint}</span>}
      </span>
    </Tag>
  );
}

function EmptyState({ icon: I = Inbox, title, body, action }) {
  return (
    <div className="text-center py-8 px-4">
      <span className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-ags-indigo-50 text-ags-indigo inline-flex items-center justify-center"><I className="w-6 h-6" aria-hidden="true" /></span>
      <p className="font-medium text-ags-navy">{title}</p>
      {body && <p className="text-sm text-ags-slate mt-1">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function SectionTitle({ icon: I, title, count, right, id, tone }) {
  return (
    <div className="flex items-center gap-2.5 mb-3" id={id}>
      {I && <I aria-hidden="true" className={cx('w-5 h-5', tone || 'text-ags-indigo')} />}
      <h2 className="text-lg font-bold text-ags-navy">{title}</h2>
      {count != null && <span className="text-xs font-bold tabular bg-ags-indigo-50 text-ags-indigo rounded-full px-2 py-0.5">{count}</span>}
      <div className="ms-auto">{right}</div>
    </div>
  );
}

function ViewSkeleton() {
  const { t } = useApp();
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{t('loading')}</span>
      <div className="shimmer h-8 w-64 rounded-lg mb-2" />
      <div className="shimmer h-4 w-80 max-w-full rounded mb-7" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => <div key={i} className="card p-4 flex gap-3 items-center"><div className="shimmer w-11 h-11 rounded-xl" /><div className="flex-1"><div className="shimmer h-6 w-10 rounded mb-2" /><div className="shimmer h-3 w-24 rounded" /></div></div>)}
      </div>
      {[0, 1, 2].map((i) => <div key={i} className="card p-4 mb-3 flex gap-4 items-center"><div className="shimmer w-11 h-11 rounded-xl" /><div className="flex-1"><div className="shimmer h-4 w-1/2 rounded mb-2" /><div className="shimmer h-3 w-1/3 rounded" /></div><div className="shimmer h-6 w-20 rounded-full" /></div>)}
    </div>
  );
}

function Toasts({ toasts, dismiss }) {
  const { t } = useApp();
  const icons = { success: CheckCircle2, info: Info, warn: AlertTriangle };
  const tones = { success: 'text-emerald-600', info: 'text-ags-indigo', warn: 'text-amber-600' };
  return (
    <div aria-live="polite" role="status" className="fixed z-[80] bottom-24 lg:bottom-6 inset-x-0 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((x) => {
        const I = icons[x.kind] || Info;
        return (
          <div key={x.id} className="ags-toast pointer-events-auto max-w-lg w-full sm:w-auto bg-ags-navy text-white rounded-xl shadow-2xl ps-4 pe-2 py-2.5 flex items-center gap-3 on-dark">
            <I aria-hidden="true" className={cx('w-5 h-5 shrink-0', x.kind === 'success' ? 'text-emerald-300' : x.kind === 'warn' ? 'text-amber-300' : 'text-ags-gold')} />
            <span className="text-sm flex-1">{x.msg}</span>
            {x.action && <button type="button" className="btn btn-sm btn-gold" onClick={() => { x.action.onClick(); dismiss(x.id); }}>{x.action.label}</button>}
            <button type="button" className="btn btn-icon text-white/80 hover:bg-white/10" onClick={() => dismiss(x.id)} aria-label={t('dismiss')}><X aria-hidden="true" className="w-4 h-4" /></button>
            <span className={cx('sr-only', tones[x.kind])} />
          </div>
        );
      })}
    </div>
  );
}

/** Animated check used on successful submission (gentle, no confetti). */
function SuccessCheck({ early = false }) {
  if (early) {
    return (
      <div className="relative w-28 h-28 mx-auto" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-28 h-28 ags-star">
          <polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" fill={BRAND.gold} stroke={BRAND.goldHover} strokeWidth="2" strokeLinejoin="round" />
          <path d="M34 52 l11 11 l22 -24" fill="none" stroke={BRAND.navy} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="ags-draw-check" />
        </svg>
        {[[-6, 20], [96, 14], [90, 86], [2, 80]].map(([x, y], i) => (
          <svg key={i} viewBox="0 0 10 10" className="absolute w-4 h-4 ags-star" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${0.3 + i * 0.12}s` }}><polygon points="5,0 6.2,3.8 10,3.8 7,6.1 8.1,10 5,7.6 1.9,10 3,6.1 0,3.8 3.8,3.8" fill={BRAND.gold} /></svg>
        ))}
      </div>
    );
  }
  return (
    <svg viewBox="0 0 56 56" className="w-20 h-20 mx-auto" aria-hidden="true">
      <circle cx="28" cy="28" r="26" fill="#ECFDF5" />
      <circle cx="28" cy="28" r="26" fill="none" stroke="#059669" strokeWidth="3" className="ags-draw-circle" />
      <path d="M16 29 l8 8 l16 -17" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="ags-draw-check" />
    </svg>
  );
}

/* ============================================================================
 * 9. SHELL
 * ========================================================================== */

function Wordmark() {
  const { t } = useApp();
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <span className="bg-ags-navy text-ags-gold font-bold tracking-widest rounded-lg px-2.5 py-1 text-lg leading-none ring-1 ring-white/10" dir="ltr">AGS</span>
      <span className="font-medium text-white text-[1.05rem] leading-tight hidden min-[380px]:inline">{t('app.name')}</span>
    </div>
  );
}

function LangToggle({ compact }) {
  const { lang, setLang, t } = useApp();
  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-lg bg-ags-navy/70 ring-1 ring-white/10 p-0.5">
      {[['en', 'EN', 'English'], ['ar', 'ع', 'العربية']].map(([code, short, full]) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} aria-label={full} onClick={() => setLang(code)}
          className={cx('min-w-[2.4rem] min-h-[2.2rem] px-2 rounded-md text-sm font-bold transition-colors', lang === code ? 'bg-ags-gold text-ags-navy' : 'text-white/85 hover:bg-white/10')}>
          {compact ? short : short}
        </button>
      ))}
    </div>
  );
}

function RoleSwitcher({ full }) {
  const { role, setRole, t } = useApp();
  return (
    <Segmented dark full={full} size={full ? 'md' : 'lg'} ariaLabel={t('role.label')} value={role} onChange={setRole}
      options={[
        { value: 'student', label: t('role.student'), icon: GraduationCap },
        { value: 'teacher', label: t('role.teacher'), icon: Presentation },
        { value: 'admin', label: t('role.admin'), icon: Building2 },
      ]} />
  );
}

function TopBar({ onOpenSettings, onReset }) {
  const { t, role, lang, student } = useApp();
  const who = role === 'student' ? studentName(student, lang) : role === 'teacher' ? teacherName('sarah', lang) : t('ad.user');
  return (
    <header className="on-dark sticky top-0 z-50 bg-ags-indigo text-white shadow-[0_2px_12px_rgba(32,31,60,.25)]">
      <div className="flex items-center gap-3 px-3 sm:px-5 h-16">
        <Wordmark />
        <div className="hidden md:flex flex-1 justify-center items-center gap-3">
          <span className="text-xs text-white/75 hidden xl:inline">{t('role.label')}</span>
          <RoleSwitcher />
        </div>
        <div className="ms-auto md:ms-0 flex items-center gap-1.5 sm:gap-2">
          <LangToggle />
          <button type="button" onClick={onReset} className="btn btn-sm hidden sm:inline-flex text-white/90 hover:bg-white/10 ring-1 ring-white/15">
            <RotateCcw aria-hidden="true" className="w-4 h-4" /><span className="hidden lg:inline">{t('demo.reset')}</span><span className="sr-only lg:hidden">{t('demo.reset')}</span>
          </button>
          <button type="button" onClick={onOpenSettings} className="btn btn-icon text-white/90 hover:bg-white/10" aria-label={t('settings')}><Settings aria-hidden="true" className="w-5 h-5" /></button>
          <div className="hidden 2xl:flex items-center gap-2 ps-2 border-s border-white/15">
            <Avatar name={who} size="sm" tone="gold" />
            <span className="text-sm text-white/90 max-w-[12rem] truncate">{who}</span>
          </div>
        </div>
      </div>
      <div className="md:hidden px-3 pb-3"><RoleSwitcher full /></div>
    </header>
  );
}

function AgePreviewBar() {
  const { t, stage, setStage } = useApp();
  return (
    <div className="bg-ags-gold-50 border-b border-amber-200/70">
      <div className="px-3 sm:px-5 py-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-ags-navy">
          <Eye aria-hidden="true" className="w-4 h-4" />
          <span className="text-sm font-bold">{t('stage.label')}</span>
          <span className="text-xs text-ags-slate hidden sm:inline">· {t('stage.hint')}</span>
        </div>
        <div className="scroll-x max-w-full">
          <Segmented size="sm" ariaLabel={t('stage.label')} value={stage} onChange={setStage}
            options={[{ value: 'early', label: t('stage.early') }, { value: 'middle', label: t('stage.middle') }, { value: 'senior', label: t('stage.senior') }]} />
        </div>
      </div>
    </div>
  );
}

function useNavItems() {
  const { role, db, now } = useApp();
  return useMemo(() => {
    if (role === 'student') return [{ id: 'home', icon: LayoutDashboard, label: 'nav.home' }, { id: 'all', icon: ClipboardList, label: 'nav.assignments' }];
    if (role === 'teacher') {
      let toGrade = 0;
      teacherAssignments(db).forEach((a) => { if (isPublished(a, now)) a.classes.forEach((c) => { toGrade += classStats(db, a, c, now).toGrade; }); });
      return [
        { id: 'home', icon: LayoutDashboard, label: 'nav.dashboard' },
        { id: 'assignments', icon: ClipboardList, label: 'nav.assignments' },
        { id: 'create', icon: PlusCircle, label: 'nav.create' },
        { id: 'grading', icon: Inbox, label: 'nav.grading', badge: toGrade },
        { id: 'insights', icon: BarChart3, label: 'nav.insights' },
      ];
    }
    return [{ id: 'home', icon: School, label: 'nav.overview' }];
  }, [role, db, now]);
}
const NAV_OF_ROUTE = { home: 'home', all: 'all', assignment: 'home', paper: 'home', assignments: 'assignments', create: 'create', grading: 'grading', submissions: 'grading', grade: 'grading', insights: 'insights' };

function Sidebar() {
  const { t, route, navigate, role, lang, student } = useApp();
  const items = useNavItems();
  const active = NAV_OF_ROUTE[route.name] || 'home';
  const who = role === 'student' ? studentName(student, lang) : role === 'teacher' ? teacherName('sarah', lang) : t('ad.user');
  const sub = role === 'student' ? clsLabel(student.cls, lang, true) : role === 'teacher' ? `${subjName('math', lang)} · ${clsList(SARAH_CLASSES, lang)}` : t('ad.scope');
  return (
    <aside className="on-dark hidden lg:flex w-64 shrink-0 flex-col bg-ags-navy text-white sticky top-16 self-start" style={{ height: 'calc(100vh - 4rem)' }}>
      <nav aria-label={t('nav.main')} className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {items.map((it) => {
          const I = it.icon; const on = active === it.id;
          return (
            <button key={it.id} type="button" onClick={() => navigate({ name: it.id })} aria-current={on ? 'page' : undefined}
              className={cx('w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] transition-colors border-s-4',
                on ? 'bg-white/10 text-white border-ags-gold font-medium' : 'border-transparent text-white/80 hover:bg-white/5 hover:text-white')}>
              <I aria-hidden="true" className={cx('w-5 h-5', on && 'text-ags-gold')} />
              <span className="flex-1 text-start">{t(it.label)}</span>
              {!!it.badge && <span className="text-xs font-bold bg-ags-gold text-ags-navy rounded-full px-2 py-0.5 tabular">{it.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar name={who} tone="gold" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{who}</p>
            <p className="text-xs text-white/70 truncate">{sub}</p>
          </div>
        </div>
        <p className="mt-4 text-[0.72rem] leading-snug text-white/65">{t('app.school')} · {t('app.city')}</p>
      </div>
    </aside>
  );
}

function BottomNav() {
  const { t, route, navigate } = useApp();
  const items = useNavItems();
  if (items.length < 2) return null;
  const active = NAV_OF_ROUTE[route.name] || 'home';
  return (
    <nav aria-label={t('nav.main')} className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(32,31,60,.06)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {items.map((it) => {
          const I = it.icon; const on = active === it.id;
          return (
            <button key={it.id} type="button" onClick={() => navigate({ name: it.id })} aria-current={on ? 'page' : undefined}
              className={cx('relative flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-2 text-[0.7rem] min-h-[3.75rem]', on ? 'text-ags-indigo font-bold' : 'text-ags-slate')}>
              {on && <span className="absolute top-0 inset-x-6 h-1 rounded-b bg-ags-gold" aria-hidden="true" />}
              <span className="relative">
                <I aria-hidden="true" className="w-5 h-5" />
                {!!it.badge && <span className="absolute -top-1.5 -end-3 text-[0.62rem] font-bold bg-ags-gold text-ags-navy rounded-full px-1.5 tabular">{it.badge}</span>}
              </span>
              <span className="leading-tight text-center">{t(it.label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Footer({ onAbout }) {
  const { t } = useApp();
  return (
    <footer className="mt-12 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ags-slate">
      <span className="font-bold text-ags-indigo" dir="ltr">AGS</span>
      <span>{t('app.name')}</span>
      <span aria-hidden="true">·</span>
      <button type="button" onClick={onAbout} className="inline-flex items-center gap-1.5 rounded-full bg-ags-gold-50 ring-1 ring-amber-200 px-2.5 py-1 text-ags-navy hover:bg-ags-gold-100">
        <Info aria-hidden="true" className="w-3.5 h-3.5" />{t('demo.footer')}
      </button>
    </footer>
  );
}

function DemoGuide() {
  const { t, guide, setGuide, guideGo } = useApp();
  const done = [1, 2, 3, 4, 5, 6].filter((i) => guide.steps[i]).length;
  if (!guide.open) {
    return (
      <button type="button" onClick={() => setGuide((g) => ({ ...g, open: true }))}
        className="fixed z-40 bottom-[5.25rem] lg:bottom-5 end-4 btn btn-gold shadow-lg rounded-full">
        <Sparkles aria-hidden="true" className="w-4 h-4" />{t('guide.title')}
        <span className="text-xs font-bold bg-ags-navy text-ags-gold rounded-full px-1.5 tabular">{t('guide.progress', { n: done })}</span>
      </button>
    );
  }
  return (
    <aside aria-label={t('guide.title')} className="fixed z-40 bottom-[5.25rem] lg:bottom-5 end-4 w-[min(22rem,calc(100vw-2rem))] card shadow-2xl ags-fade-up overflow-hidden">
      <div className="bg-ags-navy text-white px-4 py-3 flex items-center gap-2 on-dark">
        <Sparkles aria-hidden="true" className="w-4 h-4 text-ags-gold" />
        <h2 className="font-bold text-sm flex-1">{t('guide.title')}</h2>
        <span className="text-xs text-white/80 tabular">{t('guide.progress', { n: done })}</span>
        <button type="button" className="btn btn-icon text-white/85 hover:bg-white/10 !min-h-0 !min-w-0 w-8 h-8" onClick={() => setGuide((g) => ({ ...g, open: false }))} aria-label={t('guide.hide')}><X aria-hidden="true" className="w-4 h-4" /></button>
      </div>
      <ProgressBar value={done} max={6} tone="gold" height="h-1" className="rounded-none" label={t('guide.title')} />
      <ol className="p-3 space-y-1 max-h-[50vh] overflow-y-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => {
          const ok = guide.steps[i];
          return (
            <li key={i} className={cx('flex items-start gap-2.5 rounded-xl p-2', ok ? 'bg-emerald-50/70' : 'hover:bg-slate-50')}>
              <span aria-hidden="true" className={cx('mt-0.5 w-6 h-6 rounded-full shrink-0 inline-flex items-center justify-center text-xs font-bold', ok ? 'bg-emerald-600 text-white' : 'bg-ags-indigo-50 text-ags-indigo')}>
                {ok ? <Check className="w-3.5 h-3.5" /> : i}
              </span>
              <span className={cx('text-[0.82rem] leading-snug flex-1', ok ? 'text-emerald-900' : 'text-ags-navy')}>
                <span className="sr-only">{ok ? `${t('guide.done')}: ` : ''}</span>{t(`guide.s${i}`)}
              </span>
              <button type="button" className="btn btn-sm btn-ghost !min-h-[2rem] px-2" onClick={() => guideGo(i)} aria-label={`${t('guide.go')} — ${i}`}>
                {t('guide.go')}<ArrowRight aria-hidden="true" className="w-3.5 h-3.5 flip-rtl" />
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function SettingsModal({ open, onClose, onReset, onAbout }) {
  const { t, settings, setSettings, lang, setLang, guide, setGuide } = useApp();
  return (
    <Modal open={open} onClose={onClose} title={t('settings')} icon={Settings} size="sm"
      footer={<button type="button" className="btn btn-primary" onClick={onClose}>{t('close')}</button>}>
      <div className="space-y-6">
        <div>
          <p className="label">{t('settings.textSize')}</p>
          <Segmented full ariaLabel={t('settings.textSize')} value={settings.textSize} onChange={(v) => setSettings((s) => ({ ...s, textSize: v }))}
            options={[{ value: 's', label: t('settings.size.s') }, { value: 'm', label: t('settings.size.m') }, { value: 'l', label: t('settings.size.l') }, { value: 'xl', label: t('settings.size.xl') }]} />
          <p className="hint mt-2">{t('settings.preview')}</p>
        </div>
        <div>
          <p className="label">{t('lang.label')}</p>
          <Segmented full ariaLabel={t('lang.label')} value={lang} onChange={setLang} options={[{ value: 'en', label: 'English' }, { value: 'ar', label: 'العربية' }]} />
        </div>
        <Switch checked={settings.reduceMotion} onChange={(v) => setSettings((s) => ({ ...s, reduceMotion: v }))} label={t('settings.motion')} hint={t('settings.motion.hint')} />
        <Switch checked={guide.open} onChange={(v) => setGuide((g) => ({ ...g, open: v }))} label={t('settings.guide')} />
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { onClose(); onReset(); }}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('demo.reset')}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { onClose(); onAbout(); }}><Info aria-hidden="true" className="w-4 h-4" />{t('demo.about')}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================================
 * 10. STUDENT VIEWS
 * ========================================================================== */

function useStudentItems() {
  const { db, student, now } = useApp();
  return useMemo(() => Object.values(db.assignments)
    .filter((a) => isVisibleToStudent(a, student, now))
    .map((a) => { const sub = db.submissions[subKey(a.id, student.id)]; return { a, sub, st: studentState(a, sub, now) }; }), [db, student, now]);
}

function latePolicyText(t, fmt, a) {
  const p = a.latePolicy || {};
  let s = p.mode === 'until' && p.until ? t('late.policy.until', { date: fmt.dateTime(p.until) }) : t(`late.policy.${p.mode || 'accept'}`);
  if (p.deduct && p.mode !== 'none') s += ` ${t('late.deduct', { pct: fmt.pct((p.pct || 0) / 100) })}.`;
  return s;
}
function lateLine(t, fmt, a, now) {
  const p = a.latePolicy || {};
  if (p.mode === 'none') return t('late.closed');
  if (p.mode === 'until') return p.until && now <= p.until ? t('late.acceptUntil', { date: fmt.date(p.until) }) : t('late.closed');
  return t('late.accept');
}

function AssignmentCard({ item }) {
  const { t, fmt, lang, stage, now, navigate } = useApp();
  const { a, sub, st } = item;
  const open = () => navigate({ name: 'assignment', id: a.id });
  const type = submissionType(a); const TI = TYPE_ICON[type];
  const color = SUBJECTS[a.subject]?.color;
  const isRet = st === 'returned' || st === 'revision';
  const isOver = st === 'overdue' || st === 'closed';
  const isDone = ['submitted', 'submittedLate'].includes(st);
  const due = isOver ? `${t('due.was', { when: fmt.date(a.dueAt) })} · ${t('late.days', { n: lateDays(a.dueAt, now) })}` : dueLabel(t, fmt, a.dueAt, now);
  const markPill = isRet && typeof sub?.mark === 'number' ? (
    <span className="inline-flex items-baseline gap-1 rounded-lg bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200 px-2.5 py-1 font-bold tabular">{fmt.score(sub.mark, a.points)}</span>
  ) : null;

  if (stage === 'early') {
    const dd = Math.round((startOfDay(a.dueAt) - startOfDay(now)) / DAY);
    const when = dd === 0 ? t('due.early.today') : dd === 1 ? t('due.early.tomorrow') : fmt.weekday(a.dueAt);
    return (
      <button type="button" onClick={open} className="card w-full text-start p-5 flex items-center gap-5 hover:shadow-lg transition-shadow min-h-[7.5rem]">
        <SubjectArt code={a.subject} />
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium" style={{ color }}>{subjName(a.subject, lang)}</span>
          <span className="block text-xl font-bold text-ags-navy leading-snug mt-0.5" dir="auto">{a.title}</span>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            {!isRet && !isDone && <span className="inline-flex items-center gap-1.5 text-base text-ags-slate"><CalendarDays aria-hidden="true" className="w-5 h-5" />{isOver ? t('st.overdue') : when}</span>}
            <StatusChip status={st} size="lg" />
            {markPill}
          </span>
        </span>
        <ChevronRight aria-hidden="true" className="w-7 h-7 text-ags-slate flip-rtl shrink-0" />
      </button>
    );
  }

  if (stage === 'senior') {
    return (
      <button type="button" onClick={open} className="w-full text-start px-4 py-3 grid grid-cols-[1fr_auto] sm:grid-cols-[9rem_1fr_auto_auto] items-center gap-x-4 gap-y-1 hover:bg-ags-indigo-50/50 transition-colors">
        <span className="hidden sm:block"><SubjectTag code={a.subject} /></span>
        <span className="min-w-0">
          <span className="block font-medium text-ags-navy truncate" dir="auto">{a.title}</span>
          <span className="block text-xs text-ags-slate truncate">
            <span className="sm:hidden">{subjName(a.subject, lang)} · </span>{teacherName(a.teacherId, lang)} · {t(`type.${type}`)} · {t('pts', { n: a.points })}
          </span>
          {isOver && <span className="block text-xs text-amber-800 mt-0.5">{lateLine(t, fmt, a, now)}</span>}
        </span>
        <span className="hidden sm:block text-sm text-ags-slate tabular text-end">{isRet && sub?.returnedAt ? agoLabel(t, sub.returnedAt, now) : due}</span>
        <span className="flex items-center gap-2 justify-end">{markPill}<StatusChip status={st} size="sm" /></span>
        <span className="sm:hidden col-span-2 text-xs text-ags-slate tabular">{due}</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={open}
      className={cx('card group w-full text-start p-4 sm:p-5 flex gap-4 items-start relative overflow-hidden hover:shadow-lg transition-shadow', isOver && 'ring-1 ring-amber-200')}>
      <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1.5" style={{ background: color }} />
      <SubjectBadge code={a.subject} />
      <span className="flex-1 min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <SubjectTag code={a.subject} />
          <span className="text-xs text-ags-slate">· {teacherName(a.teacherId, lang)}</span>
        </span>
        <span className="block font-bold text-ags-navy text-[1.05rem] mt-1 leading-snug" dir="auto">{a.title}</span>
        <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ags-slate">
          {!isRet && <span className="inline-flex items-center gap-1.5"><Clock aria-hidden="true" className="w-4 h-4" />{isDone && sub?.submittedAt ? `${t('st.submitted')} · ${agoLabel(t, sub.submittedAt, now)}` : due}</span>}
          {isRet && sub?.returnedAt && <span className="inline-flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="w-4 h-4" />{t('fb.returnedOn', { when: agoLabel(t, sub.returnedAt, now) })}</span>}
          <span className="inline-flex items-center gap-1.5"><TI aria-hidden="true" className="w-4 h-4" />{t(`type.${type}`)}</span>
        </span>
        {isOver && <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-amber-900 bg-amber-50 rounded-lg px-2 py-1"><Info aria-hidden="true" className="w-4 h-4" />{lateLine(t, fmt, a, now)}</span>}
        {isRet && sub?.comment && <span className="mt-2 block text-sm text-ags-navy/90 bg-slate-50 rounded-lg px-3 py-2 line-clamp-2" dir="auto"><MessageSquareText aria-hidden="true" className="inline w-4 h-4 me-1.5 text-ags-indigo" />{sub.comment}</span>}
      </span>
      <span className="flex flex-col items-end gap-2 shrink-0">
        <StatusChip status={st} />
        {markPill}
        {st === 'revision' && <span className="text-xs font-medium text-ags-indigo">{t('resubmit')} →</span>}
        <ChevronRight aria-hidden="true" className="w-5 h-5 text-slate-400 group-hover:text-ags-indigo flip-rtl mt-auto" />
      </span>
    </button>
  );
}

function CardList({ items, emptyText, emptyIcon }) {
  const { stage, t } = useApp();
  if (!items.length) return <div className="card"><EmptyState icon={emptyIcon || CheckCircle2} title={emptyText || t('empty.filter')} /></div>;
  if (stage === 'senior') return <div className="card divide-y divide-slate-100 overflow-hidden">{items.map((x) => <AssignmentCard key={x.a.id} item={x} />)}</div>;
  return <div className={cx('grid gap-3', stage === 'early' ? 'sm:grid-cols-2 gap-4' : '')}>{items.map((x) => <AssignmentCard key={x.a.id} item={x} />)}</div>;
}

function WeekStrip({ items, day, setDay }) {
  const { t, fmt, now } = useApp();
  const days = Array.from({ length: 7 }, (_, i) => startOfDay(now) + i * DAY + 2 * HOUR);
  return (
    <div className="card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold text-ags-navy inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="w-4 h-4 text-ags-indigo" />{t('week.next')}</h2>
        {day && <button type="button" className="btn btn-ghost btn-sm !min-h-[2rem]" onClick={() => setDay(null)}>{t('week.clear')}</button>}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const ymd = toYMD(d);
          const due = items.filter((x) => toYMD(x.a.dueAt) === ymd);
          const wk = isWeekend(d); const sel = day === ymd;
          return (
            <button key={ymd} type="button" aria-pressed={sel} onClick={() => setDay(sel ? null : ymd)} disabled={!due.length && !sel}
              aria-label={`${fmt.weekday(d)} ${fmt.dateNoWd(d)} — ${due.length ? t('week.count', { n: due.length }) : wk ? t('week.weekend') : t('week.none')}`}
              className={cx('rounded-xl py-2 px-1 flex flex-col items-center gap-1 transition-colors border disabled:opacity-100 disabled:cursor-default',
                sel ? 'bg-ags-indigo text-white border-ags-indigo' : i === 0 ? 'border-ags-gold bg-ags-gold-50' : 'border-transparent hover:bg-ags-indigo-50',
                wk && !sel && 'opacity-60')}>
              <span className={cx('text-[0.7rem] font-medium', sel ? 'text-white/90' : 'text-ags-slate')}>{i === 0 ? t('week.today') : fmt.weekdayShort(d)}</span>
              <span className="text-base font-bold tabular leading-none">{fmt.dayNum(d)}</span>
              <span className="flex gap-0.5 h-2 items-center" aria-hidden="true">
                {due.slice(0, 4).map((x) => <span key={x.a.id} className="w-1.5 h-1.5 rounded-full" style={{ background: sel ? '#fff' : SUBJECTS[x.a.subject]?.color }} />)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { t, fmt, lang, stage, student, now, db, navigate, actions } = useApp();
  const items = useStudentItems();
  const [subject, setSubject] = useState('all');
  const [day, setDay] = useState(null);
  const [showDone, setShowDone] = useState(false);
  useEffect(() => { setSubject('all'); setDay(null); }, [student.id]);

  const f = items.filter((x) => subject === 'all' || x.a.subject === subject);
  const isOpenSt = (x) => ['notStarted', 'draft'].includes(x.st) && (x.a.dueAt >= now || x.sub?.resubmitting);
  const dueSoonAll = f.filter(isOpenSt).sort((p, q) => p.a.dueAt - q.a.dueAt);
  const dueSoon = day ? dueSoonAll.filter((x) => toYMD(x.a.dueAt) === day) : dueSoonAll;
  const overdue = f.filter((x) => ['overdue', 'closed'].includes(x.st) && now - x.a.dueAt < 21 * DAY).sort((p, q) => q.a.dueAt - p.a.dueAt);
  const returned = f.filter((x) => x.st === 'revision' || (x.st === 'returned' && now - (x.sub.returnedAt || 0) < 10 * DAY)).sort((p, q) => (q.sub.returnedAt || 0) - (p.sub.returnedAt || 0));
  const completed = f.filter((x) => ['submitted', 'submittedLate'].includes(x.st) || (x.st === 'returned' && !returned.includes(x))).sort((p, q) => (q.sub.submittedAt || 0) - (p.sub.submittedAt || 0));

  const all = items;
  const cDue = all.filter((x) => isOpenSt(x) && x.a.dueAt <= now + 7 * DAY).length;
  const cOver = all.filter((x) => ['overdue', 'closed'].includes(x.st) && now - x.a.dueAt < 21 * DAY).length;
  const cSub = all.filter((x) => ['submitted', 'submittedLate'].includes(x.st)).length;
  const cRet = all.filter((x) => x.st === 'revision' || (x.st === 'returned' && now - (x.sub.returnedAt || 0) < 10 * DAY)).length;

  const wk0 = schoolWeekStart(now); const wk1 = wk0 + 7 * DAY;
  const thisWeek = all.filter((x) => x.a.dueAt >= wk0 && x.a.dueAt < wk1);
  const weekDone = thisWeek.filter((x) => !['notStarted', 'draft', 'overdue', 'closed'].includes(x.st));
  const weekLeft = thisWeek.length - weekDone.length;
  const allOnTime = thisWeek.length > 0 && weekLeft === 0 && weekDone.every((x) => !x.sub?.late);
  const next = dueSoonAll[0];
  const enc = !thisWeek.length ? t('enc.none') : allOnTime ? t.s('enc.allOnTime', stage)
    : weekLeft > 0 ? t.s('enc.left', stage, { n: weekLeft, next: next ? `${next.a.title} — ${dueLabel(t, fmt, next.a.dueAt, now)}` : '—' }) : t('enc.progress', { done: weekDone.length, total: thisWeek.length });

  const hour = new Date(now).getHours();
  const greet = stage === 'early' ? t('greet.early', { name: studentFirst(student, lang) })
    : t(hour < 12 ? 'greet.morning' : hour < 17 ? 'greet.afternoon' : 'greet.evening', { name: studentFirst(student, lang) });
  const subjectsPresent = [...new Set(items.map((x) => x.a.subject))];
  const reminders = db.reminders.filter((r) => r.studentId === student.id && !r.dismissed);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const statSize = stage === 'early' ? 'lg' : stage === 'senior' ? 'sm' : 'md';

  return (
    <div className={cx(stage === 'early' && 'stage-early')}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ags-slate flex flex-wrap gap-x-2">
            <span>{fmt.dateLong(now)}</span><span aria-hidden="true">·</span><span className="text-xs self-center bg-white ring-1 ring-slate-200 rounded-full px-2 py-0.5">{fmt.hijri(now)}</span>
          </p>
          <h1 className={cx('font-bold text-ags-navy mt-1 leading-tight', stage === 'early' ? 'text-3xl sm:text-4xl' : stage === 'senior' ? 'text-2xl' : 'text-2xl sm:text-3xl')}>{greet}</h1>
          <p className="text-ags-slate mt-1">{clsLabel(student.cls, lang, true)}</p>
        </div>
        {stage !== 'senior' ? (
          <div className="card px-4 py-3 w-full sm:w-auto sm:min-w-[19rem] max-w-md">
            <p className={cx('text-ags-navy font-medium flex items-center gap-2', stage === 'early' && 'text-lg')}>
              {allOnTime ? <Star aria-hidden="true" className="w-5 h-5 text-ags-gold fill-current" /> : <TrendingUp aria-hidden="true" className="w-5 h-5 text-ags-indigo" />}{enc}
            </p>
            {thisWeek.length > 0 && <ProgressBar className="mt-2" value={weekDone.length} max={thisWeek.length} tone={allOnTime ? 'gold' : 'indigo'} label={t('enc.progress', { done: weekDone.length, total: thisWeek.length })} />}
            {thisWeek.length > 0 && <p className="text-xs text-ags-slate mt-1.5">{t('enc.progress', { done: weekDone.length, total: thisWeek.length })}</p>}
          </div>
        ) : <p className="text-sm text-ags-slate max-w-xl">{enc}</p>}
      </div>

      {reminders.map((r) => (
        <div key={r.id} className="card p-4 mb-4 flex flex-wrap items-center gap-3 border-s-4 border-ags-gold ags-fade-up">
          <Bell aria-hidden="true" className="w-5 h-5 text-ags-indigo" />
          <p className="flex-1 text-sm text-ags-navy min-w-[12rem]">{t('reminder.text', { teacher: teacherName(r.teacherId, lang), title: db.assignments[r.assignmentId]?.title })}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate({ name: 'assignment', id: r.assignmentId })}>{t('reminder.open')}</button>
          <button type="button" className="btn btn-ghost btn-icon" aria-label={t('dismiss')} onClick={() => actions.dismissReminder(r.id)}><X aria-hidden="true" className="w-4 h-4" /></button>
        </div>
      ))}

      <div className={cx('grid gap-3 sm:gap-4 mb-6', stage === 'senior' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-4')}>
        <StatCard size={statSize} icon={CalendarClock} tone="indigo" value={fmt.n(cDue)} label={t.s('dash.dueWeek', stage)} onClick={() => scrollTo('sec-due')} />
        <StatCard size={statSize} icon={AlarmClock} tone="amber" value={fmt.n(cOver)} label={t.s('dash.overdue', stage)} onClick={() => scrollTo('sec-overdue')} />
        <StatCard size={statSize} icon={Send} tone="grey" value={fmt.n(cSub)} label={t.s('dash.submitted', stage)} onClick={() => { setShowDone(true); setTimeout(() => scrollTo('sec-done'), 50); }} />
        <StatCard size={statSize} icon={MessageSquareText} tone="green" value={fmt.n(cRet)} label={t.s('dash.returned', stage)} onClick={() => scrollTo('sec-returned')} />
      </div>

      {stage !== 'early' && (
        <div className="grid lg:grid-cols-[1fr_minmax(0,26rem)] gap-4 mb-7 items-start">
          <div className="min-w-0">
            <p className="label">{t('filter.subjects')}</p>
            <div className="scroll-x -mx-1 px-1"><div className="flex gap-2 pb-1 w-max">
              {['all', ...subjectsPresent].map((s) => (
                <button key={s} type="button" aria-pressed={subject === s} onClick={() => setSubject(s)}
                  className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ring-1 transition-colors min-h-[2.25rem]', subject === s ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-200 hover:ring-ags-indigo')}>
                  {s !== 'all' && <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: subject === s ? '#fff' : SUBJECTS[s].color }} />}
                  {s === 'all' ? t('filter.all') : subjName(s, lang)}
                </button>
              ))}
            </div></div>
          </div>
          <WeekStrip items={f.filter((x) => x.a.dueAt >= startOfDay(now))} day={day} setDay={setDay} />
        </div>
      )}

      <section className="mb-8" aria-labelledby="sec-due-h">
        <div id="sec-due" className="scroll-mt-24" />
        <SectionTitle id="sec-due-h" icon={CalendarClock} title={t.s('sec.dueSoon', stage)} count={dueSoon.length} />
        {day && <p className="text-sm text-ags-slate -mt-1 mb-3">{t('week.filtered', { day: fmt.weekday(fromYMDHM(day, '12:00')) })}</p>}
        <CardList items={dueSoon} emptyText={t.s('empty.dueSoon', stage)} />
      </section>

      {overdue.length > 0 && (
        <section className="mb-8" aria-labelledby="sec-overdue-h">
          <div id="sec-overdue" className="scroll-mt-24" />
          <div className="rounded-2xl bg-amber-50/70 ring-1 ring-amber-200 p-3 sm:p-4">
            <SectionTitle id="sec-overdue-h" icon={AlarmClock} tone="text-amber-700" title={t.s('sec.overdue', stage)} count={overdue.length} />
            <p className="text-sm text-amber-900 -mt-1 mb-3">{t('sec.overdue.hint')}</p>
            <CardList items={overdue} />
          </div>
        </section>
      )}

      <section className="mb-8" aria-labelledby="sec-returned-h">
        <div id="sec-returned" className="scroll-mt-24" />
        <SectionTitle id="sec-returned-h" icon={MessageSquareText} tone="text-emerald-700" title={t.s('sec.returned', stage)} count={returned.length} />
        <CardList items={returned} emptyText={t('empty.returned')} emptyIcon={MessageSquareText} />
      </section>

      <section aria-labelledby="sec-done-h">
        <div id="sec-done" className="scroll-mt-24" />
        <SectionTitle id="sec-done-h" icon={CheckCheck} title={t.s('sec.completed', stage)} count={completed.length}
          right={<button type="button" className="btn btn-ghost btn-sm" aria-expanded={showDone} aria-controls="done-list" onClick={() => setShowDone((v) => !v)}>
            {showDone ? t('hide') : t('show')}<ChevronDown aria-hidden="true" className={cx('w-4 h-4 transition-transform', showDone && 'rotate-180')} /></button>} />
        <div id="done-list" hidden={!showDone}>{showDone && <CardList items={completed} emptyText={t('empty.completed')} />}</div>
      </section>
    </div>
  );
}

function AllAssignments() {
  const { t, stage } = useApp();
  const items = useStudentItems();
  const [tab, setTab] = useState('todo');
  const groups = {
    todo: items.filter((x) => ['notStarted', 'draft', 'overdue', 'closed'].includes(x.st)).sort((p, q) => p.a.dueAt - q.a.dueAt),
    submitted: items.filter((x) => ['submitted', 'submittedLate'].includes(x.st)).sort((p, q) => q.a.dueAt - p.a.dueAt),
    returned: items.filter((x) => ['returned', 'revision'].includes(x.st)).sort((p, q) => (q.sub.returnedAt || 0) - (p.sub.returnedAt || 0)),
    all: [...items].sort((p, q) => q.a.dueAt - p.a.dueAt),
  };
  return (
    <div className={cx(stage === 'early' && 'stage-early')}>
      <PageHeader title={t('all.title')} subtitle={t('all.subtitle')} />
      <div className="scroll-x mb-5"><Segmented ariaLabel={t('all.title')} value={tab} onChange={setTab}
        options={[['todo', 'all.tab.todo'], ['submitted', 'all.tab.submitted'], ['returned', 'all.tab.returned'], ['all', 'all.tab.all']].map(([v, k]) => ({ value: v, label: `${t(k)} (${groups[v].length})` }))} /></div>
      <CardList items={groups[tab]} />
    </div>
  );
}

/* ---------- assignment page pieces ---------- */

function Meta({ icon: I, label, value, sub }) {
  return (
    <div className="rounded-xl bg-slate-50 ring-1 ring-slate-100 px-3.5 py-3 min-w-0">
      <dt className="text-xs text-ags-slate flex items-center gap-1.5"><I aria-hidden="true" className="w-3.5 h-3.5" />{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ags-navy leading-snug">{value}</dd>
      {sub && <dd className="text-xs text-ags-slate mt-0.5">{sub}</dd>}
    </div>
  );
}

function AssignmentHeader({ a, st }) {
  const { t, fmt, lang, now, stage } = useApp();
  const type = submissionType(a); const TI = TYPE_ICON[type];
  const over = now > a.dueAt;
  return (
    <div className="card p-5 sm:p-6 mb-5 relative overflow-hidden">
      <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1.5" style={{ background: SUBJECTS[a.subject]?.color }} />
      <div className="flex flex-wrap items-start gap-4">
        <SubjectBadge code={a.subject} size={stage === 'early' ? 'xl' : 'lg'} />
        <div className="flex-1 min-w-[12rem]">
          <SubjectTag code={a.subject} />
          <h1 dir="auto" className={cx('font-bold text-ags-navy mt-1 leading-tight', stage === 'early' ? 'text-3xl' : 'text-2xl sm:text-[1.7rem]')}>{a.title}</h1>
          <p className="text-ags-slate mt-1 text-sm">{teacherName(a.teacherId, lang)} · {clsList(a.classes, lang)}</p>
        </div>
        {st && <StatusChip status={st} size="lg" />}
      </div>
      <dl className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Meta icon={CalendarDays} label={t('a.due')} value={`${fmt.date(a.dueAt)} · ${fmt.time(a.dueAt)}`} sub={over ? `${t('due.was', { when: agoLabel(t, a.dueAt, now) })}` : dueLabel(t, fmt, a.dueAt, now)} />
        <Meta icon={BadgeCheck} label={t('a.points')} value={t('pts', { n: a.points })} />
        <Meta icon={Clock} label={t('a.latePolicy')} value={latePolicyText(t, fmt, a)} />
        <Meta icon={TI} label={t('a.type')} value={t(`type.${type}`)} />
      </dl>
    </div>
  );
}

/** Mock document preview for attached worksheets (inline SVG; no real file). */
function DocPreview({ att, a }) {
  const { lang } = useApp();
  const color = SUBJECTS[a?.subject]?.color || BRAND.indigo;
  const rtl = /[؀-ۿ]/.test(att.name);
  const title = att.name.replace(/\.pdf$/i, '');
  return (
    <svg viewBox="0 0 600 780" className="w-full h-auto rounded-lg ring-1 ring-slate-200 bg-white" role="img" aria-label={att.name}>
      <rect width="600" height="780" fill="#fff" />
      <rect width="600" height="64" fill={color} />
      <text x={rtl ? 570 : 30} y="41" fill="#fff" fontSize="20" fontWeight="700" textAnchor={rtl ? 'end' : 'start'} fontFamily="Noto Kufi Arabic, sans-serif">AGS · {subjName(a?.subject || 'math', rtl ? 'ar' : lang === 'ar' && !rtl ? 'en' : 'en')}</text>
      <text x={rtl ? 570 : 30} y="118" fill={BRAND.navy} fontSize="24" fontWeight="700" textAnchor={rtl ? 'end' : 'start'} fontFamily="Noto Kufi Arabic, sans-serif">{title}</text>
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <circle cx={rtl ? 560 : 40} cy={178 + i * 62} r="12" fill={tint(color, '22')} />
          <text x={rtl ? 560 : 40} y={183 + i * 62} fontSize="13" textAnchor="middle" fill={color} fontWeight="700">{i + 1}</text>
          <rect x={rtl ? 120 : 66} y={168 + i * 62} width={360 - (i % 3) * 60} height="10" rx="5" fill="#E2E3EC" />
          <rect x={rtl ? 220 : 66} y={186 + i * 62} width={260 - (i % 2) * 70} height="10" rx="5" fill="#EEF0F5" />
        </g>
      ))}
      <rect x="30" y="740" width="540" height="1" fill="#E2E3EC" />
    </svg>
  );
}

function AttachmentList({ a, attachments }) {
  const { t } = useApp();
  const [open, setOpen] = useState(null);
  if (!attachments?.length) return null;
  const icon = { worksheet: FileText, image: ImageIcon, link: Link2 };
  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-ags-navy mb-2 flex items-center gap-2"><Paperclip aria-hidden="true" className="w-4 h-4" />{t('a.attachments')}</h3>
      <ul className="grid sm:grid-cols-2 gap-2">
        {attachments.map((x) => {
          const I = icon[x.kind] || FileText;
          const inner = (
            <>
              <span className="w-10 h-12 rounded-md bg-ags-indigo-50 text-ags-indigo flex items-center justify-center shrink-0 overflow-hidden">
                {x.kind === 'image' && x.src ? <img src={x.src} alt="" className="w-full h-full object-cover" /> : <I aria-hidden="true" className="w-5 h-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ags-navy truncate" dir="auto">{x.name}</span>
                <span className="block text-xs text-ags-slate">{t(`att.${x.kind}`)} · {x.kind === 'link' ? t('att.openLink') : t('att.preview')}</span>
              </span>
              {x.kind === 'link' ? <Link2 aria-hidden="true" className="w-4 h-4 text-ags-slate" /> : <Eye aria-hidden="true" className="w-4 h-4 text-ags-slate" />}
            </>
          );
          return (
            <li key={x.id}>
              {x.kind === 'link'
                ? <a href={x.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl ring-1 ring-slate-200 bg-white p-2.5 hover:ring-ags-indigo transition">{inner}</a>
                : <button type="button" onClick={() => setOpen(x)} className="w-full text-start flex items-center gap-3 rounded-xl ring-1 ring-slate-200 bg-white p-2.5 hover:ring-ags-indigo transition">{inner}</button>}
            </li>
          );
        })}
      </ul>
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name || ''} icon={FileText} size="md"
        footer={<button type="button" className="btn btn-primary" onClick={() => setOpen(null)}>{t('close')}</button>}>
        {open && (open.kind === 'image' && open.src ? <img src={open.src} alt={open.name} className="w-full rounded-lg" /> : <DocPreview att={open} a={a} />)}
        <p className="hint mt-3">{t('att.mockNote')}</p>
      </Modal>
    </div>
  );
}

const MATCH_ORDER = (b) => b.pairs.map((_, i) => i).sort((x, y) => hashStr(`${b.id}${x}`) - hashStr(`${b.id}${y}`));

function readFileMeta(file) {
  return new Promise((resolve) => {
    const meta = { id: uid('f'), name: file.name, size: file.size, type: file.type };
    if (!file.type.startsWith('image/') || file.size > 8e6) { resolve(meta); return; }
    const url = URL.createObjectURL(file);
    downscaleImage(url, 900).then((r) => resolve({ ...meta, src: r.src })).catch(() => resolve(meta)).finally(() => URL.revokeObjectURL(url));
  });
}
const fmtSize = (n) => (n > 1e6 ? `${round1(n / 1e6)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** One question, rendered for answering, reviewing or showing results. */
function QuestionCard({ a, b, index, value, onChange, readOnly, showResults, onOpenPaper, preview }) {
  const { t, fmt, stage } = useApp();
  const cdir = a.lang === 'ar' ? 'rtl' : 'ltr';
  const name = `q_${b.id}`;
  const correct = showResults && isAuto(b) ? scoreBlock(b, value) >= b.points : null;
  const big = stage === 'early';
  const optCls = (on, ok, bad) => cx('flex items-center gap-3 rounded-xl ring-1 px-3.5 py-3 transition-colors', big && 'py-4 text-lg',
    ok ? 'ring-emerald-300 bg-emerald-50' : bad ? 'ring-rose-300 bg-rose-50' : on ? 'ring-ags-indigo bg-ags-indigo-50' : 'ring-slate-200 bg-white', !readOnly && 'cursor-pointer hover:ring-ags-indigo');
  let body = null;

  if (b.type === 'mcq' || b.type === 'tf') {
    const opts = b.type === 'tf' ? [{ v: true, l: t('q.true') }, { v: false, l: t('q.false') }] : b.options.map((o, i) => ({ v: i, l: o }));
    body = (
      <div className={cx('grid gap-2', b.type === 'tf' && 'grid-cols-2')} role="radiogroup" aria-labelledby={`${name}_p`}>
        {opts.map((o) => {
          const on = value === o.v; const isC = showResults && o.v === b.correct; const bad = showResults && on && !isC;
          return (
            <label key={String(o.v)} className={optCls(on, isC, bad)}>
              <input type="radio" name={name} checked={on} disabled={readOnly} onChange={() => onChange(o.v)} />
              <span className="flex-1" dir={b.type === 'tf' ? undefined : cdir}>{o.l}</span>
              {isC && <CheckCircle2 aria-label={t('fb.correctAnswer')} className="w-5 h-5 text-emerald-600" />}
              {bad && <X aria-label={t('fb.yourAnswer')} className="w-5 h-5 text-rose-600" />}
            </label>
          );
        })}
      </div>
    );
  } else if (b.type === 'checkbox') {
    const cur = Array.isArray(value) ? value : [];
    body = (
      <div className="grid gap-2">
        <p className="hint">{t('q.chooseMany')}</p>
        {b.options.map((o, i) => {
          const on = cur.includes(i); const isC = showResults && (b.correct || []).includes(i); const bad = showResults && on && !isC;
          return (
            <label key={i} className={optCls(on, isC, bad)}>
              <input type="checkbox" checked={on} disabled={readOnly} onChange={() => onChange(on ? cur.filter((x) => x !== i) : [...cur, i])} />
              <span className="flex-1" dir={cdir}>{o}</span>
            </label>
          );
        })}
      </div>
    );
  } else if (b.type === 'short') {
    body = <input className={cx('input', big && 'text-lg')} dir="auto" value={value || ''} readOnly={readOnly} placeholder={readOnly ? '' : t('q.typeHere')} aria-labelledby={`${name}_p`} onChange={(e) => onChange(e.target.value)} />;
  } else if (b.type === 'long') {
    const words = String(value || '').trim().split(/\s+/).filter(Boolean).length;
    body = (
      <div>
        <textarea className="input min-h-[10rem]" dir="auto" value={value || ''} readOnly={readOnly} placeholder={readOnly ? '' : t('q.typeHere')} aria-labelledby={`${name}_p`} onChange={(e) => onChange(e.target.value)} />
        <p className="hint mt-1 text-end tabular">{t('q.words', { n: words })}</p>
      </div>
    );
  } else if (b.type === 'match') {
    const order = MATCH_ORDER(b); const cur = value || {};
    body = (
      <div>
        <p className="hint mb-2">{t('q.matchHint')}</p>
        <div className="grid gap-2">
          {b.pairs.map((p, i) => {
            const ok = showResults && cur[i] === i; const bad = showResults && cur[i] !== i;
            return (
              <div key={i} className={cx('grid sm:grid-cols-[1fr_1.4fr] gap-2 items-center rounded-xl ring-1 p-2.5', ok ? 'ring-emerald-300 bg-emerald-50' : bad ? 'ring-rose-300 bg-rose-50' : 'ring-slate-200 bg-white')}>
                <span id={`${name}_l${i}`} className="font-bold text-ags-navy px-1" dir={cdir}>{p.left}</span>
                <select className="input" dir={cdir} aria-labelledby={`${name}_l${i}`} disabled={readOnly} value={cur[i] ?? ''} onChange={(e) => onChange({ ...cur, [i]: e.target.value === '' ? undefined : Number(e.target.value) })}>
                  <option value="">{t('q.matchSelect')}</option>
                  {order.map((j) => <option key={j} value={j}>{b.pairs[j].right}</option>)}
                </select>
                {bad && <span className="sm:col-span-2 text-xs text-rose-800">{t('fb.correctAnswer')}: <span dir={cdir}>{p.right}</span></span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (b.type === 'file') {
    const files = Array.isArray(value) ? value : [];
    body = (
      <div>
        {files.length > 0 && (
          <ul className="grid gap-2 mb-3">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-xl ring-1 ring-slate-200 bg-white p-2.5">
                <span className="w-10 h-10 rounded-lg bg-ags-indigo-50 text-ags-indigo flex items-center justify-center overflow-hidden shrink-0">{f.src ? <img src={f.src} alt="" className="w-full h-full object-cover" /> : <FileText aria-hidden="true" className="w-5 h-5" />}</span>
                <span className="flex-1 min-w-0"><span className="block text-sm font-medium truncate" dir="auto">{f.name}</span><span className="block text-xs text-ags-slate tabular">{fmtSize(f.size || 0)}</span></span>
                {!readOnly && <button type="button" className="btn btn-ghost btn-icon" aria-label={`${t('q.file.remove')}: ${f.name}`} onClick={() => onChange(files.filter((x) => x.id !== f.id))}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>}
              </li>
            ))}
          </ul>
        )}
        {!readOnly && (
          <label className={cx('btn btn-secondary cursor-pointer', preview && 'pointer-events-none opacity-60')}>
            <Upload aria-hidden="true" className="w-4 h-4" />{t('q.file.add')}
            <input type="file" className="sr-only" multiple disabled={preview} onChange={async (e) => { const fl = [...e.target.files]; e.target.value = ''; const metas = await Promise.all(fl.map(readFileMeta)); onChange([...files, ...metas]); }} />
          </label>
        )}
        {!readOnly && <p className="hint mt-2">{t('q.file.hint')} · {t('q.file.demo')}</p>}
      </div>
    );
  } else if (b.type === 'paper') {
    const pages = Array.isArray(value) ? value : [];
    body = (
      <div className="rounded-2xl ring-1 ring-dashed ring-ags-indigo/30 bg-ags-indigo-50/40 p-4">
        {pages.length > 0 ? (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {pages.map((p, i) => (
                <figure key={p.id} className="relative shrink-0 w-24">
                  <img src={pageSrc(p)} alt={t('p.page', { n: i + 1 })} className="w-24 h-32 object-cover rounded-lg ring-1 ring-slate-200 bg-white" />
                  <figcaption className="absolute top-1 start-1 text-[0.65rem] font-bold bg-ags-navy text-white rounded px-1.5 tabular">{fmt.n(i + 1)}</figcaption>
                </figure>
              ))}
            </div>
            <p className="text-sm text-ags-navy mt-2 font-medium">{t('q.paper.pages', { n: pages.length })}</p>
            {!readOnly && <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={() => onOpenPaper(b.id)}><Images aria-hidden="true" className="w-4 h-4" />{t('q.paper.ctaEdit')}</button>}
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-white text-ags-indigo ring-1 ring-ags-indigo/20 inline-flex items-center justify-center"><Camera aria-hidden="true" className="w-6 h-6" /></span>
            <p className="flex-1 text-sm text-ags-slate min-w-[12rem]">{preview ? t('q.preview.paper') : t('q.paper.hint')}</p>
            {!readOnly && <button type="button" className={cx('btn btn-gold', big && 'btn-lg')} disabled={preview} onClick={() => onOpenPaper(b.id)}><Camera aria-hidden="true" className="w-5 h-5" />{t('q.paper.cta')}</button>}
          </div>
        )}
      </div>
    );
  }

  return (
    <fieldset id={`q-${b.id}`} className="card p-4 sm:p-5 scroll-mt-28">
      <legend className="sr-only">{t('q.number', { n: index + 1 })}</legend>
      <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
        <span className="font-bold text-ags-indigo">{t('q.number', { n: index + 1 })}</span>
        <span className="text-ags-slate">· {t(`q.${b.type}`)} · {t('pts', { n: b.points })}</span>
        {b.required && <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5">{t('q.required')}</span>}
        {correct === true && <span className="ms-auto inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-full px-2 py-0.5 font-medium"><Check aria-hidden="true" className="w-3.5 h-3.5" />{t('fb.correct')}</span>}
        {correct === false && <span className="ms-auto inline-flex items-center gap-1 text-rose-800 bg-rose-50 ring-1 ring-rose-200 rounded-full px-2 py-0.5 font-medium"><X aria-hidden="true" className="w-3.5 h-3.5" />{t('fb.incorrect')} · {fmt.score(scoreBlock(b, value), b.points)}</span>}
      </div>
      <p id={`${name}_p`} className={cx('font-medium text-ags-navy mb-3 leading-relaxed', big ? 'text-xl' : 'text-[1.02rem]')} dir={cdir}>{b.prompt}</p>
      {body}
    </fieldset>
  );
}

function AnswerSummary({ a, b, v }) {
  const { t, fmt } = useApp();
  const cdir = a.lang === 'ar' ? 'rtl' : 'ltr';
  if (!isAnswered(b, v)) return <span className="text-amber-800 inline-flex items-center gap-1.5"><AlertCircle aria-hidden="true" className="w-4 h-4" />{t('review.noAnswer')}</span>;
  if (b.type === 'mcq') return <span dir={cdir}>{b.options[v]}</span>;
  if (b.type === 'tf') return <span>{v ? t('q.true') : t('q.false')}</span>;
  if (b.type === 'checkbox') return <span dir={cdir}>{v.map((i) => b.options[i]).join(' · ')}</span>;
  if (b.type === 'match') return <span dir={cdir}>{b.pairs.map((p, i) => `${p.left} → ${b.pairs[v[i]]?.right ?? '—'}`).join(' · ')}</span>;
  if (b.type === 'file') return <span dir="auto">{v.map((f) => f.name).join(', ')}</span>;
  if (b.type === 'paper') {
    return (
      <span className="flex gap-2 flex-wrap">
        {v.map((p, i) => <img key={p.id} src={pageSrc(p)} alt={t('p.page', { n: i + 1 })} className="w-20 h-28 object-cover rounded-lg ring-1 ring-slate-200" />)}
        <span className="self-end text-xs text-ags-slate">{t('q.paper.pages', { n: v.length })}</span>
      </span>
    );
  }
  return <span className="whitespace-pre-wrap" dir="auto">{String(v).length > 280 ? `${String(v).slice(0, 280)}…` : v}</span>;
}

/* ---------- annotation canvas (shared by grading & feedback) ---------- */

const ANN_RED = '#C8102E';
const ANN_GREEN = '#0F7B4A';
function drawAnnotations(ctx, anns, w, h) {
  anns.forEach((an) => {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (an.type === 'pen') {
      ctx.strokeStyle = ANN_RED; ctx.lineWidth = Math.max(2, w * 0.0045);
      ctx.beginPath();
      an.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)));
      if (an.pts.length === 1) ctx.lineTo(an.pts[0][0] * w + 0.5, an.pts[0][1] * h + 0.5);
      ctx.stroke();
    } else if (an.type === 'tick') {
      const s = w * 0.055; const x = an.x * w; const y = an.y * h;
      ctx.strokeStyle = ANN_GREEN; ctx.lineWidth = Math.max(3, w * 0.008);
      ctx.beginPath(); ctx.moveTo(x - s * 0.5, y); ctx.lineTo(x - s * 0.12, y + s * 0.4); ctx.lineTo(x + s * 0.55, y - s * 0.45); ctx.stroke();
    } else if (an.type === 'cross') {
      const s = w * 0.04; const x = an.x * w; const y = an.y * h;
      ctx.strokeStyle = ANN_RED; ctx.lineWidth = Math.max(3, w * 0.007);
      ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke();
    } else if (an.type === 'text') {
      const fs = Math.max(13, w * 0.032);
      ctx.font = `700 ${fs}px 'Noto Kufi Arabic', 'Segoe UI', sans-serif`;
      const rtl = /[؀-ۿ]/.test(an.text);
      ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textAlign = rtl ? 'right' : 'left'; ctx.textBaseline = 'middle';
      ctx.lineWidth = Math.max(3, fs * 0.28); ctx.strokeStyle = 'rgba(255,255,255,.92)';
      ctx.strokeText(an.text, an.x * w, an.y * h); ctx.fillStyle = ANN_RED; ctx.fillText(an.text, an.x * w, an.y * h);
    }
    ctx.restore();
  });
}

function AnnotatedPage({ src, annotations = [], editable = false, tool = 'pen', onAdd, alt, className }) {
  const { t } = useApp();
  const imgRef = useRef(null); const canRef = useRef(null); const live = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [textAt, setTextAt] = useState(null); const [textVal, setTextVal] = useState('');
  useEffect(() => {
    const img = imgRef.current; if (!img) return undefined;
    const upd = () => setSize({ w: img.clientWidth, h: img.clientHeight });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    ro?.observe(img); upd();
    return () => ro?.disconnect();
  }, [src]);
  const redraw = useCallback(() => {
    const c = canRef.current; if (!c || !size.w) return;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(size.w * dpr)) { c.width = Math.round(size.w * dpr); c.height = Math.round(size.h * dpr); }
    const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size.w, size.h);
    drawAnnotations(ctx, live.current ? [...annotations, live.current] : annotations, size.w, size.h);
  }, [annotations, size]);
  useEffect(() => { redraw(); }, [redraw]);
  const pos = (e) => { const r = canRef.current.getBoundingClientRect(); return [clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1)]; };
  const down = (e) => {
    if (!editable) return;
    e.preventDefault();
    const [x, y] = pos(e);
    if (tool === 'pen') { live.current = { type: 'pen', pts: [[x, y]] }; canRef.current.setPointerCapture(e.pointerId); redraw(); }
    else if (tool === 'tick' || tool === 'cross') onAdd({ type: tool, x, y });
    else if (tool === 'text') { setTextAt({ x, y }); setTextVal(''); }
  };
  const move = (e) => { if (!live.current) return; live.current.pts.push(pos(e)); redraw(); };
  const up = () => { if (!live.current) return; const s = live.current; live.current = null; onAdd(s); };
  const commitText = () => { if (textAt && textVal.trim()) onAdd({ type: 'text', x: textAt.x, y: textAt.y, text: textVal.trim() }); setTextAt(null); setTextVal(''); };
  return (
    <div className={cx('relative select-none', className)}>
      <img ref={imgRef} src={src} alt={alt} className="w-full h-auto block rounded-lg ring-1 ring-slate-200 bg-white" draggable={false} onLoad={() => setSize({ w: imgRef.current.clientWidth, h: imgRef.current.clientHeight })} />
      <canvas ref={canRef} aria-hidden="true" className={cx('absolute inset-0 w-full h-full rounded-lg', editable ? 'touch-none' : 'pointer-events-none')}
        style={{ cursor: editable ? (tool === 'text' ? 'text' : 'crosshair') : 'default' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      {textAt && (
        <input autoFocus dir="auto" value={textVal} onChange={(e) => setTextVal(e.target.value)} placeholder={t('g.textPh')} aria-label={t('g.text')}
          onKeyDown={(e) => { if (e.key === 'Enter') commitText(); if (e.key === 'Escape') { setTextAt(null); setTextVal(''); } }} onBlur={commitText}
          className="absolute z-10 input !min-h-0 !py-1 !px-2 text-sm w-56 shadow-lg" style={{ left: `${Math.min(textAt.x * 100, 70)}%`, top: `${textAt.y * 100}%`, transform: 'translateY(-50%)' }} />
      )}
    </div>
  );
}

function FeedbackPanel({ a, sub, entry, isPrevious }) {
  const { t, fmt, lang, now } = useApp();
  const f = entry || sub;
  const auto = autoScore(a, f.answers || sub.answers);
  const pages = a.blocks.filter((b) => b.type === 'paper').flatMap((b) => (f.answers || sub.answers)[b.id] || []);
  const annPages = pages.filter((p) => (f.annotations || {})[p.id]?.length);
  return (
    <section aria-label={t('fb.title', { teacher: teacherName(a.teacherId, lang) })} className={cx('card p-5 sm:p-6 mb-5 border-t-4', isPrevious ? 'border-slate-300' : 'border-emerald-500')}>
      <div className="flex flex-wrap items-start gap-5">
        <div className="text-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 px-6 py-4">
          <p className="text-xs text-emerald-900 font-medium">{t('fb.mark')}</p>
          <p className="text-3xl font-bold text-emerald-900 tabular mt-1">{fmt.n(f.mark ?? 0)}<span className="text-lg text-emerald-800"> / {fmt.n(a.points)}</span></p>
        </div>
        <div className="flex-1 min-w-[14rem]">
          <h2 className="font-bold text-ags-navy text-lg">{isPrevious ? t('fb.previous') : t('fb.title', { teacher: teacherShort(a.teacherId, lang) })}</h2>
          {f.returnedAt && <p className="text-xs text-ags-slate">{t('fb.returnedOn', { when: agoLabel(t, f.returnedAt, now) })}</p>}
          {f.comment && (
            <blockquote className="mt-3 flex gap-3 rounded-xl bg-slate-50 p-3.5">
              <Avatar name={teacherName(a.teacherId, 'en')} size="sm" />
              <p className="text-ags-navy leading-relaxed" dir="auto">{f.comment}</p>
            </blockquote>
          )}
        </div>
      </div>
      {(a.rubric.length > 0 || auto.count > 0) && (
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {auto.count > 0 && (
            <div className="rounded-xl ring-1 ring-slate-200 p-3.5">
              <p className="text-sm font-bold text-ags-navy flex items-center gap-2"><ListChecks aria-hidden="true" className="w-4 h-4 text-ags-indigo" />{t('fb.auto')}</p>
              <p className="text-2xl font-bold tabular mt-1 text-ags-navy">{fmt.score(auto.score, auto.max)}</p>
            </div>
          )}
          {a.rubric.length > 0 && (
            <div className="rounded-xl ring-1 ring-slate-200 p-3.5">
              <p className="text-sm font-bold text-ags-navy flex items-center gap-2 mb-2"><ClipboardList aria-hidden="true" className="w-4 h-4 text-ags-indigo" />{t('fb.rubric')}</p>
              <ul className="space-y-2">
                {a.rubric.map((c) => {
                  const v = (f.rubricScores || {})[c.id] ?? 0;
                  return (
                    <li key={c.id}>
                      <div className="flex justify-between text-sm"><span>{c.key ? t(`rub.${c.key}`) : c.label}</span><span className="tabular font-medium">{fmt.score(v, c.max)}</span></div>
                      <ProgressBar value={v} max={c.max} tone="green" className="mt-1" label={c.key ? t(`rub.${c.key}`) : c.label} />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
      {annPages.length > 0 && !isPrevious && (
        <div className="mt-5">
          <p className="text-sm font-bold text-ags-navy mb-2 flex items-center gap-2"><PenLine aria-hidden="true" className="w-4 h-4 text-ags-indigo" />{t('fb.annotated')}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {annPages.map((p) => <AnnotatedPage key={p.id} src={pageSrc(p)} annotations={f.annotations[p.id]} alt={t('p.page', { n: pages.indexOf(p) + 1 })} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function AssignmentPage({ id }) {
  const { t, fmt, lang, stage, student, now, db, actions, navigate, guide, markGuide, toast } = useApp();
  const a = db.assignments[id];
  const sub = a ? db.submissions[subKey(a.id, student.id)] : null;
  const [answers, setAnswers] = useState(() => (sub?.answers ? { ...sub.answers } : {}));
  const [mode, setMode] = useState('answer');
  const [saving, setSaving] = useState(false);
  const [doneInfo, setDoneInfo] = useState(null);
  const timer = useRef(null); const latest = useRef(answers); latest.current = answers;

  const st = a ? studentState(a, sub, now) : null;
  const editable = !!a && (!sub || sub.status === 'draft') && canSubmit(a, now, sub);
  const viewOnlyClosed = !!a && (!sub || sub.status === 'draft') && !canSubmit(a, now, sub);

  useEffect(() => { // pick up changes made elsewhere (e.g. pages from the photo flow, resubmit)
    setAnswers(sub?.answers ? { ...sub.answers } : {});
  }, [sub?.status, sub?.resubmitting, id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (timer.current) { clearTimeout(timer.current); actions.saveDraft(id, student.id, latest.current); } }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (a && guide.aid === a.id && student.id === 's_omar' && (st === 'returned' || st === 'revision')) markGuide(4);
  }, [a, st, guide.aid, student.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!a || !isVisibleToStudent(a, student, now)) {
    return <div className="card"><EmptyState title={t('a.notFound')} action={<button type="button" className="btn btn-primary" onClick={() => navigate({ name: 'home' })}>{t('back.home')}</button>} /></div>;
  }

  const setAnswer = (bid, v) => {
    setAnswers((prev) => ({ ...prev, [bid]: v }));
    setSaving(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { timer.current = null; actions.saveDraft(a.id, student.id, latest.current); setSaving(false); }, 700);
  };
  const flush = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } actions.saveDraft(a.id, student.id, latest.current); setSaving(false); };
  const openPaper = (bid) => { flush(); navigate({ name: 'paper', id: a.id, blockId: bid }); };
  const required = a.blocks.filter((b) => b.required);
  const answered = a.blocks.filter((b) => isAnswered(b, answers[b.id])).length;
  const missingReq = required.filter((b) => !isAnswered(b, answers[b.id]));
  const late = now > a.dueAt;
  const showResults = ['returned', 'revision'].includes(sub?.status);
  const history = sub?.history || [];

  const doSubmit = () => {
    flush();
    const res = actions.submit(a.id, student.id, latest.current);
    setDoneInfo(res); setMode('done');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (mode === 'done' && doneInfo) {
    const early = stage === 'early';
    return (
      <div className="max-w-xl mx-auto text-center card p-8 sm:p-10 ags-fade-up">
        {settingsReduce() ? <CheckCircle2 aria-hidden="true" className="w-20 h-20 mx-auto text-emerald-600" /> : <SuccessCheck early={early} />}
        <h1 className={cx('font-bold text-ags-navy mt-5', early ? 'text-3xl' : 'text-2xl')} role="status">{early ? t('done.early') : doneInfo.late ? t('done.lateDays', { n: doneInfo.daysLate }) : t('done.onTime')}</h1>
        <p className="text-ags-slate mt-2">
          {stage === 'senior' ? t('done.senior', { date: fmt.date(doneInfo.at), time: fmt.time(doneInfo.at) }) : doneInfo.late ? t('done.lateHelp') : early ? '' : t('done.sub', { title: a.title })}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button type="button" className={cx('btn btn-primary', early && 'btn-lg')} onClick={() => navigate({ name: 'home' })}><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('back.home')}</button>
          <button type="button" className="btn btn-secondary" onClick={() => setMode('answer')}>{t('done.view')}</button>
        </div>
      </div>
    );
  }

  if (mode === 'review') {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader title={t('review.title')} subtitle={a.title} onBack={() => setMode('answer')} backLabel={t('review.edit')} />
        {late && <div className="mb-4 rounded-xl bg-amber-50 ring-1 ring-amber-200 p-3.5 text-sm text-amber-900 flex gap-2"><Clock aria-hidden="true" className="w-5 h-5 shrink-0" />{t('review.lateNote')}</div>}
        <ol className="card divide-y divide-slate-100">
          {a.blocks.map((b, i) => (
            <li key={b.id} className="p-4 sm:p-5">
              <p className="text-xs text-ags-indigo font-bold">{t('q.number', { n: i + 1 })} · {t(`q.${b.type}`)}</p>
              <p className="font-medium text-ags-navy mt-1 mb-2" dir={a.lang === 'ar' ? 'rtl' : 'ltr'}>{b.prompt}</p>
              <div className="text-sm text-ags-navy/90"><AnswerSummary a={a} b={b} v={answers[b.id]} /></div>
              {b.required && !isAnswered(b, answers[b.id]) && (
                <button type="button" className="btn btn-ghost btn-sm mt-2 !min-h-[2rem]" onClick={() => { setMode('answer'); setTimeout(() => document.getElementById(`q-${b.id}`)?.scrollIntoView({ behavior: 'smooth' }), 350); }}>{t('review.goto')}</button>
              )}
            </li>
          ))}
        </ol>
        {sub?.note && <p className="mt-4 text-sm"><span className="font-medium">{t('p.note')}:</span> <span dir="auto">{sub.note}</span></p>}
        <div className="mt-6 flex flex-wrap items-center gap-3 justify-end">
          {missingReq.length > 0 && <p className="text-sm text-amber-900 me-auto flex items-center gap-1.5"><AlertCircle aria-hidden="true" className="w-4 h-4" />{t('review.missing', { n: missingReq.length })}</p>}
          <button type="button" className="btn btn-secondary" onClick={() => setMode('answer')}>{t('review.edit')}</button>
          <button type="button" className="btn btn-primary btn-lg" disabled={missingReq.length > 0} onClick={doSubmit}><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('review.confirm')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('max-w-4xl mx-auto', stage === 'early' && 'stage-early')}>
      <button type="button" onClick={() => { flush(); navigate({ name: 'home' }); }} className="btn btn-ghost btn-sm -ms-2 mb-3"><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('back.home')}</button>
      <AssignmentHeader a={a} st={st} />

      {sub?.status === 'revision' && (
        <div className="mb-5 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-4 flex flex-wrap items-center gap-3">
          <RotateCcw aria-hidden="true" className="w-5 h-5 text-emerald-700" />
          <p className="flex-1 text-emerald-950 min-w-[12rem]">{t('fb.revision')}</p>
          <button type="button" className="btn btn-primary" onClick={() => { actions.startResubmit(a.id, student.id); toast(t('resubmit.started'), { kind: 'info' }); }}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('resubmit')}</button>
        </div>
      )}
      {showResults && <FeedbackPanel a={a} sub={sub} />}
      {sub?.resubmitting && history.length > 0 && <FeedbackPanel a={a} sub={sub} entry={history[history.length - 1]} isPrevious />}

      {['submitted', 'graded'].includes(sub?.status) && (
        <div className="mb-5 rounded-2xl bg-ags-indigo-50 ring-1 ring-indigo-200 p-4 flex items-center gap-3">
          <Send aria-hidden="true" className="w-5 h-5 text-ags-indigo flip-rtl" />
          <p className="text-ags-navy">{t('fb.awaiting', { when: `${fmt.date(sub.submittedAt)} · ${fmt.time(sub.submittedAt)}` })}{sub.late ? ` · ${t('late.days', { n: lateDays(a.dueAt, sub.submittedAt) })}` : ''}</p>
        </div>
      )}
      {st === 'overdue' && editable && <div className="mb-5 rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-4 flex gap-3 text-amber-950"><AlarmClock aria-hidden="true" className="w-5 h-5 shrink-0 text-amber-700" /><p>{a.latePolicy?.mode === 'until' ? t('overdue.until', { date: `${fmt.date(a.latePolicy.until)} · ${fmt.time(a.latePolicy.until)}` }) : t('overdue.any')}</p></div>}
      {viewOnlyClosed && <div className="mb-5 rounded-2xl bg-rose-50 ring-1 ring-rose-200 p-4 flex gap-3 text-rose-950"><Info aria-hidden="true" className="w-5 h-5 shrink-0" /><p>{t('overdue.closed')}</p></div>}

      <section className="card p-5 sm:p-6 mb-5">
        <h2 className="font-bold text-ags-navy mb-2">{t('a.instructions')}</h2>
        <p className="text-ags-navy/90 leading-relaxed whitespace-pre-wrap" dir={a.lang === 'ar' ? 'rtl' : 'auto'}>{a.instructions || '—'}</p>
        <AttachmentList a={a} attachments={a.attachments} />
      </section>

      {editable && (
        <div className="sticky top-16 z-20 -mx-3 sm:mx-0 mb-4 bg-ags-bg/95 backdrop-blur px-3 sm:px-0 py-2">
          <div className="card px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="text-sm font-medium text-ags-navy tabular">{t('a.progress', { done: answered, total: a.blocks.length })}</span>
            <ProgressBar value={answered} max={a.blocks.length} className="flex-1 min-w-[6rem]" label={t('a.progress', { done: answered, total: a.blocks.length })} />
            <span className="text-xs text-ags-slate inline-flex items-center gap-1.5" aria-live="polite">
              {saving ? <><Loader2 aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />{t('a.saving')}</>
                : sub?.draftSavedAt ? <><CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600" />{t('a.saved', { when: agoLabel(t, sub.draftSavedAt, now) })}</> : t('a.autosave')}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {a.blocks.map((b, i) => (
          <QuestionCard key={b.id} a={a} b={b} index={i} value={answers[b.id]} onChange={(v) => setAnswer(b.id, v)} readOnly={!editable} showResults={showResults} onOpenPaper={openPaper} />
        ))}
      </div>

      {editable && (
        <div className="mt-6 flex flex-wrap gap-2 justify-end">
          <button type="button" className="btn btn-secondary" onClick={() => { flush(); toast(t('a.draftToast'), { kind: 'success' }); }}><PencilLine aria-hidden="true" className="w-4 h-4" />{t('saveDraft')}</button>
          <button type="button" className={cx('btn btn-primary', stage === 'early' && 'btn-lg')} onClick={() => { flush(); setMode('review'); window.scrollTo({ top: 0 }); }}>
            <Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{sub?.resubmitting ? t('resubmit') : t('submit')}
          </button>
        </div>
      )}
    </div>
  );
}
const settingsReduce = () => typeof document !== 'undefined' && document.querySelector('.ags-root.reduce-motion') != null;

/* ---------- paper homework flow (photo submission) ---------- */

function loadImage(src) {
  return new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
}
async function downscaleImage(src, max = 1600) {
  const img = await loadImage(src);
  const w0 = img.naturalWidth || img.width; const h0 = img.naturalHeight || img.height;
  const k = Math.min(1, max / Math.max(w0, h0));
  const c = document.createElement('canvas'); c.width = Math.round(w0 * k); c.height = Math.round(h0 * k);
  const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
  return { src: c.toDataURL('image/jpeg', 0.86), w: c.width, h: c.height };
}
async function rotateImage(src) {
  const img = await loadImage(src);
  const w = img.naturalWidth || img.width; const h = img.naturalHeight || img.height;
  const c = document.createElement('canvas'); c.width = h; c.height = w;
  const ctx = c.getContext('2d'); ctx.translate(h, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(img, 0, 0, w, h);
  return c.toDataURL('image/jpeg', 0.9);
}
async function cropImage(src, r) {
  const img = await loadImage(src);
  const w = img.naturalWidth || img.width; const h = img.naturalHeight || img.height;
  const sx = Math.round(r.x * w); const sy = Math.round(r.y * h); const sw = Math.max(8, Math.round(r.w * w)); const sh = Math.max(8, Math.round(r.h * h));
  const c = document.createElement('canvas'); c.width = sw; c.height = sh;
  c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return c.toDataURL('image/jpeg', 0.9);
}

function CropOverlay({ rect, setRect }) {
  const { t } = useApp();
  const box = useRef(null); const drag = useRef(null);
  const start = (mode) => (e) => { e.preventDefault(); e.stopPropagation(); drag.current = { mode, x: e.clientX, y: e.clientY, r: { ...rect } }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => {
    const d = drag.current; if (!d) return;
    const b = box.current.getBoundingClientRect();
    const dx = (e.clientX - d.x) / b.width; const dy = (e.clientY - d.y) / b.height; const m = 0.1;
    let { x, y, w, h } = d.r;
    if (d.mode === 'move') { x = clamp(x + dx, 0, 1 - w); y = clamp(y + dy, 0, 1 - h); }
    if (d.mode.includes('l')) { const nx = clamp(x + dx, 0, x + w - m); w += x - nx; x = nx; }
    if (d.mode.includes('r')) w = clamp(w + dx, m, 1 - x);
    if (d.mode.includes('t')) { const ny = clamp(y + dy, 0, y + h - m); h += y - ny; y = ny; }
    if (d.mode.includes('b')) h = clamp(h + dy, m, 1 - y);
    setRect({ x, y, w, h });
  };
  const end = () => { drag.current = null; };
  const nudge = (mode) => (e) => { // keyboard support for the corner handles
    const k = { ArrowLeft: [-0.02, 0], ArrowRight: [0.02, 0], ArrowUp: [0, -0.02], ArrowDown: [0, 0.02] }[e.key]; if (!k) return;
    e.preventDefault(); let { x, y, w, h } = rect; const [dx, dy] = k;
    if (mode.includes('l')) { const nx = clamp(x + dx, 0, x + w - 0.1); w += x - nx; x = nx; } else { w = clamp(w + dx, 0.1, 1 - x); }
    if (mode.includes('t')) { const ny = clamp(y + dy, 0, y + h - 0.1); h += y - ny; y = ny; } else { h = clamp(h + dy, 0.1, 1 - y); }
    setRect({ x, y, w, h });
  };
  const pct = (v) => `${v * 100}%`;
  return (
    <div ref={box} className="absolute inset-0 touch-none" onPointerMove={move} onPointerUp={end} onPointerCancel={end} dir="ltr">
      <div className="absolute inset-0 bg-black/45" style={{ clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 ${pct(rect.y)},${pct(rect.x)} ${pct(rect.y)},${pct(rect.x)} ${pct(rect.y + rect.h)},${pct(rect.x + rect.w)} ${pct(rect.y + rect.h)},${pct(rect.x + rect.w)} ${pct(rect.y)},0 ${pct(rect.y)})` }} />
      <div className="absolute ring-2 ring-ags-gold cursor-move" style={{ left: pct(rect.x), top: pct(rect.y), width: pct(rect.w), height: pct(rect.h) }} onPointerDown={start('move')}>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="border border-white/30" />)}</div>
        {['tl', 'tr', 'bl', 'br'].map((c) => (
          <button key={c} type="button" aria-label={`${t('p.cropHandle')} (${c})`} onPointerDown={start(c)} onKeyDown={nudge(c)}
            className="absolute w-7 h-7 -m-3.5 rounded-full bg-ags-gold ring-2 ring-white shadow touch-none"
            style={{ left: c.includes('l') ? 0 : '100%', top: c.includes('t') ? 0 : '100%', cursor: c === 'tl' || c === 'br' ? 'nwse-resize' : 'nesw-resize' }} />
        ))}
      </div>
    </div>
  );
}

function PaperUpload({ id, blockId }) {
  const { t, fmt, lang, stage, student, now, db, actions, navigate, toast } = useApp();
  const a = db.assignments[id];
  const sub = a ? db.submissions[subKey(a.id, student.id)] : null;
  const block = a?.blocks.find((b) => b.id === blockId) || a?.blocks.find((b) => b.type === 'paper');
  const pages = (block && sub?.answers?.[block.id]) || [];
  const [sel, setSel] = useState(0);
  const [step, setStep] = useState(pages.length ? 'edit' : 'add');
  const [showSamples, setShowSamples] = useState(false);
  const [busy, setBusy] = useState(false);
  const [crop, setCrop] = useState(null);
  const [note, setNote] = useState(sub?.note || '');
  const [doneInfo, setDoneInfo] = useState(null);
  const camRef = useRef(null); const galRef = useRef(null);
  const noteTimer = useRef(null);

  if (!a || !block) return <div className="card"><EmptyState title={t('a.notFound')} /></div>;
  const editable = (!sub || sub.status === 'draft') && canSubmit(a, now, sub);
  const paperOnly = a.blocks.every((b) => b.type === 'paper');
  const setPages = (next) => actions.setPages(a.id, student.id, block.id, next);
  const cur = pages[clamp(sel, 0, Math.max(0, pages.length - 1))];

  const addPages = (list) => { if (!list.length) return; const next = [...pages, ...list]; setPages(next); setSel(next.length - 1); setStep('edit'); setShowSamples(false); };
  const onFiles = async (e) => {
    const files = [...(e.target.files || [])]; e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    const out = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) { toast(t('p.err.type'), { kind: 'warn' }); continue; }
      const url = URL.createObjectURL(f);
      try { const r = await downscaleImage(url, 1600); out.push({ id: uid('pg'), src: r.src, name: f.name }); }
      catch { toast(t('p.err.load'), { kind: 'warn' }); }
      finally { URL.revokeObjectURL(url); }
    }
    setBusy(false); addPages(out);
  };
  const useSample = (kind) => addPages([{ id: uid('pg'), sample: kind, name: studentFirst(student, kind === 'letters' ? 'ar' : 'en') }]);
  const update = (i, patch) => setPages(pages.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const rotate = async () => {
    if (!cur) return; setBusy(true);
    try { update(sel, { src: await rotateImage(pageSrc(cur)) }); } catch { toast(t('p.err.load'), { kind: 'warn' }); }
    setBusy(false);
  };
  const applyCrop = async () => {
    if (!cur || !crop) return; setBusy(true);
    try { update(sel, { src: await cropImage(pageSrc(cur), crop) }); toast(t('p.cropped'), { kind: 'success' }); } catch { toast(t('p.err.load'), { kind: 'warn' }); }
    setBusy(false); setCrop(null);
  };
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= pages.length) return; const next = [...pages]; [next[i], next[j]] = [next[j], next[i]]; setPages(next); setSel(j); };
  const remove = (i) => {
    const removed = pages[i]; const before = pages;
    const next = pages.filter((_, j) => j !== i); setPages(next); setSel(clamp(i - 1, 0, Math.max(0, next.length - 1)));
    if (!next.length) setStep('add');
    toast(t('p.deleted'), { kind: 'info', action: { label: t('undo'), onClick: () => { setPages(before); setStep('edit'); } } });
    return removed;
  };
  const changeNote = (v) => { setNote(v); if (noteTimer.current) clearTimeout(noteTimer.current); noteTimer.current = setTimeout(() => actions.saveNote(a.id, student.id, v), 500); };
  const back = () => { if (noteTimer.current) { clearTimeout(noteTimer.current); actions.saveNote(a.id, student.id, note); } navigate({ name: 'assignment', id: a.id }); };
  const submit = () => {
    if (noteTimer.current) { clearTimeout(noteTimer.current); }
    actions.saveNote(a.id, student.id, note);
    const res = actions.submit(a.id, student.id, { ...(sub?.answers || {}), [block.id]: pages });
    setDoneInfo(res); setStep('done'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [['add', 'p.step1'], ['edit', 'p.step2'], ['preview', 'p.step3']];
  const stepIdx = step === 'done' ? 3 : steps.findIndex(([k]) => k === step);

  if (step === 'done' && doneInfo) {
    const early = stage === 'early';
    return (
      <div className="max-w-xl mx-auto text-center card p-8 sm:p-10 ags-fade-up">
        {settingsReduce() ? <CheckCircle2 aria-hidden="true" className="w-20 h-20 mx-auto text-emerald-600" /> : <SuccessCheck early={early} />}
        <h1 className={cx('font-bold text-ags-navy mt-5', early ? 'text-3xl' : 'text-2xl')} role="status">{early ? t('done.early') : doneInfo.late ? t('done.lateDays', { n: doneInfo.daysLate }) : t('done.onTime')}</h1>
        <p className="text-ags-slate mt-2">{doneInfo.late ? t('done.lateHelp') : t('done.pages', { n: pages.length })}</p>
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {pages.slice(0, 4).map((p, i) => <img key={p.id} src={pageSrc(p)} alt={t('p.page', { n: i + 1 })} className="w-16 h-20 object-cover rounded-lg ring-1 ring-slate-200" />)}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button type="button" className={cx('btn btn-primary', early && 'btn-lg')} onClick={() => navigate({ name: 'home' })}><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('back.home')}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate({ name: 'assignment', id: a.id })}>{t('done.view')}</button>
        </div>
      </div>
    );
  }

  if (!editable) {
    return <div className="card"><EmptyState title={t('p.locked')} action={<button type="button" className="btn btn-primary" onClick={back}>{t('back')}</button>} /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button type="button" onClick={back} className="btn btn-ghost btn-sm -ms-2 mb-3"><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('p.backTo')}</button>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <SubjectTag code={a.subject} />
          <h1 className="text-2xl sm:text-3xl font-bold text-ags-navy mt-1">{t('p.title')}</h1>
          <p className="text-ags-slate mt-0.5" dir="auto">{a.title} · {dueLabel(t, fmt, a.dueAt, now)}</p>
        </div>
        <ol className="flex items-center gap-2 text-sm" aria-label={t('p.title')}>
          {steps.map(([k, label], i) => (
            <li key={k} className="flex items-center gap-2" aria-current={i === stepIdx ? 'step' : undefined}>
              <span className={cx('w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold', i < stepIdx ? 'bg-emerald-600 text-white' : i === stepIdx ? 'bg-ags-indigo text-white' : 'bg-slate-200 text-slate-600')}>{i < stepIdx ? <Check aria-hidden="true" className="w-4 h-4" /> : fmt.n(i + 1)}</span>
              <span className={cx('hidden sm:inline', i === stepIdx ? 'font-bold text-ags-navy' : 'text-ags-slate')}>{t(label)}</span>
              {i < steps.length - 1 && <span aria-hidden="true" className="w-6 h-px bg-slate-300" />}
            </li>
          ))}
        </ol>
      </div>

      <input ref={camRef} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFiles} />
      <input ref={galRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFiles} />

      {(step === 'add' || showSamples) && (
        <section className="card p-5 sm:p-6 mb-5" aria-labelledby="add-h">
          <h2 id="add-h" className="font-bold text-ags-navy text-lg mb-4">{pages.length ? t('p.add') : t('p.step1')}</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <button type="button" onClick={() => camRef.current?.click()} className="rounded-2xl ring-1 ring-slate-200 hover:ring-ags-indigo hover:bg-ags-indigo-50/50 p-5 text-start transition flex sm:flex-col gap-4 items-start">
              <span className="w-12 h-12 rounded-2xl bg-ags-gold text-ags-navy inline-flex items-center justify-center shrink-0"><Camera aria-hidden="true" className="w-6 h-6" /></span>
              <span><span className="block font-bold text-ags-navy">{t('p.take')}</span><span className="block text-sm text-ags-slate mt-0.5">{t('p.take.hint')}</span></span>
            </button>
            <button type="button" onClick={() => galRef.current?.click()} className="rounded-2xl ring-1 ring-slate-200 hover:ring-ags-indigo hover:bg-ags-indigo-50/50 p-5 text-start transition flex sm:flex-col gap-4 items-start">
              <span className="w-12 h-12 rounded-2xl bg-ags-indigo text-white inline-flex items-center justify-center shrink-0"><Upload aria-hidden="true" className="w-6 h-6" /></span>
              <span><span className="block font-bold text-ags-navy">{t('p.upload')}</span><span className="block text-sm text-ags-slate mt-0.5">{t('p.upload.hint')}</span></span>
            </button>
            <button type="button" onClick={() => setShowSamples((v) => !v || !pages.length)} aria-expanded={showSamples} className={cx('rounded-2xl ring-1 p-5 text-start transition flex sm:flex-col gap-4 items-start', showSamples ? 'ring-ags-indigo bg-ags-indigo-50/60' : 'ring-slate-200 hover:ring-ags-indigo hover:bg-ags-indigo-50/50')}>
              <span className="w-12 h-12 rounded-2xl bg-ags-indigo-100 text-ags-indigo inline-flex items-center justify-center shrink-0"><ImageIcon aria-hidden="true" className="w-6 h-6" /></span>
              <span><span className="block font-bold text-ags-navy">{t('p.sample')}</span><span className="block text-sm text-ags-slate mt-0.5">{t('p.sample.hint')}</span></span>
            </button>
          </div>
          {showSamples && (
            <div className="mt-5 ags-fade-up">
              <p className="label">{t('p.sample.pick')}</p>
              <div className="grid grid-cols-3 gap-3 max-w-xl">
                {SAMPLE_SETS[stage].map((k) => (
                  <button key={k} type="button" onClick={() => useSample(k)} className="group rounded-xl ring-1 ring-slate-200 hover:ring-2 hover:ring-ags-indigo overflow-hidden bg-white text-start">
                    <img src={sampleUri(k, studentFirst(student, k === 'letters' ? 'ar' : 'en'))} alt="" className="w-full aspect-[3/4] object-cover" />
                    <span className="block text-xs font-medium p-2 text-ags-navy">{t(SAMPLE_LABEL[k])}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {busy && <p className="mt-4 text-sm text-ags-slate inline-flex items-center gap-2" role="status"><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />{t('p.processing')}</p>}
          {!pages.length && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-ags-navy mb-1.5">{t('p.tips')}</p>
              <ul className="text-sm text-ags-slate space-y-1">{['p.tip1', 'p.tip2', 'p.tip3'].map((k) => <li key={k} className="flex gap-2"><Check aria-hidden="true" className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{t(k)}</li>)}</ul>
            </div>
          )}
          {pages.length > 0 && <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => { setShowSamples(false); setStep('edit'); }}>{t('cancel')}</button>}
        </section>
      )}

      {step === 'edit' && pages.length > 0 && !showSamples && (
        <div className="grid md:grid-cols-[1fr_13rem] gap-5">
          <section className="card p-4 sm:p-5 min-w-0" aria-label={t('p.page', { n: sel + 1 })}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h2 className="font-bold text-ags-navy me-auto">{t('p.pageOf', { n: sel + 1, total: pages.length })}</h2>
              {!crop ? (
                <>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={rotate} disabled={busy}><RotateCw aria-hidden="true" className="w-4 h-4" />{t('p.rotate')}</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCrop({ x: 0.06, y: 0.05, w: 0.88, h: 0.9 })} disabled={busy}><Crop aria-hidden="true" className="w-4 h-4" />{t('p.crop')}</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(sel)} disabled={busy}><Trash2 aria-hidden="true" className="w-4 h-4" />{t('p.delete')}</button>
                </>
              ) : (
                <>
                  {[['p.cropTrim', { x: 0.06, y: 0.05, w: 0.88, h: 0.9 }], ['p.cropTop', { x: 0, y: 0, w: 1, h: 0.55 }], ['p.cropBottom', { x: 0, y: 0.45, w: 1, h: 0.55 }], ['p.cropReset', { x: 0, y: 0, w: 1, h: 1 }]].map(([k, r]) => (
                    <button key={k} type="button" className="btn btn-ghost btn-sm" onClick={() => setCrop(r)}>{t(k)}</button>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCrop(null)}>{t('cancel')}</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={applyCrop} disabled={busy}><Check aria-hidden="true" className="w-4 h-4" />{t('p.cropApply')}</button>
                </>
              )}
            </div>
            {crop && <p className="hint mb-2">{t('p.cropHint')}</p>}
            <div className="relative mx-auto max-w-md">
              <img src={pageSrc(cur)} alt={t('p.page', { n: sel + 1 })} className="w-full h-auto rounded-lg ring-1 ring-slate-200 bg-white block select-none" draggable={false} />
              {crop && <CropOverlay rect={crop} setRect={setCrop} />}
              {busy && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg" role="status"><Loader2 aria-hidden="true" className="w-8 h-8 animate-spin text-ags-indigo" /><span className="sr-only">{t('p.processing')}</span></div>}
            </div>
          </section>

          <aside className="min-w-0" aria-label={t('p.pages')}>
            <h2 className="text-sm font-bold text-ags-navy mb-2">{t('p.pages')} <span className="text-ags-slate font-normal tabular">({fmt.n(pages.length)})</span></h2>
            <ol className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2">
              {pages.map((p, i) => (
                <li key={p.id} className={cx('shrink-0 w-36 md:w-auto rounded-xl p-2 ring-1 transition', i === sel ? 'ring-2 ring-ags-indigo bg-ags-indigo-50/60' : 'ring-slate-200 bg-white')}>
                  <button type="button" onClick={() => { setSel(i); setCrop(null); }} className="block w-full relative" aria-label={t('p.page', { n: i + 1 })} aria-current={i === sel}>
                    <img src={pageSrc(p)} alt="" className="w-full h-28 md:h-32 object-cover rounded-lg bg-white" />
                    <span className="absolute top-1.5 start-1.5 text-xs font-bold bg-ags-navy text-white rounded-md px-1.5 py-0.5 tabular">{fmt.n(i + 1)}</span>
                  </button>
                  <div className="flex justify-center gap-1 mt-1.5">
                    <button type="button" className="btn btn-ghost btn-icon !min-h-[2.1rem] !min-w-[2.1rem]" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${t('p.moveUp')} — ${t('p.page', { n: i + 1 })}`}><ArrowUp aria-hidden="true" className="w-4 h-4" /></button>
                    <button type="button" className="btn btn-ghost btn-icon !min-h-[2.1rem] !min-w-[2.1rem]" disabled={i === pages.length - 1} onClick={() => move(i, 1)} aria-label={`${t('p.moveDown')} — ${t('p.page', { n: i + 1 })}`}><ArrowDown aria-hidden="true" className="w-4 h-4" /></button>
                    <button type="button" className="btn btn-ghost btn-icon !min-h-[2.1rem] !min-w-[2.1rem] text-rose-700" onClick={() => remove(i)} aria-label={`${t('p.delete')} — ${t('p.page', { n: i + 1 })}`}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>
                  </div>
                </li>
              ))}
              <li className="shrink-0 w-36 md:w-auto">
                <button type="button" onClick={() => setShowSamples(true)} className="w-full h-full min-h-[8rem] rounded-xl ring-1 ring-dashed ring-ags-indigo/40 text-ags-indigo hover:bg-ags-indigo-50 flex flex-col items-center justify-center gap-1.5 p-3 text-sm font-medium">
                  <Plus aria-hidden="true" className="w-6 h-6" />{t('p.add')}
                </button>
              </li>
            </ol>
          </aside>

          <section className="md:col-span-2 card p-5">
            <label htmlFor="pnote" className="label">{t('p.note')}</label>
            <textarea id="pnote" className="input min-h-[5rem]" dir="auto" value={note} onChange={(e) => changeNote(e.target.value)} placeholder={t('p.notePh')} />
            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              {paperOnly ? (
                <button type="button" className={cx('btn btn-primary', stage === 'early' && 'btn-lg')} onClick={() => { setStep('preview'); window.scrollTo({ top: 0 }); }}><Eye aria-hidden="true" className="w-4 h-4" />{t('p.previewSubmit')}</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={back}><Check aria-hidden="true" className="w-4 h-4" />{t('p.attach')}</button>
              )}
            </div>
          </section>
        </div>
      )}

      {step === 'preview' && (
        <section className="card p-5 sm:p-6" aria-labelledby="pv-h">
          <h2 id="pv-h" className="font-bold text-ags-navy text-lg">{t('p.reviewTitle')}</h2>
          <p className="text-ags-slate text-sm mt-1">{t('q.paper.pages', { n: pages.length })}</p>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((p, i) => (
              <figure key={p.id}>
                <img src={pageSrc(p)} alt={t('p.page', { n: i + 1 })} className="w-full rounded-lg ring-1 ring-slate-200 bg-white" />
                <figcaption className="text-xs text-ags-slate mt-1 text-center">{t('p.page', { n: i + 1 })}</figcaption>
              </figure>
            ))}
          </div>
          {note && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm"><span className="font-medium">{t('p.note')}:</span> <span dir="auto">{note}</span></p>}
          {now > a.dueAt && <p className="mt-4 rounded-xl bg-amber-50 ring-1 ring-amber-200 p-3 text-sm text-amber-900 flex gap-2"><Clock aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t('review.lateNote')}</p>}
          <div className="mt-6 flex flex-wrap gap-2 justify-end">
            <button type="button" className="btn btn-secondary" onClick={() => setStep('edit')}><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('p.backEdit')}</button>
            <button type="button" className="btn btn-primary btn-lg" onClick={submit}><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{sub?.resubmitting ? t('resubmit') : t('submit')}</button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ============================================================================
 * 11. TEACHER VIEWS — Ms. Sarah Hassan, Mathematics 8A / 8B / 8C
 * ========================================================================== */

/** Exactly what a student sees (used by the builder preview and list preview). */
function StudentPreview({ a }) {
  const { t } = useApp();
  const [answers, setAnswers] = useState({});
  return (
    <div>
      <div className="mb-4 rounded-xl bg-ags-gold-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-ags-navy flex gap-2"><Eye aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t('b.previewBanner')}</div>
      <AssignmentHeader a={a} st="notStarted" />
      <section className="card p-5 sm:p-6 mb-5">
        <h2 className="font-bold text-ags-navy mb-2">{t('a.instructions')}</h2>
        <p className="text-ags-navy/90 leading-relaxed whitespace-pre-wrap" dir="auto">{a.instructions || '—'}</p>
        <AttachmentList a={a} attachments={a.attachments} />
      </section>
      <div className="space-y-4">
        {a.blocks.map((b, i) => <QuestionCard key={b.id} a={a} b={b} index={i} value={answers[b.id]} onChange={(v) => setAnswers((p) => ({ ...p, [b.id]: v }))} preview onOpenPaper={() => {}} />)}
        {!a.blocks.length && <div className="card"><EmptyState title={t('b.empty')} /></div>}
      </div>
    </div>
  );
}

function ClassChips({ value, onChange, options = SARAH_CLASSES, error, labelId }) {
  const { lang } = useApp();
  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
      {options.map((c) => {
        const on = value.includes(c);
        return (
          <button key={c} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== c) : [...value, c].sort())}
            className={cx('inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ring-1 min-h-[2.4rem] transition-colors', on ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-300 hover:ring-ags-indigo', error && !on && 'ring-rose-400')}>
            {on ? <Check aria-hidden="true" className="w-4 h-4" /> : <Plus aria-hidden="true" className="w-4 h-4" />}{clsLabel(c, lang, true)}
          </button>
        );
      })}
    </div>
  );
}

function HoverTip({ tip, children, className, label }) {
  const [on, setOn] = useState(false);
  return (
    <div className={cx('relative', className)} tabIndex={0} aria-label={label} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)}>
      {children}
      {on && tip && <div role="tooltip" className="absolute z-30 bottom-full mb-2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap rounded-lg bg-ags-navy text-white text-xs px-2.5 py-1.5 shadow-lg pointer-events-none">{tip}</div>}
    </div>
  );
}

function TeacherDashboard() {
  const { t, fmt, lang, now, db, navigate } = useApp();
  const list = teacherAssignments(db).filter((a) => isPublished(a, now));
  const rows = list.flatMap((a) => a.classes.map((cls) => ({ a, cls, s: classStats(db, a, cls, now) })));
  const active = list.filter((a) => a.dueAt > now).length;
  const toGrade = sum(rows.map((r) => r.s.toGrade));
  const recent = rows.filter((r) => now - r.a.dueAt < 42 * DAY);
  const missing = sum(recent.map((r) => r.s.missing));
  const completion = sum(recent.map((r) => r.s.handedIn)) / Math.max(1, sum(recent.map((r) => r.s.total)));
  const attention = [
    ...rows.filter((r) => r.s.toGrade > 0).map((r) => ({ key: `g${r.a.id}${r.cls}`, icon: Inbox, tone: 'indigo', text: t('td.att.waiting', { n: r.s.toGrade, cls: clsLabel(r.cls, lang), title: r.a.title }), go: { name: 'submissions', id: r.a.id, cls: r.cls, filter: 'toGrade' }, w: 3 + r.s.toGrade })),
    ...rows.filter((r) => r.s.graded > 0).map((r) => ({ key: `r${r.a.id}${r.cls}`, icon: BadgeCheck, tone: 'green', text: t('td.att.graded', { n: r.s.graded, cls: clsLabel(r.cls, lang), title: r.a.title }), go: { name: 'submissions', id: r.a.id, cls: r.cls, filter: 'graded' }, w: 2 })),
    ...rows.filter((r) => r.s.missing > 0 && now - r.a.dueAt < 21 * DAY).map((r) => ({ key: `m${r.a.id}${r.cls}`, icon: AlertCircle, tone: 'red', text: t('td.att.missing', { n: r.s.missing, cls: clsLabel(r.cls, lang), title: r.a.title }), go: { name: 'submissions', id: r.a.id, cls: r.cls, filter: 'missing' }, w: 1 })),
  ].sort((x, y) => y.w - x.w);
  const upcoming = rows.filter((r) => r.a.dueAt > now).sort((x, y) => x.a.dueAt - y.a.dueAt);
  const scheduled = teacherAssignments(db).filter((a) => !isPublished(a, now));
  const tones = { indigo: 'bg-ags-indigo-50 text-ags-indigo', green: 'bg-emerald-50 text-emerald-700', red: 'bg-rose-50 text-rose-700' };
  return (
    <div>
      <PageHeader title={t('td.greeting', { name: teacherShort('sarah', lang) })} subtitle={`${subjName('math', lang)} · ${clsList(SARAH_CLASSES, lang)} · ${fmt.dateLong(now)}`}
        actions={<>
          <button type="button" className="btn btn-gold" onClick={() => navigate({ name: 'create' })}><PlusCircle aria-hidden="true" className="w-4 h-4" />{t('td.new')}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate({ name: 'insights' })}><BarChart3 aria-hidden="true" className="w-4 h-4" />{t('nav.insights')}</button>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        <StatCard icon={ClipboardList} value={fmt.n(active)} label={t('td.active')} onClick={() => navigate({ name: 'assignments' })} />
        <StatCard icon={Inbox} tone="gold" value={fmt.n(toGrade)} label={t('td.toGrade')} onClick={() => navigate({ name: 'grading' })} />
        <StatCard icon={AlertCircle} tone="red" value={fmt.n(missing)} label={t('td.missing')} hint={t('td.window')} />
        <StatCard icon={TrendingUp} tone="green" value={fmt.pct(completion)} label={t('td.completion')} hint={t('td.window')} onClick={() => navigate({ name: 'insights' })} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <section className="card p-5" aria-labelledby="att-h">
          <SectionTitle id="att-h" icon={Bell} title={t('td.attention')} count={attention.length} />
          {attention.length ? (
            <ul className="space-y-2">
              {attention.slice(0, 7).map((x) => {
                const I = x.icon;
                return (
                  <li key={x.key}>
                    <button type="button" onClick={() => navigate(x.go)} className="w-full text-start flex items-center gap-3 rounded-xl p-3 ring-1 ring-slate-200 hover:ring-ags-indigo hover:bg-ags-indigo-50/40 transition">
                      <span className={cx('w-9 h-9 rounded-lg inline-flex items-center justify-center shrink-0', tones[x.tone])}><I aria-hidden="true" className="w-4 h-4" /></span>
                      <span className="flex-1 text-sm text-ags-navy">{x.text}</span>
                      <ChevronRight aria-hidden="true" className="w-4 h-4 text-slate-400 flip-rtl" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <EmptyState icon={CheckCircle2} title={t('td.att.none')} />}
        </section>
        <section className="card p-5" aria-labelledby="up-h">
          <SectionTitle id="up-h" icon={CalendarClock} title={t('td.upcoming')} count={upcoming.length} />
          <ul className="space-y-3">
            {upcoming.map((r) => (
              <li key={r.a.id + r.cls}>
                <button type="button" onClick={() => navigate({ name: 'submissions', id: r.a.id, cls: r.cls })} className="w-full text-start rounded-xl p-3 ring-1 ring-slate-200 hover:ring-ags-indigo transition">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ags-navy flex-1 min-w-0 truncate" dir="auto">{r.a.title}</span>
                    <span className="text-xs font-bold rounded-full bg-ags-indigo-50 text-ags-indigo px-2 py-0.5">{clsLabel(r.cls, lang)}</span>
                  </span>
                  <span className="mt-1 block text-xs text-ags-slate">{dueLabel(t, fmt, r.a.dueAt, now)}</span>
                  <span className="mt-2 flex items-center gap-3">
                    <ProgressBar value={r.s.handedIn} max={r.s.total} className="flex-1" label={t('td.handedIn', { n: r.s.handedIn, total: r.s.total })} />
                    <span className="text-xs text-ags-slate tabular whitespace-nowrap">{t('td.handedIn', { n: r.s.handedIn, total: r.s.total })}</span>
                  </span>
                </button>
              </li>
            ))}
            {scheduled.map((a) => (
              <li key={a.id} className="rounded-xl p-3 ring-1 ring-dashed ring-sky-300 bg-sky-50/40">
                <span className="flex flex-wrap items-center gap-2"><span className="font-medium text-ags-navy flex-1" dir="auto">{a.title}</span><StatusChip status="scheduled" size="sm" /></span>
                <span className="block text-xs text-ags-slate mt-1">{clsList(a.classes, lang)} · {t('ta.publishes', { when: `${fmt.date(a.publishAt)} · ${fmt.time(a.publishAt)}` })}</span>
              </li>
            ))}
            {!upcoming.length && !scheduled.length && <EmptyState title={t('td.noUpcoming')} />}
          </ul>
        </section>
      </div>
    </div>
  );
}

function DuplicateModal({ a, onClose }) {
  const { t, now, actions, lang, fmt } = useApp();
  const [classes, setClasses] = useState(() => SARAH_CLASSES.filter((c) => !a.classes.includes(c)).slice(0, 1));
  const [date, setDate] = useState(toYMD(atDay(2, 19, 0, now)));
  const [time, setTime] = useState(toHM(a.dueAt));
  const due = fromYMDHM(date, time);
  const err = !classes.length ? t('b.err.classes') : due <= now ? t('b.err.due') : '';
  const go = () => { if (err) return; actions.duplicate(a.id, classes, due); onClose(); };
  return (
    <Modal open onClose={onClose} title={t('dup.title')} icon={Copy} size="sm"
      footer={<><button type="button" className="btn btn-secondary" onClick={onClose}>{t('cancel')}</button><button type="button" className="btn btn-primary" disabled={!!err} onClick={go}><Copy aria-hidden="true" className="w-4 h-4" />{t('dup.do')}</button></>}>
      <p className="text-sm text-ags-slate mb-4" dir="auto">{a.title}</p>
      <p className="label" id="dup-cls">{t('dup.classes')}</p>
      <ClassChips value={classes} onChange={setClasses} labelId="dup-cls" />
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div><label className="label" htmlFor="dup-d">{t('dup.due')}</label><input id="dup-d" type="date" className="input" value={date} min={toYMD(now)} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="label" htmlFor="dup-t">{t('b.dueTime')}</label><input id="dup-t" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} /></div>
      </div>
      <p className={cx('mt-3 text-sm', err ? 'text-rose-700' : 'text-ags-slate')} role={err ? 'alert' : undefined}>{err || `${t('a.due')}: ${fmt.date(due)} · ${fmt.time(due)} · ${clsList(classes, lang)}`}</p>
    </Modal>
  );
}

function TeacherAssignments() {
  const { t, fmt, lang, now, db, navigate, route } = useApp();
  const [tab, setTab] = useState('open');
  const [dup, setDup] = useState(null);
  const [prev, setPrev] = useState(null);
  const all = teacherAssignments(db);
  const groups = {
    open: all.filter((a) => isPublished(a, now) && a.dueAt > now).sort((x, y) => x.dueAt - y.dueAt),
    scheduled: all.filter((a) => !isPublished(a, now)),
    past: all.filter((a) => isPublished(a, now) && a.dueAt <= now),
    all,
  };
  const list = groups[tab];
  return (
    <div>
      <PageHeader title={t('ta.title')} subtitle={t('ta.subtitle')}
        actions={<button type="button" className="btn btn-gold" onClick={() => navigate({ name: 'create' })}><PlusCircle aria-hidden="true" className="w-4 h-4" />{t('td.new')}</button>} />
      <div className="scroll-x mb-5"><Segmented ariaLabel={t('ta.title')} value={tab} onChange={setTab}
        options={[['open', 'ta.open'], ['scheduled', 'ta.scheduled'], ['past', 'ta.past'], ['all', 'all.tab.all']].map(([v, k]) => ({ value: v, label: `${t(k)} (${fmt.n(groups[v].length)})` }))} /></div>
      <div className="space-y-3">
        {list.map((a) => {
          const pub = isPublished(a, now);
          const status = !pub ? 'scheduled' : a.dueAt > now ? 'open' : 'past';
          return (
            <article key={a.id} className={cx('card p-4 sm:p-5 relative overflow-hidden', route.highlight === a.id && 'ags-flash')}>
              <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1.5" style={{ background: SUBJECTS[a.subject]?.color }} />
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-[14rem]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-ags-navy text-[1.05rem]" dir="auto">{a.title}</h2>
                    <StatusChip status={status} size="sm" />
                  </div>
                  <p className="text-sm text-ags-slate mt-1 flex flex-wrap gap-x-3">
                    <span>{pub ? dueLabel(t, fmt, a.dueAt, now) : t('ta.publishes', { when: `${fmt.date(a.publishAt)} · ${fmt.time(a.publishAt)}` })}</span>
                    <span>· {t(`type.${submissionType(a)}`)}</span><span>· {t('pts', { n: a.points })}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPrev(a)}><Eye aria-hidden="true" className="w-4 h-4" />{t('ta.preview')}</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDup(a)}><Copy aria-hidden="true" className="w-4 h-4" />{t('ta.duplicate')}</button>
                </div>
              </div>
              <div className="mt-3 grid sm:grid-cols-3 gap-2">
                {a.classes.map((c) => {
                  const s = classStats(db, a, c, now);
                  return (
                    <button key={c} type="button" disabled={!pub} onClick={() => navigate({ name: 'submissions', id: a.id, cls: c })}
                      className="text-start rounded-xl ring-1 ring-slate-200 hover:ring-ags-indigo p-3 transition disabled:opacity-70 disabled:hover:ring-slate-200">
                      <span className="flex items-center justify-between text-sm"><span className="font-bold text-ags-navy">{clsLabel(c, lang, true)}</span>
                        {s.toGrade > 0 && <span className="text-xs font-bold bg-ags-gold text-ags-navy rounded-full px-2 py-0.5">{t('ta.toGrade', { n: s.toGrade })}</span>}</span>
                      <span className="mt-2 flex items-center gap-2"><ProgressBar value={s.handedIn} max={s.total} className="flex-1" label={t('td.handedIn', { n: s.handedIn, total: s.total })} /><span className="text-xs tabular text-ags-slate">{t('td.handedIn', { n: s.handedIn, total: s.total })}</span></span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
        {!list.length && <div className="card"><EmptyState title={t('empty.filter')} /></div>}
      </div>
      {dup && <DuplicateModal a={dup} onClose={() => setDup(null)} />}
      <Modal open={!!prev} onClose={() => setPrev(null)} title={t('ta.preview')} icon={Eye} size="lg" footer={<button type="button" className="btn btn-primary" onClick={() => setPrev(null)}>{t('close')}</button>}>
        {prev && <StudentPreview a={prev} />}
      </Modal>
    </div>
  );
}

/* ---------- assignment builder ---------- */

const BLOCK_TYPES = [
  ['mcq', CircleDot], ['checkbox', CheckSquare], ['short', Type], ['long', AlignLeft],
  ['tf', ToggleLeft], ['match', Shuffle], ['file', Paperclip], ['paper', Camera],
];
const BLOCK_ICON = Object.fromEntries(BLOCK_TYPES);

function newBlock(type, prompt = '') {
  const base = { id: uid('b'), type, prompt, points: 2, required: true };
  if (type === 'mcq') return { ...base, options: ['', '', ''], correct: 0 };
  if (type === 'checkbox') return { ...base, options: ['', '', ''], correct: [] };
  if (type === 'tf') return { ...base, correct: true, points: 1 };
  if (type === 'match') return { ...base, pairs: [{ left: '', right: '' }, { left: '', right: '' }, { left: '', right: '' }], points: 3 };
  if (type === 'long') return { ...base, points: 5 };
  if (type === 'file') return { ...base, points: 5 };
  if (type === 'paper') return { ...base, points: 10 };
  return base;
}

function newDraft(now) {
  return {
    title: '', instructions: '', subject: 'math', classes: ['8B'], blocks: [], attachments: [],
    rubric: [{ id: 'method', key: 'method' }, { id: 'accuracy', key: 'accuracy' }, { id: 'presentation', key: 'presentation' }],
    publishMode: 'now', publishDate: toYMD(now), publishTime: '07:00',
    dueDate: toYMD(atDay(1, 19, 0, now)), dueTime: '19:00',
    lateMode: 'accept', untilDate: toYMD(atDay(3, 19, 0, now)), untilTime: '19:00', deduct: false, pct: 10,
    allowResubmit: false, template: null, view: 'edit',
  };
}

const TEMPLATES = {
  worksheet: { icon: Camera, build: (lang) => ({
    instructions: lang === 'ar' ? 'أكمل ورقة العمل في دفترك مع إظهار جميع خطوات الحل، ثم التقط صورة واضحة لكل صفحة.' : 'Complete the worksheet in your exercise book. Show all your working, then take a clear photo of each page.',
    blocks: [newBlock('paper', lang === 'ar' ? 'التقط صورة واضحة لكل صفحة من حلّك.' : 'Take a clear photo of each page of your working.')],
    attachments: [{ id: uid('att'), kind: 'worksheet', name: lang === 'ar' ? 'ورقة العمل.pdf' : 'Worksheet.pdf' }],
    rubric: ['method', 'accuracy', 'presentation'].map((k) => ({ id: k, key: k })),
  }) },
  quiz: { icon: ListChecks, build: () => ({
    instructions: 'Answer every question. This quiz is marked automatically.',
    blocks: [
      { ...newBlock('mcq', 'Which fraction is equivalent to 3/4?'), options: ['6/8', '3/8', '4/3', '9/16'], correct: 0 },
      { ...newBlock('mcq', 'What is 2/5 + 1/5?'), options: ['3/10', '3/5', '2/25', '1/5'], correct: 1 },
      { ...newBlock('mcq', 'Simplify 12/18.'), options: ['2/3', '3/4', '6/9', '4/6'], correct: 0 },
      { ...newBlock('tf', '0.25 is equal to 1/4.'), correct: true, points: 2 },
      { ...newBlock('tf', '5/6 is smaller than 2/3.'), correct: false, points: 2 },
    ],
    attachments: [], rubric: [],
  }) },
  reading: { icon: BookOpen, build: () => ({
    instructions: 'Read the attached text carefully, then answer the questions using evidence from the text.',
    blocks: [
      { ...newBlock('short', 'What is the main idea of the text?'), points: 3 },
      { ...newBlock('short', 'Find one quotation that shows how the main character feels.'), points: 3 },
      { ...newBlock('long', 'Explain how the writer creates tension. Use evidence from the text.'), points: 6 },
    ],
    attachments: [{ id: uid('att'), kind: 'worksheet', name: 'Reading text.pdf' }],
    rubric: ['understanding', 'evidence', 'language'].map((k) => ({ id: k, key: k })),
  }) },
  project: { icon: Sparkles, build: (lang, now) => ({
    instructions: 'Work on your project over the next week. Upload your final file and a short reflection.',
    blocks: [{ ...newBlock('file', 'Upload your project file (PDF, slides or images).'), points: 15 }, { ...newBlock('long', 'Reflection: what did you learn, and what would you improve next time?'), points: 5 }],
    attachments: [], rubric: ['research', 'creativity', 'presentation'].map((k) => ({ id: k, key: k })),
    dueDate: toYMD(atDay(7, 19, 0, now)), allowResubmit: true,
  }) },
};

/** Turn the builder draft into an assignment object (also used for the preview). */
function draftToAssignment(d, now, id = 'preview') {
  const publishAt = d.publishMode === 'schedule' ? fromYMDHM(d.publishDate, d.publishTime) : now;
  const teacherPts = sum(d.blocks.filter((b) => !isAuto(b)).map((b) => Number(b.points) || 0));
  return {
    id, title: d.title.trim() || '—', instructions: d.instructions.trim(), subject: d.subject, teacherId: DEMO_TEACHER, classes: d.classes.length ? d.classes : ['8B'],
    lang: /[؀-ۿ]/.test(d.title + d.instructions) ? 'ar' : 'en',
    blocks: d.blocks.map((b) => ({ ...b, points: Number(b.points) || 0, options: b.options?.map((o, i) => o.trim() || `${i + 1}`), pairs: b.pairs?.filter((p) => p.left.trim() || p.right.trim()) })),
    attachments: d.attachments, publishAt, dueAt: fromYMDHM(d.dueDate, d.dueTime),
    status: publishAt > now ? 'scheduled' : 'published',
    latePolicy: { mode: d.lateMode, until: d.lateMode === 'until' ? fromYMDHM(d.untilDate, d.untilTime) : null, deduct: d.deduct && d.lateMode !== 'none', pct: Number(d.pct) || 0 },
    allowResubmit: d.allowResubmit,
    points: sum(d.blocks.map((b) => Number(b.points) || 0)),
    rubric: teacherPts > 0 ? distributeRubric(d.rubric.length ? d.rubric : [{ id: 'overall', key: 'content' }], teacherPts) : [],
    createdAt: now,
  };
}

function validateDraft(d, now, t) {
  const e = {};
  if (!d.title.trim()) e.title = t('b.err.title');
  if (!d.classes.length) e.classes = t('b.err.classes');
  if (!d.blocks.length) e.blocks = t('b.err.blocks');
  const due = fromYMDHM(d.dueDate, d.dueTime);
  const pub = d.publishMode === 'schedule' ? fromYMDHM(d.publishDate, d.publishTime) : now;
  if (!(due > now) || due <= pub) e.due = t('b.err.due');
  if (d.publishMode === 'schedule' && pub <= now) e.publish = t('b.err.publish');
  const badBlocks = d.blocks.filter((b) => !b.prompt.trim() || (['mcq', 'checkbox'].includes(b.type) && b.options.filter((o) => o.trim()).length < 2) || (b.type === 'checkbox' && !b.correct.length) || (b.type === 'match' && b.pairs.filter((p) => p.left.trim() && p.right.trim()).length < 2));
  if (badBlocks.length) { e.prompts = t('b.err.prompt'); e.badIds = badBlocks.map((b) => b.id); }
  return e;
}

function BlockEditor({ b, i, n, update, move, duplicate, remove, bad }) {
  const { t } = useApp();
  const I = BLOCK_ICON[b.type];
  const set = (patch) => update({ ...b, ...patch });
  const pid = `bp_${b.id}`;
  return (
    <div className={cx('card p-4 sm:p-5', bad && 'ring-2 ring-rose-300')}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-lg bg-ags-indigo-50 text-ags-indigo inline-flex items-center justify-center"><I aria-hidden="true" className="w-4 h-4" /></span>
        <span className="font-bold text-sm text-ags-navy">{t('q.number', { n: i + 1 })} · {t(`q.${b.type}`)}</span>
        <span className={cx('text-xs rounded-full px-2 py-0.5 ring-1', isAuto(b) ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-slate-100 text-slate-700 ring-slate-200')}>{isAuto(b) ? t('b.autoMarked') : t('b.teacherMarked')}</span>
        <div className="ms-auto flex gap-0.5">
          <button type="button" className="btn btn-ghost btn-icon" disabled={i === 0} onClick={() => move(-1)} aria-label={`${t('b.moveUp')} — ${t('q.number', { n: i + 1 })}`}><ChevronUp aria-hidden="true" className="w-4 h-4" /></button>
          <button type="button" className="btn btn-ghost btn-icon" disabled={i === n - 1} onClick={() => move(1)} aria-label={`${t('b.moveDown')} — ${t('q.number', { n: i + 1 })}`}><ChevronDown aria-hidden="true" className="w-4 h-4" /></button>
          <button type="button" className="btn btn-ghost btn-icon" onClick={duplicate} aria-label={`${t('b.duplicate')} — ${t('q.number', { n: i + 1 })}`}><Copy aria-hidden="true" className="w-4 h-4" /></button>
          <button type="button" className="btn btn-ghost btn-icon text-rose-700" onClick={remove} aria-label={`${t('b.delete')} — ${t('q.number', { n: i + 1 })}`}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>
        </div>
      </div>
      <label htmlFor={pid} className="sr-only">{t('b.prompt')}</label>
      <textarea id={pid} rows={2} dir="auto" className={cx('input font-medium', bad && !b.prompt.trim() && 'input-error')} value={b.prompt} placeholder={t('b.promptPh')} onChange={(e) => set({ prompt: e.target.value })} />

      {(b.type === 'mcq' || b.type === 'checkbox') && (
        <div className="mt-3 space-y-2">
          <p className="hint">{b.type === 'mcq' ? t('b.correctOne') : t('b.correctMany')}</p>
          {b.options.map((o, oi) => {
            const isC = b.type === 'mcq' ? b.correct === oi : b.correct.includes(oi);
            return (
              <div key={oi} className="flex items-center gap-2">
                <input type={b.type === 'mcq' ? 'radio' : 'checkbox'} name={`c_${b.id}`} checked={isC} aria-label={`${t('b.markCorrect')} — ${t('b.option', { n: oi + 1 })}`}
                  onChange={() => set({ correct: b.type === 'mcq' ? oi : (isC ? b.correct.filter((x) => x !== oi) : [...b.correct, oi]) })} />
                <input className={cx('input !min-h-[2.4rem]', isC && 'ring-1 ring-emerald-300 border-emerald-400')} dir="auto" value={o} placeholder={t('b.option', { n: oi + 1 })} aria-label={t('b.option', { n: oi + 1 })}
                  onChange={(e) => set({ options: b.options.map((x, j) => (j === oi ? e.target.value : x)) })} />
                <button type="button" className="btn btn-ghost btn-icon" disabled={b.options.length <= 2} aria-label={`${t('b.removeOption')} ${oi + 1}`}
                  onClick={() => { const opts = b.options.filter((_, j) => j !== oi); set({ options: opts, correct: b.type === 'mcq' ? (b.correct === oi ? 0 : b.correct > oi ? b.correct - 1 : b.correct) : b.correct.filter((x) => x !== oi).map((x) => (x > oi ? x - 1 : x)) }); }}><X aria-hidden="true" className="w-4 h-4" /></button>
              </div>
            );
          })}
          {b.options.length < 6 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => set({ options: [...b.options, ''] })}><Plus aria-hidden="true" className="w-4 h-4" />{t('b.addOption')}</button>}
        </div>
      )}
      {b.type === 'tf' && (
        <div className="mt-3"><p className="hint mb-1.5">{t('b.correct')}</p>
          <Segmented ariaLabel={t('b.correct')} value={b.correct ? 't' : 'f'} onChange={(v) => set({ correct: v === 't' })} options={[{ value: 't', label: t('q.true') }, { value: 'f', label: t('q.false') }]} /></div>
      )}
      {b.type === 'match' && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 text-xs text-ags-slate"><span>{t('b.pairLeft')}</span><span /><span>{t('b.pairRight')}</span><span /></div>
          {b.pairs.map((p, pi) => (
            <div key={pi} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
              <input className="input !min-h-[2.4rem]" dir="auto" value={p.left} aria-label={`${t('b.pairLeft')} ${pi + 1}`} onChange={(e) => set({ pairs: b.pairs.map((x, j) => (j === pi ? { ...x, left: e.target.value } : x)) })} />
              <ArrowRight aria-hidden="true" className="w-4 h-4 text-slate-400 flip-rtl" />
              <input className="input !min-h-[2.4rem]" dir="auto" value={p.right} aria-label={`${t('b.pairRight')} ${pi + 1}`} onChange={(e) => set({ pairs: b.pairs.map((x, j) => (j === pi ? { ...x, right: e.target.value } : x)) })} />
              <button type="button" className="btn btn-ghost btn-icon" disabled={b.pairs.length <= 2} aria-label={`${t('b.removePair')} ${pi + 1}`} onClick={() => set({ pairs: b.pairs.filter((_, j) => j !== pi) })}><X aria-hidden="true" className="w-4 h-4" /></button>
            </div>
          ))}
          {b.pairs.length < 8 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => set({ pairs: [...b.pairs, { left: '', right: '' }] })}><Plus aria-hidden="true" className="w-4 h-4" />{t('b.addPair')}</button>}
        </div>
      )}
      {(b.type === 'short' || b.type === 'long') && <div className={cx('mt-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 text-sm text-ags-slate px-3 py-2', b.type === 'long' && 'h-20')}>{t('b.studentAnswers')}</div>}
      {b.type === 'file' && <p className="mt-3 text-sm text-ags-slate flex gap-2"><Paperclip aria-hidden="true" className="w-4 h-4 mt-0.5" />{t('b.fileInfo')}</p>}
      {b.type === 'paper' && <p className="mt-3 text-sm text-ags-slate flex gap-2 rounded-xl bg-ags-gold-50 p-3"><Camera aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t('b.paperInfo')}</p>}

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm"><span>{t('b.pts')}</span>
          <input type="number" min={0} max={100} className="input !w-20 !min-h-[2.3rem] tabular" value={b.points} onChange={(e) => set({ points: clamp(Number(e.target.value) || 0, 0, 100) })} /></label>
        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={b.required} onChange={(e) => set({ required: e.target.checked })} />{t('b.required')}</label>
      </div>
    </div>
  );
}

function AssignmentBuilder() {
  const { t, fmt, lang, now, builder: d, setBuilder, actions, navigate, toast } = useApp();
  const [errors, setErrors] = useState({});
  const [adding, setAdding] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [custom, setCustom] = useState('');
  const imgRef = useRef(null);
  const set = (patch) => setBuilder((x) => ({ ...x, ...patch }));
  const setBlocks = (fn) => setBuilder((x) => ({ ...x, blocks: fn(x.blocks) }));
  const preview = useMemo(() => draftToAssignment(d, now), [d, now]);
  const teacherPts = teacherPoints(preview);
  const autoPts = preview.points - teacherPts;

  const applyTemplate = (k) => {
    const tp = TEMPLATES[k].build(lang, now);
    setBuilder((x) => ({ ...x, ...tp, title: x.title, template: k }));
    setErrors({});
    toast(t('tpl.applied'), { kind: 'success' });
    setTimeout(() => document.getElementById('b-title')?.focus(), 50);
  };
  const addBlock = (type) => { setBlocks((bs) => [...bs, newBlock(type)]); setAdding(false); setTimeout(() => { const el = document.querySelectorAll('[id^="bp_"]'); el[el.length - 1]?.focus(); }, 60); };
  const publish = () => {
    const e = validateDraft(d, now, t); setErrors(e);
    if (Object.keys(e).length) { toast(t('b.err.fix'), { kind: 'warn' }); document.getElementById('b-errors')?.focus(); return; }
    const a = actions.publish(d);
    setBuilder(newDraft(now)); setErrors({});
    navigate({ name: 'assignments', highlight: a.id });
  };
  const toggleCrit = (k) => set({ rubric: d.rubric.some((c) => c.key === k) ? d.rubric.filter((c) => c.key !== k) : [...d.rubric, { id: k, key: k }] });
  const rubricSplit = teacherPts > 0 ? distributeRubric(d.rubric.length ? d.rubric : [{ id: 'overall', key: 'content' }], teacherPts) : [];
  const errList = ['title', 'classes', 'blocks', 'prompts', 'due', 'publish'].filter((k) => errors[k]);

  return (
    <div>
      <PageHeader title={t('b.title')} subtitle={t('b.subtitle')}
        actions={<>
          <Segmented ariaLabel={t('b.preview')} value={d.view} onChange={(v) => set({ view: v })} options={[{ value: 'edit', label: t('b.editMode'), icon: PencilLine }, { value: 'preview', label: t('b.preview'), icon: Eye }]} />
          <button type="button" className="btn btn-gold" onClick={publish}><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{d.publishMode === 'schedule' ? t('b.scheduleBtn') : t('b.publishBtn')}</button>
        </>} />

      {errList.length > 0 && (
        <div id="b-errors" tabIndex={-1} role="alert" className="mb-5 rounded-xl bg-rose-50 ring-1 ring-rose-200 p-4 text-rose-900">
          <p className="font-bold flex items-center gap-2"><AlertCircle aria-hidden="true" className="w-4 h-4" />{t('b.err.fix')}</p>
          <ul className="mt-1 text-sm list-disc ps-6">{errList.map((k) => <li key={k}>{errors[k]}</li>)}</ul>
        </div>
      )}

      {d.view === 'preview' ? (
        <div className="max-w-4xl mx-auto"><StudentPreview a={preview} /></div>
      ) : (
        <>
          <section aria-labelledby="tpl-h" className="mb-6">
            <h2 id="tpl-h" className="text-sm font-bold text-ags-navy mb-2">{t('b.templates')}</h2>
            <div className="scroll-x -mx-1 px-1"><div className="grid grid-flow-col auto-cols-[15rem] lg:grid-flow-row lg:grid-cols-4 lg:auto-cols-auto gap-3 pb-1">
              {Object.entries(TEMPLATES).map(([k, tp]) => {
                const I = tp.icon; const on = d.template === k;
                return (
                  <button key={k} type="button" onClick={() => applyTemplate(k)} aria-pressed={on}
                    className={cx('card text-start p-4 flex gap-3 items-start transition hover:shadow-md', on && 'ring-2 ring-ags-gold')}>
                    <span className={cx('w-10 h-10 rounded-xl inline-flex items-center justify-center shrink-0', on ? 'bg-ags-gold text-ags-navy' : 'bg-ags-indigo-50 text-ags-indigo')}><I aria-hidden="true" className="w-5 h-5" /></span>
                    <span><span className="block font-bold text-ags-navy text-sm">{t(`tpl.${k}`)}</span><span className="block text-xs text-ags-slate mt-0.5 leading-snug">{t(`tpl.${k}.d`)}</span></span>
                  </button>
                );
              })}
            </div></div>
          </section>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem] gap-5 items-start">
            <div className="space-y-5 min-w-0">
              <section className="card p-5 sm:p-6 space-y-4" aria-labelledby="det-h">
                <h2 id="det-h" className="font-bold text-ags-navy">{t('b.details')}</h2>
                <div>
                  <label className="label" htmlFor="b-title">{t('b.fTitle')}</label>
                  <input id="b-title" className={cx('input text-lg font-medium', errors.title && 'input-error')} dir="auto" value={d.title} placeholder={t('b.fTitlePh')} onChange={(e) => set({ title: e.target.value })} aria-invalid={!!errors.title} />
                </div>
                <div>
                  <label className="label" htmlFor="b-instr">{t('b.fInstr')}</label>
                  <textarea id="b-instr" className="input min-h-[6rem]" dir="auto" value={d.instructions} placeholder={t('b.fInstrPh')} onChange={(e) => set({ instructions: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-[14rem_1fr] gap-4">
                  <div>
                    <label className="label" htmlFor="b-subj">{t('b.subject')}</label>
                    <select id="b-subj" className="input" value={d.subject} onChange={(e) => set({ subject: e.target.value })}>
                      {CORE_SUBJECTS.map((s) => <option key={s} value={s}>{subjName(s, lang)}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="label" id="b-cls">{t('b.classes')}</p>
                    <ClassChips value={d.classes} onChange={(v) => set({ classes: v })} error={errors.classes} labelId="b-cls" />
                  </div>
                </div>
              </section>

              <section aria-labelledby="q-h">
                <SectionTitle id="q-h" icon={ListChecks} title={t('b.questions')} count={d.blocks.length} right={<span className="text-sm text-ags-slate tabular">{t('b.total')}: <b className="text-ags-navy">{t('pts', { n: preview.points })}</b></span>} />
                <div className="space-y-3">
                  {d.blocks.map((b, i) => (
                    <BlockEditor key={b.id} b={b} i={i} n={d.blocks.length} bad={errors.badIds?.includes(b.id)}
                      update={(nb) => setBlocks((bs) => bs.map((x) => (x.id === b.id ? nb : x)))}
                      move={(dlt) => setBlocks((bs) => { const j = i + dlt; if (j < 0 || j >= bs.length) return bs; const c = [...bs]; [c[i], c[j]] = [c[j], c[i]]; return c; })}
                      duplicate={() => setBlocks((bs) => { const c = [...bs]; c.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(b)), id: uid('b') }); return c; })}
                      remove={() => setBlocks((bs) => bs.filter((x) => x.id !== b.id))} />
                  ))}
                  {!d.blocks.length && <div className={cx('card', errors.blocks && 'ring-2 ring-rose-300')}><EmptyState icon={ListChecks} title={t('b.empty')} /></div>}
                </div>
                <div className="mt-3">
                  <button type="button" className="btn btn-secondary" aria-expanded={adding} onClick={() => setAdding((v) => !v)}><Plus aria-hidden="true" className="w-4 h-4" />{t('b.addQ')}</button>
                  {adding && (
                    <div className="mt-3 card p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 ags-fade-up" role="menu" aria-label={t('b.addQ')}>
                      {BLOCK_TYPES.map(([type, I]) => (
                        <button key={type} type="button" role="menuitem" onClick={() => addBlock(type)} className="flex flex-col items-center gap-1.5 rounded-xl p-3 ring-1 ring-slate-200 hover:ring-ags-indigo hover:bg-ags-indigo-50 text-sm text-ags-navy text-center">
                          <I aria-hidden="true" className="w-5 h-5 text-ags-indigo" />{t(`q.${type}`)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="card p-5 sm:p-6" aria-labelledby="att-b-h">
                <h2 id="att-b-h" className="font-bold text-ags-navy mb-3 flex items-center gap-2"><Paperclip aria-hidden="true" className="w-4 h-4" />{t('a.attachments')}</h2>
                {d.attachments.length > 0 && (
                  <ul className="space-y-2 mb-3">
                    {d.attachments.map((x) => (
                      <li key={x.id} className="flex items-center gap-3 rounded-xl ring-1 ring-slate-200 p-2.5">
                        <span className="w-9 h-9 rounded-lg bg-ags-indigo-50 text-ags-indigo inline-flex items-center justify-center overflow-hidden">{x.kind === 'image' && x.src ? <img src={x.src} alt="" className="w-full h-full object-cover" /> : x.kind === 'link' ? <Link2 aria-hidden="true" className="w-4 h-4" /> : <FileText aria-hidden="true" className="w-4 h-4" />}</span>
                        <span className="flex-1 min-w-0 text-sm truncate" dir="auto">{x.name}</span>
                        <button type="button" className="btn btn-ghost btn-icon" aria-label={`${t('b.delete')} — ${x.name}`} onClick={() => set({ attachments: d.attachments.filter((y) => y.id !== x.id) })}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { set({ attachments: [...d.attachments, { id: uid('att'), kind: 'worksheet', name: `${d.title.trim() || t('b.att.worksheetName')}.pdf` }] }); toast(t('b.att.mock'), { kind: 'info' }); }}><FileText aria-hidden="true" className="w-4 h-4" />{t('b.att.worksheet')}</button>
                  <label className="btn btn-secondary btn-sm cursor-pointer"><ImageIcon aria-hidden="true" className="w-4 h-4" />{t('b.att.image')}
                    <input ref={imgRef} type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (!f) return; const meta = await readFileMeta(f); set({ attachments: [...d.attachments, { id: uid('att'), kind: 'image', name: f.name, src: meta.src }] }); }} />
                  </label>
                </div>
                <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const u = linkUrl.trim(); if (!u) return; const url = /^https?:\/\//i.test(u) ? u : `https://${u}`; set({ attachments: [...d.attachments, { id: uid('att'), kind: 'link', name: u, url }] }); setLinkUrl(''); }}>
                  <label htmlFor="b-link" className="sr-only">{t('b.att.link')}</label>
                  <input id="b-link" className="input !min-h-[2.4rem]" dir="ltr" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t('b.att.linkPh')} />
                  <button type="submit" className="btn btn-secondary btn-sm"><Link2 aria-hidden="true" className="w-4 h-4" />{t('b.att.link')}</button>
                </form>
              </section>

              <section className="card p-5 sm:p-6" aria-labelledby="rub-h">
                <h2 id="rub-h" className="font-bold text-ags-navy mb-1 flex items-center gap-2"><ClipboardList aria-hidden="true" className="w-4 h-4" />{t('b.rubric')}</h2>
                {teacherPts > 0 ? (
                  <>
                    <p className="hint mb-3">{t('b.rubric.hint', { n: teacherPts })}</p>
                    <div className="flex flex-wrap gap-2">
                      {RUBRIC_PRESETS.map((k) => {
                        const on = d.rubric.some((c) => c.key === k);
                        return <button key={k} type="button" aria-pressed={on} onClick={() => toggleCrit(k)} className={cx('rounded-full px-3 py-1.5 text-sm ring-1 min-h-[2.25rem]', on ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white ring-slate-300 hover:ring-ags-indigo')}>{t(`rub.${k}`)}</button>;
                      })}
                      {d.rubric.filter((c) => !c.key).map((c) => (
                        <button key={c.id} type="button" aria-pressed="true" onClick={() => set({ rubric: d.rubric.filter((x) => x.id !== c.id) })} className="rounded-full px-3 py-1.5 text-sm ring-1 bg-ags-indigo text-white ring-ags-indigo inline-flex items-center gap-1.5" dir="auto">{c.label}<X aria-hidden="true" className="w-3.5 h-3.5" /></button>
                      ))}
                    </div>
                    <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!custom.trim()) return; set({ rubric: [...d.rubric, { id: uid('rc'), label: custom.trim() }] }); setCustom(''); }}>
                      <label htmlFor="b-crit" className="sr-only">{t('rub.customPh')}</label>
                      <input id="b-crit" className="input !min-h-[2.4rem]" dir="auto" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t('rub.customPh')} />
                      <button type="submit" className="btn btn-secondary btn-sm"><Plus aria-hidden="true" className="w-4 h-4" />{t('b.rubric.add')}</button>
                    </form>
                    <ul className="mt-4 grid sm:grid-cols-3 gap-2">
                      {rubricSplit.map((c) => <li key={c.id} className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2 text-sm flex justify-between gap-2"><span className="truncate">{c.key ? t(`rub.${c.key}`) : c.label}</span><b className="tabular">{fmt.n(c.max)}</b></li>)}
                    </ul>
                  </>
                ) : <p className="hint">{d.blocks.length ? t('b.rubric.none') : t('b.rubric.empty')}</p>}
              </section>
            </div>

            <aside className="card p-5 space-y-5 lg:sticky lg:top-20" aria-labelledby="set-h">
              <h2 id="set-h" className="font-bold text-ags-navy flex items-center gap-2"><Settings aria-hidden="true" className="w-4 h-4" />{t('b.settings')}</h2>
              <div>
                <p className="label">{t('b.publish')}</p>
                <Segmented full ariaLabel={t('b.publish')} value={d.publishMode} onChange={(v) => set({ publishMode: v })} options={[{ value: 'now', label: t('b.pubNow') }, { value: 'schedule', label: t('b.pubSchedule') }]} />
                {d.publishMode === 'schedule' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input type="date" className={cx('input', errors.publish && 'input-error')} aria-label={t('b.pubAt')} value={d.publishDate} min={toYMD(now)} onChange={(e) => set({ publishDate: e.target.value })} />
                    <input type="time" className="input" aria-label={t('b.pubAt')} value={d.publishTime} onChange={(e) => set({ publishTime: e.target.value })} />
                  </div>
                )}
              </div>
              <div>
                <p className="label">{t('b.due')}</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className={cx('input', errors.due && 'input-error')} aria-label={t('b.dueDate')} value={d.dueDate} min={toYMD(now)} onChange={(e) => set({ dueDate: e.target.value })} />
                  <input type="time" className={cx('input', errors.due && 'input-error')} aria-label={t('b.dueTime')} value={d.dueTime} onChange={(e) => set({ dueTime: e.target.value })} />
                </div>
                <p className="hint mt-1.5">{fmt.date(preview.dueAt)} · {fmt.time(preview.dueAt)} · {fmt.hijri(preview.dueAt)}</p>
              </div>
              <fieldset>
                <legend className="label">{t('b.late')}</legend>
                <div className="space-y-1.5">
                  {[['accept', 'b.late.accept'], ['until', 'b.late.until'], ['none', 'b.late.none']].map(([v, k]) => (
                    <label key={v} className={cx('flex items-center gap-2.5 rounded-xl ring-1 px-3 py-2 cursor-pointer text-sm', d.lateMode === v ? 'ring-ags-indigo bg-ags-indigo-50' : 'ring-slate-200')}>
                      <input type="radio" name="late" checked={d.lateMode === v} onChange={() => set({ lateMode: v })} />
                      <span className="flex-1">{t(k)}</span>{v === 'accept' && <span className="text-xs text-ags-slate">{t('b.late.default')}</span>}
                    </label>
                  ))}
                </div>
                {d.lateMode === 'until' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input type="date" className="input" aria-label={t('b.late.untilDate')} value={d.untilDate} min={d.dueDate} onChange={(e) => set({ untilDate: e.target.value })} />
                    <input type="time" className="input" aria-label={t('b.late.untilDate')} value={d.untilTime} onChange={(e) => set({ untilTime: e.target.value })} />
                  </div>
                )}
              </fieldset>
              {d.lateMode !== 'none' && (
                <div>
                  <Switch checked={d.deduct} onChange={(v) => set({ deduct: v })} label={t('b.deduct')} hint={t('b.deduct.hint')} />
                  {d.deduct && <label className="mt-2 flex items-center gap-2 text-sm"><input type="number" min={1} max={50} className="input !w-20 !min-h-[2.3rem] tabular" value={d.pct} onChange={(e) => set({ pct: clamp(Number(e.target.value) || 0, 1, 50) })} />{t('b.deduct.pct')}</label>}
                </div>
              )}
              <Switch checked={d.allowResubmit} onChange={(v) => set({ allowResubmit: v })} label={t('b.resubmit')} hint={t('b.resubmit.hint')} />
              <div className="rounded-xl bg-ags-gold-50 ring-1 ring-amber-200 p-3 text-sm">
                <p className="font-bold text-ags-navy mb-1">{t('b.studentsSee')}</p>
                <p className="text-ags-navy/90">{latePolicyText(t, fmt, preview)}</p>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2"><dt className="text-[0.7rem] text-ags-slate">{t('b.total')}</dt><dd className="font-bold text-lg tabular">{fmt.n(preview.points)}</dd></div>
                <div className="rounded-xl bg-slate-50 p-2"><dt className="text-[0.7rem] text-ags-slate">{t('b.autoMarked')}</dt><dd className="font-bold text-lg tabular">{fmt.n(autoPts)}</dd></div>
                <div className="rounded-xl bg-slate-50 p-2"><dt className="text-[0.7rem] text-ags-slate">{t('b.teacherMarked')}</dt><dd className="font-bold text-lg tabular">{fmt.n(teacherPts)}</dd></div>
              </dl>
              <button type="button" className="btn btn-gold w-full btn-lg" onClick={publish}><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{d.publishMode === 'schedule' ? t('b.scheduleBtn') : t('b.publishBtn')}</button>
              <button type="button" className="btn btn-ghost w-full btn-sm" onClick={() => { setBuilder(newDraft(now)); setErrors({}); }}>{t('b.discard')}</button>
              <p className="hint text-center">{t('b.draftKept')}</p>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- grading queue, submissions table, grading view ---------- */

function GradingQueue() {
  const { t, fmt, lang, now, db, navigate } = useApp();
  const rows = teacherAssignments(db).filter((a) => isPublished(a, now)).flatMap((a) => a.classes.map((cls) => ({ a, cls, s: classStats(db, a, cls, now) })));
  const waiting = rows.filter((r) => r.s.toGrade > 0 || r.s.graded > 0).sort((x, y) => y.s.toGrade - x.s.toGrade);
  const others = rows.filter((r) => !waiting.includes(r)).sort((x, y) => y.a.dueAt - x.a.dueAt);
  const Row = ({ r }) => (
    <button type="button" onClick={() => navigate({ name: 'submissions', id: r.a.id, cls: r.cls, filter: r.s.toGrade ? 'toGrade' : 'all' })} className="w-full text-start card p-4 flex flex-wrap items-center gap-3 hover:shadow-md transition">
      <span className="flex-1 min-w-[12rem]">
        <span className="block font-bold text-ags-navy" dir="auto">{r.a.title}</span>
        <span className="block text-sm text-ags-slate">{clsLabel(r.cls, lang, true)} · {r.a.dueAt > now ? dueLabel(t, fmt, r.a.dueAt, now) : t('due.was', { when: fmt.date(r.a.dueAt) })}</span>
      </span>
      {r.s.toGrade > 0 && <span className="text-sm font-bold bg-ags-gold text-ags-navy rounded-full px-3 py-1">{t('ta.toGrade', { n: r.s.toGrade })}</span>}
      {r.s.graded > 0 && <StatusChip status="graded" label={`${t('st.graded')} · ${fmt.n(r.s.graded)}`} />}
      <span className="text-sm text-ags-slate tabular">{t('td.handedIn', { n: r.s.handedIn, total: r.s.total })}</span>
      <ChevronRight aria-hidden="true" className="w-5 h-5 text-slate-400 flip-rtl" />
    </button>
  );
  return (
    <div>
      <PageHeader title={t('sub.queue')} subtitle={t('sub.queue.hint')} />
      <div className="space-y-3 mb-8">{waiting.map((r) => <Row key={r.a.id + r.cls} r={r} />)}{!waiting.length && <div className="card"><EmptyState icon={CheckCircle2} title={t('td.att.none')} /></div>}</div>
      <SectionTitle icon={ClipboardList} title={t('sub.allAssignments')} />
      <div className="space-y-3">{others.map((r) => <Row key={r.a.id + r.cls} r={r} />)}</div>
    </div>
  );
}

const FILTER_MATCH = {
  all: () => true, toGrade: (s) => s === 'submitted' || s === 'late', submitted: (s) => s === 'submitted', late: (s) => s === 'late',
  missing: (s) => s === 'missing', graded: (s) => s === 'graded', returned: (s) => s === 'returned' || s === 'revision', notYet: (s) => s === 'notYet',
};

function SubmissionsTable({ id, cls: clsIn, filter: filterIn }) {
  const { t, fmt, lang, now, db, navigate, actions } = useApp();
  const a = db.assignments[id];
  const [cls, setCls] = useState(clsIn && a?.classes.includes(clsIn) ? clsIn : a?.classes[0]);
  const [filter, setFilter] = useState(filterIn || 'all');
  if (!a) return <div className="card"><EmptyState title={t('a.notFound')} /></div>;
  const roster = ROSTERS[cls] || [];
  const rows = roster.map((stu) => { const sub = db.submissions[subKey(a.id, stu.id)]; return { stu, sub, st: teacherStatus(a, sub, now) }; });
  const s = classStats(db, a, cls, now);
  const counts = Object.fromEntries(Object.keys(FILTER_MATCH).map((k) => [k, rows.filter((r) => FILTER_MATCH[k](r.st)).length]));
  const shown = rows.filter((r) => FILTER_MATCH[filter](r.st));
  const chips = ['all', 'toGrade', 'submitted', 'late', 'missing', 'graded', 'returned', 'notYet'].filter((k) => k === 'all' || k === filter || counts[k] > 0);
  const chipLabel = { all: 'sub.all', toGrade: 'sub.toGrade', submitted: 'st.submitted', late: 'st.late', missing: 'st.missing', graded: 'st.graded', returned: 'st.returned', notYet: 'st.notYet' };
  const missingCount = counts.missing + counts.notYet;
  return (
    <div>
      <PageHeader onBack={() => navigate({ name: 'grading' })} backLabel={t('sub.queue')} title={a.title}
        eyebrow={<SubjectTag code={a.subject} />}
        subtitle={`${a.dueAt > now ? dueLabel(t, fmt, a.dueAt, now) : t('due.was', { when: `${fmt.date(a.dueAt)} · ${fmt.time(a.dueAt)}` })} · ${t(`type.${submissionType(a)}`)} · ${t('pts', { n: a.points })}`}
        actions={<>
          <button type="button" className="btn btn-secondary btn-sm" disabled={!missingCount} onClick={() => actions.remind(a.id, cls)}><Megaphone aria-hidden="true" className="w-4 h-4" />{t('sub.remind')}</button>
          <button type="button" className="btn btn-primary btn-sm" disabled={!counts.graded} onClick={() => actions.returnAllGraded(a.id, cls)}><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('sub.returnAll')}{counts.graded ? ` (${fmt.n(counts.graded)})` : ''}</button>
        </>} />
      {a.classes.length > 1 && <div className="mb-4 scroll-x"><Segmented ariaLabel={t('b.classes')} value={cls} onChange={(v) => { setCls(v); setFilter('all'); }} options={a.classes.map((c) => ({ value: c, label: clsLabel(c, lang, true) }))} /></div>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard size="sm" icon={Users} value={t('td.handedIn', { n: s.handedIn, total: s.total })} label={t('sub.handedIn')} />
        <StatCard size="sm" icon={CheckCircle2} tone="green" value={fmt.n(s.onTime)} label={t('in.onTime')} />
        <StatCard size="sm" icon={Clock} tone="amber" value={fmt.n(s.lateHanded)} label={t('in.late')} />
        <StatCard size="sm" icon={AlertCircle} tone="red" value={fmt.n(s.missing)} label={t('in.missing')} />
      </div>
      <div className="scroll-x mb-3" role="group" aria-label={t('sub.filter')}><div className="flex gap-2 w-max pb-1">
        {chips.map((k) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
            className={cx('rounded-full px-3 py-1.5 text-sm ring-1 min-h-[2.25rem] inline-flex items-center gap-1.5', filter === k ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white ring-slate-200 hover:ring-ags-indigo text-ags-navy')}>
            {t(chipLabel[k])}<span className={cx('text-xs tabular rounded-full px-1.5', filter === k ? 'bg-white/20' : 'bg-slate-100')}>{fmt.n(counts[k])}</span>
          </button>
        ))}
      </div></div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <caption className="sr-only">{a.title} — {clsLabel(cls, lang, true)}</caption>
          <thead className="bg-slate-50 text-ags-slate text-xs hidden md:table-header-group">
            <tr><th scope="col" className="text-start font-medium px-4 py-3">{t('sub.student')}</th><th scope="col" className="text-start font-medium px-4 py-3">{t('sub.status')}</th><th scope="col" className="text-start font-medium px-4 py-3">{t('sub.time')}</th><th scope="col" className="text-start font-medium px-4 py-3">{t('sub.mark')}</th><th scope="col" className="px-4 py-3"><span className="sr-only">{t('ta.actions')}</span></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map(({ stu, sub, st }) => {
              const has = HANDED_IN.includes(st);
              return (
                <tr key={stu.id} className="hover:bg-ags-indigo-50/40 flex flex-wrap md:table-row items-center px-4 py-3 md:p-0 gap-x-3 gap-y-1.5">
                  <th scope="row" className="md:px-4 md:py-3 text-start font-medium text-ags-navy flex items-center gap-2.5 w-full md:w-auto md:table-cell">
                    <span className="inline-flex items-center gap-2.5"><Avatar name={stu.en} size="sm" /><bdi>{studentName(stu, lang)}</bdi></span>
                  </th>
                  <td className="md:px-4 md:py-3"><StatusChip status={st} /></td>
                  <td className="md:px-4 md:py-3 text-ags-slate tabular text-xs md:text-sm">{sub?.submittedAt && has ? <>{fmt.date(sub.submittedAt)} · {fmt.time(sub.submittedAt)}{sub.late && <span className="block text-amber-800 text-xs">{t('late.days', { n: lateDays(a.dueAt, sub.submittedAt) })}</span>}</> : '—'}</td>
                  <td className="md:px-4 md:py-3 tabular font-medium">{typeof sub?.mark === 'number' && ['graded', 'returned', 'revision'].includes(st) ? fmt.score(sub.mark, a.points) : '—'}</td>
                  <td className="md:px-4 md:py-3 ms-auto md:text-end">
                    {has ? <button type="button" className={cx('btn btn-sm', st === 'submitted' || st === 'late' ? 'btn-primary' : 'btn-secondary')} onClick={() => navigate({ name: 'grade', id: a.id, sid: stu.id })}>{st === 'submitted' || st === 'late' ? <><PenLine aria-hidden="true" className="w-4 h-4" />{t('sub.grade')}</> : <><Eye aria-hidden="true" className="w-4 h-4" />{t('sub.view')}</>}</button>
                      : <button type="button" className="btn btn-ghost btn-sm" onClick={() => actions.remind(a.id, cls, [stu.id])}><Bell aria-hidden="true" className="w-4 h-4" />{t('sub.remindOne')}</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!shown.length && <EmptyState title={t('sub.empty')} />}
      </div>
    </div>
  );
}

const QUICK_COMMENTS = ['qc.working', 'qc.signs', 'qc.improve', 'qc.simplify', 'qc.units'];

function GradingView({ id, sid }) {
  const { t, fmt, lang, now, db, navigate, actions } = useApp();
  const a = db.assignments[id]; const stu = STUDENTS[sid];
  const sub = a ? db.submissions[subKey(a.id, sid)] : null;
  const [rub, setRub] = useState(() => ({ ...(sub?.rubricScores || {}) }));
  const [comment, setComment] = useState(sub?.comment || '');
  const [anns, setAnns] = useState(() => JSON.parse(JSON.stringify(sub?.annotations || {})));
  const [override, setOverride] = useState(null);
  const [tool, setTool] = useState('pen');
  const [pageIdx, setPageIdx] = useState(0);
  if (!a || !stu) return <div className="card"><EmptyState title={t('a.notFound')} /></div>;
  const cls = stu.cls;
  const st = teacherStatus(a, sub, now);
  const roster = ROSTERS[cls];
  const statusOf = (s) => teacherStatus(a, db.submissions[subKey(a.id, s.id)], now);
  const idx = roster.findIndex((s) => s.id === sid);
  const after = [...roster.slice(idx + 1), ...roster.slice(0, idx)];
  const nextStu = after.find((s) => ['submitted', 'late'].includes(statusOf(s))) || after.find((s) => HANDED_IN.includes(statusOf(s)));
  const before = [...roster.slice(0, idx)].reverse();
  const prevStu = before.find((s) => HANDED_IN.includes(statusOf(s)));
  const left = roster.filter((s) => ['submitted', 'late'].includes(statusOf(s))).length;
  const has = HANDED_IN.includes(st);
  const pages = has ? a.blocks.filter((b) => b.type === 'paper').flatMap((b) => sub.answers[b.id] || []) : [];
  const page = pages[clamp(pageIdx, 0, Math.max(0, pages.length - 1))];
  const auto = has ? autoScore(a, sub.answers) : { score: 0, max: 0, count: 0 };
  const rubTotal = sum(a.rubric.map((c) => rub[c.id] || 0));
  const raw = round1(auto.score + rubTotal);
  const days = has && sub.late ? lateDays(a.dueAt, sub.submittedAt) : 0;
  const deduct = a.latePolicy?.deduct && days ? Math.min(1, ((a.latePolicy.pct || 0) / 100) * days) : 0;
  const suggested = round1(raw * (1 - deduct));
  const finalMark = override != null ? override : suggested;
  const addAnn = (an) => page && setAnns((m) => ({ ...m, [page.id]: [...(m[page.id] || []), an] }));
  const undo = () => page && setAnns((m) => ({ ...m, [page.id]: (m[page.id] || []).slice(0, -1) }));
  const save = (status) => actions.saveGrade(a.id, sid, { rubricScores: rub, comment: comment.trim(), annotations: anns, mark: clamp(finalMark, 0, a.points), autoScore: auto.score }, status);
  const goStu = (s) => s && navigate({ name: 'grade', id: a.id, sid: s.id });
  const tools = [['pen', PenLine, 'g.pen'], ['tick', Check, 'g.tick'], ['cross', X, 'g.cross'], ['text', Type, 'g.text']];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button type="button" onClick={() => navigate({ name: 'submissions', id: a.id, cls })} className="btn btn-ghost btn-sm -ms-2"><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('sub.title')}</button>
        <span className="text-sm text-ags-slate ms-auto">{left ? t('g.queueLeft', { n: left, cls: clsLabel(cls, lang) }) : t('g.allDone')}</span>
        <button type="button" className="btn btn-secondary btn-sm" disabled={!prevStu} onClick={() => goStu(prevStu)}><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('g.prev')}</button>
        <button type="button" className="btn btn-primary btn-sm" disabled={!nextStu} onClick={() => goStu(nextStu)}>{t('g.next')}<ArrowRight aria-hidden="true" className="w-4 h-4 flip-rtl" /></button>
      </div>
      <div className="card p-4 sm:p-5 mb-5 flex flex-wrap items-center gap-4">
        <Avatar name={stu.en} size="lg" />
        <div className="flex-1 min-w-[12rem]">
          <h1 className="text-xl font-bold text-ags-navy"><bdi>{studentName(stu, lang)}</bdi></h1>
          <p className="text-sm text-ags-slate" dir="auto">{a.title} · {clsLabel(cls, lang, true)}</p>
        </div>
        <div className="text-end">
          <StatusChip status={st} size="lg" />
          {has && <p className="text-xs text-ags-slate mt-1.5 tabular">{fmt.date(sub.submittedAt)} · {fmt.time(sub.submittedAt)}{sub.late && <span className="text-amber-800"> · {t('late.days', { n: days })}</span>}</p>}
        </div>
      </div>

      {!has ? (
        <div className="card"><EmptyState icon={Clock} title={t('g.noSubmission', { name: studentFirst(stu, lang) })} action={<button type="button" className="btn btn-secondary" onClick={() => actions.remind(a.id, cls, [stu.id])}><Bell aria-hidden="true" className="w-4 h-4" />{t('g.remindOne', { name: studentFirst(stu, lang) })}</button>} /></div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_23rem] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            {pages.length > 0 && (
              <section className="card p-4 sm:p-5" aria-labelledby="pg-h">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h2 id="pg-h" className="font-bold text-ags-navy me-auto">{t('g.pages')}</h2>
                  {pages.length > 1 && <Segmented size="sm" ariaLabel={t('g.pages')} value={pageIdx} onChange={setPageIdx} options={pages.map((p, i) => ({ value: i, label: t('p.page', { n: i + 1 }) }))} />}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mb-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 p-1.5" role="toolbar" aria-label={t('g.tools')}>
                  {tools.map(([k, I, label]) => (
                    <button key={k} type="button" aria-pressed={tool === k} onClick={() => setTool(k)} className={cx('btn btn-sm', tool === k ? 'btn-primary' : 'btn-ghost')}><I aria-hidden="true" className="w-4 h-4" />{t(label)}</button>
                  ))}
                  <span className="w-px h-6 bg-slate-300 mx-1" aria-hidden="true" />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={undo} disabled={!(anns[page?.id] || []).length}><Undo2 aria-hidden="true" className="w-4 h-4" />{t('g.undo')}</button>
                  <span className="text-xs text-ags-slate ms-auto px-2 hidden sm:inline">{t('g.annotHint')}</span>
                </div>
                {page && <div className="max-w-xl mx-auto"><AnnotatedPage src={pageSrc(page)} annotations={anns[page.id] || []} editable tool={tool} onAdd={addAnn} alt={t('p.page', { n: pageIdx + 1 })} /></div>}
              </section>
            )}
            {a.blocks.some((b) => b.type !== 'paper') && (
              <section className="card p-4 sm:p-5" aria-labelledby="ans-h">
                <h2 id="ans-h" className="font-bold text-ags-navy mb-3">{t('g.answers')}</h2>
                <ol className="space-y-3">
                  {a.blocks.filter((b) => b.type !== 'paper').map((b) => {
                    const v = sub.answers[b.id]; const pts = isAuto(b) ? scoreBlock(b, v) : null;
                    return (
                      <li key={b.id} className="rounded-xl ring-1 ring-slate-200 p-3.5">
                        <div className="flex items-start gap-2">
                          <p className="font-medium text-ags-navy flex-1" dir={a.lang === 'ar' ? 'rtl' : 'ltr'}>{a.blocks.indexOf(b) + 1}. {b.prompt}</p>
                          {pts != null && <span className={cx('text-xs font-bold rounded-full px-2 py-0.5 ring-1 inline-flex items-center gap-1', pts >= b.points ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-rose-50 text-rose-800 ring-rose-200')}>{pts >= b.points ? <Check aria-hidden="true" className="w-3 h-3" /> : <X aria-hidden="true" className="w-3 h-3" />}{fmt.score(pts, b.points)}</span>}
                          {pts == null && <span className="text-xs text-ags-slate">{t('pts', { n: b.points })}</span>}
                        </div>
                        <div className="mt-2 text-sm text-ags-navy/90"><AnswerSummary a={a} b={b} v={v} /></div>
                        {b.type === 'file' && (v || []).some((f) => f.src) && <div className="mt-2 flex gap-2">{v.filter((f) => f.src).map((f) => <img key={f.id} src={f.src} alt={f.name} className="max-h-48 rounded-lg ring-1 ring-slate-200" />)}</div>}
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}
            {sub.note && <section className="card p-4"><p className="text-sm"><span className="font-bold text-ags-navy">{t('g.noteFromStudent')}:</span> <span dir="auto">{sub.note}</span></p></section>}
          </div>

          <aside className="card p-5 space-y-5 lg:sticky lg:top-20" aria-label={t('g.panel')}>
            {auto.count > 0 && (
              <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3.5 flex items-center gap-3">
                <ListChecks aria-hidden="true" className="w-5 h-5 text-emerald-700" />
                <span className="flex-1 text-sm text-emerald-950">{t('g.auto')}</span>
                <b className="tabular text-emerald-950">{fmt.score(auto.score, auto.max)}</b>
              </div>
            )}
            {a.rubric.length > 0 && (
              <div>
                <h2 className="font-bold text-ags-navy mb-2">{t('g.rubric')}</h2>
                <div className="space-y-3">
                  {a.rubric.map((c) => {
                    const name = c.key ? t(`rub.${c.key}`) : c.label;
                    return (
                      <div key={c.id}>
                        <div className="flex justify-between text-sm mb-1"><span id={`rc_${c.id}`}>{name}</span><span className="tabular text-ags-slate">{fmt.score(rub[c.id] ?? 0, c.max)}</span></div>
                        <div role="radiogroup" aria-labelledby={`rc_${c.id}`} className="flex flex-wrap gap-1">
                          {Array.from({ length: c.max + 1 }, (_, v) => (
                            <button key={v} type="button" role="radio" aria-checked={(rub[c.id] ?? -1) === v} onClick={() => { setRub((r) => ({ ...r, [c.id]: v })); setOverride(null); }}
                              className={cx('min-w-[2.25rem] h-9 rounded-lg text-sm font-bold tabular ring-1 transition-colors', (rub[c.id] ?? -1) === v ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-300 hover:ring-ags-indigo')}>{fmt.n(v)}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <label htmlFor="g-final" className="label">{t('g.final')}</label>
              <div className="flex items-center gap-2">
                <input id="g-final" type="number" min={0} max={a.points} step={0.5} className="input !w-24 text-lg font-bold tabular" value={finalMark} onChange={(e) => setOverride(clamp(Number(e.target.value) || 0, 0, a.points))} />
                <span className="text-ags-slate">/ {fmt.n(a.points)}</span>
                {override != null && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOverride(null)}>{t('g.useSuggested')}</button>}
              </div>
              <p className="hint mt-1.5">{t('g.breakdown', { auto: auto.score, rub: rubTotal })}</p>
              {deduct > 0 && <p className="text-xs text-amber-800 mt-1">{t('g.deductSuggest', { pct: fmt.pct(deduct), mark: suggested })}</p>}
            </div>
            <div>
              <label htmlFor="g-comment" className="label">{t('g.comment')}</label>
              <textarea id="g-comment" className="input min-h-[6.5rem]" dir="auto" value={comment} placeholder={t('g.commentPh')} onChange={(e) => setComment(e.target.value)} />
              <p className="text-xs text-ags-slate mt-2 mb-1.5">{t('g.quick')}</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COMMENTS.map((k) => (
                  <button key={k} type="button" onClick={() => setComment((c) => (c.trim() ? `${c.trim()} ${t(k)}.` : `${t(k)}.`))} className="rounded-full px-2.5 py-1 text-xs ring-1 ring-slate-300 bg-white hover:ring-ags-indigo hover:bg-ags-indigo-50 text-ags-navy min-h-[2rem]">+ {t(k)}</button>
                ))}
              </div>
            </div>
            {(st === 'returned' || st === 'revision') && sub.returnedAt && (
              <p className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3 text-sm text-emerald-950 flex gap-2" role="status"><CheckCircle2 aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t(st === 'revision' ? 'g.revised' : 'g.returned', { name: studentFirst(stu, lang) })} · {agoLabel(t, sub.returnedAt, now)}</p>
            )}
            <div className="grid gap-2">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => save('returned')}><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('g.return')}</button>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => save('revision')}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('g.revise')}</button>
                <button type="button" className="btn btn-ghost" onClick={() => save('graded')}><BadgeCheck aria-hidden="true" className="w-4 h-4" />{t('g.save')}</button>
              </div>
              {nextStu && <button type="button" className="btn btn-ghost" onClick={() => goStu(nextStu)}>{t('g.next')}: <bdi>{studentFirst(nextStu, lang)}</bdi><ArrowRight aria-hidden="true" className="w-4 h-4 flip-rtl" /></button>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ---------- class insights (plain SVG / div charts, no library) ---------- */

const SERIES = { onTime: '#0F8A5F', late: '#D08700', missing: '#D9486A' };

function ChartCard({ title, subtitle, legend, table, children, id }) {
  const { t } = useApp();
  const [asTable, setAsTable] = useState(false);
  return (
    <section className="card p-5" aria-labelledby={id}>
      <div className="flex flex-wrap items-start gap-2 mb-4">
        <div className="flex-1 min-w-[12rem]">
          <h2 id={id} className="font-bold text-ags-navy">{title}</h2>
          {subtitle && <p className="text-xs text-ags-slate mt-0.5">{subtitle}</p>}
        </div>
        {table && <button type="button" className="btn btn-ghost btn-sm" aria-pressed={asTable} onClick={() => setAsTable((v) => !v)}>{asTable ? <BarChart3 aria-hidden="true" className="w-4 h-4" /> : <Table2 aria-hidden="true" className="w-4 h-4" />}{asTable ? t('in.chart') : t('in.table')}</button>}
      </div>
      {legend && !asTable && <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-ags-slate">{legend}</div>}
      {asTable ? table : children}
    </section>
  );
}
function LegendItem({ color, hatch, icon: I, label }) {
  return <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className={cx('w-3 h-3 rounded-sm', hatch && 'hatch')} style={hatch ? undefined : { background: color }} />{I && <I aria-hidden="true" className="w-3.5 h-3.5" />}{label}</span>;
}
function DataTable({ head, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-xs text-ags-slate">{head.map((h, i) => <th key={i} scope="col" className="text-start font-medium py-2 pe-3">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="text-start font-medium py-2 pe-3" dir="auto">{c}</th> : <td key={j} className="py-2 pe-3 tabular">{c}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

function LineChart({ points, label }) {
  const { fmt, dir } = useApp();
  const [hover, setHover] = useState(null);
  const W = 620; const H = 230; const P = { l: 40, r: 24, t: 18, b: 36 };
  const n = points.length;
  const xAt = (i) => { const x = n <= 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (n - 1); return dir === 'rtl' ? W - P.r - x : P.l + x; };
  const yAt = (v) => P.t + (1 - v) * (H - P.t - P.b);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${xAt(i)} ${yAt(p.v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={label}>
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <g key={g}>
          <line x1={dir === 'rtl' ? P.r : P.l} x2={dir === 'rtl' ? W - P.l : W - P.r} y1={yAt(g)} y2={yAt(g)} stroke="#E6E6EF" strokeWidth="1" />
          <text x={dir === 'rtl' ? W - P.l + 8 : P.l - 8} y={yAt(g) + 4} fontSize="11" fill={BRAND.slate} textAnchor={dir === 'rtl' ? 'start' : 'end'}>{fmt.pct(g)}</text>
        </g>
      ))}
      <path d={path} fill="none" stroke={BRAND.indigo} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={`${p.label}: ${fmt.pct(p.v)}`}>
          <circle cx={xAt(i)} cy={yAt(p.v)} r="14" fill="transparent" />
          <circle cx={xAt(i)} cy={yAt(p.v)} r={hover === i ? 6.5 : 5} fill={p.open ? '#fff' : BRAND.indigo} stroke={p.open ? BRAND.indigo : '#fff'} strokeWidth="2" />
          <text x={xAt(i)} y={H - 12} fontSize="11" fill={BRAND.slate} textAnchor="middle">{p.short}</text>
        </g>
      ))}
      {n > 0 && hover == null && <text x={xAt(n - 1)} y={yAt(points[n - 1].v) - 12} fontSize="12" fontWeight="700" fill={BRAND.navy} textAnchor="middle">{fmt.pct(points[n - 1].v)}</text>}
      {hover != null && (() => {
        const p = points[hover]; const x = xAt(hover); const y = yAt(p.v); const w = Math.max(120, p.label.length * 6.4 + 20);
        const bx = clamp(x - w / 2, 4, W - w - 4);
        return (
          <g pointerEvents="none">
            <line x1={x} x2={x} y1={P.t} y2={H - P.b} stroke={BRAND.indigo} strokeOpacity=".25" />
            <rect x={bx} y={Math.max(2, y - 54)} width={w} height="40" rx="8" fill={BRAND.navy} />
            <text x={bx + w / 2} y={Math.max(2, y - 54) + 17} fontSize="11" fill="#fff" textAnchor="middle">{p.label}</text>
            <text x={bx + w / 2} y={Math.max(2, y - 54) + 32} fontSize="12" fontWeight="700" fill={BRAND.gold} textAnchor="middle">{fmt.pct(p.v)}</text>
          </g>
        );
      })()}
    </svg>
  );
}

function ClassInsights({ cls: clsIn }) {
  const { t, fmt, lang, now, db, navigate, actions, guide, markGuide } = useApp();
  const [cls, setCls] = useState(clsIn || '8B');
  useEffect(() => { if (guide.steps[2]) markGuide(5); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const list = teacherAssignments(db).filter((a) => a.classes.includes(cls) && isPublished(a, now) && now - a.dueAt < 42 * DAY).sort((x, y) => x.dueAt - y.dueAt);
  const data = list.map((a) => ({ a, s: classStats(db, a, cls, now), open: a.dueAt > now }));
  const roster = ROSTERS[cls];
  const support = roster.map((stu) => {
    let miss = 0; const marks = [];
    data.forEach(({ a }) => { const sub = db.submissions[subKey(a.id, stu.id)]; const st = teacherStatus(a, sub, now); if (st === 'missing') miss += 1; if (sub && typeof sub.mark === 'number' && ['graded', 'returned', 'revision'].includes(st)) marks.push(sub.mark / a.points); });
    const avg = marks.length ? sum(marks) / marks.length : null;
    return { stu, miss, avg, flag: miss >= 3 || (avg != null && avg < 0.5) };
  }).filter((x) => x.flag);
  const trend = data.filter((d) => d.s.avg != null).map((d) => ({ v: d.s.avg, label: d.a.title, short: fmt.dateNoWd(d.a.dueAt), open: d.open }));
  const shortTitle = (a) => (a.title.length > 26 ? `${a.title.slice(0, 25)}…` : a.title);
  return (
    <div>
      <PageHeader title={t('in.title')} subtitle={t('in.subtitle')}
        actions={<Segmented ariaLabel={t('b.classes')} value={cls} onChange={setCls} options={SARAH_CLASSES.map((c) => ({ value: c, label: clsLabel(c, lang) }))} />} />
      <p className="mb-5 text-sm text-ags-slate flex items-center gap-2"><Lock aria-hidden="true" className="w-4 h-4" />{t('in.privacy')}</p>
      <div className="grid xl:grid-cols-2 gap-5">
        <ChartCard id="ch-comp" title={t('in.completion')} subtitle={clsLabel(cls, lang, true)}
          table={<DataTable head={[t('in.assignment'), t('in.rate'), t('sub.handedIn')]} rows={data.map((d) => [d.a.title, fmt.pct(d.s.rate), t('td.handedIn', { n: d.s.handedIn, total: d.s.total })])} />}>
          <ul className="space-y-3">
            {data.map((d) => (
              <li key={d.a.id}>
                <HoverTip label={`${d.a.title}: ${fmt.pct(d.s.rate)}`} tip={`${t('td.handedIn', { n: d.s.handedIn, total: d.s.total })}${d.open ? ` · ${t('in.open')}` : ''}`} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] sm:grid-cols-[minmax(0,13rem)_1fr_3rem] items-center gap-3 rounded-lg focus-visible:bg-ags-indigo-50">
                  <span className="text-sm text-ags-navy truncate" dir="auto">{shortTitle(d.a)}{d.open && <span className="ms-1.5 text-[0.65rem] font-bold uppercase text-ags-indigo bg-ags-indigo-50 rounded px-1">{t('in.open')}</span>}</span>
                  <span className="h-5 bg-slate-100 rounded-e overflow-hidden"><span className={cx('block h-full rounded-e transition-all duration-700', d.open ? 'bg-ags-indigo/70' : 'bg-ags-indigo')} style={{ width: `${d.s.rate * 100}%`, maxWidth: '100%' }} /></span>
                  <span className="text-sm font-bold tabular text-ags-navy text-end">{fmt.pct(d.s.rate)}</span>
                </HoverTip>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard id="ch-time" title={t('in.timeliness')} subtitle={clsLabel(cls, lang, true)}
          legend={<><LegendItem color={SERIES.onTime} icon={CheckCircle2} label={t('in.onTime')} /><LegendItem color={SERIES.late} icon={Clock} label={t('in.late')} /><LegendItem color={SERIES.missing} icon={AlertCircle} label={t('in.missing')} /><LegendItem hatch label={t('in.pending')} /></>}
          table={<DataTable head={[t('in.assignment'), t('in.onTime'), t('in.late'), t('in.missing'), t('in.pending')]} rows={data.map((d) => [d.a.title, fmt.n(d.s.onTime), fmt.n(d.s.lateHanded), fmt.n(d.s.missing), fmt.n(d.s.notYet)])} />}>
          <ul className="space-y-3">
            {data.map((d) => {
              const segs = [['onTime', d.s.onTime], ['late', d.s.lateHanded], ['missing', d.s.missing], ['pending', d.s.notYet]].filter(([, v]) => v > 0);
              return (
                <li key={d.a.id}>
                  <HoverTip label={d.a.title} tip={`${t('in.onTime')} ${fmt.n(d.s.onTime)} · ${t('in.late')} ${fmt.n(d.s.lateHanded)} · ${t('in.missing')} ${fmt.n(d.s.missing)}${d.s.notYet ? ` · ${t('in.pending')} ${fmt.n(d.s.notYet)}` : ''}`} className="grid grid-cols-[minmax(0,10rem)_1fr] sm:grid-cols-[minmax(0,13rem)_1fr] items-center gap-3 rounded-lg">
                    <span className="text-sm text-ags-navy truncate" dir="auto">{shortTitle(d.a)}</span>
                    <span className="flex h-5 gap-0.5">
                      {segs.map(([k, v], i) => (
                        <span key={k} className={cx('h-full', k === 'pending' && 'hatch', i === 0 && 'rounded-s', i === segs.length - 1 && 'rounded-e')} style={{ width: `${(v / d.s.total) * 100}%`, background: k === 'pending' ? undefined : SERIES[k] }} />
                      ))}
                    </span>
                  </HoverTip>
                </li>
              );
            })}
          </ul>
        </ChartCard>

        <ChartCard id="ch-trend" title={t('in.trend')} subtitle={t('in.trend.sub')}
          table={<DataTable head={[t('in.assignment'), t('in.avgMark')]} rows={trend.map((p) => [p.label, fmt.pct(p.v)])} />}>
          {trend.length ? <LineChart points={trend} label={t('in.trend')} /> : <EmptyState title={t('in.noMarks')} />}
        </ChartCard>

        <section className="card p-5" aria-labelledby="sup-h">
          <SectionTitle id="sup-h" icon={Users} title={t('in.support')} count={support.length} />
          <p className="text-xs text-ags-slate -mt-2 mb-3">{t('in.support.hint')}</p>
          {support.length ? (
            <ul className="space-y-2">
              {support.map(({ stu, miss, avg }) => (
                <li key={stu.id} className="flex flex-wrap items-center gap-3 rounded-xl ring-1 ring-slate-200 p-3">
                  <Avatar name={stu.en} size="sm" />
                  <span className="flex-1 min-w-[10rem]">
                    <span className="block font-medium text-ags-navy"><bdi>{studentName(stu, lang)}</bdi></span>
                    <span className="block text-xs text-ags-slate">{miss >= 1 && t('in.missingCount', { n: miss })}{miss >= 1 && avg != null && ' · '}{avg != null && t('in.avg', { pct: fmt.pct(avg) })}</span>
                  </span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => actions.remindStudent(stu.id)}><Bell aria-hidden="true" className="w-4 h-4" />{t('sub.remindOne')}</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { const last = [...data].reverse().find((d) => HANDED_IN.includes(teacherStatus(d.a, db.submissions[subKey(d.a.id, stu.id)], now))); if (last) navigate({ name: 'grade', id: last.a.id, sid: stu.id }); else navigate({ name: 'submissions', id: data[data.length - 1]?.a.id, cls }); }}>{t('in.viewWork')}</button>
                </li>
              ))}
            </ul>
          ) : <EmptyState icon={CheckCircle2} title={t('in.noSupport')} />}
        </section>
      </div>
    </div>
  );
}

/* ============================================================================
 * 12. ADMIN OVERVIEW — Head of Middle School (fictional)
 * Grade 8 data comes live from this session; everything else is fixed sample data.
 * ========================================================================== */

const SUBJECT_TEACHER = (subject, grade) => {
  if (subject === 'math') return grade === 8 ? 'sarah' : 'farouk';
  if (subject === 'english') return grade === 8 ? 'emily' : 'maha';
  return { science: 'yusuf', arabic: 'mona', islamic: 'abdullah', social: 'hassan', ict: 'adel', art: 'lina' }[subject];
};

function adminEntries(db, now) {
  const out = [];
  const rnd = mulberry32(7310);
  [-1, 0, 1].forEach((w) => {
    const ws = schoolWeekStart(now, w);
    ADMIN_CLASSES.forEach((cls) => {
      const { g } = parseCls(cls);
      CORE_SUBJECTS.forEach((subject) => {
        if (subject === 'math' && g === 8) return; // live
        if (cls === '8B') return; // 8B comes from the session's assignments
        const count = { math: 2, english: 1, science: 1, arabic: 1, islamic: 1 }[subject] ?? (rnd() < 0.5 ? 1 : 0);
        for (let k = 0; k < count; k += 1) {
          let day = Math.floor(rnd() * 5);
          if (cls === '7B' && w === 0 && ['math', 'english', 'science', 'arabic'].includes(subject) && k === 0) day = 2; // an overloaded Tuesday
          const dueAt = ws + day * DAY + 19 * HOUR;
          const size = 22 + Math.floor(rnd() * 4);
          let handed; let late = 0;
          if (dueAt < now) { const on = 0.72 + rnd() * 0.2; const lt = 0.03 + rnd() * 0.07; handed = Math.min(size, Math.round(size * (on + lt))); late = Math.round(size * lt); }
          else handed = Math.round(size * rnd() * 0.4);
          out.push({ cls, grade: g, subject, teacherId: SUBJECT_TEACHER(subject, g), dueAt, size, handed, late, missing: dueAt < now ? size - handed : 0 });
        }
      });
    });
  });
  // Grade 8B, all subjects, from the session's real assignments.
  Object.values(db.assignments).filter((a) => a.classes.includes('8B') && isPublished(a, now) && a.teacherId !== 'sarah').forEach((a) => {
    const r = mulberry32(hashStr(a.id)); const size = ROSTERS['8B'].length;
    const past = a.dueAt < now;
    const handed = past ? Math.round(size * (0.8 + r() * 0.15)) : Math.round(size * r() * 0.4);
    out.push({ cls: '8B', grade: 8, subject: a.subject, teacherId: a.teacherId, dueAt: a.dueAt, size, handed, late: past ? Math.round(size * 0.05) : 0, missing: past ? size - handed : 0 });
  });
  // Grade 8 Mathematics, live.
  teacherAssignments(db).filter((a) => isPublished(a, now)).forEach((a) => a.classes.forEach((cls) => {
    const s = classStats(db, a, cls, now);
    out.push({ cls, grade: 8, subject: 'math', teacherId: 'sarah', dueAt: a.dueAt, size: s.total, handed: s.handedIn, late: s.lateHanded, missing: s.missing, live: true, aid: a.id });
  }));
  return out;
}

const STATIC_BACKLOG = [
  { id: 'emily', grades: [8], toGrade: 14, turn: 2.1 }, { id: 'yusuf', grades: [7, 8], toGrade: 6, turn: 1.4 }, { id: 'mona', grades: [6, 7, 8], toGrade: 9, turn: 1.9 },
  { id: 'abdullah', grades: [6, 7, 8], toGrade: 3, turn: 1.2 }, { id: 'hassan', grades: [6, 7, 8], toGrade: 11, turn: 3.4 }, { id: 'adel', grades: [6, 7, 8], toGrade: 4, turn: 1.6 },
  { id: 'lina', grades: [6, 7, 8], toGrade: 2, turn: 2.8 }, { id: 'farouk', grades: [6, 7], toGrade: 17, turn: 3.1 }, { id: 'maha', grades: [6, 7], toGrade: 5, turn: 1.5 },
];
const STATIC_FOLLOWUP = [
  { key: 'fu_rakan', en: 'Rakan Al-Dosari', ar: 'راكان الدوسري', cls: '7A', missing: 4, subjects: ['science', 'english', 'arabic', 'ict'] },
  { key: 'fu_mazen', en: 'Mazen Khan', ar: 'مازن خان', cls: '6C', missing: 3, subjects: ['math', 'social', 'art'] },
  { key: 'fu_talal', en: 'Talal Al-Yami', ar: 'طلال اليامي', cls: '7C', missing: 3, subjects: ['english', 'islamic', 'math'] },
];

function AdminOverview() {
  const { t, fmt, lang, now, db, actions, guide, markGuide } = useApp();
  const [grade, setGrade] = useState('all');
  const [subject, setSubject] = useState('all');
  const [week, setWeek] = useState(0);
  useEffect(() => { if (guide.steps[2]) markGuide(6); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const entries = useMemo(() => adminEntries(db, now), [db, now]);
  const ws = schoolWeekStart(now, week); const we = ws + 7 * DAY;
  const inWeek = entries.filter((e) => e.dueAt >= ws && e.dueAt < we);
  const gOk = (e) => grade === 'all' || e.grade === Number(grade);
  const sOk = (e) => subject === 'all' || e.subject === subject;
  const sel = inWeek.filter((e) => gOk(e) && sOk(e));
  const rate = (xs) => (sum(xs.map((e) => e.size)) ? sum(xs.map((e) => e.handed)) / sum(xs.map((e) => e.size)) : 0);
  const outstanding = sum(sel.map((e) => e.size - e.handed));
  const lateCount = sum(sel.map((e) => e.late));

  // grading backlog
  const sarahRows = teacherAssignments(db).filter((a) => isPublished(a, now));
  const sarahToGrade = sum(sarahRows.flatMap((a) => a.classes.map((c) => classStats(db, a, c, now).toGrade)));
  const turns = Object.values(db.submissions).filter((s) => db.assignments[s.assignmentId]?.teacherId === 'sarah' && s.returnedAt && s.submittedAt && now - s.returnedAt < 30 * DAY).map((s) => (s.returnedAt - s.submittedAt) / DAY);
  const backlog = [{ id: 'sarah', grades: [8], toGrade: sarahToGrade, turn: turns.length ? round1(sum(turns) / turns.length) : 0, live: true }, ...STATIC_BACKLOG]
    .filter((b) => (grade === 'all' || b.grades.includes(Number(grade))) && (subject === 'all' || TEACHERS[b.id].subject === subject))
    .sort((x, y) => y.toGrade - x.toGrade);
  const totalBacklog = sum(backlog.map((b) => b.toGrade));
  const avgTurn = backlog.length ? round1(sum(backlog.map((b) => b.turn)) / backlog.length) : 0;

  // follow-up
  const live = [];
  SARAH_CLASSES.forEach((cls) => ROSTERS[cls].forEach((stu) => {
    const miss = sarahRows.filter((a) => a.classes.includes(cls) && now - a.dueAt < 42 * DAY && teacherStatus(a, db.submissions[subKey(a.id, stu.id)], now) === 'missing').length;
    if (miss >= 3) live.push({ key: `fu_${stu.id}`, en: stu.en, ar: stu.ar, cls, missing: miss, subjects: ['math'] });
  }));
  const followUp = [...live, ...STATIC_FOLLOWUP].filter((f) => (grade === 'all' || parseCls(f.cls).g === Number(grade)) && (subject === 'all' || f.subjects.includes(subject)));

  // load heatmap (all subjects)
  const loadClasses = ADMIN_CLASSES.filter((c) => grade === 'all' || parseCls(c).g === Number(grade));
  const days = [0, 1, 2, 3, 4].map((i) => ws + i * DAY + 12 * HOUR);
  const load = (cls, d) => inWeek.filter((e) => e.cls === cls && toYMD(e.dueAt) === toYMD(d)).length;
  const flags = loadClasses.flatMap((c) => days.map((d) => ({ c, d, n: load(c, d) }))).filter((x) => x.n >= 3);

  // activity feed (live)
  const events = [];
  Object.values(db.submissions).forEach((s) => {
    const a = db.assignments[s.assignmentId]; const stu = STUDENTS[s.studentId];
    if (!a || !stu || !a.classes.some((c) => ADMIN_CLASSES.includes(c))) return;
    if (s.submittedAt && ['submitted', 'graded', 'returned', 'revision'].includes(s.status) && now - s.submittedAt < 3 * DAY) events.push({ at: s.submittedAt, icon: Send, text: t('ad.act.submitted', { name: studentName(stu, lang), title: a.title }), meta: `${clsLabel(stu.cls, lang)} · ${subjName(a.subject, lang)}` });
    if (s.returnedAt && ['returned', 'revision'].includes(s.status) && now - s.returnedAt < 3 * DAY) events.push({ at: s.returnedAt, icon: CheckCircle2, text: t('ad.act.returned', { name: studentName(stu, lang), title: a.title }), meta: `${teacherName(a.teacherId, lang)} · ${clsLabel(stu.cls, lang)}` });
  });
  Object.values(db.assignments).forEach((a) => { if (isPublished(a, now) && now - a.publishAt < 4 * DAY && a.classes.some((c) => ADMIN_CLASSES.includes(c))) events.push({ at: a.publishAt, icon: ClipboardList, text: t('ad.act.published', { title: a.title, cls: clsList(a.classes, lang) }), meta: teacherName(a.teacherId, lang) }); });
  events.sort((x, y) => y.at - x.at);

  const Bars = ({ rows, id }) => (
    <ul className="space-y-2.5" aria-labelledby={id}>
      {rows.map((r) => (
        <li key={r.key}>
          <HoverTip label={`${r.label}: ${fmt.pct(r.v)}`} tip={r.tip} className="grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3 rounded-lg">
            <span className="text-sm text-ags-navy truncate flex items-center gap-1.5">{r.dot && <span aria-hidden="true" className="w-2 h-2 rounded-full shrink-0" style={{ background: r.dot }} />}{r.label}</span>
            <span className="h-5 bg-slate-100 rounded-e overflow-hidden"><span className="block h-full bg-ags-indigo rounded-e transition-all duration-700" style={{ width: `${r.v * 100}%` }} /></span>
            <span className="text-sm font-bold tabular text-end">{r.n ? fmt.pct(r.v) : '—'}</span>
          </HoverTip>
        </li>
      ))}
    </ul>
  );
  const gradeRows = [6, 7, 8].filter((g) => grade === 'all' || g === Number(grade)).map((g) => { const xs = inWeek.filter((e) => e.grade === g && sOk(e)); return { key: g, label: t('ad.gradeN', { g }), v: rate(xs), n: xs.length, tip: t('ad.tipHanded', { n: sum(xs.map((e) => e.handed)), total: sum(xs.map((e) => e.size)) }) }; });
  const subjRows = CORE_SUBJECTS.filter((s) => subject === 'all' || s === subject).map((s) => { const xs = inWeek.filter((e) => e.subject === s && gOk(e)); return { key: s, label: subjName(s, lang), dot: SUBJECTS[s].color, v: rate(xs), n: xs.length, tip: t('ad.tipHanded', { n: sum(xs.map((e) => e.handed)), total: sum(xs.map((e) => e.size)) }) }; });
  const cellTone = (n) => (n >= 3 ? 'bg-amber-100 ring-2 ring-amber-400 text-amber-950 font-bold' : n === 2 ? 'bg-ags-indigo-100 text-ags-navy' : n === 1 ? 'bg-ags-indigo-50 text-ags-navy' : 'bg-slate-50 text-slate-400');

  return (
    <div>
      <PageHeader title={t('ad.title')} subtitle={t('ad.subtitle')} eyebrow={<span className="text-xs font-medium text-ags-indigo">{t('ad.user')}</span>} />
      <div className="card p-4 mb-5 flex flex-wrap items-end gap-4">
        <div><label className="label" htmlFor="ad-g">{t('ad.grade')}</label>
          <select id="ad-g" className="input !w-44" value={grade} onChange={(e) => setGrade(e.target.value)}><option value="all">{t('ad.allGrades')}</option>{[6, 7, 8].map((g) => <option key={g} value={g}>{t('ad.gradeN', { g })}</option>)}</select></div>
        <div><label className="label" htmlFor="ad-s">{t('ad.subject')}</label>
          <select id="ad-s" className="input !w-52" value={subject} onChange={(e) => setSubject(e.target.value)}><option value="all">{t('filter.all')}</option>{CORE_SUBJECTS.map((s) => <option key={s} value={s}>{subjName(s, lang)}</option>)}</select></div>
        <div><p className="label">{t('ad.week')}</p>
          <Segmented ariaLabel={t('ad.week')} value={week} onChange={setWeek} options={[{ value: -1, label: t('ad.wk.prev') }, { value: 0, label: t('ad.wk.this') }, { value: 1, label: t('ad.wk.next') }]} /></div>
        <p className="text-xs text-ags-slate ms-auto self-center">{fmt.dateNoWd(ws)} – {fmt.dateNoWd(ws + 4 * DAY)}</p>
      </div>
      <p className="mb-5 text-xs text-ags-slate flex gap-2 items-start"><Info aria-hidden="true" className="w-4 h-4 shrink-0" />{t('ad.liveNote')}</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard size="sm" icon={TrendingUp} tone="green" value={fmt.pct(rate(sel))} label={t('ad.kpi.completion')} hint={t('ad.soFar')} />
        <StatCard size="sm" icon={Inbox} tone="indigo" value={fmt.n(outstanding)} label={t('ad.kpi.outstanding')} />
        <StatCard size="sm" icon={Clock} tone="amber" value={fmt.n(lateCount)} label={t('ad.kpi.late')} />
        <StatCard size="sm" icon={ClipboardList} tone="gold" value={fmt.n(totalBacklog)} label={t('ad.kpi.backlog')} />
        <StatCard size="sm" icon={CalendarClock} tone="grey" value={t('days', { n: avgTurn })} label={t('ad.kpi.turnaround')} />
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <ChartCard id="ad-byg" title={t('ad.byGrade')} subtitle={t('ad.soFar')} table={<DataTable head={[t('ad.grade'), t('in.rate')]} rows={gradeRows.map((r) => [r.label, r.n ? fmt.pct(r.v) : '—'])} />}>
          <Bars rows={gradeRows} id="ad-byg" />
        </ChartCard>
        <ChartCard id="ad-bys" title={t('ad.bySubject')} subtitle={t('ad.soFar')} table={<DataTable head={[t('ad.subject'), t('in.rate')]} rows={subjRows.map((r) => [r.label, r.n ? fmt.pct(r.v) : '—'])} />}>
          <Bars rows={subjRows} id="ad-bys" />
        </ChartCard>

        <section className="card p-5 xl:col-span-2" aria-labelledby="ad-load">
          <SectionTitle id="ad-load" icon={CalendarDays} title={t('ad.load')} />
          <p className="text-xs text-ags-slate -mt-2 mb-4">{t('ad.load.hint')}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-separate" style={{ borderSpacing: '4px' }}>
              <caption className="sr-only">{t('ad.load')}</caption>
              <thead><tr><th scope="col" className="text-start text-xs font-medium text-ags-slate px-2">{t('ad.class')}</th>{days.map((d) => <th key={d} scope="col" className="text-xs font-medium text-ags-slate">{fmt.weekdayShort(d)} <span className="tabular">{fmt.dayNum(d)}</span></th>)}</tr></thead>
              <tbody>
                {loadClasses.map((c) => (
                  <tr key={c}>
                    <th scope="row" className="text-start text-sm font-medium text-ags-navy px-2 whitespace-nowrap">{clsLabel(c, lang)}</th>
                    {days.map((d) => {
                      const n = load(c, d);
                      return (
                        <td key={d} className={cx('h-11 rounded-lg text-center text-sm tabular', cellTone(n))} aria-label={`${clsLabel(c, lang)} · ${fmt.weekday(d)}: ${t('week.count', { n })}${n >= 3 ? ` · ${t('ad.heavy')}` : ''}`}>
                          <span className="inline-flex items-center gap-1">{n >= 3 && <AlertTriangle aria-hidden="true" className="w-3.5 h-3.5" />}{n ? fmt.n(n) : '·'}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {flags.length ? flags.map((f) => (
              <span key={f.c + f.d} className="inline-flex items-center gap-2 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-3 py-2 text-sm text-amber-950"><AlertTriangle aria-hidden="true" className="w-4 h-4 text-amber-700" />{t('ad.load.flag', { cls: clsLabel(f.c, lang), n: f.n, day: fmt.weekday(f.d) })}</span>
            )) : <span className="text-sm text-ags-slate flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600" />{t('ad.load.none')}</span>}
          </div>
        </section>

        <section className="card p-5" aria-labelledby="ad-back">
          <SectionTitle id="ad-back" icon={ClipboardList} title={t('ad.backlog')} />
          <table className="w-full text-sm">
            <caption className="sr-only">{t('ad.backlog')}</caption>
            <thead><tr className="text-xs text-ags-slate"><th scope="col" className="text-start font-medium pb-2">{t('ad.teacher')}</th><th scope="col" className="text-end font-medium pb-2">{t('ad.toGrade')}</th><th scope="col" className="text-end font-medium pb-2">{t('ad.turn')}</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {backlog.map((b) => (
                <tr key={b.id}>
                  <th scope="row" className="text-start font-medium py-2.5">
                    <span className="flex items-center gap-2"><span>{teacherName(b.id, lang)}</span>{b.live && <span className="text-[0.65rem] font-bold rounded bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 px-1.5">{t('ad.live')}</span>}</span>
                    <span className="block text-xs text-ags-slate font-normal">{subjName(TEACHERS[b.id].subject, lang)}</span>
                  </th>
                  <td className="text-end tabular py-2.5"><span className={cx('inline-block min-w-[2rem] rounded-full px-2 py-0.5 font-bold', b.toGrade >= 15 ? 'bg-amber-100 text-amber-950' : 'bg-slate-100 text-ags-navy')}>{fmt.n(b.toGrade)}</span></td>
                  <td className={cx('text-end tabular py-2.5', b.turn >= 3 && 'text-amber-800 font-medium')}>{t('days', { n: b.turn })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card p-5" aria-labelledby="ad-fu">
          <SectionTitle id="ad-fu" icon={Users} title={t('ad.followUp')} count={followUp.length} />
          <p className="text-xs text-ags-slate -mt-2 mb-3">{t('ad.followUp.hint')}</p>
          <ul className="space-y-2">
            {followUp.map((f) => (
              <li key={f.key} className="flex flex-wrap items-center gap-3 rounded-xl ring-1 ring-slate-200 p-3">
                <Avatar name={f.en} size="sm" />
                <span className="flex-1 min-w-[10rem]">
                  <span className="block font-medium text-ags-navy"><bdi>{lang === 'ar' ? f.ar : f.en}</bdi> <span className="text-xs text-ags-slate font-normal">· {clsLabel(f.cls, lang)}</span></span>
                  <span className="block text-xs text-ags-slate">{t('in.missingCount', { n: f.missing })} · {f.subjects.map((s) => subjName(s, lang)).join(lang === 'ar' ? '، ' : ', ')}</span>
                </span>
                {db.notified[f.key]
                  ? <span className="text-sm text-emerald-800 inline-flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="w-4 h-4" />{t('ad.notified')}</span>
                  : <button type="button" className="btn btn-secondary btn-sm" onClick={() => actions.notifyHomeroom(f.key, f.cls)}><Bell aria-hidden="true" className="w-4 h-4" />{t('ad.notify')}</button>}
              </li>
            ))}
            {!followUp.length && <EmptyState icon={CheckCircle2} title={t('ad.followUp.none')} />}
          </ul>
        </section>

        <section className="card p-5 xl:col-span-2" aria-labelledby="ad-act">
          <SectionTitle id="ad-act" icon={Sparkles} title={t('ad.activity')} right={<span className="text-[0.7rem] font-bold rounded bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 px-1.5 py-0.5">{t('ad.live')}</span>} />
          <ul className="divide-y divide-slate-100">
            {events.slice(0, 8).map((e, i) => {
              const I = e.icon;
              return (
                <li key={i} className={cx('py-2.5 flex items-center gap-3', i === 0 && now - e.at < 10 * MIN && 'bg-ags-gold-50 -mx-2 px-2 rounded-lg')}>
                  <span className="w-8 h-8 rounded-lg bg-ags-indigo-50 text-ags-indigo inline-flex items-center justify-center shrink-0"><I aria-hidden="true" className="w-4 h-4 flip-rtl" /></span>
                  <span className="flex-1 min-w-0"><span className="block text-sm text-ags-navy" dir="auto">{e.text}</span><span className="block text-xs text-ags-slate">{e.meta}</span></span>
                  <span className="text-xs text-ags-slate whitespace-nowrap">{agoLabel(t, e.at, now)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ============================================================================
 * 13. APP ROOT — in-memory state, actions, routing
 * ========================================================================== */

const HOME_ROUTES = { student: { name: 'home' }, teacher: { name: 'home' }, admin: { name: 'home' } };
const TEXT_SIZES = { s: '87.5%', m: '100%', l: '112.5%', xl: '125%' };

export default function App() {
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('student');
  const [stage, setStageRaw] = useState('middle');
  const [db, setDb] = useState(() => buildSeed());
  const [routes, setRoutes] = useState(HOME_ROUTES);
  const [now, setNow] = useState(() => Date.now());
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState({ textSize: 'm', reduceMotion: false });
  const [guide, setGuide] = useState(() => ({ open: typeof window === 'undefined' || window.innerWidth >= 1024, aid: null, steps: {} }));
  const [builder, setBuilder] = useState(() => newDraft(Date.now()));
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const dbRef = useRef(db); dbRef.current = db;
  const guideRef = useRef(guide); guideRef.current = guide;

  const i18n = useMemo(() => makeI18n(lang), [lang]);
  const { t, fmt, dir } = i18n;
  const student = STAGE_STUDENT[stage];
  const route = routes[role];

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = dir; document.title = lang === 'ar' ? 'منصة الواجبات — AGS (نسخة تجريبية)' : 'AGS Homework Hub — Demo'; }, [lang, dir]);
  useEffect(() => { document.documentElement.style.fontSize = TEXT_SIZES[settings.textSize] || '100%'; }, [settings.textSize]);
  const viewKey = `${role}|${stage}|${route.name}|${route.id || ''}|${route.sid || ''}|${route.cls || ''}|${route.blockId || ''}`;
  useEffect(() => {
    setLoading(true); window.scrollTo({ top: 0 });
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, [viewKey]);

  const toast = useCallback((msg, opts = {}) => {
    const id = uid('t');
    setToasts((ts) => [...ts.slice(-2), { id, msg, ...opts }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), opts.action ? 7000 : 4500);
  }, []);
  const dismissToast = (id) => setToasts((ts) => ts.filter((x) => x.id !== id));
  const navigate = useCallback((r) => setRoutes((rs) => ({ ...rs, [role]: r })), [role]);
  const go = useCallback((r, rt, st) => { if (st) setStageRaw(st); setRole(r); setRoutes((rs) => ({ ...rs, [r]: rt })); }, []);
  const markGuide = useCallback((i) => setGuide((g) => (g.steps[i] ? g : { ...g, steps: { ...g.steps, [i]: true } })), []);
  const setStage = useCallback((s) => {
    setStageRaw(s); setRoutes((rs) => ({ ...rs, student: { name: 'home' } }));
    const stu = STAGE_STUDENT[s];
    toast(i18n.t('stage.switched', { name: studentName(stu, lang), cls: clsLabel(stu.cls, lang, true) }), { kind: 'info' });
  }, [i18n, lang, toast]);

  const actions = useMemo(() => {
    const upsert = (aid, sid, fn) => setDb((d) => {
      const k = subKey(aid, sid); const cur = d.submissions[k];
      const next = fn(cur);
      if (!next || next === cur) return d;
      return { ...d, submissions: { ...d.submissions, [k]: next } };
    });
    const blank = (aid, sid) => ({ id: uid('sub'), assignmentId: aid, studentId: sid, status: 'draft', answers: {}, annotations: {}, rubricScores: {}, comment: '', note: '', history: [] });
    const draftOnly = (fn) => (cur) => { if (cur && cur.status !== 'draft') return cur; return fn(cur); };
    return {
      saveDraft: (aid, sid, answers) => upsert(aid, sid, draftOnly((cur) => {
        if (!cur && !Object.keys(answers || {}).some((k) => isAnswered({ type: 'short' }, answers[k]) || answers[k] != null)) return cur;
        const base = cur || blank(aid, sid);
        return { ...base, answers: { ...base.answers, ...answers }, draftSavedAt: Date.now() };
      })),
      setPages: (aid, sid, bid, pages) => upsert(aid, sid, draftOnly((cur) => { const base = cur || blank(aid, sid); return { ...base, answers: { ...base.answers, [bid]: pages }, draftSavedAt: Date.now() }; })),
      saveNote: (aid, sid, note) => upsert(aid, sid, draftOnly((cur) => { if (!cur && !note) return cur; const base = cur || blank(aid, sid); return { ...base, note, draftSavedAt: Date.now() }; })),
      submit: (aid, sid, answers) => {
        const a = dbRef.current.assignments[aid]; const at = Date.now();
        const late = at > a.dueAt;
        upsert(aid, sid, (cur) => {
          const base = cur || blank(aid, sid);
          const merged = { ...base.answers, ...answers };
          return { ...base, answers: merged, status: 'submitted', submittedAt: at, late, resubmitting: false, draftSavedAt: at, autoScore: autoScore(a, merged).score };
        });
        if (sid === 's_omar' && guideRef.current.aid === aid) markGuide(2);
        return { late, daysLate: late ? lateDays(a.dueAt, at) : 0, at };
      },
      startResubmit: (aid, sid) => upsert(aid, sid, (cur) => cur && ({
        ...cur, status: 'draft', resubmitting: true, draftSavedAt: Date.now(),
        history: [...(cur.history || []), { mark: cur.mark, comment: cur.comment, rubricScores: cur.rubricScores, annotations: cur.annotations, returnedAt: cur.returnedAt, answers: cur.answers }],
        mark: undefined, comment: '', rubricScores: {}, annotations: {},
      })),
      dismissReminder: (rid) => setDb((d) => ({ ...d, reminders: d.reminders.map((r) => (r.id === rid ? { ...r, dismissed: true } : r)) })),
      publish: (draft) => {
        const at = Date.now();
        const a = draftToAssignment(draft, at, uid('a'));
        setDb((d) => ({ ...d, assignments: { ...d.assignments, [a.id]: a } }));
        const clsTxt = clsList(a.classes, lang);
        if (a.status === 'scheduled') toast(i18n.t('b.scheduled', { when: `${fmt.date(a.publishAt)} · ${fmt.time(a.publishAt)}` }), { kind: 'success' });
        else {
          if (a.classes.includes('8B')) setGuide((g) => ({ ...g, aid: a.id, steps: { 1: true } }));
          toast(i18n.t('b.published', { cls: clsTxt }), { kind: 'success', action: a.classes.includes('8B') ? { label: i18n.t('b.viewAsStudent'), onClick: () => go('student', { name: 'home' }, 'middle') } : undefined });
        }
        return a;
      },
      duplicate: (aid, classes, dueAt) => {
        const src = dbRef.current.assignments[aid]; const at = Date.now();
        const shift = dueAt - src.dueAt;
        const a = { ...JSON.parse(JSON.stringify(src)), id: uid('a'), classes, dueAt, publishAt: at, status: 'published', createdAt: at, latePolicy: { ...src.latePolicy, until: src.latePolicy?.until ? src.latePolicy.until + shift : null } };
        setDb((d) => ({ ...d, assignments: { ...d.assignments, [a.id]: a } }));
        toast(i18n.t('dup.done', { cls: clsList(classes, lang), date: `${fmt.date(dueAt)} · ${fmt.time(dueAt)}` }), { kind: 'success' });
        return a;
      },
      saveGrade: (aid, sid, data, status) => {
        const at = Date.now();
        upsert(aid, sid, (cur) => cur && ({ ...cur, ...data, status, gradedAt: at, returnedAt: status === 'graded' ? cur.returnedAt : at }));
        const name = studentFirst(STUDENTS[sid], lang);
        toast(i18n.t(status === 'returned' ? 'g.returned' : status === 'revision' ? 'g.revised' : 'g.saved', { name }), { kind: 'success' });
        if (status !== 'graded' && sid === 's_omar' && guideRef.current.aid === aid) markGuide(3);
      },
      returnAllGraded: (aid, cls) => {
        const at = Date.now(); let n = 0;
        setDb((d) => {
          const subs = { ...d.submissions };
          ROSTERS[cls].forEach((stu) => { const k = subKey(aid, stu.id); if (subs[k]?.status === 'graded') { subs[k] = { ...subs[k], status: 'returned', returnedAt: at }; n += 1; } });
          return { ...d, submissions: subs };
        });
        setTimeout(() => toast(n ? i18n.t('sub.returnedAll', { n }) : i18n.t('sub.noneGraded'), { kind: n ? 'success' : 'info' }), 0);
      },
      remind: (aid, cls, ids) => {
        const d0 = dbRef.current; const a = d0.assignments[aid]; const at = Date.now();
        const targets = ids || ROSTERS[cls].filter((stu) => ['missing', 'notYet'].includes(teacherStatus(a, d0.submissions[subKey(aid, stu.id)], at))).map((s) => s.id);
        if (!targets.length) { toast(i18n.t('sub.noneToRemind'), { kind: 'info' }); return; }
        setDb((d) => ({ ...d, reminders: [...d.reminders.filter((r) => !(r.assignmentId === aid && targets.includes(r.studentId))), ...targets.map((sid) => ({ id: uid('rem'), studentId: sid, assignmentId: aid, teacherId: a.teacherId, at }))] }));
        toast(i18n.t('sub.reminded', { n: targets.length }), { kind: 'success' });
      },
      remindStudent: (sid) => {
        const d0 = dbRef.current; const stu = STUDENTS[sid]; const at = Date.now();
        const a = teacherAssignments(d0).filter((x) => x.classes.includes(stu.cls) && isPublished(x, at)).find((x) => ['missing', 'notYet'].includes(teacherStatus(x, d0.submissions[subKey(x.id, sid)], at)));
        if (!a) { toast(i18n.t('sub.noneToRemind'), { kind: 'info' }); return; }
        setDb((d) => ({ ...d, reminders: [...d.reminders, { id: uid('rem'), studentId: sid, assignmentId: a.id, teacherId: a.teacherId, at }] }));
        toast(i18n.t('sub.reminded', { n: 1 }), { kind: 'success' });
      },
      notifyHomeroom: (key, cls) => {
        setDb((d) => ({ ...d, notified: { ...d.notified, [key]: true } }));
        toast(i18n.t('ad.notifyToast', { cls: clsLabel(cls, lang, true) }), { kind: 'info' });
      },
    };
  }, [i18n, lang, fmt, toast, go, markGuide]);

  const resetDemo = () => {
    _sampleCache.clear();
    setDb(buildSeed()); setBuilder(newDraft(Date.now())); setRoutes(HOME_ROUTES); setStageRaw('middle');
    setGuide((g) => ({ ...g, aid: null, steps: {} })); setModal(null);
    toast(t('demo.reset.done'), { kind: 'success' });
  };
  const guideGo = (i) => {
    const g = guideRef.current; const aid = g.aid && db.assignments[g.aid] ? g.aid : null;
    if (i === 1) go('teacher', { name: 'create' });
    if (i === 2) go('student', { name: 'home' }, 'middle');
    if (i === 3) { const sub = aid && db.submissions[subKey(aid, 's_omar')]; go('teacher', sub && HANDED_IN.includes(teacherStatus(db.assignments[aid], sub, now)) ? { name: 'grade', id: aid, sid: 's_omar' } : aid ? { name: 'submissions', id: aid, cls: '8B' } : { name: 'grading' }); }
    if (i === 4) go('student', aid ? { name: 'assignment', id: aid } : { name: 'home' }, 'middle');
    if (i === 5) go('teacher', { name: 'insights', cls: '8B' });
    if (i === 6) go('admin', { name: 'home' });
  };

  const ctx = {
    lang, setLang, t, fmt, dir, role, setRole, stage, setStage, student, now, db, actions, route, navigate, toast,
    settings, setSettings, guide, setGuide, guideGo, markGuide, builder, setBuilder,
  };

  const renderView = () => {
    const r = route;
    if (role === 'student') {
      if (r.name === 'assignment') return <AssignmentPage key={r.id} id={r.id} />;
      if (r.name === 'paper') return <PaperUpload key={`${r.id}${r.blockId}`} id={r.id} blockId={r.blockId} />;
      if (r.name === 'all') return <AllAssignments />;
      return <StudentDashboard />;
    }
    if (role === 'teacher') {
      if (r.name === 'assignments') return <TeacherAssignments />;
      if (r.name === 'create') return <AssignmentBuilder />;
      if (r.name === 'grading') return <GradingQueue />;
      if (r.name === 'submissions') return <SubmissionsTable key={`${r.id}${r.cls}${r.filter}`} id={r.id} cls={r.cls} filter={r.filter} />;
      if (r.name === 'grade') return <GradingView key={`${r.id}${r.sid}`} id={r.id} sid={r.sid} />;
      if (r.name === 'insights') return <ClassInsights key={r.cls || 'x'} cls={r.cls} />;
      return <TeacherDashboard />;
    }
    return <AdminOverview />;
  };

  return (
    <AppCtx.Provider value={ctx}>
      <style>{GLOBAL_CSS}</style>
      <div className={cx('ags-root', settings.reduceMotion && 'reduce-motion')} dir={dir} lang={lang}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] btn btn-gold">{t('skip')}</a>
        <TopBar onOpenSettings={() => setModal('settings')} onReset={() => setModal('reset')} />
        {role === 'student' && <AgePreviewBar />}
        <div className="flex">
          <Sidebar />
          <main id="main" tabIndex={-1} className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-36 lg:pb-12">
            <div className="max-w-6xl mx-auto">
              {loading ? <ViewSkeleton /> : <div key={viewKey} className="ags-fade-up">{renderView()}</div>}
              <Footer onAbout={() => setModal('about')} />
            </div>
          </main>
        </div>
        <BottomNav />
        <DemoGuide />
        <Toasts toasts={toasts} dismiss={dismissToast} />
        <SettingsModal open={modal === 'settings'} onClose={() => setModal(null)} onReset={() => setModal('reset')} onAbout={() => setModal('about')} />
        <Modal open={modal === 'reset'} onClose={() => setModal(null)} title={t('demo.reset.title')} icon={RotateCcw} size="sm"
          footer={<><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>{t('cancel')}</button><button type="button" className="btn btn-primary" onClick={resetDemo}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('demo.reset')}</button></>}>
          <p className="text-ags-navy">{t('demo.reset.body')}</p>
        </Modal>
        <Modal open={modal === 'about'} onClose={() => setModal(null)} title={t('demo.about')} icon={Info} size="sm"
          footer={<button type="button" className="btn btn-primary" onClick={() => setModal(null)}>{t('close')}</button>}>
          <p className="text-ags-navy leading-relaxed">{t('demo.about.body')}</p>
          <p className="mt-4 text-sm text-ags-slate">{t('app.school')} · {t('app.city')}</p>
        </Modal>
      </div>
    </AppCtx.Provider>
  );
}
