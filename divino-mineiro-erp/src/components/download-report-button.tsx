"use client";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

type Props={filename:string; rows:(string|number)[][]; label?:string};
export function DownloadReportButton({filename,rows,label="Baixar Excel"}:Props){
 const [loading,setLoading]=useState(false),[done,setDone]=useState(false);
 function baixar(){setLoading(true);setDone(false);window.setTimeout(()=>{const csv="\uFEFF"+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=`${filename}.csv`;a.click();URL.revokeObjectURL(url);setLoading(false);setDone(true);window.setTimeout(()=>setDone(false),2200)},900)}
 return <><button className={`download-button ${loading?"is-loading":""} ${done?"is-done":""}`} onClick={baixar} disabled={loading}>{done?<FileSpreadsheet/>:<Download/>}<span>{loading?"Gerando...":done?"Baixado!":label}</span></button>{loading&&<div className="typewriter-toast" role="status"><div className="typewriter"><div className="slide"><i/></div><div className="paper"/><div className="keyboard"/></div><div><b>Preparando relatório</b><p>Organizando os dados...</p></div></div>}</>;
}
