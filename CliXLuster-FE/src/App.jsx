'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Server,
  Cpu,
  Globe,
  Mail,
  CheckCircle2,
  Loader2,
  Terminal,
  HardDrive,
  Play,
  Circle,
  CheckCheck,
  AlertCircle,
  Copy,
  Download,
} from 'lucide-react'

import CliXLusterLogo from './Logo'

const specs = [
  { icon: Globe, label: 'Region', value: 'eu-frankfurt-1' },
  { icon: Cpu, label: 'Architecture', value: 'ARM (Ampere A1.Flex)' },
  { icon: Server, label: 'Nodes', value: '1 Master, 2 Workers' },
  { icon: HardDrive, label: 'Per VM', value: '1 OCPU · 6 GB RAM · 50 GB' },
]

const pipelineSteps = [
  {
    id: 'queue',
    label: 'Submitting Job',
    description: 'Queuing task to Celery/Redis',
  },
  {
    id: 'terraform',
    label: 'Terraform',
    description: 'Provisioning OCI VMs',
  },
  {
    id: 'ansible',
    label: 'Ansible',
    description: 'Bootstrapping Kubeadm',
  },
  {
    id: 'ready',
    label: 'Cluster Ready',
    description: 'Deployment complete',
  },
]

// הנתונים האלו יישארו כאן בינתיים עד שה-API יחזיר לנו אותם באמת
const mockKubeconfig = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUd...
    server: https://141.147.45.123:6443
  name: clixluster-prod
contexts:
- context:
    cluster: clixluster-prod
    user: kubernetes-admin
  name: kubernetes-admin@clixluster
current-context: kubernetes-admin@clixluster
kind: Config
users:
- name: kubernetes-admin
  user:
    client-certificate-data: LS0tLS1CRUd...
    client-key-data: LS0tLS1CRUd...`

const mockClusterInfo = {
  masterIP: '141.147.45.123',
  workerIPs: ['141.147.45.124', '141.147.45.125'],
  apiEndpoint: 'https://141.147.45.123:6443',
  podCIDR: '10.244.0.0/16',
  serviceCIDR: '10.96.0.0/12',
}

export default function App() {
  const [view, setView] = useState('form') // 'form' | 'provisioning' | 'success'
  const [clusterName, setClusterName] = useState('')
  const [email, setEmail] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [logs, setLogs] = useState([])
  
  // הוספנו סטייט למעקב אחרי מזהה המשימה שחוזר מה-API
  const [jobId, setJobId] = useState(null)

  // שליחת הבקשה האמיתית ל-Backend
  async function handleSubmit(e) {
    e.preventDefault()
    if (!clusterName || !email) return

    try {
      const response = await fetch('http://localhost:8000/api/v1/cluster/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cluster_name: clusterName, 
          node_count: 3 
        })
      })
      
      const data = await response.json()
      setJobId(data.job_id) // שומרים את ה-ID
      
      setView('provisioning')
      setCurrentStep(0)
      setCompletedSteps([])
      setLogs([])
    } catch (error) {
      console.error("Failed to connect to API:", error)
      alert("Error: Could not connect to the Backend API. Make sure FastAPI is running on port 8000.")
    }
  }

  function reset() {
    setView('form')
    setCurrentStep(0)
    setCompletedSteps([])
    setLogs([])
    setJobId(null)
  }

  // מנגנון ה-Polling: דוגם את השרת כל שתי שניות למשיכת לוגים וסטטוס
  useEffect(() => {
    if (view !== 'provisioning' || !jobId) return

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/cluster/status/${jobId}`)
        const data = await response.json()

        // מעדכנים את הלוגים במסך (ממירים למבנה שהקומפוננטה שלנו מצפה לו)
        const formattedLogs = data.logs.map((text) => ({ text }))
        setLogs(formattedLogs)

        // קידום השלבים ב-UI לפי הסטטוס שחוזר מ-Celery
        const status = data.status
        
        if (status === 'STARTING' || status === 'pending') {
          setCurrentStep(0)
        } else if (status.includes('TERRAFORM') || status === 'provisioning') {
          setCurrentStep(1)
          setCompletedSteps(prev => prev.includes(0) ? prev : [...prev, 0])
        } else if (status.includes('ANSIBLE')) {
          setCurrentStep(2)
          setCompletedSteps(prev => prev.includes(1) ? prev : [...prev, 0, 1])
        } else if (status === 'COMPLETED') {
          setCurrentStep(3)
          setCompletedSteps([0, 1, 2, 3])
          clearInterval(intervalId) // עוצרים את הדגימה
          setTimeout(() => setView('success'), 1500) // עוברים למסך ההצלחה
        } else if (status === 'ERROR') {
          clearInterval(intervalId)
          // כאן נוכל להוסיף בעתיד מסך שגיאה
        }

      } catch (error) {
        console.error("Error fetching job status:", error)
      }
    }, 2000) // דוגם כל 2 שניות

    return () => clearInterval(intervalId)
  }, [view, jobId])

  return (
    <main className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-[#090b14] px-4 py-8 font-sans text-slate-200 sm:items-center sm:py-10">
      <BackgroundFX />

      <div className="relative z-10 w-full max-w-2xl">
        <header className="mb-6 flex flex-col items-center text-center">
          <CliXLusterLogo />
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-400">
            Single-click Vanilla K8s provisioning on Oracle Cloud
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-cyan-900/30 bg-[#0f111a]/90 shadow-2xl shadow-cyan-900/20 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {view === 'form' && (
            <FormView
              clusterName={clusterName}
              setClusterName={setClusterName}
              email={email}
              setEmail={setEmail}
              onSubmit={handleSubmit}
            />
          )}

          {view === 'provisioning' && (
            <ProvisioningView
              currentStep={currentStep}
              completedSteps={completedSteps}
              logs={logs}
              onCancel={reset}
            />
          )}

          {view === 'success' && (
            <SuccessView clusterName={clusterName} email={email} onReset={reset} />
          )}
        </div>
      </div>
    </main>
  )
}

