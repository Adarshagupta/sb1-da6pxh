import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Loader } from 'lucide-react';
import { 
  getAuth, 
  multiFactor, 
  PhoneAuthProvider, 
  PhoneMultiFactorGenerator,
  RecaptchaVerifier 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const MFASettings = () => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    checkMFAStatus();
    // Initialize RecaptchaVerifier
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
    setRecaptchaVerifier(verifier);

    return () => {
      verifier.clear();
    };
  }, []);

  const checkMFAStatus = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const enrolledFactors = multiFactor(user).enrolledFactors;
        setIsEnrolled(enrolledFactors.length > 0);
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEnrollment = async () => {
    if (!auth.currentUser || !recaptchaVerifier) return;
    
    try {
      setEnrolling(true);
      const session = await multiFactor(auth.currentUser).getSession();
      
      // Request verification code
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );
      
      setVerificationId(verificationId);
      setShowVerification(true);
    } catch (error) {
      console.error('Error starting MFA enrollment:', error);
      alert('Failed to start MFA enrollment. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const completeEnrollment = async () => {
    if (!auth.currentUser) return;
    
    try {
      setEnrolling(true);
      
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      
      await multiFactor(auth.currentUser).enroll(multiFactorAssertion, "Phone Number");
      
      setIsEnrolled(true);
      setShowVerification(false);
      alert('MFA enrolled successfully!');
    } catch (error) {
      console.error('Error completing MFA enrollment:', error);
      alert('Failed to complete MFA enrollment. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const unenrollMFA = async () => {
    if (!auth.currentUser) return;
    
    try {
      setEnrolling(true);
      const enrolledFactors = multiFactor(auth.currentUser).enrolledFactors;
      
      if (enrolledFactors.length > 0) {
        await multiFactor(auth.currentUser).unenroll(enrolledFactors[0]);
        setIsEnrolled(false);
        alert('MFA has been disabled.');
      }
    } catch (error) {
      console.error('Error unenrolling MFA:', error);
      alert('Failed to disable MFA. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Shield className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
      </div>

      {isEnrolled ? (
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-3 mb-3">
            <Smartphone className="w-5 h-5 text-green-600" />
            <p className="text-green-600 font-medium">MFA is enabled</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Your account is protected with two-factor authentication.
          </p>
          <button
            onClick={unenrollMFA}
            disabled={enrolling}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            {enrolling ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Disabling MFA...</span>
              </div>
            ) : (
              'Disable MFA'
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          {!showVerification ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={startEnrollment}
                disabled={enrolling || !phoneNumber}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {enrolling ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </div>
                ) : (
                  'Enable MFA'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the verification code sent to your phone.
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVerification(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={completeEnrollment}
                  disabled={enrolling || !verificationCode}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {enrolling ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Add recaptcha container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}; 