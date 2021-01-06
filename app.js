const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');
const { table } = require("console");

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
        choices: ["Add Department, Role, or Employee", "View Department, Role or Employee", "Update Employee Roles", "Quit"]
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
            case "Update Employee Roles":
                updateMenu();
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
    // We query all of the rows/colums from the department table.
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
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
                // Here, we want the list to dynamically populate with all departments.
                choices: () => {
                    const tableArray = [];
                    for (let i = 0; i < res.length; i++) {
                        //This looks at each Dep from the query and adds their name to an array.
                        tableArray.push(res[i].name);
                    };
                    return tableArray;
                },
            },
        ])
          .then((answer) => {
              let roleDepID;
              //Forloop that compares the department name to the query and finds the relative Id.
              for (let i = 0; i < res.length; i++) {
                  if (res[i].name === answer.roleDep) {
                      roleDepID = res[i].id;
                  };
              };
              //Using the answers we received and the department id, we insert into the role table.
              const query = "INSERT INTO role SET ?";
              connection.query(query, { 
                  title: answer.roleTitle, 
                  salary: answer.roleSalary, 
                  department_id: roleDepID,
                }, (err, res) => {
                  if (err) throw err;
                  console.log(`${answer.roleTitle} has been added.`);
                  mainMenu();
              });
        });
    })
};

const addEmployee = () => {
    connection.query("SELECT * FROM employee", (err, resEmp) => {
        if (err) throw err;
        connection.query("SELECT * FROM role", (err, resRole) => {
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
                    choices: () => {
                        const tableArray = [];
                        for (let i = 0; i < resRole.length; i++) {
                            //This looks at each Title from the Role query and adds their name to an array.
                            tableArray.push(resRole[i].title);
                        };
                        return tableArray;
                    },
                },
                {
                    type: "list",
                    message: "Who is their manager?",
                    name: "employeeManager",
                    choices: () => {
                        const tableArray = [];
                        for (let i = 0; i < resEmp.length; i++) {
                            //This looks at each full name from the employee query and adds their name to an array.
                            tableArray.push(`${resEmp[i].first_name} ${resEmp[i].last_name}`);
                        };
                        return tableArray;
                    },
                },
            ])
              .then((answer) => {
                let empRoleID;
                //Forloop that compares the Role name to the query and finds the relative Id.
                for (let i = 0; i < resRole.length; i++) {
                    if (resRole[i].title === answer.employeeRole) {
                        empRoleID = resRole[i].id;
                    };
                };
                let empMngID;
                //Forloop that compares the Manager/Employee name to the query and finds the relative Id.
                for (let i = 0; i < resEmp.length; i++) {
                    if (`${resEmp[i].first_name} ${resEmp[i].last_name}` === answer.employeeManager) {
                        empMngID = resEmp[i].id;
                    };
                };
                const query = "INSERT INTO employee SET ?";
                connection.query(query, { 
                    first_name: answer.employeeFirst,
                    last_name: answer.employeeLast,
                    role_id: empRoleID,
                    manager_id: empMngID
                  }, (err, res) => {
                    if (err) throw err;
                    console.log(`${answer.employeeFirst} has been added.`);
                    mainMenu();
                });
            });
        })
    })    
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

//TODO: This whole thing is busted because of checkTable yayyy.
const updateMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            name: "employeeList",
            //TODO: Fix this.
            choices: "test",
        },
    ])
    .then((answer) => {
        //TODO: Do this.
        // const query = `UPDATE employee SET role_id = `;
    });
};

connection.connect((err) => {
    if (err) throw err;
    mainMenu();
  });
  