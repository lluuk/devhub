const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const redis = require("redis")
const { promisify } = require('util')

const client = redis.createClient()
const setAsync = promisify(client.set).bind(client)

const baseUrl = 'https://stackoverflow.com'
const url = `${baseUrl}/jobs?sort=p`

async function scrape () { 
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const content = await page.content()
    const $ = cheerio.load(content)
    const allJobs = []
    const pages = Number($('.s-pagination > a').first().attr('title').split(' ').pop())
    let currentPage = 1
    while (currentPage <= pages) {
        let currentUrl = url
        if (currentPage > 1) {
            currentUrl = `${currentUrl}&pg=${currentPage}`
        }
        await page.goto(currentUrl)
        const content = await page.content()
        const $ = cheerio.load(content)
        const jobsResults = $('.listResults > div[data-result-id]')
        jobsResults.each((idx, elem) => {
            const job = {
                id: `${baseUrl}${$('h2.mb4.fc-black-800.fs-body3 > a', elem).attr('href')}`,
                image: $('.grid img.grid--cell.fl-shrink0.w48.h48.bar-sm.mr12', elem).attr('src'),
                title: $('h2.mb4.fc-black-800.fs-body3', elem).text().trim(),
                link: `${baseUrl}${$('h2.mb4.fc-black-800.fs-body3 > a', elem).attr('href')}`,
                company: $('h3.fc-black-700.fs-body1.mb4 > span', elem).first().text().trim(),
                location: $('h3.fc-black-700.fs-body1.mb4 > span', elem).last().text().trim(),
                tags: [],
            }

            //date,salary,other benefits - WIP
            $('.ps-relative.d-inline-block.z-selected > a', elem).each(function () {
                job.tags.push($(this).text().trim())
            })

            allJobs.push(job)
        })
        console.log('current jobs count:', allJobs.length)
        currentPage++
    }

    console.log('final jobs count', allJobs.length)
    await setAsync('so', JSON.stringify(allJobs))

    await browser.close()
}

module.exports = scrape