<template>
  <div>
    <div>
      <h2>List Card</h2>
      <div class='form-row'>
        <div class='form-group col-md-4'>
          <label for='cardType'>Card Type</label>
          <select id='cardType' v-model="filter.supertype" class='form-control'>
            <option value='' selected>Choose...</option>
            <option v-for="(stype, i) in supertypeList" :key="i">{{stype}}</option>
          </select>
        </div>
        <div class='form-group col-md-4'>
          <label for='subType'>Sub Type</label>
          <select id='subType' v-model="filter.subtype" class='form-control'>
            <option value='' selected>Choose...</option>
            <option v-for="(subtype, i) in subtypeList" :key="i">{{subtype}}</option>
          </select>
        </div>
        <div class='form-group col-md-4' v-if="filter.supertype == 'Pokémon'">
          <label for='typePokemon'>Type Pokemon</label>
          <select id='typePokemon' v-model="filter.type" class='form-control'>
            <option value='' selected>Choose...</option>
            <option v-for="(type, i) in typeList" :key="i">{{type}}</option>
          </select>
        </div>
      </div>
      <div class='row'>
        <Card v-for='card in cards' :key='card.id' :data='card' />
      </div>
      <div v-if='isLoading'>
        <Loading />
      </div>
      <div class="text-center pt-3 pb-5" v-if='!isLoading'>
        <button class="btn btn-primary" @click="page++">Load More</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Card from '../components/Card'
import Loading from '../components/Loading'
export default {
  name: 'ListCard',
  data () {
    return {
      cards: [],
      filter: {
        supertype: '',
        subtype: '',
        type: ''
      },
      page: 1,
      supertypeList: [
        'Energy',
        'Pokémon',
        'Trainer'
      ],
      subtypeList: [
        'EX',
        'Special',
        'Restored',
        'Level Up',
        'MEGA',
        'Technical Machine',
        'Item',
        'Stadium',
        'Supporter',
        'Stage 1',
        'GX',
        'Pokémon Tool',
        'Basic',
        'LEGEND',
        'Stage 2',
        'BREAK',
        'Rocket\'s Secret Machine'
      ],
      typeList: [
        'Colorless',
        'Darkness',
        'Dragon',
        'Fairy',
        'Fighting',
        'Fire',
        'Grass',
        'Lightning',
        'Metal',
        'Psychic',
        'Water'
      ],
      isLoading: false
    }
  },
  components: {
    Card,
    Loading
  },
  methods: {
    getCards () {
      this.isLoading = true
      axios.get(`https://api.pokemontcg.io/v1/cards?pageSize=8&page=${this.page}&supertype=${this.filter.supertype}&subtype=${this.filter.subtype}&types=${this.filter.type}`)
        .then(response => {
          const { data } = response
          this.cards.push(...data.cards)
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
    this.getCards()
  },
  watch: {
    filter: {
      handler () {
        this.cards = []
        this.getCards()
      },
      deep: true
    },
    page () {
      this.getCards()
    }
  }
}
</script>
