import React from "react"
import meta from "../images/metamask.png"
import ledger from "../images/ledger.png"
import connect from "../images/wallet-connect.png"
import "../styles/connect.css"

export default function ConnectButton() {
    async function connectWalletHandeler() {
        if (window.ethereum !== "undefined") {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((result) => {
                    accountChangedHandler(result[0])
                })
        } else {
            console.log("Install metamask")
        }
    }

    function accountChangedHandler() {}

    return (
        <div className="wallets">
            <button onClick={connectWalletHandeler} className="connectButton">
                <img src={meta} alt="logo" />
                MetaMask
            </button>
            <button className="connectButton">
                <img src={ledger} alt="logo" style={{ padding: "5px" }} />
                Ledger
            </button>
            <button className="connectButton">
                <img src={connect} alt="logo" />
                WalletConnect
            </button>
        </div>
    )
}
