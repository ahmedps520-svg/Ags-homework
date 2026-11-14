/* ============================================================================
 * AGS Homework Hub — clickable front-end demo
 * Advanced Generations International Schools (AGS), Jeddah
 *
 * Designed to be simple: students see one list and hand in with a photo;
 * teachers set homework in three steps and mark with ticks, a mark and a comment;
 * leadership sees the whole school on one screen.
 *
 * Single-file React app. Tailwind for layout, lucide-react for icons.
 * Everything below is FICTIONAL SAMPLE DATA held in memory for this session only.
 * Nothing is persisted, no accounts exist and no notifications are sent.
 *
 * File map
 *   1. Brand tokens & global styles      8. App context & UI primitives (incl. Hero, CountUp)
 *   2. Translations (EN + AR)            9. Shell (top bar, demo guide, settings)
 *   3. Formatting, time & helpers       10. Student
 *   4. Static entities (classes, people) 11. Teacher
 *   5. Sample page images (inline SVG)  12. Admin
 *   6. Seed data                        13. App root
 *   7. Domain logic
 * ========================================================================== */

import React, {
  useState, useEffect, useMemo, useRef, useCallback, createContext, useContext,
} from 'react';
import {
  AlarmClock, AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Atom, BadgeCheck, BarChart3, Bell, BookMarked, BookOpen, Building2, CalendarClock, Camera, Check, CheckCheck, CheckCircle2, ChevronDown, Circle, ClipboardList, Clock, Dna, Eye, FileText, FlaskConical, Globe2, GraduationCap, Inbox, Info, LayoutDashboard, ListChecks, Loader2, Lock, MessageSquareText, Monitor, Palette, PenLine, PencilLine, Plus, PlusCircle, Presentation, RotateCcw, RotateCw, Send, Settings, Sigma, Sparkles, Star, Trash2, TrendingUp, Undo2, Upload, Users, X,
} from 'lucide-react';

