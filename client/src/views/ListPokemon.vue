<template>
  <div>
    <div>
      <h2>List Pokemon</h2>
      <div class="row">
        <Card v-for="(pokemon, idx) in pokemons" :key="idx" :data="pokemon" :index="idx" />
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
      limit: 8
    }
  },
  components: {
    Card,
    Loading
  },
  methods: {
    getPokemons () {
      this.isLoading = true
      axios.get(`http://pokeapi.salestock.net/api/v2/pokemon/?limit=${this.limit}&offset=${this.offset}`)
        .then(response => {
          const { data } = response
          this.pokemons.push(...data.results)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(_ => {
          this.isLoading = false
        })
    }
  },
  created () {
    this.getPokemons()
  },
  watch: {
    offset () {
      this.getPokemons()
    }
  }
}
</script>
