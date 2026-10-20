import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privatekey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    try {
      if (privateKey.length === 64) {
      const address = toHex(secp.getPublicKey(hexToBytes(privateKey)));
      setAddress(address);
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (ex) {
      console.error("ERRO DETALHADO NO CATCH:", ex);
      setAddress("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key" value={privatekey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address? `${address.slice(0, 10)}...` : ""}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
