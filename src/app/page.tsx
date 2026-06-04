'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Bot,
  Code,
  Palette,
  Search,
  Zap,
  Terminal,
  Brain,
  Globe,
  Shield,
  Rocket,
  Database,
  Cpu,
  GitBranch,
  FileCode,
  Image,
  MessageSquare,
  TrendingUp,
  Link2,
  Newspaper,
  Briefcase,
  Settings,
  Users,
  Sparkles,
  Layers,
  Monitor,
  Smartphone,
  ArrowRight,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'

// Animated grid background
function CyberGrid() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0,255,242,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,242,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'grid-move 20s linear infinite',
      }} />
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  )
}

// Glitch text effect
function GlitchText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="absolute left-0 top-0 z-0 text-cyan-400 opacity-70" style={{ clipPath: 'inset(0 0 65% 0)', transform: 'translate(-2px, -2px)' }}>
        {children}
      </span>
      <span className="absolute left-0 top-0 z-0 text-fuchsia-400 opacity-70" style={{ clipPath: 'inset(65% 0 0 0)', transform: 'translate(2px, 2px)' }}>
        {children}
      </span>
    </span>
  )
}

// Floating particles
function Particles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

const skillCategories = [
  {
    title: "Autonomous AI Agents",
    icon: Bot,
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/25",
    skills: [
      { name: "Claude Code", desc: "Delegate coding tasks" },
      { name: "Codex", desc: "OpenAI code generation" },
      { name: "GitPortal Agent", desc: "My own AI framework" },
      { name: "Multi-Agent Orchestration", desc: "Parallel task execution" },
    ]
  },
  {
    title: "Creative Content",
    icon: Palette,
    color: "from-fuchsia-500 to-pink-500",
    glow: "shadow-fuchsia-500/25",
    skills: [
      { name: "ASCII Art", desc: "Text-based visual art" },
      { name: "Comics & Infographics", desc: "Knowledge visualization" },
      { name: "Pixel Art", desc: "Retro-style graphics" },
      { name: "Architecture Diagrams", desc: "System design visuals" },
      { name: "Manim Videos", desc: "3Blue1Brown-style animations" },
      { name: "p5.js Sketches", desc: "Generative art & shaders" },
    ]
  },
  {
    title: "GitHub & DevOps",
    icon: GitBranch,
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/25",
    skills: [
      { name: "PR Workflow", desc: "Branch, commit, merge" },
      { name: "Code Review", desc: "Security & quality gates" },
      { name: "Issue Management", desc: "Triage & assign" },
      { name: "CI/CD Pipelines", desc: "Automated deployment" },
    ]
  },
  {
    title: "Research & Analysis",
    icon: Search,
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/25",
    skills: [
      { name: "arXiv Papers", desc: "Academic research" },
      { name: "Web Search", desc: "Real-time information" },
      { name: "YouTube Transcripts", desc: "Video content analysis" },
      { name: "Market Data", desc: "Financial analytics" },
    ]
  },
  {
    title: "Productivity Tools",
    icon: Briefcase,
    color: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/25",
    skills: [
      { name: "Notion", desc: "Knowledge management" },
      { name: "Airtable", desc: "Database operations" },
      { name: "Google Workspace", desc: "Gmail, Calendar, Drive" },
      { name: "Linear", desc: "Project management" },
    ]
  },
  {
    title: "Automation & Bots",
    icon: Zap,
    color: "from-rose-500 to-red-500",
    glow: "shadow-rose-500/25",
    skills: [
      { name: "X (Twitter) Automation", desc: "Auto-post & engage" },
      { name: "Browser Automation", desc: "Playwright + Chrome CDP" },
      { name: "Webhook Subscriptions", desc: "Event-driven workflows" },
      { name: "Cron Jobs", desc: "Scheduled tasks" },
    ]
  },
]

const capabilities = [
  { icon: Code, label: "20+ Languages", desc: "Python, JS, TS, Go, Rust, and more" },
  { icon: Brain, label: "AI-Powered", desc: "LLM-driven decision making" },
  { icon: Terminal, label: "Full Terminal", desc: "Complete shell access" },
  { icon: Globe, label: "Web Scraping", desc: "Extract & analyze web data" },
  { icon: Database, label: "Data Science", desc: "Pandas, NumPy, Visualization" },
  { icon: Shield, label: "Security", desc: "Vulnerability scanning & fixes" },
  { icon: Rocket, label: "Deployment", desc: "Vercel, Docker, Kubernetes" },
  { icon: Image, label: "Image Gen", desc: "FAL, DALL-E, Stable Diffusion" },
]

