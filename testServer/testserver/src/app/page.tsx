"use client"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'; 
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  return (
    <main>
      <section id="home">
        
        <div className="d-flex flex-column align-items-center homecnt">
          <Image src="/img/logo_aoc.png" alt="Logo" className="img_responsive" width={550} height={453} />      
          <Link href="./testaMissioni" passHref className="hex_button turret-road-bold">
            Testa le missioni
          </Link>                   
        </div> 

        <div>


          
        </div>
        
      </section>
    </main>
  ); 
}
