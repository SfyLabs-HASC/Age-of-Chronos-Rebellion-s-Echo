// src/types/react-unity-webgl.d.ts
declare module 'react-unity-webgl' {
    import { CSSProperties, ReactElement } from 'react';
  
    export interface UnityContextConfig {
      loaderUrl: string;
      dataUrl: string;
      frameworkUrl: string;
      codeUrl: string;
    }
  
    export interface UnityProps {
      unityProvider: any;
      style?: CSSProperties;
    }
  
    export class Unity extends React.Component<UnityProps> {}
    export function useUnityContext(config: UnityContextConfig): any;
  }
  