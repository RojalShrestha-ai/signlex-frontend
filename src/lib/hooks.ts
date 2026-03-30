import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboardStatsApi, getUserProfileApi, updateUserProfileApi } from '@/api/dashboard'
import { awardXPApi, dailyCheckinApi, getAvailableBadgesApi } from '@/api/gamification'
import { getGlobalRankingsApi, getWeeklyRankingsApi, getMonthlyRankingsApi, getMyRankApi } from '@/api/leaderboard'
import { recordSessionApi, recordAttemptApi } from '@/api/progress'
import { getRecentActivityApi } from '@/api/analytics'
import { getAllLessonProgressApi, completeLessonApi, updateLessonProgressApi } from '@/api/lessons'
import { getDueCardsApi, submitReviewApi, getNewCardsApi, getFlashcardStatsApi } from '@/api/flashcards'
import { useAuth } from '@/lib/providers'

export function useDashboardStats() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStatsApi,
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

export function useUserProfile() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfileApi,
    enabled: isAuthenticated,
  })
}

export function useAvailableBadges() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['available-badges'],
    queryFn: getAvailableBadgesApi,
    enabled: isAuthenticated,
  })
}

export function useLeaderboard(period: 'global' | 'weekly' | 'monthly', limit = 20) {
  const apiFn = period === 'weekly' ? getWeeklyRankingsApi : period === 'monthly' ? getMonthlyRankingsApi : getGlobalRankingsApi
  return useQuery({
    queryKey: ['leaderboard', period, limit],
    queryFn: () => apiFn(limit),
    staleTime: 60_000,
  })
}

export function useMyRank() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['my-rank'],
    queryFn: getMyRankApi,
    enabled: isAuthenticated,
  })
}

export function useRecentActivity() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: getRecentActivityApi,
    enabled: isAuthenticated,
  })
}

export function useAwardXP() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: awardXPApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['my-rank'] })
    },
  })
}

export function useDailyCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dailyCheckinApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useRecordSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recordSessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] })
    },
  })
}

export function useRecordAttempt() {
  return useMutation({
    mutationFn: recordAttemptApi,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
  })
}

export function useLessonProgress() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['lesson-progress'],
    queryFn: getAllLessonProgressApi,
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: completeLessonApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] })
    },
  })
}

export function useUpdateLessonProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateLessonProgressApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] })
    },
  })
}

export function useDueCards(limit = 20) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['due-cards', limit],
    queryFn: () => getDueCardsApi(limit),
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

export function useNewCards(limit = 5) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['new-cards', limit],
    queryFn: () => getNewCardsApi(limit),
    enabled: isAuthenticated,
  })
}

export function useFlashcardStats() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['flashcard-stats'],
    queryFn: getFlashcardStatsApi,
    enabled: isAuthenticated,
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['due-cards'] })
      queryClient.invalidateQueries({ queryKey: ['new-cards'] })
      queryClient.invalidateQueries({ queryKey: ['flashcard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
