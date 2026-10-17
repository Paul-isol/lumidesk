'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Radio, 
  Database, 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Terminal,
  Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { orpc } from '@/lib/orpc'

export default function HomePage() {
  const [healthData, setHealthData] = useState<any>(null)
  const [loadingHealth, setLoadingHealth] = useState(false)

  // Fetch health check on mount via oRPC
  useEffect(() => {
    fetchHealth()
  }, [])

  async function fetchHealth() {
    setLoadingHealth(true)
    try {
      const res = await orpc.health()
      setHealthData(res)
    } catch (err) {
      console.error('oRPC health check error:', err)
    } finally {
      setLoadingHealth(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Glow Accents */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 size-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 size-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />

      {/* Top Navigation */}
      <header className="relative z-10 border-b border-border/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/20">
              <Bot className="size-5 text-white" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Lumi<span className="text-purple-400">Desk</span>
            </span>
            <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-xs text-purple-300">
              v1.0 Foundations
            </Badge>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                Operator Dashboard
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs text-purple-300 shadow-inner">
            <Sparkles className="size-3.5 text-purple-400" />
            <span>Hello World • Project Foundations Initialized</span>
          </div>

          <h1 className="font-heading mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            Customer Support Powered by{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Guarded AI & Live Chat
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            LumiDesk gives fast-growing online businesses an Intercom-style live widget with a strictly grounded 
            RAG agent powered by <strong className="text-foreground">Voyage AI</strong> and <strong className="text-foreground">Gemini 2.5 Flash</strong>. 
            Off-topic prompts are politely declined; complex issues hand off smoothly to human operators.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-11 gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 font-medium text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500">
                Open Operator Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={fetchHealth} 
              disabled={loadingHealth}
              className="h-11 gap-2 border-border/60 hover:bg-muted/40"
            >
              <RefreshCw className={`size-4 ${loadingHealth ? 'animate-spin text-purple-400' : ''}`} />
              Test oRPC Health
            </Button>
          </div>
        </div>

        {/* Live Foundations Check Card */}
        <div className="mt-14 mx-auto max-w-3xl">
          <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <Terminal className="size-4 text-purple-400" />
                <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Foundations & API Verification (oRPC + Zod)
                </CardTitle>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1.5 py-0.5">
                <CheckCircle2 className="size-3" />
                {healthData?.status === 'ok' ? 'Online' : 'Checking'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/40 bg-black/40 p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
                <div className="flex items-center justify-between text-purple-300 pb-2 border-b border-border/30 mb-2">
                  <span>Endpoint: /api/orpc/health</span>
                  <span>Engine: {healthData?.version || '1.0.0-alpha'}</span>
                </div>
                <pre className="text-emerald-300">
                  {healthData ? JSON.stringify(healthData, null, 2) : '// Contacting oRPC endpoint...'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Architectural Pillars Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <Card className="border-border/60 bg-card/40 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400 mb-2">
                <Radio className="size-5" />
              </div>
              <CardTitle className="text-lg">Real-Time WebSocket Engine</CardTitle>
              <CardDescription>
                Powered by <strong>PartyKit</strong>. Sub-50ms message sync, typing indicators, token streaming, and multi-operator presence.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/60 bg-card/40 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 mb-2">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle className="text-lg">Guarded AI Support Agent</CardTitle>
              <CardDescription>
                3-tier intent classification stops spam before vector lookup. High-precision RAG powered by <strong>Voyage AI</strong> and <strong>Gemini 2.5 Flash</strong>.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/60 bg-card/40 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 mb-2">
                <Database className="size-5" />
              </div>
              <CardTitle className="text-lg">Neon BaaS & Postgres RLS</CardTitle>
              <CardDescription>
                Zero-cold-start queries via <strong>Neon Data API</strong>. Mathematically enforced multi-tenant and visitor isolation with <strong>Row-Level Security</strong>.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
