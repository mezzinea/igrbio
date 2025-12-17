function setLanguage(lang) {
    // Save language in localStorage
    localStorage.setItem("lang", lang);

    if (lang == "ar") {
      // selectedLang.innerText = "العربية";
      window.location.href = "../ar";
    }
    if (lang == "fr") {
      // selectedLang.innerText = "Français";
      window.location.href = "../fr";
    }
    if (lang == "en") {
      // selectedLang.innerText = "English";
      window.location.href = "../en";
    }
}

const translations = {
  en: {
    addToCart: "Add to cart",
    addedToCart: "Added successfully to your cart ✅",
    itemRemoved: "Item removed from your list",
    cartCleared: "Cart cleared successfully",
    placeOrder: "Place Order",
    orderPlaced: "✅ Order placed successfully!",
    orderFailed: "⚠️ Failed to submit order. Please try again.",
    placingOrder: "Placing order...",
    invalidCoupon: "Invalid coupon code",
    requiredFields: "Please fill in all required fields (Name, Phone, Address).",
    invalidPhone: "Phone number is invalid. It should start with 05/06/07 and be 10 digits.",
    currency: "MAD",
    each: "each"
  },

  fr: {
    addToCart: "Ajouter au panier",
    addedToCart: "Ajouté au panier avec succès ✅",
    itemRemoved: "Article supprimé de votre liste",
    cartCleared: "Panier vidé avec succès",
    placeOrder: "Passer la commande",
    orderPlaced: "✅ Commande passée avec succès !",
    orderFailed: "⚠️ Échec de l’envoi de la commande. Veuillez réessayer.",
    placingOrder: "Commande en cours...",
    invalidCoupon: "Code promo invalide",
    requiredFields: "Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Adresse).",
    invalidPhone: "Le numéro de téléphone est invalide. Il doit commencer par 05/06/07 et contenir 10 chiffres.",
    currency: "MAD",
    each: "chacun"
  },

  ar: {
    addToCart: "أضف إلى السلة",
    addedToCart: "تمت الإضافة إلى السلة بنجاح ✅",
    itemRemoved: "تمت إزالة العنصر من قائمتك",
    cartCleared: "تم إفراغ السلة بنجاح",
    placeOrder: "إتمام الطلب",
    orderPlaced: "✅ تم تقديم الطلب بنجاح!",
    orderFailed: "⚠️ فشل إرسال الطلب. يرجى المحاولة مرة أخرى.",
    placingOrder: "جاري تنفيذ الطلب...",
    invalidCoupon: "رمز القسيمة غير صالح",
    requiredFields: "يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، العنوان).",
    invalidPhone: "رقم الهاتف غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام.",
    currency: "د.م",
    each: "واحد"
  }
};

// Function to get current translations
function getTranslations() {
  const lang = localStorage.getItem("lang");
  return translations[lang] || translations["en"];
}

// Get current translations
const trs = getTranslations();


// Function to load HTML into an element
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => {
            console.log('Error loading HTML:', error);
        });
}

// Load the header and footer when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    loadHTML('header', 'global/header.html');
    loadHTML('footer', 'global/footer.html');
    loadHTML('product-view', 'global/product-view.html');
    loadHTML('our-offers', 'global/our-offers.html');
});

// Function to parse CSV text into an array of objects
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] ? values[i].trim() : "";
    });
    return obj;
  });
}

// Wait until the entire page (images, scripts, etc.) is loaded
document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById("preloader");
    // Show preloader for at least 1 second
    setTimeout(() => {
        preloader.classList.add("hidden");
    }, 500); // 1 second
    setTimeout(() => {
        updateCartCount(); // used to fix content flash issue on page load
    }, 1000); // 1.5 seconds
});


let products = []; // global variable to hold products

