const inquirer = require("inquirer");

let petName = "";
let mood = 100;
let hunger = 100;
let thirst = 100;
let tiredness = 100;
let health = 100;

function petStatus() {
    let moodText = "";
    if (mood > 50) {
        moodText = "happy";
    } else if (health == 0) {
        moodText = "dead";
    } else if (mood < 50) {
        moodText = "bored";
    };
    console.log(`
    ${petName}:
        health: ${health}
        mood: ${moodText}
        hunger: ${hunger}
        thirst: ${thirst}
        tiredness: ${tiredness}
    Type feed to feed ${petName}, drink to give ${petName} a drink, 
    play to play with ${petName} and sleep to let ${petName} sleep`);
};

function play() {
    if (health > 0) {
        mood = 100;
        tiredness -= 10;
        if (tiredness < 0) {
            tiredness = 0;
        };
    };
    console.log(`\nYou played with ${petName}`);
};

function feed() {
    if (health > 0) {
        hunger = 100;
        thirst -= 10;
        if (thirst < 0) {
            thirst = 0;
        };
    };
    console.log(`\nYou fed ${petName}`);
};

function drink() {
    if (health > 0) {
        thirst = 100;
        mood -= 10;
        if (mood < 0) {
            mood = 0;
        };
    };
    console.log(`\n${petName} slept`);
};

function sleep() {
    if (health > 0) {
        tiredness = 100;
        hunger -= 30;
        thirst -= 30;
        if (hunger < 0) {
            hunger = 0;
        };
        if (thirst < 0) {
            thirst = 0;
        };
    };
    console.log(`\nYou gave ${petName} a drink`);
};

function deadChecker(func) {
    if (health != 0) {
        return func();
    } else {
        return "Look at what you have done...";
    };
};

function statDecreaser(stat) {
    if (stat > 0) {
        stat--;
    };
    return stat;
};

inquirer.prompt([
    {
        type: "list",
        name: "getType",
        message: "Hello! Choose pet:",
        choices: ["dog", "cat", "rabbit"],
        filter(val) {
            return val.toLowerCase();
        },
    },
    {
        type: 'input',
        name: 'getName',
        message: 'Now, give it a name',
        validate(value) {
            petName = value;
            console.log("\nExcellent name! Let's get started.");
            return true;
        },
    },
    ])
    .then((answers) => {
        petStatus();
        setInterval(() => {
            hunger = statDecreaser(hunger);
            thirst = statDecreaser(thirst);
            tiredness = statDecreaser(tiredness);
            mood = statDecreaser(mood);
            if ((hunger == 0 || thirst == 0 || mood == 0 || tiredness == 0) && health > 0) {
                health--;
            } else if (health < 100 && health > 0) {
                health++;
            };
        }, 1000);
        inquirer.prompt([
            {
                type: 'input',
                name: 'main',
                message: `What do you want to do? Type status to get updated stats on ${petName} or quit to quit`,
                validate(value) {
                    if (value == "play") {
                        return deadChecker(play); 
                    } else if (value == "feed") {
                        return deadChecker(feed);   
                    } else if (value == "drink") {
                        return deadChecker(drink); 
                    } else if (value == "sleep") {
                        return deadChecker(sleep);    
                    } else if (value == "status") {
                        petStatus();
                    } else if (value == "quit") {
                        return true
                    } else {
                        return "Invalid input.";
                    };
                },
            },
            ])
            .then((answers) => {
                console.log("See you another time!");
                process.exit();
        });
});