<template>
  <transition name="navbar-slide" appear>
    <NavigationBar />
  </transition>

  <div class="page-content">
    <transition name="staggered-fade" appear>
      <WeeklyAnalytics></WeeklyAnalytics>
    </transition>
    <transition name="staggered-fade" appear>
      <TotalAnalytics></TotalAnalytics>
    </transition>
    <transition name="staggered-fade" appear> </transition>
    <transition name="staggered-fade" appear> </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavigationBar from "./components/NavigationBar.vue";
import WeeklyAnalytics from "./components/WeeklyAnalytics.vue";
import TotalAnalytics from "./components/TotalAnalytics.vue";

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<style lang="scss" scoped>
.page-content {
  width: 100vw;
  display: flex;
  flex-direction: row;
}

.page-content > *:first-child {
  flex: 0 0 60%;
  overflow-y: auto;
}

.page-content > *:last-child {
  flex: 0 0 40%;
  overflow-y: auto;
}

.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.8s ease;
}

.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.staggered-fade-move {
  transition: all 0.8s ease;
}

.staggered-fade-enter-active:nth-child(1) {
  transition-delay: 0.2s;
}
.staggered-fade-enter-active:nth-child(2) {
  transition-delay: 0.4s;
}
.staggered-fade-enter-active:nth-child(3) {
  transition-delay: 0.6s;
}
.staggered-fade-enter-active:nth-child(4) {
  transition-delay: 0.8s;
}

.navbar-slide-enter-active {
  transition: all 0.6s ease;
}
.navbar-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.navbar-slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
