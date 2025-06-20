<template>
  <div id="app">
    <nav class="p-4 bg-green-600 text-white">
      <router-link to="/" class="mr-4" exact></router-link>
     
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>

</style>
