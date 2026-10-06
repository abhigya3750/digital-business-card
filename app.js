/* ==========================================================================
   Executive Digital Business Card Engine - Abhigya & Kamal (Grey Tone Luxe)
   ========================================================================== */

const PROFILES = {
  abhigya: {
    id: "abhigya",
    name: "Abhigya Kanungo",
    headline: "Product & Growth",
    role: "Product & Growth",
    subRole: "Founding Member @ Nerds",
    org: "Nerds (New Era Rebels for Disruptive Solutions)",
    title: "Founding Member - Product & Growth",
    phone: "+919993805217",
    displayPhone: "+91 9993805217",
    email: "info@nerds.co.in",
    personalEmail: "kanungoabhigya3750@gmail.com",
    linkedIn: "https://www.linkedin.com/in/abhigyakanungo",
    displayLinkedIn: "linkedin.com/in/abhigyakanungo",
    website: "https://nerds.co.in",
    displayWebsite: "nerds.co.in",
    portfolio: "https://abhigya-portofolio.vercel.app/",
    displayPortfolio: "abhigya-portofolio.vercel.app",
    initials: "AK",
    themeClass: "theme-nerds",
    photoSrc: "assets/abhigya_photo.jpg",
    qrBgSrc: "assets/qr_pass_bg.png",
    logoSrc: "assets/nerds_logo.png",
    logoFallback: "NERDS",
    waMessage: "Hi Abhigya, great connecting with you! Let's catch up and stay connected."
  },
  kamal: {
    id: "kamal",
    name: "Kamal Parihar",
    headline: "Marketing & Growth Executive | Fingpay",
    role: "Marketing & Growth Executive",
    subRole: "Fingpay (Tapits Technologies)",
    org: "Tapits Technologies (Fingpay)",
    title: "Marketing & Growth Executive",
    phone: "+919770904289",
    displayPhone: "+91 97709 04289",
    email: "Kamal@tapits.in",
    personalEmail: "Kparihar015@gmail.com",
    linkedIn: "https://www.linkedin.com/in/kamal-parihar",
    displayLinkedIn: "linkedin.com/in/kamal-parihar",
    website: "https://www.fingpay.co.in",
    displayWebsite: "fingpay.co.in",
    portfolio: "",
    displayPortfolio: "",
    initials: "KP",
    themeClass: "theme-fingpay",
    photoSrc: "assets/kamal_photo.jpg",
    qrBgSrc: "assets/kamal_qr_pass_bg.jpg",
    logoSrc: "assets/fingpay_logo.jpg",
    logoFallback: "FINGPAY",
    waMessage: "Hi Kamal, great connecting with you! Let's stay connected."
  }
};

let currentProfile = PROFILES.abhigya;
let isFlipped = false;

document.addEventListener("DOMContentLoaded", () => {
  // Register Service Worker for Offline-First support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log("Service Worker registered.");
    }).catch((err) => {
      console.log("Service worker registration failed:", err);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const rawParam = (urlParams.get("profile") || urlParams.get("p") || urlParams.get("name") || urlParams.get("id") || "").toLowerCase().trim();

  const ALIASES = {
    abhigya: "abhigya", ak: "abhigya",
    kamal: "kamal", kp: "kamal"
  };

  const isKamalPage = window.location.pathname.toLowerCase().includes("kamal");
  const defaultId = isKamalPage ? "kamal" : (window.DEFAULT_PROFILE_ID || "abhigya");

  const targetId = ALIASES[rawParam] || (PROFILES[rawParam] ? rawParam : defaultId);
  currentProfile = PROFILES[targetId] || PROFILES[defaultId] || PROFILES.abhigya;

  if (urlParams.get("admin") === "true" || urlParams.get("switch") === "true") {
    const selBox = document.getElementById("profileSelectorBox");
    if (selBox) selBox.style.display = "block";
  }

  syncProfileSelectors(currentProfile.id);
  renderProfileCard(currentProfile);

  // Keyboard shortcut (Escape to flip back)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isFlipped) {
      toggleCardFlip();
    }
  });
});

function syncProfileSelectors(profileId) {
  const topSel = document.getElementById("profileSelect");
  if (topSel) topSel.value = profileId;
}

function switchProfile(profileId) {
  if (PROFILES[profileId]) {
    currentProfile = PROFILES[profileId];
    if (isFlipped) toggleCardFlip();
    syncProfileSelectors(profileId);
    renderProfileCard(currentProfile);
    showToast(`Loaded ${currentProfile.name}'s Card`);
  }
}

