from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, validates
import bcrypt
from config import db
from datetime import datetime

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True)
    employee_login = Column(String, nullable=False)
    employee_password = Column(String, nullable=False)

    @validates('employee_login')
    def validate_employee_login(self, key, username):
        if len(username) < 0:
            raise ValueError("Must enter a employee login")
        else:
            return username
        
    @validates('employee_password')
    def validate_employee_password(self, key, password):
        if len(password) < 7:
            raise ValueError("Password didn't meet character criteria")
        else:
            return password