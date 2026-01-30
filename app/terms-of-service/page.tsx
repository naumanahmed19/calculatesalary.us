import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for UK Salary Calculator. Please read these terms carefully before using our service.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  const lastUpdated = '27 January 2026'

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using UK Salary Calculator (&quot;the Site&quot;), you accept and agree to be bound 
              by these Terms of Service. If you do not agree to these terms, please do not use our Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              UK Salary Calculator provides free online tools to estimate take-home pay, income tax, 
              national insurance contributions, student loan repayments, and other salary-related calculations 
              for UK taxpayers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Disclaimer and Limitations</h2>
            <h3 className="text-lg font-medium text-foreground mb-2">For Informational Purposes Only</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The calculations provided by this Site are estimates based on standard UK tax rates and are 
              intended for informational and educational purposes only. They should not be considered as 
              financial, tax, or legal advice.
            </p>

            <h3 className="text-lg font-medium text-foreground mb-2">No Guarantee of Accuracy</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we strive to keep our tax rates and calculations up to date and accurate, we make no 
              representations or warranties of any kind, express or implied, about the completeness, 
              accuracy, reliability, or suitability of the information provided.
            </p>

            <h3 className="text-lg font-medium text-foreground mb-2">Individual Circumstances</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your actual tax liability may differ based on your individual circumstances, including but 
              not limited to: benefits in kind, multiple employments, self-employment income, pension 
              arrangements, marriage allowance, blind person&apos;s allowance, and other tax reliefs or 
              adjustments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Professional Advice</h2>
            <p className="text-muted-foreground leading-relaxed">
              For accurate tax calculations and advice specific to your situation, you should:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Consult HM Revenue &amp; Customs (HMRC) directly</li>
              <li>Seek advice from a qualified accountant or tax advisor</li>
              <li>Contact a Citizens Advice Bureau</li>
              <li>Use HMRC&apos;s official online services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, UK Salary Calculator and its operators shall not be 
              liable for any direct, indirect, incidental, special, consequential, or exemplary damages 
              arising from:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Use or inability to use the Site</li>
              <li>Reliance on any information provided by the Site</li>
              <li>Errors or omissions in calculations</li>
              <li>Any actions taken based on the results of our calculators</li>
              <li>Financial decisions made using our tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The content, design, and code of this Site are protected by copyright and other intellectual 
              property rights. You may not reproduce, distribute, or create derivative works without our 
              express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Site</li>
              <li>Use automated systems or software to extract data from the Site</li>
              <li>Misrepresent your identity or affiliation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Third-Party Links and Advertisements</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Site may contain links to third-party websites and display advertisements from third-party 
              networks. We are not responsible for the content, privacy practices, or terms of any third-party 
              sites. Your use of such sites is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not guarantee that the Site will be available at all times or that it will be free from 
              errors or interruptions. We reserve the right to modify, suspend, or discontinue any part of 
              the Site without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting to the Site. Your continued use of the Site following any changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of 
              England and Wales. Any disputes arising from these terms shall be subject to the exclusive 
              jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">12. Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall 
              be limited or eliminated to the minimum extent necessary, and the remaining provisions shall 
              continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at: 
              legal@myincomecalculator.co.uk
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
