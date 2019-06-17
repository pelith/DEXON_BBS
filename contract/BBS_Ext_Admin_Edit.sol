pragma solidity ^0.5.0;

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

contract BBS {
    event Posted(string content);

    function Post(string memory content) public {
        emit Posted(content);
    }
}

contract Admin is Ownable{
	mapping(bytes32 => bool) public banned;
	mapping(address => bool) public isAdmin;

	address public category;

	event Ban(bytes32 indexed origin, bool banned, address admin, string reason);

	constructor(address _category) public {
		category = _category;
	}

	function ban(bytes32 origin, bool _banned) public {
		require(isAdmin[msg.sender]);
		banned[origin] = _banned;
		emit Ban(origin, _banned, msg.sender);
	}

	function setAdmin(address who, bool _isAdmin) public onlyOwner {
		isAdmin[who] = _isAdmin;
	}

}

contract BBS_Edit {
	event Edited(bytes32 origin, string content);

	function edit(bytes32 origin, string memory content) public {
		emit Edited(origin, content);
	}

}

contract BBS_Extension {
	BBS DEXON_BBS = BBS(0x663002C4E41E5d04860a76955A7B9B8234475952);

	mapping(bytes32 => uint256) public upvotes;
	mapping(bytes32 => uint256) public downvotes;
	mapping(address => mapping(bytes32 => bool)) public voted;

	event Replied(bytes32 origin, uint256 vote, string content);

	function upvote(bytes32 post) internal {
		require(!voted[msg.sender][post]);
		voted[msg.sender][post] = true;
		upvotes[post] += 1;
	}

	function downvote(bytes32 post) internal {
		require(!voted[msg.sender][post]);
		voted[msg.sender][post] = true;
		downvotes[post] += 1;
	}

	function Post(string memory content) public {
		DEXON_BBS.Post(content);
	}

	function Reply(bytes32 origin, uint256 vote, string memory content) public {
		if(vote == 1)
			upvote(origin);
		else if(vote == 2)
			downvote(origin);
		else
			vote = 0;
		emit Replied(origin, vote, content);
	}

}
