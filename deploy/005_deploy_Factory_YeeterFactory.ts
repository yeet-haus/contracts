import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { deploymentConfig } from "../constants";

const deployFn: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getChainId, deployments, network } = hre;
  const { deployer } = await hre.getNamedAccounts();

  console.log("\nDeploying YeeterFactory on network:", network.name);

  const chainId = await getChainId();

  const addresses = deploymentConfig[chainId];

  console.log("addresses", addresses);

  const factoryDeployed = await deployments.deploy("YeeterFactory", {
    contract: "YeeterFactory",
    from: deployer,
    args: [addresses.ethYeeterSingleton, addresses.erc20YeeterSingleton],
    // proxy: {
    //     proxyContract: 'UUPS',
    //     methodName: 'initialize',
    // },
    log: true,
  });
  console.log("YeeterFactory deployment Tx ->", factoryDeployed.transactionHash);
};

export default deployFn;
deployFn.id = "002_deploy_Factory_YeeterFactory"; // id required to prevent reexecution
deployFn.tags = ["YeeterFactory"];
