import React, { useState } from "react"
import { ethers } from "ethers"
import "../styles/listing.css"

import { abi } from "../constants/index"

export default function Listing(props) {
    const [meta, setMeta] = useState("")
    const [assetName, setAsset] = useState("")
    const [desc, setDesc] = useState("")
    const [image, setImage] = useState("")

    const owner =
        props.seller.slice(0, 5) +
        "..." +
        props.seller.slice(props.seller.length - 4, props.seller.length)

    async function getMeta() {
        const provider = new ethers.providers.AlchemyProvider("goerli")
        const nft = new ethers.Contract(props.erc721, abi.nft, provider)

        let ipfs = await nft.tokenURI(props.tokenId)
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
        <div className="listing">
            <p className="id">#{props.tokenId}</p>
            <p className="owned">Owned by {owner}</p>
            <img
                src={`https://gateway.pinata.cloud/ipfs/${image}`}
                alt="NFT"
                className="art"
            />
            <p className="price">{ethers.utils.formatEther(props.price)} ETH</p>
            <div className="desc">
                <h2 className="name">{assetName}</h2>
                <h2 className="description">{desc}</h2>
            </div>
        </div>
    )
}
