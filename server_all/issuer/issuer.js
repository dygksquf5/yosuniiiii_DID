const issuer = {};
var {
  log,
  logIssuer,
  logOK,
  logKO,
  createAndOpenWallet,
  closeAndDeleteWallet,
  createAndOpenPoolHandle,
  closeAndDeletePoolHandle,
  createAndStoreMyDid,
  postSchemaToLedger,
  getSchemaFromLedger,
  postCredDefToLedger,
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
const db = new sqlite3.Database("issuer.db");
const axios = require("axios");
const { response } = require("express");
const colors = require("./colors");



module.exports = function (app){
  app.use(bodyParser.json());

 

  app.get("/", async function(req,res){
      //Main code starts here
  log("Set protocol version 2");
  await indy.setProtocolVersion(2);
  log("Issuer Open connections to ledger");

  //# login infomation! 


    const poolName = "issuer" + "-pool-sandbox";
    const poolGenesisTxnPath = await util.getPoolGenesisTxnPath(poolName);
    const poolConfig = { genesis_txn: poolGenesisTxnPath };
    issuer.poolHandle=await indy.openPoolLedger(poolName, poolConfig); 

    db.serialize(function() {
      const stmt = db.prepare('INSERT INTO issuerID(pool_name, date) VALUES (?,?)');
      const date = new Date();
      const strDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
      
    stmt.run(poolName,strDate);
    stmt.finalize();

    db.each('SELECT aid, pool_name, date FROM issuerID', (err, row) =>{
      logIssuer(`${row.aid})  pool_name: ${row.pool_name}  Date: ${row.date}` );
    });
  });


  log("Issuer Open Wallet");
  const walletConfig = { id: "issuer" + ".wallet" };
  const walletCredentials = { key: 'issuer' + ".wallet_key" };
  issuer.wallet= await indy.openWallet(walletConfig, walletCredentials);


  log("Issuer Create DID");
  issuer.did = await createAndStoreMyDid(
    issuer.wallet,
    "000000000000000000000000Steward1"
  );
  logKO("\tIssuer's DID is: " + issuer.did);
    
    db.get('SELECT * FROM DID', function(err, row){
      if (row.length != 0) {
        console.log("already exist", `${row.DID}`);
      }else {
        db.run('INSERT INTO DID VALUES (?)', [issuer.did]);
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
      res.render("index.ejs", render_data)

    });

  });



  app.post("/api/makeSchema", async function(req, res){

    try{

    logIssuer("Issuer creates credential schema");


      const [schemaId, schema] = await indy.issuerCreateSchema(

        issuer.did,
        "KIMYOHAN",
        "1.0",
        `["name", "age", "gender", "phone_number", "address", "country"]`

      )
      issuer.schemaId = schemaId;
      issuer.schema = schema;
      console.log(schema, schemaId);

      logIssuer("Issuer posts schema to ledger");
      await postSchemaToLedger(
        issuer.poolHandle,
        issuer.wallet,
        issuer.did,
        issuer.schema
      );
      
      logOK("\n\n\n" ,"done", issuer.schema);

    }

    catch(err){

      logOK("ERROR !!!! ", err)
    }
  });



  app.post("/api/schemaId", urlencodedParser, async function(req,res){

    db.get(`SELECT schemaId FROM schemaId where aid=2`, function(err, row){
      if (err){
        return logKO(err.message);
      }{
        issuer.schemaId = `${row.schemaId}`;
        console.log("get from Database");
        console.log(typeof(issuer.schemaId))
      };
    });
    res.send(JSON.stringify(issuer.schemaId))

  });

  app.post("/api/credDefId", urlencodedParser, async function(req,res){

    db.get(`SELECT credDefId FROM credDefId WHERE aid=2`, function(err, row){
      if (err){
        return logKO(err.message);
      }{
        issuer.credDefId = `${row.credDefId}`;
        console.log("get from Database");
        res.send(JSON.stringify(issuer.credDefId))
        console.log(issuer.credDefId)
      };

    });
  })


  app.get("/api/No2", urlencodedParser, async function(req,res){
    
    try {
         db.get('SELECT schemaId FROM schemaId WHERE aid=2', function(err, row){
          if (err){
            return logKO(err.message);
          }{
            issuer.schemaId = `${row.schemaId}`;
            console.log("got ID from Database");
          };
        });



      logOK("Waiting for issuer to get schema ID...");
      while (issuer.schemaId == undefined) {
        await sleep(2000);
      }
  
    
        logIssuer("Issuer gets schema from ledger");
        issuer.schema = await getSchemaFromLedger(
          issuer.poolHandle,
          issuer.did,
          issuer.schemaId
        );
  
  
  
        // ########### differnt way 1)###########
        for (var i in issuer.schema) {
          console.log(issuer.schema[i])
          i = i+1  
        };
  
        // ########### differnt way 2)###########
        for (var key in issuer.schema) {
          console.log("=>:" + key + ", value:" + issuer.schema[key]);
        };
  
         // ########### differnt way 3)###########
  
        var test = JSON.stringify(issuer.schema);
        logOK(test);
  
  
  
  
  
  
        logIssuer("Issuer creates credential definition for schema");
        {
          const [
            credDefId,
            credDef
          ] = await indy.issuerCreateAndStoreCredentialDef(
            issuer.wallet,
            issuer.did,
            issuer.schema,
            "KIMYOHAN_CREDENTIAL",
            "CL",
            { support_revocation: false }
          ); 
          issuer.credDefId = credDefId;
          issuer.credDef = credDef;
        }
        logIssuer("Issuer posts credential definition");
        await postCredDefToLedger(
          issuer.poolHandle,
          issuer.wallet,
          issuer.did,
          issuer.credDef
        );
  } catch(error) {
        console.log("errerrrrrrrr", error);
    };
  
    
    db.get(`SELECT credDefId FROM credDefId WHERE aid=2`, function(err, row){
      if (`${row.credDefId}` === issuer.credDefId){
        console.log("already exist", `${row.credDefId}`);
      }else{
        db.run('INSERT INTO credDefId(credDefId) VALUES (?)', [issuer.credDefId]);
        console.log("saved on Database");
        console.log(issuer.credDefId)
      }
    });
  
      logKO("\tSchemaId: " + issuer.schemaId);
      logKO("\tCredential Defination ID: " + issuer.credDefId);
  
  

      log(
        "Issuer shares public data (schema ID, credential definition ID, ...) (via HTTP or other communication protocol) ..."
      );
      res.send("성공성공!! /NO2 ");

      });






  app.get("/No3", async function(req,res){

    const render_data = {
      schemaId : issuer.schemaId,
      credDefId : issuer.credDefId,
    };
    res.render("issuer_schema_2.ejs", render_data);
  });




  app.post("/api/credOffer", async function(req,res){

      logIssuer("Issuer creates credential offer");
      issuer.credOffer = await indy.issuerCreateCredentialOffer(
        issuer.wallet,
        issuer.credDefId
      );
  
      log(
        "Transfer credential offer from 'Issuer' to 'Prover' (via HTTP or other) ..."
      );          
      await res.send(JSON.stringify(issuer.credOffer));


      async function test(){
        await axios.post("http://192.168.0.14:3001/api/credReq")
        .then(response => issuer.credReq = response.data);
  
        logOK(JSON.stringify(issuer.credReq));
      };
  
  
      logOK("\nWaiting for Credential Request from prover!");
      while (issuer.credReq == undefined) {
        await sleep(5000),
        await test();
      }

      logKO("got ittttttttt!!!!!!!")
      
    });


    app.post("/api/cred", urlencodedParser, async function(req,res){

      const tailsWriterConfig = {
        base_dir: util.getPathToIndyClientHome() + "/tails",
        uri_pattern: ""
      };
      const tailsWriter = await indy.openBlobStorageWriter(
        "default",
        tailsWriterConfig
      );


      logIssuer("Issuer creates credential");
      {
        const credValues = {
          gender: { raw: "woman", encoded: "123456789123456789" },
          age: {
            raw: "18",
            encoded: "18"
          },
          phone_number: {raw: "01051373507", encoded: "01051373507"},
          // name: { raw: "김요한 ", encoded: "123456789123456789" },
          name: { raw: "김요순", encoded: "123456789123456789" },

          address: { raw: "대전 ,중구 중앙로 119", encoded: "123456789123456789" },
          country: { raw: "South Korea", encoded: "123456789123456789" },
        };

        const [cred, _i, _d] = await indy.issuerCreateCredential(
          issuer.wallet,
          issuer.credOffer,
          issuer.credReq,
          credValues,
          undefined,
          tailsWriter
        );
        issuer.cred = cred;
      }

      await res.send(JSON.stringify(issuer.cred));

      console.log(JSON.stringify(issuer.cred));


  });


  app.get("/api/credential", async function(req,res){
    
    res.send(JSON.stringify(issuer.cred));
  });


 







  app.post("/api/another_credential", async function(req, res){

  logIssuer("Issuer creates credential");
  {
    const credValues = {
      age: {
        raw: "28",
        encoded: "28"
      },
      address: { raw: "Seoul", encoded: "123456789123456789" },
      food: {raw: "pizzzaaaaa", encoded: "123456789123456789"},
      gender: { raw: "male", encoded: "123456789123456789" },
      name: { raw: "yosuniiiii", encoded: "123456789123456789" }
    };
    const [cred, _i, _d] = await indy.issuerCreateCredential(
      issuer.wallet,
      issuer.credOffer,
      issuer.credReq,
      credValues,
      undefined,
      tailsWriter
    );
    issuer.cred = cred;
  }      
  
  await res.send(JSON.stringify(issuer.cred));
  console.log(JSON.stringify(issuer.cred));


  });



};