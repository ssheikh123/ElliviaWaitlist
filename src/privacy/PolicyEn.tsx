// English privacy policy text. The Spanish translation is in PolicyEs.tsx: change both together,
// and keep this in sync with the copy inside the app (ECC-App-Accelerator/V1/V1/Resources/PrivacyPolicy.md).
import { homeHref, privacyHref } from '../config.ts'
import { B, Contact, L, Part, PUBLIC_URL, Section } from './parts.tsx'

export const PRIVACY_LAST_UPDATED_EN = 'November 16, 2026'

export function PolicyEn() {
  return (
    <>
      <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[44px]">
        Ellivia Privacy Policy
      </h1>
      <p className="mt-3 text-muted">Effective date: {PRIVACY_LAST_UPDATED_EN}</p>
      <p className="mt-2 text-muted">
        Covers the Ellivia app for iPhone (version 1.0 and later) and the Ellivia website and waitlist at{' '}
        <L href={homeHref}>ssheikh123.github.io/ElliviaWaitlist</L>.
      </p>

      <Section title="The short version">
        <p>
          <B>The Ellivia app</B>
        </p>
        <ul>
          <li>The app works entirely on your iPhone. There are no accounts, servers, analytics, ads or tracking.</li>
          <li>
            We never see your answers, your bills or your results. Nothing you enter in the app is sent to us, to
            Rush or to anyone else.
          </li>
          <li>
            Your questionnaire answers, like your income and household size, are erased as soon as your result is
            shown.
          </li>
          <li>
            The app keeps only a small record on your phone: when you checked, the result, your apply-by date, which
            Rush hospital to contact, and the documents you picked on your checklist.
          </li>
          <li>Bill photos and files are read on your phone and then thrown away. They are never saved.</li>
          <li>
            You can erase everything at any time with <B>Delete all my data</B> in the app’s Settings.
          </li>
        </ul>
        <p>
          <B>The Ellivia website and waitlist</B>
        </p>
        <ul>
          <li>
            If you join the waitlist, we collect your name and email address and use them only to tell you about
            Ellivia’s launch.
          </li>
          <li>We never sell or share them, and you can ask us to delete them at any time.</li>
        </ul>
        <p>The rest of this policy explains each of these points in detail.</p>
      </Section>

      <Section title="Who we are">
        <p>
          Ellivia is made by the Ellivia team, an independent project built through Everyone Can Code Chicago’s 2026
          App Accelerator. In this policy, “Ellivia”, “we” and “us” mean the Ellivia team, the Ellivia app and the
          Ellivia website. “You” means anyone who uses the app or the website.
        </p>
        <p>
          Ellivia is not affiliated with, endorsed by, sponsored by or operated by Rush University Medical Center,
          Rush Oak Park Hospital or any part of Rush University System for Health (“Rush”). Ellivia’s results are
          estimates. Rush makes the final decision on every financial assistance application. Ellivia does not
          provide medical, legal or financial advice.
        </p>
        <p>
          You can reach us at any time at <Contact />.
        </p>
      </Section>

      <Part title="Part 1: The Ellivia app">
        <Section title="What the app does">
          <p>
            The Ellivia app helps people with an emergency room bill from Rush University Medical Center or Rush Oak
            Park Hospital find out whether they are likely to qualify for Rush financial assistance. It does this in
            three ways:
          </p>
          <ul>
            <li>
              <B>Eligibility check:</B> a short questionnaire that compares your answers with Rush’s financial
              assistance policy and the federal poverty guidelines.
            </li>
            <li>
              <B>Bill scan (optional):</B> reads the hospital, the amount owed and the bill dates from a photo, scan
              or PDF of your bill.
            </li>
            <li>
              <B>Deadline and checklist:</B> shows the last day to apply and a list of documents to gather.
            </li>
          </ul>
          <p>
            All of this happens on your iPhone. The app does not need an internet connection to work and does not
            make network requests.
          </p>
        </Section>

        <Section title="Information the app collects">
          <p>
            <B>The app does not collect any personal information.</B> “Collect” means sending information off your
            device to us or to anyone else, and the app never does that. Specifically, the app does not:
          </p>
          <ul>
            <li>ask you to create an account or sign in</li>
            <li>ask for your name, email address, phone number, address or date of birth</li>
            <li>collect your location</li>
            <li>include analytics, advertising, crash-reporting or any other third-party software kits</li>
            <li>use cookies, device identifiers or advertising identifiers</li>
            <li>track you across other apps or websites</li>
            <li>sell, rent, share or trade any information about you</li>
          </ul>
          <p>Because of this, the app’s App Store privacy label is “Data Not Collected”.</p>
          <p>
            The information below is used by the app only on your iPhone, to give you your result. It is never sent
            to us or to anyone else.
          </p>
        </Section>

        <Section title="Questionnaire answers">
          <p>The eligibility check asks some or all of these questions:</p>
          <ul>
            <li>which Rush hospital treated you</li>
            <li>whether you live in Illinois</li>
            <li>your insurance status</li>
            <li>the type of visit and the date of your visit</li>
            <li>the date of your first bill</li>
            <li>your copay amount and whether you have paid it</li>
            <li>whether you receive certain public benefits, such as SNAP or WIC</li>
            <li>your household size</li>
            <li>your household income</li>
          </ul>
          <p>
            <B>Why:</B> these are the facts Rush’s financial assistance policy uses to decide which program, if any,
            you may qualify for.
          </p>
          <p>
            <B>How these answers are handled:</B>
          </p>
          <ol>
            <li>
              They are kept only in your iPhone’s working memory while you answer. They are never written to storage
              on your phone.
            </li>
            <li>
              They are erased as soon as your result is worked out. While the result is on screen, the household size
              and income used to explain it are held in memory only, and are gone once you leave that screen.
            </li>
            <li>
              If you leave a check unfinished and the app stays in the background for 10 minutes or more, your
              answers are erased and the check starts over the next time you open the app.
            </li>
            <li>If you start over, your answers are erased right away.</li>
          </ol>
        </Section>

        <Section title="Bill scans">
          <p>
            Scanning your bill is optional. You can always answer the questions by hand instead. You can give the app
            a bill in three ways:
          </p>
          <ul>
            <li>
              <B>Camera:</B> Apple’s document scanner takes a picture of your paper bill.
            </li>
            <li>
              <B>Photos:</B> you pick one or more photos with Apple’s photo picker. The app receives only the photos
              you pick. It cannot see the rest of your photo library and does not ask for access to it.
            </li>
            <li>
              <B>Files:</B> you pick one or more images or PDFs with Apple’s file picker. The app receives only the
              files you pick.
            </li>
          </ul>
          <p>
            <B>How scans are handled:</B>
          </p>
          <ol>
            <li>
              The text on each page is read on your iPhone by Apple’s built-in text recognition (the Vision
              framework). Images are never uploaded or sent anywhere.
            </li>
            <li>
              The app looks for four things in that text: who sent the bill, the service date, the statement date and
              the amount due. These are used to fill in your check for you.
            </li>
            <li>
              The images, files and recognized text are kept in memory only while they are being read. The app never
              saves a copy of them, and they are not added to your photo library.
            </li>
            <li>
              What the scan found is kept in memory only while you are on the scan result screen, and is erased when
              you leave it.
            </li>
          </ol>
          <p>
            If a scan leads to an eligibility result, the app saves the same small record it saves for a manual check
            (see below). Nothing else from the scan is kept.
          </p>
        </Section>

        <Section title="Information stored on your iPhone">
          <p>
            To show your result, deadline and checklist when you come back, the app keeps a small amount of
            information on your iPhone. It stays on your iPhone and is never sent to us.
          </p>
          <p>
            <B>For each check you complete, the app saves:</B>
          </p>
          <ul>
            <li>the date and time of the check</li>
            <li>
              the result: either the assistance program you likely qualify for, or the general reason the check ended
              early (for example, the hospital isn’t one Ellivia covers)
            </li>
            <li>whether your income was close to a program cutoff, without any income figures</li>
            <li>which version of Rush’s rules was used</li>
            <li>your apply-by date</li>
            <li>which Rush hospital to contact</li>
            <li>a random ID so the record can be deleted on its own</li>
          </ul>
          <p>
            <B>For your document checklist, the app saves:</B> which items you picked, such as “Driver’s License” or
            “Copies of two most recent pay stubs”. Some of these picks can say something about your situation, so
            they are protected in the same way as your results. The app does not save the documents themselves.
          </p>
          <p>
            <B>For the app tutorial, the app saves:</B> the version number of the app when you last finished or
            skipped the tutorial, so it doesn’t show again every time. This is stored in the iPhone’s standard app
            settings and contains nothing about you.
          </p>
          <p>
            <B>The app never saves:</B> your income, household size, residency, insurance status, visit date, copay,
            public benefits, bill amounts, bill images, recognized bill text, or your name or contact details.
          </p>
        </Section>

        <Section title="How long the app keeps information">
          <ul>
            <li>
              Questionnaire answers and bill scans are erased as described above, at the latest when you leave the
              result or scan screen, or after 10 minutes in the background.
            </li>
            <li>
              Saved checks and checklist picks stay on your iPhone until you delete them, delete all your data, or
              delete the app.
            </li>
          </ul>
        </Section>

        <Section title="How the app protects your information">
          <ul>
            <li>
              <B>Locked when your phone is locked.</B> Your saved record is kept in a single file with iOS’s strongest
              file protection, so it can’t be read while your iPhone is locked.
            </li>
            <li>
              <B>Not backed up.</B> That file is excluded from iCloud and computer backups. This means it never leaves
              your phone through a backup. It also means your saved results won’t move to a new iPhone, and you would
              need to run the check again.
            </li>
            <li>
              <B>Hidden in the app switcher.</B> When you leave the app, its screen is covered, so your answers or
              result don’t appear in the app switcher or in the snapshot iOS takes of the app.
            </li>
            <li>
              <B>No network access.</B> The app doesn’t send or receive data over the internet.
            </li>
            <li>
              <B>Private error logs.</B> If something goes wrong, the app may write a short technical error message to
              your iPhone’s system log. These messages are marked private, stay on your iPhone and do not include your
              answers or results.
            </li>
          </ul>
          <p>
            Anyone who can unlock your iPhone can open the app and see your saved results and deadline. We recommend
            protecting your iPhone with a passcode, Face ID or Touch ID.
          </p>
        </Section>

        <Section title="Permissions the app asks for">
          <ul>
            <li>
              <B>Camera:</B> asked for only when you choose to scan a paper bill. It is used only to read your bill. If
              you say no, you can still pick photos or files, or answer the questions by hand. You can turn camera
              access on or off at any time in the iPhone Settings app under Ellivia.
            </li>
          </ul>
          <p>
            The app does not ask for access to your photo library, location, contacts, calendar, microphone, health
            data, Bluetooth or local network, and it does not ask for permission to track you.
          </p>
        </Section>

        <Section title="Sharing with third parties">
          <p>
            The app does not share any information with third parties, because no information ever leaves your
            iPhone. There are no third-party software kits in the app.
          </p>
          <p>Some buttons in the app take you outside it:</p>
          <ul>
            <li>
              <B>Rush web pages:</B> the Rush financial assistance page, the Rush financial assistance policy and the
              application form open in Safari.
            </li>
            <li>
              <B>Rush MyChart:</B> the MyChart sign-in page opens in Safari, so you can download documents you may
              need.
            </li>
            <li>
              <B>Calling or emailing Rush:</B> the phone number for a Rush financial counselor opens your Phone app,
              and the Rush billing email address opens your Mail app.
            </li>
          </ul>
          <p>
            When you tap one of these, the app does not send your answers, your result or anything else along with it.
            What happens next is between you and that service. Any information you give Rush, on its website, by
            phone, by email or in an application, is handled under Rush’s own privacy practices and its Notice of
            Privacy Practices, not this policy.
          </p>
        </Section>

        <Section title="Apple">
          <p>
            The app is downloaded from Apple’s App Store and runs on Apple’s iOS. Apple handles your App Store account
            and downloads. If you have chosen in your iPhone settings to share analytics with app developers, Apple
            may share anonymous crash reports and usage statistics about the app with us through App Store Connect.
            These do not identify you and do not include anything you entered in the app. Apple’s handling of this
            information is covered by <L href="https://www.apple.com/legal/privacy/">Apple’s Privacy Policy</L>.
          </p>
        </Section>

        <Section title="Health information and HIPAA">
          <p>
            Ellivia is not a health care provider, a health plan or a business associate of Rush, so it is not
            covered by HIPAA. Even so, we treat everything you enter as sensitive. That is why the app is built so
            your information never leaves your iPhone and so little of it is kept.
          </p>
        </Section>

        <Section title="Your choices in the app">
          <p>You are always in control of what the app keeps:</p>
          <ul>
            <li>
              <B>Delete one check:</B> on the Home screen, swipe left on a check under “Your checks” and tap Delete.
            </li>
            <li>
              <B>Delete everything:</B> go to Settings, then “Your data”, and tap <B>Delete all my data</B>. This
              erases every saved result, your apply-by date, your checklist picks and the app’s data file. It also
              removes any Ellivia notifications. This can’t be undone.
            </li>
            <li>
              <B>Delete the app:</B> deleting Ellivia from your iPhone removes everything it stored.
            </li>
            <li>
              <B>Turn off the camera:</B> in the iPhone Settings app, under Ellivia.
            </li>
          </ul>
          <p>
            The app has no accounts, so there is no account to delete. Because we never receive any information from
            the app, we have nothing from it to access, correct, export or delete on your behalf. All of it is on
            your iPhone, where you can delete it yourself at any time.
          </p>
        </Section>
      </Part>

      <Part title="Part 2: The Ellivia website and waitlist">
        <Section title="What we collect when you join the waitlist">
          <ul>
            <li>your name</li>
            <li>your email address</li>
            <li>the date and time you joined</li>
            <li>
              a record of your consent: the time you agreed to receive launch updates and which version of the
              consent wording you saw
            </li>
            <li>
              a short referral label (for example, “instagram” or “qr-flyer”) if you arrived through a link that
              included one. This tells us which outreach is working. It is not linked to any social media account.
            </li>
          </ul>
          <p>
            We do <B>not</B> collect phone numbers, addresses, medical records, hospital bills, insurance details,
            income or other financial information on the website. Please don’t send us any of that information.
          </p>
          <p>
            The savings example on our home page, where you can pick a household size and income range, runs entirely
            in your browser. Your choices there are never saved or sent to us.
          </p>
        </Section>

        <Section title="Information processed for security">
          <ul>
            <li>
              <B>Spam protection.</B> The signup form uses Cloudflare Turnstile to tell people apart from automated
              bots. Turnstile processes information about your browser, device and IP address under{' '}
              <L href="https://www.cloudflare.com/turnstile-privacy-policy/">Cloudflare’s Turnstile privacy policy</L>.
            </li>
            <li>
              <B>Rate limiting.</B> To prevent abuse, our signup service stores a one-way, keyed hash of your IP
              address with a timestamp. We don’t store your IP address itself in our database, and these hashes are
              deleted automatically after about 24 hours.
            </li>
            <li>
              <B>Hosting.</B> The website is hosted on GitHub Pages, and our database and signup service are hosted by
              Supabase. Like most online services, these providers may keep standard technical logs (such as IP
              addresses and request times) under their own privacy policies.
            </li>
          </ul>
          <p>
            The website doesn’t use cookies, analytics, advertising trackers or tracking pixels. If you arrive through
            a referral link, your browser keeps that label in session storage until you close the tab, so it is only
            sent to us if you choose to join.
          </p>
        </Section>

        <Section title="How we use waitlist information">
          <p>
            We use your name and email address only to send you updates about Ellivia’s launch, such as when the app
            becomes available, and to address those messages to you. We do not sell, rent or share your name or email
            address with anyone for marketing, and we don’t use them for advertising. Every launch email we send will
            include a way to stop receiving further messages.
          </p>
          <p>
            Your waitlist information is never connected to the Ellivia app. Joining the waitlist doesn’t give us any
            access to what you do in the app, and using the app doesn’t tell us whether you are on the waitlist.
          </p>
        </Section>

        <Section title="Who we share waitlist information with">
          <p>
            We share waitlist information only with the service providers that run the website for us: Supabase
            (database and signup service), Cloudflare (spam protection) and GitHub (website hosting). They process it
            only to provide those services. We do not share it with anyone else, unless the law requires us to.
          </p>
        </Section>

        <Section title="How waitlist information is stored and protected">
          <ul>
            <li>Your information is sent over an encrypted HTTPS connection.</li>
            <li>It is stored in a Supabase-hosted PostgreSQL database located in the United States.</li>
            <li>
              The public website can’t read the waitlist. Only our signup service can add entries, and only Ellivia’s
              project administrators can view the list through their Supabase account.
            </li>
          </ul>
          <p>No method of storing or sending information online is completely secure, but we work to keep access limited.</p>
        </Section>

        <Section title="How long we keep waitlist information">
          <p>
            We keep your name and email address until Ellivia has launched and we have finished sending launch
            updates, or until you ask us to delete them, whichever comes first. After that, we delete the waitlist. IP
            address hashes used for rate limiting are deleted after about 24 hours.
          </p>
        </Section>

        <Section title="Your choices for the waitlist">
          <ul>
            <li>
              <B>Stop emails:</B> use the link in any launch email, or email us.
            </li>
            <li>
              <B>Withdraw consent and delete your information:</B> email <Contact /> from the address you signed up
              with, so we can confirm it’s yours. We will remove your name and email address and confirm when it’s
              done.
            </li>
          </ul>
        </Section>
      </Part>

      <Part title="Part 3: For both the app and the website">
        <Section title="Your privacy rights">
          <p>
            Depending on where you live, including California and other U.S. states, you may have the right to know
            what personal information we have about you, to get a copy of it, to correct it, to have it deleted, and
            to not be treated differently for using these rights. We honor these requests for everyone, wherever you
            live.
          </p>
          <ul>
            <li>
              For the app, there is nothing for us to provide, because the app sends us nothing. You can delete
              everything yourself in the app.
            </li>
            <li>
              For the waitlist, email <Contact />. We aim to respond within 30 days.
            </li>
          </ul>
          <p>We do not sell or share personal information, and we do not use it for targeted advertising.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change how Ellivia handles information, we will update this policy and its effective date, and post
            the new version at <L href={privacyHref}>{PUBLIC_URL.replace('https://', '').replace(/\/$/, '')}</L>.
            The copy inside the app is updated with each app release. If the app ever needs to send any information
            off your iPhone, we will explain what and why in the app and ask for your permission first. If we make a
            significant change to how we use waitlist information, we will email the people on the waitlist before
            it takes effect.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            <B>The Ellivia team</B>
            <br />
            Email: <Contact />
          </p>
          <p>
            Please contact us with any questions about this policy, to make a privacy request, or to report a privacy
            concern. For questions about your bill or your financial assistance application, contact Rush directly.
            Rush’s financial counselors can be reached at the phone numbers and email address shown in the app.
          </p>
        </Section>
      </Part>
    </>
  )
}
