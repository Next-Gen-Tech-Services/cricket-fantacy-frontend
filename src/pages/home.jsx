import heroHome from "../assets/hero-home.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Pick Your Squad",
    description:
      "Use your budget to pick a squad of 15 players and build your ultimate fantasy team.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/teams",
  },
  {
    title: "Create & Join Leagues",
    description:
      "Play against friends, family, or colleagues in private and public leagues.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/leagues",
  },
  {
    title: "Compete Against Friends",
    description:
      "Track points, climb leaderboards, and prove your fantasy skills.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/matches",
  },
  {
    title: "Win Exciting Rewards",
    description:
      "Compete throughout the season and win exciting prizes and bragging rights.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/matches",
  },
];

const responsiveBlogs = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function Home() {
  return (
    <main className="px-4 py-12 space-y-20 bg-main">
      {/* ================= HERO ================= */}
      <section className="max-w-[1440px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary">
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-14 items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Register to Play <br />
                Fantasy Cricket League
              </h1>

              <p className="mt-4 max-w-xl text-sm md:text-base text-white/90">
                Join millions of cricket fans and build your dream team. It’s{" "}
                <span className="font-semibold">FREE to play</span>.
              </p>

              <div className="mt-6 flex gap-4">
                <Link to="/login">
                  <button className="px-6 py-3 rounded-full text-sm font-semibold border border-white text-white hover:bg-white hover:text-black transition">
                    Log in
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-black">
                    Register now
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <img
                src={heroHome}
                alt="Cricket"
                className="w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-[1440px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
          How It Works
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 3).map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="app-card overflow-hidden hover:-translate-y-1 transition"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-secondary">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BLOGS ================= */}
      <section className="max-w-[1440px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
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
          itemClass="px-3"
        >
          {features.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="app-card overflow-hidden hover:-translate-y-1 transition"
            >
              <div className="h-36 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-secondary">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </Carousel>
      </section>
    </main>
  );
}
