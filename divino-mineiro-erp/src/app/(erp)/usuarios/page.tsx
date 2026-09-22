import { Plus } from "lucide-react";
import { usuariosMock } from "@/lib/mock-data";
import { PageHeading } from "@/components/page-heading";
import { EntityTable } from "@/components/entity-table";
import { StatusBadge } from "@/components/status-badge";
export default function Usuarios(){return <><PageHeading title="Usuários e permissões" description="Controle os acessos de Administrador e Gerência." action={<button className="btn-primary"><Plus size={17}/>Novo usuário</button>}/><EntityTable headers={["Nome","E-mail","Perfil","Último acesso","Status"]}>{usuariosMock.map(u=><tr key={u.id}><td className="font-semibold">{u.nome}</td><td>{u.email}</td><td>{u.perfil==="ADMINISTRADOR"?"Administrador":"Gerência"}</td><td>{u.ultimoAcesso?new Date(u.ultimoAcesso).toLocaleString("pt-BR"):"—"}</td><td><StatusBadge status={u.status}/></td></tr>)}</EntityTable></>}
