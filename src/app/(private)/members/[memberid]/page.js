'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { CalendarIcon, CirclePlusIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { parse, format, addMonths } from 'date-fns'
import startCase from 'lodash/startCase'
import lowerCase from 'lodash/lowerCase'
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'

const BADGE_TYPES = {
    UPCOMING: "UPCOMING",
    ON_GOING: "CURRENT",
    EXPIRED: "EXPIRED"
}

const DEFAULT_DATA = {
    membership_type: "",
    start_date: ""
}

const supabase = createClient()

export default function Memberships({ params }) {
    const { memberid } = params
    const [loading, setLoading] = useState(false)
    const [memberData, setMemberData] = useState({})
    const [subscriptionData, setSubscriptionData] = useState([])
    const [dialogueActive, setDialogueActive] = useState(false)

    const form = useForm({
        defaultValues: DEFAULT_DATA
    })

    const openDialog = () => setDialogueActive(true);
    const closeDialog = () => setDialogueActive(false);

    useEffect(() => {
        updateUserDetail()
    }, [])

    useEffect(() => {
        updateSubscriptionData()
    }, [memberData])

    async function updateSubscriptionData() {
        if (!memberData?.id) return

        try {
            const { data, error } = await supabase
                .from('memberships')
                .select('*')
                .eq('member_id', memberData.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error
            }

            setSubscriptionData(data)

        } catch (error) {
            console.error('Error fetching item by ID:', error)
            return null
        }
    }

    async function updateUserDetail() {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('bill_id', memberid)
                .single()

            if (error) {
                throw error
            }

            setMemberData(data)
        } catch (error) {
            console.error('Error fetching item by ID:', error)
            return null
        }
    }

    const addMonthsToDate = (dateString, monthsToAdd) => {
        if (!dateString) return
        if(!monthsToAdd) return
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date())
        const newDate = addMonths(parsedDate, monthsToAdd)
        return format(newDate, 'yyyy-MM-dd')
    }

    const getBadgeClass = (type) => {
        if (type === BADGE_TYPES.EXPIRED) {
            return "bg-red-500 text-white"
        }

        if (type === BADGE_TYPES.ON_GOING) {
            return "bg-yellow-500 text-white"
        }

        if (type === BADGE_TYPES.UPCOMING) {
            return "bg-blue-500 text-white"
        }
    }

    const getStatusByDate = (startDate, endDate) => {
        const today = new Date();

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < today) {
            return BADGE_TYPES.EXPIRED;
        } else if (start > today) {
            return BADGE_TYPES.UPCOMING;
        } else {
            return BADGE_TYPES.ON_GOING;
        }
    };


    const onSubmit = async (data) => {
        if(loading) return
        try {
            setLoading(true)
            const { start_date, membership_type } = data;

            const { error } = await supabase
                .from('memberships')
                .insert([{ start_date, membership_type, member_id : memberData.id }]);

            
            if (error) {
                toast({
                    title: "Not able to save",
                    description : error.message
                })
                console.error('Error saving data:', error);
            } else {
                toast({
                    title: "Successfully saved membership"
                })
                updateSubscriptionData()
                closeDialog()
                console.log('Data saved successfully');
            }
        } catch (error) {
            toast({
                title: "Not able to save",
                description : error.message
            })
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-8">
            <div className="w-full flex flex-row justify-between items-center sticky top-0 bg-background z-10 my-4">
                <div className="text-xl">
                    Member Details
                </div>
                <div className="flex flex-row gap-3">
                    <Dialog open={dialogueActive} onOpenChange={setDialogueActive}>
                        <DialogTrigger>
                            <div className="flex items-center rounded-md bg-foreground text-background px-2 py-1">
                                <CirclePlusIcon className="h-4 w-4 mr-1" />
                                <span className="text-sm">Add Membership</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Membership</DialogTitle>
                                <DialogDescription>
                                    Once you add the membership and it has been started you cannot edit it.
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                                        <FormField
                                            control={form.control}
                                            name="membership_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Membership Type</FormLabel>
                                                    <FormControl>
                                                        <Tabs defaultValue={field.value} className="w-[400px]" onValueChange={field.onChange}>
                                                            <TabsList>
                                                                <TabsTrigger value="1">1 Mon</TabsTrigger>
                                                                <TabsTrigger value="3">3 Mon</TabsTrigger>
                                                                <TabsTrigger value="6">6 Mon</TabsTrigger>
                                                                <TabsTrigger value="12">12 Mon</TabsTrigger>
                                                            </TabsList>
                                                        </Tabs>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="start_date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Date</FormLabel>
                                                    <FormControl>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn("w-full justify-start text-left font-normal")}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value ? new Date(field.value) : undefined}
                                                                    onSelect={(date) =>
                                                                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormLabel>End Date</FormLabel>
                                        <Input disabled type="text" value={addMonthsToDate(form.watch('start_date'), parseInt(form.watch('membership_type')))} placeholder="End Date" />
                                        <Button className="mt-2" type="submit">
                                            {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <div className="border p-3 rounded-md  flex flex-row justify-between">
                    <div className="flex flex-col gap-0">
                        {
                            memberData?.name ? (
                                <span className="text-3xl font-semibold">{startCase(lowerCase(memberData?.name))}</span>
                            ) : (
                                <Skeleton className={"h-9 w-28"} />
                            )
                        }
                        {
                            memberData?.bill_id ? (
                                <span className="text-sm opacity-40">{memberData?.bill_id}</span>
                            ) : (
                                <Skeleton className={"h-4 w-10 mt-1"} />
                            )
                        }
                    </div>
                </div>

                <div className="w-full flex flex-row justify-end items-center mt-5">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Duration</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptionData.map((item) => {
                                const endDate = addMonthsToDate(item.start_date, parseInt(item.membership_type))
                                const status = getStatusByDate(item.start_date ,endDate)
                                const badgeClass = getBadgeClass(status)
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant={'outline'}>
                                                {item.membership_type + " Month"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(item.start_date, "PPP")}</TableCell>
                                        <TableCell>{format(endDate, "PPP")}</TableCell>
                                        <TableCell>
                                            <Badge className={badgeClass}>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}