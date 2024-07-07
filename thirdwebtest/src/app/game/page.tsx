'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

// Dichiara createUnityInstance come variabile globale se non è importata
declare const createUnityInstance: any;

// Dichiara initializeThirdweb come funzione globale
declare global {
  interface Window {
    initializeThirdweb: (unityInstance: any) => void;
  }
}

export default function GamesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasLoadedGame, setHasLoadedGame] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!hasLoadedGame) {
        setIsMobile(window.innerWidth <= 990);
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [hasLoadedGame]);

  const { unityProvider, isLoaded, loadingProgression, error } = useUnityContext({
    loaderUrl: '/unity/Build/TestWebGL.loader.js',
    dataUrl: '/unity/Build/TestWebGL.data',
    frameworkUrl: '/unity/Build/TestWebGL.framework.js',
    codeUrl: '/unity/Build/TestWebGL.wasm',
  });

  useEffect(() => {
    if (isLoaded) {
      setHasLoadedGame(true);
      setIsMobile(false);

      // Load the Thirdweb script dynamically
      const script = document.createElement('script');
      script.src = '/unity/lib/thirdweb-unity-bridge.js';
      script.onload = () => {
        if (typeof window !== 'undefined') {
          const canvas = document.getElementById('unityCanvas');
          const config = {
            dataUrl: '/unity/Build/TestWebGL.data',
            frameworkUrl: '/unity/Build/TestWebGL.framework.js',
            codeUrl: '/unity/Build/TestWebGL.wasm',
          };
          const spinner = document.getElementById('spinner');
          const progressBarEmpty = document.getElementById('progressBarEmpty');
          const progressBarFull = document.getElementById('progressBarFull');
          const loadingCover = document.getElementById('loadingCover');
          const fullscreenButton = document.getElementById('fullscreenButton');
          const canFullscreen = typeof fullscreenButton !== 'undefined';
          const hideFullScreenButton = false;

          if (spinner && progressBarEmpty && progressBarFull && loadingCover && canvas) {
            createUnityInstance(canvas, config, (progress: number) => {
              spinner.style.display = "none";
              progressBarEmpty.style.display = "";
              progressBarFull.style.width = `${100 * progress}%`;
            }).then((unityInstance: any) => {
              loadingCover.style.display = "none";
              if (canFullscreen && fullscreenButton) {
                if (!hideFullScreenButton) {
                  fullscreenButton.style.display = "";
                }
                fullscreenButton.onclick = () => {
                  unityInstance.SetFullscreen(1);
                };
              }
              if (typeof window.initializeThirdweb === 'function') {
                window.initializeThirdweb(unityInstance);
              }
            }).catch((message: any) => {
              alert(message);
            });
          }
        }
      };
      document.body.appendChild(script);
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
          <>
            <div id="spinner">Loading...</div>
            <div id="loadingCover">
              <div id="progressBarEmpty">
                <div id="progressBarFull"></div>
              </div>
            </div>
            <button id="fullscreenButton" style={{ display: 'none' }}>Fullscreen</button>
            <Unity unityProvider={unityProvider} style={{ width: '80vw', height: '80vh', border: 'none' }} />
          </>
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
