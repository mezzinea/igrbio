# IGRBIO

In the heart of Agadir, where argan trees meet the Atlas breeze, three friends shared a belief: that nature holds the key to well-being. Witnessing people’s silent struggles with health and intimacy issues, they sought natural solutions instead of chemical ones. Thus, IGRBIO was born — inspired by Morocco’s rich land and the purity of argan oil. After extensive research and countless trials, they created 100% natural formulas combining the power of herbs and argan to restore vitality and confidence. From a small workshop in Agadir, IGRBIO grew into a symbol of trust, connecting with men and women across the kingdom.


### Global env vars

```sh
export CORS_ORIGINS="https://igrbio.com"
export GAS_URL="https://script.google.com/macros/s/{your_key}/exec"
```

### Deploy with python :

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install flask flask-cors requests gunicorn
gunicorn -w 10 -b 0.0.0.0:5000 app:app
```


### Deploy with node.js

```sh
export PORT=5000
npm init -y
npm install express cors node-fetch dotenv
node server.js
```

### Apps script

Google sheet order saver :

```go
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name,
    data.phone,
    data.address,
    data.email,
    data.products,
    data.total
  ]);
}
```

Adding gmail notifications :

```go
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Save order to sheet
  sheet.appendRow([
    new Date(),
    data.name,
    data.phone,
    data.address,
    data.email,
    data.products,
    data.total
  ]);

  // Build email content
  const subject = "New igrBio Order Received";

  const message = `
    Customer details:
    ------------------
    Name: ${data.name}
    Phone: ${data.phone}
    Address: ${data.address}
    Email: ${data.email || "-"}

    Products:
    ---------
    ${data.products}

    Total:
    ------
    ${data.total}

    Time:
    -----
    ${new Date().toLocaleString()}
    `;

  // Send email
  GmailApp.sendEmail(
    "mezzine.abdellatif@gmail.com",
    subject,
    message
  );

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

```
