from app import app
from models import db, Customer, Employee, Notification, QueueLine, CustomerNotification
from random import choice, random, randint
from faker import Faker

fake = Faker()

def customers():
    customers = []
    for i in range(10):
        customer = Customer(
            first_last_name = fake.name(), 
            phone_number = fake.phone_number(),
            email = fake.email(), 
        )
        customers.append(customer)
    return customers

def employees():
    employees = []
    for i in range(3):
        employee = Employee(
            employee_login = fake.user_name(),
            employee_password = fake.password()
        )
        employees.append(employee)
    return employees

def notifications():
    
    notification1 = Notification(
        message = "Hey babe! Get to that dressing room you have 5 minutes starting now!",
        status = "sent",
    )
    notification2 = Notification(
        message = "Hey babe! We don't see you here at the dressing room! Hurry up!",
        status = "sent",
    )
    notification3 = Notification(
        message = "Hey babe! Sorry we had to go to the next girlie, come back if you still need that perfect size!",
        status = "sent",
    )
    notifications = [notification1, notification2, notification3]

    return notifications

def queueLines():
    
    queue1 = QueueLine(
        queue_position = 1,
        status = "waiting",
        customer_id = 1,

    )
    queue2 = QueueLine(
        queue_position = 2,
        status = "waiting",
        customer_id = 2,

    )
    queue3 = QueueLine(
        queue_position = 3,
        status = "waiting",
        customer_id = 3,

    )
    queue4 = QueueLine(
        queue_position = 4,
        status = "waiting",
        customer_id = 4,

    )
    queue5 = QueueLine(
        queue_position = 5,
        status = "waiting",
        customer_id = 5,

    )
    queue6 = QueueLine(
        queue_position = 6,
        status = "waiting",
        customer_id = 6,

    )
    queue7 = QueueLine(
        queue_position = 7,
        status = "waiting",
        customer_id = 7

    )
    queue8 = QueueLine(
        queue_position = 9,
        status = "waiting",
        customer_id = 8,

    )
    queue9 = QueueLine(
        queue_position = 9,
        status = "waiting",
        customer_id = 9,

    )
    queue10 = QueueLine(
        queue_position = 10,
        status = "waiting",
        customer_id = 10,

    )

    queuelines = [queue1, queue2, queue3, queue4, queue5, queue6, queue7, queue8, queue9, queue10]
    return queuelines

def customerNotifications():
    
    notification1 = CustomerNotification(
        customer_id = 1,
        notification_id = 1
    )
    notification2 = CustomerNotification(
        customer_id = 1,
        notification_id = 2
    )
    notification3 = CustomerNotification(
        customer_id = 1,
        notification_id = 3
    )
    notification4 = CustomerNotification(
        customer_id = 2,
        notification_id = 1
    )
    notification5 = CustomerNotification(
        customer_id = 2,
        notification_id = 2
    )
    notification6 = CustomerNotification(
        customer_id = 3,
        notification_id = 1
    )
    notifications = [notification1, notification2, notification3, notification4, notification5, notification6]
    return notifications


if __name__ == '__main__':
    with app.app_context():
        print('Starting seed...')
        print("Clearing db to start...")
        Customer.query.delete()
        Employee.query.delete()
        Notification.query.delete()
        QueueLine.query.delete()
        CustomerNotification.query.delete()
        db.session.commit()
        
        print("Starting customer seed...")
        customers = customers()
        db.session.add_all(customers)
        db.session.commit()

        print("Starting employee seed...")
        employees = employees()
        db.session.add_all(employees)
        db.session.commit()

        print("Starting notifications seed...")
        notifications = notifications()
        db.session.add_all(notifications)
        db.session.commit()

        print("Starting queue line seed...")
        queues = queueLines()
        db.session.add_all(queues)
        db.session.commit()

        print("Starting customer notifications seed...")
        customernoti = customerNotifications()
        db.session.add_all(customernoti)
        db.session.commit()

        print("Seed complete...")