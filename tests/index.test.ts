const epoch = require('../src/index.ts').epoch;
test('return epoch time for the date', () => {
    let date = new Date();
    let epochTime = epoch(date);
    expect(epochTime).toBeGreaterThan(0);
})

/*
    * This test is to check if the fetchWithInterval function is called with the correct parameters
*/

const fetchWithInterval = require('../src/index.ts').fetchWithInterval;
test('fetch data from the resource', () => {
    let interval = 1000;
    let resource = 'http://api.live.dbpedia.org/resource/en/Berlin';
    let data = fetchWithInterval(interval, resource)
    expect(data).toHaveBeenCalled();
});