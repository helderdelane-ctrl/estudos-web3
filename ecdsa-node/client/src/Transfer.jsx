import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, hexToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const transaction = {
        sender: address,
        recipient,
        amount: parseInt(sendAmount)
      };
      const message = JSON.stringify(transaction);
      const messageHash = keccak256(utf8ToBytes(message));
      const signatureBytes = await secp.sign(messageHash, hexToBytes(privateKey), { recovered : true });

      const signatureHex = toHex(signatureBytes[0]); // A assinatura propriamente dita em formato hexadecimal
      const recoveryBit = signatureBytes[1];
      const {
        data: { balance },
      } = await server.post(`send`, {
        transaction,
        signature: signatureHex,
        recoveryBit
      });
      setBalance(balance);

    } catch (error) {
      console.error(error);
      alert("Transaction failed!")
    }

  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
