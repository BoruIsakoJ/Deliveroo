from flask import Flask,request,session,make_response,render_template
from config import Config

app = Flask(__name__)
app.config.from_object(Config)


@app.route("/")
def index():
    return '<h1>Backend is working</h1>'

if __name__ == "__main__":
    app.run(port=5000, debug=True)