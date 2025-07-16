import os 

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from dotenv import load_dotenv
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY")
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES", 1800))

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metdata=metadata)
db.init_app(app)

migrate = Migrate(app, db)
jwt = JWTManager()
api = Api(app)

CORS(app, supports_credentials=True, methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"])