from app import create_app

app = create_app()

from app.extensions import db

with app.app_context():
    db.create_all()         #this is only for creating the tables inside the schema (it doesn't do it automatically like TypeORM :(

if __name__ == "__main__":
    app.run(debug=True)
