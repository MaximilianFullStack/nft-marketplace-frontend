import React, { useState } from "react"
import "../styles/listing.css"

export default function OwnedItem(props) {
    const [meta, setMeta] = useState("")
    const [art, setArt] = useState("")

    async function getArt() {
        if (props.contract !== undefined) {
            let ipfs = props.tokenUri.raw
            ipfs = ipfs.substring(ipfs.lastIndexOf("ipfs://") + 7)
            fetch(`https://gateway.pinata.cloud/ipfs/${ipfs}`).then((r) => {
                r.text().then((d) => setMeta(d))
            })

            let obj = await JSON.parse(meta)
            obj = obj.image
            obj = obj.substring(obj.lastIndexOf("/") + 1)
            setArt(obj)
        }
    }
    getArt()

    return (
        <div className="listing">
            {props.contract !== undefined ? (
                <a href={`/${props.contract.address}/${props.tokenId}`}>
                    <div className="listing" style={{ margin: "0" }}>
                        <p className="id">#{props.tokenId}</p>
                        <p className="owned">Owned by You</p>
                        <img
                            src={`https://gateway.pinata.cloud/ipfs/${art}`}
                            alt="NFT"
                            className="art"
                        />
                        <p className="price">{} </p>
                        <div className="desc">
                            <h2 className="name">{props.title}</h2>
                            <h2 className="description">{props.description}</h2>
                        </div>
                    </div>
                </a>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}
