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
        
class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    id = Column(Integer, primary_key=True)
    first_last_name = Column(String, nullable=False)
    phone_number = Column(Integer)
    email = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    
    customer_notifications = relationship('CustomerNotification', back_populates='customer')

    @validates('first_last_name')
    def validate_names(self, key, first_lase_name):
        if len(first_lase_name) < 0:
            raise ValueError("Must enter a name to add to queue")
        else:
            return first_lase_name
    @validates('phone_number')
    def validate_number(self, key, phone_number):
        if len(phone_number) < 10:
            raise ValueError("Must enter a valid phone number")
        else:
            return phone_number
        
class Notification(db.Model, SerializerMixin):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True)
    message = Column(String, nullable=False)
    status = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    
    customer_notifications = relationship('CustomerNotification', back_populates='notification')

    @validates('message')
    def validate_message(self, key, message):
        if len(message) < 0:
            raise ValueError('No message added for notification, please add one')
        else:
            return message
        
class QueueLine(db.Model, SerializerMixin):
    __tablename__ = 'queue'

    id = Column(Integer, primary_key=True)
    queue_position = Column(Integer, nullable=False)
    status = Column(String)
    customer_id = Column(Integer, ForeignKey('customers.id'))



class CustomerNotification(db.Model, SerializerMixin):
    __tablename__ = 'customer_notifications'

    serialize_rules=('-customer.customer_notifications', '-notification.customer_notifications')

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    notification_id = Column(Integer, ForeignKey('notifications.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)  # Additional attribute example

    customer = relationship('Customer', back_populates='customer_notifications')
    notification = relationship('Notification', back_populates='customer_notifications')