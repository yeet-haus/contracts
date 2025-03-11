import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";

import "./tasks/accounts";

// import "./tasks/greet";
// import "./tasks/taskDeploy";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string = process.env.MNEMONIC || "";
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  ganache: 1337,
  hardhat: 31337,
  mainnet: 1,
  goerli: 5,
  sepolia: 11155111,
  gnosis: 100,
  base: 8453,
  "arbitrum-mainnet": 42161,
  "arbitrum-goerli": 421613,
  "optimism-mainnet": 10,
  "optimism-goerli": 420,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
};

const explorerApiKey = (networkName: keyof typeof chainIds) => {
  const fromEnv = () => {
    switch (networkName) {
      case "mainnet":
      case "goerli":
      case "sepolia":
        return process.env.ETHERSCAN_APIKEY;
      case "gnosis":
        return process.env.GNOSISSCAN_APIKEY;
      case "polygon-mainnet":
      case "polygon-mumbai":
        return process.env.POLYGONSCAN_APIKEY;
      case "optimism-mainnet":
      case "optimism-goerli":
        return process.env.OPTIMISTICSCAN_APIKEY;
      case "arbitrum-mainnet":
      case "arbitrum-goerli":
        return process.env.ARBISCAN_APIKEY;
      case "base":
        return process.env.BASESCAN_APIKEY;
      default:
        break;
    }
  };
  return fromEnv() || "";
};

const getNodeURI = (networkName: keyof typeof chainIds) => {
  switch (networkName) {
    case "arbitrum-mainnet":
      // return "https://rpc.ankr.com/arbitrum";
      return "https://1rpc.io/arb";
    case "arbitrum-goerli":
      return "https://goerli-rollup.arbitrum.io/rpc";
    // return "https://arbitrum-goerli.publicnode.com";
    case "optimism-mainnet":
      return "https://rpc.ankr.com/optimism";
    case "optimism-goerli":
      return "https://goerli.optimism.io";
    case "polygon-mainnet":
      return "https://rpc.ankr.com/polygon";
    case "polygon-mumbai":
      return "https://rpc.ankr.com/polygon_mumbai";
    case "gnosis":
      return "https://rpc.gnosischain.com";
    case "base":
      return "https://base.llamarpc.com";
    // return "https://base-pokt.nodies.app";
    default:
      return "https://" + networkName + ".infura.io/v3/" + infuraApiKey;
  }
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  const jsonRpcUrl = getNodeURI(chain);
  return {
    accounts: process.env.ACCOUNT_PK
      ? [process.env.ACCOUNT_PK]
      : {
          count: 10,
          mnemonic,
          path: "m/44'/60'/0'/0",
        },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
    verify: {
      etherscan: {
        apiKey: explorerApiKey(chain),
      },
    },
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true" ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    ganache: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.ganache,
      url: "http://localhost:8545",
    },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    mainnet: getChainConfig("mainnet"),
    goerli: getChainConfig("goerli"),
    sepolia: getChainConfig("sepolia"),
    base: getChainConfig("base"),
    gnosis: getChainConfig("gnosis"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/hardhat-template/issues/31
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  external: {
    contracts: [
      {
        artifacts: "node_modules/@daohaus/baal-contracts/export/artifacts",
        deploy: "node_modules/@daohaus/baal-contracts/export/deploy",
      },
    ],
  },
};

export default config;
