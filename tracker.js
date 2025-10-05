(function (_) {
  typeof define == "function" && define.amd ? define(_) : _();
})(function () {
  "use strict";
  function _() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 10);
  }
  function g(n, e, t) {
    document.cookie = `${n}=${e}; path=/; max-age=${t}`;
  }
  function d(n) {
    if (typeof document > "u") return null;
    const t = document.cookie
      .split("; ")
      .map((o) => o.trim())
      .find((o) => o.startsWith(`${n}=`));
    return t ? t.split("=")[1] : null;
  }
  const a = Object.freeze({
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
  function E() {
    if (!d("jw_user_id")) {
      const o = _();
      g("jw_user_id", o, 31536e3);
    }
    if (!d("jw_session_id")) {
      const o = _();
      return g("jw_session_id", o, 1800), !0;
    }
    return !1;
  }
  function h() {
    if (typeof window > "u" || typeof document > "u") return !1;
    const n = typeof navigator < "u" && navigator.doNotTrack === "1",
      e = document.cookie.includes("jw_opt_out=true"),
      t = window.JourneyWiseConsentGiven === !1;
    return !n && !e && !t;
  }
  function D() {
    let n = localStorage.getItem("jw_device_id");
    return n || ((n = _()), localStorage.setItem("jw_device_id", n)), n;
  }
  function O() {
    const n = JSON.parse(sessionStorage.getItem("jw_campaign_origin"));
    if (n) return n;
    const e = new URLSearchParams(window.location.search),
      t = {
        utm_source: e.get("utm_source") || null,
        utm_medium: e.get("utm_medium") || null,
        utm_campaign: e.get("utm_campaign") || null,
        utm_term: e.get("utm_term") || null,
        utm_content: e.get("utm_content") || null,
      };
    return sessionStorage.setItem("jw_campaign_origin", JSON.stringify(t)), t;
  }
  const k = "https://api.journeywise.io/api/v1/website-event-tracking";
  function r(n, e) {
    var u, c, l, m, p, f, v, I;
    if (!h() || window.JourneyWiseConsentGiven === !1) {
      console.warn(
        "[JourneyWise] Tracking skipped: user opted out or DNT enabled."
      );
      return;
    }
    const t = d("jw_user_id"),
      o = d("jw_user_id"),
      i = O(),
      s = {
        identifier: n,
        pageview_id: 409606162,
        platform: "web",
        utm_tracking: i,
        user_data: {
          anonymous_id: t,
          workEmail:
            ((u = e == null ? void 0 : e.fields) == null
              ? void 0
              : u.workEmail) || void 0,
          firstName:
            ((c = e == null ? void 0 : e.fields) == null
              ? void 0
              : c.firstName) || void 0,
          lastName:
            ((l = e == null ? void 0 : e.fields) == null
              ? void 0
              : l.lastName) || void 0,
          phone:
            ((m = e == null ? void 0 : e.fields) == null
              ? void 0
              : m.phoneNumber) || void 0,
          companyName:
            ((p = e == null ? void 0 : e.fields) == null
              ? void 0
              : p.companyName) || void 0,
          companySize:
            ((f = e == null ? void 0 : e.fields) == null
              ? void 0
              : f.companySize) || void 0,
          jobTitle:
            ((v = e == null ? void 0 : e.fields) == null
              ? void 0
              : v.jobTitle) || void 0,
          country:
            ((I = e == null ? void 0 : e.fields) == null
              ? void 0
              : I.country) || void 0,
        },
        event: "Website Activity",
        subEvent: n,
        metadata: { additional_data: { ...e } },
        referer: e != null && e.url ? e.url : document.referrer,
        device_identifier: o,
        apiKey: window.__JW_API_KEY__ || "",
      };
    fetch(k, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    }).catch((J) => {
      console.warn("Failed to send JourneyWise event:", J);
    });
  }
  function T(n) {
    const e = {};
    for (const [t, o] of n.entries()) t.toLowerCase(), (e[t] = o);
    return e;
  }
  let S = Date.now();
  const b = E();
  function w() {
    r(a.PAGE_VIEW, {
      url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
    }),
      b && N(),
      j(),
      P(),
      A(),
      L();
  }
  function A() {
    const n = window.__JW_API_KEY__;
    !n ||
      !h() ||
      r("test_connection", {
        apiKey: n,
        page_url: location.href,
        hostname: location.hostname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
      });
  }
  function N() {
    const n = d("jw_session_id");
    r(a.SESSION_START, { session_id: n, timestamp: Date.now() });
  }
  function L() {
    const n = [25, 50, 75, 100],
      e = new Set();
    window.addEventListener("scroll", () => {
      const t = window.scrollY,
        o = document.documentElement.scrollHeight - window.innerHeight,
        i = Math.round((t / o) * 100);
      n.forEach((s) => {
        i >= s &&
          !e.has(s) &&
          (e.add(s),
          r(a.SCROLL_DEPTH, {
            percent: s,
            url: location.href,
            timestamp: Date.now(),
          }));
      }),
        (S = Date.now());
    });
  }
  function P({ delayMs: n = 5e4, pageStartTs: e } = {}) {
    const t = typeof e == "number" ? e : performance.timeOrigin || Date.now(),
      o = "sessionTimeSent";
    setTimeout(() => {
      const i = Date.now(),
        s = Math.floor((i - t) / 1e3),
        u = new Date().toISOString().slice(0, 10);
      localStorage.getItem(o) !== u &&
        (typeof r == "function" &&
          typeof a < "u" &&
          r(a.TIME_ON_PAGE, {
            time_spent: s,
            url: location.href,
            session_id: typeof d == "function" ? d("jw_session_id") : void 0,
            timestamp: i,
          }),
        localStorage.setItem(o, u));
    }, n);
  }
  function j() {
    setInterval(() => {
      const e = Date.now();
      e - S >= 5 * 60 * 1e3 &&
        r(a.SESSION_END, { session_id: d("jw_session_id"), timestamp: e });
    }, 6e4);
  }
  function C() {
    const n = new WeakSet(),
      e = (i) => {
        if (n.has(i)) return;
        n.add(i);
        const s = i.id || i.name || "unnamed_form";
        i.addEventListener("submit", (u) => {
          var f;
          const c = u.submitter;
          if (
            !(
              c &&
              (c.formNoValidate ||
                ((f = c.hasAttribute) == null
                  ? void 0
                  : f.call(c, "formnovalidate")))
            ) &&
            !i.checkValidity()
          )
            return;
          const m = new FormData(i),
            p = T(m);
          r(a.FORM_SUBMIT, {
            form_id: s,
            title: i.title || "Unnamed Form",
            status: "submitted",
            fields: p,
            url: location.href,
            submit_url: i.action || null,
            timestamp: Date.now(),
          });
        });
      },
      t = () => {
        document.querySelectorAll("form").forEach(e);
      };
    t(),
      new MutationObserver(t).observe(document.body, {
        childList: !0,
        subtree: !0,
      });
  }
  function W() {
    const n = [
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
      const t = e.target.closest("a");
      if (!t) return;
      const o = t.getAttribute("href");
      if (!o) return;
      const i = new URL(o, location.href),
        s = i.pathname.split(".").pop().toLowerCase(),
        u = t.hasAttribute("download"),
        c = n.includes(s);
      (u || c) &&
        r(a.DOWNLOAD, {
          file_name: i.pathname.split("/").pop(),
          file_url: i.href,
          file_extension: s,
          element_type: "A",
          page_url: location.href,
          timestamp: Date.now(),
        });
    });
  }
  function R() {
    const n = new Set(),
      e = () => {
        document.querySelectorAll("video").forEach((o) => {
          if (n.has(o)) return;
          n.add(o);
          const i = o.id || "unnamed_video";
          let s = [25, 50, 75, 100],
            u = new Set();
          o.addEventListener("play", () => {
            r(a.VIDEO_PLAY, { video_id: i, timestamp: Date.now() });
          }),
            o.addEventListener("pause", () => {
              r(a.VIDEO_PAUSE, {
                video_id: i,
                current_time: o.currentTime,
                timestamp: Date.now(),
              });
            }),
            o.addEventListener("timeupdate", () => {
              const c = Math.floor((o.currentTime / o.duration) * 100);
              s.forEach((l) => {
                c >= l &&
                  !u.has(l) &&
                  (u.add(l),
                  r(a.VIDEO_WATCH_PERCENTAGE, {
                    video_id: i,
                    percent_watched: l,
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
  function M(n, e = {}) {
    const t = {
      ...e,
      url: location.href,
      timestamp: Date.now(),
      visitor_id: d("jw_user_id"),
      session_id: d("jw_session_id"),
      device_identifier: D(),
    };
    r(n, t);
  }
  function y(n, ...e) {
    switch (n) {
      case "init":
        window.__JW_API_KEY__ = e[0];
        break;
      case "track":
        M(...e);
        break;
      default:
        console.warn(`Unknown JourneyWise command: ${n}`);
    }
  }
  function U(n) {
    n.forEach((e) => y(...e));
  }
  function V() {
    const n = history.pushState;
    (history.pushState = function (...e) {
      n.apply(history, e), w();
    }),
      window.addEventListener("popstate", w);
  }
  (function () {
    var t;
    const e = ((t = window.JourneyWise) == null ? void 0 : t.q) || [];
    (window.JourneyWise = function (...o) {
      y(...o);
    }),
      (window.JourneyWise.q = e),
      U(e),
      E(),
      setTimeout(() => {
        w(), R(), W(), C(), V();
      }, 1e3);
  })();
});
