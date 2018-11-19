import shouldFail from 'openzeppelin-solidity/test/helpers/shouldFail';

const util = require('ethereumjs-util');
const TokenDistribution = artifacts.require('TokenDistribution');
const BasicToken = artifacts.require('BasicTokenMock');


contract('TokenDistribution', function ([_, owner, acc1, acc2, acc3, acc4, acc5]) {
  const totalTokensAmount = web3.toBigNumber('1e20');

  beforeEach(async function () {
    this.token = await BasicToken.new(owner, totalTokensAmount, { from: owner });
    this.distributionContract = await TokenDistribution.new({ from: owner });
  });

  describe('distribute tokens', function () {
    it('should succeed with total balance', async function () {
      const addresses = [acc1, acc2, acc3, acc4, acc5];
      const balances = [1000, web3.toBigNumber('1e19'), web3.toBigNumber('3e19'), web3.toBigNumber('5e19'), web3.toBigNumber('1e19').sub(1000)];
      await this.token.increaseAllowance(this.distributionContract.address, totalTokensAmount, { from: owner });
      await this.distributionContract.distribute(this.token.address, addresses, balances, { from: owner });
      for (var i = 0; i < addresses.length; i++)
      {
        const tokenBalance = await this.token.balanceOf(addresses[i]);
        assert.isTrue(tokenBalance.equals(balances[i]));
      }
      const ownerBalance = await this.token.balanceOf(owner);
      assert.isTrue(ownerBalance.equals(0));
    });

    it('should succeed with partial balance', async function () {
      const addresses = [acc1, acc2, acc3, acc4];
      const balances = [1000, web3.toBigNumber('1e19'), web3.toBigNumber('3e19'), web3.toBigNumber('5e19')];
      await this.token.increaseAllowance(this.distributionContract.address, totalTokensAmount, { from: owner });
      await this.distributionContract.distribute(this.token.address, addresses, balances, { from: owner });
      for (var i = 0; i < addresses.length; i++)
      {
        const tokenBalance = await this.token.balanceOf(addresses[i]);
        assert.isTrue(tokenBalance.equals(balances[i]));
      }
      const ownerBalance = await this.token.balanceOf(owner);
      assert.isTrue(ownerBalance.equals(web3.toBigNumber('1e19').sub(1000)));
    });

    it('should revert from not owner', async function () {
      const addresses = [acc1, acc2, acc3, acc4];
      const balances = [1000, web3.toBigNumber('1e19'), web3.toBigNumber('3e19'), web3.toBigNumber('5e19')];
      await this.token.increaseAllowance(this.distributionContract.address, totalTokensAmount, { from: owner });
      await shouldFail.reverting(this.distributionContract.distribute(this.token.address, addresses, balances, { from: _ }));
    });

    it('should revert with unequal list lengths', async function () {
      const addresses = [acc1, acc2, acc3, acc4, acc5];
      const balances = [1000, web3.toBigNumber('1e19'), web3.toBigNumber('3e19'), web3.toBigNumber('5e19')];
      await this.token.increaseAllowance(this.distributionContract.address, totalTokensAmount, { from: owner });
      await shouldFail.reverting(this.distributionContract.distribute(this.token.address, addresses, balances, { from: owner }));
    });

    it('should revert with length higher than `maxTransactions`', async function () {
      const invalidMaxTransactions = 11;
      const addresses = [];
      const balances = [];
      for (var i = 1; i <= invalidMaxTransactions; i++)
      {
        addresses.push(util.bufferToHex(util.setLengthLeft(i, 20)));
        balances.push(100);
      }
      await this.distributionContract.setMaxTransactions(10, { from: owner });
      await this.token.increaseAllowance(this.distributionContract.address, totalTokensAmount, { from: owner });
      await shouldFail.reverting(this.distributionContract.distribute(this.token.address, addresses, balances, { from: owner }));
    });

    it('should revert with not enough allowance', async function () {
      const addresses = [acc1, acc2, acc3];
      const balances = [1000, 2000, 3000];
      await this.token.increaseAllowance(this.distributionContract.address, 5000, { from: owner });
      await shouldFail.reverting(this.distributionContract.distribute(this.token.address, addresses, balances, { from: owner }));
    });

    it('should revert with not enough tokens', async function () {
      const addresses = [acc1, acc2, acc3];
      const balances = [web3.toBigNumber('5e19'), web3.toBigNumber('5e19'), 1000];
      await this.token.increaseAllowance(this.distributionContract.address, totalTokensAmount.mul(2), { from: owner });
      await shouldFail.reverting(this.distributionContract.distribute(this.token.address, addresses, balances, { from: owner }));
    });

  });

  describe('set max transactions', function () {
    it('should succeed with positive value', async function () {
      const newMaxTransactions = 2000;
      await this.distributionContract.setMaxTransactions(newMaxTransactions, { from: owner });
      const currentMaxTransactions = await this.distributionContract.maxTransactions();
      assert.isTrue(currentMaxTransactions.equals(newMaxTransactions));
    });

    it('should revert from not owner', async function () {
      const newMaxTransactions = 2000;
      await shouldFail.reverting(this.distributionContract.setMaxTransactions(newMaxTransactions, { from: _ }));
    });
  });

  describe('send ether', function () {
    it('should not succeed', async function () {
      const transferAmount = 1000;
      await shouldFail.reverting(this.distributionContract.send(transferAmount));
    });
  });

  describe('reclaim tokens', function () {
    beforeEach(async function () {
      const transferAmount = 1000;
      await this.token.transfer(this.distributionContract.address, transferAmount, { from: owner });
      const contractBalance = await this.token.balanceOf(this.distributionContract.address);
      const ownerBalance = await this.token.balanceOf(owner);
      assert.isTrue(contractBalance.equals(transferAmount));
      assert.isTrue(ownerBalance.equals(totalTokensAmount.sub(contractBalance)));
    });

    it('should succeed from owner', async function () {
      await this.distributionContract.reclaimToken(this.token.address, { from: owner });
      const newContractBalance = await this.token.balanceOf(this.distributionContract.address);
      const newOwnerBalance = await this.token.balanceOf(owner);
      assert.isTrue(newContractBalance.equals(0));
      assert.isTrue(newOwnerBalance.equals(totalTokensAmount));
    });

    it('should revert from not owner', async function () {
      await shouldFail.reverting(this.distributionContract.reclaimToken(this.token.address, { from: acc1 }));
    });
  });
});
