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
    
class Movies(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.get(session.get("user_id"))
        if not user:
            return {"error": "Unauthorized"}, 401
        
        title = data.get("title")
        genre_id = data.get("genre_id")

        genre = Genre.query.get(genre_id)
        if not genre:
            return {"error": "Genre not found"}, 404
        
        new_movie = Movie(title=title, user_id=user.id, genre_id=genre_id)
        db.session.add(new_movie)
        db.session.commit()

        return user.to_dict(), 201

class MovieById(Resource):
    def delete(self, movie_id):
        user = User.query.get(session.get("user_id"))
        if not user:
            return {"error": "Unauthroized"}, 401
        
        movie = Movie.query.get(movie_id)
        if not movie or movie.user_id != user.id:
            return {"error": "Movie not found"}, 404

        db.session.delete(movie)
        db.session.commit()

        return user.to_dict(), 200

    def patch(self, movie_id):
        user = User.query.get(session.get("user_id"))
        if not user:
            return {"error": "Unauthorized"}, 401
        
        movie = Movie.query.get(movie_id)
        if not movie or movie.user_id != user.id:
            return {"error": "Movie not found"}, 404
        data = request.get_json()
        title = data.get("title")
        genre_id = data.get("genre_id")

        if title:
            movie.title = title.strip()
        if genre_id:
            genre = Genre.query.get(genre_id)
            if not genre:
                return {"error": "Genre not found"}, 404
            movie.genre_id = genre_id
        
        db.session.commit()
        return user.to_dict(), 200

class Genres(Resource):

    def get(self):
        genres = Genre.query.all()
        return [g.to_dict(only=("id", "name")) for g in genres], 200

    def post(self):
        data = request.get_json()
        user = User.query.get(session.get("user_id"))
        if not user:
            return {"error": "Unauthorized"}, 401
        
        name = data.get("name")
        if not name or name.strip() == "":
            return {"error": "Invalid genre name"}, 400
        
        existing = Genre.query.filter_by(name=name).first()
        if existing:
            return {"error": "Genre already exists"}, 409
        
        new_genre = Genre(name=name.strip())
        db.session.add(new_genre)
        db.session.commit()

        return new_genre.to_dict(), 201 




api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(Movies, '/movies')
api.add_resource(MovieById, '/movies/<int:movie_id>')
api.add_resource(Genres, '/genres')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

