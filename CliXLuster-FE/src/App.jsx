'use client'

import React, { useState } from 'react'
import {
  Server,
  Cpu,
  Globe,
  Mail,
  CheckCircle2,
  Loader2,
  Radar,
  HardDrive,
} from 'lucide-react'

// מייבאים את הלוגו שיצרנו מקודם
import CliXLusterLogo from './Logo'

const specs = [
  { icon: Globe, label: 'Region', value: 'eu-frankfurt-1' },
  { icon: Cpu, label: 'Architecture', value: 'ARM (Ampere A1.Flex)' },
  { icon: Server, label: 'Nodes', value: '1 Master, 2 Workers' },
  { icon: HardDrive, label: 'Per VM', value: '1 OCPU · 6 GB RAM · 50 GB' },
]

export default function App() {
  const [status, setStatus] = useState('idle')
  const [clusterName, setClusterName] = useState('')
  const [email, setEmail] = useState('')

  const isHunting = status === 'hunting'
  const isSuccess = status === 'success'

  function handleSubmit(e) {
    e.preventDefault()
    if (!clusterName || !email) return
    setStatus('hunting')
  }

  function reset() {
    setStatus('idle')
  }

  function toggleSuccess() {
    setStatus(isSuccess ? 'hunting' : 'success')
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#090b14] px-4 py-10 font-sans text-slate-200">
      {/* Animated infrastructure background */}
      <BackgroundFX />

      <div className="relative z-10 w-full max-w-md">

        {/* Header - Integrating our Custom Logo */}
        <header className="mb-6 flex flex-col items-center text-center">
          <div className="scale-90 sm:scale-100">
            <CliXLusterLogo />
          </div>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-400">
            Deploy you Vanilla K8S CLuster - Just Click
          </p>
        </header>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-900/30 bg-[#0f111a]/80 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-md sm:p-7">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {isSuccess ? (
            <SuccessState email={email} onReset={reset} />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <fieldset
                disabled={isHunting}
                className="flex flex-col gap-5 transition-opacity duration-300"
              >
                {/* Inputs */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="cluster-name"
                    className="text-xs font-medium uppercase tracking-wider text-slate-400"
                  >
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
                      placeholder="prod-oke-frankfurt"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wider text-slate-400"
                  >
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
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Cluster Specifications
                  </p>
                  <div className="flex flex-col gap-1">
                    {specs.map((spec) => {
                      const Icon = spec.icon
                      return (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between gap-3 rounded-lg px-1 py-1.5"
                        >
                          <span className="flex items-center gap-2 text-xs text-slate-400">
                            <Icon className="size-3.5 text-cyan-500" />
                            {spec.label}
                          </span>
                          <span className="font-mono text-xs text-slate-300">
                            {spec.value}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </fieldset>

              {/* Hunting status */}
              {isHunting && <HuntingStatus />}

              {/* Upgraded Action button */}
              <button
                type="submit"
                disabled={isHunting}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-4 font-semibold text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:cursor-not-allowed disabled:from-slate-800 disabled:via-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:hover:scale-100"
              >
                {/* Subtle glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {isHunting ? (
                  <span className="relative z-10 flex items-center gap-2 text-sm text-cyan-200">
                    <Loader2 className="size-4 animate-spin" />
                    Hunting for capacity...
                  </span>
                ) : (
                  <span className="relative z-10 flex flex-col items-center leading-none">
                    <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-100 drop-shadow-md">
                      CLICK
                    </span>
                    <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-200">
                      To Create Your Cluster
                    </span>
                  </span>
                )}
              </button>

              {isHunting && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-center text-xs text-slate-500 transition-colors hover:text-red-400"
                >
                  Cancel provisioning
                </button>
              )}
            </form>
          )}
        </div>

        {/* Mock preview toggle */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={toggleSuccess}
            className="rounded-full border border-slate-700/50 bg-slate-900/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
          >
            {isSuccess
              ? '← Back to Configuration Form'
              : 'Developer: Simulate Success State'}
          </button>
        </div>
      </div>
    </main>
  )
}

function HuntingStatus() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-cyan-500/30 bg-cyan-900/10 p-4 shadow-inner">
      <div className="flex items-center gap-3">
        <span className="relative flex size-9 shrink-0 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30" />
          <span className="relative flex size-9 items-center justify-center rounded-full border border-cyan-400/50 bg-slate-950">
            <Radar className="size-4 animate-spin text-cyan-400 [animation-duration:2.5s]" />
          </span>
        </span>
        <p className="text-sm font-medium text-cyan-100">
          Hunting for available OKE capacity in Frankfurt...
        </p>
      </div>

      {/* Cyber Scanning bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
        <div className="h-full w-1/3 animate-[scan_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      </div>

      <p className="text-pretty text-xs leading-relaxed text-slate-400">
        Always-Free resources take time due to demand. You can safely close this
        window. We will email you once it&apos;s ready.
      </p>
    </div>
  )
}

function SuccessState({ email, onReset }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
        <div className="relative flex size-20 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="size-10 text-emerald-400" />
        </div>
      </div>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
        Cluster Provisioned Successfully!
      </h2>
      <p className="text-pretty text-sm leading-relaxed text-slate-300">
        Check your inbox{email ? ` at ${email}` : ''} for the kubeconfig and access details.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900/60 px-6 py-2.5 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
      >
        Provision another cluster
      </button>
    </div>
  )
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Tech-inspired radial glows */}
      <div className="absolute -left-40 top-0 size-[500px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
      <div className="absolute -right-40 bottom-0 size-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />
      <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[150px]" />

      {/* Server grid */}
      <div
        className="absolute inset-0 opacity-[0.4] animate-[gridpan_40s_linear_infinite]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 20%, transparent 80%)',
        }}
      />

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(420%); }
        }
        @keyframes gridpan {
          0% { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }
      `}</style>
    </div>
  )
}
