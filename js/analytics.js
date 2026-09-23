(function () {
  "use strict";
  var config = window.CHILLI_CHROMA_SITE || {};
  var measurementId = String(config.ga4MeasurementId || "").trim();
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: true });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);

  function track(eventName, parameters) {
    if (typeof window.gtag === "function") window.gtag("event", eventName, parameters || {});
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    var label = (link.getAttribute("aria-label") || link.textContent || "").trim().slice(0, 100);
    if (/form\.naver\.com/.test(href)) {
      track("generate_lead", { link_url: link.href, link_text: label || "Project Inquiry" });
    } else if (/^mailto:/i.test(href)) {
      track("contact", { method: "email", link_text: label });
    } else if (/^tel:/i.test(href)) {
      track("contact", { method: "phone", link_text: label });
    } else if (/pf\.kakao\.com/.test(href)) {
      track("contact", { method: "kakao", link_url: link.href, link_text: label });
    } else if (link.host && link.host !== window.location.host) {
      track("click", { outbound: true, link_domain: link.host, link_url: link.href, link_text: label });
    }
  });
})();
