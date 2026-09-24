"use client";
import { Search } from "lucide-react";
export function TableFilter({value,onChange,placeholder="Buscar por nome..."}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <div className="card mb-4 flex items-center gap-2 py-3"><Search size={18} className="text-foreground/40"/><input className="w-full bg-transparent text-sm outline-none" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>}
