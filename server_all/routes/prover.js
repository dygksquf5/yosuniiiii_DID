const prover = {};
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
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("prover.db");
const axios = require("axios");
const { response } = require("express");
const cors = require("cors");




module.exports = function (app){
  app.use(bodyParser.json());
  app.use(cors());


    app.post("/api/deleteWallet_and_create", urlencodedParser, async function(req,res){

      const walletConfig = { id: "prover" + ".wallet" };
      const walletCredentials = { key: 'prover' + ".wallet_key" };
      
      await indy.closeWallet(prover.wallet);


      log("Prover delete Wallet");
      await indy.deleteWallet(walletConfig, walletCredentials);

      log("Prover create Wallet");
      await indy.createWallet(walletConfig, walletCredentials);

      // db.run('DELETE * FROM outCredId');
      // logOK("delete all from outCredId in Database");

      log("Prover Open Wallet");

      prover.wallet=await indy.openWallet(walletConfig, walletCredentials);

      log("Prover Create DID");

      prover.did = await createAndStoreMyDid(
        prover.wallet, 
        "000000000000000000000000Steward2"
       );
      logKO("\tProver's DID is: " + prover.did);

    });

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
      
      
      log("Prover close connections from ledger");

      await indy.closePoolLedger(prover.poolHandle);

      log("Prover close wallet");
      await indy.closeWallet(prover.wallet);

      res.send("disconnected ledger and closed wallet ")
    })


  app.post("/api/schemaId",urlencodedParser, async function(req,res){
  try{

    async function getschemaId(){
      await axios.post("http://192.168.0.13:3000/api/schemaId")
      .then(response => prover.schemaId = response.data);

        logKO(prover.schemaId);

    };    


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


      db.get(`SELECT schemaId FROM schemaId WHERE aid=2`, function(err, row){
        if (`${row.schemaId}` === prover.schemaId){
          console.log("already exist", `${row.schemaId}`);
        }else{
          db.run('INSERT INTO schemaId(schemaId) VALUES (?)', [prover.schemaId]);
          logOK("saved on Database");
          console.log(prover.schemaId)
        }
      });
  


    async function getCredOffer(){
      await axios.post("http://192.168.0.13:3000/api/credOffer")
      .then(response => prover.credOffer = response.data);

        logKO(JSON.stringify(prover.credOffer));
    };


    logOK("Waiting  credential offer...");
    prover.credOffer = null;
    while (prover.credOffer == undefined) {
      await getCredOffer(),
      await sleep(2000);
    } 


    logOK (" got it OFFER !!  ")
    
    logProver("Prover gets credential definition from ledger");
    prover.credDefId = prover.credOffer["cred_def_id"];
    prover.credDef = await getCredDefFromLedger(
      prover.poolHandle,
      prover.did,
      prover.credDefId
    );

    db.get(`SELECT credDefId FROM credDefId WHERE aid=2`, function(err, row){
      if (`${row.credDefId}` === prover.credDefId){
        console.log("already exist", `${row.credDefId}`);
      }else{
        db.run('INSERT INTO credDefId(credDefId) VALUES (?)', [prover.credDefId]);
        logOK("saved on Database");
        console.log(prover.credDefId)
      }
    });





    logProver("Prover creates master secret");
    prover.masterSecretId = null;
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
    }catch(error){
      console.log(error)
    }

  });

    app.post("/api/credReq",urlencodedParser, async function(req,res){
      res.send(JSON.stringify(prover.credReq));
    })



    

    app.post("/api/requestCred", async function(req,res){

      async function requestCred(){

        await axios.post("http://192.168.0.13:3000/api/cred")
        .then(response => prover.cred = response.data)
      }

      prover.cred = null;
      logOK("\n\nWaiting for Credential from Issuer...");
      while (prover.cred == undefined) {
        await sleep(2000),
        await requestCred();
      }

  

      logProver("Prover stores credential which was received from issuer");
      prover.outCredId = null;
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
      
      res.send(JSON.stringify(get_credential.attrs))


        // logOK(JSON.stringify(prover.cred.values))
    });




    app.post("/api/getCred/adult", urlencodedParser, async function(req,res){
      try{
        function database(){
          db.get('SELECT outCredId FROM outCredId WHERE aid=1', function(err, row){
            if (err){
              return logKO(err.message);
            }{
              prover.outCredId = `${row.outCredId}`;

              console.log(prover.outCredId);

            };
          });
        }
          prover.outCredId = null
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

          res.send(JSON.stringify(get_credential.attrs))
      }catch(error){
        console.log(error);
      }
     
    });

    app.post("/api/getCred/minor", urlencodedParser, async function(req,res){
      try{
        function database(){
          db.get('SELECT outCredId FROM outCredId WHERE aid=2', function(err, row){
            if (err){
              return logKO(err.message);
            }{
              prover.outCredId = `${row.outCredId}`;

              console.log(prover.outCredId);

            };
          });
        }
          prover.outCredId = null
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

          res.send(JSON.stringify(get_credential.attrs))
      }catch(error){
        console.log(error);
      }
     
    });





  app.post("/api/proofReq/adult", urlencodedParser, async function(req,res){
    try{

      db.get(`SELECT schemaId FROM schemaId where aid=2`, function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.schemaId = `${row.schemaId}`;
          console.log("get SchemaId from Database");
        };
      });
      db.get(`SELECT credDefId FROM credDefId WHERE aid=2`, function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.credDefId = `${row.credDefId}`;
          console.log("get CredDefId from Database");
          console.log(prover.credDefId)
        };
  
      });
  
    prover.proofReq = req.body.data;
    // prover.schemaId = req.body.schemaId;
    console.log(prover.proofReq)
    console.log(prover.schemaId)
    logOK("\n\nWaiting for proof request from verifier!");
    while (prover.schemaId == undefined) {
      await sleep(2000);
    }
    while (prover.proofReq == undefined) {
      await sleep(2000);
    }
    while (prover.credDefId == undefined) {
      await sleep(2000);
    }


    logProver("Prover gets credentials for proof request");
    {
      const searchHandle = await indy.proverSearchCredentialsForProofReq(
        prover.wallet,
        prover.proofReq,
        null
      );


    const credentialsForAttr1 = await indy.proverFetchCredentialsForProofReq(
      searchHandle,
      "attr1_referent",
      100
      
    );

    prover.credInfoForAttribute = credentialsForAttr1[0]["cred_info"];

    const credentialsForPredicate1 = await indy.proverFetchCredentialsForProofReq(
      searchHandle,
      "predicate1_referent",
      100
      
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

    logProver("Prover gets schema from ledger");
    prover.schema = await getSchemaFromLedger(
      prover.poolHandle,
      prover.did,
      prover.schemaId
    );

    prover.schemas = {
      [prover.schemaId]: prover.schema
    };

    // async function getcredDefId(){
    //   await axios.post("http://192.168.0.13:3000/api/credDefId")
    //   .then(response => prover.credDefId = response.data);

    //     logKO(prover.credDefId);

    // };

    // while (prover.credDefId == undefined) {
    //   await getcredDefId()
    //   await sleep(2000);
    // }
    function database(){
      db.get('SELECT masterSecretId FROM outCredId WHERE aid=1', function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.masterSecretId = `${row.masterSecretId}`;

          console.log(prover.masterSecretId);

        };
      });
    }
    prover.masterSecretId = null
    while (prover.masterSecretId == undefined) {
      database()
      await sleep(2000);
    }

    logKO("-----------------------------1 done ")
    prover.credDef = await getCredDefFromLedger(
      prover.poolHandle,
      prover.did,
      prover.credDefId
    );
    prover.credDefs = {
      [prover.credDefId]: prover.credDef
    };
    logKO("-----------------------------2 done ")

    prover.revocStates = {};
    logKO("-----------------------------3 done ")


    prover.proof = await indy.proverCreateProof(
      prover.wallet,
      prover.proofReq,
      prover.requestedCredentials,
      prover.masterSecretId,
      prover.schemas,
      prover.credDefs,
      prover.revocStates
    );
    logKO("-----------------------------4 done ")

    logOK("Transfer proof from 'Prover' to 'Verifier' ");
      res.send(prover.proof);
    }catch(error){
      console.log(error)
    }
  });







  app.post("/api/proofReq/minor", urlencodedParser, async function(req,res){
    try{

      db.get(`SELECT schemaId FROM schemaId where aid=2`, function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.schemaId = `${row.schemaId}`;
          console.log("get SchemaId from Database");
        };
      });
      db.get(`SELECT credDefId FROM credDefId WHERE aid=2`, function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.credDefId = `${row.credDefId}`;
          console.log("get CredDefId from Database");
          console.log(prover.credDefId)
        };
  
      });
  
    prover.proofReq = req.body.data;
    // prover.schemaId = req.body.schemaId;
    console.log(prover.proofReq)
    console.log(prover.schemaId)
    logOK("\n\nWaiting for proof request from verifier!");
    while (prover.schemaId == undefined) {
      await sleep(2000);
    }
    while (prover.proofReq == undefined) {
      await sleep(2000);
    }
    while (prover.credDefId == undefined) {
      await sleep(2000);
    }


    logProver("Prover gets credentials for proof request");
    {
      const searchHandle = await indy.proverSearchCredentialsForProofReq(
        prover.wallet,
        prover.proofReq,
        null
      );


    const credentialsForAttr1 = await indy.proverFetchCredentialsForProofReq(
      searchHandle,
      "attr1_referent",
      100
      
    );

    prover.credInfoForAttribute = credentialsForAttr1[0]["cred_info"];

    const credentialsForPredicate1 = await indy.proverFetchCredentialsForProofReq(
      searchHandle,
      "predicate1_referent",
      100
      
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

    logProver("Prover gets schema from ledger");
    prover.schema = await getSchemaFromLedger(
      prover.poolHandle,
      prover.did,
      prover.schemaId
    );

    prover.schemas = {
      [prover.schemaId]: prover.schema
    };

    function database(){
      db.get('SELECT masterSecretId FROM outCredId WHERE aid=2', function(err, row){
        if (err){
          return logKO(err.message);
        }{
          prover.masterSecretId = `${row.masterSecretId}`;

          console.log(prover.masterSecretId);

        };
      });
    }
    prover.masterSecretId = null
    while (prover.masterSecretId == undefined) {
      database()
      await sleep(2000);
    }

    logKO("-----------------------------1 done ")
    prover.credDef = await getCredDefFromLedger(
      prover.poolHandle,
      prover.did,
      prover.credDefId
    );
    prover.credDefs = {
      [prover.credDefId]: prover.credDef
    };
    logKO("-----------------------------2 done ")

    prover.revocStates = {};
    logKO("-----------------------------3 done ")


    prover.proof = await indy.proverCreateProof(
      prover.wallet,
      prover.proofReq,
      prover.requestedCredentials,
      prover.masterSecretId,
      prover.schemas,
      prover.credDefs,
      prover.revocStates
    );
    logKO("-----------------------------4 done ")

    logOK("Transfer proof from 'Prover' to 'Verifier' (via HTTP or other) ...");
      res.send(prover.proof);
    }catch(error){
      console.log(error)
    }
  });




};

