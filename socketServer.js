const users = []

const socketServer = (socket) => {
  socket.on('joinUser', (id) => {
    users.push({id, socketId: socket.id})
    console.log({users})
  })
  socket.on('disconnect', () => {
    const user = users.filter((user) => user.socketId !== socket.id)
    console.log({user})
  })

  // like - unlike
  socket.on('likePost', (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id]
    const clients = users.filter((user) => ids.includes(user.id))
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('likeToClient', newPost)
      })
    }
  })
  socket.on('unlikePost', (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id]
    const clients = users.filter((user) => ids.includes(user.id))
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('unlikeToClient', newPost)
      })
    }
  })
  socket.on('createComment', (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id]
    const clients = users.filter((user) => ids.includes(user.id))
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
      })
    }
  })
  socket.on('deleteComment', (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id]
    const clients = users.filter((user) => ids.includes(user.id))
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
      })
    }
  })
  socket.on('addfriend', (newUser) => {
    const user = users.filter((user) => user.id === newUser.id)
    user && socket.to(`${user.socketId}`).emit('addfriendToClient', newUser)
  })
  socket.on('unfriend', (newUser) => {
    const user = users.filter((user) => user.id === newUser.id)
    user && socket.to(`${user.socketId}`).emit('unfriendToClient', newUser)
  })
}
module.exports = socketServer
