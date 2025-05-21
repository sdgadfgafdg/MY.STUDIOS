<template>
  <Booking />
  <div class="calendar-container">
    <div class="btns-wrapper">
      <div class="studio-selector">
        <button
          v-for="id in 3"
          :key="id"
          :class="['studio-btn', { active: selectedStudio === id }]"
          @click="selectStudio(id)"
        >
          Зал {{ id }}
        </button>
      </div>
    </div>

    <div class="calendar">
      <!-- Days header -->
      <div class="calendar-header">
        <div class="time-column"></div>
        <div v-for="date in dateRange" :key="date" class="date-column">
          {{ formatDate(date) }}
        </div>
      </div>

      <!-- Time slots -->
      <div class="calendar-body">
        <div class="time-slots">
          <div v-for="hour in timeSlots" :key="hour" class="time-slot">
            <div class="time-column">{{ formatTime(hour) }}</div>
            <div v-for="date in dateRange" :key="date" class="slot-container">
              <div
                class="slot"
                :class="{
                  booked: isSlotBooked(date, hour),
                  'booking-start': isBookingStart(date, hour),
                  'booking-end': isBookingEnd(date, hour),
                }"
              >
                <div v-if="isBookingStart(date, hour)" class="booking-info">
                  {{ getBookingInfo(date, hour) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Booking from "./Booking.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

const selectedStudio = ref(1);
const bookings = ref([]);
const isBookingVisible = ref(false);

const dateRange = computed(() => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
});

const timeSlots = computed(() => {
  const slots = [];
  for (let i = 10; i < 23; i++) {
    slots.push(i);
  }
  return slots;
});

const fetchBookings = async (studioId) => {
  try {
    const response = await axios.get(
      `${API_HOST}:${API_PORT}/api/studios/${studioId}/upcoming-sessions`
    );
    bookings.value = response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};

const selectStudio = (id) => {
  selectedStudio.value = id;
  fetchBookings(id);
};

const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
};

const formatTime = (hour) => {
  return `${hour.toString().padStart(2, "0")}:00`;
};

const isSlotBooked = (date, hour) => {
  return bookings.value.some((booking) => {
    const bookingStart = new Date(booking.start_time);
    const bookingEnd = new Date(booking.end_time);
    const slotStart = new Date(date);
    slotStart.setHours(hour);

    return slotStart >= bookingStart && slotStart < bookingEnd;
  });
};

const isBookingStart = (date, hour) => {
  return bookings.value.some((booking) => {
    const bookingStart = new Date(booking.start_time);
    const slotStart = new Date(date);
    slotStart.setHours(hour);
    slotStart.setMinutes(0, 0, 0);
    bookingStart.setMinutes(0, 0, 0);
    return slotStart.getTime() === bookingStart.getTime();
  });
};

const isBookingEnd = (date, hour) => {
  return bookings.value.some((booking) => {
    const bookingEnd = new Date(booking.end_time);
    const slotStart = new Date(date);
    slotStart.setHours(hour);

    slotStart.setMinutes(0, 0, 0);
    bookingEnd.setMinutes(0, 0, 0);
    return slotStart.getTime() === bookingEnd.getTime();
  });
};

const getBookingInfo = (date, hour) => {
  const booking = bookings.value.find((booking) => {
    const bookingStart = new Date(booking.start_time);
    const slotStart = new Date(date);
    slotStart.setHours(hour);

    return bookingStart.getTime() === slotStart.getTime();
  });

  return booking ? `${booking.client_name}` : "";
};

const handleBookingSubmit = (bookingData) => {
  console.log("Данные бронирования:", bookingData);
  isBookingVisible.value = false;
};

onMounted(() => {
  fetchBookings(selectedStudio.value);
});
</script>

<style lang="scss" scoped>
.btns-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
}

.studio-selector {
  display: flex;
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

.calendar-container {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
}

.calendar {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: grid;
  grid-template-columns: 70px repeat(14, 1fr);
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;

  .time-column {
    width: 70px;
    padding: 12px;
    font-weight: 600;
    border-right: 1px solid #ddd;
    box-sizing: border-box;
  }

  .date-column {
    padding: 12px;
    text-align: center;
    font-weight: 600;
    border-right: 1px solid #ddd;
    box-sizing: border-box;

    &:last-child {
      border-right: none;
    }
  }
}

.time-slots {
  position: relative;

  .time-slot {
    display: grid;
    grid-template-columns: 70px repeat(14, 1fr);
    height: 50px;
    position: relative;

    &:not(:last-child) {
      border-bottom: 1px solid #ddd;
    }
  }
}

.time-column {
  width: 70px;
  padding: 0 12px;
  border-right: 1px solid #ddd;
  color: #666;
  box-sizing: border-box;
  background-color: #f8f9fa;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: -0.5em;
  font-size: 0.9em;
}

.slot {
  position: relative;
  height: 100%;
  border-right: 1px solid #ddd;

  &:last-child {
    border-right: none;
  }

  &.booked {
    background-color: rgba(244, 67, 54, 0.1);
  }

  &.booking-start {
    .booking-block {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(244, 67, 54, 0.15);
      border-top: 2px solid #f44336;
      border-left: 2px solid #f44336;
      border-right: 2px solid #f44336;
    }
  }

  &.booking-end {
    .booking-block {
      border-bottom: 2px solid #f44336;
    }
  }
}

.booking-info {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
