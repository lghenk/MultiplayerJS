const net = require('net')

const socket = net.createConnection({ host: 'localhost', port: 2000 })

// TODO: Delet dis

socket.on('connect', () => {
  console.log('Connection to server has been made')
  socket.write('test\n')
  // socket.write('createParty')
})

socket.on('data', (data) => {
  console.log(data.toString('utf8') + '|-|')
  let d = data.toString('utf8').trim().split('|')

  if (d[0] == 'welcome') { socket.write('match.initialize') }
})
