import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import LibraryLayout from '../../layouts/library'
import uz from '../../img/icons/uz.svg'
import MarkerIcon from '../../img/icons/MarkerIcon'
import DropDownIcon from '../../img/icons/DropDownIcon'
import Play from '../../img/icons/Play'
import FeedbackModal from '../../components/feedback-modal'
import Success from '../../components/notifications/Success'
import WithTooltip from '../../components/with-html/WithTooltip'
import { request } from '../../helpers/request'
import { rememberArticle } from '../../helpers/recent-articles'
import SaveButton from '../../components/save-button'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import { AuthContext } from '../../providers/auth-provider'
import { RootState } from '../../store'
import {
  decrement,
  increment,
  openChapter,
  setChapters,
  toggleAddInfo,
  toggleAllChapter,
  toggleChapter
} from '../../store/slices/htmlSlice'
import './article.scss'
import './addinfo-lock.scss'

/** LibraryLayout'dagi scroll konteyneri. */
const SCROLL_CONTAINER_ID = 'nestedRelativeContainerElement'

const CopyIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='9' y='9' width='11' height='11' rx='2' stroke='currentColor' strokeWidth='2' />
    <path d='M5 15V5a2 2 0 0 1 2-2h10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

/*
 * `img/icons/LockIcon` bu yerga to'g'ri kelmaydi: uning rangi `fill="url(#a)"`
 * bilan qizil gradientga qattiq bog'langan va mavzu almashganda o'zgarmaydi.
 * Bu belgi `currentColor` dan rang oladi.
 */
const LockGlyph = () => (
  <svg width='13' height='13' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='3' y='11' width='18' height='11' rx='2' stroke='currentColor' strokeWidth='2.2' />
    <path d='M7 11V7a5 5 0 0 1 10 0v4' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' />
  </svg>
)

/*
 * Shrift chegaralari — `htmlSlice` dagi `increment`/`decrement` ham aynan shu
 * qiymatlarda to'xtaydi. Bu yerda ular tugmani so'ndirish uchun kerak: aks
 * holda chegaraga yetgan odam bosaveradi va nega hech narsa o'zgarmayotganini
 * bilmaydi.
 */
const FONT_MIN = 10
const FONT_MAX = 30

/**
 * Bo'lim ichida qo'shimcha (premium) ma'lumot bormi.
 *
 * Qo'shimcha ma'lumot maqola HTML'ida `<u>` bilan yoziladi — `prepare-html`
 * ham aynan shu belgidan yuradi, shuning uchun shart bir xil. Qo'pol
 * tekshiruv yetarli: noto'g'ri "bor" degan holatda bo'lim tepasida taklif
 * chiqadi, lekin u baribir qo'shimcha ma'lumot almashtirgichini boshqaradi.
 */
const hasAddInfo = (html?: string): boolean => !!html && /<u[\s>]/i.test(html)

/*
 * Panel belgilari shu faylda — `CopyIcon` va `LockGlyph` ham shu yo'lda
 * yozilgan. `img/icons` dagi tayyorlari to'g'ri kelmadi: `InfoIcon` va
 * `DropDownIcon` props umuman qabul qilmaydi, ya'ni holatga qarab
 * o'zgara olmaydi.
 *
 * Yoqilgan holat `filled` orqali SHAKLNI o'zgartiradi, faqat rangni emas —
 * rangning o'zi yetarli emas (WCAG 1.4.1).
 */
const InfoToggleIcon = ({ filled }: { filled: boolean }) => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    {/* Ustki varaq: o'chiq holatda konturli, yoqilganda to'ldiriladi. */}
    <path
      d='M12 3.2 3.6 7.6 12 12l8.4-4.4L12 3.2Z'
      fill={filled ? 'currentColor' : 'none'}
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinejoin='round'
    />
    <path
      d='M3.6 12.2 12 16.6l8.4-4.4'
      stroke='currentColor'
      strokeWidth={filled ? 2.4 : 1.6}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    {/*
      Uchinchi qatlam faqat yoqilganda — "matnga yana bir qatlam ma'lumot
      qo'shildi". Shakl o'zgarishi rangdan mustaqil signal beradi
      (WCAG 1.4.1), shuning uchun tugmaning foni ham, ostki chizig'i ham
      kerak emas.
    */}
    {filled && (
      <path
        d='M3.6 16.4 12 20.8l8.4-4.4'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.45'
      />
    )}
  </svg>
)

