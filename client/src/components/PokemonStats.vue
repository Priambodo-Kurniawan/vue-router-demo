<template>
  <div>
    <h2>
      Detail Data Pokemon
    </h2>
    <table class="table table-striped" v-if="stats.id">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Attribute</th>
          <th scope="col">Data</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Types</td>
          <td class="text-capitalize">{{types}}</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Height</td>
          <td class="text-capitalize">{{stats.height}}</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Weight</td>
          <td class="text-capitalize">{{stats.weight}}</td>
        </tr>
        <tr>
          <th scope="row">4</th>
          <td>Moves</td>
          <td class="text-capitalize">{{moves}} ...</td>
        </tr>
      </tbody>
    </table>
    <div v-if="!stats.id">
      <Loading/>
    </div>
  </div>
</template>

<script>
import Loading from '../components/Loading'
export default {
  name: 'PokemonStats',
  components: {
    Loading
  },
  props: ['data', 'stats'],
  computed: {
    types () {
      return this.stats.types.map(data => data.type.name).join(', ')
    },
    moves () {
      return this.stats.moves.map((data, i) => data.move.name).filter((data, i) => i < 10).join(', ')
    }
  },
  created () {
    if (!this.stats.id) {
      this.$emit('getData')
    }
  }
}
</script>
