'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom_style.css';
import '../globals.css';
import { useEffect } from 'react';
import GetTotalSupply from '../readTransactions';
import { MintAria, MintLuna, MintRyker, MintThaddeus } from '../writeTransactions';

export default function MintPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/custom_scripts.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="main">
      <section id="inside">
        <a href="/">
          <header>
            <img src="/img/logo_aoc.png" className="img-responsive img-center logo_inside" alt="Logo" />
          </header>
        </a>

        <a href="#" className="hex_button turret-road-bold absbutt">PLAY</a>
        <div className="container-fluid main-container">
          <div className="total-supply text-center">
            <h2 className="text-white">Total Supply</h2>
            <GetTotalSupply />
          </div>
          <div className="row align-items-center mobrow">
            <div className="col-12 col-lg-3">
              <div className="player red">
                <span className="name turret-road-bold">RYKER BLADE</span>
                <div className="wrap_images">
                  <img src="/img/raiker_blade_off.webp" className="img-responsive front" alt="Ryker Blade Off" />
                  <img src="/img/raiker_blade.webp" className="img-responsive back" alt="Ryker Blade" />
                </div>
                <div className="interactions">
                  <span className="prev_player" style={{ opacity: 0 }}></span>
                  <MintRyker />
                  <span className="next_player"></span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="player yellow">
                <span className="name turret-road-bold">LUNA STRONGHOLD</span>
                <div className="wrap_images">
                  <img src="/img/luna_stronghold_off.webp" className="img-responsive front" alt="Luna Stronghold Off" />
                  <img src="/img/luna_stronghold.webp" className="img-responsive back backvisible" alt="Luna Stronghold" />
                </div>
                <div className="interactions">
                  <span className="prev_player"></span>
                  <MintLuna />
                  <span className="next_player"></span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="player violet">
                <span className="name turret-road-bold">ARIA ZEPHYRION</span>
                <div className="wrap_images">
                  <img src="/img/aria_zephyrion_off.webp" className="img-responsive front" alt="Aria Zephyrion Off" />
                  <img src="/img/aria_zephyrion.webp" className="img-responsive back" alt="Aria Zephyrion" />
                </div>
                <div className="interactions">
                  <span className="prev_player"></span>
                  <MintAria />
                  <span className="next_player"></span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="player green">
                <span className="name turret-road-bold">THADDEUS LUCKSTRAID</span>
                <div className="wrap_images">
                  <img src="/img/taddeus_luckstride_off.webp" className="img-responsive front" alt="Thaddeus Luckstraid Off" />
                  <img src="/img/taddeus_luckstride.webp" className="img-responsive back" alt="Thaddeus Luckstraid" />
                </div>
                <div className="interactions">
                  <span className="prev_player"></span>
                  <MintThaddeus />
                  <span className="next_player" style={{ opacity: 0 }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
