# AI Conversation Simulator

A real-time web app that simulates conversations between multiple AI personalities on any topic. Watch as different AI personas discuss your chosen topic with unique perspectives!


![ai chat demo](https://github.com/user-attachments/assets/73ed4ba0-1735-4f6d-a73e-faff8e17e043)


## Features

- 🤖 **5 Distinct AI Personalities**:
  - Optimist: Finds silver linings
  - Analyst: Data-driven and logical
  - Creative: Innovative perspectives
  - Skeptic: Questions assumptions
  - Humanist: Focuses on ethics and well-being

- 💬 **Real-time Conversations**: Watch AIs discuss topics live
- 🔄 **Turn-based Interaction**: Control conversation flow
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Instant Loading**: No page refreshes needed

## Tech Stack

- **Frontend**: React, Socket.IO
- **Backend**: Node.js, Express, Socket.IO
- **AI Integration**: Custom AI module (Gemini/LLM API)

- How It Works
- 
Connection: Frontend connects to backend via Socket.IO

Topic Submission: User enters conversation topic

AI Selection: Backend randomly selects AI personalities

Response Generation: Each AI generates context-aware responses

Real-time Updates: Responses stream to frontend in real-time

Conversation Flow: Alternates between AI personalities until conclusion
