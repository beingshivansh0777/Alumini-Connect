import React, { useState, useEffect } from 'react';
import { Heart, CreditCard, Gift, TrendingUp, Users } from 'lucide-react';
import { User, Donation } from '../../types';
import { saveDonation, getDonations, getAlumniProfileByUserId } from '../../utils/localStorage';

interface DonationPageProps {
  user: User;
}

export const DonationPage: React.FC<DonationPageProps> = ({ user }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  useEffect(() => {
    setDonations(getDonations());
    if (user.role === 'alumni') {
      const profile = getAlumniProfileByUserId(user.id);
      setUserProfile(profile);
    }
  }, [user]);

  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalDonors = donations.length;
  const myDonations = donations.filter(d => d.donorId === user.id);
  const myTotalDonated = myDonations.reduce((sum, donation) => sum + donation.amount, 0);

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);

    // Simulate Razorpay payment process
    setTimeout(() => {
      const donation: Donation = {
        id: `donation-${Date.now()}`,
        donorId: user.id,
        donorName: userProfile?.name || user.email.split('@')[0],
        donorEmail: user.email,
        amount: parseFloat(amount),
        message: message.trim() || undefined,
        paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date().toISOString(),
      };

      saveDonation(donation);
      setDonations([...donations, donation]);
      
      setAmount('');
      setMessage('');
      setIsProcessing(false);
      
      alert('Thank you for your generous donation!');
    }, 2000);
  };

  const stats = [
    {
      title: 'Total Raised',
      value: `₹${totalRaised.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Donors',
      value: totalDonors,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'My Donations',
      value: myDonations.length,
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      title: 'My Total',
      value: `₹${myTotalDonated.toLocaleString()}`,
      icon: Gift,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Your Alma Mater</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your contributions help fund scholarships, infrastructure improvements, and programs 
          that benefit current and future students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-500" />
            Make a Donation
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (₹)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {presetAmounts.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors duration-200 ${
                      amount === preset.toString()
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Leave a message with your donation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleDonate}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-red-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Donate ₹{amount ? parseFloat(amount).toLocaleString() : '0'}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              This is a demo payment using Razorpay sandbox mode. No real money will be charged.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {donations.slice().reverse().slice(0, 10).map((donation) => (
              <div key={donation.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{donation.donorName}</p>
                  <p className="text-lg font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                  {donation.message && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{donation.message}"</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {donations.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Gift className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No donations yet</p>
                <p className="text-sm">Be the first to contribute!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {user.role === 'alumni' && myDonations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Donation History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myDonations.slice().reverse().map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.paymentId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {donation.message || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};