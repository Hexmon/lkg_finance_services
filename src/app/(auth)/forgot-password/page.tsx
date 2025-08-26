import AuthLayout from "@/lib/layouts/AuthLayout";
import { ForgotPasswordMain } from "@/components/auth/Forgot";

export default function Page() {
    return (
        <AuthLayout>
            <ForgotPasswordMain />
        </AuthLayout>
    );
}