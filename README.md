# Raffle drawer

This is a script that draws raffle winners with modified probabilities, depending on the number of tickets that a user purchaed.

## Description

In the "uniform case", where all tickets are equivalent, the standard deviation around the expected number of tickets $x$, is approximately $\sqrt{x}$.

This script introduces a mapping ($x' = A * x^{B}$), which allows one to modifiy the standard deviation for a given expected number of tickets by perform the drawing of winners in surrogate $x'$ space. To adjust the standard deviation you need to modify constants $A$ and $B$. The effect of constant $A$ is straight forward:

$\sigma(x | A,B=1) \approx \sqrt{A*x}$

The effect of $B$ is somewhat more intricate, but the following guidlines can be used:

$\sigma(x | A, B=2) \approx \sqrt{A/2}$

$\sigma(x | A, B=3) \approx 1 / \sqrt{A*x}$

For simulating the general $\sigma(x| A, B)$ check the Jupyter notebook `stdev.ipynb`.