import React, { useState } from "react"
import { ethers } from "ethers"
import "../styles/listing.css"

import { abi } from "../constants/index"

export default function Listing(props) {
    const [meta, setMeta] = useState("")
    const [assetName, setAsset] = useState("")
    const [desc, setDesc] = useState("")
    const [image, setImage] = useState("")

    const [isOwner, setIsOwner] = useState(false)

    let provider = new ethers.providers.Web3Provider(window.ethereum)

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

    async function checkOwner() {
        const signer = await provider.getSigner(0)
        let address = await signer.getAddress()
        if (address.toLowerCase() === props.seller) {
            setIsOwner(true)
        }
    }
    checkOwner()

    return (
        <div className="listing">
            <a href={`/${props.erc721}/${props.tokenId}`}>
                <div className="listing" style={{ margin: "0" }}>
                    <p className="id">#{props.tokenId}</p>
                    {isOwner ? (
                        <p className="owned">Owned by You</p>
                    ) : (
                        <p className="owned">Owned by {owner}</p>
                    )}

                    <img
                        src={`https://gateway.pinata.cloud/ipfs/${image}`}
                        alt="NFT"
                        className="art"
                    />
                    <p className="price">
                        {ethers.utils.formatEther(props.price)} ETH
                    </p>
                    <div className="desc">
                        <h2 className="name">{assetName}</h2>
                        <h2 className="description">{desc}</h2>
                    </div>
                </div>
            </a>
        </div>
    )
}
