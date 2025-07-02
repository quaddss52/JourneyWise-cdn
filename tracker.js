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
  function h() {
    let t = localStorage.getItem("jw_device_id");
    return (
      t || ((t = crypto.randomUUID()), localStorage.setItem("jw_device_id", t)),
      t
    );
  }
  const I = "https://flight.journeywise.io/api/v1/website-event-tracking";
  function s(t, e) {
    if (!E() || window.JourneyWiseConsentGiven === !1) {
      console.warn(
        "[JourneyWise] Tracking skipped: user opted out or DNT enabled."
      );
      return;
    }
    const o = (e == null ? void 0 : e.visitor_id) || a("jw_user_id"),
      n = (e == null ? void 0 : e.visitor_id) || h(),
      i = {
        identifier: t,
        pageview_id: 409606162,
        platform: "web",
        user_data: { anonymous_id: o },
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
    }).catch((r) => {
      console.warn("Failed to send JourneyWise event:", r);
    });
  }
  function D(t) {
    const e = {};
    for (const [o, n] of t.entries()) {
      const i = o.toLowerCase(),
        r = /email|phone|ssn|password/.test(i);
      e[o] = r ? "[REDACTED]" : n;
    }
    return e;
  }
  let _ = Date.now();
  const g = p();
  function f() {
    s(c.PAGE_VIEW, {
      url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
    }),
      g && S(),
      A(),
      k(),
      y(),
      O();
  }
  function y() {
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
        (_ = Date.now());
    });
  }
  function k() {
    setInterval(() => {
      const t = Date.now(),
        e = Math.floor((t - _) / 1e3);
      s(c.TIME_ON_PAGE, {
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
      e - _ >= 5 * 60 * 1e3 &&
        s(c.SESSION_END, { session_id: a("jw_session_id"), timestamp: e });
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
              d = D(r);
            s(c.FORM_SUBMIT, {
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
  function C() {
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
        d = o.hasAttribute("download"),
        m = t.includes(r);
      (d || m) &&
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
  function L() {
    const t = new Set(),
      e = () => {
        document.querySelectorAll("video").forEach((n) => {
          if (t.has(n)) return;
          t.add(n);
          const i = n.id || "unnamed_video";
          let r = [25, 50, 75, 100],
            d = new Set();
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
              const m = Math.floor((n.currentTime / n.duration) * 100);
              r.forEach((l) => {
                m >= l &&
                  !d.has(l) &&
                  (d.add(l),
                  s(c.VIDEO_WATCH_PERCENTAGE, {
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
  function N(t, e = {}) {
    const o = {
      ...e,
      url: location.href,
      timestamp: Date.now(),
      visitor_id: a("jw_user_id"),
      session_id: a("jw_session_id"),
      device_identifier: h(),
    };
    s(t, o);
  }
  function v(t, ...e) {
    switch (t) {
      case "init":
        window.__JW_API_KEY__ = e[0];
        break;
      case "track":
        N(...e);
        break;
      default:
        console.warn(`Unknown JourneyWise command: ${t}`);
    }
  }
  function P(t) {
    t.forEach((e) => v(...e));
  }
  function U() {
    const t = history.pushState;
    (history.pushState = function (...e) {
      t.apply(history, e), f();
    }),
      window.addEventListener("popstate", f);
  }
  (function () {
    var o;
    const e = ((o = window.JourneyWise) == null ? void 0 : o.q) || [];
    (window.JourneyWise = function (...n) {
      v(...n);
    }),
      (window.JourneyWise.q = e),
      P(e),
      p(),
      setTimeout(() => {
        f(), T(), L(), C(), b(), U();
      }, 1e3);
  })();
});
