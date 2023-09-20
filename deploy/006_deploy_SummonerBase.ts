import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { deploymentConfig } from "../constants";

const deployFn: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getChainId, deployments, network } = hre;
  const { deployer } = await hre.getNamedAccounts();

  console.log("\nDeploying OnboarderShamanSummoner factory on network:", network.name);

  const chainId = await getChainId();
  // const _addresses = await getSetupAddresses(chainId, network, deployments);
  const addresses = deploymentConfig[chainId];

  if (network.name !== "hardhat") {
    if (!addresses?.baalSummoner) throw Error("No address found for BaalSummoner");
    console.log(`Re-using contracts on ${network.name}:`);
    console.log("BaalSummoner", addresses.baalSummoner);
  }

  const summonerAddress =
    network.name === "hardhat" ? (await deployments.get("BaalSummoner")).address : addresses.baalSummoner;
  // TODO: this should be retrieved from getSetupAddresses
  const moduleProxyFactoryAddress = 
    network.name === "hardhat"
      ? (await deployments.get("ModuleProxyFactory")).address
      : "0x00000000000DC7F163742Eb4aBEf650037b1f588";

  const hosSummonerDeployed = await deployments.deploy("OnboarderShamanSummoner", {
    contract: "OnboarderShamanSummoner",
    from: deployer,
    args: [],
    proxy: {
      proxyContract: "UUPS",
      execute: {
        methodName: "initialize",
        args: [summonerAddress, moduleProxyFactoryAddress],
      },
    },
    log: true,
  });
  console.log("OnboarderShamanSummoner deployment Tx ->", hosSummonerDeployed.transactionHash);

  const owner = addresses?.owner || deployer;
  console.log("OnboarderShamanSummoner transferOwnership to", owner);
  const txOwnership = await hre.deployments.execute(
    "OnboarderShamanSummoner",
    {
      from: deployer,
    },
    "transferOwnership",
    owner,
  );
  console.log("OnboarderShamanSummoner transferOwnership Tx ->", txOwnership.transactionHash);

  if (network.name !== "hardhat" && owner !== deployer && !addresses?.bvSummoner) {
    console.log("BaalAndVaultSummoner transferOwnership to", owner);
    const tx = await deployments.execute(
      "BaalAndVaultSummoner",
      {
        from: deployer,
      },
      "transferOwnership",
      owner,
    );
    console.log("BaalSummoner transferOwnership Tx ->", tx.transactionHash);
  }
};

export default deployFn;
deployFn.id = "001_deploy_Summoner"; // id required to prevent reexecution
deployFn.tags = ["Factories", "OnboarderShamanSummoner"];
