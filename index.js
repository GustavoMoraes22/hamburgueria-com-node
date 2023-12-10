const express = require('express')

const app = express()
const port = 3000
app.use(express.json())
const uuid = require("uuid")

const requestsFood = []


const checkRequestsFoodId = (request, response, next) => {
    const { id } = request.params

    const index = requestsFood.findIndex(requestClient => requestClient.id === id)

    if (index < 0) {
        return response.status(404).json({ message: 'user not found' })
    }

    request.index = index
    request.id = id

    next()
}

const checkMethod = (request, response, next) => {

    const method = request.method
    const url = request.url

    console.log(`[${method}] - ${url}`)



    next()
}

app.post('/order', checkMethod, (request, response) => {


    const { order, clientName, price } = request.body
    const requestClient = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }

    requestsFood.push(requestClient)

    return response.status(201).json(requestClient)
})

app.get('/order', checkMethod, (request, response) => {


    return response.json(requestsFood)
})

app.put('/order/:id', checkRequestsFoodId, checkMethod, (request, response) => {

    const index = request.index
    const id = request.id
    const { order, clientName, price, status } = request.body


    const updateRequest = { id, order, clientName, price, status }

    requestsFood[index] = updateRequest

    return response.json(updateRequest)
})

app.delete('/order/:id', checkRequestsFoodId, checkMethod, (request, response) => {

    const index = request.index
    requestsFood.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkRequestsFoodId, checkMethod, (request, response) => {

    const index = request.index

    return response.json(requestsFood[index])
})

app.patch('/order/:id', checkRequestsFoodId, checkMethod, (request, response) => {

    const index = request.index

    requestsFood[index].status = 'Pronto'

    return response.json(requestsFood[index])
})



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} `)
})