// Появление блоков при скролле
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Маска телефона +7 (___) ___-__-__
const phone = document.getElementById("phone");
phone.addEventListener("input", () => {
  let digits = phone.value.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;

  let out = "+7";
  if (digits.length > 1) out += " (" + digits.slice(1, 4);
  if (digits.length >= 5) out += ") " + digits.slice(4, 7);
  if (digits.length >= 8) out += "-" + digits.slice(7, 9);
  if (digits.length >= 10) out += "-" + digits.slice(9, 11);
  phone.value = out;
});

// Валидация и отправка
const form = document.getElementById("booking-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.elements.name;
  const phoneDigits = phone.value.replace(/\D/g, "");

  [name, phone].forEach((f) => f.classList.remove("invalid"));
  status.className = "form-status";

  if (!name.value.trim()) {
    name.classList.add("invalid");
    status.textContent = "Укажи имя";
    status.classList.add("err");
    name.focus();
    return;
  }
  if (phoneDigits.length !== 11) {
    phone.classList.add("invalid");
    status.textContent = "Введи телефон полностью";
    status.classList.add("err");
    phone.focus();
    return;
  }

  // Здесь подключается отправка заявки: Telegram-бот, e-mail или CRM
  status.textContent = "Заявка отправлена! Перезвоним в течение 15 минут.";
  status.classList.add("ok");
  form.reset();
});
