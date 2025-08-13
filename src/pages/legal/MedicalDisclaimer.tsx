import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

const MedicalDisclaimer: React.FC = () => {
  return (
    <LegalPageLayout 
      title="Medical Disclaimer" 
      description="Important information about the educational nature of PediaPredict"
    >
      <div className="space-y-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">⚠️ IMPORTANT MEDICAL DISCLAIMER</h2>
          <p className="text-lg font-semibold text-foreground">
            PediaPredict is NOT a medical device, diagnostic tool, or substitute for professional medical care.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Educational Purpose Only</h2>
          <p className="text-body mb-4">
            PediaPredict is designed exclusively as an educational health monitoring tool for schools and students. All features, assessments, and AI-generated insights are intended to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-body">
            <li><strong>Promote Health Awareness:</strong> Help students understand basic health concepts and lifestyle factors</li>
            <li><strong>Support Educational Initiatives:</strong> Assist schools in implementing health and wellness programs</li>
            <li><strong>Encourage Healthy Habits:</strong> Motivate positive lifestyle changes through engagement and tracking</li>
            <li><strong>Provide Population Insights:</strong> Help educators understand general health patterns in student populations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">What PediaPredict Is NOT</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-3">❌ NOT a Medical Device</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-body">
                <li>Not FDA-approved for medical diagnosis</li>
                <li>Not clinically validated for treatment decisions</li>
                <li>Not designed for medical use</li>
              </ul>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-3">❌ NOT Diagnostic</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-body">
                <li>Cannot diagnose medical conditions</li>
                <li>Cannot predict specific health outcomes</li>
                <li>Cannot replace clinical assessment</li>
              </ul>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-3">❌ NOT Medical Advice</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-body">
                <li>Recommendations are general in nature</li>
                <li>Not personalized medical guidance</li>
                <li>Not treatment recommendations</li>
              </ul>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-3">❌ NOT Emergency Care</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-body">
                <li>Cannot detect medical emergencies</li>
                <li>Not for urgent health situations</li>
                <li>Cannot replace emergency services</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">AI-Generated Insights Limitations</h2>
          <div className="space-y-4">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-warning mb-3">🤖 About Our AI Technology</h3>
              <p className="text-body mb-4">
                Our artificial intelligence system analyzes health assessment data to provide educational insights. However, AI has important limitations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li><strong>General Guidelines Only:</strong> AI recommendations are based on general health principles, not individual medical needs</li>
                <li><strong>No Medical Training:</strong> Our AI is not trained on medical data or for diagnostic purposes</li>
                <li><strong>Population-Based:</strong> Insights are derived from population-level health patterns, not clinical expertise</li>
                <li><strong>Context Limitations:</strong> AI cannot understand individual medical history, conditions, or circumstances</li>
                <li><strong>Evolving Technology:</strong> AI models are continuously improved but may have errors or biases</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">When to Consult Healthcare Professionals</h2>
          <div className="bg-success/10 border border-success/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-success mb-4">✅ Always Consult a Doctor For:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside space-y-2 text-body">
                <li><strong>Medical Concerns:</strong> Any health symptoms or concerns</li>
                <li><strong>Diagnosis:</strong> Suspected medical conditions</li>
                <li><strong>Treatment:</strong> Medical treatment decisions</li>
                <li><strong>Medication:</strong> Prescription or supplement advice</li>
                <li><strong>Chronic Conditions:</strong> Managing ongoing health issues</li>
              </ul>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li><strong>Emergencies:</strong> Any urgent health situation</li>
                <li><strong>Significant Changes:</strong> Notable changes in health status</li>
                <li><strong>Family History:</strong> Concerns about genetic conditions</li>
                <li><strong>Growth Concerns:</strong> Questions about child development</li>
                <li><strong>Mental Health:</strong> Emotional or psychological concerns</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Emergency Situations</h2>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-destructive mb-4">🚨 Medical Emergency Protocol</h3>
            <p className="text-body mb-4 font-semibold">
              PediaPredict cannot detect or respond to medical emergencies. For any emergency:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-body">
              <li><strong>Call Emergency Services Immediately:</strong> Dial 102 (India) or your local emergency number</li>
              <li><strong>Seek Immediate Medical Attention:</strong> Go to the nearest hospital or emergency room</li>
              <li><strong>Contact School Health Personnel:</strong> Notify school nurses or health coordinators</li>
              <li><strong>Inform Parents/Guardians:</strong> Contact student's emergency contacts</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Qualified Healthcare Professionals</h2>
          <p className="text-body mb-4">
            For appropriate medical care, consult qualified healthcare professionals including:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Primary Care</h4>
              <ul className="text-sm text-body space-y-1">
                <li>Pediatricians</li>
                <li>Family Physicians</li>
                <li>General Practitioners</li>
              </ul>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Specialists</h4>
              <ul className="text-sm text-body space-y-1">
                <li>Endocrinologists</li>
                <li>Nutritionists</li>
                <li>Child Psychologists</li>
              </ul>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">School Health</h4>
              <ul className="text-sm text-body space-y-1">
                <li>School Nurses</li>
                <li>Health Coordinators</li>
                <li>Counselors</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Age-Appropriate Considerations</h2>
          <div className="space-y-4">
            <p className="text-body">
              PediaPredict is designed for children and adolescents aged 6-17. Special considerations apply:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>Developmental Stages:</strong> Health needs vary significantly across age groups</li>
              <li><strong>Growth Patterns:</strong> Normal growth rates differ for each child</li>
              <li><strong>Parental Guidance:</strong> Younger children should use the app with adult supervision</li>
              <li><strong>Privacy Awareness:</strong> Older students should understand data privacy implications</li>
              <li><strong>School Policies:</strong> Follow institutional guidelines for health data collection</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Accuracy and Limitations</h2>
          <div className="space-y-4">
            <p className="text-body mb-4">
              While we strive for accuracy, PediaPredict data has inherent limitations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>Self-Reported Data:</strong> Information accuracy depends on user input</li>
              <li><strong>Measurement Variability:</strong> Home measurements may vary from clinical standards</li>
              <li><strong>Snapshot Assessment:</strong> Data represents point-in-time information, not ongoing monitoring</li>
              <li><strong>Algorithm Limitations:</strong> Risk calculations are estimates based on population data</li>
              <li><strong>Individual Variation:</strong> Results may not account for individual health factors</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">User Responsibility</h2>
          <div className="bg-info/10 border border-info/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-info mb-4">👥 Your Responsibility</h3>
            <p className="text-body mb-4">
              By using PediaPredict, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>You understand this is an educational tool, not medical advice</li>
              <li>You will seek professional medical advice for health concerns</li>
              <li>You will not rely solely on PediaPredict for health decisions</li>
              <li>You will supervise children's use of the application appropriately</li>
              <li>You will follow your school's health and wellness policies</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <p className="text-body mb-4">
              If you have questions about this medical disclaimer or need clarification about appropriate use:
            </p>
            <div className="space-y-2 text-body">
              <p><strong>Educational Support:</strong> support@doutly.com</p>
              <p><strong>Technical Questions:</strong> tech@doutly.com</p>
              <p><strong>Partnership Inquiries:</strong> JSS Science and Technology University</p>
              <p><strong>Emergency:</strong> Contact local emergency services (102 in India)</p>
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-6">
          <p className="text-caption text-center">
            <strong>Last Updated:</strong> December 2024<br/>
            By using PediaPredict, you acknowledge that you have read, understood, and agree to this Medical Disclaimer.
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default MedicalDisclaimer;