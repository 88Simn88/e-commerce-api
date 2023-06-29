const request = require("supertest")
const app = require("../app")

const URL_BASE = '/api/v1/users'
let TOKEN 

let userId

beforeAll(async()=>{
    const user = {
        email: "agustin@gmail.com",
        password: "agustin1234"
    }

    const res = await request(app)
            .post(`${URL_BASE}/login`)
            .send(user)

    
    TOKEN = res.body.token
})

test("GET -> 'URL_BASE', should return status code 200 and res.body to have length 1",
async()=>{

    const res = await request(app)
            .get(URL_BASE)
            .set('Authorization' ,`Bearer ${TOKEN}`)

            
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)

})

test("POST -> 'URL_BASE', should return status code 201 and res.body.firstName === body.firstName ", async()=>{

    const userCreate = {
        firstName: "Daniela",
        lastName: "Soledad",
        email: "daniela@gmail.com",
        password: "daniela1234",
        phone: "1234567890"
    }

    

    const res = await request(app)
            .post(URL_BASE)
            .send(userCreate)

            
    userId = res.body.id        
    expect(res.status).toBe(201)
    expect(res.body.firstName).toBe(userCreate.firstName)

})

test("PUT -> 'URL_BASE/:id', should return status code 200 and res.body.firstName=== body.firstName", async()=>{
    const userUpdate = {
        firstName: "Daniela"
    }

    const res = await request(app)
            .put(`${URL_BASE}/${userId}`)
            .send(userUpdate)
            .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body.firstName).toBe(userUpdate.firstName)
})

test("POST 'URL_BASE/login', should return status code 200, res.body.email === body.email, and token defined",
async()=>{
    const userLogin = {
        email: "daniela@gmail.com",
        password: "daniela1234",
    }

    const res = await request(app)
            .post(`${URL_BASE}/login`)
            .send(userLogin)


    
    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(userLogin.email)
    expect(res.body.token).toBeDefined()
})

test("POST 'URL_BASE/login', should return status code 401 ",
async()=>{
    const userLogin = {
        email: "daniela@gmail.com",
        password: "invalid password",
    }

    const res = await request(app)
            .post(`${URL_BASE}/login`)
            .send(userLogin)

    expect(res.status).toBe(401)

})

test("DELETE -> 'URL_BASE/:id', should return status code 204",
 async()=>{

    const res = await request(app)
            .delete(`${URL_BASE}/${userId}`)
            .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
  
})