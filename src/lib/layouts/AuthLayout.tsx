export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
        <main className="relative min-h-dvh w-full overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat scale-105 blur-[2px]"
                    style={{ backgroundImage: "url('/auth-bg.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/45" />
            </div>
            {children}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
        </main>
    );
}
