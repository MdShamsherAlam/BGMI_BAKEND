const axios = require('axios');

const API_URL = 'https://node-templates-06nd.onrender.com/v1/auth/login'; // Replace with your API endpoint
const API_KEY = 'your_api_key'; // Replace with your API key

async function sendRequest() {
  try {
    const response = await axios.post(API_URL,{
    
    "userName":"PATUNI-295",
    "password":"PATUNI-295"
    
    
    } ,{
      headers: {
        key: API_KEY, // Include your API key in the headers
      },
    });
    console.log(`Response: ${response.status} - ${response.data}`);
  } catch (error) {
    console.error(`Error: ${error.response ? error.response.status : error.message}`);
  }
}

async function hitApiConcurrent() {
  const requestsPerBatch = 100; 
  const requests = Array.from({ length: requestsPerBatch }, sendRequest); // Create an array of promises

  try {
    await Promise.all(requests); // Wait for all requests to complete
    console.log('All requests completed');
  } catch (err) {
    console.error('Error with one or more requests:', err);
  }
}

module.exports={hitApiConcurrent}