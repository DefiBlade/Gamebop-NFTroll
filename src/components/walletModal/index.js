import react, { useState, useEffect } from "react"
import Modal from 'react-modal'
import './index.scss'
import metamaskImg from '../../assets/img/metamask.png'
import walletconnectImg from '../../assets/img/walletConnectIcon.svg'
import { Loader } from "../loader"
import { useWeb3React } from "@web3-react/core"
import { injected, walletconnect } from "../../connectors"
import { ErrorMessages } from "../../constants"
import { useNavigate } from "react-router-dom"

export const WalletModal = ({ isOpen, onClose }) => {
    const { account, activate, deactivate, error } = useWeb3React()
    const [ isConnecting, setIsConnecting ] = useState(false)
    const navigate = useNavigate();

    const onclickConnect = async () => {
        setIsConnecting(true)

        try {
            await activate( injected )
        } catch( err ) {
            console.error(err)
        }
        
        setIsConnecting(false)
    }

    const onclickWalletconnect = async() => {
        setIsConnecting(true)

        try {
            await activate( walletconnect )
        } catch( err ) {
            console.error(err)
        }
        
        setIsConnecting(false)
    }

    const onClickDisconnect = () => {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }

        onClose()
    }

    const isMetamaskInstalled = () => {
        if (typeof window.ethereum !== 'undefined') {
            return true
        }

        return false
    }

    return (
        <div id="modal_app">
            <Modal 
                isOpen={ isOpen } 
                onRequestClose={ onClose }
                appElement={document.getElementById('modal_app')} 
                className='walletModal'
                overlayClassName="Overlay"
                >
                <div className="flex flex-col justify-between items-center h-full">
                    <div className="text-white text-2xl font-bold mb-8">Connect Wallet</div>

                    { !isMetamaskInstalled() ? (
                        <div className="walletStatus text-white px-4 py-1 text-center"> 
                            In case you don’t have, you will need to set up a <a className="text-blue-400" href="https://metamask.io" target={'_blank'}>Metamask</a> wallet.
                        </div>
                    ) :  account ? (
                        <div>
                            <div className="walletStatus text-white px-4 py-4 text-center" style={{ cursor: 'pointer' }} onClick={() => {onClose(); navigate('/mynft')}}>
                                My Collections
                            </div>
                            <div className="walletStatus text-white px-4 py-4 text-center"> 
                                <div>
                                    You have connected with <span className="font-bold">{ account }</span>
                                </div>
                                <button className="mt-4 p-4 py-2 disconnectBtn" onClick={onClickDisconnect}>Disconnect</button>
                            </div>
                        </div>
                    ) : isConnecting ? (
                        <div className="text-white px-4 py-1 flex"> 
                            <Loader />
                            <span className="ml-2">Connecting...</span>
                        </div>
                    ) : (
                        <div style={{ width: 150 }}>
                            <button onClick={onclickConnect} className="walletBtn flex justify-center items-center p-4 mb-4"><img src={metamaskImg} alt="pic"></img></button>
                            <button onClick={onclickWalletconnect} className="walletBtn flex justify-center items-center p-4 mb-4"><img className="walletconnectImg" src={walletconnectImg} alt="pic"></img></button>
                        </div>
                    ) }

                    { error ? (
                        <div className="walletStatus text-white px-4 py-1 text-center text-red-400 mt-2"> 
                            { ErrorMessages[ error.code ] ? ErrorMessages[ error.code ] : error.message }
                        </div>
                    ) : null }
                </div>
            </Modal>
        </div>
    )
}