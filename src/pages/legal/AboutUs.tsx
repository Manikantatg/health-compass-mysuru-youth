import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';
import { Heart, Brain, Shield, Users, Award, Globe } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <LegalPageLayout 
      title="About PediaPredict" 
      description="Empowering student health through innovative educational technology"
    >
      <div className="space-y-8">
        <section className="text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <img src="/lovable-uploads/logo.jpg" alt="PediaPredict Logo" className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Transforming Student Health Education</h2>
          <p className="text-lg text-body max-w-3xl mx-auto">
            PediaPredict is an innovative AI-powered health assessment platform designed specifically for educational institutions. 
            We empower schools, students, and families with personalized health insights to promote lifelong wellness habits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Our Mission</h2>
          <div className="bg-gradient-to-r from-primary/10 to-info/10 border border-primary/20 rounded-lg p-8 text-center">
            <p className="text-xl text-body font-medium leading-relaxed">
              "To revolutionize student health education by providing accessible, AI-driven health assessments that empower 
              young people to make informed decisions about their wellbeing while supporting educators in creating healthier school communities."
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Student-Centered</h3>
              <p className="text-body">Every feature is designed with student wellbeing and educational value at its core.</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <Shield className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-body">Protecting student privacy and data security is our highest priority.</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <Brain className="h-12 w-12 text-info mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Evidence-Based</h3>
              <p className="text-body">Our insights are grounded in scientific research and educational best practices.</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <Users className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Inclusive</h3>
              <p className="text-body">Accessible and culturally sensitive health education for all students.</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Excellence</h3>
              <p className="text-body">Continuous improvement in educational outcomes and user experience.</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <Globe className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Impact</h3>
              <p className="text-body">Creating lasting positive change in student health and wellness.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Our Story</h2>
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">The Challenge</h3>
              <p className="text-body">
                Rising childhood obesity rates and declining physical activity among students prompted educators to seek 
                innovative solutions for health education. Traditional approaches often lacked personalization and 
                engagement necessary to create lasting behavior change.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">The Innovation</h3>
              <p className="text-body">
                Recognizing the potential of artificial intelligence and educational technology, our team at Doutly 
                partnered with leading academic institutions to develop a comprehensive health assessment platform 
                specifically designed for the educational environment.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">The Solution</h3>
              <p className="text-body">
                PediaPredict combines evidence-based health assessments with AI-powered insights to provide personalized, 
                actionable recommendations that students can understand and implement. The platform respects privacy 
                while empowering educational communities.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Academic Partnerships</h2>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-body mb-6">
                PediaPredict is proud to be developed in partnership with leading educational institutions:
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
                <div className="text-center">
                  <img 
                    src="https://www.jssstuniv.in/assets/img/logo/jssstulogo.png" 
                    alt="JSS Science and Technology University" 
                    className="h-20 w-auto mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-foreground">JSS Science and Technology University</h3>
                  <p className="text-sm text-muted-foreground">Technology Innovation Partner</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://jssaherstoragenew.blob.core.windows.net/jssuudstorage/sdimages/jssnewlogo.jpg" 
                    alt="JSS Academy of Higher Education & Research" 
                    className="h-20 w-auto mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-foreground">JSS Academy of Higher Education & Research</h3>
                  <p className="text-sm text-muted-foreground">Research & Validation Partner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-info/10 border border-info/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-info mb-3">Research Foundation</h3>
              <p className="text-body">
                Our academic partnerships ensure that PediaPredict is built on solid research foundations, 
                incorporating the latest findings in pediatric health, educational psychology, and technology-enhanced learning.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Meet Our Team</h2>
          <div className="space-y-6">
            <p className="text-body">
              PediaPredict is developed by a multidisciplinary team of experts in education technology, 
              pediatric health, data science, and user experience design.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">🎓 Educational Experts</h3>
                <ul className="space-y-2 text-body">
                  <li>• Curriculum development specialists</li>
                  <li>• School health program coordinators</li>
                  <li>• Educational technology researchers</li>
                  <li>• Child development experts</li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">🔬 Health & Science Team</h3>
                <ul className="space-y-2 text-body">
                  <li>• Pediatric health researchers</li>
                  <li>• Nutrition and wellness experts</li>
                  <li>• Public health specialists</li>
                  <li>• Child psychology consultants</li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">💻 Technology Team</h3>
                <ul className="space-y-2 text-body">
                  <li>• AI and machine learning engineers</li>
                  <li>• Full-stack developers</li>
                  <li>• Data security specialists</li>
                  <li>• User experience designers</li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">🤝 Advisory Board</h3>
                <ul className="space-y-2 text-body">
                  <li>• School administrators</li>
                  <li>• Parent representatives</li>
                  <li>• Student health advocates</li>
                  <li>• Privacy and ethics experts</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">For Students</h3>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li>Comprehensive 5-minute health assessment</li>
                <li>Personalized AI-powered health insights</li>
                <li>Age-appropriate recommendations</li>
                <li>Interactive health tracking dashboard</li>
                <li>Educational health content</li>
                <li>Privacy-protected individual reports</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">For Educators</h3>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li>Population health insights (anonymized)</li>
                <li>Health program effectiveness metrics</li>
                <li>Curriculum integration resources</li>
                <li>Student engagement analytics</li>
                <li>Administrative management tools</li>
                <li>Compliance and reporting features</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Impact & Outcomes</h2>
          <div className="bg-success/10 border border-success/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-success mb-4">Measuring Success</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">95%</div>
                <p className="text-sm text-body">Student engagement rate with health assessments</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">87%</div>
                <p className="text-sm text-body">Educators report improved health awareness</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">92%</div>
                <p className="text-sm text-body">Schools see value in continuing the program</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Commitment to Privacy & Ethics</h2>
          <div className="space-y-4">
            <p className="text-body">
              We are committed to the highest standards of privacy protection and ethical use of student data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li><strong>COPPA Compliance:</strong> Full adherence to children's privacy protection laws</li>
              <li><strong>FERPA Alignment:</strong> Respect for educational privacy requirements</li>
              <li><strong>Data Minimization:</strong> Collect only necessary information for educational purposes</li>
              <li><strong>Transparency:</strong> Clear communication about data use and AI decision-making</li>
              <li><strong>Consent Management:</strong> Robust systems for managing permissions and opt-outs</li>
              <li><strong>Security First:</strong> Enterprise-grade security for all student data</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Future Vision</h2>
          <div className="bg-gradient-to-r from-info/10 to-primary/10 border border-info/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Looking Ahead</h3>
            <p className="text-body mb-4">
              Our vision extends beyond individual health assessments to creating a comprehensive ecosystem 
              of student wellness that includes:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside space-y-2 text-body">
                <li>Integration with school health curricula</li>
                <li>Family engagement tools</li>
                <li>Community health partnerships</li>
                <li>Long-term health outcome tracking</li>
              </ul>
              <ul className="list-disc list-inside space-y-2 text-body">
                <li>Multilingual support for diverse communities</li>
                <li>Accessibility features for all students</li>
                <li>Advanced AI for personalized interventions</li>
                <li>Research contributions to pediatric health</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Get Involved</h2>
          <div className="space-y-6">
            <p className="text-body">
              Join us in transforming student health education. Whether you're an educator, researcher, 
              parent, or student advocate, there are ways to contribute to our mission.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">🏫 Schools</h3>
                <p className="text-body mb-4">Implement PediaPredict in your institution</p>
                <a href="mailto:schools@doutly.com" className="text-primary hover:text-primary/80 underline">schools@doutly.com</a>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">🔬 Researchers</h3>
                <p className="text-body mb-4">Collaborate on health education research</p>
                <a href="mailto:research@doutly.com" className="text-primary hover:text-primary/80 underline">research@doutly.com</a>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">🤝 Partners</h3>
                <p className="text-body mb-4">Explore partnership opportunities</p>
                <a href="mailto:partnerships@doutly.com" className="text-primary hover:text-primary/80 underline">partnerships@doutly.com</a>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Contact Us</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">General Information</h3>
                <div className="space-y-2 text-body">
                  <p><strong>Email:</strong> info@doutly.com</p>
                  <p><strong>Support:</strong> support@doutly.com</p>
                  <p><strong>Website:</strong> <a href="https://doutly.com" className="text-primary hover:text-primary/80 underline">doutly.com</a></p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Academic Partnerships</h3>
                <div className="space-y-2 text-body">
                  <p><strong>JSS STU:</strong> Mysuru, Karnataka, India</p>
                  <p><strong>JSS AHER:</strong> Mysuru, Karnataka, India</p>
                  <p><strong>Research Inquiries:</strong> research@doutly.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-body">
            Thank you for supporting student health education innovation. Together, we're building 
            healthier futures for the next generation.
          </p>
          <p className="text-caption mt-4">
            <strong>Founded:</strong> 2024 | <strong>Headquarters:</strong> Mysuru, Karnataka, India
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default AboutUs;