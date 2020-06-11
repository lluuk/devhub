const CronJob = require('cron').CronJob

const githubTask = require('./tasks/github')
const soScrapeFn = require('./scrapers/so')

// fetch github jobs
new CronJob('0 0 */1 * * *', githubTask.fetchJobs, null, true, 'America/Los_Angeles')
new CronJob('0 0 */1 * * *', soScrapeFn, null, true, 'America/Los_Angeles')