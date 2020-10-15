const verifier = {};

var {
  log,
  logVerifier,
  logOK,
  logKO,
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


    app.post("/api/log",urlencodedParser, async function(req,res){
        
      log("Set protocol version 2");
      await indy.setProtocolVersion(2);


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
        res.send(test)
  
      });
    });


  




  app.post("/api/proof", urlencodedParser,async function(req,res){


    verifier.proofAPI = req.body.data

    //request issuer!!!! about schemaID !!! 
    async function getschemaId(req,res){
      await axios.post("http://192.168.0.13:3000/api/schemaId")
      .then(response => verifier.schemaId = response.data);
        logKO(verifier.schemaId);
    }
    async function getcredDefId(req,res){
      await axios.post("http://192.168.0.13:3000/api/credDefId")
      .then(response => verifier.credDefId = response.data);
        logKO(verifier.credDefId);
    }

    await getschemaId()
    await getcredDefId()

    logVerifier("Verifier gets schema from ledger");
    verifier.schema = await getSchemaFromLedger(
      verifier.poolHandle,
      verifier.did,
      verifier.schemaId
    );

    // verifier.credDefId= "Th7MpTaRZVRYnPiabds81Y:3:CL:81:KIMYOHAN_CREDENTIAL"
  
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
        p_value: 20,
        restrictions: { cred_def_id: verifier.credDefId }
      }
    }
  };

  log(
    "Transfer proof request from 'Verifier' to 'Prover' "
  );
 
  async function sendProofReq(data){
    await axios({
      method: 'POST',
      url: data,
      headers: {
        'content-Type': 'application/json'
      },
      data: {
        data: verifier.proofReq,
        schemaId : verifier.schemaId,
      }
    }).then(response => verifier.proof=response.data);
  }
  await sendProofReq(verifier.proofAPI)

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
      logOK("\nOK : proof is verified 성인입니다 :)");
      const good = "OK : proof is verified 성인입니다 :)";
      res.send(JSON.stringify(good))

    } else {
      logKO("\nKO : proof is expected but, 미성년자입니다 :(");
      const bad = "KO : proof is verified but, 미성년자입니다 :("
      res.send(JSON.stringify(bad))
    }

  });


};
