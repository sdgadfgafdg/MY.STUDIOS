<template>
  <transition name="navbar-slide" appear>
    <NavigationBar />
  </transition>

  <div class="page-content">
    <div class="headline-wrapper">
      <span class="typewriter">Ваша музыка начинается здесь.</span>
    </div>

    <transition name="staggered-fade" appear>
      <div v-if="mounted" class="fade-item">
        <StudioSelector />
      </div>
    </transition>
    <transition name="staggered-fade" appear>
      <div v-if="mounted" class="fade-item">
        <MapInfo />
      </div>
    </transition>
    <transition name="staggered-fade" appear>
      <div v-if="mounted" class="fade-item">
        <Calendar />
      </div>
    </transition>
    <transition name="staggered-fade" appear>
      <div v-if="mounted" class="fade-item">
        <Footer />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavigationBar from "./components/NavigationBar.vue";
import StudioSelector from "./components/StudioSelector.vue";
import Calendar from "./components/Calendar.vue";
import MapInfo from "./components/MapInfo.vue";
import Footer from "./components/Footer.vue";

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>


<style lang="scss" scoped>
.page-content {
  padding-top: 30px;
}

.headline-wrapper {
  font-family: "Inter", sans-serif;
  font-size: 36px;
  font-weight: 600;
  color: #1f1f1f;
  text-align: center;
  letter-spacing: 0.3px;
  max-width: 800px;
  margin: 32px auto 24px auto;
}

.typewriter {
  display: inline-block;
  overflow: hidden;
  border-right: 2px solid #1f1f1f;
  white-space: nowrap;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0.3px;
  max-width: 600px;
  animation: typing 2s steps(30, end) forwards, blink 0.7s step-end 3,
    fade-out-border 0s 2.5s forwards;
}

@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

@keyframes fade-out-border {
  to {
    border-color: transparent;
  }
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
