"use client"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './globals.css'; 
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  return (
    <main>
      <section id="home">
        
        <div className="d-flex flex-column align-items-center homecnt">
          <Image src="/img/logo_aoc.png" alt="Logo" className="img_responsive" width={550} height={453} />      
          <Link href="./mint" passHref className="hex_button turret-road-bold">
            JOIN THE REBELLION
          </Link>                    
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
          <ul className="brandList  d-flex flex-row justify-content-center m-0 mt-5 p-0">
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
        
      </section>
    </main>
  ); 
}
