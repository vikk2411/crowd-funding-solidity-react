const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowd Funding contract", () => {
  let CrowdFunding, cf , owner, addr1, addr2, round1;

  beforeEach(async () => {
    CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    cf = await CrowdFunding.deploy();
    [owner, addr1, addr2, _] = await ethers.getSigners();

    cf.createRound(
      "Round 1",
      "This is round 1 description",
      1,
      3600*24*3, // 3 days
      ethers.utils.parseEther("5"),
      "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
    )

    round1 = await cf.idToRound(1);
  });

  describe("deployment", () => {
    it("should set the correct owner", async () => {
      expect(await cf.owner()).to.equal(owner.address);
    });
  });

  describe("creation of rounds", () => {
    it("should create a new round",async () => {
      // console.log("round1", round1)
      expect(round1.roundId).to.equal(1);
      expect(round1.completed).to.equal(false);
      expect(round1.raisedAmt).to.equal(0);
    });
  });

  describe("fund roundes", () => {
    it("should be able to transfer the amounts and complete the round", async () => {
      const amount1 = 2;
      const transfer1Amt = ethers.utils.parseEther(`${amount1}`);
      await cf.connect(addr1).fundRound(round1.roundId, {
        value: transfer1Amt
      })
      let round = await cf.idToRound(1) // reloading the round
      console.log("raised amount => ", round.raisedAmt)
      expect(round.completed).to.equal(false);
      expect(round.raisedAmt).to.equal(transfer1Amt);
      expect(round.contributers).to.equal(1);


      const amount2 = 4;
      const transfer2Amt = ethers.utils.parseEther(`${amount2}`);
      await cf.connect(addr2).fundRound(round1.roundId, {
        value: transfer2Amt
      })
      round = await cf.idToRound(round1.roundId) // reloading the round
      console.log("raised amount => ", round.raisedAmt)
      expect(round.completed).to.equal(true);
      expect(round.raisedAmt).to.equal(ethers.utils.parseEther(`${amount1 + amount2}`));
      expect(round.contributers).to.equal(2);
    })
  })

  describe("fetch rounds", () => {
    it("should give the number of rounds", async () => {
      const rounds = await cf.fetchRounds();
      expect(rounds.length).to.equal(1);
    });
  });
  
})