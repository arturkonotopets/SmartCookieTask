const admin = require('firebase-admin')
const serviceAccount = require('../mypro-firebase-adminsdk.json')
require('dotenv').config()
const client = require('drip-nodejs')({ token: process.env.TOKEN_URI, accountId: process.env.ACCOUNT_ID })

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const userRef = db.collection('users').doc('1')

getUser()
async function getUser() {
    const doc = await userRef.get()

    if (!doc.exists) {
        const res = await userRef.set({
            email: 'artyr@gmail.com',
            name: 'Arthur'
        })
        console.log('Added document with')
        const doc = await userRef.get()
        console.log('Document data:', doc.data())
        sendEmail(doc.data())
    } else {
        console.log('Document data:', doc.data())
        sendEmail(doc.data())
    }
}

function sendEmail(user){

    const options = {
        "id": 1,
        "status": 'send',
        "name": 'Some name',
        "from_name": user.name,
        "from_email": user.email,
        "send_at": new Date().toString(),
        "created_at": new Date().toString(),
        "postal_address": "123 Anywhere St\nFresno, CA 99999",
        "localize_sending_time": true,
        "bcc": null,
        "subject": "4 Marketing Automation Trends for 2015",
        "html_body": "HTML body",
        "text_body": "Text body"
    }

    client.listBroadcasts(options)
    .then((res)=>{
        console.log('Drip response status:', res.body)
    })
    .catch((e)=>{
        console.log('error', e);
    })

}

