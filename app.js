const inquirer = require("inquirer");
const mysql = require('mysql');

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
        choices: ["Add Department, Role, or Employee", "View Deperatment, Role or Employee", "Updated Employee Roles", "Quit"]
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
                break;
        };
    });
};

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
                console.log("Option 1 says Hi");
                break;
            case "Add Role":
                console.log("Option 2 says Hello");
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

const viewMenu = () => {
    inquirer.prompt({
        type: "list",
        message: "Please choose what you'd like to view.",
        name: "view",
        choices: ["View Department", "View Role", "View Employee", "Go Back"]
    })
    // {view} is object deconstruction to find menu from inquirer's result.
    .then(({view}) => {
        switch (view) {
            case "View Department":
                console.log("Option 1 says Hi");
                break;
            case "View Role":
                console.log("Option 2 says Hello");
                break;
            case "View Employee":
                console.log("Option 3 says Boo!");
                break;
            // Sends the user back to the main menu.
            case "Go Back":
                mainMenu();
                break;
        };
    });
};

connection.connect((err) => {
    if (err) throw err;
    mainMenu();
  });
  