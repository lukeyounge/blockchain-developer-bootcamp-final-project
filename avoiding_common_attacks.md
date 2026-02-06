Avoiding Common Attacks


#### Using Specific Compiler Pragma SWC-103
I used a specific compiler: 0.8.2

#### Checks-Effects-Interactions (Avoiding state changes after external calls) SWC-107
The safeMint function first updates state (tokenID) before calling the _safeMint function that creates the token.

#### Proper use of .call and .delegateCall SWC-104
In the withdraw() function, I specify .call for withdrawals.

#### Forcibly Sending Ether SWC-132
While this contract can be forcibly sent ether, since there is no contract logic dependent on a specific contract balance, this attack will not work. Also, since I am not maintaining a balance of any participant in the contract, an attacker cannot spoof the contract after forcibly sending it ether. The contract balance - address(this).balance - is maintained at the protocol layer. Lastly I have included payable receive and fallback functions.

#### Reentrancy Protection SWC-107
The withdraw() function is protected with OpenZeppelin's ReentrancyGuard (nonReentrant modifier), preventing reentrant calls during ETH transfers. The balance is also captured in a local variable before the external call.

#### Access Control for removeMinter
The removeMinter() function is restricted so that only the contract owner or the minter themselves can revoke minter privileges. Previously, any address could remove any minter's role, which would allow griefing attacks.

#### Minting Access Control
The safeMint() function validates that msg.sender has the minter role (not just the recipient address), and enforces that minters can only mint to their own address. This prevents unauthorized third parties from triggering mints.

#### Supply Cap
A MAX_SUPPLY constant (10,000) prevents unlimited minting, protecting against potential token inflation attacks.

#### Ownable Pattern
The contract uses OpenZeppelin's Ownable for owner management instead of a raw address variable. This provides a well-audited onlyOwner modifier, ownership transfer capability, and emits OwnershipTransferred events.

#### Event Emission
All state-changing functions emit events (MinterAdded, MinterRemoved, TokenMinted, Withdrawal) for off-chain monitoring and transparency.
