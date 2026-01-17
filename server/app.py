#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify, abort
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask import Flask, request, make_response

# Local imports
from config import app, db, api, bcrypt
# Add your model imports
from models import User, Movie, Genre

# Views go here!

class Signup(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        try:
            new_user = User(username=data["username"])
            new_user.password = data["password"]

            db.session.add(new_user)
            db.session.commit()
            print("Signed")
            return new_user.to_dict(), 201
        
        except ValueError as e:
            return {"errors": [str(e)]}, 400
        except IntegrityError:
            db.session.rollback()
            return {"errors": ["Username already exists"]}, 409

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()
        
        if user and user.authenticate(data["password"]):
            session['user_id'] = user.id
            return user.to_dict(), 200
        else:
            return {"errors": ["Invalid username or password"]}, 401

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

class Logout(Resource):
    def delete(self):
        session['user_id'] = None 
        return {'message': '204: No Content'}, 204
        




api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

