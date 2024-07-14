'use client'

import Link from 'next/link';
import React from 'react';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <main className="main">
      <Head>
        <title>Privacy Policy</title>
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
              <h1 className="text-center turret-road-bold mainTitleSec">Privacy Policy</h1>
            </div>
            <div className="col-12 col-lg-4">
              <span className="rightbar"></span>
            </div>
          </div>
        </div>

        <div className="container-fluid main-container">
          <div className="row align-items-center mobrow">
            <div className="col-12">
              <h2>Privacy Policy</h2>
              <p><strong>Effective Date: July 15, 2024</strong></p>
              <p>This Privacy Policy describes how SFY Labs Association ("Company", "we", "our", or "us") collects, uses, and shares information about you when you access and use Age Of Chronos (“Web 3 Game”), including any content, functionality, and services offered on or through the website <a href="https://ageofchronos.com">https://ageofchronos.com</a> (the “Site”).</p>

              <h3>1. Information We Collect</h3>
              <h4>1.1 Information You Provide to Us:</h4>
              <ul>
                <li><strong>Account Information:</strong> When you create an account by connecting your EVM Wallet, we collect information such as your wallet address and any other information you provide.</li>
                <li><strong>Profile Information:</strong> Information you provide for your profile, including username, bio, and any other personal details.</li>
                <li><strong>User Content:</strong> Information you post, display, or sell on the Site, including NFTs, images, and other content.</li>
              </ul>

              <h4>1.2 Information We Collect Automatically:</h4>
              <ul>
                <li><strong>Usage Information:</strong> We collect information about your interactions with the Site, including access times, pages viewed, and IP address.</li>
                <li><strong>Device Information:</strong> We collect information about the device you use to access the Site, including hardware model, operating system, and browser type.</li>
                <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to collect information and provide you with a better experience.</li>
              </ul>

              <h4>1.3 Information from Third Parties:</h4>
              <p>We may receive information about you from third parties, such as other users, partners, or public databases.</p>

              <h3>2. How We Use Your Information</h3>
              <h4>2.1 To Provide and Maintain the Service:</h4>
              <ul>
                <li>To operate, maintain, and improve Age Of Chronos.</li>
                <li>To manage your account and provide customer support.</li>
              </ul>

              <h4>2.2 To Communicate with You:</h4>
              <ul>
                <li>To send you updates, security alerts, and administrative messages.</li>
                <li>To respond to your comments, questions, and requests.</li>
              </ul>

              <h4>2.3 To Personalize Your Experience:</h4>
              <ul>
                <li>To customize the content and features you see.</li>
                <li>To understand and analyze how you use the Site and develop new products and services.</li>
              </ul>

              <h4>2.4 For Marketing and Promotional Purposes:</h4>
              <ul>
                <li>To send you promotional messages and other information that may be of interest to you.</li>
                <li>To promote NFTs and User Content on Age Of Chronos and other platforms.</li>
              </ul>

              <h4>2.5 For Security and Legal Purposes:</h4>
              <ul>
                <li>To protect against, investigate, and deter fraudulent, unauthorized, or illegal activity.</li>
                <li>To comply with legal obligations and enforce our terms and policies.</li>
              </ul>

              <h3>3. How We Share Your Information</h3>
              <h4>3.1 With Other Users:</h4>
              <p>Information you post or display on Age Of Chronos will be available to other users.</p>

              <h4>3.2 With Third-Party Service Providers:</h4>
              <p>We share information with third-party service providers who help us operate and improve the Site.</p>

              <h4>3.3 With Affiliates:</h4>
              <p>We may share information with our affiliates for purposes consistent with this Privacy Policy.</p>

              <h4>3.4 In Connection with Business Transfers:</h4>
              <p>We may share or transfer information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</p>

              <h4>3.5 For Legal and Security Reasons:</h4>
              <p>We may disclose information to comply with legal obligations, protect our rights and property, and ensure the safety of our users.</p>

              <h3>4. Your Choices</h3>
              <h4>4.1 Account Information:</h4>
              <p>You may update, correct, or delete your account information at any time by accessing your account settings.</p>

              <h4>4.2 Cookies:</h4>
              <p>Most web browsers are set to accept cookies by default. You can usually remove or reject cookies through your browser settings.</p>

              <h4>4.3 Marketing Communications:</h4>
              <p>You can opt out of receiving promotional emails from us by following the instructions in those emails or by contacting us directly.</p>

              <h3>5. Data Security</h3>
              <p>We take reasonable measures to protect your information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, we cannot guarantee the absolute security of your information.</p>

              <h3>6. Data Retention</h3>
              <p>We retain your information for as long as necessary to fulfill the purposes described in this Privacy Policy unless a longer retention period is required or permitted by law.</p>

              <h3>7. International Transfers</h3>
              <p>Your information may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from those of your country.</p>

              <h3>8. Children’s Privacy</h3>
              <p>Age Of Chronos is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information of a child under 18, we will take steps to delete such information as soon as possible.</p>

              <h3>9. Changes to This Privacy Policy</h3>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Site. You are advised to review this Privacy Policy periodically for any changes.</p>

              <h3>10. Contact Us</h3>
              <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
              <p><strong>SFY Labs Association</strong><br/>
              Email: <a href="mailto:sfy.startup@gmail.com">sfy.startup@gmail.com</a></p>

              <p>By using Age Of Chronos, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
