import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFn: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre;
  const { deployer } = await hre.getNamedAccounts();

  console.log("deployer", deployer);

  console.log("\nDeploying SplosionsYeeter on network:", network.name);

  const shamanDeployed = await deployments.deploy("SplosionsYeeter", {
    contract: "SplosionsYeeter",
    from: deployer,
    args: [],
    // proxy: {
    //     proxyContract: 'UUPS',
    //     methodName: 'initialize',
    // },
    log: true,
  });
  console.log("SplosionsYeeter deployment Tx ->", shamanDeployed.transactionHash);
};

export default deployFn;
deployFn.id = "009_deploy_Nfts_SplosionsYeeter"; // id required to prevent reexecution
deployFn.tags = ["NftsSplosionsYeeter"];
