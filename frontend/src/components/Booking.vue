<template>
  <div class="booking" id="booking">
    <h1>Записаться на репетицию</h1>

    <div class="form-group">
      <label>Ваше имя / группа</label>
      <input v-model="name" type="text" :class="{ error: nameError }" />
    </div>

    <div class="form-group">
      <label>Телефон</label>
      <input v-model="phone" type="text" :class="{ error: phoneError }" placeholder="+7XXXXXXXXXX" />
    </div>

    <div class="form-group">
      <label>Дата репетиции</label>
      <select v-model="selectedDate">
        <option disabled value="">Выберите дату</option>
        <option v-for="date in availableDates" :key="date.value" :value="date.value">
          {{ date.label }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Зал</label>
      <select v-model="studioId">
        <option disabled value="">Выберите зал</option>
        <option v-for="(label, id) in studios" :key="id" :value="id">
          {{ label }}
        </option>
      </select>
    </div>

    <div class="form-group" v-if="timeSlots.length">
      <label>Время</label>
      <div class="time-selects">
        <select v-model="timeFrom">
          <option disabled value="">С</option>
          <option v-for="time in timeSlots" :key="time" :value="time">
            {{ time }}
          </option>
        </select>

        <select v-model="timeTo">
          <option disabled value="">До</option>
          <option v-for="time in timeSlots" :key="time + '-to'" :value="time"
            :disabled="parseInt(time) <= parseInt(timeFrom)">
            {{ time }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-group" v-if="timeFrom && timeTo">
      <label>Дополнительное оборудование</label>
      <div class="equipment-list">
        <label v-for="eq in equipmentOptions" :key="eq.id">
          <input type="checkbox" :value="eq.id" v-model="selectedEquipment" />
          {{ eq.name }}
        </label>
      </div>
    </div>

    <div class="form-group" v-if="price">
      <p>
        Стоимость: <strong>{{ price }} ₽</strong>
      </p>
    </div>

    <div class="book-btn-wrapper">
      <button @click="submitBooking">Забронировать</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "vue3-toastify";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

const name = ref("");
const phone = ref("");
const nameError = ref(false);
const phoneError = ref(false);

const selectedDate = ref("");
const studioId = ref("");
const timeFrom = ref("");
const timeTo = ref("");
const selectedEquipment = ref([]);

const price = ref(null);

const availableDates = ref([]);
const timeSlots = ref([]);
const equipmentOptions = ref([
  { id: 1, name: "Доп. тарелки / железо" },
  { id: 2, name: "Доп. комбоусилитель (Marshall)" },
]);

const studios = {
  1: "Зал 1 (Большой)",
  2: "Зал 2 (Средний)",
  3: "Зал 3 (Малый)",
};

function generateDates() {
  const days = [];
  for (let i = 0; i <= 13; i++) {
    const date = addDays(new Date(), i);
    days.push({
      value: format(date, "yyyy-MM-dd"),
      label: format(date, "eeee, dd MMMM", { locale: ru }),
    });
  }
  availableDates.value = days;
}

function validate() {
  nameError.value = name.value.trim() === "";
  phoneError.value = !/^\+7\d{10}$/.test(phone.value);
  return !(nameError.value || phoneError.value);
}

function getAllTimeSlots() {
  const hours = [];
  for (let h = 10; h <= 21; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
  }
  return hours;
}
const allTimeSlots = getAllTimeSlots();

async function fetchAvailableTimeSlots() {
  if (!selectedDate.value || !studioId.value) return;

  try {
    const res = await axios.get(
      `${API_HOST}:${API_PORT}/api/sessions/availability`,
      {
        params: { studioId: studioId.value, date: selectedDate.value },
      }
    );
    const busy = res.data;

    const busyHours = new Set();
    busy.forEach(({ start_time, end_time }) => {
      const start = new Date(start_time).getHours();
      const end = new Date(end_time).getHours();
      for (let h = start; h < end; h++) {
        busyHours.add(h);
      }
    });

    timeSlots.value = allTimeSlots.filter((h) => !busyHours.has(parseInt(h)));
  } catch (err) {
    console.error("Ошибка получения слотов:", err);
  }
}

watch([timeFrom, timeTo, selectedEquipment], async () => {
  if (
    !timeFrom.value ||
    !timeTo.value ||
    !selectedDate.value ||
    !studioId.value
  )
    return;

  const from = parseInt(timeFrom.value);
  const to = parseInt(timeTo.value);
  const hours = to - from;
  if (hours <= 0) {
    price.value = null;
    return;
  }

  const start = new Date(`${selectedDate.value}T${timeFrom.value}:00`);
  const end = new Date(`${selectedDate.value}T${timeTo.value}:00`);

  try {
    const res = await axios.post(
      `${API_HOST}:${API_PORT}/api/sessions/calculate`,
      {
        studio_id: Number(studioId.value),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        hours,
        equipment_ids: selectedEquipment.value,
      }
    );
    price.value = res.data.total_price || "Неизвестно";
  } catch (e) {
    console.error("Ошибка расчета цены:", e);
  }
});

async function submitBooking() {
  if (!validate()) return;
  if (!timeFrom.value || !timeTo.value) {
    toast.error("Выберите интервал времени");
    return;
  }

  const from = new Date(`${selectedDate.value}T${timeFrom.value}:00`);
  const to = new Date(`${selectedDate.value}T${timeTo.value}:00`);
  const hours = parseInt(timeTo.value) - parseInt(timeFrom.value);

  try {
    await axios.post(`${API_HOST}:${API_PORT}/api/sessions/create`, {
      client_name: name.value,
      client_phone: phone.value,
      start_time: from.toISOString(),
      end_time: to.toISOString(),
      studio_id: Number(studioId.value),
      equipment_ids: selectedEquipment.value,
      hours,
    });
    toast.success('Бронирование успешно!');
    setTimeout(() => location.reload(), 1500);
  } catch (e) {
    console.error("Ошибка бронирования:", e);
    toast.error("Ошибка при бронировании");
  }
}

onMounted(generateDates);
watch([selectedDate, studioId], fetchAvailableTimeSlots);
</script>

<style lang="scss" scoped>
* {
  font-family: "Inter", sans-serif;
}

.book-btn-wrapper {
  button {
    position: relative;
    padding: 10px 24px;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: #3448c5;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(52, 72, 197, 0.2);

    &:hover {
      background-color: #2a3ab0;
      box-shadow: 0 4px 8px rgba(52, 72, 197, 0.3);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(52, 72, 197, 0.2);
    }

    &:focus-visible {
      outline: none;
      animation: pulse 1.5s infinite;
    }

    &::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -60%;
      width: 20px;
      height: 200%;
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(30deg);
      transition: all 0.5s ease;
    }

    &:hover::after {
      left: 120%;
    }
  }
}

.booking {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 1.2rem;
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 0.9rem;
    }

    input,
    select {
      padding: 0.7rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-family: "Inter", sans-serif;
      font-size: 0.9rem;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #3448c5;
        outline: none;
      }

      &.error {
        border-color: #ff5252;
      }
    }

    .equipment-list {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      label {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-weight: 400;
        cursor: pointer;
      }
    }
  }

  .time-selects {
    display: flex;
    gap: 1rem;

    select {
      flex: 1;
      padding: 0.7rem;
      background-color: white;
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 72, 197, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(52, 72, 197, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(52, 72, 197, 0);
  }
}

button,
input,
select {
  font-family: "Inter", sans-serif;
}

button {
  transition: all 0.2s ease;
  font-weight: 500;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
}
</style>