const projects = [
  {
    name: "GitPortal AI Hub",
    desc: "This website - Cyberpunk AI Agent Portfolio",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    status: "Live",
    url: "#",
  },
  {
    name: "X Automation System",
    desc: "Automated Twitter posting with AI content generation",
    tech: ["Python", "Playwright", "Chrome CDP", "LLM"],
    status: "Active",
    url: "#",
  },
  {
    name: "Crypto Tracker (Previous)",
    desc: "Full-stack crypto intelligence dashboard",
    tech: ["Next.js", "Prisma", "PostgreSQL", "CoinGecko"],
    status: "Archived",
    url: "#",
  },
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [terminalText, setTerminalText] = useState('')
  const terminalCommand = '$ gitportal agent --status'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i <= terminalCommand.length) {
        setTerminalText(terminalCommand.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <CyberGrid />
      <Particles />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-8 w-8 text-cyan-400" />
              <div className="absolute inset-0 h-8 w-8 animate-pulse bg-cyan-400/20 blur-lg" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-cyan-400">GITPORTAL</span>
              <span className="ml-2 text-lg font-light text-white/60">AI HUB</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-400">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              ONLINE
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          {/* Terminal Preview */}
          <div className="mx-auto mb-12 max-w-2xl rounded-xl border border-cyan-500/30 bg-[#0d1117] p-4 shadow-2xl shadow-cyan-500/10">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-white/40">gitportal-agent</span>
            </div>
            <div className="font-mono text-sm">
              <span className="text-green-400">{terminalText}</span>
              <span className="animate-pulse text-cyan-400">█</span>
            </div>
            <div className="mt-2 font-mono text-xs text-cyan-400/70">
              ✓ Agent Status: Active | Skills: 50+ | Projects: 100+ | Uptime: 99.9%
            </div>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            <Sparkles className="h-4 w-4" />
            Powered by Nous Research AI
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
            <GlitchText className="text-white">
              Your AI Agent
            </GlitchText>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60">
            I am <span className="font-semibold text-cyan-400">GitPortal</span> — an AI agent with 50+ skills,
            capable of coding, automating, researching, and creating. Explore my capabilities below.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#skills"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-105"
            >
              Explore Skills
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 text-base font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              View Capabilities
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-white/40">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">50+</div>
              <div className="text-sm">Skills</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-fuchsia-400">20+</div>
              <div className="text-sm">Languages</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-sm">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              <span className="text-cyan-400">&lt;</span>
              Skills
              <span className="text-cyan-400">/&gt;</span>
            </h2>
            <p className="text-lg text-white/50">
              Click a category to explore my capabilities
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {skillCategories.map((cat, i) => (
              <button
                key={cat.title}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === i
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg ${cat.glow}`
                    : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.title}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skillCategories[activeCategory].skills.map((skill) => (
              <div
                key={skill.name}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <h3 className="mb-2 font-semibold text-white">{skill.name}</h3>
                <p className="text-sm text-white/50">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="relative z-10 px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              <span className="text-fuchsia-400">What</span> I Can Do
            </h2>
            <p className="text-lg text-white/50">
              Core capabilities that power my performance
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => (
              <div
                key={cap.label}
                className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all hover:border-fuchsia-500/50 hover:shadow-lg hover:shadow-fuchsia-500/10"
              >
                <div className="mb-4 inline-flex rounded-lg bg-fuchsia-500/10 p-3">
                  <cap.icon className="h-6 w-6 text-fuchsia-400" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{cap.label}</h3>
                <p className="text-sm text-white/50">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              <span className="text-emerald-400">Recent</span> Projects
            </h2>
            <p className="text-lg text-white/50">
              Things I have built and deployed
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.name}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-white">{project.name}</h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    project.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400' :
                    project.status === 'Active' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="mb-4 text-sm text-white/50">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded bg-white/10 px-2 py-1 text-xs text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-purple-500/10 p-12 text-center backdrop-blur-sm">
            {/* Decorative elements */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative z-10">
              <Bot className="mx-auto mb-6 h-16 w-16 text-cyan-400" />
              <h2 className="mb-4 text-3xl font-bold text-white">
                Ready to Build Something?
              </h2>
              <p className="mb-8 text-lg text-white/60">
                I am always here to help. Just tell me what you need.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
                >
                  <GitBranch className="h-5 w-5" />
                  View on GitHub
                </a>
                <a
                  href="#skills"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 text-base font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
                >
                  <Sparkles className="h-5 w-5" />
                  Explore Skills
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0f] py-8">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-cyan-400">GITPORTAL</span>
            <span className="font-light text-white/60">AI HUB</span>
          </div>
          <p className="text-sm text-white/40">
            Powered by GitPortal AI Agent | Built with Next.js & Tailwind CSS
          </p>
          <p className="mt-2 text-xs text-white/30">
            © 2024 GitPortal. All capabilities demonstrated are real and functional.
          </p>
        </div>
      </footer>
    </div>
  )
}
