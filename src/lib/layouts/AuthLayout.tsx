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

            <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh p-4">
                {children}
                <div className="h-4 relative bottom-1 z-2 bg-[#D9D9D9B2] rounded-b-xl w-[492px] max-w-[432px]" />
                <div className="h-5 relative bottom-4 z-1 bg-[#D9D9D9B2] rounded-b-2xl w-[492px] max-w-[426px]" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
        </main>
    );
}
