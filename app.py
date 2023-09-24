from flask import Flask, render_template, jsonify , Response
import os

from utils import genz,detected_objects


app = Flask(__name__, template_folder='Templates', static_folder='assets')

# Route for the main page
@app.route('/')
def main():
    return render_template("index.html")

# Route for the signup page
@app.route('/signUp')
def signIn():
    # Add your signup logic here
    return render_template("signUp.html")

# Route for the login page
@app.route('/login')
def login():
    # Add your login logic here
    return render_template("login.html")



@app.route('/results')
def result():
    return render_template("results.html")

@app.route('/video_feed')
def video_feed():
     return Response(genz(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_detected_objects')
def get_detected_objects():
    return {'detected_objects': detected_objects}

if __name__ == '__main__':
    app.run(debug=True)
