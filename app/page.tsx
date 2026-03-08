'use client';

import { Navbar } from '@/components/neurolens/navbar';
import { MapPlaceholder } from '@/components/neurolens/map-placeholder';
import { StatusBadge } from '@/components/neurolens/status-badge';
import { SafeZoneCard } from '@/components/neurolens/safe-zone-card';
import Link from 'next/link';
import {
  Navigation,
  Camera,
  AlertCircle,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Navbar */}
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 px-6 md:py-32">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
                  AI-Powered Mobility Assistance
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed text-balance">
                  Enable safer independent travel for elderly adults and people with cognitive disabilities through
                  advanced AR detection and real-time guidance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/user"
                  className="bg-primary text-primary-foreground hover:opacity-90 font-semibold text-lg py-4 px-8 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  Launch User Interface
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/caregiver"
                  className="bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold text-lg py-4 px-8 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  Open Caregiver Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right preview */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Current Status</h3>
                      <StatusBadge status="safe" />
                    </div>
                    <MapPlaceholder height="h-48" />
                    <SafeZoneCard
                      name="Central Library"
                      distance="250m"
                      address="123 Main Street"
                      isNearest
                      amenities={['Seating', 'Restrooms', 'Staff']}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Smart Mobility Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive technology designed with safety, accessibility, and independence in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 group hover:shadow-xl transition-all">
              <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">AR Detection</h3>
              <p className="text-sm text-muted-foreground">
                Real-time hazard detection using advanced computer vision to identify obstacles and safety concerns
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 group hover:shadow-xl transition-all">
              <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
                <Navigation className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Smart Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Adaptive route planning with real-time adjustments based on detected obstacles and preferred paths
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 group hover:shadow-xl transition-all">
              <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">AI Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Conversational AI assistant providing calm, supportive instructions and real-time navigation cues
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 group hover:shadow-xl transition-all">
              <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Safe Zones</h3>
              <p className="text-sm text-muted-foreground">
                Curated network of verified safe locations including shops, rest areas, and emergency services
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 group hover:shadow-xl transition-all">
              <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Emergency Response</h3>
              <p className="text-sm text-muted-foreground">
                One-tap emergency alerts with automatic caregiver notification and emergency services integration
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 group hover:shadow-xl transition-all">
              <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Caregiver Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring and support tools for caregivers to ensure user safety and independence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="py-12 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive system designed to provide confidence and safety every step of the journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card-elevated-lg text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Real-Time Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Live AR camera feed continuously scans surroundings for obstacles, hazards, and navigation landmarks
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-elevated-lg text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Intelligent Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI processes detections to assess safety level, identify threats, and plan optimal route adjustments
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-elevated-lg text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Guided Assistance</h3>
              <p className="text-sm text-muted-foreground">
                AI assistant provides clear, supportive guidance while caregiver receives real-time status updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Simulation Showcase */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              NEW: 3D Experience
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">AR Glasses Simulation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience NeuroLens Guardian through an immersive 3D browser-based simulation of smart AR glasses
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-2xl shadow-black/10 border border-border overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">3D AR Glasses View</h3>
                  <p className="text-white/70 mb-6">
                    See how hazard detection, navigation, and safety features work in real-time
                  </p>
                  <Link
                    href="/ar-glasses-3d"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-lg py-3 px-6 rounded-xl transition-all"
                  >
                    Launch 3D Simulation
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 bg-card">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">3D</div>
                  <div className="text-xs text-muted-foreground">Immersive View</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">Real-time</div>
                  <div className="text-xs text-muted-foreground">Detection</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">HUD</div>
                  <div className="text-xs text-muted-foreground">Overlay</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">Demo</div>
                  <div className="text-xs text-muted-foreground">Scenarios</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experience the future of assistive mobility with AI-powered navigation and real-time safety monitoring.
          </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/user"
            className="bg-primary text-primary-foreground hover:opacity-90 font-semibold text-lg py-4 px-8 rounded-xl transition-all text-center flex items-center justify-center gap-2"
          >
            Start Journey Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/caregiver"
            className="bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold text-lg py-4 px-8 rounded-xl transition-all text-center flex items-center justify-center gap-2"
          >
            Support a User
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">NeuroLens Guardian</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 NeuroLens. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
