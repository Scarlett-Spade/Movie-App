async function main() {
   const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    //This funds the smart contract with 0.1 Ethereum.
    const waveContract = await waveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.1")});
    await waveContract.deployed() //This makes it easy to see when the Ethereum is deployed.
    console.log("WavePortal address:", waveContract.address);
}

main()
    .then(() => process.exit (0))
    .catch((error) =>{
        console.error(error);
        process.exit(1);
    });