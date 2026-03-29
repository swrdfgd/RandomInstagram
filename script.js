const generateBtn = document.getElementById("generateBtn");
const reelContainer = document.getElementById("reelContainer");
const statusText = document.getElementById("status");
const visitBtn = document.getElementById("visitBtn");

/* ===========================
   CONFIGURATION
=========================== */

const daftarFire = ['AIzaSyB7TX3CfUSUBnWnNP9CGBjLzmfIeo6SpfM','AIzaSyCXN3jgZPhm0qhD3biP5xvmkIrYzK6VbHk','AIzaSyBTPAz_OQr140D1rtD0o6vwM63XohXw8Ds'];

const CSE_ID  = '936670722b64b414c';

function generateRandomKeyword() {
      let keyword = '';
      while (Math.random() < 1/2 || keyword.length < 1) {
        let pilihanKeyword = wordGen();
		if (Math.random() < 1/2){
			let bagian = pilihanKeyword.split(/[-–—\/,:.;()\[\]\s]+/);
			for (let i = 0; i < bagian.length; i++) {
			  if (Math.random() < 1/2) keyword += bagian[i] + ' ';
			}
		}
		else keyword += pilihanKeyword + ' ';
      }
      keyword = keyword.trim();
	  
      return keyword + `allinurl: https://www.instagram.com/reel/`;
}

/* ===========================
   RANDOM STRING GENERATOR
=========================== */

const IG_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function genRandomCode() {
  const length = Math.floor(Math.random() * 3) + 2; // 2–4 chars
  let code = "";

  for (let i = 0; i < length; i++) {
    code += IG_ID_CHARS[Math.floor(Math.random() * IG_ID_CHARS.length)];
  }

  return `allinurl:${code} https://www.instagram.com/reel/`;
}

/* ===========================
   GOOGLE SEARCH
=========================== */

async function ambilLinkAcakDariGoogle(keyword) {
  let semuaHasil = [];
  let halaman = 1;

  while (true) {
    const startIndex = ((halaman - 1) * 10) + 1;
    const apiKey = daftarFire[Math.floor(Math.random() * daftarFire.length)];

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${CSE_ID}&q=${encodeURIComponent(keyword)}&start=${startIndex}`;

    try {
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();

      if (data.items && data.items.length > 0) {
        semuaHasil.push(...data.items.map(item => item.link));
      } else {
        break;
      }

    } catch (err) {
      return null;
    }

    if (Math.random() < 0.5) {
      halaman++;
    } else {
      break;
    }
  }

  if (semuaHasil.length === 0) return null;

  const filtered = semuaHasil.filter(link =>
    link.includes("instagram.com/reel/")
  );

  if (filtered.length === 0) return null;

  return filtered[Math.floor(Math.random() * filtered.length)];
}

/* ===========================
   EMBED REEL
=========================== */

function embedReel(url) {
  reelContainer.innerHTML = "";

  const embedUrl = url.endsWith("/")
    ? url + "embed"
    : url + "/embed";

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.allowFullscreen = true;

  reelContainer.appendChild(iframe);

  visitBtn.href = url;
  visitBtn.classList.remove("disabled");
}

/* ===========================
   EVENT
=========================== */

generateBtn.addEventListener("click", async () => {

  reelContainer.innerHTML = "";
  visitBtn.classList.add("disabled");
  visitBtn.href = "#";

  statusText.innerText = "Searching for a random reel...";

  while (true) {
	let keyword = '';
	if (Math.random() < 0.5){
		keyword = generateRandomKeyword();
	}
	else{
		keyword = genRandomCode();
	}
    const link = await ambilLinkAcakDariGoogle(keyword);

    if (link) {
      statusText.innerText = "Reel found.";
      embedReel(link);
      break;
    } else {
      statusText.innerText = "Retrying...";
    }
  }
});
