from config import ma
from models import User, Movie, Genre
from marshmallow import fields, validate

class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        load_instance = True
        include_fk = True
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))

#Flat version for /genres
flat_genre_schema = GenreSchema()
flat_genre_schema = GenreSchema(many=True)

class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Movie
        load_instance = True
        include_relationships = True
    id = fields.Integer(dump_only=True)
    title = fields.String(required=True, validate=validate.Length(min=1))
    