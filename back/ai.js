const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY; // store your API key in env
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function runGemini(prompt) {
    try {
        const response = await axios.post(
            URL,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": API_KEY,
                },
            }
        );

        // console.log(JSON.stringify(response.data, null, 2));

        return response.data
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

module.exports = runGemini