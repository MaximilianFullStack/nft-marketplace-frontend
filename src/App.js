import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./styles/main.css"
import Main from "./pages/Main"
import ListingPage from "./pages/ListingPage"
import Sell from "./pages/Sell"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="" element={<Main />} />
                <Route path="/*" element={<ListingPage />} />
                <Route path="/user" element={<Sell />} />
            </Routes>
        </Router>
    )
}
