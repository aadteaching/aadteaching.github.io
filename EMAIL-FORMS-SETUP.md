# Get the website forms delivered to aadteaching@gmail.com

All three forms already send to **aadteaching@gmail.com** through [FormSubmit](https://formsubmit.co), a free service that needs no account:

- Free consultation (`book.html`)
- Urgent booking (`book-now.html`)
- Contact (`contact.html`)

FormSubmit only needs to be **switched on once**, from the live site. That takes about 5 minutes.

## 1. Publish the latest version

In VS Code, open a terminal in the project folder and run:

```bash
git add -A
git commit -m "AAD name, forms send to email"
git push
```

The site updates in about 2 minutes (GitHub's **Actions** tab shows when it's done). Then open <https://aadteaching.github.io/> and press **Ctrl+F5** so your browser loads the new version.

## 2. Activate the forms (once)

1. Go to **<https://aadteaching.github.io/contact.html>**. Use the live site, not the copy on your computer.
2. Send a message with your own name and email. The page may say it didn't go through. That's expected before activation.
3. Open **aadteaching@gmail.com** and find the email from **FormSubmit** asking you to activate the form. If it isn't in the inbox, check **Spam** and **Promotions**.
4. Click **Activate Form**.

## 3. Test all three forms

Send one test from each page:

- <https://aadteaching.github.io/contact.html>
- <https://aadteaching.github.io/book.html>
- <https://aadteaching.github.io/book-now.html>

Each should:

- **On the page:** show a thank-you screen ("Request sent. We're on it." / "Thank you. We've got it."). It should **not** say "Your email app should have opened".
- **In your inbox:** deliver an email within a minute or two.

If any page sends you another activation email instead, click **Activate Form** in that one too, then test it again.

Finally, reply to one of the test emails. The reply should go to the email address typed into the form.

## 4. Keep them out of Spam (recommended)

In Gmail:

1. Type `from:formsubmit.co` in the search box.
2. Click the **Show search options** icon at the right end of the box.
3. Click **Create filter**.
4. Tick **Never send it to Spam**. Optionally also tick **Star it** or **Apply the label** (e.g. "Website").
5. Click **Create filter**.

## What you'll receive

| Form | Email subject |
|---|---|
| Urgent booking | `URGENT session request — Physics, Mathematics — Thu, Oct 22, 9:00 AM – 10:00 AM EDT — Jane` |
| Free consultation | `New consultation request — Jane Smith` |
| Contact | `Website enquiry — Sam` |

- **What's in each email:** every field the visitor filled in, laid out as a table. Urgent requests include the time in Eastern **and** in the visitor's own time zone.
- **Replying:** press **Reply** to answer them directly.
- **No email address:** some urgent requests only give a cell number. Text them.
- **Nothing is booked automatically.** You confirm each request yourself.

## If something goes wrong

- **Visitors would see "didn't go through"** if the forms aren't activated yet or FormSubmit is down. Their request isn't lost: they get a pre-filled **"Send it from your email app instead"** link and your phone number.
- **Nothing arrives:**
  1. Check Spam.
  2. Check that `assets/js/config.js` contains `formEndpoint: "https://formsubmit.co/ajax/aadteaching@gmail.com"`.
  3. Press Ctrl+F5 on the live site.

## Optional extras

**Hide your address from spam bots.** After activation, FormSubmit emails you a random string (a long mix of letters and numbers). You can put it in `assets/js/config.js` in place of your address, then push again:

```js
formEndpoint: "https://formsubmit.co/ajax/YOUR-RANDOM-STRING",
```

**Switch to Formspree.** FormSubmit is free with no guarantees. If you later want a dashboard with a saved copy of every submission:

1. Sign up at [formspree.io](https://formspree.io) with aadteaching@gmail.com.
2. Create a new form and copy its endpoint (it looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `formEndpoint` in `assets/js/config.js` and push.
4. Send a test, then confirm the first submission when Formspree asks.

The site works with either service. Formspree's free plan has a monthly submission limit.

**Privacy.** Submissions pass through the form service's servers on the way to your inbox. That's normal for any form on a static site like this one.
