pragma solidity ^0.4.24;

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract shortURLandMilestone is Ownable {
    mapping(bytes32 => bytes32) public links;

    bytes32[] milestones;

    event Link(bytes32 long, bytes32 short);

    function link(bytes32 long, bytes32 short) public onlyOwner {
        links[long] = short;
        links[short] = long;
        emit Link(long, short);
    }

    function addMilestone(bytes32 milestone) public onlyOwner {
        milestones.push(milestone);
    }

    function clearMilestone() public onlyOwner {
        delete milestones;
    }

    function getMilestones() public view returns(bytes32[]) {
        return milestones;
    }
}
