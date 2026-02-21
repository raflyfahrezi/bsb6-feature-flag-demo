import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StatsigClient } from '@statsig/js-client'
import { StatsigSessionReplayPlugin } from '@statsig/session-replay'
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics'
import { StatsigProvider } from '@statsig/react-bindings'
import './index.css'
import App from './App.tsx'

const myStatsigClient = new StatsigClient(
  'client-djWNkAObXDagV0ijEDzACaGTu5An1Vx645TgoxKrJs0',
  { userID: 'user-id' },
  {
    plugins: [new StatsigSessionReplayPlugin(), new StatsigAutoCapturePlugin()],
    environment: { tier: import.meta.env.PROD ? 'production' : 'development' },
  },
)

await myStatsigClient.initializeAsync()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsigProvider client={myStatsigClient}>
      <App />
    </StatsigProvider>
  </StrictMode>,
)
