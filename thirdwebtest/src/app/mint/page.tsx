'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../globals.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { MintAria, MintLuna, MintRyker, MintThaddeus } from '../writeTransactions';

export default function MintPage() {
  const [isMinted, setIsMinted] = useState({
    Ryker: false,
    Luna: false,
    Aria: false,
    Thaddeus: false
  });
  const account = useActiveAccount();

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <MintRyker onMinted={(status: boolean) => handleMintedStatus('Ryker', status)} />
                </div>
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
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <MintLuna onMinted={(status: boolean) => handleMintedStatus('Luna', status)} />
                </div>
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
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <MintAria onMinted={(status: boolean) => handleMintedStatus('Aria', status)} />
                </div>
                <span className="next_player"></span>
              </div>
            </div>
            <div className={`col-12 col-lg-3 player green ${isMinted.Thaddeus ? 'hasMinted' : 'noMint'}`}>
              <span className="name turret-road-bold">THADDEUS LUCKSTRAID</span>
              <div className="wrap_images">
                <img src="/img/taddeus_luckstride_off.webp" className="img-responsive front" alt="Thaddeus Luckstraid Off" />
                <img src="/img/taddeus_luckstride.webp" className="img-responsive back" alt="Thaddeus Luckstraid" />
              </div>
              <div className="">
                <span className="prev_player"></span>
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <MintThaddeus onMinted={(status: boolean) => handleMintedStatus('Thaddeus', status)} />
                </div>

                <span className="next_player" style={{ opacity: 0 }}></span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              {account ? (
                <a className="hex_button" href={`https://singular-rmrk2-git-3d-composer-rmrk-team.vercel.app/space/${account.address}/nfts/owned?tab=owned&isVerified=false&showPending=true&hideRelated=false&sortBy=minted_at:desc&page=1`}>VIEW YOUR NTFs</a>
              ) : null}
              <div className="aoc_panel">
                <p>AGE OF CHRONOS is a web-based dungeon crawler, find artifacts and unlock the potential of NFTs 2.0.<br /><span>the mint is FREe.</span><br />To play, you must have all 4 characters, you can claim 1 NFT for each character type.<br /><span>The game is coming soon.</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
