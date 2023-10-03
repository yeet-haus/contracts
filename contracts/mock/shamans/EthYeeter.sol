// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "@daohaus/baal-contracts/contracts/interfaces/IBaal.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "hardhat/console.sol";

// yeet eth for loot or shares
contract EthYeeter is ReentrancyGuard, Initializable {
    string public constant name = "EthYeeter";

    uint256 public startTime;
    uint256 public endTime;
    bool public isShares;
    uint256 public multipler;
    uint256 public minTribute;
    address[] public feeRecipients;
    uint256[] public feeAmounts;

    IBaal public baal;
    address vault;

    event OnReceived(
        address indexed contributorAddress,
        address shamanAddress,
        uint256 amount,
        uint256 isShares,
        address baal,
        address vault
    );

    /**
     * @dev Initializes contract
     * @param _moloch Address of DAO contract
     * @param _vault DAO vault address
     * @param _initParams Endocded params for all other shaman params
     *  uint256 startTime: timestamp when contributions can start being accepted
     *  uint256 endTime: timestamp when contributions will no longer be accepted
     *  bool isShares: indicates if contribution returns shares or loot
     *  uint256 minTribute: minimum amount of eth for a contribution
     *  uint256 multiplier: how much to multiply the eth amount by for share/loot return
     *  address[] feeRecipients: array of addresses to send fee cut to on contributions
     *  uint256[] feeAmounts: array of percentages for fee cuts to each recipient
     */
    function setup(address _moloch, address _vault, bytes memory _initParams) external initializer {
        (
            uint256 _startTime,
            uint256 _endTime,
            bool _isShares,
            uint256 _minTribute,
            uint256 _multipler,
            address[] _feeRecipients,
            uint256 _feeAmounts
        ) = abi.decode(_initParams, (uint256, uint256, bool, uint256, uint256, address[], uint256[]));
        baal = IBaal(_moloch);
        vault = _vault;
        startTime = _startTime;
        endTime = _endTime;
        isShares = _isShares;
        minTribute = _minTribute;
        multipler = _multipler;
        feeRecipients = _feeRecipients;
        feeAmounts = _feeAmounts;
    }

    /**
     * @dev internal function to mint tokens to contibutor
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

    // tribute eth for loot or shares
    // must meet minimum tribute
    // fees are sent to the cuts addresses
    // eth is sent to the DAO
    // loot or shares are minted to the sender

    /**
     * @dev public function to make contributions
     * Takes eth as the value on the tx and mints the tokens to the sender
     *
     * Requirements:
     *
     * - `baal` DAO contract must exist
     * - cannot be before `startTime`
     * - cannot be after `endTime`
     * - shaman must have manager permission on the `baal` DAO contract
     * - `msg.value` must be exact payment amount in wei
     * - `nextTokenID must be more than `minTribute`
     * - `deactivationTimestamp` must be greater than the current block time
     */
    function contributeEth() public payable nonReentrant {
        require(address(baal) != address(0), "!init");
        require(startTime <= block.timestamp, "contribution has not started");
        require(endTime > block.timestamp, "contribution has ended");
        require(baal.isManager(address(this)), "Shaman not manager");
        require(msg.value >= minTribute, "!minTribute");

        // mint loot or shares minus any fees
        // WEDNESDAY: HERE
        uint256 _shares = msg.value * multipler;

        // transfer funds to vault
        (bool success, ) = vault.call{ value: msg.value }("");
        require(success, "Transfer failed");

        _mintTokens(msg.sender, _shares);

        emit OnReceived(msg.sender, this, msg.value, _shares, address(baal), vault);
    }

    receive() external payable {
        onboarder();
    }
}
