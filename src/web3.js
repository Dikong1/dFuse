import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);    
    window.ethereum.request({ method: "eth_requestAccounts" });
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://neat-chaotic-season.ethereum-sepolia.quiknode.pro/bf8493fa9b90df2f4b01de1271220b717a7f2712/'
    );
    web3 = new Web3(provider);
}

export default web3;