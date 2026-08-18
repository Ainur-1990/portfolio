import fs from "node:fs";
import cheerio from "cheerio";

// ============ Конфиг: добавь свой сайт сюда ============
// selector должен указывать на элемент, содержащий цену
const TARGETS = [
  {
    shop: "shop-one",
    url: "https://example.com/product/1",
    selector: ".product-price",
    product: "Смартфон X100",
  },
  {
    shop: "shop-two",
    url: "https://example.com/product/2",
    selector: "[data-price]",
    product: "Смартфон X100",
  },
];

const CSV_FILE = new URL("./prices.csv", import.meta.url).pathname
  .replace(/^\/([A-Z]:)/, "$1"); // Windows-путь

function toNumber(text) {
  const digits = text.replace(/\s|&nbsp;/g, "").replace(/[^\d.]/g, "");
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) ? n : null;
}

async function fetchPrice(target) {
  const res = await fetch(target.url, {
    headers: { "User-Agent": "Mozilla/5.0 (price-monitor demo)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const $ = cheerio.load(await res.text());
  return toNumber($(target.selector).first().text());
}

function appendCsv(row) {
  const header = "date,product,shop,price";
  const exists = fs.existsSync(CSV_FILE);
  fs.appendFileSync(CSV_FILE, (exists ? "" : header + "\n") + row + "\n", "utf8");
}

const today = new Date().toISOString().slice(0, 10);

for (const t of TARGETS) {
  try {
    const price = await fetchPrice(t);
    if (price == null) throw new Error("цена не распарсена");
    appendCsv(`${today},${t.product},${t.shop},${price}`);
    console.log(`OK  ${t.shop}: ${price} ₽`);
  } catch (err) {
    console.error(`FAIL ${t.shop}: ${err.message}`);
  }
}
