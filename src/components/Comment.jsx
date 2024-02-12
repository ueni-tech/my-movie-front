import { Button, ButtonGroup, Card, CardContent, Grid, TextareaAutosize, Typography } from '@mui/material'
import React from 'react'

const Comment = ({ comment, handleDelete, handleEdit, editMode, editedContent, setEditedContent, handleConfirmEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' component='div' gutterBottom>
          {comment.user.name}
        </Typography>

        {editMode === comment.id ? (
          <>
            <TextareaAutosize
              minRows={3}
              style={{ width: '100%' }}
              value={editedContent}
              onChange={(e) => { setEditedContent(e.target.value) }}
            />
          </>
        ) : (
          <>
            <Typography
              variant='body2'
              component='p'
              color='textSecondary'
              gutterBottom
              paragraph
            >
              {comment.content}
            </Typography>
          </>
        )
        }

        <Grid
          container
          justifyContent='flex-end'
        >
          <ButtonGroup>
            {editMode === comment.id ? (
              <Button onClick={() => handleConfirmEdit(comment.id)}>更新</Button>
            ) : (
              <>
                <Button onClick={() => handleEdit(comment)}>編集</Button>
                <Button color='error' onClick={() => handleDelete(comment.id)}>削除</Button>
              </>
            )}
          </ButtonGroup>
        </Grid>
      </CardContent >
    </Card >
  )
}

export default Comment