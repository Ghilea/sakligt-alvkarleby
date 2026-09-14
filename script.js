const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 16);
}

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  nav?.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (year) year.textContent = String(new Date().getFullYear());
updateHeader();


const interestForm = document.querySelector("[data-interest-form]");
const messageField = interestForm?.querySelector("#message");
const characterCount = interestForm?.querySelector("[data-character-count]");
const mailFallback = interestForm?.querySelector("[data-mail-fallback]");
const mailText = interestForm?.querySelector("[data-mail-text]");
const copyMailButton = interestForm?.querySelector("[data-copy-mail]");
const copyStatus = interestForm?.querySelector("[data-copy-status]");

messageField?.addEventListener("input", () => {
  if (characterCount) characterCount.textContent = String(messageField.value.length);
});

interestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!interestForm.reportValidity()) return;

  const data = new FormData(interestForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const connection = String(data.get("connection") || "").trim();
  const contribution = String(data.get("contribution") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = "Intresseanmälan – " + name;
  const body = [
    "Hej Sakligt Älvkarleby,",
    "",
    "Jag vill gärna veta mer om initiativet.",
    "",
    "Förnamn: " + name,
    "E-post: " + email,
    "Koppling till Älvkarleby: " + (connection || "Inte angivet"),
    "Jag vill helst bidra genom: " + contribution,
    "",
    "Om mig och mitt intresse:",
    message,
    "",
    "Vänliga hälsningar",
    name
  ].join("\n");

  if (mailText) mailText.value = "Ämne: " + subject + "\n\n" + body;
  if (mailFallback) mailFallback.hidden = false;
  window.location.href =
    "mailto:sakligtalvkarleby@outlook.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);
});

copyMailButton?.addEventListener("click", async () => {
  if (!mailText) return;
  try {
    await navigator.clipboard.writeText(mailText.value);
    if (copyStatus) copyStatus.textContent = "Texten är kopierad.";
  } catch {
    mailText.select();
    document.execCommand("copy");
    if (copyStatus) copyStatus.textContent = "Texten är markerad och kopierad.";
  }
});
