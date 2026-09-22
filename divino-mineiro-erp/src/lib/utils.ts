import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const moeda = (v:number) => v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
export const dataBr = (v:string) => new Intl.DateTimeFormat("pt-BR", { timeZone:"UTC" }).format(new Date(`${v}T12:00:00Z`));
export const iniciais = (nome:string) => nome.split(" ").filter(Boolean).slice(0,2).map(p=>p[0]).join("").toUpperCase();
