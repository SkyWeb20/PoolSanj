const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const cursor = document.getElementById("custom-cursor");

let particles = [];
const particleCount = window.innerWidth > 768 ? 280 : 240;
const maxDistance = 120;

let mouse = {
  x: undefined,
  y: undefined,
  radius: 150,
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 1.5 + 1;
    this.density = Math.random() * 30 + 1;
  }

  update() {
    if (mouse.x !== undefined) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistanceMouse = mouse.radius;
      let force = (maxDistanceMouse - distance) / maxDistanceMouse;

      if (distance < maxDistanceMouse) {
        this.x -= forceDirectionX * force * this.density * 0.6;
        this.y -= forceDirectionY * force * this.density * 0.6;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.beginPath();
        const opacity = 1 - distance / maxDistance;
        let lineOpacity = opacity;

        if (mouse.x !== undefined) {
          const dxMouse = particles[i].x - mouse.x;
          const dyMouse = particles[i].y - mouse.y;
          const distanceMouse = Math.sqrt(
            dxMouse * dxMouse + dyMouse * dyMouse
          );
          if (distanceMouse < mouse.radius) {
            lineOpacity = 1;
          }
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

let currentDollarRate = 0;
let allGoldData = [];
const rialInput = document.getElementById("rial");
const tomanInput = document.getElementById("toman");
const dollarInput = document.getElementById("dollar");
const rialText = document.getElementById("rial-text");
const tomanText = document.getElementById("toman-text");
const dollarText = document.getElementById("dollar-text");
const dollarRateElement = document.getElementById("dollar-rate");
const refreshRateBtn = document.getElementById("refresh-rate");
const allGoldItemsContainer = document.getElementById(
  "all-gold-items-container"
);
const goldLastUpdateElement = document.getElementById("gold-last-update");

function numberToWords(numStr) {
  if (!numStr || numStr === "0") return "صفر";
  numStr = String(numStr).replace(/[^0-9]/g, "");
  if (numStr.startsWith("-"))
    return "منفی " + numberToWords(numStr.substring(1));
  const ones = [
    "",
    "یک",
    "دو",
    "سه",
    "چهار",
    "پنج",
    "شش",
    "هفت",
    "هشت",
    "نه",
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const hundreds = [
    "",
    "یکصد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];
  const scales = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
    "کوآدریلیون",
    "کوینتیلیون",
    "سکستیلیون",
    "سپتیلیون",
    "اکتیلیون",
    "نونیلیون",
    "دسیلیون",
  ];
  function convertGroup(n) {
    let result = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;
    if (h > 0) result += hundreds[h];
    if (t >= 2) {
      if (result) result += " و ";
      result += tens[t];
      if (o > 0) result += " و " + ones[o];
    } else if (t === 1 || o > 0) {
      if (result) result += " و ";
      result += ones[t * 10 + o];
    }
    return result;
  }
  if (numStr.length > scales.length * 3) return "عدد بسیار بزرگ است";
  const groups = [];
  let tempStr = numStr;
  while (tempStr.length > 0) {
    groups.push(parseInt(tempStr.slice(-3), 10));
    tempStr = tempStr.slice(0, -3);
  }
  let result = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) {
      if (result) result += " و ";
      result += convertGroup(groups[i]);
      if (i > 0 && scales[i]) result += " " + scales[i];
    }
  }
  return result;
}

function formatNumber(numStr) {
  if (typeof numStr !== "string") numStr = String(numStr);
  const parts = numStr.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function cleanNumber(str) {
  return String(str).replace(/,/g, "");
}
function getGoldIcon(symbol) {
  const icons = {
    IR_GOLD_18K: "🥇",
    IR_GOLD_24K: "🏅",
    IR_GOLD_MELTED: "💰",
    IR_COIN_1G: "1️",
    IR_COIN_QUARTER: "💛",
    IR_COIN_HALF: "🌓",
    IR_COIN_EMAMI: "👑",
    IR_COIN_BAHAR: "🌟",
  };
  return `<span class="text-sm md:text-base">${icons[symbol] || "🏆"}</span>`;
}

async function fetchRates() {
  dollarRateElement.textContent = "در حال دریافت...";
  if (
    allGoldItemsContainer.firstChild &&
    allGoldItemsContainer.firstChild.tagName === "P"
  )
    allGoldItemsContainer.innerHTML =
      '<p class="card-text-secondary text-sm text-center py-4">نرخ‌ها در حال بارگذاری...</p>';
  refreshRateBtn.classList.add("loading");
  refreshRateBtn.disabled = true;
  try {
    const response = await fetch(
      "https://brsapi.ir/Api/Market/Gold_Currency.php?key=FreeEeF0iU0MmWBvUMpx8JsNzWJsanOE"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const dollarData = data.currency.find((item) => item.symbol === "USD");
    if (dollarData && dollarData.price) {
      currentDollarRate = parseFloat(cleanNumber(dollarData.price));
      dollarRateElement.textContent = formatNumber(currentDollarRate);
    } else {
      currentDollarRate = 58550;
      dollarRateElement.textContent =
        formatNumber(currentDollarRate) + " (پیشفرض)";
    }
    if (data.gold) {
      allGoldData = data.gold.filter((item) => item.unit === "تومان");
      if (allGoldData.length > 0 && allGoldData[0].date && allGoldData[0].time)
        goldLastUpdateElement.textContent = `آخرین بروزرسانی: ${allGoldData[0].date} - ${allGoldData[0].time}`;
      else goldLastUpdateElement.textContent = "آخرین بروزرسانی: نامشخص";
    } else {
      allGoldData = [];
      goldLastUpdateElement.textContent = "داده طلا دریافت نشد";
    }
  } catch (error) {
    console.error("خطا در دریافت قیمت‌ها:", error);
    currentDollarRate = 58550;
    dollarRateElement.textContent = formatNumber(currentDollarRate) + " (خطا)";
    allGoldData = [];
    goldLastUpdateElement.textContent = "خطا در دریافت بروزرسانی";
    allGoldItemsContainer.innerHTML =
      '<p class="text-red-400 text-sm text-center py-4">خطا در بارگذاری نرخ طلا و سکه.</p>';
  } finally {
    refreshRateBtn.classList.remove("loading");
    refreshRateBtn.disabled = false;
    updateAllCalculations();
    displayAllGoldItems();
  }
}

function updateNumericTexts() {
  const rialVal = cleanNumber(rialInput.value),
    tomanVal = cleanNumber(tomanInput.value),
    dollarVal = cleanNumber(dollarInput.value);
  const defaultRialText = "مقدار ریال به حروف",
    defaultTomanText = "مقدار تومان به حروف",
    defaultDollarText = "مقدار دلار به حروف";
  rialText.innerHTML =
    rialVal && rialVal !== "0"
      ? `${numberToWords(rialVal)} ریال`
      : defaultRialText;
  rialText.style.opacity = rialVal && rialVal !== "0" ? "1" : "0.7";
  tomanText.innerHTML =
    tomanVal && tomanVal !== "0"
      ? `${numberToWords(tomanVal)} تومان`
      : defaultTomanText;
  tomanText.style.opacity = tomanVal && tomanVal !== "0" ? "1" : "0.7";
  const dollarFloat = parseFloat(dollarVal);
  if (dollarVal && dollarFloat > 0) {
    const integerPartOfDollar = String(Math.floor(dollarFloat));
    dollarText.innerHTML = `${numberToWords(integerPartOfDollar)} دلار`;
    dollarText.style.opacity = "1";
  } else {
    dollarText.innerHTML = defaultDollarText;
    dollarText.style.opacity = "0.7";
  }
}

function displayAllGoldItems() {
  const tomanAmount = parseFloat(cleanNumber(tomanInput.value)) || 0;
  allGoldItemsContainer.innerHTML = "";
  if (allGoldData.length === 0) {
    if (!refreshRateBtn.classList.contains("loading"))
      allGoldItemsContainer.innerHTML =
        '<p class="card-text-secondary text-sm text-center py-4">داده‌ای برای نمایش طلا و سکه موجود نیست.</p>';
    return;
  }
  allGoldData.forEach((item) => {
    const itemPrice = parseFloat(cleanNumber(item.price));
    let purchasableQuantityText = "0",
      unitText = "";
    if (tomanAmount > 0 && itemPrice > 0) {
      if (item.symbol.includes("GOLD")) {
        const grams = tomanAmount / itemPrice;
        purchasableQuantityText = formatNumber(
          grams % 1 === 0 ? grams.toFixed(0) : grams.toFixed(3)
        );
        unitText = "گرم";
      } else if (item.symbol.includes("COIN")) {
        const coins = Math.floor(tomanAmount / itemPrice);
        purchasableQuantityText = formatNumber(String(coins));
        unitText = "عدد";
      }
    }
    const changeClass =
      parseFloat(item.change_percent) >= 0 ? "positive" : "negative";
    const changeIcon = parseFloat(item.change_percent) >= 0 ? "▲" : "▼";
    const changePercentAbs = Math.abs(parseFloat(item.change_percent)).toFixed(
      2
    );
    const changeValueAbs = formatNumber(
      String(Math.abs(parseFloat(cleanNumber(item.change_value))))
    );
    const itemDiv = document.createElement("div");
    itemDiv.className = "gold-item-display p-2 md:p-3 rounded-lg shadow";
    itemDiv.innerHTML = `<div class="flex justify-between items-center mb-1 md:mb-1.5"><span class="gold-name font-semibold text-xs sm:text-sm flex items-center gap-x-1 sm:gap-x-1.5">${getGoldIcon(
      item.symbol
    )} ${
      item.name
    }</span><span class="gold-price text-xs sm:text-sm font-medium">${formatNumber(
      String(itemPrice)
    )} <span class="text-xs opacity-80">تومان</span></span></div><div class="flex justify-between items-center text-2xs sm:text-xs"><span class="gold-change ${changeClass} flex items-center gap-x-0.5"><span>${changeIcon}</span><span>${changePercentAbs}%</span><span class="hidden sm:inline">(${changeValueAbs})</span></span><span class="gold-purchasable">توان خرید : <strong class="text-yellow-400">${purchasableQuantityText}</strong> <span class="opacity-80">${unitText}</span></span></div>`;
    allGoldItemsContainer.appendChild(itemDiv);
  });
}

function updateAllCalculations(sourceField = null) {
  const rialValRaw = cleanNumber(rialInput.value),
    tomanValRaw = cleanNumber(tomanInput.value),
    dollarValRaw = cleanNumber(dollarInput.value);
  try {
    let rialNum = BigInt(rialValRaw || 0),
      tomanNum = BigInt(tomanValRaw || 0),
      dollarNum = parseFloat(dollarValRaw) || 0;
    if (sourceField === rialInput) {
      tomanNum = rialNum / 10n;
      if (currentDollarRate > 0)
        dollarNum = Math.floor(Number(tomanNum) / currentDollarRate);
      else dollarNum = 0;
    } else if (sourceField === tomanInput) {
      rialNum = tomanNum * 10n;
      if (currentDollarRate > 0)
        dollarNum = Math.floor(Number(tomanNum) / currentDollarRate);
      else dollarNum = 0;
    } else if (sourceField === dollarInput) {
      if (currentDollarRate > 0) {
        const tomanFloat = dollarNum * currentDollarRate;
        tomanNum = BigInt(Math.floor(tomanFloat));
        rialNum = tomanNum * 10n;
      } else {
        tomanNum = 0n;
        rialNum = 0n;
      }
    }
    if (sourceField !== rialInput)
      rialInput.value = rialNum > 0 ? formatNumber(rialNum.toString()) : "";
    if (sourceField !== tomanInput)
      tomanInput.value = tomanNum > 0 ? formatNumber(tomanNum.toString()) : "";
    if (sourceField !== dollarInput)
      dollarInput.value =
        dollarNum > 0 ? formatNumber(dollarNum.toFixed(0)) : "";
    if (sourceField && sourceField.value === "") {
      if (sourceField === rialInput) {
        tomanInput.value = "";
        dollarInput.value = "";
      } else if (sourceField === tomanInput) {
        rialInput.value = "";
        dollarInput.value = "";
      } else if (sourceField === dollarInput) {
        rialInput.value = "";
        tomanInput.value = "";
      }
    }
  } catch (e) {
    console.error("Error in calculation with BigInt:", e);
  }
  updateNumericTexts();
  displayAllGoldItems();
  toggleClearButtons();
}

[rialInput, tomanInput, dollarInput].forEach((inputEl) => {
  const clearBtn = inputEl.parentElement.querySelector(".clear-input-btn");
  inputEl.addEventListener("input", function () {
    let value = cleanNumber(this.value);
    if (this.id === "dollar") {
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
      this.value = value;
    } else {
      value = value.replace(/[^0-9]/g, "");
      if (value.length > 36) value = value.substring(0, 36);
      this.value = value ? formatNumber(value) : "";
    }
    updateAllCalculations(this);
  });
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      inputEl.value = "";
      inputEl.dispatchEvent(new Event("input"));
    });
});

function toggleClearButtons() {
  [rialInput, tomanInput, dollarInput].forEach((inputEl) => {
    const clearBtn = inputEl.parentElement.querySelector(".clear-input-btn");
    if (clearBtn)
      clearBtn.style.display = inputEl.value ? "inline-block" : "none";
  });
}

refreshRateBtn.addEventListener("click", fetchRates);

function initializeApp() {
  const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;

  if (!isMobile) {
    // ✨ راه‌اندازی انیمیشن پس‌زمینه و تعامل با ماوس
    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
      cursor.style.left = event.x + "px";
      cursor.style.top = event.y + "px";
    });

    window.addEventListener("mouseout", () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });
  }

  // راه‌اندازی بقیه برنامه
  updateNumericTexts();
  fetchRates();
  toggleClearButtons();
  ["rial-text", "toman-text", "dollar-text"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      const currencyName = id.split("-")[0];
      let nameInFarsi = "مقدار";
      if (currencyName === "rial") nameInFarsi = "ریال";
      if (currencyName === "toman") nameInFarsi = "تومان";
      if (currencyName === "dollar") nameInFarsi = "دلار";
      el.textContent = `مقدار ${nameInFarsi} به حروف`;
    }
  });
  rialInput.focus();
}

setInterval(fetchRates, 300000);
initializeApp();
