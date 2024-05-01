import Image from 'next/image'
import { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

import { Routes } from '@/routes'

import { ArrowRight } from '@web-apps/ui'

import { Button } from '@/components/button'
import { TransitionLink } from '@/components/transition-link'

import accountImg from '../../../public/landing/account.png'
import snapshotsImg from '../../../public/landing/snapshots.png'
import { BarChart } from './app/savings/components/bar-chart'

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 my-6 space-y-14">
      <h2 className="text-center">💸 Ever wondered how much you saved last month?</h2>

      <div className="text-center mx-auto sm:w-5/6 space-y-4">
        <p className="font-medium">
          <i>Or maybe last year?</i>
        </p>

        <p>My Finance let&apos;s you to effortlessly track your accounts and achieve your savings goals.</p>

        <p>
          In a few steps you can create and monitor <b>multiple accounts</b>, add <b>monthly statements</b>, and visualize your <b>progress</b> with
          insightful graphs.
        </p>
      </div>

      <div className="text-center">
        <Button as={TransitionLink} href={Routes.app.accounts.index} variant="fill" className="inline-block px-16 py-4 font-medium">
          Launch App
        </Button>
      </div>

      <div className="space-y-20">
        <ResponsiveContainer>
          <div className="space-y-4">
            <h2>⚙️ Set up your accounts</h2>
            <p>Add as many accounts as you need, from savings and checking to cash holdings.</p>
            <p>
              You can also customize your accounts with unique names and emojis to easily identify them. And know at avery moment all your balances at
              a glance.
            </p>
          </div>
          <Image priority src={accountImg} width={400} alt="Accounts" className="object-contain mx-auto max-w-full sm:max-w-xl" />
        </ResponsiveContainer>

        <ResponsiveContainer rowReverse>
          <div className="space-y-4">
            <h2>⏱️ Track your balances</h2>
            <p>
              Keep track of each account balance over time. Add monthly snapshots to see how your accounts are performing and make better financial
              decisions.
            </p>
          </div>
          <Image priority src={snapshotsImg} width={400} alt="Balances" className="object-contain mx-auto max-w-full sm:max-w-xl" />
        </ResponsiveContainer>

        <div className="space-y-10">
          <h2 className="text-center">🚀 Watch your savings blast off</h2>

          <div className="mx-auto sm:w-5/6 text-center">
            <p>
              Track how your savings progress over time and gain access to the tools you need to make better financial decisions and achieve your
              savings goals.
            </p>
          </div>

          <div>
            <div className="mx-auto max-h-72 aspect-video">
              <SampleSavingsChart />
            </div>
          </div>

          <div className="mx-auto sm:w-5/6 text-center">
            <p>Compare your accounts and see how they are performing over time, make better financial decisions and achieve your savings goals.</p>
          </div>

          <div>
            <div className="mx-auto max-h-72 aspect-video">
              <SampleBalancesChart />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button as={TransitionLink} href={Routes.app.accounts.index} variant="outline" className="inline-flex gap-x-3 px-8 py-4 font-medium">
          Get control of my finances
          <ArrowRight className="stroke-2"></ArrowRight>
        </Button>
      </div>
    </div>
  )
}

const ResponsiveContainer = ({
  className,
  rowReverse = false,
  colReverse = false,
  ...rest
}: ComponentPropsWithoutRef<'div'> & { rowReverse?: boolean; colReverse?: boolean }) => (
  <div
    className={twMerge(
      'flex flex-col sm:flex-row',
      colReverse && 'flex-col-reverse',
      rowReverse && 'sm:flex-row-reverse',
      'gap-x-8 gap-y-4',
      className,
    )}
    {...rest}
  />
)

const SampleSavingsChart = () => {
  const savingsByPeriod = new Map([
    ['Jan 23', 1000],
    ['Feb 23', -1000],
    ['Mar 23', 300],
    ['Apr 23', 2500],
    ['May 23', -500],
    ['Jun 23', 1000],
    ['Jul 23', 900],
    ['Ago 23', 600],
    ['Sep 23', 960],
    ['Oct 23', 1000],
    ['Nov 23', -700],
    ['Dec 23', 200],
    ['Jan 24', 1500],
  ])

  const label = 'Savings'
  const data = Array.from(savingsByPeriod).map(([period, balance]) => ({ x: period, y: balance }))

  return <BarChart datasets={[{ label, data }]} />
}

const SampleBalancesChart = () => {
  const bankOfSpainSample = {
    label: 'Bank of Spain',
    data: [
      { x: 'Sep 23', y: 0 },
      { x: 'Oct 23', y: 0 },
      { x: 'Nov 23', y: 0 },
      { x: 'Dec 23', y: 0 },
      { x: 'Jan 24', y: 0 },
      { x: 'Feb 24', y: 7500 },
      { x: 'Mar 24', y: 9500 },
      { x: 'Apr 24', y: 10000 },
    ],
  }

  const santanderSample = {
    label: 'Santander',
    data: [
      { x: 'Sep 23', y: 5000 },
      { x: 'Oct 23', y: 7000 },
      { x: 'Nov 23', y: 11000 },
      { x: 'Dec 23', y: 10000 },
      { x: 'Jan 24', y: 8000 },
      { x: 'Feb 24', y: 9000 },
      { x: 'Mar 24', y: 10000 },
      { x: 'Apr 24', y: 10000 },
    ],
  }

  const cashSample = {
    label: 'Cash',
    data: [
      { x: 'Sep 23', y: 0 },
      { x: 'Oct 23', y: 0 },
      { x: 'Nov 23', y: 3000 },
      { x: 'Dec 23', y: 2000 },
      { x: 'Jan 24', y: 3000 },
      { x: 'Feb 24', y: 4000 },
      { x: 'Mar 24', y: 5000 },
      { x: 'Apr 24', y: 5000 },
    ],
  }

  return <BarChart datasets={[bankOfSpainSample, santanderSample, cashSample]} />
}
