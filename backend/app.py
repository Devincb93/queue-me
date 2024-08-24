#!/usr/bin/env python3
from flask import Flask, jsonify, make_response, session, request
from flask_restful import Resource

from config import app, db, api

app.secret_key = 'edikeyted'

class Home(Resource):
    def get(self):
        return make_response(
            {"message":"Backend"}, 
            200

        )
    
api.add_resource(Home,'/')

if __name__ == '__main__':
    app.run(port=5555, debug=True)