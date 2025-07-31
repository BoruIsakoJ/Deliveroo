from flask import Flask,request,session,make_response,render_template,jsonify
from config import Config
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError
from models import db, User, Order, TrackingOrder

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

bcrypt = Bcrypt(app)
app.config.from_object(Config)
db.init_app(app)
api = Api(app)

CORS(app, supports_credentials=True)

migrate = Migrate(app, db)

@app.route("/")
def index():
    return render_template("index.html")


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
                'customer_name': order.user.name,
                'customer_phone_number': order.user.phone_number,

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
            jsonify({
                "id": order.id,
                "tracking_number": order.tracking_number,
                "status": order.status,
                "present_location": order.present_location,
                "customer_name": order.user.name,
                "customer_phone_number": order.user.phone_number,
                "courier_name": order.courier.name if order.courier else None,
                "courier_phone_number": order.courier.phone_number if order.courier else None, 
            }),
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
    
    def post(self):
        user_id= session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)
        current_user = User.query.get(user_id)
        if not current_user or not current_user.isAdmin:
            return make_response({'error': 'Unauthorized'}, 403)
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone_number = data.get('phone_number')
        password = data.get('password')
        isCourier = data.get('isCourier', True)

        new_courier = User(
            name=name,
            email=email,
            phone_number=phone_number,
            password_hash=password,
            isCourier=isCourier,
            isAdmin=False
        )
        db.session.add(new_courier)
        db.session.commit()

        return make_response(new_courier.to_dict(), 201)

api.add_resource(CourierResource, '/couriers')


class CourierById(Resource):
    def get(self, id):
        courier = User.query.filter_by(id=id, isCourier=True).first()
        if not courier:
            return make_response({'error': 'Courier not found'}, 404)
        
        return make_response(courier.to_dict(), 200)
    
    def delete(self, id):
        courier = User.query.filter_by(id=id, isCourier=True).first()
        if not courier:
            return make_response({'error': 'Courier not found'}, 404)
        
        try:
            db.session.delete(courier)
            db.session.commit()
            return make_response({'message': 'Courier deleted successfully'}, 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'Failed to delete courier: {str(e)}'}, 500)
        
api.add_resource(CourierById, '/couriers/<int:id>')

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

api.add_resource(Me,'/me')




class UserResources(Resource):
    def get(self):
        users_dict = [user.to_dict() for user in User.query.all()]
        return make_response(
            users_dict,
            200
        )
api.add_resource(UserResources,'/users')

class OrderResource(Resource):
    def get(self):
        orders = Order.query.all()

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
                'customer_name': order.user.name,
                'customer_phone_number': order.user.phone_number,
                'courier_name': order.courier.name if order.courier else 'N/A',
                'courier_phone_number': order.courier.phone_number if order.courier else 'N/A',

            })

        return make_response(simplified_orders, 200)

    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'User is not available'}, 404)
        
        data = request.get_json()
        pickup_location = data.get('pickup_location')
        destination = data.get('destination')
        weight_in_kg = data.get('weight_in_kg')
        price_estimate = data.get('price_estimate')
        user_id_field= user_id
        courier_id= data.get('courier_id')

        try:
            new_order = Order(pickup_location=pickup_location,destination=destination,present_location=pickup_location,weight_in_kg=weight_in_kg,price_estimate=price_estimate,user_id=user_id_field,courier_id=courier_id)
            db.session.add(new_order)
            db.session.commit()

            initial_tracking = TrackingOrder(status=new_order.status, description=f'Order created. Pickup at {new_order.pickup_location}',order_id=new_order.id)
            db.session.add(initial_tracking)
            db.session.commit()

            return make_response(
                new_order.to_dict(),
                201
            )

        except IntegrityError:
            db.session.rollback()
            return make_response(
                {'error': 'Database integrity error.'},
                409
            )

        except Exception as e:
            db.session.rollback()
            return make_response(
                {'error': f'Unexpected error: {str(e)}'}, 
                500
            )

        except ValueError as e:
            return make_response(
                {'error': f'Invalid data type: {str(e)}'},
                400
            )
api.add_resource(OrderResource, '/orders')   

class OrderByUser(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'User not logged in'}, 401)
        
        orders_dict =[order.to_dict() for order in Order.query.filter(Order.user_id==user_id).all()]

        return make_response(
            orders_dict,
            200
        )
api.add_resource(OrderByUser, '/orders/user')

class OrderByUserSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'User not logged in'}, 401)
        
        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'User not found'}, 404)

        orders =[order for order in Order.query.filter(Order.user_id==user_id).all()]
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
                'weight_in_kg': order.weight_in_kg
            })

        return make_response(simplified_orders, 200)
api.add_resource(OrderByUserSession,'/user_orders/')


class OrderByUserSessionById(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'User not logged in'}, 401)

        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'User not found'}, 404)

        order = Order.query.filter(Order.tracking_number == id, Order.user_id == user_id).first()
        if not order:
            return make_response({'error': 'Order not found'}, 404)

        return make_response(order.to_dict(), 200)
    
    def patch(self, id):
        try:
            user_id = session.get('user_id')
            if not user_id:
                return make_response({'error': 'User not logged in'}, 401)

            order = Order.query.filter_by(tracking_number=id, user_id=user_id).first()
            if not order:
                return make_response({'error': 'Order not found'}, 404)

            data = request.get_json()
            status_changed = False
            new_status = None

            for attr, value in data.items():
                if hasattr(order, attr):
                    if attr == 'status':
                        status_changed = True
                        new_status = value
                    setattr(order, attr, value)

            db.session.commit() 

            print("Order updated successfully")

            if status_changed:
                tracking_update = TrackingOrder(
                    status=new_status,
                    description=f'Status updated to {new_status}',
                    order_id=order.id
                )
                db.session.add(tracking_update)
                db.session.commit()  

                print("Tracking update committed")

            return make_response(order.to_dict(), 200)

        except Exception as e:
            db.session.rollback()
            print(f"Error occurred: {e}")
            return make_response({'error': str(e)}, 400)



api.add_resource(OrderByUserSessionById,'/user_orders/<string:id>')


class Logout(Resource):
    def delete(self):
        user_id = session.get('user_id')

        if user_id:
            session.pop('user_id')
            return make_response(
                {'message':'Successfully logged out. See you later.'},
                200
            )
        
        return make_response(
            {'error':'You are not logged in'},
            422
        )

api.add_resource(Logout, '/logout')
