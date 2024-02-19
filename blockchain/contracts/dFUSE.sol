// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


// address: 0x9Fd4cC68996C39a54bEf014FE2238F2bc12e45DC
contract dFUSE {
    struct Project {
        address ownerAddress;
        string ownerName;
        string projectName;
        string description;
        string imageUrl;
        uint256 goalAmount;
        uint256 fundedAmount;
        bool isOpen;
    }

    Project[] private projects;
    uint256 public projectCounter;

    event ProjectCreated(uint256 projectId, address ownerAddress, string projectName, uint256 goalAmount);
    event FundingReceived(uint256 projectId, address funder, uint256 amount);
    event ProjectClosed(uint256 projectId);
    event ProjectRemoved(uint256 projectId, address remover);
    event ProjectUpdated(uint256 projectId, string newDescription);

    modifier projectExists(uint256 projectId) {
        require(projectId < projectCounter, "Project does not exist");
        _;
    }

    modifier projectIsOpen(uint256 projectId) {
        require(projects[projectId].isOpen, "Project is not open");
        _;
    }

    modifier onlyProjectOwner(uint256 projectId) {
        require(msg.sender == projects[projectId].ownerAddress, "Only the project owner can perform this action");
        _;
    }

    function createProject(
        string memory _ownerName,
        string memory _projectName,
        string memory _description,
        string memory _imageUrl,
        uint256 _goalAmount
    ) public {
        projects.push(Project({
            ownerAddress: msg.sender,
            ownerName: _ownerName,
            projectName: _projectName,
            description: _description,
            imageUrl: _imageUrl,
            goalAmount: _goalAmount,
            fundedAmount: 0,
            isOpen: true
        }));

        uint256 projectId = projectCounter;
        projectCounter++;

        emit ProjectCreated(projectId, msg.sender, _projectName, _goalAmount);
    }

    function fundProject(uint256 projectId, uint256 amount) public payable projectExists(projectId) projectIsOpen(projectId) {
        require(amount > 0, "Funding amount must be greater than 0");
        require(msg.value >= amount, "Insufficient Ether sent");

        projects[projectId].fundedAmount += amount;

        if (projects[projectId].fundedAmount >= projects[projectId].goalAmount) {
            projects[projectId].isOpen = false;
            emit ProjectClosed(projectId);
        }

        emit FundingReceived(projectId, msg.sender, amount);
    }


    function removeProject(uint256 projectId) public projectExists(projectId) onlyProjectOwner(projectId) {
        delete projects[projectId];
        emit ProjectRemoved(projectId, msg.sender);
    }

    function updateProjectDescription(uint256 projectId, string memory _newDescription)
        public
        projectExists(projectId)
        onlyProjectOwner(projectId)
    {
        projects[projectId].description = _newDescription;
        emit ProjectUpdated(projectId, _newDescription);
    }

    function getAllProjects() public view returns (
        address[] memory ownerAddresses, 
        string[] memory ownerNames, 
        string[] memory projectNames, 
        string[] memory descriptions, 
        string[] memory imageUrls, 
        uint256[] memory goalAmounts, 
        uint256[] memory fundedAmounts, 
        bool[] memory isOpenFlags
    ) 
{
    ownerAddresses = new address[](projectCounter);
    ownerNames = new string[](projectCounter);
    projectNames = new string[](projectCounter);
    descriptions = new string[](projectCounter);
    imageUrls = new string[](projectCounter);
    goalAmounts = new uint256[](projectCounter);
    fundedAmounts = new uint256[](projectCounter);
    isOpenFlags = new bool[](projectCounter);

    for (uint256 i = 0; i < projectCounter; i++) {
        Project storage project = projects[i];
        ownerAddresses[i] = project.ownerAddress;
        ownerNames[i] = project.ownerName;
        projectNames[i] = project.projectName;
        descriptions[i] = project.description;
        imageUrls[i] = project.imageUrl;
        goalAmounts[i] = project.goalAmount;
        fundedAmounts[i] = project.fundedAmount;
        isOpenFlags[i] = project.isOpen;
    }

    return (
        ownerAddresses, 
        ownerNames, 
        projectNames, 
        descriptions, 
        imageUrls, 
        goalAmounts, 
        fundedAmounts, 
        isOpenFlags
    );
}

}
