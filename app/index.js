const EMOJIS = {
  working: ['🤖', '💻', '👨‍💻'],
  downtime: ['🍻', '🧗', '☕', '🏃', '👻'],
};

function getRandomEmoji(emojis, currentHour) {
  const list =
    currentHour >= 7 && currentHour <= 18 ? emojis.working : emojis.downtime;

  return list[Math.round(Math.random() * 10) % list.length];
}

function getCurrentHour(date) {
  const hours = date.getUTCHours();
  const timezoneOffset = date.getTimezoneOffset();
  const offsetInHours =
    (timezoneOffset < 0 ? Math.abs(timezoneOffset) : -timezoneOffset) / 60;
  return (hours + offsetInHours) % 24;
}

let lastInterval;
function replaceWithEmoji(selector, time) {
  document.getElementById(selector).innerText = `${getRandomEmoji(
    EMOJIS,
    getCurrentHour(time || new Date())
  )}`;

  lastInterval = setInterval(() => {
    clearInterval(lastInterval);
    replaceWithEmoji(new Date());
  }, 3600000);
}

replaceWithEmoji('emoji', new Date());
