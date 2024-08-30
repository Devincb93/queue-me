#!/usr/bin/env python3
from flask import Flask, jsonify, make_response, session, request
from flask_restful import Resource
from bcrypt import checkpw
from config import app, db, api
from models import Customer, Employee

app.secret_key = 'edikeyted'

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
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        employee_login = data.get('employee_login')
        employee_password = data.get('employee_password')
        
        print(f"Attempting login with: ${employee_login}")

        user = Employee.query.filter(Employee.employee_login == employee_login).first()
        if user:
            print(f"User found: ${user.employee_login}")
            if user.check_password(employee_password):
                session['employee_login'] = user.employee_login
                return {
                    'employee_login': user.employee_login,
                    'message': 'Login successful'
                }, 200
            else:
                return {'error': 'Invalid password'}, 401
        else:
            print("User not found")
            return {'error': 'User not found'}, 404
        
class Logout(Resource):
    def post(self):
        session.pop('employee_login', None)  # Remove session data
        return {'message': 'Logged out successfully'}
        
class CheckSession(Resource):
    def get(self):
        if 'employee_login' in session:
            return {
                'logged_in': True,
                'employee_login': session['employee_login']
            }, 200
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
        

            


    
api.add_resource(Home,'/')
api.add_resource(GetCustomers, '/customers')
api.add_resource(Login, '/login')
api.add_resource(Employees, '/employees')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)