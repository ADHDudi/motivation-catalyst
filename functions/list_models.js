const { GoogleGenAI } = require('@google/genai');

async function listModels() {
    const apiKey = 'AIzaSyB--Yat1rD5voz7CZsYh7osv5sFLVsD100';
    const genAI = new GoogleGenAI({ apiKey });

    try {
        // Note: The new SDK might have a different way to list models, 
        // but usually it's genAI.getGenerativeModel({ model: '...' })
        // If it's the NEW unified SDK, it might be different.
        console.log('Attempting to list models...');
        // In @google/genai (new SDK), listModels might not be directly on genAI
        // Let's try to just generate a simple response with gemini-2.0-flash-exp to test connectivity
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash:", result.response.text());
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response:', JSON.stringify(err.response, null, 2));
        }
    }
}

listModels();
