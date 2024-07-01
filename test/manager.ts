const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgeOfChronosManager", function () {
    let AgeOfChronosManager, ageOfChronosManager;
    let MockParent, mockRyker, mockLuna, mockAria, mockThaddeus;
    let MockChild, mockChild;
    let owner, contributor, user;
    let rykerTokenId = 1, lunaTokenId = 2, ariaTokenId = 3, thaddeusTokenId = 4;
    let fee = ethers.utils.parseEther("1");

    beforeEach(async function () {
        [owner, contributor, user] = await ethers.getSigners();

        MockParent = await ethers.getContractFactory("MockParent");
        mockRyker = await MockParent.deploy();
        await mockRyker.deployed();
        mockLuna = await MockParent.deploy();
        await mockLuna.deployed();
        mockAria = await MockParent.deploy();
        await mockAria.deployed();
        mockThaddeus = await MockParent.deploy();
        await mockThaddeus.deployed();

        MockChild = await ethers.getContractFactory("MockChild");
        mockChild = await MockChild.deploy();
        await mockChild.deployed();

        AgeOfChronosManager = await ethers.getContractFactory("AgeOfChronosManager");
        ageOfChronosManager = await AgeOfChronosManager.deploy();
        await ageOfChronosManager.deployed();

        await ageOfChronosManager.setRykerCollection(mockRyker.address);
        await ageOfChronosManager.setLunaCollection(mockLuna.address);
        await ageOfChronosManager.setAriaCollection(mockAria.address);
        await ageOfChronosManager.setThaddeusCollection(mockThaddeus.address);
        await ageOfChronosManager.setContributor(contributor.address);
        await ageOfChronosManager.setFee(fee);

        await mockRyker.mint(user.address, rykerTokenId);
        await mockLuna.mint(user.address, lunaTokenId);
        await mockAria.mint(user.address, ariaTokenId);
        await mockThaddeus.mint(user.address, thaddeusTokenId);
    });

    it("should set and get fee", async function () {
        expect(await ageOfChronosManager.getFee()).to.equal(fee);
    });

    it("should allow user to pay fee for tokens", async function () {
        await ageOfChronosManager.connect(user).payFee(rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, { value: fee });

        expect(await ageOfChronosManager.hasTokenPaidFee(rykerTokenId)).to.be.true;
        expect(await ageOfChronosManager.hasTokenPaidFee(lunaTokenId)).to.be.true;
        expect(await ageOfChronosManager.hasTokenPaidFee(ariaTokenId)).to.be.true;
        expect(await ageOfChronosManager.hasTokenPaidFee(thaddeusTokenId)).to.be.true;
    });

    it("should start and end a mission", async function () {
        await ageOfChronosManager.connect(user).payFee(rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, { value: fee });

        await ageOfChronosManager.connect(contributor).startMission(rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId);

        expect(await ageOfChronosManager.isTokenInMission(rykerTokenId)).to.be.true;
        expect(await ageOfChronosManager.isTokenInMission(lunaTokenId)).to.be.true;
        expect(await ageOfChronosManager.isTokenInMission(ariaTokenId)).to.be.true;
        expect(await ageOfChronosManager.isTokenInMission(thaddeusTokenId)).to.be.true;

        await ageOfChronosManager.connect(contributor).endMission(rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, 1);

        expect(await ageOfChronosManager.isTokenInMission(rykerTokenId)).to.be.false;
        expect(await ageOfChronosManager.isTokenInMission(lunaTokenId)).to.be.false;
        expect(await ageOfChronosManager.isTokenInMission(ariaTokenId)).to.be.false;
        expect(await ageOfChronosManager.isTokenInMission(thaddeusTokenId)).to.be.false;
        expect(await mockChild.hasExternalPermission(user.address)).to.be.true;
    });

    it("should allow owner to withdraw fees", async function () {
        await ageOfChronosManager.connect(user).payFee(rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, { value: fee });

        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

        const tx = await ageOfChronosManager.drainFees();
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(fee).sub(gasUsed));
    });

    it("should set and revoke external permission", async function () {
        await mockChild.setExternalPermission(user.address, true);
        expect(await mockChild.hasExternalPermission(user.address)).to.equal(true);
        await mockChild.setExternalPermission(user.address, false);
        expect(await mockChild.hasExternalPermission(user.address)).to.equal(false);
    });
});
