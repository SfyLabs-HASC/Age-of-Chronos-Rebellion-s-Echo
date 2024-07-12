'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import { AiOutlineFullscreen } from 'react-icons/ai';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { isMobile } from 'react-device-detect';

export default function GamesPage() {  
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

  const { unityProvider, isLoaded, requestFullscreen, loadingProgression } = useUnityContext({
    loaderUrl: '/unity/Build/unity.loader.js',
    dataUrl: '/unity/Build/unity.data',
    frameworkUrl: '/unity/Build/unity.framework.js',
    codeUrl: '/unity/Build/unity.wasm',
  });

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
          <div className='unity-container'>
            {!isLoaded && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${loadingProgression * 100}%` }}></div>
                <p>Loading... {Math.round(loadingProgression * 100)}%</p>
              </div>
            )}
            <div className="unity-wrapper">
              <Unity
                unityProvider={unityProvider}
                style={{ visibility: isLoaded ? "visible" : "hidden", width: '75vw', height: 'calc(75vw * 9 / 16)', border: 'none' }}
              />
              <button key='fullscreen' className='btn btn-info mb-4 rounded-sm fullscreen-button' onClick={() => requestFullscreen(true)}>
                <AiOutlineFullscreen size={32} />
              </button>
            </div>
          </div>
        )}

        <ul className="socialLink d-flex flex-row justify-content-center m-0 p-0 mt-3">
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
        <ul className="brandList d-flex flex-row justify-content-center m-0 mt-3 p-0">
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
      <style jsx>{`
        .unity-container {
          position: relative;
          width: 75vw;
          height: calc(75vw * 9 / 16); /* Maintain 16:9 aspect ratio */
          max-width: 100%;
          max-height: 100%;
          margin: 20px 0;
        }

        .unity-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-end; /* Align items to the right */
        }

        .fullscreen-button {          
          border: none;
          color: white;
          padding: 10px;
          cursor: pointer;
          margin-top: 10px; /* Add margin from the Unity canvas */
        }

        .progress-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80vw;
          height: calc(80vw * 9 / 16);
          border: none;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }

        .progress-bar {
          width: 0%;
          height: 10px;
          background: #ffffff;
          margin-bottom: 10px;
          transition: width 0.3s ease-in-out;
        }

        .socialLink,
        .brandList {
          list-style: none;
          padding: 0;
        }

        .socialLink li,
        .brandList li {
          margin: 0 10px;
        }
      `}</style>

    </section>
  );
}
