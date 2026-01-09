import heroHome from "../assets/hero-home.png"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const features = [
    {
        title: "Pick Your Squad",
        description:
            "Use your budget to pick a squad of 15 players and build your ultimate fantasy team.",
    },
    {
        title: "Create & Join Leagues",
        description:
            "Play against friends, family, or colleagues in private and public leagues.",
    },
    {
        title: "Compete Against Friends",
        description:
            "Track points, climb leaderboards, and prove your fantasy skills.",
    },
    {
        title: "Win Exciting Rewards",
        description:
            "Compete throughout the season and win exciting prizes and bragging rights.",
    },
]

const responsiveFeatures = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
    },
}

const responsiveBlogs = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
    },
}

export default function Home() {
    return (
        <main className="px-4 py-10 space-y-16">
            {/* ================= HERO SECTION ================= */}
            <section className="max-w-[1440px] mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))]">
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-14 items-center">
                        {/* LEFT */}
                        <div className="text-[rgb(var(--color-text))]">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                                Register to Play <br />
                                Fantasy Cricket League
                            </h1>

                            <p className="mt-4 max-w-xl text-sm md:text-base text-[rgb(var(--color-text)/0.85)]">
                                Join millions of cricket fans and build your dream team.
                                It’s <span className="font-semibold">FREE to play</span> and
                                win exciting prizes.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-4">
                                <button className="px-6 py-3 rounded-full border border-white/70 text-sm font-semibold hover:bg-white hover:text-black transition">
                                    Log in
                                </button>

                                <button className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:opacity-90 transition">
                                    Register now
                                </button>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="relative hidden lg:flex justify-end">
                            <img
                                src={heroHome}
                                alt="Cricket Players"
                                className="w-full max-w-md drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES / CAROUSEL ================= */}
            <section className="max-w-[1440px] mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[rgb(var(--color-text))] mb-6">
                    How It Works
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.slice(0, 3).map((item, index) => (
                        <div
                            key={index}
                            className="
          rounded-2xl
          bg-[rgb(var(--color-surface))]
          border border-white/10
          shadow-lg
          hover:-translate-y-1
          transition
        "
                        >
                            {/* Card Top */}
                            <div className="h-48 rounded-t-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm text-[rgb(var(--color-text)/0.75)]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            {/* ================= BLOGS / CAROUSEL ================= */}
            <section className="max-w-[1440px] mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[rgb(var(--color-text))] mb-6">
                    Our Latest Blogs
                </h2>

                <Carousel
                    responsive={responsiveBlogs}
                    infinite
                    autoPlay
                    autoPlaySpeed={3000}
                    arrows={false}
                    showDots
                    containerClass="pb-10"
                    dotListClass="custom-dot-list"
                    itemClass="px-3"
                >
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="
                rounded-2xl
                bg-[rgb(var(--color-surface))]
                border border-white/10
                shadow-lg
                hover:-translate-y-1
                transition
              "
                        >
                            {/* Card Top */}
                            <div className="h-36 rounded-t-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm text-[rgb(var(--color-text)/0.75)]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </section>
        </main>
    )
}
