import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "./components/LumosFaucet";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [lumosfaucetContract, setlumosfaucetContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);


  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        setSigner(provider.getSigner());
        setlumosfaucetContract(faucetContract(provider));
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {

          setSigner(provider.getSigner());
          setlumosfaucetContract(faucetContract(provider));
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getLMSTokenHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");

    try {
      const lumosfaucetContractWithSigner = lumosfaucetContract.connect(signer);

      const checkRequest =  await lumosfaucetContractWithSigner.isAccessibleToMint();
      console.log(checkRequest);

      if(checkRequest){
        const resp = await lumosfaucetContractWithSigner.requestTokens();
        setWithdrawSuccess("Lumos tokens minted successfully");
        setTransactionData(resp.hash);
      }else{
        setWithdrawError("Sorry! We only send 3 Lumos tokens every 24 hours. Please try again after 24 hours from your original request"); 
      }
  
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
              <button className="connect-wallet-button" onClick={connectWallet}>
                <span>
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
      </nav>
      <section className="lumos-hero">
          <div className="content-container">
            <h1 className="title">Lumos Faucet</h1>
            <p className="subtitle">Fast and reliable. 3 LMS/day.</p>
            <div className="wallet-action-container">
              <input
                className="wallet-input"
                type="text"
                placeholder="Enter your wallet address (0x...)"
                defaultValue={walletAddress}
              />
              <button className="action-button" onClick={getLMSTokenHandler} disabled={!walletAddress}>
                SEND ME LMS
              </button>
            </div>
            <div>
              {withdrawError && <div className="error-message">{withdrawError}</div>}
              {withdrawSuccess && <div className="success-message">{withdrawSuccess}</div>}
            </div>
            <div className="transaction-box">
              <article className="transaction-panel">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-content">
                  <p>
                    {transactionData ? `Transaction hash: ${transactionData}` : "Your Transactions"}
                  </p>
                </div>
              </article>
            </div>
        </div>
      </section>
    </div>
  );
}

export default App;