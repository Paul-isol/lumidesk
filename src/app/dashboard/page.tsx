'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Bot,
  User,
  Users,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Send,
  FileText,
  Radio,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Inbox
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

type ConversationStatus = 'ai_answering' | 'waiting' | 'human' | 'closed'

interface MockConversation {
  id: string
  visitorName: string
  visitorToken: string
  status: ConversationStatus
  lastMessage: string
  lastMessageAt: string
  unread: boolean
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'human' | 'ai_answering'>('all')
  const [selectedChatId, setSelectedChatId] = useState('conv-001')
  const [chatStatus, setChatStatus] = useState<ConversationStatus>('waiting')
  const [replyText, setReplyText] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'visitor',
      text: 'Hello, what is your standard refund policy on subscription plans?',
      time: '10:42 AM',
    },
    {
      id: 'm2',
      sender: 'ai',
      text: 'We offer a full 14-day money-back guarantee on all annual and monthly plans. You can initiate this directly from your billing settings.',
      citation: 'Policy-Terms.pdf (Chunk #4, Voyage AI Score: 0.92)',
      time: '10:42 AM',
    },
    {
      id: 'm3',
      sender: 'visitor',
      text: 'Got it. But what about custom enterprise SLAs with 99.99% uptime guarantees? Can we negotiate payment terms on invoice?',
      time: '10:43 AM',
    },
    {
      id: 'm4',
      sender: 'system',
      text: 'AI Agent initiated Handoff: Similarity score below threshold (< 0.70) for custom enterprise negotiations. Conversation moved to Waiting queue.',
      time: '10:43 AM',
    },
  ])

  const conversations: MockConversation[] = [
    {
      id: 'conv-001',
      visitorName: 'Visitor #4829',
      visitorToken: 'vis_token_9f82ab41',
      status: chatStatus,
      lastMessage: 'Got it. But what about custom enterprise SLAs...',
      lastMessageAt: 'Just now',
      unread: true,
    },
    {
      id: 'conv-002',
      visitorName: 'David K. (Visitor #3104)',
      visitorToken: 'vis_token_1a83cc12',
      status: 'human',
      lastMessage: 'Sure thing David, I just verified your account setup.',
      lastMessageAt: '4m ago',
      unread: false,
    },
    {
      id: 'conv-003',
      visitorName: 'Visitor #9201',
      visitorToken: 'vis_token_77dd23fa',
      status: 'ai_answering',
      lastMessage: 'You can integrate LumiDesk with a single script tag.',
      lastMessageAt: '12m ago',
      unread: false,
    },
  ]

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'all') return true
    return c.status === activeTab
  })

  function handleTakeover() {
    setChatStatus('human')
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'system',
        text: 'Operator Sarah Miller took over the conversation. AI Agent is now strictly muted.',
        time: 'Just now',
      },
    ])
  }

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'operator',
        text: replyText.trim(),
        time: 'Just now',
      },
    ])
    setReplyText('')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />
              Home
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
              LD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Acme Workspace</span>
                <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-[10px] text-purple-300 py-0">
                  Neon BaaS
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
            <Radio className="size-3 text-emerald-400 animate-pulse" />
            <span>PartyKit WebSocket: Connected</span>
          </div>

          <div className="flex items-center gap-2.5 border-l border-border pl-4">
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-purple-950 text-purple-300 font-semibold text-xs">
                SM
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-medium text-foreground">Sarah Miller</p>
              <p className="text-muted-foreground">Operator (Online)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Metric Bar */}
        <section className="border-b border-border/40 bg-card/30 px-6 py-4">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">AI Deflection Rate</p>
                <p className="text-lg font-bold text-foreground">46.8%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                <MessageSquare className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Chats</p>
                <p className="text-lg font-bold text-foreground">8</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-950/10 p-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-amber-500/20 text-amber-400">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-xs text-amber-300">Needs Attention</p>
                <p className="text-lg font-bold text-amber-400">2 Waiting</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
                <FileText className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Indexed Documents</p>
                <p className="text-lg font-bold text-foreground">14 Docs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Split Inbox */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden p-6 gap-6">
          {/* Left Pane: Conversation List */}
          <div className="flex w-80 shrink-0 flex-col rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Inbox className="size-4 text-purple-400" />
                  Live Inbox
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {filteredConversations.length}
                </Badge>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 text-xs">
                {(['all', 'waiting', 'human', 'ai_answering'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 capitalize py-1 px-1.5 rounded-md font-medium transition-all ${
                      activeTab === tab 
                        ? 'bg-background text-foreground shadow-xs' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'ai_answering' ? 'AI' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Cards */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedChatId(conv.id)
                    setChatStatus(conv.status)
                  }}
                  className={`flex cursor-pointer flex-col gap-1.5 p-3.5 transition-colors ${
                    selectedChatId === conv.id ? 'bg-muted/70 border-l-2 border-purple-500' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground truncate">{conv.visitorName}</span>
                    <span className="text-[10px] text-muted-foreground">{conv.lastMessageAt}</span>
                  </div>

                  <p className="line-clamp-2 text-xs text-muted-foreground">{conv.lastMessage}</p>

                  <div className="mt-1 flex items-center gap-2">
                    {conv.status === 'waiting' && (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] py-0">
                        Needs Attention
                      </Badge>
                    )}
                    {conv.status === 'human' && (
                      <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] py-0">
                        Human Active
                      </Badge>
                    )}
                    {conv.status === 'ai_answering' && (
                      <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] py-0">
                        AI Answering
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Pane: Active Conversation Thread */}
          <div className="flex flex-1 flex-col rounded-xl border border-border bg-card overflow-hidden">
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                    #48
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">Visitor #4829</h3>
                    {chatStatus === 'waiting' && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        Waiting for Operator
                      </Badge>
                    )}
                    {chatStatus === 'human' && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                        Operator Active
                      </Badge>
                    )}
                    {chatStatus === 'ai_answering' && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
                        AI Answering
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Token: vis_token_9f82ab41</p>
                </div>
              </div>

              {chatStatus === 'waiting' && (
                <Button 
                  size="sm" 
                  onClick={handleTakeover}
                  className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5 text-xs font-semibold shadow-md shadow-amber-600/20"
                >
                  <User className="size-3.5" />
                  Take Over from AI
                </Button>
              )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((m) => {
                if (m.sender === 'system') {
                  return (
                    <div key={m.id} className="mx-auto my-2 max-w-lg rounded-lg border border-amber-500/30 bg-amber-950/20 p-2.5 text-center text-xs text-amber-300">
                      <p className="font-semibold">{m.text}</p>
                      <span className="text-[10px] text-amber-400/70">{m.time}</span>
                    </div>
                  )
                }

                const isVisitor = m.sender === 'visitor'
                const isAI = m.sender === 'ai'
                const isOperator = m.sender === 'operator'

                return (
                  <div key={m.id} className={`flex flex-col ${isVisitor ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-muted-foreground">
                      {isAI && <Bot className="size-3 text-purple-400" />}
                      {isOperator && <User className="size-3 text-blue-400" />}
                      <span>{isVisitor ? 'Visitor' : isAI ? 'AI Support Agent (Gemini)' : 'Sarah Miller (Operator)'}</span>
                      <span>•</span>
                      <span>{m.time}</span>
                    </div>

                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                        isVisitor
                          ? 'bg-muted text-foreground rounded-tl-sm'
                          : isAI
                          ? 'bg-purple-950/40 text-purple-100 border border-purple-500/30 rounded-tr-sm shadow-inner'
                          : 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>

                      {m.citation && (
                        <div className="mt-2.5 pt-2 border-t border-purple-500/20 text-[11px] text-purple-300/80 flex items-center gap-1">
                          <FileText className="size-3 text-purple-400 shrink-0" />
                          <span className="truncate">{m.citation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="border-t border-border p-3.5 bg-muted/20 flex gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  chatStatus === 'ai_answering'
                    ? 'AI is currently replying. Click Take Over to respond manually...'
                    : 'Type a message as Sarah Miller (Operator)...'
                }
                className="bg-background text-sm"
              />
              <Button type="submit" size="sm" className="gap-1.5 bg-purple-600 hover:bg-purple-500 text-white">
                <Send className="size-3.5" />
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
