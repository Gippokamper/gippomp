import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import DescriptionIcon from '@mui/icons-material/Description'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import QuizIcon from '@mui/icons-material/Quiz'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import BiotechIcon from '@mui/icons-material/Biotech'
import BarChartIcon from '@mui/icons-material/BarChart'
import { ReactElement } from 'react'
import { GET_USERS_INFO } from '../users/queries'
import { GET_DASHBOARD_TOTALS } from './queries'

interface ITile {
  title: string
  value?: number
  icon: ReactElement
  link: string
  color: string
}

function Tile({ tile, loading }: { tile: ITile; loading: boolean }) {
  const navigate = useNavigate()

  return (
    <Paper
      elevation={0}
      onClick={() => navigate(tile.link)}
      sx={{
        p: 2.5,
        height: '100%',
        cursor: 'pointer',
        border: '1px solid rgba(18,27,45,0.08)',
        transition: 'box-shadow .15s ease, transform .15s ease',
        '&:hover': { boxShadow: '0 6px 20px rgba(18,27,45,.08)', transform: 'translateY(-2px)' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: tile.color,
            color: '#fff'
          }}
        >
          {tile.icon}
        </Box>
        <Typography variant='body2' color='text.secondary'>
          {tile.title}
        </Typography>
      </Box>
      {loading ? (
        <CircularProgress size={22} />
      ) : (
        <Typography variant='h4' sx={{ fontWeight: 700 }}>
          {Number(tile.value ?? 0).toLocaleString('ru-RU')}
        </Typography>
      )}
    </Paper>
  )
}

// Ilgari bosh sahifada bitta "Bank 21322" degan mavhum kartochka turardi.
function Home() {
  const { data: usersInfo, isLoading: usersLoading } = useQuery(['user-statistics'], GET_USERS_INFO)
  const { data: totals, isLoading: totalsLoading } = useQuery(['dashboard-totals'], GET_DASHBOARD_TOTALS)

  const stats = usersInfo?.data

  const userTiles: ITile[] = [
    {
      title: 'Foydalanuvchilar',
      value: stats?.users_count,
      icon: <PeopleAltIcon />,
      link: '/users',
      color: '#4daf00'
    },
    {
      title: 'Tarif rejasida',
      value: stats?.users_tariff,
      icon: <WorkspacePremiumIcon />,
      link: '/tariffs',
      color: '#f79f44'
    },
    {
      title: 'Sinov muddatida',
      value: stats?.users_free_trail,
      icon: <HourglassBottomIcon />,
      link: '/users',
      color: '#5a6a7a'
    }
  ]

  const contentTiles: ITile[] = [
    { title: 'Maqolalar', value: totals?.articles, icon: <DescriptionIcon />, link: '/articles', color: '#4daf00' },
    { title: 'Videolar', value: totals?.videos, icon: <VideoLibraryIcon />, link: '/videos', color: '#3f8f00' },
    { title: 'Testlar', value: totals?.quizzes, icon: <QuizIcon />, link: '/quizzes', color: '#f79f44' },
    {
      title: 'Savol papkalari',
      value: totals?.folders,
      icon: <FolderSpecialIcon />,
      link: '/question-folder',
      color: '#5a6a7a'
    },
    { title: 'Yangiliklar', value: totals?.news, icon: <NewspaperIcon />, link: '/news', color: '#121b2d' },
    { title: 'Laboratoriya', value: totals?.labs, icon: <BiotechIcon />, link: '/labs', color: '#aacc3a' },
    { title: 'Tariflar', value: totals?.tariffs, icon: <BarChartIcon />, link: '/tariffs', color: '#f79f44' }
  ]

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 2 }}>
        Boshqaruv paneli
      </Typography>

      <Typography variant='overline' color='text.secondary'>
        Foydalanuvchilar
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4, mt: 0 }}>
        {userTiles.map(tile => (
          <Grid item xs={12} sm={6} md={4} key={tile.title}>
            <Tile tile={tile} loading={usersLoading} />
          </Grid>
        ))}
      </Grid>

      <Typography variant='overline' color='text.secondary'>
        Kontent
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        {contentTiles.map(tile => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tile.title}>
            <Tile tile={tile} loading={totalsLoading} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Home
