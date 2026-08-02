import Logo from '../../img/Logo'
import { useState } from 'react'
import SendPhone from './components/SendPhone'
import CheckCode from './components/CheckCode'
import SetPassword from './components/SetPassword'

function ForgotPassword() {
  const [token, setToken] = useState('')
  const [code, setCode] = useState('')

  return (
    <section className='login'>
      <div className='login__logo'>
        <Logo />
      </div>
      {!token && <SendPhone setToken={setToken} />}
      {!!token && !code && <CheckCode setToken={setToken} token={token} setCode={setCode} />}
      {!!token && !!code && <SetPassword token={token} code={code} />}
    </section>
  )
}

export default ForgotPassword
