import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import dFUSEContract from '../blockchain/src/artifacts/contracts/dFUSE.sol/dFUSE.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const newWeb3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(newWeb3);
        } catch (error) {
          console.error('User denied account access');
        }
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        console.error('No Ethereum provider detected');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3) {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = dFUSEContract.networks[networkId];
        const instance = new web3.eth.Contract(
          dFUSEContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setContract(instance);

        const projectsCount = await instance.methods.projectCounter().call();
        const projects = [];
        for (let i = 0; i < projectsCount; i++) {
          const project = await instance.methods.projects(i).call();
          projects.push(project);
        }
        setProjects(projects);
      }
    };

    loadBlockchainData();
  }, [web3]);

  const createProject = async () => {
    // Implement the creation of a project here
  };

  const getAllProjects = async () => {
    // Implement retrieving all projects here
  };

  return (
    <div className="App">
      <h1>Interact with Ethereum Contract</h1>
      <button onClick={createProject}>Create Project</button>
      <button onClick={getAllProjects}>Get All Projects</button>

      {/* Display projects here */}
    </div>
  );
}

export default App;
