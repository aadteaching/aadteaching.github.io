# Get the website forms delivered to aadteaching@gmail.com

The site has three forms:

- Free consultation (`book.html`)
- Urgent booking (`book-now.html`)
- Contact (`contact.html`)

They email each submission to **aadteaching@gmail.com** using two free services:

1. **Web3Forms**: the main one. It needs an *access key*, which you get with a free sign-up using just your email.
2. **FormSubmit**: the backup. It's only used if Web3Forms fails.

If both fail, the visitor gets a pre-filled **"Send it from your email app instead"** link plus your phone number, so no request is lost.

## 1. Get your Web3Forms access key (about 3 minutes)

1. Go to **<https://web3forms.com>** and click **Create your form** (free).
2. Sign up with **aadteaching@gmail.com** and verify the address. Web3Forms emails you a link or code; check **Spam** and **Promotions** if it's not in the inbox.
3. Create a form (any name, e.g. "AAD website"), with submissions going to **aadteaching@gmail.com**.
4. Copy the form's **access key**. It's a long code like `1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d`.

This key is meant to sit in the website's code, so it's fine for it to be public.

## 2. Put the key on the site

Open `assets/js/config.js` and paste the key between the quotes:

```js
web3formsKey: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
```

Then publish:

```bash
git add -A
git commit -m "Connect forms to Web3Forms"
git push
```

You can also just send the key to Claude and ask it to add the key and push.

The site updates in about 2 minutes. Then press **Ctrl+F5** on <https://aadteaching.github.io/> to load the new version.

## 3. Test all three forms

Send one test from each page:

- <https://aadteaching.github.io/contact.html>
- <https://aadteaching.github.io/book.html>
- <https://aadteaching.github.io/book-now.html>

Each should:

- **On the page:** show a thank-you screen ("Request sent. We're on it." / "Thank you. We've got it.").
- **In your inbox:** deliver an email within a minute.

Reply to one test email. The reply should go to the address typed into the form.

## 4. Keep them out of Spam (recommended)

In Gmail:

1. Search for `from:web3forms.com OR from:formsubmit.co`.
2. Click **Show search options** (right end of the search box), then **Create filter**.
3. Tick **Never send it to Spam** (optionally **Star it** or a label such as "Website").
4. Click **Create filter**.

## The backup (FormSubmit)

FormSubmit was down when this was set up (error 521). When it's back, click **Activate Form** in its email ("Action Required: Activate FormSubmit on https://aadteaching.github.io/"). That switches the backup on.

If the link no longer works, nothing is lost. The next time Web3Forms fails and FormSubmit is used, FormSubmit sends a new activation email.

The backup already uses the private code from that email (`d2509a362eae0e62024949ccc756d8cd`) instead of your address, so spam bots can't read your email from the form.

## What you'll receive

| Form | Email subject |
|---|---|
| Urgent booking | `URGENT session request — Mathematics, Physics — Thu, Oct 29, 9:00 AM – 10:00 AM EDT` |
| Free consultation | `New consultation request — Jane Smith` |
| Contact | `Website enquiry — Sam` |

- **Contents:** every field the visitor filled in. Urgent requests include the time in Eastern **and** in the visitor's own time zone.
- **Replying:** press **Reply** to answer them directly. Some urgent requests give only a cell number; text those.
- **Booking:** nothing is booked automatically. You confirm each request yourself.

## If something goes wrong

- **Visitors see "didn't go through":** both services failed (or the Web3Forms key is missing or mistyped). Check the key in `config.js`, then press Ctrl+F5 and test again.
- **Nothing arrives:** check Spam.
- **Want a dashboard with a saved copy of every submission?** Formspree can replace the backup:
  1. Sign up at [formspree.io](https://formspree.io).
  2. Create a form.
  3. Paste its link (`https://formspree.io/f/…`) into `formEndpoint` in `config.js`.

Submissions pass through the form service's servers on the way to your inbox. That's normal for forms on a static site.
