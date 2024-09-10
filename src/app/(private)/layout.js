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
            <div className="w-2/12 h-full">
                <Sidebar
                    options={
                        [
                            { icon: "home", label: "Home", href: "/"},
                            { icon: "someicon", label: "Members", href: "/members"}
                        ]
                    }
                />
            </div>
            <div className="w-10/12 max-h-full overflow-auto">
                {children}
            </div>
        </div>
    )
}