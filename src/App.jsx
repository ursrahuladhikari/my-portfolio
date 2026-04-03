import React, { useEffect, useState, useRef } from "react";
import {
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  MapPin,
  FileText,
  X,
  Menu,
  Database,
  PieChart,
  BrainCircuit,
  Terminal,
  MessageCircle,
  ChevronRight
} from "lucide-react";

const TYPEWRITER_PHRASES = [
  "Elevating Decisions via Data.",
  "Building scalable data pipelines.",
  "BI Analyst / Data Analyst."
];

const App = () => {
  const [dark, setDark] = useState(false);
  const [projectModal, setProjectModal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const skillsRef = useRef(null);

  // Typewriter effect state
  const [typewriterText, setTypewriterText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let ticker = setTimeout(() => {
      const i = loopNum % TYPEWRITER_PHRASES.length;
      const fullText = TYPEWRITER_PHRASES[i];

      if (isDeleting) {
        setTypewriterText(fullText.substring(0, typewriterText.length - 1));
        setTypingSpeed(30);
      } else {
        setTypewriterText(fullText.substring(0, typewriterText.length + 1));
        setTypingSpeed(80);
      }

      if (!isDeleting && typewriterText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(90);
      }
    }, typingSpeed);
    return () => clearTimeout(ticker);
  }, [typewriterText, isDeleting, loopNum, typingSpeed]);

  // Theme logic
  useEffect(() => {
    const saved = localStorage.getItem("theme-dark");
    if (saved) setDark(JSON.parse(saved));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme-dark", JSON.stringify(dark));
  }, [dark]);

  // Scroll visibility for skills
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setSkillsVisible(entry.isIntersecting));
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sticky header logic
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id) => {
    setDrawerOpen(false);
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrint = () => {
    const el = document.getElementById('resume');
    if (!el) return;
    const newWin = window.open('', '_blank');
    newWin.document.write(`
      <html>
        <head>
          <title>Resume - Rahul Adhikari</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="p-10 text-gray-900">
          ${el.innerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    setTimeout(() => { newWin.print(); }, 500);
  };

  const projects = [
    {
      title: 'Netflix Recommendation System',
      desc: 'Machine learning based recommendation engine using collaborative filtering and content-based approaches.',
      tech: ['Python', 'Pandas', 'Scikit-Learn'],
      github: 'https://github.com/ursrahuladhikari/netflix-recommendation'
    },
    {
      title: 'Financial KPI Dashboard',
      desc: 'Automated financial reporting tool built with Excel VBA and integrated into Power BI for real-time tracking.',
      tech: ['Excel VBA', 'Power BI', 'DAX'],
      github: 'https://github.com/ursrahuladhikari/financial-dashboard'
    },
    {
      title: 'Esports Performance Analysis',
      desc: 'In-depth analysis of PMGC 2023 tournament data using Power BI to visualize team and player metrics.',
      tech: ['Power BI', 'SQL', 'Data Cleaning'],
      github: 'https://github.com/ursrahuladhikari/esports-analysis'
    },
    {
      title: 'RAG-Powered Agentic AI Assistant',
      desc: 'Built an end-to-end Retrieval-Augmented Generation (RAG) pipeline using LangChain, FAISS vector store, and OpenAI GPT. Integrated an Agentic AI layer with tool-calling capabilities to enable autonomous multi-step reasoning for business data Q&A.',
      tech: ['LangChain', 'RAG', 'OpenAI', 'FAISS', 'Python', 'Agentic AI'],
      github: 'https://github.com/ursrahuladhikari'
    }
  ];

  const tools = [
    { name: 'Power BI', role: 'Dashboard development, DAX, Power Query', exp: '3+ yrs', level: 95, icon: <PieChart className="w-5 h-5" /> },
    { name: 'SQL', role: 'Complex queries, Joins, BigQuery, Oracle', exp: '3 yrs', level: 90, icon: <Database className="w-5 h-5" /> },
    { name: 'Python', role: 'ETL, Pandas, NumPy, API integration', exp: '3 yrs', level: 88, icon: <Terminal className="w-5 h-5" /> },
    { name: 'Excel & VBA', role: 'Macros, Pivot tables, Automation', exp: '4 yrs', level: 97, icon: <FileText className="w-5 h-5" /> },
    { name: 'Machine Learning', role: 'TensorFlow, OpenCV, Scikit-learn', exp: '2+ yrs', level: 70, icon: <BrainCircuit className="w-5 h-5" /> }
  ];

  return (
    <div className={`min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 ${dark ? 'bg-[#0f172a] code-bg-dark' : 'bg-[#fafafa]'}`}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        <aside className={`absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black tracking-tighter text-gradient">RA.TECH</span>
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full text-hot-pink">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-4 font-mono text-sm">
              {['Home', 'Projects', 'Resume', 'Tools', 'More', 'Contact'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToId(item === 'Home' ? '' : item.toLowerCase())}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-[#ff1493] transition-colors font-medium"
                >
                  <span className="text-[#db2777]">/</span> {item.toLowerCase()}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-40 px-6 py-4 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 border-b border-black/8 dark:border-white/10 shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToId('')}>
            <span className="text-2xl font-black tracking-tighter text-gradient group-hover:scale-105 transition-transform">
              RA.TECH
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-6">
            <ul className="hidden md:flex items-center gap-8 font-mono text-sm">
              {['Home', 'Projects', 'Resume', 'Tools', 'More'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => scrollToId(item === 'Home' ? '' : item.toLowerCase())}
                    className="font-medium text-slate-800 hover:text-[#ff1493] dark:text-slate-300 dark:hover:text-[#ff1493] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

            <button onClick={() => setDark(!dark)} className="p-2.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:text-[#ff1493] dark:hover:text-[#ff1493]">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#ff1493]">
              <Menu size={18} />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff1493]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center w-full mb-16 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-900/20 text-[#ff1493] mono text-xs font-bold shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </span>
              "status": "Available for Projects"
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up delay-100">
              <div className="inline-block px-3 py-1 mb-6 rounded-md bg-pink-900/20 border border-pink-500/30 text-[#ff1493] mono text-sm shadow-[0_0_10px_rgba(255,20,147,0.15)] backdrop-blur-sm">
                $ whoami
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
                Rahul <br /><span className="text-gradient">Adhikari</span>
              </h1>
              <div className="mono text-lg md:text-2xl text-slate-700 dark:text-slate-400 mb-8 h-8 px-1">
                <span>{typewriterText}</span>
                <span className="terminal-cursor"></span>
              </div>
              <p className="text-slate-800 dark:text-slate-400 text-lg max-w-lg mb-10 leading-relaxed fade-up delay-100">
                Data Analyst & Power BI Specialist. I turn complex datasets into intuitive dashboards and clean pipelines to fuel business growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 fade-up delay-200">
                <button onClick={() => scrollToId('projects')} className="px-8 py-4 bg-pink-gradient rounded-lg text-white font-bold pink-glow hover:scale-105 transition-transform text-center shadow-lg">
                  Explore My Work
                </button>
                <button onClick={() => scrollToId('resume')} className="px-8 py-4 glass-card rounded-lg font-bold hover:text-[#ff1493] transition-colors text-center">
                  View Resume
                </button>
              </div>
            </div>

            {/* Decorative Terminal Element */}
            <div className="hidden lg:block relative justify-self-end w-max">

              {/* Floating Query Panel (Behind) */}
              <div className="absolute -bottom-6 -left-4 glass-card bg-[#0f172a] border border-[#ff1493]/30 px-6 py-3 rounded-xl -rotate-6 shadow-2xl z-0">
                <span className="mono font-bold text-[#ff1493] text-[15px]">SELECT * FROM excellence;</span>
              </div>

              {/* Main Terminal Box (Front) */}
              <div className="relative glass-card bg-slate-900/95 backdrop-blur-xl border border-[#ff1493]/40 rounded-xl p-6 md:p-8 shadow-[0_0_40px_rgba(255,20,147,0.15)] z-10 hover:border-[#ff1493]/60 transition-colors animate-float">
                <div className="flex space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mono text-[#4ade80] text-sm leading-relaxed tracking-wide whitespace-nowrap">
                  <p className="text-slate-300">{`{`}</p>
                  <div className="pl-6">
                    <p><span className="text-slate-300">"name"</span>: "Rahul Adhikari",</p>
                    <p><span className="text-slate-300">"role"</span>: "Data Analyst",</p>
                    <p><span className="text-slate-300">"stack"</span>: ["Power BI", "SQL", "Python", "Gen AI", "AI/ML"],</p>
                    <p><span className="text-slate-300">"automation"</span>: ["Excel (VBA)", "ETL", "Data Transformation"],</p>
                    <p><span className="text-slate-300">"mission"</span>: "Scaling data excellence",</p>
                    <p><span className="text-slate-300">"uptime_target"</span>: "99.9%"</p>
                  </div>
                  <p className="text-slate-300">{`}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="w-full border-y border-[#ff1493]/20 bg-[#ff1493]/5 overflow-hidden flex py-4 whitespace-nowrap">
        <div className="flex animate-marquee min-w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {['POWER BI', 'DAX', 'DATA MODELLING', 'ETL', 'SQL', 'BIGQUERY', 'PYTHON', 'TABLEAU', 'MACHINE LEARNING', 'EXCEL VBA', 'PANDAS', 'TENSORFLOW', 'STAR SCHEMA', 'TROUBLESHOOTING'].map((skill, j) => (
                <React.Fragment key={`${i}-${j}`}>
                  <span className="mx-6 text-sm font-bold text-slate-500 dark:text-slate-400 mono tracking-widest">{skill}</span>
                  <span className="text-[#ff1493] opacity-50">•</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative">
        {/* Light-mode tinted background panel */}
        <div className="absolute inset-0 bg-white/40 dark:bg-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="mono text-[#ff1493] text-sm mb-2">// Featured Projects</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-slate-100">What I've Built</h2>
            </div>
            <a href="https://github.com/ursrahuladhikari" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#ff1493] font-bold hover:underline transition-all">
              Browse Github <ChevronRight size={18} />
            </a>
          </div>

          {/* Horizontal scroll container */}
          <div className="overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#06b6d4 transparent' }}>
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {projects.map((project, i) => (
                <div key={i} className="group glass-card rounded-2xl overflow-hidden transition-all hover:pink-glow flex-shrink-0 shadow-md dark:shadow-none" style={{ width: '340px' }}>
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 group-hover:text-[#06b6d4] transition-colors">{project.title}</h3>
                    <p className="text-slate-800 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{project.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[10px] font-bold text-cyan-700 dark:text-[#06b6d4] border border-cyan-300 dark:border-cyan-700/50 transition-all duration-300 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_15px_#06b6d4] hover:scale-110 cursor-default">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setProjectModal(project)}
                        className="px-5 py-2.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:scale-105 transition-transform shadow-md hover:bg-cyan-500"
                      >
                        Details
                      </button>
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#06b6d4] hover:border-[#06b6d4] transition-colors">
                        <Github size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {projectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setProjectModal(null)} />
          <div className="relative glass-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl scale-in overflow-hidden border-[#ff1493]/30">
            <button onClick={() => setProjectModal(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#ff1493] transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-bold mb-4 pr-10">{projectModal.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{projectModal.desc}</p>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mono">Project Highlights</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow" /> Advanced data processing with {projectModal.tech[0]}</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow" /> Interactive visualizations and reporting</li>
              </ul>
            </div>
            <div className="mt-10 flex gap-4">
              <a href={projectModal.github} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-pink-gradient text-white rounded-lg font-bold text-center hover:opacity-90 transition-opacity">View Source</a>
            </div>
          </div>
        </div>
      )}

      {/* Resume Section */}
      <section id="resume" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div>
              <div className="mono text-[#ff1493] text-sm mb-2">// Experience</div>
              <h2 className="text-4xl md:text-5xl font-black mb-2">Career Journey</h2>
            </div>
            <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-pink-gradient text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-all">
              <FileText size={18} /> Download CV
            </button>
          </div>

          <div className="space-y-12">
            {[
              {
                title: 'Data Analyst – Admin Executive',
                company: 'Market Maven Research',
                period: 'Apr 2025 – Present',
                points: [
                  'Directed CRM operations for 100+ sales team members, improving efficiency and lead assignment accuracy.',
                  'Developed centralized Master Sheets to track clients, payments, complaints, and service upgrades.',
                  'Designed monthly performance dashboards and sales presentations for stakeholder decision-making.'
                ]
              },
              {
                title: 'Market Research & Data Analyst',
                company: 'TRIO Clothing’s',
                period: 'Aug 2024 – Feb 2025',
                points: [
                  'Conducted research on fashion trends across India and Nepal for product development strategy.',
                  'Recommended cost-effective raw material sourcing locations, optimizing procurement costs.',
                  'Analyzed competitors and seasonal trends to guide startup’s market positioning.'
                ]
              },
              {
                title: 'Power BI Developer & Data Analyst',
                company: 'Freelance Solutions',
                period: 'Apr 2022 – Aug 2024',
                points: [
                  'Engineered scalable data models and automated workflows using Power BI, SQL, and Python.',
                  'Created interactive dashboards for executives using Power BI, Tableau, and Google Data Studio.',
                  'Integrated multi-source data (BigQuery, IBM Cloud, APIs) reducing errors by 95%.'
                ]
              }
            ].map((job, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                <div className="md:grid md:grid-cols-5 md:gap-8 items-start relative">
                  <div className="hidden md:block col-span-1 text-right pt-1">
                    <span className="text-sm font-bold text-[#ff1493] mono">{job.period}</span>
                  </div>
                  <div className="col-span-4 relative pl-8 md:border-l border-slate-400 dark:border-slate-700">
                    {/* Mobile continuous line */}
                    <div className="absolute left-0 top-0 bottom-[-3rem] w-px bg-slate-400 dark:bg-slate-700 md:hidden" />

                    <div className="absolute left-[-5px] md:left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[#06b6d4] ring-4 ring-cyan-100 dark:ring-slate-900 z-10" />

                    <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between md:hidden">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <span className="text-sm font-bold text-[#ff1493] mono">{job.period}</span>
                    </div>
                    <h3 className="hidden md:block text-2xl font-bold mb-1">{job.title}</h3>

                    <p className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-bold text-slate-500 mb-4 mono">{job.company}</p>
                    <ul className="space-y-3">
                      {job.points.map((p, i) => (
                        <li key={i} className="text-slate-800 dark:text-slate-400 text-sm leading-relaxed flex gap-3">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#ff1493] pink-glow shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Skills */}
      <section id="tools" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="mono text-[#ff1493] text-sm mb-2">// Core Toolbox</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Tech Stack</h2>
        </div>

        <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {tools.map((tool, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg glass-card text-[#ff1493] group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{tool.name}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-500 mono mt-1">{tool.role}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#ff1493]">{tool.exp}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-gradient transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_#ff1493]"
                  style={{ width: skillsVisible ? `${tool.level}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & Achievements */}
      <section id="certifications" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="mono text-[#ff1493] text-sm mb-2">// Continuous Learning</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Certifications & Achievements</h2>
          <p className="text-slate-800 dark:text-slate-400 text-lg leading-relaxed px-4 md:px-12 text-justify md:text-center">
            I believe in lifelong learning — because the mind, like any muscle, evolves and strengthens with consistent effort. Through continuous exploration of data, tools, and emerging technologies, curiosity transforms into meaningful insights, driving growth, innovation, and real-world impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Oracle Cloud Infrastructure Certified Data Science Professional',
              issuer: 'Oracle Learning',
              period: 'Nov 2025 – Nov 2027',
              skills: ['OCI', 'Machine Learning', 'Model Deployment', 'AutoML'],
              link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6DEDAD566435634C9732610078A0BA14BB779CE71FB3B31FF44B09C321E4B35C'
            },
            {
              title: 'Oracle Data Platform Certified Foundations Associate',
              issuer: 'Oracle Learning',
              period: 'Oct 2025 - Oct 2027',
              skills: ['Cloud Data', 'Data Warehousing', 'Oracle Analytics'],
              link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6DEDAD566435634C9732610078A0BA14F19D2E89DFF1FBB03C6F31B765090CC7'
            },
            {
              title: 'Microsoft Power BI Data Analyst Professional Certificate',
              issuer: 'Coursera, Microsoft',
              period: 'Mar 2024 – Oct 2024',
              skills: ['Power BI', 'DAX', 'Data Modeling', 'Power Query'],
              link: 'https://www.coursera.org/account/accomplishments/professional-cert/MPN6DUW07SPF'
            },
            {
              title: 'Google Data Analytics Professional Certificate',
              issuer: 'Google (2023)',
              period: 'Sep 2022 – Sep 2023',
              skills: ['SQL', 'Tableau', 'R Programming', 'Data Cleaning'],
              link: 'https://www.credly.com/badges/12d217ef-371f-4aa7-ab5f-b1453dbf0e45/linked_in_profile'
            },
            {
              title: 'Generative AI for Business Intelligence (BI) Analysts',
              issuer: 'SkillUp EdTech (2025)',
              period: 'Jan 2025 – Mar 2025',
              skills: ['GenAI', 'Prompt Engineering', 'BI Strategy'],
              link: 'https://www.coursera.org/account/accomplishments/specialization/certificate/5UWTG1BH5HBB'
            },
            {
              title: 'Generative AI for Data Scientists',
              issuer: 'IBM, Coursera (2025)',
              period: 'Sep 2024 – Dec 2024',
              skills: ['LLMs', 'LangChain', 'AI Development'],
              link: 'https://www.coursera.org/account/accomplishments/verify/2ZHC0E3DT17M'
            },
            {
              title: 'Introduction to MongoDB',
              issuer: 'MongoDB, Inc (2025)',
              period: 'Mar 2025 – Apr 2025',
              skills: ['NoSQL', 'Document Databases', 'Aggregation'],
              link: 'https://www.coursera.org/account/accomplishments/verify/64OBEYY4E1BO'
            },
            {
              title: 'IBM Applied Data Science Certificate',
              issuer: 'IBM (2023)',
              period: 'Aug 2022 – Jan 2023',
              skills: ['Python', 'Data Analysis', 'Scikit-Learn'],
              link: 'https://www.coursera.org/account/accomplishments/verify/KUG9KCFWU5CR'
            },
            {
              title: 'Relational Database & Design Certification',
              issuer: 'University of Colorado Boulder (2024)',
              period: 'Oct 2024 – Dec 2024',
              skills: ['SQL', 'Database Normalization', 'ER Modeling'],
              link: '#'
            },
            {
              title: 'Python for Everybody Specialization with Honours',
              issuer: 'University of Michigan (2022)',
              period: 'July 2022 – Mar 2023',
              skills: ['Python', 'Data Structures', 'Web Scraping'],
              link: 'https://www.coursera.org/account/accomplishments/verify/CXEVVGTE2ERM'
            }
          ].map((cert, idx) => (
            <div key={idx} className="group glass-card rounded-2xl p-6 hover:border-[#ff1493]/50 transition-colors shadow-sm hover:shadow-[0_0_20px_rgba(255,20,147,0.15)] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff1493] opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-lg font-bold mb-3 group-hover:text-[#ff1493] transition-colors pr-4">{cert.title}</h3>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {cert.skills?.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200/50 bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 group-hover:border-[#ff1493]/30 group-hover:bg-[#ff1493]/5 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mono">{cert.issuer}</p>
                <div className="flex items-center gap-2">
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-white bg-pink-gradient px-3 py-1.5 rounded-full hover:scale-105 transition-transform shadow-sm whitespace-nowrap">
                      Verify ↗
                    </a>
                  )}
                  <span className="text-xs font-bold text-[#ff1493] bg-pink-500/10 px-3 py-1.5 rounded-full whitespace-nowrap border border-pink-500/20 shadow-sm">
                    {cert.period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#1e2530]/60 backdrop-blur-xl border border-slate-700/50 p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/40 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 tracking-tight">Ready to Scale?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10 text-lg">Available for freelance opportunities and full-time data positions. Let's solve some data challenges together.</p>

          <div className="flex items-center justify-center gap-2 text-slate-400 mb-10 relative z-10 font-medium">
            <MapPin size={18} className="text-[#06b6d4]" />
            <span>Bengaluru, India</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=irahuladhikari@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all shadow-lg text-sm border border-slate-600">
              <Mail size={18} /> Email
            </a>
            <a href="https://wa.me/917737006542" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all shadow-lg text-sm border border-[#25D366]/50">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/in/irahuladhikari" target="_blank" rel="noreferrer" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm transition-colors border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/ursrahuladhikari" target="_blank" rel="noreferrer" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm transition-colors border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="text-lg font-black text-gradient">RA.TECH</div>
            <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} Rahul Adhikari</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tracking-wider">
            <span>BUILT WITH CODE &</span>
            <div className="w-2 h-2 rounded-full bg-[#ff1493] pink-glow animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
