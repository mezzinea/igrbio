import csv
import os
import re
import random

# ================== CONFIG ==================
SITE_URL = "https://igrbio.com"
LANGUAGES = ["ar", "fr", "en"]

I18N = {
    "ar": {
        "dir": "rtl",
        "currency": "درهم",
        "currency_code": "MAD",
        "quantity": "الكمية",
        "price": "السعر",
        "back_info": "* هذه الصفحة تُستخدم لعرض تفاصيل المنتج. عد إلى المتجر لاختيار منتجات متنوعة بفوائد مختلفة وبأحجام متعددة",
        "back_label": "العودة إلى المتجر",
        "copyright_label": "© 2025 igrBio. جميع الحقوق محفوظة",
        "cart": "سلة التسوق",
        "clear_cart": "إفراغ السلة",
        "total": "الإجمالي",
        "view_cart_and_checkout": "عرض السلة وإتمام الشراء",
        "reviews": "التعليقات",
        "add_to_cart": "أضف إلى السلة",
        "instock": "متوفر",
        "rate_us": "قيمنا على جوجل",
        "nav": {
            "home": "الرئيسية",
            "about": "من نحن",
            "shop": "المتجر",
            "contact": "تواصل معنا",
            "legal": "قانوني",
            "nav_language": "العربية",
            "nav_terms": "شروط الاستخدام",
            "nav_privacy": "سياسة الخصوصية"
        },
        "service": {
            "auth": "ضمان 100% لمنتجات أصلية",
            "back": "ضمان استرداد الأموال خلال 30 يومًا",
            "ship": "شحن مجاني للطلبات فوق 300 درهم",
        }
    },
    "fr": {
        "dir": "ltr",
        "currency": "MAD",
        "currency_code": "MAD",
        "quantity": "Quantité",
        "price": "Prix",
        "back_info": "* Cette page est utilisée pour afficher les détails du produit. Retournez à la boutique pour sélectionner et explorer une large gamme de produits utiles en différentes quantités",
        "back_label": "Retour à la boutique",
        "copyright_label": "© 2025 igrBio. Tous droits réservés",
        "cart": "Panier",
        "clear_cart": "Vider le Panier",
        "total": "Total",
        "view_cart_and_checkout": "Voir le panier et payer",
        "reviews": "Avis",
        "add_to_cart": "Ajouter au panier",
        "instock": "en stock",
        "rate_us": "Donnez-nous un avis sur Google",
        "nav": {
            "home": "Accueil",
            "about": "À propos",
            "shop": "Boutique",
            "contact": "Contact",
            "legal": "Légal",
            "nav_language": "Français",
            "nav_terms": "Conditions d'utilisation",
            "nav_privacy": "Politique de confidentialité"
        },
        "service": {
            "auth": "Produits 100% authentiques garantis",
            "back": "Garantie de remboursement de 30 jours",
            "ship": "Livraison gratuite pour les commandes de plus de 300 MAD",
        }
    },
    "en": {
        "dir": "ltr",
        "currency": "MAD",
        "currency_code": "MAD",
        "quantity": "Quantity",
        "price": "Price",
        "back_info": "* This page is used to show the product details. Go back to the shop to select and explore a wide range of useful products in different quantities",
        "back_label": "Back to Shop",
        "copyright_label": "© 2025 igrBio. All rights reserved",
        "cart": "Cart",
        "clear_cart": "Clear Cart",
        "total": "Total",
        "view_cart_and_checkout": "View Cart & Checkout",
        "reviews": "Reviews",
        "add_to_cart": "Add to cart",
        "instock": "in stock",
        "rate_us": "Review us on Google",
        "nav": {
            "home": "Home",
            "about": "About",
            "shop": "Shop",
            "contact": "Contact",
            "legal": "Legal",
            "nav_language": "English",
            "nav_terms": "Terms of Service",
            "nav_privacy": "Privacy Policy"
        },
        "service": {
            "auth": "100% authentic products guaranteed",
            "back": "30-day money-back guarantee",
            "ship": "Free shipping on orders over MAD 300",
        }
    }
}

# ================== HELPERS ==================
def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text.strip())
    return text

