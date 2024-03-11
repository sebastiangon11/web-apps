'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { PlusIcon, TrashCanIcon } from '@web-apps/ui'

import { useAccounts } from '@/hooks/accounts'
import '@/hooks/snapshots'

import { TranslucentCard } from '@/components/translucent-card'

import EmptyStateImg from '../../../../public/empty-state.png'

export default function AccountsPage() {
  const { accounts, error, isLoading, totalBalance, deleteAccount } = useAccounts()

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const handleDeleteAccountIntent = async (id: string) => {
    const account = accounts.find((account) => account.id === id)

    if (!account) return

    const confirmIntent = window.confirm(`Are you sure you want to delete ${account.name} account?`)

    if (!confirmIntent) return

    try {
      await deleteAccount(id)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (error) return <p>{error.message}</p>

  if (accounts.length === 0) {
    return (
      <div className="px-4 lg:px-0 mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-y-2 pb-2 px-2 text-content-secondary">
          <Image src={EmptyStateImg} alt="Empty state" height={100} />
          <p className="text-center">You don&apos;t have any accounts yet.</p>
          <p className="text-center text-sm">
            <Link className="underline" href="/accounts/new">
              Create a new one
            </Link>{' '}
            to start tracking your savings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-0 mx-auto max-w-2xl">
      <p className="text-center mt-4">
        <span className="block text-xl">Total balance</span>
        <span className="block text-5xl font-medium">€ {totalBalance}</span>
      </p>
      <div className="flex justify-between items-center mt-8 mb-4">
        <h1 className="text-md">Accounts</h1>
        <Link aria-label="Create new account" href="/accounts/new">
          <PlusIcon hoverable />
        </Link>
      </div>
      <div className="flex flex-col gap-y-2">
        {accounts.map((account) => (
          <TranslucentCard key={account.id} className={clsx('flex justify-between items-center cursor-pointer')}>
            <Link className="flex flex-1 items-center gap-x-4" href={`/accounts/${account.id}/snapshots`}>
              <p className="text-5xl">{account.image}</p>
              <div>
                <p className="text-xl">{account.name}</p>
                <p>€ {account.balance}</p>
              </div>
            </Link>
            <button aria-label={`Delete account ${account.name}`} onClick={() => handleDeleteAccountIntent(account.id)}>
              <TrashCanIcon hoverable className="text-content-tertiary" />
            </button>
          </TranslucentCard>
        ))}
      </div>
    </div>
  )
}