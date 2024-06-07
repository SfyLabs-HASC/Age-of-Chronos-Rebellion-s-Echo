const { ethers } = require("hardhat");

describe("Parent and Child Equip Integration Test", function () {
    let deployer;
    let Parent, Child;
    let parent, child;

    before(async function () {
        [deployer] = await ethers.getSigners();
        Parent = await ethers.getContractFactory("ParentSample");
        Child = await ethers.getContractFactory("ChildSample");
    });

    beforeEach(async function () {
        // Make sure to use ethers.constants.MaxUint256
        parent = await Parent.deploy(
            "ipfs://QmdobALccC5sUCw8CqYPdCKxDoe1AQDt5zQst9SbrWs1hF",
            ethers.constants.MaxUint256,
            deployer.address,
            1000
        );

        child = await Child.deploy(
            "ipfs://QmZgCkTWywYRVEVBUAUMcwEcKr7vrNgrHqNuJMMcz8YYCp",
            ethers.constants.MaxUint256,
            deployer.address,
            1000
        );
    });

    it("Should deploy, configure, and equip child onto parent", async function () {
        let tx = await parent.setAutoAcceptCollection(child.address, true);
        await tx.wait();

        tx = await parent.mint(deployer.address);
        await tx.wait();

        const parentTokenId = 1;  // Assuming first minted token ID is 1
        const assetIds = [1];     // Assuming asset ID for child
        tx = await child.mintWithAssets(deployer.address, assetIds);
        await tx.wait();

        const childTokenId = 1;   // Assuming first minted child token ID is 1
        tx = await child.equip(parentTokenId, childTokenId, assetIds[0]);
        await tx.wait();

        const isEquipped = await child.isChildEquipped(parentTokenId, child.address, childTokenId);
        expect(isEquipped).to.be.true;
    });
});
