'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { CirclePlusIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { parse, format, addMonths } from 'date-fns';
import startCase from 'lodash/startCase';
import lowerCase from 'lodash/lowerCase';

const BADGE_TYPES = {
    UPCOMING: "UPCOMING",
    ON_GOING: "ON_GOING",
    EXPIRED: "EXPIRED"
}

const supabase = createClient()
export default function Memberships({ params }) {
    const { memberid } = params
    const [loading, setLoading] = useState(false)
    const [memberData, setMemberData] = useState({})
    const [subscriptionData, setSubscriptionData] = useState([])

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
                .from('memberships')   // Replace 'members' with your table name
                .select('*')       // Select all columns, or specify specific columns
                .eq('member_id', memberData.id)     // Match the 'id' column with the provided ID

            if (error) {
                throw error; // Handle any errors
            }

            setSubscriptionData(data)

        } catch (error) {
            console.error('Error fetching item by ID:', error);
            return null;
        }
    }

    console.log(subscriptionData, 'SUBSCRIPTION DATA')

    async function updateUserDetail() {
        try {
            const { data, error } = await supabase
                .from('members')   // Replace 'members' with your table name
                .select('*')       // Select all columns, or specify specific columns
                .eq('bill_id', memberid)      // Match the 'id' column with the provided ID
                .single();         // Ensures only a single item is returned

            if (error) {
                throw error; // Handle any errors
            }

            setMemberData(data); // Returns the retrieved item
        } catch (error) {
            console.error('Error fetching item by ID:', error);
            return null;
        }
    }


    const chartData = [
        { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    ]
    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        safari: {
            label: "Safari",
            color: "hsl(var(--chart-2))",
        },
    }

    const addMonthsToDate = (dateString, monthsToAdd) => {
        // Parse the input string in yyyy-MM-dd format
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());

        // Add the required number of months
        const newDate = addMonths(parsedDate, monthsToAdd);

        // Format the date back to yyyy-MM-dd format
        return format(newDate, 'yyyy-MM-dd');
    };

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

    const getStatusByDate = (inputDate) => {
        const today = new Date();
        const date = new Date(inputDate);
        if (date < today) {
            return BADGE_TYPES.EXPIRED
        } else if (date > today) {
            return BADGE_TYPES.UPCOMING
        } else {
            return BADGE_TYPES.ON_GOING
        }
    }

    return (
        <div className="mx-8">
            <div className="w-full flex flex-row justify-between items-center sticky top-0 bg-background z-10 my-4">
                <div className="text-xl">
                    Memberships
                </div>
                <div className="flex flex-row gap-3">
                    <Button size={"sm"} >
                        <CirclePlusIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Add Membership</span>
                    </Button>
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
                                console.log(item, 'ITEM')
                                const endDate = addMonthsToDate(item.start_date, parseInt(item.membership_type))
                                const status = getStatusByDate(endDate)
                                const badgeClass = getBadgeClass(status)
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant={'outline'}>
                                                {item.membership_type + " Month"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.start_date}</TableCell>
                                        <TableCell>{endDate}</TableCell>
                                        <TableCell>
                                            <Badge className={badgeClass}>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            }

                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}