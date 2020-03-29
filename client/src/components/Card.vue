<template>
  <div :class="classContainer ? classContainer : 'col-md-3 col-6'">
    <div class="card mb-3 shadow-sm text-center position-relative">
      <div class="p-1 position-relative">
        <img class="img-fluid" :src="data.imageUrl ? data.imageUrl : image" alt="">
        <img :src="sprite" :alt="data.name" v-if="!data.id" class="image-sprite">
      </div>
      <div class="card-body">
        <h5 class="text-capitalize"><b>{{data.name ? data.name : data.pokemon_name}}</b></h5>
        <div v-if="type" class="type-tag">
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary btn-sm" :style="{backgroundColor: getColorStyle(type)}" v-for="(type, i) in type.type" :key="i">
              <input type="radio" name="options" id="option1" checked> {{type}}
            </label>
          </div>
        </div>
        <div class="mt-3" v-if="!data.id">
          <button class="btn btn-secondary btn-sm btn-block" @click="goToDetailPokemon">View Detail</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'index', 'type', 'classContainer'],
  computed: {
    image () {
      let pokemonId = this.index + 1
      if (this.data.pokemon_id) {
        pokemonId = this.data.pokemon_id
      }
      const s = '000' + pokemonId
      const indexLength = pokemonId.toString().split('').length
      const imageName = s.substr(indexLength)
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${imageName}.png`
    },
    colorType () {
      return this.$store.state.colorType
    },
    sprite () {
      return `https://img.pokemondb.net/sprites/black-white/anim/normal/${this.data.name ? this.data.name : this.data.pokemon_name.toLowerCase()}.gif`
    }
  },
  methods: {
    goToDetailPokemon () {
      let pokemonName = this.data.name
      if (this.data.pokemon_name) {
        pokemonName = this.data.pokemon_name.toLowerCase()
        const routeData = this.$router.resolve({ name: 'DetailPokemon', params: { name: pokemonName } })
        window.open(routeData.href, '_blank')
      } else {
        this.$router.push({ name: 'DetailPokemon', params: { name: pokemonName } })
      }
    },
    getColorStyle (type) {
      type = type.toLowerCase()
      const hexa = this.colorType.filter(d => {
        return d.name === type
      })[0].color
      return '#' + hexa
    }
  }
}
</script>

<style>
.type-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}
.type-tag .btn {
  font-size: 11px;
}
.image-sprite {
  position: absolute;
  left: 20px;
  bottom: 10px;
}
</style>
