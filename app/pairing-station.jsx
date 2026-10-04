"use client"

import { useState } from "react"

const bots = [
  { id: "sticks", name: "Sticks", mark: "S", description: "The original" },
  { id: "maga", name: "Maga", mark: "M", description: "The next chapter" },
]

function SparkIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 2 1.9 7.2L21 12l-7.1 2.8L12 22l-1.9-7.2L3 12l7.1-2.8L12 2Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
      <path d="m19 2 .7 2.3L22 5l-2.3.7L19 8l-.7-2.3L16 5l2.3-.7L19 2Z" fill="currentColor" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.6 3.8 10.5 7l-1.4 1.6a14.2 14.2 0 0 0 6.3 6.3l1.6-1.4 3.2 1.9-.6 3a1.9 1.9 0 0 1-2.1 1.5C10 19 5 14 4.1 6.5a1.9 1.9 0 0 1 1.5-2.1l3-.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PairingStation() {
  const [selectedBot, setSelectedBot] = useState("sticks")
  const [phone, setPhone] = useState("")
  const [pairingCode, setPairingCode] = useState("")
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const digits = phone.replace(/\D/g, "")

    if (digits.length < 7 || digits.length > 15) {
      setStatus("error")
      setMessage("Enter a valid number with its country code.")
      setPairingCode("")
      return
    }

    setStatus("loading")
    setMessage("")
    setPairingCode("")

    try {
      const response = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: digits, bot: selectedBot }),
      })
      const data = await response.json()

      if (!response.ok || !data.code) {
        throw new Error(data.error || "We couldn’t create a code right now. Try again in a moment.")
      }

      setPairingCode(data.code)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(pairingCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setMessage("Clipboard access isn’t available. Select the code to copy it.")
    }
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Sticks WhatsApp bot home">
          <span className="wordmark-mark"><SparkIcon /></span>
          <span>STICKS<span className="wordmark-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="online-indicator"><span />PAIRING SERVICE</span>
          <a className="top-link" href="#how-it-works">How it works <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR WHATSAPP, UPGRADED</div>
          <h1 id="hero-title">STICKS <span>WHTSPP</span><br />BT<span className="gold-period">.</span></h1>
          <p className="hero-description">A little more magic in every message.<br />Connect your WhatsApp and let <span>Sticks</span> handle the rest.</p>
          <a className="hero-link" href="#pair"><span>Get your pairing code</span><span className="hero-link-icon"><ArrowIcon /></span></a>
          <div className="hero-caption"><span className="caption-dash" /> SECURE CONNECTION <span className="caption-dot">·</span> NO QR SCAN NEEDED</div>
        </div>

        <div className="orbit-scene" aria-label="A floating gold and black Sticks bot emblem">
          <div className="scene-orbit orbit-a" />
          <div className="scene-orbit orbit-b" />
          <div className="orbit-particle particle-a" />
          <div className="orbit-particle particle-b" />
          <div className="bot-plinth"><span>STICKS <i>AI</i></span></div>
          <div className="bot-core">
            <div className="bot-core-glow" />
            <div className="core-symbol"><SparkIcon /></div>
            <div className="core-label">YOUR BOT, READY</div>
          </div>
          <div className="scene-tag"><span className="tag-light" /> ALWAYS ON. ALWAYS YOURS.</div>
        </div>
      </section>

      <section className="pair-section" id="pair" aria-labelledby="pair-title">
        <div className="pair-intro">
          <span className="section-index">01 <span>—</span> PAIR YOUR DEVICE</span>
          <h2 id="pair-title">Make it <em>yours.</em></h2>
          <p>Choose your bot. Enter your number. You’re one code away.</p>
        </div>

        <div className="pair-card">
          <div className="card-topline"><span>NEW CONNECTION</span><span className="step-count">STEP 01 <span>/</span> 02</span></div>
          <div className="card-field">
            <div className="field-label-row"><label>Choose your bot</label><span>SELECT ONE</span></div>
            <div className="bot-selector" role="group" aria-label="Choose your WhatsApp bot">
              {bots.map((bot) => (
                <button key={bot.id} type="button" className={`bot-option ${selectedBot === bot.id ? "selected" : ""}`} onClick={() => setSelectedBot(bot.id)} aria-pressed={selectedBot === bot.id}>
                  <span className="bot-option-mark">{bot.mark}</span>
                  <span className="bot-option-copy"><strong>{bot.name}</strong><small>{bot.description}</small></span>
                  {selectedBot === bot.id && <span className="selected-check" aria-label="Selected">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pair-form">
            <div className="field-label-row"><label htmlFor="phone">WhatsApp number</label><span>WITH COUNTRY CODE</span></div>
            <div className="phone-input-wrap">
              <span className="phone-icon"><PhoneIcon /></span>
              <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="e.g. 1 555 123 4567" required aria-describedby="phone-hint" />
            </div>
            <p className="phone-hint" id="phone-hint">Include your country code, without a + or leading zero.</p>
            <button className="generate-button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? <><span className="button-spinner" />Creating your code…</> : <>Generate pairing code <ArrowIcon /></>}
            </button>
          </form>

          {status === "success" ? (
            <div className="result-panel" role="status" aria-live="polite">
              <div className="result-heading"><span className="result-check">✓</span><div><strong>You’re almost in.</strong><small>Enter this code in WhatsApp to connect.</small></div></div>
              <div className="code-row"><output aria-label="Your WhatsApp pairing code">{pairingCode}</output><button type="button" className="copy-button" onClick={copyCode}>{copied ? "Copied" : "Copy code"}</button></div>
              <p className="code-footnote">Keep this code private. It expires after a short time.</p>
            </div>
          ) : status === "error" ? (
            <p className="form-error" role="alert">{message}</p>
          ) : (
            <p className="form-assurance"><span>⌁</span> Your number is only used to generate a pairing code.</p>
          )}
        </div>
      </section>

      <section className="steps-section" id="how-it-works" aria-labelledby="steps-title">
        <div className="steps-heading"><span className="section-index">02 <span>—</span> THE EASY PART</span><h2 id="steps-title">Three steps. <em>That’s it.</em></h2></div>
        <div className="steps-grid">
          <article className="step-card"><span className="step-number">01</span><div className="step-icon phone-step"><PhoneIcon /></div><h3>Choose your bot</h3><p>Pick Sticks or Maga and add your WhatsApp number with its country code.</p></article>
          <article className="step-card"><span className="step-number">02</span><div className="step-icon code-step"><SparkIcon /></div><h3>Get your code</h3><p>We’ll generate a one-time pairing code for your WhatsApp account.</p></article>
          <article className="step-card"><span className="step-number">03</span><div className="step-icon link-step"><ArrowIcon /></div><h3>Link and go</h3><p>On your phone, open Linked devices and choose “Link with phone number instead.”</p></article>
        </div>
      </section>

      <footer className="footer"><a className="footer-brand" href="#home">STICKS<span>.</span></a><p>Made for better conversations.</p><span className="footer-note">STICKS WHTSPP BT <span>·</span> 2026</span></footer>
    </main>
  )
}
