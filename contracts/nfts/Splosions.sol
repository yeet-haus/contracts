// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@daohaus/baal-contracts/contracts/interfaces/IBaal.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../utils/base64.sol";

contract SplosionsYeeter is ReentrancyGuard, ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public mintPrice = 420000000000000; /* Mint price of each token */
    uint256 public lootPrize = 2000000000000000000; /* 2 share tokens */
    bool public cidv1 = true; /* type of ifps hash for validation logic */
    string private _contractURI =
        "ipfs://bafkreihvio72f7gu7live3us336uuhmufcvbe3iqygsop2f5vt6knculcy"; /* URI for the contract metadata */

    IBaal public baal = IBaal(0xD423689d4A2969e8bdF68d7452122D043D6Dd273); /* Address of dao sepolia */
    // IBaal public baal = IBaal(0x020ED3b58B1FE2E4cf88786C140cD6e1e6EDB99f); /* Address of dao base */

    mapping(uint256 => TokenMeta) public tokenMetas; /*maps `tokenId` to struct details*/

    // DATA STRUCTURES
    struct TokenMeta {
        string imageHash /*ipfs hash of the token image*/;
        string name /*ipfs hash of blown up image*/;
    }

    constructor() ERC721("Splosions", "BOOM") {}

    function mint(string memory _imageHash, string memory _name) public payable nonReentrant {
        if (cidv1) {
            validateIpfsCidV1(_imageHash);
        } else {
            validateIpfsHash(_imageHash);
        }
        require(baal.isManager(address(this)), "Shaman not manager");

        uint256 tokenId = _tokenIdCounter.current();

        (bool transferSuccess, ) = baal.target().call{ value: msg.value }("");

        require(transferSuccess, "Transfer failed");

        _mintLoot(msg.sender, lootPrize);

        _safeMint(msg.sender, tokenId + 1);
        _tokenIdCounter.increment();
        tokenMetas[tokenId + 1] = TokenMeta(_imageHash, _name);
    }

    function setContractURI(string memory _newContractURI) public onlyOwner {
        _contractURI = _newContractURI;
    }

    function toggleImageType() public onlyOwner {
        cidv1 = !cidv1;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory tokenImageHash = tokenMetas[_tokenId].imageHash;
        string memory name = tokenMetas[_tokenId].name;

        string memory imgPath = string(abi.encodePacked("ipfs://", tokenImageHash));

        string memory metadata = string(
            abi.encodePacked(
                '{"name": "Splosion #',
                Strings.toString(_tokenId),
                '", "description": "BOOM!", "image": "',
                imgPath,
                '", "external_url": "https://splosions.raidguild.org", "attributes":',
                '[{"trait_type": "Name", "value":"',
                name,
                '"}]}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(metadata))));
    }

    function _mintLoot(address to, uint256 amount) private {
        address[] memory _receivers = new address[](1);
        _receivers[0] = to;

        uint256[] memory _amounts = new uint256[](1);
        _amounts[0] = amount;

        baal.mintLoot(_receivers, _amounts);
    }

    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function validateIpfsHash(string memory imageHash) internal pure {
        bytes memory hashBytes = bytes(imageHash);
        require(hashBytes.length == 46, "Invalid IPFS hash length");
        require(hashBytes[0] == "Q" && hashBytes[1] == "m", "IPFS hash must start with 'Qm'");
    }

    function validateIpfsCidV1(string memory imageHash) internal pure {
        bytes memory hashBytes = bytes(imageHash);
        require(hashBytes.length >= 46, "IPFS CIDv1 is too short");
        require(
            hashBytes[0] == "b" && hashBytes[1] == "a" && hashBytes[2] == "f" && hashBytes[3] == "y",
            "Invalid CIDv1 prefix"
        );
    }
}
