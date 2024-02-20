const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const Contract = await hre.ethers.deployContract("dFUSE");

  await Contract.waitForDeployment();

  console.log("Contract Address:", Contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });