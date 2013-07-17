io = require('socket.io').listen(80)
io.sockets.on 'connection', (socket) ->
    socket.on 'message', (data) ->
        socket.broadcast.emit('message', {message: data})
