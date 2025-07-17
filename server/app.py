from flask import Flask,request,session,make_response,render_template
from config import Config
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from sqlalchemy import MetaData
from flask_migrate import Migrate

from flask_jwt_extended import JWTManager
from models import db

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager()
api = Api(app)

CORS(app, supports_credentials=True)

@app.route("/")
def index():
    return '<h1>Backend is working</h1>'

if __name__ == "__main__":
    app.run(port=5000, debug=True)