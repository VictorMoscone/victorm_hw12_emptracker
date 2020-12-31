const inquirer = require("inquirer");

const mainMenu = () => {
    inquirer.prompt({
        type: "list",
        message: "Test",
        name: "menu",
        choices: ["Test 1", "Test 2"]
    })
    .then(({menu}) => {
        switch (menu) {
            case "Test 1":
                console.log("Test 1 says Hi");
                break;
            case "Test 2":
                console.log("Test 2 says Hello");
                break;
        };
    });
};

mainMenu();