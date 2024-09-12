import Sidebar from "@/components/custom/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if(!session) {
        redirect('/login')
    }
    return (
        <div className="flex h-screen max-h-screen w-full flex-row">
            <div className="">
                <Sidebar
                />
            </div>
            <div className="">
                {children}
            </div>
        </div>
    )
}