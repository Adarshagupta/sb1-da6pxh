import React from 'react';
import { SEO } from '../common/SEO';
import { Shield, Lock, Database, Globe, Bell, UserCheck, FileText, AlertTriangle, HelpCircle } from 'lucide-react';

export const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <>
      <SEO 
        title="Privacy Policy | BookAI"
        description="BookAI's privacy policy explains how we collect, use, and protect your personal information."
        ogType="website"
      />
      <div className="min-h-screen bg-white md:bg-gradient-to-br md:from-indigo-50 md:via-purple-50 md:to-pink-50 p-2 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white md:bg-white/80 md:backdrop-blur-sm rounded-2xl md:shadow-xl p-4 md:p-8 md:border md:border-white/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-xl">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Privacy Policy</h1>
                <p className="text-sm text-gray-600">Last updated: {lastUpdated}</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Introduction</h2>
                </div>
                <p>
                  At BookAI, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy outlines our practices for collecting, using, maintaining, and disclosing information 
                  collected from users of our AI-powered book generation platform.
                </p>
                <p>
                  By using BookAI, you agree to the collection and use of information in accordance with this policy. 
                  We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Information Collection and Use</h2>
                </div>
                <h3>Personal Information</h3>
                <p>We collect several types of information for various purposes:</p>
                <ul>
                  <li>Email address (for account creation and communication)</li>
                  <li>Name and profile information</li>
                  <li>Authentication data</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Generated content and book data</li>
                  <li>Usage statistics and preferences</li>
                </ul>

                <h3>Usage Data</h3>
                <p>We automatically collect usage information when you use our service:</p>
                <ul>
                  <li>Browser type and version</li>
                  <li>Time spent on pages</li>
                  <li>Unique device identifiers</li>
                  <li>Operating system</li>
                  <li>Pages visited</li>
                  <li>Time and date of visits</li>
                  <li>Error logs and performance data</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Data Security</h2>
                </div>
                <p>
                  We implement robust security measures to protect your personal information:
                </p>
                <ul>
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure data storage on Google Cloud Platform</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Encrypted backups</li>
                  <li>Monitoring for suspicious activities</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Third-Party Services</h2>
                </div>
                <p>We use the following third-party services:</p>
                <ul>
                  <li>Google Analytics (Usage tracking and analytics)</li>
                  <li>Firebase Authentication (User authentication)</li>
                  <li>Stripe (Payment processing)</li>
                  <li>Together AI API (Content generation)</li>
                  <li>Google Cloud Platform (Infrastructure)</li>
                </ul>
                <p>
                  Each third-party service has its own Privacy Policy governing the use of your information. 
                  We recommend reviewing their policies as well.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Communications</h2>
                </div>
                <p>We may contact you for:</p>
                <ul>
                  <li>Service updates and new features</li>
                  <li>Security alerts</li>
                  <li>Marketing communications (with consent)</li>
                  <li>Customer support</li>
                  <li>Account notifications</li>
                </ul>
                <p>
                  You can opt out of marketing communications at any time through your account settings.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Your Data Rights</h2>
                </div>
                <p>Under GDPR and other privacy laws, you have the right to:</p>
                <ul>
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                  <li>Lodge a complaint with supervisory authorities</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Data Retention</h2>
                </div>
                <p>
                  We retain your personal information for as long as necessary to:
                </p>
                <ul>
                  <li>Provide our services</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                </ul>
                <p>
                  When data is no longer needed, it is securely deleted or anonymized.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold m-0">Contact Us</h2>
                </div>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul>
                  <li>Email: privacy@bookai.app</li>
                  <li>Website: https://bookai.app/contact</li>
                  <li>Address: [Your Business Address]</li>
                </ul>
                <p>
                  For urgent privacy concerns, we aim to respond within 24 hours.
                </p>
              </section>

              <section className="border-t pt-8">
                <p className="text-sm text-gray-600">
                  This privacy policy is effective as of {lastUpdated} and will remain in effect except 
                  with respect to any changes in its provisions in the future, which will be in effect 
                  immediately after being posted on this page. We reserve the right to update or change 
                  our Privacy Policy at any time and you should check this Privacy Policy periodically.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 