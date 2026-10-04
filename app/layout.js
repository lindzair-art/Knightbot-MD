import "./globals.css"

export const metadata = {
  title: "Sticks WHTSPP BT | WhatsApp Pairing",
  description: "Connect your WhatsApp account to Sticks or Maga with a secure pairing code.",
  applicationName: "Sticks WHTSPP BT",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090908",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
