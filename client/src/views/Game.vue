<template>
  <div>
    <div class="loading-start" v-if="loadingStart">
      <lottie-player
          src="https://assets10.lottiefiles.com/datafiles/a7kd2uysziSJpYt/data.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"  loop  autoplay >
      </lottie-player>
      <br>
      <h4 class="text-white">Please Wait...</h4>
    </div>
    <div v-if="!players.length">
      <form class="form-signin text-center" @submit.prevent="sendBroadcast">
        <img class="mb-4" src="https://i2.wp.com/d3g5ywftkpzr0e.cloudfront.net/wp-content/uploads/2020/01/16161919/hacktiv8.png?fit=300%2C300&ssl=1" alt="" width="120" height="120">
        <div>
          Select Mode:
          <select v-model="mode" class="mt-2 mb-3" required>
            <option value="create">Create Room</option>
            <option value="join">Join Room</option>
          </select>
        </div>
        <input type="text" v-model="roomName" class="form-control room-name" placeholder="Room Name" required autofocus>
        <input type="text" v-model="playerName" class="form-control user-name" placeholder="Your Username" required>
        <button class="btn btn-lg btn-primary btn-block mt-4" type="submit">{{ mode === 'join' ? 'Join' : 'Create'}} Room</button>
        <p class="mt-5 mb-3 text-muted">© 2020</p>
      </form>
    </div>
    <div v-else>
      <div class="text-center">
        <h3 class="mb-3">Room: {{players[0].roomName}}</h3>
        <button class="btn btn-sm btn-outline-secondary mb-5" v-if="isHost" @click="startGame">Start Game</button>
      </div>
      <div v-if="gameStart" class="text-center">
        <template v-if="!gameStart">
          <Card classContainer="col-md-12" :data="enemy" />
          <h2>HP: <b>{{enemy.hp}}</b></h2>
        </template>
         <div class="row justify-content-center mb-5" v-else>
            <div class="col-12 col-md-4">
              <div class="row align-items-center">
                <div class="col-auto position-relative">
                  <img style="position: relative; z-index: 2;" :src="`https://img.pokemondb.net/sprites/black-white/anim/normal/${enemy.pokemon_name.toLowerCase()}.gif`" alt="Charizard">
                  <img class="grass-battle" src="https://www.spriters-resource.com/resources/sheet_icons/39/41996.png" alt="grass battle">
                </div>
                <div class="col">
                  <div class="text-left">
                    <b>{{enemy.pokemon_name}}</b>
                  </div>
                  <div class="row align-items-center no-gutters hp-bar">
                    <div class="col-auto text-right">
                      <h5 class="mr-1 mb-0"><b>HP</b></h5>
                    </div>
                    <div class="col">
                      <div class="progress">
                        <div class="progress-bar" :style="`width: ${Math.ceil(enemy.hp/enemy.basic_hp*100) > 0 ? Math.ceil(enemy.hp/enemy.basic_hp*100) : '0'}%;`" role="progressbar" :aria-valuenow="Math.ceil(enemy.basic_hp/enemy.hp*100)" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    {{enemy.hp > 0 ? enemy.hp : 0}} / {{enemy.basic_hp}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        <hr>
      </div>
      <div class="row">
        <div class="col-md-6" v-for="(player, i) in players" :key="i">
          <div class="card p-3 mb-3 shadow-sm text-center position-relative" :class="nowTurn.trainerIdx === i ? 'active-turn' : ''">
            <div class="mb-3">
              <div class="image-sprite-container">
                <img src="image/pokemon-trainer-1.png" alt="trainer" :style="{left: `-${player.playerImage.left}00%`, top: `-${player.playerImage.top}00%`}">
              </div>
              Player Name: <b>{{player.playerName}}</b>
            </div>
            <div v-if="player.playerName == playerName || player.isReady">
              <div class="row no-gutters" v-if="player.isReady">
                <template v-if="!gameStart">
                  <Card v-for="(pokemon, idx) in player.pokemons" classContainer="col-6" :key="idx" :data="pokemon" :index="idx" />
                </template>
                <template v-else>
                  <div class="col-6" v-for="(pokemon, idx) in player.pokemons" :key="idx">
                    <img :src="pokemon.sprite2" :alt="pokemon.pokemon_name">
                    <br>
                    <b>{{pokemon.pokemon_name}}</b>
                    <div v-if="nowTurn.trainerIdx === i && playerName === players[nowTurn.trainerIdx].playerName && !gameEnd">
                      <button class="btn btn-sm btn-outline-primary" @click="pokemonAttack(pokemon, idx)">Attack!</button>
                    </div>
                  </div>
                </template>
              </div>
              <div class="row no-gutters" v-show="!isLoading" v-else>
                <Card v-for="(pokemon, idx) in pokemons" classContainer="col-6" :key="idx" :data="pokemon" :index="idx" />
              </div>
              <div v-show="isLoading" v-if="!player.isReady">
                <img src="https://cdn.dribbble.com/users/1771704/screenshots/6124573/pokeball-800x600.gif" class="img-fluid" alt="loading">
              </div>
              <div v-if="!gameStart">
                <div class="row no-gutters" v-if="player.playerName == playerName && !player.isReady">
                  <div class="col-md-6">
                    <button :disabled="chance === 0" class="btn btn-block btn-secondary" @click="getRandomPokemons">Get Random Pokemon ({{chance}})</button>
                  </div>
                  <div class="col-md-6">
                    <button :disabled="!pokemons.length" class="btn btn-block btn-primary" @click="isReady = true">Set Pokemon!</button>
                  </div>
                </div>
                <div class="row no-gutters" v-else>
                  <div class="col-md-12">
                    <button disabled class="btn btn-block btn-primary">PLAYER READY!</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../config/socket'
import axios from 'axios'
import Card from '../components/Card'
import Swal from 'sweetalert2'
import { Howl } from 'howler'
export default {
  name: 'GameView',
  data () {
    return {
      mode: '',
      roomName: '',
      playerName: '',
      players: [],
      pokemons: [],
      isLoading: false,
      chance: 3,
      isReady: false,
      gameStart: false,
      goal: 0,
      enemy: {},
      playerImage: {
        left: 0,
        top: 0
      },
      nowTurn: {},
      loadingStart: false,
      gameEnd: false,
      backsoundPlayed: false,
      backsound: ''
    }
  },
  components: {
    Card
  },
  computed: {
    isHost () {
      if (this.players.length) {
        return this.players.filter(player => player.playerName === this.playerName)[0].isCreator
      } else {
        return false
      }
    }
  },
  methods: {
    sendBroadcast () {
      const obj = {
        roomName: this.roomName,
        playerName: this.playerName,
        pokemons: this.pokemons,
        isReady: this.isReady,
        chance: this.chance,
        playerImage: this.playerImage,
        isCreator: this.isHost
      }
      if (this.mode === 'join') {
        socket.emit('join-room', obj)
      } else if (this.mode === 'create') {
        socket.emit('create-room', obj)
      }
    },
    getRandomPokemons () {
      this.isLoading = true
      axios.get('https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/pokemon_stats.json')
        .then(response => {
          const { data } = response
          const randomIndex1 = Math.floor(Math.random() * data.length)
          const randomIndex2 = Math.floor(Math.random() * data.length)
          const randomPokemon1 = data[randomIndex1]
          randomPokemon1.sprite = `https://img.pokemondb.net/sprites/black-white/normal/${randomPokemon1.pokemon_name.toLowerCase()}.png`
          randomPokemon1.sprite2 = `https://img.pokemondb.net/sprites/black-white/anim/normal/${randomPokemon1.pokemon_name.toLowerCase()}.gif`
          const randomPokemon2 = data[randomIndex2]
          randomPokemon2.sprite = `https://img.pokemondb.net/sprites/black-white/normal/${randomPokemon2.pokemon_name.toLowerCase()}.png`
          randomPokemon2.sprite2 = `https://img.pokemondb.net/sprites/black-white/anim/normal/${randomPokemon2.pokemon_name.toLowerCase()}.gif`
          this.pokemons = []
          this.pokemons.push(...[randomPokemon1, randomPokemon2])
          this.chance--
        })
        .catch(err => {
          console.log(err)
        })
        .finally(_ => {
          setTimeout(_ => {
            this.isLoading = false
          }, 2000)
        })
    },
    startGame () {
      const obj = {
        roomName: this.roomName,
        playerName: this.playerName,
        pokemons: this.pokemons,
        isReady: this.isReady,
        chance: this.chance,
        playerImage: this.playerImage,
        isCreator: this.isHost
      }
      socket.emit('trigger-start-room', obj)
    },
    pokemonAttack (pokemon, idx) {
      const obj = {
        pokemon: pokemon,
        attack: this.nowTurn.randomAttack[idx],
        nowTurn: this.players[this.nowTurn.trainerIdx]
      }
      console.log(obj)
      socket.emit('playing-game-server', obj)
    },
    playSound (filePath) {
      this.backsound = new Howl({
        src: filePath,
        volume: 0.2
      })
      this.backsound.play()
    },
    pokemonSound (pokename) {
      var pokeSound = new Howl({
        src: `https://cors-anywhere.herokuapp.com/https://play.pokemonshowdown.com/audio/cries/${pokename}.mp3`,
        volume: 0.5
      })
      pokeSound.play()
    }
  },
  created () {
    this.playerImage.left = Math.floor(Math.random() * 6)
    this.playerImage.top = Math.floor(Math.random() * 4)
    socket.on('get-in-to-the-room', (payload) => {
      console.log(payload)
      this.$set(this, 'players', payload)
      this.mode = 'join'
    })

    socket.on('start-game', (payload) => {
      console.log(payload)
      console.log('GAMEESTARTTT')
      this.loadingStart = false
      this.gameStart = true
      this.enemy = payload.enemy
      this.nowTurn = payload.nowTurn
    })

    socket.on('playing-game-client', (payload) => {
      console.log('play-client', payload)
      Swal.fire({
        html: `<div class="text-center">
            <div class="image-sprite-container">
              <img src="image/pokemon-trainer-1.png" alt="trainer" style="left: -${payload.nowTurn.playerImage.left}00%; top: -${payload.nowTurn.playerImage.top}00%">
            </div>
            Player ${payload.nowTurn.playerName}:<br>
            <b>${payload.pokemon.pokemon_name} Attack!</b>
          </div>`,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        },
        showConfirmButton: false,
        timer: 1000
      })
        .then(_ => {
          this.pokemonSound(payload.pokemon.pokemon_name.toLowerCase())
          Swal.fire({
            html: `<div class="text-center">
                <img src="${payload.pokemon.sprite}" /><br/>
                ${payload.pokemon.pokemon_name} Attack!<br>
                -${payload.attack}
              </div>`,
            showClass: {
              popup: 'animated fadeInDown faster'
            },
            hideClass: {
              popup: 'animated fadeOutUp faster'
            },
            showConfirmButton: false,
            timer: 2000
          })
            .then(_ => {
              this.enemy = payload.gameSet.enemy
              this.nowTurn = payload.gameSet.nowTurn
            })
        })
    })

    socket.on('game-end', (payload) => {
      Swal.fire({
        html: `<div class="text-center">
            <div class="image-sprite-container">
              <img src="image/pokemon-trainer-1.png" alt="trainer" style="left: -${payload.nowTurn.playerImage.left}00%; top: -${payload.nowTurn.playerImage.top}00%">
            </div>
            Winner Is Player ${payload.nowTurn.playerName}:<br>
            <b>Congratulation!!</b>
          </div>`,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        },
        showConfirmButton: false,
        timer: 10000
      })
    })

    socket.on('no-room', (payload) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: `${payload.message} <b>${payload.roomName}</b>`,
        timer: 1500
      })
    })

    socket.on('loading-begin', _ => {
      this.loadingStart = true
    })
  },
  watch: {
    isReady () {
      this.sendBroadcast()
    },
    'enemy.hp' () {
      if (this.enemy.hp <= 0) {
        this.gameEnd = true
      }
    },
    players () {
      if (this.players.length && !this.backsoundPlayed) {
        this.backsoundPlayed = true
        this.playSound('/sounds/101-opening.mp3')
      }
    },
    loadingStart () {
      if (this.loadingStart) {
        this.backsound.stop()
        this.playSound('/sounds/115-battle.mp3')
      }
    },
    gameEnd () {
      if (this.gameEnd) {
        this.backsound.stop()
        this.playSound('/sounds/116-victory.mp3')
      }
    }
  }
}
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin input.user-name {
  margin-bottom: -1px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}
.form-signin input.room-name {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.image-sprite-container {
  overflow: hidden;
  width: 68px;
  height: 70px;
  margin: auto;
}
.image-sprite-container img {
  position: relative;
}
.active-turn {
  border: 5px solid cadetblue !important;
}
.loading-start {
  display: flex;
  position: fixed;
  background: #00000045;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 999;
}
.loading-start h4 {
  position: relative;
  top: -180px;
}
.hp-bar {
  background-color: black;
  color: white;
  border-radius: 9px;
  padding: 3px 5px;
}
.grass-battle {
  position: absolute;
  width: 150%;
  left: -27%;
}
.progress-bar {
  background-color: #70f8a8 !important;
  border: 2px solid #e9ecef;
  border-radius: 5px !important;
}
</style>
