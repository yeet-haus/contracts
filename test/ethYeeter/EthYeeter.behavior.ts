import { IBaal, IBaalToken, SHAMAN_PERMISSIONS } from "@daohaus/baal-contracts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { EthYeeter } from "../../types";
import { ethYeeterConfig } from "./EthYeeter.fixture";

export function shouldSummonASuperBaal(): void {
  it("Should have a manager shaman", async function () {
    expect(this.shaman?.address.length).greaterThan(0);
    expect(await (this.baal as IBaal).shamans(this.shaman.address)).to.equal(SHAMAN_PERMISSIONS.MANAGER);
  });

  it("Should init", async function () {
    const config = await ethYeeterConfig();
    const safe = await this.baal?.target();
    const shamanVault = await this.shaman?.vault();

    expect(await this.shaman?.isShares()).to.equal(config.isShares);
    expect(await this.shaman?.endTime()).to.equal(config.endTime);
    expect(await this.shaman?.startTime()).to.equal(config.startTime);
    expect(await this.shaman?.minTribute()).to.equal(config.minTribute);
    expect(await this.shaman?.multiplier()).to.equal(config.multiplier);
    expect(shamanVault).to.equal(safe);
  });

  it("Should mint shares to a yeeter", async function () {
    const [s1] = await ethers.getSigners();

    const totalSharesBefore = await (this.shares as IBaalToken).totalSupply();
    const userSharesABefore = await (this.shares as IBaalToken).balanceOf(s1.address);

    const amount = ethers.utils.parseEther("0.1");
    const shamanAsS1 = (await ethers.getContractAt("EthYeeter", this.shaman.address, s1.address)) as EthYeeter;
    await shamanAsS1.contributeEth({ value: amount });

    const totalSharesAfter = await (this.shares as IBaalToken).totalSupply();
    const userSharesAfter = await (this.shares as IBaalToken).balanceOf(s1.address);

    await expect(totalSharesAfter).to.equal(totalSharesBefore.add(ethers.utils.parseEther("10")));
    await expect(userSharesAfter).to.equal(userSharesABefore.add(ethers.utils.parseEther("10")));
  });

  it("Should send fees on yeeting", async function () {
    const [s1] = await ethers.getSigners();
    const config = await ethYeeterConfig();

    const safe = await this.baal?.target();

    const vaultBalanceBefore = await ethers.provider.getBalance(safe);
    const feeDest1BalanceBefore = await ethers.provider.getBalance(config.feeRecipients[0]);
    const feeDest2BalanceBefore = await ethers.provider.getBalance(config.feeRecipients[1]);

    const amount = ethers.utils.parseEther("0.1");
    const shamanAsS1 = (await ethers.getContractAt("EthYeeter", this.shaman.address, s1.address)) as EthYeeter;
    await shamanAsS1.contributeEth({ value: amount });

    const vaultBalanceAfter = await ethers.provider.getBalance(safe);
    const feeDest1BalanceAfter = await ethers.provider.getBalance(config.feeRecipients[0]);
    const feeDest2BalanceAfter = await ethers.provider.getBalance(config.feeRecipients[1]);

    await expect(vaultBalanceAfter).greaterThan(vaultBalanceBefore);
    await expect(feeDest1BalanceAfter).greaterThan(feeDest1BalanceBefore);
    await expect(feeDest2BalanceAfter).greaterThan(feeDest2BalanceBefore);

    expect(feeDest1BalanceAfter).to.equal(feeDest1BalanceBefore.add(amount.div(1e6).mul(config.feeAmounts[0])));
    expect(feeDest2BalanceAfter).to.equal(feeDest2BalanceBefore.add(amount.div(1e6).mul(config.feeAmounts[1])));
  });

  it.only("Should require a minimum tribute", async function () {
    const [s1] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("0.001");
    const shamanAsS1 = (await ethers.getContractAt("EthYeeter", this.shaman.address, s1.address)) as EthYeeter;
    const yeet = shamanAsS1.contributeEth({ value: amount });

    await expect(yeet).to.be.revertedWith("!minTribute");
  });
}
