async function main() {
    //This will compile the smart contract and generate the necessary files to work with the contract 
    //under the "artifacts" directory, which is the first step of a smart contract.
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal")
    //This will deploy Ethereum from my wallet to fund the smart contract Ethereum prize.
    const waveContract = await waveContractFactory.deploy ({value: hre.ethers.utils.parseEther("0.1")})
    //This will wait for the contract to be deployed.
    await waveContract.deployed()
    //This will give me the address of the deployed contract, which is how I find my smart contract on the
    //blockchain.
    console.log( "Contract addy:", waveContract.address)
    //This will grab the wallet address of the contract owner and a random person.
    const [owner, randoPerson] = await hre.ethers.getSigners();
    //This shows the address of the person deploying the contract owner's smart contract.
    console.log("Contract deployed by:", owner.address);
    console.log("Contract deployed to:", waveContract.address);

    let count = await waveContract.getTotalWaves()
    console.log(count.toNumber())

    //This grabs the total number of contract waves.
    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    //This completes the contract wave.
    let waveTxn = await waveContract.wave("This is wave #1");
    await waveTxn.wait();//This waits for Txn to be mined.

    //This allows users to wave.
    waveTxn = await waveContract.connect(randoPerson).wave("This is wave #2");
    await waveTxn.wait();//This waits for Txn to be mined.

    //This tests that the smart contract has has a balance of 0.1.
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance))

    //This checks that 0.0001 Ethereum is deployed from the smart contract.
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance))

    //This counts the number of contract waves to see if its changed.
    waveCount = await waveContract.getTotalWaves();

    let allWaves= await waveContract.getAllWaves()
    console.log(allWaves)

}

main()
    .then(() => process.exit(0))
    .catch ((error) => {
        console.error(error)
        process.exit(1)
    })