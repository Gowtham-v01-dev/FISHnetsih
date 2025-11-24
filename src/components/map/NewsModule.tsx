import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

export const NewsModule = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [i18n.language]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (!apiKey) {
        throw new Error('News API key not configured');
      }

      const keywords = 'fishing OR fisherman OR fishermen OR seafood OR aquaculture OR marine';
      const languageMap: Record<string, string> = {
        'en': 'en',
        'hi': 'en',
        'ta': 'en',
        'te': 'en',
        'kn': 'en',
        'ml': 'en',
        'gu': 'en',
        'mwr': 'en',
        'bn': 'en',
        'pa': 'en',
        'mr': 'en',
        'or': 'en'
      };
      const language = languageMap[i18n.language] || 'en';
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=${language}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(t('map.news.noNews'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('map.news.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">{error || t('map.news.noNews')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex gap-4">
                  {article.urlToImage && (
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{article.source.name}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full md:w-2/5 border-l bg-background p-6 overflow-y-auto"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              ← {t('common.close')}
            </button>

            {selectedArticle.urlToImage && (
              <img 
                src={selectedArticle.urlToImage} 
                alt={selectedArticle.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}

            <h2 className="text-2xl font-bold mb-3">{selectedArticle.title}</h2>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="font-medium">{selectedArticle.source.name}</span>
              <span>{formatDate(selectedArticle.publishedAt)}</span>
            </div>

            <p className="text-base leading-relaxed mb-4">
              {selectedArticle.description}
            </p>

            {selectedArticle.content && (
              <p className="text-base leading-relaxed mb-6">
                {selectedArticle.content.split('[+')[0]}
              </p>
            )}

            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              {t('map.news.readMore')}
              <ExternalLink size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
