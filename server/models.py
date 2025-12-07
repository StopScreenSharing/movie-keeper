
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

    
    #Password Handling
    @property
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
        return f'User {self.username}, ID: {self.id}'
    