// Function to load products from CSV and display them
fetch("product.csv")
.then(response => response.text())
.then(text => {
    products = parseCSV(text);
    const container = document.getElementById("shop-product-list");
    const typeSelector = document.getElementById("type-selector");
    const suggestedSelector = document.getElementById("suggested-selector");

    // const suggestedSelector = document.getElementById("suggested-selector");

    function renderProducts(list) {
        container.innerHTML = "";
        list.forEach(product => {
            const tags = product.tags.split("|").map(tag => 
                `<span class="badge bg-light text-dark me-1">${tag}</span>`
            ).join(" ");
            const card = `
                <div class="col-6 col-md-3 zoomin rounded-1">
                    <div class="card mb-4 product-wap">
                        <div class="card rounded-1">
                            <img class="card-img rounded-1 img-fluid" src="../assets/img/igrBio/${product.image}" alt="${product.title}">
                            <div class="card-img-overlay rounded-1 product-overlay d-flex align-items-center justify-content-center">
                                <ul class="list-unstyled">
                                <li><button class="btn btn-success text-white mt-2" onclick="openProductModal('${product.id}')"><i class="far fa-eye"></i></button></li>
                                <li><button onclick="addToCart('${product.id}')" class="btn btn-success text-white mt-2"><i class="fas fa-cart-plus"></i></button></li>
                                </ul>
                            </div>
                            </div>
                            <div class="card-body">
                            <span onclick="openProductModal('${product.id}')" class="text-decoration-none">${product.title}</span>
                            
                            <div class="row mb-2">
                                <span class="col-lg-12" style="font-size: 13px;"> 
                                  <small class="badge bg-light text-dark">${product.quantity}</small>
                                  <small class="badge bg-light text-dark">${product.type}</small>
                                </span>
                            </div>
                            <p><small>${trs.currency} </small><b>${product.price}</b></p>
                            <div class="btn btn-light w-100 rounded" onclick="addToCart('${product.id}')">
                                <i class="fas fa-cart-plus"></i><small> ${trs.addToCart} </small>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML += card;
        });
    }
    

    // Initial render (all products)
    renderProducts(products);
    
    // suggested products
    if(suggestedSelector) {
      renderProducts(products.filter(p => p.suggested == 1));
    }
    
    // type from URI
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (type) {
        renderProducts(products.filter(p => p.type == type));
        document.getElementById("type-selector").value = type;
    }
    
    // On dropdown change, filter products
    typeSelector.addEventListener("change", () => {
        const type = typeSelector.value;
        if (type) {
            renderProducts(products.filter(p => p.type == type));
        } else {
            renderProducts(products); // all
        }
    });
    
});


function addToCart(productId) {
  
    let product = {}; 
    const pack = {
          id: -1,
          title: "pack souss",
          price: "550",
          image: "3vhEihamIkRCTUfXXWVdO6ku3.jpg",
          quantity: 1
      }
    
    if(productId == -1) {
      // create pack object
      product = pack
    }
    else {
      // Look up product directly from global products array
      product = products.find(p => p.id == productId); 
    }

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }
    
    // Retrieve cart from localStorage
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id == productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        // Clone only the needed fields
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
    updateCartCount();
    showToast(trs.addedToCart, 'success');
}


// Show toast
function showToast(message, type = 'success') {
  
  const toast = document.getElementById('toast');
  
  // Set message and type
  toast.textContent = message;
  toast.classList.add(type, 'show');

  // Hide automatically after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}



// Toggle cart sidebar
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("active");
    loadCart(); // refresh view
}

// Load cart from localStorage and render
function loadCart() {
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    const container = document.getElementById("cart-items");
    const totalContainer = document.getElementById("cart-total");

    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price) * item.quantity;
        total += itemTotal;

        container.innerHTML += `
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <img src="../assets/img/igrBio/${item.image}" width="80" height="80" class="rounded">
            <div class="flex-grow-1 mx-2">
              <p class="mb-0 fw-bold">${item.title}</p>
              <small>${item.price} x ${item.quantity}</small>
            </div>
            <div class="d-flex align-items-center">
              <button onclick="updateQuantity(${index}, -1)" class="btn btn-sm btn-outline-secondary">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button onclick="updateQuantity(${index}, 1)" class="btn btn-sm btn-outline-secondary">+</button>
            </div>
            <span class="mx-2">${itemTotal.toFixed(0)}</span>
            <button onclick="removeItem(${index})" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
    });

    totalContainer.textContent = total.toFixed(2);
}

// update Cart Count
function updateCartCount() {
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    let itemCount = 0;
    cart.forEach(item => itemCount += item.quantity);
    
    const cartCount = document.getElementById("cart-count");
   
    if (cartCount) {
        if (itemCount > 0) {
            cartCount.textContent = itemCount;
            cartCount.style.display = "inline-block";
        }
        else {
            cartCount.style.display = "none";
        }
    }
}

function updateQuantity(index, change, fromCartPage = false) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart[index]) return;

    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    if (fromCartPage) {
        loadCartPage();
        updateCartCount();
    } else {
        loadCart();
        updateCartCount();
    }
}

function removeItem(index, fromCartPage = false) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    if (fromCartPage) {
        loadCartPage();
        updateCartCount();
    } else {
        loadCart();
        updateCartCount();
    }
    showToast(trs.itemRemoved, 'error');
}


// Clear cart
function clearCart() {
    localStorage.removeItem("cart");
    loadCart();
    updateCartCount();
    showToast(trs.cartCleared, 'error');
}

window.onload = () => {
    loadCart();
};

