// const fs = require('fs')
const AWS = require('aws-sdk')
const ID = process.env.VUE_APP_S3_ID
const SECRET = process.env.VUE_APP_S3_SECRET_KEY
const BUCKET_NAME = 'webup-covid-dashboard'

exports.handler = async (event, context) => {
  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
  })

  try {
    const result = await s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: 'test.json'
      })
      .promise()

    console.log(result.Body.toString('utf-8'))

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'content-type': result ? result.ContentType : 'application/json'
      },
      body: JSON.stringify({ ...result, Body: result.Body.toString('utf-8') })
    }
  } catch (e) {
    console.log(e.message)
    return { statusCode: 500, body: e.message }
  }
}
