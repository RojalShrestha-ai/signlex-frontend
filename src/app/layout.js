/**
 * SignLex Frontend - Root Layout
 * Author: Pawan Rijal
 * 
 * The root layout wraps all pages with the navigation bar,
 * footer, and provides the HTML structure with metadata.
 */

import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "SignLex - Learn Sign Language with AI",
  description:
    "AI-powered sign language learning platform with real-time gesture recognition and gamification.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
