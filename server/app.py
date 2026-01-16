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

class Users(Resource):
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

api.add_resource(Users, '/users')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

