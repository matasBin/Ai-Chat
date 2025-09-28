const express = require('express');
const app = express();
const cors = require('cors');
const ai = require("./ai")

const {createServer} = require('http');
const {Server} = require('socket.io');
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());



const aiPersonalities = [
    {
        name: "Optimist",
        persona: "You're an optimistic AI who always finds silver linings and positive solutions and answers with short but not too short responses."
    },
    {
        name: "Analyst",
        persona: "You're a data-driven AI who focuses on facts, statistics, and logical analysis and answers with short but not too short responses."
    },
    {
        name: "Creative",
        persona: "You're a creative AI who thinks outside the box and offers innovative perspectives and answers with short but not too short responses."
    },
    {
        name: "Skeptic",
        persona: "You're a skeptical AI who questions assumptions and points out potential problems and answers with short but not too short responses."
    },
    {
        name: "Humanist",
        persona: "You're a humanist AI who prioritizes ethical considerations and human well-being and answers with short but not too short responses."
    }
];

let conversationTopic = ""
let currentSpeakerIndex = 0
let lastMessage = ""
let isFirstMessage = true
let lastAi = null

io.on("connection", socket => {
    console.log("New Connection")

    socket.on("startConversation", async (topic) => {
        conversationTopic = topic
        currentSpeakerIndex = 0
        lastMessage = ""
        isFirstMessage = true
        lastAi = null

        socket.emit("conversationStarted", {
            message: `Starting conversation about: ${topic}`,
            participants: aiPersonalities.map(ai => ai.name)
        })

        await nextTurn(socket)
    })

    socket.on("next-turn", async () => {
        await nextTurn(socket)
    })

})

async function nextTurn(socket) {
    let randomIndex = Math.floor(Math.random() * aiPersonalities.length)
    const currentAi = aiPersonalities[randomIndex]

    let prompt
    if(isFirstMessage) {
        prompt = `${currentAi.persona} You're participating in a conversation about "${conversationTopic}\n\n${currentAi.name}"`
        isFirstMessage = false
    } else {
        prompt = `${currentAi.persona} You're participating in a conversation about "${conversationTopic}\n\n${lastAi.name} just said: "${lastMessage}"\n\nNow respond as ${currentAi.name}`
    }

    const response = await ai(prompt)
    lastAi = currentAi
    lastMessage = response.candidates[0].content.parts[0].text

    socket.emit("aiResponse", {
        speaker: currentAi.name,
        content: response.candidates[0].content.parts[0].text,
    })
}


httpServer.listen(2500, () => {
    console.log('server is running on http://localhost:2500');
});