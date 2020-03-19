<template>
  <div>
    <h2>
      Detail Data Pokemon
    </h2>
    <table class="table table-striped">
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
          <td>Egg Groups</td>
          <td class="text-capitalize">{{egg_groups}}</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Evolves From Species</td>
          <td class="text-capitalize">{{data.evolves_from_species.name ? data.evolves_from_species.name : '-'}}</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Growth Rate</td>
          <td class="text-capitalize">{{data.growth_rate.name}}</td>
        </tr>
        <tr>
          <th scope="row">4</th>
          <td>Habitat</td>
          <td class="text-capitalize">{{data.habitat.name}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PokemonStats',
  props: ['data'],
  computed: {
    egg_groups () {
      if (this.data) return this.data.egg_groups.map(d => d.name).join(', ')
      return ''
    }
  }
}
</script>
