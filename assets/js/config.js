/* =========================================================
   SITE SETTINGS — edit this file to update contact details
   everywhere on the site at once.

   Anything left as "" (empty) is hidden automatically
   (e.g. clear the email and every email link disappears;
   a social icon with no link won't appear).
   ========================================================= */
window.SITE_CONFIG = {
  brand: "AAD: Academy of Academic Distinction",

  // Contact
  phone: "(647) 821-8290",            // cell: call or text. The tap-to-call link is built from it.
  email: "aadteaching@gmail.com",
  textLine: "",                        // optional separate SMS / WhatsApp number
  location: "Toronto, Canada",         // shown as "Based in ..." on the contact page
  serviceArea: "Live online · Students worldwide",

  // Office hours (left = days, right = time) and the time zone they're in
  hoursNote: "Eastern Time (Toronto)",
  hours: [
    ["Monday – Friday", "9:00 AM – 9:00 PM"],
    ["Saturday", "9:00 AM – 6:00 PM"],
    ["Sunday", "Sessions by appointment"]
  ],

  // FORMS — the three forms (consultation, urgent booking, contact) are emailed to you.
  // See EMAIL-FORMS-SETUP.md.
  // 1. Main: Web3Forms. Paste your form's access key (free sign-up at web3forms.com).
  web3formsKey: "cbc92521-c091-4436-8a47-a434d973254f",
  // 2. Backup, used only if the main one fails: FormSubmit (your private code from its
  //    activation email) or a Formspree link ("https://formspree.io/f/abcdwxyz").
  // If both are "" or both fail, visitors get a pre-filled "send from your email app" link.
  formEndpoint: "https://formsubmit.co/ajax/d2509a362eae0e62024949ccc756d8cd",

  // BOOKING — optional. Paste your Calendly (or Cal.com) link to show a live
  // calendar on the booking page, e.g. "https://calendly.com/your-name/free-consultation".
  calendlyUrl: "",

  // URGENT BOOKING — the yellow "Urgently Book Now!" button (book-now.html).
  // Visitors pick a time inside these hours, in their own time zone. Nothing is
  // booked automatically: you get the request and confirm by email or text.
  urgent: {
    timeZone: "America/Toronto",      // YOUR time zone (the hours below are in it)
    // Hours you'll take urgent sessions, 24-hour clock. 0 = Sunday … 6 = Saturday.
    // Delete a day to close it, e.g. remove 0 to never offer Sundays.
    hours: {
      0: ["12:00", "18:00"],
      1: ["09:00", "21:00"],
      2: ["09:00", "21:00"],
      3: ["09:00", "21:00"],
      4: ["09:00", "21:00"],
      5: ["09:00", "21:00"],
      6: ["09:00", "18:00"]
    },
    minNoticeHours: 2,                // earliest bookable start = now + this many hours
    daysAhead: 14,                    // how many days ahead people can pick
    slotMinutes: 30,                  // start times every 30 minutes
    durations: [30, 60, 90, 120],     // session lengths offered, in minutes
    blockedDates: [],                 // days you're away, in YOUR time zone, e.g. ["2026-12-25", "2026-12-26"]
    replyPromise: "within 2 hours during office hours",

    // LIVE AVAILABILITY (optional) — connect the instructor's Google Calendar so
    // only free times are offered. Leave calendarId or apiKey empty to use the
    // usual hours above. Setup steps are in README.md ("Connect Google Calendar").
    googleCalendar: {
      calendarId: "",      // e.g. "yourname@gmail.com" or "abc123@group.calendar.google.com"
      apiKey: "",          // a Google API key restricted to your website
      mode: "busy",        // "busy": hide times that clash with events (your normal calendar)
                           // "available": ONLY offer times inside events on an availability calendar
      bufferMinutes: 15    // breathing room kept before and after existing events ("busy" mode)
    }
  },

  // Social links ("" hides the icon)
  social: {
    instagram: "",
    linkedin: "",
    youtube: "",
    facebook: ""
  }
};
