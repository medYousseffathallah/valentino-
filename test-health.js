const http = require('http')

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET'
}

console.log('Testing health endpoint...')

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`)
  console.log('Headers:', res.headers)
  
  let data = ''
  
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    console.log('Response Body:', data)
    try {
      const parsed = JSON.parse(data)
      console.log('✅ Health Check Passed:', parsed)
      if (parsed.groq) {
        console.log('✅ Groq API Connection: Working')
      } else {
        console.log('❌ Groq API Connection: Failed')
      }
    } catch (error) {
      console.log('❌ Response is not valid JSON')
    }
  })
})

req.on('error', (error) => {
  console.error('❌ Error connecting to health endpoint:', error)
  console.log('\n💡 Tip: Make sure the development server is running (npm run dev)')
})

req.end()
