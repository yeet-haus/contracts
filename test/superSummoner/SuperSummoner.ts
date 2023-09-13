import { ethers, getNamedAccounts } from "hardhat";
import { baalSetup, NewBaalParams, setupUsersDefault, SetupUsersParams, SHAMAN_PERMISSIONS } from "@daohaus/baal-contracts";

import { shouldSummonASuperBaal } from "./SuperSummoner.behavior";
import { encodeMockShamanParams, summonBaal } from "./SuperSummoner.fixture";
import { SimpleEthOnboarderShaman, SuperSummoner } from "../../types";

describe("SuperSummoner", function () {

  describe("Summoner", function () {

    let shamanAddress = '';
    let sidecarVault = '';

    beforeEach(async function () {
      const { deployer } = await getNamedAccounts();
      const {
        Baal,
        Loot,
        Shares,
        MultiSend,
        DAI,
        signers
      } = await baalSetup({
        fixtureTags: ['BaalAndVaultSummoner', 'SuperSummoner', 'FixedLoot', 'Mocks'],
        setupBaalOverride: async (params: NewBaalParams) => {
          console.log('OVERRIDE baal setup ******');
          const superSummoner = (await ethers.getContract('SuperSummoner') as SuperSummoner);
          const fixedTokenSingletonAddress = (await ethers.getContract('FixedLoot')).address;
          const mockShamanSingleton = (await ethers.getContract('SimpleEthOnboarderShaman', deployer) as SimpleEthOnboarderShaman);
          const {
            baalSingleton,
            poster,
            config,
            adminConfig,
            safeAddress,
            forwarderAddress,
            saltNonceOverride,
          } = params;
          const newBaalAddresses = await summonBaal({
            summoner: superSummoner,
            baalSingleton,
            poster,
            config,
            adminConfig,
            shamans: undefined,
            safeAddress,
            forwarderAddress,
            saltNonceOverride,
            lootConfig: {
              name: "Fixed Loot",
              symbol: "FLOOT",
              supply: ethers.utils.parseEther("1000000"),
              singletonAddress: fixedTokenSingletonAddress,
            },
            sharesConfig: {
              name: "Fixed Shares",
              symbol: "FSHARES",
              supply: ethers.utils.parseEther("1000000"),
              singletonAddress: fixedTokenSingletonAddress,
            },
            shamanConfig: {
              permissions: SHAMAN_PERMISSIONS.MANAGER,
              setupParams: encodeMockShamanParams(),
              singletonAddress: mockShamanSingleton.address,
            }
          });
          shamanAddress = newBaalAddresses.shaman;
          sidecarVault = newBaalAddresses.sidecarVault;
          return newBaalAddresses;
        },
        setupUsersOverride: async (params: SetupUsersParams) => {
          console.log('OVERRIDE Users setup ******', params.addresses);
          return setupUsersDefault(params);
        },
      });

      this.baal = Baal;
      this.loot = Loot;
      this.shares = Shares;
      this.multisend = MultiSend;
      this.dai = DAI;
      this.users = signers;
      this.shaman = (await ethers.getContractAt('SimpleEthOnboarderShaman', shamanAddress, deployer) as SimpleEthOnboarderShaman);
      this.sidecarVaultAddress = sidecarVault;
    });

    shouldSummonASuperBaal();
  });
});
