import StatsLayout from '../../layouts/stats-layout'
import clock from '../../img/icons/clock.svg'
import check from '../../img/icons/check-grey.svg'
import alarm from '../../img/icons/alarm.svg'
import GetContainer from '../../components/get-container'
import { useNavigate, useParams } from 'react-router-dom'
import Chart from 'react-apexcharts'
import StatsModal from '../../components/stats-modal'
import { useState } from 'react'
import { MainLayout } from '../../layouts/main'
import { useTranslation } from 'react-i18next'

export const Stats = () => {
  const { i18n, t } = useTranslation()
  const { test_id, type, studySlug } = useParams()
  const [openModal, setOpenModal] = useState(false)
  const navigate = useNavigate()

  const options = {
    fill: {
      type: 'gradient',
      colors: ['#f70776', '#50A547', '#D21C01', '#FF9220']
    },
    // plotOptions: {
    //   pie: {
    //     startAngle: -90,
    //     endAngle: 270,
    //     color: 'transparent',
    //     size: 0
    //   }
    // },
    colors: ['#f70776', '#50A547', '#D21C01', '#FF9220'],

    legend: {
      formatter: function (val: any, opts: any) {
        return val + ' - ' + opts.w.globals.series[opts.seriesIndex]
      },
      show: false
    },
    dataLabels: {
      enabled: false
    },
    // title: {
    //   //   text: 'G radient Donut with custom Start-angle',
    //   show: false
    // },
    labels: [t('Not processed'), t("That's agree"), t("Incorrect"), t('Help used')]
  }

  //   const series = [1, 2, 3]

  return (
    <StatsLayout>
      <GetContainer url={`/dashboard/user/user_test_attempt/${test_id}/statistics`}>
        {({ data }: any) => (
          <section className='stats'>
            <h1 className='stats__title section-title'>{t('Questions related to endocrinology')}</h1>
            <div className='stats-content'>
              <div className='stats-head'>
                <div className='stats-head__item'>
                  <div className='stats-head__value'>
                    {data?.data?.block_id?.solved}/{data?.data?.question_count}
                  </div>
                  <div className='stats-head__name'>
                    <img src={clock} alt='ico' />
                    <span>{t('Complete question')}</span>
                  </div>
                </div>
                <div className='stats-head__item'>
                  <div className='stats-head__value'>
                    {((data?.data?.right_answer + data?.data?.help_answer) / data?.data?.question_count) * 100}%
                  </div>
                  <div className='stats-head__name'>
                    <img src={check} alt='ico' />
                    <span>{t('Correct answers')}</span>
                  </div>
                </div>
                <div className='stats-head__item'>
                  <div className='stats-head__value'>
                    {Math.floor(data?.data?.time / 3600)} {t('s')} {Math.floor(data?.data?.time / 60)} {t('min')}{' '}
                    {Math.floor(data?.data?.time % 60)} {t('sec')}
                  </div>
                  <div className='stats-head__name'>
                    <img src={alarm} alt='ico' />
                    <span>{t("Total Time")}</span>
                  </div>
                </div>
              </div>
              <div className='stats-main'>
                <div className='stats-main__title'>{t('Qbank session statistics')}</div>
                <div className='stats-main__wrap'>
                  <div
                    className='stats-circle'
                    style={{
                      position: 'relative'
                    }}
                  >
                    <div className='stats-percent'>
                      <h3>
                        {((data?.data?.right_answer + data?.data?.help_answer) / data?.data?.question_count) * 100}%
                      </h3>
                      <p>{t('Worked')}</p>
                    </div>
                    {data?.data && (
                      <Chart
                        options={{
                          ...options
                          //   plotOptions: {
                          //     pie: {
                          //       donut: {
                          //         labels: {
                          //           show: true,
                          //           total: {
                          //             show: true,
                          //             label: 'Ishlangan',
                          //             fontSize: '1rem',
                          //             color: 'black'
                          //           }
                          //         }
                          //       }
                          //     }
                          //   }
                        }}
                        series={[
                          data?.data?.no_answer,
                          data?.data?.right_answer,
                          data?.data?.wrong_answer,
                          data?.data?.help_answer
                        ]}
                        type='donut'
                        width={'100%'}
                      />
                    )}
                  </div>
                  <div className='stats-info'>
                    <div className='stats-info__title'>{data?.data?.block_id?.name?.[i18n.language]}</div>
                    <div className='stats-info__item'>
                      <div className='stats-info__color' style={{ background: '#399A48' }}></div>
                      <div className='stats-info__text'>
                        {(data?.data?.right_answer / data?.data?.question_count) * 100}% {t('Correct answers')}
                        <span>({data?.data?.right_answer} {t('question')})</span>
                      </div>
                    </div>
                    <div className='stats-info__item'>
                      <div className='stats-info__color' style={{ background: '#EA5455' }}></div>
                      <div className='stats-info__text'>
                        {(data?.data?.wrong_answer / data?.data?.question_count) * 100}% {t('Incorrect answers')}
                        <span>({data?.data?.wrong_answer} {t('question')})</span>
                      </div>
                    </div>
                    <div className='stats-info__item'>
                      <div className='stats-info__color' style={{ background: '#FF9F43' }}></div>
                      <div className='stats-info__text'>
                        {(data?.data?.help_answer / data?.data?.question_count) * 100}% {t('Answers that have been taken help')}
                        <span>({data?.data?.help_answer} {t('question')})</span>
                      </div>
                    </div>
                    <div className='stats-info__btns'>
                      <button className='btn-white' onClick={() => setOpenModal(true)}>
                        {t('Session recovery')}
                      </button>
                      <button
                        className='btn'
                        onClick={() => navigate(`/detail/${type}/${studySlug}/${test_id}`, { replace: true })}
                      >
                        {t('Resuming the session')}
                      </button>
                      <button className='btn' onClick={() => navigate(-1)}>
                        {t('Session exist')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {data?.data && <StatsModal isVisible={openModal} hide={() => setOpenModal(false)} stats={data?.data} />}{' '}
          </section>
        )}
      </GetContainer>
    </StatsLayout>
  )
}
