/* =========================================================
   ADD: Academy of Academic Distinction — site behaviour
   Settings live in config.js; you shouldn't need to edit this.
   ========================================================= */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function cfg(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, C);
  }

  function telHref(num) {
    var digits = String(num).replace(/[^\d+]/g, "");
    if (digits.charAt(0) !== "+" && digits.length === 10) digits = "+1" + digits;
    return "tel:" + digits;
  }

  /* ---------- Fill in contact details from config.js ---------- */
  $$("[data-config]").forEach(function (el) {
    var v = cfg(el.getAttribute("data-config"));
    if (v) el.textContent = v;
  });

  $$("[data-config-href]").forEach(function (el) {
    var key = el.getAttribute("data-config-href");
    var v = cfg(key);
    if (!v) return;
    if (key === "email") el.href = "mailto:" + v;
    else if (key === "phone" || key === "textLine") el.href = telHref(v);
    else el.href = v;
  });

  $$("[data-show-if]").forEach(function (el) {
    if (!cfg(el.getAttribute("data-show-if"))) el.hidden = true;
  });

  $$("[data-config-hours]").forEach(function (list) {
    if (!Array.isArray(C.hours) || !C.hours.length) return;
    list.innerHTML = "";
    C.hours.forEach(function (row) {
      var li = document.createElement("li");
      var a = document.createElement("span");
      var b = document.createElement("span");
      a.textContent = row[0];
      b.textContent = row[1];
      li.appendChild(a);
      li.appendChild(b);
      list.appendChild(li);
    });
  });

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = $(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = $(".nav-toggle", header);
    var setOpen = function (open) {
      header.classList.toggle("nav-open", open);
      if (toggle) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
    };
    if (toggle) {
      toggle.addEventListener("click", function () { setOpen(!header.classList.contains("nav-open")); });
      $$(".nav a", header).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
      window.addEventListener("resize", function () { if (window.innerWidth > 1060) setOpen(false); });
    }
  }

  if ($(".mobile-cta")) document.body.classList.add("has-mobile-cta");

  /* ---------- Reveal on scroll ---------- */
  // Once an element has faded in, its reveal classes are removed so the reveal
  // transform no longer overrides hover effects or a card's own positioning.
  function reveal(el) {
    el.classList.add("is-visible");
    setTimeout(function () {
      el.classList.remove("reveal", "reveal-d1", "reveal-d2", "reveal-d3", "is-visible");
    }, 1200);
  }
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          reveal(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(reveal);
  }
  // Never print a page with sections still hidden.
  window.addEventListener("beforeprint", function () {
    $$(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  });

  /* ---------- Scroll-spy navs (subjects, FAQ) ---------- */
  $$("[data-spy]").forEach(function (nav) {
    if (!("IntersectionObserver" in window)) return;
    var links = $$('a[href^="#"]', nav);
    var pairs = [];
    links.forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) pairs.push([target, link]);
    });
    var scroller = $(".subnav-list", nav);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        pairs.forEach(function (p) {
          var active = p[0] === en.target;
          p[1].classList.toggle("is-active", active);
          if (active && scroller && scroller.scrollWidth > scroller.clientWidth) {
            scroller.scrollTo({ left: p[1].offsetLeft - scroller.clientWidth / 2 + p[1].offsetWidth / 2, behavior: "smooth" });
          }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    pairs.forEach(function (p) { spy.observe(p[0]); });
  });

  /* ---------- Filter buttons (results page) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var target = $(group.getAttribute("data-filter-group"));
    if (!target) return;
    var buttons = $$("[data-filter]", group);
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        $$("[data-filter-item]", target).forEach(function (item) {
          var cats = item.getAttribute("data-filter-item").split(" ");
          item.hidden = f !== "all" && cats.indexOf(f) === -1;
        });
      });
    });
  });

  /* ---------- FAQ search ---------- */
  var faqSearch = $("[data-faq-search]");
  if (faqSearch) {
    var faqItems = $$(".faq-item");
    var faqGroups = $$(".faq-group");
    var faqEmpty = $(".faq-empty");
    faqSearch.addEventListener("input", function () {
      var q = faqSearch.value.trim().toLowerCase();
      var any = false;
      faqItems.forEach(function (item) {
        var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
        item.hidden = !match;
        if (match) any = true;
      });
      faqGroups.forEach(function (g) { g.hidden = !$(".faq-item:not([hidden])", g); });
      if (faqEmpty) faqEmpty.classList.toggle("is-visible", !any);
    });
  }

  /* ---------- Time zone auto-detect (booking form) ---------- */
  $$('[data-autofill="timezone"]').forEach(function (input) {
    if (input.value) return;
    try {
      var zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      var abbr = "";
      if (Intl.DateTimeFormat.prototype.formatToParts) {
        var part = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(new Date())
          .filter(function (p) { return p.type === "timeZoneName"; })[0];
        abbr = part ? part.value : "";
      }
      if (zone) input.value = zone.replace(/_/g, " ") + (abbr ? " (" + abbr + ")" : "");
    } catch (e) { /* leave it for the visitor to type */ }
  });

  /* ---------- Optional Calendly embed (booking page) ---------- */
  var cal = $("[data-calendly]");
  if (cal && C.calendlyUrl) {
    var calFrame = $("iframe", cal);
    var sep = C.calendlyUrl.indexOf("?") === -1 ? "?" : "&";
    calFrame.src = C.calendlyUrl + sep + "hide_gdpr_banner=1&embed_type=Inline&embed_domain=" + encodeURIComponent(location.hostname || "localhost");
    cal.classList.add("is-visible");
    $$("[data-calendly-link]").forEach(function (el) { el.hidden = false; });
  }

  /* ---------- Forms ---------- */
  function validateScope(scope) {
    var fields = $$("input, select, textarea", scope);
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f.closest(".hp-field")) continue;
      if (!f.checkValidity()) { f.reportValidity(); f.focus(); return false; }
    }
    var groups = $$("[data-require-one]", scope);
    for (var j = 0; j < groups.length; j++) {
      var g = groups[j];
      var err = g.parentNode.querySelector(".field-error");
      if (!$("input:checked", g)) {
        if (err) err.classList.add("is-visible");
        var first = $("input", g);
        if (first) first.focus();
        return false;
      }
      if (err) err.classList.remove("is-visible");
    }
    var anyGroups = $$("[data-require-any]", scope);
    for (var k = 0; k < anyGroups.length; k++) {
      var ag = anyGroups[k], aerr = ag.parentNode.querySelector(".field-error");
      var filled = $$("input", ag).some(function (inp) { return inp.value.trim() !== ""; });
      if (!filled) {
        if (aerr) aerr.classList.add("is-visible");
        $("input", ag).focus();
        return false;
      }
      if (aerr) aerr.classList.remove("is-visible");
    }
    return true;
  }

  // Hide an "email or cell" message as soon as either is typed.
  $$("[data-require-any]").forEach(function (g) {
    g.addEventListener("input", function () {
      var err = g.parentNode.querySelector(".field-error");
      if (err && $$("input", g).some(function (i) { return i.value.trim() !== ""; })) err.classList.remove("is-visible");
    });
  });

  // Hide a group's "pick at least one" message as soon as something is picked.
  $$("[data-require-one]").forEach(function (g) {
    g.addEventListener("change", function () {
      var err = g.parentNode.querySelector(".field-error");
      if (err && $("input:checked", g)) err.classList.remove("is-visible");
    });
  });

  function initStepper(form) {
    var steps = $$(".form-step", form);
    if (steps.length < 2) return null;
    var progress = $$(".form-progress li", form);
    var current = 0;
    function show(i, focus) {
      current = Math.max(0, Math.min(i, steps.length - 1));
      steps.forEach(function (s, k) { s.hidden = k !== current; });
      progress.forEach(function (p, k) {
        p.classList.toggle("is-active", k === current);
        p.classList.toggle("is-done", k < current);
      });
      if (focus) {
        var top = form.getBoundingClientRect().top + window.scrollY - 110;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
        var firstField = $("input:not([type=hidden]), select, textarea", steps[current]);
        if (firstField) firstField.focus({ preventScroll: true });
      }
    }
    form.addEventListener("click", function (e) {
      if (e.target.closest("[data-step-next]")) {
        e.preventDefault();
        if (validateScope(steps[current])) show(current + 1, true);
      } else if (e.target.closest("[data-step-prev]")) {
        e.preventDefault();
        show(current - 1, true);
      }
    });
    show(0, false);
    return { steps: steps, show: show, current: function () { return current; } };
  }

  function prefill(form) {
    var params = new URLSearchParams(location.search);
    params.forEach(function (value, key) {
      var v = value.toLowerCase();
      $$('[data-prefill="' + key + '"]', form).forEach(function (el) {
        if (el.type === "checkbox" || el.type === "radio") {
          if (el.value.toLowerCase() === v) el.checked = true;
        } else if (el.tagName === "SELECT") {
          Array.prototype.forEach.call(el.options, function (o) {
            if (o.value.toLowerCase() === v || o.text.toLowerCase() === v) el.value = o.value;
          });
        } else {
          el.value = value;
        }
      });
    });
  }

  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (key.charAt(0) === "_") return;
      value = String(value).trim();
      if (!value) return;
      data[key] = data[key] ? data[key] + ", " + value : value;
    });
    return data;
  }

  function showSuccess(form, viaEmailApp) {
    var ok = $(".form-success", form);
    if (!ok) return;
    $$("[data-success-sent]", ok).forEach(function (el) { el.hidden = !!viaEmailApp; });
    $$("[data-success-mailto]", ok).forEach(function (el) { el.hidden = !viaEmailApp; });
    form.classList.add("is-sent");
    ok.classList.add("is-visible");
    var top = form.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  $$("form[data-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    var stepper = initStepper(form);
    prefill(form);
    var errorBox = $(".form-error", form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorBox) errorBox.classList.remove("is-visible");

      if (stepper) {
        var cur = stepper.current();
        if (cur < stepper.steps.length - 1) {
          if (validateScope(stepper.steps[cur])) stepper.show(cur + 1, true);
          return;
        }
        for (var i = 0; i < stepper.steps.length; i++) {
          stepper.show(i, false);
          if (!validateScope(stepper.steps[i])) return;
        }
        stepper.show(stepper.steps.length - 1, false);
      } else if (!validateScope(form)) {
        return;
      }

      var trap = $('[name="_gotcha"]', form);
      if (trap && trap.value) return; // bot

      var data = collect(form);
      var who = data["Parent / guardian name"] || data["Name"] || data["Your name"] || "";
      var subject = (form.getAttribute("data-subject") || "Website enquiry") + (who ? " — " + who : "");

      if (C.formEndpoint) {
        var btn = $('[type="submit"]', form);
        var label = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
        var payload = Object.assign({ _subject: subject }, data);
        if (data.email) payload._replyto = data.email;
        fetch(C.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          showSuccess(form, false);
        }).catch(function () {
          if (errorBox) errorBox.classList.add("is-visible");
        }).then(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
        });
      } else {
        var lines = Object.keys(data).map(function (k) {
          return k.charAt(0).toUpperCase() + k.slice(1) + ": " + data[k];
        });
        window.location.href = "mailto:" + (C.email || "") +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\n"));
        showSuccess(form, true);
      }
    });
  });

  /* =========================================================
     Motion & interactive illustrations
     ========================================================= */
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var hasIO = "IntersectionObserver" in window;
  var fmt = function (v) { return Math.round(v).toLocaleString("en-US"); };
  var ease = function (p) { return 1 - Math.pow(1 - p, 3); };

  /* ---------- Scroll progress bar ---------- */
  var progress = $(".scroll-progress span");
  if (progress) {
    var progTick = false;
    var progUpdate = function () {
      progTick = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    };
    window.addEventListener("scroll", function () { if (!progTick) { progTick = true; requestAnimationFrame(progUpdate); } }, { passive: true });
    window.addEventListener("resize", progUpdate);
    progUpdate();
  }

  /* ---------- In-view triggers + pause when off-screen ---------- */
  var animated = $$("[data-animate]");
  var pausable = animated.concat($$(".marquee, .hero-slider"));
  // With reduced motion there is nothing to animate in, so show everything in its finished state.
  if (reduceMotion) animated.forEach(function (el) { el.classList.add("in-view"); });
  if (hasIO) {
    var trigger = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in-view"); trigger.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    animated.forEach(function (el) { trigger.observe(el); });

    var pauser = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var off = !en.isIntersecting;
        en.target.classList.toggle("is-offscreen", off);
        $$("svg", en.target).forEach(function (s) {
          if (!s.pauseAnimations || reduceMotion) return;
          if (off) s.pauseAnimations(); else s.unpauseAnimations();
        });
      });
    }, { rootMargin: "120px 0px" });
    pausable.forEach(function (el) { pauser.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add("in-view"); });
  }
  if (reduceMotion) $$("svg").forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count")), from = parseFloat(el.getAttribute("data-from") || "0"), t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1700);
      el.textContent = fmt(from + (to - from) * ease(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if (!reduceMotion && hasIO && counters.length) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countIO.unobserve(en.target); countUp(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = fmt(parseFloat(el.getAttribute("data-from") || "0")); countIO.observe(el); });
  }

  /* ---------- Session timer in the classroom mock-up ---------- */
  $$("[data-session-timer]").forEach(function (el) {
    if (reduceMotion) return;
    var parts = el.textContent.split(":"), secs = (+parts[0]) * 60 + (+parts[1]);
    setInterval(function () { secs++; el.textContent = Math.floor(secs / 60) + ":" + ("0" + (secs % 60)).slice(-2); }, 1000);
  });

  /* ---------- Live world clocks ---------- */
  var clocks = $$("[data-tz]");
  if (clocks.length && window.Intl) {
    var tickClocks = function () {
      var now = new Date();
      clocks.forEach(function (c) {
        try {
          var tz = c.getAttribute("data-tz");
          var time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(now);
          var hour = parseInt(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: tz }).format(now), 10);
          $(".clock-time", c).textContent = time;
          c.classList.toggle("is-night", hour < 7 || hour >= 19);
        } catch (e) { /* unknown zone: leave the placeholder */ }
      });
    };
    tickClocks();
    setInterval(tickClocks, 15000);
  }

  /* ---------- Knowledge graph: memorized vs understood ---------- */
  $$("[data-kg]").forEach(function (kg) {
    var buttons = $$("[data-kg-mode]", kg), touched = false;
    var setMode = function (mode) {
      kg.classList.toggle("is-understood", mode === "understood");
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-kg-mode") === mode ? "true" : "false"); });
    };
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { touched = true; setMode(b.getAttribute("data-kg-mode")); });
    });
    if (reduceMotion || !hasIO) { setMode("understood"); return; }
    setMode("memorized");
    var kio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      kio.disconnect();
      setTimeout(function () { if (!touched) setMode("understood"); }, 1500);
    }, { threshold: 0.45 });
    kio.observe(kg);
  });

  /* ---------- Testimonial carousel ---------- */
  $$("[data-carousel]").forEach(function (car) {
    var slides = $$(".tslide", car), dotsBox = $(".tcar-dots", car);
    if (slides.length < 2 || !dotsBox) return;
    var index = 0, timer = null, hover = false, onScreen = true, dots = [];
    slides.forEach(function (s, k) {
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", (k + 1) + " of " + slides.length);
      var b = document.createElement("button");
      b.type = "button"; b.className = "tcar-dot"; b.setAttribute("aria-label", "Show review " + (k + 1));
      b.addEventListener("click", function () { show(k, true); });
      dotsBox.appendChild(b); dots.push(b);
    });
    function show(k, byUser) {
      index = (k + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === index;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
        if ("inert" in s) s.inert = !on;
      });
      dots.forEach(function (d, n) { d.setAttribute("aria-current", n === index ? "true" : "false"); });
      if (byUser) restart();
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { if (!hover && onScreen && !document.hidden) show(index + 1); }, 7000);
    }
    var prev = $("[data-car-prev]", car), next = $("[data-car-next]", car);
    if (prev) prev.addEventListener("click", function () { show(index - 1, true); });
    if (next) next.addEventListener("click", function () { show(index + 1, true); });
    car.addEventListener("mouseenter", function () { hover = true; });
    car.addEventListener("mouseleave", function () { hover = false; });
    car.addEventListener("focusin", function () { hover = true; });
    car.addEventListener("focusout", function () { hover = false; });
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1, true);
      if (e.key === "ArrowRight") show(index + 1, true);
    });
    var startX = null;
    car.addEventListener("pointerdown", function (e) { startX = e.clientX; });
    car.addEventListener("pointerup", function (e) {
      if (startX !== null && Math.abs(e.clientX - startX) > 45) show(index + (e.clientX < startX ? 1 : -1), true);
      startX = null;
    });
    if (hasIO) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; }).observe(car);
    show(0);
    restart();
  });

  /* ---------- Rotating photo stacks & collages ----------
     Photos after the first are only downloaded just before they're shown.
     A rotator waits while it's off-screen, while the tab is hidden, or while
     its hero slide isn't the active one. With "reduce motion" it stays still. */
  $$("[data-rotator]").forEach(function (r) {
    var imgs = Array.prototype.filter.call(r.children, function (n) { return n.tagName === "IMG"; });
    if (imgs.length < 2 || reduceMotion) return;
    var idx = 0, busy = false, visible = !hasIO, started = false;
    var every = +(r.getAttribute("data-interval") || 5200), delay = +(r.getAttribute("data-delay") || 0);
    var slide = r.closest(".hs-slide");
    var load = function (img) {
      var s = img.getAttribute("data-src");
      if (!s) return;
      var ss = img.getAttribute("data-srcset");
      if (ss) img.setAttribute("srcset", ss);
      img.setAttribute("src", s);
      img.removeAttribute("data-src");
      img.removeAttribute("data-srcset");
    };
    var advance = function () {
      if (busy || !visible || document.hidden || (slide && !slide.classList.contains("is-active"))) return;
      var k = (idx + 1) % imgs.length, next = imgs[k];
      busy = true;
      load(next);
      var swap = function () {
        imgs[idx].classList.remove("is-on");
        next.classList.add("is-on");
        idx = k;
        busy = false;
        load(imgs[(k + 1) % imgs.length]);
      };
      if (next.complete && next.naturalWidth) swap();
      else {
        next.addEventListener("load", swap, { once: true });
        next.addEventListener("error", function () { idx = k; busy = false; }, { once: true });
      }
    };
    var start = function () {
      if (started) return;
      started = true;
      load(imgs[1]);
      setTimeout(function () { advance(); setInterval(advance, every); }, every - 1200 + delay);
    };
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }, { rootMargin: "100px 0px" }).observe(r);
    } else {
      start();
    }
  });

  /* ---------- Home hero slider ----------
     Each progress pill's fill animation (CSS) times its slide; when it ends we
     advance. Hover, focus, the pause button, being off-screen and "reduce
     motion" all simply pause or remove that animation. */
  $$("[data-hero]").forEach(function (hero) {
    var slides = $$(".hs-slide", hero), dotsBox = $(".hs-dots", hero), pauseBtn = $("[data-hs-pause]", hero);
    if (slides.length < 2 || !dotsBox) return;
    var index = 0, dots = [], userPaused = false, hovering = false;
    slides.forEach(function (s, k) {
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", (k + 1) + " of " + slides.length);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "hs-dot";
      b.setAttribute("aria-label", "Show slide " + (k + 1));
      b.innerHTML = '<span class="hs-fill"></span>';
      b.addEventListener("click", function () { show(k); });
      b.firstChild.addEventListener("animationend", function () {
        if (b.getAttribute("aria-current") === "true") show(index + 1);
      });
      dotsBox.appendChild(b);
      dots.push(b);
    });
    function show(k) {
      index = (k + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === index;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
        if ("inert" in s) s.inert = !on;
      });
      dots.forEach(function (d) { d.setAttribute("aria-current", "false"); });
      void dotsBox.offsetWidth; // restart the progress animation
      dots[index].setAttribute("aria-current", "true");
    }
    function sync() {
      hero.classList.toggle("is-paused", userPaused || hovering);
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
        pauseBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
      }
    }
    hero.addEventListener("mouseenter", function () { hovering = true; sync(); });
    hero.addEventListener("mouseleave", function () { hovering = false; sync(); });
    hero.addEventListener("focusin", function () { hovering = true; sync(); });
    hero.addEventListener("focusout", function () { hovering = false; sync(); });
    if (pauseBtn) pauseBtn.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    hero.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    var startX = null;
    hero.addEventListener("pointerdown", function (e) { startX = e.clientX; });
    hero.addEventListener("pointerup", function (e) {
      if (startX !== null && Math.abs(e.clientX - startX) > 50) show(index + (e.clientX < startX ? 1 : -1));
      startX = null;
    });
    show(0);
    sync();
  });
  /* ---------- Urgent booking (book-now.html) ----------
     A 4-step, Calendly-style flow: subjects -> length -> day & time -> contact.
     Days and times are always shown in the instructor's time zone (config
     urgent.timeZone, Eastern Time by default). If the visitor's device is in a
     different zone, their local time is shown underneath for clarity.
     Which times are open comes from config.urgent: usual hours minus a notice
     period, and optionally the instructor's Google Calendar (busy times hidden,
     or only "available" blocks offered). Every slot is an exact instant, so
     daylight-saving changes are handled. Nothing is booked automatically: the
     request is emailed and the instructor confirms. */
  $$("form[data-urgent]").forEach(function (form) {
    var U = C.urgent || {};
    var OWNER_TZ = U.timeZone || "America/Toronto";
    var HOURS = U.hours || {};
    var NOTICE = (U.minNoticeHours == null ? 2 : +U.minNoticeHours) * 3600000;
    var DAYS = +U.daysAhead || 14;
    var STEP = +U.slotMinutes || 30;
    var DURATIONS = U.durations && U.durations.length ? U.durations : [30, 60, 90, 120];
    var BLOCKED = U.blockedDates || [];
    var GC = U.googleCalendar || {};
    var BUFFER = (+GC.bufferMinutes || 0) * 60000;
    var LOCALE = "en-US";
    var HINTS = { 30: "A quick question", 45: "Short and focused", 60: "Most popular", 90: "Deep dive", 120: "Exam cram" };

    var q = function (s) { return $(s, form); };
    var steps = $$(".wz-step", form), dots = $$(".wz-dots li", form);
    var backBtn = q("[data-back]"), countEl = q("[data-step-count]"), contBtn = q("[data-continue]");
    var tzSelect = q("[data-tz-select]"), grid = q("[data-cal-grid]"), monthEl = q("[data-cal-month]");
    var timesEl = q("[data-times]"), timesDay = q("[data-times-day]"), timesEmpty = q("[data-times-empty]"), legend = q("[data-times-legend]");
    var soonBox = q("[data-soonest]"), soonList = q("[data-soonest-list]");
    var loadingEl = q("[data-cal-loading]"), statusEl = q("[data-cal-status]"), statusText = q("[data-cal-text]");

    var state = { step: 1, subjects: [], mins: 0, day: null, slot: null, view: null };
    var cal = { mode: "hours", busy: [], open: [] }; // mode: hours | loading | live | fallback

    /* --- time-zone helpers (no libraries) --- */
    var fmtCache = {};
    function fmt(tz, opts) {
      var key = tz + JSON.stringify(opts);
      return fmtCache[key] || (fmtCache[key] = new Intl.DateTimeFormat(LOCALE, Object.assign({ timeZone: tz }, opts)));
    }
    function parts(date, tz) {
      var o = {};
      fmt(tz, { hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short" })
        .formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
      return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute,
               wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday) };
    }
    function offsetMin(date, tz) {
      var p = parts(date, tz);
      return (Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - Math.floor(date.getTime() / 60000) * 60000) / 60000;
    }
    function zoned(y, m, d, h, min, tz) { // wall-clock time in a zone -> exact instant
      var guess = Date.UTC(y, m - 1, d, h, min);
      var t = guess - offsetMin(new Date(guess), tz) * 60000;
      return new Date(guess - offsetMin(new Date(t), tz) * 60000);
    }
    function ymd(p) { return p.y + "-" + ("0" + p.m).slice(-2) + "-" + ("0" + p.d).slice(-2); }
    function dayKey(d) { return d.y + "-" + d.m + "-" + d.d; }
    function toMin(s) { var a = String(s).split(":"); return (+a[0]) * 60 + (+a[1] || 0); }
    function durLabel(m) { return m < 60 ? m + " min" : m === 60 ? "1 hour" : (m / 60) + " hours"; }
    function durShort(m) { return m < 60 ? m + "<small>min</small>" : (m / 60) + "<small>" + (m === 60 ? "hour" : "hours") + "</small>"; }
    function timeStr(date, tz) { return fmt(tz, { hour: "numeric", minute: "2-digit" }).format(date); }
    function dayStr(date, tz) { return fmt(tz, { weekday: "short", month: "short", day: "numeric" }).format(date); }
    function longDay(date, tz) { return fmt(tz, { weekday: "long", month: "long", day: "numeric" }).format(date); }
    function zoneAbbr(date, tz) {
      var p = fmt(tz, { timeZoneName: "short" }).formatToParts(date).filter(function (x) { return x.type === "timeZoneName"; })[0];
      return p ? p.value : tz;
    }
    function offsetLabel(tz) {
      try {
        var p = new Intl.DateTimeFormat(LOCALE, { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date())
          .filter(function (x) { return x.type === "timeZoneName"; })[0];
        return p ? p.value : "";
      } catch (e) { return zoneAbbr(new Date(), tz); }
    }
    function cityOf(tz) { return tz.split("/").pop().replace(/_/g, " "); }
    function genericName(tz) {
      try {
        var p = new Intl.DateTimeFormat(LOCALE, { timeZone: tz, timeZoneName: "longGeneric" }).formatToParts(new Date())
          .filter(function (x) { return x.type === "timeZoneName"; })[0];
        if (p && !/^GMT/.test(p.value)) return p.value;
      } catch (e) { /* older browsers */ }
      return cityOf(tz) + " time";
    }
    var OWNER_LABEL = U.timeZoneLabel || genericName(OWNER_TZ) + " (" + cityOf(OWNER_TZ) + ")";
    function viewer() { return tzSelect.value; }
    // Does the visitor's clock read differently from the instructor's at this moment?
    function differs(date) { return offsetMin(date, viewer()) !== offsetMin(date, OWNER_TZ); }
    function sameDay(date) { var a = parts(date, viewer()), b = parts(date, OWNER_TZ); return a.d === b.d && a.m === b.m; }
    function localStr(date) { return timeStr(date, viewer()) + (sameDay(date) ? "" : " " + fmt(viewer(), { weekday: "short" }).format(date)); }

    /* --- which instants are bookable (always judged in the instructor's zone) --- */
    function inHours(start, end) {
      var p = parts(start, OWNER_TZ), win = HOURS[p.wd];
      if (!win) return false;
      var from = p.h * 60 + p.min;
      return from >= toMin(win[0]) && from + (end - start) / 60000 <= toMin(win[1]);
    }
    function bookable(start, mins) {
      var s = start.getTime(), e = s + mins * 60000;
      if (s < Date.now() + NOTICE) return false;
      if (BLOCKED.indexOf(ymd(parts(start, OWNER_TZ))) !== -1) return false;
      if (cal.mode === "live" && GC.mode === "available") {
        return cal.open.some(function (iv) { return s >= iv[0] && e <= iv[1]; });
      }
      if (!inHours(start, new Date(e))) return false;
      if (cal.mode === "live") {
        return !cal.busy.some(function (iv) { return s < iv[1] + BUFFER && e > iv[0] - BUFFER; });
      }
      return true;
    }
    function dayList() {
      var t = parts(new Date(), OWNER_TZ), out = [];
      for (var i = 0; i <= DAYS; i++) {
        var d = new Date(Date.UTC(t.y, t.m - 1, t.d + i));
        out.push({ y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), offset: i });
      }
      return out;
    }
    function slotsFor(day) {
      var out = [], seen = {}, len = state.mins || 60;
      for (var t = 0; t < 1440; t += STEP) {
        var start = zoned(day.y, day.m, day.d, Math.floor(t / 60), t % 60, OWNER_TZ);
        if (parts(start, OWNER_TZ).d !== day.d || seen[start.getTime()]) continue; // skipped/duplicated by a DST change
        seen[start.getTime()] = 1;
        if (bookable(start, len)) out.push(start);
      }
      return out;
    }

    /* --- Google Calendar (optional) --- */
    function parseEventTime(t) {
      if (!t) return null;
      if (t.dateTime) return new Date(t.dateTime).getTime();
      if (t.date) { var a = t.date.split("-"); return zoned(+a[0], +a[1], +a[2], 0, 0, OWNER_TZ).getTime(); }
      return null;
    }
    function loadCalendar() {
      if (!GC.calendarId || !GC.apiKey || !window.fetch) return;
      cal.mode = "loading";
      setStatus();
      var timeMin = new Date().toISOString(), timeMax = new Date(Date.now() + (DAYS + 2) * 86400000).toISOString();
      var base = "https://www.googleapis.com/calendar/v3/";
      var listEvents = function () {
        return fetch(base + "calendars/" + encodeURIComponent(GC.calendarId) + "/events?singleEvents=true&orderBy=startTime&maxResults=2500" +
          "&timeMin=" + encodeURIComponent(timeMin) + "&timeMax=" + encodeURIComponent(timeMax) + "&key=" + encodeURIComponent(GC.apiKey))
          .then(function (r) { if (!r.ok) throw new Error("events " + r.status); return r.json(); })
          .then(function (j) {
            return (j.items || []).filter(function (ev) { return ev.status !== "cancelled"; }).map(function (ev) {
              return { s: parseEventTime(ev.start), e: parseEventTime(ev.end), free: ev.transparency === "transparent" };
            }).filter(function (iv) { return iv.s && iv.e; });
          });
      };
      var job;
      if (GC.mode === "available") {
        job = listEvents().then(function (list) { cal.open = list.map(function (iv) { return [iv.s, iv.e]; }); });
      } else {
        job = fetch(base + "freeBusy?key=" + encodeURIComponent(GC.apiKey), {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timeMin: timeMin, timeMax: timeMax, items: [{ id: GC.calendarId }] })
        }).then(function (r) { if (!r.ok) throw new Error("freeBusy " + r.status); return r.json(); })
          .then(function (j) {
            var c = j.calendars && j.calendars[GC.calendarId];
            if (!c || (c.errors && c.errors.length)) throw new Error("freeBusy calendar error");
            cal.busy = (c.busy || []).map(function (b) { return [new Date(b.start).getTime(), new Date(b.end).getTime()]; });
          })
          .catch(function () { // some calendars only allow reading events directly
            return listEvents().then(function (list) {
              cal.busy = list.filter(function (iv) { return !iv.free; }).map(function (iv) { return [iv.s, iv.e]; });
            });
          });
      }
      job.then(function () { cal.mode = "live"; })
        .catch(function () { cal.mode = "fallback"; })
        .then(function () { setStatus(); renderPicker(); });
    }
    function setStatus() {
      var m = cal.mode;
      statusEl.setAttribute("data-mode", m);
      statusText.textContent = m === "live" ? "Live availability from our calendar" :
        m === "loading" ? "Checking live availability…" :
        m === "fallback" ? "Showing our usual hours. We'll confirm availability" : "Times based on our usual hours";
      loadingEl.hidden = m !== "loading";
      q('[name="Availability check"]').value = m === "live" ? "Checked against the live calendar" :
        m === "fallback" ? "Calendar could not be reached: usual hours only" : "Usual hours only (calendar not connected)";
    }

    /* --- the visitor's own time zone (only used for the grey "your time" labels) --- */
    var COMMON = ["America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns",
      "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Mexico_City", "America/Sao_Paulo",
      "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Istanbul", "Africa/Lagos", "Africa/Cairo", "Africa/Johannesburg",
      "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Singapore", "Asia/Hong_Kong", "Asia/Shanghai",
      "Asia/Seoul", "Asia/Tokyo", "Australia/Perth", "Australia/Sydney", "Pacific/Auckland"];
    var detected = "";
    try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* ignore */ }
    var zones = COMMON.slice();
    if (detected && zones.indexOf(detected) === -1) zones.unshift(detected);
    state.tzSel = detected && zones.indexOf(detected) !== -1 ? detected : OWNER_TZ;
    function tzOptions() {
      tzSelect.innerHTML = zones.map(function (z) {
        return '<option value="' + z + '"' + (z === state.tzSel ? " selected" : "") + ">" + cityOf(z) + " (" + offsetLabel(z) + ") · " +
          timeStr(new Date(), z) + (z === detected ? " · this device" : "") + "</option>";
      }).join("");
    }
    tzOptions();
    $$("[data-owner-zone]", form).forEach(function (el) { el.textContent = OWNER_LABEL; });

    /* --- step 2: length cards --- */
    q("[data-durations]").innerHTML = DURATIONS.map(function (m) {
      return '<button type="button" class="wz-len' + (m === 60 ? " is-popular" : "") + '" data-mins="' + m + '">' +
        (m === 60 ? '<span class="wz-badge">Most popular</span>' : "") +
        '<strong>' + durShort(m) + "</strong><span>" + (HINTS[m] || "") + "</span></button>";
    }).join("");

    /* --- step 3: calendar + times (days and times in the instructor's zone) --- */
    function renderPicker() {
      var days = dayList(), byKey = {}, firstOpen = null;
      days.forEach(function (d) {
        d.slots = slotsFor(d);
        byKey[dayKey(d)] = d;
        if (d.slots.length && !firstOpen) firstOpen = d;
      });
      if (!state.day || !byKey[state.day] || !byKey[state.day].slots.length) state.day = firstOpen ? dayKey(firstOpen) : null;
      var sel = state.day ? byKey[state.day] : days[0];
      if (!state.view) state.view = { y: sel.y, m: sel.m };
      var first = days[0], last = days[days.length - 1];
      var abbr = zoneAbbr(sel.slots && sel.slots[0] || new Date(), OWNER_TZ);

      // soonest available (up to 3)
      var soon = [];
      for (var i = 0; i < days.length && soon.length < 3; i++) {
        for (var k = 0; k < days[i].slots.length && soon.length < 3; k++) soon.push({ day: days[i], s: days[i].slots[k] });
      }
      soonBox.hidden = !soon.length;
      soonList.innerHTML = soon.map(function (x) {
        var label = x.day.offset === 0 ? "Today" : x.day.offset === 1 ? "Tomorrow" : fmt(OWNER_TZ, { weekday: "short" }).format(x.s);
        return '<button type="button" class="wz-soon" data-pick="' + x.s.toISOString() + '" data-day="' + dayKey(x.day) + '"><span>' + label +
          "</span><strong>" + timeStr(x.s, OWNER_TZ) + " " + zoneAbbr(x.s, OWNER_TZ) + "</strong>" +
          (differs(x.s) ? '<em class="t-local">' + localStr(x.s) + " your time</em>" : "") + "</button>";
      }).join("");

      // month grid
      var v = state.view, firstWd = new Date(Date.UTC(v.y, v.m - 1, 1)).getUTCDay(), nDays = new Date(Date.UTC(v.y, v.m, 0)).getUTCDate();
      monthEl.textContent = fmt("UTC", { month: "long", year: "numeric" }).format(new Date(Date.UTC(v.y, v.m - 1, 15)));
      var html = ["S", "M", "T", "W", "T", "F", "S"].map(function (w) { return '<span class="cal-wd" aria-hidden="true">' + w + "</span>"; }).join("");
      for (var b = 0; b < firstWd; b++) html += '<span class="cal-blank"></span>';
      for (var dnum = 1; dnum <= nDays; dnum++) {
        var key = v.y + "-" + v.m + "-" + dnum, d = byKey[key];
        var open = d && d.slots.length > 0, isSel = key === state.day, today = d && d.offset === 0;
        var label = fmt("UTC", { weekday: "long", month: "long", day: "numeric" }).format(new Date(Date.UTC(v.y, v.m - 1, dnum)));
        html += '<button type="button" class="cal-day' + (open ? " is-open" : "") + (isSel ? " is-selected" : "") + (today ? " is-today" : "") +
          '" data-day="' + key + '"' + (open ? "" : " disabled") + ' aria-label="' + label + (open ? ", " + d.slots.length + " times available" : ", unavailable") + '"' +
          (isSel ? ' aria-pressed="true"' : "") + ">" + dnum + "</button>";
      }
      grid.innerHTML = html;
      var vIdx = v.y * 12 + v.m, fIdx = first.y * 12 + first.m, lIdx = last.y * 12 + last.m;
      q("[data-cal-prev]").disabled = vIdx <= fIdx;
      q("[data-cal-next]").disabled = vIdx >= lIdx;

      // times for the selected day
      var dsel = state.day && byKey[state.day];
      timesEmpty.hidden = !!(dsel && dsel.slots.length);
      timesDay.textContent = dsel ? longDay(zoned(dsel.y, dsel.m, dsel.d, 12, 0, OWNER_TZ), OWNER_TZ) : "No days open right now";
      var anyDiff = dsel && dsel.slots.some(differs);
      legend.hidden = !anyDiff;
      if (anyDiff) legend.innerHTML = "<strong>" + abbr + "</strong> · <span>grey = your time (" + cityOf(viewer()) + ")</span>";
      if (state.slot && !(dsel && dsel.slots.some(function (s) { return s.toISOString() === state.slot; }))) state.slot = null;
      timesEl.innerHTML = dsel ? dsel.slots.map(function (s) {
        var iso = s.toISOString(), on = iso === state.slot;
        return '<div class="time-row' + (on ? " is-selected" : "") + '"><button type="button" class="time" data-slot="' + iso + '"' + (on ? ' aria-pressed="true"' : "") +
          (differs(s) ? ' aria-label="' + timeStr(s, OWNER_TZ) + " " + zoneAbbr(s, OWNER_TZ) + ", " + localStr(s) + ' your time"' : "") + ">" +
          '<span class="t-main">' + timeStr(s, OWNER_TZ) + "</span>" + (differs(s) ? '<span class="t-local">' + localStr(s) + "</span>" : "") + "</button>" +
          (on ? '<button type="button" class="btn btn-primary time-next" data-next>Next</button>' : "") + "</div>";
      }).join("") : "";
      update();
    }

    /* --- left summary + hidden fields --- */
    function fact(name, text, empty, small) {
      var li = q('[data-fact="' + name + '"]'), span = li.querySelector("span");
      span.textContent = text;
      if (small) { var em = document.createElement("small"); em.className = "fact-local"; em.textContent = small; span.appendChild(em); }
      li.classList.toggle("is-empty", !!empty);
    }
    function joinList(a) { return a.length < 3 ? a.join(" and ") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
    function update() {
      var subj = state.subjects;
      fact("subject", subj.length ? subj.join(", ") : "Subjects", !subj.length);
      fact("duration", state.mins ? durLabel(state.mins) : "Length", !state.mins);
      fact("tz", OWNER_LABEL);
      var student = "", owner = "";
      if (state.slot) {
        var s = new Date(state.slot), e = new Date(s.getTime() + state.mins * 60000), diff = differs(s);
        owner = dayStr(s, OWNER_TZ) + ", " + timeStr(s, OWNER_TZ) + " – " + timeStr(e, OWNER_TZ) + " " + zoneAbbr(s, OWNER_TZ);
        student = dayStr(s, viewer()) + ", " + timeStr(s, viewer()) + " – " + timeStr(e, viewer()) + " " + zoneAbbr(s, viewer()) + " (" + viewer() + ")";
        var localRange = (sameDay(s) ? "" : dayStr(s, viewer()) + ", ") + timeStr(s, viewer()) + " – " + timeStr(e, viewer());
        fact("when", longDay(s, OWNER_TZ) + ", " + timeStr(s, OWNER_TZ) + " – " + timeStr(e, OWNER_TZ) + " " + zoneAbbr(s, OWNER_TZ), false,
          diff ? "= " + localRange + " your time (" + cityOf(viewer()) + ")" : "");
        var w = q("[data-success-when]");
        if (w) w.textContent = "You asked for " + longDay(s, OWNER_TZ) + ", " + timeStr(s, OWNER_TZ) + " – " + timeStr(e, OWNER_TZ) + " " + OWNER_LABEL +
          (diff ? " (" + localRange + " your time in " + cityOf(viewer()) + ")" : "") + (subj.length ? ", for " + joinList(subj) : "") + ".";
      } else {
        fact("when", "Day & time", true);
      }
      contBtn.disabled = !subj.length;
      contBtn.firstChild.nodeValue = subj.length > 1 ? "Continue with " + subj.length + " subjects " : "Continue ";
      q('[name="Subject area"]').value = subj.join(", ");
      q('[name="Duration"]').value = state.mins ? durLabel(state.mins) : "";
      q('[name="Requested time (your time zone)"]').value = owner;
      q('[name="Requested time (student\'s time)"]').value = student;
      q('[name="Student time zone"]').value = viewer();
      form.setAttribute("data-subject", "URGENT session request" + (subj.length ? " — " + subj.join(", ") : "") + (owner ? " — " + owner : ""));
    }

    /* --- step navigation --- */
    function go(n, focus) {
      state.step = n;
      steps.forEach(function (s) {
        var on = +s.getAttribute("data-step") === n;
        s.hidden = !on;
        s.classList.toggle("is-entering", on && !reduceMotion);
      });
      dots.forEach(function (d, i) { d.classList.toggle("is-done", i < n - 1); d.classList.toggle("is-current", i === n - 1); });
      backBtn.hidden = n === 1;
      countEl.textContent = "Step " + n + " of 4";
      if (n === 3) renderPicker();
      if (focus !== false) {
        var h = q('.wz-step[data-step="' + n + '"] h2');
        if (h) h.focus({ preventScroll: true });
        var top = form.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) window.scrollTo({ top: top + window.scrollY - 90, behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
    function syncTiles() {
      $$(".wz-tile", form).forEach(function (b) { b.setAttribute("aria-pressed", state.subjects.indexOf(b.getAttribute("data-subject")) !== -1 ? "true" : "false"); });
    }

    form.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t || !form.contains(t)) return;
      if (t.matches(".wz-tile")) {
        var sname = t.getAttribute("data-subject"), at = state.subjects.indexOf(sname);
        if (at === -1) state.subjects.push(sname); else state.subjects.splice(at, 1);
        syncTiles();
        update();
      } else if (t.matches("[data-continue]")) {
        if (state.subjects.length) go(2);
      } else if (t.matches(".wz-len")) {
        state.mins = +t.getAttribute("data-mins");
        $$(".wz-len", form).forEach(function (b) { b.setAttribute("aria-pressed", b === t ? "true" : "false"); });
        update();
        setTimeout(function () { go(3); }, reduceMotion ? 0 : 180);
      } else if (t.matches(".cal-day")) {
        state.day = t.getAttribute("data-day");
        state.slot = null;
        renderPicker();
        if (q("[data-times] .time") && window.innerWidth < 860) q(".times").scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      } else if (t.matches(".time")) {
        state.slot = t.getAttribute("data-slot");
        renderPicker();
        var nx = q("[data-next]");
        if (nx) nx.focus({ preventScroll: true });
      } else if (t.matches(".wz-soon")) {
        state.day = t.getAttribute("data-day");
        state.slot = t.getAttribute("data-pick");
        var a = state.day.split("-");
        state.view = { y: +a[0], m: +a[1] };
        renderPicker();
        go(4);
      } else if (t.matches("[data-next]")) {
        go(4);
      } else if (t.matches("[data-back]")) {
        go(Math.max(1, state.step - 1));
      } else if (t.matches("[data-cal-prev], [data-cal-next]")) {
        var dir = t.matches("[data-cal-next]") ? 1 : -1, idx = state.view.y * 12 + (state.view.m - 1) + dir;
        state.view = { y: Math.floor(idx / 12), m: idx % 12 + 1 };
        renderPicker();
      }
    });
    tzSelect.addEventListener("change", function () { state.tzSel = viewer(); renderPicker(); });
    form.addEventListener("input", function () { update(); });

    // Never send without subjects, a length and a time (e.g. Enter pressed early).
    form.parentNode.addEventListener("submit", function (e) {
      if (e.target !== form) return;
      var missing = !state.subjects.length ? 1 : !state.mins ? 2 : !state.slot ? 3 : 0;
      if (missing) { e.preventDefault(); e.stopPropagation(); go(missing); }
    }, true);

    // ?subject=Physics (or Physics,Mathematics) preselects subjects
    var pre = (new URLSearchParams(location.search).get("subject") || "").toLowerCase().split(",").map(function (s) { return s.trim(); });
    $$(".wz-tile", form).forEach(function (b) {
      if (pre.indexOf(b.getAttribute("data-subject").toLowerCase()) !== -1) state.subjects.push(b.getAttribute("data-subject"));
    });
    syncTiles();
    setStatus();
    update();
    go(1, false);
    loadCalendar();
    // Keep it honest as time passes (times inside the notice window disappear).
    setInterval(function () { tzOptions(); if (state.step === 3) renderPicker(); }, 60000);
  });
})();
