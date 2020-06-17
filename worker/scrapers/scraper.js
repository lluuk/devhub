const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()
const setAsync = promisify(client.set).bind(client)

class Scraper {
    constructor(name, url) {
        this.browser = null
        this.page = null
        this.content = null
        this.$ = null
        this.name = name
        this.currentUrl = url
        this.allJobs = []
        this.currentPage = 1
    }

    async init () {
        this.browser = await puppeteer.launch()
        await this.setup()
    }

    async setup () {
        this.page = await this.browser.newPage()
        await this.page.goto(this.currentUrl)
        this.content = await this.page.content()
        this.$ = cheerio.load(this.content)
    }

    async saveToDB () {
        console.log('final jobs count', this.allJobs.length)
        await setAsync(this.name, JSON.stringify(this.allJobs))
    }

    changeCurrentUrl (url) {
        this.currentUrl = url
    }

    addJob (job) {
        this.allJobs.push(job)
    }

    incrementPage () {
        this.currentPage++
    }

    async close () {
        await this.browser.close()
    }
}

module.exports = Scraper
