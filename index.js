import fs from 'fs';
import csv from 'csv-parser';
import random from 'random';

const REWARDS = 20; // Total number of rewards

const A = 10; // Mapping parameter #1
const B = 1;  // Mapping parameter #2


async function readData(path) {
    return new Promise((resolve) => {
        const data = [];
        fs.createReadStream(path).pipe(
            csv()
        ).on('data', (row) => {
            data.push(row);
        }).on('end', () => {
            resolve(data);
        });
    });
}

function formatData(data) {

    let entrants = new Map();

    for (let row of data) {
        const tickets = Number(row["ticketsBought"]);
        if (entrants.has(row["walletId"])) {
            entrants.set(row["walletId"], entrants.get(row["walletId"]) + tickets);
        } else {
            entrants.set(row["walletId"], tickets);
        }
    }

    entrants = Array.from(entrants, ([wallet, tickets]) => ({ wallet, tickets }));

    return entrants;
}


function scale(x) {
    return A * Math.pow(x, B);
}

function scaleInverse(x) {
    return Math.round(Math.pow(x / A, 1 / B));
}


function drawRewards(data, rewards) {

    let tickets = 0;
    for (let entrant of data) {
        tickets += entrant["tickets"];
    }

    const p = rewards / tickets;

    let awarded = 0;
    for (let entrant of data) {
        const t = entrant["tickets"];
        
        const n = scale(t);
        const x = random.binomial(n, p)();
        const r = scaleInverse(x);
        
        // console.log(t * p, r);

        entrant["rewards"] = r;
        entrant["delta"] = r / (t * p) - 1;
        awarded += r;
    }

    data.sort(entrant => entrant["delta"]);

    if (awarded < rewards) {
        for (let i = 0; i < rewards - awarded; i++) {
            data[i]["rewards"] += 1;
        }
    } else if (awarded > rewards) {
        for (let i = 0; i < awarded - rewards;) {
            if (data[data.length - 1 - i]["rewards"] > 0) {
                data[data.length - 1 - i]["rewards"] -= 1;
                i++;
            }
        }
    }

    let awarded2 = 0;
    for (let entrant of data) {
        awarded2 += entrant["rewards"];
    }

    console.log(awarded, awarded2);

    return data;
}


/*
Takes the sample .csv file as an input and returns an array of objects,
where each item corresponds to an unique entrant (walletId) and contains
the information about the number of tickets and rewards won.

Example input: see data.csv

Example output: [
  {
    wallet: '8bTjRMgkuFKBfMvfCbhbNpMDdZMP5J9iHm4MUULAzW',
    tickets: 1,
    rewards: 1,
    delta: -1
  },
  {
    wallet: '9kvm9DF2J7veAMKEodJtDcArntSrbMkGvKxvpDCB7w6',
    tickets: 1,
    rewards: 1,
    delta: -1
  },
  {
    wallet: '7MKk54ChBTcVpuZ5rLw3y51KqBgGgKzLWzdhU2bLrpV',
    tickets: 1,
    rewards: 0,
    delta: -1
  },
  ...
]
*/

async function main() {

    // Reads the .csv file
    const data = await readData("data.csv");
    // console.log(data);

    // Formats the data so that each array item corresponds to an unique entrant
    const entrants = formatData(data);
    // console.log(entrants);

    // Determines the number of rewards that each entrant will receive
    const rewards = drawRewards(entrants, REWARDS);
    console.log(rewards);
}

main();
