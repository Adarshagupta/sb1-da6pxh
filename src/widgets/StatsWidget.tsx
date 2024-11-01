import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Stats {
  totalBooks: number;
  totalWords: number;
  lastGenerated: Date | null;
}

export const StatsWidget = () => {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalWords: 0,
    lastGenerated: null
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!auth.currentUser) return;

      const booksQuery = query(
        collection(db, 'books'),
        where('userId', '==', auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(booksQuery);
      const books = querySnapshot.docs.map(doc => doc.data());

      let totalWords = 0;
      books.forEach(book => {
        totalWords += book.content.split(/\s+/).length;
      });

      setStats({
        totalBooks: books.length,
        totalWords: totalWords,
        lastGenerated: books[0]?.createdAt?.toDate() || null
      });
    };

    loadStats();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Books</span>
          <span className="font-medium">{stats.totalBooks}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Words</span>
          <span className="font-medium">{stats.totalWords.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Last Generated</span>
          <span className="font-medium">
            {stats.lastGenerated?.toLocaleDateString() || 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
}; 