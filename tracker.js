(function (u) {
  typeof define == "function" && define.amd ? define(u) : u();
})(function () {
  "use strict";
  function u() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 10);
  }
  function w(t, e, o) {
    document.cookie = `${t}=${e}; path=/; max-age=${o}`;
  }
  function a(t) {
    if (typeof document > "u") return null;
    const o = document.cookie
      .split("; ")
      .map((n) => n.trim())
      .find((n) => n.startsWith(`${t}=`));
    return o ? o.split("=")[1] : null;
  }
  const r = Object.freeze({
    PAGE_VIEW: "pageview",
    SESSION_START: "session_start",
    SESSION_END: "session_end",
    SCROLL_DEPTH: "scroll_depth",
    TIME_ON_PAGE: "time_on_page",
    CLICK: "click",
    FORM_VIEW: "form_view",
    FORM_FOCUS: "form_focus",
    FORM_SUBMIT: "form_submit",
    OUTBOUND_LINK_CLICK: "outbound_link_click",
    VIDEO_PLAY: "video_play",
    VIDEO_PAUSE: "video_pause",
    VIDEO_WATCH_PERCENTAGE: "video_watch_percentage",
    DOWNLOAD: "download",
  });
  function p() {
    if (!a("jw_user_id")) {
      const n = u();
      w("jw_user_id", n, 31536e3);
    }
    if (!a("jw_session_id")) {
      const n = u();
      return w("jw_session_id", n, 1800), !0;
    }
    return !1;
  }
  function E() {
    if (typeof window > "u" || typeof document > "u") return !1;
    const t = typeof navigator < "u" && navigator.doNotTrack === "1",
      e = document.cookie.includes("jw_opt_out=true"),
      o = window.JourneyWiseConsentGiven === !1;
    return !t && !e && !o;
  }
  function v() {
    let t = localStorage.getItem("jw_device_id");
    return t || ((t = u()), localStorage.setItem("jw_device_id", t)), t;
  }
  const I = "https://flight.journeywise.io/api/v1/website-event-tracking";
  function s(t, e) {
    var c, d, l;
    if (!E() || window.JourneyWiseConsentGiven === !1) {
      console.warn(
        "[JourneyWise] Tracking skipped: user opted out or DNT enabled."
      );
      return;
    }
    const o = a("jw_user_id"),
      n = a("jw_user_id"),
      i = {
        identifier: t,
        pageview_id: 409606162,
        platform: "web",
        user_data: {
          anonymous_id: o,
          workEmail:
            ((c = e == null ? void 0 : e.fields) == null ? void 0 : c.email) ||
            void 0,
          firstName:
            ((d = e == null ? void 0 : e.fields) == null
              ? void 0
              : d.firstName) || void 0,
          lastName:
            ((l = e == null ? void 0 : e.fields) == null
              ? void 0
              : l.lastName) || void 0,
        },
        event: "Website Activity",
        subEvent: t,
        metadata: { additional_data: e },
        referer: e != null && e.url ? e.url : document.referrer,
        device_identifier: n,
        apiKey: window.__JW_API_KEY__ || "",
      };
    fetch(I, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
    }).catch((_) => {
      console.warn("Failed to send JourneyWise event:", _);
    });
  }
  function g(t) {
    const e = {};
    for (const [o, n] of t.entries()) o.toLowerCase(), (e[o] = n);
    return e;
  }
  let f = Date.now();
  const y = p();
  function m() {
    s(r.PAGE_VIEW, {
      url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
    }),
      y && S(),
      A(),
      O(),
      D(),
      k();
  }
  function D() {
    const t = window.__JW_API_KEY__;
    !t ||
      !E() ||
      s("test_connection", {
        apiKey: t,
        page_url: location.href,
        hostname: location.hostname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
      });
  }
  function S() {
    const t = a("jw_session_id");
    s(r.SESSION_START, { session_id: t, timestamp: Date.now() });
  }
  function k() {
    const t = [25, 50, 75, 100],
      e = new Set();
    window.addEventListener("scroll", () => {
      const o = window.scrollY,
        n = document.documentElement.scrollHeight - window.innerHeight,
        i = Math.round((o / n) * 100);
      t.forEach((c) => {
        i >= c &&
          !e.has(c) &&
          (e.add(c),
          s(r.SCROLL_DEPTH, {
            percent: c,
            url: location.href,
            timestamp: Date.now(),
          }));
      }),
        (f = Date.now());
    });
  }
  function O() {
    setInterval(() => {
      const t = Date.now(),
        e = Math.floor((t - f) / 1e3);
      s(r.TIME_ON_PAGE, {
        time_spent: e,
        url: location.href,
        session_id: a("jw_session_id"),
        timestamp: Date.now(),
      });
    }, 3e4);
  }
  function A() {
    setInterval(() => {
      const e = Date.now();
      e - f >= 5 * 60 * 1e3 &&
        s(r.SESSION_END, { session_id: a("jw_session_id"), timestamp: e });
    }, 6e4);
  }
  function T() {
    document.addEventListener("click", (t) => {
      const e = t.target.closest("a, button");
      if (!e) return;
      const o = e.tagName === "A" && !e.href.includes(location.hostname),
        n = {
          element_type: e.tagName,
          text: e.textContent.trim(),
          id: e.id || null,
          class: e.className || null,
          url: location.href,
          timestamp: Date.now(),
        };
      o
        ? ((n.link_url = e.href),
          (n.domain = new URL(e.href).hostname),
          s(r.OUTBOUND_LINK_CLICK, n))
        : s(r.CLICK, n);
    });
  }
  function b() {
    const t = () => {
      document.querySelectorAll("form").forEach((o) => {
        const n = o.id || o.name || "unnamed_form";
        s(r.FORM_VIEW, {
          form_id: n,
          url: location.href,
          timestamp: Date.now(),
        }),
          o.querySelectorAll("input, textarea, select").forEach((i) => {
            i.addEventListener("focus", () => {
              s(r.FORM_FOCUS, {
                form_id: n,
                input_name: i.name || i.id || "unknown_input",
                url: location.href,
              });
            });
          }),
          o.addEventListener("submit", (i) => {
            i.preventDefault();
            const c = new FormData(o),
              d = g(c);
            s(r.FORM_SUBMIT, {
              form_id: n,
              title: o.title || "Unnamed Form",
              status: "submitted",
              fields: d,
              url: location.href,
              submit_url: o.action || null,
              timestamp: Date.now(),
            });
          });
      });
    };
    new MutationObserver(t).observe(document.body, {
      childList: !0,
      subtree: !0,
    }),
      t();
  }
  function L() {
    const t = [
      "pdf",
      "zip",
      "png",
      "jpg",
      "jpeg",
      "doc",
      "docx",
      "xls",
      "xlsx",
    ];
    document.addEventListener("click", (e) => {
      const o = e.target.closest("a");
      if (!o) return;
      const n = o.getAttribute("href");
      if (!n) return;
      const i = new URL(n, location.href),
        c = i.pathname.split(".").pop().toLowerCase(),
        d = o.hasAttribute("download"),
        l = t.includes(c);
      (d || l) &&
        s(r.DOWNLOAD, {
          file_name: i.pathname.split("/").pop(),
          file_url: i.href,
          file_extension: c,
          element_type: "A",
          page_url: location.href,
          timestamp: Date.now(),
        });
    });
  }
  function N() {
    const t = new Set(),
      e = () => {
        document.querySelectorAll("video").forEach((n) => {
          if (t.has(n)) return;
          t.add(n);
          const i = n.id || "unnamed_video";
          let c = [25, 50, 75, 100],
            d = new Set();
          n.addEventListener("play", () => {
            s(r.VIDEO_PLAY, { video_id: i, timestamp: Date.now() });
          }),
            n.addEventListener("pause", () => {
              s(r.VIDEO_PAUSE, {
                video_id: i,
                current_time: n.currentTime,
                timestamp: Date.now(),
              });
            }),
            n.addEventListener("timeupdate", () => {
              const l = Math.floor((n.currentTime / n.duration) * 100);
              c.forEach((_) => {
                l >= _ &&
                  !d.has(_) &&
                  (d.add(_),
                  s(r.VIDEO_WATCH_PERCENTAGE, {
                    video_id: i,
                    percent_watched: _,
                    timestamp: Date.now(),
                  }));
              });
            });
        });
      };
    new MutationObserver(e).observe(document.body, {
      childList: !0,
      subtree: !0,
    }),
      e();
  }
  function C(t, e = {}) {
    const o = {
      ...e,
      url: location.href,
      timestamp: Date.now(),
      visitor_id: a("jw_user_id"),
      session_id: a("jw_session_id"),
      device_identifier: v(),
    };
    s(t, o);
  }
  function h(t, ...e) {
    switch (t) {
      case "init":
        window.__JW_API_KEY__ = e[0];
        break;
      case "track":
        C(...e);
        break;
      default:
        console.warn(`Unknown JourneyWise command: ${t}`);
    }
  }
  function P(t) {
    t.forEach((e) => h(...e));
  }
  function W() {
    const t = history.pushState;
    (history.pushState = function (...e) {
      t.apply(history, e), m();
    }),
      window.addEventListener("popstate", m);
  }
  (function () {
    var o;
    const e = ((o = window.JourneyWise) == null ? void 0 : o.q) || [];
    (window.JourneyWise = function (...n) {
      h(...n);
    }),
      (window.JourneyWise.q = e),
      P(e),
      p(),
      setTimeout(() => {
        m(), T(), N(), L(), b(), W();
      }, 1e3);
  })();
});
