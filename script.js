
// Kartları tanımla
const kartlar = [
  "ahtapot", "ari", "balina", "fil", "inek", "kedi",
  "kurbağa", "penguen", "salyangoz", "tavuk", "ugurBocegi", "zurafa"
];

const kartlarDuble = kartlar.concat(kartlar);
const kartlarKaristir = kartlarDuble.sort(() => Math.random() - 0.5);

const oyunAlani = document.getElementById("oyun-alani");
const skorAlani = document.getElementById("skor-alani");
const süreGöstergesi = document.getElementById("süreGöstergesi"); 

let baslangicZamani;
let sonSüre = 0; // Son süreyi saklamak için değişken eklendi
let zamanlayici;
let skor = 0;
let acikKartlar = [];
let oyunDevamEdiyor = false; 
let sonSkor = 0;

function baslatSayaç() {
  baslangicZamani = Date.now() - sonSüre * 1000; // Başlangıç zamanı son süreyi dikkate alarak hesaplanıyor
  zamanlayici = setInterval(güncelleSayaç, 1000);
}

function durdurSayaç() {
  clearInterval(zamanlayici);
  sonSüre = Math.floor((Date.now() - baslangicZamani) / 1000);
}

function güncelleSayaç() {
  var gecenZaman = Math.floor((Date.now() - baslangicZamani) / 1000);
  süreGöstergesi.innerText = "Süre : " + Math.floor(gecenZaman / 60) + " dakika " + (gecenZaman % 60) + " saniye";
}

function skorArtir() {
  skor++;
  skorAlani.innerText = "Skor: " + skor;
}

function oyunuBaslat() {
  if (!oyunDevamEdiyor) {
    oyunDevamEdiyor = true;
    oyunAlani.innerHTML = ""; 
    skor = 0;
    skorAlani.innerText = "Skor: 0";
    oyunAlaniOlustur();
    baslatSayaç();
    güncelleSayaç();
  }
}

function oyunuDurdur() {
  if (oyunDevamEdiyor) {
    durdurSayaç();
    sonSkor = skor;
    oyunDevamEdiyor = false;
  }
}

function oyunuDevamEttir() {
  if (!oyunDevamEdiyor) {
    baslatSayaç();
    oyunDevamEdiyor = true;
  }
}

function oyunAlaniOlustur() {
  kartlarKaristir.forEach((kart, index) => {
    const kartDiv = document.createElement("div");
    kartDiv.classList.add("oyun-karti");
    kartDiv.dataset.index = index;

    const span = document.createElement("span");
    span.innerText = "?";
    kartDiv.appendChild(span);

    kartDiv.addEventListener("click", kartiAc);
    oyunAlani.appendChild(kartDiv);
  });
}

function kartiAc() {
  const index = this.dataset.index;
  const seciliKart = kartlarKaristir[index];
  
  if (!this.classList.contains("acik") && acikKartlar.length < 2 && oyunDevamEdiyor) {
    this.classList.add("acik");
    this.querySelector("span").style.display = "none";
    const img = new Image();
    img.src = `resimler/${seciliKart}.jpg`;
    this.appendChild(img);
    acikKartlar.push(this);
    
    if (acikKartlar.length === 2) {
      kontrolEt();
    }
  }
}

function kontrolEt() {
  const [kart1, kart2] = acikKartlar;
  
  if (kart1.querySelector("img").src === kart2.querySelector("img").src) {
    setTimeout(() => {
      acikKartlar.forEach(kart => {
        kart.classList.remove("acik");
        kart.removeEventListener("click", kartiAc);
      });
      acikKartlar = [];
      skorArtir();
    }, 1000);
  } else {
    setTimeout(() => {
      acikKartlar.forEach(kart => {
        kart.querySelector("span").style.display = "block";
        kart.removeChild(kart.querySelector("img"));
        kart.classList.remove("acik");
      });
      acikKartlar = [];
    }, 1000);
  }
}

const başlatButton = document.getElementById("başlat-button");
başlatButton.addEventListener("click", oyunuBaslat);

const durdurButton = document.getElementById("durdur-button");
durdurButton.addEventListener("click", oyunuDurdur);

const devamEtButton = document.getElementById("devam-et-button");
devamEtButton.addEventListener("click", oyunuDevamEttir);

oyunAlaniOlustur();

document.addEventListener("keydown", function(event) {
  if (event.key === " ") {
    oyunuBaslat();
  } else if (event.key === "Enter") {
    oyunuDevamEttir();
  } else if (event.key === "Escape") {
    oyunuDurdur();
  }
});