# ================== HTML TEMPLATE ==================
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="{lang}" dir="{dir}">
<head>
    <meta charset="utf-8">
    <title>{title} | igrBio</title>
    <meta name="description" content="{description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="canonical" href="{url}">
    {hreflang_links}

    <link rel="shortcut icon" type="image/x-icon" href="../../assets/img/igrBio/logo/igrbio-icon.webp">

    <link rel="stylesheet" href="../../assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../assets/css/igrbiomo.css">
    <link rel="stylesheet" href="../../assets/css/custom.css">

    <!-- Load fonts style after rendering the layout styles -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css" crossorigin="anonymous">


<body>

<!-- Preloader -->
<div id="preloader">
    <img src="../../assets/img/igrBio/logo/igrbio-logo-vertical-1.webp" alt="Logo">
</div>
<!-- End Preloader -->
    
<!-- Start Header -->
  
    <!-- Start Top Nav -->
    <nav class="navbar navbar-expand-lg bg-dark navbar-light py-0" id="igrbiomo_nav_top">
        <div class="container text-light">
            <div class="w-100 d-flex justify-content-between">
                <div>
                    <i class="fa fa-envelope mx-2"></i>
                    <a class="navbar-sm-brand text-light text-decoration-none" href="mailto:contact@igrbio.com">contact@igrbio.com</a>
                    <i class="fa fa-phone mx-2"></i>
                    <a class="navbar-sm-brand text-light text-decoration-none" href="tel:010-020-0340">+212 601429806</a>
                </div>
                <div>
                    <a class="text-light" href="https://www.facebook.com/share/175YWzBUHK/?mibextid=wwXIfr" target="_blank" rel="sponsored"><i class="fab fa-facebook-f fa-sm fa-fw me-2"></i></a>
                    <a class="text-light" href="https://www.instagram.com/cooperative_igrbio/" target="_blank"><i class="fab fa-instagram fa-sm fa-fw me-2"></i></a>
                    <a class="text-light" href="https://wa.me/212601429806" target="_blank"><i class="fab fa-whatsapp fa-sm fa-fw me-2"></i></a>
                </div>
            </div>
        </div>
    </nav>
    <!-- Close Top Nav -->
    
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-0">
        <div class="container">
            
            <!-- Left: Logo -->
            <a class="navbar-brand text-success logo h1 align-self-center" href="../index.html">
                <img src="../../assets/img/igrBio/logo/igrbio-logo-horizontal-1.webp" alt="igrBio Logo" width="120">
            </a>
            
            <div class="d-none d-lg-block">
                <ul class="nav navbar-nav mx-lg-auto">
                    <li class="nav-item px-3">
                        <a class="nav-link" href="../index.html">{nav_home}</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link" href="../about.html">{nav_about}</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link" href="../shop.html">{nav_shop}</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link" href="../contact.html">{nav_contact}</a>
                    </li>
                    <li class="nav-item px-3">
                        <a class="nav-link" href="../legal.html">{nav_legal}</a>
                    </li>
                </ul>
            </div>

            <!-- Right: Language + Cart -->
            <div class="navbar justify-content-end" id="igrbiomo_main_nav">
                <div class="navbar d-flex align-items-center">
                    
                    <!-- Language Dropdown -->
                    <div class="dropdown me-3">
                        <button class="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center"
                            type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fal fa-globe" alt="{nav_language}" id="selected-flag"></i>
                            <small class="px-2" id="selected-lang">{nav_language}</small>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                            <li onclick="setLanguage('en')">
                                <a class="dropdown-item d-flex align-items-center" href="../../en/" data-lang="en">
                                    en - <small style="margin-left: 5px;">English</small>
                                </a>
                            </li>
                            <li onclick="setLanguage('ar')">
                                <a class="dropdown-item d-flex align-items-center" href="../../ar/" data-lang="ar">
                                    ar - <small style="margin-left: 5px;">العربية</small>
                                </a>
                            </li>
                            <li onclick="setLanguage('fr')">
                                <a class="dropdown-item d-flex align-items-center" href="../../fr/" data-lang="fr">
                                    fr - <small style="margin-left: 5px;">Français</small>
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Cart Icon -->
                    <a onclick="toggleCart()" class="nav-icon position-relative text-decoration-none" href="#">
                        <i class="fal fa-shopping-bag fa-lg d-block"></i>
                        <small id="cart-count"
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white"
                            style="display: none;">0</small>
                    </a>

                </div>
            </div>
        </div>
    </nav>
    <!-- Close Header -->
    
    <!-- Bottom Navigation -->
    <nav class="navbar navbar-white bg-white fixed-bottom d-block d-lg-none py-2 navbar-bottom" style="box-shadow: 0 -1px 60px rgba(0, 0, 0, 0.06);">
        <div class="container d-flex justify-content-around px-0 pt-2 col-11">
            <a class="nav-link text-center p-0 text-dark" href="../index.html" data-page="index.html">
                <i class="fal fa-home fa-lg d-block" style="font-size: 1.2rem"></i>
                <small class="d-block pt-1" style="font-size: 0.6rem">{nav_home}</small>
            </a>
            <a class="nav-link text-center p-0 text-dark" href="../about.html" data-page="about.html">
                <i class="fal fa-info-circle fa-lg d-block" style="font-size: 1.2rem"></i>
                <small class="d-block pt-1" style="font-size: 0.6rem">{nav_about}</small>
            </a>
            <a class="nav-link text-center p-0 text-dark" href="../shop.html" data-page="shop.html">
                <i class="fal fa-shopping-bag fa-lg d-block" style="font-size: 1.2rem"></i>
                <small class="d-block pt-1" style="font-size: 0.6rem">{nav_shop}</small>
            </a>
            <a class="nav-link text-center p-0 text-dark" href="../contact.html" data-page="contact.html">
                <i class="fal fa-envelope fa-lg d-block" style="font-size: 1.2rem"></i>
                <small class="d-block pt-1" style="font-size: 0.6rem">{nav_contact}</small>
            </a>
            <a class="nav-link text-center p-0 text-dark" href="../legal.html" data-page="legal.html">
                <i class="fal fa-user-shield fa-lg d-block" style="font-size: 1.2rem"></i>
                <small class="d-block pt-1" style="font-size: 0.6rem">{nav_legal}</small>
            </a>
        </div>
    </nav>
    <!-- End of Fixed Bottom Navbar -->
    
    <!-- Cart Sidebar -->
    <div id="cart-sidebar" class="cart-sidebar">
        <div class="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 class="m-0">{cart}</h5>
            <a href="#" onclick="clearCart()" class="text-danger text-decoration-none">{clear_cart}</a>
            <button onclick="toggleCart()" class="btn-close">X</button>
        </div>

        <div id="cart-items" class="cart-items p-3"></div>

        <div class="cart-footer border-top p-3">
            <div class="d-flex justify-content-between mb-3">
            <strong>{total}</strong>
            <strong id="cart-total">0</strong>
            </div>
            <a href="cart.html" class="btn btn-outline-success w-100">{view_cart_and_checkout}</a>
        </div>
    </div>
    <!-- End Cart Sidebar -->
    
    
    <span id="toast" class="toast">Message exemple</span>
    <!-- End Header -->

