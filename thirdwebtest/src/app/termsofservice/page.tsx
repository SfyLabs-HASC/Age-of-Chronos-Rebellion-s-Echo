'use client'

import Link from 'next/link';
import React from 'react';
import Head from 'next/head';

export default function TermsOfService() {
  return (
    <main className="main">
      <Head>
        <title>Terms of Service</title>
      </Head>
      <style jsx>{`
        body {
          background-color: #000; /* colore di sfondo scuro */
          color: #fff; /* colore del testo bianco */
        }
        .container-fluid {
          color: #fff; /* colore del testo bianco */
        }
        .hex_button, .aoc_panel p, .socialLink a, .brandList img {
          color: #fff !important;
        }
      `}</style>
      <section id="inside">
        <Link href="/">
            <header className="pt-3 py-lg-5">
              <img src="/img/logo-main-aoc.webp" alt="Logo" width={142} height={100} />
            </header>
        </Link>
        <div className="container-fluid main-container py-3 pb-lg-3">
          <div className="row align-items-center">
            <div className="col-12 col-lg-4">
              <span className="leftbar"></span>
            </div>
            <div className="col-12 col-lg-4">
              <h1 className="text-center turret-road-bold mainTitleSec">Terms of Service</h1>
            </div>
            <div className="col-12 col-lg-4">
              <span className="rightbar"></span>
            </div>
          </div>
        </div>

        <div className="container-fluid main-container">
          <div className="row align-items-center mobrow">
            <div className="col-12">
              <h2>AGE OF CHRONOS Terms and Conditions</h2>
              <p><strong>Last material update: July 15, 2024</strong></p>
              <p>Age Of Chronos (“Web 3 Game”), operated by SFY Labs, allows you to participate by crafting and creating NFTs for your characters, and is made available to you by SFY Labs.</p>

              <h3>Acceptance</h3>
              <p>By connecting your EVM Wallet, you confirm that you understand and agree to these terms and conditions (“Terms”). These Terms constitute a legal agreement between you and the Company and govern your access to and use of Age Of Chronos, including any content, functionality, and services offered on or through the website <a href="https://ageofchronos.app">https://ageofchronos.app</a> (the “Site”). The Company reserves the right to change or modify these terms at any time at our sole discretion. By accessing or using Age Of Chronos and the Site following any change to these Terms, you agree to the revised Terms.</p>

              <h3>Definitions</h3>
              <ul>
                <li><strong>Non-fungible token (NFT):</strong> Items with unique properties not interchangeable with others.</li>
                <li><strong>Fungible items:</strong> Items whose value defines them rather than unique properties.</li>
                <li><strong>Applicable Law:</strong> Any law, rule, regulation, or guideline applicable to the parties involved.</li>
                <li><strong>Sale Item:</strong> Includes art, audio files, collectibles, memorabilia, and game assets.</li>
                <li><strong>Company:</strong> Refers to SFY Labs.</li>
                <li><strong>User:</strong> Refers to the user of Age Of Chronos.</li>
              </ul>

              <h3>Eligibility</h3>
              <p>By agreeing to these Terms, you represent and warrant that:</p>
              <ol>
                <li>You are at least 18 years of age.</li>
                <li>You have the full right, power, and authority to agree to these Terms.</li>
                <li>You are not subject to financial sanctions or restrictive measures by relevant authorities.</li>
                <li>You are not a citizen or resident of certain restricted countries.</li>
                <li>You are not impersonating any other person.</li>
                <li>You will not use Age Of Chronos if prohibited by Applicable Laws.</li>
                <li>You comply with all Applicable Laws to which you are subject.</li>
                <li>You have read, understood, and agreed to our Privacy Notice and Cookie Policy.</li>
              </ol>

              <h3>Age Of Chronos Account</h3>
              <p>To use Age Of Chronos, you must create an account by connecting your Cryptocurrency wallet.</p>

              <h3>Changes to Age Of Chronos</h3>
              <p>The Company may change, update, amend, remove, or discontinue any part of the Site, services, and Content at any time without prior notice.</p>

              <h3>Fees</h3>
              <p>By playing and starting a mission with your NFTs on Age Of Chronos, you agree to pay all applicable fees.</p>

              <h3>Your Use of Age Of Chronos and Conduct</h3>
              <p>You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Site and Content under the following conditions. You must not:</p>
              <ul>
                <li>Engage in spamming or unauthorized advertising.</li>
                <li>Perform unlawful activities.</li>
                <li>Engage in fraudulent activities or provide misleading information.</li>
                <li>Upload content with viruses or illegal material.</li>
                <li>Modify or adapt Age Of Chronos and the Site.</li>
                <li>Reverse-engineer or derive source code.</li>
                <li>Infringe on intellectual property rights.</li>
                <li>Damage, disable, impair or compromise the Site.</li>
                <li>Gain unauthorized access to other users' accounts.</li>
                <li>Impose large burdens on the Company infrastructure.</li>
                <li>Engage in inappropriate activities or violate these Terms.</li>
                <li>Provide false or incomplete information.</li>
                <li>Engage in lotteries or games of chance.</li>
              </ul>

              <h3>User Content</h3>
              <p>Users can create profiles, post information, display NFTs, and sell NFTs. Creators grant the Company rights to use their name, image, and NFT images for marketing. User Content must comply with these Terms, and users are responsible for its legality, reliability, accuracy, and appropriateness. The Company may remove any User Content at any time.</p>

              <h3>Intellectual Property</h3>
              <p>The Site, its content, and materials are proprietary property of the Company or its affiliates, licensors, or users. Company logos and trademarks may not be used without permission.</p>

              <h3>Your Ownership of the NFT</h3>
              <p>When you buy an NFT, you own it and can sell or give it away. If associated with a Sale Item, you have a worldwide, perpetual, exclusive, transferable license to use it for personal, non-commercial use, display on Age Of Chronos, or on third-party websites or applications.</p>

              <h3>Risks</h3>
              <p>Using Age Of Chronos involves risks such as price volatility of NFTs, regulatory changes, fraud, and technological difficulties. The Company does not provide advice on NFTs. You access and use Age Of Chronos at your own risk.</p>

              <h3>Taxes</h3>
              <p>You are solely responsible for determining and paying any taxes applicable to your NFT transactions.</p>

              <h3>Disclaimers</h3>
              <p>The Company is not responsible for communications and promotional activities by Creators. The Site, content, and NFTs are provided "as is" without warranties. The Company does not guarantee accuracy, completeness, reliability, or safety. The Company is not liable for security breaches unless due to gross negligence.</p>

              <h3>Limitation of Liability</h3>
              <p>The Company is not liable for indirect, consequential, exemplary, incidental, special, or punitive damages. The maximum aggregate liability is limited to US$100.</p>

              <h3>Indemnification</h3>
              <p>You agree to indemnify the Company and related parties from third-party claims, damages, losses, or liabilities arising from your use of the Site, Content, or NFTs, breach of these Terms, or violation of third-party rights.</p>

              <h3>Amendment and Variation</h3>
              <p>The Company may update or amend these Terms and change the Site without prior notice. Continued use of Age Of Chronos indicates acceptance of the changes.</p>

              <h3>Transfer, Assignment, or Delegation</h3>
              <p>These Terms are personal to you and cannot be transferred, assigned, or delegated without written consent from the Company. The Company may transfer, assign, or delegate these Terms without restriction.</p>

              <h3>Severability</h3>
              <p>If any provision is found invalid or unenforceable, the remaining provisions remain in full force and effect.</p>

              <h3>Entire Agreement / Translation</h3>
              <p>These Terms constitute the entire agreement and supersede prior agreements. Communications and notices shall be in English. In case of translation, the English version prevails.</p>

              <h3>Waiver</h3>
              <p>Terms may not be waived except in writing. Non-enforcement of any term does not waive rights related to subsequent breaches.</p>

              <h3>Third Party Rights</h3>
              <p>Only entities within the Company group have rights to enforce these Terms.</p>

              <p>By using Age Of Chronos, you agree to abide by these Terms and acknowledge the inherent risks and responsibilities associated with NFT transactions.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
