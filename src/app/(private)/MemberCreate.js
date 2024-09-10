"use client"

import { Button } from "@/components/ui/button"
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createMember } from "@/service/members"
import { useToast } from "@/hooks/use-toast"

const membersSchema = z.object({
    name: z.string().min(4, {
        message: "Please enter a valid name (minimum 4 characters)",
    }),
    bill_id: z.number().max(999999, {
        message: "Bill number should be a valid number",
    }),
    joining_date: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/, {
        message: "Enter a valid date",
    }),
});

export function MemberCreate({ active = false, onOpenChange = () => { } }) {
    const {toast} = useToast()
    const form = useForm({
        resolver: zodResolver(membersSchema),
        defaultValues: {
            name: "",
            bill_id: "",
            joining_date: ""
        }
    })
    const [isLoading, setIsLoading] = useState(false)

    const submit = async (inputData) => {
        setIsLoading(true)
        try {
            const { data, error } = await createMember(inputData)

            console.log(error, 'ERRROR')
            if (error) {
                const DUPLICATE_MESSAGE = "Bill No already exists please enter new bill number"
                toast({
                    title: "Error",
                    description: error.code === "23505" ? DUPLICATE_MESSAGE : "No able to create member"
                })
            } else {
                toast({
                    title: "Successfully created member"
                })   
            }
        } catch (error) {
            toast({
                title: "Error",
                description : "Not able to create member"
            })
            console.error("Error creating member:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={active} onOpenChange={(state) => {
            form.reset()
            onOpenChange(state)
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Fill the details below to add the new member
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bill_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bill No.</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Bill no." {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="joining_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Joining Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy/MM/dd') : '')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Adding..." : "Add Member"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}