// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.11;

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
