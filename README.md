# SKYT - Stop_Kill_Your_Time Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Проект на стадии разработки!

## 📌 Project Overview

SKYT (Stop Kill Your Time) — это десктопное приложение, разработанное для помощи пользователям в осознанном контроле времени, проводимого в интернете. Проект направлен на снижение бесцельного скроллинга в социальных сетях, автоматическую классификацию контента (полезный/развлекательный) и предложение осмысленных альтернатив (образовательные видео, статьи).

## 🔹 Core Idea

Проект помогает пользователям:

*   ✅ Снизить бесцельный скроллинг в соцсетях.
*   ✅ Автоматически классифицировать контент (полезный/развлекательный).
*   ✅ Предлагать осмысленные альтернативы (образовательные видео, статьи).

## 🚀 Current Implementation

### 1. Технологический стек

| Компонент   | Технологии                             |
| :---------- | :------------------------------------- |
| Frontend    | HTML5, CSS3 (BEM, Flexbox/Grid), Vie JS |
| Backend     | Node.js + Express, PostgreSQL          |
| NLP         | Natural (JavaScript-библиотека)         |
| Хранение    | SQL (PostgreSQL)                       |
| Деплой      | Docker (Nginx + Postgres)              |

### 2. Функционал (реализовано)

*   **Трекер активности:**
    *   Парсинг истории браузера (Chrome/Firefox).
    *   Ручной ввод URL для анализа.
*   **Классификация контента:**
    *   NLP-анализ заголовков (категории: "наука", "технологии", "мемы" и др.).
    *   Интеграция с YouTube API (получение метаданных).
*   **Рекомендации:**
    *   Подбор непросмотренных видео/статей.
    *   Фильтрация низкокачественного контента.
*   **Интерфейс:**
    *   Главная страница: Статистика за день.
    *   Dashboard: Графики по времени/категориям.
    *   История: Просмотренные ссылки с фильтрами.
    *   Настройки: Лимиты времени, черный список сайтов, уведомления.

### 3. Структура файлов

🌍 Репозиторий: https://github.com/G0SL0T0/Stop_Kill_Your_Time

```
Stop_Kill_Your_Time
│
├── backend/
│   ├── controllers/
│   │   └── historyController.js
│   ├── models/
│   │   └── History.js
│   ├── db.js
│   └── server.js
│
├── frontend/
│   ├── assets/
│   ├── css/
│   │   ├── components/
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   └── nav.css
│   │   │
│   │   ├── dashboard.css
│   │   ├── features.css
│   │   ├── home.css
│   │   └── styles.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   └── history.js
│   │
│   ├── dashboard.html
│   ├── features.html
│   ├── index.html
│   └── settings.html
│
├── launcher (START)/
│   ├── start.bat
│   └── start.sh
│
├── migrations/
│   ├── 001-create-history.js
│   └── 20231001-create-history.js
│
├── nlp/
│   └── classifier.js
│
├── .env
├── docker-compose.yml
└── README.md
```

## 🔴 Что не реализовано (TODO)

*   **Аутентификация:**
    *   JWT-аутентификация.
    *   OAuth 2.0 (Google/VK) для доступа к истории через API.
*   **Расширение для браузеров:**
    *   Chrome Manifest v3.
    *   Firefox WebExtensions API.
*   **Оффлайн-режим:**
    *   Резервное сохранение в IndexedDB.
*   **Уведомления:** Реализация на бэкенде и фронтенде.
*   **Мобильная версия:**
    *   Адаптация интерфейса под смартфоны.


## 📈 Next Steps
1. Добавить JWT-аутентификацию (Priority: High).
2. Реализовать уведомления (например, “Вы потратили 1 час на YouTube!”).
3. Интеграция с Telegram API для анализа времени в каналах, а так же с Discord и steam, для охвата большей аудитории.
4. Реализовать страницу настроек (settings.html) с возможностью управления лимитами времени и черным списком.
5. Реализовать интеграцию NLP (classifier.js) для автоматической классификации контента.
6. Создать расширение для браузеров.
7. Глобальная цель: Интеграция во все гаджеты человека, общая экосистема контроля.
