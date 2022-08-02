const esdb = require("../../ESUtils/elasticSearch");


async function getSearchDetails(body){
    
    try{
       
        let esIndex = "doctor"
        let esTemplate = "doctorTemplate"
        let params = {}
        params.fromValue = body.pageNo * body.pageSize
        params.sizeValue = body.pageSize
        params.queryValue = body.query
        
          //generating sort filters
          if (body.hasOwnProperty('sort') == true && Object.keys(body.sort.length > 0)) {            
            params.boolSort = true
            params.sortField = Object.keys(body.sort[0])[0]
            // console.log("chal de bhai2", Object.values(body.sort[0]));
            params.sortOrder=Object.values(body.sort[0])[0] 
        }
        
        //processing of Filters
        if (body.hasOwnProperty('filters') == true && Object.keys(body.filters.length > 0)) {
            
            params.boolFilter=true
            //console.log("in if")
            for (var key in body.filters) {
                // console.log("key : ",key)
                if(body.filters[key].length >0){
                    // console.log("chal de bhai2",body.filters[key][0]);
                    params = generateFilterStructure(params,key,body.filters[key][0])
                    
                }
            }
        }
        let dataObj = await esdb.templateSearch(params, esIndex,esTemplate)
        let output ={

        }

        output.hits=dataObj.hits.total.value
        output.result = dataObj.hits.hits.map((e)=>{return e._source})
       
        return output;

    }catch(err){}  
}

function generateFilterStructure(params, key, value) {
    // console.log("chal de bhai3",);
    // let suffix = key.substring(1);
    
    try {
        params['filter' + key.charAt(0).toUpperCase()+key.slice(1)] = true
        params[ key + 'Value'] = value
    } catch (error) {
        log.error('error', error)
        throw error.toString()
    }
    console.log("ssstring",params)
    return params;
}

module.exports={getSearchDetails};