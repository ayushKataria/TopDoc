
const bcrypt = require('bcrypt')

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
}
