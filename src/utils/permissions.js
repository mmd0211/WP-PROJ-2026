import { SUBSCRIPTIONS } from '../data/mock';

export const getSubscriptionPolicy = (subscription = 'basic') => SUBSCRIPTIONS[subscription] || SUBSCRIPTIONS.basic;
export const getPlaylistLimit = (subscription) => getSubscriptionPolicy(subscription).playlistLimit;
export const canCreatePlaylist = (subscription, currentCount) => currentCount < getPlaylistLimit(subscription);
export const canChangeAvatar = (subscription) => getSubscriptionPolicy(subscription).canAvatar;
export const canDownloadTrack = (subscription) => getSubscriptionPolicy(subscription).canDownload;
export const canViewPremiumStats = (subscription) => getSubscriptionPolicy(subscription).stats;
export const canAccessEarlyRelease = (subscription) => getSubscriptionPolicy(subscription).earlyAccess;
export const canStream = (subscription, streamsToday) => streamsToday < getSubscriptionPolicy(subscription).dailyStreamLimit;
export const isBackoffice = (role) => role === 'support' || role === 'admin';
export const isAdmin = (role) => role === 'admin';
export const canUseArtistStudio = (user) => user?.role === 'artist' && user?.status === 'approved';
export const subscriptionLabel = (subscription) => getSubscriptionPolicy(subscription).label;
