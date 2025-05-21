<template>
  <div class="navbar-wrapper" :class="{ scrolled: isScrolled }">
    <div class="navbar-content">
      <div class="logo-wrapper">MY.STUDIOS</div>
      <div class="links-wrapper">
        <span @click="scrollTo('about')">О нас</span>
        <span @click="scrollTo('booking')">Запись</span>
        <span @click="scrollTo('contacts')">Контакты</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isScrolled = ref(false);
const scrollThreshold = 730;

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > scrollThreshold;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

.navbar-wrapper {
  position: fixed;
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
  justify-content: space-between;
  align-items: center;
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

.links-wrapper {
  display: flex;
  gap: 32px;
  span {
    font-weight: 500;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: #3448c5;
    }
  }
}
</style>
