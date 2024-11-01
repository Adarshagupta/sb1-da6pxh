import React from 'react';
import { User, Coins, BookOpen, Clock, Settings2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, getUserTokens, updateUserTokens } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const tokenPackages = [
  { tokens: 1000, price: 4.99, popular: false },
  { tokens: 5000, price: 19.99, popular: true },
  { tokens: 10000, price: 34.99, popular: false }
];

export const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    totalBooks: 0,
    totalWords: 0,
    favoriteGenre: '',
    lastGenerated: null as Date | null
  });

  React.useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    const booksQuery = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(booksQuery);
    const books = querySnapshot.docs.map(doc => doc.data());

    // Calculate statistics
    const genreCounts: { [key: string]: number } = {};
    let totalWords = 0;

    books.forEach(book => {
      genreCounts[book.settings.genre] = (genreCounts[book.settings.genre] || 0) + 1;
      totalWords += book.content.split(/\s+/).length;
    });

    const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    setStats({
      totalBooks: books.length,
      totalWords: totalWords,
      favoriteGenre,
      lastGenerated: books[0]?.createdAt?.toDate() || null
    });
  };

  const handlePurchase = async (pkg: typeof tokenPackages[0]) => {
    // In a real app, integrate with a payment processor here
    const confirmed = window.confirm(
      `Purchase ${pkg.tokens} tokens for $${pkg.price}?\n\nThis is a demo - no real payment will be processed.`
    );

    if (confirmed && user) {
      try {
        // Add tokens to user's account
        const currentTokens = await getUserTokens(user.uid);
        await updateUserTokens(user.uid, currentTokens + pkg.tokens);
        alert('Tokens purchased successfully!');
      } catch (error) {
        console.error('Error purchasing tokens:', error);
        alert('Failed to purchase tokens');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 md:p-6 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 md:p-4 bg-indigo-100 rounded-full">
                <User className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Profile</h1>
                <p className="text-sm md:text-base text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/settings"
              className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            >
              <Settings2 className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6" />}
            title="Total Books"
            value={stats.totalBooks.toString()}
            color="indigo"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 md:w-6 md:h-6" />}
            title="Total Words"
            value={stats.totalWords.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6" />}
            title="Favorite Genre"
            value={stats.favoriteGenre || 'N/A'}
            color="pink"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 md:w-6 md:h-6" />}
            title="Last Generated"
            value={stats.lastGenerated?.toLocaleDateString() || 'Never'}
            color="amber"
          />
        </div>

        {/* Token Packages */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 border border-white/20">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Purchase Tokens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tokenPackages.map((pkg, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-4 md:p-6 ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <Coins className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 ${pkg.popular ? 'text-white' : 'text-indigo-600'}`} />
                  <h3 className={`text-lg md:text-2xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-gray-800'}`}>
                    {pkg.tokens.toLocaleString()} Tokens
                  </h3>
                  <p className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${pkg.popular ? 'text-white' : 'text-gray-800'}`}>
                    ${pkg.price}
                  </p>
                  <button
                    onClick={() => handlePurchase(pkg)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm md:text-base ${
                      pkg.popular
                        ? 'bg-white text-indigo-600 hover:bg-gray-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: 'indigo' | 'purple' | 'pink' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`p-2 md:p-3 rounded-lg ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-xs md:text-sm text-gray-500">{title}</p>
          <p className="text-lg md:text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};