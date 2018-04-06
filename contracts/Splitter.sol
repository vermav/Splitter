pragma solidity ^ 0.4.17;

contract Splitter {

  address public owner;
  mapping(address => uint) public balances;
  address[] public recipientIndex;

  event LogLogger(string data);
  event LogSplitter(address initiater, string action, address receiver,
                    uint amount);

  function Splitter() public { owner = msg.sender; }

  function splitFunds(address _recipient1, address _recipient2) public payable
  returns(bool) {
    require(owner == msg.sender);
    require(msg.value > 0);
    if (!isRecipientsValid(_recipient1, _recipient2)) {
      LogLogger("LOG: Recipient invalid return");
      revert(); // ISSUE: revert() failing
      return false;
    }

    uint amountHalf = msg.value / 2;
    uint remainder = msg.value % 2;

    balances[_recipient1] += amountHalf;
    LogSplitter(owner, "Splitter: Add fund to ", _recipient1, amountHalf);
    balances[_recipient2] += amountHalf + remainder;
    LogSplitter(owner, "Splitter: Add fund to ", _recipient1,
                amountHalf + remainder);
    return true;
  }

  function isRecipientsValid(address _recipient1,
                             address _recipient2) private returns(bool) {
    if (_recipient1 == _recipient2)
      return false;
    if (owner == _recipient1)
      return false;
    if (owner == _recipient2)
      return false;

    if (recipientIndex.length == 0) {
      recipientIndex.push(_recipient1);
      recipientIndex.push(_recipient2);
    } else {
      if (balances[_recipient1] == 0)
        return false;
      if (balances[_recipient2] == 0)
        return false;
    }
    LogLogger("LOG: Recipient is valid");
    return true;
  }

  function payToRecipient(address _recipientAddress) public returns(bool) {
    require(msg.sender == owner);
    require(balances[_recipientAddress] != 0);
    _recipientAddress.transfer(balances[_recipientAddress]);
    LogSplitter(owner, "Splitter: Transfer fund to ", _recipientAddress,
                balances[_recipientAddress]);
    balances[_recipientAddress] = 0;
    return true;
  }

  function killMe() public returns(bool) {
    require(msg.sender == owner);
    selfdestruct(owner);
    return true;
  }

  function() public {}
}