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
        console.log("Connected to account:", account);
    } else {
        console.error("Ethereum object not found, make sure you have a web3 provider like MetaMask installed.");
    }
}

async function connectContract() {
    const ABI = await loadContractABI();
    const address = '0xD664D9cA9eCe28618623Ee280C33e1B6c271830e';
    window.web3 = new Web3(window.ethereum);
    window.contract = new window.web3.eth.Contract(ABI, address);
}

const fundProject = async (projectId, amount) => {
    try {
        const amountToSend = window.web3.utils.toWei(amount.toString(), 'ether');
        await window.contract.methods.fundProject(projectId, amountToSend).send({
            from: account,
            value: amountToSend
        });
        alert('Funding successful!');
    } catch (error) {
        console.error('Failed to fund project:', error);
        alert('Failed to fund project: ' + error.message);
    }
};
const displayProjects = async () => {
    try {
        if (!window.contract) {
            console.error('Contract not connected.');
            return;
        }

        const data = await window.contract.methods.getAllProjects().call();
        const projectsDisplayDiv = document.getElementById('projects-section');

        // Check if there are any projects
        if (!data || data[0].length === 0) {
            projectsDisplayDiv.innerHTML = '<p>No projects found.</p>';
            return;
        }

        // Clear existing projects from the display div
        projectsDisplayDiv.innerHTML = '';

        // Iterate over the projects
        for (let i = 0; i < data[0].length; i++) {
            const projectId = i; 
            const goalAmount = BigInt(data[5][i]);
            const fundedAmount = BigInt(data[6][i]);
            let fundedPercentage = '0';
            let progressWidth = '0%';

            // Check if goalAmount is not zero to avoid division by zero
            if (goalAmount > 0n) {
                fundedPercentage = (fundedAmount * 100n / goalAmount).toString();
                progressWidth = (fundedAmount * 100n / goalAmount).toString() + '%';
            }

            // Skip deleted projects
            if (data[0][i] === '0x0000000000000000000000000000000000000000' || data[2][i] === '') {
                continue;
            }

            // Create the project card
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${data[4][i]}" alt="Project Image" class="project-image">
                <div class="project-info">
                    <h3>${data[2][i]}</h3>
                    <p>${data[3][i]}</p>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${progressWidth}"></div>
                        <div class="progress-text">${fundedPercentage}%</div>
                    </div>
                </div>
                <div class="support-section">
                    <input type="number" id="fundAmount${projectId}" placeholder="Amount in Ether" required />
                    <button id="supportBtn${projectId}" class="support-btn" onclick="handleFundButtonClick(${projectId})">SUPPORT</button>
                </div>
            `;

            // Append the project card to the display div
            projectsDisplayDiv.appendChild(projectCard);

            // Disable the support button if the project is fully funded
            if (goalAmount > 0n && fundedAmount >= goalAmount) {
                const supportButton = document.getElementById(`supportBtn${projectId}`);
                supportButton.disabled = true;
                supportButton.innerText = 'Fully Funded';
            }
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to load projects: ' + error.message);
    }
};




const handleFundButtonClick = async (projectId) => {
    document.querySelector(`#supportBtn${projectId}`).disabled = true;
    const amountInput = document.getElementById(`fundAmount${projectId}`);
    if (!amountInput) {
        console.error('Amount input not found for project:', projectId);
        return;
    }

    const amount = amountInput.value.trim();
    if (!amount) {
        alert('Please enter an amount to fund.');
        return;
    }
    amountInput.value = ''; // Clear the input after getting the value

    await fundProject(projectId, amount);
    document.querySelector(`#supportBtn${projectId}`).disabled = false;
};

window.addEventListener('load', async () => {
    await connectWallet();
    await connectContract();
    await displayProjects();
});
