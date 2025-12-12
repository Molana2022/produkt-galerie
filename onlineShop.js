const cartModal = document.getElementById("cart-modal");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const clearCartBtn = document.getElementById("clear-cart");
const closeCartBtn = document.getElementById("close-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = cart.length; 
const cartCountSpan = document.getElementById("cart-count");
cartCountSpan.innerText = cartCount;

document.querySelector(".cart").addEventListener("click", openCart);

fetch('./data.json')
    .then(response => response.json())
    .then(produkte => {
        produkte.forEach(p => addProductToDOM(p));
    })
    .catch(err => console.error("Fehler beim Laden der Daten:", err));

const productGrid= document.querySelector('.product-grid');

function addProductToDOM(p) {
    const container= document.createElement('div');
    container.className= 'container';

    const img= document.createElement('img');
    img.src= `./img/${p.bild}`;
    img.alt= p.bild;

    const name= document.createElement('h3');
    name.innerText= p.name;

    const preis= document.createElement('p');
    preis.innerText= `${p.preis} €`;

    const btn= document.createElement('button');
    btn.innerText= 'Zum Warenkorb';

    container.appendChild(img);
    container.appendChild(name);
    container.appendChild(preis);
    container.appendChild(btn);

    btn.addEventListener('click', () => {addToCart(p)});

    productGrid.appendChild(container);
}

// Add product to cart or increase quantity if it already exists
function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity++;
    } else {cart.push({
            ...product,
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = cartCount;

    showToast(`✔ "${product.name}" wurde zum Warenkorb hinzugefügt`);
    
    updateClearButton();
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

// Render cart modal with items, quantities and total price
function openCart() {
    cartItemsDiv.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                Preis: ${item.preis} €<br>
                Menge: <strong>${item.quantity}</strong>
            </div>
            <div class="cart-buttons">
                <button onclick="decreaseQty(${index})">➖</button>
                <button onclick="increaseQty(${index})">➕</button>
                <button onclick="removeItem(${index})">❌</button>
            </div>
        `;

        total += item.preis * item.quantity;        
        cartItemsDiv.appendChild(div);
    });

    cartTotalPrice.innerText = total.toFixed(2) + " €";

    cartModal.classList.remove("hidden");

    updateClearButton();
}

// Increase product quantity
function increaseQty(index) {
    cart[index].quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    openCart();
}

// Decrease product quantity or remove if quantity becomes 0
function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        // اگر quantity = 1 → حذف شود
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    openCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    cartCount = cart.length;
    cartCountSpan.innerText = cartCount;

    openCart();
    updateClearButton();
}

// Recalculate total cart quantity and update header counter
function updateCartCount() {
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = cartCount;
}

// Clear entire cart
clearCartBtn.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    cartCount = 0;
    cartCountSpan.innerText = cartCount;

    openCart();
    updateClearButton();
});

function updateClearButton() {
    clearCartBtn.disabled = cart.length === 0;
}

closeCartBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});




