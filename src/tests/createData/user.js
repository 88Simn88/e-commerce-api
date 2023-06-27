const User = require("../../models/User")

const user = async ()=>{

    const userCreate = {
        firstName: "Agustín",
        lastName: "Seoane",
        email: "agustin@gmail.com",
        password: "agus1234",
        phone: "1234567890"
    }

    await User.create(userCreate)

}

module.exports = user