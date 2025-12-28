#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify, abort
from flask_restful import Resource

# Local imports
from config import app, db, api, bcrypt
# Add your model imports
from models import User, Movie, Genre
from schema import user_schema, flat_genres_schema

# Views go here!
class Signup(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {"error": "Username and password required"}, 422
        
        if User.query.filter_by(username=username).first():
            return {"error": "Username already taken"}, 422
        
        new_user = User(username=username)
        new_user.password = password

        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id

        return user_schema.dump(new_user), 201

class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user_schema.dump(user), 200
        return {"error": "Invalid username or password"}, 401




@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

