import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  color: string;
}

const eventColors = [
  { name: 'Фиолетовый', value: 'bg-[#8B5CF6]', light: 'bg-[#8B5CF6]/20', border: 'border-[#8B5CF6]' },
  { name: 'Розовый', value: 'bg-[#D946EF]', light: 'bg-[#D946EF]/20', border: 'border-[#D946EF]' },
  { name: 'Оранжевый', value: 'bg-[#F97316]', light: 'bg-[#F97316]/20', border: 'border-[#F97316]' },
  { name: 'Голубой', value: 'bg-[#0EA5E9]', light: 'bg-[#0EA5E9]/20', border: 'border-[#0EA5E9]' },
];

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    color: eventColors[0].value,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array((firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)).fill(null);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setEditingEvent(null);
    setFormData({ title: '', description: '', time: '', color: eventColors[0].value });
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(event.date);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      time: event.time,
      color: event.color,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !formData.title || !formData.time) {
      toast.error('Заполните все поля');
      return;
    }

    if (editingEvent) {
      setEvents(events.map(evt => 
        evt.id === editingEvent.id 
          ? { ...evt, ...formData, date: selectedDate }
          : evt
      ));
      toast.success('Событие обновлено');
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        date: selectedDate,
      };
      setEvents([...events, newEvent]);
      toast.success('Событие создано');
    }

    setIsDialogOpen(false);
    setFormData({ title: '', description: '', time: '', color: eventColors[0].value });
    setEditingEvent(null);
  };

  const handleDelete = () => {
    if (editingEvent) {
      setEvents(events.filter(evt => evt.id !== editingEvent.id));
      toast.success('Событие удалено');
      setIsDialogOpen(false);
      setEditingEvent(null);
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] bg-clip-text text-transparent mb-2">
            Календарь Событий
          </h1>
          <p className="text-muted-foreground text-lg">Управляйте своим временем эффективно</p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-2xl border-2">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>

            <h2 className="text-3xl font-bold capitalize">
              {format(currentDate, 'LLLL yyyy', { locale: ru })}
            </h2>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="text-center font-semibold text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square p-2 rounded-2xl border-2 transition-all
                    hover:scale-105 hover:shadow-lg
                    ${isCurrentDay ? 'bg-gradient-to-br from-primary to-secondary text-white border-primary font-bold' : 'bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border-border'}
                  `}
                >
                  <div className="h-full flex flex-col">
                    <span className={`text-sm md:text-base ${isCurrentDay ? 'text-white' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="flex-1 flex flex-col gap-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((event) => {
                        const colorConfig = eventColors.find(c => c.value === event.color) || eventColors[0];
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`${colorConfig.value} text-white text-xs rounded-md px-1 truncate hover:scale-105 transition-transform`}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] backdrop-blur-xl bg-white/95">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {editingEvent ? 'Редактировать событие' : 'Создать событие'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedDate && (
                <div className="text-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <p className="font-semibold text-lg">
                    {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="title">Название события</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введите название"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="time">Время</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Добавьте описание события"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Цвет</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {eventColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`
                        ${color.value} h-12 rounded-lg transition-all
                        ${formData.color === color.value ? 'ring-4 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'}
                      `}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {editingEvent && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="flex-1"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Icon name="Check" size={16} className="mr-2" />
                  {editingEvent ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {eventColors.map((color, idx) => {
            const colorEvents = events.filter(e => e.color === color.value);
            return (
              <Card key={idx} className={`p-4 ${color.light} border-2 ${color.border} backdrop-blur-sm`}>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${color.value}`} />
                  {color.name} события ({colorEvents.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {colorEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет событий</p>
                  ) : (
                    colorEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={(e) => handleEventClick(event, e)}
                        className="w-full text-left p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-all hover:scale-102"
                      >
                        <p className="font-semibold text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, 'd MMM', { locale: ru })} • {event.time}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}