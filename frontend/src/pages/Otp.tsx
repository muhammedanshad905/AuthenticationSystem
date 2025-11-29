import { useState, useRef } from 'react';
import { register, verifyOtp } from '../api/clientApi';
import { useNavigate } from 'react-router-dom';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedOtp = value.split('').slice(0, 4);
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 4) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      const nextIndex = Math.min(index + pastedOtp.length, 3);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    const tempUser = localStorage.getItem('tempUser');
    if(tempUser) {
      const stored = JSON.parse(tempUser);
      const data = {
        email: stored.email,
        otp: otpString
      }
      console.log('OTP submitted:', otpString, stored.email);
      const res = await verifyOtp(data);
      if(res) {
        await register(stored)
        localStorage.removeItem('tempUser');
        navigate('/login');
      }
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              OTP Verification
            </h2>
            <p className="text-gray-600 mb-8">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={!isOtpComplete}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isOtpComplete
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                } focus:outline-none focus:ring-offset-2`}
              >
                Verify OTP
              </button>
            </div>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button className="text-blue-600 hover:text-blue-500 font-medium">
                Resend OTP
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
