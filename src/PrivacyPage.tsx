import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Wordmark } from './components/Logo.tsx'
import { Footer } from './components/Footer.tsx'
import { config, homeHref } from './config.ts'

export const PRIVACY_LAST_UPDATED = 'November 9, 2026'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-copy [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  )
}

function Contact() {
  return config.contactEmail ? (
    <a href={`mailto:${config.contactEmail}`} className="font-medium text-link underline underline-offset-2">
      {config.contactEmail}
    </a>
  ) : (
    <span className="font-medium text-ink">our contact email (to be published on this page before launch)</span>
  )
}

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line bg-azure/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <a href={homeHref} aria-label="Ellivia home" className="rounded-lg">
            <Wordmark />
          </a>
          <a href={homeHref} className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </a>
        </div>
      </header>

      <main id="main" className="mx-auto my-10 max-w-3xl rounded-[28px] bg-paper px-5 py-12 shadow-soft sm:my-14 sm:px-12 sm:py-16">
        <h1 className="text-[36px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[44px]">
          Ellivia waitlist privacy policy
        </h1>
        <p className="mt-3 text-muted">Last updated: {PRIVACY_LAST_UPDATED}</p>

        <p className="mt-8 text-lg leading-relaxed text-copy">
          This policy covers this prelaunch waitlist website only. It does not cover the future Ellivia iOS app, which
          will have its own privacy policy. In short: we only ask for your name and email address, we only use them to
          tell you about Ellivia’s launch, and you can ask us to delete them at any time.
        </p>

        <Section title="Who we are">
          <p>
            Ellivia is an independent project being developed through Everyone Can Code Chicago’s App Accelerator.
            Ellivia is not affiliated with, endorsed by, or sponsored by RUSH University Medical Center.
          </p>
        </Section>

        <Section title="What we collect when you join">
          <ul>
            <li>Your first and last name.</li>
            <li>Your email address.</li>
            <li>The date and time you joined.</li>
            <li>
              A record of your consent: the time you agreed to receive launch updates and which version of the consent
              wording you saw.
            </li>
            <li>
              A short referral label (for example, “instagram” or “qr-flyer”) if you arrived through a link that
              included one. This tells us which outreach is working. It is not linked to any social media account.
            </li>
          </ul>
          <p>
            We do <strong className="font-semibold text-ink">not</strong> collect phone numbers, addresses, medical
            records, hospital bills, insurance details, income, or other financial information on this website. Please
            don’t send us any of that information.
          </p>
          <p>
            The savings example on our home page, where you can pick a household size and income range, runs entirely
            in your browser. Your choices there are never saved or sent to us.
          </p>
        </Section>

        <Section title="Information processed for security">
          <ul>
            <li>
              <strong className="font-semibold text-ink">Spam protection.</strong> The signup form uses Cloudflare
              Turnstile to tell people apart from automated bots. Turnstile processes information about your browser,
              device, and IP address under{' '}
              <a
                href="https://www.cloudflare.com/turnstile-privacy-policy/"
                className="font-medium text-link underline underline-offset-2"
                rel="noopener noreferrer"
              >
                Cloudflare’s Turnstile privacy policy
              </a>
              .
            </li>
            <li>
              <strong className="font-semibold text-ink">Rate limiting.</strong> To prevent abuse, our signup service
              stores a one-way, keyed hash of your IP address with a timestamp. We don’t store your IP address itself
              in our database, and these hashes are deleted automatically after about 24 hours.
            </li>
            <li>
              <strong className="font-semibold text-ink">Hosting.</strong> This website is hosted on GitHub Pages, and
              our database and signup service are hosted by Supabase. Like most online services, these providers may
              keep standard technical logs (such as IP addresses and request times) under their own privacy policies.
            </li>
          </ul>
          <p>
            We don’t use cookies, analytics, advertising trackers, or tracking pixels. If you arrive through a referral
            link, your browser keeps that label in session storage until you close the tab, so it is only sent to us
            if you choose to join.
          </p>
        </Section>

        <Section title="How we use your information">
          <p>
            We use your name and email address only to send you updates about Ellivia’s launch, such as when the app
            becomes available, and to address those messages to you. We do not sell, rent, or share your name or email
            address with anyone for marketing, and we don’t use them for advertising. Any launch email we send will include a way to stop receiving further messages.
          </p>
        </Section>

        <Section title="How it’s stored and protected">
          <ul>
            <li>Your information is sent over an encrypted HTTPS connection.</li>
            <li>It is stored in a Supabase-hosted PostgreSQL database located in the United States.</li>
            <li>
              The public website can’t read the waitlist. Only our signup service can add entries, and only
              Ellivia’s project administrators can view the list through their Supabase account.
            </li>
          </ul>
          <p>No method of storing or sending information online is completely secure, but we work to keep access limited.</p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep your name and email address until Ellivia has launched and we have finished sending launch updates, or until
            you ask us to delete it, whichever comes first. After that, we plan to delete the waitlist.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask us to delete your name and email address at any time by contacting <Contact />. Please send the request
            from the address you signed up with, so we can confirm it’s yours.
          </p>
        </Section>

        <Section title="Children">
          <p>This website is not directed to children under 13, and we do not knowingly collect their information.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change how we handle waitlist information, we’ll update this page and the “Last updated” date above.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Contact <Contact />.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  )
}
