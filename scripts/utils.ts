import { ethers, network } from 'hardhat';
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
  AgeOfChronosManager,
  RMRKCatalogImpl,
} from '../typechain-types';

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isHardhatNetwork(): boolean {
  return ['hardhat', 'localhost'].includes(network.name);
}

export async function getDeployedContracts(): Promise<{
  timeSquadAria: TimeSquadAria;
  ariaBody: AriaBody;
  ariaHead: AriaHead;
  ariaLeftHand: AriaLeftHand;
  ariaRightHand: AriaRightHand;
  timeSquadLuna: TimeSquadLuna;
  lunaBody: LunaBody;
  lunaHead: LunaHead;
  lunaLeftHand: LunaLeftHand;
  lunaRightHand: LunaRightHand;
  timeSquadRyker: TimeSquadRyker;
  rykerBody: RykerBody;
  rykerHead: RykerHead;
  rykerLeftHand: RykerLeftHand;
  rykerRightHand: RykerRightHand;
  timeSquadThaddeus: TimeSquadThaddeus;
  thaddeusBody: ThaddeusBody;
  thaddeusHead: ThaddeusHead;
  thaddeusLeftHand: ThaddeusLeftHand;
  thaddeusRightHand: ThaddeusRightHand;
}> {
  const contractParentAddresses: { [key: string]: string } = {
    Aria: '0xf6F0130799de29cf1A402290766a1C9c95B6d017',
    Luna: '0xe429fb9fD5dcFe9B148f0E6FF922C8A6d12B4f53',
    Ryker: '0x972009B42a51CaCd43e059a2C56e92541EF2Bc2f',
    Thaddeus: '0xE7AeB43Ed1dE5D357F190847830b2a9f31E0C032',
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    Aria: '0xA9390e1009aBC0B3fA9cDfcCaC379CF15DecA3F6',
    Luna: '0xCb7aE692aa7C042715FCA463789F1aC91924a2CA',
    Ryker: '0x6ad1c0226f5ecc90e109b57c75af3Db7b5ad74aC',
    Thaddeus: '0xDDc1Da0373fd9494a6d599E7520543953BA94672',
  };

  const contractItemAddresses = {
    AriaBody: '0x225f647344418AD2FaBf4282649bd045656870Dc',
    AriaHead: '0xFd2694a26127A34DeF6Eddb04760102821ca2dd9',
    AriaLeftHand: '0x9Ea72623340C7420f5cAb670e7a77Cca879ED9bD',
    AriaRightHand: '0xfF1923f1Ae0601bD962FD2eE4Ad6B285dF668e0d',

    LunaBody: '0xBA88F7834D9D3f350222b78b4046c0f12B00d980',
    LunaHead: '0xC24f2A9263b9F86680C4F56F2B83E9fFA1ccdc9b',
    LunaLeftHand: '0x1F88d1694372BE1cAe8037888A2A2c22E949bb7d',
    LunaRightHand: '0x1d67c78882e2dba65659958d1Db09566E5aaf2aC',

    RykerBody: '0xc6d66e35DF2f3150056DcC7D2c5d2BA4e719c054',
    RykerHead: '0x903eEaC60a50f5f459E5Fa5bF87C5BB0552cF8F0',
    RykerLeftHand: '0xbCfc42003bC3eFC7813A355DD514532525dc6b0f',
    RykerRightHand: '0x9dB9312A55550B0F6a5fcaAb31F5fBb9Abfbb3Cb',

    ThaddeusBody: '0xbbE40d2dC88e21B5FF7600239867ea033725b02a',
    ThaddeusHead: '0xC352128862fDE7b6C02edc40D0d8b2F92D472392',
    ThaddeusLeftHand: '0xa7A13411b55daFd9c0Cc69f5bfa21B3d71ca6bb7',
    ThaddeusRightHand: '0x7ea2542c69B768747583D90a41cF35916571c15C',
  };

  const timeSquadAria: TimeSquadAria = await ethers.getContractAt(
    'TimeSquadAria',
    contractParentAddresses.Aria,
  );
  const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt(
    'TimeSquadLuna',
    contractParentAddresses.Luna,
  );
  const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt(
    'TimeSquadRyker',
    contractParentAddresses.Ryker,
  );
  const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt(
    'TimeSquadThaddeus',
    contractParentAddresses.Thaddeus,
  );

  const catalogAria: RMRKCatalogImpl = await ethers.getContractAt(
    'RMRKCatalogImpl',
    contractCatalogAddresses.Aria,
  );
  const catalogLuna: RMRKCatalogImpl = await ethers.getContractAt(
    'RMRKCatalogImpl',
    contractCatalogAddresses.Luna,
  );
  const catalogRyker: RMRKCatalogImpl = await ethers.getContractAt(
    'RMRKCatalogImpl',
    contractCatalogAddresses.Ryker,
  );
  const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt(
    'RMRKCatalogImpl',
    contractCatalogAddresses.Thaddeus,
  );

  const ariaBody: AriaBody = await ethers.getContractAt('AriaBody', contractItemAddresses.AriaBody);
  const ariaHead: AriaHead = await ethers.getContractAt('AriaHead', contractItemAddresses.AriaHead);
  const ariaLeftHand: AriaLeftHand = await ethers.getContractAt(
    'AriaLeftHand',
    contractItemAddresses.AriaLeftHand,
  );
  const ariaRightHand: AriaRightHand = await ethers.getContractAt(
    'AriaRightHand',
    contractItemAddresses.AriaRightHand,
  );

  const lunaBody: LunaBody = await ethers.getContractAt('LunaBody', contractItemAddresses.LunaBody);
  const lunaHead: LunaHead = await ethers.getContractAt('LunaHead', contractItemAddresses.LunaHead);
  const lunaLeftHand: LunaLeftHand = await ethers.getContractAt(
    'LunaLeftHand',
    contractItemAddresses.LunaLeftHand,
  );
  const lunaRightHand: LunaRightHand = await ethers.getContractAt(
    'LunaRightHand',
    contractItemAddresses.LunaRightHand,
  );

  const rykerBody: RykerBody = await ethers.getContractAt(
    'RykerBody',
    contractItemAddresses.RykerBody,
  );
  const rykerHead: RykerHead = await ethers.getContractAt(
    'RykerHead',
    contractItemAddresses.RykerHead,
  );
  const rykerLeftHand: RykerLeftHand = await ethers.getContractAt(
    'RykerLeftHand',
    contractItemAddresses.RykerLeftHand,
  );
  const rykerRightHand: RykerRightHand = await ethers.getContractAt(
    'RykerRightHand',
    contractItemAddresses.RykerRightHand,
  );

  const thaddeusBody: ThaddeusBody = await ethers.getContractAt(
    'ThaddeusBody',
    contractItemAddresses.ThaddeusBody,
  );
  const thaddeusHead: ThaddeusHead = await ethers.getContractAt(
    'ThaddeusHead',
    contractItemAddresses.ThaddeusHead,
  );
  const thaddeusLeftHand: ThaddeusLeftHand = await ethers.getContractAt(
    'ThaddeusLeftHand',
    contractItemAddresses.ThaddeusLeftHand,
  );
  const thaddeusRightHand: ThaddeusRightHand = await ethers.getContractAt(
    'ThaddeusRightHand',
    contractItemAddresses.ThaddeusRightHand,
  );
  return {
    timeSquadAria,
    ariaBody,
    ariaHead,
    ariaLeftHand,
    ariaRightHand,
    timeSquadLuna,
    lunaBody,
    lunaHead,
    lunaLeftHand,
    lunaRightHand,
    timeSquadRyker,
    rykerBody,
    rykerHead,
    rykerLeftHand,
    rykerRightHand,
    timeSquadThaddeus,
    thaddeusBody,
    thaddeusHead,
    thaddeusLeftHand,
    thaddeusRightHand,
  };
}
