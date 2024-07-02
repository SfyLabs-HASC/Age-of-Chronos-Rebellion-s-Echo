import { ethers, run, network } from 'hardhat';
import {
    TimeSquadAria,
    TimeSquadLuna,
    TimeSquadRyker,
    TimeSquadThaddeus,
    AriaBody,
    AriaHead,
    AriaLeftHand,
    AriaRightHand,

    LunaBody,
    LunaHead,
    LunaLeftHand,
    LunaRightHand,

    RykerBody,
    RykerHead,
    RykerLeftHand,
    RykerRightHand,

    ThaddeusBody,
    ThaddeusHead,
    ThaddeusLeftHand,
    ThaddeusRightHand,

    CalculateRecursivelyBalance,
    OLDCalculateRecursivelyBalance,
    RMRKCatalogImpl
} from '../typechain-types';
import { delay, isHardhatNetwork } from './utils';

async function main() {
    const [deployer, addr1, addr2] = await ethers.getSigners();
    console.log('Deployer:', deployer.address);
    console.log('Addr1:', addr1 ? addr1.address : 'undefined');
    console.log('Addr2:', addr2 ? addr2.address : 'undefined');


    const contractParentAddresses: { [key: string]: string } = {
        "Aria": "0x870d7b70d763fbd4cfbd980cee92bed8ea681859",
        "Luna": "0x09c774cbd3b784c5f93f053ba56c11c1c036a3af",
        "Ryker": "0x456Ad22F5F40B183cc5a8E1AD6377d6A317CDB87",
        "Thaddeus": "0x959cdafeee9ecbd5ea7ea6c2d3fcb1595f10e8bd"
    };

    const contractCatalogAddresses: { [key: string]: string } = {
        "Aria": "0xa911E59719EA3356273F0Ae2164E61eE8686873C",
        "Luna": "0x88007b95A8C63289f2282C2396C03779428c525E",
        "Ryker": "0xb69440dcE199C234a19B3E3216ca522ffa1D8b11",
        "Thaddeus": "0xf01b387d6530FF4CA06200e9573b52808C5e7a64"
    };

    const contractItemAddresses = {
        "AriaBody": "0xa911E59719EA3356273F0Ae2164E61eE8686873C",
        "AriaHead": "0xBB12975eAd4b9F44A7D562879c8D5A25c8cEEa20",
        "AriaLeftHand": "0x8e9a4a8b3d2f3f618ad2Bdf809431a06DC500Ac5",
        "AriaRightHand": "0x2667b4B8B05797B002CFb42085555E4485ED608b",

        "LunaBody": "0x88007b95A8C63289f2282C2396C03779428c525E",
        "LunaHead": "0x5C89fBcb12e6b301844B3a849eF4453fF3924e11",
        "LunaLeftHand": "0x218D19C7106D994cB15BEd4BA8b8EC3632971102",
        "LunaRightHand": "0x78c2963D3e78ee06f9D3f42C91F6800de404C2a2",

        "RykerBody": "0xb69440dcE199C234a19B3E3216ca522ffa1D8b11",
        "RykerHead": "0xC13ae85585d81aa6D77b3440C7A273513F70F73F",
        "RykerLeftHand": "0x251bc788bF2f8CF8DF7AdAC16D82A76521b7E448",
        "RykerRightHand": "0xB78180dba14376402EDF0F9B55386A3e9f147026",

        "ThaddeusBody": "0xf01b387d6530FF4CA06200e9573b52808C5e7a64",
        "ThaddeusHead": "0x7d847A8e98405e6AF5749542F0dcA1BAd14B6B3B",
        "ThaddeusLeftHand": "0x1aa3e6D9aF4F082Ef1fde6628340a2456766Ec2a",
        "ThaddeusRightHand": "0x2455E46D0b0AD9EbB4612E0b39b8D4421379C59e"
    };

    const CalculateBalanceContractAddress = "0x76903aE372F55e802b83cD2A885006E7915C99aA";
    const OldCalculateBalanceContractAddress = "0x79506fD8b53c557D498cEdB1761Ed4A1D0593616";


    const TimeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
    const TimeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
    const TimeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
    const TimeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);


    const catalogAria: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Aria, deployer);
    const catalogLuna: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Luna, deployer);
    const catalogRyker: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Ryker, deployer);
    const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);


    const ariaBody: AriaBody = await ethers.getContractAt('AriaBody', contractItemAddresses.AriaBody, deployer);
    const ariaHead: AriaHead = await ethers.getContractAt('AriaHead', contractItemAddresses.AriaHead, deployer);
    const ariaLeftHand: AriaLeftHand = await ethers.getContractAt('AriaLeftHand', contractItemAddresses.AriaLeftHand, deployer);
    const ariaRightHand: AriaRightHand = await ethers.getContractAt('AriaRightHand', contractItemAddresses.AriaRightHand, deployer);

    const lunaBody: LunaBody = await ethers.getContractAt('LunaBody', contractItemAddresses.LunaBody, deployer);
    const lunaHead: LunaHead = await ethers.getContractAt('LunaHead', contractItemAddresses.LunaHead, deployer);
    const lunaLeftHand: LunaLeftHand = await ethers.getContractAt('LunaLeftHand', contractItemAddresses.LunaLeftHand, deployer);
    const lunaRightHand: LunaRightHand = await ethers.getContractAt('LunaRightHand', contractItemAddresses.LunaRightHand, deployer);

    const rykerBody: RykerBody = await ethers.getContractAt('RykerBody', contractItemAddresses.RykerBody, deployer);
    const rykerHead: RykerHead = await ethers.getContractAt('RykerHead', contractItemAddresses.RykerHead, deployer);
    const rykerLeftHand: RykerLeftHand = await ethers.getContractAt('RykerLeftHand', contractItemAddresses.RykerLeftHand, deployer);
    const rykerRightHand: RykerRightHand = await ethers.getContractAt('RykerRightHand', contractItemAddresses.RykerRightHand, deployer);

    const thaddeusBody: ThaddeusBody = await ethers.getContractAt('ThaddeusBody', contractItemAddresses.ThaddeusBody, deployer);
    const thaddeusHead: ThaddeusHead = await ethers.getContractAt('ThaddeusHead', contractItemAddresses.ThaddeusHead, deployer);
    const thaddeusLeftHand: ThaddeusLeftHand = await ethers.getContractAt('ThaddeusLeftHand', contractItemAddresses.ThaddeusLeftHand, deployer);
    const thaddeusRightHand: ThaddeusRightHand = await ethers.getContractAt('ThaddeusRightHand', contractItemAddresses.ThaddeusRightHand, deployer);

    const calculateBalance: CalculateRecursivelyBalance = await ethers.getContractAt('CalculateRecursivelyBalance', CalculateBalanceContractAddress, deployer);
    const OLDcalculateBalance: OLDCalculateRecursivelyBalance = await ethers.getContractAt('OLDCalculateRecursivelyBalance', OldCalculateBalanceContractAddress, deployer);

    console.log('start');

    // Richiama la funzione calculateBalance
    const directOwnerAddress = deployer.address;
    const collectionParentAddresses = Object.values(contractParentAddresses);
    const childAddress = contractItemAddresses.RykerRightHand;

    //setta le parent conllection
    /*
    const tx01 = await calculateBalance.setRykerCollection(await TimeSquadRyker.getAddress());
    const tx02 = await calculateBalance.setLunaCollection(await TimeSquadLuna.getAddress());
    const tx03 = await calculateBalance.setAriaCollection(await TimeSquadAria.getAddress());
    const tx04 = await calculateBalance.setThaddeusCollection(await TimeSquadThaddeus.getAddress());
    await tx01.wait();
    await delay(1000)
    await tx02.wait();
    await delay(1000)
    await tx03.wait();
    await delay(1000)
    await tx04.wait();
    await delay(1000)
    */

    // Calcolo del balance
    const tokenIds = await calculateBalance.calculateBalance(directOwnerAddress, childAddress);
    const totalSupply = await rykerRightHand.totalSupply();
    console.log('totalSupply:', totalSupply);

    // Utilizzo della funzione tokenOfOwnerByIndex in un ciclo for
    for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i];
        console.log('Token ID at index', i.toString(), ':', tokenId.toString());
    }

        // Calcolo del balance OLD
        const OLDtokenIds = await OLDcalculateBalance.calculateBalance(directOwnerAddress, collectionParentAddresses,childAddress);
        const OLDtotalSupply = await rykerRightHand.totalSupply();
        console.log('totalSupply:', totalSupply);
    
        // Utilizzo della funzione tokenOfOwnerByIndex in un ciclo for
        for (let i = 0; i < tokenIds.length; i++) {
            const tokenId = tokenIds[i];
            console.log('Token ID at index', i.toString(), ':', tokenId.toString());
        }

    console.log("fine");


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
