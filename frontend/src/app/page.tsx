"use client";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-6 animate-bounce">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm">
              🚀
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
            SETU
          </h1>

          <p className="text-xl text-white/70 font-light">
            Bridging Students to the Right Opportunities
          </p>
        </header>

        {/* Divider */}
        <div className="flex justify-center mb-12">
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Scholarships",
              desc: "Find and apply for scholarships tailored to your background and academic achievements."
            },
            {
              title: "Internships",
              desc: "Discover internship opportunities with government departments and partner organizations."
            },
            {
              title: "Career Guidance",
              desc: "Get personalized career advice and mentorship from experienced professionals."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all"
            >
              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-white/60 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["50K+", "Students Registered"],
              ["200+", "Scholarships Available"],
              ["150+", "Partner Organizations"],
              ["28", "States Covered"]
            ].map(([value, label], i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {value}
                </div>
                <div className="text-white/50 text-sm font-light">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <button
            onClick={() => alert("Next step: Language Selection")}
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition"
          >
            Get Started →
          </button>

          <p className="text-white/40 text-sm mt-4 font-light">
            Free registration • No hidden charges
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-white/40 text-sm font-light mb-4">
            A Government Initiative for Student Welfare
          </p>

          <div className="flex justify-center gap-6 text-white/30 text-xs">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Contact Us</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
