import { musicPlay } from './local-storage';
import { allowMusic } from './music';

/**
 *
 * @param audio { HTMLAudioElement } 음악 소스가 담긴 audio 객체
 * 소리 끄기 / 켜기 기능.
 * audio에 해당 페이지 음악 소스 넣으시면 됩니다.
 */
export function toggleSound(audio: HTMLAudioElement) {
  const soundState: string | null = musicPlay();
  if (soundState === 'true') {
    localStorage.setItem('musicPlay', 'false');
    audio.currentTime = 0;
  } else {
    localStorage.setItem('musicPlay', 'true');
  }
  allowMusic(audio, true);
}
