import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import SettingsIcon from '@mui/icons-material/Settings'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import DescriptionIcon from '@mui/icons-material/Description'
import CommentIcon from '@mui/icons-material/Comment'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import BarChartIcon from '@mui/icons-material/BarChart'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Biotech, CastForEducation, FolderSpecial, Newspaper, VideoSettings } from '@mui/icons-material'
export const navData = [
  {
    id: 0,
    icon: <HomeIcon />,
    text: 'Home',
    link: '/'
  },
  {
    id: 1,
    icon: <PeopleAltIcon />,
    text: 'Users',
    link: '/users'
  },
  {
    id: 2,
    icon: <LibraryBooksIcon />,
    text: 'Category',
    link: '/category'
  },
  {
    id: 3,
    icon: <DescriptionIcon />,
    text: 'Articles',
    link: '/articles'
  },
  {
    id: 4,
    icon: <CommentIcon />,
    text: 'Comments',
    link: '/comments'
  },
  {
    id: 5,
    icon: <PermMediaIcon />,
    text: 'Images',
    link: '/images'
  },
  {
    id: 15,
    icon: <LibraryBooksIcon />,
    text: 'Video category',
    link: '/video-category'
  },
  {
    id: 16,
    icon: <VideoSettings />,
    text: 'Videos',
    link: '/videos'
  },
  {
    id: 17,
    icon: <FolderSpecial />,
    text: 'Question Folders',
    link: '/question-folder'
  },
  //   {
  //     id: 18,
  //     icon: <QuestionMarkSharp />,
  //     text: 'Questions',
  //     link: '/questions'
  //   },
  {
    id: 19,
    icon: <CastForEducation />,
    text: 'Study Plan Folders',
    link: '/study-plans'
  },
  {
    id: 20,
    icon: <CastForEducation />,
    text: 'Study Plan',
    link: '/study-plan'
  },
  {
    id: 21,
    icon: <CastForEducation />,
    text: 'Quizzes Category',
    link: '/quizzes-category'
  },
  {
    id: 21,
    icon: <CastForEducation />,
    text: 'Quizzes',
    link: '/quizzes'
  },

  {
    id: 21,
    icon: <Newspaper />,
    text: 'News',
    link: '/news'
  },
  {
    id: 6,
    icon: <BarChartIcon />,
    text: 'Tariffs',
    link: '/tariffs'
  },
  {
    id: 6,
    icon: <Biotech />,
    text: 'Labs',
    link: '/labs'
  },
  //   {
  //     id: 6,
  //     icon: <Biotech />,
  //     text: 'Labs create',
  //     link: '/labs-create'
  //   },
  {
    id: 7,
    icon: <ForwardToInboxIcon />,
    text: 'Messages',
    link: '/messages?type=messages_to'
  },

  {
    id: 8,
    icon: <SettingsIcon />,
    text: 'Settings',
    link: '/settings',
    children: [
      {
        id: 9,
        text: 'Translations',
        link: '/translations'
      },
      {
        id: 10,
        text: 'Images',
        link: '/images'
      },

      {
        id: 11,
        text: 'Partners',
        link: '/partners'
      },
      {
        id: 12,
        text: 'Categories',
        link: '/categories'
      },
      {
        id: 13,
        text: 'Videos',
        link: '/videos'
      },
      {
        id: 14,
        text: 'Questions',
        link: '/questions'
      },
      {
        id: 14,
        text: 'Privacy policy',
        link: '/privacy-policy'
      }
    ]
  }
]
