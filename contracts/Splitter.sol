pragma solidity ^0.4.17;

contract Splitter{

    struct UserStruct {
        address userAddress;
        string  name;
        uint    amount;
    }

    string  public _ownerName;
    address  public _ownerAddress;

    //TODO: Check array can be replaced with map to avoid looping
    UserStruct[] public _usersStruct;

    function  Splitter(string ownerName, 
    string user1Name, address user1Address, 
    string user2Name, address user2Address) 
    public {
        _ownerName = ownerName;
        _ownerAddress = msg.sender;
        UserStruct memory newUser1;
        newUser1.userAddress = user1Address;
        newUser1.name = user1Name;
        _usersStruct.push(newUser1);

        UserStruct memory newUser2;
        newUser2.userAddress = user2Address;
        newUser2.name = user2Name;
        _usersStruct.push(newUser2);
    }

    function split() public payable returns(bool)
    {
        if(msg.value==0) require(false);
        uint amountHalf = msg.value/2;
        _usersStruct[0].amount += amountHalf;
        _usersStruct[1].amount += amountHalf;
        if(!checkEven(msg.value))
        {
            if(_usersStruct[0].amount > _usersStruct[1].amount)
            {
                _usersStruct[1].amount += 1;
            }
            else
            {
                _usersStruct[0].amount += 1;
            }
        }
        return true;
    }

    function checkEven(uint value) pure private returns(bool)
    {
        if(value%2 == 0)
            return true;
        else
            return false;    
    } 

    function performTransfer() public returns(bool) {
        uint size = _usersStruct.length;
        for(uint count=0; count < size; count++)
        {
            _usersStruct[count].userAddress.transfer(_usersStruct[count].amount);
        }
        return true;
    }

    function getOwnerName() public view returns(string name){
        name = _ownerName;
    }

    function getOwnerAddress() public view returns(address ownerAddress){
        ownerAddress = _ownerAddress;
    }

    function getUserAmount(address userAddress) public view returns(uint amount){
        uint size = _usersStruct.length;
        for(uint count=0; count < size; count++)
        {
            if(_usersStruct[count].userAddress == userAddress)
                amount = _usersStruct[count].amount;
        }
    }

    function killMe() public returns (bool) {
    require(msg.sender == _ownerAddress);
    selfdestruct(_ownerAddress);
    return true;
    }

}