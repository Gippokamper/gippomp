import { Box, LinearProgress, Paper, Typography } from '@mui/material'

interface IProps {
  count?: number
  percent?: number
  title: string
}

function UserCard(props: IProps) {
  const count = Number.isFinite(props.count) ? Number(props.count) : 0
  // NaN/Infinity (masalan 0 ga bo'lish) LinearProgress'ni buzardi.
  const percent = Number.isFinite(props.percent) ? Math.min(100, Math.max(0, Number(props.percent))) : 0

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,0.08)', height: '100%' }}>
      <Typography variant='body2' color='text.secondary' noWrap title={props.title}>
        {props.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5, mb: 1.5 }}>
        <Typography variant='h4' sx={{ fontWeight: 700 }}>
          {count.toLocaleString('ru-RU')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {percent.toFixed(0)}%
        </Typography>
      </Box>
      <LinearProgress variant='determinate' value={percent} sx={{ height: 6, borderRadius: 3 }} />
    </Paper>
  )
}

export default UserCard
