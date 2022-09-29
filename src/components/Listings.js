import React from "react"
import "../styles/listing.css"
import Listing from "./Listing"
import { gql, useQuery } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(
            first: 5
            where: { buyer: "0x0000000000000000000000000000000000000000" }
        ) {
            id
            buyer
            seller
            erc721
            tokenId
            price
        }
    }
`

export default function Listings() {
    const { loading, error, data: listedNFTs } = useQuery(GET_ACTIVE_ITEMS)

    if (loading)
        return (
            <div className="contents">
                <h2>Loading...</h2>
            </div>
        )
    if (error) return <div className="contents">{error.message}</div>

    const listing = listedNFTs.activeItems.map((item, index) => (
        <Listing key={index} {...item} />
    ))
    return (
        <>
            {loading || !listedNFTs ? (
                <p>Loading...</p>
            ) : (
                <div className="contents">
                    <h2>Recently Listed</h2>
                    <div className="recentListings">{listing}</div>
                </div>
            )}
        </>
    )
}
