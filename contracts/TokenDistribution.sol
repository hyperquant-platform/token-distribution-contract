pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import './UnrenounceableOwnable.sol';


/**
 * @title TokenDistribution
 * @dev Conract for distributing tokens.
 */
contract TokenDistribution is UnrenounceableOwnable {
  uint16 public maxTransactions = 300;

  function distribute(address token, address[] _addresses, uint256[] _balances) onlyOwner public {
    require(_addresses.length <= maxTransactions);
    require(_addresses.length == _balances.length);
    ERC20 erc20token = ERC20(token);
    uint16 i = 0;
    for (i; i < _addresses.length; i++) {
      erc20token.transferFrom(msg.sender, _addresses[i], _balances[i]);
    }
  }

  function setMaxTransactions(uint16 _maxTransactions) onlyOwner external {
    maxTransactions = _maxTransactions;
  }

  function reclaimToken(address token) onlyOwner public {
    ERC20 erc20token = ERC20(token);
    uint256 balance = erc20token.balanceOf(this);
    require(balance > 0);
    erc20token.transfer(msg.sender, balance);
  }
}
