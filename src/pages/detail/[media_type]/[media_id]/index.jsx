import AppLayout from '@/components/Layouts/AppLayout';
import Head from 'next/head'
import { Box, Button, Card, CardContent, Container, Fab, Grid, Modal, Rating, TextareaAutosize, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import laravelAxios from '@/lib/laravelAxios';

const Detail = ({ detail, media_type, media_id }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reviews = [
    {
      id: 1,
      content: "とても面白かったです。",
      rating: 5,
      user: {
        name: "test1",
      }
    },
    {
      id: 2,
      content: "まあまあ面白かったです。",
      rating: 3,
      user: {
        name: "test2",
      }
    },
    {
      id: 1,
      content: "うーん、微妙でした。",
      rating: 2,
      user: {
        name: "test3",
      }
    },
  ]

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await laravelAxios.get(`api/reviews/${media_type}/${media_id}`);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [media_type, media_id]);

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Detail
        </h2>
      }>
      <Head>
        <title>Laravel - Detail</title>
      </Head>

      <Box sx={{
        height: { xs: "auto", md: "70vh" },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Box sx={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
          }
        }} />

        <Container sx={{ zIndex: '1' }}>
          <Grid container alignItems="center" sx={{ color: "white" }}>
            <Grid item md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <img width='70%' src={`https://image.tmdb.org/t/p/original${detail.poster_path}`} alt={detail.title} />
            </Grid>
            <Grid item md={8}>
              <Typography variant='h4' paragraph>
                {detail.title || detail.name}
              </Typography>
              <Typography paragraph>
                {detail.overview}
              </Typography>
              <Typography variant='h6'>
                {media_type === 'movie' ? `公開日：${detail.release_date}` : `初回放送日：${detail.first_air_date}`}
              </Typography>
            </Grid>
          </Grid>
        </Container>

      </Box>

      {/* レビュー一覧 */}
      <Container sx={{
        py: 4,
      }}>
        <Typography component="h1" variant='h4' align='center' gutterBottom>
          レビュー一覧
        </Typography>

        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review.id}>
              <Card>
                <CardContent>
                  <Typography
                    variant='h6'
                    component='div'
                    gutterBottom
                  >
                    {review.user.name}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography
                    variant='body2'
                    color={'textSecondary'}
                    paragraph
                  >
                    {review.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* レビュー一覧 ここまで */}

      {/* レビュー投稿ボタン */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
        }}
      >
        <Tooltip title="レビューを投稿する">
          <Fab
            style={{ background: '#1976d2', color: 'white' }}
            onClick={handleOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
      {/* レビュー投稿ボタン ここまで */}

      {/* レビュー投稿モーダル */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6' component='h2' gutterBottom>
            レビューを書く
          </Typography>

          <Rating required />
          <TextareaAutosize
            required
            minRows={5}
            placeholder='レビュー内容'
            style={{ width: '100%', marginTop: '10px' }}
          />
        <Button
          variant="outlined"
        >
          送信
        </Button>
        </Box>
      </Modal>
      {/* レビュー投稿モーダル ここまで */}
    </AppLayout>
  )
}

export async function getServerSideProps(context) {
  const { media_type, media_id } = context.params;

  try {
    const jpResponse = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);

    let combinedData = { ...jpResponse.data };

    if (!jpResponse.data.overview) {
      const enResponse = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
      combinedData.overview = enResponse.data.overview;
    }

    return {
      props: {
        detail: combinedData,
        media_id,
        media_type
      }
    }
  } catch {
    return {
      notFound: true,
    }
  }
}

export default Detail