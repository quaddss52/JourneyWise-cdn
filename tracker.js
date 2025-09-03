(function (f) {
  typeof define == "function" && define.amd ? define(f) : f();
})(function () {
  "use strict";
  function f() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 10);
  }
  function h(n, e, o) {
    document.cookie = `${n}=${e}; path=/; max-age=${o}`;
  }
  function u(n) {
    if (typeof document > "u") return null;
    const o = document.cookie
      .split("; ")
      .map((t) => t.trim())
      .find((t) => t.startsWith(`${n}=`));
    return o ? o.split("=")[1] : null;
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
  function g() {
    if (!u("jw_user_id")) {
      const t = f();
      h("jw_user_id", t, 31536e3);
    }
    if (!u("jw_session_id")) {
      const t = f();
      return h("jw_session_id", t, 1800), !0;
    }
    return !1;
  }
  function E() {
    if (typeof window > "u" || typeof document > "u") return !1;
    const n = typeof navigator < "u" && navigator.doNotTrack === "1",
      e = document.cookie.includes("jw_opt_out=true"),
      o = window.JourneyWiseConsentGiven === !1;
    return !n && !e && !o;
  }
  function y() {
    let n = localStorage.getItem("jw_device_id");
    return n || ((n = f()), localStorage.setItem("jw_device_id", n)), n;
  }
  function v() {
    const n = sessionStorage.getItem("jw_campaign_origin");
    if (n) return n;
    const e = new URLSearchParams(window.location.search);
    console.log(e);
    const o = [
      "utm_source",
      "utm_campaign",
      "utm_medium",
      "source",
      "campaign",
      "ref",
      "referrer",
    ];
    let t = null;
    for (const i of o) {
      const s = e.get(i);
      if (s) {
        t = `${i}:${s}`;
        break;
      }
    }
    if (!t && document.referrer)
      try {
        const i = new URL(document.referrer),
          s = new URL(window.location.href);
        i.hostname !== s.hostname && (t = `referrer:${i.hostname}`);
      } catch {}
    return t && sessionStorage.setItem("jw_campaign_origin", t), t;
  }
  const k = "https://flight.journeywise.io/api/v1/website-event-tracking";
  function r(n, e) {
    var d, c, l, _;
    if (!E() || window.JourneyWiseConsentGiven === !1) {
      console.warn(
        "[JourneyWise] Tracking skipped: user opted out or DNT enabled."
      );
      return;
    }
    const o = u("jw_user_id"),
      t = u("jw_user_id"),
      i = v(),
      s = {
        identifier: n,
        pageview_id: 409606162,
        platform: "web",
        user_data: {
          anonymous_id: o,
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
            ((_ = e == null ? void 0 : e.fields) == null
              ? void 0
              : _.phoneNumber) || void 0,
        },
        event: "Website Activity",
        subEvent: n,
        metadata: { additional_data: { ...e, campaign_origin: i } },
        referer: e != null && e.url ? e.url : document.referrer,
        device_identifier: t,
        apiKey: window.__JW_API_KEY__ || "",
      };
    fetch(k, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    }).catch((p) => {
      console.warn("Failed to send JourneyWise event:", p);
    });
  }
  function D(n) {
    const e = {};
    for (const [o, t] of n.entries()) o.toLowerCase(), (e[o] = t);
    return e;
  }
  let m = Date.now();
  const O = g();
  function w() {
    r(a.PAGE_VIEW, {
      url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
    }),
      O && A(),
      N(),
      L(),
      b(),
      T();
  }
  function b() {
    const n = window.__JW_API_KEY__;
    !n ||
      !E() ||
      r("test_connection", {
        apiKey: n,
        page_url: location.href,
        hostname: location.hostname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
      });
  }
  function A() {
    const n = u("jw_session_id");
    r(a.SESSION_START, { session_id: n, timestamp: Date.now() });
  }
  function T() {
    const n = [25, 50, 75, 100],
      e = new Set();
    window.addEventListener("scroll", () => {
      const o = window.scrollY,
        t = document.documentElement.scrollHeight - window.innerHeight,
        i = Math.round((o / t) * 100);
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
        (m = Date.now());
    });
  }
  function L() {
    setInterval(() => {
      const n = Date.now(),
        e = Math.floor((n - m) / 1e3);
      r(a.TIME_ON_PAGE, {
        time_spent: e,
        url: location.href,
        session_id: u("jw_session_id"),
        timestamp: Date.now(),
      });
    }, 3e4);
  }
  function N() {
    setInterval(() => {
      const e = Date.now();
      e - m >= 5 * 60 * 1e3 &&
        r(a.SESSION_END, { session_id: u("jw_session_id"), timestamp: e });
    }, 6e4);
  }
  function P() {
    const n = new WeakSet(),
      e = (i) => {
        if (n.has(i)) return;
        n.add(i);
        const s = i.id || i.name || "unnamed_form";
        i.addEventListener("submit", (d) => {
          var S;
          const c = d.submitter;
          if (
            !(
              c &&
              (c.formNoValidate ||
                ((S = c.hasAttribute) == null
                  ? void 0
                  : S.call(c, "formnovalidate")))
            ) &&
            !i.checkValidity()
          )
            return;
          const _ = new FormData(i),
            p = D(_);
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
      o = () => {
        document.querySelectorAll("form").forEach(e);
      };
    o(),
      new MutationObserver(o).observe(document.body, {
        childList: !0,
        subtree: !0,
      });
  }
  function C() {
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
      const o = e.target.closest("a");
      if (!o) return;
      const t = o.getAttribute("href");
      if (!t) return;
      const i = new URL(t, location.href),
        s = i.pathname.split(".").pop().toLowerCase(),
        d = o.hasAttribute("download"),
        c = n.includes(s);
      (d || c) &&
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
  function j() {
    const n = new Set(),
      e = () => {
        document.querySelectorAll("video").forEach((t) => {
          if (n.has(t)) return;
          n.add(t);
          const i = t.id || "unnamed_video";
          let s = [25, 50, 75, 100],
            d = new Set();
          t.addEventListener("play", () => {
            r(a.VIDEO_PLAY, { video_id: i, timestamp: Date.now() });
          }),
            t.addEventListener("pause", () => {
              r(a.VIDEO_PAUSE, {
                video_id: i,
                current_time: t.currentTime,
                timestamp: Date.now(),
              });
            }),
            t.addEventListener("timeupdate", () => {
              const c = Math.floor((t.currentTime / t.duration) * 100);
              s.forEach((l) => {
                c >= l &&
                  !d.has(l) &&
                  (d.add(l),
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
  function W(n, e = {}) {
    const o = {
      ...e,
      url: location.href,
      timestamp: Date.now(),
      visitor_id: u("jw_user_id"),
      session_id: u("jw_session_id"),
      device_identifier: y(),
    };
    r(n, o);
  }
  function I(n, ...e) {
    switch (n) {
      case "init":
        window.__JW_API_KEY__ = e[0];
        break;
      case "track":
        W(...e);
        break;
      default:
        console.warn(`Unknown JourneyWise command: ${n}`);
    }
  }
  function U(n) {
    n.forEach((e) => I(...e));
  }
  function R() {
    const n = history.pushState;
    (history.pushState = function (...e) {
      n.apply(history, e), w();
    }),
      window.addEventListener("popstate", w);
  }
  (function () {
    var o;
    const e = ((o = window.JourneyWise) == null ? void 0 : o.q) || [];
    (window.JourneyWise = function (...t) {
      I(...t);
    }),
      (window.JourneyWise.q = e),
      U(e),
      g(),
      setTimeout(() => {
        w(), v(), j(), C(), P(), R();
      }, 1e3);
  })();
});
