import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function deployManagerContract() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy Manager Contract
    const AgeOfChronosManager = await ethers.getContractFactory('AgeOfChronosManager');
    const manager = await AgeOfChronosManager.deploy();
    await manager.waitForDeployment();

    // Mock Parent Contract for testing
    const MockParent = await ethers.getContractFactory('MockParent');
    const mockParent = await MockParent.deploy();
    await mockParent.waitForDeployment();

    return { owner, addr1, addr2, manager, mockParent };
}

describe('AgeOfChronosManager Contract Tests', function () {
    let owner: { address: any; }, addr1: { address: any; }, addr2: { address: any; };
    let manager: any, mockParent: any;

    beforeEach(async function () {
        ({ owner, addr1, addr2, manager, mockParent } = await loadFixture(deployManagerContract));
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await manager.owner()).to.equal(owner.address);
        });
    });

    describe('Fee Management', function () {
        it('Should set and get the fee correctly', async function () {
            await manager.setFee(ethers.parseEther('0.1'));
            expect(await manager.getFee()).to.equal(ethers.parseEther('0.1'));
        });

        it('Should allow fee payment and update the status correctly', async function () {
            await manager.setFee(ethers.parseEther('0.1'));
            await manager.payFee([mockParent.address], [1], { value: ethers.parseEther('0.1') });
            expect(await manager.hasTokenPaidFee(1)).to.be.true;
        });

        it('Should revert fee payment if the amount is incorrect', async function () {
            await manager.setFee(ethers.parseEther('0.1'));
            await expect(manager.payFee([mockParent.address], [1], { value: ethers.parseEther('0.05') })).to.be.revertedWith("Incorrect fee amount");
        });

        it('Should revert fee payment if the caller is not the token owner', async function () {
            await manager.setFee(ethers.parseEther('0.1'));
            await expect(manager.connect(addr1).payFee([mockParent.address], [1], { value: ethers.parseEther('0.1') })).to.be.revertedWith("Caller does not own the token");
        });

        it('Should allow the owner to manually set fee payment status', async function () {
            await manager.setFeePaymentStatus(1, true);
            expect(await manager.hasTokenPaidFee(1)).to.be.true;
        });
    });

    describe('Parent Address Management', function () {
        it('Should allow the owner to add and remove parent addresses', async function () {
            await manager.addParentAddress(mockParent.address);
            let parents = await manager.getParentAddresses();
            expect(parents).to.include(mockParent.address);

            await manager.removeParentAddress(mockParent.address);
            parents = await manager.getParentAddresses();
            expect(parents).to.not.include(mockParent.address);
        });
    });

    describe('Soulbound Management', function () {
        beforeEach(async function () {
            await manager.addParentAddress(mockParent.address);
            await mockParent.mint(addr1.address, 1); // Mock mint a token
        });

        it('Should allow the owner to set soulbound state for a token', async function () {
            await manager.setSoulbound(1, true, mockParent.address);
            expect(await mockParent.isSoulbound(1)).to.be.true;

            await manager.setSoulbound(1, false, mockParent.address);
            expect(await mockParent.isSoulbound(1)).to.be.false;
        });

        it('Should allow the owner to bulk set soulbound state for tokens', async function () {
            await mockParent.mint(addr1.address, 2); // Mint another token
            await manager.bulkSoulbound(1, 2, true, mockParent.address);
            expect(await mockParent.isSoulbound(1)).to.be.true;
            expect(await mockParent.isSoulbound(2)).to.be.true;

            await manager.bulkSoulbound(1, 2, false, mockParent.address);
            expect(await mockParent.isSoulbound(1)).to.be.false;
            expect(await mockParent.isSoulbound(2)).to.be.false;
        });
    });

    describe('Mission Management', function () {
        beforeEach(async function () {
            await manager.addParentAddress(mockParent.address);
            await mockParent.mint(addr1.address, 1); // Mock mint a token
            await manager.setFee(ethers.parseEther('0.1'));
            await manager.payFee([mockParent.address], [1], { value: ethers.parseEther('0.1') });
        });

        it('Should allow the owner to start and end missions correctly', async function () {
            await manager.startMission([mockParent.address], [1]);
            expect(await manager.isAddressInMission(mockParent.address)).to.be.true;
            expect(await mockParent.isSoulbound(1)).to.be.true;

            await manager.endMission([mockParent.address], [1]);
            expect(await manager.isAddressInMission(mockParent.address)).to.be.false;
            expect(await mockParent.isSoulbound(1)).to.be.false;
        });

        it('Should enforce mission cooldown', async function () {
            await manager.startMission([mockParent.address], [1]);
            await expect(manager.startMission([mockParent.address], [1])).to.be.revertedWith("Mission cooldown in effect");
        });

        it('Should revert starting a mission if the fee is not paid', async function () {
            await mockParent.mint(addr1.address, 2); // Mint another token
            await expect(manager.startMission([mockParent.address], [2])).to.be.revertedWith("Token has not paid the fee");
        });

        it('Should reset fee payment status after ending a mission', async function () {
            await manager.startMission([mockParent.address], [1]);
            await manager.endMission([mockParent.address], [1]);
            expect(await manager.hasTokenPaidFee(1)).to.be.false;
        });
    });

    describe('Ownership Management', function () {
        it('Should transfer ownership correctly', async function () {
            await manager.transferOwnership(addr1.address);
            expect(await manager.owner()).to.equal(addr1.address);
        });

        it('Should revert ownership transfer if the new owner is zero address', async function () {
            await expect(manager.transferOwnership(ethers.AddressZero)).to.be.revertedWith("Invalid new owner address");
        });
    });
});
