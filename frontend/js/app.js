/**
 * Главный файл JS
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SKYT App JS Initialized'); // Отладка

  initSmoothScroll();
  initScrollAnimations();
  // Добавление других общих инициализаций
  // initMobileMenu();
});

/**
* Плавная прокрутка для всех якорных ссылок на странице.
*/
function initSmoothScroll() {
  // Выбираем все ссылки, у которых href начинается с #
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
      link.addEventListener('click', function (e) {
          const hrefAttribute = this.getAttribute('href');

          // Убедимся, что это не просто # (ссылка-заглушка)
          if (hrefAttribute === '#') {
              return;
          }
          try {
              const targetElement = document.querySelector(hrefAttribute);

              if (targetElement) {
                  e.preventDefault(); // Отменяем стандартный переход по якорю
                  targetElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start' // Выравнивание по верхнему краю элемента
                  });
              }
          } catch (error) {
              console.warn(`Не удалось найти элемент для плавной прокрутки: ${hrefAttribute}`, error);
          }
      });
  });
}

/**
* Инициализирует анимацию элементов при их появлении в области видимости
* с использованием Intersection Observer API.
* Требует наличия CSS классов `.animate`, `.animate--up` (или других)
* и класса `.is-visible`, который будет добавляться для запуска анимации.
*/
function initScrollAnimations() {
  // Выбираем все элементы, которые должны анимироваться
  const animatedElements = document.querySelectorAll('.animate, .animate--up'); // Добавь сюда другие классы анимаций, если есть

  if (!animatedElements.length) {
      return; // Нет элементов для анимации
  }

  // Настройка Intersection Observer
  const observerOptions = {
      root: null, // Наблюдение относительно viewport
      rootMargin: '0px', // Без дополнительных отступов
      threshold: 0.1 // Запуск анимации
  };

  const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
          // Если элемент появился
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible'); // Добавляем класс для запуска CSS-анимации

              // После того как анимация сработала, прекращаем наблюдение за этим элементом
              // чтобы анимация не повторялась при каждом скролле
              observer.unobserve(entry.target);
          }
          // Можно добавить логику для скрытия элемента, если он уходит из видимости,
          // но обычно для анимаций появления это не требуется.
          // else {
          //     entry.target.classList.remove('is-visible');
          // }
      });
  };

  // Создаем и запускаем Observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  animatedElements.forEach(element => {
      observer.observe(element);
  });
}


// --- Дополнительные общие функции ---

/**
* Инициализация мобильного меню
*/
/*
function initMobileMenu() {
  const burgerButton = document.querySelector('.burger-menu-button'); // Нужен HTML
  const mobileNav = document.querySelector('.mobile-nav'); // Нужен HTML

  if (burgerButton && mobileNav) {
      burgerButton.addEventListener('click', () => {
          mobileNav.classList.toggle('is-active'); // CSS класс
          burgerButton.classList.toggle('is-active');
      });
  }
}
*/

/**
* Вспомогательная функция для форматирования даты
* @param {Date|string|number} dateInput - Дата для форматирования
* @returns {string} Отформатированная строка даты
*/
/*
function formatGlobalDate(dateInput) {
  if (!dateInput) return 'N/A';
  try {
      return new Date(dateInput).toLocaleDateString('ru-RU', {
           day: '2-digit', month: 'short', year: 'numeric'
      });
  } catch (e) {
      console.error("Ошибка форматирования даты:", e);
      return 'Invalid Date';
  }
}
*/