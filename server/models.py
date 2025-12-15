
from config import db, bcrypt
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates


# Models go here!

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)


    #Relationships
    movies = db.relationship("Movie", backref="user", cascade="all, delete-orphan")

    genres = association_proxy('movies', 'genres')


    
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
    
#Join Table for Movie and Genre many-to-many
movie_genre_association = db.Table(
    'movie_genre_association',
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id'), primary_key=True)
)


class Movie(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    #Relationships
    genres = db.relationship(
        "Genre",
        secondary=movie_genre_association,
        back_populates="movies"
    )

    #Validation
    @validates("title")
    def validate_title(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Movie title cannot be empty")
        return value.strip()

    def __repr__(self):
        return f'<Movie {self.title}, User ID: {self.user_id}>'

class Genre(db.Model):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    
    #Relationships
    movies = db.relationship(
        "Movie", 
        secondary=movie_genre_association,
        back_populates="genres"
    )
    
    users = association_proxy('movies', 'user')

    
    #Validation
    @validates("name")
    def validate_name(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Genre name cannot be empty")
        return value.strip()
    
    def __repr__(self):
        return f'<Genre {self.name}>'



    


