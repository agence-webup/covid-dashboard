exports.handler = function (event, context, callback) {
  const password = event.queryStringParameters.password.toString()

  var isPasswordOk = false

  password === process.env.ADMIN_PASSWORD ? isPasswordOk = true : isPasswordOk = false

  console.log(isPasswordOk)

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(isPasswordOk)
  })
}
