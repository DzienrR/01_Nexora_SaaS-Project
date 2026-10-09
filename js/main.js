(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  const closeMenu = () => {
    if (!header || !menuToggle) return;
    header.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  if (header && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      header.classList.toggle("is-menu-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    header.querySelectorAll(".primary-nav a, .nav-cta a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  const pageTitles = {
    home: "Work Smarter. Scale Faster | Nexora",
    features: "Features for Modern Teams | Nexora",
    dashboard: "Product Dashboard | Nexora",
    pricing: "Simple Pricing | Nexora",
    about: "About Nexora | Nexora",
    resources: "Resources for Better Work | Nexora",
    contact: "Contact Nexora | Nexora"
  };
  const routeNames = Object.keys(pageTitles);
  const pageViews = [...document.querySelectorAll("[data-page-view]")];
  const viewsByRoute = new Map(pageViews.map((view) => [view.dataset.pageView, view]));
  const navLinks = document.querySelectorAll(".primary-nav a, .nav-cta a");

  if (pageViews.length) {
    const isRoute = (route) => routeNames.includes(route);
    let activeView = pageViews.find((view) => !view.hidden) || null;

    const showPage = (route, { targetId, scroll = true } = {}) => {
      const nextView = viewsByRoute.get(route);
      if (!nextView) return;

      if (activeView !== nextView) {
        if (activeView) activeView.hidden = true;
        nextView.hidden = false;
        activeView = nextView;
      }
      document.title = pageTitles[route];
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = nextView.dataset.pageDescription;

      navLinks.forEach((link) => {
        const linkRoute = link.getAttribute("href")?.slice(1);
        if (linkRoute === route) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
      closeMenu();

      if (!scroll) return;
      const target = targetId && activeView.querySelector(`#${CSS.escape(targetId)}`);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };

    const handleLocationChange = () => {
      const hash = window.location.hash.slice(1);
      const stateRoute = window.history.state?.route;
      if (isRoute(hash)) {
        showPage(hash);
      } else if (isRoute(stateRoute)) {
        const activeView = viewsByRoute.get(stateRoute);
        const target = activeView?.querySelector(`#${CSS.escape(hash)}`);
        showPage(stateRoute, { targetId: target ? hash : undefined });
      }
    };

    const initialHash = window.location.hash.slice(1);
    const initialRoute = isRoute(initialHash) ? initialHash : "home";
    const currentState = window.history.state;
    const nextState = currentState && typeof currentState === "object" ? { ...currentState, route: initialRoute } : { route: initialRoute };
    if (!isRoute(initialHash)) {
      window.history.replaceState(nextState, "", "#home");
    } else {
      window.history.replaceState(nextState, "", window.location.href);
    }
    showPage(initialRoute, { scroll: false });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      const route = link.dataset.pageRoute || href?.slice(1);
      if (!isRoute(route) || (!link.dataset.routeTarget && !href?.startsWith("#"))) return;

      event.preventDefault();
      const targetId = link.dataset.routeTarget;
      const nextHash = `#${route}`;
      if (window.location.hash !== nextHash) {
        const state = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
        window.history.pushState({ ...state, route }, "", nextHash);
      }
      showPage(route, { targetId });
    });

    window.addEventListener("hashchange", handleLocationChange);
  }

  const revealTargets = document.querySelectorAll(
    "main section, .feature-card, .workflow-card, .plan-card, .resource-card, .value-card, .milestone, .dashboard-shell, .form-card, .contact-aside, .article, .cta-band"
  );

  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach((target) => {
      target.classList.add("reveal");
      observer.observe(target);
    });
  } else {
    revealTargets.forEach((target) => {
      target.classList.add("reveal", "is-visible");
    });
  }

  document.querySelectorAll("[data-local-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const status = form.querySelector("[data-form-status]") || form.parentElement?.querySelector("[data-form-status]");
      if (!status) return;

      if (form.dataset.localForm === "newsletter") {
        status.textContent = "Preview only: your address was checked in this browser; no signup was sent.";
      } else {
        status.textContent = "Preview only: your message was checked in this browser; it was not sent.";
      }
      form.reset();
    });
  });

  const billingButtons = document.querySelectorAll("[data-billing]");
  billingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const period = button.dataset.billing;
      const pricePeriod = period === "yearly" ? "year" : "month";
      billingButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      document.querySelectorAll("[data-price]").forEach((price) => {
        price.textContent = price.dataset[pricePeriod];
      });
      document.querySelectorAll("[data-price-period]").forEach((label) => {
        label.textContent = period === "yearly" ? "per seat / month, billed yearly" : "per seat / month";
      });
    });
  });

  const tabs = [...document.querySelectorAll("[data-dashboard-tab]")];
  if (tabs.length) {
    const selectTab = (tab) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    };

    selectTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        tabs[next].focus();
        selectTab(tabs[next]);
      });
    });
  }

  const filters = [...document.querySelectorAll("[data-resource-filter]")];
  if (filters.length) {
    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.resourceFilter;
        filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        document.querySelectorAll("[data-resource-category]").forEach((card) => {
          card.hidden = category !== "all" && card.dataset.resourceCategory !== category;
        });
      });
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.documentElement.classList.add("is-enhanced");
})();
