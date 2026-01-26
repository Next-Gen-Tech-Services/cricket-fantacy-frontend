import heroHome from "../assets/hero-home.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTournaments } from "../store/slices/tournamentsSlice";
import { fetchLiveMatches } from "../store/slices/matchesSlice";

const features = [
  {
    title: "Create a Login",
    description:
      "Sign up for free and create your fantasy cricket account to get started.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/signup",
  },
  {
    title: "Pick Your Tournament",
    description:
      "Browse and select from live and upcoming cricket tournaments worldwide.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/tournaments",
  },
  {
    title: "Build Your Team",
    description:
      "Create your ultimate fantasy XI for each match within your budget.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/tournaments",
  },
  {
    title: "Invite Your Friends",
    description:
      "Share leagues with friends and compete against each other for glory.",
    image:
      "https://resources.premierleague.pulselive.com/photo-resources/2026/01/11/4c840b12-ad5f-4a70-9abb-fef7dc6859ca/Graphic-showing-Phil-Foden-left-Granot-Xhaka-middle-and-Jurrien-Timber-right-part-of-Shearer-s-Team-of-the-Season-so-far.png?width=2880",
    link: "/leagues",
  },
];

const responsiveBlogs = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function Home() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {

    // Fetch tournaments and live matches on component mount
    dispatch(fetchTournaments());
    dispatch(fetchLiveMatches());
  }, [dispatch]);

  return (
    <main className="px-4 py-12 space-y-20 bg-main">
      {/* ================= HERO ================= */}
      <section className="max-w-[1440px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary">
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-14 items-center">
            <div className="text-white">
              {isAuthenticated ? (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome back, {user?.name?.split(' ')[0]}! <br />
                  Ready to dominate?
                </h1>
              ) : (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Register to Play <br />
                  Fantasy Cricket League
                </h1>
              )}

              {isAuthenticated ? (
                <p className="mt-4 max-w-xl text-sm md:text-base text-white/90">
                  Your fantasy teams are waiting. Join live tournaments and climb the leaderboard!
                </p>
              ) : (
                <p className="mt-4 max-w-xl text-sm md:text-base text-white/90">
                  Join millions of cricket fans and build your dream team. It's{" "}
                  <span className="font-semibold">FREE to play</span>.
                </p>
              )}

              {isAuthenticated ? (
                <div className="mt-6 flex gap-4 flex-wrap">
                  <Link to="/tournaments">
                    <button className="px-8 py-3 rounded-full text-sm font-semibold bg-yellow-400 text-[#273470] hover:bg-yellow-500 transition">
                      View Live Tournaments
                    </button>
                  </Link>

                  <Link to="/leagues">
                    <button className="px-6 py-3 rounded-full text-sm font-semibold border border-white text-white hover:bg-white/10 transition">
                      My Leagues
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="mt-6 flex gap-4 flex-wrap">
                  <Link to="/login">
                    <button className="px-6 py-3 rounded-full text-sm font-semibold border bg-yellow-400 text-[#273470] hover:bg-yellow-400 transition cursor-pointer">
                      Log in
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="px-6 py-3 rounded-full text-sm font-semibold border border-white text-white hover:bg-white/10 transition cursor-pointer">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
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

      {/* ================= COUNTDOWN MODAL ================= */}


    </main>
  );
}
