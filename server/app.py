from flask import Flask,request,session,make_response,render_template
from config import Config
from flask import Flask
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError

from models import db, User, Order, TrackingOrder

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_object(Config)
db.init_app(app)
api = Api(app)

CORS(app, supports_credentials=True)

migrate = Migrate(app, db)

@app.route("/")
def index():
    return '<h1>Backend is working</h1>'


class Register(Resource):
    def post(self):
        data = request.get_json()

        name=data.get('name')
        email=data.get('email')
        phone_number=data.get('phone_number')
        password=data.get('password')

        try:
            new_user = User(name=name,email=email,phone_number=phone_number,password_hash=password)
            db.session.add(new_user)
            db.session.commit()
            session['user_id']=new_user.id

            return make_response(
                new_user.to_dict(),
                201
            )
        except IntegrityError:
            db.session.rollback()
            return make_response(
                {'error':'Email already exists. Please use a different email'},
                409
            )
        
        except KeyError as e:
            db.session.rollback()
            return make_response(
                {'error':f'Missing required field: {str(e)}'},
                400
            )
        
        except ValueError as e:
            db.session.rollback()
            return make_response(
                {'error':str(e)},
                400
            )


api.add_resource(Register, '/register')



class Login(Resource):
    def post(self):
        data = request.get_json()

        email= data.get('email')
        password= data.get('password')

        if not email:
            return make_response(
                {'error':'Please fill out the email field'},
                400
            )
        if not password:
            return make_response(
                {'error':'Please fill out the password field'},
                400
            )
        
        user = User.query.filter(User.email==email).first()
        if user and user.authenticate(password):
            session['user_id']=user.id
            return make_response(
                user.to_dict(),
                201
            )
        
        else:
            return make_response(
                {'error':'Unauthorized!'},
                422
            )


api.add_resource(Login, '/login')
    


class OrderByIdResource(Resource):
    def get(self,id):

        order = Order.query.filter(Order.tracking_number==id).first()
        if not order:
            return make_response(
                {'error':f'Order with tracking number {id} does not exists'},
                400
            )
        return make_response(
            order.to_dict(),
            200
        )


api.add_resource(OrderByIdResource,'/orders/<string:id>')


if __name__ == "__main__":
    app.run(port=5000, debug=True)