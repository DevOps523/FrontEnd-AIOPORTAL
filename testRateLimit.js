// testRateLimit.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/getblog'; // Update with your API URL

async function sendRequests(count) {
  for (let i = 1; i <= count; i++) {
    try {
      const response = await axios.get(API_URL);
      console.log(`Request ${i}: Status ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(`Request ${i}: Status ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.log(`Request ${i}: Error - ${error.message}`);
      }
    }
  }
}

sendRequests(105);
