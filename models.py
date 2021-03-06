from app import db

class Leaderboard(db.Model):
    username = db.Column(db.String(80), unique=True, primary_key=True)
    score = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Leaderboard %r>' % self.username