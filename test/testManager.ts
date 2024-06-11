import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function fixtureAgeOfChronosManager() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy mock Parent contract
    const Parent = await ethers.getContractFactory('MockParent');
    const parent = await Parent.deploy();
    await parent.waitForDeployment();

    // Deploy AgeOfChronosManager contract
    const AgeOfChronosManager = await ethers.getContractFactory('AgeOfChronosManager');
    const manager = await AgeOfChronosManager.deploy();
    await manager.waitForDeployment();

    // Add the mock Parent contract to the manager
    await manager.addParentAddress(await parent.getAddress());

    return { manager, parent, owner, addr1, addr2 };
}

describe('AgeOfChronosManager Tests', function () {
    let manager: any;
    let parent: any;
    let owner: { address: any };
    let addr1: { address: any };
    let addr2: { address: any };

    beforeEach(async function () {
        ({ manager, parent, owner, addr1, addr2 } = await loadFixture(fixtureAgeOfChronosManager));
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await manager.owner()).to.equal(owner.address);
        });
    });

    describe('Fee Management', function () {
        it('Should set the fee correctly', async function () {
            const fee = ethers.parseEther('1');
            await manager.setFee(fee);
            expect(await manager.getFee()).to.equal(fee);
        });

        it('Should allow users to pay the fee', async function () {
            const fee = ethers.parseEther('1');
            await manager.setFee(fee);
            await parent.mint(addr1.address, 1);

            await manager.connect(addr1).payFee([parent.address], [1], { value: fee });

            expect(await manager.hasTokenPaidFee(1)).to.equal(true);
        });

        it('Should revert if the fee amount is incorrect', async function () {
            const fee = ethers.parseEther('1');
            await manager.setFee(fee);
            await parent.mint(addr1.address, 1);

            await expect(
                manager.connect(addr1).payFee([parent.address], [1], { value: ethers.parseEther('0.5') })
            ).to.be.revertedWith('Incorrect fee amount');
        });
    });

    describe('Mission Management', function () {
        beforeEach(async function () {
            const fee = ethers.parseEther('1');
            await manager.setFee(fee);
            await parent.mint(addr1.address, 1);
            await parent.mint(addr1.address, 2);
            await manager.connect(addr1).payFee([parent.address, parent.address], [1, 2], { value: fee.mul(2) });
        });

        it('Should start a mission correctly', async function () {
            await manager.startMission([parent.address, parent.address], [1, 2]);

            expect(await parent.isSoulbound(1)).to.equal(true);
            expect(await parent.isSoulbound(2)).to.equal(true);
        });

        it('Should revert if the mission is started too frequently', async function () {
            await manager.startMission([parent.address, parent.address], [1, 2]);

            await expect(
                manager.startMission([parent.address, parent.address], [1, 2])
            ).to.be.revertedWith('Mission cooldown in effect');
        });

        it('Should end a mission correctly', async function () {
            await manager.startMission([parent.address, parent.address], [1, 2]);
            await manager.endMission([parent.address, parent.address], [1, 2]);

            expect(await parent.isSoulbound(1)).to.equal(false);
            expect(await parent.isSoulbound(2)).to.equal(false);
            expect(await manager.hasTokenPaidFee(1)).to.equal(false);
            expect(await manager.hasTokenPaidFee(2)).to.equal(false);
        });
    });

    describe('Ownership Management', function () {
        it('Should transfer ownership correctly', async function () {
            await manager.transferOwnership(addr1.address);
            expect(await manager.owner()).to.equal(addr1.address);
        });

        it('Should revert if non-owner tries to transfer ownership', async function () {
            await expect(manager.connect(addr1).transferOwnership(addr1.address)).to.be.revertedWith('Caller is not the owner');
        });
    });
});
