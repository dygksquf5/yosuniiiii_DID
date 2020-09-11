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
// const express = require("express");
// const app = express();
var readline = require("readline-sync");
const { openWallet } = require("indy-sdk");


const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : false});


// app.use(bodyParser.urlencoded({ extended: true }));

//Main code starts here
async function verifierVerifyProof(proofReq, proof, schemas, credDefs) {
  return indy.verifierVerifyProof(proofReq, proof, schemas, credDefs, {}, {});
}
module.exports = function (app){


async function run() {
  log("Set protocol version 2");
  await indy.setProtocolVersion(2);
};



    app.get("/", function(req,res){
      res.render("test.ejs")
    });

    app.post("/test3",urlencodedParser,async function(req,res){
      log("Verifier Open connections to ledger");
    var name = req.body.name;

      const poolName = name + "-pool-sandbox";
      const poolGenesisTxnPath = await util.getPoolGenesisTxnPath(poolName);
      const poolConfig = { genesis_txn: poolGenesisTxnPath };
      verifier.poolHandle=await indy.openPoolLedger(poolName, poolConfig); 
      
    
      readline.question("press Enter");

  // log("Verifier Open connections to ledger");
  // const poolName = 'verifier' + "-pool-sandbox";
  // const poolGenesisTxnPath = await util.getPoolGenesisTxnPath(poolName);
  // const poolConfig = { genesis_txn: poolGenesisTxnPath };
  // verifier.poolHandle=await indy.openPoolLedger(poolName, poolConfig);


  // verifier.poolHandle = await createAndOpenPoolHandle("verifier");

  // app.post("/verifier",urlencodedParser,async function(req,res){

    log("Verifier Creates Wallet");
    var name = req.body.name;
    const walletConfig = { id: name + ".wallet" };
    const walletCredentials = { key: name + ".wallet_key" };
    verifier.wallet= await indy.openWallet(walletConfig, walletCredentials);
    log(verifier.wallet,"--", walletConfig,"---",walletCredentials);
    
    res.redirect("test4")

  });
  // verifier.wallet= await createAndOpenWallet("verifier");

  app.get("/test4", async function(req,res){
    
    log("Verifier Create DID");
    verifier.did = await createAndStoreMyDid(verifier.wallet,"000000000000000000000000Steward1");
      
    const veri_did= {
      
      did : verifier.did

    } 
    // var veri_did = JSON.stringify(veri_did);
  


    res.render("test4.ejs",veri_did);
  });

  app.get("/test5", async function(req,res){
    res.render("test2.ejs");
  // });

  // app.post("/test5",urlencodedParser,async function(req,res){


    // readline.question("press Enter");
  logKO("\tVerifier's DID is: " + verifier.did);

  verifier.schemaId = readline.question("\nEnter Schema ID: ");
  logVerifier("Verifier gets schema from ledger");
  verifier.schema = await getSchemaFromLedger(
    verifier.poolHandle,
    verifier.did,
    verifier.schemaId
  );

  verifier.credDefId = readline.question("\nEnter Credential Defination ID: ");
  readline.question(
    "\nPress Enter to Create Proof Request and Send to Prover: "
  );

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
