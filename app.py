from flask import Flask, render_template, jsonify, Response, request, session, redirect, url_for

import os

from utils import genz,detected_objects


app = Flask(__name__, template_folder='Templates', static_folder='assets')

app.secret_key = 'your_secret_key'  # Replace with a secure secret key

# Route for the main page
@app.route('/')
def main():
    user_email = session.get('user_email', None)
    
    if user_email:
        # Do something with the user's email, e.g., pass it to the template
        return render_template("index.html", user_email=user_email)
    else:
        return render_template("index.html")

# Route for the signup page
@app.route('/signUp')
def signIn():
    # Add your signup logic here
    return render_template("signUp.html")

# # Route for the login page
# @app.route('/login')
# def login():
#     # Add your login logic here
#     return render_template("login.html")

@app.route('/login')
def log():
    return render_template("login.html")


@app.route('/login', methods=['POST'])
def login():
    # Get the user's email from the request
    data = request.get_json()
    email = data['email']

    # Store the user's email in the session
    session['user_email'] = email

    # Add your login logic here

    return jsonify({'message': 'Login successful'})


@app.route('/results')
def result():
    user_email = session.get('user_email', None)
    if user_email:
        return render_template("results.html", user_email=user_email)  # Pass user_email to the template
    else:
        return render_template("index.html")


@app.route('/video_feed')
def video_feed():
    
    
        # Do something with the user's email, e.g., pass it to the template
         return Response(genz(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
   
    
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


if __name__ == '__main__':
    app.run(debug=True)
