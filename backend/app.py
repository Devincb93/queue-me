#!/usr/bin/env python3
from flask import Flask, jsonify, make_response, session, request
from flask_restful import Resource
from bcrypt import checkpw
from config import app, db, api
from models import Customer, Employee, QueueLine
import jwt
import datetime


def validate_token(token):
    try:
        token = token.replace('Bearer ', '') if token.startswith('Bearer ') else token
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return decoded
    except jwt.ExpiredSignatureError:
        return {'message': 'Token has expired!'}, 403
    except jwt.InvalidTokenError:
        return {'message': 'Invalid token!'}, 403



class Home(Resource):
    def get(self):
        return make_response(
            {"message":"Backend"}, 
            200

        )
    
class GetCustomers(Resource):
    def get(self):
        try:
            customers = Customer.query.all()
            customers_dict_list = [customer.to_dict() for customer in customers]
            return customers_dict_list, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
    def post(self):
        data = request.get_json()
        first_last_name = data.get('first_last_name')
        phone_number = data.get('phone_number')
        email = data.get('email')

        print(f"Attempting to add customer: {first_last_name}")

        new_customer = Customer(
            
            first_last_name = first_last_name,
            phone_number = phone_number,
            email = email
        )
        print(f"Attempting to add to db: {new_customer.first_last_name}")

        existing_customer = Customer.query.filter(Customer.first_last_name == first_last_name).first()

        if existing_customer:
            return {"Customer already exists, can't have the same customer."}
        else:
            db.session.add(new_customer)
            db.session.commit()
            print(f"Successfully committed: {new_customer.first_last_name}")
            return new_customer.to_dict(), 200
        
class AddToQueueList(Resource):
    def post(self):
        data = request.get_json()
        customer_id = data.get('customer_id')

        if not customer_id:
            return {"error": "Customer ID is required"}, 400

        customer = Customer.query.get(customer_id)

        if not customer:
            return {"error": "Customer not found"}, 404

        
        current_queue_position = db.session.query(db.func.count(QueueLine.id)).scalar() + 1
        status = "waiting"
        
        new_queue = QueueLine(
            queue_position=current_queue_position,
            status=status,
            customer_id=customer_id
        )
        db.session.add(new_queue)
        db.session.commit()

        return {"message": "Customer added to queue"}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        employee_login = data.get('employee_login')
        employee_password = data.get('employee_password')

        user = Employee.query.filter(Employee.employee_login == employee_login).first()
        if user and user.check_password(employee_password):
            # Generate JWT token
            token = jwt.encode({
                'employee_login': user.employee_login,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return {
                'token': token,
                'message': 'Login successful'
            }, 200
        elif user:
            return {'error': 'Invalid password'}, 401
        else:
            return {'error': 'User not found'}, 404
        
class Logout(Resource):
    def post(self):
        return {'message': 'Logged out successfully. Delete the token on the client side.'}
        
class CheckSession(Resource):
    def get(self):
        token = request.headers.get('Authorization')
        if token and validate_token(token):  # Implement `validate_token` function
            return {'logged_in': True}, 200
        else:
            return {'logged_in': False}, 401

        
class Employees(Resource):
    def get(self):
        employees_dict_list = [employee.to_dict() for employee in Employee.query.all()]
        return employees_dict_list, 200

    def post(self):
        data = request.get_json()
        employee_login = data.get('employee_login')
        employee_password = data.get('employee_password')
        hashed_password = Employee.hash_password(employee_password)
        new_employee = Employee(
            employee_login = employee_login,
            employee_password = hashed_password
        )

        existing_employee = Employee.query.filter(Employee.employee_login == employee_login).first()


        if existing_employee:
            return {"error": "Employee already exists"}, 400
        if employee_login and employee_password:
            db.session.add(new_employee)
            db.session.commit()
            return new_employee.to_dict(), 200
        
class DressingRoomAction(Resource):
    def put(self, room_number):
        next_in_queue = QueueLine.query.filter_by(status='waiting').order_by(QueueLine.queue_position).first()
        
        if not next_in_queue:
            return {"error":"No customers in queue"}, 400
        next_in_queue.status = 'in_room'
        next_in_queue.room_number = room_number
        db.session.commit()

        return {"message":f"Customer {next_in_queue.customer_id} moved to room {room_number}"}, 200
            
    def delete(self, room_number):
        customer_in_room = QueueLine.query.filter_by(room_number=room_number).first()

        if not customer_in_room:
            return{"error":"No customer in dressing room"}, 400
        
        db.session.delete(customer_in_room)
        db.session.commit()
        return {"message":f"Customer {customer_in_room.customer_id}removed from dressing room {room_number} and queue"}, 200
    
api.add_resource(Home,'/')
api.add_resource(GetCustomers, '/customers')
api.add_resource(Login, '/login')
api.add_resource(Employees, '/employees')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(AddToQueueList, '/queue')
api.add_resource(DressingRoomAction, '/dressing_room/<int:room_number>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)