import notificationapi from 'notificationapi-node-server-sdk'
// const notificationapi = require('notificationapi-node-server-sdk').default

notificationapi.init(
    '4066qkpm1hfchjj24go590k59k', // clientId
    'sdo0696u5to4a48dph13k25gsf66grnec6tlvb8b8n8gtfr6alj'// clientSecret
)


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')

    if (!phone) {
        return Response.json({"message" : "please enter phone and message both"})
    }


    notificationapi.send({
        notificationId: 'test_notification',
        user: {
            id: "abhaysharma.as2719@gmail.com",
            number: "+91" + phone // Replace with your phone number
        },
        mergeTags: {}
    })

    return Response.json({"message" : "sent successfullly"})
}