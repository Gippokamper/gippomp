import { Box, Button, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GET_FOLDERS, GET_FOLDER } from '../question-folder/queries'
import InlineFolderForm from './InlineFolderForm'
import QuestionEditor from './QuestionEditor'

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

const stripHtml = (h: any) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function QBank() {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()

  const folderId = searchParams.get('folder')
  const qId = searchParams.get('q')

  const [addRoot, setAddRoot] = useState(false)

  const nm = (c: any) => c?.name?.[lng] || c?.name?.uz || `#${c?.id}`

  const goRoot = () => setSearchParams({})
  const goFolder = (id: number) => setSearchParams({ folder: String(id) })
  const goQuestion = (id: number | 'new') => {
    const p = new URLSearchParams()
    if (folderId) p.set('folder', folderId)
    p.set('q', String(id))
    setSearchParams(p)
  }
  const backToFolder = () => (folderId ? goFolder(Number(folderId)) : goRoot())

  // Savol muharriri
  if (qId && folderId) {
    return (
      <Box>
        <Crumbs lng={lng} folderId={folderId} qId={qId} goRoot={goRoot} goFolder={goFolder} />
        <Box sx={eyebrowSx}>Savol</Box>
        <QuestionEditor
          key={qId}
          questionId={qId}
          folderId={Number(folderId)}
          onCreated={id => goQuestion(id)}
          onDone={backToFolder}
        />
      </Box>
    )
  }

  // Papka ichi
  if (folderId) {
    return (
      <FolderDetail
        folderId={Number(folderId)}
        nm={nm}
        lng={lng}
        goRoot={goRoot}
        goFolder={goFolder}
        goQuestion={goQuestion}
      />
    )
  }

  // Root papkalar
  return <Root nm={nm} addRoot={addRoot} setAddRoot={setAddRoot} goFolder={goFolder} />
}

// ── Breadcrumb ──
function Crumbs({ lng, folderId, qId, goRoot, goFolder }: any) {
  const { data } = useQuery(['qbank-folder', folderId], () => GET_FOLDER(String(folderId)), { enabled: !!folderId })
  const f = data?.data
  const nm = (c: any) => c?.name?.[lng] || c?.name?.uz || `#${c?.id}`
  const parent = f?.folder_ids?.[0]
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.3, mb: 1.5 }}>
      <Button size='small' onClick={goRoot} sx={{ minWidth: 0, color: 'text.secondary', fontWeight: 600 }}>
        Testlar
      </Button>
      {parent && (
        <>
          <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Button size='small' onClick={() => goFolder(parent.id)} sx={{ minWidth: 0, color: 'text.secondary', fontWeight: 600 }}>
            {nm(parent)}
          </Button>
        </>
      )}
      {f && (
        <>
          <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Button size='small' onClick={() => goFolder(f.id)} disabled={!qId} sx={{ minWidth: 0, color: 'text.primary', fontWeight: 700 }}>
            {nm(f)}
          </Button>
        </>
      )}
      {qId && (
        <>
          <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography sx={{ fontWeight: 700, px: 1, fontSize: '.875rem' }}>{qId === 'new' ? 'Yangi savol' : 'Savol'}</Typography>
        </>
      )}
    </Box>
  )
}

