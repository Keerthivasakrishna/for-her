const preloadImages = [
  "assets/images/q1.png",
  "assets/images/q2.png",
  "assets/images/q3.png",
  "assets/images/q4.png",
  "assets/images/q5.png",
  "assets/images/q6.png",
  "assets/images/q7.png",
  "assets/images/q8.png",
  "assets/images/q9png",
  "assets/images/q10.png",
  "assets/bears/hi.png",
  "assets/bears/guitar.png",
  "assets/bears/umbrella.png"
];

function preloadAll() {
  return Promise.all(
    preloadImages.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // don’t block forever
      });
    })
  );
}

/***********************
 * CHANGE THESE TWO
 ***********************/
const HER_NAME = "Pallabi"; // 👈 put her name here
const FORMSPREE_URL = "https://formspree.io/f/mgvgqpok"; // 👈 put your Form ID here

/***********************
 * SETUP
 ***********************/
const screen = document.getElementById("screen");
const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

let page = 0;

/***********************
 * MUSIC
 ***********************/
music.play().catch(()=>{});
toggle.onclick = () => music.paused ? music.play() : music.pause();

/***********************
 * QUOTES
 ***********************/
const quotes = [
  "You show up even on days when it’s hard.\nThat takes strength — even if you don’t call it that.",
  "You don’t need to prove anything.\nJust being you is already enough.",
  "A seed does not doubt its ability to become a tree.\nIt simply grows, in its own time.",
  "Growth is often invisible to the one growing.\nOthers see it before you do.",
  "There is no deadline on becoming who you’re meant to be.",
  "You have not lost anything.\nYou still have time."
];

/***********************
 * PAGES
 ***********************/
const pages = [

() => `
<div class="overlay"></div>
<div class="content">
  <div class="bear"><img src="assets/bears/hi.png"></div>
  <p class="quote">Hey ${HER_NAME}.<br><br>This space is just for you.</p>
  <p class="audio-hint">🎧 Best with earphones or higher volume</p>
  <button onclick="next()">Enter</button>
</div>`,

...quotes.map((q, i) => () => `
<div class="overlay"></div>
<div class="content">
  <div class="polaroid" style="transform: rotate(${Math.random()*6-3}deg)">
    <img src="assets/images/q${i+2}.png">
    <div class="polaroid-text">${q.replace(/\n/g,"<br>")}</div>
  </div>
  <button onclick="next()">Next</button>
</div>`),

() => `
<div class="overlay"></div>
<div class="content">
  <div class="bear"><img src="assets/bears/guitar.png"></div>
  <p class="quote">Let go of what feels heavy</p>
  <div class="bubble-area" id="bubbles"></div>
  <button onclick="next()">Continue</button>
</div>`,

() => `
<div class="overlay"></div>
<div class="content">
  <p class="quote">Breathe slowly</p>
  <div class="circle"></div>
  <p id="breathText">Take 3 calm breaths</p>
  <button id="breathNext" style="display:none">Continue</button>
</div>`,

() => `
<div class="overlay"></div>
<div class="content">
  <p class="quote">If you want to share</p>

  <form id="messageForm">
    <textarea name="message" placeholder="You can write anything here…" required></textarea>
    <button type="submit">Send</button>
  </form>

  <p id="sendStatus" style="opacity:.7;margin-top:6px;"></p>

  <button onclick="next()">Move forward</button>
</div>`,

() => `
<div class="overlay"></div>
<div class="content">
  <div class="bear"><img src="assets/bears/umbrella.png"></div>
  <p class="quote">Take care, ${HER_NAME}.<br>You are doing better than you think.</p>
  <p style="opacity:.6">Made with love by Keerthy 🤍</p>
</div>`
];

/***********************
 * NAVIGATION
 ***********************/
function next() {
  if (page < pages.length - 1) {
    page++;
    render();
  }
}

/***********************
 * RENDER
 ***********************/
function render() {
  screen.style.opacity = 0;
  setTimeout(() => {
    screen.style.backgroundImage =
      `url(assets/images/q${Math.min(page+1,7)}.png)`;
    screen.innerHTML = pages[page]();
    screen.style.opacity = 1;
    initLogic();
  }, 200);
}

/***********************
 * LOGIC
 ***********************/
function initLogic() {

  const area = document.getElementById("bubbles");
  if (area) {
    ["self doubt","comparison","fear","anxiety","pressure"].forEach(word=>{
      const b=document.createElement("div");
      b.className="bubble";
      b.textContent=word;
      b.style.left=Math.random()*70+"%";
      b.style.top=Math.random()*70+"%";
      b.onclick=()=>b.classList.add("pop");
      area.appendChild(b);
    });
  }

  const breathText = document.getElementById("breathText");
  const breathBtn = document.getElementById("breathNext");

  if (breathText && breathBtn) {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      breathText.textContent = `Breath ${count} of 3`;
      if (count >= 3) {
        clearInterval(interval);
        breathText.textContent = "Move on when you feel ready.";
        breathBtn.style.display = "inline-block";
        breathBtn.onclick = next;
      }
    }, 6000);
  }

  const form = document.getElementById("messageForm");
  const status = document.getElementById("sendStatus");

  if (form && status) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      status.textContent = "Sending…";

      try {
        const res = await fetch(FORMSPREE_URL, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          status.textContent = "Message sent 🤍";
          form.reset();
        } else {
          status.textContent = "Something went wrong.";
        }
      } catch {
        status.textContent = "Network issue. Try again.";
      }
    };
  }
}

/***********************
 * START
 ***********************/
render();

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");

  // wait until all images are preloaded
  await preloadAll();

  // small intentional delay for smoothness
  setTimeout(() => {
    if (loader) {
      loader.classList.add("hidden");
    }
  }, 400);
});


