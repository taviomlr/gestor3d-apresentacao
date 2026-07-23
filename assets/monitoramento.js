(() => {
  const CLARITY_PROJECT_ID = "xqwnxan7ee";
  const REF_KEYS = ["ref", "origem", "utm_source", "utm_campaign"];

  const params = new URLSearchParams(window.location.search);
  const explicitRef = REF_KEYS.map((key) => params.get(key)).find(Boolean);

  if (explicitRef) {
    sessionStorage.setItem("gestor3d_ref", explicitRef);
  }

  const ref = explicitRef || sessionStorage.getItem("gestor3d_ref") || "link_sem_ref";

  document.addEventListener("DOMContentLoaded", () => {
    preserveReferenceInInternalLinks(ref);
  });

  if (!CLARITY_PROJECT_ID || CLARITY_PROJECT_ID.includes("COLE_SEU_ID")) {
    return;
  }

  installClarity(CLARITY_PROJECT_ID);

  window.clarity("set", "site", "gestor3d");
  window.clarity("set", "pagina", getPageName());
  window.clarity("set", "ref", ref);

  if (document.referrer) {
    window.clarity("set", "referenciador", document.referrer);
  }

  function installClarity(projectId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);
  }

  function getPageName() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("/apresentacao/")) {
      return "apresentacao";
    }

    if (path.includes("/manual/")) {
      return "manual";
    }

    return "inicio";
  }

  function preserveReferenceInInternalLinks(currentRef) {
    if (!currentRef || currentRef === "link_sem_ref") {
      return;
    }

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const url = new URL(href, window.location.href);

      if (url.origin !== window.location.origin) {
        return;
      }

      if (!url.searchParams.has("ref")) {
        url.searchParams.set("ref", currentRef);
        link.href = url.toString();
      }
    });
  }
})();