function FormView({ clusterName, setClusterName, email, setEmail, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 p-6 sm:p-7">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cluster-name" className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Cluster Name
        </label>
        <div className="relative">
          <Server className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            id="cluster-name"
            type="text"
            required
            value={clusterName}
            onChange={(e) => setClusterName(e.target.value)}
            placeholder="prod-k8s-frankfurt"
            className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Notification Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Cluster Specifications
        </p>
        <div className="flex flex-col gap-1">
          {specs.map((spec) => {
            const Icon = spec.icon
            return (
              <div key={spec.label} className="flex items-center justify-between gap-3 rounded-lg px-1 py-1.5">
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon className="size-3.5 text-cyan-500" />
                  {spec.label}
                </span>
                <span className="font-mono text-xs text-slate-300">{spec.value}</span>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <Play className="relative z-10 size-5 fill-current" />
        <span className="relative z-10 text-lg font-bold tracking-wide">Deploy Cluster</span>
      </button>
    </form>
  )
}

function ProvisioningView({ currentStep, completedSteps, logs, onCancel }) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-800/60 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Provisioning Pipeline
        </h2>
        <div className="flex flex-col gap-2">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx)
            const isActive = currentStep === idx && !isCompleted

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-300 ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : isActive
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-slate-800/50 bg-slate-900/30'
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <CheckCheck className="size-5 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="size-5 animate-spin text-cyan-400" />
                  ) : (
                    <Circle className="size-5 text-slate-600" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isCompleted ? 'text-emerald-300' : isActive ? 'text-cyan-200' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  <span className={`text-xs ${isCompleted ? 'text-emerald-400/70' : isActive ? 'text-cyan-400/70' : 'text-slate-600'}`}>
                    {step.description}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <TerminalWindow logs={logs} />

      <div className="border-t border-slate-800/60 p-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400"
        >
          Cancel Provisioning
        </button>
      </div>
    </div>
  )
}

function TerminalWindow({ logs }) {
  const terminalRef = useRef(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="border-b border-slate-800/60">
      <div className="flex items-center gap-2 border-b border-slate-800/60 bg-slate-950/80 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-500/80" />
          <span className="size-3 rounded-full bg-yellow-500/80" />
          <span className="size-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Terminal className="size-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-500">clixluster-provisioner</span>
        </div>
      </div>

      <div ref={terminalRef} className="h-64 overflow-y-auto bg-[#0a0c12] p-4 font-mono text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="size-3 animate-spin" />
            <span>Waiting for connection to backend...</span>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="flex">
              <span className="mr-3 select-none text-slate-700">{String(idx + 1).padStart(3, '0')}</span>
              <span
                className={
                  log.text.includes('error') || log.text.includes('failed') || log.text.includes('ERROR')
                    ? 'text-red-400'
                    : log.text.includes('complete') || log.text.includes('ok:') || log.text.includes('COMPLETED')
                      ? 'text-emerald-400'
                      : log.text.startsWith('[')
                        ? 'text-cyan-400'
                        : log.text.includes('PLAY') || log.text.includes('TASK') || log.text.includes('TERRAFORM')
                          ? 'text-yellow-400'
                          : 'text-slate-400'
                }
              >
                {log.text || '\u00A0'}
              </span>
            </div>
          ))
        )}
        <div className="mt-2 flex items-center gap-1 text-slate-600">
          <span className="animate-pulse">▋</span>
        </div>
      </div>
    </div>
  )
}

function SuccessView({ clusterName, email, onReset }) {
  const [copied, setCopied] = useState(false)

  function copyKubeconfig() {
    navigator.clipboard.writeText(mockKubeconfig)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col p-6 sm:p-7">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-4 flex size-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
          <div className="relative flex size-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="size-8 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Cluster Deployed Successfully!</h2>
        <p className="mt-1 text-sm text-slate-400">
          <span className="font-mono text-cyan-400">{clusterName}</span> is now ready
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Cluster Details</h3>
        <div className="flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between"><span className="text-slate-500">API Endpoint</span><span className="text-cyan-400">{mockClusterInfo.apiEndpoint}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Master IP</span><span className="text-slate-300">{mockClusterInfo.masterIP}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Worker IPs</span><span className="text-slate-300">{mockClusterInfo.workerIPs.join(', ')}</span></div>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">kubeconfig</span>
          <button onClick={copyKubeconfig} className="flex items-center gap-1.5 rounded-md bg-slate-800/60 px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-white">
            {copied ? <CheckCheck className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="max-h-40 overflow-auto p-4 font-mono text-[10px] leading-relaxed text-slate-400">{mockKubeconfig}</pre>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={onReset} className="flex-1 rounded-xl border border-slate-700/50 bg-slate-900/60 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300">
          Deploy Another
        </button>
      </div>
    </div>
  )
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 top-0 size-[500px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
      <div className="absolute -right-40 bottom-0 size-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />
      <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[150px]" />
      <div
        className="absolute inset-0 animate-[gridpan_40s_linear_infinite] opacity-[0.4]"
        style={{
          backgroundImage: 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
        }}
      />
      <style>{`@keyframes gridpan { 0% { background-position: 0 0; } 100% { background-position: 48px 48px; } }`}</style>
    </div>
  )
}