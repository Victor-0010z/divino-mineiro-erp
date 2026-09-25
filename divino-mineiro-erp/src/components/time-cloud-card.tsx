"use client";

import { useEffect, useState } from "react";

const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function TimeCloudCard() {
  const [agora, setAgora] = useState<Date | null>(null);

  useEffect(() => {
    const atualizar = () => setAgora(new Date());
    atualizar();
    const timer = window.setInterval(atualizar, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!agora) return <div className="time-cloud-placeholder" aria-hidden="true" />;

  return (
    <div className="card-time-cloud" aria-label="Data e hora atuais">
      <div className="card-time-cloud-front" />
      <div className="card-time-cloud-back">
        <svg viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z" transform="translate(100 100)" /></svg>
        <svg viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z" transform="translate(100 100)" /></svg>
      </div>
      <p className="card-time-cloud-day">{dias[agora.getDay()]}</p>
      <p className="card-time-cloud-day-number">{agora.toLocaleDateString("pt-BR")}</p>
      <p className="card-time-cloud-hour">{agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
      <div className="card-time-cloud-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M8 22H16M5 19H19M2 16H22M12 6C8.7 6 6 8.7 6 12c0 1.5.6 2.9 1.5 4h9c.9-1.1 1.5-2.5 1.5-4 0-3.3-2.7-6-6-6ZM12 2v1M22 12h-1M3 12H2M19.1 4.9l-.4.4M5.3 5.3l-.4-.4" stroke="currentColor" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