<!-- End Header -->

<div class="py-5" style="  
        position: relative;
        min-height: 500px;
        background: 
            linear-gradient(rgba(255,255,255,0.7), rgba(255, 255, 255, 1)),
            url('../../assets/img/igrBio/home-back.webp') center/cover no-repeat;
        ">
    <div class="container">
    <div class="row justify-content-center mb-4">
        <div class="col-lg-12">
        <div class="bg-white shadow-0 p-4" style="border-radius: 10px;">
            <article itemscope itemtype="https://schema.org/Product">
            
                <div class="row">
                    <div class="col-md-6 text-center mb-4">
                        <img src="../../assets/img/igrBio/products/{image}"
                            alt="{title}"
                            class="img-fluid rounded"
                            width="600"
                            height="600"
                            itemprop="image">
                    </div>
                    
                    <div class="col-md-5 pt-5">
                        <h1 itemprop="name" class="text-center mb-4">{title} <span class="instock">{instock}</span></h1>
                        <p itemprop="description">{description}</p>
                        <ul class="list-unstyled">
                            <li><strong>{label_quantity} </strong> {quantity}</li>
                            <li><strong>{label_price} </strong> {price} {currency}</li>
                        </ul>
                    
                                                
                        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                            <meta itemprop="priceCurrency" content="{currency_code}">
                            <meta itemprop="price" content="{price}">
                            <link itemprop="availability" href="https://schema.org/InStock">
                        </div>
                        
                        <div class="text-center mb-2 mt-4" onclick="addToCart({id})">
                            <span class="btn btn-success w-100 py-2 rounded">
                                <i class="fas fa-cart-plus px-2"></i>
                                {add_to_cart}
                            </span>
                        </div>
                        
                        <div class="text-center mb-2 mt-2">
                            <a href="../shop.html" class="btn btn-outline-success w-100 py-2 rounded">
                                {back_label}
                            </a>
                        </div>
                        
                        <a href="../shop.html" class="text-muted mb-2 mt-5"><small>{back_info}</small></a>
                                            
                        
                        <div class="row text-center pt-5">
                            <div class="m-auto">
            
                                <div class="row justify-content-between bg-white shadow-sm">
                                    <div class="col-md-4">
                                        <div class="py-3 px-2">
                                            <i class="fas fa-truck text-success"></i>
                                            <br>
                                            <small>{service_ship}</small>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="py-3 px-2">
                                            <i class="fas fa-undo text-success"></i>
                                            <br>
                                            <small>{service_back}</small>
                                        </div>                           
                                    </div>
                                    <div class="col-md-4">
                                        <div class="py-3 px-2">
                                            <i class="fas fa-shield-alt text-success"></i>
                                            <br>
                                            <small>{service_auth}</small>
                                        </div>                             
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        
                        <div class="reviews pt-5">
                            <div class="stars">
                                ★★★★★
                            </div>
                            <small class="review-count">5/5</small>
                        </div>
                        
                        <!-- Google review CTA -->
                        <a href="https://g.page/r/CZI-_LM-N46fEBM/review" target="_blank" class="btn btn-review">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"/>
                            {rate_us}
                        </a>
                        
                    </div>
                </div>
                
                
                

                
            
            </article>
        </div>
        </div>
    </div>
    </div>
