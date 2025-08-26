import AuthLayout from "@/lib/layouts/AuthLayout";
import { LoginMain } from "@/components/auth/Login";

export default function Page() {
    return (
        <AuthLayout>
            <LoginMain />
        </AuthLayout>
    );
}