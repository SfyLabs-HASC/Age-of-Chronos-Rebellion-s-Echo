'use client'

import { createThirdwebClient } from "thirdweb";
import {
    ThirdwebProvider,
    ConnectButton,
  } from "thirdweb/react";
  import { createWallet } from "thirdweb/wallets";
  
  
  const client = createThirdwebClient({
    clientId: "258f6a7e272e3b6e74b8ad1d24ad1343",
  });
  
  const wallets = [createWallet("io.metamask")];
  
  export default function ThirdWeb() {
    return (
      <ThirdwebProvider>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"dark"}
          connectModal={{ size: "wide" }}
        />
      </ThirdwebProvider>
    );
  }