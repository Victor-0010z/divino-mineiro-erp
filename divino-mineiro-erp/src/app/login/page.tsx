"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, UtensilsCrossed } from "lucide-react";
import { login, salvarSessao } from "@/lib/services/auth-service";

export default function LoginPage(){
  const router=useRouter(); const [email,setEmail]=useState("admin@divinomineiro.com.br"); const [senha,setSenha]=useState("divino123"); const [mostrar,setMostrar]=useState(false); const [erro,setErro]=useState(""); const [loading,setLoading]=useState(false);
  async function entrar(e:React.FormEvent){e.preventDefault();setErro("");setLoading(true);try{salvarSessao(await login(email,senha));router.push("/dashboard")}catch(err){setErro(err instanceof Error?err.message:"Falha ao entrar") }finally{setLoading(false)}}
  return <main className="grid min-h-screen lg:grid-cols-[1.15fr_.85fr]">
    <section className="relative hidden overflow-hidden bg-[#173d2b] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl"/><div className="relative flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-[#173d2b]"><UtensilsCrossed/></span><div><b className="text-xl">Divino Mineiro</b><p className="text-sm text-white/65">ERP Administrativo</p></div></div>
      <div className="relative max-w-xl"><p className="mb-4 text-sm font-semibold uppercase tracking-[.25em] text-gold">Gestão inteligente</p><h1 className="text-5xl font-bold leading-tight">Controle o restaurante com clareza e tranquilidade.</h1><p className="mt-5 max-w-lg text-lg text-white/70">Boletos, diaristas, fornecedores, compras e tarefas em um só lugar.</p></div>
      <p className="relative text-sm text-white/50">Acesso restrito a usuários autorizados</p>
    </section>
    <section className="flex items-center justify-center p-6"><form onSubmit={entrar} className="w-full max-w-md"><div className="mb-8 lg:hidden"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white"><UtensilsCrossed/></span></div><p className="text-sm font-semibold text-gold">DIVINO MINEIRO ERP</p><h2 className="mt-2 text-3xl font-bold">Bem-vindo de volta</h2><p className="mt-2 text-foreground/60">Entre para acessar o sistema de gestão.</p>
      <div className="mt-8"><label className="label">E-mail</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></div>
      <div className="mt-4"><label className="label">Senha</label><div className="relative"><input className="input pr-11" value={senha} onChange={e=>setSenha(e.target.value)} type={mostrar?"text":"password"} required/><button type="button" aria-label="Mostrar senha" onClick={()=>setMostrar(!mostrar)} className="absolute right-3 top-3 text-foreground/50">{mostrar?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></div>
      {erro&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}<button disabled={loading} className="btn-primary mt-6 w-full">{loading?"Entrando...":<><LockKeyhole size={17}/>Entrar no sistema</>}</button><p className="mt-5 text-center text-xs text-foreground/50">Senha de demonstração: <b>divino123</b></p>
    </form></section>
  </main>
}
