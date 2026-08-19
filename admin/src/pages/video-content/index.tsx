import { Box, Button, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GET_VIDEO_CATEGORIES, GET_VIDEO_CATEGORY } from '../video-category/queries'
import InlineVideoCatForm from './InlineVideoCatForm'
import VideoEditor from './VideoEditor'

const eyebrowSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.7,
  fontSize: '.7rem',
  fontWeight: 700,
  letterSpacing: '.06em',
  textTransform: 'uppercase' as const,
  color: 'primary.dark',
  bgcolor: 'rgba(77,175,0,.08)',
  border: '1px solid rgba(18,27,45,.08)',
  borderRadius: 999,
  px: 1.1,
  py: 0.4,
  mb: 1.4
}

function VideoContent() {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()

  const catId = searchParams.get('cat')
  const videoId = searchParams.get('video')

  const [addRoot, setAddRoot] = useState(false)

  const { data: allCats } = useQuery(['vc-all-nav'], () => GET_VIDEO_CATEGORIES({ perPage: 1000 }))
  const catList: any[] = useMemo(() => allCats?.data || [], [allCats])

  const map = useMemo(() => {
    const m: Record<number, any> = {}
    catList.forEach(c => (m[c.id] = c))
    return m
  }, [catList])

  const chainTo = (id?: number | null): any[] => {
    const chain: any[] = []
    let cur = id ? map[id] : null
    let guard = 0
    while (cur && guard < 20) {
      chain.unshift(cur)
      const parentId = cur.category_ids?.[0]?.id
      cur = parentId ? map[parentId] : null
      guard++
    }
    return chain
  }

  const nm = (c: any) => c?.name?.[lng] || c?.name?.uz || `#${c?.id}`

  const goRoot = () => setSearchParams({})
  const goCat = (id: number) => setSearchParams({ cat: String(id) })
  const goVideo = (id: number | 'new') => {
    const p = new URLSearchParams()
    if (catId) p.set('cat', catId)
    p.set('video', String(id))
    setSearchParams(p)
  }
  const backToCat = () => (catId ? goCat(Number(catId)) : goRoot())

  const renderCrumbs = () => {
    const chain = chainTo(catId ? Number(catId) : null)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.3, mb: 1.5 }}>
        <Button size='small' onClick={goRoot} sx={{ minWidth: 0, color: 'text.secondary', fontWeight: 600 }}>
          Videolar
        </Button>
        {chain.map((c, i) => {
          const last = i === chain.length - 1 && !videoId
          return (
            <Box key={c.id} sx={{ display: 'flex', alignItems: 'center' }}>
              <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Button
                size='small'
                onClick={() => goCat(c.id)}
                disabled={last}
                sx={{ minWidth: 0, color: last ? 'text.primary' : 'text.secondary', fontWeight: last ? 700 : 600 }}
              >
                {nm(c)}
              </Button>
            </Box>
          )
        })}
        {videoId && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography sx={{ fontWeight: 700, px: 1, fontSize: '.875rem' }}>
              {videoId === 'new' ? 'Yangi video' : 'Video'}
            </Typography>
          </Box>
        )}
      </Box>
    )
  }

  // Video muharriri
  if (videoId) {
    return (
      <Box>
        {renderCrumbs()}
        <Box sx={eyebrowSx}>Video</Box>
        <VideoEditor
          key={videoId}
          videoId={videoId}
          defaultCategoryId={catId ? Number(catId) : null}
          onCreated={id => goVideo(id)}
          onDone={backToCat}
        />
      </Box>
    )
  }

  // 2-ekran: kategoriya ichi
  if (catId) {
    return <VideoCatDetail catId={Number(catId)} nm={nm} lng={lng} renderCrumbs={renderCrumbs} onOpenCat={goCat} onOpenVideo={goVideo} />
  }

  // 1-ekran: root kategoriyalar
  const roots = catList.filter(c => !(c.category_ids?.length > 0))
  const childCount = (id: number) => catList.filter(c => (c.category_ids || []).some((p: any) => p.id === id)).length

  return (
    <Box>
      {renderCrumbs()}
      <Box sx={eyebrowSx}>1-ekran · Video kategoriyalar</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            Videolar
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Kategoriyaga kirib, ichidagi videolarni boshqaring.
          </Typography>
        </Box>
        <Button variant='contained' startIcon={<AddIcon />} onClick={() => setAddRoot(v => !v)}>
          Yangi kategoriya
        </Button>
      </Box>

      {addRoot && <InlineVideoCatForm parentId={null} onDone={() => setAddRoot(false)} onCancel={() => setAddRoot(false)} />}

      {!allCats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 2 }}>
          {roots.map(c => (
            <Paper
              key={c.id}
              elevation={0}
              onClick={() => goCat(c.id)}
              sx={{
                p: 2,
                border: '1px solid rgba(18,27,45,.08)',
                borderRadius: 3,
                cursor: 'pointer',
                position: 'relative',
                transition: '.15s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(18,27,45,.10)' }
              }}
            >
              <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: 'rgba(77,175,0,.10)', color: 'primary.dark', display: 'grid', placeItems: 'center', mb: 1 }}>
                <FolderOpenIcon fontSize='small' />
              </Box>
              <Typography sx={{ fontWeight: 700 }} noWrap>
                {nm(c)}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {childCount(c.id)} bo`lim
              </Typography>
              <ChevronRightIcon sx={{ position: 'absolute', top: 16, right: 14, color: 'text.disabled' }} />
            </Paper>
          ))}
          {!roots.length && !addRoot && (
            <Typography variant='body2' color='text.secondary'>
              Kategoriya yo`q — «Yangi kategoriya» bilan boshlang
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

