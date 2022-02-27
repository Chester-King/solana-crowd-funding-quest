// new PublicKey("6eU6qEDKYTfjCGG6g3r5JyzPzgzo6HwFPVgQ7LKYfgWE"),

const {
    Connection,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey,
    SystemProgram,
    Keypair,
  } = require('@solana/web3.js');
//   var path = require('path');
  const fs   = require('mz/fs');
//   global.appRoot = path.resolve(__dirname);
  
  async function establishConnection() {
    const rpcUrl = 'http://localhost:8899';
    connection = new Connection(rpcUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', rpcUrl, version);
  }
  
  async function createKeypairFromFile() {
    const secretKeyString = await fs.readFile("~/.config/solana/id.json", {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  }
  
  async function createAccount() {
  
    const rpcUrl = 'http://localhost:8899';
    connection = new Connection(rpcUrl, 'confirmed');
    const signer = await createKeypairFromFile();
    const newAccountPubkey = await PublicKey.createWithSeed(
      signer.publicKey,
      "campaign1",
      new PublicKey("6eU6qEDKYTfjCGG6g3r5JyzPzgzo6HwFPVgQ7LKYfgWE"),
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      1024,
    );
    const instruction = SystemProgram.createAccountWithSeed({
      fromPubkey: signer.publicKey,
      basePubkey: signer.publicKey,
      seed: "campaign1",
      newAccountPubkey,
      lamports,
      space: 1024,
      programId : new PublicKey("6eU6qEDKYTfjCGG6g3r5JyzPzgzo6HwFPVgQ7LKYfgWE"),
    });
    const transaction = new Transaction().add(
      instruction
    );
  
    console.log(`The address of campaign1 account is : ${newAccountPubkey.toBase58()}`);
  
    await sendAndConfirmTransaction(connection, transaction, [signer]);
  
  }
  
  
  
  establishConnection();
  createAccount();