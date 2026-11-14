# AGS Homework Hub — clickable demo

A front-end demonstration of a homework platform for **Advanced Generations International Schools (AGS), Jeddah**.
It shows the **Student**, **Teacher** and **Admin** experiences in **English and Arabic (full RTL)**.

> **Demo only.** Every person, class, assignment, submission, grade and statistic is fictional and held in memory.
> Autosave works within the session; refreshing the page restores the sample data. No accounts exist and no
> messages or notifications are sent. The footer of every screen carries a “Demo — sample data” label.

## Open it

**For a presentation (no setup):** open `presentation/AGS-Homework-Hub-Demo.html` in Chrome, Edge or Safari.
It is one self-contained file and works offline. An internet connection is used only to load the
Noto Kufi Arabic font; without one, the system font is used.

**For development:**

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build:single
```

`npm run build:single` regenerates the one-file version in `dist-single/index.html`. Copy it over
`presentation/AGS-Homework-Hub-Demo.html` after changes.

## The 6-step demo (≈ 5 minutes)

A **Demo guide** panel (bottom corner) lists these steps, ticks them off as they happen, and has a **Go** button for each.

1. **Teacher → Create.** Click the **Worksheet photo** template, type the title *Fractions Review*, keep class **8B**, check the due date, then **Publish**.
2. **Student.** *Fractions Review* is at the top of **Due soon** (marked “New”). Open it → **Submit paper homework** → **Use a sample page** → pick *Handwritten fractions* → **Preview & submit** → **Submit assignment**.
3. **Teacher.** Open the submission (guide step 3, or **Grading**). Draw with **Pen**, add **Ticks**, score the **Rubric**, tap a quick comment, then **Return**.
4. **Student.** The assignment now shows the mark, rubric breakdown, comment and the teacher’s marks drawn on the photo.
5. **Teacher → Class insights.** The *Fractions Review* completion bar has moved up.
6. **Admin.** The school overview’s live activity feed shows the submission and the return; Ms. Sarah’s grading backlog has changed.

Tips: switch **EN / ع** at any time — the whole interface mirrors. Use **Design preview by age** (student view) to show
the KG–Grade 3 and Grades 9–12 designs. **Reset demo** restores the sample data. On a phone, **Take photo** opens the camera.

## What’s in it

| Area | Highlights |
|---|---|
| Student | Dashboard (due soon, calm late/overdue section, feedback, completed), subject filter, week strip, autosaving answers, review-before-submit, honest on-time/late confirmation, feedback with annotated pages, resubmission. |
| Paper homework | Take photo (camera on phones), upload from gallery, or built-in sample pages; real rotate and crop, reorder, delete with undo, note to teacher, preview, submit. |
| Teacher | Dashboard, Google-Forms-style builder (8 question types, templates, attachments, rubric, publish/schedule, late policy, resubmission, student preview), duplicate to another class, submissions table with filters and bulk actions, split-screen grading with pen / tick / cross / text / undo on a canvas, class insights (no student rankings). |
| Admin | Completion by grade and subject, outstanding and late work, grading backlog and turnaround, students needing follow-up, assignment load per class per day with overloaded days highlighted. Grade 8 Mathematics and 8B update live from the session; other figures are fixed sample data. |
| Ages | KG–Grade 3 (large illustrated cards, short sentences, star on submit), Grades 4–8 (balanced, progress bars), Grades 9–12 (compact and data-led). |
| Accessibility | Status always shown as icon + text, visible focus rings, keyboard-operable controls, adjustable text size and reduced motion in Settings, table view for every chart. |

## Code

Everything lives in `src/App.jsx` (single file): brand tokens, the translations object (English and Arabic side by side),
seed data, domain logic, then named components (`StudentDashboard`, `AssignmentPage`, `PaperUpload`, `AssignmentBuilder`,
`SubmissionsTable`, `GradingView`, `ClassInsights`, `AdminOverview`, …). Built with React 18, Tailwind CSS 3 and lucide-react.
Hijri dates are generated with `Intl.DateTimeFormat` (Umm al-Qura calendar), never hard-coded.
