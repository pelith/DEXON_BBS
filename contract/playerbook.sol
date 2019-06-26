pragma solidity ^0.4.24;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0)
            return 0;
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);
        return c;
    }

    function muldiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        return div(mul(a,b),c);
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = ((add(x,1)) / 2);
        y = x;
        while (z < y)
        {
            y = z;
            z = ((add((x / z),z)) / 2);
        }
    }

    function pow(uint256 a, uint256 b) internal pure returns(uint256) {
        uint256 ans = 1;
        while(b != 0){
            if(b%2 == 1)
                ans = mul(ans,a);
            a = mul(a,a);
            b = b / 2;
        }
        return ans;
    }

    function distance(uint256 x1, uint256 y1, uint256 x2, uint256 y2) internal pure returns(uint256) {
        uint256 dx = x1 > x2 ? sub(x1,x2) : sub(x2,x1);
        uint256 dy = y1 > y2 ? sub(y1,y2) : sub(y2,y1);
        return sqrt(add(pow(dx,2),pow(dy,2)));
    }

}

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

contract PlayerBook is Ownable{
    using SafeMath for uint256;
    using NameFilter for string;

    struct Player {
        bytes32 name;
        uint256 names;
        uint256 exp;
        address referrer;
        address link;
        string meta;
    }

    address public wallet;
    uint256 public fee;

    mapping(bytes32 => address) public name2addr;
    mapping(address => Player) public players;
    mapping(address => bool) public isLobby;
    mapping(address => mapping(bytes32 => bool)) public isMyName;
    mapping(address => bool) public migrated;

    event SetNewName(address indexed playerAddress, bytes32 indexed playerName);

    modifier isValidWriter() {
        require(isLobby[msg.sender] || msg.sender == owner);
        _;
    }

    function setLobby(address _lobby, bool _isLobby) public onlyOwner {
        isLobby[_lobby] = _isLobby;
    }

    function setWallet(address _wallet) public onlyOwner {
        wallet = _wallet;
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function addExp(address who, uint256 amount) public isValidWriter {
        players[who].exp = players[who].exp.add(amount);
    }

    function register(string name) public payable{
        require(msg.value >= fee);
        wallet.transfer(msg.value);
        address me = msg.sender;
        bytes32 nameDisp = name.stringToBytes32();
        bytes32 _name = name.nameFilter();
        require(name2addr[_name] == address(0));
        // normalized name is only for checking owner
        name2addr[_name] = me;
        // mixedcase name is for displaying
        players[me].name = nameDisp;
        players[me].names = players[me].names.add(1);
        isMyName[me][_name] = true;
        emit SetNewName(me, nameDisp);
    }

    function useAnotherName(string name) public {
        address me = msg.sender;
        bytes32 nameDisp = name.stringToBytes32();
        bytes32 _name = name.nameFilter();
        require(isMyName[me][_name]);
        players[me].name = nameDisp;
        emit SetNewName(me, nameDisp);
    }

    function setMeta(string meta) public {
        players[msg.sender].meta = meta;
    }

    function setLink(address link) public {
        players[msg.sender].link = link;
    }

    //---- functions used by lobbies

    function setReferrerByName(address who, bytes32 ref) external isValidWriter {
        require(name2addr[ref] != address(0) && name2addr[ref] != who);
        players[who].referrer = name2addr[ref];

    }

    function setReferrerByAddress(address who, address ref) external isValidWriter {
        require(ref != who);
        players[who].referrer = ref;
    }

    //--------- getters ----------------------

    function checkIfNameValid(string name) public view returns(bool) {
        bytes32 _name = name.nameFilter();
        if (name2addr[_name] == 0)
            return (true);
        else
            return (false);
    }

    function getPlayer(address who) public view returns(bytes32, uint256, uint256, address, address, string) {
        Player storage p = players[who];
        return(p.name, p.names, p.exp, p.referrer, p.link, p.meta);
    }

    function getLV(address who) public view returns(uint256) {
        uint256 exp = players[who].exp;
        return exp.div(10).sqrt();
    }

    //-------- function for migration

    function migrate(address newPlayerBook) public {
        Player storage p = players[msg.sender];
        require(!migrated[msg.sender]);
        migrated[msg.sender] = true;
        IPlayerBook(newPlayerBook).receiveMigration(msg.sender,p.name, p.names, p.exp, p.referrer, p.link, p.meta);
    }

    //-------- ERC721

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    mapping (uint256 => address) private _tokenApprovals;
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return players[_owner].names;
    }
    function ownerOf(uint256 _tokenId) public view returns (address) {
        return name2addr[bytes32(_tokenId)];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transferFrom(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        require(to != msg.sender, "ERC721: approve to caller");

        _operatorApprovals[msg.sender][to] = approved;
        emit ApprovalForAll(msg.sender, to, approved);
    }


    function getApproved(uint256 tokenId) public view returns (address) {
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal {
        bytes32 _name = bytes32(tokenId);
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(players[from].name != _name, "cannot transfer current name");

        _clearApproval(tokenId);

        players[from].names = players[from].names.sub(1);
        players[to].names = players[to].names.add(1);
        isMyName[from][_name] = false;
        isMyName[to][_name] = true;
        name2addr[_name] = to;

        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function _clearApproval(uint256 tokenId) private {
        if (_tokenApprovals[tokenId] != address(0)) {
            _tokenApprovals[tokenId] = address(0);
        }
    }

}

interface IPlayerBook {
    function receiveMigration(address who, bytes32 name, uint256 names, uint256 exp, address referrer, address link, string meta) external returns(bytes4);
}

library NameFilter {

    /**
     * @dev filters name strings
     * -converts uppercase to lower case.
     * -makes sure it does not start/end with a space
     * -makes sure it does not contain multiple spaces in a row
     * -cannot be only numbers
     * -cannot start with 0x
     * -restricts characters to A-Z, a-z, 0-9, and space.
     * @return reprocessed string in bytes32 format
     */
    function nameFilter(string _input)
        internal
        pure
        returns(bytes32)
    {
        bytes memory _temp = bytes(_input);
        uint256 _length = _temp.length;

        //sorry limited to 12 characters
        require (_length <= 12 && _length >= 3, "string must be between 3 and 12 characters");
        // make sure it doesnt start with or end with space
        require(_temp[0] != 0x20 && _temp[_length-1] != 0x20, "string cannot start or end with space");
        // make sure first two characters are not 0x
        if (_temp[0] == 0x30)
        {
            require(_temp[1] != 0x78, "string cannot start with 0x");
            require(_temp[1] != 0x58, "string cannot start with 0X");
        }

        // create a bool to track if we have a non number character
        bool _hasNonNumber;

        // convert & check
        for (uint256 i = 0; i < _length; i++)
        {
            // if its uppercase A-Z
            if (_temp[i] > 0x40 && _temp[i] < 0x5b)
            {
                // convert to lower case a-z
                _temp[i] = byte(uint(_temp[i]) + 32);

                // we have a non number
                if (_hasNonNumber == false)
                    _hasNonNumber = true;
            } else {
                require
                (
                    // require character is a space
                    _temp[i] == 0x20 ||
                    // OR lowercase a-z
                    (_temp[i] > 0x60 && _temp[i] < 0x7b) ||
                    // or 0-9
                    (_temp[i] > 0x2f && _temp[i] < 0x3a),
                    "string contains invalid characters"
                );
                // make sure theres not 2x spaces in a row
                if (_temp[i] == 0x20)
                    require( _temp[i+1] != 0x20, "string cannot contain consecutive spaces");

                // see if we have a character other than a number
                if (_hasNonNumber == false && (_temp[i] < 0x30 || _temp[i] > 0x39))
                    _hasNonNumber = true;
            }
        }

        require(_hasNonNumber == true, "string cannot be only numbers");

        bytes32 _ret;
        assembly {
            _ret := mload(add(_temp, 32))
        }
        return (_ret);
    }

    function stringToBytes32(string memory source)
        internal
        pure
        returns (bytes32 result) {

        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}
