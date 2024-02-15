const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    // Deploy the dFUSE Contract
    const dFuseContract = await hre.ethers.getContractFactory("dFUSE");
    const deployedDfuse = await dFuseContract.deploy();
    console.log("dFUSE deployed to:", deployedDfuse.address);

    // Wait for 30 seconds to let Etherscan catch up on contract deployments
    await sleep(30 * 1000);

    // Verify the contract on Etherscan
    await verifyContract(deployedDfuse.address);
  } catch (error) {
    console.error("Error deploying or verifying contract:", error);
    process.exit(1); // Exit the process with a non-zero status code
  }
}

async function verifyContract(contractAddress) {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // No constructor arguments in this case
      contract: "dFUSE", // Contract name without the .sol extension
      network: "sepolia" // Specify the network where the contract is deployed
    });
    console.log("Contract verified on Etherscan");
  } catch (error) {
    console.error("Error verifying contract on Etherscan:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
