import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ events, tasksByMonth }) {
  const allEvents = events || tasksByMonth || [];
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    if (!allEvents) return [];
    return allEvents.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="card p-0 overflow-hidden">
      <div className="gradient-bg px-6 py-4 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h3 className="text-white font-bold text-lg">{MONTHS[month]} {year}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-500 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            return (
              <div
                key={i}
                className={`min-h-[48px] p-1 rounded-lg text-center text-sm transition-all
                  ${!day ? '' : 'hover:bg-primary-50 cursor-pointer'}
                  ${isToday(day) ? 'bg-primary-800 text-white font-bold' : 'text-gray-700'}
                  ${dayEvents.length > 0 && !isToday(day) ? 'bg-primary-100 font-semibold' : ''}
                `}
              >
                {day && (
                  <>
                    <span className="block">{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex justify-center mt-0.5 gap-0.5">
                        {dayEvents.slice(0, 3).map((e, j) => (
                          <span key={j} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
