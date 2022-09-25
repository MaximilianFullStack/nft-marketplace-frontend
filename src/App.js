import React from "react"
import "./styles/main.css"
import Navbar from "./components/Navbar"
import Listings from "./components/Listings"

export default function App() {
    return (
        <>
            <Navbar />
            <Listings />
        </>
    )
}
