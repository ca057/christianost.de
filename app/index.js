const EMOJI_NAMES = {
  working: ['robot', 'computer'],
  downtime: ['beer', 'climbing', 'coffee', 'running'],
};

function getRandomEmojiName(currentHour) {
  const list =
    currentHour >= 7 && currentHour <= 18
      ? EMOJI_NAMES.working
      : EMOJI_NAMES.downtime;

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
function setEmoji(time) {
  const emojiName = getRandomEmojiName(getCurrentHour(time || new Date()));

  document.getElementsByClassName(
    'emoji__container'
  )[0].style.backgroundImage = `url('svg/${emojiName}.png')`;

  lastInterval = setInterval(() => {
    clearInterval(lastInterval);
    setEmoji(new Date());
  }, 3600000);
}

setEmoji(new Date());