/** Official AGS logo: put the school's file in src/assets/ as ags-logo.svg / .png / .webp / .jpg and it is used automatically. */
let AGS_LOGO = null;
try { AGS_LOGO = Object.values(import.meta.glob('./assets/ags-logo.*', { eager: true, import: 'default' }))[0] || null; } catch (e) { AGS_LOGO = null; }

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
.border-ags-gold{border-color:${BRAND.gold}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-weight:500;border-radius:.75rem;padding:.55rem 1rem;font-size:.9375rem;line-height:1.35rem;transition:background-color .15s,color .15s,box-shadow .15s,transform .1s;min-height:2.75rem;text-align:center}
.btn:active:not(:disabled){transform:translateY(1px)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:${BRAND.indigo};color:#fff}.btn-primary:hover:not(:disabled){background:#23215E}
.btn-gold{background:${BRAND.gold};color:${BRAND.navy}}.btn-gold:hover:not(:disabled){background:${BRAND.goldHover}}
.btn-secondary{background:#fff;color:${BRAND.indigo};box-shadow:inset 0 0 0 1px #CFCDE6}.btn-secondary:hover:not(:disabled){background:#F3F2FA}
.btn-ghost{background:transparent;color:${BRAND.indigo}}.btn-ghost:hover:not(:disabled){background:#EEEDF8}
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
.reduce-motion *,.reduce-motion *::before,.reduce-motion *::after{animation-duration:.001ms!important;animation-delay:0ms!important;transition-duration:.001ms!important}
@media (prefers-reduced-motion:reduce){.ags-root *,.ags-root *::before,.ags-root *::after{animation-duration:.001ms!important;animation-delay:0ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}
.ags-root input[type=range]{accent-color:${BRAND.indigo}}
.ags-root input[type=checkbox],.ags-root input[type=radio]{accent-color:${BRAND.indigo};width:1.15rem;height:1.15rem}
.touch-none{touch-action:none}
@keyframes ags-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ags-rise{animation:ags-rise .5s cubic-bezier(.2,.7,.2,1) both}
@keyframes ags-ring{0%{transform:scale(.55);opacity:.6}100%{transform:scale(1.7);opacity:0}}
.ags-ring{animation:ags-ring 1.2s .2s ease-out both}
@keyframes ags-spark{0%{transform:translate(0,0) scale(.2);opacity:0}25%{opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1);opacity:0}}
.ags-spark{animation:ags-spark 1s ease-out both}
.lift{transition:transform .2s ease,box-shadow .2s ease}
.lift:hover{transform:translateY(-2px);box-shadow:0 2px 4px rgba(32,31,60,.05),0 16px 32px -14px rgba(32,31,60,.24)}
.lift:active{transform:translateY(0) scale(.995)}
.hero{position:relative;overflow:hidden;border-radius:1.5rem;color:#fff;background:linear-gradient(135deg,${BRAND.indigo} 0%,#26245F 55%,${BRAND.navy} 100%);box-shadow:0 24px 48px -26px rgba(32,31,60,.7)}
.hero-pattern{position:absolute;inset:0;opacity:.1;background-size:64px 64px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23F3C52D' stroke-width='1.1'%3E%3Crect x='18' y='18' width='28' height='28'/%3E%3Crect x='18' y='18' width='28' height='28' transform='rotate(45 32 32)'/%3E%3Ccircle cx='32' cy='32' r='6'/%3E%3Cpath d='M0 0l10 10M64 0L54 10M0 64l10-10M64 64L54 54'/%3E%3C/g%3E%3C/svg%3E")}
.hero-glow{position:absolute;width:22rem;height:22rem;border-radius:9999px;background:radial-gradient(circle,rgba(243,197,45,.28),rgba(243,197,45,0) 70%);top:-9rem;inset-inline-end:-7rem;pointer-events:none}
`;

/* ============================================================================
 * 2. TRANSLATIONS — one object, [English, Arabic] per key. Plain words on purpose.
 * A value may be a plural object keyed by Intl.PluralRules categories
 * (Arabic uses zero/one/two/few/many/other). Keys ending in .early/.senior
 * are age-stage variants picked automatically by t.s().
 * ========================================================================== */

const T = {
  /* --- app & shell --- */
  'app.name': ['Homework Hub', 'منصة الواجبات'],
  'app.school': ['Advanced Generations International Schools', 'مدارس الأجيال المتطورة العالمية'],
  'app.city': ['Jeddah', 'جدة'],
  'role.label': ['View as', 'العرض بصفة'],
  'role.student': ['Student', 'طالب'],
  'role.teacher': ['Teacher', 'معلّم'],
  'role.admin': ['Admin', 'الإدارة'],
  'lang.label': ['Language', 'اللغة'],
  'stage.label': ['Design preview by age', 'معاينة التصميم حسب العمر'],
  'stage.early': ['KG – Grade 3', 'رياض الأطفال – الصف الثالث'],
  'stage.middle': ['Grades 4 – 8', 'الصفوف الرابع – الثامن'],
  'stage.senior': ['Grades 9 – 12', 'الصفوف التاسع – الثاني عشر'],
  'stage.switched': ['Now previewing as {name} · {cls}', 'المعاينة الآن بصفة {name} · {cls}'],
  'nav.main': ['Main navigation', 'التنقل الرئيسي'],
  'skip': ['Skip to main content', 'الانتقال إلى المحتوى الرئيسي'],
  'close': ['Close', 'إغلاق'],
  'cancel': ['Cancel', 'إلغاء'],
  'dismiss': ['Dismiss', 'إغلاق'],
  'undo': ['Undo', 'تراجع'],
  'loading': ['Loading…', 'جارٍ التحميل…'],
  'settings': ['Settings', 'الإعدادات'],
  'settings.textSize': ['Text size', 'حجم الخط'],
  'settings.size.s': ['Small', 'صغير'],
  'settings.size.m': ['Default', 'افتراضي'],
  'settings.size.l': ['Large', 'كبير'],
  'settings.size.xl': ['Extra large', 'كبير جدًا'],
  'settings.motion': ['Reduce motion', 'تقليل الحركة'],
  'settings.motion.hint': ['Turns off animations', 'يوقف الرسوم المتحركة'],
  'settings.guide': ['Show demo steps', 'إظهار خطوات العرض'],
  'demo.reset': ['Reset demo', 'إعادة ضبط العرض'],
  'demo.reset.title': ['Reset the demo?', 'إعادة ضبط العرض؟'],
  'demo.reset.body': ['This brings back all the sample data. Anything done in this session will be cleared.', 'سيعيد ذلك جميع البيانات التجريبية، ويحذف كل ما تم في هذه الجلسة.'],
  'demo.reset.done': ['Demo reset to its sample data', 'أُعيد العرض إلى بياناته التجريبية'],
  'demo.footer': ['Demo — sample data', 'نسخة تجريبية — بيانات افتراضية'],
  'demo.about': ['About this demo', 'عن هذا العرض'],
  'demo.about.body': ['This is a front-end demonstration of AGS Homework Hub. All people, classes, homework, marks and figures are fictional and kept in memory for this session only. Work saves automatically within the session; refreshing the page brings back the sample data. No real school accounts exist and no messages or notifications are sent.', 'هذا عرض تجريبي لواجهة منصة الواجبات في مدارس الأجيال المتطورة العالمية. جميع الأسماء والشعب والواجبات والدرجات والأرقام افتراضية، وتُحفظ في الذاكرة خلال هذه الجلسة فقط. يُحفظ العمل تلقائيًا داخل الجلسة، وتحديث الصفحة يعيد البيانات التجريبية. لا توجد حسابات مدرسية حقيقية، ولا تُرسَل أي رسائل أو إشعارات.'],

  /* --- demo steps --- */
  'guide.title': ['Demo steps', 'خطوات العرض'],
  'guide.hide': ['Hide demo steps', 'إخفاء خطوات العرض'],
  'guide.done': ['Done', 'تم'],
  'guide.progress': ['{n}/6', '{n} من ٦'],
  'guide.hint': ['Tap a step to jump straight there.', 'انقر على أي خطوة للانتقال إليها مباشرة.'],
  'guide.s1': ['Teacher: set “Fractions Review” for 8B1 (photo of written work)', 'المعلّم: أنشئ واجب «Fractions Review» لشعبة 8B1 (صورة لعمل مكتوب)'],
  'guide.s2': ['Student: hand it in with a sample photo', 'الطالب: سلّمه بصورة نموذجية'],
  'guide.s3': ['Teacher: mark it and send it back', 'المعلّم: صحّحه وأعده إلى الطالب'],
  'guide.s4': ['Student: see the mark and comments', 'الطالب: اطّلع على الدرجة والملاحظات'],
  'guide.s5': ['Teacher: Progress shows it handed in', 'المعلّم: يظهر التسليم في صفحة المتابعة'],
  'guide.s6': ['Admin: the overview shows the new hand-in', 'الإدارة: يظهر التسليم الجديد في النظرة العامة'],

  /* --- time --- */
  'due.today': ['Due today, {time}', 'التسليم اليوم، {time}'],
  'due.tomorrow': ['Due tomorrow, {time}', 'التسليم غدًا، {time}'],
  'due.weekday': ['Due {day}, {time}', 'التسليم يوم {day}، {time}'],
  'due.date': ['Due {date}, {time}', 'التسليم {date}، {time}'],
  'due.lessHour': ['Due in less than an hour', 'التسليم خلال أقل من ساعة'],
  'due.inHours': [{ one: 'Due in 1 hour', other: 'Due in {n} hours' }, { one: 'التسليم خلال ساعة', two: 'التسليم خلال ساعتين', few: 'التسليم خلال {n} ساعات', many: 'التسليم خلال {n} ساعة', other: 'التسليم خلال {n} ساعة' }],
  'due.early.tomorrow': ['Tomorrow', 'غدًا'],
  'late.days': [{ one: '1 day late', other: '{n} days late' }, { one: 'متأخر يومًا واحدًا', two: 'متأخر يومين', few: 'متأخر {n} أيام', many: 'متأخر {n} يومًا', other: 'متأخر {n} يوم' }],
  'ago.now': ['just now', 'الآن'],
  'ago.min': [{ one: '1 min ago', other: '{n} min ago' }, { one: 'قبل دقيقة', two: 'قبل دقيقتين', few: 'قبل {n} دقائق', many: 'قبل {n} دقيقة', other: 'قبل {n} دقيقة' }],
  'ago.hour': [{ one: '1 hour ago', other: '{n} hours ago' }, { one: 'قبل ساعة', two: 'قبل ساعتين', few: 'قبل {n} ساعات', many: 'قبل {n} ساعة', other: 'قبل {n} ساعة' }],
  'ago.day': [{ one: 'yesterday', other: '{n} days ago' }, { one: 'أمس', two: 'قبل يومين', few: 'قبل {n} أيام', many: 'قبل {n} يومًا', other: 'قبل {n} يوم' }],

  /* --- statuses (always icon + text) --- */
  'st.notStarted': ['To do', 'مطلوب'],
  'st.notYet': ['Not yet', 'لم يُسلَّم بعد'],
  'st.draft': ['Started', 'قيد الإنجاز'],
  'st.submitted': ['Handed in', 'تم التسليم'],
  'st.submittedLate': ['Handed in late', 'سُلِّم متأخرًا'],
  'st.late': ['Late', 'متأخر'],
  'st.overdue': ['Overdue', 'فات موعد التسليم'],
  'st.closed': ['Missed', 'لم يُسلَّم'],
  'st.missing': ['Not handed in', 'لم يُسلَّم'],
  'st.graded': ['Marked', 'تم التصحيح'],
  'st.returned': ['Returned with feedback', 'أُعيدت مع ملاحظات'],
  'st.revision': ['Needs a redo', 'مطلوب تعديله'],
  'st.scheduled': ['Scheduled', 'مجدول'],

  /* --- student home --- */
  'greet.morning': ['Good morning, {name}', 'صباح الخير، {name}'],
  'greet.afternoon': ['Good afternoon, {name}', 'مساء الخير، {name}'],
  'greet.evening': ['Good evening, {name}', 'مساء الخير، {name}'],
  'greet.early': ['Hello, {name}!', 'أهلًا يا {name}!'],
  'home.summary': [{ one: 'You have 1 assignment to do.', other: 'You have {n} assignments to do.' }, { one: 'لديك واجب واحد.', two: 'لديك واجبان.', few: 'لديك {n} واجبات.', many: 'لديك {n} واجبًا.', other: 'لديك {n} واجب.' }],
  'home.summary.early': [{ one: 'You have 1 thing to do.', other: 'You have {n} things to do.' }, { one: 'لديك واجب واحد.', two: 'لديك واجبان.', few: 'لديك {n} واجبات.', many: 'لديك {n} واجبًا.', other: 'لديك {n} واجب.' }],
  'home.summary.senior': [{ one: '1 assignment outstanding.', other: '{n} assignments outstanding.' }, { one: 'واجب واحد متبقٍ.', two: 'واجبان متبقيان.', few: '{n} واجبات متبقية.', many: '{n} واجبًا متبقيًا.', other: '{n} واجب متبقٍ.' }],
  'home.allDone': ['You’re all done — everything is handed in.', 'أنجزت كل شيء، وسلّمت جميع واجباتك.'],
  'home.allDone.early': ['All done! Well done.', 'أنهيت كل شيء! أحسنت.'],
  'home.todo': ['To do', 'المطلوب'],
  'home.todo.early': ['My homework', 'واجباتي'],
  'home.nothing': ['Nothing to do right now.', 'لا توجد واجبات مطلوبة الآن.'],
  'home.nothing.early': ['No homework right now!', 'لا توجد واجبات الآن!'],
  'home.late': ['Late — you can still hand these in', 'متأخرة — ما زال بإمكانك تسليمها'],
  'home.late.hint': ['Your teacher still accepts these. Hand them in when you can.', 'ما زال المعلّم يقبل هذه الواجبات، فسلّمها متى استطعت.'],
  'home.feedback': ['Returned with feedback', 'أُعيدت مع ملاحظات'],
  'home.feedback.early': ['From my teacher', 'من معلّمي'],
  'home.noFeedback': ['No new feedback yet.', 'لا توجد ملاحظات جديدة بعد.'],
  'home.startWith': ['Start with “{title}”', 'ابدأ بواجب «{title}»'],
  'home.showDone': ['Show finished work ({n})', 'عرض الواجبات المكتملة ({n})'],
  'home.hideDone': ['Hide finished work', 'إخفاء الواجبات المكتملة'],
  'reminder.text': ['{teacher} sent a reminder: “{title}” is waiting for you.', 'تذكير من {teacher}: واجب «{title}» بانتظارك.'],
  'card.new': ['New', 'جديد'],
  'card.wasDue': ['Was due {day}', 'كان موعد تسليمه {day}'],
  'card.askTeacher': ['please talk to your teacher', 'تحدّث مع معلّمك'],
  'card.lateUntil': ['you can hand it in until {day}', 'يمكنك تسليمه حتى {day}'],
  'card.lateAny': ['you can still hand it in', 'ما زال بإمكانك تسليمه'],
  'card.returned': ['Returned {when}', 'أُعيد {when}'],
  'card.handedIn': ['Handed in {when}', 'سُلِّم {when}'],
  'act.start': ['Start', 'ابدأ'],
  'act.continue': ['Continue', 'أكمل'],
  'act.late': ['Hand in late', 'سلّم متأخرًا'],
  'act.open': ['Open', 'فتح'],
  'act.feedback': ['See feedback', 'عرض الملاحظات'],
  'act.redo': ['Redo and hand in', 'عدّل وأعد التسليم'],
  'act.view': ['View', 'عرض'],

  /* --- homework page --- */
  'back.home': ['My homework', 'واجباتي'],
  'a.whatToDo': ['What to do', 'المطلوب'],
  'a.openWorksheet': ['Open worksheet', 'فتح ورقة العمل'],
  'a.autosave': ['Your work saves automatically', 'يُحفظ عملك تلقائيًا'],
  'a.saved': ['Saved', 'تم الحفظ'],
  'a.missing': [{ one: 'Please answer 1 more question first.', other: 'Please answer {n} more questions first.' }, { one: 'أجب عن سؤال واحد آخر أولًا.', two: 'أجب عن سؤالين آخرين أولًا.', few: 'أجب عن {n} أسئلة أخرى أولًا.', many: 'أجب عن {n} سؤالًا آخر أولًا.', other: 'أجب عن {n} سؤال آخر أولًا.' }],
  'a.handedIn': ['Handed in {when}', 'سُلِّم {when}'],
  'a.lateUntil': ['This is late. You can still hand it in until {day}.', 'تأخّر هذا الواجب، ويمكنك تسليمه حتى {day}.'],
  'a.lateAny': ['This is late. You can still hand it in — it will be marked as late.', 'تأخّر هذا الواجب، ويمكنك تسليمه وسيُسجَّل متأخرًا.'],
  'a.closed': ['The deadline has passed. Please talk to your teacher — they can help you catch up.', 'انتهى موعد التسليم. تحدّث مع معلّمك، فهو قادر على مساعدتك.'],
  'a.notFound': ['This homework isn’t available.', 'هذا الواجب غير متاح.'],
  'att.mockNote': ['Demo preview — sample files are illustrations only.', 'معاينة تجريبية — الملفات النموذجية للتوضيح فقط.'],
  'submit': ['Hand in', 'تسليم الواجب'],
  'resubmit': ['Hand in again', 'إعادة التسليم'],
  'q.of': ['Question {n} of {total}', 'السؤال {n} من {total}'],
  'q.true': ['True', 'صح'],
  'q.false': ['False', 'خطأ'],
  'q.typeHere': ['Type your answer', 'اكتب إجابتك'],
  'q.choose': ['Choose…', 'اختر…'],
  'q.addFile': ['Add file', 'إضافة ملف'],
  'q.needed': ['This is needed before you hand in.', 'هذا مطلوب قبل التسليم.'],
  'photo.title': ['Your photos', 'صور عملك'],
  'photo.take': ['Take photo', 'التقاط صورة'],
  'photo.upload': ['Upload photo', 'رفع صورة'],
  'photo.tip': ['Tip: lay the page flat in good light.', 'نصيحة: ضع الورقة على سطح مستوٍ في إضاءة جيدة.'],
  'photo.sample': ['No camera? Use a sample page', 'لا توجد كاميرا؟ استخدم صفحة نموذجية'],
  'photo.busy': ['Preparing photo…', 'جارٍ تجهيز الصورة…'],
  'photo.count': [{ one: '1 photo', other: '{n} photos' }, { one: 'صورة واحدة', two: 'صورتان', few: '{n} صور', many: '{n} صورة', other: '{n} صورة' }],
  'photo.page': ['Page {n}', 'الصفحة {n}'],
  'photo.rotate': ['Rotate', 'تدوير'],
  'photo.delete': ['Delete', 'حذف'],
  'photo.deleted': ['Photo deleted', 'حُذفت الصورة'],
  'photo.err': ['We couldn’t open that photo. Try another one.', 'تعذّر فتح الصورة. جرّب صورة أخرى.'],
  'photo.notImage': ['That file isn’t a photo.', 'هذا الملف ليس صورة.'],
  'sample.fractions': ['Handwritten fractions', 'كسور بخط اليد'],
  'sample.equations': ['Handwritten equations', 'معادلات بخط اليد'],
  'sample.textbook': ['Textbook exercise', 'تمرين من الكتاب'],
  'sample.apples': ['Colouring worksheet', 'ورقة تلوين'],
  'sample.letters': ['Letter practice', 'تدريب على الحروف'],
  'sample.calculus': ['Differentiation working', 'حلول التفاضل'],
  'sample.pattern': ['Geometric pattern', 'زخرفة هندسية'],
  'fb.mark': ['Mark', 'الدرجة'],
  'fb.from': ['From {teacher}', 'ملاحظات {teacher}'],
  'fb.redo': ['Your teacher asked you to fix a few things and hand it in again.', 'طلب منك المعلّم تعديل بعض الأمور وإعادة التسليم.'],
  'fb.redoStarted': ['You can now change your work and hand it in again.', 'يمكنك الآن تعديل عملك وإعادة تسليمه.'],
  'fb.onPhotos': ['Your teacher’s marks on your work', 'ملاحظات المعلّم على عملك'],
  'fb.correct': ['Correct', 'صحيحة'],
  'fb.wrong': ['Not quite', 'غير صحيحة'],
  'fb.correctAnswer': ['Correct answer', 'الإجابة الصحيحة'],
  'fb.yourAnswer': ['Your answer', 'إجابتك'],
  'done.onTime': ['Handed in on time.', 'تم التسليم في الموعد.'],
  'done.late': [{ one: 'Handed in — 1 day after the due date.', other: 'Handed in — {n} days after the due date.' }, { one: 'تم التسليم بعد الموعد المحدد بيوم واحد.', two: 'تم التسليم بعد الموعد المحدد بيومين.', few: 'تم التسليم بعد الموعد المحدد بـ{n} أيام.', many: 'تم التسليم بعد الموعد المحدد بـ{n} يومًا.', other: 'تم التسليم بعد الموعد المحدد بـ{n} يوم.' }],
  'done.early': ['All done! Your teacher will see your work.', 'أحسنت! سيرى معلّمك عملك.'],
  'done.next': ['{teacher} will check it and send it back with feedback.', 'ستصلك ملاحظات {teacher} بعد المراجعة.'],
  'g.text': ['Text note', 'ملاحظة نصية'],
  'g.textPh': ['Type a note, then press Enter', 'اكتب ملاحظة ثم اضغط Enter'],

  /* --- teacher --- */
  'tt.home': ['Home', 'الرئيسية'],
  'tt.create': ['Set homework', 'إنشاء واجب'],
  'tt.progress': ['Progress', 'المتابعة'],
  'th.set': ['Set homework', 'إنشاء واجب'],
  'th.toMark': ['Ready to mark', 'جاهز للتصحيح'],
  'th.nToMark': ['{n} to mark', 'للتصحيح: {n}'],
  'th.nOpen': [{ one: '1 homework open', other: '{n} homework open' }, 'الواجبات المفتوحة: {n}'],
  'th.startMarking': ['Start marking', 'ابدأ التصحيح'],
  'th.allMarked': ['All marked — nothing is waiting.', 'لا توجد أعمال بانتظار التصحيح.'],
  'th.yours': ['Homework you set', 'الواجبات التي أرسلتها'],
  'th.handedIn': ['{n} of {total} handed in', 'سلّم {n} من {total}'],
  'th.seeClass': ['See class', 'عرض الشعبة'],
  'th.remind': ['Remind ({n})', 'تذكير ({n})'],
  'th.sendsOn': ['Sends {when}', 'يُرسل {when}'],
  'th.help': [{ one: '1 student may need help — see Progress', other: '{n} students may need help — see Progress' }, { one: 'طالب واحد قد يحتاج إلى مساعدة — اطّلع على المتابعة', two: 'طالبان قد يحتاجان إلى مساعدة — اطّلع على المتابعة', few: '{n} طلاب قد يحتاجون إلى مساعدة — اطّلع على المتابعة', many: '{n} طالبًا قد يحتاجون إلى مساعدة — اطّلع على المتابعة', other: '{n} طالب قد يحتاجون إلى مساعدة — اطّلع على المتابعة' }],
  'cv.toMark': ['Ready to mark', 'جاهز للتصحيح'],
  'cv.notIn': ['Not handed in yet', 'لم يُسلَّم بعد'],
  'cv.marked': ['Marked and sent back', 'صُحِّح وأُعيد'],
  'cv.mark': ['Mark', 'تصحيح'],
  'cv.view': ['View', 'عرض'],
  'cv.remindAll': ['Remind them ({n})', 'تذكيرهم ({n})'],
  'mk.left': ['{n} left to mark', 'المتبقي للتصحيح: {n}'],
  'mk.noneLeft': ['All marked', 'اكتمل التصحيح'],
  'mk.handedIn': ['Handed in {when}', 'سُلِّم {when}'],
  'mk.notIn': ['{name} hasn’t handed this in yet.', 'لم يسلّم {name} هذا الواجب بعد.'],
  'mk.remindOne': ['Remind {name}', 'تذكير {name}'],
  'mk.work': ['Work', 'العمل'],
  'mk.tools': ['Marking tools', 'أدوات التصحيح'],
  'mk.tick': ['Tick', 'صح'],
  'mk.cross': ['Cross', 'خطأ'],
  'mk.pen': ['Pen', 'قلم'],
  'mk.undo': ['Undo', 'تراجع'],
  'mk.hint': ['Tap the photo to add ticks and crosses.', 'انقر على الصورة لإضافة علامات الصح والخطأ.'],
  'mk.answers': ['Answers', 'الإجابات'],
  'mk.auto': ['Marked automatically: {score}', 'صُحِّح تلقائيًا: {score}'],
  'mk.note': ['Note from the student', 'ملاحظة الطالب'],
  'mk.panel': ['Mark and comment', 'الدرجة والتعليق'],
  'mk.mark': ['Mark (out of {n})', 'الدرجة (من {n})'],
  'mk.comment': ['Comment', 'تعليق'],
  'mk.commentPh': ['A short note for the student…', 'ملاحظة قصيرة للطالب…'],
  'mk.sent': ['Sent back {when}', 'أُعيد {when}'],
  'mk.send': ['Send back to {name}', 'إعادة إلى {name}'],
  'mk.pick': ['Choose a mark first', 'اختر الدرجة أولًا'],
  'mk.redo': ['Ask to redo', 'إرجاع للتعديل'],
  'mk.sentOk': ['Sent back to {name}', 'أُعيد إلى {name}'],
  'mk.sentRedo': ['{name} has been asked to redo it', 'طُلب من {name} تعديل الواجب'],
  'qc.working': ['Clear working', 'خطوات الحل واضحة'],
  'qc.signs': ['Check your signs', 'راجع الإشارات'],
  'qc.improve': ['Great improvement', 'تحسّن رائع'],
  'qc.simplify': ['Simplify your answer', 'بسّط إجابتك'],
  'rem.done': [{ one: 'Reminder added to 1 student’s homework list (demo — no message is sent).', other: 'Reminder added to {n} students’ homework lists (demo — no messages are sent).' }, { one: 'أُضيف تذكير إلى قائمة واجبات طالب واحد (للعرض فقط — لا تُرسَل رسائل).', two: 'أُضيف تذكير إلى قائمتي واجبات طالبين (للعرض فقط — لا تُرسَل رسائل).', few: 'أُضيف تذكير إلى قوائم واجبات {n} طلاب (للعرض فقط — لا تُرسَل رسائل).', many: 'أُضيف تذكير إلى قوائم واجبات {n} طالبًا (للعرض فقط — لا تُرسَل رسائل).', other: 'أُضيف تذكير إلى قوائم واجبات {n} طالب (للعرض فقط — لا تُرسَل رسائل).' }],
  'rem.none': ['Everyone has handed this in.', 'سلّم الجميع هذا الواجب.'],
  'pg.title': ['Progress', 'المتابعة'],
  'pg.sub': ['Mathematics · last 6 weeks · sample data', 'الرياضيات · آخر ٦ أسابيع · بيانات تجريبية'],
  'pg.class': ['Class', 'الشعبة'],
  'pg.handedIn': ['Homework handed in', 'نسبة تسليم الواجبات'],
  'pg.handedIn.hint': ['How many students handed in each homework', 'عدد الطلاب الذين سلّموا كل واجب'],
  'pg.open': ['open', 'مفتوح'],
  'pg.help': ['Students who may need help', 'طلاب قد يحتاجون إلى مساعدة'],
  'pg.help.hint': ['Missed 3 or more homeworks, or an average below 50%', 'فاتهم ٣ واجبات أو أكثر، أو متوسطهم أقل من ٥٠٪'],
  'pg.missed': ['Not handed in: {n}', 'لم يسلّم: {n}'],
  'pg.lowAvg': ['Average {pct}', 'المتوسط {pct}'],
  'pg.remind': ['Remind', 'تذكير'],
  'pg.noHelp': ['No one needs extra help in this class right now.', 'لا يوجد طلاب بحاجة إلى مساعدة إضافية في هذه الشعبة حاليًا.'],
  'pg.privacy': ['Only teachers see this. Students are never ranked.', 'لا يرى هذه الصفحة إلا المعلّمون، ولا يُرتَّب الطلاب أبدًا.'],

  /* --- set homework --- */
  'sh.title': ['Set homework', 'إنشاء واجب'],
  'sh.step1': ['What should students do?', 'ما المطلوب من الطلاب؟'],
  'sh.kind.photo': ['Photo of written work', 'صورة لعمل مكتوب'],
  'sh.kind.photo.d': ['Students work on paper, then take a photo', 'يحلّ الطلاب على الورق ثم يلتقطون صورة'],
  'sh.kind.quiz': ['Quick quiz', 'اختبار قصير'],
  'sh.kind.quiz.d': ['Multiple choice — marked for you', 'اختيار من متعدد، يُصحَّح تلقائيًا'],
  'sh.kind.written': ['Written answer', 'إجابة مكتوبة'],
  'sh.kind.written.d': ['Students type their answer', 'يكتب الطلاب إجاباتهم'],
  'sh.instr.photo': ['Complete the worksheet in your exercise book. Show your working, then take a clear photo of each page.', 'أكمل ورقة العمل في دفترك مع إظهار خطوات الحل، ثم التقط صورة واضحة لكل صفحة.'],
  'sh.instr.quiz': ['Answer each question. Your mark appears when your teacher sends it back.', 'أجب عن كل سؤال، وستظهر درجتك عندما يعيده المعلّم.'],
  'sh.instr.written': ['Write your answer in full sentences.', 'اكتب إجابتك بجمل كاملة.'],
  'sh.photoPrompt': ['Take a clear photo of each page of your work.', 'التقط صورة واضحة لكل صفحة من عملك.'],
  'sh.step2': ['Details', 'التفاصيل'],
  'sh.fTitle': ['Title', 'العنوان'],
  'sh.fTitlePh': ['e.g. Fractions Review', 'مثال: مراجعة الكسور'],
  'sh.fInstr': ['Instructions for students', 'تعليمات للطلاب'],
  'sh.fQuestion': ['Question', 'السؤال'],
  'sh.fQuestionPh': ['What should students answer?', 'ما السؤال الذي يجيب عنه الطلاب؟'],
  'sh.questions': ['Questions', 'الأسئلة'],
  'sh.qType': ['Question type', 'نوع السؤال'],
  'sh.qType.mcq': ['Multiple choice', 'اختيار من متعدد'],
  'sh.qType.tf': ['True / False', 'صح أو خطأ'],
  'sh.removeQ': ['Remove question', 'حذف السؤال'],
  'sh.qPh': ['Type the question', 'اكتب السؤال'],
  'sh.option': ['Answer {n}', 'الخيار {n}'],
  'sh.correct': ['Correct answer', 'الإجابة الصحيحة'],
  'sh.correctHint': ['Select the correct answer.', 'حدّد الإجابة الصحيحة.'],
  'sh.answerIs': ['The answer is', 'الإجابة الصحيحة:'],
  'sh.addQ': ['Add question', 'إضافة سؤال'],
  'sh.outOf': ['Marked out of', 'الدرجة من'],
  'sh.worksheet': ['Attach a worksheet', 'إرفاق ورقة عمل'],
  'sh.autoMarked': ['Marked for you automatically', 'يُصحَّح تلقائيًا'],
  'sh.step3': ['Who and when', 'لمن ومتى'],
  'sh.classes': ['Class', 'الشعبة'],
  'sh.due': ['Due', 'موعد التسليم'],
  'sh.due.tomorrow': ['Tomorrow', 'غدًا'],
  'sh.due.2days': ['In 2 days', 'بعد يومين'],
  'sh.due.week': ['Next week', 'الأسبوع القادم'],
  'sh.due.custom': ['Pick a date', 'اختيار تاريخ'],
  'sh.dueDate': ['Due date', 'تاريخ التسليم'],
  'sh.dueTime': ['Due time', 'وقت التسليم'],
  'sh.more': ['More options', 'خيارات إضافية'],
  'sh.acceptLate': ['Accept late work', 'قبول التسليم المتأخر'],
  'sh.acceptLate.hint': ['It will be marked as late', 'ويُسجَّل متأخرًا'],
  'sh.allowRedo': ['Students can redo after feedback', 'السماح بإعادة التسليم بعد الملاحظات'],
  'sh.sendLater': ['Send later', 'إرسال لاحقًا'],
  'sh.preview': ['See what students see', 'معاينة ما يراه الطلاب'],
  'sh.previewNote': ['This is exactly what students will see. Nothing here is saved.', 'هذا ما سيراه الطلاب تمامًا، ولا يُحفظ شيء هنا.'],
  'sh.send': ['Send to {cls}', 'إرسال إلى {cls}'],
  'sh.schedule': ['Schedule for {when}', 'جدولة الإرسال {when}'],
  'sh.sent': ['Sent to {cls}. Students can see it now.', 'أُرسل إلى {cls}، ويستطيع الطلاب رؤيته الآن.'],
  'sh.scheduled': ['Scheduled — students will see it {when}.', 'جُدول الإرسال، وسيراه الطلاب {when}.'],
  'sh.seeAsStudent': ['See as student', 'العرض بصفة طالب'],
  'sh.err.title': ['Please add a title.', 'أضف عنوانًا.'],
  'sh.err.class': ['Choose at least one class.', 'اختر شعبة واحدة على الأقل.'],
  'sh.err.quiz': ['Each question needs text and at least two answers.', 'يحتاج كل سؤال إلى نص وخيارين على الأقل.'],
  'sh.err.due': ['Choose a due date in the future.', 'اختر موعد تسليم في المستقبل.'],

  /* --- admin --- */
  'ad.user': ['Head of Middle School', 'رئيس المرحلة المتوسطة'],
  'ad.title': ['School overview', 'نظرة عامة على المدرسة'],
  'ad.sub': ['Middle School · Grades 6–8 · sample data', 'المرحلة المتوسطة · الصفوف ٦–٨ · بيانات تجريبية'],
  'ad.week': ['Week', 'الأسبوع'],
  'ad.wk.prev': ['Last week', 'الأسبوع الماضي'],
  'ad.wk.this': ['This week', 'هذا الأسبوع'],
  'ad.wk.next': ['Next week', 'الأسبوع القادم'],
  'ad.k.handedIn': ['Homework handed in', 'نسبة تسليم الواجبات'],
  'ad.k.toMark': ['Waiting to be marked', 'بانتظار التصحيح'],
  'ad.k.followUp': ['Students to follow up', 'طلاب بحاجة إلى متابعة'],
  'ad.noneDue': ['No deadlines have passed yet this week.', 'لم يحن أي موعد تسليم بعد هذا الأسبوع.'],
  'ad.load': ['Homework due per class each day', 'عدد الواجبات المطلوبة لكل شعبة يوميًا'],
  'ad.load.hint': ['All subjects. Days with 3 or more are highlighted — that is a lot for one day.', 'جميع المواد. تُبرز الأيام التي فيها ٣ واجبات أو أكثر، فهي كثيرة على يوم واحد.'],
  'ad.class': ['Class', 'الشعبة'],
  'ad.load.flag': [{ one: '{cls} has {n} assignment due on {day}', other: '{cls} has {n} assignments due on {day}' }, { one: 'لدى {cls} واجب واحد مطلوب يوم {day}', two: 'لدى {cls} واجبان مطلوبان يوم {day}', few: 'لدى {cls} {n} واجبات مطلوبة يوم {day}', many: 'لدى {cls} {n} واجبًا مطلوبًا يوم {day}', other: 'لدى {cls} {n} واجب مطلوب يوم {day}' }],
  'ad.load.none': ['No overloaded days this week.', 'لا توجد أيام مزدحمة هذا الأسبوع.'],
  'ad.byGrade': ['Handed in by grade', 'نسبة التسليم حسب الصف'],
  'ad.byGrade.hint': ['For deadlines that have passed this week', 'للواجبات التي انتهى موعدها هذا الأسبوع'],
  'ad.gradeN': ['Grade {g}', 'الصف {g}'],
  'ad.followUp': ['Students to follow up', 'طلاب بحاجة إلى متابعة'],
  'ad.followUp.hint': ['Missed 3 or more homeworks', 'فاتهم ٣ واجبات أو أكثر'],
  'ad.missed': ['Not handed in: {n}', 'لم يسلّم: {n}'],
  'ad.notify': ['Tell homeroom teacher', 'إبلاغ رائد الفصل'],
  'ad.notified': ['Noted for follow-up', 'سُجّلت للمتابعة'],
  'ad.notifyToast': ['Demo: the homeroom teacher of {cls} would be told here. Nothing was sent.', 'للعرض: سيُبلَّغ رائد فصل {cls} هنا، ولم يُرسَل أي إشعار.'],
  'ad.latest': ['Latest activity', 'آخر النشاطات'],
  'ad.live': ['LIVE', 'مباشر'],
  'ad.act.in': ['{name} handed in “{title}”', 'سلّم {name} واجب «{title}»'],
  'ad.act.back': ['“{title}” sent back to {name}', 'أُعيد واجب «{title}» إلى {name}'],
  'ad.act.set': ['“{title}” set for {cls}', 'أُرسل واجب «{title}» إلى {cls}'],
  'ad.liveNote': ['Grade 8 boys’ Mathematics and class 8B1 update live from this demo. Other figures are fixed sample data.', 'تتحدّث بيانات رياضيات الصف الثامن (بنين) وشعبة 8B1 مباشرة من هذا العرض، وبقية الأرقام بيانات تجريبية ثابتة.'],
};

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

/** A timestamp `offset` days from today at hh:mm, nudged off the Fri/Sat weekend. */
function atDay(offset, h = 19, m = 0, base = Date.now()) {
  const d = new Date(base); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset);
  const wd = d.getDay();
  if (wd === 5) d.setDate(d.getDate() + (offset >= 0 ? 2 : -1));
  else if (wd === 6) d.setDate(d.getDate() + (offset >= 0 ? 1 : -2));
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

const toYMD = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
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
  nabil: { en: 'Mr. Nabil Al-Omari', ar: 'الأستاذ نبيل العمري', shortEn: 'Mr. Nabil', shortAr: 'الأستاذ نبيل', greetAr: 'أستاذ نبيل', subject: 'math' },
  daniel: { en: 'Mr. Daniel Brooks', ar: 'الأستاذ دانيال بروكس', subject: 'english' },
  yusuf: { en: 'Mr. Yusuf Rahman', ar: 'الأستاذ يوسف رحمن', subject: 'science' },
  saeed: { en: 'Mr. Saeed Al-Ghamdi', ar: 'الأستاذ سعيد الغامدي', subject: 'arabic' },
  abdullah: { en: 'Mr. Abdullah Al-Shehri', ar: 'الأستاذ عبدالله الشهري', subject: 'islamic' },
  hassan: { en: 'Mr. Hassan Qureshi', ar: 'الأستاذ حسن قريشي', subject: 'social' },
  adel: { en: 'Mr. Adel Mansour', ar: 'الأستاذ عادل منصور', subject: 'ict' },
  kareem: { en: 'Mr. Kareem Haddad', ar: 'الأستاذ كريم حداد', subject: 'art' },
  noura: { en: 'Ms. Noura Al-Zahrani', ar: 'الأستاذة نورة الزهراني', subject: 'math' },
  hind: { en: 'Ms. Hind Al-Malki', ar: 'الأستاذة هند المالكي', subject: 'arabic' },
  khalid: { en: 'Dr. Khalid Bakr', ar: 'الدكتور خالد بكر', subject: 'biology' },
  ahmed: { en: 'Mr. Ahmed Fathy', ar: 'الأستاذ أحمد فتحي', subject: 'math' },
  rami: { en: 'Mr. Rami Aziz', ar: 'الأستاذ رامي عزيز', subject: 'englit' },
  tariq: { en: 'Mr. Tariq Saleh', ar: 'الأستاذ طارق صالح', subject: 'chemistry' },
  hani: { en: 'Mr. Hani Kamal', ar: 'الأستاذ هاني كمال', subject: 'physics' },
};
const DEMO_TEACHER = 'nabil';
const DEMO_CLASSES = ['8B1', '8B2', '8B3'];

const GRADE_AR = { 1: 'الأول', 6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع', 10: 'العاشر', 11: 'الحادي عشر', 12: 'الثاني عشر' };
const KG_AR = { 1: 'الأولى', 2: 'الثانية', 3: 'الثالثة' };
const SEC_AR = { A: 'أ', B: 'ب', C: 'ج' };
/** School class codes: boys 8B1, girls 8G2, KG with letters (KG2-A). */
function parseCls(c) {
  const kg = /^KG(\d)-([A-Z])$/.exec(c);
  if (kg) return { kg: true, g: 0, level: Number(kg[1]), s: kg[2] };
  const m = /^(\d+)([BG])(\d+)$/.exec(c);
  return m ? { g: Number(m[1]), gender: m[2], n: Number(m[3]) } : { g: 0 };
}
const ADMIN_CLASSES = ['6B1', '6B2', '6G1', '6G2', '7B1', '7B2', '7G1', '7G2', '8B1', '8B2', '8B3', '8G1', '8G2'];

const FIRST_BOYS = [['Abdullah', 'عبدالله'], ['Abdulaziz', 'عبدالعزيز'], ['Ahmed', 'أحمد'], ['Ali', 'علي'], ['Anas', 'أنس'], ['Bader', 'بدر'], ['Hamad', 'حمد'], ['Hussain', 'حسين'], ['Ibrahim', 'إبراهيم'], ['Kareem', 'كريم'], ['Khalid', 'خالد'], ['Mazen', 'مازن'], ['Mohammed', 'محمد'], ['Muath', 'معاذ'], ['Nasser', 'ناصر'], ['Osama', 'أسامة'], ['Rakan', 'راكان'], ['Saud', 'سعود'], ['Sami', 'سامي'], ['Talal', 'طلال'], ['Waleed', 'وليد'], ['Yazeed', 'يزيد'], ['Yousef', 'يوسف'], ['Ziyad', 'زياد'], ['Hamza', 'حمزة'], ['Majed', 'ماجد'], ['Turki', 'تركي'], ['Saleh', 'صالح'], ['Fahad', 'فهد'], ['Sultan', 'سلطان'], ['Nawaf', 'نواف'], ['Rayan', 'ريان'], ['Adam', 'آدم'], ['Zaid', 'زيد'], ['Tariq', 'طارق'], ['Mustafa', 'مصطفى'], ['Hassan', 'حسن'], ['Saad', 'سعد'], ['Faris', 'فارس'], ['Hatem', 'حاتم'], ['Ammar', 'عمّار'], ['Bilal', 'بلال'], ['Jamal', 'جمال'], ['Luay', 'لؤي'], ['Mansour', 'منصور']];
const FAMILY = [['Al-Qahtani', 'القحطاني'], ['Al-Ghamdi', 'الغامدي'], ['Al-Zahrani', 'الزهراني'], ['Al-Otaibi', 'العتيبي'], ['Al-Shehri', 'الشهري'], ['Al-Dosari', 'الدوسري'], ['Al-Mutairi', 'المطيري'], ['Al-Shammari', 'الشمري'], ['Al-Malki', 'المالكي'], ['Al-Juhani', 'الجهني'], ['Al-Subaie', 'السبيعي'], ['Al-Anazi', 'العنزي'], ['Al-Sharif', 'الشريف'], ['Al-Amoudi', 'العمودي'], ['Al-Harthi', 'الحارثي'], ['Al-Bishi', 'البيشي'], ['Al-Yami', 'اليامي'], ['Al-Rashidi', 'الرشيدي'], ['Al-Hazmi', 'الحازمي'], ['Al-Saadi', 'السعدي'], ['Bakr', 'بكر'], ['Khan', 'خان'], ['Siddiqui', 'صدّيقي'], ['Al-Attas', 'العطاس'], ['Hashem', 'هاشم'], ['Al-Kaabi', 'الكعبي'], ['Al-Faraj', 'الفرج'], ['Al-Saleh', 'الصالح'], ['Al-Harbi', 'الحربي'], ['Bawazir', 'باوزير']];

function makeStudent(id, cls, first, family) {
  return { id, cls, en: `${first[0]} ${family[0]}`, ar: `${first[1]} ${family[1]}`, firstEn: first[0], firstAr: first[1] };
}

const STUDENT_OMAR = makeStudent('s_omar', '8B1', ['Omar', 'عمر'], ['Al-Harbi', 'الحربي']);
const STUDENT_LAYAN = makeStudent('s_layan', 'KG2-A', ['Layan', 'ليان'], ['Al-Qahtani', 'القحطاني']);
const STUDENT_FAISAL = makeStudent('s_faisal', '11B1', ['Faisal', 'فيصل'], ['Al-Ghamdi', 'الغامدي']);
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
  const r8b = make('8B1', 23, 3);
  const all = {
    '8B2': make('8B2', 22, 17),
    '8B1': [STUDENT_OMAR, ...r8b].sort((a, b) => a.en.localeCompare(b.en)),
    '8B3': make('8B3', 22, 30),
    'KG2-A': [STUDENT_LAYAN],
    '11B1': [STUDENT_FAISAL],
  };
  all['8B2'].sort((a, b) => a.en.localeCompare(b.en));
  all['8B3'].sort((a, b) => a.en.localeCompare(b.en));
  return all;
})();
const STUDENTS = Object.fromEntries(Object.values(ROSTERS).flat().map((s) => [s.id, s]));

/** Students whose seeded record shows a pattern worth following up (fictional). */
const SUPPORT_PATTERNS = (() => {
  const pick = (cls, i) => ROSTERS[cls].filter((s) => s.id !== 's_omar')[i].id;
  return {
    [pick('8B1', 15)]: { missing: ['m2', 'm3', 'm4'], ability: 0.55 },
    [pick('8B1', 9)]: { missing: ['m1', 'm4', 'm5'], ability: 0.6 },
    [pick('8B2', 8)]: { missing: ['m2', 'm3', 'm5'], ability: 0.58 },
    [pick('8B3', 4)]: { missing: ['m3'], ability: 0.36 },
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

  /* --- Mr. Nabil's Mathematics (8B1 / 8B2 / 8B3, boys) --- */
  const ws = (name) => [{ id: uid('att'), kind: 'worksheet', name }];
  add({ id: 'm1', title: 'Number Sense Warm-up', subject: 'math', teacherId: 'nabil', classes: ['8B1', '8B2', '8B3'], dueAt: atDay(-33, 19, 0, now), instructions: 'A quick check on rounding, powers and comparing numbers. Choose the best answer for each question.', blocks: [
    { type: 'mcq', prompt: 'Which number is irrational?', options: ['0.75', '√2', '3/8', '−4'], correct: 1, points: 2 },
    { type: 'mcq', prompt: 'Round 3.4762 to 2 decimal places.', options: ['3.47', '3.48', '3.5', '3.476'], correct: 1, points: 2 },
    { type: 'mcq', prompt: 'What is 2⁻³?', options: ['−8', '−6', '1/8', '1/6'], correct: 2, points: 2 },
    { type: 'mcq', prompt: 'Which is the largest?', options: ['0.6', '5/8', '62%', '0.059'], correct: 1, points: 2 },
    { type: 'tf', prompt: 'The square root of 81 is 9.', correct: true, points: 2 },
  ] });
  add({ id: 'm2', title: 'Algebraic Expressions Review', subject: 'math', teacherId: 'nabil', classes: ['8B1', '8B2', '8B3'], dueAt: atDay(-26, 19, 0, now), sample: 'equations', instructions: 'Expand, factorise and simplify — Exercise 5A questions 1–15. Show every step.', attachments: ws('Exercise 5A — Expressions.pdf'), blocks: [PAPER_BLOCK(10)] });
  add({ id: 'm3', title: 'Ratio & Proportion Quiz', subject: 'math', teacherId: 'nabil', classes: ['8B1', '8B2', '8B3'], dueAt: atDay(-19, 19, 0, now), instructions: 'Five questions on ratio and direct proportion. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'Simplify the ratio 18 : 24.', options: ['3 : 4', '2 : 3', '9 : 12', '6 : 8'], correct: 0, points: 2 },
    { type: 'mcq', prompt: 'Share 45 sweets in the ratio 2 : 3. How many are in the larger share?', options: ['18', '27', '30', '15'], correct: 1, points: 2 },
    { type: 'mcq', prompt: '5 pens cost 12 SAR. How much do 8 pens cost?', options: ['19.20 SAR', '18.00 SAR', '20.40 SAR', '16.80 SAR'], correct: 0, points: 2 },
    { type: 'tf', prompt: 'If y is directly proportional to x, doubling x doubles y.', correct: true, points: 2 },
    { type: 'mcq', prompt: 'A map has a scale of 1 : 50 000. What does 4 cm on the map represent?', options: ['2 km', '20 km', '200 m', '0.2 km'], correct: 0, points: 2 },
  ] });
  add({ id: 'm4', title: 'Percentages in Real Life', subject: 'math', teacherId: 'nabil', classes: ['8B1', '8B2', '8B3'], dueAt: atDay(-12, 19, 0, now), sample: 'textbook', instructions: 'Complete Exercise 4B on percentage increase and decrease. Photograph your answers.', attachments: ws('Exercise 4B — Percentages.pdf'), blocks: [PAPER_BLOCK(10)] });
  add({ id: 'm5', title: 'Angles in Polygons', subject: 'math', teacherId: 'nabil', classes: ['8B1', '8B2', '8B3'], dueAt: atDay(-5, 19, 0, now), sample: 'textbook', instructions: 'Find interior and exterior angles of regular polygons — Exercise 8A, questions 1–10.', attachments: ws('Exercise 8A — Polygons.pdf'), blocks: [PAPER_BLOCK(10)] });
  add({ id: 'm6', title: 'Linear Equations Practice', subject: 'math', teacherId: 'nabil', classes: ['8B1'], dueAt: atDay(1, 19, 0, now), publishAt: atDay(-3, 7, 30, now), sample: 'equations', instructions: 'Complete Exercise 6C questions 1–12 in your exercise book. Show each step of your working, then check each answer by substituting it back into the equation.', attachments: ws('Exercise 6C — Linear Equations.pdf'), blocks: [PAPER_BLOCK(10, 'Take a clear photo of each page of your working (questions 1–12).')] });
  add({ id: 'm7', title: 'Linear Equations Practice', subject: 'math', teacherId: 'nabil', classes: ['8B2'], dueAt: atDay(2, 19, 0, now), publishAt: atDay(-2, 7, 30, now), sample: 'equations', instructions: 'Complete Exercise 6C questions 1–12 in your exercise book. Show each step of your working, then check each answer by substituting it back into the equation.', attachments: ws('Exercise 6C — Linear Equations.pdf'), blocks: [PAPER_BLOCK(10, 'Take a clear photo of each page of your working (questions 1–12).')] });
  add({ id: 'm8', title: 'Angles & Parallel Lines Quiz', subject: 'math', teacherId: 'nabil', classes: ['8B3'], dueAt: atDay(5, 19, 0, now), publishAt: atDay(1, 7, 0, now), status: 'scheduled', instructions: 'Corresponding, alternate and co-interior angles. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'Alternate angles are…', options: ['equal', 'supplementary', 'complementary', 'always 90°'], correct: 0, points: 2 },
    { type: 'tf', prompt: 'Co-interior angles add up to 180°.', correct: true, points: 2 },
    { type: 'mcq', prompt: 'Two parallel lines are cut by a transversal. One angle is 65°. Its corresponding angle is…', options: ['25°', '65°', '115°', '130°'], correct: 1, points: 2 },
  ] });

  /* --- Omar's other subjects (Grade 8B, other teachers) --- */
  add({ id: 'en1', title: 'Persuasive Paragraph: School Uniforms', subject: 'english', teacherId: 'daniel', classes: ['8B1'], dueAt: atDay(3, 19, 0, now), instructions: 'Write one persuasive paragraph (150–200 words) arguing for or against school uniforms. Use the PEEL structure: Point, Evidence, Explain, Link.', rubric: ['content', 'evidence', 'language'], blocks: [
    { type: 'short', prompt: 'Write your topic sentence (your main point).', points: 2 },
    { type: 'long', prompt: 'Write your full persuasive paragraph.', points: 8 },
  ] });
  add({ id: 'sc1', title: 'States of Matter Quiz', subject: 'science', teacherId: 'yusuf', classes: ['8B1'], dueAt: atDay(-6, 19, 0, now), instructions: 'Six questions on particles and changes of state. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'In which state do particles vibrate in fixed positions?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correct: 0, points: 2 },
    { type: 'mcq', prompt: 'What is the change from gas to liquid called?', options: ['Evaporation', 'Condensation', 'Melting', 'Sublimation'], correct: 1, points: 2 },
    { type: 'mcq', prompt: 'Which has the weakest forces between its particles?', options: ['Ice', 'Water', 'Steam', 'Iron'], correct: 2, points: 2 },
    { type: 'mcq', prompt: 'Dry ice turning directly into a gas is called…', options: ['Melting', 'Freezing', 'Sublimation', 'Condensation'], correct: 2, points: 2 },
    { type: 'tf', prompt: 'Diffusion happens faster in gases than in liquids.', correct: true, points: 1 },
    { type: 'tf', prompt: 'Gases have a fixed volume.', correct: false, points: 1 },
  ] });
  add({ id: 'ar1', title: 'قراءة وفهم: نص عن الأمانة', subject: 'arabic', teacherId: 'saeed', classes: ['8B1'], lang: 'ar', dueAt: atDay(3, 19, 0, now), instructions: 'اقرأ النص المرفق «الأمانة خُلُق الكرام» قراءة متأنية، ثم أجب عن الأسئلة الآتية.', attachments: [{ id: 'att_ar1', kind: 'worksheet', name: 'نص: الأمانة خُلُق الكرام.pdf' }], rubric: ['understanding', 'language'], blocks: [
    { type: 'mcq', prompt: 'ما الفكرة الرئيسة في النص؟', options: ['فضل الأمانة وأثرها في المجتمع', 'أهمية الرياضة للجسم', 'وصف رحلة إلى الصحراء', 'قصة عن الصداقة'], correct: 0, points: 2 },
    { type: 'short', prompt: 'ما معنى كلمة «الوفاء» كما وردت في النص؟', points: 2 },
    { type: 'tf', prompt: 'يرى الكاتب أن الأمانة تقتصر على حفظ المال.', correct: false, points: 1 },
    { type: 'long', prompt: 'اكتب فقرة من خمسة أسطر تصف فيها موقفًا ظهرت فيه الأمانة.', points: 5 },
  ] });
  add({ id: 'is1', title: 'سورة الملك: الآيات ١–٥ — المعاني', subject: 'islamic', teacherId: 'abdullah', classes: ['8B1'], lang: 'ar', dueAt: atDay(3, 19, 0, now), instructions: 'اقرأ الآيات من ١ إلى ٥ من سورة الملك مع التفسير الميسّر، ثم أجب باختصار.', rubric: ['understanding'], blocks: [
    { type: 'short', prompt: 'ما معنى «تبارك» في الآية الأولى؟', points: 2 },
    { type: 'short', prompt: 'ما الحكمة من خلق الموت والحياة كما ورد في الآية الثانية؟', points: 2 },
    { type: 'match', prompt: 'صِل كل كلمة بمعناها.', pairs: [{ left: 'تفاوت', right: 'اختلاف وعدم تناسب' }, { left: 'فطور', right: 'شقوق وصدوع' }, { left: 'خاسئًا', right: 'ذليلًا صاغرًا' }, { left: 'حسير', right: 'كليل منقطع' }], points: 4 },
  ] });
  add({ id: 'ss1', title: 'Map of Saudi Regions', subject: 'social', teacherId: 'hassan', classes: ['8B1'], dueAt: atDay(-1, 19, 0, now), latePolicy: { mode: 'until', until: atDay(2, 19, 0, now), deduct: false, pct: 10 }, instructions: 'Label all 13 administrative regions of Saudi Arabia on the blank map and colour-code them. Include a key and a compass rose.', attachments: [{ id: 'att_ss1', kind: 'worksheet', name: 'Blank map — Saudi regions.pdf' }], rubric: ['accuracy', 'presentation'], blocks: [
    { type: 'file', prompt: 'Upload your labelled map (photo, scan or PDF).', points: 8 },
    { type: 'short', prompt: 'Which region is Jeddah in, and what is that region’s capital city?', points: 2 },
  ] });
  add({ id: 'ict1', title: 'Spreadsheet Basics', subject: 'ict', teacherId: 'adel', classes: ['8B1'], dueAt: atDay(-9, 19, 0, now), allowResubmit: true, instructions: 'Build a weekly budget in a spreadsheet. Use SUM for the total and AVERAGE for the daily average. Format money cells as currency.', rubric: ['accuracy', 'presentation'], blocks: [
    { type: 'file', prompt: 'Upload your spreadsheet file.', points: 8 },
    { type: 'short', prompt: 'Which formula did you use to find the weekly total?', points: 2 },
  ] });
  add({ id: 'art1', title: 'Islamic Geometric Pattern Sketch', subject: 'art', teacherId: 'kareem', classes: ['8B1'], dueAt: atDay(-16, 19, 0, now), sample: 'pattern', instructions: 'Using a compass and ruler, construct an eight-point star pattern. Shade it using two colours.', rubric: ['method', 'creativity', 'presentation'], blocks: [PAPER_BLOCK(10, 'Photograph your finished sketch.')] });

  /* --- Layan (Grade 1A) --- */
  add({ id: 'e1', title: 'Count and colour 10 apples', subject: 'math', teacherId: 'noura', classes: ['KG2-A'], dueAt: atDay(1, 18, 0, now), instructions: 'Count 10 apples and colour them red. Then write the number 10 in the box.', attachments: [{ id: 'att_e1', kind: 'worksheet', name: 'Apples worksheet.pdf' }], rubric: ['understanding', 'presentation'], blocks: [PAPER_BLOCK(4, 'Take a photo of your coloured worksheet.')] });
  add({ id: 'e2', title: 'حروفي: ب ت ث', subject: 'arabic', teacherId: 'hind', classes: ['KG2-A'], lang: 'ar', dueAt: atDay(2, 18, 0, now), instructions: 'تتبّع الحروف ب ت ث، ثم اكتب كل حرف ثلاث مرات.', rubric: ['presentation'], blocks: [PAPER_BLOCK(3, 'صوّر ورقة الحروف بعد إكمالها.')] });
  add({ id: 'e3', title: 'Living or not living?', subject: 'science', teacherId: 'noura', classes: ['KG2-A'], dueAt: atDay(-4, 18, 0, now), instructions: 'Choose the right answer.', blocks: [
    { type: 'mcq', prompt: 'Which one is living?', options: ['A cat', 'A rock', 'A chair'], correct: 0, points: 1 },
    { type: 'tf', prompt: 'A tree is living.', correct: true, points: 1 },
    { type: 'mcq', prompt: 'What do plants need to grow?', options: ['Water and sunlight', 'Toys', 'Only sand'], correct: 0, points: 1 },
    { type: 'tf', prompt: 'A car is living.', correct: false, points: 1 },
  ] });
  add({ id: 'e4', title: 'My family: draw and label', subject: 'english', teacherId: 'noura', classes: ['KG2-A'], dueAt: atDay(3, 18, 0, now), instructions: 'Draw your family. Write a name under each person.', rubric: ['presentation'], blocks: [PAPER_BLOCK(3, 'Take a photo of your drawing.')] });
  add({ id: 'e5', title: 'Shapes around me', subject: 'math', teacherId: 'noura', classes: ['KG2-A'], dueAt: atDay(-11, 18, 0, now), instructions: 'Which shape is it?', blocks: [
    { type: 'mcq', prompt: 'A clock face is a…', options: ['Circle', 'Square', 'Triangle'], correct: 0, points: 1 },
    { type: 'mcq', prompt: 'A door is a…', options: ['Circle', 'Rectangle', 'Triangle'], correct: 1, points: 1 },
  ] });

  /* --- Faisal (Grade 11A) --- */
  add({ id: 'f1', title: 'Biology — Enzyme Practical Report', subject: 'biology', teacherId: 'khalid', classes: ['11B1'], dueAt: atDay(1, 23, 59, now), instructions: 'Write up the catalase practical: aim, method, results table, a graph of rate against temperature, and an evaluation. Upload your report as PDF or DOCX.', rubric: ['method', 'evidence', 'presentation'], blocks: [
    { type: 'file', prompt: 'Upload your full practical report.', points: 14 },
    { type: 'short', prompt: 'State the optimum temperature you found, with units.', points: 2 },
    { type: 'long', prompt: 'Evaluate one significant source of error and suggest an improvement.', points: 4 },
  ] });
  add({ id: 'f2', title: 'A-Level Maths: Differentiation', subject: 'math', teacherId: 'ahmed', classes: ['11B1'], dueAt: atDay(2, 23, 59, now), instructions: 'Exercise 7B: differentiate from first principles and using the power rule. Questions 1–15. Show full working.', attachments: [{ id: 'att_f2', kind: 'worksheet', name: 'Exercise 7B — Differentiation.pdf' }], blocks: [PAPER_BLOCK(15)] });
  add({ id: 'f3', title: 'Macbeth Act 1: Ambition', subject: 'englit', teacherId: 'rami', classes: ['11B1'], dueAt: atDay(5, 23, 59, now), instructions: 'How does Shakespeare present ambition in Act 1? Refer closely to language and structure. 600–800 words.', rubric: ['understanding', 'evidence', 'language'], blocks: [{ type: 'long', prompt: 'Your essay', points: 20 }] });
  add({ id: 'f4', title: 'Moles & Stoichiometry Quiz', subject: 'chemistry', teacherId: 'tariq', classes: ['11B1'], dueAt: atDay(-5, 23, 59, now), instructions: 'Five questions. Marked automatically.', blocks: [
    { type: 'mcq', prompt: 'How many moles are in 36 g of water (Mr = 18)?', options: ['2 mol', '0.5 mol', '18 mol', '36 mol'], correct: 0, points: 4 },
    { type: 'mcq', prompt: 'Avogadro’s constant is approximately…', options: ['6.02 × 10²³ mol⁻¹', '3.00 × 10⁸ mol⁻¹', '1.60 × 10⁻¹⁹ mol⁻¹', '9.81 mol⁻¹'], correct: 0, points: 4 },
    { type: 'mcq', prompt: 'What is the Mr of CO₂ (C = 12, O = 16)?', options: ['28', '44', '32', '40'], correct: 1, points: 4 },
    { type: 'mcq', prompt: '2H₂ + O₂ → 2H₂O. How many moles of water form from 3 mol of H₂?', options: ['1.5', '3', '6', '2'], correct: 1, points: 4 },
    { type: 'tf', prompt: 'One mole of any gas occupies about 24 dm³ at room temperature and pressure.', correct: true, points: 4 },
  ] });
  add({ id: 'f5', title: 'Kinematics Problem Set', subject: 'physics', teacherId: 'hani', classes: ['11B1'], dueAt: atDay(-1, 23, 59, now), latePolicy: { mode: 'accept', until: null, deduct: true, pct: 10 }, instructions: 'SUVAT problems 1–8. Show the equation you choose and your substitution.', blocks: [PAPER_BLOCK(16)] });
  add({ id: 'f6', title: 'مقال: أثر التقنية في حياتنا', subject: 'arabic', teacherId: 'saeed', classes: ['11B1'], lang: 'ar', dueAt: atDay(-14, 23, 59, now), instructions: 'اكتب مقالًا من ثلاث فقرات عن أثر التقنية في حياة الشباب، مع مقدمة وخاتمة.', rubric: ['content', 'language'], blocks: [{ type: 'long', prompt: 'المقال', points: 15 }] });

  /* --- submissions --- */
  const put = (aid, sid, o) => { S[subKey(aid, sid)] = { id: uid('sub'), assignmentId: aid, studentId: sid, answers: {}, annotations: {}, rubricScores: {}, comment: '', note: '', history: [], ...o }; };

  // Mr. Nabil's classes — generated.
  const mathIds = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
  mathIds.forEach((aid) => {
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
        const sub = { status: 'submitted', submittedAt, late: submittedAt > a.dueAt, draftSavedAt: submittedAt, answers: {} };
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
          if (cls === '8B1' && (isOmar || (rank >= 0 && rank < 5))) status = 'submitted';
          if (cls === '8B2' && rank < 7) status = 'submitted';
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

function isAnswered(b, v) {
  if (v == null) return false;
  if (b.type === 'short' || b.type === 'long') return String(v).trim().length > 0;
  if (b.type === 'checkbox' || b.type === 'file' || b.type === 'paper') return Array.isArray(v) && v.length > 0;
  if (b.type === 'match') return b.pairs.every((_, i) => v[i] != null && v[i] !== '');
  return true;
}


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
const teacherGreet = (id, lang) => { const x = TEACHERS[id]; return x ? (lang === 'ar' ? (x.greetAr || x.shortAr || x.ar) : (x.shortEn || x.en)) : id; };
const teacherShort = (id, lang) => { const x = TEACHERS[id]; if (!x) return id; return lang === 'ar' ? (x.shortAr || x.ar) : (x.shortEn || x.en); };
const studentName = (s, lang) => (s ? (lang === 'ar' ? s.ar : s.en) : '');
const studentFirst = (s, lang) => (s ? (lang === 'ar' ? s.firstAr : s.firstEn) : '');
const toArDigits = (x) => String(x).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
/** Short labels are the school's own codes (8B1, 8G2, KG2-A) in both languages; long labels spell them out. */
function clsLabel(code, lang, long = false) {
  if (!long) return code;
  const p = parseCls(code);
  if (lang === 'ar') {
    if (p.kg) return `الروضة ${KG_AR[p.level] || p.level} – الشعبة ${SEC_AR[p.s] || p.s}`;
    return `الصف ${GRADE_AR[p.g] || p.g} – ${p.gender === 'G' ? 'بنات' : 'بنين'} ${toArDigits(p.n)} (${code})`;
  }
  if (p.kg) return code;
  return `Grade ${code}`;
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
  scheduled: { tone: 'blue', icon: CalendarClock },
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
  const initials = (name || '?').split(/\s+/).filter((w) => w && !/^(of|and|the)$/i.test(w)).slice(0, 2).map((w) => w.replace(/^(Al-|ال)/, '')[0]).join('');
  const dims = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  const tones = { indigo: 'bg-ags-indigo-100 text-ags-indigo', gold: 'bg-ags-gold text-ags-navy', navy: 'bg-ags-navy text-ags-gold' };
  return <span aria-hidden="true" className={cx('inline-flex items-center justify-center rounded-full font-bold shrink-0', dims, tones[tone])}>{initials}</span>;
}

function ProgressBar({ value, max = 1, tone = 'indigo', label, className, height = 'h-2' }) {
  const pct = max ? clamp(value / max, 0, 1) : 0;
  const [shown, setShown] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setShown(pct)); return () => cancelAnimationFrame(id); }, [pct]);
  const fills = { indigo: 'bg-ags-indigo', gold: 'bg-ags-gold', green: 'bg-emerald-600', amber: 'bg-amber-500' };
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label} className={cx('w-full rounded-full bg-slate-200/80 overflow-hidden', height, className)}>
      <div className={cx('h-full rounded-full transition-[width] duration-700 ease-out', fills[tone])} style={{ width: `${shown * 100}%` }} />
    </div>
  );
}

function Segmented({ options, value, onChange, ariaLabel, dark = false, muted = false, size = 'md', full = false, className }) {
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
      className={cx('inline-flex items-stretch rounded-xl p-1 gap-1', dark ? 'bg-white/10 ring-1 ring-white/15' : muted ? 'bg-slate-100 ring-1 ring-slate-200/70' : 'bg-white ring-1 ring-slate-200', full && 'w-full', className)}>
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

/** Numbers that count up gently when they first appear (instant with reduced motion). */
function CountUp({ value, format = (v) => v }) {
  const { settings } = useApp();
  const still = settings.reduceMotion || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [v, setV] = useState(still ? value : 0);
  useEffect(() => {
    if (still) { setV(value); return undefined; }
    let raf; const t0 = performance.now();
    const step = (tm) => { const p = Math.min(1, (tm - t0) / 700); setV(value * (1 - (1 - p) ** 3)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, still]);
  return <span className="tabular">{format(v)}</span>;
}

/** A horizontal bar that grows from zero. */
function Bar({ value, open = false }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setW(clamp(value, 0, 1))); return () => cancelAnimationFrame(id); }, [value]);
  return <span className={cx('block h-full rounded-e transition-[width] duration-700 ease-out', open ? 'bg-ags-indigo/60' : 'bg-ags-indigo')} style={{ width: `${w * 100}%` }} />;
}

/** Brand banner used at the top of each home screen. */
function Hero({ children, className }) {
  return (
    <section className={cx('hero on-dark p-6 sm:p-8 mb-8', className)}>
      <div aria-hidden="true" className="hero-pattern" />
      <div aria-hidden="true" className="hero-glow" />
      <div className="relative">{children}</div>
    </section>
  );
}

/** Calm celebration on hand-in: a drawn check, one soft ring and a few sparkles. */
function SuccessCheck({ early = false }) {
  const sparks = [[-64, -44], [66, -48], [-82, 14], [84, 18], [-38, 62], [42, 64]];
  return (
    <div className="relative w-28 h-28 mx-auto" aria-hidden="true">
      <span className={cx('absolute inset-2 rounded-full ags-ring', early ? 'bg-amber-300/50' : 'bg-emerald-300/50')} />
      {sparks.map(([dx, dy], i) => (
        <span key={i} className="ags-spark absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 w-3 h-3" style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${0.35 + i * 0.05}s` }}>
          <svg viewBox="0 0 10 10" className="w-3 h-3"><polygon points="5,0 6.2,3.8 10,3.8 7,6.1 8.1,10 5,7.6 1.9,10 3,6.1 0,3.8 3.8,3.8" fill={BRAND.gold} /></svg>
        </span>
      ))}
      {early ? (
        <svg viewBox="0 0 100 100" className="relative w-28 h-28 ags-star">
          <polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" fill={BRAND.gold} stroke={BRAND.goldHover} strokeWidth="2" strokeLinejoin="round" />
          <path d="M34 52 l11 11 l22 -24" fill="none" stroke={BRAND.navy} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="ags-draw-check" />
        </svg>
      ) : (
        <svg viewBox="0 0 56 56" className="relative w-28 h-28">
          <circle cx="28" cy="28" r="24" fill="#ECFDF5" />
          <circle cx="28" cy="28" r="24" fill="none" stroke="#059669" strokeWidth="3" className="ags-draw-circle" />
          <path d="M17 29 l7.5 7.5 l15 -16" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="ags-draw-check" />
        </svg>
      )}
    </div>
  );
}

