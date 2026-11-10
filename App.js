
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  SafeAreaView,
  StatusBar,
  ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

const STORAGE_KEY = 'MY_FAVORITE_QUOTES';

const quotes = [
  { text: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { text: "Great things take time.", author: "Unknown" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Never give up on your dreams.", author: "Unknown" },
  { text: "Stay focused and never stop learning.", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
  { text: "Difficult roads often lead to beautiful destinations.", author: "Unknown" },
  { text: "Every day is a new beginning.", author: "Unknown" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "Focus on progress, not perfection.", author: "Unknown" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
  { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "Success doesn't come to you; you go to it.", author: "Marva Collins" },
  { text: "Believe in the power of yet.", author: "Unknown" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
];

export default function App() {

  const [quote, setQuote] = useState(quotes[0]);
  const [favorites, setFavorites] = useState([]);
  const [screen, setScreen] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);

  // Quote History
  const [quoteHistory, setQuoteHistory] = useState([quotes[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        Alert.alert('Error', 'Could not load favorites.');
      } finally {
        setIsLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites
  const saveFavorites = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      Alert.alert('Error', 'Could not save favorites.');
    }
  };

  // Generate random quote and update history
  const changeQuote = () => {

    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (
      quotes.length > 1 &&
      quotes[randomIndex].text === quote.text
    );

    const newQuote = quotes[randomIndex];

    const updatedHistory = quoteHistory.slice(
      0,
      historyIndex + 1
    );

    updatedHistory.push(newQuote);

    setQuoteHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setQuote(newQuote);
  };

  // Previous Quote
  const previousQuote = () => {

    if (historyIndex > 0) {
      const previousIndex = historyIndex - 1;

      setHistoryIndex(previousIndex);
      setQuote(quoteHistory[previousIndex]);
    }
  };

  // Next Quote
  const nextQuote = () => {

    if (historyIndex < quoteHistory.length - 1) {
      const nextIndex = historyIndex + 1;

      setHistoryIndex(nextIndex);
      setQuote(quoteHistory[nextIndex]);
    }
  };

  // Check favorite
  const isFavorite = favorites.some(
    item => item.text === quote.text
  );

  // Add or remove favorite
  const toggleFavorite = async () => {

    if (!isLoaded) return;

    const updatedFavorites = isFavorite
      ? favorites.filter(item => item.text !== quote.text)
      : [...favorites, quote];

    setFavorites(updatedFavorites);
    await saveFavorites(updatedFavorites);
  };

  // Remove favorite
  const removeFavorite = async (item) => {

    const updatedFavorites = favorites.filter(
      q => q.text !== item.text
    );

    setFavorites(updatedFavorites);
    await saveFavorites(updatedFavorites);
  };

  // Copy quote
  const copyQuote = async () => {
    try {
      await Clipboard.setStringAsync(
        `"${quote.text}" — ${quote.author}`
      );

      Alert.alert('Copied!', 'Quote copied successfully.');
    } catch (error) {
      Alert.alert('Error', 'Unable to copy quote.');
    }
  };

  // Share quote
  const shareQuote = async () => {
    try {
      await Share.share({
        message: `"${quote.text}" — ${quote.author}`
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share quote.');
    }
  };

  if (!isLoaded) {
    return (
      <ImageBackground
        source={require('./assets/OIP.webp')}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.loadingContainer}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.heading}>Daily Quotes ✨</Text>
          <Text style={styles.loadingText}>Loading...</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('./assets/OIP.webp')}
      style={styles.container}
      resizeMode="cover"
    >

      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>

          <Text style={styles.heading}>
            Daily Quotes ✨
          </Text>

          <Text style={styles.sharedText}>
            Shared By :-
          </Text>

          <Text style={styles.subHeading}>
            Yuvraj Singh Chawda
          </Text>

          <Text style={styles.tagline}>
            A little inspiration every day
          </Text>

        </View>

        {/* Navigation */}
        <View style={styles.nav}>

          <TouchableOpacity
            style={[
              styles.navButton,
              screen === 'home' && styles.activeNav
            ]}
            onPress={() => setScreen('home')}
          >
            <Text style={[
              styles.navText,
              screen === 'home' && styles.activeNavText
            ]}>
              🏠 Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              screen === 'favorites' && styles.activeNav
            ]}
            onPress={() => setScreen('favorites')}
          >
            <Text style={[
              styles.navText,
              screen === 'favorites' && styles.activeNavText
            ]}>
              ❤️ Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>

        </View>

        {/* Home Screen */}
        {screen === 'home' ? (

          <View style={styles.card}>

            <Text style={styles.cardLabel}>
              ✨ INSPIRATION OF THE MOMENT
            </Text>

            <Text style={styles.quote}>
              "{quote.text}"
            </Text>

            <Text style={styles.author}>
              — {quote.author}
            </Text>

            {/* Favorite */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Text style={styles.favoriteText}>
                {isFavorite
                  ? '❤️ Saved to Favorites'
                  : '🤍 Add to Favorites'}
              </Text>
            </TouchableOpacity>

            {/* Copy and Share */}
            <View style={styles.actionRow}>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={copyQuote}
              >
                <Text style={styles.actionText}>
                  📋 Copy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareQuote}
              >
                <Text style={styles.actionText}>
                  📤 Share
                </Text>
              </TouchableOpacity>

            </View>

            {/* Previous and Next */}
            <View style={styles.navigationRow}>

              <TouchableOpacity
                style={[
                  styles.historyButton,
                  historyIndex === 0 && styles.disabledButton
                ]}
                disabled={historyIndex === 0}
                onPress={previousQuote}
              >
                <Text style={styles.historyText}>
                  ← Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.historyButton,
                  historyIndex === quoteHistory.length - 1 &&
                  styles.disabledButton
                ]}
                disabled={historyIndex === quoteHistory.length - 1}
                onPress={nextQuote}
              >
                <Text style={styles.historyText}>
                  Next →
                </Text>
              </TouchableOpacity>

            </View>

            {/* New Quote */}
            <TouchableOpacity
              style={styles.newQuoteButton}
              onPress={changeQuote}
            >
              <Text style={styles.newQuoteText}>
                ✨ New Quote
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          /* Favorites Screen */
          <View style={styles.card}>

            <Text style={styles.subHeading}>
              My Favorite Quotes ❤️
            </Text>

            <Text style={styles.favoriteCount}>
              {favorites.length} saved quotes
            </Text>

            <ScrollView
              style={styles.list}
              showsVerticalScrollIndicator={false}
            >

              {favorites.length === 0 ? (

                <Text style={styles.empty}>
                  No favorite quotes yet!
                  {"\n"}
                  Go to Home and save your favorite quotes.
                </Text>

              ) : (

                favorites.map((item) => (

                  <View
                    key={item.text}
                    style={styles.favoriteCard}
                  >

                    <Text style={styles.favoriteQuote}>
                      "{item.text}"
                    </Text>

                    <Text style={styles.author}>
                      — {item.author}
                    </Text>

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFavorite(item)}
                    >
                      <Text style={styles.remove}>
                        Remove ❤️
                      </Text>
                    </TouchableOpacity>

                  </View>

                ))

              )}

            </ScrollView>

          </View>

        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Made with ❤️ for daily inspiration
        </Text>

      </SafeAreaView>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 15, 40, 0.25)',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },

  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 25,
  },

  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },

  sharedText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
  },

  tagline: {
    fontSize: 14,
    color: '#F0EFFF',
    marginTop: 7,
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },

  navButton: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  activeNav: {
    backgroundColor: '#5945C5',
  },

  navText: {
    color: '#5945C5',
    fontWeight: 'bold',
    fontSize: 14,
  },

  activeNavText: {
    color: 'white',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.93)',
    padding: 22,
    borderRadius: 22,
    width: '100%',
    flex: 1,
    maxHeight: '78%',
    elevation: 5,
  },

  cardLabel: {
    fontSize: 12,
    color: '#8A7AD5',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 1,
  },

  quote: {
    fontSize: 23,
    textAlign: 'center',
    color: '#333',
    lineHeight: 36,
    fontWeight: '600',
    marginTop: 15,
  },

  author: {
    fontSize: 15,
    textAlign: 'right',
    marginTop: 18,
    color: '#888',
  },

  favoriteButton: {
    backgroundColor: '#FFE4EC',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },

  favoriteText: {
    textAlign: 'center',
    color: '#C02660',
    fontWeight: 'bold',
    fontSize: 15,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#EEEAFE',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  actionText: {
    color: '#5945C5',
    fontWeight: 'bold',
    fontSize: 15,
  },

  navigationRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },

  historyButton: {
    flex: 1,
    backgroundColor: '#E3DFFF',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  historyText: {
    color: '#5945C5',
    fontWeight: 'bold',
    fontSize: 15,
  },

  disabledButton: {
    opacity: 0.35,
  },

  newQuoteButton: {
    backgroundColor: '#5945C5',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },

  newQuoteText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4935A8',
    textAlign: 'center',
  },

  favoriteCount: {
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  list: {
    flex: 1,
  },

  favoriteCard: {
    backgroundColor: '#F1F0FF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
  },

  favoriteQuote: {
    fontSize: 17,
    color: '#333',
    lineHeight: 26,
  },

  removeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  remove: {
    color: '#D32F5B',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    color: '#888',
    padding: 25,
    lineHeight: 25,
  },

  footer: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 15,
  },

});
