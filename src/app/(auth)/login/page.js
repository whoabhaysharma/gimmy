'use client'

import { useState, useEffect } from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { login } from "./action"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    email: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const { toast} = useToast()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    async function onSubmit(values) {
        setIsLoading(true)
        try {
            await login(values)
        } catch (error) { 
            toast({
                title: "Something went wrong cannot login",
                description: "Please check your credentials and try again",
              })
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="text-6xl font-bold">
                Fitbull
            </div>
            <Form {...form}>
                <form className="w-10/12 sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        variant="primary"
                        type="submit"
                        className="bg-foreground/90 text-background"
                        disabled={isLoading}>
                        {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
