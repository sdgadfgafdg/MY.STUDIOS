<template>
  <div class="navbar-wrapper">
    <div class="navbar-content">
      <div class="logo-wrapper">MY.STUDIOS ANALYTICS</div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

.navbar-wrapper {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: white;
  transition: all 0.2s ease;

  &.scrolled {
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
}

.navbar-content {
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  height: 60px;
  padding: 0 50px;
  margin: 0 auto;
  width: 100%;
}

.logo-wrapper {
  font-size: 24px;
  font-weight: 700;
  color: #1f1f1f;
  letter-spacing: 0.5px;
}
</style>
