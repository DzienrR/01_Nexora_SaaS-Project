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

    revealTargets.forEach((target, index) => {
      target.classList.add("reveal");
      target.style.setProperty("--delay", `${index * 60}ms`);
      observer.observe(target);
    });
  } else {
    revealTargets.forEach((target, index) => {
      target.classList.add("reveal", "is-visible");
      target.style.setProperty("--delay", `${index * 60}ms`);
    });
  }

  document.querySelectorAll("[data-local-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const status = form.querySelector("[data-form-status]");
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
      billingButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      document.querySelectorAll("[data-price]").forEach((price) => {
        price.textContent = price.dataset[period];
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
})();
