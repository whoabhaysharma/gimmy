'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getMembers } from "@/service/members"
import { EllipsisIcon } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
    const [resp, setResp] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const { data, count } = await getMembers(1, 10)
            setResp({
                data,
                count
            })
        }

        fetchData()
    }, [])

    const members = resp?.data || []

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Bill No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Joining Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                    <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.bill_id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.created_at}</TableCell>
                        <TableCell className="text-right">{member.joining_date}</TableCell>
                        <TableCell>
                            <EllipsisIcon/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    )
}