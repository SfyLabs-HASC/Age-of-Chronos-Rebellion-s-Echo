'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import MintChild from '../mintChild';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';


export default function MintPage() {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const isMoonbeamNetwork = activeChain?.id === 1284; // ID di Moonbeam


  return (
    <main className="main">
      <section id="inside">
        <a href="/">
          <header className="pt-3 py-lg-5">
            <Image src="/img/logo-main-aoc.webp" alt="Logo" width={142} height={100} />
          </header>
        </a>
        <div className="container-fluid main-container py-3 pb-lg-3">
          <div className="row align-items-center">
            <div className="col-12 col-lg-4">
              <span className="leftbar"></span>
            </div>
            <div className="col-12 col-lg-4">
              <h1 className="text-center turret-road-bold mainTitleSec">MINT YOUR CHILD NFT</h1>
            </div>
            <div className="col-12 col-lg-4">
              <span className="rightbar"></span>
            </div>
          </div>
        </div>

        <div className="container-fluid main-container">
          <div className="row align-items-center mobrow">
            <div className="col-12 text-center">
              <MintChild />
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              {account ? (
                <a className="hex_button" target="_blank" href={`https://singular.app/space/${account.address}/nfts/owned?tab=owned&isVerified=false&showPending=true&hideRelated=false&sortBy=minted_at:desc&page=1`}>VIEW YOUR NTFs</a>
              ) : null}
              <div className="aoc_panel">
                <p>AGE OF CHRONOS is a web-based dungeon crawler, find artifacts and unlock the potential of NFTs 2.0.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <ul className="socialLink d-flex flex-row justify-content-center m-0 p-0">
                <li>
                  <Link href="https://hub.xyz/sfy-labs">
                    <FontAwesomeIcon icon={faLink} />
                  </Link>
                </li>
                <li>
                  <Link href="https://hub.xyz/sfy-labs">
                    <FontAwesomeIcon icon={faXTwitter} />
                  </Link>
                </li>
              </ul>
              <ul className="brandList d-flex flex-row justify-content-center m-0 mt-2 mb-3 p-0">
                <li>
                  <Image src="/img/svg/moonbeam.svg" alt="Moonbeam" width={80} height={30} />
                </li>
                <li>
                  <Image src="/img/svg/polkadot.svg" alt="Polkadot" width={80} height={30} />
                </li>
                <li>
                  <Image src="/img/svg/rmrk.svg" alt="RMRK" width={80} height={30} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
