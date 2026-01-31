import csv
import os
import re

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
        "back_info": "* عد إلى المتجر لاختيار منتجات متنوعة بفوائد مختلفة وبأحجام متعددة",
        "back_label": "تسوق الآن",
        "nav": {
            "home": "الرئيسية",
            "about": "من نحن",
            "shop": "المتجر",
            "contact": "تواصل معنا",
            "legal": "قانوني"
        }
    },
    "fr": {
        "dir": "ltr",
        "currency": "MAD",
        "currency_code": "MAD",
        "quantity": "Quantité",
        "price": "Prix",
        "back_info": "* Retour à la boutique pour découvrir une large sélection de produits utiles en différentes quantités",
        "back_label": "Boutique",
        "nav": {
            "home": "Accueil",
            "about": "À propos",
            "shop": "Boutique",
            "contact": "Contact",
            "legal": "Légal"
        }
    },
    "en": {
        "dir": "ltr",
        "currency": "MAD",
        "currency_code": "MAD",
        "quantity": "Quantity",
        "price": "Price",
        "back_info": "* Go back to the shop to explore a wide range of useful products in different quantities",
        "back_label": "Shop now",
        "nav": {
            "home": "Home",
            "about": "About",
            "shop": "Shop",
            "contact": "Contact",
            "legal": "Legal"
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
      
<!-- End Header -->

<div class="container py-5">
  <div class="row justify-content-center mb-4">
    <div class="col-lg-8">
      <div class="card product-card p-4">
        <article itemscope itemtype="https://schema.org/Product">

          <h1 itemprop="name" class="text-center mb-4">{title}</h1>

          <div class="text-center mb-4">
            <img src="../../assets/img/igrBio/products/{image}"
                 alt="{title}"
                 class="img-fluid rounded"
                 width="600"
                 height="600"
                 itemprop="image">
          </div>

          <p itemprop="description">{description}</p>

          <ul class="list-unstyled">
            <li><strong>** {label_quantity} </strong> {quantity}</li>
            <li><strong>** {label_price} </strong> {price} {currency}</li>
          </ul>

          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <meta itemprop="priceCurrency" content="{currency_code}">
            <meta itemprop="price" content="{price}">
            <link itemprop="availability" href="https://schema.org/InStock">
          </div>

          <div class="text-center mt-5">
            <a href="../shop.html" class="btn btn-success px-5 py-3">
              {back_label}
            </a>
            <p class="text-muted mb-2 mt-3">{back_info}</p>
          </div>
          
        </article>
      </div>
    </div>
  </div>
</div>

<script type="application/ld+json">
{schema}
</script>
</body>
</html>
"""

# ================== LOAD ALL PRODUCTS ==================
products_by_lang = {}

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
            url=url,
            hreflang_links="\n".join(hreflang),
            schema=schema
        )


        with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
            f.write(html)

    print(f"✅ Generated: {lang}")

print("🚀 Done")