/* ---------- shared: document preview, annotation canvas, image helpers ---------- */

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


/* ============================================================================
 * 9. SHELL — one top bar, no sidebar. Teachers get three simple tabs.
 * ========================================================================== */

function Logo() {
  const { t } = useApp();
  if (AGS_LOGO) {
    return (
      <div className="flex items-center gap-3 min-w-0">
        <img src={AGS_LOGO} alt={t('app.school')} className="h-11 sm:h-14 w-auto object-contain shrink-0" />
        <span aria-hidden="true" className="hidden sm:block w-px h-8 bg-slate-200" />
        <span className="hidden sm:block font-bold text-ags-navy text-[1.05rem] whitespace-nowrap">{t('app.name')}</span>
      </div>
    );
  }
  return (
    <div className="leading-tight min-w-0">
      <span className="block font-bold text-ags-navy text-[1.1rem]">{t('app.name')}</span>
      <span className="block text-[0.72rem] text-ags-slate truncate max-w-[13rem] sm:max-w-none">{t('app.school')}</span>
    </div>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useApp();
  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-xl bg-slate-100 ring-1 ring-slate-200/70 p-1">
      {[['en', 'EN', 'English'], ['ar', 'ع', 'العربية']].map(([code, short, full]) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} aria-label={full} onClick={() => setLang(code)}
          className={cx('min-w-[2.4rem] min-h-[2.1rem] px-2 rounded-lg text-sm font-bold transition-all', lang === code ? 'bg-white text-ags-indigo shadow-sm ring-1 ring-slate-200' : 'text-ags-slate hover:text-ags-navy')}>{short}</button>
      ))}
    </div>
  );
}

