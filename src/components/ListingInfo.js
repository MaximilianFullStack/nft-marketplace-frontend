import React, { useState } from "react"
import { ethers } from "ethers"
import "../styles/info.css"

import { abi } from "../constants/index"

export default function ListingInfo() {
    const [meta, setMeta] = useState("")
    const [assetName, setAsset] = useState("")
    const [desc, setDesc] = useState("")
    const [image, setImage] = useState("")

    const url = window.location.href
    const address = url.substring(url.indexOf("/", 8) + 1, url.lastIndexOf("/"))
    const tokenId = url.substring(url.lastIndexOf("/") + 1)

    async function getMeta() {
        const provider = new ethers.providers.AlchemyProvider("goerli")
        const nft = new ethers.Contract(address, abi.nft, provider)

        let ipfs = await nft.tokenURI(tokenId)
        ipfs = ipfs.substring(ipfs.lastIndexOf("ipfs://") + 7)
        fetch(`https://gateway.pinata.cloud/ipfs/${ipfs}`).then((r) => {
            r.text().then((d) => setMeta(d))
        })

        let obj = await JSON.parse(meta)
        setAsset(obj.name)
        setDesc(obj.description)
        obj = obj.image
        obj = obj.substring(obj.lastIndexOf("/") + 1)
        setImage(obj)
    }
    getMeta()

    return (
        <div className="page">
            <div className="meta">
                <img
                    src={`https://gateway.pinata.cloud/ipfs/${image}`}
                    alt="NFT"
                    className="nft"
                />
                <div className="nameId">
                    <h1>{assetName}</h1>
                    <h1>#{tokenId}</h1>
                </div>
                <h3 className="desc">{desc}</h3>
            </div>
            <div className="actions">Buy Item</div>
        </div>
    )
}
