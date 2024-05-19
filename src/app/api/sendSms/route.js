import notificationapi from 'notificationapi-node-server-sdk'
// const notificationapi = require('notificationapi-node-server-sdk').default

const clientId = process.env.NEXT_PUBLIC_NOTIFICATION_CLIENTID
const clientSecret = process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT_SECRET

notificationapi.init(
    clientId, // clientId
    clientSecret// clientSecret
)

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')

    if (!phone) {
        return Response.json({ "message": "please enter phone and message both" })
    }

    try {
        notificationapi.send({
            notificationId: 'test_notification',
            user: {
                id: "abhaysharma.as2719@gmail.com",
                number: "+91" + phone // Replace with your phone number
            },
            mergeTags: {}
        })
    } catch (e) {
        console.log("-------------------caught with an error --------------------", e)
    }

    return Response.json({"message" : "sent successfullly"})
}