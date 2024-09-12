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

export async function createMember(memberData) {
    const supabase = createClient()
    let result;

    try {
        if (memberData.id) {
            result = await updateMember(memberData)
        } else {
            const { data, error } = await supabase
                .from('members')
                .insert([memberData])
                .select()
            result = { data: data ? data[0] : null, error }
        }
        return result
    } catch (error) {
        console.error('Error in createMember:', error)
        throw new Error("Not able to create or update the member")
    }
}

export async function updateMember(memberData) {
    const { id, ...memberDataToUpdate } = memberData
    console.log(id, 'IDDDD')
    try {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('members')
            .update(memberDataToUpdate)
            .eq('id', id)
            .select()
        return { data: data ? data[0] : null, error }
    } catch (error) {
        console.error('Error in updateMember:', error)
        throw new Error("Not able to update the member")
    }
}