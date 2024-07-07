'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

export default function GamesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasLoadedGame, setHasLoadedGame] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = '/unity/lib/thirdweb-unity-bridge.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!hasLoadedGame) {
        setIsMobile(window.innerWidth <= 990);
      }
    };

    // Check if window is defined to avoid running on server-side
    if (typeof window !== 'undefined') {
      // Set initial value
      handleResize();

      // Add event listener
      window.addEventListener('resize', handleResize);

      // Clean up event listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [hasLoadedGame]);

  const { unityProvider, isLoaded } = useUnityContext({
    loaderUrl: '/unity/Build/TestWebGL.loader.js',
    dataUrl: '/unity/Build/TestWebGL.data',
    frameworkUrl: '/unity/Build/TestWebGL.framework.js',
    codeUrl: '/unity/Build/TestWebGL.wasm',
  });

  useEffect(() => {
    if (isLoaded) {
      setHasLoadedGame(true);
      setIsMobile(false);
    }
  }, [isLoaded]);

  return (
    <section id="home">

      <div className="d-flex flex-column align-items-center homecnt">
        {isMobile ? (
          <div className="d-flex flex-column align-items-center">
            <p style={{ color: 'white', textAlign: 'center', fontSize: '1.5em', margin: '20px' }}>
              You cannot play AGE OF CHRONOS from a mobile device. The game is only available for desktop browsers.
            </p>
            <Link href="/" passHref className="hex_button turret-road-bold me-3">
              Go back to home
            </Link>
          </div>
        ) : (
          <Unity
            unityProvider={unityProvider}
            style={{ width: '80vw', height: '80vh', border: 'none' }}
          />
        )}

        <ul className="socialLink d-flex flex-row justify-content-center m-0 p-0">
          <li>
            <Link href="https://hub.xyz/sfy-labs">
              <FontAwesomeIcon icon={faLink} />
            </Link>
          </li>
          <li>
            <Link href="https://x.com/SFY_Labs">
              <FontAwesomeIcon icon={faXTwitter} />
            </Link>
          </li>
        </ul>
        <ul className="brandList d-flex flex-row justify-content-center m-0 mt-5 p-0">
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
  );
}