</div>

<!-- Start Script -->
<script src="../../assets/js/bootstrap.bundle.min.js"></script>
<script src="../../assets/js/custom.js?v=5"></script>
<script type="application/ld+json">
{schema}
</script>
<!-- End Script -->

</body>

<!-- Start Footer -->
<footer class="bg-dark text-white text-center" id="tempaltemo_footer">
    <div class="container py-5">
        <div class="d-flex justify-content-center align-items-center">
            <img src="../../assets/img/igrBio/logo/igrbio-logo-vertical-2.webp" class="py-3" alt="igrBio Logo" width="120px">
        </div>
        <hr class="bg-white">
        <div class="row pt-5 mb-3 justify-content-center">

            <div class="col-md-3">
                <h4>Legal</h4>
                <ul class="list-unstyled footer-link-list">
                    <li><a class="text-decoration-none" href="../legal.html#policy">{nav_privacy}</a></li>
                    <li><a class="text-decoration-none" href="../legal.html#service">{nav_terms}</a></li>
                </ul>
            </div>
            
            <div class="col-md-3">
                <h4>Navigation</h4>
                <ul class="list-unstyled footer-link-list">
                    <li><a class="text-decoration-none" href="../index.html">{nav_home}</a></li>
                    <li><a class="text-decoration-none" href="../shop.html">{nav_shop}</a></li>
                    <li><a class="text-decoration-none" href="../about.html">{nav_about}</a></li>
                </ul>
            </div>
            
            <div class="col-md-3">
                <h4>Contact us</h4>
                <ul class="list-unstyled footer-link-list">
                    <li><a class="text-decoration-none" href="mailto:contact@igrbio.com">contact@igrbio.com</a></li>
                    <li><a class="text-decoration-none" href="../contact.html">{nav_contact}</a></li>
                </ul>
            </div>

        </div>

        <div class="row">
            <div class="text-center">
                <div class="">
                    <ul class="list-inline text-center footer-icons">
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-decoration-none" target="_blank" href="https://www.facebook.com/share/175YWzBUHK/?mibextid=wwXIfr"><i class="fab fa-facebook-f fa-lg fa-fw"></i></a>
                        </li>
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-decoration-none" target="_blank" href="https://www.instagram.com/cooperative_igrbio/"><i class="fab fa-instagram fa-lg fa-fw"></i></a>
                        </li>
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-decoration-none" target="_blank" href="https://wa.me/212601429806"><i class="fab fa-whatsapp fa-lg fa-fw"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
                    
        <div class="row">
            <div class="text-center">
                <a class="px-2 text-decoration-none" href="../../fr/" onclick="setLanguage('fr')">Français</a>
                <a class="px-2 text-decoration-none" href="../../en/" onclick="setLanguage('en')">English</a>
                <a class="px-2 text-decoration-none" href="../../ar/" onclick="setLanguage('ar')">العربية</a>
            </div>
        </div>
    </div>
    
    <div class="bg-black py-2">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <span class="text-center">
                        <small>{copyright_label}</small> 
                    </span>
                </div>
            </div>
        </div>
    </div>

