import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@web/styles/globals.css';
import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Instagram Download</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </>
  );
};

export default App;
