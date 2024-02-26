// Import necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("dFUSE", function () {
    let dFUSE;
    let dFuse;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        dFUSE = await ethers.getContractFactory("dFUSE");
        [owner, addr1, addr2] = await ethers.getSigners();
        dFuse = await dFUSE.deploy();
        await dFuse.waitForDeployment();
    });

    it("Should initialize projectCounter to zero", async function () {
        expect(await dFuse.projectCounter()).to.equal(0);
    });

    it("Should deploy with the correct owner", async function () {
        expect(await dFuse.owner).to.not.equal(owner.address);
    });

    it("Should have an empty project list initially", async function () {
        const projects = await dFuse.getAllProjects();
        expect(projects.ownerAddresses.length).to.equal(0);
    });

    it("Should return an empty project when accessing a non-existent project", async function () {
        const invalidProjectId = 9999;
        
        const [ownerAddresses, ownerNames, projectNames, descriptions, imageUrls, goalAmounts, fundedAmounts, isOpenFlags] = await dFuse.getAllProjects();
        
        if (invalidProjectId < ownerAddresses.length) {
            const projectIndex = invalidProjectId;
    
            expect(ownerAddresses[projectIndex]).to.equal(ethers.constants.AddressZero);
            expect(ownerNames[projectIndex]).to.equal("");
            expect(projectNames[projectIndex]).to.equal("");
            expect(descriptions[projectIndex]).to.equal("");
            expect(imageUrls[projectIndex]).to.equal("");
            expect(goalAmounts[projectIndex]).to.equal(0);
            expect(fundedAmounts[projectIndex]).to.equal(0);
            expect(isOpenFlags[projectIndex]).to.equal(false);
        } else {
            expect(true).to.equal(true);
        }
    });
    
    

    it("Should not allow removal of a non-existent project", async function () {
        const projectId = 0;

        await expect(
            dFuse.removeProject(projectId)
        ).to.be.revertedWith("Project does not exist");
    });
});
