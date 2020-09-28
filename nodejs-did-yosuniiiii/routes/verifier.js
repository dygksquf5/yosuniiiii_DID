const verifier = {};

var {
  log,
  logVerifier,
  logOK,
  logKO,
  sendToProver,
  createAndOpenWallet,
  closeAndDeleteWallet,
  createAndOpenPoolHandle,
  closeAndDeletePoolHandle,
  createAndStoreMyDid,
  getSchemaFromLedger,
  getCredDefFromLedger,
  sleep
} = require("./wallet-ledger-misc");

const indy = require("indy-sdk");
const util = require("./util");
var readline = require("readline-sync");
const { openWallet } = require("indy-sdk");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : true});
var readline = require("readline-sync");
const { render } = require("ejs");
const { error } = require("jquery");
const { json } = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("verifier.db");
const axios = require("axios");
const { response } = require("express");
const cors = require("cors");




module.exports = function (app){
  app.use(bodyParser.json());
  app.use(cors());

    //Main code starts here
    async function verifierVerifyProof(proofReq, proof, schemas, credDefs) {
      return indy.verifierVerifyProof(proofReq, proof, schemas, credDefs, {}, {});
    }


    app.get("/", async function(req,res){
        
        //Main code starts here
      log("Set protocol version 2");
      await indy.setProtocolVersion(2);

      res.render("verifier_login.ejs");
    });

    app.post("/log", urlencodedParser, async function(req,res) {
    
      var user_name = req.body.user_name;
      var password = req.body.password;
  
      req.session.user_name = user_name;
      req.session.password = password;
  
    
      res.redirect("/main");
  
    });
  


    app.get("/main",async function(req,res){

      log("Verifier Open connections to ledger");

      const poolName = "verifier" + "-pool-sandbox";
      const poolGenesisTxnPath = await util.getPoolGenesisTxnPath(poolName);
      const poolConfig = { genesis_txn: poolGenesisTxnPath };
      verifier.poolHandle=await indy.openPoolLedger(poolName, poolConfig); 

      db.serialize(function() {
        const stmt = db.prepare('INSERT INTO verifierID(pool_name, date) VALUES (?,?)');
        const date = new Date();
        const strDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
        
      stmt.run(poolName,strDate);
      stmt.finalize();

      db.each('SELECT aid, pool_name, date FROM verifierID', (err, row) =>{
        
        logVerifier(`${row.aid})  pool_name: ${row.pool_name}  Date: ${row.date}` );
      });
    });


    log("verifier Open Wallet");
    const walletConfig = { id: "verifier" + ".wallet" };
    const walletCredentials = { key: 'verifier' + ".wallet_key" };
    verifier.wallet= await indy.openWallet(walletConfig, walletCredentials);

    //   // verifier.wallet = await createAndOpenWallet("verifier");

    log("verifier Create DID");
    verifier.did = await createAndStoreMyDid(
      verifier.wallet,
      "000000000000000000000000Steward3"
    );
    logKO("\tverifier's DID is: " + verifier.did);
      
      db.get('SELECT * FROM DID', function(err, row){
        if (row.length != 0) {
          console.log("already exist", `${row.DID}`);
        }else {
          db.run('INSERT INTO DID VALUES (?)', [verifier.did]);
          console.log("saved on Database");
        };
      });

      const sql = ('SELECT * FROM DID');
      db.get(sql, (err,row) => {
        if (err){
          return logKO(err.message);
        }
        const test =  `${row.DID}`;
        console.log(test,"you have got DID successfully ");
        const render_data = {
          did : test
        }
        res.render("verifier_main.ejs", render_data)
  
      });
  

  });
  // verifier.wallet= await createAndOpenWallet("verifier");


  app.get("/main2", async function(req,res){
    const sql = ('SELECT * FROM DID');
    db.get(sql, (err,row) => {
      if (err){
        return logKO(err.message);
      }
      const test =  `${row.DID}`;
      console.log(test,"you have got DID successfully ");
      const render_data = {
        did : test
      }
      res.render("verifier_main_2.ejs", render_data)

    });

  });


  app.get("/No2", urlencodedParser ,async function(req,res){
    res.render("verifier_schema.ejs");
  });
  app.post("/No2", urlencodedParser, function(req,res){


    // readline.question("press Enter");
  // logKO("\tVerifier's DID is: " + verifier.did);

// qr need!! but this is a project! thus, we are gonna not use QR scanner due to that this is an web! 

  verifier.schemaId = readline.question("\nEnter Schema ID: ");
  logVerifier("Verifier gets schema from ledger");
  verifier.schema = await getSchemaFromLedger(
    verifier.poolHandle,
    verifier.did,
    verifier.schemaId
  );

  // verifier.credDefId = readline.question("\nEnter Credential Defination ID: ");
  // readline.question(
  //   "\nPress Enter to Create Proof Request and Send to Prover: "
  // );

  logVerifier("Verifier creates proof request");
  const nonce = await indy.generateNonce();
  verifier.proofReq = {
    nonce: nonce,
    name: "proof_req_1",
    version: "0.1",
    requested_attributes: {
      attr1_referent: {
        name: "name",
        restrictions: { cred_def_id: verifier.credDefId }
      }
    },
    requested_predicates: {
      predicate1_referent: {
        name: "age",
        p_type: ">=",
        p_value: 18,
        restrictions: { cred_def_id: verifier.credDefId }
      }
    }
  };
  });
  // ############

  app.post("/", async function(req,res){

  log(
    "Transfer proof request from 'Verifier' to 'Prover' (via HTTP or other) ..."
  );
  await sendToProver("proofReq", JSON.stringify(verifier.proofReq));

  logKO("Waiting for proof from prover...");
  while (verifier.proof == undefined) {
    await sleep(2000);
  }

  logVerifier("Verifier gets credential definition from ledger");
  verifier.credDefId = verifier.proof.identifiers[0]["cred_def_id"];
  verifier.credDef = await getCredDefFromLedger(
    verifier.poolHandle,
    verifier.did,
    verifier.credDefId
  );

  logVerifier("Verifier verify proof");
  verifier.schemas = {
    [verifier.schemaId]: verifier.schema
  };
  verifier.credDefs = {
    [verifier.credDefId]: verifier.credDef
  };
  const proofVerificationResult = await verifierVerifyProof(
    JSON.stringify(verifier.proofReq),
    JSON.stringify(verifier.proof),
    JSON.stringify(verifier.schemas),
    JSON.stringify(verifier.credDefs)
  );
  if (proofVerificationResult) {
    logOK("\nOK : proof is verified as expected :-)");
  } else {
    logKO("\nKO : proof is expected to be verified but it is NOT... :-(");
  }


  readline.question(
    "\n\nVerifier successfully verified proof!, Press enter to terminate this session, delete verifier wallet, pool handle and teriminate program:"
  );
});

  // log("Verifier close and delete wallets");
  // await closeAndDeleteWallet(verifier.wallet, "verifier");

  // log("Verifier close and delete poolHandles");
  // await closeAndDeletePoolHandle(verifier.poolHandle, "verifier");


// run();

app.post("/verifier", (req, res) => {
  let type = req.body.type;
  let message = req.body.message;
  switch (type) {
    case "proof":
      verifier.proof = JSON.parse(message);
      break;
    default:
      break;
  }
  res.status(200).send({ status: 200 });
});

// app.listen(2000, () => {
//   console.log("Verifier started on port 3002!");
//   run();
// });
};
