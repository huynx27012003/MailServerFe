<template>
  <div id="windows">
    <TopBar id="top-bar" />
    <section id="main-windows">
      <router-view ref="mainWindows" />
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import TopBar from "@/components/TopBar/index.vue";

export default {
  components: {
    TopBar,
  },
  mounted() {
    this.$nextTick(() => {
      const mainSection =
        this.$refs.mainWindows?.$el || document.getElementById("main-windows");
      if (mainSection) {
        mainSection.style.height = `calc(100vh - 6vh)`;
      }
    });
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Helvetica, Arial,
    sans-serif;
  font-weight: 400;
}

#windows {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#top-bar {
  flex: 0 0 6vh;
  z-index: 100;
}

#main-windows {
  flex: 1;
  height: 95vh;
  // transform: translateY(7vh);
  overflow: visible;
}

[id] {
  scroll-margin-top: 80px; /* điều chỉnh theo chiều cao thực tế của TopBar */
}
</style>
