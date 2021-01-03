INSERT INTO department (name) 
VALUES 
("Management"),
("Sales"),
("Customer Support");

INSERT INTO role (title, salary, department_id) 
VALUES 
("Chief Executive Officer", 200000.00, 1),
("Chief Fincancial Officer", 185000.00, 1),
("Lead Sales Associate", 120000.00, 2),
("Sales Associate", 85000.00, 2),
("Customer Service Lead", 65000.00, 3),
("CS Representative", 40000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
("Victor","Moscone",1,null),
("Joseph","Carn",2,1),
("Frank","Sinatra",3,2),
("Sean","Murray",4,3),
("Maddison","Silva",5,1),
("Bart","Mildew",6,5);