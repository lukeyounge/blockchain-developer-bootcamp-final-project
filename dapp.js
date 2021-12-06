const rctAddress = '0xac6b622617c7Ad9472e22F624f0e0b0028eA79CD';
const rctABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_minter',
        type: 'address',
      },
    ],
    name: 'addMinter',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'minterRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
    ],
    name: 'getMinterRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
];

import { NFTStorage } from 'https://cdn.skypack.dev/nft.storage@3.4.0';

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (MetaMask)
  if (typeof window.ethereum !== 'undefined') {
    console.log('Web3 has been detected');
    // Use MetaMask's provider
    let mmDetected = this.document.getElementById('mm-detected');
    mmDetected.innerHTML = 'MetaMask detected';
  } else {
    mmDetected.innerHTML = 'No MetaMask 🥺';
    console.log('No web3? You should consider trying MetaMask!');
    this.alert('Please install MetaMask or other wallet to use this dapp');
    window.web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545')
    );
  }
});

const mmEnable = document.getElementById('mm-connect');
const isMinter = document.getElementById('is-minter');
const storeButton = document.getElementById('storeButton');
const becomeMinter = document.getElementById('become-minter');
const queryMinterRole = document.getElementById('query-minter-role');

mmEnable.onclick = async () => {
    // Connect to MetaMask
    await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
    // Show currently selected account
    const mmCurrentAccount = document.getElementById('mm-current-account');
    mmCurrentAccount.innerHTML = 'Account: ' + ethereum.selectedAddress;
    mmEnable.innerHTML = 'MetaMask Connected';
    });

queryMinterRole.onclick = async () => {
  let web3 = new Web3(window.ethereum);
  let rctContract = new web3.eth.Contract(rctABI, rctAddress);
  const isMinterOrNo = await rctContract.methods
    .getMinterRole(ethereum.selectedAddress)
    .call();
  console.log(isMinterOrNo);
  if (isMinterOrNo) {
    console.log('You are a minter');
    isMinter.innerHTML = 'You have permission to mint your tokens';
  } else {
    console.log('You are not a minter');
    isMinter.innerHTML =
      'Please sign up to become a minter, lifetime minting just 0.001 eth';
  }
};

becomeMinter.onclick = async () => {
  let web3 = new Web3(window.ethereum);
  let rctContract = new web3.eth.Contract(rctABI, rctAddress);
  await rctContract.methods
    .addMinter(ethereum.selectedAddress)
    .send({
      from: ethereum.selectedAddress,
      gas: '210000',
      value: '1000000000000000',
    })
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((error) => {
      console.log(error);
    });
};

storeButton.onclick = async () => {
  // if the user is a minter, let them mint, else display alert
  if (isMinter.innerHTML === 'You have permission to mint your tokens') {
    const endpoint = 'https://api.nft.storage'; // the default
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIwOUMyNjlFYTQ3NTlENThjNjkxRjg2N2NjMTI5MUEyNWU3RWIwM2IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzAwNzMxMzk5MiwibmFtZSI6InRva2VubWludCJ9.O5dbXgHEk90doDUpxl5LDPGmoXs78CFavRGcvDMNzEM';
    var imageFile = document.getElementById('fimage').files[0];
    var imageName = document
      .getElementById('fimage')
      .files[0].name.replace(/\s+/g, '');
    console.log('Image ' + imageName);
    if (imageName !== '') {
      let progressMsg = document.getElementById('store-progress');
      progressMsg.innerHTML = 'Saving Image... ';
      var storage = await new NFTStorage({ endpoint, token });
      const metadata = await storage.store({
        name: imageName,
        description:
          'Using the nft.storage metadata API to create ERC-1155 compatible metadata.',
        image: imageFile,
      });
      console.log(metadata.url);
      progressMsg.innerHTML = 'Minting Image... ';
      await mint(metadata.url);
      progressMsg.innerHTML = 'Complete! ';
    }
  } else if (isMinter.innerHTML === 'Check if you are able to mint') {
    alert('Please first check if you can mint');
  } else {
    alert(
      "Sorry fren, 🥺 you can only mint if you are a minter.\r\nClick the 'Become a Minter' button"
    );
  }
};

async function mint(url) {
  let web3 = new Web3(window.ethereum);
  const rctContract = new web3.eth.Contract(rctABI, rctAddress);
  rctContract.setProvider(window.ethereum);
  let progressMsg = document.getElementById('store-progress');
  progressMsg.innerHTML = 'minting... ';
  console.log('Minting');
  //call the safeMint function on the contract
  await rctContract.methods
    .safeMint(ethereum.selectedAddress, url)
    .send({ from: ethereum.selectedAddress })
    .catch((revertReason) => console.log({ revertReason }));
  progressMsg.innerHTML = 'Nice NFT Baby';
}
