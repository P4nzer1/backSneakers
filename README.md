# 🏗️ Проект: BackSneakers

## 📚 Описание проекта

Этот сервер разработан для интернет-магазина кроссовок. Используется комбинированная архитектура **Layered Architecture** и **MVC** с классическим подходом разделения ответственности на слои и адаптацией для API-приложений. 

На данный момент проект не очень большой, но в будущем планируется:
- Разделить контроллеры и сервисы для выделения бизнес-логики.
- Перейти на модульную архитектуру для улучшения масштабируемости.

---

## 🗂️ **Структура проекта**

```plaintext
BACKSNEAKERS/
├── config/           # Конфигурационные файлы
├── controllers/      # Контроллеры для обработки запросов
├── middleware/       # Промежуточные функции (middleware)
├── models/           # Модели для работы с базой данных
├── routes/           # Маршруты API
├── scriptAddProducts/          # Скрипты для загрузки данных
│   ├── scriptNike.js
│   ├── scriptAdidas.js
│   └── ...
├── tests/            # Тесты
├── uploads/          # Загруженные файлы (изображения)
├── validators/       # Файлы для валидации данных
├── .env              # Файл конфигурации окружения
├── .gitignore        # Игнорируемые файлы Git
├── package.json      # Файл зависимостей npm
└── server.js         # Главный файл сервера
