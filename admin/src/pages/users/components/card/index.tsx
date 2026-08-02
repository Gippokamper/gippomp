import { Box, Card, CardContent, CardHeader, LinearProgress, Typography } from '@mui/material'
import React from 'react'

interface IProps {
  count: number
  percent: number
  title: string
}

function UserCard(props: IProps) {
  return (
    <Card>
      <CardHeader title={props.title}></CardHeader>
      <CardContent>
        <Typography typography={'h1'}>{props.count}</Typography>

        <LinearProgress variant='determinate' value={props.percent} />
      </CardContent>
    </Card>
  )
}

export default UserCard
