"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAppDispatch } from '@/lib/store/hooks'
import { setAuth } from "@/lib/store/features/auth/authSlice"
import { useTasks } from '../../../lib/context/TaskContext';

const loginSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const dispatch = useAppDispatch()
    const { fetchTasks } = useTasks();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data) => {
        try {
            toast({ description: "Logging In... 🫸🏻" })
            const response = await axios.post(`${BASE_URL}/api/auth/login`, data)
            localStorage.setItem("token", response.data.token)
            toast({ description: "Log In Successfull ✅" })
            dispatch(setAuth())
            fetchTasks()
            router.push("/dashboard")
        } catch (error) {
            toast({ description: "Log In Failed ❌" })
        }
    }

    return (
        <div className="flex justify-center items-center h-[95vh] dark">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                    <CardDescription>Log in to unlock your productivity! 💪</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} />
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
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant="secondary">Login</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
