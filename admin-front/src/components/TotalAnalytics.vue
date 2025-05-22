<template>
  <div class="total-analytics">
    <h1>Сводная аналитика</h1>
    <div v-if="analytics">
      <p class="date-range">
        За период: <strong>{{ formatDate(analytics.weekStart) }}</strong> –
        <strong>{{ formatDate(analytics.weekEnd) }}</strong>
      </p>

      <section class="analytics-card">
        <h2>Популярность залов</h2>
        <p>
          <strong>Самый популярный зал:</strong>
          {{ analytics.studioPopularity.mostPopular.studioName }} ({{
            analytics.studioPopularity.mostPopular.bookingCount
          }}
          бронирований)
        </p>
        <ul>
          <li
            v-for="studio in analytics.studioPopularity.ranking"
            :key="studio.studioName"
          >
            {{ studio.studioName }} — {{ studio.bookingCount }} бронирований
          </li>
        </ul>
      </section>

      <section class="analytics-card">
        <h2>Прибыльность залов</h2>
        <p>
          <strong>Самый прибыльный зал:</strong>
          {{ analytics.profitability.mostProfitable.studioName }} ({{
            analytics.profitability.mostProfitable.revenue
          }}
          ₽)
        </p>
        <ul>
          <li
            v-for="studio in analytics.profitability.ranking"
            :key="studio.studioName"
          >
            {{ studio.studioName }} — {{ studio.revenue }} ₽
          </li>
        </ul>
      </section>

      <section class="analytics-card">
        <h2>Использование оборудования</h2>
        <p>
          <strong>Лидер по количеству оборудования:</strong>
          {{ analytics.equipmentUsage.topStudio.studioName }} ({{
            analytics.equipmentUsage.topStudio.equipmentCount
          }}
          использований)
        </p>
        <ul>
          <li
            v-for="item in analytics.equipmentUsage.topStudio.popularEquipment"
            :key="item.name"
          >
            {{ item.name }} — {{ item.count }} раз(а)
          </li>
        </ul>
      </section>

      <section class="analytics-card">
        <h2>Метрики загрузки</h2>
        <ul>
          <li>
            <strong>Процент простоя:</strong>
            {{ analytics.occupancyMetrics.idleTimePercentage }}%
          </li>
          <li>
            <strong>Самый загруженный день:</strong>
            {{ analytics.occupancyMetrics.busiestDay }}
          </li>
          <li>
            <strong>Всего сессий:</strong>
            {{ analytics.occupancyMetrics.totalSessions }}
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="loading">Загрузка сводной аналитики...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const analytics = ref(null);

const fetchAnalytics = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:3000/api/admin/total-analytics"
    );
    analytics.value = data;
  } catch (error) {
    console.error("Ошибка загрузки аналитики:", error);
  }
};

const formatDate = (iso) => {
  const date = new Date(iso);
  return date.toLocaleDateString("ru-RU");
};

onMounted(fetchAnalytics);
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.total-analytics {
  font-family: "Inter", sans-serif;
  padding: 2rem;
  background: #f9f9fb;
  color: #222;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .date-range {
    margin-bottom: 2rem;
    font-size: 1rem;
    color: #555;
  }

  .analytics-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    ul {
      list-style: none;
      padding-left: 0;

      li {
        padding: 0.3rem 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .loading {
    font-size: 1.2rem;
    color: #888;
  }
}
</style>
