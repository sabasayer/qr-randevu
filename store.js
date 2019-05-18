const admin = require('firebase-admin');

var serviceAccount = require('./qr-randevu-cef6cb8efea3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

exports.addToCollection = async (collection,data) => {
    var ref = await db.collection(collection).add(data);
    return ref;
}

exports.updateToCollection = async (collection,id,data) => {
    var ref = await db.collection(collection).doc(id).set(data);
} 

exports.getFromCollection = async (collection,id)=>{
    var doc = await db.collection(collection).doc(id).get();
    return doc.data();
}

exports.listCollection = async (collection,query)=>{
    ref = db.collection(collection);
    let snapshot = await ref.get();
    let items = [];
    snapshot.forEach(doc=>{
        let data = doc.data();
        data.id = doc.id;
        items.push(data);
    });

    return items;
}

exports.removeFromCollection = async (collection,id) => {
    db.collection(collection).doc(id).delete();
}