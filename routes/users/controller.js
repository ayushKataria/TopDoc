
const bcrypt = require('bcrypt')
const docController = require('../doctors/controller')



async function signup(request){
    try {
        if(request.hasOwnProperty("email")){
            const user = new User({
                email: request.body.email,
                password: bcrypt.hash(request.body.password)
            });
        }
        if(request.hasOwnProperty("phone")){
            const user = new User({
                email: request.body.phone,
                password: request.body.password
            });
        }
    } catch (error) {
        if (error.statuscode){
            throw error
        } else {
            throw{ statuscode: 500, err: "internal server error", message: "unexpected error"}
        }
    }
    if (request.hasOwnProperty("phone")) {
      const user = new User({
        email: request.body.phone,
        password: request.body.password,
      });
    }
  } catch (error) {
    if (error.statuscode) {
      throw error;
    } else {
      throw {
        statuscode: 500,
        err: "internal server error",
        message: "unexpected error",
      };
    }
  }
}



async function medicalDetails(body){
    console.log("Fields to fetch 1")
    id = body.id;
    role = body.role;
    fieldsToFetch = body.fields;
    size=body.size;
    console.log("Fields to fetch 1", fieldsToFetch)
    // console.log("Fields to fetch ",fieldsToFetch)
    let data = await docController.getProfileDetailsController(id, role, ["medicalDetails"])
    // .then((data) => res.send(data))
    data=data.results[0].medicalDetails
    // .catch((err) => res.status(err.statuscode).send(err));  
    // console.log("Fields to fetch 1", data)                               
    data.sort(function (a, b) {
        var dateA = new Date(a.orderDate), dateB = new Date(b.orderDate)
        return dateB - dateA
        });
        console.log("Fields to fetchaaaaaaaaaaaaaaaaaaaa", fieldsToFetch)
    let MedicalList=[];
    console.log(fieldsToFetch)
    for(let i =1;i<=size;i++){
        // while(size>0){
      let fieldData = data[i][fieldsToFetch];     //hardcode value is working
      let fieldDate=data[i].orderDate;
      console.log(fieldData)
      console.log(fieldDate)
      if(fieldData==null){
        size=size+1;
      }else{
        MedicalList.push({date:fieldDate,data:fieldData});
        // console.log("bbbbbbb",MedicalList)
        // size--;
      }
    } 
    return MedicalList ;
}
  

module.exports = { medicalDetails };
