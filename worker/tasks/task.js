const fetch = require('node-fetch')
const redis = require("redis")
const client = redis.createClient()

const { promisify } = require('util')
const setAsync = promisify(client.set).bind(client)

class Task {
    constructor (taskName, baseUrl) {
        this.taskName = taskName
        this.baseUrl = baseUrl
        this.jobs = []
    }

    fetchJobs = async () => {
        let resultCount = 1
        let onPage = 0

        while(resultCount > 0) {
            const res = await fetch(`${this.baseUrl}?page=${onPage}`)
            const jobs = await res.json()
            const adjustedJobs = []
            jobs.forEach(({ id, company_logo, title, url, company, location, created_at })=> {
                const job = {
                    id,
                    image: company_logo,
                    title,
                    link: url,
                    company,
                    location,
                    tags: [],
                    date: created_at,
                }
                adjustedJobs.push(job)
            })
            this.jobs = [...this.jobs, ...adjustedJobs]
            resultCount = jobs.length
            onPage++
        }

        await setAsync(this.taskName, JSON.stringify(this.jobs))
    }
}

module.exports = Task