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

import { getMembers } from "@/service/members"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CirclePlusIcon, EllipsisIcon, Plus } from "lucide-react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MemberCreate } from "../MemberCreate"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { ReloadIcon } from "@radix-ui/react-icons"
import debounce from 'lodash/debounce';

const ITEM_COUNT_PER_PAGE = 10
const supabase = createClient()

export default function Home() {
    const [filter, setFilter] = useState({
        search: ""
    })
    const [resp, setResp] = useState({})
    const [createModalActive, setCreateModalActive] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [loading, setLoading] = useState(false)

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

    const searchData = useCallback(
        debounce(async (searchTerm) => {
            setLoading(true); // Set loading to true when starting the search

            try {
                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .ilike('name', `%${searchTerm}%`) // Search the 'name' field
                    .limit(10);

                if (error) {
                    throw error; // Throw error to be caught in catch block
                }

                setResp((prev) => ({
                    ...prev,
                    data: data,
                }));
            } catch (error) {
                console.error('Error searching users:', error);
                // Optionally, you can update some state here to show an error message to users
            } finally {
                setLoading(false); // Ensure loading is set to false after the operation completes
            }
        }, 500), // Adjust the delay as needed
        [] // Empty dependency array ensures this is created only once
    );

    useEffect(() => {
        searchData(filter.search)
    }, [filter])

    const members = resp?.data || []

    const totalPageCount = useMemo(() => {
        const { count = 0 } = resp || {};
        if (count === 0) return 0;

        const pageCount = Math.ceil(count / ITEM_COUNT_PER_PAGE);
        return pageCount;
    }, [resp]);

    return (
        <div className="mx-8">
            <MemberCreate
                data={selectedMember}
                active={createModalActive}
                onOpenChange={state => setCreateModalActive(state)}
            />
            <div className="w-full flex flex-row justify-between items-center sticky top-0 bg-background z-10 my-4">
                <div className="text-xl">
                    Members
                </div>
                <div className="flex flex-row gap-3">
                    <div className="relative">
                        <Input
                            onChange={(e) => {
                                setFilter(prev => ({
                                    ...prev,
                                    search: e.target.value
                                }))
                            }}
                            className="h-8"
                            placeholder={"Search Members..."}
                        />
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin absolute right-1 top-[8px]" />}
                    </div>
                    
                    <Button size={"sm"} onClick={() => setCreateModalActive(true)}>
                        <CirclePlusIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Add Members</span>
                    </Button>
                </div>
                
            </div>
            <div>
                <div className="border p-3 rounded-md">
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
                <div className="w-full flex flex-row justify-end items-center mt-5">
                    <span className="text-sm font-semibold mr-10 m">{`Page 1 of ${totalPageCount}`}</span>
                    <div className="flex flex-row gap-2">
                        <span className="p-2 border rounded-sm hover:bg-muted cursor-pointer">
                            <ChevronsLeft className="h-4 w-4 text-slate-600"/>
                        </span>
                        <span className="p-2 border rounded-sm hover:bg-muted cursor-pointer">
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </span>
                        <span className="p-2 border rounded-sm hover:bg-muted cursor-pointer">
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                        </span>
                        <span className="p-2 border rounded-sm hover:bg-muted cursor-pointer">
                            <ChevronsRight className="h-4 w-4 text-slate-600" />
                        </span>
                    </div>

                </div>
            </div>
        </div>

    )
}