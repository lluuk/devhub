const Scraper = require('./scraper')

async function scrape () {
    const baseUrl = 'https://stackoverflow.com'
    const url = `${baseUrl}/jobs?sort=p`
    const name = 'so'
    const soScraper = new Scraper(name, url)
    await soScraper.init()
    const { $ } = soScraper
    const pages = Number($('.s-pagination > a').first().attr('title').split(' ').pop())
    while (soScraper.currentPage <= pages) {
        soScraper.changeCurrentUrl(url)
        if (soScraper.currentPage > 1) {
            soScraper.changeCurrentUrl(`${soScraper.currentUrl}&pg=${soScraper.currentPage}`)
        }
        await soScraper.setup()
        const jobsResults = $('.listResults > div[data-result-id]')
        jobsResults.each((idx, elem) => {
            const job = {
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

            soScraper.addJob(job)
        })
        console.log('current jobs count:', soScraper.allJobs.length)
        soScraper.incrementPage()
    }
    await soScraper.saveToDB()
    await soScraper.close()
}

module.exports = scrape