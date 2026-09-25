export type StatusPagamentoMotoboy = "PENDENTE" | "PAGO";

export interface MotoboyFechamentoItem {
  motoboyId: string;
  nome: string;
  chavePix: string;
  valor: number;
  status: StatusPagamentoMotoboy;
}

export interface MotoboyFechamento {
  id: string;
  inicio: string;
  fim: string;
  fechadoEm: string;
  itens: MotoboyFechamentoItem[];
}

export const MOTOboy_HISTORY_KEY = "divino-mineiro:motoboy-fechamentos";

export const fechamentosExemplo: MotoboyFechamento[] = [
  {
    id: "semana-2026-09-14",
    inicio: "2026-09-14",
    fim: "2026-09-19",
    fechadoEm: "2026-09-19T22:10:00",
    itens: [
      { motoboyId: "m1", nome: "Alemão", chavePix: "11988881101", valor: 684.5, status: "PAGO" },
      { motoboyId: "m2", nome: "Luiz", chavePix: "luiz@email.com", valor: 721.8, status: "PAGO" },
      { motoboyId: "m3", nome: "Nelber", chavePix: "11988881103", valor: 590.2, status: "PAGO" },
      { motoboyId: "m4", nome: "Nikolas", chavePix: "11988881104", valor: 612.4, status: "PENDENTE" },
    ],
  },
];

export function lerFechamentosMotoboys(): MotoboyFechamento[] {
  if (typeof window === "undefined") return fechamentosExemplo;
  const salvo = window.localStorage.getItem(MOTOboy_HISTORY_KEY);
  if (!salvo) return fechamentosExemplo;
  try {
    return JSON.parse(salvo) as MotoboyFechamento[];
  } catch {
    return fechamentosExemplo;
  }
}

export function salvarFechamentosMotoboys(fechamentos: MotoboyFechamento[]) {
  window.localStorage.setItem(MOTOboy_HISTORY_KEY, JSON.stringify(fechamentos));
}
