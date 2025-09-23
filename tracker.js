(function (_) {
  typeof define == "function" && define.amd ? define(_) : _();
})(function () {
  "use strict";
  function _() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 10);
  }
  function h(n, e, t) {
    document.cookie = `${n}=${e}; path=/; max-age=${t}`;
  }
  function a(n) {
    if (typeof document > "u") return null;
    const t = document.cookie
      .split("; ")
      .map((o) => o.trim())
      .find((o) => o.startsWith(`${n}=`));
    return t ? t.split("=")[1] : null;
  }
  const u = Object.freeze({
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
    if (!a("jw_user_id")) {
      const o = _();
      h("jw_user_id", o, 31536e3);
    }
    if (!a("jw_session_id")) {
      const o = _();
      return h("jw_session_id", o, 1800), !0;
    }
    return !1;
  }
  function y() {
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
  function S() {
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
  const O = "https://api.journeywise.io/api/v1/website-event-tracking";
  function r(n, e) {
    var d, c, l, f, p, m, I, k;
    if (!y() || window.JourneyWiseConsentGiven === !1) {
      console.warn(
        "[JourneyWise] Tracking skipped: user opted out or DNT enabled."
      );
      return;
    }
    const t = a("jw_user_id"),
      o = a("jw_user_id"),
      i = S(),
      s = {
        identifier: n,
        pageview_id: 409606162,
        platform: "web",
        utm_tracking: i,
        user_data: {
          anonymous_id: t,
          workEmail:
            ((d = e == null ? void 0 : e.fields) == null
              ? void 0
              : d.workEmail) || void 0,
          firstName:
            ((c = e == null ? void 0 : e.fields) == null
              ? void 0
              : c.firstName) || void 0,
          lastName:
            ((l = e == null ? void 0 : e.fields) == null
              ? void 0
              : l.lastName) || void 0,
          phone:
            ((f = e == null ? void 0 : e.fields) == null
              ? void 0
              : f.phoneNumber) || void 0,
          companyName:
            ((p = e == null ? void 0 : e.fields) == null
              ? void 0
              : p.companyName) || void 0,
          companySize:
            ((m = e == null ? void 0 : e.fields) == null
              ? void 0
              : m.companySize) || void 0,
          jobTitle:
            ((I = e == null ? void 0 : e.fields) == null
              ? void 0
              : I.jobTitle) || void 0,
          country:
            ((k = e == null ? void 0 : e.fields) == null
              ? void 0
              : k.country) || void 0,
        },
        event: "Website Activity",
        subEvent: n,
        metadata: { additional_data: { ...e } },
        referer: e != null && e.url ? e.url : document.referrer,
        device_identifier: o,
        apiKey: window.__JW_API_KEY__ || "",
      };
    fetch(O, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    }).catch((J) => {
      console.warn("Failed to send JourneyWise event:", J);
    });
  }
  function b(n) {
    const e = {};
    for (const [t, o] of n.entries()) t.toLowerCase(), (e[t] = o);
    return e;
  }
  let w = Date.now();
  const T = E();
  function g() {
    r(u.PAGE_VIEW, {
      url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
    }),
      T && N(),
      j(),
      P(),
      A(),
      L();
  }
  function A() {
    const n = window.__JW_API_KEY__;
    !n ||
      !y() ||
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
    const n = a("jw_session_id");
    r(u.SESSION_START, { session_id: n, timestamp: Date.now() });
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
          r(u.SCROLL_DEPTH, {
            percent: s,
            url: location.href,
            timestamp: Date.now(),
          }));
      }),
        (w = Date.now());
    });
  }
  function P() {
    setInterval(() => {
      const n = Date.now(),
        e = Math.floor((n - w) / 1e3);
      r(u.TIME_ON_PAGE, {
        time_spent: e,
        url: location.href,
        session_id: a("jw_session_id"),
        timestamp: Date.now(),
      });
    }, 3e4);
  }
  function j() {
    setInterval(() => {
      const e = Date.now();
      e - w >= 5 * 60 * 1e3 &&
        r(u.SESSION_END, { session_id: a("jw_session_id"), timestamp: e });
    }, 6e4);
  }
  function C() {
    const n = new WeakSet(),
      e = (i) => {
        if (n.has(i)) return;
        n.add(i);
        const s = i.id || i.name || "unnamed_form";
        i.addEventListener("submit", (d) => {
          var m;
          const c = d.submitter;
          if (
            !(
              c &&
              (c.formNoValidate ||
                ((m = c.hasAttribute) == null
                  ? void 0
                  : m.call(c, "formnovalidate")))
            ) &&
            !i.checkValidity()
          )
            return;
          const f = new FormData(i),
            p = b(f);
          r(u.FORM_SUBMIT, {
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
        d = t.hasAttribute("download"),
        c = n.includes(s);
      (d || c) &&
        r(u.DOWNLOAD, {
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
            d = new Set();
          o.addEventListener("play", () => {
            r(u.VIDEO_PLAY, { video_id: i, timestamp: Date.now() });
          }),
            o.addEventListener("pause", () => {
              r(u.VIDEO_PAUSE, {
                video_id: i,
                current_time: o.currentTime,
                timestamp: Date.now(),
              });
            }),
            o.addEventListener("timeupdate", () => {
              const c = Math.floor((o.currentTime / o.duration) * 100);
              s.forEach((l) => {
                c >= l &&
                  !d.has(l) &&
                  (d.add(l),
                  r(u.VIDEO_WATCH_PERCENTAGE, {
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
      visitor_id: a("jw_user_id"),
      session_id: a("jw_session_id"),
      device_identifier: D(),
    };
    r(n, t);
  }
  function v(n, ...e) {
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
    n.forEach((e) => v(...e));
  }
  function V() {
    const n = history.pushState;
    (history.pushState = function (...e) {
      n.apply(history, e), g();
    }),
      window.addEventListener("popstate", g);
  }
  (function () {
    var t;
    const e = ((t = window.JourneyWise) == null ? void 0 : t.q) || [];
    (window.JourneyWise = function (...o) {
      v(...o);
    }),
      (window.JourneyWise.q = e),
      U(e),
      E(),
      setTimeout(() => {
        g(), S(), R(), W(), C(), V();
      }, 1e3);
  })();
});