function RoleSwitch({ full }) {
  const { role, setRole, t } = useApp();
  return (
    <Segmented muted full={full} ariaLabel={t('role.label')} value={role} onChange={setRole}
      options={[{ value: 'student', label: t('role.student'), icon: GraduationCap }, { value: 'teacher', label: t('role.teacher'), icon: Presentation }, { value: 'admin', label: t('role.admin'), icon: Building2 }]} />
  );
}

function TopBar({ onSettings }) {
  const { t } = useApp();
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/70 shadow-[0_10px_30px_-24px_rgba(32,31,60,.45)]">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 h-[4.75rem]">
        <Logo />
        <div className="hidden md:flex flex-1 justify-center"><RoleSwitch /></div>
        <div className="ms-auto md:ms-0 flex items-center gap-1.5">
          <LangToggle />
          <button type="button" onClick={onSettings} className="btn btn-ghost btn-icon" aria-label={t('settings')}><Settings aria-hidden="true" className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="md:hidden px-4 pb-3"><RoleSwitch full /></div>
      <div aria-hidden="true" className="h-[3px] bg-gradient-to-r from-ags-indigo via-ags-gold to-ags-indigo" />
    </header>
  );
}

function AgeBar() {
  const { t, stage, setStage } = useApp();
  return (
    <div className="bg-ags-gold-50 border-b border-amber-200/70">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm text-ags-navy inline-flex items-center gap-2"><Eye aria-hidden="true" className="w-4 h-4" />{t('stage.label')}</span>
        <div className="scroll-x max-w-full">
          <Segmented size="sm" ariaLabel={t('stage.label')} value={stage} onChange={setStage}
            options={[{ value: 'early', label: t('stage.early') }, { value: 'middle', label: t('stage.middle') }, { value: 'senior', label: t('stage.senior') }]} />
        </div>
      </div>
    </div>
  );
}

function TeacherTabs() {
  const { t, route, navigate } = useApp();
  const active = route.name === 'create' ? 'create' : route.name === 'progress' ? 'progress' : 'home';
  const tabs = [['home', 'tt.home', LayoutDashboard], ['create', 'tt.create', PlusCircle], ['progress', 'tt.progress', BarChart3]];
  return (
    <nav aria-label={t('nav.main')} className="scroll-x mb-6">
      <div className="flex gap-2 w-max">
        {tabs.map(([id, k, I]) => (
          <button key={id} type="button" aria-current={active === id ? 'page' : undefined} onClick={() => navigate({ name: id })}
            className={cx('inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.95rem] font-medium ring-1 whitespace-nowrap min-h-[2.75rem] transition-colors', active === id ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-200 hover:ring-ags-indigo')}>
            <I aria-hidden="true" className="w-4 h-4" />{t(k)}
          </button>
        ))}
      </div>
    </nav>
  );
}

function DemoGuide() {
  const { t, guide, setGuide, guideGo } = useApp();
  const steps = [1, 2, 3, 4, 5, 6];
  const done = steps.filter((i) => guide.steps[i]).length;
  const next = steps.find((i) => !guide.steps[i]);
  if (!guide.open) {
    return (
      <button type="button" key={done} onClick={() => setGuide((g) => ({ ...g, open: true }))}
        className={cx('fixed z-40 bottom-4 start-4 btn btn-gold shadow-lg rounded-full', done > 0 && 'ags-flash')}>
        <Sparkles aria-hidden="true" className="w-4 h-4" />{t('guide.title')}
        <span className="text-xs font-bold bg-ags-navy text-ags-gold rounded-full px-1.5 tabular">{t('guide.progress', { n: done })}</span>
      </button>
    );
  }
  return (
    <aside aria-label={t('guide.title')} className="fixed z-40 bottom-4 start-4 w-[min(21rem,calc(100vw-2rem))] card shadow-2xl ags-fade-up overflow-hidden">
      <div className="bg-ags-navy text-white px-4 py-3 flex items-center gap-2 on-dark">
        <Sparkles aria-hidden="true" className="w-4 h-4 text-ags-gold" />
        <h2 className="font-bold text-sm flex-1">{t('guide.title')}</h2>
        <span className="text-xs text-white/80 tabular">{t('guide.progress', { n: done })}</span>
        <button type="button" className="btn btn-icon text-white/85 hover:bg-white/10 !min-h-0 !min-w-0 w-8 h-8" onClick={() => setGuide((g) => ({ ...g, open: false }))} aria-label={t('guide.hide')}><X aria-hidden="true" className="w-4 h-4" /></button>
      </div>
      <ol className="p-2 space-y-0.5">
        {steps.map((i) => {
          const ok = guide.steps[i];
          return (
            <li key={i}>
              <button type="button" onClick={() => guideGo(i)} className={cx('w-full text-start flex items-start gap-2.5 rounded-xl px-2.5 py-2 transition-colors', ok ? 'bg-emerald-50/70 hover:bg-emerald-50' : i === next ? 'bg-ags-gold-50 ring-1 ring-amber-200' : 'hover:bg-slate-50')}>
                <span aria-hidden="true" className={cx('mt-0.5 w-6 h-6 rounded-full shrink-0 inline-flex items-center justify-center text-xs font-bold', ok ? 'bg-emerald-600 text-white' : 'bg-ags-indigo-50 text-ags-indigo')}>{ok ? <Check className="w-3.5 h-3.5" /> : i}</span>
                <span className={cx('text-[0.86rem] leading-snug flex-1', ok ? 'text-emerald-900' : 'text-ags-navy')}><span className="sr-only">{ok ? `${t('guide.done')}: ` : ''}</span>{t(`guide.s${i}`)}</span>
                <ArrowRight aria-hidden="true" className="w-4 h-4 mt-0.5 text-ags-indigo flip-rtl shrink-0" />
              </button>
            </li>
          );
        })}
      </ol>
      <p className="px-4 pb-3 text-xs text-ags-slate">{t('guide.hint')}</p>
    </aside>
  );
}

function SettingsModal({ open, onClose, onReset, onAbout }) {
  const { t, settings, setSettings, guide, setGuide } = useApp();
  return (
    <Modal open={open} onClose={onClose} title={t('settings')} icon={Settings} size="sm" footer={<button type="button" className="btn btn-primary" onClick={onClose}>{t('close')}</button>}>
      <div className="space-y-6">
        <div>
          <p className="label">{t('settings.textSize')}</p>
          <Segmented full ariaLabel={t('settings.textSize')} value={settings.textSize} onChange={(v) => setSettings((s) => ({ ...s, textSize: v }))}
            options={[{ value: 's', label: t('settings.size.s') }, { value: 'm', label: t('settings.size.m') }, { value: 'l', label: t('settings.size.l') }, { value: 'xl', label: t('settings.size.xl') }]} />
        </div>
        <Switch checked={settings.reduceMotion} onChange={(v) => setSettings((s) => ({ ...s, reduceMotion: v }))} label={t('settings.motion')} hint={t('settings.motion.hint')} />
        <Switch checked={guide.open} onChange={(v) => setGuide((g) => ({ ...g, open: v }))} label={t('settings.guide')} />
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          <button type="button" className="btn btn-secondary" onClick={() => { onClose(); onReset(); }}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('demo.reset')}</button>
          <button type="button" className="btn btn-ghost" onClick={() => { onClose(); onAbout(); }}><Info aria-hidden="true" className="w-4 h-4" />{t('demo.about')}</button>
        </div>
      </div>
    </Modal>
  );
}

function Footer({ onAbout }) {
  const { t } = useApp();
  return (
    <footer className="mt-14 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ags-slate">
      <span>{t('app.school')}</span><span aria-hidden="true">·</span><span className="font-medium text-ags-indigo">{t('app.name')}</span><span aria-hidden="true">·</span>
      <button type="button" onClick={onAbout} className="inline-flex items-center gap-1.5 rounded-full bg-ags-gold-50 ring-1 ring-amber-200 px-2.5 py-1 text-ags-navy hover:bg-ags-gold-100">
        <Info aria-hidden="true" className="w-3.5 h-3.5" />{t('demo.footer')}
      </button>
    </footer>
  );
}

function H2({ icon: I, children, count, tone }) {
  const { fmt } = useApp();
  return (
    <h2 className="text-lg font-bold text-ags-navy flex items-center gap-2.5 mb-3">
      {I && <I aria-hidden="true" className={cx('w-5 h-5', tone || 'text-ags-indigo')} />}{children}
      {count != null && <span className="text-xs font-bold tabular bg-ags-indigo-50 text-ags-indigo rounded-full px-2 py-0.5">{fmt.n(count)}</span>}
    </h2>
  );
}

/* ============================================================================
 * 10. STUDENT — one list, one button per homework, photos on the same page
 * ========================================================================== */

function useStudentItems() {
  const { db, student, now } = useApp();
  return useMemo(() => Object.values(db.assignments)
    .filter((a) => isVisibleToStudent(a, student, now))
    .map((a) => { const sub = db.submissions[subKey(a.id, student.id)]; return { a, sub, st: studentState(a, sub, now) }; }), [db, student, now]);
}

function lateText(t, fmt, a, now) {
  const p = a.latePolicy || {};
  const was = t('card.wasDue', { day: fmt.weekday(a.dueAt) });
  if (!canSubmit(a, now)) return `${was} · ${t('card.askTeacher')}`;
  if (p.mode === 'until' && p.until) return `${was} · ${t('card.lateUntil', { day: fmt.weekday(p.until) })}`;
  return `${was} · ${t('card.lateAny')}`;
}

function HomeworkCard({ item }) {
  const { t, fmt, stage, now, navigate } = useApp();
  const { a, sub, st } = item;
  const subj = SUBJECTS[a.subject] || SUBJECTS.math;
  const late = st === 'overdue' || st === 'closed';
  const ret = st === 'returned' || st === 'revision';
  const done = st === 'submitted' || st === 'submittedLate';
  const isNew = st === 'notStarted' && now - a.publishAt < DAY;
  const action = { notStarted: 'act.start', draft: sub?.resubmitting ? 'act.redo' : 'act.continue', overdue: 'act.late', closed: 'act.open', returned: 'act.feedback', revision: 'act.redo', submitted: 'act.view', submittedLate: 'act.view' }[st];
  const primary = ['notStarted', 'draft', 'overdue', 'revision'].includes(st);
  const when = late ? lateText(t, fmt, a, now)
    : ret ? t('card.returned', { when: agoLabel(t, sub.returnedAt, now) })
      : done ? t('card.handedIn', { when: agoLabel(t, sub.submittedAt, now) })
        : stage === 'early' ? (Math.round((startOfDay(a.dueAt) - startOfDay(now)) / DAY) === 1 ? t('due.early.tomorrow') : fmt.weekday(a.dueAt)) : dueLabel(t, fmt, a.dueAt, now);
  const big = stage === 'early'; const compact = stage === 'senior';
  return (
    <button type="button" onClick={() => navigate({ name: 'assignment', id: a.id })}
      className={cx('card lift group w-full text-start flex items-center gap-4 relative overflow-hidden', big ? 'p-5 min-h-[7rem]' : compact ? 'px-4 py-3' : 'p-4', late && 'ring-1 ring-amber-300')}>
      <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1.5" style={{ background: subj.color }} />
      {big ? <SubjectArt code={a.subject} /> : !compact && <SubjectBadge code={a.subject} />}
      <span className="flex-1 min-w-0">
        <SubjectTag code={a.subject} />
        <span className={cx('block font-bold text-ags-navy leading-snug mt-0.5', big ? 'text-xl' : compact ? 'text-base' : 'text-[1.08rem]')}>
          <bdi>{a.title}</bdi>{isNew && <span className="ms-2 align-middle text-[0.68rem] font-bold rounded-full bg-ags-gold text-ags-navy px-2 py-0.5">{t('card.new')}</span>}
        </span>
        <span className={cx('mt-1 flex items-center gap-1.5', big ? 'text-base' : 'text-sm', late ? 'text-amber-900' : 'text-ags-slate')}>
          {late ? <AlarmClock aria-hidden="true" className="w-4 h-4 shrink-0" /> : ret ? <MessageSquareText aria-hidden="true" className="w-4 h-4 shrink-0" /> : <Clock aria-hidden="true" className="w-4 h-4 shrink-0" />}
          <span>{when}</span>
        </span>
        {ret && sub.comment && !compact && <span className="mt-1.5 block text-sm text-ags-navy/90 line-clamp-1"><bdi>“{sub.comment}”</bdi></span>}
      </span>
      <span className="flex flex-col items-end gap-2 shrink-0">
        {ret && typeof sub.mark === 'number' && <span className="rounded-lg bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200 px-2.5 py-1 font-bold tabular">{fmt.score(sub.mark, a.points)}</span>}
        {(late || st === 'revision' || done) && <StatusChip status={st} size="sm" />}
        <span className={cx('btn pointer-events-none', primary ? 'btn-primary' : 'btn-secondary', big ? 'btn-lg' : 'btn-sm')}>{t(action)}<ArrowRight aria-hidden="true" className="w-4 h-4 flip-rtl" /></span>
      </span>
    </button>
  );
}

function StudentHome() {
  const { t, fmt, lang, stage, student, now, db, actions, navigate } = useApp();
  const items = useStudentItems();
  const [showDone, setShowDone] = useState(false);
  const upcoming = items.filter((x) => (['notStarted', 'draft'].includes(x.st) && (x.a.dueAt >= now || x.sub?.resubmitting))).sort((p, q) => p.a.dueAt - q.a.dueAt || q.a.publishAt - p.a.publishAt);
  const late = items.filter((x) => x.st === 'overdue' || (x.st === 'closed' && now - x.a.dueAt < 7 * DAY)).sort((p, q) => p.a.dueAt - q.a.dueAt);
  const feedback = items.filter((x) => x.st === 'revision' || (x.st === 'returned' && now - (x.sub.returnedAt || 0) < 7 * DAY)).sort((p, q) => (q.sub.returnedAt || 0) - (p.sub.returnedAt || 0));
  const done = items.filter((x) => ['submitted', 'submittedLate'].includes(x.st) || (x.st === 'returned' && !feedback.includes(x))).sort((p, q) => (q.sub.submittedAt || 0) - (p.sub.submittedAt || 0));
  const todoCount = upcoming.length + late.filter((x) => x.st === 'overdue').length;
  const next = upcoming[0] || late.find((x) => x.st === 'overdue');
  const hour = new Date(now).getHours();
  const greet = stage === 'early' ? t('greet.early', { name: studentFirst(student, lang) }) : t(hour < 12 ? 'greet.morning' : hour < 17 ? 'greet.afternoon' : 'greet.evening', { name: studentFirst(student, lang) });
  const summary = todoCount ? t.s('home.summary', stage, { n: todoCount }) : t.s('home.allDone', stage);
  const reminders = db.reminders.filter((r) => r.studentId === student.id && !r.dismissed);
  const List = ({ xs }) => <div className={cx('grid gap-3', stage === 'early' && 'gap-4')}>{xs.map((x, i) => <div key={x.a.id} className="ags-rise" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}><HomeworkCard item={x} /></div>)}</div>;
  return (
    <div className={cx('max-w-3xl mx-auto', stage === 'early' && 'stage-early')}>
      <Hero>
        <p className="text-sm text-white/75">{fmt.dateLong(now)} <span aria-hidden="true">·</span> {fmt.hijri(now)}</p>
        <h1 className={cx('font-bold mt-1 leading-tight', stage === 'early' ? 'text-4xl' : 'text-3xl sm:text-[2.15rem]')}>{greet}</h1>
        <p className={cx('mt-3 text-white/90 flex items-center gap-2', stage === 'early' ? 'text-xl' : 'text-lg')}>
          {todoCount ? <ListChecks aria-hidden="true" className="w-5 h-5 text-ags-gold shrink-0" /> : <Star aria-hidden="true" className="w-5 h-5 text-ags-gold fill-current shrink-0" />}{summary}
        </p>
        {next && (
          <button type="button" onClick={() => navigate({ name: 'assignment', id: next.a.id })} className={cx('btn btn-gold mt-5 shadow-lg', stage === 'early' && 'btn-lg')}>
            {t('home.startWith', { title: next.a.title })}<ArrowRight aria-hidden="true" className="w-4 h-4 flip-rtl" />
          </button>
        )}
      </Hero>

      {reminders.map((r) => (
        <div key={r.id} className="card p-4 mt-5 flex flex-wrap items-center gap-3 border-s-4 border-ags-gold">
          <Bell aria-hidden="true" className="w-5 h-5 text-ags-indigo" />
          <p className="flex-1 text-sm text-ags-navy min-w-[12rem]">{t('reminder.text', { teacher: teacherName(r.teacherId, lang), title: `⁨${db.assignments[r.assignmentId]?.title}⁩` })}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate({ name: 'assignment', id: r.assignmentId })}>{t('act.open')}</button>
          <button type="button" className="btn btn-ghost btn-icon" aria-label={t('dismiss')} onClick={() => actions.dismissReminder(r.id)}><X aria-hidden="true" className="w-4 h-4" /></button>
        </div>
      ))}

      <section aria-labelledby="todo-h">
        <h2 id="todo-h" className="sr-only">{t('home.todo')}</h2>
        <H2 icon={ListChecks} count={upcoming.length}>{t.s('home.todo', stage)}</H2>
        {upcoming.length ? <List xs={upcoming} /> : <div className="card"><EmptyState icon={CheckCircle2} title={t.s('home.nothing', stage)} /></div>}
      </section>

      {late.length > 0 && (
        <section className="mt-8 rounded-2xl bg-amber-50/70 ring-1 ring-amber-200 p-3 sm:p-4" aria-labelledby="late-h">
          <h2 id="late-h" className="text-lg font-bold text-amber-950 flex items-center gap-2.5"><AlarmClock aria-hidden="true" className="w-5 h-5 text-amber-700" />{t('home.late')}</h2>
          <p className="text-sm text-amber-900 mt-0.5 mb-3">{t('home.late.hint')}</p>
          <List xs={late} />
        </section>
      )}

      <section className="mt-10" aria-labelledby="fb-h">
        <h2 id="fb-h" className="sr-only">{t('home.feedback')}</h2>
        <H2 icon={MessageSquareText} tone="text-emerald-700" count={feedback.length}>{t.s('home.feedback', stage)}</H2>
        {feedback.length ? <List xs={feedback} /> : <div className="card"><EmptyState icon={MessageSquareText} title={t('home.noFeedback')} /></div>}
      </section>

      {done.length > 0 && (
        <section className="mt-10">
          <button type="button" className="btn btn-ghost -ms-3" aria-expanded={showDone} aria-controls="done-list" onClick={() => setShowDone((v) => !v)}>
            <CheckCheck aria-hidden="true" className="w-5 h-5" />{showDone ? t('home.hideDone') : t('home.showDone', { n: done.length })}<ChevronDown aria-hidden="true" className={cx('w-4 h-4 transition-transform', showDone && 'rotate-180')} />
          </button>
          <div id="done-list" hidden={!showDone} className="mt-3">{showDone && <List xs={done} />}</div>
        </section>
      )}
    </div>
  );
}

