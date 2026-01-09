from config import ma
from models import User, Movie, Genre
from marshmallow import fields, validate

from config import ma
from models import User, Movie, Genre
from marshmallow import fields

class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Movie
        load_instance = True

    id = fields.Integer(dump_only=True)
    title = fields.String()

movie_schema = MovieSchema()
movies_schema = MovieSchema(many=True)


class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        load_instance = True

    id = fields.Integer(dump_only=True)
    name = fields.String()

genre_schema = GenreSchema()
genres_schema = GenreSchema(many=True)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("_password_hash",)

    id = fields.Integer(dump_only=True)
    username = fields.String()

    genres = fields.Method("get_genres_with_movies")

    def get_genres_with_movies(self, user):
        genres_dict = {}

        for movie in user.movies:
            genre = movie.genre
            if genre.id not in genres_dict:
                genres_dict[genre.id] = {
                    "id": genre.id,
                    "name": genre.name,
                    "movies": []
                }
            genres_dict[genre.id]["movies"].append(movie)

        genres_list = list(genres_dict.values())

        for genre in genres_list:
            genre["movies"] = movie_schema.dump(genre["movies"], many=True)

        return genres_list

user_schema = UserSchema() 

