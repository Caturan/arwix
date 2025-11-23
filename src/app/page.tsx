import { getAllArticles } from '@/lib/api';
import Dashboard from '@/components/Dashboard';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const articles = await getAllArticles();
  return <Dashboard initialArticles={articles} />;
}
