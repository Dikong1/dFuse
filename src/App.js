// App.js

import './style.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import dFUSEContract from '../blockchain/src/artifacts/contracts/dFUSE.sol/dFUSE.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);

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
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = dFUSEContract.networks[networkId];
        const instance = new web3.eth.Contract(
          dFUSEContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setContract(instance);

        const projectsCount = await instance.methods.serialNumCounter().call();
        const projects = [];
        for (let i = 0; i < projectsCount; i++) {
          const project = await instance.methods.projectData(i).call();
          projects.push(project);
        }
        setProjects(projects);
      }
    };

    loadBlockchainData();
  }, [web3]);

  return (
    <div className="App h-full">
      <NavBar setShowProjects={setShowProjects} />
      {showProjects && <ProjectsList projects={projects} />}
      {!showProjects && (
        <div>
          <AboutUsInfo />
          {/* ... (other components) */}
        </div>
      )}
    </div>
  );
}

function NavBar({ setShowProjects }) {
  const handleProjectsClick = () => {
    setShowProjects(true);
  };

  return (
    <nav className='inline-block w-full'>
      <div className='flex justify-between items-center mt-3'>
        <div>
          <a href='/' className='text-3xl font-extrabold align-middle ms-8'>dFUSE</a>
          <a href='/' className='text-xl font-extrabold align-middle ms-14'>About Us</a>
          <a href='/project' className='text-xl font-extrabold align-middle ms-14' onClick={handleProjectsClick}>
            Projects
          </a>
        </div>
        <a href='/profile' className='align-middle me-4'>
          <img className='' width={35} src='https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png' alt='' />
        </a>
      </div>
    </nav>
  );
}

function AboutUsInfo() {
  return (
    <div>
      <div className='text-4xl font-extrabold mt-20 ms-8'>
        Spark Startup Success with dFUSE <br />
        Launching Dreams, Igniting Growth!
      </div>
      <div>
        <img src='../public/img/rocket.svg' alt='' />
      </div>
    </div>
  );
}

function ProjectsList({ projects }) {
  // Implement your rendering logic for the projects list here
  return (
    <div>
      {/* ... */}
    </div>
  );
}

export default App;
