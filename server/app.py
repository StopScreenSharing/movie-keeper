#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify, abort
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api, bcrypt
# Add your model imports
from models import User, Movie, Genre
from schemas import user_schema, flat_genres_schema, movie_schema, movies_schema

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

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            if user:
                return user_schema.dump(user), 200
        return {"message": "Not logged in"}, 401

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session.clear()
            return {"message": "Logged out successfully"}, 200
        return {"error": "Not logged in"}, 401


# MOVIE CRUD #
class MovieList(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        movies = Movie.query.filter_by(user_id=user_id).all()
        return movies_schema.dump(movies), 200
    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        data = request.get_json()
        title = data.get('title')
        genre_ids = data.get('genre_ids', [])

        if not title:
            return {"error": "Title is required"}, 422
        
        new_movie = Movie(title=title, user_id=user_id)

        if genre_ids:
            genres = Genre.query.filter(Genre.id.in_(genre_ids)).all()
            if len(genres) != len(genre_ids):
                return {"error": "One or more genre IDs are invalid"}, 422
        try:
            db.session.add(new_movie)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Database error"}, 422
        
        return movie_schema.dump(new_movie), 201

class MovieDetail(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        movie = Movie.query.filter_by(id=id, user_id=user_id).first()
        if not movie:
            return {"error": "Movie not found"}, 404
        
        return movie_schema.dump(movie), 200
    
    def patch(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": 'Unauthorized'}, 401
        
        movie = Movie.query.filter_by(id=id, user_id=user_id).first()
        if not movie:
            return {"error": "Movie bot found"}, 404
        
        data = request.get_json()
        title = data.get('title')
        genre_ids = data.get('genre_ids')

        if title is not None:
            movie.title = title
        
        if genre_ids is not None:
            if not genre_ids:
                movie.genres = []
            else:
                genres = Genre.query.filter(Genre.id.in_(genre_ids)).all()
                if len(genres) != len(genre_ids):
                    return {"error": "One or more genre IDs are invalid"}, 422
                movie.genres = genres
        
        db.session.commit()
        return movie_schema.dump(movie), 200
    
    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        movie = Movie.query.filter_by(id=id, user_id=user_id).first()
        if not movie:
            return {"error": "Movie not found"}, 404
        
        db.session.delete(movie)
        db.session.commit()
        return {"message": "Movie deleted"}, 200
    
    

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')




@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

