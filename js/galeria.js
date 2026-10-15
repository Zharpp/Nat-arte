// ==========================================
// 1. CONFIGURAÇÃO E DADOS DAS ARTES
// ==========================================
const TOTAL_FOTOS = 20;

// Títulos e descrições personalizadas
const ARTES_CUSTOMIZADAS = {
    1: { titulo: 'Reunião de Pais - 2026. ',  descricao: 'Lápis de cor Aquarelavel sobre o papel. (22x13)' },
    2: { titulo: 'Maternidade e o Florecer de outra Mulher - 2026.', descricao: 'Lápis de cor Aquarelavel sobre o papel. (22x13)' },
    3: { titulo: 'Ser forte por mim - 2026.', descricao: 'Lápis de cor Aquarelavel sobre o papel. (22x13)' },
    4: { titulo: 'Porto Seguro - 2026..', descricao: 'Lápis de cor Aquarelavel sobre o papel. (22x13)' },
    5: { titulo: 'Tribulação - 2026.', descricao: 'Lápis de cor Aquarelavel sobre o papel. (22x13)' },
    6: { titulo: 'Frustação - 2026. ', descricao: 'Lápis de cor Aquarelavel sobre o papel. (22x13)' },
    7: { titulo: 'Pequeno e Fragíl. - 2026', descricao: 'Técnica Mista sobre o papel. (22x13)' },
    8: { titulo: 'Florecendo no seu crescimento - 2026', descricao: 'Técnica Mista sobre o papel. (22x13)' },
    9: { titulo: 'O abraço laranja - 2026', descricao: 'Tinta Guache. (20x21)' },
    10: { titulo: 'A mente de uma puérpera - 2026', descricao: 'Técnica Mista. (21x15)' },
    11: { titulo: 'Dar a Luz - 2026.', descricao: 'Giz pastel oleoso. (21x30)' },
    12: { titulo: 'Meu maior medo - 2025.', descricao: 'Lápis de cor Aquarelavel.(21x30)' },
    13: { titulo: 'Suportar - 2026.', descricao: 'Lápis de cor Aquarelavel.(21x30)' },
    14: { titulo: 'Obrigado, meu filho - 2026', descricao: 'Lápis de cor Aquarelavel.(21x30)' },
    15: { titulo: 'Mulher - 2025', descricao: 'Tinta Aquarela sobre o papel. (21x30)' },
    16: { titulo: 'Blá blá blá - 2024', descricao: 'Tinta Aquarela sober o pape.(21x30)' },
    17: { titulo: 'Confiança', descricao: 'Tinta Acrilica sobre a tela. (15x20' },
    18: { titulo: 'Afeto é amamentar - 2026', descricao: 'Tinta Acrilica sobre papal paraná. (40x50)' },
    19: { titulo: 'Dia das Mães - 2024', descricao: 'Arte digital. (21x30)' },
	20: { titulo: 'Regar - 2026', descricao: 'Lápis de cor Aquarelavel. (22x13)' },
};

// Geração do array de obras
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
// 2. REFERÊNCIAS DO DOM E ESTADO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const carousel = document.getElementById('carousel');

    if (!track || !dotsContainer) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    const TEMPO_TROCA = 10000; // 5 segundos

    // ==========================================
    // 3. RENDERIZAÇÃO E NAVEGAÇÃO
    // ==========================================
    function renderCarousel() {
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
    }

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    const goToSlide = (index) => { currentIndex = index; updateCarousel(); };
    const nextSlide = () => { currentIndex = (currentIndex + 1) % obras.length; updateCarousel(); };
    const prevSlide = () => { currentIndex = (currentIndex - 1 + obras.length) % obras.length; updateCarousel(); };

    // ==========================================
    // 4. AUTOPLAY
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
    // 5. EVENTOS
    // ==========================================
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            goToSlide(Number(e.target.dataset.index));
            resetAutoPlay();
        }
    });

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
});
