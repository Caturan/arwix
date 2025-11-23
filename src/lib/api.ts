import { XMLParser } from 'fast-xml-parser';
import Parser from 'rss-parser';

export interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: 'devto' | 'arxiv' | 'huggingface' | 'blog';
  publishedAt: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
  metrics?: string; // e.g. "50 reactions" or "PDF"
}

// --- Dev.to Fetcher ---
async function fetchDevToArticles(): Promise<Article[]> {
  try {
    const res = await fetch(
      'https://dev.to/api/articles?tag=ai&top=7&per_page=10', 
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (!res.ok) throw new Error('Failed to fetch Dev.to');
    const data = await res.json();

    return data.map((item: any) => ({
      id: `devto-${item.id}`,
      title: item.title,
      summary: item.description,
      url: item.url,
      source: 'devto',
      publishedAt: item.published_at,
      author: item.user.name,
      tags: item.tag_list,
      imageUrl: item.cover_image || item.social_image,
      metrics: `${item.public_reactions_count} reactions`,
    }));
  } catch (error) {
    console.error('Dev.to fetch error:', error);
    return [];
  }
}

// --- Arxiv Fetcher ---
async function fetchArxivPapers(): Promise<Article[]> {
  try {
    // Search for CS.AI (Computer Science - AI)
    const res = await fetch(
      'http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('Failed to fetch Arxiv');
    const xmlData = await res.text();
    
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonObj = parser.parse(xmlData);
    const entries = jsonObj.feed.entry || [];

    const list = Array.isArray(entries) ? entries : [entries];

    return list.map((entry: any) => ({
      id: `arxiv-${entry.id}`, // id is a url usually
      title: entry.title.replace(/\n/g, ' ').trim(),
      summary: entry.summary.replace(/\n/g, ' ').trim().slice(0, 200) + '...',
      url: entry.id,
      source: 'arxiv',
      publishedAt: entry.published,
      author: Array.isArray(entry.author) ? entry.author[0].name : entry.author.name,
      tags: ['Research', 'CS.AI'],
      metrics: 'PDF Available',
    }));
  } catch (error) {
    console.error('Arxiv fetch error:', error);
    return [];
  }
}

// --- Hugging Face Fetcher (Daily Papers) ---
async function fetchHuggingFacePapers(): Promise<Article[]> {
  try {
    // Fetching daily papers from Hugging Face API
    const res = await fetch(
      'https://huggingface.co/api/daily_papers',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('Failed to fetch HF');
    const data = await res.json();

    // Data is usually an array of papers
    return data.slice(0, 10).map((paper: any) => ({
      id: `hf-${paper.paper.id}`,
      title: paper.paper.title,
      summary: paper.paper.summary ? paper.paper.summary.slice(0, 200) + '...' : 'No summary available',
      url: `https://huggingface.co/papers/${paper.paper.id}`,
      source: 'huggingface',
      publishedAt: paper.publishedAt || new Date().toISOString(),
      author: 'Hugging Face', // HF API structure varies, keeping it simple
      tags: ['Trending', 'Model'],
      imageUrl: paper.paper.image, // sometimes available
      metrics: `${paper.numUpvotes || 0} upvotes`,
    }));
  } catch (error) {
    console.error('HF fetch error:', error);
    return [];
  }
}

// --- Company Blog RSS Fetcher ---
async function fetchCompanyBlogs(): Promise<Article[]> {
  const parser = new Parser();
  
  // List of RSS feeds
  const feeds = [
    { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI' },
    { url: 'https://blog.google/technology/ai/rss/', name: 'Google DeepMind' },
    { url: 'https://www.anthropic.com/rss', name: 'Anthropic' },
    { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', name: 'AWS ML' },
    { url: 'https://aihub.org/category/articles/feed/', name: 'AIhub' }
  ];

  const articles: Article[] = [];

  try {
    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      feeds.map(feed => parser.parseURL(feed.url))
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const feed = result.value;
        const sourceName = feeds[index].name;

        // Get top 2 items from each feed to avoid overwhelming the feed
        feed.items.slice(0, 2).forEach((item: any) => {
           if (!item.title || !item.link) return;
           
           // Basic summary cleanup (remove HTML tags if present)
           const cleanSummary = item.contentSnippet || item.content || "";
           const summary = cleanSummary.replace(/<[^>]*>/g, '').slice(0, 200) + '...';

           articles.push({
             id: `blog-${sourceName}-${articles.length}`,
             title: item.title,
             summary: summary,
             url: item.link,
             source: 'blog',
             publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
             author: sourceName,
             tags: ['Official', sourceName],
             metrics: 'Official Blog'
           });
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('RSS fetch error:', error);
    return [];
  }
}

export async function getAllArticles() {
  const [devTo, arxiv, hf, blogs] = await Promise.all([
    fetchDevToArticles(),
    fetchArxivPapers(),
    fetchHuggingFacePapers(),
    fetchCompanyBlogs()
  ]);

  // Interleave or sort by date
  const all = [...devTo, ...hf, ...arxiv, ...blogs].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  return all;
}
