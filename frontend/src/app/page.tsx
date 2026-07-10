import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/providers/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

   <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-lg font-bold shadow-lg">IP
            </div>
            <div>
              <h2 className="text-xl font-bold">InizerP ERP</h2>
              <p className="text-xs text-muted-foreground">School Management</p>
            </div>

          </Link>

          {/* Menu */}

          <nav className="hidden lg:flex items-center gap-10">
          { ["Home", "Features", "About", "Pricing", "Contact", ].map((item)=> (
              <Link key={item}
                href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                className="font-medium hover:text-primary transition-colors">
                {item}
              </Link>
            ))}

          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden md:flex px-5 py-2 rounded-xl border border-border hover:bg-muted transition">Login</Link>

            <Link href="/register"
              className="rounded-xl bg-primary text-primary-foreground px-6 py-2.5 font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all" > Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="relative pt-32 pb-10 ">
        <div className="max-w-7xl mx-auto px-9 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-5 py-2 text-sm font-medium">
              🚀 Modern School ERP Platform
            </span>
           <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight"> Smart School <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Management </span > </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-8 max-w-xl">
              Manage students, teachers, attendance, examinations,finance, transport, library, hostel and reports from one beautiful cloud-based dashboard.</p>
            <div className="mt-10 flex flex-wrap gap-5">
             <Link href="/register"className="rounded-xl bg-primary px-8 py-4 text-primary-foreground font-semibold shadow-lg hover:scale-105 transition"> Start Free </Link >
            <Link href="/login"className="rounded-xl border border-border bg-background px-8 py-4 hover:bg-muted transition"> Login </Link >
            </div>
            <div className="grid grid-cols-3 gap-6 mt-14">
              {[
                ["1200+", "Students"],
                ["85+", "Teachers"],
                ["25+", "Schools"],
              ].map(([value, title]) => (
                <div key={title}>
                  <h2 className="text-3xl font-bold text-primary">
                    {value}
                  </h2>
                  <p className="text-muted-foreground">{title}</p>
                </div>
              ))}

            </div>

          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
            <Image src="/images/dashboard.png"alt="ERP Dashboard"width= { 1400 }height= { 900 }
             priority className="w-full object-cover hover:scale-105 transition duration-700"/ >
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: "1250+",
                title: "Students",
                desc: "Active Students",
              },
              {
                value: "85+",
                title: "Teachers",
                desc: "Qualified Teachers",
              },
              {
                value: "98%",
                title: "Attendance",
                desc: "Daily Attendance",
              },
              {
                value: "25+",
                title: "Schools",
                desc: "Using ERP",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-card p-8 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-5xl font-black text-primary">{item.value}</h2>
                <h3 className="mt-4 text-xl font-semibold"> { item.title }
               </h3 > <p className="mt-2 text-muted-foreground"> { item.desc }</p >
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= FEATURES ================= */}

      <section id="features" className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
           <span className="text-primary font-semibold uppercase tracking-widest"> FEATURES </span >
        <h2 className="mt-4 text-5xl font-bold"> Everything Your School Needs </h2 >
           <p className="mt-6 text-lg text-muted-foreground"> Powerful modules to automate every part of your institution. </p >
          </div>
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        { [ { icon: "🎓", title:"Student Management", desc:"Admissions, profiles, documents and student records." },
        { icon: "👨‍🏫", title:"Teacher Management", desc:"Manage teachers, schedules and payroll." },
        { icon: "📅", title: "Attendance", desc: "Daily attendance with reports." },
        { icon: "📝", title: "Online Exams", desc: "Exam scheduling and online results." },
        { icon: "📚", title:"Library", desc:"Books, issue records and returns." },
        { icon: "🚌", title:"Transport", desc:"Vehicle routes and tracking." },
        { icon: "🏠", title:"Hostel", desc:"Room allocation and management." },
        { icon: "📊", title:"Reports", desc:"Powerful analytics dashboard." }, ].map((feature) => (
              <div key={feature.title}
                className="group rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-3 hover:border-primary hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl shadow-lg group-hover:rotate-6 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="mt-8 text-2xl font-bold">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE ================= */}

    <section id="about"className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-semibold uppercase tracking-widest">
              WHY US
            </span>
            <h2 className="mt-4 text-5xl font-bold">Built For Modern Schools</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-8">
              InizerP ERP helps schools automate administration,
              improve communication and increase productivity.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "✔ Cloud Based Platform",
                "✔ Light & Dark Mode",
                "✔ Mobile Friendly",
                "✔ Fast Performance",
                "✔ Secure Database",
                "✔ Real-time Reports",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-3xl border border-border bg-card p-10 shadow-xl">
              <Image
                src="/images/dashboard.png"
                alt="Dashboard"
                width={1200}
                height={800}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    
      {/* ================= CTA ================= */}

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-[32px] bg-gradient-to-r from-primary via-secondary to-accent p-14 lg:p-20 text-center text-white shadow-2xl">
          <h2 className="text-4xl lg:text-5xl font-bold"> Ready to Modernize Your School? </h2 >
           <p className="mt-6 text-lg opacity-90 max-w-2xl mx-auto"> Join hundreds of schools using InizerP ERP to simplify administration and improve learning experiences. </p >
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-white px-8 py-4 font-semibold text-slate-900 hover:scale-105 transition">Get Started
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/40 px-8 py-4 font-semibold hover:bg-white/10 transition"
              >
                Login
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ================= TESTIMONIALS ================= */}

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
           <span className="text-primary font-semibold uppercase tracking-widest"> Testimonials </span >
           <h2 className="mt-4 text-5xl font-bold"> Trusted By Schools </h2 >
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                school: "ABC International School",
                review:
                  "InizerP ERP has transformed our administration process.",
              },
              {
                name: "Sarah Khan",
                school: "Future Academy",
                review:
                  "Attendance and fee management are now incredibly easy.",
              },
              {
                name: "David Wilson",
                school: "Smart School",
                review:
                  "Excellent dashboard with all modules in one place.",
              },
            ].map((item) => (
                <div key= { item.name }
                className="rounded-3xl border border-border bg-card p-8 hover:shadow-2xl transition">
               <div className="text-4xl"> ⭐⭐⭐⭐⭐ </div >
                <p className="mt-6 leading-8 text-muted-foreground"> " {item.review}"</p >
                <h3 className="mt-8 font-bold text-lg"> {item.name}</h3 >
                <p className="text-primary"> {item.school} </p >
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
           <h2 className="text-5xl font-bold"> Frequently Asked Questions </h2 >
          </div>
          <div className="mt-16 space-y-6">
            {[
              {
                q: "Is there a free trial?",
                a: "Yes. You can explore all modules before subscribing.",
              },
              {
                q: "Can I use dark mode?",
                a: "Yes. InizerP ERP supports Light and Dark themes.",
              },
              {
                q: "Is the system cloud based?",
                a: "Yes. Access your ERP anywhere with internet.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h3 className="text-xl font-semibold">
                  {item.q}
                </h3>
                <p className="mt-4 text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section id="contact"className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl font-bold"> Contact Us </h2 >
            <p className="mt-6 text-lg text-muted-foreground"> We'd love to help your institution succeed.</p >
            <div className="mt-10 space-y-6">
              <div className="rounded-2xl border bg-card p-6"> 📧 support@inizerp.com </div >
              <div className="rounded-2xl border bg-card p-6"> 📞 + 91 98765 43210 </div >
              <div className="rounded-2xl border bg-card p-6"> 📍 Noida, Uttar Pradesh</div >
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-10">
            <input
              placeholder="Your Name"
              className="w-full rounded-xl border border-border bg-background p-4 outline-none"
            />
            <input
              placeholder="Email"
              className="mt-5 w-full rounded-xl border border-border bg-background p-4 outline-none"
            />
            <textarea
              rows={5}
              placeholder="Message"
              className="mt-5 w-full rounded-xl border border-border bg-background p-4 outline-none"
            />
            <button
              className="mt-6 w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
             <h3 className="text-xl font-bold"> InizerP ERP </h3 >
             <p className="mt-4 text-muted-foreground leading-7"> Modern School Management Platform with powerful modules for education. </p >
            </div>
            <div>
              <h4 className="font-semibold">Company </h4>
              <div className="mt-5 space-y-3 text-muted-foreground">
                <Link href="/">Home</Link>
                <br />
                <Link href="#about">About</Link>
                <br />
                <Link href="#features">Features</Link>
              </div>
            </div>
            <div>
            <h4 className="font-semibold"> Support </h4 >
              <div className="mt-5 space-y-3 text-muted-foreground"> FAQ <br / > Contact <br / > Help Center </div >
            </div>
            <div>
              <h4 className="font-semibold">Newsletter</h4>
              <input
                placeholder="Email Address"
                className="mt-5 w-full rounded-xl border border-border bg-background p-3"
              />
              <button
                className="mt-4 w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold"
              > Subscribe </button>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} InizerP ERP. All Rights Reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/"> Privacy </Link >
              <Link href="/"> Terms </Link >
              <Link href="/"> Cookies </Link >
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}