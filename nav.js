// =====================================================================
// Site navigation + 联系我 contact modal
// =====================================================================

// ─── Contact info ─────────────────────────────────────────────────────
// Replace the placeholders below with your own contact channels.
const CONTACT = {
  email: "shaoyanyan91@163.com",
  phone: "+86 133-1122-1180",          // TODO: 替换为真实手机号
  wechatId: "shaoyanyan3566",            // TODO: 替换为真实微信号
  // To use a real QR image, drop a file at /wechat-qr.jpg (or .png)
  // and set this to "wechat-qr.jpg". Falls back to a placeholder svg.
  wechatQRSrc: "wechat-qr.jpg",
};

// ─── Mobile menu toggle ───────────────────────────────────────────────
document.querySelectorAll(".site-nav").forEach((nav) => {
  const toggle = nav.querySelector(".nav-toggle");
  const links = nav.querySelectorAll(".nav-links a");

  if (!toggle) return;

  const setOpen = (open) => {
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("menu-open"));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
});

// ─── Contact modal ────────────────────────────────────────────────────
function buildContactModal() {
  if (document.getElementById("contactModal")) return;

  // Resolve QR src — if user dropped wechat-qr.jpg at root, find it relative
  // to the page (posts/ subpages need "../wechat-qr.jpg").
  const inPostsDir = /\/posts\//.test(window.location.pathname);
  const qrSrc = CONTACT.wechatQRSrc
    ? (inPostsDir ? "../" : "") + CONTACT.wechatQRSrc
    : "";

  const modal = document.createElement("div");
  modal.id = "contactModal";
  modal.className = "contact-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "contactModalTitle");
  modal.hidden = true;

  modal.innerHTML = `
    <div class="contact-modal-backdrop" data-close></div>
    <div class="contact-modal-panel" role="document">
      <button type="button" class="contact-modal-close" data-close aria-label="关闭">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <path d="M2 2 L12 12 M12 2 L2 12"></path>
        </svg>
      </button>

      <div class="contact-modal-head">
        <p class="eyebrow">Contact</p>
        <h2 id="contactModalTitle">几种方式都可以联系到我</h2>
        <p class="contact-modal-sub">邮件回复最快，紧急事项可加微信。</p>
      </div>

      <div class="contact-wechat">
        <div class="contact-wechat-qr">
          ${qrSrc
            ? `<img src="${qrSrc}" alt="微信二维码" />`
            : `<div class="contact-qr-placeholder" aria-label="微信二维码占位">
                 <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                   <rect width="100" height="100" fill="#fff"/>
                   <g fill="#0f172a">
                     <rect x="6" y="6" width="22" height="22"/>
                     <rect x="10" y="10" width="14" height="14" fill="#fff"/>
                     <rect x="14" y="14" width="6" height="6"/>
                     <rect x="72" y="6" width="22" height="22"/>
                     <rect x="76" y="10" width="14" height="14" fill="#fff"/>
                     <rect x="80" y="14" width="6" height="6"/>
                     <rect x="6" y="72" width="22" height="22"/>
                     <rect x="10" y="76" width="14" height="14" fill="#fff"/>
                     <rect x="14" y="80" width="6" height="6"/>
                   </g>
                 </svg>
                 <span class="contact-qr-hint">替换 wechat-qr.jpg</span>
               </div>`
          }
        </div>
        <div class="contact-wechat-meta">
          <div class="contact-label">微信</div>
          <div class="contact-value">ID: ${CONTACT.wechatId}</div>
        </div>
      </div>

      <div class="contact-modal-body">
        <div class="contact-list">
          <button class="contact-row" type="button" data-copy="${CONTACT.email}" data-toast="邮箱已复制">
            <span class="contact-icon contact-icon--mail" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            </span>
            <span class="contact-row-body">
              <span class="contact-label">邮箱</span>
              <span class="contact-value">${CONTACT.email}</span>
            </span>
            <span class="contact-action">复制</span>
          </button>

          <button class="contact-row" type="button" data-copy="${CONTACT.phone}" data-toast="手机号已复制">
            <span class="contact-icon contact-icon--phone" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span class="contact-row-body">
              <span class="contact-label">手机</span>
              <span class="contact-value">${CONTACT.phone}</span>
            </span>
            <span class="contact-action">复制</span>
          </button>

        </div>
      </div>

      <div class="contact-toast" aria-live="polite"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // ── wiring ─────────────────────────────────────────────────────────
  const closers = modal.querySelectorAll("[data-close]");
  closers.forEach((el) => el.addEventListener("click", () => closeContactModal()));

  const toast = modal.querySelector(".contact-toast");
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  modal.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
        showToast(btn.getAttribute("data-toast") || "已复制");
      } catch (err) {
        // Fallback for browsers without clipboard permission
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); showToast(btn.getAttribute("data-toast") || "已复制"); }
        catch { showToast("复制失败，请手动复制"); }
        document.body.removeChild(ta);
      }
    });
  });
}

function openContactModal() {
  buildContactModal();
  const modal = document.getElementById("contactModal");
  if (!modal) return;
  modal.hidden = false;
  // force reflow so the transition kicks in
  void modal.offsetWidth;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeContactModal() {
  const modal = document.getElementById("contactModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { modal.hidden = true; }, 220);
}

// Intercept any .nav-cta or .footer-cta click and open the modal instead of mailto
document.querySelectorAll(".nav-cta, .footer-cta").forEach((cta) => {
  cta.addEventListener("click", (e) => {
    e.preventDefault();
    openContactModal();
  });
});

// Esc to close modal
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modal = document.getElementById("contactModal");
    if (modal && modal.classList.contains("open")) closeContactModal();
  }
});
