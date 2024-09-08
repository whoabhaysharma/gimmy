'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginLayout({ children }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if(session) {
        redirect('/')
    }

    return (
        <main>
            {children}
        </main>
    )
}