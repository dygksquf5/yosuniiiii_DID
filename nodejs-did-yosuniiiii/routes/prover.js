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
var urlencodedParser = bodyParser.urlencoded({extended : true});
var readline = require("readline-sync");
const { render } = require("ejs");
const { error } = require("jquery");
const { json } = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("prover.db");
const axios = require("axios");
const { response } = require("express");



// const { json } = require("body-parser");

// app.use(express.urlencoded({ extended: false }));

//Main code starts here


module.exports = function (app){
  app.use(bodyParser.json());


  app.get("/", async function(req,res){
    log("Set protocol version 2");
    await indy.setProtocolVersion(2);

      res.render("prover_login.ejs")
  });
  
  
  
  
    app.post("/log", urlencodedParser ,async function(req,res){
      var username = req.body.username;
      var password = req.body.password;
  
      req.session.user_name = username;
      req.session.password = password;

      console.log(username)
      console.log(req.session.password)

      res.redirect("/main");
    });
    
    app.get("/main", async function(req,res){

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



      log("Prover Open Wallet");
      const walletConfig = { id: "prover" + ".wallet" };
      const walletCredentials = { key: 'prover' + ".wallet_key" };
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
          res.render("prover_main.ejs", render_data)
      });

        
    });

    app.get("/main2",async function(req,res){

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
        res.render("prover_main_2.ejs", render_data)
  
      });
  
    });

    // app.post("/api",urlencodedParser,function(req,res){
    //   prover.schemaId = req.body.schemaId
    //   res.send("success!!!!")
    // });

    // app.get("/api",function(req,res){
    //   res.send("success!!!get!")
    // });

    


  app.get("/credential", async function(req, res){

    res.render("prover_credential.ejs");
  });


  app.post("/credential",urlencodedParser, async function(req,res){



    prover.schemaId = req.body.schemaID;
      console.log(prover.schemaId)

    logOK("Waiting for issuer to send schema ID...");
    while (prover.schemaId == undefined) {
      await sleep(2000);
    }


    // logOK("Waiting for issuer to send credential definition ID...");
    // while (prover.credDefId == undefined) {
    //   await sleep(2000);
    // }

    logProver("Prover gets schema from ledger");
    prover.schema = await getSchemaFromLedger(
      prover.poolHandle,
      prover.did,
      prover.schemaId
    );


    logOK("got a schema ledger")
    
    res.redirect("/credential2")

    });

    app.get("/credential2",async function(req,res){
      res.render("prover_credential_2.ejs");
    });




    app.post("/api/credReq",urlencodedParser, async function(req,res){
      res.send(JSON.stringify(prover.credReq));
    })



  
    app.post("/credential2", urlencodedParser, async function(req,res){

      async function test1(){
        await axios.post("http://192.168.0.49:3000/api/credOffer")
        .then(response => prover.credOffer = response.data);

        // test type!! //
          logKO(JSON.stringify(prover.credOffer));
      };


      
      logOK("Waiting  credential offer...");
      while (prover.credOffer == undefined) {
        await test1(),
        await sleep(2000);
      } 
      

      // for (var key in prover.credOffer) {
      //   console.log("=>:" + key + ", value:" + prover.credOffer[key]);
      // };      


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


      res.redirect("/credential3")
    });
    app.get("/credential3", function(req,res){
      res.render("prover_credential_3");
    })

    app.post("/credential3", async function(req,res){

      async function test2(){

        await axios.post("http://192.168.0.49:3000/api/cred")
        .then(response => prover.cred = response.data)
      }

      logOK("\n\nWaiting for Credential from Issuer...");
      while (prover.cred == undefined) {
        await sleep(2000),
        await test2();
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


      for (var key in prover.cred) {
        logOK("=>:"+ key  + ", value:" + JSON.stringify(prover.cred[key]));
      };      

    });














    app.post("/test", async function(req,res){
  
  
      // for (const [key, value] of Object.entries(prover.cred)) {
      //   console.log(`${key} : ${value}`);
      // }
  
  
  

    });








  app.get("/credential2",async function(req,res){

    
    res.render("/credential2222222222222222222");
  });










  app.get("/credential3", async function(req,res){


    async function test1 (){
      await axios.get("http://192.168.0.49:3000/api/credOffer")
      .then(response => prover.credOffer = response.data);

      // test type!! //
        logKO(JSON.stringify(prover.credOffer));
      

    };


    test1()
    
    logOK("\n\nWaiting for Credential from Issuer...");
    while (prover.cred == undefined) {
      await sleep(200000);
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

    res.render("prover_credential_3.ejs", render_data);
  });


  app.post("/credential2", urlencodedParser ,async function(req,res){
    res.redirect("/credential2")
  
  });





  app.post("//ddddddddd", urlencodedParser,async function(req,res){


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
    // const type = req.body.type;
    // const message = req.body.message;

    // switch (type) {
    //   case "schemaId":
    //     prover.schemaId = message;
    //     break;
    //   case "credDefId":
    //     prover.credDefId = message;
    //     break;
    //   case "credOffer":
    //     prover.credOffer = JSON.parse(message);
    //     break;
    //   case "cred":
    //     prover.cred = JSON.parse(message);
    //     break;
    //   case "proofReq":
    //     prover.proofReq = JSON.parse(message);
    //   default:
    //     break;
    // }


    res.status(200).send({ status: 200 });
  });




};
// ##########here !! #########

// app.listen(3001, () => {
//   console.log("Prover started on port 3001!");
//   run();
// });
