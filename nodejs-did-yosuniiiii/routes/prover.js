const prover = {};
const testtest_1 = {};
var {
  log,
  logProver,
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
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : true});
var readline = require("readline-sync");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("prover.db");
const axios = require("axios");
const { response } = require("express");
const cors = require("cors");



// const { json } = require("body-parser");

// app.use(express.urlencoded({ extended: false }));

//Main code starts here


module.exports = function (app){
  app.use(bodyParser.json());
  app.use(cors());


    app.post("/api/log", urlencodedParser ,async function(req,res){

      log("Set protocol version 2");
      await indy.setProtocolVersion(2);  

      log("Prover Open connections to ledger");

      //###login info 

        const poolName = "prover" + "-pool-sandbox";
        const poolGenesisTxnPath = await util.getPoolGenesisTxnPath(poolName);
        const poolConfig = { genesis_txn: poolGenesisTxnPath };
        prover.poolHandle=await indy.openPoolLedger(poolName, poolConfig); 
      

        db.serialize(function() {
          const stmt = db.prepare('INSERT INTO proverID(pool_name, date) VALUES (?,?)');
          const date = new Date();
          const strDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
          
        stmt.run(poolName,strDate);
        stmt.finalize();

        db.each('SELECT aid, pool_name, date FROM proverID', (err, row) =>{
          logProver(`${row.aid})  pool_name: ${row.pool_name}  Date: ${row.date}` );
       });
      });



      log("Prover start Wallet");
      const walletConfig = { id: "prover" + ".wallet" };
      const walletCredentials = { key: 'prover' + ".wallet_key" };
      // log("Prover delete Wallet");

      // await indy.deleteWallet(walletConfig, walletCredentials);
      // log("Prover create Wallet");

      // await indy.createWallet(walletConfig, walletCredentials);
      log("Prover Open Wallet");

      prover.wallet=await indy.openWallet(walletConfig, walletCredentials);

      log("Prover Create DID");

      prover.did = await createAndStoreMyDid(
        prover.wallet, 
        "000000000000000000000000Steward2"
       );
      logKO("\tProver's DID is: " + prover.did);


      db.get(`SELECT * FROM DID `, function(err, rows){
        if (rows.length != 0) {
          console.log("already exist", `${rows.DID}`);
        }else{
          db.run('INSERT INTO DID(DID) VALUES (?)', [prover.did]);
          console.log("saved on Database");
        }
      });
        const sql = ('SELECT * FROM DID');
        db.get(sql, (err,rows) => {
          if (err){
            return logKO(err.message);
          }
          const test =  `${rows.DID}`;
          console.log(test,"you have got DID successfully ");
          const render_data = {
            did : test
          }

          res.send(test);

      });
    });

    app.post("/api/logout", urlencodedParser, async function(req,res){
      
      // const walletConfig = { id: "prover" + ".wallet" };
      // const walletCredentials = { key: 'prover' + ".wallet_key" };

      // await indy.deleteWallet(walletConfig, walletCredentials);

      
      log("Prover close connections from ledger");

      await indy.closePoolLedger(prover.poolHandle);

      log("Prover close wallet");
      await indy.closeWallet(prover.wallet);

      res.send("disconnected ledger and closed wallet ")
    })


  app.post("/api/schemaId",urlencodedParser, async function(req,res){


    async function getschemaId(){
      await axios.post("http://192.168.0.5:3000/api/schemaId")
      .then(response => prover.schemaId = response.data);

        // prover.schemId = "Th7MpTaRZVRYnPiabds81Y:2:YOSUNIIIII:1.0"
        logKO(prover.schemaId);

    };


    // console.log(req.body.data);

    // prover.schemaId = req.body.data;
    


      logOK("Waiting for issuer to send schemaID...");
      while (prover.schemaId == undefined) {
        await getschemaId()
        await sleep(2000);
      }

      logProver("Prover gets schema from ledger");
      prover.schema = await getSchemaFromLedger(
        prover.poolHandle,
        prover.did,
        prover.schemaId
      );


      logOK("got a schema ledger")


    async function test1(){
      await axios.post("http://192.168.0.5:3000/api/credOffer")
      .then(response => prover.credOffer = response.data);

      // test type!! //
        logKO(JSON.stringify(prover.credOffer));
    };


    logOK("Waiting  credential offer...");
    while (prover.credOffer == undefined) {
      await test1(),
      await sleep(2000);
    } 


    logOK (" got it OFFER!!! ")

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
    

    });

    app.post("/api/credReq",urlencodedParser, async function(req,res){
      res.send(JSON.stringify(prover.credReq));
    })



    

    app.post("/api/requestCred", async function(req,res){

      async function test2(){

        await axios.post("http://192.168.0.5:3000/api/cred")
        .then(response => prover.cred = response.data)
      }

      logOK("\n\nWaiting for Credential from Issuer...");
      while (prover.cred == undefined) {
        await sleep(2000),
        await test2();
      }

  

      logProver("Prover stores credential which was received from issuer");
       prover.outCredId =  await indy.proverStoreCredential(
        prover.wallet,
        undefined,
        prover.credReqMetadata,
        prover.cred,
        prover.credDef,
        undefined
      );



      db.serialize(function() {
        const stmt = db.prepare('INSERT INTO outCredId(outCredId,masterSecretId, date) VALUES (?,?,?)');
        const date = new Date();
        const strDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
        
      stmt.run(prover.outCredId,prover.masterSecretId,strDate);
      stmt.finalize();

      db.each('SELECT aid, outCredId, masterSecretId ,date FROM outCredId', (err, row) =>{
        logProver(`${row.aid})  outCredId: ${row.outCredId} masterSecretId: ${row.masterSecretId}  Date: ${row.date}` );

     });
    });



      logKO(prover.outCredId)

      logProver("get specific credential from wallet ")

      const get_credential = await indy.proverGetCredential(
        prover.wallet,
        prover.outCredId
      );
      
      res.send(JSON.stringify(get_credential))


        // logOK(JSON.stringify(prover.cred.values))
    });




    app.post("/api/getCred", urlencodedParser, async function(req,res){

    function database(){
      db.get('SELECT outCredId FROM outCredId where aid=1', function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.outCredId = `${row.outCredId}`;

          console.log(prover.outCredId);

        };
      });
    }

      logOK("\n\ngetting specific credential from wallet ");
      while (prover.outCredId == undefined) {
        database()
        await sleep(2000);
      }
  

      const get_credential = await indy.proverGetCredential(
        prover.wallet,
        prover.outCredId
      );
      
        logOK(JSON.stringify(get_credential))
      res.send(JSON.stringify(get_credential))
     
    });




  app.post("/api/proofReq", urlencodedParser, async function(req,res){

    prover.proofReq = req.body.data;

    console.log(prover.proofReq)

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

    async function getcredDefId(){
      await axios.post("http://192.168.0.5:3000/api/credDefId")
      .then(response => prover.credDefId = response.data);

        // prover.schemId = "Th7MpTaRZVRYnPiabds81Y:2:YOSUNIIIII:1.0"
        logKO(prover.credDefId);

    };

    while (prover.credDefId == undefined) {
      await getcredDefId()
      await sleep(2000);
    }
    logKO("-----------------------------1")
    prover.credDefs = {
      [prover.credDefId]: prover.credDef
    };
    logKO("-----------------------------2")

    prover.revocStates = {};
    logKO("-----------------------------3")

    function database(){
      db.get('SELECT masterSecretId FROM outCredId where aid="1"', function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.masterSecretId = `${row.masterSecretId}`;

          console.log(prover.masterSecretId);

        };
      });
    }
    while (prover.masterSecretId == undefined) {
      database()
      await sleep(2000);
    }



    prover.proof = await indy.proverCreateProof(
      prover.wallet,
      prover.proofReq,
      prover.requestedCredentials,
      prover.masterSecretId,
      prover.schemas,
      prover.credDefs,
      prover.revocStates
    );
    logKO("-----------------------------4")

    logOK("Transfer proof from 'Prover' to 'Verifier' (via HTTP or other) ...");
      res.send(prover.proof);
    
  });



    // ####################herererere!!!!!!!!!!! post ##########




  app.post("/prover", (req, res) => {


    res.status(200).send({ status: 200 });
  });




};
// ##########here !! #########

// app.listen(3001, () => {
//   console.log("Prover started on port 3001!");
//   run();
// });
