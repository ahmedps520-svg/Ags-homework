# AGS Homework Hub — clickable demo

A front-end demonstration of a homework platform for **Advanced Generations International Schools (AGS), Jeddah**,
in **English and Arabic (full right-to-left)**. It is built around three simple jobs:

- **Students** see one list and hand in homework by taking a photo of their work.
- **Teachers** set homework in three steps and mark it with ticks, a mark and a comment.
- **Leadership** sees the whole school on one screen.

> **Demo only.** Every person, class, homework, mark and figure is fictional and held in memory.
> Work saves automatically within the session; refreshing the page brings back the sample data. No accounts exist
> and no messages or notifications are sent. Every screen carries a “Demo — sample data” label.

## Open it

**For a presentation (no setup):** open `presentation/AGS-Homework-Hub-Demo.html` in Chrome, Edge or Safari.
It is one self-contained file and works offline (an internet connection only loads the Noto Kufi Arabic font).

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

`npm run build:single` regenerates the one-file version in `dist-single/index.html`; copy it over
`presentation/AGS-Homework-Hub-Demo.html` after changes.

## The demo (about 4 minutes)

Click **Demo steps** (bottom corner) to see the six steps; tap any step to jump straight there.

1. **Teacher → Set homework.** Choose **Photo of written work**, type *Fractions Review*, keep **8B1** and **Tomorrow**, press **Send to 8B1**.
2. **Student.** *Fractions Review* is at the top of **To do**. Open it → **No camera? Use a sample page** → pick a page → **Hand in**.
3. **Teacher (Mr. Nabil).** **Start marking** → tap the photo to add ticks → choose a mark → tap a quick comment → **Send back to Omar**.
4. **Student.** The homework shows the mark, the comment and the teacher’s ticks on the photo.
5. **Teacher → Progress.** *Fractions Review* now shows Omar’s hand-in.
6. **Admin.** **Latest activity** shows the hand-in and the return as they happened.

Switch **EN / ع** at any time. In the student view, **Design preview by age** shows the KG–Grade 3 and Grades 9–12
designs. **Settings** (gear icon) has text size, reduce motion and **Reset demo**.

## Classes

Class codes follow the school’s own naming: boys’ sections **8B1, 8B2, 8B3**, girls’ sections **8G1, 8G2**,
and KG sections with letters (**KG2-A**). Boys’ sections are taught by male teachers: the demo teacher, **Mr. Nabil Al-Omari**,
teaches Mathematics to 8B1–8B3. KG keeps female teachers.

## Logo

The official AGS logo (supplied by the school, outer circle removed, transparent background) is in
`src/assets/ags-logo.webp`. To replace it, save a new file there as `ags-logo.svg` / `.png` / `.webp` / `.jpg`
(keep only one) and run `npm run build:single`.

## What’s in it

| Who | What they can do |
|---|---|
| Student | One list: **To do**, **Late** (calm, with the late-work rule), **Returned with feedback**, finished work. One button per homework. Photos are taken or uploaded on the homework page itself (rotate or delete a page), answers save automatically, then **Hand in**. Feedback shows the mark, comment and the teacher’s marks on the photo; **Redo and hand in** when the teacher asks. |
| Teacher | **Home**: what’s ready to mark, homework set with “18 of 24 handed in”, one-tap reminders. **Set homework**: photo of written work, quick quiz (marked automatically) or written answer → title → class and due date (Tomorrow / In 2 days / Next week). Late work, redo and send-later are under *More options*. **Marking**: tick / cross / pen on the photo, mark out of 10, comment with quick phrases, **Send back** moves straight to the next student. **Progress**: hand-in rate per homework and students who may need help (never a ranking). |
| Admin | Homework handed in, work waiting to be marked, students to follow up, homework due per class each day with overloaded days highlighted, and live activity. Grade 8 boys’ Mathematics and 8B1 update live; other figures are fixed sample data. |
| Ages | KG–Grade 3: large illustrated cards and very short sentences. Grades 4–8: balanced. Grades 9–12: compact. |
| Accessibility | Status always shown as icon + text, visible focus rings, keyboard-operable controls, adjustable text size and reduced motion. |

## Ideas for the next version

1. **Overload warning while setting homework** — “8B1 already has 3 assignments due on Tuesday” before the teacher presses Send.
2. **Parent weekly summary** — one calm message in Arabic or English: what’s due, what’s late, latest feedback.
3. **Voice** — teachers record a short spoken comment; students hand in audio for Qur’an recitation, Arabic reading or English speaking.
4. **Read-aloud for KG–Grade 3** — a speaker button reads the instructions to younger children.
5. **Reuse homework** — copy last year’s homework, share it with the department, build a question bank.
6. **Smart reminders** — a reminder the evening before the due date, and automatic extensions for absent students.
7. **“How hard was this?”** — one tap after handing in, so teachers can see which homework was too hard.
8. **Marks export** — send marks to the school’s gradebook or report cards as a spreadsheet.

## Code

Everything lives in `src/App.jsx` (single file): brand styles, the translations object (English and Arabic side by side),
seed data, domain logic, then named components (`StudentHome`, `AssignmentPage`, `PhotoPages`, `TeacherHome`,
`SetHomework`, `MarkView`, `Progress`, `AdminOverview`, …). Built with React 18, Tailwind CSS 3 and lucide-react.
Hijri dates are generated with `Intl.DateTimeFormat` (Umm al-Qura calendar), never hard-coded.
