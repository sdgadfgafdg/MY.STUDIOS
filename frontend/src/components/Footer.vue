<template>
  <div class="footer-container" id="contacts">
    <div class="footer-wrapper">
      <div class="contacts-left">
        <h4>Контакты</h4>
        <p>Телефон: +7 (900) 123-45-67</p>
        <p>Email: my.studios.music@example.com</p>
        <p>Telegram: @my.studios.music</p>
      </div>
      <div class="contacts-right">
        <p>© 2015–2025 MY.STUDIOS</p>
        <p>Адрес: г. Нижний Новгород, ул. Нартова, д. 2</p>
        <p>Все права защищены</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.footer-wrapper {
  width: 1200px;
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #555;
  flex-wrap: wrap;
  border-radius: 8px;
}

.contacts-left {
  flex: 1;
  min-width: 240px;
}

.contacts-right {
  flex: 1;
  min-width: 240px;
  text-align: right;
}

.contacts-right p {
  margin: 4px 0;
}
</style>
