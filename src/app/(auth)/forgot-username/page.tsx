import AuthLayout from "@/lib/layouts/AuthLayout";
import { ForgotUsernameMain } from "@/components/auth/Forgot";

export default function Page() {
    return (
        <AuthLayout>
            <ForgotUsernameMain />
        </AuthLayout>
    );
}