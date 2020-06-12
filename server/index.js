const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001

const redis = require("redis"), client = redis.createClient()

const { promisify } = require('util')
const getAsync = promisify(client.get).bind(client)

app.use(express.json())
app.use(cors())

app.get('/api/jobs', async (req, res) => {
    //pagination, sorting
    const githubJobs = await getAsync('github')
    const soJobs = await getAsync('so')
    const jobs = [...JSON.parse(githubJobs), ...JSON.parse(soJobs)]

    return res.send(jobs)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))