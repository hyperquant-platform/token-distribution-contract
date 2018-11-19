import shouldFail from 'openzeppelin-solidity/test/helpers/shouldFail';


const UnrenounceableOwnable = artifacts.require('UnrenounceableOwnable');

contract('UnrenounceableOwnable', function ([_, owner, acc1, acc2, acc3, acc4, acc5]) {
  beforeEach(async function () {
    this.contract = await UnrenounceableOwnable.new({ from: owner });
  });

  describe('renounce ownership', function () {
    it('should not renounce ownership', async function () {
      await shouldFail.reverting(this.contract.renounceOwnership({ from: owner}));
    });

    it('should revert from not owner', async function () {
      await shouldFail.reverting(this.contract.renounceOwnership({ from: _ }));
    });
  });
});
