import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function deployAllContracts() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy Parent Contracts
    const TimeSquadAria = await ethers.getContractFactory('TimeSquadAria');
    const timeSquadAria = await TimeSquadAria.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadAria.waitForDeployment();

    const TimeSquadLuna = await ethers.getContractFactory('TimeSquadLuna');
    const timeSquadLuna = await TimeSquadLuna.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadLuna.waitForDeployment();

    const TimeSquadRyker = await ethers.getContractFactory('TimeSquadRyker');
    const timeSquadRyker = await TimeSquadRyker.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadRyker.waitForDeployment();

    const TimeSquadThaddeus = await ethers.getContractFactory('TimeSquadThaddeus');
    const timeSquadThaddeus = await TimeSquadThaddeus.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadThaddeus.waitForDeployment();

    // Deploy Child Contracts
    const AriaBody = await ethers.getContractFactory('AriaBody');
    const ariaBody = await AriaBody.deploy('metadata', 1000, owner.address, 500);
    await ariaBody.waitForDeployment();

    const AriaHead = await ethers.getContractFactory('AriaHead');
    const ariaHead = await AriaHead.deploy('metadata', 1000, owner.address, 500);
    await ariaHead.waitForDeployment();

    const AriaLeftHand = await ethers.getContractFactory('AriaLeftHand');
    const ariaLeftHand = await AriaLeftHand.deploy('metadata', 1000, owner.address, 500);
    await ariaLeftHand.waitForDeployment();

    const AriaRightHand = await ethers.getContractFactory('AriaRightHand');
    const ariaRightHand = await AriaRightHand.deploy('metadata', 1000, owner.address, 500);
    await ariaRightHand.waitForDeployment();

    // Deploy Manager Contract
    const AgeOfChronosManager = await ethers.getContractFactory('AgeOfChronosManager');
    const manager = await AgeOfChronosManager.deploy();
    await manager.waitForDeployment();

    return { owner, addr1, addr2, timeSquadAria, timeSquadLuna, timeSquadRyker, timeSquadThaddeus, ariaBody, ariaHead, ariaLeftHand, ariaRightHand, manager };
}

describe('General Tests', function () {
    let owner: { address: any; }, addr1: { address: any; }, addr2: { address: any; };
    let timeSquadAria: any, timeSquadLuna: any, timeSquadRyker: any, timeSquadThaddeus: any;
    let ariaBody: any, ariaHead: any, ariaLeftHand: any, ariaRightHand: any;
    let manager: any;

    beforeEach(async function () {
        ({ owner, addr1, addr2, timeSquadAria, timeSquadLuna, timeSquadRyker, timeSquadThaddeus, ariaBody, ariaHead, ariaLeftHand, ariaRightHand, manager } = await loadFixture(deployAllContracts));
    });

    describe('Deployment', function () {
        it('Should deploy all contracts correctly', async function () {
            expect(await timeSquadAria.owner()).to.equal(owner.address);
            expect(await timeSquadLuna.owner()).to.equal(owner.address);
            expect(await timeSquadRyker.owner()).to.equal(owner.address);
            expect(await timeSquadThaddeus.owner()).to.equal(owner.address);

            expect(await ariaBody.owner()).to.equal(owner.address);
            expect(await ariaHead.owner()).to.equal(owner.address);
            expect(await ariaLeftHand.owner()).to.equal(owner.address);
            expect(await ariaRightHand.owner()).to.equal(owner.address);

            expect(await manager.owner()).to.equal(owner.address);
        });
    });

    describe('Minting and Permissions', function () {
        it('Should allow the owner to mint parent NFTs', async function () {
            await timeSquadAria.mint(addr1.address);
            expect(await timeSquadAria.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to set external permissions for child contracts', async function () {
            await ariaBody.setExternalPermission(owner.address, true);
            expect(await ariaBody.hasExternalPermission(owner.address)).to.equal(true);
        });

        it('Should allow minting child NFTs with permission', async function () {
            await ariaBody.setExternalPermission(owner.address, true);
            await ariaBody.mintWithAssets(addr1.address, [1]);
            expect(await ariaBody.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should revert minting child NFTs without permission', async function () {
            await expect(ariaBody.mintWithAssets(addr1.address, [1])).to.be.revertedWith("Permission denied");
        });
    });

    describe('Manager Functions', function () {
        it('Should allow the owner to set soulbound state through manager contract', async function () {
            await manager.setSoulbound(1, true, timeSquadAria.address);
            // Check the soulbound state here
        });

        it('Should start and end missions correctly', async function () {
            await manager.startMission([timeSquadAria.address], [1]);
            // Check mission state here

            await manager.endMission([timeSquadAria.address], [1]);
            // Check mission state here
        });

        it('Should allow fee payment and check fee status', async function () {
            await manager.payFee([timeSquadAria.address], [1], { value: ethers.parseEther('0.1') });
            expect(await manager.hasTokenPaidFee(1)).to.be.true;
        });
    });
});
