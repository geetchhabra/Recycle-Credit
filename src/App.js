import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle2, CameraIcon, CircleDollarSign } from "lucide-react";
import Wallet from "./Wallet";
import Camera from "./Camera";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";

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
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");



const App = () => {
  const [detectedItem, setDetectedItem] = useState("");
  const [balance, setBalance] = useState("0");
  const [walletAddress, setWalletAddress] = useState(null);
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [activeTab, setActiveTab] = useState("recycle");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [recyclingHistory, setRecyclingHistory] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [notifications, setNotifications] = useState([]); // ✅ Store notifications
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showInfoPage, setShowInfoPage] = useState(false); // ✅ Toggle Info Page



  // ✅ Function to add a new notification
  const addNotification = (message) => {
    const id = Date.now(); // Unique ID for each notification
    setNotifications((prev) => [...prev, { id, message }]);
  
    // ✅ Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 4000);
  };

  // ✅ Fetch balance from Ganache (read-only)
  const updateBalance = async (userAddress) => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const balance = await contract.balanceOf(userAddress);
      setBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Balance Fetch Error:", error);
    }
  };

  // ✅ Handle Recycling Token Reward (via Ganache)
  const handleDetection = async (item) => {
    setDetectedItem(item);
  
    if (!walletAddress) {
      addNotification("⚠️ Please connect your wallet first!");
      return;
    }
  
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const amount = ethers.parseUnits("1", 18);
  
      // ✅ Now passing the `item` along with amount
      const tx = await contract.rewardUser(walletAddress, amount, item);
      await tx.wait();
  
      addNotification(`✅ You earned 1 RC for recycling a ${item}`);
      updateBalance(walletAddress);
      fetchHistory(); // ✅ Fetch updated history
    } catch (error) {
      console.error("❌ Transaction Error:", error);
      addNotification(`❌ Transaction failed: ${error.message}`);
    }
  };
  
  
  

  // ✅ Redeem Tokens for Rewards
  const redeemTokens = async () => {
    if (!walletAddress) {
      addNotification("⚠️ Please connect your wallet first!");
      return;
    }
  
    if (!redeemAmount || Number(redeemAmount) <= 0) {
      addNotification("⚠️ Please enter a valid amount to redeem!");
      return;
    }
  
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const balance = await contract.balanceOf(walletAddress);
  
      const redeemAmountWei = ethers.parseUnits(redeemAmount, 18);
  
      // ✅ Check if the user has enough tokens
      if (balance < redeemAmountWei) {
        addNotification("❌ Insufficient balance to redeem!");
        return;
      }
  
      const signer = await provider.getSigner();
      const txContract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await txContract.redeemTokens(redeemAmountWei);
      await tx.wait();
  
      // ✅ Generate a unique redemption code
      const redemptionCode = `RC-${walletAddress.slice(-6)}-${Date.now()}`;
      setQrCodeData(redemptionCode);
  
      addNotification(`🎁 Successfully redeemed ${redeemAmount} RC`);
      updateBalance(walletAddress);
      setRedeemAmount("");
    } catch (error) {
      console.error("❌ Redemption Error:", error);
      addNotification(`❌ Redemption failed: ${error.message}`);
    }
  };
  
  
  const fetchHistory = async () => {
    if (!walletAddress) return;
  
    try {
      // ✅ Read-only contract instance (use `provider`)
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
      // ✅ Fetch history from contract
      const history = await contract.getRecyclingHistory(walletAddress);
  
      // ✅ Format timestamps & extract items
      const formattedHistory = history.map((entry) => ({
        amount: ethers.formatUnits(entry.amount, 18),
        item: entry.item, // ✅ Get the recycled item name
        time: new Date(Number(entry.timestamp) * 1000).toLocaleString(),
      }));
  
      setRecyclingHistory(formattedHistory);
    } catch (error) {
      console.error("❌ Fetching History Error:", error);
    }
  };
  
  
  
  
  

  // ✅ Disconnect Wallet (Logout)
  const disconnectWallet = () => {
    setWalletAddress(null);
    setUsername("");
    setBalance("0");
    setIsDropdownOpen(false);
  };

  // ✅ Close dropdown when clicking outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".profile-dropdown") && !e.target.closest(".profile-icon")) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    if (isUsernameSet) {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 3000); // ✅ Show animation for 3 seconds
    }
  }, [isUsernameSet]);

  // ✅ Toggle dropdown on click
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    setIsDropdownOpen((prev) => !prev);
  };

  // ✅ Function to handle "Get Info" button click
