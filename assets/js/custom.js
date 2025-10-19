
// Language Selector
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
    e.preventDefault();

    const langText = this.textContent.trim();
    const langFlag = this.getAttribute('data-flag');

    // Update button
    document.getElementById('selected-lang').textContent = langText;
    document.getElementById('selected-flag').src = langFlag;
    document.getElementById('selected-flag').alt = langText;
    });
});


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
            console.error('Error loading HTML:', error);
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
fetch("assets/data/product.csv")
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
                <div class="col-md-3 zoomin">
                    <div class="card mb-4 product-wap rounded-0">
                        <div class="card rounded-0">
                            <img class="card-img rounded-0 img-fluid" src="assets/img/igrBio/${product.image}" alt="${product.title}">
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                <ul class="list-unstyled">
                                <li><button class="btn btn-success text-white mt-2" onclick="openProductModal('${product.id}')"><i class="far fa-eye"></i></button></li>
                                <li><button onclick="addToCart('${product.id}')" class="btn btn-success text-white mt-2"><i class="fas fa-cart-plus"></i></button></li>
                                </ul>
                            </div>
                            </div>
                            <div class="card-body">
                            <span onclick="openProductModal('${product.id}')" class="text-decoration-none">${product.title}</span>
                            <p><small>MAD </small><b>${product.price}.00</b></p>
                            <div class="row">
                                <div class="col-lg-12"> 
                                <small class="badge bg-light text-dark me-1">${product.quantity}</small>
                                <small class="badge bg-light text-dark me-1">${product.type}</small>
                                </div>
                            </div>
                            <br>
                            <div class="btn btn-light w-100 rounded" onclick="addToCart('${product.id}')">
                                <i class="fas fa-cart-plus"></i><small> Add to cart</small>
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
    
    // Retrieve cart from sessionStorage
    let cart = sessionStorage.getItem("cart");
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

    // Save back to sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
    updateCartCount();
    showToast('Added successfully to your cart ✅', 'success');
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

// Load cart from sessionStorage and render
function loadCart() {
    let cart = sessionStorage.getItem("cart");
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
            <img src="assets/img/igrBio/${item.image}" width="50" height="50" class="rounded">
            <div class="flex-grow-1 mx-2">
              <p class="mb-0 fw-bold">${item.title}</p>
              <small>${item.price} x ${item.quantity}</small>
            </div>
            <div class="d-flex align-items-center">
              <button onclick="updateQuantity(${index}, -1)" class="btn btn-sm btn-outline-secondary">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button onclick="updateQuantity(${index}, 1)" class="btn btn-sm btn-outline-secondary">+</button>
            </div>
            <span class="mx-2">${itemTotal.toFixed(2)}</span>
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
    let cart = sessionStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    let itemCount = 0;
    cart.forEach(item => itemCount += item.quantity);
    
    console.log("Cart count :", itemCount);
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
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    if (!cart[index]) return;

    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));

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
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    if (fromCartPage) {
        loadCartPage();
        updateCartCount();
    } else {
        loadCart();
        updateCartCount();
    }
    showToast('Item removed from your list', 'error');
}


// Clear cart
function clearCart() {
    sessionStorage.removeItem("cart");
    loadCart();
    updateCartCount();
    showToast('Cart cleared successfully', 'error');
}

window.onload = () => {
    loadCart();
};


// load cart page details
function loadCartPage() {
    let cart = sessionStorage.getItem("cart");
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
              <img src="assets/img/igrBio/${item.image}" width="80" height="80" class="rounded me-3">
              <div>
                <h6 class="mb-1">${item.title}</h6>
                <small class="mb-1 text-muted">${item.price} MAD each</small>
              </div>
            </div>
            <small class="d-flex align-items-center">
              <button onclick="updateQuantity(${index}, -1, true)" class="btn btn-sm btn-outline-secondary">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button onclick="updateQuantity(${index}, 1, true)" class="btn btn-sm btn-outline-secondary">+</button>
            </small>
            <span class="mx-3">${itemTotal.toFixed(2)} MAD</span>
            <button onclick="removeItem(${index}, true)" class="btn btn-sm btn-outline-danger">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
    });

    // Update summary
    document.getElementById("summary-subtotal").textContent = subtotal.toFixed(2) + " MAD";
    document.getElementById("summary-discount").textContent = appliedDiscount.toFixed(2) + " MAD";
    document.getElementById("summary-total").textContent = (subtotal - appliedDiscount).toFixed(2) + " MAD";
}


document.addEventListener("DOMContentLoaded", () => {
    loadCartPage();
});



// Discount code logic
let appliedDiscount = 0;

function applyCoupon() {
    const code = document.getElementById("coupon-code").value.trim().toUpperCase();
    let subtotal = 0;
    let cart = sessionStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    cart.forEach(item => {
        subtotal += parseFloat(item.price) * item.quantity;
    });

    if (code == "DISCOUNT10") {
        appliedDiscount = subtotal * 0.10; // 10% off
    } else if (code == "DISCOUNT50") {
        appliedDiscount = 50; // fixed amount
    } else {
        appliedDiscount = 0;
        alert("Invalid coupon code");
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
    alert("Please fill in all required fields (Name, Phone, Address).");
    return;
  }
  // Optional: additional phone format check
  const phoneRegex = /^(05|06|07)[0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    alert("Phone number is invalid. It should start with 05/06/07 and be 10 digits.");
    return;
  }

  // --- Get cart and compute products/total ---
  let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
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
  btn.textContent = "Placing order...";

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

    alert("✅ Order placed successfully!");
    sessionStorage.removeItem("cart");
    form.reset();
    loadCart();
    updateCartCount();
    loadCartPage();
    updateCartCount();
    // hide checkout form or reset UI as needed
  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to submit order. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Place Order";
  }
});



// Modal logic (view product details in popup)
function openProductModal(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;

  // Fill modal content
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalImage").src = `assets/img/igrBio/${product.image}`;
  document.getElementById("modalImage").alt = product.title;
  document.getElementById("modalPrice").textContent = `MAD ${product.price}.00`;
  document.getElementById("modalDescription").textContent = product.description;

  document.getElementById("modalTags").innerHTML = `
      <small class="badge bg-light text-dark me-1">${product.quantity}</small>
      <small class="badge bg-light text-dark me-1">${product.type}</small>
    `
    
  document.getElementById("addProductBtn").innerHTML = `
      <div class="btn btn-outline-success w-100 rounded py-2" onclick="addToCart(${productId})">
          <i class="fas fa-cart-plus"></i><small> Add to cart</small>
      </div>
    `

  // Show the modal (Bootstrap 5)
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}
