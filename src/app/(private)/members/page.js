'use client'

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { getMembers } from "@/service/members"
import { EllipsisIcon, Plus } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MemberCreate } from "../MemberCreate"


export default function Home() {
    const [resp, setResp] = useState({})
    const [createModalActive, setCreateModalActive] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

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
        <div>
            <MemberCreate
                data={selectedMember}
                active={createModalActive}
                onOpenChange={state => setCreateModalActive(state)}
            />
            <div className="w-full flex flex-row justify-between items-center sticky top-0 bg-background z-10 p-5">
                <div className="font-bold text-2xl">
                    Members
                </div>
                <Button onClick={() => setCreateModalActive(true)}>
                    Add New
                    <Plus className="scale-75" />
                </Button>
            </div>
            <div className="px-5">
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisIcon className='scale-75 hover:bg-slate-200 h-7 w-7 rounded-sm p-1 cursor-pointer' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-40">
                                            <DropdownMenuLabel>Member</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setSelectedMember(member)
                                                    setCreateModalActive(true)
                                                }}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Transactions</DropdownMenuItem>
                                            <DropdownMenuItem>Attendance</DropdownMenuItem>
                                            <DropdownMenuItem>Personal Training</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="w-full flex flex-row justify-end items-end">
                <Pagination className="m-0 w-fit">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>

    )
}