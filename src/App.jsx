import { useState, useRef, useCallback } from "react";
import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import lovesvg2 from "./assets/Love In The Air SVG Cut File.svg";

const ACTIVITIES = [
  { id: 1, icon: "🌿", name: "Прогулка в парке" },
  { id: 2, icon: "🎡", name: "Покататься" },
  { id: 3, icon: "☕", name: "Уютное кафе" },
  { id: 4, icon: "🎬", name: "Кино" },
  { id: 5, icon: "🎳", name: "Боулинг" },
  { id: 6, icon: "🌙", name: "Ночная прогулка" },
];

const TIME_SLOTS = [
  "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30",
];

function getUpcomingDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 8; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateFull(date) {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

async function sendToTelegram(activity, date, time) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram: VITE_TELEGRAM_BOT_TOKEN or VITE_TELEGRAM_CHAT_ID not set");
    return;
  }
  const text =
    `💕 Новый ответ на приглашение!\n\n` +
    `✅ Она сказала: ДА!\n\n` +
    `${activity.icon} Активность: ${activity.name}\n` +
    `📅 Дата: ${formatDateFull(date)}\n` +
    `🕐 Время: ${time}`;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (e) {
    console.error("Failed to send to Telegram", e);
  }
}

const NO_TEXTS = [
  "Нет",
  "Ты уверена?",
  "Правда нет?",
  "Подумай ещё!",
  "Последний шанс!",
  "Неужели нет?",
  "Ты пожалеешь!",
  "Ещё раз подумай!",
  "Ты точно уверена?",
  "Это ошибка!",
  "Будь добрее!",
  "Не будь такой холодной!",
  "Может передумаешь?",
  "Ты ломаешь моё сердце ;(",
  "Плиз? Умоляю! :(",
];

function EscapingNoButton({ text, onEscape }) {
  const [pos, setPos] = useState({ x: null, y: null });
  const buttonRef = useRef(null);

  const escape = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const bw = btn.offsetWidth + 20;
    const bh = btn.offsetHeight + 20;
    const maxX = window.innerWidth - bw;
    const maxY = window.innerHeight - bh;
    setPos({
      x: Math.max(10, Math.random() * maxX),
      y: Math.max(10, Math.random() * maxY),
    });
    onEscape();
  }, [onEscape]);

  return (
    <button
      ref={buttonRef}
      onMouseEnter={escape}
      onTouchStart={(e) => { e.preventDefault(); escape(); }}
      style={
        pos.x !== null
          ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 50, transition: "left 0.05s, top 0.05s" }
          : {}
      }
      className="bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4 select-none cursor-default"
    >
      {text}
    </button>
  );
}

