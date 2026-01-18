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