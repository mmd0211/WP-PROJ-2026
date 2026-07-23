import { describe, expect, it } from 'vitest';
import {
  canAccessEarlyRelease,
  canChangeAvatar,
  canCreatePlaylist,
  canDownloadTrack,
  canStream,
  canUseArtistStudio,
  canViewPremiumStats,
  getPlaylistLimit,
  isAdmin,
  isBackoffice,
} from '../utils/permissions';

describe('subscription and role permissions', () => {
  it('limits basic accounts to 6 playlists', () => {
    expect(getPlaylistLimit('basic')).toBe(6);
    expect(canCreatePlaylist('basic', 5)).toBe(true);
    expect(canCreatePlaylist('basic', 6)).toBe(false);
  });

  it('limits silver accounts to 100 playlists', () => {
    expect(getPlaylistLimit('silver')).toBe(100);
    expect(canCreatePlaylist('silver', 99)).toBe(true);
    expect(canCreatePlaylist('silver', 100)).toBe(false);
  });

  it('gives gold accounts unlimited playlists', () => {
    expect(getPlaylistLimit('gold')).toBe(Infinity);
    expect(canCreatePlaylist('gold', 10000)).toBe(true);
  });

  it('blocks avatar changes for basic accounts', () => {
    expect(canChangeAvatar('basic')).toBe(false);
    expect(canChangeAvatar('silver')).toBe(true);
  });

  it('allows download only for silver and gold', () => {
    expect(canDownloadTrack('basic')).toBe(false);
    expect(canDownloadTrack('silver')).toBe(true);
    expect(canDownloadTrack('gold')).toBe(true);
  });

  it('allows early releases only for gold', () => {
    expect(canAccessEarlyRelease('basic')).toBe(false);
    expect(canAccessEarlyRelease('silver')).toBe(false);
    expect(canAccessEarlyRelease('gold')).toBe(true);
  });

  it('shows listener/stream stats only to gold', () => {
    expect(canViewPremiumStats('silver')).toBe(false);
    expect(canViewPremiumStats('gold')).toBe(true);
  });

  it('enforces the 60-stream daily basic limit', () => {
    expect(canStream('basic', 59)).toBe(true);
    expect(canStream('basic', 60)).toBe(false);
    expect(canStream('silver', 1000)).toBe(true);
  });

  it('recognizes backoffice roles correctly', () => {
    expect(isBackoffice('support')).toBe(true);
    expect(isBackoffice('admin')).toBe(true);
    expect(isBackoffice('artist')).toBe(false);
    expect(isAdmin('support')).toBe(false);
    expect(isAdmin('admin')).toBe(true);
  });

  it('opens artist studio only for approved artists', () => {
    expect(canUseArtistStudio({ role: 'artist', status: 'approved' })).toBe(true);
    expect(canUseArtistStudio({ role: 'artist', status: 'pending' })).toBe(false);
    expect(canUseArtistStudio({ role: 'listener', status: 'approved' })).toBe(false);
  });
});
