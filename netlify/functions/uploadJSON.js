// const fs = require('fs')
const AWS = require('aws-sdk')
const ID = process.env.VUE_APP_S3_ID
const SECRET = process.env.VUE_APP_S3_SECRET_KEY
const BUCKET_NAME = 'webup-covid-dashboard'

exports.handler = async (event, context) => {
  const newData = event.queryStringParameters.newData
  const password = event.queryStringParameters.password.toString()
  var isPasswordOk = false
  password === '123' ? isPasswordOk = true : isPasswordOk = false
  if (!isPasswordOk) {
    return
  }
  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
  })

  try {
    const result = await s3
      .upload({
        Bucket: BUCKET_NAME,
        Key: 'test.json',
        Body: newData,
        ACL: 'private',
        ContentEncoding: 'utf8',
        ContentType: 'application/json'
      })
      .promise()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}