function renderProfileCard(prof) {
  document.body.className = `${prof.themeClass} grey-theme`;

  // Name & Headline
  document.getElementById("profName").textContent = prof.name;
  document.getElementById("profHeadline").textContent = prof.headline;
  document.getElementById("qrName").textContent = prof.name;

  const statusTxt = document.getElementById("statusBadgeText");
  if (statusTxt) {
    statusTxt.textContent = prof.id === "kamal" ? "Marketing & Growth | Fingpay" : (prof.subRole || "Founding Member @ Nerds");
  }

  const qrRole = document.getElementById("qrRole");
  const qrSubRole = document.getElementById("qrSubRole");
  if (qrRole) qrRole.textContent = prof.role || "Marketing & Growth Executive";
  if (qrSubRole) qrSubRole.textContent = prof.id === "kamal" ? "Fingpay (Tapits Technologies)" : (prof.subRole || "Founding Member @ Nerds");

  // Hero Photo
  const photoImg = document.getElementById("profilePhotoImg");
  if (photoImg && prof.photoSrc) {
    photoImg.src = prof.photoSrc;
    photoImg.alt = prof.name;
  }

  // QR Pass Card Back Background
  const cardBack = document.querySelector(".card-back");
  if (cardBack) {
    const bgUrl = prof.qrBgSrc || "assets/qr_pass_bg.png";
    cardBack.style.backgroundImage = `url('${bgUrl}')`;
  }

  // Company Logo Badge
  const compImg = document.getElementById("compLogoImg");
  const compFallback = document.getElementById("compLogoFallback");
  
  if (prof.logoSrc) {
    compImg.src = prof.logoSrc;
    compImg.alt = prof.org;
    compImg.style.display = "block";
    compFallback.style.display = "none";
  } else {
    compImg.style.display = "none";
    compFallback.textContent = prof.logoFallback;
    compFallback.style.display = "block";
  }

  // WhatsApp Link
  const waBtn = document.getElementById("btnWhatsapp");
  if (waBtn) {
    const cleanPhone = prof.phone.replace(/[^0-9]/g, "");
    waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prof.waMessage)}`;
  }

  // LinkedIn
  const liBtn = document.getElementById("btnLinkedIn");
  const dispLI = document.getElementById("dispLinkedIn");
  if (liBtn && dispLI) {
    liBtn.href = prof.linkedIn;
    dispLI.textContent = prof.displayLinkedIn;
  }

  // Company Website Link
  const webBtn = document.getElementById("btnWebsite");
  const dispWeb = document.getElementById("dispWebsite");
  const lblWeb = document.getElementById("lblWebsite");
  if (webBtn && dispWeb) {
    if (prof.website) {
      webBtn.href = prof.website;
      dispWeb.textContent = prof.displayWebsite;
      if (lblWeb) lblWeb.textContent = prof.id === "kamal" ? "FINGPAY WEBSITE" : "NERDS WEBSITE";
      webBtn.style.display = "flex";
    } else {
      webBtn.style.display = "none";
    }
  }

  // Personal Portfolio Link (Abhigya)
  const portBtn = document.getElementById("btnPortfolio");
  const dispPort = document.getElementById("dispPortfolio");
  if (portBtn && dispPort) {
    if (prof.portfolio) {
      portBtn.href = prof.portfolio;
      dispPort.textContent = prof.displayPortfolio;
      portBtn.style.display = "flex";
    } else {
      portBtn.style.display = "none";
    }
  }

  // Work Email
  const btnEmail = document.getElementById("btnEmail");
  const dispEmail = document.getElementById("dispEmail");
  const btnCopyEmail = document.getElementById("btnCopyEmail");
  if (dispEmail) dispEmail.textContent = prof.email;
  if (btnEmail) {
    btnEmail.onclick = (e) => handleEmailClick(e, prof.email);
  }
  if (btnCopyEmail) {
    btnCopyEmail.onclick = (e) => copyToClipboard(e, prof.email, "Work email copied!");
  }

  // Personal Email
  const pEmailBtn = document.getElementById("btnEmailPersonal");
  const dispPEmail = document.getElementById("dispEmailPersonal");
  const btnCopyPEmail = document.getElementById("btnCopyPEmail");
  if (pEmailBtn && dispPEmail) {
    if (prof.personalEmail) {
      dispPEmail.textContent = prof.personalEmail;
      pEmailBtn.onclick = (e) => handleEmailClick(e, prof.personalEmail);
      if (btnCopyPEmail) {
        btnCopyPEmail.onclick = (e) => copyToClipboard(e, prof.personalEmail, "Personal email copied!");
      }
      pEmailBtn.style.display = "flex";
    } else {
      pEmailBtn.style.display = "none";
    }
  }

  // Phone
  const btnPhone = document.getElementById("btnPhone");
  const dispPhone = document.getElementById("dispPhone");
  const btnCopyPhone = document.getElementById("btnCopyPhone");
  if (dispPhone) dispPhone.textContent = prof.displayPhone;
  if (btnPhone) {
    btnPhone.onclick = (e) => handlePhoneClick(e, prof.phone);
  }
  if (btnCopyPhone) {
    btnCopyPhone.onclick = (e) => copyToClipboard(e, prof.phone, "Phone number copied!");
  }

  // Generate Bulletproof QR Code
  generateQrCode(window.location.href);
}

/* ==========================================================================
   CARD FLIP ENGINE
   ========================================================================== */
function toggleCardFlip() {
  const cardInner = document.getElementById("cardInner");
  if (!cardInner) return;
  
  isFlipped = !isFlipped;
  if (isFlipped) {
    cardInner.classList.add("flipped");
  } else {
    cardInner.classList.remove("flipped");
  }
}

/* ==========================================================================
   BULLETPROOF QR CODE GENERATOR ENGINE (Dual Fallback)
   ========================================================================== */
function generateQrCode(text) {
  const qrContainer = document.getElementById("qrcode");
  if (!qrContainer) return;
  qrContainer.innerHTML = "";

  try {
    if (typeof QRCode !== "undefined") {
      new QRCode(qrContainer, {
        text: text,
        width: 210,
        height: 210,
        colorDark: "#06142e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      useFallbackQrImage(qrContainer, text);
    }
  } catch (err) {
    console.warn("QRCode library rendering failed, using high-res QRServer fallback:", err);
    useFallbackQrImage(qrContainer, text);
  }
}

function useFallbackQrImage(container, text) {
  const qrImg = document.createElement("img");
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(text)}&margin=10`;
  qrImg.alt = "Digital Pass QR Code";
  qrImg.style.width = "100%";
  qrImg.style.height = "100%";
  qrImg.style.borderRadius = "12px";
  container.appendChild(qrImg);
}

