from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, CartItem, Product
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re
import json
from urllib import parse, request as urlrequest

api = Blueprint('api', __name__)


def validate_email(email):
    """Validar formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Validar contraseña - mínimo 8 caracteres"""
    if not password or len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres"
    return True, None


def validate_email_unique(email):
    """Verificar que el email no esté registrado"""
    existing_user = User.query.filter_by(email=email).first()
    return existing_user is None


def fetch_ml_price(title):
    """Intentar obtener precio desde Mercado Libre; si falla retorna None."""
    try:
        query = parse.quote_plus(title)
        url = f"https://api.mercadolibre.com/sites/MLA/search?q={query}&limit=1"
        with urlrequest.urlopen(url, timeout=5) as resp:
            if resp.status != 200:
                return None
            data = json.loads(resp.read().decode('utf-8'))
            if not data.get('results'):
                return None
            first = data['results'][0]
            return float(first.get('price')) if first.get('price') is not None else None
    except Exception:
        return None


@api.route('/register', methods=['POST'])
def register():
    """Crear nuevo usuario con validaciones"""
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email y contraseña son requeridos"}), 400

        if not validate_email(data['email']):
            return jsonify({"msg": "Formato de email inválido"}), 400

        valid_pwd, pwd_error = validate_password(data['password'])
        if not valid_pwd:
            return jsonify({"msg": pwd_error}), 400

        if not validate_email_unique(data['email']):
            return jsonify({"msg": "Este email ya está registrado"}), 409

        user = User(email=data['email'], password=data['password'])
        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "Usuario creado exitosamente", "user": user.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear usuario: {str(e)}"}), 500


@api.route('/signup', methods=['POST'])
def signup():
    """Alias para /register"""
    return register()


@api.route('/login', methods=['POST'])
def login():
    """Autenticar usuario y generar JWT"""
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email y contraseña son requeridos"}), 400

        user = User.query.filter_by(
            email=data['email'],
            password=data['password']
        ).first()

        if not user:
            return jsonify({"msg": "Credenciales inválidas"}), 401

        if not user.is_active:
            return jsonify({"msg": "Esta cuenta ha sido desactivada"}), 403

        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": user.serialize()}), 200

    except Exception as e:
        return jsonify({"msg": f"Error en login: {str(e)}"}), 500


@api.route('/token', methods=['POST'])
def token():
    """Alias para /login"""
    return login()


@api.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    """Obtener datos del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        return jsonify(user.serialize()), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    """Actualizar datos del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        data = request.get_json()

        if data.get('email'):
            if not validate_email(data['email']):
                return jsonify({"msg": "Formato de email inválido"}), 400

            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user_id:
                return jsonify({"msg": "Este email ya está en uso"}), 409

            user.email = data['email']

        if data.get('password'):
            valid_pwd, pwd_error = validate_password(data['password'])
            if not valid_pwd:
                return jsonify({"msg": pwd_error}), 400
            user.password = data['password']

        db.session.commit()
        return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al actualizar: {str(e)}"}), 500


@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    """Eliminar cuenta del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        CartItem.query.filter_by(user_id=user_id).delete()

        db.session.delete(user)
        db.session.commit()

        return jsonify({"msg": "Cuenta eliminada exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al eliminar: {str(e)}"}), 500


@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Obtener carrito del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        cart_items = CartItem.query.filter_by(user_id=user_id).all()
        return jsonify([item.serialize() for item in cart_items]), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Agregar producto al carrito"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not all(k in data for k in ['product_id', 'title', 'price', 'thumbnail']):
            return jsonify({"msg": "Datos incompletos"}), 400

        existing_item = CartItem.query.filter_by(
            user_id=user_id,
            product_id=data['product_id']
        ).first()

        if existing_item:
            existing_item.quantity += 1
            db.session.commit()
            return jsonify({"msg": "Cantidad actualizada", "item": existing_item.serialize()}), 200

        cart_item = CartItem(
            user_id=user_id,
            product_id=data['product_id'],
            title=data['title'],
            price=data['price'],
            thumbnail=data['thumbnail'],
            quantity=1
        )
        db.session.add(cart_item)
        db.session.commit()
        return jsonify({"msg": "Producto agregado al carrito", "item": cart_item.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    try:
        user_id = get_jwt_identity()
        cart_item = CartItem.query.filter_by(
            id=item_id, user_id=user_id).first()

        if not cart_item:
            return jsonify({"msg": "Producto no encontrado en carrito"}), 404

        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"msg": "Producto removido del carrito"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Vaciar todo el carrito"""
    try:
        user_id = get_jwt_identity()
        CartItem.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({"msg": "Carrito vaciado"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/products', methods=['GET'])
def get_products():
    """Obtener todos los productos"""
    try:
        category = request.args.get('category')

        if category:
            products = Product.query.filter_by(category=category).all()
        else:
            products = Product.query.all()

        serialized = []
        for product in products:
            item = product.serialize()
            ml_price = fetch_ml_price(product.title)
            if ml_price is not None:
                item['price'] = ml_price
            serialized.append(item)

        return jsonify(serialized), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Obtener un producto específico"""
    try:
        product = Product.query.get(product_id)

        if not product:
            return jsonify({"msg": "Producto no encontrado"}), 404

        item = product.serialize()
        ml_price = fetch_ml_price(product.title)
        if ml_price is not None:
            item['price'] = ml_price

        return jsonify(item), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    """Crear nuevo producto (requiere autenticación)"""
    try:
        data = request.get_json()

        required_fields = ['title', 'price', 'thumbnail', 'category']
        if not all(k in data for k in required_fields):
            return jsonify({"msg": "Campos requeridos: title, price, thumbnail, category"}), 400

        if not isinstance(data['price'], (int, float)) or data['price'] <= 0:
            return jsonify({"msg": "El precio debe ser un número positivo"}), 400

        product = Product(
            title=data['title'],
            price=data['price'],
            description=data.get('description', ''),
            thumbnail=data['thumbnail'],
            category=data['category'],
            stock=data.get('stock', 10)
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({"msg": "Producto creado", "product": product.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Actualizar un producto"""
    try:
        product = Product.query.get(product_id)

        if not product:
            return jsonify({"msg": "Producto no encontrado"}), 404

        data = request.get_json()
        if 'title' in data:
            product.title = data['title']
        if 'price' in data:
            if not isinstance(data['price'], (int, float)) or data['price'] <= 0:
                return jsonify({"msg": "El precio debe ser un número positivo"}), 400
            product.price = data['price']
        if 'description' in data:
            product.description = data['description']
        if 'thumbnail' in data:
            product.thumbnail = data['thumbnail']
        if 'category' in data:
            product.category = data['category']
        if 'stock' in data:
            product.stock = data['stock']

        db.session.commit()

        return jsonify({"msg": "Producto actualizado", "product": product.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Eliminar un producto"""
    try:
        product = Product.query.get(product_id)

        if not product:
            return jsonify({"msg": "Producto no encontrado"}), 404

        db.session.delete(product)
        db.session.commit()

        return jsonify({"msg": "Producto eliminado"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500
