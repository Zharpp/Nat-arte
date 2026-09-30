// ==========================================
// 1. CONFIGURAÇÃO E DADOS DAS ARTES
// ==========================================
const TOTAL_FOTOS = 21;

// Títulos e descrições personalizadas (apenas onde mudar o padrão)
const ARTES_CUSTOMIZADAS = {
    1: { titulo: 'Reunião de Pais e Mestres.', descricao: 'Lápis de cor e nanquim' },
    2: { titulo: 'Arena Amazônia.', descricao: 'Cartaz ilustrado' },
    3: { titulo: 'Espelho Espelho MEU.', descricao: 'Arte em nanquim sobre papel' },
    4: { titulo: 'A Maternidade me Ensinou.', descricao: 'Arte em nanquim sobre papel' },
    5: { titulo: 'Após a TEMPESTADE vem a CALMARIA ', descricao: 'Arte em nanquim sobre papel' },
    6: { titulo: 'Jamais chore pelo leite derramado', descricao: 'Arte em nanquim sobre papel' },
    7: { titulo: 'O amor sempre FLORESCE.', descricao: 'Arte em nanquim sobre papel' },
    8: { titulo: 'A primavera trouxe um presente', descricao: 'Arte em nanquim sobre papel' },
    9: { titulo: 'Eu tenho um porto para chamar de MEU', descricao: 'Arte em nanquim sobre papel' },
    10: { titulo: 'Chapelheiro Maluco', descricao: 'Arte em nanquim sobre papel' },
    11: { titulo: 'A arte é você quem expressa.', descricao: 'Arte em nanquim sobre papel' },
    12: { titulo: 'Até uma lagrima.', descricao: 'Arte em nanquim sobre papel' },
    13: { titulo: 'Para tudo tem Solução.', descricao: 'Arte em nanquim sobre papel' },
    14: { titulo: 'Sempre haverá um Porto Seguro', descricao: 'Arte em nanquim sobre papel' },
    15: { titulo: 'Mamae Balboa', descricao: 'Arte em nanquim sobre papel' },
    16: { titulo: '1min de ETERNIDADE', descricao: 'Arte em nanquim sobre papel' },
    17: { titulo: 'Sempre Juntos', descricao: 'Arte em nanquim sobre papel' },
    18: { titulo: 'Vai Passar', descricao: 'Arte em nanquim sobre papel' },
    19: { titulo: 'Feliz dia das Mães', descricao: 'Arte em nanquim sobre papel' },
    20: { titulo: 'Aos olhos do Pai', descricao: 'Arte em nanquim sobre papel' },
    21: { titulo: 'God Gave Rock ad Roll to you', descricao: 'Arte em nanquim sobre papel' },
};

// Geração coesa do array de obras
const obras = Array.from({ length: TOTAL_FOTOS }, (_, index) => {
    const numero = index + 1;
    const custom = ARTES_CUSTOMIZADAS[numero];

    return {
        src: `extrair/arte${numero}.jpg`,
        titulo: custom?.titulo || `Obra NatArt #${numero}`,
        descricao: custom?.descricao || 'Ilustração autoral'
    };
});

// ==========================================
// 2. REFERÊNCIAS DO DOM E ESTADO DO TEMPORIZADOR
// ==========================================
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const carousel = document.getElementById('carousel');

let currentIndex = 0;
let autoPlayTimer = null;
const TEMPO_TROCA = 5000; // Tempo em milissegundos (5 segundos)


// ==========================================
// 3. RENDERIZAÇÃO E NAVEGAÇÃO
// ==========================================
function renderCarousel() {
    if (!track || !dotsContainer) return;

    // Injeção limpa de slides e dots
    track.innerHTML = obras.map(obra => `
        <div class="carousel-slide">
            <img src="${obra.src}" alt="${obra.titulo}">
            <div class="slide-caption">
                <h3>${obra.titulo}</h3>
                <p>${obra.descricao}</p>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = obras.map((_, i) => `
        <div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
    `).join('');

    // Event listener delegado para os dots
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            goToSlide(Number(e.target.dataset.index));
            resetAutoPlay();
        }
    });
}

function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

const goToSlide = (index) => { currentIndex = index; updateCarousel(); };
const nextSlide = () => { currentIndex = (currentIndex + 1) % obras.length; updateCarousel(); };
const prevSlide = () => { currentIndex = (currentIndex - 1 + obras.length) % obras.length; updateCarousel(); };


// ==========================================
// 4. NAVEGAÇÃO AUTOMÁTICA (AUTOPLAY)
// ==========================================
function startAutoPlay() {
    if (!autoPlayTimer) {
        autoPlayTimer = setInterval(nextSlide, TEMPO_TROCA);
    }
}

function stopAutoPlay() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}


// ==========================================
// 5. EVENTOS (BOTÕES, PAUSA E SWIPE MOBILE)
// ==========================================
if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
}

// Pausa o temporizador ao passar o rato e suporta gestos no telemóvel
if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    let startX = 0;
    carousel.addEventListener('touchstart', (e) => { 
        stopAutoPlay();
        startX = e.touches[0].clientX; 
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const diffX = startX - e.changedTouches[0].clientX;
        if (Math.abs(diffX) > 50) {
            diffX > 0 ? nextSlide() : prevSlide();
        }
        startAutoPlay();
    }, { passive: true });
}

// Inicialização
renderCarousel();
startAutoPlay();