const handleGetInfo = () => {
  setShowInfoPage(true);
};

// ✅ Function to go back from the Info Page
const handleBackToLanding = () => {
  setShowInfoPage(false);
};

// ✅ Render Info Page if selected
if (showInfoPage) {
  return (
    <motion.div className="info-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <h1 className="info-title">♻️ Why Recycle Credit Matters</h1>

      <p className="info-text">
        Recycling has been around for years, but the biggest challenge has always been <strong>incentivizing people</strong>. 
        Many recycling stations were set up by <strong>third-party organizations</strong> with no direct way to reward users effectively. 
        Even after recycling <strong>hundreds of plastic bottles or cans</strong>, users rarely receive meaningful rewards.
      </p>

      <p className="info-text">
        With Recycle Credit, businesses, residential societies, universities, and even <strong>municipalities</strong> can now 
        <strong>directly reward users</strong> for their recycling efforts. Instead of small, negligible rewards, organizations 
        can provide real incentives such as <strong>discounted maintenance fees, shopping vouchers, or sustainability credits</strong>.
      </p>

      <h2 className="info-subtitle">🌍 The Growing Waste Problem</h2>
      <p className="info-text">
        Every year, <strong>over 300 million tons of plastic waste</strong> is generated worldwide. A significant portion of this ends up 
        in <strong>corporate offices, universities, shopping malls, and public spaces</strong>. Without proper incentives, 
        recycling rates remain low, leading to <strong>severe environmental consequences</strong>.
      </p>

      <ul className="info-list">
        <li>🚮 <strong>50% of all plastic produced</strong> is designed for <strong>single-use purposes</strong>, making recycling crucial.</li>
        <li>🏢 Large <strong>corporations and businesses</strong> generate massive waste, yet struggle to track sustainability efforts.</li>
        <li>🏡 <strong>Residential societies</strong> often lack structured recycling incentives for residents.</li>
        <li>🎓 <strong>Schools and universities</strong> produce waste from food packaging, plastic bottles, and electronics.</li>
        <li>🏙 <strong>Smart cities and municipalities</strong> need efficient ways to manage public waste responsibly.</li>
      </ul>

      <h2 className="info-subtitle">🔗 How Blockchain Fixes This</h2>
      <p className="info-text">
        One of the biggest issues with existing recycling programs is the <strong>lack of transparency</strong>. Since most recycling 
        initiatives are managed by private firms, it is difficult to <strong>prove</strong> recycling efforts and allocate rewards fairly.
      </p>

      <ul className="info-list">
        <li>✅ <strong>Tamper-proof records:</strong> Every recycled item is logged on the blockchain, ensuring <strong>verifiable proof</strong>.</li>
        <li>💰 <strong>Direct incentives:</strong> Organizations can issue real rewards, from <strong>gift cards</strong> to <strong>utility discounts</strong>.</li>
        <li>📊 <strong>Sustainability reporting:</strong> Companies can use this data in their <strong>corporate sustainability reports</strong>.</li>
        <li>🌎 <strong>Scalability:</strong> Governments, businesses, and local councils can implement this across multiple locations.</li>
      </ul>

      <h2 className="info-subtitle">🎁 Real-World Incentives</h2>
      <p className="info-text">
        Instead of meaningless points, Recycle Credit allows for <strong>real rewards</strong>. Some examples include:
      </p>

      <ul className="info-list">
        <li>🏢 Employees at <strong>corporate offices</strong> can redeem <strong>Amazon gift cards</strong> for sustainable habits.</li>
        <li>🏡 <strong>Housing societies</strong> can provide <strong>discounts on maintenance fees</strong>.</li>
        <li>🎓 <strong>Colleges & universities</strong> can give <strong>food court discounts</strong> for responsible recycling.</li>
        <li>🛍 <strong>Shopping malls & retail stores</strong> can offer <strong>discount coupons</strong> for recycled items.</li>
      </ul>

      <button className="back-btn" onClick={handleBackToLanding}>🔙 Go Back</button>
    </motion.div>
  );
}
// ✅ Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <p>🚀 Developed by <strong>Geet Chhabra</strong></p>
      <p>📞 Contact: <a href="tel:+919755423550">+91 9755423550</a></p>
      <p>📧 Email: <a href="mailto:geetchhabra2004@gmail.com">geetchhabra2004@gmail.com</a></p>
    </footer>
  );
};

