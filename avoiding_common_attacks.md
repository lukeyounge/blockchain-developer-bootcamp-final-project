Avoiding Common Attacks


#### Using Specific Compiler Pragma SWC-103
I used a specific compiler: 0.8.2

#### Checks-Effects-Interactions (Avoiding state changes after external calls) SWC-107
The safeMint function first updates state (tokenID) before calling the _safeMint function that creates the token.

#### Proper use of .call and .delegateCall SWC-104
In the withdraw() function, I specify .call for withdrawals.

#### Forcibly Sending Ether SWC-132
While this contract can be forcibly sent ether, since there is no contract logic dependent on a specific contract balance, this attack will not work. Also, since I am not maintaining a balance of any participant in the contract, an attacker cannot spoof the contract after forcibly sending it ether. The contract balance - address(this).balance - is maintained at the protocol layer. Lastly I have included payable receive and fallback functions. 

