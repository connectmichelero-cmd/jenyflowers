const stripe = Stripe('tu_clave_publica_de_stripe_aqui');
let idiomaActual = 'es';

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    }, 900);

    const video = document.getElementById('banner-video');
    if (video) {
        video.muted = true;
        video.play().catch(error => {
            console.log("Reproducción automática bloqueada por el navegador:", error);
        });
    }

    window.addEventListener('scroll', () => {
        const header = document.getElementById('sticky-header');
        if (window.scrollY > 150) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

function cambiarIdioma(lang) {
    idiomaActual = lang;
    document.getElementById('html-root').setAttribute('lang', lang);
    
    const spanEs = document.getElementById('lang-es');
    const spanEn = document.getElementById('lang-en');
    
    if (spanEs && spanEn) {
        if (lang === 'es') {
            spanEs.style.color = '#dfc18b';
            spanEn.style.color = '#ffffff';
        } else {
            spanEn.style.color = '#dfc18b';
            spanEs.style.color = '#ffffff';
        }
    }
    
    const elementos = document.querySelectorAll('[data-es]');
    elementos.forEach(el => {
        const textoTraducido = el.getAttribute(`data-${lang}`);
        if (textoTraducido) {
            el.innerText = textoTraducido;
        }
    });
}

function desplazarSlider(direccion) {
    const slider = document.getElementById('arrivals-slider');
    const desplazamiento = 380;
    if (direccion === 'izquierda') {
        slider.scrollBy({ left: -desplazamiento, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: desplazamiento, behavior: 'smooth' });
    }
}

function desplazarIcons(direccion) {
    const slider = document.getElementById('icons-slider');
    const desplazamiento = 410;
    if (direccion === 'izquierda') {
        slider.scrollBy({ left: -desplazamiento, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: desplazamiento, behavior: 'smooth' });
    }
}

function toggleChat() {
    const box = document.getElementById('chat-box');
    if (box.classList.contains('chat-box-hidden')) {
        box.classList.remove('chat-box-hidden');
    } else {
        box.classList.add('chat-box-hidden');
    }
}

function manejarEnter(event) {
    if (event.key === 'Enter') {
        enviarMensajeBot();
    }
}

function enviarMensajeBot() {
    const input = document.getElementById('chat-input');
    const mensaje = input.value.trim();
    if (!mensaje) return;

    const messagesContainer = document.getElementById('chat-messages');

    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.innerText = mensaje;
    messagesContainer.appendChild(userDiv);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-msg';

        const msgLower = mensaje.toLowerCase();
        if (msgLower.includes('humano') || msgLower.includes('persona') || msgLower.includes('atencion') || msgLower.includes('help') || msgLower.includes('human')) {
            const textoSms = idiomaActual === 'en' 
                ? 'Connecting you with our floral expert via text message...' 
                : 'Conectándote con nuestro experto floral vía mensajes de texto...';
            botDiv.innerText = textoSms;
            messagesContainer.appendChild(botDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            setTimeout(() => {
                window.location.href = 'sms:+12134586223?body=' + encodeURIComponent('Hola, necesito asistencia personalizada con un arreglo floral.');
            }, 1500);
        } else {
            const respuestaBot = idiomaActual === 'en'
                ? 'Thank you for your interest! If you need immediate assistance or want to place a custom order, type "human" or click here to text us at +1 (213) 458-6223.'
                : '¡Gracias por tu interés! Si necesitas asistencia personalizada o deseas un pedido a medida, escribe "humano" para derivarte a nuestro número de texto +1 (213) 458-6223.';
            botDiv.innerText = respuestaBot;
            messagesContainer.appendChild(botDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 1000);
}

async function cargarProductos() {
    try {
        const response = await fetch('backend/db.json');
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        
        const data = await response.json();
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        data.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p class="price">$${(product.price / 100).toFixed(2)} USD</p>
                <button class="buy-btn" onclick="pagarConStripe('${product.id}', '${product.name}', ${product.price})" data-es="Comprar Ahora" data-en="Buy Now">Comprar Ahora</button>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar la base de datos de productos:", error);
    }
}

function pagarConStripe(productId, productName, priceInCents) {
    alert(idiomaActual === 'en' ? `Starting Stripe checkout for: "${productName}"` : `Iniciando pasarela de pago de Stripe para: "${productName}"`);
}

function abrirBuscador() {
    alert(idiomaActual === 'en' ? "Quick search window." : "Ventana de búsqueda rápida.");
}

function abrirCarro() {
    alert(idiomaActual === 'en' ? "Your shopping cart is empty." : "Tu carrito de compras está vacío.");
}