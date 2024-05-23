export const BASE_URI =
  'ipfs://';

export const CATALOG_METADATA = `${BASE_URI}QmdMrpeSP4a4bEcsFG25FxxskUWz96rPEywb6BFUzmUbLU`;
export const CATALOG_TYPE = `model/gltf-binary`;

export const SLOT_FOR_CHILD_ID = 1000n;
export const FIXED_PART_PARENT_ID = 1n;

export const SLOT_FOR_CHILD_METADATA = `${BASE_URI}QmbApj6iR4navxxNwdq3fFjvsTWZEtq4aXPwUhyYcVywwc`;  //{"name":"Left Hand"}
export const OLD_SLOT_FOR_CHILD_METADATA = `${BASE_URI}QmTbtB9vQTxyEx4FCnEXtvELxcSavt36hrA5ETB3MruWtD`;  //{"name":"Left Hand", "MEDIA:" "DSF"}
export const FIXED_PART_CHILD_METADATA = `${BASE_URI}QmPZXvY6U2buGfKz8wX5KMfjgeqmrP2XKvWfKPnSAi7FKa/1.json`;
export const MINT_ENUMERATE_PARENT = `${BASE_URI}QmPZXvY6U2buGfKz8wX5KMfjgeqmrP2XKvWfKPnSAi7FKa/`; 
export const PARENT_COLLECTION_METADATA = `${BASE_URI}QmdobALccC5sUCw8CqYPdCKxDoe1AQDt5zQst9SbrWs1hF`; 
export const CHILD_COLLECTION_METADATA = `${BASE_URI}QmZgCkTWywYRVEVBUAUMcwEcKr7vrNgrHqNuJMMcz8YYCp`; 


export const PARENT_ASSET_METADATA_URI = `${BASE_URI}QmPZXvY6U2buGfKz8wX5KMfjgeqmrP2XKvWfKPnSAi7FKa/1.json`;
export const CHILD_ASSET_METADATA_URI_1 = `${BASE_URI}QmUfSu5RUku8BU5DQRsPZKLabBCNQ6hzKsHJmMPrYiQHWP`;  //primary asset
export const CHILD_ASSET_METADATA_URI_2 = `${BASE_URI}QmcvH2PKiCAEah4Y2e2A9SwanLHiJKCW6a2yhYyme52iYh`;  //secondary asset

export const PART_TYPE_SLOT = 1n;
export const PART_TYPE_FIXED = 2n;
export const CHILD_EQUIPPABLE_GROUP_ID = SLOT_FOR_CHILD_ID;

export const Z_INDEX_FOR_PARENT = 0n;
export const Z_INDEX_FOR_CHILD = 1n;
