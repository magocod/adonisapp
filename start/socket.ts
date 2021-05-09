import Ws from 'App/Services/Ws'

Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  console.log('socket.id', socket.id)
  console.log('query', socket.handshake.query)
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)
  })

  socket.on('client:info', (data) => {
    console.log(data)
  })
})
