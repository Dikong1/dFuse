// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract dFUSE {
    string[] private projects = ['Omori'];

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

    mapping(uint256 => Project) public projectData;
    uint256 public serialNumCounter;

    event ProjectCreated(uint256 serialNum, address ownerAddress, string projectName);
    event FundingReceived(uint256 serialNum, address funder, uint256 amount);
    event ProjectClosed(uint256 serialNum);
    event ProjectRemoved(uint256 serialNum, address remover);
    event ProjectUpdated(uint256 serialNum, string newDescription);

    modifier projectExists(uint256 serialNum) {
        require(serialNum < serialNumCounter, "Project does not exist");
        _;
    }

    modifier projectIsOpen(uint256 serialNum) {
        require(projectData[serialNum].isOpen, "Project is not open");
        _;
    }

    modifier onlyProjectOwner(uint256 serialNum) {
        require(msg.sender == projectData[serialNum].ownerAddress, "Only the project owner can perform this action");
        _;
    }

    function createProject(
        string memory _ownerName,
        string memory _projectName,
        string memory _description,
        string memory _imageUrl,
        uint256 _goalAmount
    ) public {
        Project storage newProject = projectData[serialNumCounter];
        newProject.ownerAddress = msg.sender;
        newProject.ownerName = _ownerName;
        newProject.projectName = _projectName;
        newProject.description = _description;
        newProject.imageUrl = _imageUrl;
        newProject.goalAmount = _goalAmount;
        newProject.isOpen = true;

        emit ProjectCreated(serialNumCounter, msg.sender, _projectName);

        serialNumCounter++;
    }

    function fundProject(uint256 _serialNum) public payable projectExists(_serialNum) projectIsOpen(_serialNum) {
        require(msg.value > 0, "Funding amount must be greater than 0");

        uint256 remainingAmount = projectData[_serialNum].goalAmount - projectData[_serialNum].fundedAmount;
        uint256 actualFunding = msg.value;

        if (actualFunding > remainingAmount) {
            actualFunding = remainingAmount;
        }

        projectData[_serialNum].fundedAmount += actualFunding;

        if (projectData[_serialNum].fundedAmount >= projectData[_serialNum].goalAmount) {
            projectData[_serialNum].isOpen = false;
            emit ProjectClosed(_serialNum);
        }

        emit FundingReceived(_serialNum, msg.sender, actualFunding);
    }

    function addressToString(address _address) internal pure returns (string memory) {
        bytes memory result = abi.encodePacked(_address);
        return string(result);
    }

    function getAllProjectsJSON() public view returns (string memory) {
        string memory result = "[";
        for (uint256 i = 0; i < serialNumCounter; i++) {
            if (i > 0) {
                result = string(abi.encodePacked(result, ",")); // Add comma between projects
            }
            result = string(
                abi.encodePacked(
                    result,
                    '{"serialNum":',
                    toString(i),
                    ',"ownerAddress":"',
                    addressToString(projectData[i].ownerAddress),
                    '","ownerName":"',
                    projectData[i].ownerName,
                    '","projectName":"',
                    projectData[i].projectName,
                    '","description":"',
                    projectData[i].description,
                    '","imageUrl":"',
                    projectData[i].imageUrl,
                    '","goalAmount":',
                    toString(projectData[i].goalAmount),
                    ',"fundedAmount":',
                    toString(projectData[i].fundedAmount),
                    ',"isOpen":',
                    projectData[i].isOpen ? "true" : "false",
                    '}'
                )
            );
        }
        result = string(abi.encodePacked(result, "]"));
        return result;
    }


    function removeProject(uint256 _serialNum) public projectExists(_serialNum) onlyProjectOwner(_serialNum) {
        delete projectData[_serialNum];
        emit ProjectRemoved(_serialNum, msg.sender);
    }

    function updateProjectDescription(uint256 _serialNum, string memory _newDescription)
        public
        projectExists(_serialNum)
        onlyProjectOwner(_serialNum)
    {
        projectData[_serialNum].description = _newDescription;
        emit ProjectUpdated(_serialNum, _newDescription);
    }

    // Helper function to convert uint to string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Existing functions from the initial contract
    function push(string memory project) public {
        projects.push(project);
    }

    function get(uint256 index) public view returns (string memory) {
        return projects[index];
    }

    function getAll() public view returns (string[] memory) {
        return projects;
    }

    function remove(uint256 index) public returns (bool) {
        if (index >= 0 && index < projects.length) {
            projects[index] = projects[projects.length - 1];
            projects.pop();
            return true;
        }
        revert("index out of bounds");
    }
}
