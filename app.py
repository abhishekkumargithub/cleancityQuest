from flask import Flask, render_template, jsonify, Response, request, session, redirect, url_for

import os

from utils import detected_objects,generate_frames_web

app = Flask(__name__, template_folder='Templates', static_folder='assets')

app.secret_key = 'your_secret_key'  # Secure

@app.route('/')
def main():
    user_email = session.get('user_email', None)
    
    if user_email:
        return render_template("index.html", user_email=user_email)
    else:
        return render_template("index.html")
    
@app.route('/signUp')
def signIn():
    return render_template("signUp.html")

@app.route('/login')
def log():
    return render_template("login.html")


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    session['user_email'] = email
    return jsonify({'message': 'Login successful'})

@app.route('/results')
def result():
    user_email = session.get('user_email', None)
    if user_email:
        return render_template("results.html", user_email=user_email)  # Pass user_email to the template
    else:
        return render_template("index.html")
    
@app.route("/profile")
def profile():
    user_email = session.get('user_email', None)
    if user_email:
        return render_template("profile.html", user_email=user_email)  # Pass user_email to the template
    else:
        return render_template("index.html")

@app.route('/get_detected_objects')
def get_detected_objects():
    return {'detected_objects': detected_objects}

@app.route('/logout')
def logout():

    session.pop('user_email', None)
    return redirect('/')
# ========================================================
@app.route("/webcam", methods=['GET','POST'])

def webcam():
    session.clear()
    return render_template('results.html')

@app.route('/webapp')
def webapp():
    return Response(generate_frames_web(path_x=0), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)