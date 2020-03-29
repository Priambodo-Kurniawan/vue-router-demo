<template>
  <div>
    <div>
      <h2>List Pokemon</h2>
      <div class="row">
        <Card v-for="(pokemon, idx) in pokemons" :key="idx" :data="pokemon" :index="idx" :type="getTypePokemon(idx)" />
      </div>
      <div v-if="isLoading">
        <Loading />
      </div>
      <div class="text-center pt-3 pb-5" v-if='!isLoading'>
        <button class="btn btn-primary" @click="offset += limit">Load More</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Card from '../components/Card'
import Loading from '../components/Loading'
export default {
  data () {
    return {
      pokemons: [],
      isLoading: false,
      offset: 0,
      limit: 8,
      typePokemons: []
    }
  },
  components: {
    Card,
    Loading
  },
  methods: {
    getPokemons () {
      this.isLoading = true
      axios.get(`https://cors-anywhere.herokuapp.com/http://pokeapi.salestock.net/api/v2/pokemon/?limit=${this.limit}&offset=${this.offset}`)
        .then(response => {
          const { data } = response
          this.pokemons.push(...data.results)
        })
        .catch(err => {
          // console.log(err)
          alert(err.response)
        })
        .finally(_ => {
          this.isLoading = false
        })
    },
    getTypePokemons () {
      axios.get('https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/pokemon_types.json')
        .then(response => {
          const { data } = response
          this.typePokemons = data
        })
        .catch(err => {
          // console.log(err)
          alert(err.response)
        })
    },
    getTypePokemon (idx) {
      return this.typePokemons.filter(type => type.pokemon_id === (idx + 1))[0]
    }
  },
  created () {
    this.getPokemons()
    this.getTypePokemons()
  },
  watch: {
    offset () {
      this.getPokemons()
    }
  }
}
</script>
