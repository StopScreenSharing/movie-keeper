from config import ma
from models import User, Movie, Genre
from marshmallow import fields, validate
from sqlalchemy.orm import joinedload  

class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        load_instance = True
        include_fk = True

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))

# Flat versions for /genres endpoint
flat_genre_schema = GenreSchema()           # single genre
flat_genres_schema = GenreSchema(many=True) # list of all genres


class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Movie
        load_instance = True
        include_relationships = True

    id = fields.Integer(dump_only=True)
    title = fields.String(required=True, validate=validate.Length(min=1))

    genres = fields.Pluck(GenreSchema, "id", many=True)

movie_schema = MovieSchema()
movies_schema = MovieSchema(many=True)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("_password_hash",)

    id = fields.Integer(dump_only=True)
    username = fields.String(required=True)

    genres = fields.Method("get_user_genres", dump_only=True)

    def get_user_genres(self, user):
        # Get unique genre IDs for this user
        user_genre_ids = {genre.id for movie in user.movies for genre in movie.genres}
        
        if not user_genre_ids:
            return []

        # Eager load movies to avoid N+1 queries
        user_genres = (
            Genre.query
            .filter(Genre.id.in_(user_genre_ids))
            .options(joinedload(Genre.movies))
            .order_by(Genre.name)
            .all()
        )

        result = []
        for genre in user_genres:
            genre_dict = flat_genre_schema.dump(genre)
            # Filter to only this user's movies in this genre
            user_movies_in_genre = [
                movie for movie in genre.movies if movie.user_id == user.id
            ]
            genre_dict["movies"] = movie_schema.dump(user_movies_in_genre, many=True)
            result.append(genre_dict)

        return result


user_schema = UserSchema()
users_schema = UserSchema(many=True)
    