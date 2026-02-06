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
  const [contractOwner, minter, buyer, attacker] = accounts;

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
    await this.RecogToken.safeMint(
      minter,
      'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      { from: minter }
    );
  });

  // --- Security Tests ---

  // Test: removeMinter access control - attacker cannot remove another user's minter role
  it('should not allow an attacker to remove a minter', async function () {
    await this.RecogToken.addMinter(minter, {
      from: minter,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await expectRevert(
      this.RecogToken.removeMinter(minter, { from: attacker }),
      'Only owner or minter themselves can remove minter role'
    );
    // Minter role should still be active
    const role = await this.RecogToken.getMinterRole(minter);
    expect(role).to.equal(true);
  });

  // Test: owner can remove a minter
  it('should allow owner to remove a minter', async function () {
    await this.RecogToken.addMinter(minter, {
      from: minter,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await this.RecogToken.removeMinter(minter, { from: contractOwner });
    const role = await this.RecogToken.getMinterRole(minter);
    expect(role).to.equal(false);
  });

  // Test: minter can remove themselves
  it('should allow a minter to remove themselves', async function () {
    await this.RecogToken.addMinter(minter, {
      from: minter,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await this.RecogToken.removeMinter(minter, { from: minter });
    const role = await this.RecogToken.getMinterRole(minter);
    expect(role).to.equal(false);
  });

  // Test: non-minter cannot call safeMint
  it('should not allow non-minter to call safeMint', async function () {
    await expectRevert(
      this.RecogToken.safeMint(
        attacker,
        'https://ipfs.io/ipfs/QmTest',
        { from: attacker }
      ),
      'Caller must have minter role'
    );
  });

  // Test: minter cannot mint to a different address
  it('should not allow minter to mint to a different address', async function () {
    await this.RecogToken.addMinter(minter, {
      from: minter,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await expectRevert(
      this.RecogToken.safeMint(
        buyer,
        'https://ipfs.io/ipfs/QmTest',
        { from: minter }
      ),
      'Can only mint to your own address'
    );
  });

  // Test: only owner can withdraw
  it('should not allow non-owner to withdraw', async function () {
    await expectRevert(
      this.RecogToken.withdraw({ from: attacker }),
      'Ownable: caller is not the owner'
    );
  });

  // Test: owner can withdraw funds
  it('should allow owner to withdraw funds', async function () {
    // Add a minter to send ETH to the contract
    await this.RecogToken.addMinter(minter, {
      from: minter,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    // Owner withdraws
    await this.RecogToken.withdraw({ from: contractOwner });
  });

  // Test: addMinter emits MinterAdded event
  it('should emit MinterAdded event', async function () {
    const receipt = await this.RecogToken.addMinter(minter, {
      from: buyer,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    expectEvent(receipt, 'MinterAdded', {
      minter: minter,
      addedBy: buyer,
    });
  });

  // Test: cannot add same minter twice
  it('should not allow adding the same minter twice', async function () {
    await this.RecogToken.addMinter(minter, {
      from: minter,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await expectRevert(
      this.RecogToken.addMinter(minter, {
        from: minter,
        value: web3.utils.toWei('0.01', 'ether'),
      }),
      'Address is already a minter'
    );
  });
});
