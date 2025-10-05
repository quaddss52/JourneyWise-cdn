(function (l) {
  typeof define == "function" && define.amd ? define(l) : l();
})(function () {
  "use strict";
  function l() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 10);
  }
  function m(t, e, o) {
    document.cookie = `${t}=${e}; path=/; max-age=${o}`;
  }
  function d(t) {
    if (typeof document > "u") return null;
    const o = document.cookie
      .split("; ")
      .map((n) => n.trim())
      .find((n) => n.startsWith(`${t}=`));
    return o ? o.split("=")[1] : null;
  }
  const c = Object.freeze({
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
  function w() {
    if (!d("jw_user_id")) {
      const n = l();
      m("jw_user_id", n, 31536e3);
    }
    if (!d("jw_session_id")) {
      const n = l();
      return m("jw_session_id", n, 1800), !0;
    }
    return !1;
  }
  function p() {
    if (typeof window > "u" || typeof document > "u") return !1;
    const t = typeof navigator < "u" && navigator.doNotTrack === "1",
      e = document.cookie.includes("jw_opt_out=true"),
      o = window.JourneyWiseConsentGiven === !1;
    return !t && !e && !o;
  }
  function S() {
    let t = localStorage.getItem("jw_device_id");
    return t || ((t = l()), localStorage.setItem("jw_device_id", t)), t;
  }
  const g = "https://api.journeywise.io/api/v1/website-event-tracking";
  function s(t, e) {
    var r, a, u;
    if (!p() || window.JourneyWiseConsentGiven === !1) {
      console.warn(
        "[JourneyWise] Tracking skipped: user opted out or DNT enabled."
      );
      return;
    }
    const o = d("jw_user_id"),
      n = d("jw_user_id"),
      i = {
        identifier: t,
        pageview_id: 409606162,
        platform: "web",
        user_data: {
          anonymous_id: o,
          workEmail:
            ((r = e == null ? void 0 : e.fields) == null ? void 0 : r.email) ||
            void 0,
          firstName:
            ((a = e == null ? void 0 : e.fields) == null
              ? void 0
              : a.firstName) || void 0,
          lastName:
            ((u = e == null ? void 0 : e.fields) == null
              ? void 0
              : u.lastName) || void 0,
        },
        event: "Website Activity",
        subEvent: t,
        metadata: { additional_data: e },
        referer: e != null && e.url ? e.url : document.referrer,
        device_identifier: n,
        apiKey: window.__JW_API_KEY__ || "",
      };
    fetch(g, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
    }).catch((f) => {
      console.warn("Failed to send JourneyWise event:", f);
    });
  }
  function v(t) {
    const e = {};
    for (const [o, n] of t.entries()) o.toLowerCase(), (e[o] = n);
    return e;
  }
  let E = Date.now();
  const y = w();
  function _() {
    s(c.PAGE_VIEW, {
      url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
    }),
      y && D(),
      A(),
      k(),
      I(),
      O();
  }
  function I() {
    const t = window.__JW_API_KEY__;
    !t ||
      !p() ||
      s("test_connection", {
        apiKey: t,
        page_url: location.href,
        hostname: location.hostname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
      });
  }
  function D() {
    const t = d("jw_session_id");
    s(c.SESSION_START, { session_id: t, timestamp: Date.now() });
  }
  function O() {
    const t = [25, 50, 75, 100],
      e = new Set();
    window.addEventListener("scroll", () => {
      const o = window.scrollY,
        n = document.documentElement.scrollHeight - window.innerHeight,
        i = Math.round((o / n) * 100);
      t.forEach((r) => {
        i >= r &&
          !e.has(r) &&
          (e.add(r),
          s(c.SCROLL_DEPTH, {
            percent: r,
            url: location.href,
            timestamp: Date.now(),
          }));
      }),
        (E = Date.now());
    });
  }
  function k({ delayMs: t = 5e4, pageStartTs: e } = {}) {
    const o = typeof e == "number" ? e : performance.timeOrigin || Date.now(),
      n = "sessionTimeSent";
    setTimeout(() => {
      const i = Date.now(),
        r = Math.floor((i - o) / 1e3),
        a = new Date().toISOString().slice(0, 10);
      localStorage.getItem(n) !== a &&
        (typeof s == "function" &&
          typeof c < "u" &&
          s(c.TIME_ON_PAGE, {
            time_spent: r,
            url: location.href,
            session_id: typeof d == "function" ? d("jw_session_id") : void 0,
            timestamp: i,
          }),
        localStorage.setItem(n, a));
    }, t);
  }
  function A() {
    setInterval(() => {
      const e = Date.now();
      e - E >= 5 * 60 * 1e3 &&
        s(c.SESSION_END, { session_id: d("jw_session_id"), timestamp: e });
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
          s(c.OUTBOUND_LINK_CLICK, n))
        : s(c.CLICK, n);
    });
  }
  function b() {
    const t = () => {
      document.querySelectorAll("form").forEach((o) => {
        const n = o.id || o.name || "unnamed_form";
        s(c.FORM_VIEW, {
          form_id: n,
          url: location.href,
          timestamp: Date.now(),
        }),
          o.querySelectorAll("input, textarea, select").forEach((i) => {
            i.addEventListener("focus", () => {
              s(c.FORM_FOCUS, {
                form_id: n,
                input_name: i.name || i.id || "unknown_input",
                url: location.href,
              });
            });
          }),
          o.addEventListener("submit", (i) => {
            i.preventDefault();
            const r = new FormData(o),
              a = v(r);
            s(c.FORM_SUBMIT, {
              form_id: n,
              title: o.title || "Unnamed Form",
              status: "submitted",
              fields: a,
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
        r = i.pathname.split(".").pop().toLowerCase(),
        a = o.hasAttribute("download"),
        u = t.includes(r);
      (a || u) &&
        s(c.DOWNLOAD, {
          file_name: i.pathname.split("/").pop(),
          file_url: i.href,
          file_extension: r,
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
          let r = [25, 50, 75, 100],
            a = new Set();
          n.addEventListener("play", () => {
            s(c.VIDEO_PLAY, { video_id: i, timestamp: Date.now() });
          }),
            n.addEventListener("pause", () => {
              s(c.VIDEO_PAUSE, {
                video_id: i,
                current_time: n.currentTime,
                timestamp: Date.now(),
              });
            }),
            n.addEventListener("timeupdate", () => {
              const u = Math.floor((n.currentTime / n.duration) * 100);
              r.forEach((f) => {
                u >= f &&
                  !a.has(f) &&
                  (a.add(f),
                  s(c.VIDEO_WATCH_PERCENTAGE, {
                    video_id: i,
                    percent_watched: f,
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
      visitor_id: d("jw_user_id"),
      session_id: d("jw_session_id"),
      device_identifier: S(),
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
      t.apply(history, e), _();
    }),
      window.addEventListener("popstate", _);
  }
  (function () {
    var o;
    const e = ((o = window.JourneyWise) == null ? void 0 : o.q) || [];
    (window.JourneyWise = function (...n) {
      h(...n);
    }),
      (window.JourneyWise.q = e),
      P(e),
      w(),
      setTimeout(() => {
        _(), T(), N(), L(), b(), W();
      }, 1e3);
  })();
});
