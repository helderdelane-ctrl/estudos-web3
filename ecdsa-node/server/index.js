const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "041b201d192d72c5608c72bded0efa243fe9ac5b52bd393b940c5497c134e89974a739ab2488f0db987c4a89329a5e57fde3201cb601366733bcf0fe225633ef72": 100,
  "04925a6d073d50d0af04cd5beb1797df58643e59cbfccb39fe1977d4c8bbb2c1e610ab59796c32dccba4c7203f3f936e19a8a8b2177b38b2d58d5fa4601f8b1c3d": 50,
  "048e4723287fefafd10e17d023c075fa3c18c4f6b4b2fb79181e0389f26bdb91a911b2813857f8ef63f7094304fd69d443ea441641b865467cc44e3e0c70c81c4b": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signature, recoveryBit } = req.body;
  const { sender, recipient, amount } = transaction;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  try {
    const messageHash = keccak256(utf8ToBytes(JSON.stringify(transaction)));
    const publicKey = toHex(secp.recoverPublicKey(messageHash, hexToBytes(signature), recoveryBit));
    if (publicKey !== sender) {
      return res.status(400).send({message: "Invalid signature!"});
    }
    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    }
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });

  } catch(error) {
    console.error("Error in the server processing the transaction:", error)
    res.status(400).send({message: "Error validating the transaction."});  
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
