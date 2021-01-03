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
                console.log("Option 3 says Boo!");
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

const viewDepartments = () => {
    connection.query(
        "SELECT * FROM department", (err, res) => {
          if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
};

const viewRoles = () => {
    //Query for Role table. Includes foreign keyed info from department.
    const query = "SELECT *, role.id FROM role INNER JOIN department ON role.department_id = department.id"
    //This is us connecting & quering MySQL.
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

const viewEmployees = () => {
    connection.query(
        "SELECT * FROM employee", (err, res) => {
          if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
};

connection.connect((err) => {
    if (err) throw err;
    mainMenu();
  });
  