if (!walletAddress|| !isUsernameSet)

  // ✅ Landing Page (Before Wallet is Connected)
  return (
    <motion.div className="landing-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <motion.h1 className="landing-title" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
        ♻️ Welcome to Recycle Credit
      </motion.h1>
      <motion.p className="landing-description" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        Connect your wallet to start earning recycling rewards!
      </motion.p>
  
      {/* ✅ Get Info & Connect Wallet Buttons */}
      <div className="landing-buttons">
        <button className="info-btn" onClick={handleGetInfo}>ℹ️ Get Info</button>
        <Wallet
          setWalletAddress={setWalletAddress}
          updateBalance={updateBalance}
          setUsername={setUsername}
          setBalance={setBalance}
          setIsUsernameSet={setIsUsernameSet}
        />
      </div>
      {/* ✅ Footer */}
      <Footer />
    </motion.div>
  );

  // ✅ **Welcome Animation**
  if (showWelcome) {
    return (
      <motion.div className="welcome-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <motion.h1 className="welcome-message" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
          🎉 Welcome, {username}!
        </motion.h1>
  
        {/* Fake Loading Bar */}
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </motion.div>
    );
  }



  // ✅ **Main Dashboard (After Wallet is Connected)**
  return (
    <motion.div className="app-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {/* 🔔 Notification Container */}
    <div className="notification-container">
      {notifications.map((notif) => (
        <div key={notif.id} className="notification">
          {notif.message}
        </div>
      ))}
    </div>
      {/* Top Navigation */}
      <div className="nav-container">
        <motion.h1 className="title" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          ♻️ Recycle Credit Machine
        </motion.h1>

        {/* Profile Button with Dropdown */}
<div className="profile">
<UserCircle2 className="profile-icon" onClick={toggleDropdown} />

{isDropdownOpen && (
  <div className="profile-dropdown visible">
    <p><strong>👤 {username || "No Username Set"}</strong></p>
    <p>💰 Balance: {balance} RTC</p>
    <p>🔗 {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
    <button className="logout-btn" onClick={disconnectWallet}>🚪 Logout</button>
  </div>
)}
</div>
</div>

      {/* Tabs */}
      <div className="tab-container">
        <button className={`tab ${activeTab === "recycle" ? "active-tab" : ""}`} onClick={() => setActiveTab("recycle")}>
          <CameraIcon className="icon" /> Recycling
        </button>
        <button
  className={`tab ${activeTab === "history" ? "active-tab" : ""}`}
  onClick={() => {
    setActiveTab("history");
    fetchHistory(); // ✅ Load history when clicked
  }}
>
  <CircleDollarSign className="icon" /> History
</button>

        <button className={`tab ${activeTab === "redeem" ? "active-tab" : ""}`} onClick={() => setActiveTab("redeem")}>
          🎁 Redeem
        </button>
      </div>

      {/* Tab Content */}
      <div className="content-container">
        {activeTab === "recycle" && (
  <div className="camera-container">
    <Camera onDetect={handleDetection} />
  </div>
)}


        {activeTab === "history" && (
  <div className="history-container">
    <h2>📜 Recycling History</h2>
    {recyclingHistory.length > 0 ? (
      <ul className="history-list">
        {recyclingHistory.map((entry, index) => (
          <li key={index} className="history-item">
            <div className="history-main">
              ♻️ Earned <strong>{entry.amount} RC</strong> for recycling <strong>{entry.item}</strong>
            </div>
            <div className="history-time">
              🕒 {entry.time}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No recycling history found.</p>
    )}
  </div>
)}


        
{activeTab === "redeem" && (
          <div className="redeem-section">
            <h2>🎁 Redeem Your Tokens</h2>
            <p>Use your Recycle Credits to redeem rewards!</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              className="redeem-input"
            />
            <button onClick={redeemTokens} className="redeem-btn">Redeem</button>

            {/* ✅ Show QR Code if available */}
            {qrCodeData && (
              <div className="qr-container">
                <h3> Your Redemption Code</h3>
                
                <QRCodeCanvas value={qrCodeData} size={180} />
                <p className="qr-code-text">Scan to claim rewards</p>
              </div>
            )}
          </div>
        )}
      </div>
    
    </motion.div>
  );
};


export default App;




