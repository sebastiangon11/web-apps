import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'

import { Snapshot } from '@/domain'

import { SnapshotsService } from '@/services'

import { useAuth } from '../auth'

const SNAPSHOTS_KEY = 'snapshots'

export const createUseSnapshots = (snapshotsService: SnapshotsService) => (accountIds: Array<Snapshot['id']>) => {
  const { mutate } = useSWRConfig()

  const { user, isLoading: isLoadingUser } = useAuth()

  const getSnapshots = useCallback(async () => {
    if (!user) throw new Error('You must be logged in to fetch accounts')
    return snapshotsService.getByAccounts(accountIds)
  }, [user, accountIds])

  const {
    data: snapshots,
    error,
    isLoading: isLoadingSnapshots,
  } = useSWR(user ? SNAPSHOTS_KEY : null, getSnapshots, {
    fallbackData: [],
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const isLoading = useMemo(() => isLoadingUser || isLoadingSnapshots, [isLoadingUser, isLoadingSnapshots])

  const createSnapshot = async (accountId: Snapshot['accountId'], balance: Snapshot['balance'], date: Snapshot['date']) => {
    const createAndRevalidateSnapshots = async () => {
      await snapshotsService.create({ accountId, balance, date })
      return getSnapshots()
    }

    return mutate(SNAPSHOTS_KEY, createAndRevalidateSnapshots)
  }

  const updateSnapshot = async (snapshot: Snapshot) => {
    const updateAndRevalidateSnapshots = async () => {
      await snapshotsService.update(snapshot)
      return getSnapshots()
    }

    return mutate(SNAPSHOTS_KEY, updateAndRevalidateSnapshots, {
      optimisticData: snapshots.map((snap) => (snap.id === snap.id ? snapshot : snap)),
      rollbackOnError: true,
    })
  }

  const deleteSnapshot = async (accountId: Snapshot['accountId'], snapshotId: Snapshot['id']) => {
    const deleteAndRevalidateSnapshots = async () => {
      await snapshotsService.delete(accountId, snapshotId)
      return getSnapshots()
    }

    return mutate(SNAPSHOTS_KEY, deleteAndRevalidateSnapshots, {
      optimisticData: snapshots.filter((snap) => snap.id !== snapshotId),
      rollbackOnError: true,
    })
  }

  return {
    snapshots,
    error,
    isLoading,
    createSnapshot: useCallback(createSnapshot, [mutate, getSnapshots]),
    updateSnapshot: useCallback(updateSnapshot, [mutate, snapshots, getSnapshots]),
    deleteSnapshot: useCallback(deleteSnapshot, [mutate, snapshots, getSnapshots]),
  }
}
