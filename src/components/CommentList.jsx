import { Grid } from '@mui/material'
import React from 'react'
import Comment from './Comment'

const CommentList = ({ comments }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {comments.map(comment => (
        <Grid item xs={12} key={comment.id}>
          <Comment comment={comment} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CommentList