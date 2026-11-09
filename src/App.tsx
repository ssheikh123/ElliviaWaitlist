import { Nav } from './components/Nav.tsx'
import { Footer } from './components/Footer.tsx'
import { Faq, FinalCta, Hero, HowItWorks, TrustPrivacy, WhyEllivia } from './components/Sections.tsx'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <WhyEllivia />
        <TrustPrivacy />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
