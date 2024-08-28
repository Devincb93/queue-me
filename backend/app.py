#!/usr/bin/env python3
from flask import Flask, jsonify, make_response, session, request
from flask_restful import Resource

from config import app, db, api
from models import Customer

app.secret_key = 'edikeyted'

class Home(Resource):
    def get(self):
        return make_response(
            {"message":"Backend"}, 
            200

        )
    
class GetCustomers(Resource):
    def get(self):
        customers = Customer.query.all()
        customers_dict_list = [customer.to_dict() for customer in customers]
        return customers_dict_list, 200
        
    
api.add_resource(Home,'/')
api.add_resource(GetCustomers, '/customers')

if __name__ == '__main__':
    app.run(port=5555, debug=True)