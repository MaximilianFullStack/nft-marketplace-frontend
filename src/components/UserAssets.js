import React, { useState } from "react"
import { ethers } from "ethers"
import "../styles/user.css"
import { contractAddresses, abi } from "../constants/index"

export default function UserAssets() {
    const [address, setAddress] = useState("")
    const [tokenId, setTokenId] = useState("")
    const [price, setPrice] = useState("")

    let provider = new ethers.providers.Web3Provider(window.ethereum)

    async function list() {
        if (address !== "" && tokenId !== "") {
            const signer = await provider.getSigner(0)
            const signerAddress = await signer.getAddress()
            const nftContract = await new ethers.Contract(
                address,
                abi.nft,
                signer
            )

            const isApproved = await nftContract.isApprovedForAll(
                signerAddress,
                contractAddresses.marketplace
            )

            if (isApproved === true) {
                const marketplace = new ethers.Contract(
                    contractAddresses.marketplace,
                    abi.marketplace,
                    signer
                )

                try {
                    await marketplace.listItem(
                        address,
                        tokenId,
                        ethers.utils.parseEther(price.toString())
                    )
                } catch (e) {
                    console.log(e)
                }
            } else {
                await nftContract.setApprovalForAll(
                    contractAddresses.marketplace,
                    true
                )
            }
        } else {
            console.warn("Address or tokenId is empty")
        }
    }

    return (
        <div className="contents">
            <h2>List NFT</h2>
            <div className="inputs">
                <input
                    placeholder="Address"
                    onChange={(value) => {
                        setAddress(value.target.value)
                    }}
                />
                <input
                    type="number"
                    min="0"
                    placeholder="Token Id"
                    onChange={(value) => {
                        setTokenId(value.target.value)
                    }}
                />
                <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    onChange={(value) => {
                        setPrice(value.target.value)
                    }}
                />
                <button onClick={list} className="listButton">
                    List
                </button>
            </div>
        </div>
    )
}