// ── 1-ekran: root papkalar ──
function Root({ nm, addRoot, setAddRoot, goFolder }: any) {
  const { data } = useQuery(['qbank-root'], () => GET_FOLDERS({ perPage: 1000 }))
  const folders: any[] = data?.data || []

  return (
    <Box>
      <Box sx={eyebrowSx}>1-ekran · Savol papkalari</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            Testlar (QBank)
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Papkaga kirib, ichidagi savollarni boshqaring.
          </Typography>
        </Box>
        <Button variant='contained' startIcon={<AddIcon />} onClick={() => setAddRoot((v: boolean) => !v)}>
          Yangi papka
        </Button>
      </Box>

      {addRoot && <InlineFolderForm parentId={null} onDone={() => setAddRoot(false)} onCancel={() => setAddRoot(false)} />}

      {!data ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 2 }}>
          {folders.map(c => (
            <Paper
              key={c.id}
              elevation={0}
              onClick={() => goFolder(c.id)}
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
              <ChevronRightIcon sx={{ position: 'absolute', top: 16, right: 14, color: 'text.disabled' }} />
            </Paper>
          ))}
          {!folders.length && !addRoot && (
            <Typography variant='body2' color='text.secondary'>
              Papka yo`q — «Yangi papka» bilan boshlang
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

// ── 2-ekran: papka ichi ──
function FolderDetail({ folderId, nm, lng, goRoot, goFolder, goQuestion }: any) {
  const { data: fData, isLoading: fLoading } = useQuery(['qbank-folder', folderId], () => GET_FOLDER(String(folderId)))
  const folder = fData?.data
  const subs: any[] = folder?.child_folders || []
  const hasSubs = subs.length > 0

  // Savollar — faqat ichki papka bo'lmasa (leaf). slug orqali olinadi.
  const { data: qData, isLoading: qLoading } = useQuery(
    ['qbank-contents', folder?.slug],
    () => GET_FOLDERS({ slug: folder?.slug, perPage: 1000 }),
    { enabled: !!folder?.slug && !hasSubs }
  )
  const rawItems: any[] = qData?.data || []
  const questions = rawItems.filter(x => x?.type !== 'folders')

  const [addSub, setAddSub] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <Box>
      <Crumbs lng={lng} folderId={String(folderId)} qId={null} goRoot={goRoot} goFolder={goFolder} />
      <Box sx={eyebrowSx}>2-ekran · Papka ichi</Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            {folder ? nm(folder) : '...'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Ichki papkalar va savollar.
          </Typography>
        </Box>
        {folder && (
          <Tooltip title='Papkani tahrirlash'>
            <IconButton onClick={() => setEditing((v: boolean) => !v)} color={editing ? 'primary' : 'default'}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {editing && folder && (
        <InlineFolderForm editId={folder.id} initial={{ name: folder.name }} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      )}

      {fLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Ichki papkalar — faqat leaf bo'lmasa yoki bo'sh papkada qo'shish mumkin */}
          {(hasSubs || !questions.length) && (
            <>
              <SectionHead
                title='Ichki papkalar'
                count={subs.length}
                action={
                  <Button size='small' startIcon={<AddIcon />} onClick={() => setAddSub((v: boolean) => !v)}>
                    Ichki papka
                  </Button>
                }
              />
              {addSub && <InlineFolderForm parentId={folderId} onDone={() => setAddSub(false)} onCancel={() => setAddSub(false)} />}
              <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                {subs.length ? (
                  subs.map((s: any) => (
                    <Row key={s.id} icon={<FolderOpenIcon fontSize='small' />} iconBg='rgba(77,175,0,.10)' title={nm(s)} onClick={() => goFolder(s.id)} />
                  ))
                ) : (
                  <Empty text='Ichki papka yo`q' />
                )}
              </Paper>
            </>
          )}

          {/* Savollar — faqat ichki papka bo'lmaganda */}
          {!hasSubs && (
            <>
              <SectionHead
                title='Savollar'
                count={questions.length}
                action={
                  <Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => goQuestion('new')}>
                    Savol qo`shish
                  </Button>
                }
              />
              {qLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', borderRadius: 3, overflow: 'hidden' }}>
                  {questions.length ? (
                    questions.map((q: any) => (
                      <Row
                        key={q.id}
                        icon={<HelpOutlineIcon fontSize='small' />}
                        iconBg='#eef1f4'
                        title={stripHtml(q?.name?.[lng] || q?.name?.uz) || `#${q.id}`}
                        onClick={() => goQuestion(q.id)}
                      />
                    ))
                  ) : (
                    <Empty text='Hali savol yo`q — «Savol qo`shish» bilan boshlang' />
                  )}
                </Paper>
              )}
            </>
          )}
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

export default QBank
