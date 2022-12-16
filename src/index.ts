/*
Modules used.
*/

const N3 = require('n3');
const axios = require('axios');
const roxi = require('roxi-js');

/*
* Parameters for Roxi RSP Engine
*/

let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dbo: <http://dbpedia.org/ontology/> SELECT ?files WHERE { ?files rdf:type dbo:Image }";
let rules = "";
let window = 60;
let slide = 15;
let abox = ""
let rspEngine = roxi.JSRSPEngine.new(window, slide, rules, abox, query, rsp_callback);

/*
* Parameters for fetching data from DBPedia
*/

let requestTimeInterval: number = 1000;
let resourceToFetch: string = 'http://api.live.dbpedia.org/resource/en/Berlin';

function rsp_callback(bindings: any) {
    console.log('------------------------------------------------------');
    console.log(`Variable   ------------Value---------------  Timestamp`);

    for (let value of bindings) {
        console.log(`${value.getVar()} ${value.getValue()} ${epoch(new Date())}`);
    }
}

function fetchWithInterval(interval: number) {
    setInterval(async () => {
        await axios.get(resourceToFetch, {
            responseType: 'stream',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/n-triples',
            }
        }).then((response: any) => {
            response.data.pipe(new N3.StreamParser()).on('data', (triple: any) => {
                let timestamp = epoch(new Date());
                rspEngine.add(`${triple.subject.value} ${triple.predicate.value} ${triple.object.value}`, timestamp)
            });
        }).catch((error: any) => {
            console.log(`Error encountered is: ${error}`);
        });
    }, interval);
}

fetchWithInterval(requestTimeInterval);

function epoch(date: any) {
    return Date.parse(date);
}

export = { epoch };