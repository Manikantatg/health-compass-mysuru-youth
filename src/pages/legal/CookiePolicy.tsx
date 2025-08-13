import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

const CookiePolicy: React.FC = () => {
  return (
    <LegalPageLayout 
      title="Cookie Policy" 
      description="How we use cookies and similar technologies"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
          <p className="text-body mb-4">
            Cookies are small text files stored on your device when you visit PediaPredict. They help us provide a secure, personalized experience and understand how our educational health platform is used by students and schools.
          </p>
          <p className="text-body">
            This Cookie Policy explains what cookies we use, why we use them, and how you can manage your cookie preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-success mb-3">🔒 Essential Cookies (Always Active)</h3>
              <p className="text-body mb-4">
                These cookies are necessary for PediaPredict to function and cannot be disabled:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li><strong>Authentication:</strong> Keep you logged in securely</li>
                <li><strong>Security:</strong> Protect against unauthorized access and CSRF attacks</li>
                <li><strong>Session Management:</strong> Maintain your session as you navigate</li>
                <li><strong>Form Data:</strong> Remember your assessment progress</li>
                <li><strong>Privacy Preferences:</strong> Remember your cookie consent choices</li>
              </ul>
              <div className="mt-4 text-sm bg-success/10 border border-success/20 rounded p-3">
                <strong>COPPA Note:</strong> Essential cookies for children contain no personal identifiers and are automatically deleted when the session ends.
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-info mb-3">📊 Functional Cookies (Optional)</h3>
              <p className="text-body mb-4">
                These cookies enhance your experience but are not essential:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li><strong>Language Preferences:</strong> Remember your preferred language</li>
                <li><strong>Theme Settings:</strong> Save dark/light mode preferences</li>
                <li><strong>Dashboard Layout:</strong> Remember customized dashboard configurations</li>
                <li><strong>Accessibility:</strong> Store accessibility preferences</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                These cookies help us provide a more personalized educational experience.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-warning mb-3">📈 Analytics Cookies (Optional)</h3>
              <p className="text-body mb-4">
                These cookies help us understand how PediaPredict is used for educational improvement:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li><strong>Usage Patterns:</strong> Which features are most helpful for students</li>
                <li><strong>Performance Monitoring:</strong> How quickly pages load and function</li>
                <li><strong>Error Tracking:</strong> Technical issues that affect user experience</li>
                <li><strong>Educational Effectiveness:</strong> How well health assessments engage students</li>
              </ul>
              <div className="mt-4 text-sm bg-warning/10 border border-warning/20 rounded p-3">
                <strong>Privacy Protection:</strong> All analytics data is anonymized and aggregated. No personal health information is included in analytics.
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
          <div className="space-y-4">
            <p className="text-body">
              PediaPredict integrates with trusted third-party services that may set their own cookies:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🔐 Firebase Authentication</h4>
                <ul className="text-sm text-body space-y-1">
                  <li><strong>Purpose:</strong> Secure user authentication</li>
                  <li><strong>Data:</strong> Authentication tokens only</li>
                  <li><strong>Retention:</strong> Session-based</li>
                  <li><strong>Privacy:</strong> <a href="https://firebase.google.com/support/privacy" className="text-primary hover:text-primary/80 underline">Firebase Privacy Policy</a></li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">☁️ Vercel Hosting</h4>
                <ul className="text-sm text-body space-y-1">
                  <li><strong>Purpose:</strong> Website delivery and performance</li>
                  <li><strong>Data:</strong> Technical performance metrics</li>
                  <li><strong>Retention:</strong> Limited technical data</li>
                  <li><strong>Privacy:</strong> <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:text-primary/80 underline">Vercel Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Special Protections for Children</h2>
          <div className="bg-info/10 border border-info/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-info mb-4">👶 COPPA-Compliant Cookie Usage</h3>
            <p className="text-body mb-4">
              We take special care with cookies for users under 13:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>Minimal Data Collection:</strong> Only essential cookies for basic functionality</li>
              <li><strong>No Behavioral Tracking:</strong> No cookies used for advertising or behavioral analysis</li>
              <li><strong>Automatic Deletion:</strong> Cookies are automatically cleared when sessions end</li>
              <li><strong>School Oversight:</strong> Schools can manage cookie preferences for student accounts</li>
              <li><strong>Parental Rights:</strong> Parents can request cookie data deletion at any time</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Your Cookie Preferences</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">🎛️ In-App Cookie Settings</h3>
              <p className="text-body mb-4">
                You can manage your cookie preferences directly in PediaPredict:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-body">
                <li>Go to Settings → Privacy & Data</li>
                <li>Click "Cookie Preferences"</li>
                <li>Toggle optional cookie categories on/off</li>
                <li>Save your preferences</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">🌐 Browser Settings</h3>
              <p className="text-body mb-4">
                You can also control cookies through your browser settings:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Chrome</h4>
                  <p className="text-sm text-body">Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Firefox</h4>
                  <p className="text-sm text-body">Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Safari</h4>
                  <p className="text-sm text-body">Preferences → Privacy → Manage Website Data</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Edge</h4>
                  <p className="text-sm text-body">Settings → Site Permissions → Cookies and site data</p>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6">
              <h4 className="font-semibold text-warning mb-3">⚠️ Important Note</h4>
              <p className="text-body">
                Disabling essential cookies may prevent PediaPredict from functioning properly. You may experience issues with login, data saving, and security features.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Cookie Retention Periods</h2>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead className="bg-surface">
                  <tr>
                    <th className="border border-border p-3 text-left">Cookie Type</th>
                    <th className="border border-border p-3 text-left">Retention Period</th>
                    <th className="border border-border p-3 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Session Cookies</td>
                    <td className="border border-border p-3">Deleted when browser closes</td>
                    <td className="border border-border p-3">Authentication & security</td>
                  </tr>
                  <tr className="bg-surface/50">
                    <td className="border border-border p-3">Preference Cookies</td>
                    <td className="border border-border p-3">30 days</td>
                    <td className="border border-border p-3">User preferences & settings</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Analytics Cookies</td>
                    <td className="border border-border p-3">24 months (anonymized)</td>
                    <td className="border border-border p-3">Service improvement</td>
                  </tr>
                  <tr className="bg-surface/50">
                    <td className="border border-border p-3">Security Cookies</td>
                    <td className="border border-border p-3">1 year</td>
                    <td className="border border-border p-3">Fraud prevention</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Protection and Privacy</h2>
          <div className="space-y-4">
            <p className="text-body">
              All cookies used by PediaPredict follow strict privacy protection standards:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>Data Minimization:</strong> We collect only necessary information</li>
              <li><strong>Purpose Limitation:</strong> Cookies are used only for stated purposes</li>
              <li><strong>Security:</strong> All cookie data is encrypted and secured</li>
              <li><strong>Transparency:</strong> You always know what cookies are active</li>
              <li><strong>Control:</strong> You can opt-out of non-essential cookies</li>
              <li><strong>Deletion Rights:</strong> You can request cookie data deletion</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
          <p className="text-body mb-4">
            We may update this Cookie Policy to reflect changes in our practices or legal requirements. When we make significant changes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-body">
            <li>Schools and administrators will be notified via email</li>
            <li>Updated policy will be prominently displayed in the app</li>
            <li>Users will be asked to review and accept changes</li>
            <li>Previous versions will be archived for reference</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us About Cookies</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <p className="text-body mb-4">
              If you have questions about our use of cookies or want to exercise your privacy rights:
            </p>
            <div className="space-y-2 text-body">
              <p><strong>Privacy Team:</strong> privacy@doutly.com</p>
              <p><strong>Technical Support:</strong> support@doutly.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@doutly.com</p>
              <p><strong>School Relations:</strong> schools@doutly.com</p>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Response Time:</strong> Privacy inquiries within 48 hours, technical questions within 24 hours</p>
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-6">
          <p className="text-caption text-center">
            <strong>Last Updated:</strong> December 2024<br/>
            <strong>Effective Date:</strong> December 2024
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default CookiePolicy;