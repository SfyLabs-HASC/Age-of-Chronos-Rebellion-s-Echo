const hre = require("hardhat");

async function main() {
    await hre.run('compile'); // Assicurati che i contratti siano compilati

    // Specifica il nome del contratto di cui vuoi conoscere la dimensione
    const contractName = "TimeSquadAria";

    // Leggi il file JSON del contratto compilato
    const contractArtifact = await hre.artifacts.readArtifact(contractName);

    // Ottieni la lunghezza del bytecode in byte
    const bytecodeLength = contractArtifact.deployedBytecode.length / 2; // Ogni byte è rappresentato da 2 caratteri esadecimali

    console.log(`The size of the contract ${contractName} is ${bytecodeLength} bytes`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
