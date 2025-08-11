<template>
  <div class="studio-selector-container">
    <div class="studio-selector">
      <button v-for="(images, roomName) in rooms" :key="roomName" @click="selectRoom(roomName)"
        :class="['studio-btn', { active: selectedRoom === roomName }]">
        {{ roomName }}
      </button>
    </div>

    <div class="content-wrapper">
      <div class="gallery-container" @mouseenter="pauseSlideshow" @mouseleave="resumeSlideshow">
        <transition name="fade" mode="out-in">
          <img :key="currentImageIndex" :src="currentImage" alt="Room image" class="gallery-image" />
        </transition>
        <div class="dots-container">
          <div v-for="(image, index) in currentRoomImages" :key="index" @click="goToSlide(index)"
            :class="{ active: currentImageIndex === index }" class="dot"></div>
        </div>
      </div>

      <div class="equipment-container">
        <h3>Оборудование</h3>
        <div class="equipment-list">
          <div class="equipment-item" v-for="(item, index) in currentEquipment" :key="index">
            <img :src="item.photo" :alt="item.name" class="equipment-image" />
            <div class="equipment-info">
              <div class="equipment-name">{{ item.name }}</div>
              <div class="equipment-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import roomsData from "@/assets/studios-data.json";
import equipmentData from "@/assets/studios-eq.json";

const rooms = roomsData.rooms;
const selectedRoom = ref(Object.keys(rooms)[0]);
const currentImageIndex = ref(0);
const slideshowInterval = ref(null);
const intervalDuration = 8000;

const currentRoomImages = computed(() => {
  return rooms[selectedRoom.value];
});

const currentEquipment = computed(() => {
  return equipmentData[selectedRoom.value] || [];
});

const currentImage = computed(() => {
  return currentRoomImages.value[currentImageIndex.value];
});

const selectRoom = (roomName) => {
  selectedRoom.value = roomName;
  currentImageIndex.value = 0;
  resetSlideshow();
};

const nextSlide = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % currentRoomImages.value.length;
};

const goToSlide = (index) => {
  currentImageIndex.value = index;
  resetSlideshow();
};

const startSlideshow = () => {
  slideshowInterval.value = setInterval(nextSlide, intervalDuration);
};

const pauseSlideshow = () => {
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value);
    slideshowInterval.value = null;
  }
};

const resumeSlideshow = () => {
  if (!slideshowInterval.value) {
    startSlideshow();
  }
};

const resetSlideshow = () => {
  pauseSlideshow();
  resumeSlideshow();
};

onMounted(() => {
  startSlideshow();
});

onUnmounted(() => {
  pauseSlideshow();
});
</script>

<style lang="scss" scoped>
.studio-selector-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  padding: 0 20px;
}

.studio-selector {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
}

.studio-btn {
  position: relative;
  padding: 10px 16px;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #5f6368;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  outline: none;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: transparent;
    transform: scaleX(0);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  &:hover {
    background-color: rgba(66, 133, 244, 0.08);
    color: #202124;
  }

  &.active {
    color: #3448c5;

    &::after {
      background-color: #3448c5;
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.3);
  }
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.gallery-container {
  position: relative;
  width: 70%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.equipment-container {
  width: 30%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 500px;
  overflow-y: auto;

  h3 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: #1f1f1f;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    position: relative;
    top: 0;
    background-color: #f8f9fa;
    z-index: 1;
  }
}

.equipment-container::-webkit-scrollbar {
  width: 4px;
}

.equipment-container::-webkit-scrollbar-track {
  background: transparent;
}

.equipment-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background-color 0.3s;
}

.equipment-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.equipment-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.equipment-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.equipment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.equipment-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f1f1f;
  margin-bottom: 4px;
}

.equipment-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.dots-container {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-container:hover .dots-container {
  opacity: 1;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;

  pointer-events: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  &.active {
    background-color: white;
    transform: scale(1.2);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
