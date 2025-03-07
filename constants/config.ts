type Contracts = {
  baalSummoner: string;
  bvSummoner: string;
  btSummoner: string;
  shares: string;
  ethYeeterSingleton: string;
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
  },
  "100": {
    // gnosis
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "0xbe056B4187387D1Cb503370FeA2815e42981DfdF",
  },
  "137": {
    // polygon
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "",
  },
  "42161": {
    // arbitrum
    baalSummoner: "0xb08Cc8C343cF6dC20d8cf51Fb2D6C436c6390dAa",
    bvSummoner: "0xC39E8D4DE75c6aC025a0C07dCd8Aeb0728C5DBF1",
    btSummoner: "0x8a4A9E36106Ee290811B89e06e2faFE913507965",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
  },
  "10": {
    // optimism
    baalSummoner: "0x3E0eAdE343Ddc556a6Cf0f858e4f685ba303ce71",
    bvSummoner: "0xb04111e7b4576164145EF97EB81fd43DA0F2D675",
    btSummoner: "0x84561C97156a128662B62952890469214FDC87bf",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
  },
  "5": {
    // goerli
    baalSummoner: "0x7e988A9db2F8597735fc68D21060Daed948a3e8C",
    bvSummoner: "0x594E630efbe8dbd810c168e3878817a4094bB312",
    btSummoner: "0xb0c5c96c3d21c1d58B98a5366dF0Af7AfcD94F95",
    shares: "0x8124Cbb807A7b64123F3dEc3EF64995d8B10d3Eb",
    owner: "",
    ethYeeterSingleton: "",
  },
  "11155111": {
    // sepolia
    baalSummoner: "0xB2B3909661552942AE1115E9Fc99dF0BC93d71d0",
    bvSummoner: "0x763f5c2E59f997A6cC48Bf1228aBf61325244702",
    btSummoner: "0xD69e5B8F6FA0E5d94B93848700655A78DF24e387",
    shares: "0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6",
    owner: "",
    ethYeeterSingleton: "0x6e714491bB6109900316e70CA5a4324c948C7997",
  },
  "8453": {
    // base
    baalSummoner: "0x22e0382194AC1e9929E023bBC2fD2BA6b778E098",
    bvSummoner: "0x2eF2fC8a18A914818169eFa183db480d31a90c5D",
    btSummoner: "0x97Aaa5be8B38795245f1c38A883B44cccdfB3E11",
    shares: "0xc650B598b095613cCddF0f49570FfA475175A5D5",
    ethYeeterSingleton: "",

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
  },
  "420": {
    // optimismGoerli
    baalSummoner: "",
    bvSummoner: "",
    btSummoner: "",
    shares: "",
    owner: "",
    ethYeeterSingleton: "",
  },
  "421613": {
    // arbitrumGoerli
    baalSummoner: "",
    bvSummoner: "",
    btSummoner: "",
    shares: "",
    owner: "",
    ethYeeterSingleton: "",
  },
};
