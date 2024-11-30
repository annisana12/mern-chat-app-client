import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlignRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <Card className="w-[80%] max-w-sm">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row items-center">
                            <AlignRight size={20} />
                            <div className="ml-1">MERN Chat</div>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <h2 className="mt-6 text-3xl font-semibold">
                        Welcome Back,
                    </h2>

                    <div className="inline-flex items-center mt-3 mb-8">
                        <span className="mr-2 text-zinc-500">Don't have an account?</span>
                        <Link to={'/register'} className="font-medium hover:underline">Sign Up</Link>
                    </div>

                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    className="pr-11"
                                />

                                <div
                                    onClick={toggleShowPassword}
                                    className="absolute inset-y-0 right-0 my-auto mr-3 hover:cursor-pointer flex items-center"
                                >
                                    {showPassword ? <EyeOff size={22} strokeWidth={1.75} /> : <Eye size={22} strokeWidth={1.75} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="w-full mt-5 mb-3">Sign In</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login