const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()
const setAsync = promisify(client.set).bind(client)

const getUrl = ({ url, currentPage, paramName = '&pg='}, reducer) =>
    reducer(url, currentPage, paramName)
    
const SOUrl = (url, currentPage, paramName) => {
	let currentUrl = url
	if (currentPage > 1) {
		currentUrl = `${currentUrl}${paramName}${currentPage}`
    }
    
	return currentUrl
}

const reduce = async (reducer, initial, { pages, baseUrl, url, browser }) => {
    let currentPage = 1
	let result = initial
	while (currentPage <= pages) {
        result = await reducer(initial, baseUrl, url, currentPage, browser)
        currentPage++
	}
	return result
}

const setupScraper = async (browser, url) => {
    const page = await browser.newPage()
    await page.goto(url)
	const content = await page.content()
    const $ = cheerio.load(content)
    return $
}

const scrapingSO = async (initial = [], baseUrl, url, currentPage, browser) => {
    const currentUrl = getUrl({ url, currentPage }, SOUrl)
    const $ = await setupScraper(browser, currentUrl)
    const jobsResults = $('.listResults > div[data-result-id]')
    jobsResults.each((idx, elem) => {
        const job = {
            id: `${baseUrl}${$(
                'h2.mb4.fc-black-800.fs-body3 > a',
                elem
            ).attr('href')}`,
            image: $(
                '.grid img.grid--cell.fl-shrink0.w48.h48.bar-sm.mr12',
                elem
            ).attr('src'),
            title: $('h2.mb4.fc-black-800.fs-body3', elem).text().trim(),
            link: `${baseUrl}${$(
                'h2.mb4.fc-black-800.fs-body3 > a',
                elem
            ).attr('href')}`,
            company: $('h3.fc-black-700.fs-body1.mb4 > span', elem)
                .first()
                .text()
                .trim(),
            location: $('h3.fc-black-700.fs-body1.mb4 > span', elem)
                .last()
                .text()
                .trim(),
            tags: [],
        }

        //date,salary,other benefits - WIP
        $('.ps-relative.d-inline-block.z-selected > a', elem).each(
            function () {
                job.tags.push($(this).text().trim())
            }
        )

        initial.push(job)
    })
    console.log('current jobs count:', initial.length)
    return initial
}

async function scrape() {
    const baseUrl = 'https://stackoverflow.com'
    const url = `${baseUrl}/jobs?sort=p`
    const browser = await puppeteer.launch()
    
    const $ = await setupScraper(browser, url)
	const pages = Number(
		$('.s-pagination > a').first().attr('title').split(' ').pop()
	)
    const soJobs = await reduce(scrapingSO, [], { pages, baseUrl, url, browser })

	console.log('final jobs count', soJobs.length)
	await setAsync('so', JSON.stringify(soJobs))

	await browser.close()
}

module.exports = scrape
