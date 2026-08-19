import { Box, Button, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import CastForEducationIcon from '@mui/icons-material/CastForEducation'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GET_STUDY_PLANS } from '../study-plan/queries'
import InlinePlanCatForm from './InlinePlanCatForm'
import PlanEditor from './PlanEditor'

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

const hasParent = (q: any, pid: number) => (q?.plan_ids || []).some((p: any) => p.id === pid)
const isRoot = (q: any) => !(q?.plan_ids?.length > 0)

function PlanContent() {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()

  const catId = searchParams.get('cat')
  const planId = searchParams.get('plan')

  const [addRoot, setAddRoot] = useState(false)
  const [addSub, setAddSub] = useState(false)
  const [editing, setEditing] = useState(false)

  const { data: catData } = useQuery(['plan-cats'], () => GET_STUDY_PLANS({ without_content: 1, perPage: 1000 }))
  const { data: testData } = useQuery(['plan-full'], () => GET_STUDY_PLANS({ with_content: 1, perPage: 1000 }))
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
      const pid = cur.plan_ids?.[0]?.id
      cur = pid ? catMap[pid] : null
      guard++
    }
    return chain
  }

  const nm = (c: any) => c?.name?.[lng] || c?.name?.uz || `#${c?.id}`

  const goRoot = () => setSearchParams({})
  const goCat = (id: number) => setSearchParams({ cat: String(id) })
  const goPlan = (id: number | 'new') => {
    const p = new URLSearchParams()
    if (catId) p.set('cat', catId)
    p.set('plan', String(id))
    setSearchParams(p)
  }
  const backToCat = () => (catId ? goCat(Number(catId)) : goRoot())

  const renderCrumbs = () => {
    const chain = chainTo(catId ? Number(catId) : null)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.3, mb: 1.5 }}>
        <Button size='small' onClick={goRoot} sx={{ minWidth: 0, color: 'text.secondary', fontWeight: 600 }}>
          O'quv rejalari
        </Button>
        {chain.map((c, i) => {
          const last = i === chain.length - 1 && !planId
          return (
            <Box key={c.id} sx={{ display: 'flex', alignItems: 'center' }}>
              <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Button size='small' onClick={() => goCat(c.id)} disabled={last} sx={{ minWidth: 0, color: last ? 'text.primary' : 'text.secondary', fontWeight: last ? 700 : 600 }}>
                {nm(c)}
              </Button>
            </Box>
          )
        })}
        {planId && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography sx={{ fontWeight: 700, px: 1, fontSize: '.875rem' }}>{planId === 'new' ? 'Yangi reja' : 'Reja'}</Typography>
          </Box>
        )}
      </Box>
    )
  }

  // Test muharriri
  if (planId) {
    return (
      <Box>
        {renderCrumbs()}
        <Box sx={eyebrowSx}>O'quv reja</Box>
        <PlanEditor key={planId} planId={planId} defaultParentId={catId ? Number(catId) : null} onCreated={id => goPlan(id)} onDone={backToCat} />
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
              Ichki kategoriyalar va rejalar.
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
          <InlinePlanCatForm editId={cat.id} initial={{ name: cat.name }} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SectionHead title='Ichki kategoriyalar' count={subs.length} action={<Button size='small' startIcon={<AddIcon />} onClick={() => setAddSub(v => !v)}>Ichki kategoriya</Button>} />
            {addSub && <InlinePlanCatForm parentId={cid} onDone={() => setAddSub(false)} onCancel={() => setAddSub(false)} />}
            <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              {subs.length ? (
                subs.map((s: any) => <Row key={s.id} icon={<FolderOpenIcon fontSize='small' />} iconBg='rgba(77,175,0,.10)' title={nm(s)} onClick={() => goCat(s.id)} />)
              ) : (
                <Empty text='Ichki kategoriya yo`q' />
              )}
            </Paper>

            <SectionHead title='Rejalar' count={catTests.length} action={<Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => goPlan('new')}>Reja qo`shish</Button>} />
            <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden' }}>
              {catTests.length ? (
                catTests.map((t: any) => <Row key={t.id} icon={<CastForEducationIcon fontSize='small' />} iconBg='#eef1f4' title={nm(t)} onClick={() => goPlan(t.id)} />)
              ) : (
                <Empty text='Hali test yo`q — «Reja qo`shish» bilan boshlang' />
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
      <Box sx={eyebrowSx}>1-ekran · Reja kategoriyalari</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            O'quv rejalari
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Kategoriyaga kirib, ichidagi testlarni boshqaring.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setAddRoot(v => !v)}>
            Kategoriya
          </Button>
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => goPlan('new')}>
            Test
          </Button>
        </Box>
      </Box>

      {addRoot && <InlinePlanCatForm parentId={null} onDone={() => setAddRoot(false)} onCancel={() => setAddRoot(false)} />}

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
            <Card key={'t' + t.id} icon={<CastForEducationIcon fontSize='small' />} title={nm(t)} sub='Reja' onClick={() => goPlan(t.id)} />
          ))}
          {!rootCats.length && !rootTests.length && !addRoot && (
            <Typography variant='body2' color='text.secondary'>
              Bo`sh — «Kategoriya» yoki «Reja» bilan boshlang
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

export default PlanContent
