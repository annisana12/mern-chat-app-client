import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRequest } from "@/lib/api_client"
import { useAppStore } from "@/store"
import { SIGNUP_ROUTE } from "@/utils/constants"
import { registerSchema, validateForm } from "@/utils/validation"
import { AlignRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const setUserInfo = useAppStore((state) => state.setUserInfo);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async () => {
        setLoading(true);

        const isValid = await validateForm(
            registerSchema,
            { email, password },
            setErrors
        );

        if (!isValid) {
            setLoading(false);
            return;
        };

        const response = await apiRequest(
            'post',
            SIGNUP_ROUTE,
            { email, password },
            {},
            10000 // 10 seconds
        )

        setLoading(false);

        if (response && response.status === 201) {
            setUserInfo(response.data.data);

            navigate('/profile');
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
                    <h2 className="mt-6 text-2xl font-semibold">
                        Create Your Account
                    </h2>

                    <div className="inline-flex items-center mt-3 mb-8">
                        <span className="mr-2 text-zinc-500">Already have an account?</span>
                        <Link to={'/login'} className="font-medium hover:underline">Sign In</Link>
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
                    <Button
                        onClick={handleSubmit}
                        className="w-full mt-5 mb-3"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register