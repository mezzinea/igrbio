
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
window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    const content = document.querySelector(".content");

    // Hide preloader
    preloader.classList.add("hidden");

    // Show main content
    content.style.display = "block";
});

// Function to load products from CSV and display them
fetch("assets/data/product.csv")
.then(response => response.text())
.then(text => {
    const products = parseCSV(text);
    const container = document.getElementById("product-list");

    products.forEach(product => {
    const tags = product.tags.split("|").map(tag => 
        `<small class="badge rounded-pill bg-light text-dark">${tag}</small>`
    ).join(" ");

    const card = `
        <div class="col-md-3">
        <div class="card mb-4 product-wap rounded-0">
            <div class="card rounded-0">
            <img class="card-img rounded-0 img-fluid" src="assets/img/igrBio/${product.image}" alt="${product.title}">
            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                <ul class="list-unstyled">
                <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>
                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>
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
            <div class="card-footer p-3">
            <div class="text-center">
                <a href="shop-single.html" class="h4 text-decoration-none text-success">
                <i class="fas fa-cart-plus"></i><small> Add to cart</small>
                </a>
            </div>   
            </div>
        </div>
        </div>
    `;

    container.innerHTML += card;
    });
});