import csv
import os
import re

# ================== CONFIG ==================
SITE_URL = "https://igrbio.com"
LANGUAGES = ["ar", "fr", "en"]
ITEMS_PER_SLIDE = 6  # ✅ requested

# ================== HELPERS ==================
def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text.strip())
    return text

def chunk_list(lst, size):
    for i in range(0, len(lst), size):
        yield lst[i:i + size]

# ================== HTML + CSS ==================

SLIDER_WRAPPER = """<!DOCTYPE html>
<html lang="{lang}" dir="{dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/custom.css">
</head>

<body>

<div class="my-5 product-slider">

<div id="productSlider-{lang}" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
{slides}
  </div>

  <button class="carousel-control-prev" type="button"
          data-bs-target="#productSlider-{lang}" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>

  <button class="carousel-control-next" type="button"
          data-bs-target="#productSlider-{lang}" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>
</div>

</div>

<script src="../assets/js/bootstrap.bundle.min.js"></script>
</body>
</html>
"""

SLIDE_GROUP = """    <div class="carousel-item {active}">
      <div class="row g-3">
{items}
      </div>
    </div>
"""

SLIDE_ITEM = """        <div class="col-lg-2 col-md-4 col-sm-6">
          <a href="{url}" class="product-link">
            <div class="product-card-slider">
              <h6>{title}</h6>
              <small>{quantity}</small>
            </div>
          </a>
        </div>
"""

# ================== LOAD PRODUCTS ==================
def load_products(lang: str) -> list:
    csv_path = os.path.join(lang, "product.csv")
    products = []

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            products.append(row)

    return products

# ================== GENERATE SLIDER ==================
def generate_slider(lang: str, products: list) -> str:
    slides_html = []

    for index, group in enumerate(chunk_list(products, ITEMS_PER_SLIDE)):
        items_html = []

        for row in group:
            slug = slugify(f"{row['title']} {row['quantity']}")
            url = f"{SITE_URL}/{lang}/products/{slug}.html"

            items_html.append(
                SLIDE_ITEM.format(
                    title=row["title"],
                    quantity=row["quantity"],
                    url=url
                )
            )

        slides_html.append(
            SLIDE_GROUP.format(
                active="active" if index == 0 else "",
                items="".join(items_html)
            )
        )

    return SLIDER_WRAPPER.format(
        lang=lang,
        dir="rtl" if lang == "ar" else "ltr",
        slides="".join(slides_html)
    )

# ================== MAIN ==================
def main():
    for lang in LANGUAGES:
        products = load_products(lang)
        slider_html = generate_slider(lang, products)

        output_path = os.path.join(lang, "products-slider.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(slider_html)

        print(f"🎠 6-item slider generated: {output_path}")

    print("🚀 Done")

if __name__ == "__main__":
    main()
