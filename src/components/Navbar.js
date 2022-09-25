import React from "react"
import "../styles/navbar.css"
import ConnectMenu from "./Connect"

export default function Navbar() {
    return (
        <div className="bar">
            <h1 className="title">NFT Marketplace</h1>
            <div className="buttons">
                <h2>Home</h2>
                <h2>Sell NFT</h2>
            </div>
            <div className="con">
                <ConnectMenu />
            </div>
        </div>
    )
}
