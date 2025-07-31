from app import app
from models import db,User, Order, TrackingOrder

with app.app_context():
    TrackingOrder.query.delete()
    Order.query.delete()
    User.query.delete()
    db.session.commit()

    admin = User(
        name="Admin User",
        email="admin@deliveroo.com",
        phone_number="0712345678",
        password_hash = "admin",
        isAdmin=True
    )
    
    user1 = User(
        name="User One",
        email="user1@example.com",
        phone_number="0798765432",
        password_hash = "user1",
    )

    user2 = User(
        name="User Two",
        email="user2@example.com",
        phone_number="0798765432",
        password_hash = "user2",
        isAdmin=False
    )

    courier1 = User(
        name="Delivery Dan",
        email="dan@courier.com",
        phone_number="0711111111",
        password_hash="dan",
        isCourier=True
    )

    courier2 = User(
        name="Fast Freddy",
        email="freddy@courier.com",
        phone_number="0722222222",
        password_hash="freddy",
        isCourier=True
    )

    db.session.add_all([admin,user1,user2,courier1,courier2])
    db.session.commit()
    
    order1 = Order(
        pickup_location="Westlands",
        destination="Kilimani",
        status="In Transit",
        present_location="Chiromo",
        weight_in_kg=2.5,
        price_estimate=450.0,
        user_id=user1.id,
        courier_id=courier1.id
    )

    order2 = Order(
        pickup_location="CBD",
        destination="Karen",
        present_location="CBD",
        status="Pending",
        weight_in_kg=5.0,
        price_estimate=750.0,
        user_id=user2.id,
        courier_id=courier2.id
    )

    db.session.add_all([order1, order2])
    db.session.commit()

    track1 = TrackingOrder(
        status="Picked Up",
        description="Package picked up at Westlands",
        order_id=order1.id
    )

    track2 = TrackingOrder(
        status="In Transit",
        description="Package on the way to Kilimani",
        order_id=order1.id
    )

    track3 = TrackingOrder(
        status="Pending Pickup",
        description="Waiting for courier",
        order_id=order2.id
    )

    db.session.add_all([ track1, track2, track3])
    db.session.commit()
    
    print("Database seeded successfully :)")