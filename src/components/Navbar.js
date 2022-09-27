import React from "react"
import "../styles/navbar.css"
import ConnectMenu from "./Connect"

export default function Navbar() {
    return (
        <div className="bar">
            <a href="/" className="title">
                <h1 className="title">NFT Marketplace</h1>
            </a>
            <div className="buttons">
                <a href="/">
                    <h2>Home</h2>
                </a>
                <a href="/list">
                    <h2>Sell NFT</h2>
                </a>
            </div>
            <div className="con">
                <ConnectMenu />
            </div>
        </div>
    )
}
