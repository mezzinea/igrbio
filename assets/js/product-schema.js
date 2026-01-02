const baseUrl = "https://igrbio.com";
const currency = "MAD"; // adjust if needed

// Group products by title (core product)
const grouped = {};

products.forEach(p => {
  if (!grouped[p.title]) {
    grouped[p.title] = {
      name: p.title,
      description: p.description,
      category: p.type,
      keywords: p.tags.replaceAll("|", ", "),
      images: new Set(),
      offers: []
    };
  }

  grouped[p.title].images.add(`${baseUrl}/assets/img/igrBio/${p.image}`);

  grouped[p.title].offers.push({
    "@type": "Offer",
    "sku": `${p.type.toUpperCase()}-${p.title.replace(/\s+/g, "-").toUpperCase()}-${p.quantity}`,
    "price": p.price,
    "priceCurrency": currency,
    "availability": "https://schema.org/InStock",
    "url": `${baseUrl}/en/shop.html?product=${encodeURIComponent(p.title)}`
  });
});

// Build final schema graph
const schemaGraph = Object.values(grouped).map(p => ({
  "@type": "Product",
  "name": p.name,
  "description": p.description,
  "category": p.category,
  "keywords": p.keywords,
  "image": Array.from(p.images),
  "offers": p.offers
}));

document.getElementById("product-schema").textContent =
  JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemaGraph
  });
