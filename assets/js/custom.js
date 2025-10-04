
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
// Function to load products from CSV and display them
fetch("assets/data/product.csv")
.then(response => response.text())
.then(text => {
    products = parseCSV(text);
    const container = document.getElementById("shop-product-list");
    const typeSelector = document.getElementById("type-selector");
    // const suggestedSelector = document.getElementById("suggested-selector");

    function renderProducts(list) {
        container.innerHTML = "";
        list.forEach(product => {
            const tags = product.tags.split("|").map(tag => 
                `<small class="badge rounded-pill bg-light text-dark">${tag}</small>`
            ).join(" ");
            const card = `
                <div class="col-md-3" data-id=${product.id}>
                    <div class="card mb-4 product-wap rounded-0">
                        <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="assets/img/igrBio/${product.image}" alt="${product.title}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                            <li><a class="btn btn-success text-white"><i class="far fa-heart"></i></a></li>
                            <li><a class="btn btn-success text-white mt-2"><i class="far fa-eye"></i></a></li>
                            <li><button onclick="addToCart(this)" class="btn btn-success text-white mt-2"><i class="fas fa-cart-plus"></i></button></li>
                            </ul>
                        </div>
                        </div>
                        <div class="card-body">
                        <a href="shop-single.html" class="text-decoration-none">${product.title}</a>
                        <p><small>MAD </small><b>${product.price}.00</b></p>
                        <div class="row">
                            <div class="col-lg-9"> 
                            <small class="badge rounded-pill bg-light text-dark">${product.quantity}</small>
                            ${tags}
                            </div>
                            <div class="col-lg-3">
                            <a class="btn" href="#"><i class="far fa-heart"></i></a>
                            </div>
                        </div>
                        </div>
                        <div onclick="addToCart(this)" class="card-footer p-3">
                        <div class="text-center">
                            <a class="h4 text-decoration-none text-success" href="#">
                            <i class="fas fa-cart-plus"></i><small> Add to cart</small>
                            </a>
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

    // On dropdown change, filter products
    typeSelector.addEventListener("change", () => {
        const type = typeSelector.value;
        if (type) {
            renderProducts(products.filter(p => p.type === type));
        } else {
            renderProducts(products); // all
        }
    });
    // suggestedSelector.addEventListener("change", () => {
    //     const type = suggestedSelector.value;
    //     if (type) {
    //         renderProducts(products.filter(p => p.suggested === 1));
    //     } else {
    //         renderProducts(products); // all
    //     }
    // });
    
});


function addToCart(element) {
    const productId = element.closest("[data-id]").getAttribute("data-id");

    // Retrieve cart from sessionStorage
    let cart = sessionStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    // Look up product directly from global products array
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === productId);

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

    console.log("New product added to cart :", cart);
    loadCart();
    updateCartCount();
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
}


// Clear cart
function clearCart() {
    sessionStorage.removeItem("cart");
    loadCart();
    updateCartCount();
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

    if (code === "DISCOUNT10") {
        appliedDiscount = subtotal * 0.10; // 10% off
    } else if (code === "DISCOUNT50") {
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
document.getElementById("orderForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Order placed successfully ✅");
    // Here you could: 
    // - Save data to backend
    // - Or send via email / webhook
});