import React from "react";
import MintChild from "../mintChild"

export default function MintPage() {
    return (
        <div>
            <section id="mint-child-section">
                <header className="pt-3 py-lg-5">
                    <img src="/img/logo-main-aoc.webp" alt="Logo" width={142} height={100} />
                </header>
                <div className="container">
                    <h1 className="text-center">Mint Your Child NFT</h1>
                    <MintChild />
                </div>
            </section>
        </div>
    );
}
