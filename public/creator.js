let account;

async function loadContractABI() {
    const response = await fetch('contractABI.json');
    const abi = await response.json();
    return abi;
}

const connectWallet = async () => {
    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        account = accounts[0];
        console.log("connected")
    }
}

const connectContract = async () => {
    const ABI = await loadContractABI();
    const address = '0xDe6f068c038Fe686b76c989925e5a8b5A12Ebf8D';
    window.web3 = new Web3(window.ethereum);
    window.contract = new window.web3.eth.Contract(ABI, address);
}

const createProject = async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way
    const ownerNameVal = document.getElementById('ownerName').value;
    const projectNameVal = document.getElementById('projectName').value;
    const descriptionVal = document.getElementById('description').value;
    const imageUrlVal = document.getElementById('imageUrl').value;
    const goalAmountVal = document.getElementById('goalAmount').value;

    try {
        const accounts = await web3.eth.getAccounts();
        const goalAmountWei = web3.utils.toWei(goalAmountVal, 'ether'); // Convert to Wei
        await contract.methods.createProject(
            ownerNameVal, 
            projectNameVal, 
            descriptionVal, 
            imageUrlVal, 
            goalAmountWei
        ).send({ from: accounts[0] });
        alert('Project created successfully!');
    } catch (error) {
        alert('Failed to create project: ' + error.message);
    }
};

const removeProject = async (e) => {
    e.preventDefault();
    const projectId = document.getElementById('removeProjectId').value;
    try {
        const accounts = await window.web3.eth.getAccounts();
        await window.contract.methods.removeProject(projectId).send({ from: accounts[0] });
        alert('Project removed successfully!');
    } catch (error) {
        alert('Failed to remove project: ' + error.message);
    }
};

const updateProjectDescription = async (e) => {
    e.preventDefault();
    const projectId = document.getElementById('updateProjectId').value;
    const newDescription = document.getElementById('newDescription').value;
    try {
        const accounts = await window.web3.eth.getAccounts();
        await window.contract.methods.updateProjectDescription(projectId, newDescription).send({ from: accounts[0] });
        alert('Project description updated successfully!');
    } catch (error) {
        alert('Failed to update project description: ' + error.message);
    }
};

window.addEventListener('load', async () => {
    await connectWallet();
    await connectContract();
});