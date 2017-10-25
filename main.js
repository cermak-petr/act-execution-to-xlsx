const Apify = require('apify');
const _ = require('underscore');
const Promise = require('bluebird');

Apify.main(async () => {
    Apify.setPromisesDependency(Promise);
    
    // get Act input and validate it
    const input = await Apify.getValue('INPUT');
    if(!input._id){
        return console.log('missing "_id" attribute in INPUT');
    }
    
    var fullResults = [];
    function processResults(results){
        _.each(results.items, function(item, index){
            const pfr = item.pageFunctionResult;
            if(pfr){
                if(Array.isArray(pfr) && pfr.length > 0){
                    fullResults = fullResults.concat(pfr);
                }
                else{fullResults.push(pfr);}
            }
        });
    }
    
    // set global executionId
    Apify.client.setOptions({executionId: input._id});
    
    // loop through pages of results and deduplicate them
    const limit = 200;
    let total = null, offset = 0;
    while(total === null || offset + limit < total){
        const results = await Apify.client.crawlers.getExecutionResults({limit: limit, offset: offset});
        processResults(results);
        total = results.total;
        offset += limit;
    }
    
    const run = await Apify.call(
        'petr_cermak/json-to-xlsx',
        fullResults
    );
    
    console.dir(run);
    const url = run.output.body.output;
    await Apify.setValue('OUTPUT', {output: url});
    console.log('Output URL: ' + url);
});
