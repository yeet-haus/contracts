// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../mock/shamans/EthYeeter.sol";
import "../mock/shamans/ERC20Yeeter.sol";

contract YeeterFactory {
    address payable public ethYeeterTemplate;
    address payable public erc20YeeterTemplate;

    event CreateUnsetEthYeeter(address indexed baal, address yeeter);

    constructor(address payable _ethYeeterTemplate, address payable _erc20YeeterTemplate) {
        ethYeeterTemplate = _ethYeeterTemplate;
        erc20YeeterTemplate = _erc20YeeterTemplate;
    }

    function deployEthYeeter(address _baal, address _vault, bytes memory _initParams) public returns (address) {
        EthYeeter yeeter = EthYeeter(payable(Clones.clone(ethYeeterTemplate)));

        yeeter.setup(_baal, _vault, _initParams);

        emit CreateUnsetEthYeeter(_baal, address(yeeter));

        return address(yeeter);
    }

    function deployErc20Yeeter(address _baal, address _vault, bytes memory _initParams) public returns (address) {
        ERC20Yeeter yeeter = ERC20Yeeter(payable(Clones.clone(erc20YeeterTemplate)));

        yeeter.setup(_baal, _vault, _initParams);

        emit CreateUnsetEthYeeter(_baal, address(yeeter));

        return address(yeeter);
    }
}
