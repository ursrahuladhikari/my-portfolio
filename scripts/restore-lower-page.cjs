const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(__dirname, '..', 'src', 'App.jsx');
let text = fs.readFileSync(file, 'utf8');

const marker = '          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tracking-wider">';
const cookieMarker = '\n\n      {/* Cookie Consent Banner */}';
const start = text.lastIndexOf(marker);
if (start === -1) throw new Error('Could not find misplaced lower footer row');
const end = text.indexOf(cookieMarker, start);
if (end === -1) throw new Error('Could not find cookie banner after certifications');

const replacement = `        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowFullCerts(!showFullCerts)}
            className="group flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#06b6d4] border border-[#06b6d4]/30 hover:border-[#ff1493]/50 hover:text-[#ff1493] transition-all bg-cyan-900/10 hover:bg-pink-900/10 dark:bg-cyan-900/20 dark:hover:bg-pink-900/20 shadow-sm"
          >
            {showFullCerts ? 'Show Less' : 'View Full Certifications'}
            <ArrowRight size={18} className={\`transition-transform duration-300 ${showFullCerts ? '-rotate-90' : 'group-hover:translate-x-1'}\`} />
          </button>
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
            <p className="text-sm font-medium text-slate-500">� {new Date().getFullYear()} Rahul Adhikari</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tracking-wider">
            <span>BUILT WITH CODE &</span>
            <div className="w-2 h-2 rounded-full bg-[#ff1493] pink-glow animate-pulse" />
          </div>
        </div>
      </footer>`;

text = text.slice(0, start) + replacement + text.slice(end);
fs.writeFileSync(file, text);
