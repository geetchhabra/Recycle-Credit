import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css"; // ✅ Custom styling added


const contractAddress = "0xeD35ae721e8de72Ac3407fb943959893ED0C1C8d"; 
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "item",
        "type": "string"
      }
    ],
    "name": "rewardUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getRecyclingHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "item",
            "type": "string"
          }
        ],
        "internalType": "struct RecycToken.RecyclingRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_username",
        "type": "string"
      }
    ],
    "name": "setUsername",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUsername",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "redeemTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const ganacheProvider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

const Wallet = ({ setWalletAddress, updateBalance, setUsername, setBalance, setIsUsernameSet }) => {
  const [account, setAccount] = useState(null);
  const [inputUsername, setInputUsername] = useState(""); // ✅ Store entered username
  const [isNewUser, setIsNewUser] = useState(false); // ✅ Controls username input UI

  // ✅ Connect Wallet via MetaMask (only for connection)
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("⚠️ Please install MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = (await signer.getAddress()).toLowerCase(); // ✅ Convert to lowercase

      setAccount(userAddress);
      setWalletAddress(userAddress);

      // ✅ Read username using Ganache (Read-Only)
      const contract = new ethers.Contract(contractAddress, contractABI, ganacheProvider);
      let storedUsername = await contract.getUsername(userAddress);

      if (!storedUsername || storedUsername.trim() === "" || storedUsername === "0x") {
        setIsNewUser(true); // ✅ Show username input UI
      } else {
        setUsername(storedUsername);
        setIsUsernameSet(true);
      }

      updateBalance(userAddress);
    } catch (error) {
      console.error("Wallet Connection Error:", error);
      alert(`❌ Wallet connection failed: ${error.message}`);
    }
  };

  // ✅ Submit Username via Ganache
  const submitUsername = async () => {
    if (!inputUsername.trim()) {
      alert("⚠️ Please enter a valid username!");
      return;
    }

    try {
      // ✅ Get Ganache accounts and extract only addresses
      const accounts = await ganacheProvider.listAccounts(); // ✅ Debugging
      console.log("Ganache Accounts:", accounts);

      if (!Array.isArray(accounts) || accounts.length === 0) {
        alert("❌ No accounts found in Ganache.");
        return;
      }

      // ✅ Extract addresses properly (if accounts are objects)
      const normalizedAccounts = accounts.map(acc => (typeof acc === "string" ? acc.toLowerCase() : acc.address.toLowerCase()));

      // ✅ Find correct account index
      const accountIndex = normalizedAccounts.indexOf(account);
      if (accountIndex === -1) {
        alert("❌ Address not found in Ganache.");
        return;
      }

      // ✅ Get correct signer from Ganache
      const signer = await ganacheProvider.getSigner(accountIndex);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // ✅ Send transaction via Ganache
      const tx = await contract.setUsername(inputUsername);
      await tx.wait();

      setUsername(inputUsername);
      setIsNewUser(false);
      setIsUsernameSet(true); // ✅ Proceed to welcome animation
    } catch (error) {
      console.error("Username Set Error:", error);
      alert(`❌ Failed to set username: ${error.message}`);
    }
  };

  // ✅ UI: Wallet Button or Username Input
  return (
    <div>
      {isNewUser ? (
        <div className="username-container">
          <h2>👤 Set Your Username</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="username-input"
          />
          <button onClick={submitUsername} className="submit-username-btn">Submit</button>
        </div>
      ) : (
        <button onClick={connectWallet} className="connect-wallet-btn">
          {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
        </button>
      )}
    </div>
  );
};

export default Wallet;
