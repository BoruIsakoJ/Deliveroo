import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY=os.getenv('FLASK_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI=os.getenv('FLASK_SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS=os.getenv('FLASK_SQLALCHEMY_TRACK_MODIFICATIONS')