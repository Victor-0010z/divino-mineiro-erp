"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Bike,
  ClipboardList,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  contasPagarMock,
  motoboysMock,
  registrosDiariaMock,
  solicitacoesMock,
  tarefasMock,
} from "@/lib/mock-data";
import { moeda } from "@/lib/utils";

const pagos = [
  { nome: "Seg", valor: 900 },
  { nome: "Ter", valor: 1580 },
  { nome: "Qua", valor: 0 },
  { nome: "Qui", valor: 3480 },
  { nome: "Sex", valor: 1200 },
  { nome: "Sáb", valor: 0 },
];
const pendentes = [
  { nome: "Seg", valor: 4825 },
  { nome: "Ter", valor: 2100 },
  { nome: "Qua", valor: 11240 },
  { nome: "Qui", valor: 0 },
  { nome: "Sex", valor: 3687 },
  { nome: "Sáb", valor: 900 },
];
const ganhosMotoboys = [
  { nome: "Luiz", valor: 286.8 },
  { nome: "Alemão", valor: 270.5 },
  { nome: "Nikolas", valor: 229.4 },
  { nome: "Nelber", valor: 169.5 },
];
const fornecedores = [
  { nome: "Boi Manso", valor: 112400 },
  { nome: "Serra Verde", valor: 48250 },
  { nome: "Vale Águas", valor: 36870 },
];

function Financeiro({
  titulo,
  total,
  dados,
  cor,
  rota,
}: {
  titulo: string;
  total: number;
  dados: typeof pagos;
  cor: string;
  rota: string;
}) {
  const router = useRouter();
  return (
    <article className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">No período</p>
          <h2 className="font-bold">{titulo}</h2>
        </div>
        <b style={{ color: cor }}>{moeda(total)}</b>
      </div>
      <div className="mt-2 h-32 cursor-pointer">
        <ResponsiveContainer>
          <AreaChart data={dados} onClick={() => router.push(rota)}>
            <defs>
              <linearGradient id={`g-${titulo}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={cor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nome" tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => moeda(Number(v))} />
            <Area
              type="monotone"
              dataKey="valor"
              stroke={cor}
              strokeWidth={2.5}
              fill={`url(#g-${titulo})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("7");
  const cards = [
    [
      "Contas pendentes",
      moeda(
        contasPagarMock
          .filter((c) => c.status === "PENDENTE")
          .reduce((s, c) => s + c.valor, 0),
      ),
      Banknote,
      "/contas",
    ],
    [
      "Boletos vencidos",
      String(contasPagarMock.filter((c) => c.status === "VENCIDO").length),
      AlertTriangle,
      "/contas",
    ],
    [
      "Diárias pendentes",
      String(registrosDiariaMock.filter((r) => r.status !== "PAGO").length),
      UsersRound,
      "/diaristas",
    ],
    [
      "Solicitações abertas",
      String(
        solicitacoesMock.filter(
          (s) => !["FINALIZADA", "REPROVADA"].includes(s.status),
        ).length,
      ),
      ShoppingCart,
      "/compras",
    ],
    [
      "Motoboys pendentes",
      String(
        motoboysMock.filter((m) => m.statusPagamento === "PENDENTE").length,
      ),
      Bike,
      "/motoboys",
    ],
    [
      "Tarefas a fazer",
      String(tarefasMock.filter((t) => t.status !== "CONCLUIDA").length),
      ClipboardList,
      "/tarefas",
    ],
  ] as const;
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
            Visão operacional
          </p>
          <h1 className="mt-1 text-3xl font-bold">Bom dia!</h1>
          <p className="text-foreground/55">
            Resumo financeiro e operacional do restaurante.
          </p>
        </div>
        <select
          className="input w-auto"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="1">Último dia</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
        </select>
      </div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([titulo, valor, Icon, rota]) => (
          <Link href={rota} className="dashboard-card" key={titulo}>
            <span className="dashboard-icon">
              <Icon size={19} />
            </span>
            <div>
              <p className="metric-label">{titulo}</p>
              <b className="text-xl">{valor}</b>
            </div>
          </Link>
        ))}
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Financeiro
          titulo="Valores pagos"
          total={pagos.reduce((s, d) => s + d.valor, 0)}
          dados={pagos}
          cor="#2f8b61"
          rota={`/relatorios?secao=contas&periodo=${periodo}&status=pago`}
        />
        <Financeiro
          titulo="Valores pendentes"
          total={pendentes.reduce((s, d) => s + d.valor, 0)}
          dados={pendentes}
          cor="#e97924"
          rota={`/relatorios?secao=contas&periodo=${periodo}&status=pendente`}
        />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <article className="card">
          <div className="mb-3">
            <h2 className="font-bold">Motoboys com maior valor</h2>
            <p className="metric-label">
              Comparativo dos últimos {periodo} dias
            </p>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={ganhosMotoboys} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={70}
                  tickLine={false}
                />
                <Tooltip formatter={(v) => moeda(Number(v))} />
                <Bar
                  dataKey="valor"
                  fill="#e97924"
                  radius={[0, 7, 7, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="card">
          <div className="mb-3">
            <h2 className="font-bold">Fornecedores mais pagos</h2>
            <p className="metric-label">
              Ajuda a identificar concentração de compras
            </p>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={fornecedores}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nome" tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => moeda(Number(v))} />
                <Bar
                  dataKey="valor"
                  fill="#9b3f15"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </>
  );
}
