import { Home, Users, Map } from "lucide-react"

type Props={
children:any
}

export default function Layout({children}:Props){

return(

<div className="flex min-h-screen bg-slate-100">

{/* SIDEBAR */}

<div className="w-64 bg-slate-900 text-white p-6 hidden md:block">

<h2 className="text-xl font-bold mb-6">
CRM Comercial
</h2>

<nav className="space-y-3">

<div className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
<Home size={18}/>
Dashboard
</div>

<div className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
<Users size={18}/>
Clientes
</div>

<div className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
<Map size={18}/>
Mapa
</div>

</nav>

</div>

{/* CONTENT */}

<div className="flex-1 p-6">

{children}

</div>

</div>

)

}