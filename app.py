from flask import Flask, jsonify, request, render_template, Response
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.sqlite3'

db = SQLAlchemy(app)

class Car(db.Model):
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    modelo = db.Column('modelo', db.String(20))
    marca = db.Column('marca', db.String(20))
    ano = db.Column('ano', db.String(4))
    observacao = db.Column('observacao', db.String(50))
    valor = db.Column('valor', db.String(10))
    status = db.Column('status', db.String(20))

    def __init__(self, modelo, marca, ano, observacao, valor, status):
       self.modelo = modelo
       self.marca = marca
       self.ano = ano
       self.observacao = observacao
       self.valor = valor
       self.status = status

    def as_dict(self):
        return {c.name: getattr(self,c.name) for c in self.__table__.columns}


@app.route('/carlist',methods=['GET'])
def carlist():
    return render_template('carlist.html')


@app.route('/cars', methods=['GET'])
def get_cars():
    cars = Car.query.all() #db.session.execute(db.select(Contact)).scalars()
    if not cars:
        return jsonify({'message:':'No cars found in the server'}), 404
    return jsonify({'cars':[c.as_dict() for c in cars]}), 200

with app.app_context():
    db.create_all()

# POST request to add a new contact with data of the new contact on a json file
@app.route('/cars', methods=['POST'])
def add_car():
    data = request.get_json()
    if not data or not all(key in data for key in ('modelo', 'marca', 'ano', 'observacao', 'valor', 'status')):
        return jsonify({'message': 'Bad request'}), 400
    car = Car(modelo=data['modelo'], marca=data['marca'], ano=data['ano'], observacao=data['observacao'], valor=data['valor'], status=data['status'])
    db.session.add(car)
    db.session.commit()
    return jsonify({'car': car.as_dict()}), 201

# PUT request to update a contact
@app.route('/cars/<int:id>', methods=['PUT'])
def update_car(id):
    data = request.get_json()
    if not data or not all(key in data for key in ('modelo', 'marca', 'ano', 'observacao', 'valor', 'status')):
        return jsonify({'message': 'Bad request'}), 400
    car = Car.query.get_or_404(id)
    car.modelo = data['modelo']
    car.marca = data['marca']
    car.ano = data['ano']
    car.observacao = data['observacao']
    car.valor = data['valor']
    car.status = data['status']
    db.session.commit()
    return jsonify({'car': car.as_dict()}), 200

# DELETE request to delete a contact
@app.route('/cars/<int:id>', methods=['DELETE'])
def delete_car(id):
    car = Car.query.get_or_404(id)
    db.session.delete(car)
    db.session.commit()
    return jsonify({'message': 'Car has been deleted.'}), 200


app.run(debug=True, port = 5001)