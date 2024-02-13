import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import Head from 'next/head'
import React from 'react'
import useSWR from 'swr'

const favorites = () => {
  const fetcher = (url) => laravelAxios.get(url).then((res) => res.data);
  const { data: favoriteItems, error } = useSWR('/api/favorites', fetcher);

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          お気に入り
        </h2>
      }>
      <Head>
        <title>Laravel - Favorite</title>
      </Head>
      <div>favorites</div>
    </AppLayout>
  )
}

export default favorites