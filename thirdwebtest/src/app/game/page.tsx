// src/app/unity.tsx
'use client'
import { Unity, useUnityContext } from 'react-unity-webgl';

export default function GamesPage() {
  const { unityProvider } = useUnityContext({
    loaderUrl: '/unity/Build/TestWebGL.loader.js',
    dataUrl: '/unity/Build/TestWebGL.data',
    frameworkUrl: '/unity/Build/TestWebGL.framework.js',
    codeUrl: '/unity/Build/TestWebGL.wasm',
  });

  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      <Unity
        unityProvider={unityProvider}
        style={{ width: '100vw', height: '100vh', border: 'none' }}
      />
    </div>
  );
}
