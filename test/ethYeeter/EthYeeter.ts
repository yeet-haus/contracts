import {
  NewBaalParams,
  SHAMAN_PERMISSIONS,
  SetupUsersParams,
  baalSetup,
  defaultDAOSettings,
  setupUsersDefault,
} from "@daohaus/baal-contracts";
import { ethers, getNamedAccounts, getUnnamedAccounts } from "hardhat";

import { EthYeeter, OnboarderShamanSummoner } from "../../types";
import { shouldSummonASuperBaal } from "./EthYeeter.behavior";
import { encodeMockEthYeeterParams, summonBaal } from "./EthYeeter.fixture";

describe("EthYeeterSummoner", function () {
  describe("Summoner", function () {
    let shamanAddress = "";
    let summoner: OnboarderShamanSummoner;

    beforeEach(async function () {
      const { deployer } = await getNamedAccounts();
      const [s1, s2, s3] = await getUnnamedAccounts();
      const amounts = [
        ethers.utils.parseEther(".000001"),
        ethers.utils.parseEther(".000001"),
        ethers.utils.parseEther(".000001"),
      ];

      const { Baal, Loot, Shares, MultiSend, DAI, signers, helpers } = await baalSetup({
        daoSettings: {
          ...defaultDAOSettings, // You can override dao settings
        },
        fixtureTags: ["OnboarderShamanSummoner", "MocksEthYeeter"],
        setupBaalOverride: async (params: NewBaalParams) => {
          console.log("OVERRIDE baal setup ******");
          const onboarderShamanSummoner = (await ethers.getContract(
            "OnboarderShamanSummoner",
          )) as OnboarderShamanSummoner;
          const lootTokenSingletonAddress = (await ethers.getContract("Loot")).address;
          const sharesTokenSingletonAddress = (await ethers.getContract("Shares")).address;

          const mockShamanSingleton = (await ethers.getContract("EthYeeter", deployer)) as EthYeeter;
          const { baalSingleton, poster, config, adminConfig } = params;
          const newBaalAddresses = await summonBaal({
            summoner: onboarderShamanSummoner,
            baalSingleton,
            poster,
            config,
            adminConfig,
            shamans: undefined,
            lootConfig: {
              name: "Standard Loot",
              symbol: "LOOT",
              singletonAddress: lootTokenSingletonAddress,
              tos: [s1, s2, s3],
              amounts,
            },
            sharesConfig: {
              name: "Standard Shares",
              symbol: "SHARES",
              singletonAddress: sharesTokenSingletonAddress,
              tos: [s1, s2, s3],
              amounts,
            },
            shamanConfig: {
              permissions: [SHAMAN_PERMISSIONS.MANAGER],
              setupParams: [await encodeMockEthYeeterParams()],
              singletonAddress: [mockShamanSingleton.address],
            },
          });
          shamanAddress = newBaalAddresses.shamans[0];
          summoner = onboarderShamanSummoner;
          return newBaalAddresses;
        },
        setupUsersOverride: async (params: SetupUsersParams) => {
          console.log("OVERRIDE Users setup ******", params.addresses);
          return setupUsersDefault(params);
        },
      });

      this.helpers = helpers; // helper functions use the same daoSettings used during setup
      this.baal = Baal;
      this.loot = Loot;
      this.shares = Shares;
      this.summoner = summoner;

      this.multisend = MultiSend;
      this.dai = DAI;
      this.users = signers;
      this.unnamedUsers = [s1, s2, s3];
      this.amounts = amounts;
      this.shaman = (await ethers.getContractAt("EthYeeter", shamanAddress, deployer)) as EthYeeter;
    });

    shouldSummonASuperBaal();
  });
});
