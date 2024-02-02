let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let inventory = ["stick"];

let button1 = document.querySelector("#button1");
let button2 = document.querySelector("#button2");
let button3 = document.querySelector("#button3");
let text = document.querySelector("#text");
let xpText = document.querySelector("#xpText");
let healthText = document.querySelector("#healthText");
let goldText = document.querySelector("#goldText");
let monsterStats = document.querySelector("#monsterStats");
let monsterName = document.querySelector("#monsterName");
let monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'claw hammer', power: 50 },
    { name: 'sword', power: 100 }
];

const monsters = [{
    name: "slime",
    level: 2,
    health: 15
},
{
    name: "fanged beast",
    level: 8,
    health: 60
},
{
    name: "dragon",
    level: 20,
    health: 300
}];

const locations = [
    {
        name: "town square",
        "text button": ["Go to store", "Go to cave", "Fight dragon"],
        "text function": [goStore, goCave, fightDragon],
        text: 'You are in the town square. You see a sign that says "Store".'
    },
    {
        name: "store",
        "text button": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "text function": [buyHealth, buyWeapon, goTown],
        text: 'You enter the store.'
    },
    {
        name: "cave",
        "text button": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "text function": [fightSlime, fightBeast, goTown],
        text: 'You enter the cave. You see some monsters.'
    },
    {
        name: "fight",
        "text button": ["Attack", "Dodge", "Run"],
        "text function": [attack, dodge, goTown],
        text: 'You are fighting a monster.'
    },
    {
        name: "kill monster",
        "text button": ["Go to town square", "Go to town square", "Go to town square"],
        "text function": [goTown, easterEgg, goTown],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "text button": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "text function": [restart, restart, restart],
        text: 'You die. ☠️'
    },
    {
        name: "win",
        "text button": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "text function": [restart, restart, restart],
        text: 'You defeat the dragon! YOU WIN THE GAME! 🎉'
    },
    {
        name: "easterEgg",
        "text button": ["2", "8", "Go to town square"],
        "text function": [pickTwo, pickEight, goTown],
        text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!'
    }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(locations) {
    button1.innerText = locations["text button"][0];
    button2.innerText = locations["text button"][1];
    button3.innerText = locations["text button"][2];
    button1.onclick = locations["text function"][0];
    button2.onclick = locations["text function"][1];
    button3.onclick = locations["text function"][2];
    text.innerText = locations.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold > 0) {
        gold -= 10;
        goldText.innerText = gold;
        health += 10;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health.";

    }


}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            goldText.innerText = gold;
            currentWeapon++;
            inventory.push(weapons[currentWeapon].name);
            text.innerText = `You now have a ${weapons[currentWeapon].name}. In your inventory you have: ${inventory}`;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        currentWeapon--;
        text.innerText = `You sold a ${inventory.shift()}. In your inventory you have: ${inventory}`
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterStats.style.display = 'block';
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsters[fighting].health;
}

function attack() {
    text.innerText = `The ${monsters[fighting].name} attacks. You attack it with your ${weapons[currentWeapon].name}.`;
    health -= getMonsterAttackValue(monsters[fighting].level);
    healthText.innerText = health;
    if (isMonsterHit()) {
        monsters[fighting].health -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;

    } else {
        text.innerText += " You miss.";
    }

    monsterHealthText.innerText = monsters[fighting].health;

    if (health <= 0) {
        lose();
    } else if (monsters[fighting].health <= 0) {
        if (fighting === 2) {
            win();
        } else {
            defeatMonster();
        }
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText = `Your ${inventory.pop()} breaks.`;
        currentWeapon--;
    }
}

function dodge() {
    text.innerText = `You dodge the attack from the ${monsters[fighting].name}`;
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function lose() {
    monsterStats.style.display = 'none';
    update(locations[5]);
}

function win() {
    monsterStats.style.display = 'none';
    update(locations[6]);
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    monsterStats.style.display = 'none';
    update(locations[4]);

}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    healthText.innerText = health;
    goldText.innerText = gold;
    xpText.innerText = xp;
    currentWeapon = 0;
    inventory = ["stick"];
    goTown();
}

function easterEgg () {
    update(locations[7]);
}

function pick (guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText =  `You picked ${guess}. Here are the random numbers:\n`;
    for(let i = 0; i< numbers.length; i++){
        text.innerText += numbers[i] + "\n";
    } 
    if(numbers.includes(guess)) {
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}

function pickTwo () {
    pick(2);
}

function pickEight () {
    pick(8);
}