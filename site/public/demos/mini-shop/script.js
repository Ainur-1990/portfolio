// ============ Состояние ============
let cart = JSON.parse(localStorage.getItem("cart") || "{}"); // { [id]: qty }
const cartQty = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartSum = () =>
  Object.entries(cart).reduce(
    (sum, [id, qty]) => sum + PRODUCTS.find((p) => p.id === Number(id)).price * qty,
    0
  );

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => n.toLocaleString("ru-RU");

// ============ Каталог ============
let activeCategory = "all";
let query = "";

function renderCategories() {
  $("#categories").innerHTML = CATEGORIES.map(
    (c) =>
      `<button class="chip ${c.id === activeCategory ? "active" : ""}" data-cat="${c.id}">${c.name}</button>`
  ).join("");
}

function renderProducts() {
  const list = PRODUCTS.filter(
    (p) =>
      (activeCategory === "all" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(query)
  );
  $("#empty").hidden = list.length > 0;
  $("#products").innerHTML = list
    .map(
      (p) => `
      <article class="product">
        <div class="emoji">${p.emoji}</div>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="row">
          <span class="price">${fmt(p.price)} ₽</span>
          <button class="add-btn ${cart[p.id] ? "in-cart" : ""}" data-add="${p.id}"
                  title="В корзину">${cart[p.id] ? cart[p.id] + "×" : "+"}</button>
        </div>
      </article>`
    )
    .join("");
}

// ============ Корзина ============
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  $("#cart-count").textContent = cartQty();
  $("#cart-total").textContent = fmt(cartSum());
  $("#order-total").textContent = fmt(cartSum());

  const items = Object.entries(cart);
  $("#cart-empty").style.display = items.length ? "none" : "block";
  $("#cart-items").innerHTML = items
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === Number(id));
      return `
        <div class="cart-item">
          <span class="emoji">${p.emoji}</span>
          <div class="info">
            <p>${p.name}</p>
            <small>${fmt(p.price)} ₽/шт</small>
          </div>
          <div class="qty">
            <button data-dec="${p.id}">−</button>
            <span>${qty}</span>
            <button data-inc="${p.id}">+</button>
          </div>
        </div>`;
    })
    .join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  refresh();
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  refresh();
}

function refresh() {
  saveCart();
  renderProducts();
  renderCart();
}

// ============ События (делегирование) ============
document.addEventListener("click", (e) => {
  const cat = e.target.closest("[data-cat]");
  if (cat) {
    activeCategory = cat.dataset.cat;
    renderCategories();
    renderProducts();
  }

  const add = e.target.closest("[data-add]");
  if (add) addToCart(Number(add.dataset.add));

  const inc = e.target.closest("[data-inc]");
  if (inc) changeQty(Number(inc.dataset.inc), 1);

  const dec = e.target.closest("[data-dec]");
  if (dec) changeQty(Number(dec.dataset.dec), -1);
});

$("#search").addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  renderProducts();
});

const showOverlay = (id) => ($(id).hidden = false);
const hideOverlay = (id) => ($(id).hidden = true);

$("#cart-open").onclick = () => showOverlay("#overlay");
$("#cart-close").onclick = () => hideOverlay("#overlay");
$("#overlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) hideOverlay("#overlay");
});
$("#checkout").onclick = () => {
  if (!cartQty()) return;
  hideOverlay("#overlay");
  showOverlay("#checkout-overlay");
};
$("#checkout-close").onclick = () => hideOverlay("#checkout-overlay");
$("#checkout-overlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) hideOverlay("#checkout-overlay");
});

// ============ Маска телефона (как на лендинге) ============
const phone = $("#order-phone");
phone.addEventListener("input", () => {
  let d = phone.value.replace(/\D/g, "").slice(0, 11);
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d && !d.startsWith("7")) d = "7" + d;
  let out = d ? "+7" : "";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 5) out += ") " + d.slice(4, 7);
  if (d.length >= 8) out += "-" + d.slice(7, 9);
  if (d.length >= 10) out += "-" + d.slice(9, 11);
  phone.value = out;
});

// ============ Оформление заказа ============
$("#order-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target.elements;
  const status = $("#order-status");
  status.className = "form-status";
  [f.name, f.phone, f.address].forEach((el) => el.classList.remove("invalid"));

  const invalid =
    !f.name.value.trim() ? f.name :
    f.phone.value.replace(/\D/g, "").length !== 11 ? f.phone :
    !f.address.value.trim() ? f.address : null;

  if (invalid) {
    invalid.classList.add("invalid");
    status.textContent = "Заполни все поля (телефон полностью)";
    status.classList.add("err");
    invalid.focus();
    return;
  }

  // Здесь подключается реальная отправка заказа (API, Telegram, e-mail)
  status.textContent = "Заказ оформлен! Продавец свяжется с тобой.";
  status.classList.add("ok");
  cart = {};
  setTimeout(() => {
    hideOverlay("#checkout-overlay");
    e.target.reset();
    refresh();
  }, 1500);
});

// ============ Старт ============
renderCategories();
renderProducts();
renderCart();