function VideoCatDetail(props: any) {
  const { catId, nm, renderCrumbs, onOpenCat, onOpenVideo } = props
  const { data, isLoading } = useQuery(['vc-detail', catId], () => GET_VIDEO_CATEGORY(String(catId)))
  const cat = data?.data
  const subs: any[] = cat?.child_category || []
  const videos: any[] = cat?.videos || []

  const [addSub, setAddSub] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <Box>
      {renderCrumbs()}
      <Box sx={eyebrowSx}>2-ekran · Kategoriya ichi</Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            {cat ? nm(cat) : '...'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Kichik kategoriyalar va videolar.
          </Typography>
        </Box>
        {cat && (
          <Tooltip title='Kategoriyani tahrirlash'>
            <IconButton onClick={() => setEditing(v => !v)} color={editing ? 'primary' : 'default'}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {editing && cat && (
        <InlineVideoCatForm editId={cat.id} initial={{ name: cat.name }} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <SectionHead
            title='Kichik kategoriyalar'
            count={subs.length}
            action={
              <Button size='small' startIcon={<AddIcon />} onClick={() => setAddSub(v => !v)}>
                Kichik kategoriya
              </Button>
            }
          />
          {addSub && <InlineVideoCatForm parentId={catId} onDone={() => setAddSub(false)} onCancel={() => setAddSub(false)} />}
          <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            {subs.length ? (
              subs.map((s: any) => (
                <Row key={s.id} icon={<FolderOpenIcon fontSize='small' />} iconBg='rgba(77,175,0,.10)' title={nm(s)} onClick={() => onOpenCat(s.id)} />
              ))
            ) : (
              <Empty text='Kichik kategoriya yo`q' />
            )}
          </Paper>

          <SectionHead
            title='Videolar'
            count={videos.length}
            action={
              <Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => onOpenVideo('new')}>
                Video qo`shish
              </Button>
            }
          />
          <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden' }}>
            {videos.length ? (
              videos.map((v: any) => (
                <Row key={v.id} icon={<PlayCircleOutlineIcon fontSize='small' />} iconBg='#eef1f4' title={nm(v)} onClick={() => onOpenVideo(v.id)} />
              ))
            ) : (
              <Empty text='Hali video yo`q — «Video qo`shish» bilan boshlang' />
            )}
          </Paper>
        </>
      )}
    </Box>
  )
}

function SectionHead({ title, count, action }: any) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography sx={{ fontWeight: 700 }}>
        {title} <Box component='span' sx={{ color: 'text.disabled' }}>{count}</Box>
      </Typography>
      {action}
    </Box>
  )
}

function Row({ icon, iconBg, title, onClick }: any) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.3,
        px: 1.6,
        py: 1.2,
        borderBottom: '1px solid rgba(18,27,45,.06)',
        cursor: 'pointer',
        '&:last-child': { borderBottom: 0 },
        '&:hover': { bgcolor: '#f6f8fa' }
      }}
    >
      <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: iconBg, color: 'text.secondary', display: 'grid', placeItems: 'center', flex: '0 0 32px' }}>
        {icon}
      </Box>
      <Typography sx={{ flex: 1, fontWeight: 700, fontSize: '.93rem' }} noWrap>
        {title}
      </Typography>
      <ChevronRightIcon sx={{ color: 'text.disabled' }} />
    </Box>
  )
}

function Empty({ text }: any) {
  return (
    <Typography variant='body2' color='text.secondary' sx={{ p: 2.2, textAlign: 'center' }}>
      {text}
    </Typography>
  )
}

export default VideoContent
