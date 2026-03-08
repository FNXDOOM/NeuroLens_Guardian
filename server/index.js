/**
 * NeuroLens Guardian Backend Server
 * 
 * Minimal Express server for secure Groq API calls.
 * Keeps API keys safe on the backend.
 * 
 * To run:
 * 1. cd server
 * 2. npm install
 * 3. Create .env file with GROQ_API_KEY
 * 4. node index.js
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import guidanceRouter from './routes/guidance.js'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors()) // Enable CORS for frontend
app.use(express.json()) // Parse JSON bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NeuroLens Guardian Backend',
    version: '1.0.0',
    groqConfigured: !!process.env.GROQ_API_KEY,
  })
})

// Mount guidance routes
app.use('/api/guidance', guidanceRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ NeuroLens Guardian Backend running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}`)
  console.log(`🤖 Guidance API: http://localhost:${PORT}/api/guidance`)
  console.log(`🔑 Groq API Key: ${process.env.GROQ_API_KEY ? 'Configured ✓' : 'Missing ✗'}`)
})
