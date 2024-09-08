import Sidebar from "@/components/custom/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Home } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if(!session) {
        redirect('/login')
    }
    return (
        <div className="flex h-screen w-full flex-row">
            <div className="w-2/12">
                <Sidebar options={[{icon : Home, label : "Home", href : "/"}]}/>
            </div>
            <div className="w-10/12">
                {children}
            </div>
        </div>
    )
}