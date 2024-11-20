document.addEventListener("DOMContentLoaded", () => {
  const baseURL = document.getElementById("base-url");
  const utmSource = document.getElementById("utm-source");
  const utmMedium = document.getElementById("utm-medium");
  const utmCampaign = document.getElementById("utm-campaign");
  const utmTerm = document.getElementById("utm-term");
  const utmContent = document.getElementById("utm-content");
  const marketingTactic = document.getElementById("marketing-tactic");
  const generatedURL = document.getElementById("generated-url");
  const copyBtn = document.getElementById("copy-btn");

  // Восстановление последней сохраненной финальной ссылки из localStorage
  chrome.storage.local.get("finalURL", (data) => {
    if (data.finalURL) {
      generatedURL.value = data.finalURL;  // Восстанавливаем финальную ссылку
    }
  });

  // Функция для обновления финальной ссылки
  function updateGeneratedURL() {
    let finalURL = baseURL.value.trim(); // Начинаем с базовой ссылки

    if (!finalURL) {
      generatedURL.value = ""; // Если нет базовой ссылки, оставляем поле пустым
      return;
    }

    // Проверяем, если базовая ссылка уже содержит параметры, не добавляем ? еще раз
    let params = new URLSearchParams();

    // Добавляем только параметры, если они не пустые
    if (utmSource.value) params.set("utm_source", utmSource.value);
    if (utmMedium.value) params.set("utm_medium", utmMedium.value);
    if (utmCampaign.value) params.set("utm_campaign", utmCampaign.value);
    if (utmTerm.value) params.set("utm_term", utmTerm.value);
    if (utmContent.value) params.set("utm_content", utmContent.value);
    if (marketingTactic.value) params.set("marketing_tactic", marketingTactic.value);

    // Если есть параметры, добавляем их к базовой ссылке
    if (params.toString()) {
      finalURL += `?${params.toString()}`;
    }

    // Обновляем финальную ссылку
    generatedURL.value = finalURL;

    // Сохраняем финальную ссылку в localStorage
    chrome.storage.local.set({ finalURL: finalURL });
  }

  // Добавляем обработчики на все поля
  baseURL.addEventListener("input", updateGeneratedURL);
  utmSource.addEventListener("input", updateGeneratedURL);
  utmMedium.addEventListener("input", updateGeneratedURL);
  utmCampaign.addEventListener("input", updateGeneratedURL);
  utmTerm.addEventListener("input", updateGeneratedURL);
  utmContent.addEventListener("input", updateGeneratedURL);
  marketingTactic.addEventListener("input", updateGeneratedURL);

  // Копирование в буфер обмена
  copyBtn.addEventListener("click", () => {
    if (generatedURL.value.trim()) {
      navigator.clipboard.writeText(generatedURL.value)
        .then(() => {
          const successIcon = document.getElementById("success-icon");
          successIcon.style.display = "inline-block";  // Показываем галочку
          copyBtn.classList.add("green"); // Меняем цвет кнопки на зеленый

          // Заменяем текст кнопки на иконку
          document.querySelector(".copy-button-text").style.display = "none";

          // Скрыть галочку через 1.5 секунды
          setTimeout(() => {
            successIcon.style.display = "none"; // Прячем галочку
            copyBtn.classList.remove("green"); // Возвращаем цвет кнопки
            document.querySelector(".copy-button-text").style.display = "inline-block"; // Восстанавливаем текст
          }, 1500);
        })
        .catch((error) => {
          console.error('Ошибка копирования: ', error);
        });
    }
  });
});
