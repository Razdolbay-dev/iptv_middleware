<template>
  <div class="player-screen" @keydown="onKeyDown" tabindex="0">
    <div class="overlay">Loading stream...</div>
  </div>
</template>

<script>
export default {
  name: "Player",
  props: { streamUrl: String },
  mounted() {
    this.initPlayer();
    this.$el.focus();
  },
  methods: {
    initPlayer() {
      const stb = window.gSTB || window.stb;
      if (!stb) {
        console.warn("STB API not detected");
        return;
      }
      try {
        stb.InitPlayer();
        stb.Play(this.streamUrl);
      } catch (err) {
        console.error("STB Play error:", err);
      }
    },
    onKeyDown(e) {
      const stb = window.gSTB || window.stb;
      if (!stb) return;
      switch (e.keyCode) {
        case 115: stb.Stop(); break; // Stop
        case 114: stb.Play(this.streamUrl); break; // Play
        case 27: this.$router.push("/tv"); break; // Exit
      }
    },
  },
};
</script>

<style scoped>
.player-screen {
  background: black;
  width: 100vw;
  height: 100vh;
  color: white;
}
</style>
