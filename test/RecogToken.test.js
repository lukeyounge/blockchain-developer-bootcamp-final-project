// test/RecogToken.test.js

// Load dependencies
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const RecogToken = contract.fromArtifact('RecogToken');

// Start test block
describe('RecogToken', function () {
  const [contractOwner, minter, buyer] = accounts;

  beforeEach(async function () {
    // Deploy a new contract for each test
    this.RecogToken = await RecogToken.new({ from: contractOwner });
  });

  it('should have a name', async function () {
    const name = await this.RecogToken.name();
    expect(name).to.equal('RecogToken');
  });

  it('should have a symbol', async function () {
    const symbol = await this.RecogToken.symbol();
    expect(symbol).to.equal('RCT');
  });

  // addMinter function should require ether
  it('should require ether to addMinter', async function () {
    await expectRevert(
      this.RecogToken.addMinter(minter, { from: buyer }),
      'pay at least 0.001 eth to sign up as a minter'
    );
  });

  // buyer should not have minterRole = true
  it('should not have minterRole = true by default', async function () {
    const minterRole = await this.RecogToken.getMinterRole(buyer);
    expect(minterRole).to.equal(false);
  });

  // addMinter function should add minter to minterRole
  it('should add minter to minterRole', async function () {
    await this.RecogToken.addMinter(minter, {
      from: contractOwner,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    const minterRole = await this.RecogToken.getMinterRole(minter);
    expect(minterRole).to.equal(true);
  });

  // a minter who is added to minterRole should be able to call safeMint function
  it('should be able to call safeMint function', async function () {
    await this.RecogToken.addMinter(minter, {
      from: contractOwner,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    const minterRole = await this.RecogToken.getMinterRole(minter);
    expect(minterRole).to.equal(true);
    await this.RecogToken.safeMint(minter, {
      from: minter,
      uri: 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    });
  });
});
