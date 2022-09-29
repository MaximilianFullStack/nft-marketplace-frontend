import React, { useState } from "react"
import { ethers } from "ethers"
import "../styles/info.css"
import { gql, useQuery } from "@apollo/client"
import { contractAddresses, abi } from "../constants/index"

export default function ListingInfo() {
    //meta data
    const [meta, setMeta] = useState("")
    const [assetName, setAsset] = useState("")
    const [desc, setDesc] = useState("")
    const [image, setImage] = useState("")

    const [updatedPrice, setUpdatedPrice] = useState(null)
    const [isOwner, setIsOwner] = useState(false)

    let provider = new ethers.providers.Web3Provider(window.ethereum)

    const url = window.location.href
    const address = url.substring(url.indexOf("/", 8) + 1, url.lastIndexOf("/"))
    const tokenId = url.substring(url.lastIndexOf("/") + 1)

    async function buyItem() {
        const signer = await provider.getSigner()
        const signerAddr = await signer.getAddress()
        const userBal = await provider.getBalance(signerAddr)

        const marketplace = new ethers.Contract(
            contractAddresses.marketplace,
            abi.marketplace,
            signer
        )
        const price = await marketplace.listingPrice(address, tokenId)
        if (
            ethers.utils.formatEther(userBal) > ethers.utils.formatEther(price)
        ) {
            try {
                await marketplace.buyItem(address, tokenId, { value: price })
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log(userBal.toString())
            console.warn("User balance too low.")
        }
    }

    async function updateListing() {
        const signer = await provider.getSigner()
        const marketplace = new ethers.Contract(
            contractAddresses.marketplace,
            abi.marketplace,
            signer
        )
        if (updatedPrice !== null) {
            try {
                await marketplace.updateListing(
                    address,
                    tokenId,
                    ethers.utils.parseEther(updatedPrice)
                )
            } catch (e) {
                console.log(e)
            }
        } else {
            console.warn("Input cannot be empty")
        }
    }

    async function cancelListing() {
        const signer = await provider.getSigner()
        const marketplace = new ethers.Contract(
            contractAddresses.marketplace,
            abi.marketplace,
            signer
        )

        try {
            await marketplace.cancelListing(address, tokenId)
        } catch (e) {
            console.log(e)
        }
    }

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

    const GET_ITEM = gql`
        {
            activeItems(where: { erc721: "${address}", tokenId: "${tokenId}" }) {
                id
                buyer
                seller
                erc721
                tokenId
                price
            }
        }
    `
    const { loading, error, data: item } = useQuery(GET_ITEM)
    if (loading)
        return (
            <div className="contents">
                <h2>Loading...</h2>
            </div>
        )
    if (error) return <div className="contents">{error.message}</div>

    async function checkOwner() {
        const signer = await provider.getSigner(0)
        let address = await signer.getAddress()
        if (address.toLowerCase() === item.activeItems[0].seller) {
            setIsOwner(true)
        }
    }
    checkOwner()

    const owner =
        item.activeItems[0].seller.slice(0, 5) +
        "..." +
        item.activeItems[0].seller.slice(
            item.activeItems[0].seller.length - 4,
            item.activeItems[0].seller.length
        )

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
                <h3 style={{ margin: "4px" }}>
                    {ethers.utils.formatEther(item.activeItems[0].price)} ETH
                </h3>
                {!isOwner ? (
                    <>
                        <h4 className="owner">Owned by {owner}</h4>
                        <button onClick={buyItem} className="buyButton">
                            Buy Item
                        </button>
                    </>
                ) : (
                    <>
                        <h4 className="owner">Owned by You</h4>
                        <input
                            type="number"
                            min="0"
                            className="updateInput"
                            placeholder="Updated Price"
                            onChange={(value) => {
                                setUpdatedPrice(value.target.value)
                            }}
                        />
                        <button onClick={updateListing} className="buyButton">
                            Update Listing
                        </button>
                        <button
                            onClick={cancelListing}
                            className="buyButton"
                            style={{ margin: "12px" }}
                        >
                            Cancel Listing
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
