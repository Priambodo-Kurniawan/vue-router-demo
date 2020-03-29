const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const axios = require('axios')

var players = []
var startGame = false
var gameSet = {}

app.get('/', function(req, res){
  res.send('active!!')
});

io.on('connection', function(socket){
  console.log('a user connected')

  socket.on('create-room', payload => {
    socket.join(payload.roomName) // user join ke room yang dibuat sendiri
    let obj = {...payload, isCreator: true} // menandakan kalau dia creator
    socket.emit('get-in-to-the-room', [obj]) // memasukan creator ke room yang dibuatnya di client
    players.push(obj) // memasukan ke dalam global variable socket
  })

  socket.on('join-room', payload => {
    socket.join(payload.roomName)
    let checkRoom = players.filter(player => player.roomName === payload.roomName)

    if (!checkRoom.length) {
      io.to(payload.roomName).emit('no-room', {error: true, message: `no room with name `, roomName: payload.roomName})
      return false
    }
    let indexPlayer = players.findIndex(player => player.playerName === payload.playerName)

    // update or add player
    if (indexPlayer === -1) {
      players.push(payload)
    } else {
      players[indexPlayer] = payload
    }
    let filteredArr = players.filter(player => player.roomName === payload.roomName)
    io.to(payload.roomName).emit('get-in-to-the-room', filteredArr)

  })

  socket.on('trigger-start-room', payload => {
    io.to(payload.roomName).emit('loading-begin')

    let filteredArr = players.filter(player => player.roomName === payload.roomName)
    axios.get('https://pogoapi.net/api/v1/pokemon_stats.json')
      .then(response => {
        const { data } = response
        const randomIndex1 = Math.floor(Math.random() * data.length)
        const randomAttack1 = Math.ceil(Math.random() * 100)
        const randomAttack2 = Math.ceil(Math.random() * 100)
        const randomPokemon1 = data[randomIndex1]
        gameSet = {
          enemy: randomPokemon1,
          players: filteredArr,
          nowTurn: {
            trainerIdx: 0,
            randomAttack: [
              randomAttack1, randomAttack2
            ]
          }
        }

        let num = 0
        filteredArr.forEach(player => {
          num += player.pokemons[0].base_stamina
          num += player.pokemons[1].base_stamina
        })

        gameSet.enemy.hp = num
        gameSet.enemy.basic_hp = num
        io.to(payload.roomName).emit('start-game', gameSet)
      })
      .catch(err => {
        console.log(err)
      })
  })

  socket.on('playing-game-server', payload => {
    const randomAttack1 = Math.ceil(Math.random() * 100)
    const randomAttack2 = Math.ceil(Math.random() * 100)
    payload.gameSet = gameSet
    payload.gameSet.enemy.hp -= payload.attack
    payload.gameSet.nowTurn.trainerIdx = (payload.gameSet.nowTurn.trainerIdx+=1)%payload.gameSet.players.length
    if (payload.gameSet.enemy.hp <= 0) {
      setTimeout(_ => {
        io.to(payload.nowTurn.roomName).emit('game-end', payload)
      }, 4000)
    }
    payload.gameSet.nowTurn.randomAttack = [randomAttack1, randomAttack2]
    io.to(payload.nowTurn.roomName).emit('playing-game-client', payload)
  })
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});