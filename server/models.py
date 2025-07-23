from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from random import randint
from sqlalchemy import event

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__='users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone_number = db.Column(db.String,nullable=False)
    _password_hash = db.Column(db.String,nullable=False)
    isAdmin = db.Column(db.Boolean,default=False)
    isCourier = db.Column(db.Boolean, default=False)

    orders = db.relationship('Order', back_populates='user', foreign_keys='Order.user_id')
    deliveries = db.relationship('Order', back_populates='courier', foreign_keys='Order.courier_id')

    serialize_rules=('-orders.user',)

    def _repr_(self):
        return f'<User {self.name}>'
    
    @validates('name')
    def validate_name(self,key,name):
        if not name:
            raise ValueError ('Please fill out the name field')
        return name
    
    @validates('email')
    def validate_email(self,key,email):
        if not email:
            raise ValueError('Please fill out the email field')
        
        if '@' not in email:
            raise ValueError('Invalid email address. Address must have \'@\' symbol')

        return email
    
    @validates('phone_number')
    def validate_phone_number(self,key,phone_number):
        if not phone_number:
            raise ValueError('Please fill out the phone number field')
        return phone_number
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self,password):
        from app import bcrypt
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self,password):
        from app import bcrypt
        return bcrypt.check_password_hash(
            self._password_hash,password.encode('utf-8')
        )

class Order(db.Model,SerializerMixin):
    __tablename__='orders'

    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String, unique=True, nullable=False)
    pickup_location=db.Column(db.String, nullable=False)
    destination = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default='Pending')
    present_location = db.Column(db.String)
    weight_in_kg = db.Column(db.Float, nullable=False)
    price_estimate = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    courier_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='orders', foreign_keys=[user_id])
    courier = db.relationship('User', back_populates='deliveries', foreign_keys=[courier_id])

    tracking_orders = db.relationship('TrackingOrder', back_populates='order')

    serialize_rules = ('-user.orders','-courier.deliveries','-tracking_orders.order',)

@event.listens_for(Order, 'before_insert')
def generate_tracking_number(mapper,connect,target):
    while True:
        random_number = randint(100000,999999)
        target.tracking_number =f'DEL{random_number}'

        existing = Order.query.filter(Order.tracking_number==target.tracking_number).first()
        if not existing:
            break


class TrackingOrder(db.Model,SerializerMixin):
    __tablename__='tracking_updates'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String)
    description = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))

    order = db.relationship('Order', back_populates='tracking_orders')

    serialize_rules = ('-order.tracking_orders',)