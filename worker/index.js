const CronJob = require('cron').CronJob

const githubTask = require('./tasks/github')

// fetch github jobs
new CronJob('0 0 */1 * * *', githubTask.fetchJobs, null, true, 'America/Los_Angeles')