import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api_client"
import { LOGIN_ROUTE } from "@/utils/constants"
import { loginSchema } from "@/utils/validation_schema"
import { AlignRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const validateForm = async () => {
        try {
            await loginSchema.validate({ email, password }, { abortEarly: false });

            setErrors({});
            return true;
        } catch (error) {
            const newState = error.inner.reduce((acc, current) => {
                if (!acc[current.path]) acc[current.path] = current.message;
                return acc;
            }, {});

            setErrors(newState);
            return false;
        }
    }

    const handleSubmit = async () => {
        try {
            const isValid = await validateForm();

            if (!isValid) return;

            const response = await apiClient.post(
                LOGIN_ROUTE,
                { email, password },
                { withCredentials: true } // set the cookie in browser
            );

            if (response.data.data.id) {
                if (response.data.data.profileSetup) navigate('/chat');
                else navigate('/profile');
            }
        } catch (error) {
            if (error.response) {
                const { message, data } = error.response.data;
                let description = data;

                if (data && data.errors) {
                    description = data.errors.map((el, index) => (<div key={index}>{el.message}</div>))
                }

                toast.error(message, {
                    description,
                    duration: 10000 // 10 seconds
                });
            } else {
                toast.error("Internal Server Error");
            }
        }
    };

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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    className="pr-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <div
                                    onClick={toggleShowPassword}
                                    className="absolute inset-y-0 right-0 my-auto mr-3 hover:cursor-pointer flex items-center"
                                >
                                    {showPassword ? <EyeOff size={22} strokeWidth={1.75} /> : <Eye size={22} strokeWidth={1.75} />}
                                </div>
                            </div>

                            {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button onClick={handleSubmit} className="w-full mt-5 mb-3">Sign In</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login