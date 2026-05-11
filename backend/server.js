import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test route (important)
app.get("/", (req, res) => {
    res.send("Server is running ✅");
});

app.get("/api/chat", (req, res) => {
    res.send("API is working ✅");
});

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: message }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2)); // 🔥 DEBUG

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "❌ Gemini returned empty response";

        res.json({ reply });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ reply: "❌ Server crashed" });
    }
});

app.listen(3001, () => {
    console.log("✅ Server running on http://localhost:3001");
});