</footer>
<!-- End Footer -->
</html>
"""

# ================== LOAD ALL PRODUCTS ==================
products_by_lang = {}

def reviews_from_product_id(product_id, min_id=0, max_id=40,
                            min_reviews=5, max_reviews=23,
                            ):
    # Linear scaling
    base = min_reviews + (product_id - min_id) * (max_reviews - min_reviews) / (max_id - min_id)
    
    # Add randomness
    reviews = int(round(base + 3))
    
    # Clamp to allowed range
    return max(min_reviews, min(max_reviews, reviews))

for lang in LANGUAGES:
    products_by_lang[lang] = {}
    csv_path = os.path.join(lang, "product.csv")

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")  # ✅ header auto-used
        for row in reader:
            products_by_lang[lang][row["id"]] = row

# ================== GENERATE PAGES ==================
for lang in LANGUAGES:
    output_dir = os.path.join(lang, "products")
    os.makedirs(output_dir, exist_ok=True)

    for pid, row in products_by_lang[lang].items():
        slug = slugify(f"{row['title']} {row['quantity']}")
        filename = f"{slug}.html"
        url = f"{SITE_URL}/{lang}/products/{filename}"
        
        reviews_number = reviews_from_product_id(int(row["id"]))

        # hreflang
        hreflang = []
        for alt in LANGUAGES:
            alt_row = products_by_lang[alt].get(pid)
            if not alt_row:
                continue
            alt_slug = slugify(f"{alt_row['title']} {alt_row['quantity']}")
            hreflang.append(
                f'  <link rel="alternate" hreflang="{alt}" href="{SITE_URL}/{alt}/products/{alt_slug}.html">'
            )
        hreflang.append(
            f'  <link rel="alternate" hreflang="x-default" href="{SITE_URL}/products">'
        )

        # schema
        schema = f"""{{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "{row['title']} {row['quantity']}",
            "image": "{SITE_URL}/assets/img/igrBio/products/{row['image'].split('/')[-1]}",
            "description": "{row['description']}",
            "brand": {{ "@type": "Brand", "name": "igrBio" }},
            "offers": {{
                "@type": "Offer",
                "priceCurrency": "{I18N[lang]['currency_code']}",
                "price": "{row['price']}",
                "availability": "https://schema.org/InStock"
            }}
        }}"""

        html = HTML_TEMPLATE.format(
            lang=lang,
            dir=I18N[lang]["dir"],
            id=row["id"],
            title=f"{row['title']} {row['quantity']}",
            description=row["description"],
            image=row["image"].split("/")[-1],
            quantity=row["quantity"],
            price=row["price"],
            currency=I18N[lang]["currency"],
            currency_code=I18N[lang]["currency_code"],
            label_quantity=I18N[lang]["quantity"],
            label_price=I18N[lang]["price"],
            back_label=I18N[lang]["back_label"],
            back_info=I18N[lang]["back_info"],
            nav_home=I18N[lang]["nav"]["home"],
            nav_about=I18N[lang]["nav"]["about"],
            nav_shop=I18N[lang]["nav"]["shop"],
            nav_contact=I18N[lang]["nav"]["contact"],
            nav_legal=I18N[lang]["nav"]["legal"],
            nav_language=I18N[lang]["nav"]["nav_language"],
            nav_terms=I18N[lang]["nav"]["nav_terms"],
            nav_privacy=I18N[lang]["nav"]["nav_privacy"],
            copyright_label=I18N[lang]["copyright_label"],
            cart=I18N[lang]["cart"],
            clear_cart=I18N[lang]["clear_cart"],
            total=I18N[lang]["total"],
            view_cart_and_checkout=I18N[lang]["view_cart_and_checkout"],
            reviews=I18N[lang]["reviews"]+" (*) ",
            add_to_cart=I18N[lang]["add_to_cart"],
            service_auth=I18N[lang]["service"]["auth"],
            service_back=I18N[lang]["service"]["back"],
            service_ship=I18N[lang]["service"]["ship"],
            rate_us=I18N[lang]["rate_us"],
            instock=I18N[lang]["instock"],
            url=url,
            hreflang_links="\n".join(hreflang),
            schema=schema
        )


        with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
            f.write(html)

    print(f"✅ Generated: {lang}")

print("🚀 Done")
