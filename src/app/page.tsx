'use client'

import Link from 'next/link';
import { FaRocket, FaCogs, FaChartLine } from 'react-icons/fa'; // Importing icons
import Image from 'next/image'; // Import Next.js Image component

export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col px-10" style={{  
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/HomePng.jpg')",
      backgroundPosition: "center",
      backgroundSize: "cover"
    }}>
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-6">
        <div className="flex items-center">
          {/* Logo Image */}
          <Image
            src="/images/logo.png" // Replace with your actual logo path
            alt="Dunefox Logo"
            width={140} // Adjust size as needed
            height={100}
            className="" // Optional: Add rounded corners or other styles
          />
        </div>
        <nav className="space-x-4">
          <Link href="/auth/sign-in">
            <button className="px-4 py-2 bg-transparent border border-white rounded hover:bg-[#EB6C33] hover:text-white hover:border-[#EB6C33] transition">
              Sign In
            </button>
          </Link>
          <Link href="/auth/sign-up">
            <button className="px-4 py-2 bg-[#EB6C33] text-white rounded hover:bg-[#D45A2A] transition">
              Sign Up
            </button>
          </Link>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="text-left max-w-2xl">
          <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-[#EB6C33] text-sm font-semibold">
            <FaRocket className="mr-2" /> {/* Rocket icon */}
            AI + Business
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            <span className="text-5xl text-[#EB6C33]">DuneFox Dashboard</span>
            Your Central Hub for <span className="text-[#EB6C33]">AI-Powered Business Insights</span>
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Take control of your business with the DuneFox Dashboard. Monitor performance, analyze data, and optimize workflows—all in one intuitive, AI-driven platform.
          </p>
          <div className="flex space-x-6 mb-8">
            <div className="flex items-center">
              <FaCogs className="text-[#EB6C33] mr-2" /> {/* Cogs icon */}
              <span className="text-gray-200">Streamlined Processes</span>
            </div>
            <div className="flex items-center">
              <FaChartLine className="text-[#EB6C33] mr-2" /> {/* Chart line icon */}
              <span className="text-gray-200">Data-Driven Insights</span>
            </div>
          </div>
          <Link href="/console">
            <button className="px-6 py-3 bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-semibold rounded-lg transition flex items-center justify-center">
              Get Started
              <span className="ml-2">→</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}