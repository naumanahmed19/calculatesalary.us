import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for UK Salary Calculator. Learn how we collect, use, and protect your personal information.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = '27 January 2026'

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              US Salary Calculator (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit
              our website calculatesalary.us (the &quot;Site&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-foreground mb-2">Information You Provide</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our salary calculator operates entirely in your browser. We do not store any salary information 
              you enter into the calculator. All calculations are performed locally on your device.
            </p>
            
            <h3 className="text-lg font-medium text-foreground mb-2">Automatically Collected Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you visit our Site, we may automatically collect certain information including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Device and browser type</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>General location (country/region level)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar technologies for the following purposes:
            </p>
            
            <h3 className="text-lg font-medium text-foreground mb-2">Essential Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies are necessary for the Site to function properly. They include cookies that 
              remember your cookie consent preferences.
            </p>

            <h3 className="text-lg font-medium text-foreground mb-2">Analytics Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use Vercel Analytics to understand how visitors interact with our Site. This helps us 
              improve our service. You can opt out of analytics cookies through the cookie banner.
            </p>

            <h3 className="text-lg font-medium text-foreground mb-2">Advertising Cookies</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may display advertisements on our Site through third-party advertising partners. These 
              partners may use cookies to serve relevant advertisements based on your browsing activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Provide and maintain our salary calculator service</li>
              <li>Understand how visitors use our Site</li>
              <li>Improve our Site and user experience</li>
              <li>Display relevant advertisements</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Vercel Analytics:</strong> Website analytics and performance monitoring</li>
              <li><strong>Google AdSense:</strong> Advertising (if applicable)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These services may collect information as described in their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you are a resident of the UK or European Economic Area, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time via the cookie banner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain automatically collected information for analytics purposes for up to 26 months. 
              We do not retain any salary or financial information you enter into the calculator.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your information. 
              Our Site uses HTTPS encryption to secure data transmission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Site is not intended for children under 16 years of age. We do not knowingly collect 
              personal information from children under 16.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or wish to exercise your rights, 
              please contact us at: privacy@calculatesalary.us
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
