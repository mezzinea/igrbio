import csv
import os
from datetime import datetime
from xml.sax.saxutils import escape

# -------- CONFIG --------
languages = ["ar", "fr", "en"]
base_url = "https://igrbio.com"
output_file = "sitemap.xml"
today = datetime.today().strftime("%Y-%m-%d")

product_csv_filename = "product.csv"

# Static pages & categories
static_pages = ["index.html", "about.html", "shop.html", "contact.html", "legal.html", "cart.html"]
categories = ["honey", "oil", "amlou", "complement"]

# Base path for all product images
image_base_path = "assets/img/igrBio/"  # <--- updated path

# ------------------------

def slugify(name):
    """Convert product name to URL-friendly slug"""
    return name.lower().replace(" ", "-").replace("'", "").replace("’", "")

def generate_sitemap():
    urls = []

    # --- Static pages ---
    for lang in languages:
        for page in static_pages:
            loc = f"{base_url}/{lang}/{page}"
            urls.append({
                "loc": loc,
                "lastmod": today,
                "priority": "1"
            })
        for cat in categories:
            loc = f"{base_url}/{lang}/shop.html?type={cat}"
            urls.append({
                "loc": loc,
                "lastmod": today,
                "priority": "1"
            })

    # --- Products from CSV ---
    for lang in languages:
        csv_path = os.path.join(lang, product_csv_filename)
        if not os.path.isfile(csv_path):
            print(f"CSV not found: {csv_path}, skipping language {lang}")
            continue
        
        with open(csv_path, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')
            for row in reader:
                product_name = row.get("title", "").strip()
                quantity = row.get("quantity", "").strip()
                if not product_name or not quantity:
                    continue

                slug = slugify(product_name) + "-" + slugify(quantity)
                loc = f"{base_url}/{lang}/products/{slug}.html"

                url_entry = f"""
  <url>
    <loc>{escape(loc)}</loc>
    <lastmod>{today}</lastmod>
    <priority>1</priority>
"""
                # Single image per row
                image_file = row.get("image", "").strip()
                title = row.get("title", "").strip()
                caption = row.get("description", "").strip()
                if image_file:
                    image_full_path = f"{image_base_path}{image_file}"
                    url_entry += f"""    <image:image>
      <image:loc>{escape(base_url + '/' + image_full_path)}</image:loc>
      <image:title>{escape(title)}</image:title>
      <image:caption>{escape(caption)}</image:caption>
    </image:image>
"""
                url_entry += "  </url>"
                urls.append(url_entry)

    # --- Write sitemap.xml ---
    with open(output_file, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ')
        f.write('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n')
        for entry in urls:
            if isinstance(entry, dict):
                f.write(f"  <url>\n")
                f.write(f"    <loc>{escape(entry['loc'])}</loc>\n")
                f.write(f"    <lastmod>{entry['lastmod']}</lastmod>\n")
                f.write(f"    <priority>{entry['priority']}</priority>\n")
                f.write(f"  </url>\n")
            else:
                f.write(entry + "\n")
        f.write("</urlset>\n")

    print(f"Sitemap generated successfully: {output_file}")

if __name__ == "__main__":
    generate_sitemap()