// load cart page details
function loadCartPage() {
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    const container = document.getElementById("cart-page-items");
    container.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price) * item.quantity;
        subtotal += itemTotal;

        container.innerHTML += `
          <div class="mb-3 p-3 d-flex flex-row justify-content-between align-items-center shadow-sm bg-white rounded">
            <div class="d-flex align-items-center">
              <img src="../assets/img/igrBio/${item.image}" width="80" height="80" class="rounded">
              <div class="me-3 ms-3">
                <h6 class="mb-1">${item.title}</h6>
                <small class="d-flex align-items-center pt-2">
                <button onclick="updateQuantity(${index}, -1, true)" class="btn btn-sm btn-outline-secondary">-</button>
                  <span class="mx-2">${item.quantity}</span>
                  <button onclick="updateQuantity(${index}, 1, true)" class="btn btn-sm btn-outline-secondary">+</button>
                </small>
              </div>
            </div>
            <small class="mb-1 d-none d-lg-block">${item.price} ${trs.currency} ${trs.each}</small>
            <span class="mx-3"><b>${itemTotal.toFixed(0)}</b> <small>${trs.currency}</small></span>
            <button onclick="removeItem(${index}, true)" class="btn btn-sm btn-outline-danger">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
    });

    // Update summary
    document.getElementById("summary-subtotal").textContent = subtotal.toFixed(0) + " " + trs.currency;
    document.getElementById("summary-discount").textContent = appliedDiscount.toFixed(0) + " " + trs.currency;
    document.getElementById("summary-total").textContent = (subtotal - appliedDiscount).toFixed(0) + " " + trs.currency;
    document.getElementById("summary-total-checkout").textContent = (subtotal - appliedDiscount).toFixed(0) + " " + trs.currency;
}


document.addEventListener("DOMContentLoaded", () => {
    loadCartPage();
});



// Discount code logic
let appliedDiscount = 0;

function applyCoupon() {
    const code = document.getElementById("coupon-code").value.trim().toUpperCase();
    let subtotal = 0;
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    cart.forEach(item => {
        subtotal += parseFloat(item.price) * item.quantity;
    });

    if (code == "DISCOUNT10") {
        appliedDiscount = subtotal * 0.10; // 10% off
    } else if (code == "DISCOUNT50") {
        appliedDiscount = subtotal * 0.50; // 50% off
    } else {
        appliedDiscount = 0;
        alert(trs.invalidCoupon);
    }

    loadCartPage(); // refresh totals
}

// Show checkout form & hide cart items
function showCheckoutForm() {
    document.getElementById("orderItems").classList.remove("show");
    document.getElementById("checkout-form").style.display = "block";
    document.getElementById("order-items-header").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const orderItems = document.getElementById("orderItems");
  const toggleIcon = document.getElementById("orderToggleIcon");

  // Bootstrap collapse events
  orderItems.addEventListener("show.bs.collapse", function () {
    toggleIcon.classList.remove("fa-chevron-down");
    toggleIcon.classList.add("fa-chevron-up");
  });

  orderItems.addEventListener("hide.bs.collapse", function () {
    toggleIcon.classList.remove("fa-chevron-up");
    toggleIcon.classList.add("fa-chevron-down");
  });    
  
});

// Handle form submit
document.getElementById("orderForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;

  // --- Read values reliably using FormData ---
  const fd = new FormData(form);
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  
  console.log({ name, phone, address, email });

  // Basic client-side validation
  if (!name || !phone || !address) {
    alert(trs.requiredFields);
    return;
  }
  // Optional: additional phone format check
  const phoneRegex = /^(05|06|07)[0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    alert(trs.invalidPhone);
    return;
  }

  // --- Get cart and compute products/total ---
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const productsText = cart.map(i => `${i.id} - ${i.title} (x${i.quantity})`).join("\n");
  const total = cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);

  const payload = {
    name, phone, address, email,
    products: productsText,
    total
  };

  // disable button while submitting
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = true;
  btn.textContent = trs.placingOrder;

  try {
    // replace with your Google Apps Script URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxBl1pTLgIAycto9K726axq7780-Pl-3cBO2jtmYb8DWU5PwsrYBo6RLuDM4HOqBd4W/exec";

    // NOTE: if you use mode: 'no-cors', you won't be able to read the response.
    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors" // avoid if you want to read response; otherwise Apps Script must allow CORS or use no-cors
    });

    alert(trs.orderPlaced);
    localStorage.removeItem("cart");
    form.reset();
    loadCart();
    updateCartCount();
    loadCartPage();
    updateCartCount();
    // hide checkout form or reset UI as needed
  } catch (err) {
    console.error(err);
    alert(trs.orderFailed);
  } finally {
    btn.disabled = false;
    btn.textContent = trs.placeOrder;
    window.location.href = "../"; // redirect to home after order
  }
});



// Modal logic (view product details in popup)
function openProductModal(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  // Fill modal content
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalImage").src = `../assets/img/igrBio/${product.image}`;
  document.getElementById("modalImage").alt = product.title;
  document.getElementById("modalPrice").textContent = `${trs.currency} ${product.price}`;
  document.getElementById("modalDescription").textContent = product.description;

  document.getElementById("modalTags").innerHTML = `
      <small class="badge bg-light text-dark me-1">${product.quantity}</small>
      <small class="badge bg-light text-dark me-1">${product.type}</small>
    `
    
  document.getElementById("addProductBtn").innerHTML = `
      <div class="btn btn-outline-success w-100 rounded py-2" onclick="addToCart(${productId})">
          <i class="fas fa-cart-plus"></i><small> ${trs.addToCart} </small>
      </div>
    `

  // Show the modal (Bootstrap 5)
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}
