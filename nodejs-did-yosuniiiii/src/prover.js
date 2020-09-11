const prover = {};
var {
  log,
  logProver,
  logOK,
  logKO,
  sendToIssuer,
  sendToVerfier,
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
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : false});
var readline = require("readline-sync");
const { proverGetCredential } = require("indy-sdk");

// const { json } = require("body-parser");

// app.use(express.urlencoded({ extended: false }));

//Main code starts here


module.exports = function (app){

  app.use(bodyParser.json());


  async function run() {

    log("Set protocol version 2");
    await indy.setProtocolVersion(2);
  };
  
  
  
    
  
    app.get("/", function(req,res){
      res.render("prover_1.ejs");
    });

    app.post("/No1",urlencodedParser,async function(req,res){
      log("Prover Open connections to ledger");
    var name = req.body.name;

      const poolName = name + "-pool-sandbox";
      const poolGenesisTxnPath = await util.getPoolGenesisTxnPath(poolName);
      const poolConfig = { genesis_txn: poolGenesisTxnPath };
      prover.poolHandle=await indy.openPoolLedger(poolName, poolConfig); 
      

      log("Prover Open Wallet");
      const walletConfig = { id: "prover" + ".wallet" };
      const walletCredentials = { key: 'prover' + ".wallet_key" };
      prover.wallet=await indy.openWallet(walletConfig, walletCredentials);

      log("Prover Create DID");

      prover.did = await createAndStoreMyDid(
    
        prover.wallet, "000000000000000000000000Steward2" );
    
    
    
      logKO("\tProver's DID is: " + prover.did);
    

      res.redirect("No2");
    
    });

    app.get("/No2",async function(req,res){

      var prover_did = {
        did : prover.did
      };
      
    

      res.render("prover_2.ejs", prover_did);


    });
  
    app.post("testtesttest", async function(req, res){


    // });

// };
// // ##########here !! #########



  // prover.poolHandle = await createAndOpenPoolHandle("prover");


  // prover.wallet = await createAndOpenWallet("prover");

  logOK("Waiting for issuer to send schema ID...");
  while (prover.schemaId == undefined) {
    await sleep(2000);
  }

  logOK("Waiting for issuer to send credential definition ID...");
  while (prover.credDefId == undefined) {
    await sleep(2000);
  }

  logProver("Prover gets schema from ledger");
  prover.schema = await getSchemaFromLedger(
    prover.poolHandle,
    prover.did,
    prover.schemaId
  );



  
  logOK("Waiting for issuer to send credential offer...");
  while (prover.credOffer == undefined) {
    await sleep(2000);
  }

  logProver("Prover gets credential definition from ledger");
  prover.credDefId = prover.credOffer["cred_def_id"];
  prover.credDef = await getCredDefFromLedger(
    prover.poolHandle,
    prover.did,
    prover.credDefId
  );

  logProver("Prover creates master secret");
  prover.masterSecretId = await indy.proverCreateMasterSecret(
    prover.wallet,
    undefined
  );

  readline.question(
    "\n\nPress Enter to Create Credential Request and send to Issuer: "
  );

  logProver("Prover creates credential request");
  {
    const [credReq, credReqMetadata] = await indy.proverCreateCredentialReq(
      prover.wallet,
      prover.did,
      prover.credOffer,
      prover.credDef,
      prover.masterSecretId
    );
    prover.credReq = credReq;
    prover.credReqMetadata = credReqMetadata;
  }

  log(
    "Transfer credential request from 'Prover' to 'Issuer' (via HTTP or other) ..."
  );
  await sendToIssuer("credReq", JSON.stringify(prover.credReq));

  logOK("\n\nWaiting for Credential from Issuer...");
  while (prover.cred == undefined) {
    await sleep(2000);
  }

  logProver("Prover stores credential which was received from issuer");
  await indy.proverStoreCredential(
    prover.wallet,
    undefined,
    prover.credReqMetadata,
    prover.cred,
    prover.credDef,
    undefined
  );


  for (const [key, value] of Object.entries(prover.cred)) {
    console.log(`${key} : ${value}`);
  }

  logOK("\n\nWaiting for proof request from verifier!");
  while (prover.proofReq == undefined) {
    await sleep(2000);
  }

  logProver("Prover gets credentials for proof request");
  {
    const searchHandle = await indy.proverSearchCredentialsForProofReq(
      prover.wallet,
      prover.proofReq,
      undefined
    );

    const credentialsForAttr1 = await indy.proverFetchCredentialsForProofReq(
      searchHandle,
      "attr1_referent",
      10
    );
    prover.credInfoForAttribute = credentialsForAttr1[0]["cred_info"];

    const credentialsForPredicate1 = await indy.proverFetchCredentialsForProofReq(
      searchHandle,
      "predicate1_referent",
      10
    );
    prover.credInfoForPredicate = credentialsForPredicate1[0]["cred_info"];

    await indy.proverCloseCredentialsSearchForProofReq(searchHandle);
  }

  logProver("Prover creates proof for proof request");
  prover.requestedCredentials = {
    self_attested_attributes: {},
    requested_attributes: {
      attr1_referent: {
        cred_id: prover.credInfoForAttribute["referent"],
        revealed: true
      }
    },
    requested_predicates: {
      predicate1_referent: {
        cred_id: prover.credInfoForPredicate["referent"]
      }
    }
  };
  prover.schemas = {
    [prover.schemaId]: prover.schema
  };
  prover.credDefs = {
    [prover.credDefId]: prover.credDef
  };

  prover.revocStates = {};

  prover.proof = await indy.proverCreateProof(
    prover.wallet,
    prover.proofReq,
    prover.requestedCredentials,
    prover.masterSecretId,
    prover.schemas,
    prover.credDefs,
    prover.revocStates
  );

  logOK("Transfer proof from 'Prover' to 'Verifier' (via HTTP or other) ...");
  await sendToVerfier("proof", JSON.stringify(prover.proof));

  readline.question(
    "\n\nProof successfully transfered from prover to verifer, Press enter to terminate this session, delete prover wallet, pool handle and teriminate program:"
  );

  // log("Prover close and delete wallets");
  // await closeAndDeleteWallet(prover.wallet, "prover");

  // log("Prover close and delete poolHandles");
  // await closeAndDeletePoolHandle(prover.poolHandle, "prover");

    });

    // ####################herererere!!!!!!!!!!! post ##########




app.post("/prover", (req, res) => {
  let type = req.body.type;
  let message = req.body.message;
  switch (type) {
    case "schemaId":
      prover.schemaId = message;
      break;
    case "credDefId":
      prover.credDefId = message;
      break;
    case "credOffer":
      prover.credOffer = JSON.parse(message);
      break;
    case "cred":
      prover.cred = JSON.parse(message);
      break;
    case "proofReq":
      prover.proofReq = JSON.parse(message);
    default:
      break;
  }


  
  res.status(200).send({ status: 200 });
 });

    

};

// ##########here !! #########

// app.listen(3001, () => {
//   console.log("Prover started on port 3001!");
//   run();
// });
