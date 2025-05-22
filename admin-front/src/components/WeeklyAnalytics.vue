<template>
  <div class="weekly-analytics">
    <div class="studio-selector-container">
      <div class="studio-selector">
        <button
          v-for="id in [1, 2, 3]"
          :key="id"
          :class="['studio-btn', { active: selectedStudioId === id }]"
          @click="fetchAnalytics(id)"
        >
          Студия {{ id }}
        </button>
      </div>
    </div>

    <div v-if="analytics" class="analytics-content">
      <h2>
        Аналитика за неделю ({{ formatDate(analytics.weekStart) }} –
        {{ formatDate(analytics.weekEnd) }})
      </h2>

      <div
        class="day-analytics"
        v-for="day in analytics.dailyAnalytics"
        :key="day.day"
      >
        <h3>{{ day.day }}</h3>
        <div class="metrics">
          <div class="metric-card">
            <p class="label">Общая выручка</p>
            <p class="value">{{ day.totalRevenue }} ₽</p>
          </div>
          <div class="metric-card">
            <p class="label">Средний чек</p>
            <p class="value">{{ day.averagePrice }} ₽</p>
          </div>
          <div class="metric-card">
            <p class="label">Средняя длительность</p>
            <p class="value">{{ day.averageBookingDuration }} ч</p>
          </div>
          <div class="metric-card">
            <p class="label">Сессий</p>
            <p class="value">{{ day.numberOfSessions }}</p>
          </div>
          <div class="metric-card">
            <p class="label">Популярное доп.</p>
            <p class="value">
              {{ day.mostPopularEquipment.name || "Нет данных" }} ({{
                day.mostPopularEquipment.count
              }})
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">Загрузка...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const analytics = ref(null);
const selectedStudioId = ref(1);

const fetchAnalytics = async (studioId) => {
  selectedStudioId.value = studioId;
  analytics.value = null;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/admin/studio-analytics?studioId=${studioId}`
    );
    analytics.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки аналитики:", error);
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("ru-RU");
};

onMounted(() => {
  fetchAnalytics(selectedStudioId.value);
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.weekly-analytics {
  font-family: "Inter", sans-serif;
  padding: 2rem;
  background-color: #f9f9fb;

  .analytics-content {
    margin: 0 auto;

    h2 {
      font-size: 1.4rem;
      margin-bottom: 1.5rem;
    }

    .day-analytics {
      background: #fff;
      border-radius: 12px;
      padding: 0.1rem 1rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

      h3 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }

      .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 10px;
        margin-bottom: 10px;

        .metric-card {
          background-color: #f5f5f8;
          border-radius: 10px;
          text-align: center;

          .label {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 0.3rem;
          }

          .value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #222;
          }
        }
      }
    }
  }

  .loading {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
  }
}

.studio-selector-container {
  max-width: 100%;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  padding: 0 20px;
}

.studio-selector {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
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
</style>
