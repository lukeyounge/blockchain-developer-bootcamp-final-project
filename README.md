# Token Mint

## Blockchain developer bootcamp final project - Luke Younge

#### Deployed url
https://lukeyounge.github.io/blockchain-developer-bootcamp-final-project/

#### Screencast
https://youtu.be/A1SKzwG11ug

#### Public Address
lukey.eth / 0x9c281902C8dEFdD2277993318EE702dA5B708752

## Intro
Businesses want to acknowledge staff and other stakeholders, and often use corporate gifts to achieve this. Staff members may receive ornaments, pens, caps, tee-shirts, etc. Sometimes these products are useful, often they gather dust and are a waste of resources.

I set off to create a simple DIY app for an organisation to mint their own NFTs.

As I went through the process, I made it more generic, so it is a DIY NFT minter. As part of learning to implement access control, I added a payable function to allow people to mint.

Moving forward I would like to:
- bring the front end in line with the original idea, and
- create a simple distribution mechanism
- deploy on Polygon or xDai
- display the minted NFT on the screen (currently I just link to the OpenSea collection.

## Basic Use Flow
- Web front end that allows someone sign up as a minter
- Upload image to IPFS
- Mint the image as an ERC721 NFT
- A simple link to the collection on OpenSea Rinkeby

## Directory structure
``` bash
.
├── README.md
├── avoiding_common_attacks.md
├── build
│   ├── abi
│   └── contracts
├── contracts
│   ├── Migrations.sol
│   └── RecogToken.sol
├── dapp.js
├── deployed\ address.txt
├── design_pattern_decisions.md
├── final-project-checklist.txt
├── index.html
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_recog_token.js
├── nft.storage-tools
├── node_modules
├── package-lock.json
├── package.json
├── style.css
├── test
│   └── RecogToken.test.js
└── truffle-config.js
```

To run the front end, simply use 'go live' in vs code on index.html after you have cloned and installed dependencies.

## Cloning and installing on your machine

#### Requirements
1. Truffle v5.4.12 (core: 5.4.12)
2. Solidity v0.5.16 (solc-js)
3. Node v14.17.3
4. Web3.js v1.5.3

#### Installing
1. Git clone the repo in a fresh folder:
`git clone https://github.com/lukeyounge/blockchain-developer-bootcamp-final-project.git`
2. cd into the blockchain-developer-bootcamp-final-project folder
3. run `npm install` to install the dependencies.
4. comment out ropsten and rinkeby sections in truffle-config.js (optional)

#### Testing
Install truffle if you don't already have it, then:
1. run `truffle develop` 
2. run `compile` (All contracts will compile)
3. run `test` (all 6 tests will pass)

In the test file (RecogToken.test.js) I hard coded a NFT uri that was created by the contract as I couldn't work out if it was possible to call it programmatically.












