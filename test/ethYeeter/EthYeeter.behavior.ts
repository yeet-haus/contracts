import { IBaal, IBaalToken, SHAMAN_PERMISSIONS } from "@daohaus/baal-contracts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ethYeeterConfig } from "./EthYeeter.fixture";

export function shouldSummonASuperBaal(): void {
  it("Should have a manager shaman", async function () {
    expect(this.shaman?.address.length).greaterThan(0);
    expect(await (this.baal as IBaal).shamans(this.shaman.address)).to.equal(SHAMAN_PERMISSIONS.MANAGER);
  });

  it("Should init", async function () {
    const config = await ethYeeterConfig();

    expect(await this.shaman?.isShares()).to.equal(config.isShares);
    expect(await this.shaman?.endTime()).to.equal(config.endTime);
    expect(await this.shaman?.startTime()).to.equal(config.startTime);
    expect(await this.shaman?.minTribute()).to.equal(config.minTribute);
    expect(await this.shaman?.multiplier()).to.equal(config.multiplier);
  });

  it.only("Should mint shares to a yeeter", async function () {
    // const amount = ethers.utils.parseEther("1.0");
    // console.log("this.shaman", this.shaman);
    // await this.shaman?.contribute(1);
    // const user = this.users[0];
    // console.log("user", user);
    // await impersonateAccount(user);
    // const signer = await ethers.getSigner(user);
    // const [s1] = await ethers.getSigners();
    // console.log("s1", s1);
    // await s1.sendTransaction({
    //   to: this.shaman?.address,
    //   method: 'contributeEth',
    //   value: amount, // Sends exactly 1.0 ether
    // });
    // await this.shaman.contributeEth({ value: amount });
  });

  it("Should send fees on yeeting", async function () {});

  it("Should require a minimum tribute", async function () {});
}
