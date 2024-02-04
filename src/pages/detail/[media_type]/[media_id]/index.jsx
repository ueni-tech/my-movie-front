import axios from 'axios';
import React from 'react'

const Detail = ({ detail }) => {

  console.log(detail);

  return (
    <>
      <div>作品詳細</div>
      <h1>{detail.title}</h1>
    </>
  )
}

export async function getServerSideProps(context) {
  const { media_type, media_id } = context.params;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);
    const fetchedData = response.data;

    return {
      props: {
        detail: fetchedData
      }
    }
  } catch {
    return {
      notFound: true,
    }
  }
}

export default Detail