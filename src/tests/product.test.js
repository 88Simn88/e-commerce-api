const request = require('supertest')
const app = require('../app')
require("../models")
const Category = require('../models/Category')
const ProductImg = require('../models/ProductImg')

const URL_BASE = '/api/v1/products'
const URL_BASE_USERS = '/api/v1/users/login'
let TOKEN 
let category
let productImg
let productId

beforeAll(async()=>{
    const user = {
        email: "agustin@gmail.com",
        password: "agustin1234"
    }

    const res = await request(app)
            .post(URL_BASE_USERS)
            .send(user)

    TOKEN = res.body.token
})

test("POST -> 'URL_BASE', should return status code 201 and res.body.title === body.title",
async()=>{

    const categoryBody = {
        name: "Tech"
    }

    category = await Category.create(categoryBody)

    const product = {
        title: "xiaomi 12",
        description: "lorem12",
        price: "189.98",
        categoryId: category.id
    }

    const res = await request(app)
        .post(URL_BASE)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`)

    productId = res.body.id    
    expect(res.status).toBe(201)
    expect(res.body.title).toBe(product.title)
})

test("GET -> 'URL_BASE', should return status code 200 and res.body has length(1)",
async()=>{

       const res = await request(app)
        .get(URL_BASE)
            
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].productImgs).toBeDefined()
})

test("GET -> 'URL_BASE?category = category.id', should return status code 200, and res.body has length(1) and res.body[0] to be defined",
async()=>{

       const res = await request(app)
        .get(`${URL_BASE}?category=${category.id}`)
            
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].productImgs).toBeDefined()
})


test("GET ONE -> 'URL_BASE/:id', should return status code 200 and res.body.title === xiaomi 12",
async()=>{

       const res = await request(app)
        .get(`${URL_BASE}/${productId}`)
            
    
    expect(res.status).toBe(200)
    expect(res.body.title).toBe("xiaomi 12")
    expect(res.body.category).toBeDefined()
    expect(res.body.productImgs).toBeDefined()
})

test("PUT -> 'URL_BASE/:id', should return status code 200 and res.body.title",
async()=>{

    const product = {
        title: "Iphone 12",
        description: "lorem12",
        price: "189.98",
        categoryId: category.id
    }

       const res = await request(app)
        .put(`${URL_BASE}/${productId}`)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`)
            
    expect(res.status).toBe(200)
    expect(res.body.title).toBe(product.title)
})

test("POST 'BASE_URL/:id/images', should return status code 200, res.body.length === 1",
async()=>{

    const productImgBody = {
        url: "http://localhost:8080/api/v1/public/uploads/cocina.jpg",
        filename: "cocina.jpg",
        productId
    }

    productImg = await ProductImg.create(productImgBody)

    const res = await request(app)
        .post(`${URL_BASE}/${productId}/images`)
        .send([productImg.id])
        .set("Authorization", `Bearer ${TOKEN}`)

})

test("GET ONE -> 'URL_BASE/:id', should return status code 204",
async()=>{

       const res = await request(app)
        .delete(`${URL_BASE}/${productId}`)
        .set("Authorization", `Bearer ${TOKEN}`)
            
    expect(res.status).toBe(204)
    
    await category.destroy()
    await productImg.destroy()
})