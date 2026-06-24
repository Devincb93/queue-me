#!/usr/bin/env python3
from flask import Flask, jsonify, make_response, session, request
from flask_restful import Resource
from bcrypt import checkpw
from config import app, db, api
from models import Customer, Employee, QueueLine, CustomerNotification
import jwt
import datetime
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func


def reorder_queue():
    try:
        all_queue_entries = QueueLine.query.filter_by(status='waiting').order_by(QueueLine.queue_position).all()
        for index, entry in enumerate(all_queue_entries):
            entry.queue_position = index + 1
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error in reorder_queue: {e}")


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

        new_customer = Customer(
            first_last_name = first_last_name,
            phone_number = phone_number,
            email = email
        )

        db.session.add(new_customer)
        db.session.commit()
        return new_customer.to_dict(), 201

class AddToQueueList(Resource):
    def post(self):
        data = request.get_json()
        customer_id = data.get('customer_id')

        if not customer_id:
            return {"error": "Customer ID is required"}, 400

        customer = Customer.query.get(customer_id)

        if not customer:
            return {"error": "Customer not found"}, 404

        max_pos = db.session.query(func.max(QueueLine.queue_position)).scalar() or 0
        current_queue_position = max_pos + 1

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

            token = jwt.encode({
                'employee_login': user.employee_login,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return {
                'token': token,
                'message': 'Login successful',
                'employee_login': user.employee_login,
                'id':user.id
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
        if token and validate_token(token):  
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

        room_occupied = QueueLine.query.filter_by(room_number=room_number, status='in_room').first()
        if room_occupied:
            return {"error": f"Room {room_number} is already occupied"}, 400


        next_in_queue = QueueLine.query.filter_by(status='waiting').order_by(QueueLine.queue_position).first()
        if not next_in_queue:
            return {"error": "No customers in queue"}, 400


        next_in_queue.status = 'in_room'
        next_in_queue.room_number = room_number
        db.session.commit()

        customer = Customer.query.get(next_in_queue.customer_id)
        customer_name = customer.first_last_name if customer else "Unknown"

        return {
            "message": f"Customer {next_in_queue.customer_id} moved to room {room_number}",
            "customer_name": customer_name
        }, 200

    def delete(self, room_number):

        customer_in_room = QueueLine.query.filter_by(room_number=room_number).first()
        if not customer_in_room:
            return {"error": "No customer in dressing room"}, 400

        customer_name = "Unknown"
        if customer_in_room.customer_id:
            customer = Customer.query.get(customer_in_room.customer_id)
            customer_name = customer.first_last_name if customer else "Unknown"

        customer_in_room.room_number = None
        customer_in_room.status = 'removed'
        db.session.commit()
        reorder_queue()

        return {
            "message": f"Customer {customer_in_room.customer_id} removed from dressing room {room_number} and queue",
            "customer_name": customer_name
        }, 200

class GetDressingRooms(Resource):
    def get(self):
        try:

            rooms = QueueLine.query.filter(QueueLine.room_number.isnot(None)).all()
            rooms_data = [
                {
                    "room_number": room.room_number,
                    "customer_name": room.customers.first_last_name if room.customers else None
                }
                for room in rooms
            ]
            return rooms_data, 200
        except Exception as e:
            return {"error": str(e)}, 500

class GetQueueLineCustomers(Resource):
    def get(self):
        try:
            all_queues = QueueLine.query.filter_by(status='waiting').order_by(QueueLine.queue_position).all()
            return [queue.to_dict(rules=('-customers.queues',)) for queue in all_queues], 200
        except Exception as e:
            return {"error": str(e)}, 500

class GetQueueCustomerByID(Resource):
    def get(self, id):
        try:
            customer = QueueLine.query.filter(QueueLine.id == id).first()
            if customer:
                return customer.to_dict(), 200
            else:
                return {"error":"customer not found."}

        except Exception as e:
            return {"error": str(e)},500

    def delete(self,id):

        customer = QueueLine.query.filter(QueueLine.id == id).first()
        if customer:
            db.session.delete(customer)
            db.session.commit()
            reorder_queue()
            return {"message":f"Successfully deleted {customer}"}  

class MoveUpQueue(Resource):
    def put(self, id):
        try:
            queue = QueueLine.query.filter_by(status='waiting').order_by(QueueLine.queue_position).all()

            target_entry = None
            for i, entry in enumerate(queue):
                if entry.id == id:
                    target_entry = entry
                    target_index = i
                    break

            if target_entry is None:
                return {"error": "Queue entry not found"}, 404

            if target_index > 0:
                queue.pop(target_index)
                queue.insert(target_index - 1, target_entry)

                for i, entry in enumerate(queue):
                    entry.queue_position = i + 1

                db.session.commit()
                return {"success": "Customer moved up in queue"}, 200
            else:
                return {"error": "Customer is already at the front of the queue"}, 400

        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500


class MoveDownQueue(Resource):
    def put(self, id):
        try:
            queue = QueueLine.query.filter_by(status='waiting').order_by(QueueLine.queue_position).all()

            target_entry = None
            for i, entry in enumerate(queue):
                if entry.id == id:
                    target_entry = entry
                    target_index = i
                    break

            if target_entry is None:
                return {"error": "Queue entry not found"}, 404

            if target_index < len(queue) - 1:
                queue.pop(target_index)
                queue.insert(target_index + 1, target_entry)

                for i, entry in enumerate(queue):
                    entry.queue_position = i + 1

                db.session.commit()
                return {"success": "Customer moved down in queue"}, 200
            else:
                return {"error": "Customer is already at the end of the queue"}, 400

        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500


class GetEmployeeById(Resource):
    def get(self, id):
        try:
            employee = Employee.query.filter(Employee.id==id).first()
            if employee:

                return employee.to_dict(), 200
            else:
                return {"message":"error retrieving customer from loggedinUser id"}
        except Exception as e:
            return {"error": str(e)},500

    def put(self, id):
        try:
            employee = Employee.query.filter(Employee.id == id).first()
            if employee:
                data = request.get_json()

                if "employee_login" in data:
                    employee.employee_login = data["employee_login"]

                if "employee_password" in data:
                    employee.employee_password = Employee.hash_password(data["employee_password"])

                db.session.commit()

                return employee.to_dict(), 200
            else:
                return {"message": "Error retrieving employee"}, 404
        except Exception as e:
            return {"error": str(e)}, 500  

    def delete(self, id):
        try:
            employee = Employee.query.filter(Employee.id == id).first()
            if employee:
                db.session.delete(employee)
                db.session.commit()

                return {"message":f"employee {employee}, deleted"}
        except Exception as e:
            return {"message": str(e)}, 500   

class SendNotification(Resource):
    def post(self):
        data = request.get_json()
        customer_id = data.get('customer_id')

        if not customer_id:
            return {"error": "Customer ID is required"}, 400

        try:

            customer_notification = CustomerNotification.query.filter_by(customer_id=customer_id).first()

            if not customer_notification:
                return {"error": "No notifications found for this customer"}, 404


            message_body = customer_notification.notification.message
            phone_number = customer_notification.customer.phone_number  

            if not phone_number or not message_body:
                return {"error": "Phone number or message body is missing in the database"}, 500


            # This is a placeholder for the actual sending logic
            # from twilio.rest import Client
            # account_sid = 'your_account_sid'
            # auth_token = 'your_auth_token'
            # client = Client(account_sid, auth_token)

            # message = client.messages.create(
            #     body=message_body,
            #     from_='+1234567890',  
            #     to=phone_number
            # )

            print(f"Sending notification to {phone_number}: {message_body}")

            return {"message": "Notification sent successfully"}, 200

        except SQLAlchemyError as e:
            return {"error": str(e)}, 500
        except Exception as e:
            return {"error": str(e)}, 500




api.add_resource(Home,'/')
api.add_resource(GetCustomers, '/customers')
api.add_resource(Login, '/login')
api.add_resource(Employees, '/employees')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(AddToQueueList, '/add_queue')
api.add_resource(DressingRoomAction, '/dressing_room/<int:room_number>')
api.add_resource(GetDressingRooms, '/dressing_room')
api.add_resource(GetQueueLineCustomers, '/queue')
api.add_resource(GetQueueCustomerByID, '/queue/<int:id>')
api.add_resource(MoveUpQueue, '/queue/move-up/<int:id>')
api.add_resource(MoveDownQueue, '/queue/move-down/<int:id>')
api.add_resource(GetEmployeeById, '/employee/<int:id>')
api.add_resource(SendNotification, '/send_notification')

if __name__ == '__main__':
    app.run(port=5555, debug=True)