import { Box, Button, Chip, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GET_CATEGORIES, GET_CATEGORY } from '../category/queries'
import CategoryDrawer from './CategoryDrawer'
import ArticleEditor from './ArticleEditor'

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

function Content() {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()

  const catId = searchParams.get('cat')
  const articleId = searchParams.get('article')

  const [drawer, setDrawer] = useState<{ open: boolean; editId?: number | null; parentId?: number | null }>({
    open: false
  })

  const { data: allCats } = useQuery(['content-all-cats-nav'], () => GET_CATEGORIES({ perPage: 1000 }))
  const catList: any[] = useMemo(() => allCats?.data || [], [allCats])

  // id -> kategoriya xaritasi + ota zanjiri (breadcrumb uchun)
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
  const goArticle = (id: number | 'new') => {
    const p = new URLSearchParams()
    if (catId) p.set('cat', catId)
    p.set('article', String(id))
    setSearchParams(p)
  }

  // ── Breadcrumb ──
  const renderCrumbs = () => {
    const chain = chainTo(catId ? Number(catId) : null)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.3, mb: 1.5 }}>
        <Button size='small' onClick={goRoot} sx={{ minWidth: 0, color: 'text.secondary', fontWeight: 600 }}>
          Kontent
        </Button>
        {chain.map((c, i) => {
          const last = i === chain.length - 1 && !articleId
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
        {articleId && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography sx={{ fontWeight: 700, px: 1, fontSize: '.875rem' }}>
              {articleId === 'new' ? 'Yangi maqola' : 'Maqola'}
            </Typography>
          </Box>
        )}
      </Box>
    )
  }

  // ── Maqola muharriri ──
  if (articleId) {
    return (
      <Box>
        {renderCrumbs()}
        <Box sx={eyebrowSx}>3-ekran · Maqola muharriri</Box>
        <ArticleEditor
          key={articleId}
          articleId={articleId}
          defaultCategoryId={catId ? Number(catId) : null}
          onCreated={id => goArticle(id)}
        />
      </Box>
    )
  }

  // ── 2-ekran: kategoriya ichi ──
  if (catId) {
    return (
      <CategoryDetail
        catId={Number(catId)}
        nm={nm}
        renderCrumbs={renderCrumbs}
        eyebrowSx={eyebrowSx}
        onOpenCat={goCat}
        onOpenArticle={goArticle}
        onAddSub={(parentId: number) => setDrawer({ open: true, parentId })}
        onEditCat={(editId: number) => setDrawer({ open: true, editId })}
        drawer={drawer}
        setDrawer={setDrawer}
      />
    )
  }

  // ── 1-ekran: bosh (root kategoriyalar) ──
  const roots = catList.filter(c => !(c.category_ids?.length > 0))
  const childCount = (id: number) => catList.filter(c => (c.category_ids || []).some((p: any) => p.id === id)).length

  return (
    <Box>
      {renderCrumbs()}
      <Box sx={eyebrowSx}>1-ekran · Kontent</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            Kontent
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Kategoriyaga kirib, ichidagi maqolalarni boshqaring.
          </Typography>
        </Box>
        <Button variant='contained' startIcon={<AddIcon />} onClick={() => setDrawer({ open: true, parentId: null })}>
          Yangi kategoriya
        </Button>
      </Box>

      {!allCats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 2
          }}
        >
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
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: 'rgba(77,175,0,.10)',
                  color: 'primary.dark',
                  display: 'grid',
                  placeItems: 'center',
                  mb: 1
                }}
              >
                <FolderOpenIcon fontSize='small' />
              </Box>
              <Typography sx={{ fontWeight: 700 }} noWrap>
                {nm(c)}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {childCount(c.id)} bo`lim · {c.paid ? 'Premium' : 'Free'}
              </Typography>
              <ChevronRightIcon sx={{ position: 'absolute', top: 16, right: 14, color: 'text.disabled' }} />
            </Paper>
          ))}
          {!roots.length && (
            <Typography variant='body2' color='text.secondary'>
              Kategoriya yo`q — «Yangi kategoriya» bilan boshlang
            </Typography>
          )}
        </Box>
      )}

      <CategoryDrawer
        open={drawer.open}
        editId={drawer.editId}
        parentId={drawer.parentId}
        onClose={() => setDrawer({ open: false })}
        onSaved={() => {}}
      />
    </Box>
  )
}

// ── 2-ekran komponenti ──
function CategoryDetail(props: any) {
  const { catId, nm, renderCrumbs, eyebrowSx, onOpenCat, onOpenArticle, onAddSub, onEditCat, drawer, setDrawer } = props
  const { data, isLoading } = useQuery(['content-category', catId], () => GET_CATEGORY(String(catId)))
  const cat = data?.data
  const subs: any[] = cat?.child_category || []
  const arts: any[] = cat?.articles || []

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
            Kichik kategoriyalar va maqolalar.
          </Typography>
        </Box>
        {cat && (
          <Tooltip title='Kategoriyani tahrirlash'>
            <IconButton onClick={() => onEditCat(cat.id)}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Kichik kategoriyalar */}
          <SectionHead
            title='Kichik kategoriyalar'
            count={subs.length}
            action={
              <Button size='small' startIcon={<AddIcon />} onClick={() => onAddSub(catId)}>
                Kichik kategoriya
              </Button>
            }
          />
          <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            {subs.length ? (
              subs.map((s: any) => (
                <Row
                  key={s.id}
                  icon={<FolderOpenIcon fontSize='small' />}
                  iconBg='rgba(77,175,0,.10)'
                  title={nm(s)}
                  chip={s.paid ? 'Premium' : 'Free'}
                  premium={!!s.paid}
                  onClick={() => onOpenCat(s.id)}
                />
              ))
            ) : (
              <Empty text='Kichik kategoriya yo`q' />
            )}
          </Paper>

          {/* Maqolalar */}
          <SectionHead
            title='Maqolalar'
            count={arts.length}
            action={
              <Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => onOpenArticle('new')}>
                Maqola qo`shish
              </Button>
            }
          />
          <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden' }}>
            {arts.length ? (
              arts.map((a: any) => (
                <Row
                  key={a.id}
                  icon={<DescriptionOutlinedIcon fontSize='small' />}
                  iconBg='#eef1f4'
                  title={nm(a)}
                  chip={a.paid ? 'Premium' : 'Free'}
                  premium={!!a.paid}
                  onClick={() => onOpenArticle(a.id)}
                />
              ))
            ) : (
              <Empty text='Hali maqola yo`q — «Maqola qo`shish» bilan boshlang' />
            )}
          </Paper>
        </>
      )}

      <CategoryDrawer
        open={drawer.open}
        editId={drawer.editId}
        parentId={drawer.parentId}
        onClose={() => setDrawer({ open: false })}
        onSaved={() => {}}
      />
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

function Row({ icon, iconBg, title, chip, premium, onClick }: any) {
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
      <Chip
        size='small'
        label={chip}
        color={premium ? 'warning' : 'default'}
        sx={{ fontWeight: 700 }}
      />
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

export default Content
