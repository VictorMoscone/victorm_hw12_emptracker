const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
  
    user: 'root',
  
    password: 'password',
    database: 'employee_db',
  });

const mainMenu = () => {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "menu",
        choices: ["Add Department, Role, or Employee", "View Department, Role or Employee", "Updated Employee Roles", "Quit"]
    })
    // {menu} is object deconstruction to find menu from inquirer's result.
    .then(({menu}) => {
        switch (menu) {
            case "Add Department, Role, or Employee":
                addMenu();
                break;
            case "View Department, Role or Employee":
                viewMenu();
                break;
            case "Updated Employee Roles":
                console.log("Option 3 says Boo!");
                break;
            // Ends the program.
            case "Quit":
                connection.end();
                break;
        };
    });
};

//Below is the add menu and its three subroutines.
const addMenu = () => {
    inquirer.prompt({
        type: "list",
        message: "Please choose what you'd like to add.",
        name: "add",
        choices: ["Add Department", "Add Role", "Add Employee", "Go Back"]
    })
    // {add} is object deconstruction to find menu from inquirer's result.
    .then(({add}) => {
        switch (add) {
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            // Sends the user back to the main menu.
            case "Go Back":
                mainMenu();
                break;
        };
    });
};

const addDepartment = () => {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the department you'd like to add?",
        name: "departmentName"
    })
      .then(({ departmentName }) => {
          const query = "INSERT INTO department SET ?";
          connection.query(query, {name: departmentName}, (err, res) => {
              if (err) throw err;
              console.log(`${departmentName} has been added.`);
              mainMenu();
          });
    });
};

const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of the Role you'd like to add?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What will the salary be?",
            name: "roleSalary"
        },
        {
            type: "list",
            message: "Which department will this role be for?",
            name: "roleDep",
            //TODO: Needs to dynamically load in all available departments.
            choices: ["1", "2", "3"]
        },
    ])
      .then((answer) => {
          const query = "INSERT INTO role SET ?";
          connection.query(query, { 
              title: answer.roleTitle, 
              salary: answer.roleSalary, 
              department_id: answer.roleDep
            }, (err, res) => {
              if (err) throw err;
              console.log(`${answer.roleTitle} has been added.`);
              mainMenu();
          });
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is their first name?",
            name: "employeeFirst"
        },
        {
            type: "input",
            message: "What is their last name?",
            name: "employeeLast"
        },
        {
            type: "list",
            message: "What is their role?",
            name: "employeeRole",
            //TODO: Needs to dynamically load in all available roles.
            choices: checkTable(),
        },
        {
            type: "list",
            message: "Who is their manager?",
            name: "employeeManager",
            //TODO: Needs to dynamically load in all available managers.
            choices: ["1", "2", "3"]
        },
    ])
      .then((answer) => {
          const query = "INSERT INTO employee SET ?";
          connection.query(query, { 
              title: answer.roleTitle, 
              salary: answer.roleSalary, 
              department_id: answer.roleDep
            }, (err, res) => {
              if (err) throw err;
              console.log(`${answer.roleTitle} has been added.`);
              mainMenu();
          });
    });
};

const checkTable = () => {
    const query = "SELECT role.title FROM role";
    let tableArray = [];
    connection.query(
        query, (err, res) => {
          if (err) throw err;
          for (let i = 0; i < res.length; i++) {
              tableArray.push(res[i].title);
          };
        }
    );
    return tableArray;
};

// Below is the view menu and its three subroutines.
const viewMenu = () => {
    inquirer.prompt({
        type: "list",
        message: "Please choose what you'd like to view.",
        name: "view",
        choices: ["View Departments", "View Roles", "View Employees", "Go Back"]
    })
    // {view} is object deconstruction to find menu from inquirer's result.
    .then(({view}) => {
        switch (view) {
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            // Sends the user back to the main menu.
            case "Go Back":
                mainMenu();
                break;
        };
    });
};

// ID | Name
const viewDepartments = () => {
    //Query for Department table.
    const query = "SELECT * FROM department";
    //This is us connecting and querying MySQL.
    connection.query(
        query, (err, res) => {
          if (err) throw err;
            //This is using the console.table NPM to display the info.
            console.table(res);
            //Returns back to the Main Menu when done.
            mainMenu();
        }
    );
};

// ID | Title | Salary | Department
const viewRoles = () => {
    //Query for Role table. Includes foreign keyed info from Department table.
    const query = "SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id";
    //This is us connecting & querying MySQL.
    connection.query(
        query, (err, res) => {
          if (err) throw err;
            //This is using the console.table NPM to display the info.
            console.table(res);
            //Returns back to the Main Menu when done.
            mainMenu();
        }
    );
};

// ID | First | Last | Role Title | Dep | Salary | Manager
const viewEmployees = () => {
    //Query for Employee table. Includes info from Department and Role table.
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, IFNULL(CONCAT(manager.first_name,' ', manager.last_name), 'Top Manager') AS 'manager' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id";
    //This is us connecting & querying MySQL.    
    connection.query(
        query, (err, res) => {
          if (err) throw err;
            //This is using the console.table NPM to display the info.
            console.table(res);
            //Returns back to the Main Menu when done.
            mainMenu();
        }
    );
};

connection.connect((err) => {
    if (err) throw err;
    mainMenu();
  });
  