"use client"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom_style.css';
import './globals.css'; 
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section id="home">
        <Image src="/img/logo_aoc.png" className="logo_main" alt="Logo" width={550} height={550} />
        <div className="d-flex flex-row justify-content-center wrap_buttons">
          <Link href="./mint" passHref className="hex_button turret-road-bold">
            MINT FREE
          </Link>
          <Link href="#" className="hex_button special turret-road-bold">PLAY</Link>
        </div>
      </section>
    </main>
  );
}
