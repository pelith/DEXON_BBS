pragma solidity ^0.5.0;

contract BBS {
    event Posted(string content);
    
    function Post(string memory content) public {
        emit Posted(content);
    }
}

contract BBS_Extension {
	BBS DEXON_BBS = BBS(0x663002C4E41E5d04860a76955A7B9B8234475952);

	mapping(bytes32 => uint256) upvotes;
	mapping(bytes32 => uint256) downvotes;
	mapping(address => mapping(bytes32 => bool)) voted;

	event Replied(bytes32 origin, string content);

	function upvote(bytes32 post) public {
		require(!voted[msg.sender][post]);
		voted[msg.sender][post] = true;
		upvotes[post] += 1;
	}

	function downvote(bytes32 post) public {
		require(!voted[msg.sender][post]);
		voted[msg.sender][post] = true;
		downvotes[post] += 1;
	}

	function Post(string memory content) public {
		DEXON_BBS.Post(content);
	}

	function Reply(bytes32 origin, string memory content) public {
		emit Replied(origin, content);
	}
	
}
