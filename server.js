import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import multer from 'multer'

const PORT = 8000
const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage }).single('file')

let filePath;

app.post('/api/v1/images', async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 4,
            size: '256x256',
        })
        res.send(response.data.data)
    }
    catch (error) {
        console.error(error)
    }
})

app.post('/api/v1/images/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ err })
        }
        filePath = req.file.path
    })
})

app.post('/api/v1/images/variations', async (req, res) => {
    try {
        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            4,
            '256x256'
        )
        res.send(response.data.data)
    }
    catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.info('Server running on port ' + PORT)
})