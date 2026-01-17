
from config import db, bcrypt
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin



# Models go here!

class User(db.Model, SerializerMixin ):
    __tablename__ = 'users'

    serialize_rules = (
        "-_password_hash",
        "-movies.user",
        "-movies.genre",
    )
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.username,
            "genres": [
                {
                    "name": genre.name,
                    "movies": [
                        {
                            "id": movie.id,
                            "title": movie.title
                        }
                        for movie in genre.movies
                        if movie.user_id == self.id
                    ]
                }
                for genre in self.genres
            ]
        }



    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)


    #Relationships
    movies = db.relationship("Movie", backref="user", cascade="all, delete-orphan")

    genres = db.relationship("Genre", secondary="movies", primaryjoin="User.id == Movie.user_id", secondaryjoin="Genre.id == Movie.genre_id", viewonly=True)


    
    #Password Handling
    @hybrid_property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, plaintext_password):
        hashed = bcrypt.generate_password_hash(
            plaintext_password.encode("utf-8")
        ).decode("utf-8")

        self._password_hash = hashed

    def authenticate(self, plaintext_password):
        return bcrypt.check_password_hash(
            self._password_hash,
            plaintext_password.encode("utf-8")
        )

    #Validation
    @validates("username")
    def validate_username(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Username cannot be empty.")
        return value.strip()
    
    def __repr__(self):
        return f'<User {self.username}, ID: {self.id}>'


class Movie(db.Model, SerializerMixin):
    __tablename__ = 'movies'

    serialize_rules = (
        "-user.movies",
        "-genre.movies"
    )


    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    
    #Relationships
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey("genres.id"), nullable=False)

    #Validation
    @validates("title")
    def validate_title(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Movie title cannot be empty")
        return value.strip()

    def __repr__(self):
        return f'<Movie {self.title}, Genre: {self.genre.name if self.genre else None}>'

class Genre(db.Model, SerializerMixin):
    __tablename__ = 'genres'

    serialize_rules = (
        "-movies.genre",
        "-movies.user",
    )


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    #Relationship
    movies = db.relationship("Movie", backref="genre", cascade="all, delete-orphan")
 
    #Validation
    @validates("name")
    def validate_name(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Genre name cannot be empty")
        return value.strip()
    
    def __repr__(self):
        return f'<Genre {self.name}>'



    


