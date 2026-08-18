import { Box, Paper, Tab, Tabs } from '@mui/material'
import { useEffect } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import RateReviewIcon from '@mui/icons-material/RateReview'
import MessagesTo from '../messages-to'
import MessagesFrom from '../messages-from'
import Vacancy from '../vacancy'
import Feedback from '../feedback'
import { useSearchParams } from 'react-router-dom'

const TABS = [
  { value: 'messages_to', label: 'Foydalanuvchilarga xabar', icon: <PersonIcon /> },
  { value: 'messages_from', label: 'Foydalanuvchilardan xabar', icon: <MailOutlineIcon /> },
  { value: 'vacancies', label: 'Vakansiyalar', icon: <WorkOutlineIcon /> },
  { value: 'feedback', label: 'Fikr-mulohazalar', icon: <RateReviewIcon /> }
]

function Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type')
  const isKnownTab = TABS.some(tab => tab.value === type)

  // /messages manzili ?type=... siz ochilsa butun sahifa bo'sh ko'rinardi.
  useEffect(() => {
    if (!isKnownTab) setSearchParams({ type: 'messages_to' }, { replace: true })
  }, [isKnownTab, setSearchParams])

  const active = isKnownTab ? (type as string) : 'messages_to'

  return (
    <Box>
      <Paper elevation={0} sx={{ border: '1px solid rgba(18,27,45,.08)', mb: 3 }}>
        <Tabs
          value={active}
          onChange={(_, value) => setSearchParams({ type: value })}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
        >
          {TABS.map(tab => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} iconPosition='start' label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      <Box>
        {active === 'messages_to' && <MessagesTo />}
        {active === 'messages_from' && <MessagesFrom />}
        {active === 'vacancies' && <Vacancy />}
        {active === 'feedback' && <Feedback />}
      </Box>
    </Box>
  )
}

export default Content
