

const mongodb = require("mongodb");

const {MongoClient, ObjectID} = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017"
const databasename = "task-manager"

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error,client)=>{
    if(error){
        return console.log("kan ikke koble til database")
    }
    const db = client.db(databasename);

  db.collection("oppgaver").deleteMany({des: "lus"},
     
    
    ).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })
})
