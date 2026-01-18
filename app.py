from flask import Flask, request, jsonify, send_from_directory, redirect
from flask_cors import CORS
import requests
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

GAS_URL = os.getenv("GAS_URL")

# ---- CORS from ENV ----
cors_origins_env = os.getenv("CORS_ORIGINS", "")
cors_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

if cors_origins:
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_origins,
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })


# ---- Serve home page ----
@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


# ---- API: place order ----
@app.route("/api/place-order", methods=["POST"])
def place_order():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    required = ["name", "phone", "address", "products", "total"]
    for k in required:
        if not data.get(k):
            return jsonify({"error": "Missing field"}), 400

    try:
        r = requests.post(GAS_URL, json=data, timeout=10)
        if r.status_code != 200:
            print("GAS status:", r.status_code, r.text)
            return jsonify({"error": "Sheet error"}), 500
    except Exception as e:
        print("GAS exception:", e)
        return jsonify({"error": "Server error"}), 500

    return jsonify({"ok": True})


# ---- Serve static files WITH directory index support ----
@app.route("/<path:req_path>")
def serve_files(req_path):
    abs_path = os.path.join(BASE_DIR, req_path)

    # If path is a file → serve it
    if os.path.isfile(abs_path):
        return send_from_directory(BASE_DIR, req_path)

    # If path is a directory → serve index.html inside it
    if os.path.isdir(abs_path):
        index_file = os.path.join(abs_path, "index.html")
        if os.path.isfile(index_file):
            return send_from_directory(abs_path, "index.html")

    # Otherwise → redirect to home
    return redirect("/", code=302)


# ---- Redirect true 404 as well ----
@app.errorhandler(404)
def not_found(e):
    return redirect("/", code=302)
