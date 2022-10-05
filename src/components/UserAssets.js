import React, { useState } from "react"
import { ethers } from "ethers"
import "../styles/user.css"
import OwnedItem from "./OwnedItem"
import { Network, Alchemy } from "alchemy-sdk"

const settings = {
    apiKey: "demo",
    network: Network.ETH_GOERLI,
}

const alchemy = new Alchemy(settings)

export default function UserAssets() {
    const [nfts, setNfts] = useState([{}])

    let provider = new ethers.providers.Web3Provider(window.ethereum)

    async function getOwnedAssets() {
        const signer = await provider.getSigner(0)
        const signerAddress = await signer.getAddress()
        const owned = await alchemy.nft.getNftsForOwner(signerAddress)
        setNfts(owned.ownedNfts)
    }
    window.onload = getOwnedAssets

    const items = nfts.map((item, index) => <OwnedItem key={index} {...item} />)
    return (
        <>
            <div className="contents">
                <h2>Your NFTs</h2>
                <div className="recentListings">{items}</div>
            </div>
        </>
    )
}
