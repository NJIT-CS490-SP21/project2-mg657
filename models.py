"""
This file sets up the database used for the leaderboard
"""
from app import db


class Leaderboard(db.Model):
    """
    Creates column for username with primary key, unique attribute
    Creates calumn for integer scores of each user
    """
    username = db.Column(db.String(80), unique=True, primary_key=True)
    score = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Leaderboard %r>' % self.username
