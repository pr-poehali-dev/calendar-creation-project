import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const generateRandomData = () => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  return months.map(month => ({
    month,
    events: Math.floor(Math.random() * 30) + 5,
    completed: Math.floor(Math.random() * 25) + 3,
  }));
};

export default function EventsChart() {
  const data = generateRandomData();

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-2xl border-2 mt-8">
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] bg-clip-text text-transparent">
        Статистика событий
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px',
              border: '2px solid #8B5CF6'
            }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="events" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            name="Всего событий"
            dot={{ fill: '#8B5CF6', r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#D946EF" 
            strokeWidth={3}
            name="Завершенные"
            dot={{ fill: '#D946EF', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
