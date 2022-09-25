import React, { useState } from "react"
import { ethers } from "ethers"
import ConnectButton from "./MetamaskButton"
import "../styles/connect.css"

export default function ConnectMenu() {
    const [openStatus, setOpen] = useState(false)
    const [wallet, setWallet] = useState("")

    React.useEffect(() => {
        const checkConnection = async () => {
            let provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = await provider.getSigner(0)

            if (signer === undefined) {
                setWallet("")
            } else {
                let address = await signer.getAddress()
                address =
                    address.slice(0, 5) +
                    "..." +
                    address.slice(address.length - 4, address.length)
                setWallet(address)
            }
        }
        checkConnection()
    }, [])

    window.ethereum.on("accountsChanged", () => {
        window.location.reload()
    })

    window.ethereum.on("chainChanged", () => {
        window.location.reload()
    })

    function Menu() {
        return (
            <>
                <div className="overlay" onClick={() => setOpen(!openStatus)} />
                <div className="walletMenu">
                    <div className="header">
                        <h4 className="selectText">Select Wallet</h4>
                    </div>
                    <ConnectButton />
                </div>
            </>
        )
    }

    return (
        <>
            {wallet === "" ? (
                <>
                    <button
                        className="menuButton"
                        onClick={() => setOpen(!openStatus)}
                    >
                        Connect
                    </button>
                    {openStatus ? Menu() : <></>}
                </>
            ) : (
                <button className="menuButton">{wallet}</button>
            )}
        </>
    )
}
