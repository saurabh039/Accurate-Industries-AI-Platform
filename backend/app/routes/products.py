from flask import Blueprint, jsonify, request
import json, os

products_bp = Blueprint('products', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'frontend', 'assets', 'data', 'products.json')

def read_products():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

def write_products(data):
    with open(DATA_PATH, 'w') as f:
        json.dump(data, f, indent=2)

@products_bp.route('/products', methods=['GET'])
def get_products():
    return jsonify(read_products())

@products_bp.route('/products', methods=['POST'])
def add_product():
    data = request.json
    products = read_products()
    products.append(data)
    write_products(products)
    return jsonify({"message": "Product added"}), 201

@products_bp.route('/products/<int:index>', methods=['DELETE'])
def delete_product(index):
    products = read_products()
    if index < 0 or index >= len(products):
        return jsonify({"error": "Invalid index"}), 400
    products.pop(index)
    write_products(products)
    return jsonify({"message": "Deleted"})