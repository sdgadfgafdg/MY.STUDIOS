<template>
  <div class="wrapper" id="about">
    <div class="company-map">
      <div class="text">
        <h2>О студии</h2>
        <p>
          MY.STUDIOS — это место, где с 2015 года рождается живой звук. Мы создали комфортное пространство для репетиций, творчества и вдохновения как для начинающих музыкантов, так и для опытных коллективов.
Современное оборудование, отличная акустика и уютная атмосфера — всё, чтобы вы могли полностью сосредоточиться на музыке.
        </p>
      </div>
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  ymaps.ready(() => {
    const map = new ymaps.Map('map', {
      center: [56.289345, 43.995952],
      zoom: 16,
    });

    const placemark = new ymaps.Placemark([56.289345, 43.995952], {
      hintContent: 'Наша компания',
      balloonContent: 'Мы здесь!',
    });

    map.geoObjects.add(placemark);
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.wrapper {
  display: flex;
  justify-content: center;
  margin-top: 60px;
  
}

.company-map {
  display: flex;
  width: 1162px;
  height: 400px;
  font-family: 'Inter', sans-serif;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text {
  flex: 1;
  text-align: justify;
  padding: 32px;
  line-height: 1.8;
  hyphens: auto;
  background-color: #f9f9f9;
}

.map {
  flex: 1;
  height: 100%;
}
</style>