/* ==========================================================================
   vCard Generation & Sharing (vCard 3.0 Standard)
   ========================================================================== */
function downloadVCard() {
  const p = currentProfile;

  const vCardContent = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.name}`,
    `N:${p.name.split(" ").slice(-1)[0]};${p.name.split(" ").slice(0, -1).join(" ")};;;`,
    `ORG:${p.org}`,
    `TITLE:${p.title}`,
    `TEL;TYPE=CELL,VOICE:${p.phone}`,
    `EMAIL;TYPE=WORK:${p.email}`,
    p.personalEmail ? `EMAIL;TYPE=HOME,INTERNET:${p.personalEmail}` : "",
    `URL;TYPE=WORK:${p.website || ""}`,
    p.portfolio ? `URL;TYPE=PERSONAL:${p.portfolio}` : "",
    `URL;TYPE=LINKEDIN:${p.linkedIn}`,
    `NOTE:Digital Business Card - ${p.name}`,
    "END:VCARD"
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8;" });
  const filename = `${p.name.replace(/\s+/g, "_")}_Contact.vcf`;

  if (navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: "text/vcard" })] })) {
    const file = new File([blob], filename, { type: "text/vcard" });
    navigator.share({
      files: [file],
      title: `${p.name} Contact Card`,
      text: `Save ${p.name}'s contact card`
    }).catch(() => {
      triggerDirectDownload(blob, filename);
    });
  } else {
    triggerDirectDownload(blob, filename);
  }
}

function triggerDirectDownload(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  showToast("Contact card downloaded!");
}

/* Helper Email & Phone Click */
function handleEmailClick(e, email) {
  if (e.target.closest(".copy-icon-btn")) return;
  window.location.href = `mailto:${email}`;
}

function handlePhoneClick(e, phone) {
  if (e.target.closest(".copy-icon-btn")) return;
  window.location.href = `tel:${phone}`;
}

/* Clipboard Helper & Toast Notifications */
function copyToClipboard(event, text, successMsg) {
  if (event) event.stopPropagation();
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || "Copied to clipboard!");
    }).catch(() => {
      fallbackCopyTextToClipboard(text, successMsg);
    });
  } else {
    fallbackCopyTextToClipboard(text, successMsg);
  }
}

function fallbackCopyTextToClipboard(text, successMsg) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(successMsg || "Copied to clipboard!");
  } catch (err) {
    showToast("Failed to copy");
  }
  document.body.removeChild(textArea);
}

/* Self-Intro WhatsApp Connect */
function buildWaIntroLink(e) {
  e.preventDefault();
  const input = document.getElementById("waIntroInput");
  const introText = (input ? input.value.trim() : "");
  const p = currentProfile;
  const cleanPhone = p.phone.replace(/[^0-9]/g, "");
  const base = `Hi Abhigya, great connecting with you! Let's catch up and stay connected.`;
  const fullMsg = introText ? `${introText} — ${base}` : base;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMsg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}
