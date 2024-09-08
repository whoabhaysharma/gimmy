import { createClient } from "@/utils/supabase/client"

export async function getMembers(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    const supabase = createClient()
    const { data, error, count } = await supabase
        .from('members')
        .select('*', { count: 'exact' })
        .range(start, end)

    if (error) {
        console.error('Error fetching users:', error)
        throw new Error('Failed to fetch users')
    }

    return { data, count }
}