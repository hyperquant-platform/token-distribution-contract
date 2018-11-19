pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


/**
 * @title UnrenounceableOwnable
 * @dev Ownable contract that cannot be renounced.
 */
contract UnrenounceableOwnable is Ownable {

  /**
   * Disallow to renounce ownership.
   */
  function renounceOwnership() public onlyOwner {
    revert();
  }

}
