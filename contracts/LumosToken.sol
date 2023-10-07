// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LumosToken is ERC20 {
    address owner;

    constructor() ERC20("Lumos", "LMS") {
        owner = msg.sender;
        _mint(address(this), 300000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner,  "Only owner" );
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
}