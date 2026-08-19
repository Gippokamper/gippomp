import { Box, Button, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import QuizIcon from '@mui/icons-material/Quiz'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GET_STUDY_PLANS as GET_QUIZZES } from '../quizzes/queries'
import InlineQuizCatForm from './InlineQuizCatForm'
import QuizEditor from './QuizEditor'

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

const hasParent = (q: any, pid: number) => (q?.quiz_ids || []).some((p: any) => p.id === pid)
const isRoot = (q: any) => !(q?.quiz_ids?.length > 0)

function QuizContent() {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()

  const catId = searchParams.get('cat')
  const quizId = searchParams.get('quiz')

  const [addRoot, setAddRoot] = useState(false)
  const [addSub, setAddSub] = useState(false)
  const [editing, setEditing] = useState(false)

  const { data: catData } = useQuery(['quiz-cats'], () => GET_QUIZZES({ without_child: 1, perPage: 1000 }))
  const { data: testData } = useQuery(['quiz-tests'], () => GET_QUIZZES({ with_content: 1, perPage: 1000 }))
  const categories: any[] = useMemo(() => catData?.data || [], [catData])
  const tests: any[] = useMemo(() => testData?.data || [], [testData])

  const catMap = useMemo(() => {
    const m: Record<number, any> = {}
    categories.forEach(c => (m[c.id] = c))
    return m
  }, [categories])

  const chainTo = (id?: number | null): any[] => {
    const chain: any[] = []
    let cur = id ? catMap[id] : null
    let guard = 0
    while (cur && guard < 20) {
      chain.unshift(cur)
      const pid = cur.quiz_ids?.[0]?.id
      cur = pid ? catMap[pid] : null
      guard++
    }
    return chain
  }

  const nm = (c: any) => c?.name?.[lng] || c?.name?.uz || `#${c?.id}`

  const goRoot = () => setSearchParams({})
  const goCat = (id: number) => setSearchParams({ cat: String(id) })
  const goQuiz = (id: number | 'new') => {
    const p = new URLSearchParams()
    if (catId) p.set('cat', catId)
    p.set('quiz', String(id))
    setSearchParams(p)
  }
  const backToCat = () => (catId ? goCat(Number(catId)) : goRoot())

  const renderCrumbs = () => {
    const chain = chainTo(catId ? Number(catId) : null)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.3, mb: 1.5 }}>
        <Button size='small' onClick={goRoot} sx={{ minWidth: 0, color: 'text.secondary', fontWeight: 600 }}>
          Testlar
        </Button>
        {chain.map((c, i) => {
          const last = i === chain.length - 1 && !quizId
          return (
            <Box key={c.id} sx={{ display: 'flex', alignItems: 'center' }}>
              <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Button size='small' onClick={() => goCat(c.id)} disabled={last} sx={{ minWidth: 0, color: last ? 'text.primary' : 'text.secondary', fontWeight: last ? 700 : 600 }}>
                {nm(c)}
              </Button>
            </Box>
          )
        })}
        {quizId && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography sx={{ fontWeight: 700, px: 1, fontSize: '.875rem' }}>{quizId === 'new' ? 'Yangi test' : 'Test'}</Typography>
          </Box>
        )}
      </Box>
    )
  }

  // Test muharriri
  if (quizId) {
    return (
      <Box>
        {renderCrumbs()}
        <Box sx={eyebrowSx}>Test</Box>
        <QuizEditor key={quizId} quizId={quizId} defaultParentId={catId ? Number(catId) : null} onCreated={id => goQuiz(id)} onDone={backToCat} />
      </Box>
    )
  }

  const loading = !catData || !testData

  // 2-ekran: kategoriya ichi
  if (catId) {
    const cid = Number(catId)
    const cat = catMap[cid]
    const subs = categories.filter(c => hasParent(c, cid))
    const catTests = tests.filter(t => hasParent(t, cid))
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
              Ichki kategoriyalar va testlar.
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
          <InlineQuizCatForm editId={cat.id} initial={{ name: cat.name }} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SectionHead title='Ichki kategoriyalar' count={subs.length} action={<Button size='small' startIcon={<AddIcon />} onClick={() => setAddSub(v => !v)}>Ichki kategoriya</Button>} />
            {addSub && <InlineQuizCatForm parentId={cid} onDone={() => setAddSub(false)} onCancel={() => setAddSub(false)} />}
            <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              {subs.length ? (
                subs.map((s: any) => <Row key={s.id} icon={<FolderOpenIcon fontSize='small' />} iconBg='rgba(77,175,0,.10)' title={nm(s)} onClick={() => goCat(s.id)} />)
              ) : (
                <Empty text='Ichki kategoriya yo`q' />
              )}
            </Paper>

            <SectionHead title='Testlar' count={catTests.length} action={<Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => goQuiz('new')}>Test qo`shish</Button>} />
            <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden' }}>
              {catTests.length ? (
                catTests.map((t: any) => <Row key={t.id} icon={<QuizIcon fontSize='small' />} iconBg='#eef1f4' title={nm(t)} onClick={() => goQuiz(t.id)} />)
              ) : (
                <Empty text='Hali test yo`q — «Test qo`shish» bilan boshlang' />
              )}
            </Paper>
          </>
        )}
      </Box>
    )
  }

  // 1-ekran: root
  const rootCats = categories.filter(isRoot)
  const rootTests = tests.filter(isRoot)

  return (
    <Box>
      {renderCrumbs()}
      <Box sx={eyebrowSx}>1-ekran · Test kategoriyalari</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            Testlar
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Kategoriyaga kirib, ichidagi testlarni boshqaring.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setAddRoot(v => !v)}>
            Kategoriya
          </Button>
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => goQuiz('new')}>
            Test
          </Button>
        </Box>
      </Box>

      {addRoot && <InlineQuizCatForm parentId={null} onDone={() => setAddRoot(false)} onCancel={() => setAddRoot(false)} />}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 2 }}>
          {rootCats.map(c => (
            <Card key={'c' + c.id} icon={<FolderOpenIcon fontSize='small' />} title={nm(c)} sub='Kategoriya' onClick={() => goCat(c.id)} />
          ))}
          {rootTests.map(t => (
            <Card key={'t' + t.id} icon={<QuizIcon fontSize='small' />} title={nm(t)} sub='Test' onClick={() => goQuiz(t.id)} />
          ))}
          {!rootCats.length && !rootTests.length && !addRoot && (
            <Typography variant='body2' color='text.secondary'>
              Bo`sh — «Kategoriya» yoki «Test» bilan boshlang
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

function Card({ icon, title, sub, onClick }: any) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
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
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 700 }} noWrap>
        {title}
      </Typography>
      <Typography variant='caption' color='text.secondary'>
        {sub}
      </Typography>
      <ChevronRightIcon sx={{ position: 'absolute', top: 16, right: 14, color: 'text.disabled' }} />
    </Paper>
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
      sx={{ display: 'flex', alignItems: 'center', gap: 1.3, px: 1.6, py: 1.2, borderBottom: '1px solid rgba(18,27,45,.06)', cursor: 'pointer', '&:last-child': { borderBottom: 0 }, '&:hover': { bgcolor: '#f6f8fa' } }}
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

export default QuizContent
