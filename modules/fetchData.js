const fs = require('fs-extra')
const axios = require('axios')

const urls = [
  'https://script.google.com/macros/s/AKfycbyAM3WEpk_cqU9SfZ9tFSs3yw-Y1ls-RyXeMPzqoCWcAuRADbu1/exec?entity=events',
  'https://script.google.com/macros/s/AKfycbyAM3WEpk_cqU9SfZ9tFSs3yw-Y1ls-RyXeMPzqoCWcAuRADbu1/exec?entity=members',
  'https://script.google.com/macros/s/AKfycbyAM3WEpk_cqU9SfZ9tFSs3yw-Y1ls-RyXeMPzqoCWcAuRADbu1/exec?entity=resources',
  'https://script.google.com/macros/s/AKfycbyAM3WEpk_cqU9SfZ9tFSs3yw-Y1ls-RyXeMPzqoCWcAuRADbu1/exec?entity=summaries'
]


module.exports = function fetchData() {
    //writeData writes the data to a file given the path
    //Same as in previous solution
    const writeData = (path, data) => {
        return new Promise((resolve, reject) => {
            try {
                fs.ensureFileSync(path)
                fs.writeJson(path, data, resolve(`${path} Write Successful`))
            } catch (e) {
                console.error(`${path} Write failed. ${e}`)
                reject(`${path} Write Failed. ${e}`)
            }
        })
    }

    const writeImage = (path, base64encodedData) => {
      return new Promise((resolve, reject) => {
        try {
          fs.ensureFileSync(path)
          fs.writeFile(path, new Buffer(base64encodedData, 'base64'), resolve(`${path} Write Successful`));
        } catch(e) {
          console.error(`${path} Write failed. ${e}`)
                reject(`${path} Write Failed. ${e}`)
        }
      })
    }

    const getData = async builder => {
        fs.emptyDir('static/data')
        console.log(`STARTING JSON BUILD FOR ${urls[0]},${urls[1]},${urls[2]}...`)
        const fetcher = []

        // Fetch list of events, members, and resources from API
        const allEvents = await axios.get(urls[0])
        const allMembers = await axios.get(urls[1])
        const allResources = await axios.get(urls[2])
        const allSummaries = await axios.get(urls[3])

        fetcher.push(writeData('static/data/events.json', { content: allEvents.data }))
        fetcher.push(writeData('static/data/members.json', { content: allMembers.data }))
        fetcher.push(writeData('static/data/resources.json', { content: allResources.data }))

        // download all image and save to static data
        fs.emptyDir(`static/image/summaries`)
        for (let summary of allSummaries.data) {
          const [ meta, base64encodedData ] = summary['image'].split(',')
          const extension = meta.split(';')[0].substring(11)
          const path = `static/image/summaries/${summary.id}.${extension}`
          fetcher.push(writeImage(path, base64encodedData))
          summary["image"] = `/nlp/image/summaries/${summary.id}.${extension}`
        }

        // Create list data of all summary data
        fs.emptyDir('static/data/summaries');
        fetcher.push(writeData('static/data/summaries/all.json', { content: allSummaries.data }));

        // Create summary per page data
        fs.emptyDir('static/data/summaries/page/');
        const countPerPage = 5
        const numPages = Math.ceil(allSummaries.data.length / countPerPage);
        for(let i=0; i < numPages; i++) {
          let page = i + 1;
          let start = i * countPerPage;
          let end = i * countPerPage + 5;
          let summariesPerPage = allSummaries.data.slice(start, end);
          let pageDataPath = `static/data/summaries/page/${page}/list.json`;

          fetcher.push(writeData(pageDataPath, { content: summariesPerPage, meta: { totalCount: allSummaries.data.length } }));
        }

        // Create summary per tag
        fs.emptyDir('static/data/summaries/tag/');
        const tagset = new Set(allSummaries.data.reduce((a, b) => [...a, ...b.tags], []));

        fetcher.push(writeData('static/data/summaries/tags.json', { content: Array.from(tagset) }));

        for (let tag of tagset) {
          let summariesByTag = allSummaries.data.filter(summary => summary.tags.includes(tag));
          let tagDataPath = `static/data/summaries/tag/${tag}/list.json`;

          fetcher.push(writeData(tagDataPath, { content: summariesByTag, meta: { totalCount: summariesByTag.length } }));
        }

        // Save Summary per Id
        fs.emptyDir(`static/data/summaries/id`);
        for(let summary of allSummaries.data) {
          let summaryPath = `static/data/summaries/id/${summary.id}.json`;

          fetcher.push(writeData(summaryPath, { content: summary, meta: { totalCount: allSummaries.data.length } }));
        }

        console.log(`PROCESSING events, members, resources, and summaries...`)

        return Promise.all(fetcher)
            .then(() => {
                console.log('JSON Build complete!')
            })
            .catch(e => {
                throw e
            })
    }

    // Run it before the nuxt build stage
    this.nuxt.hook('build:before', getData)
}
