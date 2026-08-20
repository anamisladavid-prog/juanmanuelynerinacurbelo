const menuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const header = document.querySelector("[data-header]");

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("site-header--scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const demoCheckoutButton = document.querySelector("[data-demo-checkout]");
const demoCheckoutModal = document.querySelector("[data-demo-checkout-modal]");
const demoCheckoutCloseButtons = document.querySelectorAll("[data-demo-checkout-close]");

if (demoCheckoutButton && demoCheckoutModal) {
  const closeDemoCheckout = () => {
    demoCheckoutModal.hidden = true;
    document.body.classList.remove("demo-checkout-open");
    demoCheckoutButton.focus();
  };

  demoCheckoutButton.addEventListener("click", () => {
    demoCheckoutModal.hidden = false;
    document.body.classList.add("demo-checkout-open");
    demoCheckoutModal.querySelector(".demo-checkout__close")?.focus();
  });

  demoCheckoutCloseButtons.forEach((button) => {
    button.addEventListener("click", closeDemoCheckout);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !demoCheckoutModal.hidden) closeDemoCheckout();
  });
}

const messagesToggle = document.querySelector("[data-messages-toggle]");
const messagesPanel = document.querySelector("[data-messages-panel]");

if (messagesToggle && messagesPanel) {
  const setMessagesOpen = (open, shouldScroll = false) => {
    messagesPanel.hidden = !open;
    messagesToggle.setAttribute("aria-expanded", String(open));
    const arrow = messagesToggle.querySelector("[aria-hidden='true']");
    if (arrow) arrow.textContent = open ? "↑" : "↓";
    if (open && shouldScroll) {
      messagesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  messagesToggle.addEventListener("click", () => {
    setMessagesOpen(messagesPanel.hidden, true);
  });

  if (window.location.hash === "#mensajes") setMessagesOpen(true);
}
