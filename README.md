# Raffle drawer

This is a script that draws raffle winners with modified probabilities, depending on the number of tickets that a user purchaed.

## Description

In the "uniform case", where all tickets are equivalent, the standard deviation around the expected number of tickets $x$, is approximately $\sqrt{x}$.

This script introduces a mapping ($x' = A * x^{B}$), which allows one to modifiy the standard deviation for a given expected number of tickets by perform the drawing of winners in surrogate $x'$ space. To adjust the standard deviation you need to modify constants $A$ and $B$. The effect of constant $A$ is straight forward:

$\sigma(x | A,B=1) \approx \sqrt{x/A}$

The effect of $B$ is somewhat more intricate, but the following guidlines can be used:

$\sigma(x | A, B=2) \approx 0.5$

$\sigma(x | A, B=3) \approx 1 / \sqrt{A * x}$

For simulating the general $\sigma(x| A, B)$ check the Jupyter notebook `stdev.ipynb`.

## Usage

The script will read the data provided in `data.csv` (you will have to keep the structure of data as in the provided example). The ouput of the script will be an array of objects with the following structure: 

``{
    wallet: string      // Wallet address of the user
    tickets: number     // Number of tickets purchased
    rewards: number     // Number of winning tickets
    delta: number       // The difference between actual winning tickets and the expected number
}``

A sensible choice for mapping parameters is $A \sim 5$ and $1 \lesssim B \lesssim 1.5$.
