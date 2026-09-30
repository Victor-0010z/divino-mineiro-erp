"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { login, salvarSessao } from "@/lib/services/auth-service";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const sessao = await login(email, senha);
      salvarSessao(sessao);
      router.push("/dashboard");
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar no sistema.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.15fr_.85fr]">
      <section className="login-brand relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative mx-auto h-32 w-80">
          <Image
            src="/divino-logo.png"
            alt="Logo Divino Mineiro"
            fill
            priority
            className="object-contain object-center"
          />
        </div>

        <div className="relative max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[.25em] text-orange-300">
            Gestão inteligente
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Tudo do restaurante, claro e organizado.
          </h1>

          <p className="mt-5 max-w-lg text-lg text-white/70">
            Boletos, equipes, fornecedores, compras e tarefas em um só lugar.
          </p>
        </div>

        <p className="relative text-sm text-white/50">
          Acesso restrito a usuários autorizados
        </p>
      </section>

      <section className="login-form-panel flex min-h-screen items-center justify-center p-6">
        <form onSubmit={entrar} className="w-full max-w-md">
          <div className="relative mx-auto mb-7 h-24 w-56 lg:hidden">
            <Image
              src="/divino-logo.png"
              alt="Logo Divino Mineiro"
              fill
              priority
              className="object-contain object-center"
            />
          </div>

          <p className="login-system-name text-sm font-semibold text-primary">
            DIVINO MINEIRO ERP
          </p>

          <h2 className="mt-2 text-3xl font-bold">Bem-vindo de volta</h2>

          <p className="login-description mt-2 text-foreground/60">
            Entre para acessar o sistema de gestão.
          </p>

          <div className="mt-8">
            <label htmlFor="email" className="label">
              E-mail
            </label>

            <input
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="senha" className="label">
              Senha
            </label>

            <div className="relative">
              <input
                id="senha"
                className="input pr-11"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type={mostrar ? "text" : "password"}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setMostrar((valor) => !valor)}
                className="absolute right-3 top-3 text-foreground/50"
              >
                {mostrar ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {erro && (
            <p
              role="alert"
              className="login-error mt-4 rounded-xl border border-red-300 bg-red-100 p-3 text-sm font-semibold text-red-800"
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full"
          >
            {loading ? (
              "Entrando..."
            ) : (
              <>
                <LockKeyhole size={17} />
                Entrar no sistema
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}