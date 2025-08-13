import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

const TermsOfService: React.FC = () => {
  return (
    <LegalPageLayout 
      title="Terms of Service" 
      description="Legal terms and conditions for using PediaPredict"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
          <p className="text-body mb-4">
            By accessing and using PediaPredict ("the Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms apply to all users of the Service, including students, parents, guardians, teachers, and school administrators.
          </p>
          <p className="text-body">
            PediaPredict is developed by Doutly in partnership with JSS Science and Technology University and JSS Academy of Higher Education & Research for educational health monitoring purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Scope of Use</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Authorized Users</h3>
            <p className="text-body mb-4">
              Access to student health data is restricted to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>Students:</strong> May access only their own health assessment data</li>
              <li><strong>Parents/Guardians:</strong> May access their child's health data with proper verification</li>
              <li><strong>Authorized School Staff:</strong> May access aggregated data and individual student data as permitted by school policy</li>
              <li><strong>School Administrators:</strong> May access population health insights and manage user accounts</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mb-2 mt-6">Educational Purpose Only</h3>
            <p className="text-body">
              PediaPredict is designed exclusively for educational health monitoring and wellness promotion in school settings. It is not intended for clinical diagnosis, medical treatment, or commercial health services.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">User Responsibilities</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Accurate Information</h3>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Provide accurate and truthful health assessment information</li>
              <li>Update personal information when it changes</li>
              <li>Report any suspected data inaccuracies promptly</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Account Security</h3>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Maintain confidentiality of login credentials</li>
              <li>Log out of shared devices after use</li>
              <li>Report unauthorized access immediately</li>
              <li>Use strong, unique passwords</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Compliance with Laws</h3>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Comply with all applicable local, state, and federal laws</li>
              <li>Respect privacy rights of other students</li>
              <li>Follow school policies regarding health data sharing</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
          <p className="text-body mb-4">
            The following activities are strictly prohibited:
          </p>
          <ul className="list-disc list-inside space-y-2 text-body">
            <li><strong>Data Misuse:</strong> Sharing, selling, or redistributing student health data</li>
            <li><strong>Unauthorized Access:</strong> Attempting to access data belonging to other users</li>
            <li><strong>Reverse Engineering:</strong> Attempting to decode, decompile, or reverse engineer the Service</li>
            <li><strong>Commercial Use:</strong> Using the Service for commercial health services or profit</li>
            <li><strong>False Information:</strong> Deliberately providing false or misleading health information</li>
            <li><strong>System Interference:</strong> Attempting to interfere with or disrupt the Service</li>
            <li><strong>Automated Access:</strong> Using bots, scrapers, or automated tools without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Medical and Educational Disclaimers</h2>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Medical Disclaimer</h3>
            <p className="text-body mb-4">
              <strong>PediaPredict is not a medical device or diagnostic tool.</strong> All health assessments, AI-generated insights, and recommendations are for educational and informational purposes only.
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Do not use PediaPredict results for medical diagnosis</li>
              <li>Always consult qualified healthcare professionals for medical concerns</li>
              <li>Emergency medical situations require immediate professional medical attention</li>
              <li>AI-generated recommendations may not be appropriate for all individuals</li>
            </ul>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 my-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Educational Disclaimer</h3>
            <p className="text-body">
              PediaPredict is designed to support educational health initiatives but does not replace professional health education or counseling services provided by qualified school health professionals.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Ownership and Usage Rights</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Student Data Ownership</h3>
            <p className="text-body mb-4">
              Students and their parents/guardians retain ownership of all personal health data. Schools have limited usage rights for educational purposes only.
            </p>
            
            <h3 className="text-lg font-medium text-foreground mb-2">Aggregated Data Usage</h3>
            <p className="text-body mb-4">
              Doutly may use anonymized, aggregated data for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-body">
              <li>Improving AI models and health assessment accuracy</li>
              <li>Research on childhood obesity prevention</li>
              <li>Publishing anonymized population health insights</li>
              <li>Service enhancement and feature development</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Service Availability</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Uptime and Maintenance</h3>
            <p className="text-body mb-4">
              While we strive for 99.9% uptime, PediaPredict may be temporarily unavailable due to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-body">
              <li>Scheduled maintenance and updates</li>
              <li>Emergency security patches</li>
              <li>Infrastructure improvements</li>
              <li>Unforeseen technical issues</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mb-2">Service Modifications</h3>
            <p className="text-body">
              We reserve the right to modify, update, or discontinue features of the Service with appropriate notice to users and school administrators.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
          <p className="text-body mb-4">
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc list-inside space-y-2 text-body">
            <li><strong>No Medical Liability:</strong> Doutly is not liable for any health-related decisions made based on Service recommendations</li>
            <li><strong>Educational Limitation:</strong> The Service does not guarantee any specific educational or health outcomes</li>
            <li><strong>Data Accuracy:</strong> While we strive for accuracy, we cannot guarantee the completeness or correctness of all data</li>
            <li><strong>Third-Party Services:</strong> We are not responsible for the performance or policies of integrated third-party services</li>
            <li><strong>Damages Cap:</strong> Our liability is limited to the fees paid for the Service in the preceding 12 months</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Account Termination</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-2">Termination Rights</h3>
            <p className="text-body mb-4">
              We may suspend or terminate accounts for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-body">
              <li>Violation of these Terms of Service</li>
              <li>Suspected fraudulent or malicious activity</li>
              <li>Extended period of inactivity (2+ years)</li>
              <li>Request from school administrators</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mb-2">Data Upon Termination</h3>
            <p className="text-body">
              Upon account termination, personal data will be deleted according to our Privacy Policy retention schedule, unless longer retention is required by law or requested by the school.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibent text-foreground mb-4">Governing Law</h2>
          <p className="text-body mb-4">
            These Terms are governed by the laws of India and the educational regulations applicable to JSS Science and Technology University. Any disputes will be resolved through:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-body">
            <li>Good faith negotiation between parties</li>
            <li>Mediation through educational institution channels</li>
            <li>Arbitration under Indian Arbitration laws if necessary</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <p className="text-body mb-4">
              For questions about these Terms of Service:
            </p>
            <div className="space-y-2 text-body">
              <p><strong>Email:</strong> legal@doutly.com</p>
              <p><strong>Support:</strong> support@doutly.com</p>
              <p><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</p>
              <p><strong>Emergency Contact:</strong> For urgent security or privacy issues</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
          <p className="text-body">
            We may update these Terms periodically. Significant changes will be communicated to users and school administrators via email and in-app notifications at least 30 days before taking effect. Continued use of the Service after changes constitutes acceptance of updated Terms.
          </p>
          <p className="text-caption mt-4">
            <strong>Last Updated:</strong> December 2024<br/>
            <strong>Effective Date:</strong> December 2024
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfService;