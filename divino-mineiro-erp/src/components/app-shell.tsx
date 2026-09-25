"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Bike,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  ReceiptText,
  ScrollText,
  Settings,
  ShoppingCart,
  Truck,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";
import {
  encerrarSessao,
  obterSessao,
  type SessaoUsuario,
} from "@/lib/services/auth-service";
import { cn, iniciais } from "@/lib/utils";
import { TimeCloudCard } from "@/components/time-cloud-card";
const itens = [
  ["/dashboard", "Visão geral", LayoutDashboard],
  ["/contas", "Contas a pagar", ReceiptText],
  ["/diaristas", "Diaristas", UsersRound],
  ["/motoboys", "Motoboys", Bike],
  ["/fornecedores", "Fornecedores", Truck],
  ["/compras", "Solicitações", ShoppingCart],
  ["/tarefas", "Tarefas", ListTodo],
  ["/relatorios", "Relatórios", BarChart3],
  ["/usuarios", "Usuários", UserCog],
  ["/auditoria", "Auditoria", ScrollText],
  ["/configuracoes", "Configurações", Settings],
] as const;
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    router = useRouter();
  const [sessao, setSessao] = useState<SessaoUsuario | null>(null),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    const s = obterSessao();
    if (!s) router.replace("/login");
    else setSessao(s);
  }, [router]);
  if (!sessao)
    return (
      <div className="grid min-h-screen place-items-center">Carregando...</div>
    );
  const nav = (
    <>
      <div className="flex h-16 items-center justify-center border-b border-orange-700 bg-primary px-4">
        <span className="relative h-9 w-28">
          <Image
            src="/divino-logo.png"
            alt="Logo Divino Mineiro"
            fill
            className="object-contain object-center"
          />
        </span>
        <button className="absolute right-4 text-white lg:hidden" onClick={() => setMenu(false)}>
          <X />
        </button>
      </div>
      <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto p-3">
        {itens
          .filter(
            ([href]) =>
              sessao.usuario.perfil === "ADMINISTRADOR" ||
              !["/usuarios", "/auditoria", "/configuracoes"].includes(href),
          )
          .map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenu(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                path === href
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/65 hover:bg-orange-50 hover:text-primary",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
      </nav>
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {iniciais(sessao.usuario.nome)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {sessao.usuario.nome}
            </p>
            <p className="text-xs text-foreground/50">
              {sessao.usuario.perfil === "ADMINISTRADOR"
                ? "Administrador"
                : "Gerência"}
            </p>
          </div>
        </div>
        <button
          className="btn-outline w-full"
          onClick={() => {
            encerrarSessao();
            router.push("/login");
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="sidebar-surface hidden border-r lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        {nav}
      </aside>
      {menu && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMenu(false)}
        >
          <aside
            className="sidebar-surface flex h-full w-[280px] flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
          </aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-orange-700 bg-primary px-4 md:px-7">
          <button onClick={() => setMenu(true)} className="mr-3 text-white lg:hidden">
            <Menu />
          </button>
          <div className="ml-auto mr-3 hidden sm:block"><TimeCloudCard /></div>
          <button
            aria-label="Notificações"
            className="notification-button"
          >
            <Bell className="bell" size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </header>
        <main className="min-w-0 overflow-x-hidden p-4 md:p-7">{children}</main>
      </div>
    </div>
  );
}
