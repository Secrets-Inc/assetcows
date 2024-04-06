// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

//Nile Testnet
//Contract Address TCibwsrcmDwMgwHY1KoTFsmSkCAfxhdPzM
//its a TRC20 / ERC20 token supposed to mimic exactly USDT on Tron
// Initial Holder TKBxjzHSPVRZaNo9z5E5wxaSxgi3AKzECo
// For testing purposes only

interface ERC20Basic {
    function totalSupply() external view returns (uint);

    function balanceOf(address who) external view returns (uint256);

    function transfer(address to, uint256 value) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

abstract contract ERC20 is ERC20Basic {
    function allowance(
        address owner,
        address spender
    ) public view virtual returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual returns (bool);

    function approve(
        address spender,
        uint256 value
    ) public virtual returns (bool);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract MyToken is ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    uint256 private _totalSupply;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalSupply = 1000000 * 10 ** uint256(_decimals);
        balances[msg.sender] = _totalSupply;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return balances[account];
    }

    function transfer(
        address to,
        uint256 amount
    ) external override returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(
        address spender,
        uint256 amount
    ) public virtual override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view virtual override returns (uint256) {
        return allowances[owner][spender];
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        require(balances[from] >= value, "Insufficient balance");
        require(
            allowances[from][msg.sender] >= value,
            "Insufficient allowance"
        );

        balances[from] -= value;
        balances[to] += value;
        allowances[from][msg.sender] -= value;

        emit Transfer(from, to, value);
        return true;
    }
}
