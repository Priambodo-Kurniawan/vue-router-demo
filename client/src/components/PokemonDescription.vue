<template>
  <div>
    <h2>
      Description Pokemon
    </h2>
    <p>
      {{description}}
    </p>
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
          <td class="text-capitalize">{{data.evolves_from_species ? data.evolves_from_species.name : '-'}}</td>
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
  props: ['data'],
  computed: {
    description () {
      return this.data.flavor_text_entries.filter(data => data.language.name === 'en')[0].flavor_text
    },
    egg_groups () {
      if (this.data) return this.data.egg_groups.map(d => d.name).join(', ')
      return ''
    }
  },
  created () {
    console.log(this.data)
  }
}
</script>
