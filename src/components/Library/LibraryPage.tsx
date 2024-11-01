import React, { useEffect, useState } from 'react';
import { Book, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ReactMarkdown from 'react-markdown';

interface SavedBook {
  id: string;
  userId: string;
  content: string;
  prompt: string;
  title: string;
  settings: {
    genre: string;
    style: string;
    length: string;
    tone: string;
    targetAudience: string;
  };
  createdAt: Timestamp;
}

export const LibraryPage = () => {
  const [books, setBooks] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<SavedBook | null>(null);

  useEffect(() => {
    loadBooks();
  }, [user]);

  const loadBooks = async () => {
    if (!user) {
      console.log('No user found');
      return;
    }

    try {
      console.log('Loading books for user:', user.uid);
      const booksQuery = query(
        collection(db, 'books'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(booksQuery);
      console.log('Found books:', querySnapshot.size);
      
      const loadedBooks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt as Timestamp
        };
      }) as SavedBook[];

      loadedBooks.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      console.log('Processed books:', loadedBooks);
      setBooks(loadedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-1">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Book className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Library</h1>
              <p className="text-sm text-gray-600">Your saved books and stories</p>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No books saved yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedBook(selectedBook?.id === book.id ? null : book)}
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {book.title || book.prompt.slice(0, 50)}...
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      {book.settings.genre}
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                      {book.settings.style}
                    </span>
                    <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                      {book.settings.length}
                    </span>
                  </div>
                  {selectedBook?.id === book.id && (
                    <div className="mt-4 prose prose-sm max-w-none">
                      <ReactMarkdown>{book.content}</ReactMarkdown>
                    </div>
                  )}
                  <div className="mt-4 text-xs text-gray-400">
                    {book.createdAt.toDate().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 