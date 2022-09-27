import React from "react"
import Navbar from "../components/Navbar"
import ListingInfo from "../components/ListingInfo"
import { useLocation } from "react-router-dom"
import queryString from "query-string"

export default function ListingPage() {
    const { search } = useLocation()
    const { collection } = queryString.parse(search)

    return (
        <>
            <Navbar />
            <ListingInfo />
        </>
    )
}
