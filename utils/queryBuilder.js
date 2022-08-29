

function userUpdateQueryBody(obj, id){
    let arrOfConcatSource = []
    userUpdateQuery = {
        "script":{
            "source":{

            },
            "params":{
                
            }
        },
        "query": {
            "term":{
                "id":id
            }
        }
    }

    if(obj.hasOwnProperty('DOB')){
        arrOfConcatSource.push("ctx._source.DOB = params.DOB")
        userUpdateQuery.script.params.DOB = obj.DOB
    }
    if(obj.hasOwnProperty('gender')){
        arrOfConcatSource.push("ctx._source.gender = params.gender")
        userUpdateQuery.script.params.gender = obj.gender
    }
    if(obj.hasOwnProperty('email')){
        arrOfConcatSource.push("ctx._source.email = params.email")
        userUpdateQuery.script.params.email = obj.email
    }
    if(obj.hasOwnProperty('mobile')){
        arrOfConcatSource.push("ctx._source.mobile = params.mobile")
        userUpdateQuery.script.params.mobile = obj.mobile
    }
    if(obj.hasOwnProperty('address')){
        arrOfConcatSource.push("ctx._source.address = params.address")
        userUpdateQuery.script.params.address = obj.address
    }
    if(obj.hasOwnProperty('landmark')){
        arrOfConcatSource.push("ctx._source.landmark = params.landmark")
        userUpdateQuery.script.params.landmark = obj.landmark
    }
    if(obj.hasOwnProperty('locality')){
        arrOfConcatSource.push("ctx._source.locality = params.locality")
        userUpdateQuery.script.params.locality = obj.locality
    }
    if(obj.hasOwnProperty('city')){
        arrOfConcatSource.push("ctx._source.city = params.city")
        userUpdateQuery.script.params.city = obj.city
    }
    if(obj.hasOwnProperty('state')){
        arrOfConcatSource.push("ctx._source.state = params.state")
        userUpdateQuery.script.params.state = obj.state
    }
    if(obj.hasOwnProperty('country')){
        arrOfConcatSource.push("ctx._source.country = params.country")
        userUpdateQuery.script.params.country = obj.country
    }
    if(obj.hasOwnProperty('Zipcode')){
        arrOfConcatSource.push("ctx._source.Zipcode = params.Zipcode")
        userUpdateQuery.script.params.Zipcode = obj.Zipcode
    }
    if(obj.hasOwnProperty('role')){
        arrOfConcatSource.push("ctx._source.role = params.role")
        userUpdateQuery.script.params.role = obj.role
    }
    if(obj.hasOwnProperty('language')){
        arrOfConcatSource.push("ctx._source.language = params.language")
        userUpdateQuery.script.params.language = obj.language
    }
    if(obj.hasOwnProperty('blood_donor')){
        arrOfConcatSource.push("ctx._source.blood_donor = params.blood_donor")
        userUpdateQuery.script.params.blood_donor = obj.blood_donor
    }
    
    let text = arrOfConcatSource.join("; ");
    userUpdateQuery.script.source = text
    return userUpdateQuery
}
module.exports = {
    userUpdateQueryBody
}