function ActivityStep({ onSelect }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
      <div className="text-5xl">🎉</div>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-rose-600 drop-shadow">
        Ура! А что будем делать?
      </h2>
      <div className="grid grid-cols-2 gap-3 w-full">
        {ACTIVITIES.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a)}
            className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50 rounded-2xl p-4 transition-all shadow-sm hover:shadow-lg active:scale-95"
          >
            <span className="text-3xl">{a.icon}</span>
            <span className="text-sm font-semibold text-zinc-700">{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateStep({ activity, onSelect }) {
  const dates = getUpcomingDates();
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
      <div className="text-5xl">📅</div>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-rose-600 drop-shadow">
        {activity.icon} {activity.name} — когда?
      </h2>
      <div className="grid grid-cols-4 gap-2 w-full">
        {dates.map((d, i) => (
          <button
            key={i}
            onClick={() => onSelect(d)}
            className="flex flex-col items-center bg-white/80 backdrop-blur border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50 rounded-2xl py-3 px-1 transition-all shadow-sm hover:shadow-lg active:scale-95"
          >
            <span className="text-xs font-bold text-rose-500 capitalize">
              {d.toLocaleDateString("ru-RU", { weekday: "short" })}
            </span>
            <span className="text-xl font-bold text-zinc-800">{d.getDate()}</span>
            <span className="text-xs text-zinc-500 capitalize">
              {d.toLocaleDateString("ru-RU", { month: "short" })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeStep({ activity, date, onSelect }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
      <div className="text-5xl">🕐</div>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-rose-600 drop-shadow">
        В котором часу?
      </h2>
      <p className="text-zinc-600 text-center -mt-2">
        {activity.icon} {activity.name} · {formatDateFull(date)}
      </p>
      <div className="grid grid-cols-4 gap-3 w-full">
        {TIME_SLOTS.map((t) => (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className="flex items-center justify-center bg-white/80 backdrop-blur border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50 rounded-2xl py-3 transition-all shadow-sm hover:shadow-lg active:scale-95 font-bold text-zinc-700 text-sm"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function SuccessStep({ activity, date, time }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-4 max-w-md">
      <img
        src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
        className="rounded-2xl shadow-lg w-48"
        alt="happy bear"
      />
      <div className="text-4xl md:text-5xl font-bold text-rose-600 drop-shadow">
        Договорились! 🎉
      </div>
      <div className="bg-white/80 backdrop-blur border-2 border-rose-200 rounded-2xl p-5 shadow-md w-full space-y-2">
        <p className="text-xl font-bold">{activity.icon} {activity.name}</p>
        <p className="text-zinc-600 capitalize">📅 {formatDateFull(date)}</p>
        <p className="text-zinc-600">🕐 {time}</p>
      </div>
      <p className="text-zinc-500 text-sm">Буду очень ждать! 💕</p>
    </div>
  );
}

export default function App() {
  const [noCount, setNoCount] = useState(0);
  const [step, setStep] = useState("initial");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const yesSize = Math.min(noCount * 6 + 16, 48);

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setStep("date");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep("time");
  };

  const handleTimeSelect = async (time) => {
    setSelectedTime(time);
    setStep("success");
    await sendToTelegram(selectedActivity, selectedDate, time);
  };

  return (
    <div className="overflow-hidden flex flex-col items-center justify-center py-10 min-h-screen selection:bg-rose-600 selection:text-white text-zinc-900">
      <img src={lovesvg} className="fixed animate-pulse top-10 md:left-24 left-4 md:w-40 w-24 pointer-events-none" />
      <img src={lovesvg2} className="fixed bottom-16 -z-10 animate-pulse md:right-24 right-6 md:w-40 w-28 pointer-events-none" />

      {step === "initial" && (
        <>
          <img
            className="h-[200px] rounded-xl shadow-lg mb-4"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.webp"
            alt="love bear"
          />
          <h1 className="text-3xl md:text-5xl my-4 text-center px-6 drop-shadow">
            Пойдёшь со мной на свидание? 💕
          </h1>
          <div className="flex flex-wrap justify-center gap-4 items-center mt-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
              style={{ fontSize: yesSize }}
              onClick={() => setStep("activity")}
            >
              Да! 💖
            </button>
            <EscapingNoButton
              text={NO_TEXTS[Math.min(noCount, NO_TEXTS.length - 1)]}
              onEscape={() => setNoCount((c) => c + 1)}
            />
          </div>
        </>
      )}

      {step === "activity" && (
        <ActivityStep onSelect={handleActivitySelect} />
      )}

      {step === "date" && (
        <DateStep activity={selectedActivity} onSelect={handleDateSelect} />
      )}

      {step === "time" && (
        <TimeStep
          activity={selectedActivity}
          date={selectedDate}
          onSelect={handleTimeSelect}
        />
      )}

      {step === "success" && (
        <SuccessStep
          activity={selectedActivity}
          date={selectedDate}
          time={selectedTime}
        />
      )}

      <Footer />
    </div>
  );
}

const Footer = () => (
  <a
    className="fixed bottom-2 right-2 backdrop-blur-md opacity-70 hover:opacity-95 border p-1 rounded border-rose-300 text-xs"
    href="https://github.com/Xeven777/valentine"
    target="_blank"
    rel="noreferrer"
  >
    Made with ❤️
  </a>
);
