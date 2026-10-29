# AAD: Academy of Academic Distinction — website

**Math, Science & Academic/Research Coaching.** A static website (plain HTML, CSS and JavaScript) for a premium online tutoring and academic coaching business. It has no build step and no dependencies, and it is ready for GitHub Pages.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: sliding photo hero, stats, the AAD difference, subjects, research & grad school mentorship, live classroom, founders & team, method, reviews, FAQ |
| `subjects.html` | Subjects & courses: math, physics, chemistry & biology, CS, university & engineering, test prep, research & graduate school |
| `programs.html` | Six programs. No prices; every program leads to "Book Your Free Consultation" |
| `approach.html` | Story, the 5-step method, "typical tutoring vs AAD", founders, team of 10+, careers |
| `results.html` | University outcomes, plus 12 reviews with filters (parents, high school, university, research) |
| `faq.html` | Searchable FAQ |
| `book.html` | Free consultation: 3 taps (level, subjects, name + email or cell), plus an optional Calendly embed |
| `book-now.html` | Urgent session request in 3 steps: subjects, then length + day and time (in Eastern, with the visitor's local time alongside), then email or cell |
| `contact.html` | Three tap cards (call, email, message), office hours, a short message form, live world clocks |
| `404.html` | Not-found page (GitHub Pages uses it automatically) |

## Preview locally

To open it quickly, double-click `index.html`.

To preview it the way a real server would show it, run this in the folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Update your details (one file)

Edit **`assets/js/config.js`**. It holds the phone (currently **(647) 821-8290**), email (currently **aadteaching@gmail.com**), office hours, social links, form endpoint and Calendly link, and the whole site picks up the changes. A field left `""` is hidden everywhere.

> The pages also contain the phone and email as fallback text (for visitors with JavaScript off). If you change either one, use Find & Replace across files in VS Code (Ctrl+Shift+H) too.

## Make the forms deliver to your inbox

GitHub Pages can't receive form submissions on its own, so the three forms (free consultation, urgent booking, contact) email each submission to **aadteaching@gmail.com** through free services set in `config.js`:

1. **Web3Forms** (`web3formsKey`) is the main one. Paste your form's access key (free sign-up at web3forms.com).
2. **FormSubmit** (`formEndpoint`) is the backup, tried only if the first fails. A Formspree link also works here.

**Setup steps: [EMAIL-FORMS-SETUP.md](EMAIL-FORMS-SETUP.md).**

- Hitting **Reply** on a submission email answers the visitor directly.
- If every service fails, the visitor sees *"Send it from your email app instead"* (pre-filled) plus your phone number, so no request is lost.
- With both settings `""`, the forms open the visitor's email app instead.

To show a live booking calendar on `book.html`, paste a Calendly or Cal.com link into `calendlyUrl`.

## Urgent booking ("Urgently Book Now!")

The yellow button in the header (and in the phone bottom bar) opens `book-now.html`. It's a 3-step, Calendly-style flow with one question per screen.

1. **What do you need help with?** Big subject tiles. They can pick **one or more** (each picked tile gets a ✓), then tap **Continue**.
2. **Pick a time.**
   - **Length** chips on top: 30 min, 1 hr, 1.5 hr or 2 hr. *1 hr* is picked to start, so most people don't touch it.
   - A month calendar (open days in bold) with a column of times beside it.
   - **Times are always in your time zone** (Eastern Time, Toronto). If the visitor is somewhere else, each time also shows **their local time in grey** underneath (e.g. *9:00 AM* / *9:00 PM* for Hong Kong, with the weekday added when it's a different day there). Visitors in Eastern time just see one time.
   - Their zone is detected from their device. They can change it under **Also show my time**.
   - **Soonest available** gives one-tap picks.
   - Tapping a time shows **Next**.
3. **Where should we confirm?** One box that takes an email **or** a cell number. Name and a note are optional.

A summary panel on the left fills in as they go (on phones it's a strip at the top). It shows the time in Eastern plus *"= 9:00 PM – 10:00 PM your time (Hong Kong)"* when their zone differs. Back works at every step. Links like `book-now.html?subject=Physics` or `?subject=Physics,Mathematics` pre-tick those subjects.

The free consultation (`book.html`) works the same way: tap a level (it moves on by itself), tap subjects, then name + email or cell. Links like `book.html?subject=Physics` or `?program=…` fill those in.

**Nothing is booked automatically.** The request is emailed to you and you confirm.
- **Email subject:** *URGENT session request — Physics, Mathematics — Thu, Oct 22, 9:00 AM – 10:00 AM EDT* (always your time).
- **Email body:** the time in **your** time zone and **theirs**, their time zone, their contact details, and an **Availability check** line saying whether it was checked against the live calendar.
- **To confirm:** Reply (it goes straight to them) or text their cell.

**Settings** (`urgent` in `assets/js/config.js`)
- `timeZone`: the zone every time is shown in (default `"America/Toronto"`). `timeZoneLabel` (optional) overrides the wording, which is "Eastern Time (Toronto)" by default.
- `hours`: usual hours, in that time zone. Delete a weekday to close it.
- `minNoticeHours`: the earliest start (default: 2 hours from now).
- `daysAhead`, `slotMinutes`, `durations`, `blockedDates` (e.g. `["2026-12-25"]`), `replyPromise`.

Make sure the forms are activated ([EMAIL-FORMS-SETUP.md](EMAIL-FORMS-SETUP.md)), so urgent requests reach your inbox directly.

### Connect Google Calendar (live availability)

Once connected, the calendar only offers times when the instructor is actually free. The left panel shows a green **"Live availability from our calendar"** when it's working.

**Option A: use his normal calendar.** Busy times are hidden automatically, and event details stay private.

1. **Share free/busy only.** In Google Calendar, go to **Settings → (his calendar) → Access permissions for events**. Tick **Make available to public** and choose **See only free/busy (hide details)**.
2. **Copy the Calendar ID.** On the same page, under **Integrate calendar**, copy the **Calendar ID**. For a main calendar, this is the Gmail address.
3. **Create an API key.** Go to <https://console.cloud.google.com>, create a project, then **APIs & Services → Library → Google Calendar API → Enable**. Next, **Credentials → Create credentials → API key**. Restrict it as follows:
   - *Application restrictions → Websites:* `https://<your-username>.github.io/*` (and your own domain, if you add one).
   - *API restrictions:* **Google Calendar API**.
   - An API key restricted this way is safe to put in a website.
4. **Paste both** into `config.js` → `urgent.googleCalendar` (`calendarId`, `apiKey`), leaving `mode: "busy"`.
5. **Test it.** Open the booking page and pick a subject and length.
   - **Green dot:** live availability is working.
   - **Orange dot ("Showing our usual hours"):** Google refused the request. Check the sharing setting, or use Option B.

Times are offered only inside the usual `hours` **and** outside his events. `bufferMinutes` (default 15) keeps a gap before and after each event. Events marked **Free** in Google Calendar are ignored.

**Option B: a separate "availability" calendar** (Teachworks-style). Only the times he blocks out are bookable.

1. In Google Calendar, create a new calendar, e.g. "AAD availability", and make it **public** (full details are fine, since it only contains availability blocks).
2. Add events for the times he's open, such as a weekly recurring "Mon–Fri 6–9 PM". Delete an occurrence to close that day.
3. Use that calendar's ID and the same API key, and set `mode: "available"`.

**If Google can't be reached**, the page falls back to the usual hours and says so. Every request still needs your confirmation, so nothing can be double-booked.

## Photos & collages

The site uses 114 free stock photos from [Pexels](https://www.pexels.com/license/), stored in `assets/img/photos/`. They're free for commercial use and need no credit. Files are named by their Pexels ID: `{id}-800.webp`, plus `{id}-1400.webp` for photos shown large. To see one on Pexels, go to `https://www.pexels.com/photo/{id}/`. They show models, not real AAD students or staff.

**How the collages work**
- Every photo spot is a **stack of 5–10 photos** that crossfades from one to the next. The container has `data-rotator`, plus `data-interval` (milliseconds between photos) and an optional `data-delay`.
- Each inner page opens with a **5-tile collage** of 10 photos, and the tiles change at staggered times. The homepage has the **"Every age. Every stage."** gallery.
- Only the first photo of each stack loads with the page. The others download just before they're shown. Stacks pause while off-screen or in a background tab, and stay still for visitors with "reduce motion" on.
- On phones, page collages show 3 tiles; the homepage gallery shows all 5.

**Changing a photo**
- **Simple:** replace a file in `assets/img/photos/` with another image of the same name (WebP, landscape, about 800px wide, or 1400px for the `-1400` file).
- **Add or remove one:** in the HTML, each stack is a list of `<img>` tags. The first has `class="is-on"` and `src`; the rest use `data-src`/`data-srcset`. Copy a line and change the file names.

**Use real photos when you can.** Swap in photos of your real team and (with permission) your real students. The founders/team section (the "Teaching live" stack) especially should show your actual educators, so visitors aren't misled about who teaches.

## Common edits

- **Testimonials.** Search for `SAMPLE TESTIMONIALS` on `index.html` and `results.html`. These are invented placeholders: replace them with real, permission-granted reviews before launch. Each review sets the initials in `avatar`, the name in `testimonial-name` and the role/city in `testimonial-meta`. On `results.html`, `data-filter-item` sets the category: `parents`, `students`, `university` or `research`.
- **Founders.** The founders are in the `founders` section of `index.html` and `approach.html`. Check every credential line. The MD co-founder's teaching lines are suggestions to confirm or edit.
- **Popularity claims.** Wording like "200+ families", "Spots fill quickly" and "Limited spots each term" should stay true. Edit it if numbers change.
- **Colours.** These are set at the top of `assets/css/styles.css` under `:root`. The site is black and white, and green (`#15803d`) is reserved for the **Book Your Free Consultation** buttons (`.btn-cta`). Any link to `book.html` styled as a button gets the green style automatically.
  - **Where the buttons are.** The button lives in the header on every page, next to the yellow one. On tablets and phones turned sideways, both sit beside the ☰ menu icon; on phones held upright, they're in the bottom bar. The phone number isn't in the header: it's in the footer and on the contact page. Beyond that, each page has just one closing "Book your free consultation" banner, and the homepage also has its hero button. Program cards use a quiet "Ask about this program →" link instead of another button. Please keep it this way rather than adding more buttons.
  - **Glow.** Only the homepage hero, the closing banner, the phone bar and the booking form's submit button glow. Edit the `.btn-cta` section of `styles.css` to change this.
- **Fonts.** These load from Google Fonts in each page's `<head>`, and the CSS variables live in `:root`:
  - *Instrument Serif* (`--font-display`) for headlines, numbers and quotes
  - *Instrument Sans* (`--font`) for body text and buttons
  - *JetBrains Mono* (`--font-mono`) for small labels, course codes and clocks
  - *Caveat* for the whiteboard handwriting
- **World clocks.** Edit the `data-tz` values (IANA names like `Europe/London`) in `index.html` and `contact.html`.
- **Business name.** Find & Replace `Academy of Academic Distinction` and `AAD` across files. The logo is `assets/img/logo.svg`, the tab icon is `assets/img/favicon.svg`, and the header mark is the `brand-mark` span.

## Accessibility & motion

- **Reduce motion.** Visitors with "reduce motion" turned on see a calm, still page: the slideshow doesn't auto-advance and every animation shows its finished state.
- **Hero slideshow.** It pauses on hover or focus, has a pause button, and responds to arrow keys and swipes.
- **Battery.** Animations pause while off-screen.

## Deploy to GitHub Pages

The site lives in the repo **aadteaching/aadteaching.github.io** and is published at **<https://aadteaching.github.io/>**.

**First upload** (run once, in a terminal in this folder):

```bash
git init -b main
git config user.name "aadteaching"
git config user.email "aadteaching@gmail.com"
git remote add origin https://aadteaching@github.com/aadteaching/aadteaching.github.io.git
git fetch origin
git reset --soft origin/main
git add -A
git commit -m "Launch website"
git push -u origin main
```

- The two `git config` lines (without `--global`) make commits in this repo show the business name and email instead of your personal ones.
- `aadteaching@` in the remote URL makes Git sign in as the business account, even if this computer is already signed in to another GitHub account.
- `fetch` and `reset --soft` build on the README commit GitHub created, so no force-push is needed.

Then, on GitHub, open **Settings → Pages**. Check that *Source* is **Deploy from a branch**, with branch **main** and folder **/(root)**. The site goes live within a minute or two (progress shows under the **Actions** tab).

**Every later update:**

```bash
git add -A
git commit -m "Describe the change"
git push
```

**Custom domain.** Add it under Settings → Pages → Custom domain, point your DNS as GitHub instructs, and tick **Enforce HTTPS**.

## Before you launch: checklist

- [ ] Replace the **sample testimonials** with real reviews, used with permission.
- [ ] **Activate the forms** and send yourself a test from each one ([EMAIL-FORMS-SETUP.md](EMAIL-FORMS-SETUP.md)).
- [ ] Confirm the **founder credentials** and the "200+ families" and "10+ teachers" claims.
- [ ] Swap in **real team photos** where you can.
- [ ] Confirm that the **business name and domain** are available.
