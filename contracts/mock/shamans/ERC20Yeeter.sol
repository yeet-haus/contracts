// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@daohaus/baal-contracts/contracts/interfaces/IBaal.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

// yeet erc20 for loot or shares
contract ERC20Yeeter is ReentrancyGuard, Initializable {
    uint256 public immutable PERC_POINTS = 1e6;
    string public constant name = "ERC20Yeeter:0.0.1";

    IERC20 public token;
    uint256 public startTime;
    uint256 public endTime;
    bool public isShares;
    uint256 public multiplier;
    uint256 public minTribute;
    uint256 public goal;
    address[] public feeRecipients;
    uint256[] public feeAmounts;

    uint256 public balance;
    IBaal public baal;
    address public vault;

    event OnReceivedERC20(
        address indexed contributorAddress,
        uint256 amount,
        uint256 shares,
        address baal,
        address vault,
        string message,
        address token
    );

    /**
     * @dev Initializes contract
     * @param _baal Address of DAO contract
     * @param _vault DAO vault address
     * @param _initParams Endocded params for all other shaman params
     *  uint256 startTime: timestamp when contributions can start being accepted
     *  uint256 endTime: timestamp when contributions will no longer be accepted
     *  bool isShares: indicates if contribution returns shares or loot
     *  uint256 minTribute: minimum amount of eth for a contribution
     *  uint256 multiplier: how much to multiply the eth amount by for share/loot return
     *  uint256 goal: fundraising goal
     *  address[] feeRecipients: array of addresses to send fee cut to on contributions
     *  uint256[] feeAmounts: array of percentages for fee cuts to each recipient
     *
     *  Requirements:
     *
     * number of feeRecipients matches feeAmounts
     */
    function setup(address _baal, address _vault, bytes memory _initParams) external initializer {
        (
            address payable _token,
            uint256 _startTime,
            uint256 _endTime,
            bool _isShares,
            uint256 _minTribute,
            uint256 _multiplier,
            uint256 _goal,
            address[] memory _feeRecipients,
            uint256[] memory _feeAmounts
        ) = abi.decode(_initParams, (address, uint256, uint256, bool, uint256, uint256, uint256, address[], uint256[]));
        require(_feeAmounts.length == _feeRecipients.length, "fee amounts does not equal fee recipients");
        baal = IBaal(_baal);
        token = IERC20(_token);
        if (_vault == address(0)) {
            vault = baal.target();
        } else {
            vault = _vault;
        }
        startTime = _startTime;
        endTime = _endTime;
        isShares = _isShares;
        minTribute = _minTribute;
        multiplier = _multiplier;
        goal = _goal;
        feeRecipients = _feeRecipients;
        feeAmounts = _feeAmounts;
    }

    /**
     * @dev internal function to mint tokens to contributor
     * @param to address to mint to
     * @param amount amount to mint
     *
     */
    function _mintTokens(address to, uint256 amount) private {
        address[] memory _receivers = new address[](1);
        _receivers[0] = to;

        uint256[] memory _amounts = new uint256[](1);
        _amounts[0] = amount;

        if (isShares) {
            baal.mintShares(_receivers, _amounts);
        } else {
            baal.mintLoot(_receivers, _amounts);
        }
    }

    /**
     * @dev public function to make contributions
     * @param _value amount of token being yeeted
     *
     * Requirements:
     *
     * - `baal` DAO contract must exist
     * - cannot be before `startTime`
     * - cannot be after `endTime`
     * - shaman must have manager permission on the `baal` DAO contract
     * - `_value` must be more than minTribute payment amount in wei
     */
    function contribute(uint256 _value, string memory message) public nonReentrant {
        require(address(baal) != address(0), "!init");
        require(startTime <= block.timestamp, "contribution has not started");
        require(endTime > block.timestamp, "contribution has ended");
        require(baal.isManager(address(this)), "Shaman not manager");
        require(_value >= minTribute, "!minTribute");

        uint256 totalFee = 0;
        for (uint256 i = 0; i < feeAmounts.length; i++) {
            uint256 _cut = (_value / PERC_POINTS) * feeAmounts[i];
            require(token.transferFrom(msg.sender, address(feeRecipients[i]), _cut), "Fee Transfer failed");
            totalFee = totalFee + _cut;
        }

        uint256 _shares = _value * multiplier;

        require(token.transferFrom(msg.sender, address(baal), _value - totalFee), "Fee Transfer failed");

        balance = balance + _value;

        _mintTokens(msg.sender, _shares);

        emit OnReceivedERC20(msg.sender, _value, _shares, address(baal), vault, message, address(token));
    }

    function goalAchieved() public view returns (bool) {
        return balance >= goal;
    }
}
