import AppLayout from '@/components/Layouts/AppLayout'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Button, CardActionArea, CardMedia, Typography } from '@mui/material';
import Link from 'next/link';

const Home = () => {

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = () => {
      axios.get('api/getPopularMovies')
        .then((response) => {
          setMovies(response.data.results);
        })
        .catch((error) => {
          console.log(error)
        });
    }

    fetchMovies();
  }, []);

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Home
        </h2>
      }>
      <Head>
        <title>Laravel - Home</title>
      </Head>

      <Swiper
        spaceBetween={30}
        slidesPerView={5}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 40
          }
        }
        }
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link href={`detail/movie/${movie.id}`}>
              <CardMedia
                component="img"
                sx={{
                  aspectRatio: '2/3',
                }}
                image={`https://image.tmdb.org/t/p/original${movie.poster_path}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`}
                alt={movie.title} />

              <Typography>
                公開日：{movie.release_date}
              </ Typography>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

    </AppLayout>
  )
}

export default Home
