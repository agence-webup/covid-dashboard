const fetch = require('node-fetch')

const API_ENDPOINT = 'https://coronavirusapifr.herokuapp.com/data/departements-by-date/'

exports.handler = async (event) => {
  try {
    const targetedDate = event.queryStringParameters.targetedDate
    const response = await fetch(API_ENDPOINT + targetedDate)
    const data = await response.json()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ data })
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' })
    }
  }
}
