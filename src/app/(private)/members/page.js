'use client'

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CirclePlusIcon, EllipsisIcon, ListFilter } from "lucide-react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MemberCreate } from "../MemberCreate"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { ReloadIcon } from "@radix-ui/react-icons"
import debounce from 'lodash/debounce';

const ITEM_COUNT_PER_PAGE = 10
const supabase = createClient()

const FILTER_MODE = {
    NAME: "name",
    BILL_ID : "bill_id"
}

export default function Home() {
    const [filter, setFilter] = useState({
        search: "",
        page: 1
    })
    const [resp, setResp] = useState({})
    const [createModalActive, setCreateModalActive] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filterMode, setFilterMode] = useState(FILTER_MODE.NAME)

    const searchData = useCallback(
        debounce(async (filter) => {
            const { search = "", page = 1 } = filter;
            setLoading(true); // Set loading to true when starting the search
            const searchKey = filterMode === FILTER_MODE.NAME ? 'name' : 'bill_id';
            const searchQuery = filterMode === FILTER_MODE.NAME ? `%${search}%` : search; // No need to format search for bill_id

            const start = (page - 1) * ITEM_COUNT_PER_PAGE; // Calculate the start index
            const end = start + ITEM_COUNT_PER_PAGE - 1; // Calculate the end index

            try {
                let data, error, count;
                if (filterMode === FILTER_MODE.NAME) {
                    // Search by name using ilike
                    ({ data, error, count } = await supabase
                        .from('members')
                        .select('*', { count: 'exact' })
                        .range(start, end)
                        .ilike(searchKey, searchQuery) // Search the 'name' field with ilike
                        .limit(10));
                } else {
                    // Search by bill_id using eq for exact matching
                    ({ data, error, count } = await supabase
                        .from('members')
                        .select('*', { count: 'exact' })
                        .range(start, end)
                        .eq(searchKey, searchQuery) // Exact match for numeric field bill_id
                        .limit(10));
                }

                if (error) {
                    throw error; // Throw error to be caught in catch block
                }

                setResp((prev) => ({
                    ...prev,
                    data: data,
                    count: count,
                }));
            } catch (error) {
                console.error('Error searching users:', error);
            } finally {
                setLoading(false); // Ensure loading is set to false after the operation completes
            }
        }, 500), // Adjust the debounce time as needed
        [filterMode] // filterMode is the dependency to ensure debouncing works with mode changes
    );

    useEffect(() => {
        searchData(filter); // Only trigger when filter has valid input
        return () => searchData.cancel();
    }, [filter, searchData]);

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
                            placeholder={filterMode === FILTER_MODE.NAME ? "Search name..." : "Search Bill no..."}
                        />
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin absolute right-1 top-[8px]" />}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="h-8 w-8 rounded-md border flex justify-center items-center">
                                <ListFilter className="h-4 w-4 text-slate-600" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterMode(FILTER_MODE.NAME)}>Name</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMode(FILTER_MODE.BILL_ID)}>Bill No.</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                    <span className="text-sm font-semibold mr-10 m">{`Page ${filter.page} of ${totalPageCount}`}</span>
                    <div className="flex flex-row gap-2">
                        <span
                            onClick={() => {
                                setFilter(prev => {
                                    return {
                                        ...prev,
                                        page : 1
                                    }
                                })
                            }}
                            className="p-2 border rounded-sm hover:bg-muted cursor-pointer"
                        >
                            <ChevronsLeft className="h-4 w-4 text-slate-600"/>
                        </span>
                        <span
                            onClick={() => {
                                if(filter.page === 1) return
                                setFilter(prev => {
                                    return {
                                        ...prev,
                                        page: prev.page - 1
                                    }
                                })
                            }}
                            className="p-2 border rounded-sm hover:bg-muted cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </span>
                        <span
                            onClick={() => {
                                setFilter(prev => {
                                    return {
                                        ...prev,
                                        page : prev.page + 1
                                    }
                                })
                            }}
                            className="p-2 border rounded-sm hover:bg-muted cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                        </span>
                        <span
                            onClick={() => {
                                setFilter(prev => {
                                    return {
                                        ...prev,
                                        page: totalPageCount
                                    }
                                })
                            }}
                            className="p-2 border rounded-sm hover:bg-muted cursor-pointer">
                            <ChevronsRight className="h-4 w-4 text-slate-600" />
                        </span>
                    </div>

                </div>
            </div>
        </div>

    )
}