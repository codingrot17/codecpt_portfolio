import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginForm({ onLogin, onSignup, isLoading }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (isSignupMode && !name) {
            setError("Please enter your name");
            return;
        }

        if (isSignupMode) {
            const result = await onSignup(email, password, name);
            if (!result.success) {
                setError(result.error);
            }
        } else {
            const result = await onLogin(email, password);
            if (!result.success) {
                setError(result.error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        {isSignupMode ? "Create Admin Account" : "Admin Login"}
                    </CardTitle>
                    <p className="text-gray-400">
                        {isSignupMode
                            ? "Sign up to manage your portfolio"
                            : "Enter your credentials to access the dashboard"}
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignupMode && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Processing..."
                                : isSignupMode
                                ? "Create Account"
                                : "Sign in"}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignupMode(!isSignupMode);
                                    setError("");
                                }}
                                className="text-sm text-blue-400 hover:text-blue-300"
                                disabled={isLoading}
                            >
                                {isSignupMode
                                    ? "Already have an account? Sign in"
                                    : "Don't have an account? Sign up"}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
