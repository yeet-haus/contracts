type Contracts = {
  baalSummoner: string;
  bvSummoner: string;
  btSummoner: string;
  shares: string;
  ethYeeterSingleton: string;
  erc20YeeterSingleton: string;
};

type Ownable = {
  owner: string;
};

export const deploymentConfig: { [key: string]: Contracts & Ownable } = {
  "1": {
    // mainnet
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "",
    erc20YeeterSingleton: "",
  },
  "100": {
    // gnosis
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "0x4b0f17aF019E54031Ca1Ad14bDdd3F4C1ea22F05",
    erc20YeeterSingleton: "0x8276C2f7852649e5eD5Dda3A2b88772c8f71F231",
  },
  "137": {
    // polygon
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "",
    erc20YeeterSingleton: "",
  },
  "42161": {
    // arbitrum
    baalSummoner: "0xb08Cc8C343cF6dC20d8cf51Fb2D6C436c6390dAa",
    bvSummoner: "0xC39E8D4DE75c6aC025a0C07dCd8Aeb0728C5DBF1",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "0x97d7753882f8bab3e96efd9a8a17ca1c769cd7cc",
    erc20YeeterSingleton: "0xF19DB47F7cCA0c3Aa501Ce61C158cbaE1830a3E7",
  },
  "10": {
    // optimism
    baalSummoner: "0x3E0eAdE343Ddc556a6Cf0f858e4f685ba303ce71",
    bvSummoner: "0xb04111e7b4576164145EF97EB81fd43DA0F2D675",
    btSummoner: "0x84561C97156a128662B62952890469214FDC87bf",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "0x21E2d492d367780Ab736bD0600164AC3D5D20bD2",
    erc20YeeterSingleton: "0xF19DB47F7cCA0c3Aa501Ce61C158cbaE1830a3E7",
  },
  "5": {
    // goerli
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0xb0c5c96c3d21c1d58B98a5366dF0Af7AfcD94F95",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "",
    erc20YeeterSingleton: "",
  },
  "11155111": {
    // sepolia
    baalSummoner: "0xB2B3909661552942AE1115E9Fc99dF0BC93d71d0",
    bvSummoner: "0x763f5c2E59f997A6cC48Bf1228aBf61325244702",
    btSummoner: "0xD69e5B8F6FA0E5d94B93848700655A78DF24e387",
    shares: "0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6",
    owner: "",
    ethYeeterSingleton: "0xDEdF14E5d3B29411801cBF80a8b1939D2E45f58c",
    erc20YeeterSingleton: "0x80580AcA282E866410266D249B34aa421d460E92",
  },
  "8453": {
    // base
    baalSummoner: "0x22e0382194AC1e9929E023bBC2fD2BA6b778E098",
    bvSummoner: "0x2eF2fC8a18A914818169eFa183db480d31a90c5D",
    btSummoner: "0x97Aaa5be8B38795245f1c38A883B44cccdfB3E11",
    shares: "0xc650B598b095613cCddF0f49570FfA475175A5D5",
    ethYeeterSingleton: "0xBAb498fB934fE1661Bb707DFF1730BaE12a1a691",
    erc20YeeterSingleton: "0x97d7753882f8bAb3E96EFD9a8a17CA1C769Cd7cC",
    owner: "",
  },
  "80001": {
    // mumbai
    baalSummoner: "",
    bvSummoner: "",
    btSummoner: "",
    shares: "",
    owner: "",
    ethYeeterSingleton: "",
    erc20YeeterSingleton: "",
  },
  "420": {
    // optimismGoerli
    baalSummoner: "",
    bvSummoner: "",
    btSummoner: "",
    shares: "",
    owner: "",
    ethYeeterSingleton: "",
    erc20YeeterSingleton: "",
  },
  "421613": {
    // arbitrumGoerli
    baalSummoner: "",
    bvSummoner: "",
    btSummoner: "",
    shares: "",
    owner: "",
    ethYeeterSingleton: "",
    erc20YeeterSingleton: "",
  },
};
