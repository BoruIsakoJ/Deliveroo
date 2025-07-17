import re

from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint, UniqueConstraint
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    phone_number = db.Column(db.String, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    isAdmin = db.Column(db.Boolean, nullable=False)
    isVerified = db.Column(db.Boolean, nullable=False)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    orders = db.relationship("Order", backref="user", cascade="all, delete-orphan")
    token_verifications = db.relationship("Token_Verification", backref="user", cascade="all, delete-orphan")


    @property
    def password(self):
        raise AttributeError("Password cannot be viewed.")
    
    @password.setter
    def password(self, plain_password):
        self.password_hash = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        return check_password_hash(self.password_hash, plain_password)
    

    @validates("email")
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format")
        return email
    

    @validates("phone_number")
    def validate_phone(self, key, phone_number):
        if not re.match(r"^\+?\d{7,15}$", phone_number):
            raise ValueError("Invalid phone number format")
        return phone_number
    

    def __repr__(self):
        return f"<User {self.id}: {self.name}, {self.email}, {self.phone_number}>"



class Courier(db.Model, SerializerMixin):
    __tablename__ = "couriers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    phone_number = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    orders = db.relationship("Order", backref="courier", cascade="all, delete-orphan")


    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    @validates("rating")
    def validate_rating(self, key, value):
        if not (1 <= value <= 5):
            raise ValueError("Rating must be an integer between 1 and 5")
        return value


    @validates("email")
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format")
        return email
    

    @validates("phone_number")
    def validate_phone(self, key, phone_number):
        if not re.match(r"^\+?\d{7,15}$", phone_number):
            raise ValueError("Invalid phone number format")
        return phone_number


    def __repr__(self):
        return f"<Courier {self.id}: {self.name}, {self.email}, {self.phone_number}>"



class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    courier_id = db.Column(db.Integer, db.ForeignKey('couriers.id'), nullable=False)
    pickup_location = db.Column(db.String, nullable=False)
    destination = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    present_location = db.Column(db.String, nullable=False)
    weight_in_kg = db.Column(db.Float, nullable=False)
    price_estimate = db.Column(db.Float, nullable=False)
    delivery_photo = db.Column(db.String, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    order_status_history = db.relationship("Order_Status_History", back_populates="order", uselist=False, cascade="all, delete-orphan")

    
    def __repr__(self):
        return f"<Order {self.id}: {self.user_id}, {self.courier_id}, {self.pickup_location}, {self.destination}, {self.status}, {self.weight_in_kg}, {self.price_estimate}>"



class Token_Verification(db.Model, SerializerMixin):
    __tablename__ = "token_verifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    isUsed = db.Column(db.Boolean, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())


    def __repr__(self):
        return f"<Token Verification {self.id}: {self.user_id}, {self.token}, {self.expires_at}, {self.isUsed}>"



class Order_Status_History(db.Model, SerializerMixin):
    __tablename__ = "order_status_histories"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    status = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    updates_by = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    order = db.relationship("Order", back_populates="order_status_history")


    def __repr__(self):
        return f"<Order Status History {self.id}: {self.order_id}, {self.status}>"