// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../mock/shamans/EthYeeter.sol";

contract EthYeeterFactory {
    address payable public template;

    event CreateUnsetEthYeeter(address indexed baal, address yeeter);

    constructor(address payable _template) {
        template = _template;
    }

    function deployEthYeeter(address _baal, address _vault, bytes memory _initParams) public returns (address) {
        EthYeeter yeeter = EthYeeter(payable(Clones.clone(template)));

        yeeter.setup(_baal, _vault, _initParams);

        emit CreateUnsetEthYeeter(_baal, address(yeeter));

        return address(yeeter);
    }
}
