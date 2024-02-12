import AppLayout from '@/components/Layouts/AppLayout';
import Head from 'next/head'
import { Box, Button, ButtonGroup, Card, CardContent, Container, Fab, Grid, Modal, Rating, TextareaAutosize, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import laravelAxios from '@/lib/laravelAxios';
import { useAuth } from '@/hooks/auth';

const Detail = ({ detail, media_type, media_id }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editedRating, setEditedRating] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const { user } = useAuth({ middleware: 'auth' });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReviwChange = (e) => {
    setContent(e.target.value);
  }

  const handleRatingChange = (e, newValue) => {
    setRating(newValue);
  };

  const isButtonDisabled = (rating, content) => {
    return !rating || !content.trim();
  };

  const isReviewButtonDiabled =  isButtonDisabled(rating, content);
  const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent);

  const handleReviewAdd = async () => {
    handleClose();
    try {
      const response = await laravelAxios.post(`api/reviews/`, {
        content,
        rating,
        media_type,
        media_id,
      });
      const newReview = response.data;
      setReviews([...reviews, newReview]);
      setRating(0);
      setContent('');

      const updateReviews = [...reviews, newReview];
      updateAverageRating(updateReviews);

    } catch (err) {
      console.log(err);
    }
  };

  const updateAverageRating = (updateReviews) => {
    if (updateReviews.length > 0) {
      const totalRating = updateReviews.reduce((acc, review) => acc + review.rating, 0);

      const average = (totalRating / updateReviews.length).toFixed(1);
      setAverageRating(average);
    } else {
      setAverageRating(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('レビューを削除しますか？')) {
      try {
        const response = await laravelAxios.delete(`api/review/${id}`);
        const fliteredReviews = reviews.filter((review) => review.id !== id);
        setReviews(fliteredReviews);
        updateAverageRating(fliteredReviews);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = (review) => {
    setEditMode(review.id);
    setEditedRating(review.rating);
    setEditedContent(review.content);
  };

  const handleConfirmEdit = async (id) => {
    try {
      const response = await laravelAxios.put(`api/review/${id}`, {
        rating: editedRating,
        content: editedContent,
      });

      const updatedReview = response.data;
      const updatedReviews = reviews.map((review)=>{
        if (review.id === id) {
          return {
            ...review,
            content: updatedReview.content,
            rating: updatedReview.rating
          }
        }
        return review;
      });

      setReviews(updatedReviews);
      updateAverageRating(updatedReviews);

      setEditMode(null);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await laravelAxios.get(`api/reviews/${media_type}/${media_id}`);
        const fetchedReviews = response.data;
        setReviews(fetchedReviews);
        updateAverageRating(fetchedReviews);
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

              <Box
                gap={2}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Rating
                  readOnly
                  precision={0.5}
                  emptyIcon={<StarIcon style={{ color: 'white' }} />}
                  value={parseFloat(averageRating)}
                />
                <Typography
                  sx={{
                    ml: 1,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {averageRating}
                </Typography>
              </Box>

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
                  {editMode === review.id ? (
                    <>
                      {/* 編集中の見た目 */}
                      <Rating value={editedRating} onChange={(e, newValue) => setEditedRating(newValue)} />
                      <TextareaAutosize minRows={3} style={{ width: '100%' }} value={editedContent} onChange={(e)=>setEditedContent(e.target.value)} />
                    </>
                  ) : (
                    <>
                      <Rating value={review.rating} readOnly />
                      <Typography
                        variant='body2'
                        color={'textSecondary'}
                        paragraph
                      >
                        {review.content}
                      </Typography>
                    </>
                  )}

                  {user?.id === review.user_id && (
                    <Grid
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {editMode === review.id ? (
                        <Button onClick={()=>handleConfirmEdit(review.id)} disabled={isEditButtonDisabled}>更新</Button>
                      ) : (
                        <ButtonGroup>
                          <Button onClick={() => handleEdit(review)}>編集</Button>
                          <Button color='error' onClick={() => handleDelete(review.id)}>削除</Button>
                        </ButtonGroup>
                      )}
                    </Grid>
                  )}

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

          <Rating
            required
            onChange={handleRatingChange}
            value={rating} />
          <TextareaAutosize
            required
            minRows={5}
            placeholder='レビュー内容'
            style={{ width: '100%', marginTop: '10px' }}
            onChange={handleReviwChange}
            value={content}
          />
          <Button
            variant="outlined"
            disabled={isReviewButtonDiabled}
            onClick={handleReviewAdd}
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