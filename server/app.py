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
    

class OrderByCourierSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'User not logged in'}, 401)
        
        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'User not found'}, 404)

        orders =[order for order in Order.query.filter(Order.courier_id==user_id).all()]
        simplified_orders = []
        for order in orders:
            simplified_orders.append({
                'id': order.id,
                'tracking_number': order.tracking_number,
                'status': order.status,
                'price_estimate': order.price_estimate,
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'pickup_location': order.pickup_location,
                'destination': order.destination,
                'present_location': order.present_location,
            })

        return make_response(simplified_orders, 200)
api.add_resource(OrderByCourierSession, '/courier_orders/')

class OrderByCourieSessionById(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'User not logged in'}, 401)

        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'User not found'}, 404)

        order = Order.query.filter(Order.tracking_number == id, Order.courier_id == user_id).first()
        if not order:
            return make_response({'error': 'Order not found'}, 404)

        return make_response(order.to_dict(), 200)
    
    def patch(self,id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'User not logged in'}, 401)

        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'User not found'}, 404)

        order = Order.query.filter(Order.tracking_number == id, Order.courier_id == user_id).first()
        if not order:
            return make_response({'error': 'Order not found'}, 404)

        data = request.get_json()
        status_changed = False
        new_status = None

        for attr,value in data.items():
            if hasattr(order,attr):
                if attr=='status':
                    status_changed = True
                    new_status = value
            setattr(order,attr,value)

        db.session.commit()

        if status_changed:
            tracking_update=TrackingOrder(status=new_status,description=f'Status updated to {new_status}',order_id=order.id)
            db.session.add(tracking_update)
            db.session.commit()


        return make_response(
            order.to_dict(),
            200
        )
api.add_resource(OrderByCourieSessionById, '/courier_orders/<string:id>')

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
    
    def patch(self,id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response(
                {'error':'User is not logged in'},
                422
            )
        
        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'Unauthorized!'}, 422)
        
        order = Order.query.filter(Order.tracking_number==id).first()
        if not order:
            return make_response(
                {'error':f'Order with {id} does not exists'},
                400
            )
        
        data = request.get_json()
        status_changed = False
        new_status = None

        for attr,value in data.items():
            if hasattr(order,attr):
                if attr=='status':
                    status_changed = True
                    new_status = value
            setattr(order,attr,value)

        db.session.commit()

        if status_changed:
            tracking_update=TrackingOrder(status=new_status,description=f'Status updated to {new_status}',order_id=order.id)
            db.session.add(tracking_update)
            db.session.commit()


        return make_response(
            order.to_dict(),
            200
        )
    
    def delete(self,id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response(
                {'error':'User is not logged in'},
                422
            )
        
        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'Unauthorized!'}, 422)
        
        order = Order.query.filter(Order.tracking_number==id).first()
        if not order:
            return make_response(
                {'error':f'Order with {id} does not exists'},
                400
            )
        
        try:
            db.session.delete(order)
            db.session.commit()

            return make_response(
                {'message':'Order has been deleted successfully!'},
                200
            )
        except Exception as e:
            db.session.rollback()
            return make_response(
                {'error':f'Failed to delete: {str(e)}'},
                500
            )
api.add_resource(OrderByIdResource,'/orders/<string:id>')

class CourierResource(Resource):
    def get(self):
        couriers_dict = [courier.to_dict() for courier in User.query.filter_by(isCourier=True).all()]
        return make_response(couriers_dict, 200)

api.add_resource(CourierResource, '/couriers')

class Me(Resource):
    def get(self):
        user_id =session.get('user_id')
        if not user_id:
            return make_response(
                {'error':'You are not logged in'},
                401
            )
        user = User.query.get(user_id)
        if not user:
            return make_response(
                {'error':'User not found'},
                404
            )
        return make_response(
            user.to_dict(),
            200
        )

api.add_resource(Me,'/me')`


api.add_resource(OrderByIdResource,'/orders/<string:id>')


if __name__ == "__main__":
    app.run(port=5000, debug=True)