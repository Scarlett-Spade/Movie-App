import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

export default function App() {
  //A state variable used to store users' public wallet address.
  const [currAccount, setCurrentAccount] = React.useState("")

  const contractAddress = "0xf91E436EC696Ed94bA829fa487b2887e8714fFD0"
  
  const contractABI = abi.abi
  

  //This is the loading message after submitting---
  const [loading, setLoading] = React.useState(false); 

  //This is the textbox--------------------------
  const [message, setMessage] = React.useState("")

  //Connects to the provider------------------------
  const [allWaves, setAllWaves] = React.useState([])

//Connects to the provider------------------------
 async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves()

    let wavesCleaned = []
    waves.forEach(wave => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
    })
    
    setAllWaves(wavesCleaned)

    waveportalContract.on("NewWave", (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message)
      setAllWaves(oldArray => [...oldArray, {
        message: message,
        address: from,
        timestamp: new Date(timestamp *1000)
      }])
    })
  }


  const checkIfWalletIsConnected = () => {
    //To make sure there's access to window.ethereum.
    const { ethereum } = window
      console.log('CHECKING FOR METAMASK WALLET')
    if (!ethereum) {
      console.log("CONNECT YOUR METAMASK WALLET")
      return
    } else {
      console.log("YOUR METAMASK WALLET IS CONNECTED", ethereum)
    }

    //To check if there's access to an authorized user wallet------------------------------------------
    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        //There could be multiple accounts. Check for one.
        if(accounts.length !== 0) {
          //Grab the first account there's access to.
          const account = accounts[0]
          console.log("FOUND AN AUTHORIZED ACCOUNT: ", account)
          //Store the authorized user wallet address.
          setCurrentAccount(account)
          getAllWaves()
        } else {
          console.log("NO AUTHORIZED ACCOUNT FOUND")
        }
      })
  }

const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("YOU NEED METAMASK!")
      return
    }

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("CONNECTED", accounts[0])
        setCurrentAccount(accounts[0])
        getAllWaves()
      })
      .catch(err => console.log(err))
  }

 //This is the code to "wave"------------------------
 const wave = async (message = "") => {
    console.log(message)
    setLoading(true)
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("Retreived total wave count...", count.toNumber())

    const waveTxn = await waveportalContract.wave(message, { gasLimit:3000000});
    console.log("Mining...", waveTxn.hash)
    setLoading(true)

    await waveTxn.wait()
    //This clears the text box after a submission.
    setMessage("")
    console.log("Mined -- ", waveTxn.hash)
    setLoading(false)

    count = await waveportalContract.getTotalWaves()
    console.log("Retreived total wave count...", count.toNumber())
  }

// This runs the function when the page loads -------
React.useEffect(() => {
  checkIfWalletIsConnected()
  //empty dependency array means this effect will only run once.
  }, [])

//HTML-----------------------------------------------

return (
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
      </div>

<br></br>

      {currAccount ? null: (
        <button 
          className="metaWallet" 
          onClick={connectWallet}> CONNECT YOUR WALLET
        </button>
      )}

      {currAccount ? <img src="https://media.giphy.com/media/BpDhtnNEG3Objj5441/giphy.gif" alt ="Michael Myers" width="60" height="50" /> : null}

      <div className ="bio">
        <p>I'M SCARLETT, A UX DEVELOPER & FILM STUDENT LEARNING WEB3.</p>

        <p>CONNECT YOUR ETHEREUM WALLET WITH METAMASK TO SEND ME A MOVIE OR SHOW RECOMMENDATION USING RINKEBY(FREE)!</p>
      </div>

      <br></br>
      <br></br>

    
      <div className="movieText">
        <textarea
          disabled={!currAccount}
          class="input"
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="TYPE" name="name" required />      
      </div>

			<button 
        disabled={!currAccount}
        className="movieButton" 
        onClick={() => wave(message)}>
          
          {loading ? '' : 'SEND YOUR MOVIE RECOMMENDATION'}
          
          {loading && <span>
          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />

          <img src="https://media.giphy.com/media/j9i48Xf0ZSCZFYHVYK/giphy.gif" alt ="Michael Myers" width="60" height="50" />
          </span>}
      </button>
			</div>

      <br></br>
      <br></br>

      <div className="waves">
      {allWaves.map((wave, index) => {
        return (
          <div style={{backgroundColor: "#7B6A93", marginTop: "16px", padding: "8px", borderRadius:"5px", opacity: "0.6", color: "#ffffff",}}>
          
            <span className="buttonEmoji" 
                  role="img"              aria-label="Film Projector"
                  style={{backgroundColor: "#462F6D",
                  borderRadius:"5px",
                  padding: "4px",
                  margin: "2px"}}   
                  >📽️ MOVIE: {wave.message} 
            </span>
             <br></br>

            <span>FROM: {wave.address}></span>
            <span>TIME: {wave.timestamp.toString()}</span>
          </div>
        )
      })}
      </div>
    </div>
)
}