import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      description="How we protect and handle your personal health information"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
          <p className="text-body mb-4">
            PediaPredict, developed by Doutly in partnership with JSS Science and Technology University and JSS Academy of Higher Education & Research, is committed to protecting the privacy and security of student health information. This Privacy Policy explains how we collect, use, store, and protect your personal health data.
          </p>
          <p className="text-body">
            This policy complies with the Children's Online Privacy Protection Act (COPPA), the Family Educational Rights and Privacy Act (FERPA), and applicable data protection regulations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Data We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 text-body">
                <li>Name, age, and school affiliation</li>
                <li>Email address (for account management)</li>
                <li>User role (student or administrator)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Health Assessment Data</h3>
              <ul className="list-disc list-inside space-y-1 text-body">
                <li>Physical measurements (height, weight, BMI)</li>
                <li>Physical activity levels and habits</li>
                <li>Dietary patterns and eating behaviors</li>
                <li>Sleep quality and duration</li>
                <li>Mental health and wellness indicators</li>
                <li>Sedentary behavior patterns</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Technical Data</h3>
              <ul className="list-disc list-inside space-y-1 text-body">
                <li>Device information and browser type</li>
                <li>Usage analytics and interaction patterns</li>
                <li>Security logs and access records</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Purpose of Data Collection</h2>
          <p className="text-body mb-4">We collect and process student health data exclusively for:</p>
          <ul className="list-disc list-inside space-y-2 text-body">
            <li><strong>Educational Health Monitoring:</strong> Providing insights into student health patterns and obesity risk factors</li>
            <li><strong>Personalized Recommendations:</strong> Generating age-appropriate health guidance and wellness tips</li>
            <li><strong>Institutional Insights:</strong> Helping schools understand population health trends (aggregated data only)</li>
            <li><strong>Research and Development:</strong> Improving our AI models and health assessment tools (anonymized data only)</li>
            <li><strong>Safety and Security:</strong> Protecting user accounts and preventing unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Storage & Security</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Encryption & Protection</h3>
              <ul className="list-disc list-inside space-y-1 text-body">
                <li>All data is encrypted in transit using TLS 1.3</li>
                <li>Personal health information is encrypted at rest using AES-256</li>
                <li>Access controls limit data access to authorized personnel only</li>
                <li>Regular security audits and penetration testing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Data Location</h3>
              <p className="text-body">
                Data is stored on secure cloud infrastructure with multiple backups and disaster recovery protocols. Our hosting providers maintain SOC 2 Type II compliance and other industry security certifications.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">AI Disclaimer</h2>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 my-6">
            <p className="text-body font-medium">
              <strong>Important Medical Disclaimer:</strong> Our AI-generated insights and recommendations are for educational and informational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals before making any health-related decisions based on our assessments.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Data Protection (COPPA Compliance)</h2>
          <div className="space-y-4">
            <p className="text-body">
              We take special care to protect children's privacy in accordance with COPPA and Google Play's Families Policy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>Parental Consent:</strong> Schools act as intermediaries to obtain appropriate consent for student participation</li>
              <li><strong>Limited Data Collection:</strong> We collect only information necessary for health assessment purposes</li>
              <li><strong>No Behavioral Advertising:</strong> Children's data is never used for advertising or marketing purposes</li>
              <li><strong>Restricted Access:</strong> Only authorized school personnel and parents/guardians can access student health data</li>
              <li><strong>Data Minimization:</strong> We retain children's data only as long as necessary for educational purposes</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Integrations</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Service Providers</h3>
            <ul className="list-disc list-inside space-y-1 text-body">
              <li><strong>Firebase:</strong> Authentication and real-time database services</li>
              <li><strong>Google AI:</strong> Natural language processing for health insights (anonymized data only)</li>
              <li><strong>Vercel:</strong> Secure hosting and content delivery</li>
            </ul>
            <p className="text-body">
              All third-party providers are required to maintain equivalent security standards and privacy protections.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights & Data Control</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Right to Request Deletion</h3>
            <p className="text-body mb-4">
              Parents, guardians, and authorized school personnel can request deletion of student data at any time. To request data deletion:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-body">
              <li>Visit our <a href="/legal/data-deletion" className="text-primary hover:text-primary/80 underline">Data Deletion Request page</a></li>
              <li>Provide verification of your authority to make the request</li>
              <li>Specify which student data should be deleted</li>
              <li>We will process your request within 30 days</li>
            </ol>
            
            <h3 className="text-lg font-medium text-foreground mb-2 mt-6">Other Rights</h3>
            <ul className="list-disc list-inside space-y-1 text-body">
              <li>Right to access and review student health data</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to export data in a portable format</li>
              <li>Right to restrict certain data processing activities</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
          <p className="text-body mb-4">
            We retain student health data only as long as necessary for educational purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-body">
            <li><strong>Active Students:</strong> Data is retained while the student is enrolled and participating in the health monitoring program</li>
            <li><strong>Graduated Students:</strong> Individual data is deleted within 1 year after graduation unless otherwise requested</li>
            <li><strong>Withdrawn Consent:</strong> Data is deleted within 30 days of consent withdrawal</li>
            <li><strong>Aggregated Research Data:</strong> Anonymized, aggregated data may be retained for research purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <p className="text-body mb-4">
              For privacy-related questions, concerns, or requests, please contact us:
            </p>
            <div className="space-y-2 text-body">
              <p><strong>Email:</strong> privacy@doutly.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@doutly.com</p>
              <p><strong>Response Time:</strong> 48 hours for urgent privacy requests, 7 days for standard inquiries</p>
              <p><strong>Mailing Address:</strong> Doutly Privacy Team, JSS Science and Technology University Campus</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Policy Updates</h2>
          <p className="text-body">
            This Privacy Policy may be updated periodically to reflect changes in our practices or legal requirements. We will notify schools and users of significant changes through email and prominent notices in the application. The current version is always available at this URL with the last updated date.
          </p>
          <p className="text-caption mt-4">
            <strong>Last Updated:</strong> December 2024
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;