/*
 * Yoyish/yig'ish — almashtirgich emas, buyruq: "hozir hammasini och" yoki
 * "hozir hammasini yop". Shuning uchun belgi ham, nomi ham holatga qarab
 * almashadi, `aria-pressed` esa yo'q — u bo'lganda ekran o'quvchisi
 * "Matnni berkitish, bosilgan" degan qarama-qarshi gapni aytardi.
 */
const ToggleAllIcon = ({ open }: { open: boolean }) => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d={open ? 'M8 8.6 12 4.6l4 4' : 'M8 4.6 12 8.6l4-4'}
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path d='M4 12h16' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' opacity='0.5' />
    <path
      d={open ? 'M8 15.4 12 19.4l4-4' : 'M8 19.4 12 15.4l4 4'}
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const ArrowUpIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M12 19V5M5 12l7-7 7 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

export const LibraryDetail = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useDispatch()
  const handleApiError = useApiErrorHandler()
  const { userPermissions } = useContext(AuthContext)
  const { chapters, showAddInfo, lang, fontSize } = useSelector((state: RootState) => state.html)

  /*
   * Qo'shimcha ma'lumot — `info` ruxsatiga bog'liq. Backend uni sinov
   * muddatida va Premium tarifda beradi, oddiy tarifda esa bermaydi
   * (PermissionController). Ilgari bu faqat serverda hisoblanardi, interfeys
   * esa hammaga bir xil almashtirgich ko'rsatardi.
   */
  const canSeeAddInfo = !!userPermissions?.some((item: string) => item === 'info')

  /*
   * Ruxsat yo'q bo'lsa — bloklar o'rniga taklif ko'rsatiladi. Yorliqlar shu
   * yerda tayyorlanadi: `prepare-html` i18n'ga bog'lanmasin.
   * `Upgrade` kaliti lug'atda allaqachon bor ("Premiumga o'tish").
   */
  const lockLabels = useMemo(
    () =>
      canSeeAddInfo
        ? undefined
        : {
            title: t('Additional Information'),
            note: t('Available in Premium'),
            cta: t('Upgrade'),
            more: t('More hidden items')
          },
    [canSeeAddInfo, t]
  )

  const goToTariffs = useCallback(() => navigate('/account?type=tariffs'), [navigate])

  const [openFeedback, setOpenFeedback] = useState(false)
  const [chapterId, setChapterId] = useState(0)
  const [searchParams] = useSearchParams()
  const [progress, setProgress] = useState(0)
  /**
   * Ochilgan bo'limlar. Bo'lim matni faqat birinchi marta ochilgandan keyin
   * render qilinadi — ilgari hamma bo'lim HTML'i darhol parse qilinib DOM'ga
   * qo'yilardi va faqat CSS bilan yashirilardi, bu uzun maqolada birinchi
   * ochilishni sezilarli sekinlashtirardi.
   */
  const openedOnce = useRef<Set<number>>(new Set())

  const { data, isLoading } = useQuery(
    ['article', id],
    async () => {
      const response: any = await request({ url: `dashboard/user/articles/${id}`, method: 'GET' })
      return response.data
    },
    { onError: handleApiError, enabled: !!id }
  )

  /*
   * Bosh sahifadagi "Davom ettirish" bloki shu tarixdan o'qiydi.
   * Havolalar `/article/<slug>` ko'rinishida, ya'ni URL'dagi `id` — slug.
   */
  useEffect(() => {
    const name = data?.data?.name
    if (id && name) rememberArticle({ slug: id, name })
  }, [id, data])

  // Sahifadan chiqilganda chap mundarija eski maqolaniki bo'lib qolmasin.
  useEffect(() => {
    return () => {
      dispatch(setChapters([]))
    }
  }, [dispatch])

  // Bo'limlarni Redux'ga ko'chiramiz (chap mundarija ham shu manbadan o'qiydi).
  // Ilgari bu GetContainer'ning onSuccess'ida `articleSlug !== id` tekshiruvi
  // bilan qilinardi — endi so'rov kaliti o'zgarishi o'zi yetarli.
  useEffect(() => {
    const loaded = data?.data?.chapters
    if (!loaded) {
      return
    }
    dispatch(setChapters(loaded))

    const requested = Number(searchParams.get('chapter_id'))
    if (requested) {
      openedOnce.current.add(requested)
      dispatch(openChapter(requested))
    }
  }, [data, dispatch, searchParams])

  const handleToggleChapter = useCallback(
    (index: number, targetId: number) => {
      openedOnce.current.add(targetId)
      dispatch(toggleChapter(index))
    },
    [dispatch]
  )

  const copyChapterLink = useCallback(
    (targetId: number) => {
      const url = `${window.location.origin}${window.location.pathname}?chapter_id=${targetId}`
      navigator.clipboard
        ?.writeText(url)
        .then(() => toast.custom(tr => <Success text={t('Link copied')} onClose={() => toast.dismiss(tr.id)} />))
        .catch(() => {})
    },
    [t]
  )

  // O'qish progressi — sticky panel ostidagi ingichka chiziq.
  useEffect(() => {
    const container = document.getElementById(SCROLL_CONTAINER_ID)
    if (!container) {
      return
    }

    const onScroll = () => {
      const max = container.scrollHeight - container.clientHeight
      setProgress(max > 0 ? Math.min(100, (container.scrollTop / max) * 100) : 0)
    }

    onScroll()
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [chapters])

  const scrollToTop = useCallback(() => {
    document.getElementById(SCROLL_CONTAINER_ID)?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const allOpen = useMemo(() => !chapters?.some(el => !el.isOpen), [chapters])

  const article = data?.data

  return (
    <LibraryLayout>
      {/*
        Shrift shkalasi butun maqolaga tarqaladi. Ilgari `fontSize` faqat
        `WithHtml` ichidagi matnga berilardi — maqola sarlavhasi va bo'lim
        sarlavhalari React tomonidan shu idishdan tashqarida chiziladi va
        "Tt" tugmalariga umuman javob bermasdi.
      */}
      <div className='library' style={{ '--reader-fs': `${fontSize}px` } as React.CSSProperties}>
        <div className='library-head'>
          <h1 className='library__title section-title'>{article?.name?.[lang]}</h1>
          {/*
            O'qish asboblari — yassi belgi qatori (AMBOSS referensi bo'yicha).
            Yozuvlar olib tashlandi: to'rtta yorliqli tugma qatorning yarmini
            yeb, uzun maqola nomini ikkinchi qatorga tushirardi.

            Hech narsa menyu ostiga yashirilmadi. "Qo'shimcha ma'lumot" va
            "Matnni yoyish" — o'qish paytida qayta-qayta bosiladigan
            boshqaruvlar; menyuga solinsa har almashtirish ikki bosishga
            aylanardi va ochilgan menyu aynan tekshirilayotgan matnni yopib
            qo'yardi. Ustiga, "Qo'shimcha ma'lumot" localStorage'da saqlanadi —
            yopiq menyu uning o'tgan safardan beri yoqiq ekanini ayta olmaydi,
            ochiq qator esa aytib turadi.

            Yozuv yo'qolgani uchun har tugmada `data-tip` bor: u CSS
            oynachasini chizadi va — brauzerning `title` idan farqli o'laroq —
            Tab bilan fokus kelganda ham chiqadi.
          */}
          <div className='library-head__wrap reader-tools' role='group' aria-label={t('Reading tools', "O'qish asboblari")}>
            {/*
              Mini test. Ilgari bu sarlavha ostida alohida qatorda, 11rem
              enli kulrang tugma bo'lib turardi va ostidan yana 2rem bo'shliq
              yerdi — maqola matni shuncha pastga surilardi. Endi u shu
              qatorda.

              Yozuvi ataylab qoldirildi: qatordagi qolganlari o'qish
              sozlamalari, bu esa sahifadan chiqib ketadigan harakat. Yalang'och
              "▶" belgisi nimani ochishini aytmasdi — shrift tugmalarida
              aynan shu xato qilingan edi.
            */}
            {!!article?.blocks?.length && (
              <div className='reader-tools__group'>
                <button
                  type='button'
                  className='reader-tools__quiz'
                  onClick={() => navigate(`/detail/article/${article?.slug}/${article?.blocks?.[0]?.id}`)}
                >
                  <Play width={'0.85rem'} height={'0.85rem'} />
                  <span>{t('Qbank mini test')}</span>
                </button>
              </div>
            )}

            {/*
              Guruh maqola kelgandagina chiziladi. Bo'sh <div> qoldirilsa,
              ajratgich (`group + group` ning chap chegarasi) yuklanish paytida
              hech narsaga tegib turmagan yetim chiziq bo'lib ko'rinardi.
            */}
            {!!article?.id && (
              <div className='reader-tools__group'>
                {/* Maqolani "Saqlanganlar"ga qo'shish. */}
                <SaveButton inline type='article' id={article.id} saved={article.is_saved} />
              </div>
            )}
            {/*
              Maqola tili. Hozircha bitta variant, shuning uchun bosiladigan
              tugma emas — ko'rsatkich: qaysi tilda o'qiyotganingiz ko'rinib
              tursin. Ikkinchi til qo'shilganda `setLang` bilan tanlagichga
              aylantiriladi.
            */}
            <div className='reader-tools__group'>
              <span className='reader-tools__lang' title={t('Language')}>
                <img src={uz} alt='' />
                {lang.toUpperCase()}
              </span>
            </div>
            <div className='reader-tools__group'>
              {/*
                Ruxsat bo'lmaganda almashtirgich o'rniga qulf: bosilsa tariflarga
                olib boradi. Ilgari bu tugma hammaga ko'rinardi va bosilganda
                hech narsa ochilmasdi — sabab ko'rsatilmasdi.
              */}
              {canSeeAddInfo ? (
                <button
                  type='button'
                  className='reader-tools__btn'
                  aria-pressed={showAddInfo}
                  aria-label={t('Additional Information')}
                  data-tip={t('Additional Information')}
                  onClick={() => dispatch(toggleAddInfo())}
                >
                  <InfoToggleIcon filled={showAddInfo} />
                </button>
              ) : (
                <button
                  type='button'
                  className='reader-tools__btn reader-tools__btn--locked'
                  aria-label={`${t('Additional Information')} — ${t('Available in Premium')}`}
                  data-tip={t('Available in Premium')}
                  onClick={goToTariffs}
                >
                  <LockGlyph />
                </button>
              )}

              <button
                type='button'
                className='reader-tools__btn'
                aria-label={allOpen ? t('Close text') : t('Open text')}
                data-tip={allOpen ? t('Close text') : t('Open text')}
                onClick={() => dispatch(toggleAllChapter(!allOpen))}
              >
                <ToggleAllIcon open={allOpen} />
              </button>
            </div>

            {/*
              Shrift shkalasi. Ilgari bu ikkita yalang'och <svg onClick> edi:
              Tab bilan fokus olmasdi, Enter/Space bilan ishlamasdi va 10/30
              chegarasida jimgina hech nima qilmasdi. Endi haqiqiy tugmalar.

              Ilgari bu yerda yalang'och "A" va "AA" turardi (AMBOSS
              referensidagidek). Amalda ular boshqaruvga emas, oddiy matnga
              o'xshardi va odam shrift tugmasini umuman topa olmadi. Endi
              harf yonida ishora bor: "A−" kichraytiradi, "A+" kattalashtiradi
              — nima qilishi bir qarashda ko'rinadi.

              Chegarada `disabled` emas, `aria-disabled`: `disabled` element
              fokusni <body> ga uchiradi va keyingi Tab sahifa boshidan
              boshlanardi — uzun maqolada bu joyni yo'qotish demak.
            */}
            <div className='reader-tools__group reader-tools__group--font'>
              <button
                type='button'
                className='reader-tools__btn reader-tools__btn--text'
                aria-disabled={fontSize <= FONT_MIN}
                aria-label={t('Decrease text size', 'Shriftni kichraytirish')}
                data-tip={t('Decrease text size', 'Shriftni kichraytirish')}
                onClick={() => {
                  if (fontSize <= FONT_MIN) return
                  dispatch(decrement())
                }}
              >
                A<i aria-hidden='true'>−</i>
              </button>

              <button
                type='button'
                className='reader-tools__btn reader-tools__btn--text reader-tools__btn--lg'
                aria-disabled={fontSize >= FONT_MAX}
                aria-label={t('Increase text size', 'Shriftni kattalashtirish')}
                data-tip={t('Increase text size', 'Shriftni kattalashtirish')}
                onClick={() => {
                  if (fontSize >= FONT_MAX) return
                  dispatch(increment())
                }}
              >
                A<i aria-hidden='true'>+</i>
              </button>
            </div>

            {/*
              Shrift o'zgargani ekran o'quvchisiga ham eshitilsin — tugmalarda
              ko'rinadigan qiymat yo'q, mobil varaqdagi <input type='range'>
              esa o'z qiymatini o'zi aytadi.
            */}
            <span className='reader-tools__live' aria-live='polite'>
              {`${t('Text size', "Matn o'lchami")}: ${fontSize}px`}
            </span>
          </div>

          {/* O'qish progressi — panelning pastki chekkasida. */}
          <div className='reading-progress' aria-hidden='true'>
            <div className='reading-progress__bar' style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className='library-accordion'>
          {!isLoading &&
            chapters?.map((chapter: any, index: number) => {
              const isActive = !!chapter.isOpen
              const shouldRender = isActive || openedOnce.current.has(chapter.id)
              const chapterHasAddInfo = hasAddInfo(chapter?.description?.[lang])

              return (
                <div id={chapter?.id} className={`library-accordion__item ${isActive ? 'active' : ''}`} key={chapter.id}>
                  {/*
                    Ilgari bu <div onClick> edi: Tab bilan fokus olmasdi va
                    Enter/Space bilan ochilmasdi.
                  */}
                  <button
                    type='button'
                    className='library-accordion__head'
                    aria-expanded={isActive}
                    onClick={() => handleToggleChapter(index, chapter.id)}
                  >
                    <span>{chapter.title?.[lang]}</span>
                    {/*
                      Yopiq bo'limda ham ko'rinadigan belgi: qaysi bo'limda
                      premium ma'lumot borligini bilish uchun har birini
                      ochib chiqishga to'g'ri kelmasin.

                      Ataylab <span>: sarlavhaning o'zi <button>, ichiga
                      ikkinchi tugma qo'yib bo'lmaydi. Bosilganda bo'lim
                      ochiladi.
                    */}
                    {chapterHasAddInfo && (
                      <span
                        className='section-premium__badge'
                        title={t('This section contains premium information', "Ushbu bo'limda premium ma'lumot mavjud")}
                      >
                        <LockGlyph />
                        <b>Premium</b>
                      </span>
                    )}
                    <DropDownIcon />
                  </button>

                  <div className='library-accordion__content'>
                    {/*
                      Bo'lim ichidagi keng lenta olib tashlandi: matn ustida
                      to'ldirilgan blok bo'lib turardi va o'qishga xalaqit
                      berardi. Premium borligi sarlavhadagi belgidan
                      ko'rinadi, qulflangan bandlar esa matn ichida o'z
                      o'rnida taklif bilan almashtiriladi (`prepare-html`).
                    */}
                    {shouldRender && (
                      <WithTooltip
                        html={chapter?.description?.[lang]}
                        lockLabels={lockLabels}
                        onLockClick={goToTariffs}
                      />
                    )}

                    <div className='chapter-actions'>
                      <button
                        type='button'
                        className='chapter-actions__btn'
                        onClick={() => copyChapterLink(chapter.id)}
                        title={t('Copy link to this section')}
                      >
                        <CopyIcon />
                        <span>{t('Copy link')}</span>
                      </button>

                      <button
                        type='button'
                        className='chapter-actions__btn'
                        onClick={() => {
                          setOpenFeedback(true)
                          setChapterId(chapter?.id)
                        }}
                      >
                        <MarkerIcon width={'1rem'} height={'1rem'} />
                        <span>{t('Feedback')}</span>
                      </button>

                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Uzun maqolada tepaga qaytish. */}
        {progress > 5 && (
          <button type='button' className='scroll-top' onClick={scrollToTop} title={t('Back to top')}>
            <ArrowUpIcon />
          </button>
        )}

        <FeedbackModal
          type='chapter'
          article_slug={id}
          chapter_id={chapterId}
          zIndex={100}
          isVisible={openFeedback}
          hide={() => {
            setOpenFeedback(false)
          }}
        />
      </div>
    </LibraryLayout>
  )
}