/* ---------- homework page ---------- */

const MATCH_ORDER = (b) => b.pairs.map((_, i) => i).sort((x, y) => hashStr(`${b.id}${x}`) - hashStr(`${b.id}${y}`));
const fmtSize = (n) => (n > 1e6 ? `${round1(n / 1e6)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
function readFileMeta(file) {
  return new Promise((resolve) => {
    const meta = { id: uid('f'), name: file.name, size: file.size, type: file.type };
    if (!file.type.startsWith('image/') || file.size > 8e6) { resolve(meta); return; }
    const url = URL.createObjectURL(file);
    downscaleImage(url, 900).then((r) => resolve({ ...meta, src: r.src })).catch(() => resolve(meta)).finally(() => URL.revokeObjectURL(url));
  });
}

function PhotoPages({ pages, onChange, editable, preview }) {
  const { t, stage, student, toast } = useApp();
  const [busy, setBusy] = useState(false);
  const [samples, setSamples] = useState(false);
  const camRef = useRef(null); const galRef = useRef(null);
  const add = (list) => { if (list.length) onChange([...pages, ...list]); setSamples(false); };
  const onFiles = async (e) => {
    const files = [...(e.target.files || [])]; e.target.value = '';
    if (!files.length) return;
    setBusy(true); const out = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) { toast(t('photo.notImage'), { kind: 'warn' }); continue; }
      const url = URL.createObjectURL(f);
      try { const r = await downscaleImage(url, 1600); out.push({ id: uid('pg'), src: r.src, name: f.name }); }
      catch { toast(t('photo.err'), { kind: 'warn' }); }
      finally { URL.revokeObjectURL(url); }
    }
    setBusy(false); add(out);
  };
  const rotate = async (i) => {
    setBusy(true);
    try { const src = await rotateImage(pageSrc(pages[i])); onChange(pages.map((p, j) => (j === i ? { ...p, src } : p))); }
    catch { toast(t('photo.err'), { kind: 'warn' }); }
    setBusy(false);
  };
  const remove = (i) => { const before = pages; onChange(pages.filter((_, j) => j !== i)); toast(t('photo.deleted'), { kind: 'info', action: { label: t('undo'), onClick: () => onChange(before) } }); };
  const big = stage === 'early';
  return (
    <div>
      {editable && (
        <>
          <input ref={camRef} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFiles} />
          <input ref={galRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFiles} />
          <div className="grid sm:grid-cols-2 gap-3">
            <button type="button" disabled={preview} onClick={() => camRef.current?.click()} className={cx('btn btn-gold btn-lg w-full', big && 'min-h-[4.5rem] text-xl')}><Camera aria-hidden="true" className="w-6 h-6" />{t('photo.take')}</button>
            <button type="button" disabled={preview} onClick={() => galRef.current?.click()} className={cx('btn btn-secondary btn-lg w-full', big && 'min-h-[4.5rem] text-xl')}><Upload aria-hidden="true" className="w-5 h-5" />{t('photo.upload')}</button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-ags-slate">{t('photo.tip')}</span>
            {!preview && <button type="button" className="text-ags-indigo font-medium underline underline-offset-4 hover:no-underline rounded" aria-expanded={samples} onClick={() => setSamples((v) => !v)}>{t('photo.sample')}</button>}
          </div>
          {samples && (
            <div className="mt-3 grid grid-cols-3 gap-3 ags-fade-up">
              {SAMPLE_SETS[stage].map((k) => (
                <button key={k} type="button" onClick={() => add([{ id: uid('pg'), sample: k, name: studentFirst(student, k === 'letters' ? 'ar' : 'en') }])} className="rounded-xl ring-1 ring-slate-200 hover:ring-2 hover:ring-ags-indigo overflow-hidden bg-white text-start">
                  <img src={sampleUri(k, studentFirst(student, k === 'letters' ? 'ar' : 'en'))} alt="" className="w-full aspect-[3/4] object-cover" />
                  <span className="block text-xs font-medium p-2 text-ags-navy">{t(SAMPLE_LABEL[k])}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {busy && <p role="status" className="mt-3 text-sm text-ags-slate inline-flex items-center gap-2"><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />{t('photo.busy')}</p>}
      {pages.length > 0 && (
        <ol className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label={t('photo.count', { n: pages.length })}>
          {pages.map((p, i) => (
            <li key={p.id} className="relative ags-pop">
              <img src={pageSrc(p)} alt={t('photo.page', { n: i + 1 })} className="w-full aspect-[3/4] object-cover rounded-xl ring-1 ring-slate-200 bg-white" />
              <span className="absolute top-2 start-2 text-xs font-bold bg-ags-navy text-white rounded-md px-2 py-0.5">{t('photo.page', { n: i + 1 })}</span>
              {editable && (
                <span className="absolute bottom-2 inset-x-2 flex justify-center gap-2">
                  <button type="button" onClick={() => rotate(i)} disabled={busy} className="btn btn-sm bg-white/95 text-ags-navy shadow ring-1 ring-slate-200" aria-label={`${t('photo.rotate')} — ${t('photo.page', { n: i + 1 })}`}><RotateCw aria-hidden="true" className="w-4 h-4" /><span className="hidden sm:inline">{t('photo.rotate')}</span></button>
                  <button type="button" onClick={() => remove(i)} className="btn btn-sm bg-white/95 text-rose-700 shadow ring-1 ring-slate-200" aria-label={`${t('photo.delete')} — ${t('photo.page', { n: i + 1 })}`}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** One question. Labels are kept to a minimum: the question, the answer, nothing else. */
function Question({ a, b, index, total, value, onChange, readOnly, showResults, highlight, preview }) {
  const { t, fmt, stage } = useApp();
  const cdir = a.lang === 'ar' ? 'rtl' : 'ltr';
  const big = stage === 'early';
  const name = `q_${b.id}`;
  const ok = showResults && isAuto(b) ? scoreBlock(b, value) >= b.points : null;
  const opt = (on, good, bad) => cx('flex items-center gap-3 rounded-xl px-4 py-3 transition-colors', big && 'py-4 text-lg',
    good ? 'ring-1 ring-emerald-300 bg-emerald-50' : bad ? 'ring-1 ring-rose-300 bg-rose-50' : on ? 'ring-2 ring-ags-indigo bg-ags-indigo-50' : 'ring-1 ring-slate-200 bg-white', !readOnly && 'cursor-pointer hover:ring-ags-indigo');
  let body = null;
  if (b.type === 'paper') body = <PhotoPages pages={Array.isArray(value) ? value : []} onChange={onChange} editable={!readOnly} preview={preview} />;
  else if (b.type === 'mcq' || b.type === 'tf') {
    const opts = b.type === 'tf' ? [{ v: true, l: t('q.true') }, { v: false, l: t('q.false') }] : b.options.map((o, i) => ({ v: i, l: o }));
    body = (
      <div className={cx('grid gap-2', b.type === 'tf' && 'grid-cols-2')} role="radiogroup" aria-labelledby={`${name}_p`}>
        {opts.map((o) => {
          const on = value === o.v; const good = showResults && o.v === b.correct; const bad = showResults && on && !good;
          return (
            <label key={String(o.v)} className={opt(on, good, bad)}>
              <input type="radio" name={name} checked={on} disabled={readOnly} onChange={() => onChange(o.v)} />
              <span className="flex-1" dir={b.type === 'tf' ? undefined : cdir}>{o.l}</span>
              {good && <CheckCircle2 aria-label={t('fb.correctAnswer')} className="w-5 h-5 text-emerald-600" />}
              {bad && <X aria-label={t('fb.yourAnswer')} className="w-5 h-5 text-rose-600" />}
            </label>
          );
        })}
      </div>
    );
  } else if (b.type === 'checkbox') {
    const cur = Array.isArray(value) ? value : [];
    body = <div className="grid gap-2">{b.options.map((o, i) => { const on = cur.includes(i); return <label key={i} className={opt(on, showResults && (b.correct || []).includes(i), showResults && on && !(b.correct || []).includes(i))}><input type="checkbox" checked={on} disabled={readOnly} onChange={() => onChange(on ? cur.filter((x) => x !== i) : [...cur, i])} /><span className="flex-1" dir={cdir}>{o}</span></label>; })}</div>;
  } else if (b.type === 'short') {
    body = <input className={cx('input', big && 'text-lg')} dir="auto" value={value || ''} readOnly={readOnly} placeholder={readOnly ? '' : t('q.typeHere')} aria-labelledby={`${name}_p`} onChange={(e) => onChange(e.target.value)} />;
  } else if (b.type === 'long') {
    body = <textarea className="input min-h-[10rem]" dir="auto" value={value || ''} readOnly={readOnly} placeholder={readOnly ? '' : t('q.typeHere')} aria-labelledby={`${name}_p`} onChange={(e) => onChange(e.target.value)} />;
  } else if (b.type === 'match') {
    const cur = value || {};
    body = (
      <div className="grid gap-2">
        {b.pairs.map((p, i) => (
          <div key={i} className={cx('grid sm:grid-cols-[1fr_1.4fr] gap-2 items-center rounded-xl p-2.5 ring-1', showResults ? (cur[i] === i ? 'ring-emerald-300 bg-emerald-50' : 'ring-rose-300 bg-rose-50') : 'ring-slate-200 bg-white')}>
            <span id={`${name}_l${i}`} className="font-bold text-ags-navy px-1" dir={cdir}>{p.left}</span>
            <select className="input" dir={cdir} aria-labelledby={`${name}_l${i}`} disabled={readOnly} value={cur[i] ?? ''} onChange={(e) => onChange({ ...cur, [i]: e.target.value === '' ? undefined : Number(e.target.value) })}>
              <option value="">{t('q.choose')}</option>
              {MATCH_ORDER(b).map((j) => <option key={j} value={j}>{b.pairs[j].right}</option>)}
            </select>
          </div>
        ))}
      </div>
    );
  } else if (b.type === 'file') {
    const files = Array.isArray(value) ? value : [];
    body = (
      <div>
        {files.length > 0 && <ul className="grid gap-2 mb-3">{files.map((f) => (
          <li key={f.id} className="flex items-center gap-3 rounded-xl ring-1 ring-slate-200 bg-white p-2.5">
            <span className="w-10 h-10 rounded-lg bg-ags-indigo-50 text-ags-indigo flex items-center justify-center overflow-hidden shrink-0">{f.src ? <img src={f.src} alt="" className="w-full h-full object-cover" /> : <FileText aria-hidden="true" className="w-5 h-5" />}</span>
            <span className="flex-1 min-w-0"><span className="block text-sm font-medium truncate" dir="auto">{f.name}</span><span className="block text-xs text-ags-slate tabular">{fmtSize(f.size || 0)}</span></span>
            {!readOnly && <button type="button" className="btn btn-ghost btn-icon" aria-label={`${t('photo.delete')}: ${f.name}`} onClick={() => onChange(files.filter((x) => x.id !== f.id))}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>}
          </li>))}</ul>}
        {!readOnly && <label className={cx('btn btn-secondary cursor-pointer', preview && 'pointer-events-none opacity-60')}><Upload aria-hidden="true" className="w-4 h-4" />{t('q.addFile')}<input type="file" className="sr-only" multiple disabled={preview} onChange={async (e) => { const fl = [...e.target.files]; e.target.value = ''; onChange([...files, ...(await Promise.all(fl.map(readFileMeta)))]); }} /></label>}
      </div>
    );
  }
  return (
    <section id={`q-${b.id}`} aria-labelledby={`${name}_p`} className={cx('card p-5 sm:p-6 scroll-mt-24', highlight && 'ring-2 ring-amber-400')}>
      {total > 1 && <p className="text-xs font-bold text-ags-indigo mb-1">{t('q.of', { n: index + 1, total })}</p>}
      <div className="flex items-start gap-3 mb-3">
        <h2 id={`${name}_p`} className={cx('font-bold text-ags-navy flex-1 leading-relaxed', big ? 'text-xl' : 'text-[1.06rem]')} dir={b.type === 'paper' ? undefined : cdir}>{b.type === 'paper' ? t('photo.title') : b.prompt}</h2>
        {ok === true && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200 rounded-full px-2 py-0.5"><Check aria-hidden="true" className="w-3.5 h-3.5" />{t('fb.correct')}</span>}
        {ok === false && <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-800 bg-rose-50 ring-1 ring-rose-200 rounded-full px-2 py-0.5"><X aria-hidden="true" className="w-3.5 h-3.5" />{t('fb.wrong')}</span>}
      </div>
      {b.type === 'paper' && b.prompt && <p className="text-sm text-ags-slate -mt-2 mb-4" dir="auto">{b.prompt}</p>}
      {highlight && <p className="text-sm text-amber-900 mb-3 flex items-center gap-1.5"><AlertCircle aria-hidden="true" className="w-4 h-4" />{t('q.needed')}</p>}
      {body}
    </section>
  );
}

function WorksheetButton({ a }) {
  const { t } = useApp();
  const [open, setOpen] = useState(null);
  const list = (a.attachments || []).filter((x) => x.kind !== 'link');
  if (!list.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {list.map((x) => <button key={x.id} type="button" className="btn btn-secondary" onClick={() => setOpen(x)}><FileText aria-hidden="true" className="w-4 h-4" />{x.kind === 'worksheet' ? t('a.openWorksheet') : <bdi>{x.name}</bdi>}</button>)}
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name || ''} icon={FileText} footer={<button type="button" className="btn btn-primary" onClick={() => setOpen(null)}>{t('close')}</button>}>
        {open && (open.kind === 'image' && open.src ? <img src={open.src} alt={open.name} className="w-full rounded-lg" /> : <DocPreview att={open} a={a} />)}
        <p className="hint mt-3">{t('att.mockNote')}</p>
      </Modal>
    </div>
  );
}

function FeedbackBox({ a, sub }) {
  const { t, fmt, lang, now, actions, student, toast } = useApp();
  const pages = a.blocks.filter((b) => b.type === 'paper').flatMap((b) => sub.answers[b.id] || []);
  const marked = pages.filter((p) => (sub.annotations || {})[p.id]?.length);
  return (
    <section aria-labelledby="fb-title" className="card p-5 sm:p-6 mb-5 border-t-4 border-emerald-500">
      <div className="flex flex-wrap items-start gap-5">
        <div className="text-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 px-6 py-4">
          <p className="text-xs text-emerald-900 font-medium">{t('fb.mark')}</p>
          <p className="text-3xl font-bold text-emerald-900 tabular mt-1">{fmt.n(sub.mark ?? 0)}<span className="text-lg text-emerald-800"> / {fmt.n(a.points)}</span></p>
        </div>
        <div className="flex-1 min-w-[14rem]">
          <h2 id="fb-title" className="font-bold text-ags-navy text-lg">{t('fb.from', { teacher: teacherShort(a.teacherId, lang) })}</h2>
          {sub.returnedAt && <p className="text-xs text-ags-slate">{agoLabel(t, sub.returnedAt, now)}</p>}
          {sub.comment && <blockquote className="mt-3 rounded-xl bg-slate-50 p-3.5 text-ags-navy leading-relaxed" dir="auto">{sub.comment}</blockquote>}
        </div>
      </div>
      {sub.status === 'revision' && (
        <div className="mt-5 rounded-xl bg-amber-50 ring-1 ring-amber-200 p-4 flex flex-wrap items-center gap-3">
          <RotateCcw aria-hidden="true" className="w-5 h-5 text-amber-700" />
          <p className="flex-1 text-amber-950 min-w-[12rem]">{t('fb.redo')}</p>
          <button type="button" className="btn btn-primary" onClick={() => { actions.startRedo(a.id, student.id); toast(t('fb.redoStarted'), { kind: 'info' }); }}>{t('act.redo')}</button>
        </div>
      )}
      {marked.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-bold text-ags-navy mb-2">{t('fb.onPhotos')}</p>
          <div className="grid sm:grid-cols-2 gap-4">{marked.map((p) => <AnnotatedPage key={p.id} src={pageSrc(p)} annotations={sub.annotations[p.id]} alt={t('photo.page', { n: pages.indexOf(p) + 1 })} />)}</div>
        </div>
      )}
    </section>
  );
}

function AssignmentPage({ id }) {
  const { t, fmt, lang, stage, student, now, db, actions, navigate, guide, markGuide } = useApp();
  const a = db.assignments[id];
  const sub = a ? db.submissions[subKey(a.id, student.id)] : null;
  const [answers, setAnswers] = useState(() => ({ ...(sub?.answers || {}) }));
  const [savedAt, setSavedAt] = useState(null);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(null);
  const timer = useRef(null); const latest = useRef(answers); latest.current = answers;
  const st = a ? studentState(a, sub, now) : null;
  useEffect(() => { setAnswers({ ...(sub?.answers || {}) }); }, [sub?.status, sub?.resubmitting, id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (timer.current) { clearTimeout(timer.current); actions.saveDraft(id, student.id, latest.current); } }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (a && guide.aid === a.id && student.id === 's_omar' && (st === 'returned' || st === 'revision')) markGuide(4); }, [a, st, guide.aid, student.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!a || !isVisibleToStudent(a, student, now)) return <div className="card max-w-3xl mx-auto"><EmptyState title={t('a.notFound')} action={<button type="button" className="btn btn-primary" onClick={() => navigate({ name: 'home' })}>{t('back.home')}</button>} /></div>;

  const editable = (!sub || sub.status === 'draft') && canSubmit(a, now, sub);
  const showResults = ['returned', 'revision'].includes(sub?.status);
  const missing = a.blocks.filter((b) => b.required && !isAnswered(b, answers[b.id]));
  const save = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } actions.saveDraft(a.id, student.id, latest.current); setSavedAt(Date.now()); };
  const setAnswer = (bid, v) => {
    setAnswers((p) => ({ ...p, [bid]: v }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 600);
  };
  const handIn = () => {
    if (missing.length) { setTried(true); document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    save();
    setDone(actions.submit(a.id, student.id, latest.current));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    const early = stage === 'early';
    return (
      <div className="max-w-xl mx-auto text-center card p-8 sm:p-10 ags-fade-up">
        <SuccessCheck early={early} />
        <h1 role="status" className={cx('font-bold text-ags-navy mt-5', early ? 'text-3xl' : 'text-2xl')}>{early ? t('done.early') : done.late ? t('done.late', { n: done.daysLate }) : t('done.onTime')}</h1>
        <p className="text-ags-slate mt-2">{t('done.next', { teacher: teacherShort(a.teacherId, lang) })}</p>
        <button type="button" className="btn btn-primary btn-lg mt-7" onClick={() => navigate({ name: 'home' })}><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('back.home')}</button>
      </div>
    );
  }

  const over = now > a.dueAt;
  return (
    <div className={cx('max-w-3xl mx-auto', stage === 'early' && 'stage-early')}>
      <button type="button" onClick={() => { save(); navigate({ name: 'home' }); }} className="btn btn-ghost -ms-3 mb-3"><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('back.home')}</button>
      <header className="card p-5 sm:p-6 mb-5 relative overflow-hidden">
        <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1.5" style={{ background: SUBJECTS[a.subject]?.color }} />
        <SubjectTag code={a.subject} />
        <h1 className={cx('font-bold text-ags-navy mt-1 leading-tight', stage === 'early' ? 'text-3xl' : 'text-2xl sm:text-3xl')}><bdi>{a.title}</bdi></h1>
        <p className="text-ags-slate mt-1.5">{teacherName(a.teacherId, lang)} · {over ? t('card.wasDue', { day: `${fmt.date(a.dueAt)}, ${fmt.time(a.dueAt)}` }) : dueLabel(t, fmt, a.dueAt, now)}</p>
        {['submitted', 'graded'].includes(sub?.status) && <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ags-indigo-50 text-ags-indigo px-3 py-1.5 text-sm font-medium"><Send aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('a.handedIn', { when: `${fmt.date(sub.submittedAt)}, ${fmt.time(sub.submittedAt)}` })}{sub.late ? ` · ${t('late.days', { n: lateDays(a.dueAt, sub.submittedAt) })}` : ''}</p>}
        {st === 'overdue' && editable && <p className="mt-3 rounded-lg bg-amber-50 ring-1 ring-amber-200 text-amber-950 px-3 py-2 text-sm flex gap-2"><AlarmClock aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{a.latePolicy?.mode === 'until' ? t('a.lateUntil', { day: fmt.date(a.latePolicy.until) }) : t('a.lateAny')}</p>}
        {!editable && (!sub || sub.status === 'draft') && <p className="mt-3 rounded-lg bg-rose-50 ring-1 ring-rose-200 text-rose-950 px-3 py-2 text-sm flex gap-2"><Info aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t('a.closed')}</p>}
      </header>

      {showResults && <FeedbackBox a={a} sub={sub} />}

      {(a.instructions || a.attachments?.length > 0) && (
        <section className="card p-5 sm:p-6 mb-5" aria-labelledby="todo-instr">
          <h2 id="todo-instr" className="font-bold text-ags-navy mb-2">{t('a.whatToDo')}</h2>
          {a.instructions && <p className={cx('text-ags-navy/90 leading-relaxed whitespace-pre-wrap', stage === 'early' && 'text-lg')} dir={a.lang === 'ar' ? 'rtl' : 'auto'}>{a.instructions}</p>}
          <WorksheetButton a={a} />
        </section>
      )}

      <div className="space-y-4">
        {a.blocks.map((b, i) => (
          <Question key={b.id} a={a} b={b} index={i} total={a.blocks.length} value={answers[b.id]} onChange={(v) => setAnswer(b.id, v)} readOnly={!editable} showResults={showResults} highlight={tried && missing.includes(b)} />
        ))}
      </div>

      {editable && (
        <div className="sticky bottom-0 z-20 mt-6 -mx-4 px-4 pb-4 pt-3 bg-gradient-to-t from-ags-bg via-ags-bg to-ags-bg/0">
          <div className="card p-3 sm:p-4 flex flex-wrap items-center gap-3 shadow-lg">
            <span className="text-sm flex-1 min-w-[10rem]" aria-live="polite">
              {tried && missing.length ? <span className="text-amber-900 inline-flex items-center gap-1.5"><AlertCircle aria-hidden="true" className="w-4 h-4" />{t('a.missing', { n: missing.length })}</span>
                : <span className="text-ags-slate inline-flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600" />{savedAt || sub?.draftSavedAt ? t('a.saved') : t('a.autosave')}</span>}
            </span>
            <button type="button" className={cx('btn btn-primary btn-lg', stage === 'early' && 'min-h-[3.75rem] text-xl px-8')} onClick={handIn}>
              <Send aria-hidden="true" className="w-5 h-5 flip-rtl" />{sub?.resubmitting ? t('resubmit') : t('submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 11. TEACHER — set homework, mark it, see who is behind
 * ========================================================================== */

const toMarkStatus = (s) => s === 'submitted' || s === 'late';
function firstToMark(db, a, cls, now, afterId) {
  const roster = ROSTERS[cls] || [];
  let list = roster;
  if (afterId) { const i = roster.findIndex((s) => s.id === afterId); list = [...roster.slice(i + 1), ...roster.slice(0, Math.max(0, i))]; }
  return list.find((s) => toMarkStatus(teacherStatus(a, db.submissions[subKey(a.id, s.id)], now)));
}
function supportList(db, cls, now) {
  const list = teacherAssignments(db).filter((a) => a.classes.includes(cls) && isPublished(a, now) && now - a.dueAt < 42 * DAY);
  return (ROSTERS[cls] || []).map((stu) => {
    let miss = 0; const marks = [];
    list.forEach((a) => { const sub = db.submissions[subKey(a.id, stu.id)]; const st = teacherStatus(a, sub, now); if (st === 'missing') miss += 1; if (sub && typeof sub.mark === 'number' && ['graded', 'returned', 'revision'].includes(st)) marks.push(sub.mark / a.points); });
    const avg = marks.length ? sum(marks) / marks.length : null;
    return { stu, miss, avg, flag: miss >= 3 || (avg != null && avg < 0.5) };
  }).filter((x) => x.flag);
}

function TeacherHome() {
  const { t, fmt, lang, now, db, navigate, actions } = useApp();
  const mine = teacherAssignments(db);
  const rows = mine.filter((a) => isPublished(a, now)).flatMap((a) => a.classes.map((cls) => ({ a, cls, s: classStats(db, a, cls, now) })));
  const toMark = rows.filter((r) => r.s.toGrade > 0).sort((x, y) => y.s.toGrade - x.s.toGrade);
  const recent = rows.filter((r) => r.a.dueAt > now - 10 * DAY).sort((x, y) => (x.a.dueAt > now) === (y.a.dueAt > now) ? x.a.dueAt - y.a.dueAt : x.a.dueAt > now ? -1 : 1);
  const scheduled = mine.filter((a) => !isPublished(a, now));
  const help = DEMO_CLASSES.reduce((n, c) => n + supportList(db, c, now).length, 0);
  const markTotal = sum(toMark.map((r) => r.s.toGrade));
  const openCount = mine.filter((a) => isPublished(a, now) && a.dueAt > now).length;
  const hour = new Date(now).getHours();
  const startMarking = (r) => { const s = firstToMark(db, r.a, r.cls, now); if (s) navigate({ name: 'mark', id: r.a.id, sid: s.id }); };
  return (
    <div className="max-w-4xl mx-auto">
      <TeacherTabs />
      <Hero>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm text-white/75">{fmt.dateLong(now)} <span aria-hidden="true">·</span> {fmt.hijri(now)}</p>
            <h1 className="text-3xl sm:text-[2.15rem] font-bold mt-1">{t(hour < 12 ? 'greet.morning' : hour < 17 ? 'greet.afternoon' : 'greet.evening', { name: teacherGreet(DEMO_TEACHER, lang) })}</h1>
            <p className="text-white/80 mt-1">{subjName('math', lang)} · <bdi>{clsList(DEMO_CLASSES, lang)}</bdi></p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 inline-flex items-center gap-1.5"><Inbox aria-hidden="true" className="w-4 h-4 text-ags-gold" />{t('th.nToMark', { n: markTotal })}</span>
              <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 inline-flex items-center gap-1.5"><ClipboardList aria-hidden="true" className="w-4 h-4 text-ags-gold" />{t('th.nOpen', { n: openCount })}</span>
            </div>
          </div>
          <button type="button" className="btn btn-gold btn-lg shadow-lg" onClick={() => navigate({ name: 'create' })}><Plus aria-hidden="true" className="w-5 h-5" />{t('th.set')}</button>
        </div>
      </Hero>

      <section className="card p-5 sm:p-6 mb-5" aria-labelledby="tm-h">
        <h2 id="tm-h" className="sr-only">{t('th.toMark')}</h2>
        <H2 icon={Inbox} count={sum(toMark.map((r) => r.s.toGrade))}>{t('th.toMark')}</H2>
        {toMark.length ? (
          <ul className="divide-y divide-slate-100">
            {toMark.map((r, i) => (
              <li key={r.a.id + r.cls} className="py-3 flex flex-wrap items-center gap-3 ags-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="flex-1 min-w-[12rem]">
                  <span className="block font-bold text-ags-navy"><bdi>{r.a.title}</bdi></span>
                  <span className="block text-sm text-ags-slate"><bdi>{clsLabel(r.cls, lang)}</bdi> · {t('th.handedIn', { n: r.s.handedIn, total: r.s.total })}</span>
                </span>
                <span className="text-sm font-bold bg-ags-gold text-ags-navy rounded-full px-3 py-1">{t('th.nToMark', { n: r.s.toGrade })}</span>
                <button type="button" className="btn btn-primary" onClick={() => startMarking(r)}><PenLine aria-hidden="true" className="w-4 h-4" />{t('th.startMarking')}</button>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={CheckCircle2} title={t('th.allMarked')} />}
      </section>

      <section className="card p-5 sm:p-6 mb-5" aria-labelledby="yh-h">
        <h2 id="yh-h" className="sr-only">{t('th.yours')}</h2>
        <H2 icon={ClipboardList}>{t('th.yours')}</H2>
        <ul className="divide-y divide-slate-100">
          {recent.map((r, i) => {
            const notIn = r.s.missing + r.s.notYet;
            return (
              <li key={r.a.id + r.cls} className="py-3.5 ags-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex-1 min-w-[12rem]">
                    <span className="block font-bold text-ags-navy"><bdi>{r.a.title}</bdi></span>
                    <span className="block text-sm text-ags-slate"><bdi>{clsLabel(r.cls, lang)}</bdi> · {r.a.dueAt > now ? dueLabel(t, fmt, r.a.dueAt, now) : t('card.wasDue', { day: fmt.date(r.a.dueAt) })}</span>
                  </span>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate({ name: 'class', id: r.a.id, cls: r.cls })}><Users aria-hidden="true" className="w-4 h-4" />{t('th.seeClass')}</button>
                  {notIn > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => actions.remind(r.a.id, r.cls)}><Bell aria-hidden="true" className="w-4 h-4" />{t('th.remind', { n: notIn })}</button>}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar value={r.s.handedIn} max={r.s.total} className="flex-1 max-w-sm" label={t('th.handedIn', { n: r.s.handedIn, total: r.s.total })} />
                  <span className="text-xs text-ags-slate tabular">{t('th.handedIn', { n: r.s.handedIn, total: r.s.total })}</span>
                </div>
              </li>
            );
          })}
          {scheduled.map((a) => (
            <li key={a.id} className="py-3.5 flex flex-wrap items-center gap-3">
              <span className="flex-1 min-w-[12rem]"><span className="block font-bold text-ags-navy"><bdi>{a.title}</bdi></span><span className="block text-sm text-ags-slate"><bdi>{clsList(a.classes, lang)}</bdi> · {t('th.sendsOn', { when: `${fmt.date(a.publishAt)}, ${fmt.time(a.publishAt)}` })}</span></span>
              <StatusChip status="scheduled" size="sm" />
            </li>
          ))}
        </ul>
      </section>

      {help > 0 && (
        <button type="button" onClick={() => navigate({ name: 'progress' })} className="card lift w-full text-start p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 inline-flex items-center justify-center"><Users aria-hidden="true" className="w-5 h-5" /></span>
          <span className="flex-1 font-medium text-ags-navy">{t('th.help', { n: help })}</span>
          <ArrowRight aria-hidden="true" className="w-5 h-5 text-ags-indigo flip-rtl" />
        </button>
      )}
    </div>
  );
}

function ClassView({ id, cls }) {
  const { t, fmt, lang, now, db, navigate, actions } = useApp();
  const a = db.assignments[id];
  if (!a) return <div className="card"><EmptyState title={t('a.notFound')} /></div>;
  const rows = (ROSTERS[cls] || []).map((stu) => { const sub = db.submissions[subKey(a.id, stu.id)]; return { stu, sub, st: teacherStatus(a, sub, now) }; });
  const groups = [
    ['toMark', rows.filter((r) => toMarkStatus(r.st)), Inbox],
    ['notIn', rows.filter((r) => r.st === 'missing' || r.st === 'notYet'), Clock],
    ['marked', rows.filter((r) => ['returned', 'revision', 'graded'].includes(r.st)), CheckCircle2],
  ];
  const first = groups[0][1][0];
  return (
    <div className="max-w-3xl mx-auto">
      <button type="button" onClick={() => navigate({ name: 'home' })} className="btn btn-ghost -ms-3 mb-3"><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" />{t('tt.home')}</button>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ags-navy"><bdi>{a.title}</bdi></h1>
          <p className="text-ags-slate mt-1"><bdi>{clsLabel(cls, lang, true)}</bdi> · {a.dueAt > now ? dueLabel(t, fmt, a.dueAt, now) : t('card.wasDue', { day: fmt.date(a.dueAt) })}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {groups[1][1].length > 0 && <button type="button" className="btn btn-secondary" onClick={() => actions.remind(a.id, cls)}><Bell aria-hidden="true" className="w-4 h-4" />{t('cv.remindAll', { n: groups[1][1].length })}</button>}
          {first && <button type="button" className="btn btn-primary" onClick={() => navigate({ name: 'mark', id: a.id, sid: first.stu.id })}><PenLine aria-hidden="true" className="w-4 h-4" />{t('th.startMarking')}</button>}
        </div>
      </div>
      {groups.map(([k, list, I]) => list.length > 0 && (
        <section key={k} className="card p-5 mb-4" aria-labelledby={`cv-${k}`}>
          <h2 id={`cv-${k}`} className="sr-only">{t(`cv.${k}`)}</h2>
          <H2 icon={I} count={list.length} tone={k === 'notIn' ? 'text-amber-700' : k === 'marked' ? 'text-emerald-700' : undefined}>{t(`cv.${k}`)}</H2>
          <ul className="divide-y divide-slate-100">
            {list.map(({ stu, sub, st }) => (
              <li key={stu.id} className="py-2.5 flex items-center gap-3">
                <Avatar name={stu.en} size="sm" />
                <span className="flex-1 min-w-0"><bdi className="font-medium text-ags-navy">{studentName(stu, lang)}</bdi>
                  {sub?.late && HANDED_IN.includes(st) && <span className="ms-2 text-xs text-amber-800">{t('st.late')}</span>}
                </span>
                {k === 'marked' && typeof sub?.mark === 'number' && <span className="text-sm font-bold tabular text-ags-navy">{fmt.score(sub.mark, a.points)}</span>}
                {k === 'notIn' ? <StatusChip status={st} size="sm" />
                  : <button type="button" className={cx('btn btn-sm', k === 'toMark' ? 'btn-primary' : 'btn-secondary')} onClick={() => navigate({ name: 'mark', id: a.id, sid: stu.id })}>{k === 'toMark' ? t('cv.mark') : t('cv.view')}</button>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const QUICK = ['qc.working', 'qc.signs', 'qc.improve', 'qc.simplify'];

function MarkView({ id, sid }) {
  const { t, fmt, lang, now, db, navigate, actions } = useApp();
  const a = db.assignments[id]; const stu = STUDENTS[sid];
  const sub = a ? db.submissions[subKey(a.id, sid)] : null;
  const auto = a && sub ? autoScore(a, sub.answers) : { score: 0, max: 0, count: 0 };
  const [mark, setMark] = useState(() => (typeof sub?.mark === 'number' ? sub.mark : a && auto.count && auto.max === a.points ? auto.score : null));
  const [comment, setComment] = useState(sub?.comment || '');
  const [anns, setAnns] = useState(() => JSON.parse(JSON.stringify(sub?.annotations || {})));
  const [tool, setTool] = useState('tick');
  const [pageIdx, setPageIdx] = useState(0);
  if (!a || !stu) return <div className="card"><EmptyState title={t('a.notFound')} /></div>;
  const cls = stu.cls; const st = teacherStatus(a, sub, now); const has = HANDED_IN.includes(st);
  const left = (ROSTERS[cls] || []).filter((s) => toMarkStatus(teacherStatus(a, db.submissions[subKey(a.id, s.id)], now))).length;
  const pages = has ? a.blocks.filter((b) => b.type === 'paper').flatMap((b) => sub.answers[b.id] || []) : [];
  const page = pages[clamp(pageIdx, 0, Math.max(0, pages.length - 1))];
  const others = a.blocks.filter((b) => b.type !== 'paper');
  const first = studentFirst(stu, lang);
  const send = (status) => {
    if (mark == null) return;
    actions.sendBack(a.id, sid, { mark, comment: comment.trim(), annotations: anns, autoScore: auto.score }, status);
    const next = firstToMark(db, a, cls, now, sid);
    navigate(next ? { name: 'mark', id: a.id, sid: next.id } : { name: 'class', id: a.id, cls });
  };
  const tools = [['tick', Check, 'mk.tick'], ['cross', X, 'mk.cross'], ['pen', PenLine, 'mk.pen']];
  const range = a.points <= 20 ? Array.from({ length: a.points + 1 }, (_, i) => i) : null;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button type="button" onClick={() => navigate({ name: 'class', id: a.id, cls })} className="btn btn-ghost -ms-3"><ArrowLeft aria-hidden="true" className="w-4 h-4 flip-rtl" /><bdi>{a.title}</bdi> · <bdi>{clsLabel(cls, lang)}</bdi></button>
        <span className="ms-auto text-sm text-ags-slate">{left ? t('mk.left', { n: left }) : t('mk.noneLeft')}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Avatar name={stu.en} size="lg" />
        <h1 className="text-2xl font-bold text-ags-navy flex-1"><bdi>{studentName(stu, lang)}</bdi></h1>
        {has && <span className="text-sm text-ags-slate">{t('mk.handedIn', { when: agoLabel(t, sub.submittedAt, now) })}{sub.late && <span className="text-amber-800"> · {t('late.days', { n: lateDays(a.dueAt, sub.submittedAt) })}</span>}</span>}
      </div>

      {!has ? (
        <div className="card"><EmptyState icon={Clock} title={t('mk.notIn', { name: first })} action={<button type="button" className="btn btn-secondary" onClick={() => actions.remind(a.id, cls, [stu.id])}><Bell aria-hidden="true" className="w-4 h-4" />{t('mk.remindOne', { name: first })}</button>} /></div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            {pages.length > 0 && (
              <section className="card p-4 sm:p-5" aria-label={t('mk.work')}>
                <div className="flex flex-wrap items-center gap-2 mb-3" role="toolbar" aria-label={t('mk.tools')}>
                  {tools.map(([k, I, label]) => <button key={k} type="button" aria-pressed={tool === k} onClick={() => setTool(k)} className={cx('btn', tool === k ? 'btn-primary' : 'btn-secondary')}><I aria-hidden="true" className="w-4 h-4" />{t(label)}</button>)}
                  <button type="button" className="btn btn-ghost" onClick={() => page && setAnns((m) => ({ ...m, [page.id]: (m[page.id] || []).slice(0, -1) }))} disabled={!(anns[page?.id] || []).length}><Undo2 aria-hidden="true" className="w-4 h-4" />{t('mk.undo')}</button>
                  {pages.length > 1 && <span className="ms-auto"><Segmented size="sm" ariaLabel={t('mk.work')} value={pageIdx} onChange={setPageIdx} options={pages.map((p, i) => ({ value: i, label: t('photo.page', { n: i + 1 }) }))} /></span>}
                </div>
                <p className="hint mb-3">{t('mk.hint')}</p>
                {page && <div className="max-w-xl mx-auto"><AnnotatedPage src={pageSrc(page)} annotations={anns[page.id] || []} editable tool={tool} onAdd={(an) => setAnns((m) => ({ ...m, [page.id]: [...(m[page.id] || []), an] }))} alt={t('photo.page', { n: pageIdx + 1 })} /></div>}
              </section>
            )}
            {others.length > 0 && (
              <section className="card p-4 sm:p-5" aria-label={t('mk.answers')}>
                {auto.count > 0 && <p className="mb-3 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3 text-sm text-emerald-950 flex items-center gap-2"><ListChecks aria-hidden="true" className="w-4 h-4" />{t('mk.auto', { score: fmt.score(auto.score, auto.max) })}</p>}
                <ol className="space-y-3">
                  {others.map((b) => {
                    const v = sub.answers[b.id]; const pts = isAuto(b) ? scoreBlock(b, v) : null;
                    let ans = '—';
                    if (b.type === 'mcq' && v != null) ans = b.options[v];
                    else if (b.type === 'tf' && v != null) ans = v ? t('q.true') : t('q.false');
                    else if (b.type === 'checkbox' && v) ans = v.map((i) => b.options[i]).join(' · ');
                    else if (b.type === 'match' && v) ans = b.pairs.map((p, i) => `${p.left} → ${b.pairs[v[i]]?.right ?? '—'}`).join(' · ');
                    else if (b.type === 'file' && v) ans = v.map((f) => f.name).join(', ');
                    else if (v) ans = String(v);
                    return (
                      <li key={b.id} className="rounded-xl ring-1 ring-slate-200 p-3.5">
                        <div className="flex items-start gap-2">
                          <p className="font-medium text-ags-navy flex-1" dir={a.lang === 'ar' ? 'rtl' : 'ltr'}>{b.prompt}</p>
                          {pts != null && <span className={cx('text-xs font-bold rounded-full px-2 py-0.5 ring-1 inline-flex items-center gap-1', pts >= b.points ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-rose-50 text-rose-800 ring-rose-200')}>{pts >= b.points ? <Check aria-hidden="true" className="w-3 h-3" /> : <X aria-hidden="true" className="w-3 h-3" />}{pts >= b.points ? t('fb.correct') : t('fb.wrong')}</span>}
                        </div>
                        <p className="mt-1.5 text-sm text-ags-navy/90 whitespace-pre-wrap" dir="auto">{ans}</p>
                        {b.type === 'file' && (v || []).some((f) => f.src) && <div className="mt-2 flex gap-2">{v.filter((f) => f.src).map((f) => <img key={f.id} src={f.src} alt={f.name} className="max-h-48 rounded-lg ring-1 ring-slate-200" />)}</div>}
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}
            {sub.note && <p className="card p-4 text-sm"><span className="font-bold text-ags-navy">{t('mk.note')}:</span> <span dir="auto">{sub.note}</span></p>}
          </div>

          <aside className="card p-5 space-y-5 lg:sticky lg:top-24" aria-label={t('mk.panel')}>
            <div>
              <p className="label" id="mk-mark">{t('mk.mark', { n: a.points })}</p>
              {range ? (
                <div role="radiogroup" aria-labelledby="mk-mark" className="flex flex-wrap gap-1.5">
                  {range.map((v) => <button key={v} type="button" role="radio" aria-checked={mark === v} onClick={() => setMark(v)} className={cx('min-w-[2.6rem] h-11 rounded-xl text-base font-bold tabular ring-1 transition-colors', mark === v ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-300 hover:ring-ags-indigo')}>{fmt.n(v)}</button>)}
                </div>
              ) : <input type="number" min={0} max={a.points} className="input !w-28 text-lg font-bold" aria-labelledby="mk-mark" value={mark ?? ''} onChange={(e) => setMark(e.target.value === '' ? null : clamp(Number(e.target.value), 0, a.points))} />}
            </div>
            <div>
              <label htmlFor="mk-c" className="label">{t('mk.comment')}</label>
              <textarea id="mk-c" className="input min-h-[6rem]" dir="auto" value={comment} placeholder={t('mk.commentPh')} onChange={(e) => setComment(e.target.value)} />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK.map((k) => <button key={k} type="button" onClick={() => setComment((c) => (c.trim() ? `${c.trim()} ${t(k)}.` : `${t(k)}.`))} className="rounded-full px-3 py-1 text-sm ring-1 ring-slate-300 bg-white hover:ring-ags-indigo hover:bg-ags-indigo-50 text-ags-navy min-h-[2.25rem]">+ {t(k)}</button>)}
              </div>
            </div>
            {(st === 'returned' || st === 'revision') && <p role="status" className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3 text-sm text-emerald-950 flex gap-2"><CheckCircle2 aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t('mk.sent', { when: agoLabel(t, sub.returnedAt, now) })}</p>}
            <div className="grid gap-2">
              <button type="button" className="btn btn-primary btn-lg" disabled={mark == null} onClick={() => send('returned')}><Send aria-hidden="true" className="w-5 h-5 flip-rtl" />{t('mk.send', { name: first })}</button>
              {mark == null && <p className="hint text-center">{t('mk.pick')}</p>}
              <button type="button" className="btn btn-secondary" disabled={mark == null} onClick={() => send('revision')}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('mk.redo')}</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Progress({ cls: clsIn }) {
  const { t, fmt, lang, now, db, actions, guide, markGuide } = useApp();
  const [cls, setCls] = useState(clsIn || DEMO_CLASSES[0]);
  useEffect(() => { if (guide.steps[2]) markGuide(5); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const list = teacherAssignments(db).filter((a) => a.classes.includes(cls) && isPublished(a, now) && now - a.dueAt < 42 * DAY).sort((x, y) => x.dueAt - y.dueAt);
  const help = supportList(db, cls, now);
  return (
    <div className="max-w-4xl mx-auto">
      <TeacherTabs />
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div><h1 className="text-3xl font-bold text-ags-navy">{t('pg.title')}</h1><p className="text-ags-slate mt-1">{t('pg.sub')}</p></div>
        <Segmented ariaLabel={t('pg.class')} value={cls} onChange={setCls} options={DEMO_CLASSES.map((c) => ({ value: c, label: clsLabel(c, lang) }))} />
      </div>
      <section className="card p-5 sm:p-6 mb-5" aria-labelledby="pg-h1">
        <h2 id="pg-h1" className="text-lg font-bold text-ags-navy">{t('pg.handedIn')}</h2>
        <p className="hint mb-4">{t('pg.handedIn.hint')}</p>
        <ul className="space-y-3">
          {list.map((a) => {
            const s = classStats(db, a, cls, now); const open = a.dueAt > now;
            return (
              <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,14rem)_1fr_auto] items-center gap-x-3 gap-y-1">
                <span className="text-sm text-ags-navy truncate"><bdi>{a.title}</bdi>{open && <span className="ms-1.5 text-[0.68rem] font-bold text-ags-indigo bg-ags-indigo-50 rounded px-1.5">{t('pg.open')}</span>}</span>
                <span className="col-span-2 sm:col-span-1 order-3 sm:order-none h-4 bg-slate-100 rounded-e overflow-hidden"><Bar value={s.rate} open={open} /></span>
                <span className="text-sm tabular text-ags-navy text-end whitespace-nowrap"><b>{fmt.pct(s.rate)}</b> <span className="text-ags-slate">· {t('th.handedIn', { n: s.handedIn, total: s.total })}</span></span>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="card p-5 sm:p-6" aria-labelledby="pg-h2">
        <h2 id="pg-h2" className="text-lg font-bold text-ags-navy">{t('pg.help')}</h2>
        <p className="hint mb-4">{t('pg.help.hint')}</p>
        {help.length ? (
          <ul className="divide-y divide-slate-100">
            {help.map(({ stu, miss, avg }) => (
              <li key={stu.id} className="py-3 flex flex-wrap items-center gap-3">
                <Avatar name={stu.en} size="sm" />
                <span className="flex-1 min-w-[10rem]"><bdi className="block font-medium text-ags-navy">{studentName(stu, lang)}</bdi>
                  <span className="block text-sm text-ags-slate">{[miss >= 1 && t('pg.missed', { n: miss }), avg != null && avg < 0.5 && t('pg.lowAvg', { pct: fmt.pct(avg) })].filter(Boolean).join(' · ')}</span></span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => actions.remindStudent(stu.id)}><Bell aria-hidden="true" className="w-4 h-4" />{t('pg.remind')}</button>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={CheckCircle2} title={t('pg.noHelp')} />}
      </section>
      <p className="mt-4 text-sm text-ags-slate flex items-center gap-2"><Lock aria-hidden="true" className="w-4 h-4" />{t('pg.privacy')}</p>
    </div>
  );
}

/* ---------- set homework: three steps ---------- */

const newQ = (type = 'mcq') => ({ id: uid('q'), type, prompt: '', options: ['', '', '', ''], correct: type === 'tf' ? true : 0 });

function newDraft(now) {
  return {
    kind: null, title: '', instructions: '', instrTouched: false, worksheet: true, questions: [], writtenPrompt: '', outOf: 10,
    classes: [DEMO_CLASSES[0]], due: 'tomorrow', dueDate: toYMD(atDay(3, 19, 0, now)), dueTime: '19:00',
    acceptLate: true, allowRedo: true, sendLater: false, sendDate: toYMD(atDay(1, 7, 0, now)), sendTime: '07:00', more: false,
  };
}
function draftDue(d, now) {
  const [h, m] = (d.dueTime || '19:00').split(':').map(Number);
  if (d.due === 'tomorrow') return atDay(1, h, m, now);
  if (d.due === '2days') return atDay(2, h, m, now);
  if (d.due === 'week') return atDay(7, h, m, now);
  return fromYMDHM(d.dueDate, d.dueTime);
}
function draftToAssignment(d, now, t, id = 'preview') {
  const publishAt = d.sendLater ? fromYMDHM(d.sendDate, d.sendTime) : now;
  let blocks;
  if (d.kind === 'quiz') blocks = d.questions.map((q, i) => ({ id: `${id}_b${i + 1}`, type: q.type, prompt: q.prompt.trim(), options: q.type === 'mcq' ? q.options.map((o, j) => o.trim() || `${j + 1}`) : undefined, correct: q.correct, points: 1, required: true }));
  else if (d.kind === 'written') blocks = [{ id: `${id}_b1`, type: 'long', prompt: d.writtenPrompt.trim() || d.title.trim() || '—', points: d.outOf, required: true }];
  else blocks = [{ id: `${id}_b1`, type: 'paper', prompt: t('sh.photoPrompt'), points: d.outOf, required: true }];
  const title = d.title.trim() || '—';
  return {
    id, title, instructions: d.instructions.trim(), subject: 'math', teacherId: DEMO_TEACHER, classes: d.classes.length ? d.classes : [DEMO_CLASSES[0]],
    lang: /[؀-ۿ]/.test(title + d.instructions) ? 'ar' : 'en', blocks, points: sum(blocks.map((b) => b.points)),
    attachments: d.worksheet && d.kind !== 'quiz' ? [{ id: `${id}_att`, kind: 'worksheet', name: `${title}.pdf` }] : [],
    publishAt, dueAt: draftDue(d, now), status: publishAt > now ? 'scheduled' : 'published',
    latePolicy: { mode: d.acceptLate ? 'accept' : 'none', until: null, deduct: false, pct: 0 }, allowResubmit: d.allowRedo, rubric: [], createdAt: now,
  };
}

function Step({ n, title, children }) {
  return (
    <section className="card p-5 sm:p-6 mb-4" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="font-bold text-ags-navy text-lg flex items-center gap-3 mb-4">
        <span aria-hidden="true" className="w-8 h-8 rounded-full bg-ags-indigo text-white inline-flex items-center justify-center text-sm">{n}</span>{title}
      </h2>
      {children}
    </section>
  );
}

function SetHomework() {
  const { t, fmt, lang, now, builder: d, setBuilder, actions, navigate } = useApp();
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const set = (patch) => setBuilder((x) => ({ ...x, ...patch }));
  const a = useMemo(() => draftToAssignment(d, now, t), [d, now, t]);
  const kinds = [['photo', Camera], ['quiz', ListChecks], ['written', PenLine]];
  const choose = (k) => setBuilder((x) => ({ ...x, kind: k, instructions: x.instrTouched ? x.instructions : t(`sh.instr.${k}`), questions: k === 'quiz' && !x.questions.length ? [newQ('mcq')] : x.questions }));
  const setQ = (qid, patch) => set({ questions: d.questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)) });
  const validate = () => {
    const e = {};
    if (!d.title.trim()) e.title = t('sh.err.title');
    if (!d.classes.length) e.classes = t('sh.err.class');
    if (d.kind === 'quiz' && (!d.questions.length || d.questions.some((q) => !q.prompt.trim() || (q.type === 'mcq' && q.options.filter((o) => o.trim()).length < 2)))) e.quiz = t('sh.err.quiz');
    if (!(a.dueAt > now) || a.dueAt <= a.publishAt) e.due = t('sh.err.due');
    return e;
  };
  const send = () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) { setTimeout(() => document.querySelector('[data-err="1"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30); return; }
    actions.publish(d);
    setBuilder(newDraft(now)); setErrors({});
    navigate({ name: 'home' });
  };
  const sendLabel = d.sendLater ? t('sh.schedule', { when: `${fmt.date(a.publishAt)}, ${fmt.time(a.publishAt)}` }) : t('sh.send', { cls: clsList(d.classes.length ? d.classes : [DEMO_CLASSES[0]], lang) });
  const dueChips = [['tomorrow', 'sh.due.tomorrow'], ['2days', 'sh.due.2days'], ['week', 'sh.due.week'], ['custom', 'sh.due.custom']];
  const Err = ({ k }) => (errors[k] ? <p data-err="1" role="alert" className="mt-2 text-sm text-rose-700 flex items-center gap-1.5"><AlertCircle aria-hidden="true" className="w-4 h-4" />{errors[k]}</p> : null);
  return (
    <div className="max-w-3xl mx-auto">
      <TeacherTabs />
      <h1 className="text-3xl font-bold text-ags-navy mb-6">{t('sh.title')}</h1>

      <Step n={1} title={t('sh.step1')}>
        <div className="grid sm:grid-cols-3 gap-3" role="radiogroup" aria-labelledby="step-1">
          {kinds.map(([k, I]) => {
            const on = d.kind === k;
            return (
              <button key={k} type="button" role="radio" aria-checked={on} onClick={() => choose(k)}
                className={cx('rounded-2xl p-4 text-start ring-1 transition flex sm:flex-col gap-3 items-start', on ? 'ring-2 ring-ags-indigo bg-ags-indigo-50' : 'ring-slate-200 hover:ring-ags-indigo bg-white')}>
                <span className={cx('w-11 h-11 rounded-xl inline-flex items-center justify-center shrink-0', on ? 'bg-ags-indigo text-white' : 'bg-ags-indigo-50 text-ags-indigo')}><I aria-hidden="true" className="w-5 h-5" /></span>
                <span><span className="block font-bold text-ags-navy">{t(`sh.kind.${k}`)}</span><span className="block text-sm text-ags-slate mt-0.5">{t(`sh.kind.${k}.d`)}</span></span>
              </button>
            );
          })}
        </div>
      </Step>

      {d.kind && (
        <>
          <Step n={2} title={t('sh.step2')}>
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="sh-title">{t('sh.fTitle')}</label>
                <input id="sh-title" className={cx('input text-lg', errors.title && 'input-error')} dir="auto" value={d.title} placeholder={t('sh.fTitlePh')} onChange={(e) => set({ title: e.target.value })} />
                <Err k="title" />
              </div>
              <div>
                <label className="label" htmlFor="sh-instr">{t('sh.fInstr')}</label>
                <textarea id="sh-instr" className="input min-h-[5.5rem]" dir="auto" value={d.instructions} onChange={(e) => set({ instructions: e.target.value, instrTouched: true })} />
              </div>
              {d.kind === 'written' && (
                <div><label className="label" htmlFor="sh-q">{t('sh.fQuestion')}</label><input id="sh-q" className="input" dir="auto" value={d.writtenPrompt} placeholder={t('sh.fQuestionPh')} onChange={(e) => set({ writtenPrompt: e.target.value })} /></div>
              )}
              {d.kind === 'quiz' && (
                <div>
                  <p className="label">{t('sh.questions')}</p>
                  <ol className="space-y-3">
                    {d.questions.map((q, i) => (
                      <li key={q.id} className="rounded-xl ring-1 ring-slate-200 p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-sm text-ags-indigo">{t('q.of', { n: i + 1, total: d.questions.length })}</span>
                          <Segmented size="sm" ariaLabel={t('sh.qType')} value={q.type} onChange={(v) => setQ(q.id, { type: v, correct: v === 'tf' ? true : 0 })} options={[{ value: 'mcq', label: t('sh.qType.mcq') }, { value: 'tf', label: t('sh.qType.tf') }]} />
                          <button type="button" className="btn btn-ghost btn-icon ms-auto text-rose-700" onClick={() => set({ questions: d.questions.filter((x) => x.id !== q.id) })} aria-label={`${t('sh.removeQ')} ${i + 1}`}><Trash2 aria-hidden="true" className="w-4 h-4" /></button>
                        </div>
                        <input className="input font-medium" dir="auto" value={q.prompt} placeholder={t('sh.qPh')} aria-label={t('q.of', { n: i + 1, total: d.questions.length })} onChange={(e) => setQ(q.id, { prompt: e.target.value })} />
                        {q.type === 'mcq' ? (
                          <div className="mt-2 grid sm:grid-cols-2 gap-2">
                            {q.options.map((o, oi) => (
                              <label key={oi} className={cx('flex items-center gap-2 rounded-xl ring-1 px-2.5 py-1.5', q.correct === oi ? 'ring-emerald-400 bg-emerald-50' : 'ring-slate-200')}>
                                <input type="radio" name={`c_${q.id}`} checked={q.correct === oi} onChange={() => setQ(q.id, { correct: oi })} aria-label={`${t('sh.correct')} — ${t('sh.option', { n: oi + 1 })}`} />
                                <input className="flex-1 bg-transparent outline-none min-h-[2.2rem]" dir="auto" value={o} placeholder={t('sh.option', { n: oi + 1 })} aria-label={t('sh.option', { n: oi + 1 })} onChange={(e) => setQ(q.id, { options: q.options.map((x, j) => (j === oi ? e.target.value : x)) })} />
                              </label>
                            ))}
                            <p className="hint sm:col-span-2">{t('sh.correctHint')}</p>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-3"><span className="text-sm text-ags-slate">{t('sh.answerIs')}</span><Segmented size="sm" ariaLabel={t('sh.correct')} value={q.correct ? 't' : 'f'} onChange={(v) => setQ(q.id, { correct: v === 't' })} options={[{ value: 't', label: t('q.true') }, { value: 'f', label: t('q.false') }]} /></div>
                        )}
                      </li>
                    ))}
                  </ol>
                  <button type="button" className="btn btn-secondary mt-3" onClick={() => set({ questions: [...d.questions, newQ('mcq')] })}><Plus aria-hidden="true" className="w-4 h-4" />{t('sh.addQ')}</button>
                  <Err k="quiz" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {d.kind !== 'quiz' && (
                  <label className="flex items-center gap-2 text-sm text-ags-navy">{t('sh.outOf')}
                    <select className="input !w-24 !min-h-[2.4rem]" value={d.outOf} onChange={(e) => set({ outOf: Number(e.target.value) })}>{[5, 10, 20].map((n) => <option key={n} value={n}>{fmt.n(n)}</option>)}</select>
                  </label>
                )}
                {d.kind !== 'quiz' && <label className="flex items-center gap-2 text-sm text-ags-navy cursor-pointer"><input type="checkbox" checked={d.worksheet} onChange={(e) => set({ worksheet: e.target.checked })} />{t('sh.worksheet')}</label>}
                {d.kind === 'quiz' && <p className="text-sm text-ags-slate flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600" />{t('sh.autoMarked')}</p>}
              </div>
            </div>
          </Step>

          <Step n={3} title={t('sh.step3')}>
            <p className="label" id="sh-cls">{t('sh.classes')}</p>
            <div role="group" aria-labelledby="sh-cls" className="flex flex-wrap gap-2">
              {DEMO_CLASSES.map((c) => {
                const on = d.classes.includes(c);
                return <button key={c} type="button" aria-pressed={on} onClick={() => set({ classes: on ? d.classes.filter((x) => x !== c) : [...d.classes, c].sort() })} className={cx('inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.95rem] ring-1 min-h-[2.6rem]', on ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-300 hover:ring-ags-indigo')}>{on ? <Check aria-hidden="true" className="w-4 h-4" /> : <Plus aria-hidden="true" className="w-4 h-4" />}<bdi>{clsLabel(c, lang)}</bdi></button>;
              })}
            </div>
            <Err k="classes" />
            <p className="label mt-5" id="sh-due">{t('sh.due')}</p>
            <div role="radiogroup" aria-labelledby="sh-due" className="flex flex-wrap gap-2">
              {dueChips.map(([v, k]) => <button key={v} type="button" role="radio" aria-checked={d.due === v} onClick={() => set({ due: v })} className={cx('rounded-full px-4 py-2 text-[0.95rem] ring-1 min-h-[2.6rem]', d.due === v ? 'bg-ags-indigo text-white ring-ags-indigo' : 'bg-white text-ags-navy ring-slate-300 hover:ring-ags-indigo')}>{t(k)}</button>)}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {d.due === 'custom' && <input type="date" className={cx('input !w-auto', errors.due && 'input-error')} aria-label={t('sh.dueDate')} value={d.dueDate} min={toYMD(now)} onChange={(e) => set({ dueDate: e.target.value })} />}
              <input type="time" className="input !w-auto" aria-label={t('sh.dueTime')} value={d.dueTime} onChange={(e) => set({ dueTime: e.target.value })} />
              <span className="text-sm text-ags-slate">{fmt.dateLong(a.dueAt)} · {fmt.time(a.dueAt)}</span>
            </div>
            <Err k="due" />
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button type="button" className="text-sm font-medium text-ags-indigo inline-flex items-center gap-1.5 rounded" aria-expanded={d.more} onClick={() => set({ more: !d.more })}>{t('sh.more')}<ChevronDown aria-hidden="true" className={cx('w-4 h-4 transition-transform', d.more && 'rotate-180')} /></button>
              {d.more && (
                <div className="mt-4 space-y-4 ags-fade-up">
                  <Switch checked={d.acceptLate} onChange={(v) => set({ acceptLate: v })} label={t('sh.acceptLate')} hint={t('sh.acceptLate.hint')} />
                  <Switch checked={d.allowRedo} onChange={(v) => set({ allowRedo: v })} label={t('sh.allowRedo')} />
                  <Switch checked={d.sendLater} onChange={(v) => set({ sendLater: v })} label={t('sh.sendLater')} />
                  {d.sendLater && <div className="flex flex-wrap gap-2"><input type="date" className="input !w-auto" aria-label={t('sh.sendLater')} value={d.sendDate} min={toYMD(now)} onChange={(e) => set({ sendDate: e.target.value })} /><input type="time" className="input !w-auto" aria-label={t('sh.sendLater')} value={d.sendTime} onChange={(e) => set({ sendTime: e.target.value })} /></div>}
                </div>
              )}
            </div>
          </Step>

          <div className="flex flex-wrap gap-2 justify-end mt-6">
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => setPreview(true)}><Eye aria-hidden="true" className="w-5 h-5" />{t('sh.preview')}</button>
            <button type="button" className="btn btn-gold btn-lg" onClick={send}><Send aria-hidden="true" className="w-5 h-5 flip-rtl" />{sendLabel}</button>
          </div>
        </>
      )}
      <Modal open={preview} onClose={() => setPreview(false)} title={t('sh.preview')} icon={Eye} size="lg" footer={<button type="button" className="btn btn-primary" onClick={() => setPreview(false)}>{t('close')}</button>}>
        {preview && <StudentPreview a={a} />}
      </Modal>
    </div>
  );
}

function StudentPreview({ a }) {
  const { t, fmt, lang, now } = useApp();
  const [answers, setAnswers] = useState({});
  return (
    <div>
      <p className="mb-4 rounded-xl bg-ags-gold-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-ags-navy flex gap-2"><Eye aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />{t('sh.previewNote')}</p>
      <div className="card p-5 mb-4"><SubjectTag code={a.subject} /><h2 className="text-2xl font-bold text-ags-navy mt-1"><bdi>{a.title}</bdi></h2><p className="text-ags-slate mt-1">{teacherName(a.teacherId, lang)} · {dueLabel(t, fmt, a.dueAt, now)}</p></div>
      {(a.instructions || a.attachments.length > 0) && <div className="card p-5 mb-4"><h3 className="font-bold text-ags-navy mb-2">{t('a.whatToDo')}</h3><p className="text-ags-navy/90 whitespace-pre-wrap" dir="auto">{a.instructions}</p><WorksheetButton a={a} /></div>}
      <div className="space-y-4">{a.blocks.map((b, i) => <Question key={b.id} a={a} b={b} index={i} total={a.blocks.length} value={answers[b.id]} onChange={(v) => setAnswers((p) => ({ ...p, [b.id]: v }))} preview />)}</div>
    </div>
  );
}

/* ============================================================================
 * 12. ADMIN — the school-wide picture in one screen
 * Grade 8B1–8B3 Mathematics and 8B1 update live; everything else is fixed sample data.
 * ========================================================================== */

/** Admin weeks are calendar school weeks: the Sunday on or before today. */
function adminWeekStart(now, off = 0) { const d = new Date(startOfDay(now)); d.setDate(d.getDate() - d.getDay() + off * 7); return d.getTime(); }

function adminEntries(db, now) {
  const out = []; const rnd = mulberry32(7310);
  [-1, 0, 1].forEach((w) => {
    const ws = adminWeekStart(now, w);
    ADMIN_CLASSES.forEach((cls, ci) => {
      const { g } = parseCls(cls);
      CORE_SUBJECTS.forEach((subject, si) => {
        if (DEMO_CLASSES.includes(cls) && subject === 'math') return; // live
        if (cls === STUDENT_OMAR.cls) return; // from the session's assignments
        const count = { math: 1, english: 1, science: 1, arabic: 1 }[subject] ?? (rnd() < 0.3 ? 1 : 0);
        for (let k = 0; k < count; k += 1) {
          let day = (ci + si * 2 + w + 5) % 5;
          if (cls === '7G1' && w === 0 && ['math', 'english', 'science', 'arabic'].includes(subject)) day = 2;
          const dueAt = ws + day * DAY + 19 * HOUR; const size = 22 + Math.floor(rnd() * 4);
          let handed; let late = 0;
          if (dueAt < now) { const on = 0.72 + rnd() * 0.2; const lt = 0.03 + rnd() * 0.07; handed = Math.min(size, Math.round(size * (on + lt))); late = Math.round(size * lt); }
          else handed = Math.round(size * rnd() * 0.4);
          out.push({ cls, grade: g, subject, dueAt, size, handed, late });
        }
      });
    });
  });
  Object.values(db.assignments).filter((a) => a.classes.includes(STUDENT_OMAR.cls) && isPublished(a, now) && a.teacherId !== DEMO_TEACHER).forEach((a) => {
    const r = mulberry32(hashStr(a.id)); const size = ROSTERS[STUDENT_OMAR.cls].length; const past = a.dueAt < now;
    out.push({ cls: STUDENT_OMAR.cls, grade: 8, subject: a.subject, dueAt: a.dueAt, size, handed: past ? Math.round(size * (0.8 + r() * 0.15)) : Math.round(size * r() * 0.4), late: past ? 1 : 0 });
  });
  teacherAssignments(db).filter((a) => isPublished(a, now)).forEach((a) => a.classes.forEach((cls) => {
    const s = classStats(db, a, cls, now);
    out.push({ cls, grade: 8, subject: 'math', dueAt: a.dueAt, size: s.total, handed: s.handedIn, late: s.lateHanded, live: true });
  }));
  return out;
}

const STATIC_BACKLOG = 71; // other teachers' work waiting to be marked (sample)
const STATIC_FOLLOWUP = [
  { key: 'fu_rahaf', en: 'Rahaf Al-Dosari', ar: 'رهف الدوسري', cls: '7G1', missing: 4, subjects: ['science', 'english', 'arabic', 'ict'] },
  { key: 'fu_mazen', en: 'Mazen Khan', ar: 'مازن خان', cls: '6B2', missing: 3, subjects: ['math', 'social', 'art'] },
  { key: 'fu_talal', en: 'Talal Al-Yami', ar: 'طلال اليامي', cls: '7B2', missing: 3, subjects: ['english', 'islamic', 'math'] },
];

function AdminOverview() {
  const { t, fmt, lang, now, db, actions, guide, markGuide } = useApp();
  const [week, setWeek] = useState(0);
  useEffect(() => { if (guide.steps[2]) markGuide(6); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const entries = useMemo(() => adminEntries(db, now), [db, now]);
  const ws = adminWeekStart(now, week); const we = ws + 7 * DAY;
  const inWeek = entries.filter((e) => e.dueAt >= ws && e.dueAt < we);
  const rate = (xs) => { const due = xs.filter((e) => e.dueAt <= now); const s = sum(due.map((e) => e.size)); return s ? sum(due.map((e) => e.handed)) / s : null; };
  const overall = rate(inWeek);
  const toMark = STATIC_BACKLOG + teacherAssignments(db).filter((a) => isPublished(a, now)).reduce((n, a) => n + sum(a.classes.map((c) => classStats(db, a, c, now).toGrade)), 0);
  const live = [];
  DEMO_CLASSES.forEach((cls) => supportList(db, cls, now).filter((x) => x.miss >= 3).forEach((x) => live.push({ key: `fu_${x.stu.id}`, en: x.stu.en, ar: x.stu.ar, cls, missing: x.miss, subjects: ['math'] })));
  const followUp = [...live, ...STATIC_FOLLOWUP];
  const days = [0, 1, 2, 3, 4].map((i) => ws + i * DAY + 12 * HOUR);
  const load = (cls, d) => inWeek.filter((e) => e.cls === cls && toYMD(e.dueAt) === toYMD(d)).length;
  const flags = ADMIN_CLASSES.flatMap((c) => days.map((d) => ({ c, d, n: load(c, d) }))).filter((x) => x.n >= 3);
  const events = [];
  Object.values(db.submissions).forEach((s) => {
    const a = db.assignments[s.assignmentId]; const stu = STUDENTS[s.studentId];
    if (!a || !stu || !ADMIN_CLASSES.includes(stu.cls)) return;
    if (s.submittedAt && s.status !== 'draft' && now - s.submittedAt < 3 * DAY) events.push({ at: s.submittedAt, icon: Send, text: t('ad.act.in', { name: studentName(stu, lang), title: a.title }), meta: `${clsLabel(stu.cls, lang)} · ${subjName(a.subject, lang)}` });
    if (s.returnedAt && ['returned', 'revision'].includes(s.status) && now - s.returnedAt < 3 * DAY) events.push({ at: s.returnedAt, icon: CheckCircle2, text: t('ad.act.back', { name: studentName(stu, lang), title: a.title }), meta: teacherName(a.teacherId, lang) });
  });
  Object.values(db.assignments).forEach((a) => { if (isPublished(a, now) && now - a.publishAt < 4 * DAY && a.classes.some((c) => ADMIN_CLASSES.includes(c))) events.push({ at: a.publishAt, icon: ClipboardList, text: t('ad.act.set', { title: a.title, cls: clsList(a.classes, lang) }), meta: teacherName(a.teacherId, lang) }); });
  events.sort((x, y) => y.at - x.at);
  const cell = (n) => (n >= 3 ? 'bg-amber-100 ring-2 ring-amber-400 text-amber-950 font-bold' : n === 2 ? 'bg-ags-indigo-100 text-ags-navy' : n === 1 ? 'bg-ags-indigo-50 text-ags-navy' : 'bg-slate-50 text-slate-400');
  return (
    <div className="max-w-5xl mx-auto">
      <Hero>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-ags-gold">{t('ad.user')}</p><h1 className="text-3xl sm:text-[2.15rem] font-bold mt-1">{t('ad.title')}</h1><p className="text-white/80 mt-1">{t('ad.sub')}</p></div>
          <Segmented dark ariaLabel={t('ad.week')} value={week} onChange={setWeek} options={[{ value: -1, label: t('ad.wk.prev') }, { value: 0, label: t('ad.wk.this') }, { value: 1, label: t('ad.wk.next') }]} />
        </div>
      </Hero>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard size="lg" icon={TrendingUp} tone="green" value={overall == null ? '—' : <CountUp value={overall} format={(v) => fmt.pct(v)} />} label={t('ad.k.handedIn')} hint={overall == null ? t('ad.noneDue') : undefined} />
        <StatCard size="lg" icon={Inbox} tone="gold" value={<CountUp value={toMark} format={(v) => fmt.n(Math.round(v))} />} label={t('ad.k.toMark')} />
        <StatCard size="lg" icon={Users} tone="amber" value={<CountUp value={followUp.length} format={(v) => fmt.n(Math.round(v))} />} label={t('ad.k.followUp')} />
      </div>

      <section className="card p-5 sm:p-6 mb-5" aria-labelledby="ad-load">
        <h2 id="ad-load" className="text-lg font-bold text-ags-navy">{t('ad.load')}</h2>
        <p className="hint mb-4">{t('ad.load.hint')}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-separate" style={{ borderSpacing: '4px' }}>
            <caption className="sr-only">{t('ad.load')}</caption>
            <thead><tr><th scope="col" className="text-start text-xs font-medium text-ags-slate px-2">{t('ad.class')}</th>{days.map((d) => <th key={d} scope="col" className="text-xs font-medium text-ags-slate">{fmt.weekdayShort(d)} <span className="tabular">{fmt.dayNum(d)}</span></th>)}</tr></thead>
            <tbody>
              {ADMIN_CLASSES.map((c) => (
                <tr key={c}>
                  <th scope="row" className="text-start text-sm font-medium text-ags-navy px-2 whitespace-nowrap"><bdi>{clsLabel(c, lang)}</bdi></th>
                  {days.map((d) => { const n = load(c, d); return <td key={d} className={cx('h-10 rounded-lg text-center text-sm tabular', cell(n))} aria-label={`${clsLabel(c, lang)} · ${fmt.weekday(d)}: ${fmt.n(n)}`}><span className="inline-flex items-center gap-1">{n >= 3 && <AlertTriangle aria-hidden="true" className="w-3.5 h-3.5" />}{n ? fmt.n(n) : '·'}</span></td>; })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {flags.length ? flags.map((f) => <span key={f.c + f.d} className="inline-flex items-center gap-2 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-3 py-2 text-sm text-amber-950"><AlertTriangle aria-hidden="true" className="w-4 h-4 text-amber-700" />{t('ad.load.flag', { cls: `⁨${clsLabel(f.c, lang)}⁩`, n: f.n, day: fmt.weekday(f.d) })}</span>)
            : <span className="text-sm text-ags-slate flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600" />{t('ad.load.none')}</span>}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="card p-5 sm:p-6" aria-labelledby="ad-g">
          <h2 id="ad-g" className="text-lg font-bold text-ags-navy">{t('ad.byGrade')}</h2>
          <p className="hint mb-4">{t('ad.byGrade.hint')}</p>
          {overall == null ? <EmptyState icon={CalendarClock} title={t('ad.noneDue')} /> : (
            <ul className="space-y-3">
              {[6, 7, 8].map((g) => { const v = rate(inWeek.filter((e) => e.grade === g)); return (
                <li key={g} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3">
                  <span className="text-sm text-ags-navy">{t('ad.gradeN', { g })}</span>
                  <span className="h-5 bg-slate-100 rounded-e overflow-hidden"><Bar value={v || 0} /></span>
                  <span className="text-sm font-bold tabular text-end">{v == null ? '—' : fmt.pct(v)}</span>
                </li>
              ); })}
            </ul>
          )}
        </section>
        <section className="card p-5 sm:p-6" aria-labelledby="ad-fu">
          <h2 id="ad-fu" className="text-lg font-bold text-ags-navy">{t('ad.followUp')}</h2>
          <p className="hint mb-3">{t('ad.followUp.hint')}</p>
          <ul className="divide-y divide-slate-100">
            {followUp.map((f) => (
              <li key={f.key} className="py-2.5 flex flex-wrap items-center gap-3">
                <Avatar name={f.en} size="sm" />
                <span className="flex-1 min-w-[9rem]"><bdi className="block font-medium text-ags-navy">{lang === 'ar' ? f.ar : f.en}</bdi><span className="block text-xs text-ags-slate"><bdi>{clsLabel(f.cls, lang)}</bdi> · {t('ad.missed', { n: f.missing })}</span></span>
                {db.notified[f.key] ? <span className="text-sm text-emerald-800 inline-flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="w-4 h-4" />{t('ad.notified')}</span>
                  : <button type="button" className="btn btn-secondary btn-sm" onClick={() => actions.notifyHomeroom(f.key, f.cls)}><Bell aria-hidden="true" className="w-4 h-4" />{t('ad.notify')}</button>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-5 sm:p-6 mt-5" aria-labelledby="ad-act">
        <h2 id="ad-act" className="text-lg font-bold text-ags-navy flex items-center gap-2">{t('ad.latest')}<span className="text-[0.7rem] font-bold rounded bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 px-1.5 py-0.5">{t('ad.live')}</span></h2>
        <ul className="divide-y divide-slate-100 mt-2">
          {events.slice(0, 5).map((e, i) => { const I = e.icon; return (
            <li key={i} className={cx('py-2.5 flex items-center gap-3', i === 0 && now - e.at < 10 * MIN && 'bg-ags-gold-50 -mx-2 px-2 rounded-lg')}>
              <span className="w-8 h-8 rounded-lg bg-ags-indigo-50 text-ags-indigo inline-flex items-center justify-center shrink-0"><I aria-hidden="true" className="w-4 h-4 flip-rtl" /></span>
              <span className="flex-1 min-w-0"><span className="block text-sm text-ags-navy">{e.text}</span><span className="block text-xs text-ags-slate">{e.meta}</span></span>
              <span className="text-xs text-ags-slate whitespace-nowrap">{agoLabel(t, e.at, now)}</span>
            </li>
          ); })}
        </ul>
      </section>
      <p className="mt-4 text-xs text-ags-slate flex gap-2"><Info aria-hidden="true" className="w-4 h-4 shrink-0" />{t('ad.liveNote')}</p>
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
  const [guide, setGuide] = useState(() => ({ open: typeof window !== 'undefined' && window.innerWidth >= 1680, aid: null, steps: {} }));
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
  const viewKey = `${role}|${stage}|${route.name}|${route.id || ''}|${route.sid || ''}|${route.cls || ''}`;
  useEffect(() => {
    setLoading(true); setNow(Date.now()); window.scrollTo({ top: 0 });
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, [viewKey]);

  const toast = useCallback((msg, opts = {}) => {
    const id = uid('t');
    setToasts((ts) => [...ts.slice(-2), { id, msg, ...opts }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), opts.action ? 7000 : 4500);
  }, []);
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
      const k = subKey(aid, sid); const cur = d.submissions[k]; const next = fn(cur);
      return !next || next === cur ? d : { ...d, submissions: { ...d.submissions, [k]: next } };
    });
    const blank = (aid, sid) => ({ id: uid('sub'), assignmentId: aid, studentId: sid, status: 'draft', answers: {}, annotations: {}, rubricScores: {}, comment: '', note: '', history: [] });
    return {
      saveDraft: (aid, sid, answers) => upsert(aid, sid, (cur) => {
        if (cur && cur.status !== 'draft') return cur;
        if (!cur && !Object.values(answers || {}).some((v) => v != null && v !== '' && !(Array.isArray(v) && !v.length))) return cur;
        const base = cur || blank(aid, sid);
        return { ...base, answers: { ...base.answers, ...answers }, draftSavedAt: Date.now() };
      }),
      submit: (aid, sid, answers) => {
        const a = dbRef.current.assignments[aid]; const at = Date.now(); const late = at > a.dueAt;
        upsert(aid, sid, (cur) => { const base = cur || blank(aid, sid); const merged = { ...base.answers, ...answers }; return { ...base, answers: merged, status: 'submitted', submittedAt: at, late, resubmitting: false, draftSavedAt: at, autoScore: autoScore(a, merged).score }; });
        if (sid === 's_omar' && guideRef.current.aid === aid) markGuide(2);
        return { late, daysLate: late ? lateDays(a.dueAt, at) : 0, at };
      },
      startRedo: (aid, sid) => upsert(aid, sid, (cur) => cur && ({ ...cur, status: 'draft', resubmitting: true, draftSavedAt: Date.now(), history: [...(cur.history || []), { mark: cur.mark, comment: cur.comment, annotations: cur.annotations, returnedAt: cur.returnedAt }], mark: undefined, comment: '', annotations: {} })),
      dismissReminder: (rid) => setDb((d) => ({ ...d, reminders: d.reminders.map((r) => (r.id === rid ? { ...r, dismissed: true } : r)) })),
      publish: (draft) => {
        const at = Date.now(); const a = draftToAssignment(draft, at, i18n.t, uid('a'));
        setDb((d) => ({ ...d, assignments: { ...d.assignments, [a.id]: a } })); setNow(at);
        if (a.status === 'scheduled') toast(i18n.t('sh.scheduled', { when: `${fmt.date(a.publishAt)}, ${fmt.time(a.publishAt)}` }), { kind: 'success' });
        else {
          if (a.classes.includes(STUDENT_OMAR.cls)) setGuide((g) => ({ ...g, aid: a.id, steps: { 1: true } }));
          toast(i18n.t('sh.sent', { cls: clsList(a.classes, lang) }), { kind: 'success', action: a.classes.includes(STUDENT_OMAR.cls) ? { label: i18n.t('sh.seeAsStudent'), onClick: () => go('student', { name: 'home' }, 'middle') } : undefined });
        }
        return a;
      },
      sendBack: (aid, sid, data, status) => {
        const at = Date.now();
        upsert(aid, sid, (cur) => cur && ({ ...cur, ...data, status, gradedAt: at, returnedAt: at }));
        toast(i18n.t(status === 'revision' ? 'mk.sentRedo' : 'mk.sentOk', { name: studentFirst(STUDENTS[sid], lang) }), { kind: 'success' });
        if (sid === 's_omar' && guideRef.current.aid === aid) markGuide(3);
      },
      remind: (aid, cls, ids) => {
        const d0 = dbRef.current; const a = d0.assignments[aid]; const at = Date.now();
        const targets = ids || (ROSTERS[cls] || []).filter((stu) => ['missing', 'notYet'].includes(teacherStatus(a, d0.submissions[subKey(aid, stu.id)], at))).map((s) => s.id);
        if (!targets.length) { toast(i18n.t('rem.none'), { kind: 'info' }); return; }
        setDb((d) => ({ ...d, reminders: [...d.reminders.filter((r) => !(r.assignmentId === aid && targets.includes(r.studentId))), ...targets.map((sid) => ({ id: uid('rem'), studentId: sid, assignmentId: aid, teacherId: a.teacherId, at }))] }));
        toast(i18n.t('rem.done', { n: targets.length }), { kind: 'success' });
      },
      remindStudent: (sid) => {
        const d0 = dbRef.current; const stu = STUDENTS[sid]; const at = Date.now();
        const a = teacherAssignments(d0).filter((x) => x.classes.includes(stu.cls) && isPublished(x, at)).find((x) => ['missing', 'notYet'].includes(teacherStatus(x, d0.submissions[subKey(x.id, sid)], at)));
        if (!a) { toast(i18n.t('rem.none'), { kind: 'info' }); return; }
        setDb((d) => ({ ...d, reminders: [...d.reminders, { id: uid('rem'), studentId: sid, assignmentId: a.id, teacherId: a.teacherId, at }] }));
        toast(i18n.t('rem.done', { n: 1 }), { kind: 'success' });
      },
      notifyHomeroom: (key, cls) => { setDb((d) => ({ ...d, notified: { ...d.notified, [key]: true } })); toast(i18n.t('ad.notifyToast', { cls: clsLabel(cls, lang, true) }), { kind: 'info' }); },
    };
  }, [i18n, lang, fmt, toast, go, markGuide]);

  const resetDemo = () => {
    _sampleCache.clear();
    setDb(buildSeed()); setBuilder(newDraft(Date.now())); setRoutes(HOME_ROUTES); setStageRaw('middle');
    setGuide((g) => ({ ...g, aid: null, steps: {} })); setModal(null);
    toast(t('demo.reset.done'), { kind: 'success' });
  };
  const guideGo = (i) => {
    setGuide((x) => ({ ...x, open: false }));
    const aid = guideRef.current.aid && db.assignments[guideRef.current.aid] ? guideRef.current.aid : null;
    const omar = STUDENT_OMAR.cls;
    if (i === 1) go('teacher', { name: 'create' });
    if (i === 2) go('student', { name: 'home' }, 'middle');
    if (i === 3) { const sub = aid && db.submissions[subKey(aid, 's_omar')]; go('teacher', sub && HANDED_IN.includes(teacherStatus(db.assignments[aid], sub, now)) ? { name: 'mark', id: aid, sid: 's_omar' } : aid ? { name: 'class', id: aid, cls: omar } : { name: 'home' }); }
    if (i === 4) go('student', aid ? { name: 'assignment', id: aid } : { name: 'home' }, 'middle');
    if (i === 5) go('teacher', { name: 'progress', cls: omar });
    if (i === 6) go('admin', { name: 'home' });
  };

  const ctx = { lang, setLang, t, fmt, dir, role, setRole, stage, setStage, student, now, db, actions, route, navigate, toast, settings, setSettings, guide, setGuide, guideGo, markGuide, builder, setBuilder };

  const view = () => {
    const r = route;
    if (role === 'student') return r.name === 'assignment' ? <AssignmentPage key={r.id} id={r.id} /> : <StudentHome />;
    if (role === 'teacher') {
      if (r.name === 'create') return <SetHomework />;
      if (r.name === 'class') return <ClassView key={`${r.id}${r.cls}`} id={r.id} cls={r.cls} />;
      if (r.name === 'mark') return <MarkView key={`${r.id}${r.sid}`} id={r.id} sid={r.sid} />;
      if (r.name === 'progress') return <Progress key={r.cls || 'x'} cls={r.cls} />;
      return <TeacherHome />;
    }
    return <AdminOverview />;
  };

  return (
    <AppCtx.Provider value={ctx}>
      <style>{GLOBAL_CSS}</style>
      <div className={cx('ags-root', settings.reduceMotion && 'reduce-motion')} dir={dir} lang={lang}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] btn btn-gold">{t('skip')}</a>
        <TopBar onSettings={() => setModal('settings')} />
        {role === 'student' && <AgeBar />}
        <main id="main" tabIndex={-1} className="px-4 sm:px-6 py-6 sm:py-8 pb-28">
          {loading ? <div className="max-w-3xl mx-auto"><ViewSkeleton /></div> : <div key={viewKey} className="ags-fade-up">{view()}</div>}
          <div className="max-w-5xl mx-auto"><Footer onAbout={() => setModal('about')} /></div>
        </main>
        <DemoGuide />
        <Toasts toasts={toasts} dismiss={(id) => setToasts((ts) => ts.filter((x) => x.id !== id))} />
        <SettingsModal open={modal === 'settings'} onClose={() => setModal(null)} onReset={() => setModal('reset')} onAbout={() => setModal('about')} />
        <Modal open={modal === 'reset'} onClose={() => setModal(null)} title={t('demo.reset.title')} icon={RotateCcw} size="sm"
          footer={<><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>{t('cancel')}</button><button type="button" className="btn btn-primary" onClick={resetDemo}><RotateCcw aria-hidden="true" className="w-4 h-4" />{t('demo.reset')}</button></>}>
          <p className="text-ags-navy">{t('demo.reset.body')}</p>
        </Modal>
        <Modal open={modal === 'about'} onClose={() => setModal(null)} title={t('demo.about')} icon={Info} size="sm" footer={<button type="button" className="btn btn-primary" onClick={() => setModal(null)}>{t('close')}</button>}>
          {AGS_LOGO && <img src={AGS_LOGO} alt={t('app.school')} className="h-20 w-auto mx-auto mb-4" />}
          <p className="text-ags-navy leading-relaxed">{t('demo.about.body')}</p>
          <p className="mt-4 text-sm text-ags-slate">{t('app.school')} · {t('app.city')}</p>
        </Modal>
      </div>
    </AppCtx.Provider>
  );
}
