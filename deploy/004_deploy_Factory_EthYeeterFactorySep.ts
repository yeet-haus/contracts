import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { deploymentConfig } from "../constants";

const deployFn: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getChainId, deployments, network } = hre;
  const { deployer } = await hre.getNamedAccounts();

  console.log("\nDeploying EthYeeterFactorySep on network:", network.name);

  const chainId = await getChainId();

  const addresses = deploymentConfig[chainId];

  console.log("addresses", addresses);

  const factoryDeployed = await deployments.deploy("EthYeeterFactorySep", {
    contract: "EthYeeterFactorySep",
    from: deployer,
    args: [addresses.ethYeeterSingleton],
    // proxy: {
    //     proxyContract: 'UUPS',
    //     methodName: 'initialize',
    // },
    log: true,
  });
  console.log("EthYeeterFactorySep deployment Tx ->", factoryDeployed.transactionHash);
};

export default deployFn;
deployFn.id = "002_deploy_Factory_EthYeeterFactorySep"; // id required to prevent reexecution
deployFn.tags = ["EthYeeterFactorySep"];
