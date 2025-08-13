import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Reminder { id: string; title: string; at: number; }

export default function Reminders() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [title, setTitle] = useState('Respirar por 1 minuto');
  const [minutes, setMinutes] = useState(60);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    setPermission(Notification.permission);
    const saved = localStorage.getItem('rz_reminders');
    if (saved) {
      const list: Reminder[] = JSON.parse(saved);
      setReminders(list);
      list.forEach(scheduleReminder);
    }
    return () => Object.values(timers.current).forEach((id) => window.clearTimeout(id));
  }, []);

  const askPermission = async () => {
    if (!('Notification' in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  const scheduleReminder = (r: Reminder) => {
    const delay = Math.max(0, r.at - Date.now());
    timers.current[r.id] = window.setTimeout(() => {
      new Notification('RespiraZen', { body: r.title });
      // after fire, remove
      setReminders((list) => list.filter((x) => x.id !== r.id));
      const rest = reminders.filter((x) => x.id !== r.id);
      localStorage.setItem('rz_reminders', JSON.stringify(rest));
    }, delay);
  };

  const addReminder = () => {
    const at = Date.now() + minutes * 60 * 1000;
    const r: Reminder = { id: Math.random().toString(36).slice(2), title, at };
    const list = [...reminders, r];
    setReminders(list);
    localStorage.setItem('rz_reminders', JSON.stringify(list));
    scheduleReminder(r);
  };

  const removeReminder = (id: string) => {
    setReminders((list) => list.filter((x) => x.id !== id));
    const rest = reminders.filter((x) => x.id !== id);
    localStorage.setItem('rz_reminders', JSON.stringify(rest));
    if (timers.current[id]) window.clearTimeout(timers.current[id]);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SEO title="RespiraZen — Lembretes" description="Crie lembretes de respiração e meditação. Requer permissão de notificação do navegador." />
      <div className="container mx-auto py-10 space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Lembretes</h1>
        <p className="text-muted-foreground">As notificações funcionam com o app aberto. Para notificações no app fechado, usaremos Capacitor/PWA numa próxima etapa.</p>

        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Em (minutos)</Label>
            <Input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
          </div>
          <div className="flex gap-2">
            {permission !== 'granted' ? (
              <Button variant="hero" onClick={askPermission}>Permitir</Button>
            ) : (
              <Button variant="secondary" onClick={addReminder}>Adicionar</Button>
            )}
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Agendados</h2>
          {reminders.length === 0 ? (
            <p className="text-muted-foreground">Sem lembretes no momento.</p>
          ) : (
            <ul className="space-y-2">
              {reminders.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.at).toLocaleString()}</div>
                  </div>
                  <Button variant="soft" onClick={() => removeReminder(r.id)}>Remover</Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
