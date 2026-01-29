const matchesData = [
  {
    id: 1,
    teams: "India vs Australia",
    type: "ODI",
    time: "Today • 7:30 PM IST",
    image:
      "https://www.livemint.com/lm-img/img/2023/11/17/600x338/CRICKET-WORLDCUP-IND-AUS--7_1700212074819_1700212112730.JPG",
  },
  {
    id: 2,
    teams: "England vs Pakistan",
    type: "T20",
    time: "Tomorrow • 6:00 PM IST",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/images/media_bank/202308/pakistan-vs-england-055807-16x9.jpg?VersionId=JPLuTP7uxwMluqjUhK.ROKPO4aEwZE48?size=1200:675",
  },
  {
    id: 3,
    teams: "South Africa vs New Zealand",
    type: "Test",
    time: "Mar 25 • 3:30 PM IST",
    image:
      "https://www.aljazeera.com/wp-content/uploads/2025/03/2025-03-05T165927Z_28088571_UP1EL351B712V_RTRMADP_3_CRICKET-CHAMPIONSTROPHY-ZAF-NZL-1741194269.jpg?resize=1920%2C1440",
  },
  {
    id: 4,
    teams: "India vs England",
    type: "T20",
    time: "Mar 28 • 8:00 PM IST",
    image:
      "https://www.livemint.com/lm-img/img/2025/02/02/600x338/CRICKET-IND-ENG-T20-109_1738482984303_1738482993221.jpg",
  },
];

export default function Matches() {
  return (
    <main className="px-4 py-10 space-y-10 bg-main">
      {/* ================= HEADER ================= */}
      <section className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl font-bold text-primary">
          Matches
        </h1>
        <p className="text-sm text-secondary mt-1">
          Choose a match and join matchplay contests
        </p>
      </section>

      {/* ================= MATCH GRID ================= */}
      <section className="max-w-[1440px] mx-auto grid gap-6 sm:grid-cols-4">
        {matchesData.map((match) => (
          <div
            key={match.id}
            className="relative rounded-2xl overflow-hidden app-card
                       min-h-[260px] sm:min-h-[300px]
                       hover:-translate-y-1 transition"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url(${match.image})`,
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-end gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {match.teams}
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {match.type} • {match.time}
                </p>
              </div>

              {/* CTA */}
              <button className="self-start btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                View Contests
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
