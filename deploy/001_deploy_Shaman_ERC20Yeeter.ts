import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFn: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre;
  const { deployer } = await hre.getNamedAccounts();

  console.log("\nDeploying ERC20Yeeter shaman on network:", network.name);

  const shamanDeployed = await deployments.deploy("ERC20Yeeter", {
    contract: "ERC20Yeeter",
    from: deployer,
    args: [],
    // proxy: {
    //     proxyContract: 'UUPS',
    //     methodName: 'initialize',
    // },
    log: true,
  });
  console.log("ERC20Yeeter deployment Tx ->", shamanDeployed.transactionHash);
};

export default deployFn;
deployFn.id = "001_deploy_Shaman_ERC20Yeeter"; // id required to prevent reexecution
deployFn.tags = ["ShamanERC20Yeeter"];
