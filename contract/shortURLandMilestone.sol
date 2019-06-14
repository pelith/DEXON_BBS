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

    uint256[] milestones;

    uint256 public time;

    event Link(bytes32 long, bytes32 short, uint256 time);

    function link(bytes32 long, bytes32 short, uint256 cur) public onlyOwner {
        links[long] = short;
        links[short] = long;
        emit Link(long, short, cur);
    }

    function addMilestone(uint256 milestone, uint256 cur) public onlyOwner {
        milestones.push(milestone);
        time = cur;
    }

    function clearMilestone() public onlyOwner {
        delete milestones;
    }

    function getMilestones() public view returns(uint256[]) {
        return milestones;
    }
}
