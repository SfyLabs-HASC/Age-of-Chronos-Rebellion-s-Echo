'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { MintAria, MintLuna, MintRyker, MintThaddeus } from '../writeTransactionsUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import moment from 'moment';
import Link from 'next/link';

interface Config {
  du_ryker: string;
  du_luna: string;
  du_aria: string;
  du_thaddeus: string;
  nftsUrl: string;
}

export default function MintPage() {
  const [isMinted, setIsMinted] = useState({
    Ryker: false,
    Luna: false,
    Aria: false,
    Thaddeus: false
  });
  const [config, setConfig] = useState<Config | null>(null);
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  const handleMintedStatus = (player: string, status: boolean) => {
    setIsMinted(prevState => ({
      ...prevState,
      [player]: status
    }));
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const player = e.currentTarget.closest('.player');
    if (player) {
      const backImage = player.querySelector('.back') as HTMLElement;
      if (backImage) {
        backImage.style.opacity = '1';
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const player = e.currentTarget.closest('.player');
    if (player) {
      const backImage = player.querySelector('.back') as HTMLElement;
      if (backImage) {
        backImage.style.opacity = '0';
      }
    }
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  const isMoonbeamNetwork = activeChain?.id === 1284; // ID di Moonbeam

  return (
    <main className="main">
      <section id="inside">
        <a href="/">
          <header className="pt-3 py-lg-5 ">
            <Image src="/img/logo-main-aoc.webp" alt="Logo" width={142} height={100} />
          </header>
        </a>
        <div className="container-fluid main-container py-3 pb-lg-3">
          <div className="row align-items-center">
            <div className="col-12 col-lg-4">
              <span className="leftbar"></span>
            </div>
            <div className="col-12 col-lg-4">
              <h1 className="text-center turret-road-bold mainTitleSec">BUILD YOUR ECHO FORCE</h1>
            </div>
            <div className="col-12 col-lg-4">
              <span className="rightbar"></span>
            </div>
          </div>
        </div>

        <div className="container-fluid main-container">
          <div className="row align-items-center mobrow">
            <div className={`col-12 col-lg-3 player red ${isMinted.Ryker ? 'hasMinted' : 'noMint'}`}>
              <span className="name turret-road-bold">RYKER BLADE</span>
              <div className="wrap_images">
                <img src="/img/raiker_blade_off.webp" className="img-responsive front" alt="Ryker Blade Off" />
                <img src="/img/raiker_blade.webp" className="img-responsive back" alt="Ryker Blade" />
              </div>
              <div className="">
                <span className="prev_player" style={{ opacity: 0 }}></span>
                {moment().isAfter(config.du_ryker) ? (
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <MintRyker onMinted={(status) => handleMintedStatus('Ryker', status)} />
                  </div>
                ) : (
                  <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="hex_button">AVAILABLE { moment().to(config.du_ryker) }</span>
                )}
                <span className="next_player"></span>
              </div>
            </div>
            <div className={`col-12 col-lg-3 player yellow ${isMinted.Luna ? 'hasMinted' : 'noMint'}`}>
              <span className="name turret-road-bold">LUNA STRONGHOLD</span>
              <div className="wrap_images">
                <img src="/img/luna_stronghold_off.webp" className="img-responsive front" alt="Luna Stronghold Off" />
                <img src="/img/luna_stronghold.webp" className="img-responsive back" alt="Luna Stronghold" />
              </div>
              <div className="">
                <span className="prev_player"></span>
                {moment().isAfter(config.du_luna) ? (
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <MintLuna onMinted={(status) => handleMintedStatus('Luna', status)} />
                  </div>
                ) : (
                  <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="hex_button">AVAILABLE { moment().to(config.du_luna) }</span>
                )}
                <span className="next_player"></span>
              </div>
            </div>
            <div className={`col-12 col-lg-3 player violet ${isMinted.Aria ? 'hasMinted' : 'noMint'}`}>
              <span className="name turret-road-bold">ARIA ZEPHYRION</span>
              <div className="wrap_images">
                <img src="/img/aria_zephyrion_off.webp" className="img-responsive front" alt="Aria Zephyrion Off" />
                <img src="/img/aria_zephyrion.webp" className="img-responsive back" alt="Aria Zephyrion" />
              </div>
              <div className="">
                <span className="prev_player"></span>
                {moment().isAfter(config.du_aria) ? (
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <MintAria onMinted={(status) => handleMintedStatus('Aria', status)} />
                  </div>
                ) : (
                  <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="hex_button">AVAILABLE { moment().to(config.du_aria) }</span>
                )}
                <span className="next_player"></span>
              </div>
            </div>
            <div className={`col-12 col-lg-3 player green ${isMinted.Thaddeus ? 'hasMinted' : 'noMint'}`}>
              <span className="name turret-road-bold">THADDEUS LUCKSTRIDE</span>
              <div className="wrap_images">
                <img src="/img/taddeus_luckstride_off.webp" className="img-responsive front" alt="Thaddeus Luckstraid Off" />
                <img src="/img/taddeus_luckstride.webp" className="img-responsive back" alt="Thaddeus Luckstraid" />
              </div>
              <div className="">
                <span className="prev_player"></span>
                {moment().isAfter(config.du_thaddeus) ? (
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <MintThaddeus onMinted={(status) => handleMintedStatus('Thaddeus', status)} />
                  </div>
                ) : (
                  <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="hex_button">AVAILABLE { moment().to(config.du_thaddeus) }</span>
                )}
                <span className="next_player" style={{ opacity: 0 }}></span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              {account && ( isMinted.Ryker || isMinted.Aria || isMinted.Luna || isMinted.Thaddeus ) ? (
                <a className="hex_button" target="_blank" href={`${config.nftsUrl}${account.address}/nfts/owned?tab=owned&isVerified=false&showPending=true&hideRelated=false&sortBy=minted_at:desc&page=1`}>VIEW YOUR NTFs</a>
              ) : null}
              <div className="aoc_panel">
                <p>AGE OF CHRONOS is a web-based dungeon crawler, find artifacts and unlock the potential of NFTs 2.0.<br /><span>the mint is FREe.</span><br />To play, you must have all 4 characters, you can claim 1 NFT for each character type.<br /><span>The game is coming soon.</span></p>
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
            <ul className="brandList  d-flex flex-row justify-content-center m-0 mt-2 mb-3 p-0">
              <li>
                <Image src="/img/svg/moonbeam.svg" alt="Moonbeam" width={80} height={30} />
              </li>
              <li>
                <Image src="/img/svg/polkadot.svg" alt="Moonbeam" width={80} height={30} />
              </li>
              <li>
                <Image src="/img/svg/rmrk.svg" alt="Moonbeam" width={80} height={30} />
              </li>
            </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
